const Discord = require("discord.js");
const client = new Discord.Client();
const https = require("https");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.indexOf('API') === 0) {
    var username = msg.content.slice(3);
    https.get('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + username + '?api_key=' + process.env.apikey, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);

      res.on('data', (d) => {
        console.log(d.id);
        // process.stdout.write(d);
      });

    }).on('error', (e) => {
      console.error(e);
  });
  }
});

client.login(process.env.token);
