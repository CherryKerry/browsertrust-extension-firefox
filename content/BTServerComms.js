/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  			Browser Trust Server Communications | (c) Browser Trust 2014				      */
/*										Version 1.0												  */
/* 							this version has not been tested 									  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var BTServerComms = {};  // Namespace

/**
 * Submit URL and Hash for the fingerprint server to store.
 * 
 * @param {String} URL to Submit
 * @param {String} Calculated Hash of the URL
 * @return {Boolean} true if successfully submitted
 */
BTServerComms.submitFingerPrint(url, hash)
{
    var params = "url=" + encodeURIComponent(url) + "&hash=" + encodeURIComponent(hash);
    request.open("POST", "http://103.250.233.28:8765/url", true);
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
}

/**
 * Retrieve all the hashes stored by the fingerprint server for a URL. 
 * 
 * @param {String} URL to Submit
 * @return {String} JSON Response if Successful
 */
BTServerComms.getFingerPrints(url)
{
	var params = "";
    request.open("GET", "http://103.250.233.28:8765/url/" + url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Content-length", params.length);
    request.setRequestHeader("Connection", "close");
    request.onreadystatechange = function()
    {
		if (request.readyState == 4 && request.status == 200) 
		{
			return request.responseText;
	    } 
	    else if(request.readyState == 4) {
	    	return "Error Communicating";
	    }
    }; 
    request.send(params);
}