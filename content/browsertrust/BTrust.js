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
	  	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath("/tmp/btrust.txt");
		var wbp = Components.classes['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Components.interfaces.nsIWebBrowserPersist);
		var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI(location, null, null);
		wbp.persistFlags &= ~Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_NO_CONVERSION; // don't save gzipped
		wbp.saveURI(uri, null, null, null, null, file, null);
		return "Check for file /tmp/btrust.txt";
  	}
};