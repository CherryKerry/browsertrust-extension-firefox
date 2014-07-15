/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  					Browser Trust Test | (c) Browser Trust 2014							      */
/*										Version 1.0												  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

BrowserTrust.Test = 
{
    start : function()
    {
		var test = "";
		//Hello World
		test += "1) HelloWorld Test\n " + BrowserTrust.HelloWorld.getHello() + "\n";
		//Cretae a fingerprint
		var fingerprint = BrowserTrust.Engine.fingerprintHtml();
		test += "2) Fingerprint Test\n URL: " + fingerprint.uri + "\n Fingerprint: " + fingerprint.hash + "\n"; 
		//Browser Trust File
		test += "3) Get BTrust File\n " + BrowserTrust.BTrust.getBTrustFile();
		//Store fingerprint - Not working atm
		//BrowserTrust.Storage.storeFingerprint(fingerprint);
		alert(test);
		BrowserTrust.Test.testing(fingerprint);
	},
	
	testing : function(fingerprint) {
		alert("Test1")
		//Connect to database
		Components.utils.import("resource://gre/modules/Services.jsm");
		Components.utils.import("resource://gre/modules/FileUtils.jsm");
		let file = FileUtils.getFile("ProfD", ["browsertrust.sqlite"]);
		let dbConn = Services.storage.openDatabase(file);
		//Create Table
		dbConn.executeSimpleSQL("CREATE TABLE IF NOT EXISTS fingerprints (" +
				"uri TEXT, " +
				"hash TEXT, " +
				"time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);");
		//Add data
		dbConn.executeSimpleSQL("INSERT INTO fingerprints (uri, hash)" +
				"VALUES ('" + fingerprint.uri + "', '" + fingerprint.hash + "');");
		//Select data
		
		//Close table
		alert("Test2");
	}
};