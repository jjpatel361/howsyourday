var twilio = require('twilio');
var http = require('http');
var accountSid = 'APf1fc20c976d81668bf558db3df06dedb'; // Your Account SID from www.twilio.com/console
var authToken = 'bb15952c282da95f5751a41ff089cf71';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);


http.createServer(function (req, res) {
    //Create TwiML response
    var twiml = new twilio.TwimlResponse();
    twiml.say("Hello from your pals at Twilio! Have fun.");

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());

}).listen(1337, '127.0.0.1');

console.log('TwiML servin\' server running at http://127.0.0.1:1337/');
