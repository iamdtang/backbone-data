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
		store[resourceName].add(data);
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

			if (!model) {
				return null;
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

	DS.removeResource = function(resourceName) {
		delete store[resourceName];
	};

	window.DS = DS;

})(window);