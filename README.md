# TextAnalyser

## Installation
This app requires these NPM modules:

`npm install rita`
`npm install twit`


## Running the server
1. Navigate to the server directory `cd ./server/`
2. Start up the server `node server.js`
3. Verify that the server is running on `http://localhost:9003/`

## Client

The client can be found in `client/autocorrect_js`.

The server supports one GET call:

## run in production

I'm running the service as a standalone node service:
`nohup node server.js > /var/log/markov.log & `

Nginx proxies this service through to port 80:

`
        location /autocomplete-api {
                proxy_pass                      http://localhost:8099;
                proxy_set_header Host           $host;
                proxy_set_header X-Real-IP      $remote_addr;
        }
`

