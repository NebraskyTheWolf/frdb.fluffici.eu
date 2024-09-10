GIT_SHA_FETCH := $(shell git rev-parse HEAD)
export GIT_SHA=$(GIT_SHA_FETCH)

.PHONY: all build_docker

all: build_docker

build_docker:
	docker build --build-arg GIT_SHA=$(GIT_SHA_FETCH) . -t ghcr.io/nebraskythewolf/frdb-web-beta:latest
	docker push ghcr.io/nebraskythewolf/frdb-web-beta:latest
