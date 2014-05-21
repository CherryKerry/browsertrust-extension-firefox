/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  			Browser Trust Hello World Example | (c) Browser Trust 2014					      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

 var BTHelloWorld = {};

/**
 * Says 'Hello' to the user.
 */
BTHelloWorld.sayHello = function(aEvent) 
{
	var stringBundle = document.getElementById("xulschoolhello-string-bundle");
    var message = stringBundle.getString("browsertrust.greeting.label");
    window.alert(message);
        
    var request = new XMLHttpRequest();
    /*
    request.open("GET", "http://103.250.233.28:8765/", false);
    request.send(null);
    alert(request.responseText);
    */
    
    //var params = "p1=" + encodeURIComponent(p1) + "&p2=" + encodeURIComponent(p2);
    //Be aware this is an asynchronous request hence the onreadystatechange function
    var params = "";
    request.open("POST", "http://103.250.233.28:8765/", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Content-length", params.length);
    request.setRequestHeader("Connection", "close");
    request.onreadystatechange = function()
    {	//Error checking
    	window.alert("\nstate:" + request.readyState + 
    			"\nstatus:" + request.status + 
				"\nresponse:" + request.responseText)
		//If the request has finished loading
		if (request.readyState == 4 && request.status == 200) 
		{   //Do stuff here 
			
	    } 
    }; 
    request.send(params);
}
