package components

import (
	"strings"
)

type Attr struct {
	Key   string
	Value string
}

type Classes map[string]bool

func Cls(classes Classes, otherClasses Classes) string {
	var included []string

	for c, include := range classes {
		if include {
			included = append(included, c)
		}
	}

	if otherClasses != nil {
		for c, include := range otherClasses {
			if include {
				included = append(included, c)
			}
		}
	}

	return strings.Join(included, " ")
}
