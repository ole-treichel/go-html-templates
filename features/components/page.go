package components

const PageTemplate = /* html */ `
{{define "page"}}
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="stylesheet" href="/assets/index.css" type="text/css">
      <link rel="icon" href="/assets/favicon.ico">
      <script>
        ;(function () {
          const scheme = localStorage.getItem('colorScheme') || 'dark'
          document
            .querySelector('html')
            .style.setProperty('color-scheme', scheme)
        })()
      </script>
      <script src="/assets/htmx.min.js"></script>
      <script src="/assets/index.js"></script>
      <title>{{block "title" .}}Go{{end}}</title>
    </head>

    <body>
      {{block "body" . }}
      {{end}}
    </body>

    {{if .Development }}
      {{template "autoreloadscript" .}}
    {{end}}

  </html>
{{end}}
`
