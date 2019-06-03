var Twit = require('twit');
var request = require('request');
var fs = require('fs');
var csvparse = require('csv-parse');
var rita = require('rita');
var rhyme = require('rhyme-plus');

fs.readFile("sonnets.txt", "utf8", function (err, data) {
    if (err) {
        throw err;
    }
    // generateSentence(data, 2, 4);
    console.log("\n"+createSonnet(4, data, 2)+"\n");
});

// function generateSentence(text, ngrams, sentences) {
//     var markov = new rita.RiMarkov(ngrams);
//     markov.loadText(text);
//   //  console.log(markov.getProbabilities('All'));
//     var sentences = markov.generateSentences(sentences);
//     console.log(sentences);
// }

function createSonnet(lines, text, ngrams) {
    var sonnet = "";
    sonnet += generatePoemLine(text, ngrams, null);
    for (var i=1;i<lines;i++) {
        var rhymesWith = sonnet.substr(sonnet.lastIndexOf(" ")).trim().replace(/\W+/, "");
        sonnet += "\n" + generatePoemLine(text, ngrams, rhymesWith);
    }
    return sonnet;
}

function generatePoemLine(text, ngrams, rhymesWith) {
    var markov = new rita.RiMarkov(ngrams);
    markov.loadText(text);
    if (rhymesWith != null) {
        var lastWordFromLine = "zyxxy";
        var rhymingWords = [];
        var line = "";
        while (!rhymingWords.includes(lastWordFromLine)) {
            line = markov.generateSentences(1)[0];
            return line;
            lastWordFromLine = line.substr(line.lastIndexOf(" ")).trim().replace(/\W+/, "");
            console.log(lastWordFromLine);
            //rhymingWords = new rita.rhymes(lastWordFromLine);                
        }
        return line;
    }
    return markov.generateSentences(1)[0];
}


/*

var bot = new Twit({
    consumer_key: process.env.TWITTERBOT_CONSUMER_API_KEY,
    consumer_secret: process.env.TWITTERBOT_CONSUMER_API_SECRET,
    access_token: process.env.TWITTERBOT_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTERBOT_ACCESS_TOKEN_SECRET,
    timeout_ms: 60*1000,
})


bot.get('followers/list', {screen_name: 'thebardbot'}, function(err, data, response)
    {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }       
    });
*/
/*
bot.post('statuses/update', {status: 'You are well met!'}), function(err, data, response){
    if (err) {
        console.log(err);
    } else {
        console.log(data.text + " was tweeted.");
    }
}
*/