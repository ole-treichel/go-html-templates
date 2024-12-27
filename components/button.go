package components

import (
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

type ButtonVariant int8

const (
	ButtonVariantDefault ButtonVariant = iota
	ButtonVariantGhost
)

type ButtonProps struct {
	Label     string
	IconStart g.Node
	IconEnd   g.Node
	Attrs     []Attr
	Variant   ButtonVariant
	Classes   Classes
}

func Button(props ButtonProps) g.Node {
	return h.Button(
		g.Attr(
			"class",
			Cls(Classes{
				"button":        true,
				"button--ghost": props.Variant == ButtonVariantGhost,
			}, props.Classes),
		),
		g.Map(props.Attrs, func(attr Attr) g.Node {
			return g.Attr(attr.Key, attr.Value)
		}),

		g.Iff(props.IconStart != nil, func() g.Node {
			return h.Span(
				h.Class("button__icon"),
				props.IconStart,
			)
		}),

		g.Iff(props.Label != "", func() g.Node {
			return h.Span(
				h.Class("button__label"),
				g.Text(props.Label),
			)
		}),

		g.Iff(props.IconEnd != nil, func() g.Node {
			return h.Span(
				h.Class("button__icon"),
				props.IconEnd,
			)
		}),
	)
}
