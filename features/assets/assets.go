package assets

import (
	"embed"
	"io/fs"
)

func Assets(assets embed.FS) (fs.FS, error) {
	return fs.Sub(assets, "assets")
}
