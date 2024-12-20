package components

const ButtonTemplate = /* html */ `
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
