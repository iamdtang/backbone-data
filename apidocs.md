API Documentation
=================

Until I get full documentation up, see the test files for examples.

### DS.defineResource(resourceDefinition)

Create a resource by giving it a Backbone model, collection, a unique name, and the property name that uniquely identifies the models for this resource type (the primary key).

```js
var Person = Backbone.Model.extend({
	url: function() {
		return '/people/' + this.get('id')
	}
});

var PersonCollection = Backbone.Collection.extend({
	model: Person
});

DS.defineResource({
	name: 'person',
	idAttribute: 'id',
	model: Person,
	collection: PersonCollection
});
```

### DS.find(resourceName, id [, options])

This method is used to fetch a model if it is not in the data store, or returns a model already in the store wrapped up in a promise.

Fetching a model not in the store:

```js
// makes AJAX request using model's fetch() method
DS.find('person', 3).then(function(person) {
	DS.get('person', 3) === person;
});
```

Fetching a model that is already in the store

```js
DS.inject('person', { id: 3, name: 'David' });

// Does not make AJAX call
DS.find('person', 3).then(function(person) {
	DS.get('person', 3) === person;
});
```

Sometimes you have incomplete models loaded in the store and you need to retrieve and cache more details about a model. This is particularly useful if you have your server-side dump out json data containing incomplete models. You can load these incomplete models into the store, and if more details about a model are needed, DS.find will request those details once, thus completing the model in the store and any subsequent calls to DS.find for a particular model won't make any HTTP requests. 

```js
// Inject a partial model into the store and specify that it is incomplete
DS.inject('person', { id: 3, name: 'David' }, { incomplete: true });
// OR
DS.inject('person', [{ id: 3, name: 'David' }], { incomplete: true });

// Makes AJAX call and loads person 3 into the store
DS.find('person', 3).then(function(person) {
	DS.get('person', 3) === person;

	// Subsequent call for person 3 does not make AJAX call
	DS.find('person', 3).then(function() {
		DS.get('person', 3) === person;
	});
});
```

### DS.findAll(resourceName)

Asynchronously fetches all models and puts them into the store. Returns a promise.

```js
// Makes AJAX call and puts models into the store
DS.findAll('person').done(function(collection) {
	DS.getAll('person') === collection;
});
```

### DS.getAll(resourceName)

Synchronously get all items for a resource in the store and returns the Backbone collection specified for the resource. This method always returns the same collection instance. DS maintains a single collection instance for a given resource.

```js
Person = Backbone.Model.extend();
PersonCollection = Backbone.Collection.extend({
	model: Person
});

DS.defineResource({
	name: 'person',
	idAttribute: 'id',
	model: Person,
	collection: PersonCollection
});

DS.inject('person', people);

DS.getAll('person') === DS.getAll('person');
DS.getAll('person') instanceof PersonCollection;
```
