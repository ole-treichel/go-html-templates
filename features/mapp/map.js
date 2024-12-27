import { absoluteUrl } from '/public/assets/main.js'

class Map extends HTMLElement {
  constructor() {
    super()

    this.handleMoveEnd = this.handleMoveEnd.bind(this)
    this.center = this.center.bind(this)
  }

  connectedCallback() {
    this.container = document.createElement('div')
    this.container.style.height = '100%'
    this.container.style.width = '100%'
    this.appendChild(this.container)

    const protocol = new window.pmtiles.Protocol()
    maplibregl.addProtocol("pmtiles", protocol.tile)
    this.map = new maplibregl.Map({
      container: this.container,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'vector',
            url: "pmtiles://https://s3.ole.md/gis/20241110.pmtiles",
            minzoom: 0,
            maxzoom: 14
          },
          places: {
            type: 'vector',
            tiles: [absoluteUrl('/places/mvt/{z}/{x}/{y}')],
            maxzoom: 14
          },
        },
        glyphs: absoluteUrl('/public/assets/map-fonts/{range}.pbf?fontstack={fontstack}'),
        sprite: absoluteUrl('/public/assets/map-sprites/light'),
        layers: [
          ...protomaps_themes_base.default('osm','dark'),
          {
            'id': 'places-polygon-line',
            'filter': ['==', ['geometry-type'], 'Polygon'],
            'type': 'line',
            'source': 'places',
            'source-layer': 'places',
            'layout': {
              'line-cap': 'square',
              'line-join': 'miter',
            },
            'paint': {
              'line-color': '#FFC300',
              'line-width': 2,
              'line-dasharray': [2, 2],
            }
          },
          {
            'id': 'places-polygon-fill',
            'filter': ['==', ['geometry-type'], 'Polygon'],
            'type': 'fill',
            'source': 'places',
            'source-layer': 'places',
            'paint': {
              'fill-color': '#FFC300',
              'fill-opacity': 0.1,
            }
          },
        ],
      },
      center: [0, 0],
      zoom: 2
    })

    this.map.on('moveend', this.handleMoveEnd)
    this.map.on('load', this.handleMoveEnd)
  }

  handleMoveEnd() {
    const bounds = this.map.getBounds()
    const center = this.map.getCenter()
    const zoom = this.map.getZoom()
    window.dispatchEvent(new CustomEvent('mapmove', { detail: { zoom, bounds, center } }))
  }

  center({ lat, lng, z }) {
    this.map.jumpTo({
      center: [lng, lat],
      zoom: z,
    })
  }
}

customElements.define('x-map', Map)
