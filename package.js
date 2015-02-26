/* Package info. */
Package.describe({
  summary: "A flexible key-value store using MongobDB",
  version: "0.0.1",
  name: "theduke:keyvalstore",
  git: "https://github.com/theduke/meteor-keyvalstore"
});


/* This defines your actual package */
Package.onUse(function(api) {
  api.versionsFrom('0.9.3');

  api.use('underscore', 'server');
  api.addFiles('api.js', 'server');
  api.export('KeyValStore', 'server');
});

/* This defines the tests for the package */
Package.onTest(function(api) {
});
