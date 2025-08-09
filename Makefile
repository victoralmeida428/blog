# Makefile para gerenciar as Migrations do Prisma via Docker Compose

.DEFAULT_GOAL := help

migrate-dev: ## Cria uma nova migration. Ex: make migrate-dev name=add-user
	@if [ -z "$(name)" ]; then \
		echo "Por favor, forneça um nome para a migration."; \
		echo "Exemplo: make migrate-dev name=add-user-model"; \
		exit 1; \
	fi
	@echo "Criando nova migration com o nome: $(name)..."
	docker compose exec web-dev npx prisma migrate dev --name $(name)

migrate-up: ## Aplica todas as migrations pendentes no banco de dados
	@echo "Aplicando todas as migrations pendentes..."
	docker compose exec web-dev npx prisma migrate deploy

migrate-down: ## Reseta o banco de dados (apaga todos os dados!)
	@echo "ATENÇÃO: Este comando irá apagar todos os dados do banco de dados."
	docker compose exec web-dev npx prisma migrate reset --force

help: ## Mostra esta ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

migrate-status: ## Verifica o estado atual das migrations
	@echo "Verificando o estado das migrations..."
	docker compose exec web-dev npx prisma migrate status

test:
	npm test

.PHONY: migrate-dev migrate-up migrate-down help
