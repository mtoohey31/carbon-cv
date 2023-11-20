carbon-resume: main.go go.mod go.sum index.html.gotmpl schema.json
	go build -o $@ .

schema.json: schema.yaml
	yaml2json $< $@

.PHONY: clean
clean:
	rm -f carbon-resume schema.json
