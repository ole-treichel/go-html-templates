package home

import (
  "net/http"
  c "go-html-templates/features/components"
  "os"
  "fmt"
  "html/template"
  "time"
)

const homePageBody = /* html */ `
{{define "body"}}
  <h1>Home</h1>

  {{template "input" .Input}}

  {{block "update-input" .}}
    {{if .Value}}
      <p hx-swap-oob="true" id="value-display">{{ .Value }}</p>
    {{else}}
      <p hx-swap-oob="true" id="value-display">Nothing to see here</p>
    {{end}}
  {{end}}


  {{block "update" .}}
    {{template "button" .Button}}
  {{end}}

  {{template "button" .AllButton}}
{{end}}
`

type HomeProps struct {
  Development bool
  Button c.ButtonProps
  AllButton c.ButtonProps
  Input c.InputProps
  Value string
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
  tmpl, err := c.NewTemplate()
	if err != nil {
		fmt.Println(err)
	}

  partials := r.URL.Query()["partials"]
	if partials == nil {
		partials = []string{"page"}  // default value in case the query parameter is missing
	}

  value := r.URL.Query().Get("value")

  template.Must(tmpl.Parse(homePageBody))

	w.Header().Set("Content-Type", "text/html")

	homeProps := HomeProps{
    Button: c.ButtonProps {
      Label: fmt.Sprintf("Update %s", time.Now().Format(time.Kitchen)),
      Attrs: map[string]string {
        "id": "update",
        "hx-swap-oob": "true",
        "hx-swap": "outerHTML",
        "hx-get": "/?partials=update",
      },
    },
    Value: value,
    Input: c.InputProps {
      Label: "Input",
      Value: value,
      ID: "value",
      Placeholder: "Type something...",
      Attrs: map[string]string {
        "hx-swap": "none",
        "hx-swap-oob": "true",
        "hx-get": "/?partials=update-input",
        "hx-trigger": "keyup changed delay:500ms",
      },
    },
    AllButton: c.ButtonProps {
      Label: "Multipartial",
      Attrs: map[string]string {
        "hx-swap": "none",
        "hx-get": fmt.Sprintf("/?partials=update&partials=update-input&value=%s", time.Now().Format(time.Kitchen)),
      },
    },
    Development: os.Getenv("APP_ENV") == "development",
	}

  for _, partial := range partials {
    tmpl.ExecuteTemplate(w, partial, homeProps)
  }
}

