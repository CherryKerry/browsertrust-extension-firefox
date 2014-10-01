/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*                Browser Trust Settings           | (c) Browser Trust 2014                       */
/*                                      Version 1.1                                               */
/*                          this version has not been tested                                      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
    var BrowserTrust = {};
}

BrowserTrust.Settings = {
    /**
    * Function to allow opening preferences menu from toolbar. Code from 
    * https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/Handling_Preferences
    */
    openPreferences : function() {
        if (null == this._preferencesWindow || this._preferencesWindow.closed) { // strict === not working here?
            let instantApply = Application.prefs.get("browser.preferences.instantApply");
            let features = "chrome,titlebar,toolbar,centerscreen" + (instantApply.value ? ",dialog=no" : ",modal");
            this._preferencesWindow = window.openDialog(
                "chrome://browsertrust/content/preferencesWindow.xul",
                "browsertrust-preferences-window", features);
        }
        this._preferencesWindow.focus();
    },
    
    /**
     * Method to return trust server URL or null if there is no key
     */
    getTrustServer : function() {
        var prefServiceBranch = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService).getBranch("");
        if(prefServiceBranch.getPrefType('extensions.browsertrust.fingerprintServer')){
            return prefServiceBranch.getCharPref('extensions.browsertrust.fingerprintServer');
        }
    },
    
    /**
     * Method to set trust server URL
     */
    setTrustServer : function(trustServerURL) {
        var prefServiceBranch = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService).getBranch("");
        prefServiceBranch.setCharPref("extensions.browsertrust.fingerprintServer", trustServerURL);
    },
    
    testConnection : function(url) {
        try{
            var ajaxXHR = new XMLHttpRequest();
            ajaxXHR.open("GET", url, true);
            ajaxXHR.onreadystatechange = function() {
                if(ajaxXHR.readyState == 4) {
                    if (ajaxXHR.status == 200)
                        console.log( "Fingerprint Server connection success");
                    else
                        console.log("There was an error with the response from the server");
                }
            };
            ajaxXHR.send();
        }
        catch( e ) {
            console.log("There was an error connecting to the server");
        }
    }
};