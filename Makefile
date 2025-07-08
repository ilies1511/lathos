.DEFAULT_GOAL := shell

build:
	docker-compose build app

up: build
	docker-compose up app

up-detach: build
	docker-compose up -d app

shell: build
	docker-compose run --rm --service-ports app sh

clean:
	docker-compose down --rmi all --volumes --remove-orphans

restart: down up

re: ff_clean_docker shell


kill_node:
	kill -9 $(pidof node)

run: game_shared
	npm run dev

i:
	npm i

test:
	npx vitest run

down:
	docker compose down

ff_clean_docker:
	$$(docker stop $(docker ps -aq) | true)
	$$(docker rm $(docker ps -aq) | true)
	$$(docker rmi $(docker images -q) | true)
	$$(docker volume rm $(docker volume ls -q) | true)
	$$(docker network rm $(docker network ls -q) | true)
	docker system prune -a --volumes --force

run2: modules

node_modules:
	npm install

clean_modules:
	rm -f 'package-lock.json'
	rm -rf 'node_modules'

modules: node_modules package-lock.json

remodule: clean_modules modules

.PHONY: all \
	build \
	up \
	up-detach \
	shell \
	down \
	clean \
	restart \
	ps \
	re \
	all \
	ff_clean_docker \
	run_izi \
	logs \
	i \
	remodules \
	modules \
	clean_modules \
	node_modules \
	run
