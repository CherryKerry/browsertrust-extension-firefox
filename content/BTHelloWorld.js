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
}
