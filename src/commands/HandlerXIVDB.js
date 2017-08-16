const Log = require('../libs/Logging');
const XIVDBApi = require('../api/XIVDBApi');
const Language = require('../language/Language');

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

    /*
     * Generic method to return an item and lodestone url
     */
    getObject(string, type, responseTemplate, fields, callback)
    {
        if (responseTemplate == undefined)
        {
            responseTemplate = 'XIVDB_RESULTS_GENERIC_FOUND_ITEM';
        }

        if (fields == undefined)
        {
            fields = ['name', 'url_xivdb'];
        }

        let response = [];

        XIVDBApi.getList(type, results =>
        {
            console.log("Trying to get " + type + " object...");

            // look for an item
            let id = false;
            for (let i in results)
            {
                let result = results[i];
                if (result.name.toLowerCase() == string.toLowerCase())
                {
                    console.log("Found " + type + ".")
                    id = result.id;
                    break;
                }
            }            

            if (!id)
            {
                response.push(Language.say('XIVDB_RESULTS_CONTENT_FOUND_NONE', [
                   string,
                ]));

                return callback(response.join('\n'));
            }
            else
            {
                // get object
                XIVDBApi.getObject(id, type, result => {

                    var fieldValues = [];
                    for (let i in fields) {
                        var nestedFields = fields[i].split("/");
                        if (nestedFields.length > 1) {
                            if (result[nestedFields[0]] != null && result[nestedFields[0]] != undefined) {
                                console.log(result[nestedFields[0]][nestedFields[1]]);
                                fieldValues.push(result[nestedFields[0]][nestedFields[1]]);
                            }
                            else {
                                fieldValues.push('-');
                            }
                        }
                        else {
                            console.log(result[fields[i]]);
                            fieldValues.push(result[fields[i]]);
                        }
                    }

                    response.push(Language.say(responseTemplate, fieldValues));
                    return callback(response.join('\n'));
                });
            }
        });
    }
}

module.exports = new HandlerXIVDB();