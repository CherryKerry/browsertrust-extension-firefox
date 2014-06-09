/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};

};



/**
 * User Story 22: Stores a fingerprint and URL locally. 
 * 
 */
BrowserTrust.Storage = 
{
  
  storeFingerprint : function(aEvent) 
  {
	console.log("BEFORE INIT");
	var ss = require("sdk/simple-storage");
	if(!ss.storage.Fingerprint) {
		ss.storage.Fingerprint = { domain: "www.example.com", fingerprint: "1234545" };
	}
	console.log("AFTER INIT");
  	
  }
};