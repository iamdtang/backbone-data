Backbone Data
=============

[![Build Status](https://travis-ci.org/skaterdav85/backbone-data.svg)](https://travis-ci.org/skaterdav85/backbone-data)

A simple data store for Backbone models and collections inspired by Ember Data and angular-data.

## Key Features

* Automatic Caching and Identity Mapping
	* If a model had already been loaded, asking for it a second time will not make any network requests. This minimizes the number of round-trips to the server.
* Provides a single point of entry for data access through the global variable _DS_ and works with existing Backbone models and collections.
* Manages singletons for models and collections 
	* Many times you'll need the same collection instance in multiple views. Just ask the store for the resource (`DS.getAll('person')`, `DS.findAll('person')`) and it will return or resolve with the same collection instance each time.
	* Maybe you have a single model instance in your application, like a `UserProfile` model. The data store can also manage it as a singleton so that you get the same `UserProfile` instance every time.
* Load models into the store as incomplete. This can be useful if your models have lots of data and not all of it is served upfront. Extra details about the model can be fetched and cached for subsequent requests.
* Easily create new filtered collections that are chainable
* AMD compatible
* 933 bytes gzipped and minified

[API Documentation and Examples](apidocs.md)

## Install

Grab the minified or unminified file from the _dist_ directory and include it on your page.

```html
<script src="dist/backbone-ds.min.js"></script>
```

Or install through Bower

```
bower install backbone-data
```

Or install through NPM

```
npm install backbone-data
```

This library exposes a global variable called _DS_ (Data Store) and it is also registers itself for AMD (Require.js).

## Tests

Tests are using Mocha, Chai, and Sinon. Run tests with karma.

```js
bower install
npm install
karma start
```

## Build

This will create the distribution files in the _dist_ folder

```
gulp
```
