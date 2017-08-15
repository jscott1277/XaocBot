const Log = require('libs/Logging');
const Commands = require('commands/Commands');
const HandlerXIVDB = require('commands/HandlerXIVDB');
const HandlerXIVSync = require('commands/HandlerXIVSync');
const Language = require('language/Language');

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

        //
        // The priority of your commands needs to be in the correct order, eg:
        // !mog find item <name>
        // !mog find <name>
        //
        // Commands can sub devide down to multiple switches
        // > find <name>
        // > find > item > <name>
        //
        switch(text[1])
        {
            // search lodestone
            case Commands.KUPO_BOT_LODESTONE:
                return HandlerXIVSync.search(text, response => {
                    this.respond(message, response);
                });

            // search XIVDB
            case Commands.COMMAND_XIVDB_SEARCH:
                switch(text[2]) {
                    // find an item
                    case Commands.COMMAND_XIVDB_GET_ITEM:
                        return HandlerXIVDB.getItem(text.slice(3).join(' '), response => {
                            this.respond(message, response);
                        });
                }

                // general search
                return HandlerXIVDB.search(text.slice(2).join(' '), response => {
                    this.respond(message, response);
                });

        }
    }
}

module.exports = new Handler();