/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  			Browser Trust Fingerprint Engine | (c) Browser Trust 2014					      */
/*										Version 1.1												  */
/* 							this version has not been tested 									  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

BrowserTrust.Engine = 
{
	/**
	 * Method that creates a fingerprint object given a uri and string data to fingerprint
	 * 
	 * @param {String} uri location of the resource
	 * @param {String} data string of the resource to be hashed
	 * @return {Fingerprint} a fingerprint with hash and uri property
	 */
	fingerprint : function(uri, data) {
		var fingerprint = {
			hash:Sha256.hash(data, false),
			uri	:uri
		};
		return fingerprint;
	},
	
	/**
	 * Method to be called to create a fingerprint for the currently active
	 * window html
	 * 
	 * @return {Fingerprint} .hash is a SHA256 hash of the uri data
	 * 						 .uri is the uri of the hashed data
	 */
	fingerprintHtml : function()
	{
		var DOM = BrowserTrust.Engine.getWindowDocument();
		var fingerprint = BrowserTrust.Engine.fingerprint(
				DOM.documentURI, 
				DOM.documentElement.innerHTML);
		return fingerprint;
	},
	
	/**
	 * Gets the DOM of the active window
	 *
	 * @returns {Node} the root HTML node for the current window
	 */
	getWindowDocument : function() 
	{
	    return window.content.document;
	},
	
	/**
	 * Compare fingerprints locally for a given fingerprint. If the fingerprint 
	 * should be excluded, the result is 1
	 * 
	 * @param {Fingerprint} fingerprint to compare
	 * @return {float} the percentage of similatiry in the last 20 fingerprints
	 */
	compareFingerprint : function(fingerprint) 
	{
		//Case if the page is to be excluded, return 1
		let excluded = BrowserTrust.Storage.isUriExcluded(fingerprint.uri);
		if (excluded) {
			return 1;
		}
		//Case look through history
		let history = BrowserTrust.Storage.getFingerprints(fingerprint);
		let total = 0;
		for (let i in history) {
			total += history[i].hash == fingerprint.hash ? 1 : 0;
		}
		return total/history.length;
	},
	
	/**
	 * Compares the local fingerprint history to the current
	 * fingerprint to calculate a % of similarity
	 * 
	 * @returns a float 0-1 to show the percentage of similarity 
	 */
	compareFinderprintHtml : function()
	{
		let fingerprint = BrowserTrust.Engine.fingerprintHtml();
		let result = BrowserTrust.Engine.compareFingerprint(fingerprint);
		return result;
	},
	
	/**
	 * Breakdown the nodes and add them to a string
	 * 
	 * @param {Node} node to start from
	 * @param {String} parentName the node name of the parent
	 * @param {String[]} trustFile tells the file what text to add or ignore
	 * @return {String} tagname and text content of each node
	 */
	breakDownNodes : function(node, parentName, trustFile) 
	{
		var result = "";
		for (var childNode = node.firstChild; childNode != null; childNode = childNode.nextSibling)
		{	
			var nodeName = parentName + "." + childNode.tagName;
			if (BTEngine.shouldFingerprint(nodeName, trustFile)) 
			{
				result += childNode.textContent + "\n";
			}
			result += breakDownNodes(childNode, nodeName, trustFile);
		}
		return result;
	},
	
	/**
	 * Loads a trust file for a given url to an array
	 * 
	 * @param {String} uri to look for the file
	 * @return {String[]} an array key words
	 */
	getTrustFile : function(uri)
	{
		//Load file from url
		return {};
	},
	
	/**
	 * Caclulate if the fingerprint node should be finger printed
	 * 
	 * @param {String} nodeName path name of the node
	 * @param {String[]} trustFile the array to of path names to exclude
	 * @return {boolean} true if the node should be fingerprinted
	 */
	shouldFingerprint : function(nodeName, trustFile) 
	{
		var shouldIgnore = false;
		for (var i = 0; i < trustFile.length; i++) 
		{
			shouldIgnore = trustFile[i] == nodeName;
		}
		
		return !shouldIgnore;
	}
};