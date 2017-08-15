const vsprintf = require("sprintf-js").vsprintf;
const Log = require('libs/Logging');
const XIVSyncApi = require('api/XIVSyncApi');
const Language = require('language/Language');

/**
 * Handle XIVSync Commands
 */
class HandlerXIVSync
{
    /**
     * Perform a search request to XIVSync API
     *
     * @param string
     * @param callback
     * @returns {*}
     */
    search(text, callback)
    {
        // check
        if (!text[2] || !text[3]) {
            return callback(Language.say('LODESTONE_CHARACTER_NO_NAME'));
        }

        if (!text[4]) {
            return callback(Language.say('LODESTONE_CHARACTER_NO_SERVER'));
        }

        let response = [],
            name = [text[2], text[3]].join(' '),
            server = text[4];

        // search for character
        XIVSyncApi.search(name, server, results => {
            if (!results.results.length == 0) {
               return callback(Language.say('LODESTONE_CHARACTER_CONTENT_NOTFOUND'));
            }

            let characterId = false;
            for(let i in results.results) {
               let character = results.results[i];

               if (character.name.toLowerCase() == name.toLowerCase()) {
                   characterId = character.id;
               }
            }

            // still not found
            if (!characterId) {
               return callback(Language.say('LODESTONE_CHARACTER_CONTENT_NOTFOUND'));
            }

            XIVSyncApi.getCharacter(characterId, character => {
                response.push(Language.say('LODESTONE_CHARACTER_CONTENT_FOUND', [
                    character.name,
                    character.server,
                    character.title,
                    character.active_class.level,
                    character.active_class.name,
                    character.portrait
                ]));
            });


            callback(response.join('\n'));
        });
    }
}

module.exports = new HandlerXIVSync();