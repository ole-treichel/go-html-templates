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

const paneSwapId = "pane-content"

func PanePlaceList(children ...g.Node) g.Node {
	return h.Div(
		h.Class("places-list"),
		g.Attr("id", paneSwapId),
		g.Attr("hx-swap-oob", "true"),
		g.Attr("x-data", ""),
		g.Group(children),
	)
}

func PanePlace(place Place) g.Node {
	return h.Div(
		g.Attr("class", "places-list__place"),
		h.Div(
			g.Attr("class", "places-list__place-cell places-list__place-cell-id"),
			g.Text("#"),
			g.Text(strconv.Itoa(place.Id)),
		),
		h.Div(
			g.Attr("class", "places-list__place-cell places-list__place-cell-name"),
			g.Attr("x-on:click", fmt.Sprintf("window.dispatchEvent(new CustomEvent('map-fit-bounds', { detail: { geometry: %s } }))", place.Bounds)),
			g.Text(place.Name),
		),
		h.Div(
			g.Attr("class", "places-list__place-cell"),
			c.Button(
				c.ButtonProps{
					Variant: c.ButtonVariantGhost,
					Label:   "Edit",
					Attrs: []c.Attr{
						{
							Key:   "x-on:click",
							Value: fmt.Sprintf("window.dispatchEvent(new CustomEvent('map-fit-bounds', { detail: { geometry: %s } }))", place.Bounds),
						},
						{
							Key:   "hx-get",
							Value: "/places/edit/" + strconv.Itoa(place.Id),
						},
						{
							Key:   "hx-swap",
							Value: "none",
						},
					},
				},
			),
		),

		h.Div(
			g.Attr("class", "places-list__place-cell"),
			c.Button(
				c.ButtonProps{
					Variant: c.ButtonVariantGhost,
					Label:   "Delete",
					Attrs: []c.Attr{
						{
							Key:   "hx-delete",
							Value: "/places/" + strconv.Itoa(place.Id),
						},
						{
							Key:   "hx-target",
							Value: "closest .places-list__place",
						},
						{
							Key:   "hx-swap",
							Value: "delete",
						},
						{
							Key:   "hx-confirm",
							Value: "Delete place #" + strconv.Itoa(place.Id) + "?",
						},
					},
				},
			),
		),
	)
}

func PaneCreatePlace() g.Node {
	return h.Form(
		g.Attr("id", paneSwapId),
		g.Attr("hx-swap-oob", "true"),
		g.Attr("hx-post", "/places/create"),
		g.Attr("class", "places-create"),
		g.Attr("hx-vals", "js:{ geom: document.querySelector('x-map').draw?.getTerraDrawInstance?.().getSnapshot?.()[0]?.geometry }"),
		c.Input(c.InputProps{
			ID:          "name",
			Placeholder: "Name",
		}),
		c.Input(c.InputProps{
			ID:          "description",
			Placeholder: "Description",
		}),
		c.Button(c.ButtonProps{
			Label: "Create",
		}),
		c.Button(c.ButtonProps{
			Label: "Cancel",
			Attrs: []c.Attr{
				{
					Key:   "hx-get",
					Value: "/places/list",
				},
				{
					Key:   "hx-swap",
					Value: "none",
				},
			},
		}),
	)
}

func CreatePlaceHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		r.ParseForm()
		name := r.FormValue("name")
		description := r.FormValue("description")
		geom := r.FormValue("geom")

		if name != "" && description != "" && geom != "" {

			err := CreatePlace(PlaceInput{
				Name:        name,
				Description: description,
				Geom:        geom,
			})

			if err != nil {
				fmt.Println(err)
			}

			w.Header().Add("HX-Trigger", "map-create-mode-end,map-reload-places")
			places, err := GetAllPlaces()

			if err != nil {
				fmt.Println(err)
			}

			PanePlaceList(
				g.Map(places, func(place Place) g.Node {
					return PanePlace(place)
				}),
			).Render(w)
			return
		} else {
			return
		}
	}

	w.Header().Add("HX-Trigger", "map-create-mode-start")
	PaneCreatePlace().Render(w)
}

func DeletePlaceHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	err := DeletePlace(id)

	if err != nil {
		fmt.Println(err)
	}

	w.Header().Add("HX-Trigger", "map-reload-places")

	return
}

func ListPlaceHandler(w http.ResponseWriter, r *http.Request) {
	places, err := GetAllPlaces()

	if err != nil {
		fmt.Println(err)
	}

	w.Header().Add("HX-Trigger", "map-create-mode-end,map-edit-mode-end")

	PanePlaceList(
		g.Map(places, func(place Place) g.Node {
			return PanePlace(place)
		}),
	).Render(w)
}

func EditHandler(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	if r.Method == "PATCH" {
		r.ParseForm()
		name := r.FormValue("name")
		description := r.FormValue("description")
		geom := r.FormValue("geom")

		idParsed, err := strconv.Atoi(id)

		if err != nil {
			fmt.Println(err)
			return
		}

		if name != "" && description != "" && geom != "" {
			err := UpdatePlace(Place{
				Id:          idParsed,
				Name:        name,
				Description: description,
				Geom:        geom,
			})

			if err != nil {
				fmt.Println(err)
			}

			w.Header().Add("HX-Trigger", "map-edit-mode-end,map-reload-places")
			places, err := GetAllPlaces()

			if err != nil {
				fmt.Println(err)
			}

			PanePlaceList(
				g.Map(places, func(place Place) g.Node {
					return PanePlace(place)
				}),
			).Render(w)
			return
		}
	}

	place, err := GetPlace(id)

	if err != nil {
		fmt.Println(err)

		return
	}

	w.Header().Add("HX-Trigger", fmt.Sprintf(`{ "map-edit-mode-start":  { "geom": %s } }`, place.Geom))

	h.Form(
		g.Attr("id", paneSwapId),
		g.Attr("hx-swap-oob", "true"),
		g.Attr("hx-patch", "/places/edit/"+id),
		g.Attr("class", "places-create"),
		g.Attr("hx-vals", "js:{ geom: document.querySelector('x-map').draw?.getTerraDrawInstance?.().getSnapshot?.()[0]?.geometry }"),
		c.Input(c.InputProps{
			ID:          "name",
			Placeholder: "Name",
			Value:       place.Name,
		}),
		c.Input(c.InputProps{
			ID:          "description",
			Placeholder: "Description",
			Value:       place.Description,
		}),
		c.Button(c.ButtonProps{
			Label: "Save",
		}),
		c.Button(c.ButtonProps{
			Label: "Cancel",
			Attrs: []c.Attr{
				{
					Key:   "hx-get",
					Value: "/places/list",
				},
				{
					Key:   "hx-swap",
					Value: "none",
				},
			},
		}),
	).Render(w)

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
		PaneActions: g.Group([]g.Node{
			c.Button(c.ButtonProps{
				Variant: c.ButtonVariantGhost,
				Label:   "New",
				Attrs: []c.Attr{
					{
						Key:   "hx-get",
						Value: "/places/create",
					},
					{
						Key:   "hx-swap",
						Value: "none",
					},
				},
			}),
		},
		),
	},
		m.Map(),
	).Render(w)
}
