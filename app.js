var twilio = require('twilio');
var http = require('http');
var accountSid = 'AC39276feef00008158a3392e316a7bdfe'; // Your Account SID from www.twilio.com/console
var authToken = 'bb15952c282da95f5751a41ff089cf71';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

/*
client.messages.create({
    body: 'Hello from Node',
    to: '+16464095596',  // Text this number
    from: '+19177463670' // From a valid Twilio number
}, function(err, message) {
    console.log(message.sid);
});

*/



