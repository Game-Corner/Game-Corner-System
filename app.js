const Discord = require("discord.js");
const client = new Discord.Client();

function request(username) {
  var riot = new XMLHttpRequest();
  riot.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      response = this.responseText;
    }
  };
  riot.open('GET', 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + username + '?api_key=' + process.env.apikey, true);
  riot.open();
  return response
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.indexOf('API') === 0) {
    msg.reply(request(msg.content.slice(3)));
  }
});

client.login(process.env.token);
