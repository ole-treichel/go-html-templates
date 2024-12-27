package components

import (
	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

type Gap int8

const (
	GapNone Gap = iota
	GapSmall
	GapMedium
	GapLarge
)

type StackProps struct {
	Row     bool
	Gap     Gap
	Attrs   []Attr
	Classes Classes
}

func Stack(props StackProps, children ...g.Node) g.Node {
	gapClass := ""

	switch props.Gap {
	case GapSmall:
		gapClass = "stack--gap-small"
	case GapMedium:
		gapClass = "stack--gap-medium"
	case GapLarge:
		gapClass = "stack--gap-large"
	}

	return h.Div(
		g.Attr(
			"class",
			Cls(Classes{
				"stack":         true,
				"stack--column": !props.Row,
				"stack--row":    props.Row,
				gapClass:        gapClass != "",
			}, props.Classes),
		),
		g.Map(props.Attrs, func(attr Attr) g.Node {
			return g.Attr(attr.Key, attr.Value)
		}),
		g.Group(children),
	)
}
