backbone-data
=============

[![Build Status](https://travis-ci.org/skaterdav85/backbone-data.svg)](https://travis-ci.org/skaterdav85/backbone-data)

A simple data store for backbone models and collections inspired by Ember Data and angular-data.

### Key Features

* Identity mapping of models
* Works with existing Backbone models and collections
* The single global _DS_ acts as a single point of entry for data access
* Collection management

### Install

Grab the minified or unminified file from the _dist_ directory and include it on your page.

```html
<script src="dist/backbone-ds.min.js"></script>
```

This library exposes a global variable called _DS_ (Data Store) and it is also registers itself for AMD (Require.js).

### API Documentation

Until I get documentation up, see the test files for examples. Here is a summary of the current API.

### Synchronous Methods

* DS.defineResource(resourceDefinition)
* DS.get(resourceName, id)
* DS.getAll(resourceName)
* DS.where(resourceName, attributes)
* DS.inject(resourceName, model(s))
* DS.createInstance(resourceName)
* DS.ejectAll(resourceName)

### Asynchronous Methods

* DS.find(resourceName, id [, options])
* DS.findAll(resourceName)


#### DS.find(resourceName, id [, options])

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


### Tests

Tests are using Mocha, Chai, and Sinon. Run tests with karma.

```js
bower install
npm install
karma start
```

### Build

```
gulp
```
