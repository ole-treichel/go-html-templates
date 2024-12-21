package components

type InputProps struct {
	ID          string
	Label       string
	Type        string
	Placeholder string
	Value       string
	Hint        string
	Error       string
	IsDisabled  bool
  Attrs map[string]string
}
