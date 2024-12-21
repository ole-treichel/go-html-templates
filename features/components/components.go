package components

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"strings"
)

var TemplateFuncMap = template.FuncMap{
	"safeHTMLAttr": func(s string) template.HTMLAttr {
		return template.HTMLAttr(s)
	},
}

var tmpl *template.Template = nil

func NewComponents(files embed.FS) (*template.Template, error) {
	var paths []string
	fs.WalkDir(files, ".", func(path string, d fs.DirEntry, err error) error {
		if strings.Contains(d.Name(), ".html") {
			paths = append(paths, path)
		}
		return nil
	})

	tmpl = template.Must(template.ParseFS(files, paths...))

	return tmpl, nil
}

func Render(w http.ResponseWriter, name string, data interface{}) {
	var buffer bytes.Buffer

	err := tmpl.ExecuteTemplate(&buffer, name, data)
	if err != nil {
		err = fmt.Errorf("error executing template: %w", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=UTF-8")
	buffer.WriteTo(w)
}
