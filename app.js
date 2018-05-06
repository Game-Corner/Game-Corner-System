const Discord = require("discord.js");
const client = new Discord.Client();
const https = require("https");

const server = https.createServer((req, res) => {
  res.end();
});
server.listen(8000);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.indexOf('API.') === 0) {
    var content = msg.content;
    var reststring = content.slice(4);
    var propertyPos = reststring.indexOf('.');
    var username = reststring.slice(0, propertyPos);
    var property = reststring.slice(propertyPos + 1);
    https.get('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + username + '?api_key=' + process.env.apikey, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);

      res.on('data', (d) => {
        var response = JSON.parse(d);
        msg.reply('The ' + property + ' of ' + username + ' is ' + response[property]);
      });

    }).on('error', (e) => {
      console.error(e);
    });
  }
});

client.login(process.env.token);
