const vsprintf = require("sprintf-js").vsprintf;
const query = require('query-string');
const https = require('https');
const Log = require('../libs/Logging');

// Endpoint
const API_ENDPOINT = 'api.xivdb.com';

/**
 * API actions on XIVDB
 */
class XIVDBApi
{
    /**
     * Query XIVDB
     *
     * @param callback - 1st for syntax readability reasons
     * @param path
     */
    query(callback, path)
    {
        console.log("Starting query to XIVDB");

        // request options
        let options = {
            host: API_ENDPOINT,
            port: 443,
            path: path,
        }

        Log.echo('[XIVDB] Get: {url:cyan}', {
            url: (options.host + options.path),
        });

        // request
        let json = '';
        https.get(options, function(res) {
            res.on('data', function(data) {
                json += data;
            })
            .on('end', function () {
                console.log("Query to XIVDB ended.");
                callback(JSON.parse(json));
            });
        });
    }

    /**
     * Search for something
     *
     * @param string
     * @param callback
     */
    search(keyword, type, callback)
    {
        var queryString = query.stringify({
            string: keyword,
        });

        if (type.trim() != '') {
            queryString = queryString + "one=" + type;
        }

         console.log(queryString);

        this.query(callback, '/search?' + queryString);
    }

    /**
     * Get an item via its id
     *
     * @param id
     * @param callback
     */
    getItem(id, callback)
    {
        this.query(callback, vsprintf('/item/%s', [
            id
        ]));
    }

    /*
     * Gets a list of objects based on type
     */
    getList(type, callback)
    {
        this.query(callback, '/' + type);
    }

    /*
     * Gets an object based on id and type
     */
    getObject(id, type, callback)
    {
        console.log("Attempting to query for " + type);
        this.query(callback, vsprintf('/' + type + '/%s', [
            id
        ]));
    }
}

module.exports = new XIVDBApi();