(function(window, undefined) {
	var DS = {};
	var resources = {};
	var store = {};
	
	DS.defineResource = function(resourceDefinition) {
		var resourceName;
		var required = ['idAttribute', 'name', 'collection', 'model'];

		required.forEach(function(prop) {
			if (!resourceDefinition.hasOwnProperty(prop) || !resourceDefinition[prop]) {
				throw new Error(prop + ' must be specified when defining a resource');
			}
		});

		resourceName = resourceDefinition.name;
		
		if (resources[resourceName]) {
			throw new Error(resourceName + ' resource has already been defined!');
		}

		resources[resourceName] = resourceDefinition;
		
		if (!store[resourceName]) {
			store[resourceName] = new resourceDefinition.collection();
		}

		return this;
	};

	/**
	 * Create a new instance of a resource
	 * @param  {String} resourceName 	The name of the resource when defined
	 * @return {Backbone.Model}       
	 */
	DS.createInstance = function(resourceName) {
		return new resources[resourceName].model();
	};

	/**
	 * Inject data into the store for a given resource
	 * @param  {String} resourceName 	The name of the resource when defined
	 * @return {Array|Backbone.Model}   The added models
	 */
	DS.inject = function(resourceName, data) {
		var collection = store[resourceName];
		return collection.add(data);
	};

	DS.get = function(resourceName, id) {
		var model;
		var collection;
		var idAttribute = resources[resourceName].idAttribute;
		var attr = {};

		collection = store[resourceName];

		if (collection) {
			attr[idAttribute] = id;
			model = collection.findWhere(attr);

			if (model) {
				return model;
			}
		}

		return null;
	};

	/**
	 * Synchronously return all items from the store for a given resource
	 * @param  {String} resourceName 	The name of the resource when defined
	 * @return {Backbone.Collection}  The collection associated with resourceName
	 */
	DS.getAll = function(resourceName) {
		return store[resourceName];
	};

	DS.ejectAll = function(resourceName) {
		var collection = store[resourceName];
		
		if (collection) {
			collection.reset();	
		}
	};

	/** 
	 * Find a model from the store. If not in store, fetches it asynchronously
	 * and puts the model in the store
	 * 
	 * @param  {String} resourceName The name of the resource when defined
	 * @param  {Number|String} id    The unique ID of the model to find
	 * @return {promise}             Returns a jQuery promise
	 */
	DS.find = function(resourceName, id) {
		var attr = {};
		var idAttribute = resources[resourceName].idAttribute;
		var model = this.get('person', id);
		var dfd = $.Deferred();
		var promise;

		if (model) {
			dfd.resolve(model);
			return dfd.promise();
		}

		attr[idAttribute] = id;
		model = new resources[resourceName].model(attr);

		return model.fetch().then(function() {
			DS.inject(resourceName, model);
			return model;
		}, function() {
			throw new Error('error fetching model: ' + id);
		});		
	};

	/**
	 * Request a collection from the server and inject models in store.
	 * This does reset the collection for resourceName.
	 * Still debating on if this is what it should do...
	 */
	DS.findAll = function(resourceName) {
		var collection = store[resourceName];

		return collection.fetch().then(function(models) {
			DS.inject(resourceName, models);
			return collection;
		}, function() {
			throw new Error('error fetching collection: ' + resourceName);
		});
	};

	/**
	 * Proxies to Backbone.Collection.prototype.where
	 * @param  {String} resourceName The name of the resource when defined
	 * @param  {Object} attributes   Attributes property that is passed to collection.where()
	 * @return {Collection}          A new filtered resource collection
	 */
	DS.where = function(resourceName, attributes) {
		var collection = store[resourceName];
		var Collection = resources[resourceName].collection;
		var filteredCollection = new Collection();
		var models = collection.where(attributes);

		filteredCollection.add(models);
		return filteredCollection;
	};

	/**
	 * Clear out the entire store and all resources
	 * @return {Object}		Return the DS instance
	 */
	DS.reset = function() {
		store = {};
		resources = {};

		return this;
	};

	window.DS = DS;

	if (typeof define === "function" && define.amd) {
		define(['backbone'], function(Backbone) {
			return DS;
		});
	}

})(window);