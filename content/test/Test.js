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
    debugAlertIsOn : false,
    
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
			for (let i in prints) 
			{
				if (i <=  5) //Only print the last 5 values
					test += i + ":" + prints[i].hash + "\n";
			}
			
			//Test current page comparison
			test += "6) Compare current page\n";
			test += BrowserTrust.Engine.compareFinderprintHtml()*100 + "% Similarity\n";
			
			//Is URI static or dynamic as per local storage
			test += "7) Is current page dynamic?\n";
			test += BrowserTrust.Storage.isUriDynamic(fingerprint.uri) + "\n"
			
			//Is URI Considered static or dynamic according to whitelist
			test += "8) Is http://www.google.co.nz/jquery.js static?\n";
			test += BrowserTrust.StaticContent.isContentStatic("http://www.google.co.nz/jquery.js") + "\n";
			test += "9) Is http://www.google.co.nz/somepage.php static?\n";
			test += BrowserTrust.StaticContent.isContentStatic("http://www.google.co.nz/somepage.php") + "\n";
			BrowserTrust.StaticContent.observeLoadedContent();
			
		} catch (err) {
			test += "\nERROR:\n\n" + err;
		}
		
		//Display test results
		BrowserTrust.Test.debug(test);
	},
	
	/**
	 * Excludes an entry if it has been added to the exclude table or
	 * removes it if it is already in the table
	 */
	excludeOrIncludeHtml : function()
	{
		let fingerprint = BrowserTrust.Engine.fingerprintHtml();
		let exclude = BrowserTrust.Storage.setUriAsDynamic(fingerprint.uri);
		if (exclude) 
		{
			alert("'" + fingerprint.uri + "' has been set as dynamic");
		} 
		else 
		{
			BrowserTrust.Storage.setUriAsStatic(fingerprint.uri);
			alert("'" + fingerprint.uri + "' has been set as static");
		}
	},
	
	/**
	 * Toggles the debuggin message feature
	 */
	toggleDebugging : function()
	{
		BrowserTrust.Test.debugAlertIsOn = !BrowserTrust.Test.debugAlertIsOn;
		alert("Debugging has been set to:"+BrowserTrust.Test.debugAlertIsOn);
	},
	
	/**
	 * Display a messgae for debugging
	 * 
	 * @param {String} message to be displayed to developer
	 */
	debug : function(message)
	{
		console.log(message);
		if (BrowserTrust.Test.debugAlertIsOn)
		{
			alert(message);
		}
	}
};