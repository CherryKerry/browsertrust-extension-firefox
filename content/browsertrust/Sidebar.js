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
		if (sidebar.location.href == "chrome://browsertrust/content/sidebar.xul")
		{
			return sidebar;
		}
		return null;
    },
    
    /**
     * Toggles the sidebar display to the user
     */
    toggleDisplay : function() 
	{
    	toggleSidebar("viewBrowsertrustSidebar");
    },
    
    /**
     * Load all the fingerprints to the sidebar
     */
    loadAllFingerprints : function() 
	{
		var sidebar = BrowserTrust.Sidebar.getSidebar();
		if (sidebar != null) {
    		sidebar.buildTable(BrowserTrust.Engine.processed);
    	}
    },
    
    /**
     * CLear all the fingerprints and reload sidebar 
     */
    clearAllFingerprints : function() 
	{
		BrowserTrust.Engine.processed = [];
		BrowserTrust.Sidebar.loadAllFingerprints();
    }
    
}

//Add the listeneing event for when the sidebar loads
document.addEventListener("BrowserTrustSidebarLoadRequest", BrowserTrust.Sidebar.loadAllFingerprints, false, true);
document.addEventListener("BrowserTrustSidebarClearRequest", BrowserTrust.Sidebar.clearAllFingerprints, false, true);