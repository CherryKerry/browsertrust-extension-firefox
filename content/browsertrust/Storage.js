/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  					Browser Trust Storage | (c) Browser Trust 2014						      */
/*										Version 1.0												  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

/**
 * User Story 22: Stores a fingerprint and URL locally.
 */
BrowserTrust.Storage = 
{
	/**
	 * Store a fingerprint in the database under the fingerprints table
	 * 
	 * @param {Fingerprint} fingerprint to be saved
	 */
  	storeFingerprint : function(fingerprint) 
  	{
  		let dbConn = BrowserTrust.Storage.getConnection();
	  	let statement = dbConn.createStatement(
				"INSERT INTO fingerprints (uri, hash) VALUES (:uri, :hash);");
		statement.params.uri = fingerprint.uri;
		statement.params.hash = fingerprint.hash;
		return !(statement.executeStep());
  	},
  	
  	/**
  	 * Obtain fingerprints from a database that are from the same uri. 
  	 * -Note this is executed syncronusly which can cause performance issues.
  	 *  There is a limit of 20 returned prints and order is with newest first
  	 * 
  	 * @param {Fingerprint} fingerprint that needs the URI to be obtained
  	 * @return {Array} array of fingerprints selected from the database
  	 */
  	getFingerprints : function(fingerprint) 
  	{
  		let prints = [];
  		let dbConn = BrowserTrust.Storage.getConnection();
  		let statement = dbConn.createStatement("SELECT * FROM fingerprints WHERE uri = :uri ORDER BY time DESC LIMIT 20");
		statement.params.uri = fingerprint.uri;
		while (statement.executeStep()) {
			prints.push({
  				uri: statement.row.uri,
  				hash: statement.row.hash
  			});
		}
		return prints;
  	},
  	
  	/**
  	 * Gets a connection to the sqlite Browser trust database and sets up the 
  	 * database and fingerprint table if it has not been created already
  	 * 
  	 * @return {DatabaseConnection} connection the the sqlite database
  	 */
  	getConnection : function() 
  	{
  		Components.utils.import("resource://gre/modules/Services.jsm");
		Components.utils.import("resource://gre/modules/FileUtils.jsm");
		let file = FileUtils.getFile("ProfD", ["browsertrust.sqlite"]);
		let dbConn =  Services.storage.openDatabase(file);
		dbConn.executeSimpleSQL("CREATE TABLE IF NOT EXISTS fingerprints (" +
				"uri TEXT, " +
				"hash TEXT, " +
				"time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);");
		return dbConn;
  	}
  	
  	
  	
  	
};