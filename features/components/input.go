package components

const InputTemplate = /* html */`
{{define "input"}}
<div class="input-container">
    <label for="{{.ID}}">{{.Label}}</label>
    <br>
    {{if ne .Hint ""}}
        <div class="hint">{{.Hint}}</div>
    {{end}}
    <input
        type="{{.Type}}"
        id="{{.ID}}"
        name="{{.ID}}"
        placeholder="{{.Placeholder}}"
        {{if ne .Error ""}}
            class="error"
        {{end}}
        {{if eq .IsDisabled true}}
            disabled
        {{end}}
        {{if ne .Value ""}}
            value="{{.Value}}"
        {{end}}

        {{ range $key, $value := .Attrs}}
          {{ $key | safeHTMLAttr }}="{{ $value | safeHTMLAttr }}"
        {{ end }}
    >
    <br>
    {{if ne .Error ""}}
        <div class="error">{{.Error}}</div>
    {{end}}
</div>
{{end}}
`

type InputProps struct {
	ID          string
	Label       string
	Type        string
	Placeholder string
	Value       string
	Hint        string
	Error       string
	IsDisabled  bool
  Attrs map[string]string
}
