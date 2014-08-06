/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  			Browser Trust Server Communications | (c) Browser Trust 2014				      */
/*										Version 1.0												  */
/* 							this version has not been tested 									  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

BrowserTrust.StaticContent = {

	/**
	 * Returns if content is considered static. 
	 * 
	 * @param {String} URL of resource to check
	 * @return {Boolean} True if resource is considered static
	 */
	isContentStatic : function(url)
	{
		var staticFileTypes = [".css", ".html", ".js", ".jpg", ".jpeg", ".png", ".gif"]
		for(var i = 0; i < staticFileTypes.length; i++)
		{
			if(url.indexOf(staticFileTypes[i], url.length - staticFileTypes[i].length) !== -1)
			{
				return true;
			}
		}
		return false;
	}
};