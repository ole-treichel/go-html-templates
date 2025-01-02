package pmtiles

import (
	"net/http"
)

func PmtilesHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/osm.pmtiles")
}
