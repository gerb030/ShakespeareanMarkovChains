/**
 * Server to 
 * http://localhost:8080/?precedingWord=this&context=de
 * 
 * Parameters
 * precedingWord    @String     the word to be matched with
 * context          @String     start of the word
 */
var http = require('http');
var fs = require('fs');
var rita = require('rita');
var markov = new rita.RiMarkov(2);
fs.readFile("cleaned/shakespeare.txt", "utf8", function (err, text) {
    if (err) {
        throw err;
    }
    markov.loadText(text);
});
/**
 * Server listener
 */
http.createServer(function (req, res) {
  var queryString = req.url.substr(req.url.indexOf("?")+1);
  var commands = getCommands(queryString);
  if (commands['precedingWord'] == "") {
    res.write("{}");
  } else {
    response = getMatchingWords(markov, commands['precedingWord'], commands['context'], 5);
    res.write(JSON.stringify(response)); //write a response to the client
  }
  res.end(); //end the response
}).listen(8099); //the server object listens on port 8080

/**
 * Will return the acceptable commands for this service
 * @param {*} queryString 
 */
function getCommands(queryString) {
    var response = {
        precedingWord : '',
        context : ''
    }
    var segments = queryString.split("&");
    for (var i=0;i<segments.length;i++) {
        if (segments[i].indexOf("=") > -1) {
            var key = segments[i].substr(0, segments[i].indexOf("="));
            key = key.replace(/\W/, "");
            if (key == "precedingWord" || key == "context") {
                var value = segments[i].substr(segments[i].indexOf("=")+1)
                value = value.replace(/\W/, "");
                response[key] = value;
            }
        }
    }
    return response;
}

/**
 * get `amount` number of matching words that meet the condition of following precedingWord, that match the start of the word (context)
 * @param {*} markov 
 * @param {*} precedingWord 
 * @param {*} context 
 * @param {*} amount 
 */
function getMatchingWords(markov, precedingWord, context, amount) {
    probabilities = markov.getProbabilities(precedingWord);
    probabilities = sort(probabilities);
    filteredWords = filterOnWordStart(probabilities, context);
    return filteredWords.splice(0, amount);
}

/**
 * filterOnWordStart given a list of strings, this will return a subset of the array list
 * @param {*} list 
 * @param {*} context 
 */
function filterOnWordStart(list, context) {
    var output = [];
    for(var n=0;n<list.length;n++) {
        if (context == list[n][0].substr(0, context.length)) {
            output.push(list[n][0]);
        }
    }
    return output;
}

/**
 * sort input
 * 
 * @param   {String[]} input 
 * @returns {String[]}  list
 */
function sort(input) {
    var sorted = [];
    for (var n in input) {
        sorted[sorted.length] = [n, input[n]];
    }
    for (var i=0;i<sorted.length;i++) {
        for (var j=sorted.length-1;j>0;j--) {
            if (sorted[j][1] > sorted[i][1]) {
                var value = [sorted[i][0], sorted[i][1]];
                sorted[i] = [sorted[j][0], sorted[j][1]];
                sorted[j] = value;
            }
        }    
    }
    return sorted;
}
