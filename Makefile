start-prod:
	@NODE_ENV=production ./node_modules/.bin/nodemon server.js

start-dev:
	@NODE_ENV=development ./node_modules/.bin/nodemon server.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha -t 100000

.PHONY: start-prod start-dev test
