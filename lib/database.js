/**
 * This is the database manager class. With this class you can select the database driver, connect 
 * to the driver and get a specific database.
 * @class database
 */
class manager {
	constructor(cerus) {
		this._cerus = cerus;
	}

	/**
	 * With this function you can select the driver the database manager will use. The driver is 
	 * the module that is used to interact with the database. This module depends on what you're 
	 * using, like MySQL or MongoDB. The function will automatically load the driver and if the
	 * driver is unknown it will throw an error.
	 * @summary Changes the database driver.
	 * @param {String} name The name of the driver.
	 * @function driver
	 */
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

	/**
	 * This function lets the driver connect to the database. How the driver connects to the 
	 * database depends on the driver. If your connecting to a local database, often you can use 
	 * "localhost" as domain to connect. This function returns a promise that will continue 
	 * depending on the events returned by the driver.
	 * @example
	 * cerus.database().connect("localhost");
	 * // -> connects to the database at localhost
	 * @summary Connects to the database.
	 * @param {String} domain The domain to connect to.
	 * @param {Object} [options] 
	 * @return {Promise} This function returns a promise.
	 * @function connect
	 */
	connect(domain, options = {}) {
		if(typeof domain !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		if(this._driver === undefined) {
			throw new Error("the driver must be set before connecting to a database");
		}

		return this._driver.connect(domain, options);
	}

	/**
	 * This function will return the specified database. Read more about databases {@link database.database.constructor here}.
	 * @summary Returns the specified database.
	 * @param {String} name The name of the database to return.
	 * @return {Class} The database class.
	 * @function database
	 */
	database(name) {
		return new database(this._driver, name);
	}

	/**
	 * This function lets you close the connection to the database. This is done to close unneeded 
	 * connections to relieve stress, since they are a pretty expensive resource. The function will
	 * return a promise that is called when the database has been closed.
	 * @example
	 * cerus.database().database("test").close();
	 * // -> closes the connection to the database
	 * @summary Closes the database.
	 * @return {Promise} This function returns a promise.
	 * @function close
	 */
	close() {
		return this._driver.close();
	}
}

module.exports = manager;

/**
 * This is the database class. With this class you can manage a database and get tables. You can 
 * also close the database with this class.
 * @class database.database
 */
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

	/**
	 * With this database you can clone the database. The database is cloned to the name specified 
	 * with the newdb parameter. It will return a promise that is called when the database is 
	 * closed.
	 * @example
	 * cerus.database("test1").clone("test2");
	 * // -> clones the database to test2
	 * @summary Clones the database.
	 * @param {String} newdb The name of the new database.
	 * @return {Promise} This function returns a promise.
	 * @function clone
	 */
	clone(newdb) {
		if(typeof newdb !== "string") {
			throw new TypeError("the argument newdb must be a string");
		}

		return this._database.clone(newdb);
	}

	/**
	 * This function lets you close the connection to the database. This is done to close unneeded 
	 * connections to relieve stress, since they are a pretty expensive resource. The function will
	 * return a promise that is called when the database has been closed.
	 * @example
	 * cerus.database("test").close();
	 * // -> closes the connection to the database
	 * @summary Closes the database.
	 * @return {Promise} This function returns a promise.
	 * @function close
	 */
	close() {
		return this._database.close();
	}

	/**
	 * This function will return the specified table.
	 * @example
	 * cerus.database("test").table("test_table");
	 * // -> return the "test_table" table
	 * @summary Returns the specified table.
	 * @param {String} name The name of the table to return.
	 * @return {Class} The specified table.
	 * @function table
	 */
	table(name) {
		return new table(this._database, name);
	}

	/**
	 * This function return the name of the database.
	 * @summary Returns the name of the database.
	 * @return {String} The name of the database.
	 * @function name
	 */
	name() {
		return this._database.name();
	}

	/**
	 * With this function you can delete the database. It returns a promise that is called when the
	 * database has been dropped.
	 * @example
	 * cerus.database("test").drop();
	 * // -> deletes the database
	 * @summary Drops the database.
	 * @return {Promise} This function returns a promise.
	 * @function drop
	 */
	drop() {
		return this._database.drop();
	}
}

/**
 * This is the table class. With this class you can manage the table returned by the 
 * {@link database.database.table} function.
 * @example
 * cerus.database("test").table("test_table");
 * // -> return the "test_table" table
 * @class database.table
 */
class table {
	constructor(database, name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		this._database = database;
		this._table = database.table(name);
	}

	/**
	 * With this function you can close the connection to the database. It is basically an alias of
	 * the {@link database.database.close} function. You should close connections when you're 
	 * finished with them, to relieve stress from the system. It returns a promise that is called 
	 * when the connection has been closed.
	 * @example
	 * cerus.database("test").table("test_table").close();
	 * // -> closes the connection to the database
	 * @summary Closes the connection to the database.
	 * @return {Promise} This function returns a promise.
	 * @function close
	 */
	close() {
		return this._database.close();
	}

	/**
	 * This function clears the table. This means removing everything that is in the table. Use
	 * {@link database.database.table.drop} to delete the whole table, instead of its contents. It
	 * returns a promise that is called when the table is cleared.
	 * @example
	 * cerus.database("test").table("test_table").clear();
	 * // -> clears everything in the table
	 * @summary Clears the table.
	 * @return {Promise} This function returns a promise.
	 * @function clear
	 */
	clear() {
		return this._table.clear();
	}

	/**
	 * With this function you can delete the table. This means removing the whole table. Use 
	 * {@link database.database.table.clear} to remove the contents of the table, instead of the whole
	 * table. It returns a promise that is called when the table has been dropped.
	 * @example
	 * cerus.database("test").table("test_table").drop();
	 * // -> deletes the table
	 * @summary Drops the table.
	 * @return {Promise} This function returns a promise.
	 * @function drop
	 */
	drop() {
		return this._table.drop();
	}

	/**
	 * This function lets you insert a row into the database. A row is basically a new item that 
	 * will be added to the table. This function will return a promise that is called when the row
	 * has been added.
	 * @example
	 * cerus.database("test").table("test_table").insert({row: "new_item"});
	 * // -> adds the item {row: "new_item"} to the table
	 * @summary Adds a new row to the table.
	 * @param {Object} row The row that will be added.
	 * @return {Promise} This function returns a promise.
	 * @function insert
	 */
	insert(row) {
		if(typeof row !== "object") {
			throw new TypeError("the argument row must be an object");
		}

		return this._table.insert(row);
	}

	/**
	 * With this function you can modify the specified rows. You can specify the rows using the 
	 * query parameter. Multiple rows can be selected to be modified. The columns that will be 
	 * modified are specified using the change paramater. This function will return a promise that 
	 * is called when the rows have been modified.
	 * @example
	 * cerus.database("test").table("test_table").modify({id: 1}, {row: "new_item"});
	 * // -> changes the item {id: 1, row: "item"} to {id: 1, row: "new_item"}
	 * @summary Modifies the specfied rows.
	 * @param {Object} query The rows that will be modified.
	 * @param {Object} change The changes that will be done to the rows.
	 * @return {Promise} This function returns a promise.
	 * @function modify
	 */
	modify(query, change) {
		if(typeof query !== "object") {
			throw new TypeError("the argument query must be an object");
		}
		
		if(typeof change !== "object") {
			throw new TypeError("the argument change must be an object");
		}


		return this._table.modify(query, change);
	}

	/**
	 * Using this function you can delete the specified rows. You can specify the rows you need to 
	 * be deleted using the query parameter. Multiple rows can be deleted. The function will return
	 * a promise that is resolved when the rows have been deleted.
	 * @example
	 * cerus.database("test").table("test_table").delete({id: 1});
	 * // -> deletes the item {id: 1, row: "item"}
	 * @summary Deletes the specified rows.
	 * @param {Object} query The rows that will be deleted.
	 * @return {Promise} This function returns a promise.
	 * @function delete
	 */
	delete(query) {
		if(typeof query !== "object") {
			throw new TypeError("the argument query must be an object");
		}

		return this._table.delete(query);
	}

	/**
	 * With this function you can find the specified rows. The rows that will be searched for are 
	 * specified using the query parameter. Multiple rows can be searched for. The function will 
	 * return a promise that is resolved with all the rows that were found.
	 * @summary Seaches for the specified rows.
	 * @param {Object} query The rows that will be searched for.
	 * @return {Promise} This function returns a promise.
	 * @function find
	 */
	find(query) {
		if(typeof query !== "object") {
			throw new TypeError("the argument query must be an object");
		}

		return this._table.find(query);
	}

	/**
	 * Using this function you can count the rows that are specified. The rows that will be counted
	 * can be specified using the query parameter. The function returns a promise that is resolved 
	 * with the amount of rows that were found.
	 * @summary Counts the specified rows.
	 * @param {Object} query The rows that will be counted.
	 * @return {Promise} This function returns a promise.
	 * @function count
	 */
	count(query) {
		if(typeof query !== "object") {
			throw new TypeError("the argument query must be an object");
		}

		return this._table.count(query);
	}

	/**
	 * With this function you can clone this database to the specified name. The promise that is 
	 * returned resolves when the database has been created. It will reject when the name that the 
	 * database is being cloned to already is already used.
	 * @summary Clones this database.
	 * @param {String} new_database The name to clone to.
	 * @return {Promise} This function returns a promise.
	 * @function clone
	 */
	clone(new_database) {
		if(typeof new_database !== "string") {
			throw new TypeError("the argument new_database must be a string");
		}

		return this._table.clone(new_database);
	}

	/**
	 * This function returns the {@link columns} class.
	 * @summary Returns the {@link columns} class.
	 * @return {Class} Returns the columns class.
	 * @function columns
	 */
	columns() {
		return new columns(this._table);
	}

	/**
	 * This function returns the {@link keys} class.
	 * @summary Returns the {@link keys} class.
	 * @return {Class} Returns the keys class.
	 * @function keys
	 */
	keys() {
		return new keys();
	}
}

/**
 * This is the columns class. Using this class you can manage the columns for the {@link database.table.contructor} class.
 * @class database.table.columns
 */
class columns {
	constructor(table) {
		this._columns = table.columns();
	}

	/**
	 * This function adds a column to the table. The name of the new column is specified using the 
	 * name parameter. You can set the data type of the column using the datatype parameter. The 
	 * function returns a promise that is resolved when the new column has been created.
	 * @summary Adds a new columns to the table.
	 * @param {String} name The name of the new column.
	 * @param {String} datatype The data type of the new column.
	 * @return {Promise} This function returns a promise.
	 * @function add
	 */
	add(name, datatype) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		return this._columns.add(name, datatype);
	}

	/**
	 * Using this function you can drop the specified column. You can specify the column that will 
	 * be dropped using the name parameter. The function returns a promise that is resolved when 
	 * the column has been dropped.
	 * @summary Drops the specified column.
	 * @param {String} name The name of the column to drop.
	 * @return {Promise} This function returns a promise.
	 * @function drop
	 */
	drop(name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		return this._columns.drop(name);
	}

	/**
	 * This function modifies the specified column. The name of the columns that will be modified 
	 * is specified using the name parameters and can be modified using the options parameter. The
	 * function returns a promise that is resolved when the column has been modified.
	 * @summary Modifies the specified column.
	 * @param {String} name The name of the column to modify.
	 * @param {Object} options The options containing what will be modified.
	 * @return {Promise} This function returns a promise.
	 * @function modify
	 */
	modify(name, options) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		return this._columns.modify(name, options);
	}

	/**
	 * With this function you can check if a column exists. The function returns a promise that is 
	 * resolved with a boolean if the column exists.
	 * @summary Checks if the column exists.
	 * @param {String} name The name of the column exists.
	 * @return {Promise} This function returns a promise.
	 * @function has
	 */
	has(name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		return this._columns.exists(name);
	}

	/**
	 * This function returns a promise that resolves with the specified column as argument.
	 * @summary Returns the specified column.
	 * @param {String} name The name of the column to return.
	 * @return {Promise} This function returns a promise.
	 * @function get
	 */
	get(name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		return this._columns.get(name);
	}

	/**
	 * This function returns promise that is resolved with a list with all of the columns.
	 * @summary Lists all of the columns.
	 * @return {Promise} This function returns a promise.
	 * @function list
	 */
	list() {
		return this._columns.list();
	}

	/**
	 * With this function you can remove all of the columns.
	 * @summary Clears all of the columns.
	 * @return {Promise} This function returns a promise.
	 * @function clear
	 */
	clear() {
		return this._colums.clear();
	}
}

/**
 * @class database.table.keys
 */
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

/**
 * @class database.table.keys.primary
 */
class primary {
	constructor(primary) {
		this._primary = primary;
	}

	create(column) {
		if(typeof column !== "string") {
			throw new TypeError("the argument column must be a string");
		}

		return this._primary.create(column);
	}

	drop() {
		return this._primary.drop();
	}
}

/**
 * @class database.table.keys.secondary
 */
class secondary {
	constructor(secondary) {
		this._secondary = secondary;
	}

	create(name, column) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		if(typeof column !== "string") {
			throw new TypeError("the argument column must be a string");
		}

		return this._secondary.create(name, column);
	}

	has(name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		return this._secondary.has(name);
	}

	drop(name) {
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
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
