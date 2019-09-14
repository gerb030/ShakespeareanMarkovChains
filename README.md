# TextAnalyser

## installation
This app requires these NPM modules:

`npm install rita`

`npm install twit`


## running the server
1. Navigate to the server directory `cd ./server/`
2. Start up the server `node server.js`
3. Verify that the server is running on `http://localhost:8099/` - it should return `200 OK` and an empty JSON array. 

## API docs
 
The server supports one GET call to retrieve a list of suggested words. The condition for these words to be returned is that the first characters from each   from the Markov chain  the characters given . When no 

`http://HOSTNAME:PORT/autocomplete-api/?precedingWord=PRECEDING_WORD&context=CONTEXT`

For example:
`http://localhost:8099/autocomplete-api/?precedingWord=the&context=a`

### Parameters
| name | type | mandatory | description |
|------|------|-----------|------------ |
| precedingWord | String | No | The word preceding the first characters submitted for autocompletion |
| context | String | Yes | The first characters  |

Responses are in the JSON format.


## client

The client can be found in `client/autocorrect_js`.


## run in production

I'm running the service as a standalone node service:
`nohup node server.js > /var/log/markov.log & `

Nginx proxies this service through to port 80:

        location /autocomplete-api {
                proxy_pass                      http://localhost:8099;
                proxy_set_header Host           $host;
                proxy_set_header X-Real-IP      $remote_addr;
        }


