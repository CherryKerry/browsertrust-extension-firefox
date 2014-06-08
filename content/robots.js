/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

/**
 * Currently working on linux /tmp/robots.txt not cross platform.
 * Calls the fetchRobots function to get the robots.txt file from the server, then output something to show sucessful retrieval
 */
BrowserTrust.Robot = 
{
  showRobotsFile : function(aEvent) 
  {

  	window.alert("hello2");
  	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	file.initWithPath("/tmp/robots.txt");
	var wbp = Components.classes['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Components.interfaces.nsIWebBrowserPersist);
	var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
	var uri = ios.newURI("https://www.google.com/robots.txt", null, null);
	wbp.persistFlags &= ~Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_NO_CONVERSION; // don't save gzipped
	wbp.saveURI(uri, null, null, null, null, file, null);
  }
};