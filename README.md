Backbone Data
=============

[![Build Status](https://travis-ci.org/skaterdav85/backbone-data.svg)](https://travis-ci.org/skaterdav85/backbone-data)

A simple data store for backbone models and collections inspired by Ember Data and angular-data.

### Key Features

* Automatic Caching and Identity Mapping - If a model had already been loaded, asking for it a second time will always return the same object instance. This minimizes the number of round-trips to the server.
* Provides a single point of entry for data access through the global variable _DS_
* Works with existing Backbone models and collections.
* Manages singletons for each collection type. Many times you'll need the same collection instance in multiple views. Just ask for a collection type from the store (_DS.getAll('person')_, _DS.findAll('person')_) and it will return/resolve with the same collection instance each time.
* Load incomplete models into the store to be completed and cached later. Imagine you have an array of product objects bootstrapped onto the page from the server. Each product object is incomplete, lacking extra details that may or may not be needed based on user actions. With the data store, you can load these incomplete product models and specify that they are incomplete. Based on the user's actions, if details are needed, the store will fetch the details once, merge the details into the model thus completing it, and always return/resolve that completed cached model.
* Easily create new filtered collections
* AMD compatible
* 737 bytes gzipped and minified

### Install

Grab the minified or unminified file from the _dist_ directory and include it on your page.

```html
<script src="dist/backbone-ds.min.js"></script>
```

This library exposes a global variable called _DS_ (Data Store) and it is also registers itself for AMD (Require.js).

### Synchronous Methods Overview

* DS.defineResource(resourceDefinition) - Create a new resource for the store to manage
* DS.inject(resourceName, model(s)) - Put models into the store
* DS.get(resourceName, id) - Return a single model from the store, or null otherwise
* DS.getAll(resourceName) - Return a collection of models from the store
* DS.where(resourceName, attributes) - Similar to Backbone.Collection's where method but returns a new collection instance for the collection specified for resourceName
* DS.createInstance(resourceName) - Create a new Backbone model instance
* DS.ejectAll(resourceName) - Remove all models from the store for a resource

### Asynchronous Methods Overview

These methods return a promise

* DS.find(resourceName, id [, options]) - Resolves with the model retrieved and injected into the store
* DS.findAll(resourceName) - Resolves with the collection instance managed by the store for _resourceName_
* DS.create(resourceName, model) - Resolves with the newly created and injected model
* DS.destroy(resourceName, id)

[API Documentation](apidocs.md)

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
