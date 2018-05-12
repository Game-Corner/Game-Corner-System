const statusCodes = require('./apis/riot-games/statuscodes.js');
const Discord = require("discord.js");
const client = new Discord.Client();
const https = require("https");
const port = process.env.PORT;

// Server keeps the bot with Uptime Robot pinging it
const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('GC-System active.');
}

const server = https.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

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
          console.log(res.statusCode);
          statusCodes.statusCodesFunc();
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
