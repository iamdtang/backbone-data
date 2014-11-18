(function(window, undefined) {
	var DS = {};
	var resources = {};
	var store = {};
	
	DS.defineResource = function(resourceDefinition) {
		var resourceName;

		if (!resourceDefinition.collection) {
			throw new Error('You must specify a collection when defining a resource');
		}

		resourceName = resourceDefinition.name;
		resources[resourceName] = resourceDefinition;
		
		if (!store[resourceName]) {
			store[resourceName] = new resourceDefinition.collection();
		}
	};

	DS.createInstance = function(resourceName) {
		return new resources[resourceName].model();
	};

	DS.inject = function(resourceName, data) {
		var collection = store[resourceName];
		collection.add(data);
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
	 * Find a model
	 * @param  {[type]} resourceName [description]
	 * @param  {[type]} id           [description]
	 * @return {promise}              [description]
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
	 * request a collection from the server and inject models in store
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

	DS.removeResource = function(resourceName) {
		delete store[resourceName];
	};

	window.DS = DS;

})(window);