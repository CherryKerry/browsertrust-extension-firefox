/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   */
/*                    Browser Trust BTrust File Interaction | (c) Browser Trust 2014               */
/*                                     Version 1.0                                                 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   */

/**
 * BrowserTrust namespace.
 */
if (typeof BrowserTrust === "undefined") {
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
    },
    
    /**
     * Method to fingerprint the btrust.txt file.
     */
    verifyBTrustFile : function() {
        //Try to get btrust.txt file
        let data;
        BrowserTrust.BTrust.getBTrustFile(function callback(response) {
            data = response;
        });
        //If btrust.txt file does not exit - end.
        if(data === null || data === undefined) {
            console.log("3.5) btrust.txt file does not exist under root directory on the server, ending.");
            return true;
        }
        //If btrust.txt does exist, then fingerprint it
        let url = window.content.location.protocol + window.content.location.hostname + "/btrust.txt";
        newFingerprint = BrowserTrust.Engine.fingerprint(url, data);
        console.log("3.5)newFingerprint: " + newFingerprint.uri + " " + newFingerprint.hash );
        //If existing local stored fingerprint does not exist, then add fingerprint to local and END.
        locallyStoredFingerprints = BrowserTrust.Storage.getFingerprints(newFingerprint);
        console.log("3.5) locally stored fingerpirnt: " + locallyStoredFingerprints[0].uri + " " + locallyStoredFingerprints[0].hash);
        if(locallyStoredFingerprints[0] === null || locallyStoredFingerprints[0] === undefined) {
            BrowserTrust.Storage.storeFingerprint(newFingerprint);
            console.log("3.5) No locally stored fingerprint for btrust.txt exists, creating and storing new fingerprint.");
            return true;
        }
        //Else if fingerprint stored locally exists, compare
        else {
            //If fingerprint has changed since last visit, warn user
            if(!BrowserTrust.BTrust.compareFingerprint(newFingerprint)) {
                console.log("3.5) Bad Fingerprint Match: btrust.txt file has changed since last visit.");
                console.log("Updating local fingerpints with new fingerprint...please verify btrust.txt file changes manually");
                BrowserTrust.Storage.storeFingerprint(newFingerprint);
                return true;
            }
            //If has not changed, end
            else {
                console.log("3.5) Good Fingerprint Match: btrust.txt file has not changed.");
                return true;
            }
        }
    },
    
    /**
     * Compares a newly generated fingerprint of btrust.txt to a locally stored fingerprint of btrust.txt
     * 
     * @param {Fingerprint} fingerprint to compare
     * @return True if it matches, false if no match
     */
    compareFingerprint : function(fingerprint) {
        //Case look through history and increment matching for each match found
        let history = BrowserTrust.Storage.getFingerprints(fingerprint);
        for (let i in history) {
            if(history[i].hash === fingerprint.hash) {
                return true;
            }
        }
        return false;
    },
};