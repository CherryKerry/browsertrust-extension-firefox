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
		var debug = BrowserTrust.Test.debugAlertIsOn;
		BrowserTrust.Test.debugAlertIsOn = true;
		
		try {
			//Hello World
			BrowserTrust.Test.debug("1) HelloWorld Test\n " + BrowserTrust.HelloWorld.getHello());
		
			//Create a fingerprint
			let fingerprint = BrowserTrust.Engine.fingerprintHtml();
			BrowserTrust.Test.debug("2) Fingerprint Test\n URL: " + fingerprint.uri + "\n Fingerprint: " + fingerprint.hash); 
			
			//Retrieve the btrust.txt file
			BrowserTrust.BTrust.getBTrustFile(function callback(response) {
				BrowserTrust.Test.btrustOutput = response;
			});
			BrowserTrust.Test.debug("3) Get BTrust File");
			BrowserTrust.Test.debug(BrowserTrust.Test.btrustOutput.split());
			
			//Store fingerprint
			BrowserTrust.Test.debug("4) Store Fingerprint\n Success:" + BrowserTrust.Storage.storeFingerprint(fingerprint));
			
			//Retrieve fingerprints from database
			let prints = BrowserTrust.Storage.getFingerprints(fingerprint);
			BrowserTrust.Test.debug("5) Get last 5 Fingerprints Test");
			for (let i in prints) 
			{
				if (i <=  5) //Only print the last 5 values
					BrowserTrust.Test.debug(i + ":" + prints[i].hash);
			}
			
			//Test current page comparison
			BrowserTrust.Test.debug("6) Compare current page");
			BrowserTrust.Test.debug(BrowserTrust.Engine.compareFinderprintHtml()*100 + "% Similarity\n");
			
			//Is URI static or dynamic as per local storage
			BrowserTrust.Test.debug("7) Is current page dynamic?");
			BrowserTrust.Test.debug(BrowserTrust.Storage.isUriDynamic(fingerprint.uri))
			
			//Is URI Considered static or dynamic according to whitelist
			BrowserTrust.Test.debug("8) Is http://www.google.co.nz/jquery.js static?");
			BrowserTrust.Test.debug(BrowserTrust.StaticContent.isContentStatic("http://www.google.co.nz/jquery.js"));
			BrowserTrust.Test.debug("9) Is http://www.google.co.nz/somepage.php static?");
			BrowserTrust.Test.debug(BrowserTrust.StaticContent.isContentStatic("http://www.google.co.nz/somepage.php"));
			BrowserTrust.StaticContent.observeLoadedContent();
			
		} catch (err) {
			BrowserTrust.Test.debug("\nERROR:\n\n" + err);
		}
		
		BrowserTrust.Test.debugAlertIsOn = debug;
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
		if (BrowserTrust.Test.debugAlertIsOn)
		{
			console.log(message);
			//alert(message);
		}
	}
};