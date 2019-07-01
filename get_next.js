var Twit = require('twit');
var request = require('request');
var fs = require('fs');
var csvparse = require('csv-parse');
var rita = require('rita');
var rhyme = require('rhyme-plus');

fs.readFile("cleaned/shakespeare.txt", "utf8", function (err, data) {
    if (err) {
        throw err;
    }
    // generateSentence(data, 2, 4);
    console.log(getNextWords(data, "To", 4));
});

// function generateSentence(text, ngrams, sentences) {
//     var markov = new rita.RiMarkov(ngrams);
//     markov.loadText(text);
//   //  console.log(markov.getProbabilities('All'));
//     var sentences = markov.generateSentences(sentences);
//     console.log(sentences);
// }

function getNextWords(text, word, amount) {
    var markov = new rita.RiMarkov(2);
    markov.loadText(text);
    probabilities = markov.getProbabilities('All');
    var sorted = [];
    for (var n in probabilities) {
        sorted[sorted.length] = [n, probabilities[n]];
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
    return sorted.splice(0, amount);
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