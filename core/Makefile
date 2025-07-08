run2: modules

clean_modules:
	rm -f 'package-lock.json'
	rm -rf 'node_modules'

node_modules:
	npm install

package-lock.json:
	npm install

modules: node_modules package-lock.json

remodule: clean_modules modules

.PHONY: run clean_modules modules remodules
