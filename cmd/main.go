package main

import (
	"fmt"
	"net/http"
  a "go-html-templates/features/assets"
  ar "go-html-templates/features/autoreload"
  "github.com/joho/godotenv"
  "log"
  "go-html-templates/features/home"
)


func main() {
  err := godotenv.Load()
  if err != nil {
    log.Println("No .env file loaded")
  }

  assets, _ := a.Assets()

	mux := http.NewServeMux()
  mux.Handle("GET /assets/", http.StripPrefix("/assets/", http.FileServer(http.FS(assets))))

	mux.HandleFunc("GET /", home.HomeHandler)

  mux.HandleFunc("GET /autoreload", ar.AutoreloadHandler)

	fmt.Println("Server listening on http://localhost:3000")
	http.ListenAndServe(":3000", mux)
}
