const Log = require('../libs/Logging');
const XIVDBApi = require('../api/XIVDBApi');
const Language = require('../language/Language');

const LodestoneUrl = "http://na.finalfantasyxiv.com/lodestone/playguide/db/";

/**
 * Handle XIVDB Commands
 */
class HandlerXIVDB
{
    /**
     * Perform a search request to XIVDB API
     *
     * @param string
     * @param callback
     * @returns {*}
     */
    search(string, callback)
    {
        let response = [];
        XIVDBApi.search(string, results => {
            // loop through responses
            for(let category in results) {
                let result = results[category];

                // skip if no results
                if (result.total == 0) {
                    continue;
                }

                // print total for catagory
                response.push(Language.say('XIVDB_RESULTS_COUNT', [
                    result.total,
                    category,
                ]));

                // print out each result
                // This is very spammy so disabled for now.
                /*
                for(let i in result.results) {
                    let content = result.results[i];
                    response.push(Language.say('XIVDB_RESULTS_CONTENT', [
                        i,
                        content.id,
                        content.name,
                        content.url_xivdb
                    ]));
                }
                */
            }

            callback(response.join('\n'));
        });
    }

    /**
     *
     * @param string
     * @param callback
     * @returns {*}
     */
    getItem(string, callback)
    {
        let response = [];
        string = string.toLowerCase();

        XIVDBApi.search(string, results => {
            let items = results.items;

            // say total found
            /*
            response.push(Language.say('XIVDB_RESULTS_CONTENT_FOUND_TOTAL', [
                items.total
            ]));
            */

            // look for an item
            let itemId = false;
            for(let i in items.results) {
                let item = items.results[i];
                if (item.name.toLowerCase() == string) {
                    itemId = item.id;
                    break;
                }
            }

            // no id found
            if (!itemId) {
                response.push(Language.say('XIVDB_RESULTS_CONTENT_FOUND_NONE', [
                    string,
                ]));

                return callback(response.join('\n'));
            }

            // get item
            XIVDBApi.getItem(itemId, item => {
                // item not returned
                if (!item) {
                    response.push(Language.say('XIVDB_RESULTS_CONTENT_FOUND_NONE', [
                        string,
                    ]));

                    return callback(response.join('\n'));
                }

                // output item info
                response.push(Language.say('XIVDB_RESULTS_CONTENT_FOUND_ITEM', [
                    item.name,
                    item.category_name,
                    item.help ? item.help : '-',
                    item.level_equip,
                    item.level_item,
                    item.url_xivdb,
                ]));

                return callback(response.join('\n'));
            });
        })
    }

    getQuest(string, callback)
    {
        let response = [];

        XIVDBApi.getQuests(quests => {

            console.log("Trying to get quests...");

            // look for an item
            let questId = false;
            for (let i in quests) {
                let quest = quests[i];
                if (quest.name.toLowerCase() == string.toLowerCase()) {
                    console.log("Found quest.")
                    questId = quest.id;
                    break;
                }
            }

            if (!questId) {
                response.push(Language.say('XIVDB_RESULTS_CONTENT_FOUND_NONE', [
                    string,
                ]));

                return callback(response.join('\n'));
            }

            // get quest
            XIVDBApi.getQuest(questId, quest => {
                console.log("Trying to get full quest info now.")

                // quest not returned
                if (!quest) {
                    response.push(Language.say('XIVDB_RESULTS_CONTENT_FOUND_NONE', [
                        string,
                    ]));

                    return callback(response.join('\n'));
                }

                // output item info
                response.push(Language.say('XIVDB_RESULTS_QUEST_FOUND_ITEM', [
                    quest.name,
                    LodestoneUrl + "/" + quest.lodestone_type + "/" + quest.lodestone_id
                ]));

                return callback(response.join('\n'));
            });
        });
    }
}

module.exports = new HandlerXIVDB();