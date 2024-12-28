package places

type Place struct {
	Id          int
	Name        string
	Description string
	Bounds      string
}

func GetAllPlaces() ([]Place, error) {
	rows, err := Conn.Query(
		"select id, name, description, AsGeoJSON(Envelope(geom)) as bounds from places",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var places []Place

	for rows.Next() {
		var place Place

		if err := rows.Scan(&place.Id, &place.Name, &place.Description, &place.Bounds); err != nil {
			return nil, err
		}

		places = append(places, place)
	}

	return places, nil
}

type PlaceInput struct {
	Name        string
	Description string
	Geom        string
}

func CreatePlace(input PlaceInput) error {
	_, err := Conn.Exec(
		"insert into places (name, description, geom) values($1, $2, SetSRID(GeomFromGeoJSON($3), 4326))",
		input.Name,
		input.Description,
		input.Geom,
	)

	if err != nil {
		return err
	}

	return nil
}
