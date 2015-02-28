(function(window, undefined) {
	var DS = {};
	var resources = {};
	var store = {};
	var incomplete = {};
	var collectionStatus = {};
	
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

	function isModelResource(resourceName) {
		if (resources[resourceName].collection) {
			return false;
		}

		return true;
	}

	/**
	 * Define a resource for the store
	 * @param  {Object} resourceDefinition An object containing idAttribute, name, collection, and model
	 */
	DS.defineResource = function(resourceDefinition) {
		if (!resourceDefinition.hasOwnProperty('name') || !resourceDefinition['name']) {
			throw new Error('name must be specified when defining a resource');	
		}

		if (!resourceDefinition.hasOwnProperty('model') || !_.isFunction(resourceDefinition['model'])) {
			throw new Error('model must be specified when defining a resource');
		}
		
		if (!resourceDefinition.hasOwnProperty('idAttribute') || !resourceDefinition['idAttribute']) {
			if (resourceDefinition.collection) {
				throw new Error('idAttribute must be specified when defining a resource');	
			}
		}

		if (resources[resourceDefinition.name]) {
			throw new Error(resourceDefinition.name + ' resource has already been defined!');
		}

		resources[resourceDefinition.name] = resourceDefinition;
		
		if (!store[resourceDefinition.name]) {
			if (resourceDefinition.collection) {
				store[resourceDefinition.name] = new resourceDefinition.collection();	
			} else {
				store[resourceDefinition.name] = new resourceDefinition.model();
			}
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
		var collection, model;

		if (store[resourceName] instanceof Backbone.Collection) {
			options = _.extend({ incomplete: false }, options);
			collection = store[resourceName];

			if (options.incomplete) {
				addIncomplete(resourceName, data);	
			}
			
			return collection.add(data);
		} else {
			model = store[resourceName];
			return model.set(data);
		}		
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
		var idAttribute;
		var attr = {};

		if (isModelResource(resourceName)) {
			return store[resourceName];
		} else {
			idAttribute = resources[resourceName].idAttribute;
			collection = store[resourceName];

			if (collection) {
				attr[idAttribute] = id;
				model = collection.findWhere(attr);

				if (model) {
					return model;
				}
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

	function findModelResource(resourceName) {
		var dfd = new $.Deferred();
		var model = this.get(resourceName);

		model.fetch().then(function() {
			dfd.resolve(model);
		});

		return dfd.promise();
	}

	function findCollectionResource(resourceName, id) {
		var attr = {};
		var idAttribute;
		var newModel;
		var dfd = $.Deferred();
		var model;

		model = this.get(resourceName, id);
		idAttribute = resources[resourceName].idAttribute;


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
	}

	/** 
	 * Find a model from the store. If not in store, fetches it asynchronously
	 * and puts the model in the store
	 * 
	 * @param  {String} resourceName The name of the resource when defined
	 * @param  {Number|String} id    The unique ID of the model to find
	 * @return {promise}             Returns a jQuery promise
	 */
	DS.find = function(resourceName, id) {
		if (isModelResource(resourceName)) {
			return findModelResource.call(this, resourceName);
		} else {
			return findCollectionResource.call(this, resourceName, id);
		}
	};

	/**
	 * Request a collection from the server once and inject models in store.
	 * This does reset the collection for resourceName.
	 */
	DS.findAll = function(resourceName, options) {
		var collection = store[resourceName];
		var dfd = $.Deferred();

		if (collectionStatus.hasOwnProperty(resourceName)) {
			dfd.resolve(collection);
			return dfd.promise();
		}

		return collection.fetch().then(function(models) {
			DS.inject(resourceName, models, options);
			collectionStatus[resourceName] = 'completed';
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
		collectionStatus = {};

		return this;
	};

	window.DS = DS;

	if (typeof define === "function" && define.amd) {
		define(['backbone'], function(Backbone) {
			return DS;
		});
	}

})(window);