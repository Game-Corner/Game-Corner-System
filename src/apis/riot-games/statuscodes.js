exports.statusCodesFunc = function() {
  switch (this.res.statusCode) {
    case 400:
      msg.reply('Something went wrong with the request! Please try again.');
      break;
    case 401:
    case 403:
      msg.reply('The developer of GC-System is not authorized to use the Riot API. Please contact them for furthur details.');
      break;
    case 404:
      msg.reply('The username ' + username + ' is not found in NA1');
      break;
    case 405:
      msg.reply('The method connection is not allowed. Please contact the bot developer.');
      break;
    case 415:
      msg.reply('The username text is not supported.');
      break;
    case 422:
      msg.reply(username + ' exists, but hasn\'t played since match history collection began.');
      break;
    case 429:
      msg.reply('Too many requests are being made to the API. Please try again later.');
      break;
    case 500:
      msg.reply('There is an internal server error. Please contact the Riot Developer team here: <https://developer.riotgames.com/support/tickets/>.');
      break;
    case 502:
      msg.reply('There is a bad gateway. Please contact the developer of the bot.');
      break;
    case 503:
      msg.reply('The Riot API is currently unavailible. Please see <https://developer.riotgames.com/api-status/> for more details.');
      break;
    case 504:
      msg.reply('The response took too long. Please contact the developer of the bot.');
      break;
    case 200:
      if (msgsplit.length === 3) {
        if (methodResponse !== undefined) { 
          msg.reply('The ' + method + ' of ' + username + ' is ' + methodResponse);
        }
        else {
          msg.reply('This is not a valid name. You can find all of the names at: <https://developer.riotgames.com/api-methods/#summoner-v3/GET_getBySummonerName>');
        }
      }
      else {
        msg.reply('The data for ' + username + ' is ' + userResponse);
      }
  }
}
