backbone-data
=============

[![Build Status](https://travis-ci.org/skaterdav85/backbone-data.svg)](https://travis-ci.org/skaterdav85/backbone-data)

A simple Ember inspired data store for Backbone.

### Install

Grab the minified file from the _dist_ directory and include it on your page.

```html
<script src="backbone-ds.min.js"></script>
```

Until I get documentation up, see the test files for examples. Here is a summary of the current API.

### Synchronous Methods

* DS.defineResource(resourceDefinition)
* DS.get(resourceName, id)
* DS.getAll(resourceName)
* DS.inject(resourceName, model(s))
* DS.createInstance(resourceName)
* DS.ejectAll(resourceName)

### Asynchronous Methods



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