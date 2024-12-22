package components

import (
	"os"

	ar "go-html-templates/features/autoreload"

	g "maragu.dev/gomponents"
	c "maragu.dev/gomponents/components"
	h "maragu.dev/gomponents/html"
)

type PageProps struct {
	Title string
}

func Page(props PageProps, children ...g.Node) g.Node {
	return c.HTML5(
		c.HTML5Props{
			Title: props.Title,
			Head: []g.Node{
				h.Link(
					g.Attr("rel", "stylesheet"),
					g.Attr("href", "/public/assets/maplibre-gl.min.css"),
					g.Attr("type", "text/css"),
				),
				h.Link(
					g.Attr("rel", "stylesheet"),
					g.Attr("href", "/public/assets/main.css"),
					g.Attr("type", "text/css"),
				),
				h.Link(
					g.Attr("rel", "icon"),
					g.Attr("href", "/public/assets/favicon.ico"),
				),
				h.Script(
					g.Raw(`
            ;(function () {
              const scheme = localStorage.getItem('colorScheme') || 'dark'
              document
                .querySelector('html')
                .style.setProperty('color-scheme', scheme)
            })()
          `),
				),
				h.Script(
					g.Attr("src", "/public/assets/pmtiles.js"),
				),
				h.Script(
					g.Attr("src", "/public/assets/maplibre-gl.min.js"),
				),
				h.Script(
					g.Attr("src", "/public/assets/protomaps-themes-base.min.js"),
				),
				h.Script(
					g.Attr("type", "module"),
					g.Attr("src", "/public/assets/main.js"),
				),
				h.Script(
					g.Attr("type", "module"),
					g.Attr("src", "/public/features/mapp/map.js"),
				),
			},
			Body: []g.Node{
				g.Group(children),
				g.Iff(os.Getenv("APP_ENV") == "development", func() g.Node {
					return ar.AutoreloadScript()
				}),
			},
		},
	)
}
