const vsprintf = require("sprintf-js").vsprintf;

/**
 * Language class
 */
class Language
{
    /**
     * Say something!
     *
     * @param id
     * @param args
     * @returns {*}
     */
    say(id, args, language)
    {
        let library = language ? language : 'language/English',
            dictionary = require(library);

        if (!dictionary.strings[id]) {
            vsprintf(dictionary.strings['UNKNOWN'], id);
        }

        return vsprintf(dictionary.strings[id], args);
    }
}

module.exports = new Language();