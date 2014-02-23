/**
 * JavaScript Database Engine
 * @pakcage jdbe
 */
'package jde'.j(function () {
    /**
     * @class JDEngine
     * @class jdengine
     */
    'class JDEngine implements junit.Observable'.j(function (cob) {

        jprotected({
            paramNames: undefined,
            initEvents: function () {
                this.jsdb.on("docupdate docinsert doccommit", this.fireEvent, this);
            }
        });

        jpublic({
            defaultParamNames: {
                start: 'start',
                limit: 'limit',
                sort: 'sort',
                dir: 'dir'
            }
        });
        jpublic({
            constructor: function (jsdb, proxy, reader) {
                this.jsdb = jsdb;
                this.proxy = proxy;
                this.reader = reader || jde.jsonreader;
                jcall(cob, this);
                this.initEvents();
            },
            storeOptions: function (o) {
                o = $.clone({}, o);
                delete o.callback;
                delete o.scope;
                this.lastOptions = o;
            },
            load: function (options) {
                options = options || {};
                this.storeOptions(options);
                if (this.sortInfo && this.remoteSort) {
                    var pn = this.paramNames;
                    options.params = options.params || {};
                    options.params[pn.sort] = this.sortInfo.field;
                    options.params[pn.dir] = this.sortInfo.direction;
                }
                this.proxy.request(options.params, this.reader, this.loadRecords, this, options);
            },
            reload: function (options) {
                this.load($.extendIf(options || {}, this.lastOptions));
            },
            loadRecords: function (o, options, success) {
                if (this.isDestroyed === true) {
                    return;
                }
                if (!o || success === false) {
                    if (success !== false) {
                        this.fireEvent('load', this, [], options);
                    }
                    if (options.callback) {
                        options.callback.call(options.scope || this, [], options, false, o);
                    }
                    return;
                }
                var r = o.records, t = o.totalRecords || r.length;
                if (!options || options.add !== true) {
                    this.jsdb().truncate().insert(r);
                    this.fireEvent('datachanged', this);
                } else {
                    this.jsdb().insert(r);
                }
                this.fireEvent('load', this, r, options);
                if (options.callback) {
                    options.callback.call(options.scope || this, r, options, true);
                }
            },
            filter: function (query) {
                this.query = query;
                this.fireEvent("datachanged");
            },
            clearFilter: function () {
                this.query = null;
                this.fireEvent("datachanged");
            },
            get: function () {
                return this.query === null ? this.jsdb().get() : this.jsdb().filter(this.query).get();
            },
            getCount: function () {
                return this.query === null ? this.jsdb().count() : this.jsdb().filter(this.query).count();
            }
        });

    }, 'jdengine');
});