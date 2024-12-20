package main

import (
	"fmt"
	"html/template"
	"io"
	"net/http"
  c "go-html-templates/features/components"
  a "go-html-templates/features/assets"
)

const rootPageBody = /* html */ `
{{define "body"}}
  <h1>Body</h1>

  {{template "button" .Button}}
{{end}}
`

type RootPage struct {
	Button c.Button
}

func getRoot(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.New("page").Parse(c.PageTemplate)
	if err != nil {
		fmt.Println(err)
	}
	_, err = tmpl.Parse(rootPageBody)
	if err != nil {
		fmt.Println(err)
	}

	_, err = tmpl.Parse(c.ButtonTemplate)
	if err != nil {
		fmt.Println(err)
	}

	w.Header().Set("Content-Type", "text/html")

	rootPage := RootPage{
		Button: c.Button{
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
  assets, _ := a.Assets()
	mux := http.NewServeMux()

  mux.Handle("GET /assets/", http.StripPrefix("/assets/", http.FileServer(http.FS(assets))))
	mux.HandleFunc("GET /", getRoot)
	mux.HandleFunc("GET /item/{id}", getItem)

	fmt.Println("Server listening on http://localhost:3000")
	http.ListenAndServe(":3000", mux)
}
