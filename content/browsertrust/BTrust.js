/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  		Browser Trust BTrust File Interaction | (c) Browser Trust 2014					      */
/*										Version 1.0												  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

/**
 * Currently working on linux /tmp/btrust.txt not cross platform.
 * Calls the getBtrust function to get the .txt file from the server, then output something to show successful retrieval
 * Currently requires btrust.txt under root directory on webserver set up locally. CTRL+SHIFT+J to open console in FF
 */
BrowserTrust.BTrust = 
{
  	getBTrustFile : function(aEvent) 
  	{
  		var location = window.content.location.protocol + window.content.location.hostname + "/btrust.txt";
/*	Old method of saving file to disk  	
 * var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath("/tmp/btrust.txt");
		var wbp = Components.classes['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Components.interfaces.nsIWebBrowserPersist);
		var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI(location, null, null);
		wbp.persistFlags &= ~Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_NO_CONVERSION; // don't save gzipped
		wbp.saveURI(uri, null, null, null, null, file, null);
		return "Check for file /tmp/btrust.txt";*/
		
  		//from http://stackoverflow.com/questions/19534908/firefox-extension-addon-reading-a-text-file-from-remote-serverurl
  		
		// Add XMLHttpRequest constructor, if not already present
		if (!('XMLHttpRequest' in this)) {
		    this.XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1", "nsIXMLHttpRequest");
		}
		
		var req = new XMLHttpRequest();
		req.open("GET", location); // file:/// would work too, BTW
		req.overrideMimeType("text/plain");
		req.addEventListener("load", function() {
		  // Split the responseText into array to later use the urls in btrust.txt
			var staticContent = req.responseText.split("/n");
			for (var i = 0; i < staticContent.length; i++) {
				console.log(staticContent[i]);
			}
		}, false);
		req.addEventListener("error", function() {
		  // Handle error
		}, false);
		req.send();
		
  	}
};