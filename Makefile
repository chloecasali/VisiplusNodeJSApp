DOCKER_COMPOSE = docker compose -f docker-compose.yml

install: ## Install all dependencies
	@echo "Building Docker containers..."
	$(DOCKER_COMPOSE) build
	@echo "Installing dependencies..."
	npm install

run: ## Launch docker-compose stack
	$(DOCKER_COMPOSE) up -d
	@echo "Running NPM serve..."
	npm run serve

logs: ## Log the Docker containers
	$(DOCKER_COMPOSE) logs --tail=10 -f

test: ## Running tests
	npm test

ps: ## List all running containers
	$(DOCKER_COMPOSE) ps

down: ## Delete the Docker containers and volumes
	$(DOCKER_COMPOSE) down -v

stop: ## Stop the Docker containers
	$(DOCKER_COMPOSE) stop