/**
 * @package junit
 * @module junit
 */
'package junit'.j(function () {

    /**
     * @class junit.Observable
     */
    'class Observable'.j({
        /**
         * @constructor
         * @param config
         */
        filterOptRe: /^(?:scope|delay|buffer|single)$/,
        hidden: true,
        constructor: function (config) {
            var jthis = this;
            $.extend(jthis, config);
        },

        on: function (eventName, fn, scope, o) {
            var me = this,
                e,
                oe,
                isF,
                ce;
            if ($.isObject(eventName)) {
                o = eventName;
                for (e in o) {
                    oe = o[e];
                    if (!me.filterOptRe.test(e)) {
                        me.on(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);
                    }
                }
            } else {
                eventName = eventName.toLowerCase();
                $.event.add(this, eventName, fn, $.isObject(o) ? o : null, "", scope);
            }
        },

        off: function (eventName, fn, scope) {
            eventName = eventName.toLowerCase();
            $.event.remove(this, eventName, fn, "");
        },

        fireEvent: function () {
            var a = $.toArray(arguments),
                ename = a[0].toLowerCase(),
                me = this,
                ret = true,
                q;
            if (me.eventsSuspended === true) {
                if (q = me.eventQueue) {
                    q.push(a);
                }
            }
            /*else if ($.isObject(ce) && ce.bubble) {
             if ($.fire.apply(ce, a.slice(1)) === false) {
             return false;
             }
             c = me.getBubbleTarget && me.getBubbleTarget();
             if (c && c.enableBubble) {
             if (!c.events[ename] || !$.isObject(c.events[ename]) || !c.events[ename].bubble) {
             c.enableBubble(ename);
             }
             return c.fireEvent.apply(c, a);
             }
             }*/
            else {
                a.shift();
                ret = $.event.fire(me, ename, a);
            }
            return ret;
        },
        /*hasListener: function (eventName) {
         var e = this.events[eventName];
         return ISOBJECT(e) && e.listeners.length > 0;
         },*/

        /**
         * Suspend the firing of all events. (see {@link #resumeEvents})
         * @param {Boolean} queueSuspended Pass as true to queue up suspended events to be fired
         * after the {@link #resumeEvents} call instead of discarding all suspended events;
         */
        suspendEvents: function (queueSuspended) {
            this.eventsSuspended = true;
            if (queueSuspended && !this.eventQueue) {
                this.eventQueue = [];
            }
        },

        /**
         * Resume firing events. (see {@link #suspendEvents})
         * If events were suspended using the <tt><b>queueSuspended</b></tt> parameter, then all
         * events fired during event suspension will be sent to any listeners now.
         */
        resumeEvents: function () {
            var me = this,
                queued = me.eventQueue || [];
            me.eventsSuspended = false;
            delete me.eventQueue;
            $.each(queued, function (e) {
                me.fireEvent.apply(me, e);
            });
        }

    });
});