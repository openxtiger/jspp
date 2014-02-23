/**
 * @pakcage jde
 */
'package jde'.j(function () {
    /**
     * @class jde.DataProxy
     */
    'class DataProxy implements junit.Observable'.j(function (cob) {
        jpublic({
            constructor: function () {
                jcall(cob, this);
            },
            request: function (params, reader, callback, scope, options) {
                params = params || {};
                if (this.fireEvent("beforeload", this, params) !== false) {
                    this.doRequest.apply(this, arguments);
                }
                else {
                    callback.call(scope || this, null, options, false);
                }
            },
            doRequest: function (params, reader, callback, scope, options) {
            }
        });

    });
});