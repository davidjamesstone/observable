var $ = require('jquery');

function Observable() {
  var _listeners = {};

  function listeners(event) {
    return event ? _listeners[event] || (_listeners[event] = $.Callbacks()) : _listeners;
  }
  this.on = function(event, fn) {
    listeners(event).add(fn);
  };
  this.off = function(event, fn) {
    listeners(event).remove(fn);
  };
  this.trigger = function(event, data) {
    listeners(event).fireWith(this, [data]);
  };
}

/*
 * Make a Constructor become an observable and
 * exposes event names as constants
 */
exports.init = function(Constructor, events) {

  /*
   * Create an immutabe events object
   */
  var eventsDesc = Object.create(null);

  for (var event in events) {
    if (events.hasOwnProperty(event)) {
      eventsDesc[event] = {
        value: events[event]
      };
    }
  }

  var eventsObj = Object.create(null, eventsDesc);
  Object.freeze(eventsObj);

  /*
   * Mixin Observable into Constructor prototype
   */
  $.extend(Constructor.prototype, new Observable());
  Object.defineProperties(Constructor.prototype, {
    events: {
      value: eventsObj
    }
  });

  /*
   * Add events property to Constructor for convenience
   */
  Object.defineProperties(Constructor, {
    events: {
      value: eventsObj
    }
  });

  return Constructor;
};
