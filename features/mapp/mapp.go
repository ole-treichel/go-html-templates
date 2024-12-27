package mapp

import (
	"net/http"

	c "go-html-templates/components"

	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

func Map() g.Node {
	return h.Div(
		g.Attr("class", "map"),
		g.Attr("x-data", "{ lat: $persist(0), lng: $persist(0), z: $persist(0) }"),
		g.Attr("x-init", "$nextTick(() => { $refs.map.center({ lat, lng, z }) })"),
		g.Attr("x-on:mapmove.window", "lat = $event.detail.center.lat; lng = $event.detail.center.lng, z = $event.detail.zoom;"),
		g.El("x-map", g.Attr("x-ref", "map")),
	)
}

func MapHandler(w http.ResponseWriter, r *http.Request) {
	c.AppShell(c.PageProps{
		Title: "Map",
		Pane: h.Div(
			g.Text("Pane"),
		),
	},
		Map(),
	).Render(w)
}
