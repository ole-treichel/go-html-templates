package places

type Place struct {
	Id          int
	Geom        string
	Name        string
	Description string
	Bounds      string
}

func GetAllPlaces() ([]Place, error) {
	rows, err := Conn.Query(
		"select id, AsGeoJSON(geom) as geom, name, description, AsGeoJSON(Envelope(geom)) as bounds from places",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var places []Place

	for rows.Next() {
		var place Place

		if err := rows.Scan(&place.Id, &place.Geom, &place.Name, &place.Description, &place.Bounds); err != nil {
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

func DeletePlace(id string) error {
	_, err := Conn.Exec(
		"delete from places where id = $1",
		id,
	)

	if err != nil {
		return err
	}

	return nil
}

func GetPlace(id string) (*Place, error) {
	var place Place
	err := Conn.QueryRow(
		"select id, AsGeoJSON(geom) as geom, name, description, AsGeoJSON(Envelope(geom)) as bounds from places where id = $1",
		id,
	).Scan(&place.Id, &place.Geom, &place.Name, &place.Description, &place.Bounds)

	if err != nil {
		return nil, err
	}

	return &place, nil
}

func UpdatePlace(place Place) error {
	res, err := Conn.Exec(
		"update places set geom = SetSRID(GeomFromGeoJSON($1), 4326), name = $2, description = $3 where id = $4",
		place.Geom,
		place.Name,
		place.Description,
		place.Id,
	)

	_, err = res.RowsAffected()
	_, err = res.LastInsertId()

	if err != nil {
		return err
	}

	return err
}
