const Discord = require("discord.js");
const client = new Discord.Client();
const http - require('http');

function request(username) {
  http.get('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + username + '?api_key=' + process.env.apikey, (res) => {
  return res
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.indexOf('API') === 0) {
    msg.reply(request(msg.content.slice(3)));
  }
});

client.login(process.env.token);
