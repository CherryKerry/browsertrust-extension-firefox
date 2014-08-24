/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  				Browser Trust Browser Listers | (c) Browser Trust 2014					      */
/*										Version 1.0												  */
/* 							this version has not been tested 									  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

//Global utility methods and Firefox services
var Cc = Components.classes;
var Ci = Components.interfaces;
var observerService = CCSE("@mozilla.org/observer-service;1", "nsIObserverService");

function CCIN(cName, ifaceName) 
{
    return Cc[cName].createInstance(Ci[ifaceName]);
}

function CCSE(cName, serviceName) 
{
    return Cc[cName].getService(Ci[serviceName]);
}

BrowserTrust.Listeners = 
{
	/**
	 * An array of TracingListeres attached to HTTP request
	 * @type Array
	 */
	tracers : [],
	
	/**
	 * An EventListener for triggering the fingerprint engine, the listener
	 * can be added to the Window Events Listeners for set JS Events
	 * 
	 * @param {} event
	 */
	eventListener : function(event) 
	{
		BrowserTrust.Engine.processListenerTracers();
	}
}

/**
 * Http Observer that assigns a new TracingListener to every http request
 * made by firefox. The Tracer is added to the BrowserTrust Listeners tracers array
 * @type Observer
 */
var httpObserver =
{
    observe: function(subject, topic, data)
    {
        if (topic == "http-on-modify-request") {
        	//Setup Http Channel used in the Tracer
        	subject.QueryInterface(Ci.nsIHttpChannel);
        	//Create tracer and add to tracer array
	        var newListener = new TracingListener();
	        newListener.request = subject;
	        BrowserTrust.Listeners.tracers.push(newListener);
	        //Attach tracing listener to request
	        subject.QueryInterface(Ci.nsITraceableChannel);
	        newListener.originalListener = subject.setNewListener(newListener);
	    }
    },
    
    QueryInterface : function (aIID)
    {
        if (aIID.equals(Ci.nsIObserver) ||
            aIID.equals(Ci.nsISupports))
        {
            return this;
        }
        throw Components.results.NS_NOINTERFACE;
    }
};

//Add the Http Observer to the firefox observer service 
observerService.addObserver(httpObserver, "http-on-modify-request", false);
window.addEventListener('DOMContentLoaded', BrowserTrust.Listeners.eventListener, false);

/**
 * TracingListener Class that intercepts http responces, reads them and adds the data
 * and request info to itself. All on calls are passed to the origional listener to
 * load the web page
 */
function TracingListener() 
{
	this.originalListener = null;
    this.receivedData = [];
    this.request = null;
    
    /**
     * Overidden method from nsIStreamListener
     */
    this.onDataAvailable = function(request, context, inputStream, offset, count)
    {
    	//Set listener to have a request
    	this.request = request;
    	BrowserTrust.Test.debug("Responce Recieved From:" + this.getURL());
    	
    	//Get streams 
        var binaryInputStream = CCIN("@mozilla.org/binaryinputstream;1", "nsIBinaryInputStream");
        var storageStream = CCIN("@mozilla.org/storagestream;1", "nsIStorageStream");
        var binaryOutputStream = CCIN("@mozilla.org/binaryoutputstream;1", "nsIBinaryOutputStream");
		
        //Prepare streams
        binaryInputStream.setInputStream(inputStream);
        storageStream.init(8192, count, null);
        binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));

        //Read data from inputStream
        var data = binaryInputStream.readBytes(count);
        BrowserTrust.Test.debug("Response data: " + data);
		
        //Add data to listeners data array
        this.receivedData.push(data);
		
        //Pass data to origional listener
        binaryOutputStream.writeBytes(data, count);
        this.originalListener.onDataAvailable(request, context, storageStream.newInputStream(0), offset, count);
    };

    /**
     * Overidden method from nsIRequestObserver
     */
    this.onStartRequest = function(request, context) {
        this.originalListener.onStartRequest(request, context);
    };

    /**
     * Overidden method from nsIRequestObserver
     */
    this.onStopRequest = function(request, context, statusCode) {
        this.originalListener.onStopRequest(request, context, statusCode);
    };

    /**
     * Overidden method from nsISupports
     */
    this.QueryInterface = function (aIID) {
        if (aIID.equals(Ci.nsIStreamListener) ||
            aIID.equals(Ci.nsISupports)) {
            return this;
        }
        throw Components.results.NS_NOINTERFACE;
    };
    
    /**
     * Get the host name from the request
     * @return {String}
     */
    this.getURIHost = function()
    {
    	if (this.request == null)
    	{
    		return "";
    	}
    	else
    	{
    		return this.request.URI.host
    	}
    		
    };
    
    /**
     * Get the resource path from the request
     * @return {String}
     */
    this.getURIpath = function()
    {
    	if (this.request == null)
    	{
    		return "";
    	}
    	else
    	{
    		return this.request.URI.path
    	}
    };
    
    /**
     * Get the full url from the request
     * @return {String}
     */
    this.getURL = function()
    {
    	return this.getURIHost() + this.getURIpath();
    };
    
    /**
     * Get all response data from the listener
     * @return {String}
     */
    this.getAllData = function()
    {
    	var data = "";
    	for (var i in this.receivedData)
    	{
    		data += this.receivedData[i];
    	}
    	return data;
    }
}