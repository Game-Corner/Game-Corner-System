const Discord = require('discord.js');
const client = new Discord.Client();
const schedule = require('node-schedule');
const http = require("http");
const port = process.env.PORT;

const statusCodes = require('./riot-api.js');


// Server keeps the bot up with Uptime Robot pinging it
const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('server requested');
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});


// Testing node schedule
/*
schedule.scheduleJob('/5 * * * * *', function() {
  console.log('The answer to life, the universe, and everything!');
});
*/


// When discord.js client is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// When client receives a message
client.on('message', msg => {
  var msgsplit = msg.content.split('.');
  var username;
  var method;
  if (msgsplit[0] === 'API') {
    if (msgsplit.length === 3) {
      method = msgsplit[2];
      username = msgsplit[1];
    }
    else if (msgsplit.length === 2) {
      username = msgsplit[1];
    }
    if (username.match('^[A-z0-9 ]+$')) {
      https.get('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + username + '?api_key=' + process.env.apikey, (res) => {
        res.on('data', (d) => {
          var response = JSON.parse(d);
          var methodResponse = response[method];
          var userResponse = JSON.stringify(response);
          console.log('Riot API statusCode: ' + res.statusCode);
          statusCodes.statusCodesFunc(res.statusCode);
        });
      }).on('error', (e) => {
        console.error(e);
      });
    }
    else {
      msg.reply('Usernames can only contain letters and numbers.');
    }
  }
});

client.login(process.env.token);
