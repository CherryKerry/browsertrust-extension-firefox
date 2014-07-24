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
    btrustOutput : "",
    
    start : function()
    {
		var test = "";
		
		try {
			//Hello World
			test += "1) HelloWorld Test\n " + BrowserTrust.HelloWorld.getHello() + "\n";
		
			//Create a fingerprint
			let fingerprint = BrowserTrust.Engine.fingerprintHtml();
			test += "2) Fingerprint Test\n URL: " + fingerprint.uri + "\n Fingerprint: " + fingerprint.hash + "\n"; 
			
			//Retrieve the btrust.txt file
			BrowserTrust.BTrust.getBTrustFile(function callback(response) {
				BrowserTrust.Test.btrustOutput = response;
			});
			test += "3) Get BTrust File\n ";
			test += BrowserTrust.Test.btrustOutput.split() + "\n";
			
			//Store fingerprint
			test += "4) Store Fingerprint\n Success:" + BrowserTrust.Storage.storeFingerprint(fingerprint) + "\n";
			
			//Retrieve fingerprints from database
			let prints = BrowserTrust.Storage.getFingerprints(fingerprint);
			test += "5) Get last 5 Fingerprints Test\n";
			for (let i in prints) {
				if (i <=  5) //Only print the last 5 values
					test += i + ":" + prints[i].hash + "\n";
			}
			
			//Test current page comparison
			test += "6) Compare current page\n";
			test += BrowserTrust.Engine.compareFinderprintHtml()*100 + "% Similarity";
			
		} catch (err) {
			test += "\nERROR:\n\n" + err;
		}
		
		//Display test results
		alert(test);
	},
	
	/**
	 * Excludes an entry if it has been added to the exclude table or
	 * removes it if it is already in the table
	 */
	excludeOrIncludeHtml : function()
	{
		let fingerprint = BrowserTrust.Engine.fingerprintHtml();
		let exclude = BrowserTrust.Storage.excludeUri(fingerprint.uri);
		if (exclude) {
			alert("'" + fingerprint.uri + "' has been excluded");
		} else {
			BrowserTrust.Storage.includeUri(fingerprint.uri);
			alert("'" + fingerprint.uri + "' has been included");
		}
	}
};