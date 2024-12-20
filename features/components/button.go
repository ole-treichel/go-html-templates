package components

const ButtonTemplate = /* html */ `
  {{define "button"}}
    <button
      class="button"
      {{ range $key, $value := .Attrs}}
        {{ $key | safeHTMLAttr }}="{{ $value | safeHTMLAttr }}"
      {{ end }}
    >
      <span class="button__label">
        {{ .Label }}
      </span>
    </button>
  {{ end }}
`

type ButtonProps struct {
	Label string
  Attrs map[string]string
}
