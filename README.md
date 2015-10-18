# metavrse.io by Unbound VR \m/
[![Travis build](https://travis-ci.org/UnboundVR/metavrse.io.svg?branch=dev)](https://travis-ci.org/UnboundVR/metavrse.io) 
[![Slack Status](http://metavrse.io:3000/badge.svg)](http://metavrse.io)

**Get dependencies**: `npm install`. You should also have gulp installed globally (`npm install gulp -g`).

**Run**: `gulp js` (runs watchify), then `node app`, then navigate to `http://localhost:1337` (or whatever port you specified in environment variables | .env file).

**Build**: `gulp`.

**Run tests**: `npm test`.

**Code style**: `gulp jscs` will fix code style errors in all relevant folders using `jscs --fix`.

**Populate Couchbase DB with boilerplate scene**: `npm run populate-db` (takes connection settings from environment variables | .env file). *Couchbase* is an optional dependency; if you don't have it, you can run the app fetching the scene directly from the `db/scene.json` file (a request to `/api/scene` will do that).

---
