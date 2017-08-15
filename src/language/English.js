/**
 * English strings
 */
class English
{
    constructor()
    {
        //
        // Translate these as you wish, do not change %s, this is for dynamic variables.
        // - \n = new line.
        //
        this.strings =
        {
            //
            // General
            //
            UNKNOWN: 'I do not know how to respond... My programmer did not add an identifier for: %s',
            HELLO: 'Hello %s!',
            NO_COMMAND: 'You did not ask me anything!?',

            //
            // XIVDB
            //
            XIVDB_RESULTS_COUNT: 'Found %s results for %s',
            XIVDB_RESULTS_CONTENT: '%s: [%s] %s - %s',
            XIVDB_RESULTS_CONTENT_FOUND_NONE: 'I could not find %s',
            XIVDB_RESULTS_CONTENT_FOUND_TOTAL: 'I found %s results',
            XIVDB_RESULTS_CONTENT_FOUND_ITEM: '%s (%s)\nDescription: %s\nLevel: %s, Item Level: %s\nLink: %s',

            //
            // Lodestone
            //
            LODESTONE_CHARACTER_NO_NAME: 'No name provided kupo!',
            LODESTONE_CHARACTER_NO_SERVER: 'No server provided kupo!',
            LODESTONE_CHARACTER_CONTENT_NOTFOUND: 'I could not find that character kupo!',
            LODESTONE_CHARACTER_CONTENT_FOUND: '%s - %s\n%s\nActive Role: %s %s\n%s',
        };
    }
}

module.exports = new English();