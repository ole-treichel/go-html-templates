package autoreload

import (
	"fmt"
	"net/http"
	"time"
)

func AutoreloadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	i := 0
	for {
		fmt.Fprintf(w, "data: time update %s\nretry: 100\n", i)
		time.Sleep(1 * time.Second)
		w.(http.Flusher).Flush()
		i++
	}
}
