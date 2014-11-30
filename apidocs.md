API Documentation
=================

### DS.defineResource(resourceDefinition)

Create a resource by specifying a Backbone model, collection, a unique name, and the property name that uniquely identifies the models for this resource type (the primary key). Creating a resource is the first step to storing your data in the store.

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

### DS.inject(resourceName, data);

Inject an object or an array of objects into the data store. This is particularly useful for when data is bootstrapped onto the page from the server and you need to inject it in the store.

```js
DS.inject('person', [
	{ id: 1, name: 'John', age: 54 },
	{ id: 2, name: 'Jane', age: 24 },
	{ id: 3, name: 'Matt', age: 34 }
]);

// OR

DS.inject('person', { id: 4, name: 'Mary', age: 23 });
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

DS.inject('person', [
    { id: 1, name: 'John', age: 54 },
    { id: 2, name: 'Jane', age: 24 },
    { id: 3, name: 'Matt', age: 34 }
]);

DS.getAll('person') === DS.getAll('person');
DS.getAll('person') instanceof PersonCollection;
```

### DS.get(resourceName, id)

Synchronously get a single model from the store for a resource.

```js
DS.get('person', 2); // returns a Backbone Person model with an id of 2
DS.get('person', 2) === DS.get('person', 2);
```

### DS.findAll(resourceName)

Asynchronously fetch all models and inject them into the store. Returns a promise.

```js
// Makes AJAX call and puts models into the store
DS.findAll('person').done(function(collection) {
	DS.getAll('person') === collection; // true
});
```

### DS.find(resourceName, id [, options])

Fetch a model if it is not in the data store, or return a model already in the store wrapped up in a resolved promise.

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

### DS.create(resourceName, model)

Creating a model and injecting it into the store.

```js
var person = DS.createInstance('person');
person.set({ name: 'Allison', age: 23 });

DS.create('person', person).then(function(model) {
	DS.get('person', 4).toJSON(); // { id: 4, name: 'Allison', age: 23 }
	DS.get('person', 4) === model; // true
});
```

### DS.destroy(resourceName, id)

Destroy a model in the store

```js
// Makes a DELETE request by calling model.destroy()
DS.destroy('person', 3).then(function() {
	DS.get('person', 3); // null
});
```

### DS.update(resourceName, id, properties)

Update a model in the store. Delegates to model.save().

```js
DS.update('person', 3, {
	name: 'Mathew'
}).then(function(model) {
	model === DS.get('person', 3); // true
	// Model in store with primary key of 3 has updated its name to 'Mathew'
});
```

Alternatively, you could just find the model using _DS.get()_ and update and save it as you would normally when working with Backbone models. This method merely calls model.set() and model.save() behind the scenes.

### DS.filter(resourceName, predicate)

Proxies to Backbone's collection.filter() but returns a new collection instance of the collection type specified in the resource definition.

```js
var filteredPeople = DS.filter('person', function(model) {
	return model.get('age') === 54;
});

filteredPeople instanceof PersonCollection; // true
filteredPeople.toJSON(); // [{ id: 1, name: 'John', age: 54 }, { id: 3, name: 'Matt', age: 54 }]
```

### DS.where(resourceName, attributes)

Filter models in the store by attributes. Delegates to collection.where() but returns a new collection instance of the proper collection type instead of an array.

```js
var filteredPeople = DS.where('person', { age: 54 });
filteredPeople instanceof PersonCollection; // true
```

