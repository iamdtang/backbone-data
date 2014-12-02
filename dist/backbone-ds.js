(function(window, undefined) {
	var DS = {};
	var resources = {};
	var store = {};
	var incomplete = {};
	
	/**
	 * @param  {String} resourceName 	The name of the resource when defined
	 * @param  {Array|Object} data		A array of object or just a plain json object
	 */
	function addIncomplete(resourceName, data) {
		var idAttribute = resources[resourceName].idAttribute;
		var id;

		incomplete[resourceName] = incomplete[resourceName] || {};

		if (_.isArray(data)) {
			data.forEach(function(item) {
				var id = item[idAttribute];
				incomplete[resourceName][id] = true;
			});	
		} else {
			id = data[idAttribute];
			incomplete[resourceName][id] = true;
		}
	}

	/**
	 * Determine if a model if incomplete or not
	 * @param  {String} resourceName 	The name of the resource when defined
	 * @param  {Number|String} id     The unique ID of the model to find
	 * @return {Boolean}              True if the model is incomplete, false if complete
	 */
	function isIncomplete(resourceName, id) {
		if (incomplete[resourceName]) {
			return incomplete[resourceName][id];
		}
			
		return false; 
	}

	/**
	 * Define a resource for the store
	 * @param  {Object} resourceDefinition An object containing idAttribute, name, collection, and model
	 */
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
	 * @param  {Array|Object} data		A array of object or just a plain json object
	 * @return {Array|Backbone.Model}   The added models
	 */
	DS.inject = function(resourceName, data, options) {
		var collection;

		options = _.extend({ incomplete: false }, options);
		collection = store[resourceName];

		if (options.incomplete) {
			addIncomplete(resourceName, data);	
		}
		
		return collection.add(data);
	};

	/**
	 * Synchronously return a model from the store
	 * @param  {String} resourceName 	The name of the resource when defined
	 * @param  {Number|String} id     The unique ID of the model to find
	 * @return {Backbone.Model}       The Backbone model, or null otherwise
	 */
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

	/**
	 * Reset all models for a resource
	 * @param  {String} resourceName 	The name of the resource when defined
	 */
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
		var model = this.get(resourceName, id);
		var newModel;
		var dfd = $.Deferred();

		if (model) {			
			if (isIncomplete(resourceName, id)) {
				return model.fetch().then(function() {
					delete incomplete[resourceName][id];
					return model;
				});
			} 

			dfd.resolve(model);
			return dfd.promise();
		}

		attr[idAttribute] = id;
		newModel = new resources[resourceName].model(attr);

		return newModel.fetch().then(function() {
			DS.inject(resourceName, newModel);	
			return newModel;
		}, function() {
			throw new Error('error fetching model: ' + id);
		});		
	};

	/**
	 * Request a collection from the server and inject models in store.
	 * This does reset the collection for resourceName.
	 * Still debating on if this is what it should do...
	 */
	DS.findAll = function(resourceName, options) {
		var collection = store[resourceName];

		return collection.fetch().then(function(models) {
			DS.inject(resourceName, models, options);
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

	DS.filter = function(resourceName, predicate) {
		var collection = store[resourceName];
		var Collection = resources[resourceName].collection;
		var filteredCollection = new Collection();

		var models = collection.filter(predicate);
		filteredCollection.add(models);

		return filteredCollection;
	};

	DS.update = function(resourceName, id, properties) {
		var model = this.get(resourceName, id);

		model.set(properties);
		return model.save().then(function() {
			return model;
		});
	};

	/**
	 * Saves and injects model into the store
	 * @param  {String} resourceName 		The name of the resource when defined
	 * @param  {Backbone.Model} model   The model to save, probably from DS.createInstance
	 * @return {Promise}           			A promise that resolves with the model being saved   
	 */
	DS.create = function(resourceName, model) {
		var id = resources[resourceName].idAttribute;

		return model.save().then(function(json) {
			store[resourceName].add(model);
			return model;
		});
	};

	DS.destroy = function(resourceName, id) {
		var model = this.get(resourceName, id);

		return model.destroy();
	};

	/**
	 * Clear out the entire store and all resources
	 * @return {Object}		Return the DS instance
	 */
	DS.reset = function() {
		store = {};
		resources = {};
		incomplete = {};

		return this;
	};

	window.DS = DS;

	if (typeof define === "function" && define.amd) {
		define(['backbone'], function(Backbone) {
			return DS;
		});
	}

})(window);