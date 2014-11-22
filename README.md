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

* DS.find(resourceName, id)
* DS.findAll(resourceName)

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
