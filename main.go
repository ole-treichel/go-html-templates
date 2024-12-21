package main

import (
	"fmt"
	c "go-html-templates/components"
	ar "go-html-templates/features/autoreload"
	"go-html-templates/features/home"
	"log"
	"net/http"

	"embed"

	"github.com/joho/godotenv"
)

//go:embed components/*.html features/**/*.html
var componentFiles embed.FS

//go:embed all:public
var publicFiles embed.FS

//go:embed components/*.css
var cssFiles embed.FS

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file loaded")
	}

	c.NewComponents(componentFiles)

	mux := http.NewServeMux()
	mux.Handle("GET /public/", http.FileServer(http.FS(publicFiles)))
	mux.Handle("GET /css/", http.StripPrefix("/css", http.FileServer(http.FS(cssFiles))))

	mux.HandleFunc("GET /", home.HomeHandler)

	mux.HandleFunc("GET /autoreload", ar.AutoreloadHandler)

	fmt.Println("Server listening on http://localhost:3000")
	http.ListenAndServe(":3000", mux)
}
