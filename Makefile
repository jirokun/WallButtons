.PHONY: setup
setup:
	@cd frontend && npm install

.PHONY: update
update:
	@git pull

.PHONY: deploy
deploy: frontend/dist
	@cp -r frontend/dist backend/public

frontend/dist:
	@cd frontend && npm run-script build

.PHONY: clean
clean:
	@rm -fr backend/public
	@rm -fr frontend/dist
