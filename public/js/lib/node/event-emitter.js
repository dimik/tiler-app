( // Module boilerplate to support browser globals and AMD.
    (typeof define === 'function' && function (m) { define('EventEmitter', m); }) ||
    (function (m) { window.EventEmitter = m(); })
)(function () {

    'use strict';

    /**
     * Browser version of NodeJS EventEmitter.
     * @see http://nodejs.org/api/events.html
     * Functions can then be attached to objects, to be executed when an event is emitted.
     * These functions are called listeners.
     * Inside a listener function, "this" refers to the EventEmitter that the listener was attached to.
     * @class
     * @name EventEmitter
     */
    function EventEmitter() {
        this._events = {};
        this._maxListeners = 10;
    }

    /**
     * @lends EventEmitter.prototype
     */
    EventEmitter.prototype = {
        /**
         * @constructor
         */
        constructor: EventEmitter,
        /**
         * Adds a listener to the end of the listeners array for the specified event.
         * @function
         * @name EventEmitter.addListener
         * @param {String} event Name of the event.
         * @param {Function} listener Event handler.
         * @returns {EventEmitter} For chained calls.
         */
        addListener: function (event, listener) {
            var events = this._events,
                maxListeners = this._maxListeners;

            if(!events.hasOwnProperty(event)) {
                events[event] = [];
            }

            var n = events[event].push(listener);

            if(maxListeners && n > maxListeners) {
                if(console) {
                    console.log(
                        'Warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.', n
                    );
                }
            }
            this.emit('newListener', event, listener);

            return this;
        },
        /**
         * Remove a listener from the listener array for the specified event.
         * @function
         * @name EventEmitter.removeListener
         * @param {String} event Name of the event.
         * @param {Function} listener Event handler.
         * @returns {EventEmitter} For chained calls.
         */
        removeListener: function (event, listener) {
            var events = this._events;

            if(events.hasOwnProperty(event)) {
                var listeners = events[event], handler;

                for(var i = 0, len = listeners.length; i < len; i++) {
                    if((listeners[i].__listener || listeners[i]) === listener) {
                        listeners.splice(i, 1);
                        this.emit('removeListener', event, listener);
                        break;
                    }
                }
                if(!listeners.length) {
                    delete events[event];
                }
            }

            return this;
        },
        /**
         * Removes all listeners, or those of the specified event.
         * @function
         * @name EventEmitter.removeAllListeners
         * @param {String} [event] Name of the event.
         * @returns {EventEmitter} For chained calls.
         */
        removeAllListeners: function (event) {
            var emitter = this,
                events = this._events,
                removeListeners = function (event) {
                    var listeners = events[event],
                        n = listeners.length;

                    while(n--) {
                        emitter.removeListener(event, listeners[n]);
                    }
                };

            if(event) {
                removeListeners(event);
            }
            else {
                for(var event in events) {
                    removeListeners(event);
                }
            }

            return this;
        },
        /**
         * Adds a one time listener for the event.
         * This listener is invoked only the next time the event is fired, after which it is removed.
         * @function
         * @name EventEmitter.once
         * @param {String} event Name of the event.
         * @param {Function} listener Event handler.
         * @returns {EventEmitter} For chained calls.
         */
        once: function (event, listener) {
            var handler = function () {
                    this.removeListener(event, listener);
                    listener.apply(this, arguments);
                };

            handler.__listener = listener;

            return this.addListener(event, handler);
        },
        /**
         * Execute each of the listeners in order with the supplied arguments.
         * @function
         * @name EventEmitter.emit
         * @param {String} event Name of the event.
         * @returns {Boolean} True if event had listeners, false otherwise.
         */
        emit: function (event/*, args...*/) {
            var args = Array.prototype.slice.call(arguments, 1),
                events = this._events;

            if(!(events.hasOwnProperty(event) && events[event].length)) {
                return false;
            }

            var listeners = events[event], listener;

            for(var i = 0, len = listeners.length; i < len; i++) {
                if(listener = listeners[i]) {
                    listener.apply(this, args);
                }
                else {
                    continue;
                }
            }

            return true;
        },
        /**
         * Returns an array of listeners for the specified event.
         * @function
         * @name EventEmitter.listeners
         * @param {String} event
         * @returns {Array} Listeners for the specified event.
         */
        listeners: function (event) {
            var events = this._events;

            return events.hasOwnProperty(event)?
                events[event] : [];
        },
        /**
         * By default EventEmitters will print a warning if more than 10 listeners are added for a particular event.
         * This is a useful default which helps finding memory leaks.
         * Obviously not all Emitters should be limited to 10.
         * This function allows that to be increased.
         * Set to zero for unlimited.
         * @function
         * @name EventEmitter.setMaxListeners
         * @param {Number} n Limit amount of listeners for each event.
         */
        setMaxListeners: function (n) {
            this._maxListeners = Math.abs(n);
        }
    };

    /**
     * Alias for the EventEmitter.addListener method.
     * Adds a listener to the end of the listeners array for the specified event.
     * @function
     * @name EventEmitter.on
     * @param {String} event Name of the event.
     * @param {Function} listener Event handler.
     * @returns {EventEmitter} For chained calls.
     */
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    /**
     * Handy alias for the removeListener[s].
     * @function
     * @name EventEmitter.off
     * @param {String} [event] Name of the event.
     * @param {Function} [listener] Event handler.
     * @returns {EventEmitter} For chained calls.
     */
    EventEmitter.prototype.off = function (event, listener) {
        return listener?
            this.removeListener(event, listener) : this.removeAllListeners(event);
    };

    /**
     * Returns the number of listeners for a given event.
     * @function
     * @static
     * @name EventEmitter.listenerCount
     * @param {EventEmitter} emitter Instance of the EventEmitter.
     * @param {String} event Name of the event.
     * @returns {Number} Number of listeners for a given event.
     */
    EventEmitter.listenerCount = function (emitter, event) {
        return emitter.listeners(event).length;
    };

    return EventEmitter;

});
