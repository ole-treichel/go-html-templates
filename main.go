package main

import (
	"fmt"
	ar "go-html-templates/features/autoreload"
	"go-html-templates/features/home"
	"log"
	"net/http"
	"os"

	"embed"

	"github.com/joho/godotenv"
)

//go:embed all:public
var publicFiles embed.FS

//go:embed components/*.css
var cssFiles embed.FS

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file loaded")
	}

	mux := http.NewServeMux()
	mux.Handle("GET /public/", http.FileServer(http.FS(publicFiles)))
	mux.Handle("GET /css/", http.StripPrefix("/css", http.FileServer(http.FS(cssFiles))))

	mux.HandleFunc("GET /", home.HomeHandler)
	mux.HandleFunc("GET /sse/home", home.HomeSSEHandler)

	if os.Getenv("APP_ENV") == "development" {
		mux.HandleFunc("GET /autoreload", ar.AutoreloadHandler)
	}

	fmt.Println("Server listening on http://localhost:3000")
	http.ListenAndServe(":3000", mux)
}
