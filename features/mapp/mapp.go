package mapp

import (
	"net/http"

	c "go-html-templates/components"

	g "maragu.dev/gomponents"
)

func Map() g.Node {
	return g.El("x-map")
}

func MapHandler(w http.ResponseWriter, r *http.Request) {
	c.Page(c.PageProps{
		Title: "Map",
	},
		Map(),
	).Render(w)
}
