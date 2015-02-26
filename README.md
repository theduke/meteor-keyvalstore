theduke:keyvalstore
===================

This Atmosphere package for the Meteor framework adds a MongoDB based key-value store for convenient and drop-in
server side persistence for caching or configuration. Supports storing all JSON compatible Javascript objects, 
multiple stores and expiring entries at a certain time.

Version 0.0.1 - 26.02.2015

## Features

* Store strings or all JSON serializable Javascript objects, arbitrarily nested. (Object, Array, Number, Boolean)
* Objects are stored as strings for performance, but are parsed and returned fully on retrieval.
* Let entries expire at a certain time.
* Use a default store or use a customly named store with it's own collection.
* Use a custom store with a custom collection. 


## Installation
 

 ```bash
meteor add theduke:keyvalstore
 ```

## Usage

* Use the default store:

```javascript
// Set values.
KeyValStore.set('string1', 'some random string here');
KeyValStore.set('num1', 2323.3);
KeyValStore.set('object1', {nested1: [1,2,3], nested2: {data: 'data'}});

// Retrieve values.
KeyValStore.get('string1'); // Returns "some random string here".
KeyValStore.get('num1'); // Returns 2323.3.
KeyValStore.get('object1'); // Returns the full object: {nested1: [1,2,3], nested2: {data: 'data'}

// Delete values.
KeyValStore.remove('string1');
KeyValStore.get('string1'); // Returns undefined;

KeyValStore.get('unknownKey'); // Returns undefined.

// Supply a default value:
KeyValStore.get('unknownKey', 33); // Returns 33.
```

* Let an entry expire.

```javascript
// Store an entry that will expire in 30 seconds, using the moment js library.
KeyValStore.set('mykey', 'some random data', moment().add(30, 'seconds').getDate());

KeyValStore.get('mykey'); // Returns 'some random data'.
// Wait 30 seconds.
KeyValStore.get('mykey'); // Returns undefined.
```

* Use a custom store:

```javascript
KeyValStore.store('cache').set('key', 'myval');
KeyValStore.store('cache').get('key');

// Alternative use.
var myStore = KeyValStore.store('cache');
myStore.get('key');
```

* Use a custom store with custom collection:

```javascript
var myCol = new Mongo.Collection('mycustomstore');
var store = KeyValStore.store('mystore', {
  collection: myCol
});
```

## API

Function|Description
--------|-----------
KeyValStore.store(name)|Return a store, creating it if it was not initialized yet.
Store.get(key, defaultValue)|Return the value stored for a key if it is set and has not expired. Optionally set a default which is returned if the key is not set.
Store.set(key, value, expiresAt)|Set a key to a certain value. Optionally supply a Javascript Date object to specify an expiry time.
Store.remove(key)|Delete a key from the store.
--------|-----------
KeyValStore.get|Same as Store.get above, but uses default store.
KeyValStore.set|Same as Store.get above, but uses default store.
KeyValStore.remove|Same as Store.get above, but uses default store.

License
-------

This project is under the MIT license. For details see LICENSE and http://en.wikipedia.org/wiki/MIT_License.

## Authors


* Christoph Herzog - chris@theduke.at
