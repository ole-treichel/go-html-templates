package main

import (
	"fmt"
	"html/template"
	"io"
	"net/http"
)

const buttonTemplate = /* html */ `
  {{define "button"}}
    <button class="button">
      <span class="button__label">
        {{ .Label }}
      </span>
    </button>
  {{ end }}
`

type Button struct {
	Label string
}

const pageTemplate = /* html */ `
{{define "page"}}
  <!DOCTYPE html>
  <html>

    <head>
      <script>
        console.log("Hello world!")
      </script>
    </head>

    <p>
      asdf
    </p>

    <body>
      <h1>Dont let me down!</h1>
      {{template "body" . }}
    </body>

  </html>
{{end}}
`

const rootPageBody = /* html */ `
{{define "body"}}
  <h1>Body</h1>

  {{template "button" .Button}}
{{end}}
`

type RootPage struct {
	Button Button
}

func getRoot(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.New("page").Parse(pageTemplate)
	if err != nil {
		fmt.Println(err)
	}
	_, err = tmpl.Parse(rootPageBody)
	if err != nil {
		fmt.Println(err)
	}

	_, err = tmpl.Parse(buttonTemplate)
	if err != nil {
		fmt.Println(err)
	}

	w.Header().Set("Content-Type", "text/html")

	rootPage := RootPage{
		Button: Button{
			Label: "Button?",
		},
	}

	tmpl.ExecuteTemplate(w, "page", rootPage)
}

func getItem(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	io.WriteString(w, fmt.Sprintf("<h1>Item %s</h1>", id))
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /", getRoot)
	mux.HandleFunc("GET /item/{id}", getItem)

	fmt.Println("Server listening on http://localhost:3000")
	http.ListenAndServe(":3000", mux)
}
