const Log = require('../libs/Logging');
const Commands = require('./Commands');
const HandlerXIVDB = require('./HandlerXIVDB');
const HandlerXIVSync = require('./HandlerXIVSync');
const Language = require('../language/Language');

/**
 * Command handler class
 */
class Handler
{
    constructor()
    {
        // response queues
        this.queues = {};
    }

    /**
     * Read a message to check if it's an MogNet command.
     *
     * @param string
     */
    read(message, callback)
    {
        this.queues[message.author.id] = callback;

        // get string and text
        let string = message.content.toLowerCase(),
            text = string.split(' ');

        // handle any full text strings
        this.handleString(string, message);

        // if it's a command, handle that
        if ((text[0] == Commands.COMMAND_KEY)) {
            this.handleCommand(text[0], text, message);
        }
    }

    /**
     * Response to the message
     *
     * @param message - the original message sent by the user
     * @param text
     */
    respond(message, text)
    {
        // call users function
        return this.queues[message.author.id](text);
    }

    // -------------------------------------
    // Command building
    // -------------------------------------

    /**
     * Handle a full text string
     *
     * @param text
     * @param message
     */
    handleString(text, message)
    {
        // full strings
        switch(text)
        {
            case Commands.GLOBAL_HELLO:
            case Commands.GLOBAL_HI:
                return this.respond(message, Language.say('HELLO', [
                    message.author.username
                ]));
        }
    }

    /**
     * Handle a command
     *
     * @param command
     * @param text
     * @param message
     * @returns {*}
     */
    handleCommand(command, text, message)
    {
        if (!text[1]) {
            return this.setResponse(message, Language.say('NO_COMMAND'));
        }

        var type = text[1];
        switch (type)
        {
            // search lodestone
            case Commands.KUPO_BOT_LODESTONE:
                return HandlerXIVSync.search(text, response => {
                    this.respond(message, response);
                });
                break;

            // search XIVDB
            case Commands.COMMAND_XIVDB_GET_ITEM:
                var fields = [ 'name', 'category_name', 'help', 'level_equip', 'level_item', 'url_xivdb' ];
                return HandlerXIVDB.getObject(text.slice(2).join(' '), type, 'XIVDB_RESULTS_CONTENT_FOUND_ITEM', fields, response => {
                    this.respond(message, response);
                });
                break;
            case Commands.COMMAND_XIVDB_GET_RECIPE:
                var fields = ['name', 'class_name', 'url_xivdb'];
                return HandlerXIVDB.getObject(text.slice(2).join(' '), type, 'XIVDB_RESULTS_RECIPE_FOUND_ITEM', fields, response => {
                    this.respond(message, response);
                });
                break;
            case Commands.COMMAND_XIVDB_GET_SHOP:
            case Commands.COMMAND_XIVDB_GET_STATUS:
            case Commands.COMMAND_XIVDB_GET_TITLE:
            case Commands.COMMAND_XIVDB_GET_WEATHER:
            case Commands.COMMAND_XIVDB_GET_PLACENAME:
            case Commands.COMMAND_XIVDB_GET_NPC:
                var fields = ['name', 'placename/name', 'position', 'url_xivdb'];
                return HandlerXIVDB.getObject(text.slice(2).join(' '), type, 'XIVDB_RESULTS_NPC_FOUND_ITEM', fields, response => {
                    this.respond(message, response);
                });
                break;
            case Commands.COMMAND_XIVDB_GET_MOUNT:
            case Commands.COMMAND_XIVDB_GET_MINION:
            case Commands.COMMAND_XIVDB_GET_INSTANCE:
            case Commands.COMMAND_XIVDB_GET_EMOTE:
            case Commands.COMMAND_XIVDB_GET_ACTION:
            case Commands.COMMAND_XIVDB_GET_ACHIEVEMENT:
            case Commands.COMMAND_XIVDB_GET_LEVE:
            case Commands.COMMAND_XIVDB_GET_ENEMY:
            case Commands.COMMAND_XIVDB_GET_FATE:
            case Commands.COMMAND_XIVDB_GET_QUEST:
                return HandlerXIVDB.getObject(text.slice(2).join(' '), type, undefined, undefined,  response => {
                    this.respond(message, response);
                });
                break;

            // general search
            return HandlerXIVDB.search(text.slice(2).join(' '), response => {
                this.respond(message, response);
            });

        }
    }
}

module.exports = new Handler();