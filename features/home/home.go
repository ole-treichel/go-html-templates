package home

import (
	"fmt"
	c "go-html-templates/components"
	"net/http"

	datastar "github.com/starfederation/datastar/sdk/go"
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	value := r.URL.Query().Get("value")

	c.Page(
		c.PageProps{
			Title: "Home",
		},
		h.H1(g.Text("Home")),
		c.Input(c.InputProps{
			ID:          "value",
			Label:       "Input",
			Placeholder: "Type something...",
			Value:       value,
			Attrs: []c.Attr{
				c.Attr{
					Key:   "data-bind-value",
					Value: "",
				},
				c.Attr{
					Key:   "data-on-input__debounce.500ms",
					Value: "sse('/sse/home')",
				},
			},
		}),
		g.Iff(value != "", func() g.Node {
			return h.P(
				g.Attr("id", "value-display"),
				g.Text(value),
			)
		}),
		g.Iff(value == "", func() g.Node {
			return h.P(
				g.Attr("id", "value-display"),
				g.Text("Nothing to see here yet"),
			)
		}),
	).Render(w)
}

type UpdateInputSignals struct {
	Value string `json:"value"`
}

func HomeSSEHandler(w http.ResponseWriter, r *http.Request) {
	sse := datastar.NewSSE(w, r)

	signals := &UpdateInputSignals{}
	if err := datastar.ReadSignals(r, signals); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	sse.MergeFragments(
		fmt.Sprint(
			h.P(
				g.Attr("id", "value-display"),
				g.Text(signals.Value),
			),
		),
	)
}
