
KeyValStore = (function() {
  var stores = {};

  function build(name, options) {
    options = _.extend({
      collection: null
    }, options);

    var collection = options.collection ||  new Mongo.Collection('keyvalstore_' + name);
    collection._ensureIndex({key: 1});

    return {
      get: function(key, defaultVal) {
        var result = collection.findOne({key: key});

        if (result === undefined || (result.expiresAt && result.expiresAt <= new Date())) {
          return defaultVal;
        }
        return result.isJson ? JSON.parse(result.value) : result.value;
      },

      set: function(key, value, expiresAt) {
        var isJson = typeof(key) !== 'string';

        collection.upsert({key: key}, {
          $set: {
            key: key,
            value: isJson ? JSON.stringify(value) : value,
            isJson: isJson,
            expiresAt: expiresAt
          }
        });
      },

      remove: function(key) {
        collection.remove({key: key});
      },

      removeAll: function() {
        return collection.remove({});
      },

      getCollection: function() {
        return collection;
      }
    };
  };

  
  return {
    store: function(name, options) {
      if (!(name in stores)) {
        stores[name] = build(name, options);
      }

      return stores[name];
    },

    get: function(key, defaultVal) {
      return this.store('default').get(key, defaultVal);
    },

    set: function(key, value, expiresAt) {
      this.store('default').set(key, value, expiresAt);
    },

    remove: function(key) {
      this.store('default').remove(key);
    }
  };
})();
