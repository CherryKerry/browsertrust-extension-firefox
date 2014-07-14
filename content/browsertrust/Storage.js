/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  					Browser Trust Storage | (c) Browser Trust 2014						      */
/*										Version 1.0												  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

/**
 * User Story 22: Stores a fingerprint and URL locally.
 */
BrowserTrust.Storage = 
{
	/**
	 * 
	 * @param {} fingerprint
	 */
  	storeFingerprint : function(fingerprint) 
  	{
	  	alert(fingerprint.uri);
		console.log("BEFORE INIT");
		var ss = require("sdk/simple-storage");  //This doen't seem to be working
		if(!ss.storage.Fingerprint) {
			ss.storage.Fingerprint = { fingerprint:fingerprint };
		}
		console.log("AFTER INIT");
  	}
};