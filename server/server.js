/**
 * Server to 
 * http://localhost:8080/?precedingWord=this&context=de
 * 
 * Parameters
 * precedingWord    @String     the word to be matched with
 * context          @String     start of the word
 */
console.log("----------------------------------------------------------");
console.log("----------  Shakespearean  Markov Chain service ----------");
console.log("----------------------------------------------------------");
console.log("");
var PORT = 8099;
var VERBOSE_LOGGING = false;
var http = require('http');
var fs = require('fs');
var rita = require('rita');
//var rita = new rita.RiTa();
var markov = new rita.RiMarkov(2);
fs.readFile("cleaned/shakespeare.txt", "utf8", function (err, text) {
    if (err) {
        throw err;
    }
    markov.loadText(text);
    console.log("✓ Markov chains active");
    console.log("Your sample sentence: " + markov.generateSentence());
    console.log("");
    console.log("----------------------------------------------------------");
});
/**
 * Server listener
 */
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  var queryString = req.url.substr(req.url.indexOf("?")+1);
  var commands = getCommands(queryString);
  error_log("Request: " + JSON.stringify(commands));
  if (commands['context'] == "" && commands['precedingWord'] == "") {
    error_log("Empty request, returning empty array.");
    res.write("[]");
  } else if (commands['precedingWord'] == "") { // in case of a new sentence, just give a random option
    response = [getSentenceStart(1)];
    error_log("Response: " + JSON.stringify(response))
    res.write(JSON.stringify(response)); //write a response to the client
  } else {
    response = getMatchingWords(markov, commands['precedingWord'], commands['context'], 30);
    error_log("Response: " + JSON.stringify(response))
    res.write(JSON.stringify(response)); //write a response to the client
  }
  res.end(); //end the response
}).listen(PORT); //the server object listens on port 8080
console.log("✓ Server started successfully, listening at port " + PORT);

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
                var value = segments[i].substr(segments[i].indexOf("=")+1);
                value = decodeURI(value);
                value = value.replace(/\s+/, "");
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
    // let's remove non-word characters at the end or the start of the word
    error_log("1 "+ precedingWord);
    precedingWord = precedingWord.replace(/[<>{}/\[\]]+/g, "");
    error_log("2 " + precedingWord);
    probabilities = markov.getProbabilities(precedingWord);
    error_log(JSON.stringify(probabilities));
    probabilities = sort(probabilities);
    filteredWords = filterOnWordStart(probabilities, context);
    error_log(JSON.stringify(filteredWords));
    return filteredWords.splice(0, amount);
}


function getSentenceStart(numberOfWords) {
    sentence = markov.generateSentence(numberOfWords);
    var segments = sentence.split(/\s+/);
    return segments[0];
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
    // in case no matches were found, just show the raw Markov chain results
    if (output.length == 0) {	
        for(var n=0;n<list.length;n++) {
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

function error_log(logmsg) {
    if (VERBOSE_LOGGING) {
        var d = new Date();
        var dateStr = d.getFullYear()+"-"+(d.getMonth()<10 ? "0" : "")+d.getMonth()+"-"+(d.getDay()<10 ? "0" : "")+d.getDay()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds();
        console.log(dateStr + " - " + logmsg);
    }
} 