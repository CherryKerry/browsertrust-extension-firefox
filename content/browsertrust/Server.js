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

BrowserTrust.Server = {
	/**
	 * Submit URL and Hash for the fingerprint server to store.
	 * 
	 * @param {String} Host portion of URL to submit
	 * @param {String} Path portion of URL to submit
	 * @param {String} File type
	 * @param {String} Calculated Hash of the URL
	 * @return {Boolean} true if successfully submitted
	 */
	submitFingerprint : function(host, path, type, hash)
	{
        var request = new XMLHttpRequest();
		var params = "{\"host\":\"" + host + "\",\"path\":\"" + path + "\",\"type\":\"" + type + "\",\"hash\":\"" + hash + "\"}";
	    request.open("POST", "http://server-browsertrust.rhcloud.com/url", true);
	    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    request.setRequestHeader("Content-length", params.length);
	    request.setRequestHeader("Connection", "close");
	    request.onreadystatechange = function()
	    {
			if (request.readyState == 4 && request.status == 200) 
			{
				return true;
		    } 
		    else if(request.readyState == 4) {
		    	return false;
		    }
	    }; 
	    request.send(params);
	},
	
	/**
	 * Retrieve all the hashes stored by the fingerprint server for a URL. 
	 * 
	 * @param {String} Host portion of URL to submit
	 * @param {String} Path portion of URL to submit
	 * @return {String} JSON Response if Successful
	 */
	getFingerprints : function(host, path)
	{
        var request = new XMLHttpRequest();
		var params = "";
	    request.open("GET", "http://server-browsertrust.rhcloud.com/url/" + host + "/path/" + path, true);
	    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    request.setRequestHeader("Content-length", params.length);
	    request.setRequestHeader("Connection", "close");
	    request.onreadystatechange = function()
	    {
			if (request.readyState == 4 && request.status == 200) 
			{
				window.alert(request.responseText);
				return request.responseText;
		    } 
		    else if(request.readyState == 4) {
		    	return "Error Communicating";
		    }
	    }; 
	    request.send(params);
	},
	
	submitFingerprintSynchronously : function(host, path, type, hash)
	{
        var request = new XMLHttpRequest();
	    var params = "{\"host\":\"" + host + "\",\"path\":\"" + path + "\",\"type\":\"" + type + "\",\"hash\":\"" + hash + "\"}";
		console.log(params);
	    request.open("POST", "http://server-browsertrust.rhcloud.com/url", false);
	    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    request.setRequestHeader("Content-length", params.length);
	    request.setRequestHeader("Connection", "close");
		request.send(params);
		if (request.status == 200) 
		{
			return true;
		} 
		else {
			return false;
		}	    
	},
	
	getFingerprintsSynchronously : function(host, path)
	{
        var request = new XMLHttpRequest();
		var params = "";
	    request.open("GET", "http://server-browsertrust.rhcloud.com/url/" + host + "/path/" + path, false);
	    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    request.setRequestHeader("Content-length", params.length);
	    request.setRequestHeader("Connection", "close");
		request.send(params);
	    if (request.status == 200) 
		{
			return JSON.parse(request.responseText)['fingerprints'];
		} 
		else {
			return "ERROR";
		}
	    
	}
};