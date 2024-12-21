package home

import (
	c "go-html-templates/components"
	"net/http"
	"os"

	datastar "github.com/starfederation/datastar/sdk/go"
)

type HomeProps struct {
	Development bool
	Input       c.InputProps
	Value       string
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	value := r.URL.Query().Get("value")

	homeProps := HomeProps{
		Value: value,
		Input: c.InputProps{
			Label:       "Input",
			Value:       value,
			ID:          "value",
			Placeholder: "Type something...",
			Attrs: map[string]string{
				"data-bind-value":               "",
				"data-on-input__debounce.500ms": "sse('/sse/home')",
			},
		},
		Development: os.Getenv("APP_ENV") == "development",
	}

	c.Render(w, "page", homeProps)
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

	homeProps := HomeProps{
		Value: signals.Value,
		Input: c.InputProps{
			Label:       "Input",
			Value:       signals.Value,
			ID:          "value",
			Placeholder: "Type something...",
			Attrs: map[string]string{
				"data-bind-value":               "",
				"data-on-input__debounce.500ms": "sse('/sse/home')",
			},
		},
		Development: os.Getenv("APP_ENV") == "development",
	}

	sse.MergeFragments(
		c.RenderString("update-input", homeProps),
	)
}
