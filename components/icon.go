package components

import (
	"fmt"

	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
)

type IconProps struct {
	Icon  string
	Attrs []Attr
}

func Icon(props IconProps) g.Node {
	return h.SVG(
		h.Class("icon"),
		g.El("use",
			g.Attr("href", fmt.Sprintf("/public/assets/remixicon.symbol.svg#%s", props.Icon)),
		),
		g.Map(props.Attrs, func(attr Attr) g.Node {
			return g.Attr(attr.Key, attr.Value)
		}),
	)
}
