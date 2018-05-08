module.exports = function() {
	var plugin = {};
	var package = require("./package.json");
	var database;
	
	plugin.name = package["name"];
	plugin.version = package["version"];


	plugin._init = function(cerus) {
		database = new (require("./lib/database"))(cerus);
	}

	plugin.database = function() {
		return database;
	}

	return plugin;
}