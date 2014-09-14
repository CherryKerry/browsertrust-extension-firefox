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
};

BrowserTrust.Settings = {
    /**
    * Function to allow opening preferences menu from toolbar. Code from 
    * https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/Handling_Preferences
    */
    openPreferences : function() {
        if (null == this._preferencesWindow || this._preferencesWindow.closed) {
            let instantApply = Application.prefs.get("browser.preferences.instantApply");
            let features = "chrome,titlebar,toolbar,centerscreen" + (instantApply.value ? ",dialog=no" : ",modal");
            this._preferencesWindow = window.openDialog(
                "chrome://browsertrust/content/preferencesWindow.xul",
                "browsertrust-preferences-window", features);
        }
        this._preferencesWindow.focus();
    },
    
    
};