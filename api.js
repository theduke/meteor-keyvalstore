
KeyValStore = (function() {
  var stores = {};

  async function build(name, options) {
    options = _.extend({
      collection: null
    }, options);

    var collection = options.collection ||  new Mongo.Collection('keyvalstore_' + name);
    await collection.createIndexAsync({key: 1});

    return {
      get: function(key, defaultVal) {
        var result = collection.findOneAsync({key: key});

        if (result === undefined || (result.expiresAt && result.expiresAt <= new Date())) {
          return defaultVal;
        }
        return result.isJson ? JSON.parse(result.value) : result.value;
      },

      set: function(key, value, expiresAt) {
        var isJson = typeof(key) !== 'string';

        collection.upsertAsync({key: key}, {
          $set: {
            key: key,
            value: isJson ? JSON.stringify(value) : value,
            isJson: isJson,
            expiresAt: expiresAt
          }
        });
      },

      remove: function(key) {
        collection.removeAsync({key: key});
      },

      removeAll: function() {
        return collection.removeAsync({});
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
