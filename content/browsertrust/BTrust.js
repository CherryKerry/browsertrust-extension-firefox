/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Browser Trust BTrust File Interaction | (c) Browser Trust 2014 */
/* Version 1.0 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/**
 * BrowserTrust namespace.
 */
if (BrowserTrust === "undefined") {
    var BrowserTrust = {};
}

/**
 * Calls the getBtrust function to get the .txt file from the server, then output something to show successful retrieval
 * Currently requires btrust.txt under root directory on webserver set up locally. CTRL+SHIFT+J to open console in FF
 */
BrowserTrust.BTrust = {
    handleResponse : function (response) {
        return response;
    },
    getBTrustFile : function (callback) {
        var request, location;
        location = window.content.location.protocol + window.content.location.hostname + "/btrust.txt";
        //from http://stackoverflow.com/questions/19534908/firefox-extension-addon-reading-a-text-file-from-remote-serverurl
        // Add XMLHttpRequest constructor, if not already present
        if (!('XMLHttpRequest' in this)) {
            this.XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1", "nsIXMLHttpRequest");
        }
        request = new XMLHttpRequest();
        try {
	        request.open("GET", location, false);
	        request.overrideMimeType("text/plain");
	        request.onreadystatechange = function () {
	            if (request.readyState === 4 && request.status === 200) {
	                callback(request.responseText);
	            }
	        };
	        request.send();
        } catch(err) {
        	
        }
    }
};