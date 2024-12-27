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
