'use strict';

const express = require('express');
const twilio = require('twilio');
var bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
var mysql = require("mysql");
var schedule = require('node-schedule');
var http = require('http');
var accountSid = 'AC39276feef00008158a3392e316a7bdfe'; // Your Account SID from www.twilio.com/console
var authToken = 'bb15952c282da95f5751a41ff089cf71';   // Your Auth Token from www.twilio.com/console
var client = new twilio.RestClient(accountSid, authToken);



var connection = mysql.createConnection({
  host     : 'sampleappdbinstance.cb2tfamnh1z2.us-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'hackru2017',
  database : 'twilioapp'
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ...");    
} else {
    console.log("Error connecting database ...");    
    console.log(err);
}
});



let app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(express.static(__dirname + '/public'));



app.get('/',(request, response) => {
	console.log('The app is here');
	response.sendFile('public/index.html' , { root : __dirname});
})

var user ;

app.post('/register', (request, response) => {
  console.log('Form Available');
  console.log(request.body);
  /*connection.query('INSERT INTO users SET ? ', request.body, function(err, result){
    if(err!=null){
      console.log(err);
    }else{
      console.log('data insert successful');
      // send twilio message to the cell selected.
      sendMessage(request.body)
    }
    
  })*/
  user = response.body;
  setTimeout(sendReminder,20000, request.body);
  response.redirect('/');
})




function sendMessage() {
 console.log()
 client.messages.create({
      body: 'Hi '+ user.first_name + ", Thanks for registering. You'll start getting calls now.",
      to: user.contact  ,  // Text this number
      from: '+19177463670' // From a valid Twilio number

  }, function(err, message) {
      console.log(err);
      console.log(message.sid);
      console.log('Registeration Saved.');
  });

}


function  sendReminder(user){
  client.messages.create({
      body: 'Hi '+ user.first_name + ", How was your day.? call " + "+19177463670 to keep your memories.",
      to: user.contact  ,  // Text this number
      from: '+19177463670' // From a valid Twilio number

  }, function(err, message) {
      console.log(err);
      console.log(message.sid);
      console.log('Registeration Saved.');
  });

}


// Returns TwiML which prompts the caller to record a message 
app.post('/record', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  let twiml = new twilio.TwimlResponse();
  twiml.say('Hello. Please leave a message after the beep.');

  // Use <Record> to record the caller's message
  twiml.record({
	  action: '/saverecording'
  });

  // End the call with <Hangup>
  //twiml.hangup();

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});


function getDateTimeStamp(){
	var dt = new Date();
	var day = dt.getDate() + 
			"_" +dt.getMonth() + 
			"_" + dt.getFullYear() +
			"_" + dt.getHours() 
			"_"+ dt.getMinutes();
	return day;
}

// Returns TwiML which prompts the caller to record a message 
app.post('/saverecording', (request, response) => {
  
  console.log(request.body);
  var recording_url  = request.body.RecordingUrl;
  var dt = getDateTimeStamp();
  var file = fs.createWriteStream("recording"+ getDateTimeStamp() +".mp3");
  var request = https.get(recording_url, function(response) {
	 console.log("Writing file");
	response.pipe(file);
  });
  console.log("Done!");
  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send('');
});

console.log('started listening');
app.listen(1337);
