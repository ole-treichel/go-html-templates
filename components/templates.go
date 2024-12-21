package components

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"path/filepath"
	"strings"
)

var templateFuncMap = template.FuncMap{
	"safeHTMLAttr": func(s string) template.HTMLAttr {
		return template.HTMLAttr(s)
	},
}

var tmpl *template.Template = nil

func NewComponents(files embed.FS) error {
	tmpl = template.New("").Funcs(templateFuncMap)

	var paths []string
	err := fs.WalkDir(files, ".", func(path string, d fs.DirEntry, err error) error {
		if strings.Contains(d.Name(), ".html") {
			paths = append(paths, path)
		}
		return nil
	})
	if err != nil {
		return err
	}

	for _, path := range paths {
		content, err := files.ReadFile(path)
		if err != nil {
			return err
		}
		_, err = tmpl.New(filepath.Base(path)).Parse(string(content))
		if err != nil {
			return err
		}
	}

	return nil
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

func RenderString(name string, data interface{}) string {
	var buffer bytes.Buffer

	err := tmpl.ExecuteTemplate(&buffer, name, data)
	if err != nil {
		err = fmt.Errorf("error executing template: %w", err)
		return ""
	}

	return buffer.String()
}
