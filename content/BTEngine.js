/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  			Browser Trust Fingerprint Engine | (c) Browser Trust 2014					      */
/*										Version 1.0												  */
/* 							this version has not been tested 									  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var BTEngine = {};  // Browser Trust Engine or BTEngine namespace

/**
 * Method to be called to create a fingerprint for the currently active
 * window in the browser
 * 
 * @return {Fingerprint} .hash is a SHA256 hash of the uri data
 * 						 .uri is the uri of the hashed data
 */
BTEngine.calculateFingerprint = function()
{
	var html = BTEngine.getRootNode();
	var uri = BTEngine.getCurrentURI();
	var trustFile = BTEngine.getTrustFile(uri);
	var htmlText = BTEngine.breakDownNodes(html);
	var fingerprint = {
		hash:Sha256.hash(htmlText),
		uri	:uri
	}
	return fingerprint;
}

/**
 * Gets the root node of the current open window
 *
 * @returns {Node} the root HTML node for the current window
 */
BTEngine.getRootNode = function() 
{
    return window.content.document.documentElement;
}

/**
 * Gets the URI for the current page
 *
 * @returns {String} the current page URI
 */
BTEngine.getCurrentURI = function() 
{
    return window.content.document.documentURI;
}

/**
 * Breakdown the nodes and add them to a string
 * 
 * @param {Node} node to start from
 * @param {String} parentName the node name of the parent
 * @param {String[]} trustFile tells the file what text to add or ignore
 * @return {String} tagname and text content of each node
 */
BTEngine.breakDownNodes = function(node, parentName, trustFile) 
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
}

/**
 * Loads a trust file for a given url to an array
 * 
 * @param {String} uri to look for the file
 * @return {String[]} an array key words
 */
BTEngine.getTrustFile = function(uri)
{
	//Load file from url
	return {};
}

/**
 * Caclulate if the fingerprint node should be finger printed
 * 
 * @param {String} nodeName path name of the node
 * @param {String[]} trustFile the array to of path names to exclude
 * @return {boolean} true if the node should be fingerprinted
 */
BTEngine.shouldFingerprint = function(nodeName, trustFile) 
{
	var shouldIgnore = false;
	for (var i = 0; i < trustFile.length; i++) 
	{
		shouldIgnore = trustFile[i] == nodeName;
	}
	
	return !shouldIgnore;
}