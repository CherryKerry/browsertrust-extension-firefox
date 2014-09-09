/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*                Browser Trust Sidebar Scripts    | (c) Browser Trust 2014                       */
/*                                      Version 1.1                                               */
/*                          this version has not been tested                                      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
    var BrowserTrust = {};
};

BrowserTrust.Sidebar = 
{	
    /**
     * Get the Browser Trust sidebar from the browser
     */
    getSidebar : function() 
	{
    	var sidebar = document.getElementById('sidebar').contentWindow;
    	console.log("Sidebar: " + sidebar.location.href);
		if (sidebar.location.href == "chrome://browsertrust/content/sidebar.xul")
		{
			return sidebar;
		}
		return null;
    },
    
    /**
     * Add the fingerprint to the UI
     * 
     * @param {fingerprint} fingerprint to be added to the sidebar
     */
    addFingerprint : function(fingerprint) 
	{
    	var sidebar = BrowserTrust.Sidebar.getSidebar();
    	if (sidebar != null) 
		{
    		sidebar.addFingerprint(fingerprint);
    	}
    },
    
    /**
     * Load all the fingerprints upon opening the sidebar
     */
    loadAllFingerprints : function() 
	{
    	for (var key in BrowserTrust.Engine.processedFingerprints) {
			var processedFP = BrowserTrust.Engine.processedFingerprints[key];
			BrowserTrust.Sidebar.addFingerprint(processedFP);
		}
    }
}

//Add the listeneing event for when the sidebar loads
document.addEventListener("BrowserTrustSidebarEvent", BrowserTrust.Sidebar.loadAllFingerprints, false, true);