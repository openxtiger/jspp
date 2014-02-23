/**
 * @pakcage jde
 */
'package jde'.j(function () {
    /**
     * @class jde.JsonReader
     * @class jsonreader
     */
    'class JsonReader'.j(function () {

        jprotected({
            createAccessor: function () {
                //var re = /[\[\.]/;
                return function (expr) {
                    if ($.isEmpty(expr)) {
                        return $.noop;
                    }
                    if ($.isFunction(expr)) {
                        return expr;
                    }
                    /*var i = String(expr).search(re);
                     if (i >= 0) {
                     return new Function('obj', 'return obj' + (i > 0 ? '.' : '') + expr);
                     }*/
                    return function (obj) {
                        return obj[expr];
                    };

                };
            }(),
            buildExtractors: function () {
                var s = this.meta;
                if (s.totalProperty) {
                    this.getTotal = this.createAccessor(s.totalProperty);
                }
                if (s.successProperty) {
                    this.getSuccess = this.createAccessor(s.successProperty);
                }
                if (s.messageProperty) {
                    this.getMessage = this.createAccessor(s.messageProperty);
                }
                this.getRoot = s.root ? this.createAccessor(s.root) : function (p) {
                    return p;
                };
                if (s.id || s.idProperty) {
                    var g = this.createAccessor(s.id || s.idProperty);
                    this.getId = function (rec) {
                        var r = g(rec);
                        return (r === undefined || r === '') ? null : r;
                    };
                } else {
                    this.getId = function () {
                        return null;
                    };
                }
            }
        });

        jpublic({
            constructor: function (meta) {
                meta = meta || {};
                $.extendIf(meta, {
                    idProperty: 'id',
                    successProperty: 'success',
                    totalProperty: 'total'
                });
                this.meta = meta;
                this.buildExtractors();
            },
            read: function (response) {
                var json = response.responseText;
                var o = JSON.parse(json);
                if (!o) {
                    throw {message: 'JsonReader.read: Json object not found'};
                }
                return this.readRecords(o);
            },
            readRecords: function (o) {
                this.jsonData = o;

                var s = this.meta, v;

                var root = this.getRoot(o), c = root.length, totalRecords = c, success = true;
                if (s.totalProperty) {
                    v = parseInt(this.getTotal(o), 10);
                    if (!isNaN(v)) {
                        totalRecords = v;
                    }
                }
                if (s.successProperty) {
                    v = this.getSuccess(o);
                    if (v === false || v === 'false') {
                        success = false;
                    }
                }
                return {
                    success: success,
                    records: o,
                    totalRecords: totalRecords
                };
            }
        });

    }, function () {
        jde.jsonreader = new this();
        return "jsonreader";
    });
});