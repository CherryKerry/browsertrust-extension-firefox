/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* 					Browser Trust BTrust File Interaction | (c) Browser Trust 2014				  */
/* 											Version 1.0 										  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if (BrowserTrust === "undefined") {
    var BrowserTrust = {};
}

BrowserTrust.BTrust = {
    /**
     * Method getFile makes a (currently) synchronous AJAX request to a uri provided to fetch the btrust.txt file that contains a list of 
     * static content. The data returned then can be accessed via the callback function provided as an argument.
     * @param {String} uri The uri that points to the btrust.txt file
     * @param {Function} callback The callback function mentioned above.
     */
    getFile : function (uri, callback) {
        let request;
        // Add XMLHttpRequest constructor, if not already present
        if (!('XMLHttpRequest' in this)) {
            this.XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1", "nsIXMLHttpRequest");
        }
        request = new XMLHttpRequest();
        try {
            request.open("GET", uri, false);
            request.overrideMimeType("text/plain");
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    callback(request.responseText);
                }
            };
            request.send();
        } catch(err) {
        	
        }
    },
    
    /**
     * Method to get btrust.txt from the server of the current webpage. 
     * @param {function} callback used to do something with the data returned from AJAX request
     */
    getBTrustFile : function (callback) {
        let location = window.content.location.protocol + window.content.location.hostname + "/btrust.txt";
        BrowserTrust.BTrust.getFile(location, callback);
    }
};