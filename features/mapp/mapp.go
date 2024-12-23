package mapp

import (
	"net/http"

	c "go-html-templates/components"

	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

func Map() g.Node {
	return g.El("x-map")
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
