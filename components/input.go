package components

import (
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

type InputProps struct {
	ID          string
	Label       string
	Type        string
	Placeholder string
	Value       string
	Hint        string
	Error       string
	IsDisabled  bool
	Attrs       []Attr
}

func Input(props InputProps) g.Node {
	return h.Div(
		h.Class("input"),
		h.Label(
			h.Class("input__label"),
			g.Attr("for", props.ID),
			g.Text(props.Label),
		),
		g.Iff(props.Hint != "", func() g.Node {
			return h.Div(
				h.Class("input__hint"),
				g.Text(props.Hint),
			)
		}),
		h.Input(
			g.Attr("type", props.Type),
			g.Attr("id", props.ID),
			g.Attr("name", props.ID),
			g.Attr("placeholder", props.Placeholder),
			g.If(props.IsDisabled, g.Attr("disabled", "disabled")),
			g.Iff(props.Value != "", func() g.Node {
				return g.Attr("value", props.Value)
			}),
			g.Map(props.Attrs, func(attr Attr) g.Node {
				return g.Attr(attr.Key, attr.Value)
			}),
		),
		g.Iff(props.Error != "", func() g.Node {
			return h.Div(
				h.Class("input__error"),
				g.Text(props.Error),
			)
		}),
	)
}
