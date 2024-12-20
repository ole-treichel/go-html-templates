package components

import (
	ar "go-html-templates/features/autoreload"
	"html/template"
)

var TemplateFuncMap = template.FuncMap {
  "safeHTMLAttr": func(s string) template.HTMLAttr {
    return template.HTMLAttr(s)
  },
}

func NewTemplate() (*template.Template, error) {
  tmpl :=  template.New("root").Funcs(TemplateFuncMap)

  templates := map[string]string {
    "page": PageTemplate,
    "button": ButtonTemplate,
    "input": InputTemplate,
    "autoreloadscript": ar.AutoreloadScriptTemplate,
  }

  for key, _ := range templates {
    _, err := tmpl.Parse(templates[key])
    if err != nil {
      return nil, err
    }
  }

  return tmpl, nil
}
