/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                */
/*                      Browser Trust Fingerprint Engine | (c) Browser Trust 2014                               */
/*                                              Version 1.1                                                     */
/*                              this version has not been tested                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
}

function ResultObject() {
	this.array = [];
	this.count = 0;
	this.isDynamic = false;
	this.resultCount = 0;
	this.changedCount = 0;
	this.result = 0;
	this.value = function(){
		if (this.resultCount == 0 || this.result == 0) {
			return 0;
		} 
		else {
			return parseInt((this.result / this.resultCount) * 100, 10);
		}
	}
}

function Fingerprint(hash, host, path, result) {
	this.hash = hash;
	this.host = host;
	this.path = path;
	this.type = "Other";
	this.result = result;
}

BrowserTrust.Engine = 
{
	processed : [],
	
	/**
	 * Method that creates a fingerprint object given a uri and string data to fingerprint
	 * 
	 * @param {String} uri location of the resource
	 * @param {String} data string of the resource to be hashed
	 * @return {Fingerprint} a fingerprint with hash and uri property
	 */
	fingerprint : function(uri, data) {
		var fingerprint = {
			hash:asmCrypto.SHA256.hex(data),
			uri	:uri,
			result : 0
		};
		return fingerprint;
	},
	
	/**
	 * Method to be called to create a fingerprint for the currently active
	 * window html
	 * 
	 * @return {Fingerprint} .hash is a SHA256 hash of the uri data uri is the uri of the hashed data
	 */
	fingerprintHtml : function()
	{
		var DOM = BrowserTrust.Engine.getWindowDocument();
		var fingerprint = BrowserTrust.Engine.fingerprint(
				DOM.documentURI, 
				DOM.documentElement.innerHTML);
		return fingerprint;
	},
	
	/**
	 * Gets the DOM of the active window
	 *
	 * @returns {Node} the root HTML node for the current window
	 */
	getWindowDocument : function() 
	{
        return window.content.document;
	},
	
	/**
	 * Add a fingerprint value to the result set
	 * 
	 * @param {String} host name for the fingerprints server
	 * @param {String} path for the fingerprint resource
	 * @param {Fingerprint} fingerprint the calculated hash for the fingerprint
	 */
	addToArray : function(host, path, fingerprint) {
		
		var isDynamic = BrowserTrust.Storage.isUriDynamic(host+path);
		
		fingerprint.result = isNaN(fingerprint.result) ? 0 : fingerprint.result;
		if (this.processed.hasOwnProperty(host) == false)
		{
			this.processed[host] = new ResultObject();
		}
		this.processed[host].result += fingerprint.result;
		this.processed[host].resultCount++;
		
		var type = "Other"; //Get other need to be written
		if (this.processed[host].array.hasOwnProperty(type) == false)
		{
			this.processed[host].array[type] = new ResultObject();
		}
		this.processed[host].array[type].result += fingerprint.result;
		this.processed[host].array[type].resultCount++;

		if (this.processed[host].array[type].array.hasOwnProperty(path) == false)
		{
			this.processed[host].array[type].array[path] = new ResultObject();
			this.processed[host].array[type].count++;
			this.processed[host].count++;
			if (fingerprint.result == 1 || isDynamic) 
			{
				this.processed[host].changedCount++;
				this.processed[host].array[type].changedCount++;
			}
		}
		else
		{
			//Update the changedCount if the result has been altered
			if (this.processed[host].array[type].array[path].result != fingerprint.result) 
			{
				var changedCount = 0;
				if (fingerprint.result == 1 || isDynamic) {
					changedCount = 1;
				}
				else if(this.processed[host].array[type].array[path].result == 1) {
					changedCount = -1;
				}
				this.processed[host].changedCount += changedCount;
				this.processed[host].array[type].changedCount += changedCount;
			}
		}
		
		this.processed[host].array[type].array[path].resultCount++;
		this.processed[host].array[type].array[path].result += fingerprint.result;
		this.processed[host].array[type].array[path].isDynamic = isDynamic;
	},
	
	checkForAlert : function() 
	{
		var errorFound = false;
		for (host in this.processed)
		{
			errorFound |= this.processed[host].count != this.processed[host].changedCount
		}
		if (errorFound) 
		{
			turnButtonRed();
		}
		else
		{
			turnButtonGreen();
		}
	},
	
	toggleResourseAsDynamic : function(host, type, path) 
	{
		var resourse = this.processed[host].array[type].array[path];
		var changedCount = resourse.value() != 100 ? 1 : 0;
		if (resourse.isDynamic) 
		{
			BrowserTrust.Storage.setUriAsStatic(host+path);
			changedCount *= -1;  //Value needs to be taken away from results
		} 
		else 
		{
			BrowserTrust.Storage.setUriAsDynamic(host+path);
		}	
		resourse.isDynamic = !resourse.isDynamic;
		this.processed[host].changedCount += changedCount;
		this.processed[host].array[type].changedCount += changedCount;
		this.checkForAlert();
	},
	
	/**
	 * Compare fingerprints locally for a given fingerprint. If the fingerprint 
	 * should be excluded, the result is 1
	 * 
	 * @param {Fingerprint} fingerprint to compare
	 * @return {float} the percentage of similatiry in the last 20 fingerprints
	 */
	compareFingerprint : function(fingerprint) 
	{
		return BrowserTrust.Engine.compareFingerprintLocal(fingerprint);
	},
	
	/**
	 * Compare fingerprints locally for a given fingerprint. If the fingerprint 
	 * should be excluded, the result is 1
	 * 
	 * @param {Fingerprint} fingerprint to compare
	 * @return {float} the percentage of similatiry in the last 20 fingerprints
	 */
	compareFingerprintLocal : function(fingerprint) 
	{
		//Case look through history
		var history = BrowserTrust.Storage.getFingerprints(fingerprint);
		var matching = 0;
		for (var i in history) {
			matching += history[i].hash == fingerprint.hash ? 1 : 0;
		}
		return matching/history.length;
	},
	
	/**
	 * Compare fingerprints remotely for a given fingerprint. If the fingerprint 
	 * should be excluded, the result is 1
	 * 
	 * @param {Fingerprint} fingerprint to compare
	 * @return {float} the percentage of similatiry in the last 20 fingerprints
	 */
	compareFingerprintRemote : function(fingerprint) 
	{
		//Case look through history
		var json = BrowserTrust.Server.getFingerprints(fingerprint);
		var matching = 0;
		for (var i in history) {
			matching += history[i].hash == fingerprint.hash ? 1 : 0;
		}
		return matching/history.length;
	},
	
	/**
	 * Compares the local fingerprint history to the current
	 * fingerprint to calculate a % of similarity
	 * 
	 * @returns a float 0-1 to show the percentage of similarity 
	 */
	compareFinderprintHtml : function()
	{
		var fingerprint = BrowserTrust.Engine.fingerprintHtml();
		var result = BrowserTrust.Engine.compareFingerprint(fingerprint);
		return result;
	},
	
	/**
	 * Generates a fingerprint from the input then checks that against the data
	 * stored to determine the fingerprints similarity with others
	 * 
	 * @param {String} uri of the data
	 * @param {String} data the string of data to be fingerprinted
	 * @return {fingerprint} the resulting fingerprint
	 */
	fingerprintAndCompare : function(uri, data) 
	{
		var fingerprint = BrowserTrust.Engine.fingerprint(uri, data);
		var localresult = BrowserTrust.Engine.compareFingerprint(fingerprint);
		fingerprint.result = localresult;
		return fingerprint;
	},
	
	/**
	 * Breakdown the nodes and add them to a string
	 * 
	 * @param {Node} node to start from
	 * @param {String} parentName the node name of the parent
	 * @param {String[]} trustFile tells the file what text to add or ignore
	 * @return {String} tagname and text content of each node
	 */
	breakDownNodes : function(node, parentName, trustFile) 
	{
		var result = "";
		for (var childNode = node.firstChild; childNode !== null; childNode = childNode.nextSibling)
		{	
			var nodeName = parentName + "." + childNode.tagName;
			if (BTEngine.shouldFingerprint(nodeName, trustFile)) 
			{
				result += childNode.textContent + "\n";
			}
			result += breakDownNodes(childNode, nodeName, trustFile);
		}
		return result;
	},
	
	/**
	 * Loads a trust file for a given url to an array
	 * 
	 * @param {String} uri to look for the file
	 * @return {String[]} an array key words
	 */
	getTrustFile : function(uri)
	{
		//Load file from url
		return {};
	},
	
	/**
	 * Caclulate if the fingerprint node should be finger printed
	 * 
	 * @param {String} nodeName path name of the node
	 * @param {String[]} exclusionFile the array to of path names to exclude
	 * @return {boolean} true if the node should be fingerprinted
	 */
	shouldFingerprint : function(nodeName, exclusionFile) 
        {
            var shouldIgnore = false;
            for (var i = 0; i < exclusionFile.length; i++) {
                if(exclusionFile[i] == nodeName) {
                    shouldIgnore = true;
                }
                //If nodeName matches pattern eg nodeName is a image.JPG and pattern is *.jpg then ignore
                else if(exclusionFile[i].contains("*")) {
                    if(nodeName.toLowerCase().indexOf(exclusionFile[i].substring(1,exclusionFile[i].length-1)) >= 0) {
                        shouldIgnore = true;
                    }
                }
            }
            return !shouldIgnore;
        },

	/**
	 * Process the listeners data from the tracers array
	 */
	processListenerTracers : function() 
	{
		while(BrowserTrust.Listeners.tracers.length > 0)
		{
			var tracer = BrowserTrust.Listeners.tracers.pop();
			var fingerprint = this.fingerprintAndCompare(tracer.getURL(), tracer.getAllData());
			this.addToArray(tracer.getURIHost(), tracer.getURIpath(), fingerprint);
			//window.alert(tracer.getURIHost() + " " + tracer.getURIpath() + " " + "Other" + " " + fingerprint.hash);
			BrowserTrust.Server.submitFingerprint(tracer.getURIHost(), tracer.getURIpath(), "Other", fingerprint.hash);
			BrowserTrust.Storage.storeFingerprint(fingerprint);
		}
		BrowserTrust.Sidebar.loadAllFingerprints();
		this.checkForAlert();
	}
};
