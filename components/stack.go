package components

import (
	g "maragu.dev/gomponents"
	gc "maragu.dev/gomponents/components"
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
	Row   bool
	Gap   Gap
	Attrs []Attr
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
		gc.Classes{
			"stack":         true,
			"stack--column": !props.Row,
			"stack--row":    props.Row,
			gapClass:        gapClass != "",
		},
		g.Map(props.Attrs, func(attr Attr) g.Node {
			return g.Attr(attr.Key, attr.Value)
		}),
		g.Group(children),
	)
}
