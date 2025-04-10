help:
	@echo "Liste des commandes disponibles :"
	@grep -E '^[1-9a-zA-Z_-]+(\.[1-9a-zA-Z_-]+)?:.*?## .*$$|(^#--)' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m %-43s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m #-- /[33m/'

#-- GIT
clean-merged-branches: ## Supprime les branches mergées
	git branch --merged | grep -v '\*\|master\|dev\|prod\|main\|test' | xargs -n 1 git branch -d
	git branch -r --merged | grep -v '\*\|master\|dev\|prod\|main\|test' | sed 's/origin\///' | xargs -n 1 git push --delete origin

#-- COMPONENTS
component.add: ## Ajoute un composant de shadcn
	npx shadcn-ui@latest add 
