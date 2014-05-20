/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  			Browser Trust Fingerprint Engine | (c) Browser Trust 2014					      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var BTEngine = {};  // Sha256 namespace

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
 * @return {String} tagname and text content of each node
 */
BTEngine.breakDownNodes = function(node) 
{
	var result = "";
	for (var childNode = node.firstChild; childNode != null; childNode = childNode.nextSibling)
	{	
		result += childNode.tagName + childNode.textContent + "\n";
		result += breakDownNodes(childNode);
	}
	return result;
}