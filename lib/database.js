class manager {
	constructor(cerus) {
		this._driver = undefined;
		this._name = undefined;
		this._cerus = cerus;
	}

	driver(name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		switch(name) {
			case "mongo":
				this._driver = require("cerus-" + name)(this._cerus);
				this._name = name;
				break;
			default:
				throw new Error("the driver " + name + " is unknown");
		}
	}

	connect(domain, options = {}) {
		if(typeof domain !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		if(this._driver === undefined) {
			throw new Error("the driver must be set before connecting");
		}

		return this._driver.connect(domain, options);
	}

	database(name) {
		return new database(this._driver, name);
	}
}

module.exports = manager;

class database {
	constructor(driver, name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		if(driver === undefined) {
			throw new Error("the driver must be set before selecting a database");
		}

		this._driver = driver;
		this._database = driver.database(name);
	}

	clone(newdb) {
		if(typeof newdb !== "string") {
			throw new TypeError("the argument newdb must be a string");
		}

		return this._database.clone(newdb);
	}

	close() {
		return this._database.close();
	}

	table(name) {
		return new table(this._database, name);
	}

	name() {
		return this._database.name();
	}
}

class table {
	constructor(database, name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		this._database = database;
		this._table = database.table(name);
	}

	close() {
		return this._database.close();
	}

	clear() {
		return this._table.clear();
	}

	drop() {
		return this._table.drop();
	}

	insert(row) {
		if(typeof row !== "object") {
			throw new TypeError("argument row must be an object");
		}

		return this._table.insert(row);
	}

	modify(query, change) {
		if(typeof query !== "object") {
			throw new TypeError("argument query must be an object");
		}
		
		if(typeof change !== "object") {
			throw new TypeError("argument change must be an object");
		}


		return this._table.modify(query, change);
	}

	delete(query) {
		if(typeof query !== "object") {
			throw new TypeError("argument query must be an object");
		}

		return this._table.delete(query);
	}

	find(query) {
		if(typeof query !== "object") {
			throw new TypeError("argument query must be an object");
		}

		return this._table.find(query);
	}

	count(query) {
		if(typeof query !== "object") {
			throw new TypeError("argument query must be an object");
		}

		return this._table.count(query);
	}

	clone(new_) {
		if(typeof new_ !== "string") {
			throw new TypeError("argument new_ must be a string");
		}

		return this._table.clone(new_);
	}

	columns() {
		return new columns(this._table);
	}

	keys() {
		return new keys();
	}
}

class columns {
	constructor(table) {
		this._columns = table.columns();
	}

	add(name, datatype, options) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._columns.add(name, datatype, options);
	}

	drop(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._columns.drop(name);
	}

	modify(name, options) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._columns.modify(name, options);
	}

	has(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._columns.exists(name);
	}

	get(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._columns.get(name);
	}

	list() {
		return this._columns.list();
	}

	clear() {
		return this._colums.clear();
	}
}

class keys {
	constructor(table) {
		this._keys = table.keys();
		this._primary = new primary(this._keys.primary());
		this._secondary = new secondary(this._keys.secondary());
	}

	primary() {
		return this._primary;
	}

	secondary() {
		return this._secondary;
	}
}

class primary {
	constructor(primary) {
		this._primary = primary;
	}

	create(column) {
		if(typeof column !== "string") {
			throw new TypeError("argument column must be a string");
		}

		return this._primary.create(column);
	}

	drop() {
		return this._primary.drop();
	}
}

class secondary {
	constructor(secondary) {
		this._secondary = secondary;
	}

	create(name, column) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		if(typeof column !== "string") {
			throw new TypeError("argument column must be a string");
		}

		return this._secondary.create(name, column);
	}

	has(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._secondary.drop(name);
	}

	drop(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		return this._secondary.drop(name);
	}

	list() {
		return this._secondary.list();
	}

	clear() {
		return this._secondary.clear();
	}
}
