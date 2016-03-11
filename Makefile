test:
	@NODE_ENV=test ./node_modules/.bin/mocha -t 100000

.PHONY: test
