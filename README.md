backbone-data
=============

[![Build Status](https://travis-ci.org/skaterdav85/backbone-data.svg)](https://travis-ci.org/skaterdav85/backbone-data)

A simple data store for backbone models and collections inspired by Ember Data and angular-data.

### Key Features

* Provides identity mapping of models
* Caches models in browser memory
* Provides a single point of entry for data access through the global variable _DS_
* Works with existing Backbone models and collections
* Manages singletons for each of your primary data collections. Many times you'll need the same collection instance in multiple views. Just ask for this collection from the store and it will give you the same collection instance for a given resource.
* AMD compatible
* 702 bytes gzip and minified

### Install

Grab the minified or unminified file from the _dist_ directory and include it on your page.

```html
<script src="dist/backbone-ds.min.js"></script>
```

This library exposes a global variable called _DS_ (Data Store) and it is also registers itself for AMD (Require.js).

### Synchronous Methods Overview

* DS.defineResource(resourceDefinition)
* DS.get(resourceName, id)
* DS.getAll(resourceName)
* DS.where(resourceName, attributes)
* DS.inject(resourceName, model(s))
* DS.createInstance(resourceName)
* DS.ejectAll(resourceName)

### Asynchronous Methods Overview

* DS.find(resourceName, id [, options])
* DS.findAll(resourceName)

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
