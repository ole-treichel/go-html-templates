package components

import (
	"os"

	ar "go-html-templates/features/autoreload"

	g "maragu.dev/gomponents"
	gc "maragu.dev/gomponents/components"
	h "maragu.dev/gomponents/html"
)

type PageProps struct {
	Title string
	Pane  g.Node
}

func AppShell(props PageProps, children ...g.Node) g.Node {
	return gc.HTML5(
		gc.HTML5Props{
			Title: props.Title,
			Head: []g.Node{
				h.Link(
					g.Attr("rel", "stylesheet"),
					g.Attr("href", "/public/assets/maplibre-gl.min.css"),
					g.Attr("type", "text/css"),
				),
				h.Link(
					g.Attr("rel", "stylesheet"),
					g.Attr("href", "/public/assets/main.css"),
					g.Attr("type", "text/css"),
				),
				h.Link(
					g.Attr("rel", "icon"),
					g.Attr("href", "/public/assets/favicon.ico"),
				),
				h.Script(
					g.Raw(`
            ;(function () {
              const scheme = localStorage.getItem('colorScheme') || 'dark'
              document
                .querySelector('html')
                .style.setProperty('color-scheme', scheme)
            })()
          `),
				),
				h.Script(
					g.Attr("src", "/public/assets/pmtiles.js"),
				),
				h.Script(
					g.Attr("src", "/public/assets/maplibre-gl.min.js"),
				),
				h.Script(
					g.Attr("src", "/public/assets/protomaps-themes-base.min.js"),
				),
				h.Script(
					g.Attr("type", "module"),
					g.Attr("src", "/public/assets/main.js"),
				),
				h.Script(
					g.Attr("type", "module"),
					g.Attr("src", "/public/features/mapp/map.js"),
				),
			},
			Body: []g.Node{
				h.Div(
					gc.Classes{
						"app-shell":       true,
						"app-shell--pane": props.Pane != nil,
					},
					g.Attr(
						"x-data", `{
              bottom: $persist(false),
              width: $persist(0),
              height: $persist(0),
              dragging: false,
              toggleLayout() {
                if (this.bottom) {
                  this.bottom = false
                } else {
                  this.bottom = true
                }
              },
              handleMouseMove(e) {
                if (!this.bottom) {
                  this.width = e.clientX
                } else {
                  this.height = window.innerHeight - e.clientY
                }
              },
            }`,
					),
					g.Attr(
						"x-bind:class", "{ 'app-shell--pane-bottom': bottom }",
					),
					g.Iff(props.Pane != nil, func() g.Node {
						return h.Aside(
							h.Class("app-shell__pane"),
							g.Attr("x-resize", "!bottom && (width = $width); bottom && (height = $height)"),
							g.Attr("x-bind:style", "{ 'width': !bottom ? width + 'px' : null, 'height': bottom ? height + 'px' : null }"),
							h.Div(
								h.Class("app-shell__pane-resize"),
								g.Attr("x-ref", "pane-resize"),
								g.Attr("x-on:mousedown", "dragging = true"),
								g.Attr("x-on:mouseup.document", "dragging = false"),
								g.Attr("x-on:mousemove.document.throttle.10ms", "!!dragging && handleMouseMove($event)"),
							),
							h.Div(
								h.Class("app-shell__pane-header"),
								Stack(StackProps{
									Row: true,
									Gap: GapSmall,
								},
									Button(ButtonProps{
										Variant: ButtonVariantGhost,
										Label:   "New",
									}),
									Button(ButtonProps{
										Variant: ButtonVariantGhost,
										Label:   "Filter",
									}),
								),
								Stack(StackProps{
									Row: true,
									Gap: GapSmall,
									Classes: Classes{
										"ml-auto": true,
									},
								},
									Button(ButtonProps{
										IconStart: g.Group([]g.Node{
											Icon(IconProps{Icon: "ri-moon-line", Attrs: []Attr{{Key: "x-show", Value: "theme === 'light'"}}}),
											Icon(IconProps{Icon: "ri-sun-line", Attrs: []Attr{{Key: "x-show", Value: "theme === 'dark'"}}}),
										}),
										Variant: ButtonVariantGhost,
										Attrs: []Attr{
											{
												Key: "x-data",
												Value: `
                        {
                          theme: "dark",
                          switchDark() {
                            const scheme = "dark"
                            document.querySelector("html").style.setProperty("color-scheme", scheme)
                            this.theme = scheme
                            localStorage.setItem("colorScheme", scheme);
                          },
                          switchLight() {
                            const scheme = "light"
                            document.querySelector("html").style.setProperty("color-scheme", scheme)
                            this.theme = scheme
                            localStorage.setItem("colorScheme", scheme);
                          },
                        }
                      `,
											},
											{
												Key:   "x-on:click",
												Value: "theme === 'light' ? switchDark() : switchLight()",
											},
											{
												Key:   "x-init",
												Value: "if (localStorage.getItem('colorScheme')) { theme = localStorage.getItem('colorScheme') } else { localStorage.setItem('colorScheme', 'dark') }",
											},
										}}),
									Button(ButtonProps{
										IconStart: g.Group([]g.Node{
											Icon(IconProps{Icon: "ri-layout-bottom-line", Attrs: []Attr{{Key: "x-show", Value: "!bottom"}}}),
											Icon(IconProps{Icon: "ri-layout-left-line", Attrs: []Attr{{Key: "x-show", Value: "bottom"}}}),
										}),
										Variant: ButtonVariantGhost,
										Attrs: []Attr{
											{
												Key:   "x-on:click",
												Value: "toggleLayout()",
											},
											{
												Key:   "x-ref",
												Value: "toggle-layout-button",
											},
										},
									}),
								),
							),
							h.Div(
								h.Class("app-shell__pane-body"),
								props.Pane,
							),
						)
					}),
					h.Main(
						h.Class("app-shell__main"),
						g.Group(children),
					),
					g.Iff(os.Getenv("APP_ENV") == "development", func() g.Node {
						return ar.AutoreloadScript()
					}),
				),
			},
		},
	)
}
