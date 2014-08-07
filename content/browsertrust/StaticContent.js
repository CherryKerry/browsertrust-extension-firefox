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
		var staticFileTypes = [".css", ".html", ".js", ".jpg", ".jpeg", ".png", ".gif", ".ico"]
		for(var i = 0; i < staticFileTypes.length; i++)
		{
			if(url.indexOf(staticFileTypes[i], url.length - staticFileTypes[i].length) !== -1)
			{
				return true;
			}
		}
		return false;
	},
	
	/**
	 * Returns if content is considered static. 
	 * 
	 * @param {String} URL of resource to check
	 * @return {Boolean} True if resource is considered static
	 */
	observeLoadedContent : function()
	{
		var nsIHttpActivityObserver = Components.interfaces.nsIHttpActivityObserver;
		var httpObserver =
		{
			observeActivity: function(aHttpChannel, aActivityType, aActivitySubtype, aTimestamp, aExtraSizeData, aExtraStringData)
			{
			  if (aActivityType == nsIHttpActivityObserver.ACTIVITY_TYPE_HTTP_TRANSACTION) {
				switch(aActivitySubtype) {
				  case nsIHttpActivityObserver.ACTIVITY_SUBTYPE_RESPONSE_HEADER:
					// received response header
					//window.alert("ACTIVITY_SUBTYPE_RESPONSE_HEADER " + aExtraStringData);
					break;
				  case nsIHttpActivityObserver.ACTIVITY_SUBTYPE_REQUEST_HEADER:
					// received complete HTTP response
					var httpHeader =  aExtraStringData.split("\r");
					var tempOutput = "";
					var count = 0;
					var contentURL = "";
					var hostURL = "";
					for(var i = 0; i < httpHeader.length; i++)
					{
						if(httpHeader[i].indexOf("GET") > -1)
						{
							count++;
							tempOutput += httpHeader[i];
							var getHttpHeader = httpHeader[i].split(" ");
							contentURL = getHttpHeader[1];
						}
						else if(httpHeader[i].indexOf("Host:") > -1)
						{
							count++;
							tempOutput += httpHeader[i];
							var hostHttpHeader = httpHeader[i].split(" ");
							hostURL = hostHttpHeader[1];
						}
						else if(httpHeader[i].indexOf("Accept:") > -1)
						{
							count++;
							tempOutput += httpHeader[i];
						}
					}
					if(tempOutput !== "" && count == 3)
					{
						window.alert(hostURL + contentURL + " is static? " + BrowserTrust.StaticContent.isContentStatic(hostURL + contentURL));
					}
					break;
				}
			  }
			}
		};
		var activityDistributor = Components.classes["@mozilla.org/network/http-activity-distributor;1"].getService(Components.interfaces.nsIHttpActivityDistributor);
		activityDistributor.addObserver(httpObserver);
	}
};