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
    var method = reststring.slice(propertyPos + 1);
    https.get('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + username + '?api_key=' + process.env.apikey, (res) => {
      
      res.on('data', (d) => {
        if (d == 'undefind') {
          if (res.statusCode === '400') {
            msg.reply('Something went wrong with the request! Please try again.');
          }
          if (res.statusCode === '401') {
            msg.reply('The developer of GC-System is not authorized to use the Riot API. Please contact them for furthur details.');
          }
          if (res.statusCode === '403') {
            msg.reply('The username ' + username + ' is not found in NA1');
          }
          if (res.statusCode === '404') {
            msg.reply('The username ' + username + ' is not found in NA1');
          }
          if (res.statusCode === '405') {
            msg.reply('The method ' + method + ' is not valid. Please go to <https://developer.riotgames.com/api-methods/#summoner-v3/GET_getBySummonerName> to see all availible methods.');
          }
          if (res.statusCode === '415') {
            msg.reply('The inputed text is not supported.');
          }
          if (res.statusCode === '422') {
            msg.reply(username+ ' exists, but hasn\'t played since match history collection began.');
          }
          if (res.statusCode === '429') {
            msg.reply('Too many requests are being made to the API. Please try again later.');
          }
          if (res.statusCode === '500') {
            msg.reply('There is an internal server error. Please contact the Riot Developer team here: <https://developer.riotgames.com/support/tickets/>.');
          }
          if (res.statusCode === '502') {
            msg.reply('There is a bad gateway. Please contact the developer of the bot.');
          }
          if (res.statusCode === '503') {
            msg.reply('The Riot API is currently unavailible. Please see <https://developer.riotgames.com/api-status/> for more details.');
          }
          if (res.statusCode === '504') {
            msg.reply('The response took too long. Please contact the developer of the bot.');
          }
        }  
        else {
          var response = JSON.parse(d);
          if (method.length > 1) {
            msg.reply('The ' + method + ' of ' + username + ' is ' + response[method]);
          }
          else {
            var responseElse = JSON.stringify(response);
            msg.reply('The data for ' + username + ' is ' + responseElse);
          }
        }
      });

    }).on('error', (e) => {
      console.error(e);
    });
  }
});

client.login(process.env.token);
