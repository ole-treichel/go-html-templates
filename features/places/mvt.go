package places

import (
	"fmt"
	"net/http"

	"strconv"

	"github.com/paulmach/orb/encoding/mvt"
	"github.com/paulmach/orb/geojson"
	"github.com/paulmach/orb/maptile"
	"github.com/paulmach/orb/simplify"
)

type TileCoordinates struct {
	X int
	Y int
	Z int
}

type VectorTileResult struct {
	Tile []byte `db:"tile"`
}

type Place struct {
	Id   int    `db:"id"`
	Geom string `db:"geom"`
}

func GetVectorTile(t TileCoordinates) (VectorTileResult, error) {
	tile := maptile.New(uint32(t.X), uint32(t.Y), maptile.Zoom(t.Z))
	tileBound := tile.Bound()

	rows, err := Conn.Query(
		"select AsGeoJSON(SetSRID(geom, 4326)) from places where MbrIntersects(geom, BuildMbr($1, $2, $3, $4, 3857))",
		tileBound.LeftTop().X(),
		tileBound.LeftTop().Y(),
		tileBound.RightBottom().X(),
		tileBound.RightBottom().Y(),
	)

	if err != nil {
		return VectorTileResult{}, err
	}

	featureCollection := geojson.NewFeatureCollection()
	for rows.Next() {
		var geoJSON string
		if err := rows.Scan(&geoJSON); err != nil {
			return VectorTileResult{}, err
		}

		geometry, err := geojson.UnmarshalGeometry([]byte(geoJSON))
		if err != nil {
			return VectorTileResult{}, err
		}
		feature := geojson.NewFeature(geometry.Geometry())
		featureCollection.Append(feature)
	}

	layers := mvt.NewLayers(map[string]*geojson.FeatureCollection{
		"default": featureCollection,
	})
	layers.ProjectToTile(tile)
	layers.Clip(mvt.MapboxGLDefaultExtentBound)
	layers.Simplify(simplify.DouglasPeucker(1.0))
	layers.RemoveEmpty(1.0, 1.0)

	data, err := mvt.Marshal(layers)

	if err != nil {
		return VectorTileResult{}, err
	}

	fmt.Println("---")
	fmt.Println("coords: ", t)
	fmt.Println("featureCollection: ", featureCollection)
	fmt.Println("tile: ", tile)
	fmt.Println("tile bound: ", tile.Bound())
	fmt.Println("data: ", data)
	fmt.Println("---")

	return VectorTileResult{Tile: data}, nil
}

func MvtHandler(w http.ResponseWriter, r *http.Request) {
	x, err := strconv.Atoi(r.PathValue("x"))
	if err != nil {
		fmt.Println(err)
	}

	y, err := strconv.Atoi(r.PathValue("y"))
	if err != nil {
		fmt.Println(err)
	}

	z, err := strconv.Atoi(r.PathValue("z"))
	if err != nil {
		fmt.Println(err)
	}

	tileCoordinates := TileCoordinates{
		X: x,
		Y: y,
		Z: z,
	}

	vectorTile, err := GetVectorTile(tileCoordinates)

	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/protobuf")
	w.Write(vectorTile.Tile)
}
