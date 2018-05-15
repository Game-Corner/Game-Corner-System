const Discord = require('discord.js');
const client = new Discord.Client();
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
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


var rule = new schedule.RecurrenceRule();
rule.hour = 17;
 
var j = schedule.scheduleJob(rule, function() {
  const nodemailer = require('nodemailer');
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '', // sender address
        to: process.env.email, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  j;
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
            switch (res.statusCode) {
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
