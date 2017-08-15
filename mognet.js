require('app-module-path').addPath('./src/');
const vsprintf = require('sprintf-js').vsprintf;
const config = require('src/app/config.js');

// import the discord.js module
const Discord = require('discord.js');
const bot = new Discord.Client();

// import custom code
const Commands = require('commands/Handler');
const Log = require('libs/Logging');

Log.echo('Starting ...');
bot.on('ready', () => {
    Log.echo('I am ready!');
    Log.line();
});

// create an event listener for messages
bot.on('message', message => {
    Commands.read(message, response => {
        Log.echo("{username:red}: {message}", {
            username: message.author.username,
            message: message.content,
        });

        Log.echo(">> {response:green}", {
            response: response,
        });

        message.reply('\n' + response);
    });
});

// login our bot
Log.echo('Logging in ...');
bot.login(config.botToken);