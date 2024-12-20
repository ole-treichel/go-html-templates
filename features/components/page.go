package components

const PageTemplate = /* html */ `
{{define "page"}}
  <!DOCTYPE html>
  <html>

    <head>
      <link rel="stylesheet" href="/assets/index.css" type="text/css">
      <script>
        console.log("Hello world!")
      </script>
    </head>

    <body>
      <h1>Dont let me down!</h1>
      {{template "body" . }}
    </body>

  </html>
{{end}}
`

