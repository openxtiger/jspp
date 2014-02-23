(function ($) {

    //$.db.stonecolor;
    function protectJSON(t) {

        if ($.isArray(t) || $.isObject(t)) {
            return t;
        }
        else {
            return JSON.parse(t);
        }
    }

    var isIndexable = function (f) {
        var i;
        // Check to see if record ID
        if ($.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) {
            return true;
        }
        // Check to see if record
        if ($.isObject(f) && f._id && f._f) {
            return true;
        }

        // Check to see if array of indexes
        if ($.isArray(f)) {
            i = true;
            $.each(f, function (r) {
                if (!isIndexable(r)) {
                    i = false;
                    return false;
                }
                return true;
            });
            return i;
        }

        return false;
    };

    var isRegexp = function (aObj) {
        return Object.prototype.toString.call(aObj) === '[object RegExp]';
    };
    var safeForJson = function (aObj) {
        var myResult = $.isArray(aObj) ? [] : $.isObject(aObj) ? {} : null;
        if (aObj === null) return aObj;
        for (var i in aObj) {
            if (aObj.hasOwnProperty(i))
                myResult[i] = isRegexp(aObj[i]) ? aObj[i].toString() :
                    $.isArray(aObj[i]) || $.isObject(aObj[i]) ?
                        safeForJson(aObj[i]) : aObj[i];
        }
        return myResult;
    };

    var makeCid = function (aContext) {
        var myCid = JSON.stringify(aContext);
        if (myCid.match(/regex/) === null) return myCid;
        return JSON.stringify(safeForJson(aContext));
    };

    var runFilters = function (r, filter) {
        var match = true;


        $.each(filter, function (mf) {
            switch ($.type(mf)) {
                case 'function':
                    // run function
                    if (!mf.apply(r)) {
                        match = false;
                        return;
                    }
                    break;
                case 'array':
                    // loop array and treat like a SQL or
                    match = (mf.length === 1) ? (runFilters(r, mf[0])) :
                        (mf.length === 2) ? (runFilters(r, mf[0]) ||
                            runFilters(r, mf[1])) :
                            (mf.length === 3) ? (runFilters(r, mf[0]) ||
                                runFilters(r, mf[1]) || runFilters(r, mf[2])) :
                                (mf.length === 4) ? (runFilters(r, mf[0]) ||
                                    runFilters(r, mf[1]) || runFilters(r, mf[2]) ||
                                    runFilters(r, mf[3])) : false;
                    if (mf.length > 4) {
                        $.each(mf, function (f) {
                            if (runFilters(r, f)) {
                                match = true;
                            }
                        });
                    }
                    break;
            }

        });

        return match;
    };

    function each(a, fun) {
        if (!$.isArray(a)) {
            fun(a, 0);
        } else {
            $.each(a, fun);
        }
    }

    var returnFilter = function (f) {
        var nf = [];
        if ($.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) {
            f = { _id: f };
        }
        if ($.isArray(f)) {
            // if we are working with an array

            $.each(f, function (r) {
                // loop the array and return a filter func for each value
                nf.push(returnFilter(r));
            });
            // now build a func to loop over the filters and return true if ANY of the filters match
            // This handles logical OR expressions
            f = function () {
                var that = this, match = false;
                $.each(nf, function (f) {
                    if (runFilters(that, f)) {
                        match = true;
                        return false
                    }
                    return true;
                });
                return match;
            };
            return f;

        }
        // if we are dealing with an Object
        if ($.isObject(f)) {
            if ($.isObject(f) && f._id && f._f) {
                f = { _id: f._id };
            }

            // Loop over each value on the object to prep match type and match value
            // {field:{s:test}}
            // {field:{'not',{s:test}}}

            $.each(f, function (field, v) {

                // default match type to IS/Equals
                if (!$.isObject(v)) {
                    v = {
                        'is': v
                    };
                }

                // loop over each value on the value object  - if any
                $.each(v, function (s, mtest) {
                    // s = match type, e.g. is, hasAll, like, etc
                    console.log(s, mtest);

                    var c = [], looper;

                    // function to loop and apply filter
                    looper = (s === 'hasAll') ?
                        function (mtest, func) {
                            func(mtest);
                        } : each;

                    // loop over each test
                    looper(mtest, function (mtest) {
                        // su = match success
                        // f = match false
                        var su = true, f = false, matchFunc;

                        // push a function onto the filter collection to do the matching
                        c.push(function () {

                            // get the value from the record
                            var mvalue = this[field], r;
                            if (typeof mvalue === 'undefined') {
                                return false;
                            }

                            if ((s.indexOf('!') === 0)) {
                                // if the filter name starts with ! as in '!is' then reverse the match logic and remove the !
                                su = false;
                                s = s.substring(1, s.length);
                            }
                            // get the match results based on the s/match type
                            /*jslint eqeq : true */
                            switch (s) {
                                case 'regex':
                                    r = (mtest.test(mvalue));
                                    break;
                                case  'lt':
                                    r = (mvalue < mtest);
                                    break;
                                case 'gt':
                                    r = (mvalue > mtest);
                                    break;
                                case  'lte':
                                    r = (mvalue <= mtest);
                                    break;
                                case  'gte':
                                    r = (mvalue >= mtest);
                                    break;
                                case  'left':
                                    r = mvalue.indexOf(mtest) === 0;
                                    break;
                                case  'right':
                                    r = (mvalue.substring((mvalue.length - mtest.length)) === mtest);
                                    break;
                                case  'leftn':
                                    r = (mvalue.toLowerCase().indexOf(mtest.toLowerCase()) === 0);
                                    break;
                                case  'rightn':
                                    r = (mvalue.toLowerCase().substring((mvalue.length - mtest.length)) === mtest.toLowerCase());
                                    break;
                                case  'like':
                                    r = (mvalue.indexOf(mtest) >= 0);
                                    break;
                                case  'liken':
                                    r = (mvalue.toLowerCase().indexOf(mtest.toLowerCase()) >= 0);
                                    break;
                                case  'is':
                                    r = (mvalue === mtest);
                                    break;
                                case  'eq':
                                    r = (mvalue == mtest);
                                    break;
                                case  'nis':
                                    r = (mvalue !== mtest);
                                    break;
                                case  'ne':
                                    r = (mvalue != mtest);
                                    break;
                                case  'isn':
                                    r = mvalue.toLowerCase ? mvalue.toLowerCase() === mtest.toLowerCase()
                                        : mvalue === mtest;
                                    break;
                                case 'in':
                                    r = ($.isArray(mtest) && mtest.indexOf(mvalue) > -1);
                                    break;
                                case  'contains':
                                    r = ($.isArray(mvalue) && mvalue.indexOf(mtest) > -1);
                                    break;
                                default:
                                    r = s.indexOf('is') === -1
                                        && !$.isNull(mvalue)
                                        && $.isDefined(mvalue)
                                        && !$.isObject(mtest)
                                        && !$.isArray(mtest) ? (mtest === mvalue[s])
                                        : $[s] && $.isFunction($[s]) && s.indexOf('is') === 0 ?
                                        $[s](mvalue) === mtest :
                                        ($.db.qfun[s] && $.isFunction($.db.qfun[s]))
                                            ? $.db.qfun[s](mvalue, mtest) : false;

                            }
                            /*jslint eqeq : false */
                            r = (r && !su) ? false : (!r && !su) ? true : r;

                            return r;
                        });

                    });
                    // if only one filter in the collection push it onto the filter list without the array
                    if (c.length === 1) {
                        nf.push(c[0]);
                    } else {
                        // else build a function to loop over all the filters and return true only if ALL match
                        // this is a logical AND
                        nf.push(function () {
                            var that = this, match = false;

                            $.each(c, function (f) {
                                if (f.apply(that)) {
                                    match = true;
                                }
                            });
                            return match;
                        });
                    }
                });
            });
            // finally return a single function that wraps all the other functions and will run a query
            // where all functions have to return true for a record to appear in a query result
            f = function () {
                var that = this, match = true;
                // faster if less than  4 functions

                match = (nf.length === 1 && !nf[0].apply(that)) ? false :
                    (nf.length === 2 && (!nf[0].apply(that) || !nf[1].apply(that))) ? false :
                        (nf.length === 3 &&
                            (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that))) ? false :
                            (!(nf.length === 4 &&
                                (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that) || !nf[3].apply(that))));
                if (nf.length > 4) {
                    $.each(nf, function (f) {
                        if (!runFilters(that, f)) {
                            match = false;
                        }
                    });
                }
                return match;
            };
            return f;
        }

        // if function
        if ($.isFunction(f)) {
            return f;
        }
        return null;
    };

    var collectionNames = [],
        TC, idpad;
    var acollections = [], ocollections = {};

    TC = 1;
    idpad = '000000';
    $.db = function (keys, name) {
        if ($.isFunction(keys) && keys.collection) return keys;
        if (keys === null) return this;
        return $.db.createCollection(keys, name);
    };

    //hidden database base
    function dbBASE(keys, name, co) {
        var _keys = [];
        var _name = name;
        var _tdocs = [];
        var _doccount = 1;
        var _id = {};

        var _lastUpdated = new Date(),
            _cacheCount = 0,
            _cacheClear = 0,
            _cache = {};

        $.each(keys, function (av) {
            if ($.isObject(av)) {
                _keys.push(av);
            } else {
                _keys.push({name: av});
            }
        });


        var DBI = {
            dm: dm,
            insert: insert,
            sort: sort,
            update: update,
            remove: remove,
            truncate: truncate,
            commit: commit,
            query: query
        };
        return DBI;

        function dm(nd) {
            if (nd) {
                _lastUpdated = nd;
                _cache = {};
                _cacheCount = 0;
                _cacheClear = 0;
            }
            $.event.fire(co, 'collectionchange', _tdocs);

            /*if (settings.storageName) {
             setTimeout(function () {
             localStorage.setItem('taffy_' + settings.storageName,
             JSON.stringify(TOb));
             });
             }*/

            return _lastUpdated;
        }

        function insert(i) {

            var records = [],
                input = protectJSON(i);
            if (!$.isArray(input)) {
                input = [input];
            }
            $.each(input, function (v, i) {
                var nv, o;
                if ($.isArray(v)) { // fill data with fields
                    nv = {};
                    $.each(v, function (av, ai) {
                        nv[_keys[ai].name] = av;
                    });
                    v = nv;
                }

                _doccount++;
                v._id = 'T' + String(idpad + TC).slice(-6) + 'R' +
                    String(idpad + _doccount).slice(-6);
                v._f = true;

                records.push(v._id);
                _tdocs.push(v);

                _id[v._id] = _tdocs.length - 1;

            });
            DBI.dm(new Date());
            co.fire('docinsert', records);
            return records;
        }

        function sort(o) {
            _tdocs = orderByCol(_tdocs, o.split(','));
            _id = {};
            $.each(_tdocs, function (r, i) {
                _id[r._id] = i;
            });
            DBI.dm(new Date());
            return true;
        }

        function update(id, changes) {
            var nc = {}, or, nr, tc, hasChange;
            or = _tdocs[_id[id]];
            nr = $.clone(or, changes);
            tc = {};
            hasChange = false;
            $.each(nr, function (i, v) {
                if (!$.isDefined(or[i]) || or[i] !== v) {
                    tc[i] = v;
                    hasChange = true;
                }
            });
            if (hasChange) {
                _tdocs[_id[id]] = nr;
                DBI.dm(new Date());
                co.fire('docupdate', _tdocs[_id[id]], _id[id], tc);
            }
        }

        function remove(id) {
            _tdocs[_id[id]]._f = false;
        }

        function truncate() {
            _tdocs = [];
            _doccount = 1;
            _id = {};
            _lastUpdated = new Date();
            _cacheCount = 0;
            _cacheClear = 0;
            _cache = {};
            co.fire('collectiontruncate');
        }

        function commit() {
            var x;
            var changes = [];
            for (x = _tdocs.length - 1; x > -1; x--) {
                if (!_tdocs[x]._f) {
                    changes.push(_tdocs[x]);
                    _id[_tdocs[x]._id] = undefined;
                    _tdocs.splice(x, 1);
                }
            }
            _id = {};
            $.each(_tdocs, function (r, i) {
                _id[r._id] = i;
            });
            DBI.dm(new Date());
            co.fire('doccommit', changes);
        }

        function query(context) {
            var returnq, cid, results, indexed, limitq, ni;
            var cacheSize = 300;
            if (cacheSize) {
                cid = '';
                $.each(context.filterRaw, function (r) {
                    if ($.isFunction(r)) {
                        cid = 'nocache';
                        return false;
                    }
                    return true;
                });
                if (cid === '') {
                    cid = makeCid($.clone(context, {index: 0, q: 0, queryRaw: 0, run: 0, sort: 0}));
                }
            }


            // Run a new query if there are no results or the run date has been cleared
            if (!context.results || !context.run || (context.run && DBI.dm() > context.run)) {
                results = [];

                // check _cache

                if (cacheSize && _cache[cid]) {
                    _cache[cid].i = _cacheCount++;
                    return _cache[cid].results;
                } else {
                    // if no filter, return DB
                    if (context.filterRaw.length === 0 /*&& context.index.length === 0*/) {
                        $.each(_tdocs, function (r) {
                            results.push(r);
                        });
                        returnq = results;
                    } else {
                        // if queryRaw more q,make q filter function
                        if (context.queryRaw.length > context.q.length) {
                            for (var i = context.q.length, l = context.queryRaw.length; i < l; i++) {
                                context.q.push(returnFilter(context.queryRaw[i]));
                            }
                        }

                        // use indexes
                        indexed = runIndexes(context.index);
                        // run filters
                        $.each(indexed, function (r) {
                            // Run filter to see if record matches query
                            if (context.q.length === 0 || runFilters(r, context.q)) {
                                results.push(r);
                            }
                        });

                        returnq = results;
                    }
                }


            } else {
                // If query exists and run has not been cleared return the cache results
                returnq = context.results;
            }
            // If a custom order array exists and the run has been clear or the sort has been cleared
            if (context.order.length > 0 && (!context.run || !context.sort)) {
                // order the results
                returnq = orderByCol(returnq, context.order);
            }

            // If a limit on the number of results exists and it is less than the returned results, limit results
            if (returnq.length &&
                ((context.limit && context.limit < returnq.length) ||
                    context.start)
                ) {
                limitq = [];
                $.each(returnq, function (r, i) {
                    if (context.start === false || (context.start !== false && i >= context.start)) {
                        if (context.limit) {
                            ni = context.start !== false ? i - context.start : i;
                            if (ni < context.limit) {
                                limitq.push(r);
                            } else if (ni > context.limit) {
                                return false;
                            }
                        }
                        else {
                            limitq.push(r);
                        }
                    }
                    return true;
                });
                returnq = limitq;
            }

            // update cache
            if (cacheSize && cid !== 'nocache') {
                _cacheClear++;

                setTimeout(function () {
                    var bCounter, nc;
                    if (_cacheClear >= cacheSize * 2) {
                        _cacheClear = 0;
                        bCounter = _cacheCount - cacheSize;
                        nc = {};
                        $.each(_cache, function (k, r) {
                            if (r.i >= bCounter) {
                                nc[k] = r;
                            }
                        });
                        _cache = nc;
                    }
                }, 0);

                _cache[cid] = { i: _cacheCount++, results: returnq };
            }
            return returnq;
        }

        function runIndexes(indexes) {

            var records = [], UniqueEnforce = false;

            if (indexes.length === 0) {
                return _tdocs;
            }

            $.each(indexes, function (f) {
                // Check to see if record ID
                if ($.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f) && _tdocs[_id[f]]) {
                    records.push(_tdocs[_id[f]]);
                    UniqueEnforce = true;
                }
                // Check to see if record
                if ($.isObject(f) && f._id && f._f && _tdocs[_id[f._id]]) {
                    records.push(_tdocs[_id[f._id]]);
                    UniqueEnforce = true;
                }
                // Check to see if array of indexes
                if ($.isArray(f)) {
                    $.each(f, function (r) {
                        $.each(runIndexes(r), function (rr) {
                            records.push(rr);
                        });

                    });
                }
            });
            if (UniqueEnforce && records.length > 1) {
                records = [];
            }

            return records;
        }
    }

    function Jcollection(name, keys) {
        acollections.push(dbBASE(name, keys, this));
        this.ctidx = acollections.length - 1;
    }

    $.db.prototype = Jcollection.prototype;
    $.db.prototype.constructor = Jcollection;


    $.extend($.db, {
        qfun: {},
        extend: function (m, f) {
            $.db.prototype[m] = function () {
                return f.apply(this, arguments);
            };
        },
        getCollectionNames: function () {
            return collectionNames;
        },
        getCollection: function (cname) {
            return ocollections[cname];
        },
        createCollection: function (keys, name) {
            var co = new Jcollection(keys, name);

            var ctx;

            context.$ = co;
            context.name = name;

            context.insert = co.insert.bind(co);
            context.on = co.on.bind(co);
            context.off = co.off.bind(co);
            context.fire = co.fire.bind(co);

            $.extend(co, {
                getContext: getContext,
                resetContext: resetContext,
                context: icontext
            });

            if (name) {
                collectionNames.push(name);
                ocollections[name] = context;
            }
            return context;


            function getContext(c) {
                return context.call(c);
            }

            function resetContext() {
                return context.apply(null, arguments);
            }

            function icontext(n) {
                if (n) {
                    ctx = $.extend(ctx,
                        n.hasOwnProperty('results')
                            ? $.extend(n, { run: new Date(), sort: new Date() })
                            : n
                    );
                }
                return ctx;
            }

            function context() {
                ctx = (this && this.q) ? this : {
                    limit: false,
                    start: false,
                    q: [],
                    queryRaw: [],
                    filterRaw: [],
                    index: [],
                    order: [],
                    results: false,
                    run: null,
                    sort: null/*,
                     settings: settings*/
                };
                $.each(arguments, function (f) {
                    if (isIndexable(f)) {
                        ctx.index.push(f);
                    } else {
                        ctx.queryRaw.push(f);
                    }
                    ctx.filterRaw.push(f);
                });
                return co;
            }
        }
    });

    $().extend($.db, {
        on: function (eventName, fn, scope) {
            eventName = eventName.toLowerCase();
            $.event.add(this, eventName, fn, null, "", scope);
        },
        off: function (eventName, fn) {
            eventName = eventName.toLowerCase();
            $.event.remove(this, eventName, fn, "");
        },
        fire: function () {
            var a = $.toArray(arguments),
                ename = a[0].toLowerCase(),
                me = this;
            return $.event.fire(me, ename, a);
        },
        run: function () {
            this.context({
                results: acollections[this.ctidx].query(this.context())
            });
        },
        insert: function () {
            return this.resetContext(acollections[this.ctidx].insert.apply(this, arguments));
        },
        update: function (query, obj) {
            var me = this;

            if (arguments.length == 2) {
                me.filter(query);
            } else {
                obj = query;
            }


            this.run();
            $.each(this.context().results, function (r) {
                if ($.isFunction(obj)) {
                    obj = obj($.extend({}, r));
                }
                if ($.isObject(obj)) {
                    acollections[me.ctidx].update(r._id, obj);
                }
            });
            if (this.context().results.length) {
                this.context({ run: null });
            }
            return this;
        },
        truncate: function () {
            acollections[this.ctidx].truncate();
            return this;
        },
        remove: function (query) {
            var me = this;
            if (arguments.length == 1) {
                me.filter(query);
            }

            this.run();
            $.each(this.context().results, function (r) {
                acollections[me.ctidx].remove(r._id);
            });
            if (this.context().results.length) {
                this.context({
                    run: null
                });
                acollections[me.ctidx].commit();
            }
            return this;
        },
        filter: function () {
            var nc = $.extend(this.context(), { run: null });

            // Hadnle passing of _ID or a record on lookup.
            $.each(arguments, function (f) {
                nc.queryRaw.push(f);
                nc.filterRaw.push(f);
            });

            return this.getContext(nc);
        },
        limit: function (n) {
            var nc = $.extend(this.context(), {}),
                limitedresults;
            nc.limit = n;
            if (nc.run && nc.sort) {
                limitedresults = [];
                $.each(nc.results, function (i, x) {
                    if ((x + 1) > n) {
                        return false;
                    }
                    limitedresults.push(i);
                    return true;
                });
                nc.results = limitedresults;
            }

            return this.getContext(nc);
        },
        start: function (n) {
            var nc = $.extend(this.context(), {}),
                limitedresults;
            nc.start = n;
            if (nc.run && nc.sort && nc.limit === false) {
                limitedresults = [];
                $.each(nc.results, function (i, x) {
                    if ((x + 1) > n) {
                        limitedresults.push(i);
                    }
                });
                nc.results = limitedresults;
            }
            else {
                nc = $.extend(this.context(), {run: null, start: n});
            }

            return this.getContext(nc);
        },
        select: function () {
            var ra = [], args = arguments;
            this.run();
            if (arguments.length === 1) {
                $.each(this.context().results, function (r) {
                    ra.push(r[args[0]]);
                });
            } else {
                $.each(this.context().results, function (r) {
                    var row = [];
                    $.each(args, function (c, i) {
                        row.push(r[c]);
                    });
                    ra.push(row);
                });
            }
            return ra;
        },
        find: function (filter, fields) {
            this.filter(filter);
            return fields ? this.select(fields) : this.get();
        },
        get: function () {
            this.run();
            return this.context().results;
        },
        each: function (callback) {
            this.run();
            $.each(this.context().results, callback);
            return this;
        },
        map: function (callback) {
            var ra = [];
            this.run();
            $.each(this.context().results, function (r) {
                ra.push(callback(r));
            });
            return ra;
        },
        supplant: function (template) {
            var ra = [];
            this.run();

            $.each(this.context().results, function (r) {
                ra.push(template.replace(/\{([^\{\}]*)\}/g, function (a, b) {
                    var v = r[b];
                    return typeof v === 'string' || typeof v === 'number' ? v : a;
                }));
            });
            return ra;
        },

        max: function (c) {
            var highest = null;
            this.run();
            $.each(this.context().results, function (r) {
                if (highest === null || r[c] > highest) {
                    highest = r[c];
                }
            });
            return highest;
        },
        min: function (c) {
            var lowest = null;
            this.run();
            $.each(this.context().results, function (r) {
                if (lowest === null || r[c] < lowest) {
                    lowest = r[c];
                }
            });
            return lowest;
        },
        sum: function () {
            var total = 0, that = this;
            this.run();
            $.each(arguments, function (c) {
                $.each(that.context().results, function (r) {
                    total = total + (r[c] || 0);
                });
            });
            return total;
        },
        count: function () {
            this.run();
            return this.context().results.length;
        },
        first: function () {
            this.run();
            return this.context().results[0] || false;
        },
        last: function () {
            this.run();
            return this.context().results[this.context().results.length - 1] ||
                false;
        },
        stringify: function () {
            return JSON.stringify(this.get());
        }
    });


})($);