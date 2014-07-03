var _ = require('lodash');

// Angular does not iterate over properties of the scope. It iterates over watchers.
// So, performance tip: Doesn't matter the number of properties on a scope. It matters the number of watchers.

// Scope object has $$watchers array
function Scope() {
  this.$$watchers = [];
}

// $watch function
Scope.prototype.$watch = function(watchFn, listenerFn) {
  // watchFn: what to watch
  // listenerFn: what to call
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function() {}
  };
  this.$$watchers.push(watcher);
};

// $digest function (called automagically in real life)
Scope.prototype.$digest = function() {
  var self = this;
  // loop through the $$watchers array
  _.forEach(this.$$watchers, function(watch) {
    // Call the watchFn with the scope itself as an argument, assign result it to newValue
    var newValue = watch.watchFn(self);
    // If there is a watch.last, assign it to oldValue
    var oldValue = watch.last;
    // If this call of the watchFn doesn't equal the last time, call listener
    if(newValue !== oldValue) {
      watch.listenerFn(newValue, oldValue, self);
      // the watchFn result becomes the one to compare to next $digest call
      watch.last = newValue;
    }
  });
};

// Test it!!!
var aScope = new Scope();
aScope.$watch(function() { console.log("foo");}, function() { console.log('listener');});
aScope.$digest(); // we need to call $digest ourselves
