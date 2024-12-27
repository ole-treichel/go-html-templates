package places

import (
	"fmt"
	"net/http"
	"strconv"

	c "go-html-templates/components"

	m "go-html-templates/features/mapp"

	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

func PanePlaceList(children ...g.Node) g.Node {
	return h.Div(
		h.Class("places-list"),
		g.Attr("x-data", ""),
		g.Group(children),
	)
}

func PanePlace(place Place) g.Node {
	return h.Div(
		g.Attr("class", "places-list__place"),
		h.Div(
			g.Attr("class", "places-list__place-cell"),
			g.Text(strconv.Itoa(place.Id)),
		),
		h.Div(
			g.Attr("class", "places-list__place-cell places-list__place-cell-name"),
			g.Attr("x-on:click", fmt.Sprintf("window.dispatchEvent(new CustomEvent('map-fit-bounds', { detail: { geometry: %s } }))", place.Bounds)),
			g.Text(place.Name),
		),
		h.Div(
			g.Attr("class", "places-list__place-cell"),
		),

		h.Div(
			g.Attr("class", "places-list__place-cell"),
			c.Button(
				c.ButtonProps{
					Variant:   c.ButtonVariantGhost,
					IconStart: c.Icon(c.IconProps{Icon: "ri-more-2-line"}),
				},
			),
		),
	)
}

func MapHandler(w http.ResponseWriter, r *http.Request) {

	places, err := GetAllPlaces()

	if err != nil {
		fmt.Println(err)
	}

	c.AppShell(c.PageProps{
		Title: "Map",
		Pane: PanePlaceList(
			g.Map(places, func(place Place) g.Node {
				return PanePlace(place)
			}),
		),
	},
		m.Map(),
	).Render(w)
}
