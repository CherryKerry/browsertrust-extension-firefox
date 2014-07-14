/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  			Browser Trust Fingerprint Engine | (c) Browser Trust 2014					      */
/*										Version 1.0												  */
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
	 * Method to be called to create a fingerprint for the currently active
	 * window html
	 * 
	 * @return {Fingerprint} .hash is a SHA256 hash of the uri data
	 * 						 .uri is the uri of the hashed data
	 */
	fingerprintHtml : function()
	{
		var DOM = BrowserTrust.Engine.getWindowDocument();
		var fingerprint = {
			hash:Sha256.hash(DOM.documentElement.innerHTML, false),
			uri	:DOM.documentURI
		}
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