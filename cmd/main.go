package main

import (
	"fmt"
	a "go-html-templates/features/assets"
	ar "go-html-templates/features/autoreload"
	c "go-html-templates/features/components"
	"go-html-templates/features/home"
	"log"
	"net/http"

	"embed"

	"github.com/joho/godotenv"
)

//go:embed *.html
var componentFiles embed.FS

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file loaded")
	}

	assets, _ := a.Assets()
	c.NewComponents(componentFiles)

	mux := http.NewServeMux()
	mux.Handle("GET /assets/", http.StripPrefix("/assets/", http.FileServer(http.FS(assets))))

	mux.HandleFunc("GET /", home.HomeHandler)

	mux.HandleFunc("GET /autoreload", ar.AutoreloadHandler)

	fmt.Println("Server listening on http://localhost:3000")
	http.ListenAndServe(":3000", mux)
}
