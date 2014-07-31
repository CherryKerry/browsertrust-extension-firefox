/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*              Browser Trust Server Communications | (c) Browser Trust 2014                      */
/*                                   Version 1.0                                                  */
/*                         this version has not been tested                                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if (BrowserTrust === "undefined") {
  var BrowserTrust = {};
};

BrowserTrust.JSONHandler = {
    /**
     * Is the Key already present in the JSON.
     * @param {Object} json
     * @param {String} key
     * @return {boolean}  indicating success
     */
    function isKeyPresent(json, key) {
        "use strict";
        if (json.hasOwnProperty(key)) {
            return true;
        }
        return false;
    }

    /**
     * Establishes if Key references an Array.
     * @param {Object} json
     * @param {String} key
     * @return {boolean}  indicating yes or no.
     */
    function doesKeyReferToArray(json, key) {
        "use strict";
        return (json[key] instanceof Array);
    }

    /**
     * Adds a Key Value pair (object) to an Array.
     * @param {Object} json
     * @param {String} key
     * @param {String} value
     * @return {boolean} indicating success
     */
    function addValueToArray(json, key, value) {// Could omit paramaters, but makes clearer and allows reuse.
        "use strict";
        if (json[key] instanceof Array) {
            var obj = {};
            obj[key] = value;
            json[key].push(obj);
            return true;
        }
        return false;
    }

    /**
     * Converts a Key Value pair into the first entry in an array referenced by that Key in the JSON.
     * @param {Object} json
     * @param {String} key
     */
    function convertKeyToObjectArray(json, key) {
        "use strict";
        if (!(json[key] instanceof Array)) {
            var obj = {};
            obj[key] = json[key];
            json[key] = new Array(obj);
            return true;
        }
        return false;
    }

    /**
     * Inserts a key and value into a JSON object.
     * @param {Object} json
     * @param {String} key
     * @param {String} value
     * @return {boolean} indicating success
     */
    function insertValue(json, key, value) {
        "use strict";
        if (!(typeof key === "string")) {
            return false;
        }
        if (!(typeof value === "string")) {
            return false;
        }
        if (isKeyPresent(json, key)) {
            if (doesKeyReferToArray(json, key)) {
                return addValueToArray(json, key, value);
            }
            convertKeyToObjectArray(json, key);
            return addValueToArray(json, key, value);
        }
        json[key] = value;
        return true;
    }

    /**
     * Compares Two JSON Objects.
     * @param {Object} jsonA - The new object.
     * @param {Object} jsonB - The reference object.
     * @return {Object} - A JSON containing the values that did not match the reference object.
     */
    function compareJSONs(jsonA, jsonB) {
        "use strict";
        var matchedValueInArray, i, j, key, failedMatchesJSON = {};
        for (key in jsonA) {
            if (jsonA.hasOwnProperty(key)) {
                if (!(jsonA[key] instanceof Array)) {
                    if (!(jsonA[key] === jsonB[key])) {
                        insertValue(failedMatchesJSON, key, jsonA[key]);
                    }
                } else {
                    matchedValueInArray = false;
                    for (i = 0; i < (jsonA[key].length - 1); i += 1) {
                        matchedValueInArray = false;
                        for (j = 0; j < (jsonB[key].length - 1); j += 1) {
                            if (jsonA[key][i][key] === jsonB[key][j][key]) {
                                matchedValueInArray = true;
                                break;
                            }
                        }
                        if (matchedValueInArray === false) {
                            insertValue(failedMatchesJSON, key, jsonA[key][i][key]);
                        }
                    }
                }
            }

        }
        return failedMatchesJSON;
    }

};