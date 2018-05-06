const Discord = require("discord.js");
const client = new Discord.Client();
const https = require("https");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.indexOf('API.') === 0) {
    var content = msg.content;
    var reststring = content.slice(4);
    var propertyVal = reststring.indexOf('.');
    var username = reststring.slice(0, propertyVal);
    var property = reststring.slice(propertyVal + 1);
    https.get('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + username + '?api_key=' + process.env.apikey, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);

      res.on('data', (d) => {
        var response = JSON.parse(d);
        console.log(response. + property);
        msg.reply('The ' + property + ' of ' + username + ' is ' + 'yay');
      });

    }).on('error', (e) => {
      console.error(e);
    });
  }
});

client.login(process.env.token);
