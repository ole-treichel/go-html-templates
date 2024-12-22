package components

import (
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

type ButtonProps struct {
	Label string
	Attrs []Attr
}

func Button(props ButtonProps) g.Node {
	return h.Button(
		h.Class("button"),
		g.Map(props.Attrs, func(attr Attr) g.Node {
			return g.Attr(attr.Key, attr.Value)
		}),
		h.Span(
			h.Class("button__label"),
			g.Text(props.Label),
		),
	)
}
