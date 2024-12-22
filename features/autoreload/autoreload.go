package autoreload

import (
	"fmt"
	"net/http"
	"time"

	g "maragu.dev/gomponents"
	h "maragu.dev/gomponents/html"
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

func AutoreloadScript() g.Node {
	return h.Script(
		g.Attr("type", "module"),
		g.Raw(`
      import { ready } from '/public/main.js'

      ready(() => {
        const eventSource = new EventSource("/autoreload")

        eventSource.onopen = function () {
          console.log('[autoreload] connected')
        }

        eventSource.onerror = function() {
          console.log('[autoreload] disconnected')
          eventSource.onopen = function () {
            console.log('[autoreload] reconnnected')
            eventSource.onopen = null
            eventSource.onerror = null

            console.log('[autoreload] reloading')
            window.location.reload()
          }
        }

        window.addEventListener("beforeunload", function () {
          if (eventSource.readyState === EventSource.OPEN) {
            eventSource.close()
          }
        })
      })
    `,
		))
}
