package places

import (
	"database/sql"
	"errors"

	"github.com/mattn/go-sqlite3"
)

var Conn *sql.DB

type entrypoint struct {
	lib  string
	proc string
}

var LibNames = []entrypoint{
	{"mod_spatialite", "sqlite3_modspatialite_init"},
	{"mod_spatialite.dylib", "sqlite3_modspatialite_init"},
	{"libspatialite.so", "sqlite3_modspatialite_init"},
	{"libspatialite.so.5", "spatialite_init_ex"},
	{"libspatialite.so", "spatialite_init_ex"},
}

var ErrSpatialiteNotFound = errors.New("spatialite extension not found.")

func Setup(url string) error {
	if url == "" {
		return errors.New("DATABASE_URL missing")
	}

	sql.Register("spatialite", &sqlite3.SQLiteDriver{
		ConnectHook: func(conn *sqlite3.SQLiteConn) error {
			for _, v := range LibNames {
				if err := conn.LoadExtension(v.lib, v.proc); err == nil {
					return nil
				}
			}
			return ErrSpatialiteNotFound
		},
	})

	conn, err := sql.Open("spatialite", url)
	Conn = conn
	if err != nil {
		return err
	}

	return nil
}
