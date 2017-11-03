module.exports = function() {
	var self = {};

	var package = require("./package.json");
	
	self.name = package["name"];
	self.version = package["version"];

	var database;

	self.init_ = function(cerus) {
		database = require("./lib/database")(cerus);
	}

	self.database = function() {
		return database;
	}

	return self;
}