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

Sometimes you have incomplete models loaded into the store and you need to get more details about a model only once.

```js
DS.inject('person', { id: 3, name: 'David' }, { incomplete: true });
// OR
DS.inject('person', [{ id: 3, name: 'David' }], { incomplete: true });

// Makes AJAX call and loads into the store
DS.find('person', 3).then(function(person) {
	DS.get('person', 3) === person;

	// Does not make AJAX call
	DS.find('person', 3);
});
```
