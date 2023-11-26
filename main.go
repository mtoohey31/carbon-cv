package main

import (
	"bytes"
	"context"
	_ "embed"
	"encoding/json"
	"fmt"
	"html/template"
	"os"
	"strings"

	"github.com/alecthomas/kong"
	"github.com/qri-io/jsonschema"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/text"
	"gopkg.in/yaml.v3"
)

var (
	//go:embed schema.json
	schemaBytes []byte
	//go:embed index.html.gotmpl
	templateString string
)

var cli struct {
	ResumePath string `arg:"" type:"existingfile" help:"The path of your resume."`
}

func main() {
	kong.Parse(&cli)

	// Unmarshal and validate data.

	schema := &jsonschema.Schema{}
	if err := json.Unmarshal(schemaBytes, schema); err != nil {
		// This is a panic because the schema is built into the binary and
		// parsing it should never fail.
		panic(fmt.Sprintf("schema parse failed: %s", err))
	}

	resumeBytes, err := os.ReadFile(cli.ResumePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "resume read failed: %s\n", err)
		os.Exit(1)
	}

	var resume map[string]any
	if err := yaml.Unmarshal(resumeBytes, &resume); err != nil {
		fmt.Fprintf(os.Stderr, "resume parse failed: %s\n", err)
		os.Exit(1)
	}

	errs := *schema.Validate(context.Background(), resume).Errs
	switch len(errs) {
	case 0:
		break

	case 1:
		fmt.Fprintf(os.Stderr, "resume validation failed: %s\n", errs[0])
		os.Exit(1)

	default:
		fmt.Fprintln(os.Stderr, "resume validation failed:")
		for _, err := range errs {
			fmt.Fprintln(os.Stderr, err)
		}
		os.Exit(1)
	}

	// Template setup.

	tmpl := template.New("resume")
	markdown := goldmark.New()
	tmpl.Funcs(template.FuncMap{
		"join": func(a []any, sep string) string {
			elems := make([]string, len(a))
			for i, a := range a {
				elems[i] = fmt.Sprint(a)
			}
			return strings.Join(elems, sep)
		},
		"isString": func(a any) bool {
			_, ok := a.(string)
			return ok
		},
		"hasEnabledItems": func(m map[string]any) (bool, error) {
			items, ok := m["items"].([]any)
			if !ok {
				return false, fmt.Errorf("non-section passed")
			}

			for _, item := range items {
				item_, ok := item.(map[string]any)
				if !ok {
					return false, fmt.Errorf("non-section passed")
				}

				disabled, found := item_["disabled"]
				if !found {
					return true, nil
				}

				disabled_, ok := disabled.(bool)
				if !ok {
					return false, fmt.Errorf("non-section passed")
				}

				if ok && !disabled_ {
					return true, nil
				}
			}

			return false, nil
		},
		"markdown": func(s string) (template.HTML, error) {
			source := []byte(s)
			doc := markdown.Parser().Parse(text.NewReader(source))

			var b bytes.Buffer
			err := markdown.Renderer().Render(&b, source, doc)
			return template.HTML(strings.TrimSpace(b.String())), err
		},
	})
	tmpl, err = tmpl.Parse(templateString)
	if err != nil {
		// Same as above, we panic because this should never fail.
		panic(fmt.Sprintf("template parse failed: %s", err))
	}

	// Rendering.

	if err := tmpl.Execute(os.Stdout, resume); err != nil {
		fmt.Fprintf(os.Stderr, "resume rendering failed: %s\n", err)
		os.Exit(1)
	}
}
