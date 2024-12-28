package main

import (
	"fmt"
	ar "go-html-templates/features/autoreload"
	"log"
	"net/http"
	"os"

	"embed"

	"github.com/joho/godotenv"

	places "go-html-templates/features/places"
)

//go:embed all:assets components/*.css components/*.js features/**/*.css features/**/*.js
var publicFiles embed.FS

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file loaded")
	}

	places.Setup(os.Getenv("DATABASE_URL"))

	mux := http.NewServeMux()
	mux.Handle("GET /public/", http.StripPrefix("/public/", http.FileServer(http.FS(publicFiles))))

	mux.HandleFunc("GET /", places.MapHandler)
	mux.HandleFunc("GET /places/create", places.CreatePlaceHandler)
	mux.HandleFunc("POST /places/create", places.CreatePlaceHandler)
	mux.HandleFunc("GET /places/list", places.ListPlaceHandler)
	mux.HandleFunc("GET /places/mvt/{z}/{x}/{y}", places.MvtHandler)

	if os.Getenv("APP_ENV") == "development" {
		mux.HandleFunc("GET /autoreload", ar.AutoreloadHandler)
	}

	fmt.Println("Server listening on http://localhost:3000")
	http.ListenAndServe(":3000", mux)
}
