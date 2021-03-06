const Log = require('../libs/Logging');
const XIVDBApi = require('../api/XIVDBApi');
const Language = require('../language/Language');
const jsonQuery = require('json-query');

/**
 * Handle XIVDB Commands
 */
class HandlerXIVDB {
    /**
     * Perform a search request to XIVDB API
     *
     * @param string
     * @param callback
     * @returns {*}
     */
    search(string, type, callback) {
        let response = [];
        XIVDBApi.search(string, type, results => {

            if (type.trim() != '') {

                // print out up to top 10 results
                for (let i in results[type].results) {
                    if (i < 10) {
                        let typeResult = results[type].results[i];
                        response.push(Language.say('XIVDB_RESULTS_CONTENT', [
                            +i + +1,
                            typeResult.name,
                            typeResult.url_xivdb
                        ]));
                    }
                }

                callback(response.join('\n'));

            } else {

                // loop through responses
                for (let category in results) {
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

                    // print out up to top 3 results
                    for (let i in result.results) {
                        if (i < 4) {
                            let content = result.results[i];
                            response.push(Language.say('XIVDB_RESULTS_CONTENT', [
                                +i + +1,
                                content.name,
                                content.url_xivdb
                            ]));
                        }
                    }
                }

                callback(response.join('\n'));
            }
        });
    }

    /**
     *
     * @param string
     * @param callback
     * @returns {*}
     */
    getItem(string, callback) {
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
            for (let i in items.results) {
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
    getObject(string, type, responseTemplate, fields, callback) {
        if (responseTemplate == undefined) {
            responseTemplate = 'XIVDB_RESULTS_GENERIC_FOUND_ITEM';
        }

        if (fields == undefined) {
            fields = ['name', 'url_xivdb'];
        }

        let response = [];

        XIVDBApi.getList(type, results => {
            console.log("Trying to get " + type + " object...");

            // look for an item
            let id = false;
            for (let i in results) {
                let result = results[i];
                if (result.name.toLowerCase() == string.toLowerCase()) {
                    console.log("Found " + type + ".")
                    id = result.id;
                    break;
                }
            }

            if (!id) {
                response.push(Language.say('XIVDB_RESULTS_CONTENT_FOUND_NONE', [
                   string,
                ]));

                return callback(response.join('\n'));
            }
            else {
                // get object
                XIVDBApi.getObject(id, type, result => {

                    var fieldValues = [];
                    for (let i in fields) {
                        var val = jsonQuery(fields[i], { data: result }).value;
                        if (val != null) {
                            fieldValues.push(val);
                        } else {
                            fieldValues.push("n/a");
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