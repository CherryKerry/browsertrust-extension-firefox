/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  					Browser Trust Storage | (c) Browser Trust 2014						      */
/*										Version 1.1												  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * BrowserTrust namespace.
 */
if ("undefined" == typeof(BrowserTrust)) {
  var BrowserTrust = {};
};

/**
 * User Story 22: Stores a fingerprint and URL locally.
 * 
 * Documentation od SQLite in mozilla can be found here:
 * https://developer.mozilla.org/en-US/docs/Storage
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
		try {
			statement.execute();
			return true;
		} catch(err) {
			return false;
		} finally {
			dbConn.close();
		}
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
		try {
			while (statement.executeStep()) {
				prints.push({
	  				uri: statement.row.uri,
	  				hash: statement.row.hash
	  			});
			}
		} catch(err) {
		} finally {
			dbConn.close();
			return prints;
		}
  	},
  	
  	/**
  	 * Add a URI to the exclusion table
  	 * 
  	 * @param {String} uri to be added
  	 * @return {Boolean} true if URI was added, false if it was not
  	 */
  	setUriAsDynamic : function(uri)
  	{
  		let dbConn = BrowserTrust.Storage.getConnection();
  		let statement = dbConn.createStatement(
  				"INSERT INTO dynamic_sites (uri) VALUES (:uri);");
		statement.params.uri = uri;
		try {
			statement.execute();
			return true;
		} catch(err) {
			return false;
		} finally {
			dbConn.close();
		}
  	},
  	
  	/**
  	 * Removes a URI from the exclusion table
  	 * 
  	 * @param {String} uri to be removed
  	 * @return {Boolean} true if was removed, false it it wasn't
  	 */
	setUriAsStatic : function(uri)
	{
		let dbConn = BrowserTrust.Storage.getConnection();
  		let statement = dbConn.createStatement(
  				"DELETE FROM dynamic_sites WHERE uri=:uri;");
		statement.params.uri = uri;
		try {
			statement.execute();
			return true;
		} catch(err) {
			return false;
		} finally {
			dbConn.close();
		}
	},
	
	/**
	 * Checks if a URI is in the exclusion table
	 * 
	 * @param {String} uri to check is in the table
	 * @return {Boolean} true if it is in the table, false if it isn't
	 */
	isUriDynamic : function(uri)
	{
		let dbConn = BrowserTrust.Storage.getConnection();
  		let statement = dbConn.createStatement(
  				"SELECT uri FROM dynamic_sites WHERE uri=:uri;");
		statement.params.uri = uri;
		try {
			return statement.executeStep();
		} catch(err) {
			return false;
		} finally {
			dbConn.close();
		}
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
		//Create a table to store the fingerprints
		dbConn.executeSimpleSQL("CREATE TABLE IF NOT EXISTS fingerprints (" +
				"uri TEXT, " +
				"hash TEXT, " +
				"time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);");
		//Create the table to hold what pages the user wants to exclude
		dbConn.executeSimpleSQL("CREATE TABLE IF NOT EXISTS dynamic_sites (" +
				"uri TEXT PRIMARY KEY, " +
				"time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);");
		return dbConn;
  	}
  	
  	
  	
  	
};