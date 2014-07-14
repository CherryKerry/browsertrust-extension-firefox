/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  			Browser Trust Hello World Example | (c) Browser Trust 2014					      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

BrowserTrust.HelloWorld =
{
	/**
	 * Says 'Hello' to the user.
	 */
	sayHello : function(aEvent) 
	{
	    window.alert(BrowserTrust.HelloWorld.getHello());
	},
	
	/**
	 * Get hello string from the string bundle and return it
	 * @return {String} the hello string from the string bundle
	 */
	getHello : function()
	{
		var stringBundle = document.getElementById("xulschoolhello-string-bundle");
	    return stringBundle.getString("browsertrust.greeting.label");
	}
};
