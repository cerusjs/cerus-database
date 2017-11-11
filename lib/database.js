module.exports = function(cerus) {
	var self = {};

	var driver;
	var driver_name;

	self.driver = function(driver_) {
		if(typeof driver_ !== "string") {
			throw new TypeError("argument driver_ must be a string");
		}

		switch(driver_) {
			case "mongo":
			case "mysql":
			case "nosql":
				driver = require("cerus-" + driver_)(cerus);
				driver_name = driver_;
				break;
			default:
				throw new Error("the driver " + driver_ + " is unknown");
		}

		return driver_name;
	}

	self.connect = function(domain, port, username, password) {
		if(typeof domain !== "string") {
			throw new TypeError("argument name must be a string");
		}

		if(driver === undefined) {
			throw new Error("the driver must be set before connecting");
		}

		return driver.connect(domain, port, username, password);
	}

	self.database = function(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		if(driver === undefined) {
			throw new Error("the driver must be set before selecting a database");
		}

		var self_ = {};
		var database = driver.database(name);

		self_.clone = function(newdb) {
			if(typeof newdb !== "string") {
				throw new TypeError("argument newdb must be a string");
			}

			return database.clone(newdb);
		}

		self_.close = function() {
			return database.close();
		}

		self_.drop = function() {
			return database.drop();
		}

		self_.table = function(name) {
			if(typeof name !== "string") {
				throw new TypeError("argument name must be a string");
			}

			var self_ = {};
			var table = database.table(name);

			self_.close = function() {
				return database.close();
			}

			self_.clear = function() {
				return table.clear();
			}

			self_.drop = function() {
				return table.drop();
			}

			self_.insert = function(row) {
				if(typeof row !== "object") {
					throw new TypeError("argument row must be an object");
				}

				return table.insert(row);
			}

			self_.modify = function(query, change) {
				if(typeof query !== "object") {
					throw new TypeError("argument query must be an object");
				}
				
				if(typeof change !== "object") {
					throw new TypeError("argument change must be an object");
				}


				return table.modify(query, change);
			}

			self_.delete = function(query) {
				if(typeof query !== "object") {
					throw new TypeError("argument query must be an object");
				}

				return table.delete(query);
			}

			self_.find = function(query) {
				if(typeof query !== "object") {
					throw new TypeError("argument query must be an object");
				}

				return table.find(query);
			}

			self_.count = function(query) {
				if(typeof query !== "object") {
					throw new TypeError("argument query must be an object");
				}

				return table.count(query);
			}

			self_.clone = function(new_) {
				if(typeof new_ !== "string") {
					throw new TypeError("argument new_ must be a string");
				}

				return table.clone(new_);
			}

			self_.columns = function() {
				var self_ = {};
				var columns = table.columns();

				self_.add = function(name, datatype, options) {
					if(typeof name !== "string") {
						throw new TypeError("argument name must be a string");
					}

					return columns.add(name, datatype, options);
				}

				self_.drop = function(name) {
					if(typeof name !== "string") {
						throw new TypeError("argument name must be a string");
					}

					return column.drop(name);
				}

				self_.modify = function(name, options) {
					if(typeof name !== "string") {
						throw new TypeError("argument name must be a string");
					}

					return column.modify(name, options);
				}

				return self_;
			}

			self_.keys = function() {
				var self_ = {};
				var keys = table.keys();

				self_.primary = function() {
					var self_ = {};
					var primary = keys.primary();

					self_.create = function(column) {
						if(typeof column !== "string") {
							throw new TypeError("argument column must be a string");
						}

						return primary.create(column);
					}

					self_.drop = function() {
						return primary.drop();
					}

					return self_;
				}

				self_.secondary = function() {
					var self_ = {};
					var secondary = keys.secondary();

					self_.create = function(name, column) {
						if(typeof name !== "string") {
							throw new TypeError("argument name must be a string");
						}

						if(typeof column !== "string") {
							throw new TypeError("argument column must be a string");
						}

						return secondary.create(name, column);
					}

					self_.drop = function(name) {
						if(typeof name !== "string") {
							throw new TypeError("argument name must be a string");
						}

						return secondary.drop(name);
					}

					self_.list = function() {
						return secondary.list();
					}
				}

				return self_;
			}

			return self_;
		}

		return self_;
	}

	return self;
}