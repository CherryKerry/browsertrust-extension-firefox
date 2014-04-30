if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

/**
 * Controls the browser overlay for the Hello World extension.
 */
BrowserTrust.HelloWorld = {
  /**
   * Says 'Hello' to the user.
   */
  sayHello : function(aEvent) {
    let stringBundle = document.getElementById("xulschoolhello-string-bundle");
    let message = stringBundle.getString("browsertrust.greeting.label");
    window.alert(message);
  }
};
