package components

import (
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

type InputProps struct {
	ID          string
	Type        string
	Placeholder string
	Value       string
	Disabled    bool
	Attrs       []Attr
}

func Input(props InputProps) g.Node {
	return h.Div(
		h.Class("input"),
		h.Input(
			h.Class("input__input"),
			g.Attr("type", props.Type),
			g.Attr("id", props.ID),
			g.Attr("name", props.ID),
			g.Attr("placeholder", props.Placeholder),
			g.If(props.Disabled, g.Attr("disabled")),
			g.Iff(props.Value != "", func() g.Node {
				return g.Attr("value", props.Value)
			}),
			g.Map(props.Attrs, func(attr Attr) g.Node {
				return g.Attr(attr.Key, attr.Value)
			}),
		),
	)
}
