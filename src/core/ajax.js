(function ($) {

    $.extend({
        ajax: function (method, uri, data, options, user, password) {
            if (options) {
                var me = this,
                    xmlData = options.xmlData,
                    jsonData = options.jsonData,
                    hs;

                $.extendIf(me, options);

                if (xmlData || jsonData) {
                    hs = me.headers;
                    if (!hs || !hs[CONTENTTYPE]) {
                        initHeader(CONTENTTYPE, xmlData ? 'text/xml' : 'application/json');
                    }
                    data = xmlData || (!$.isPrimitive(jsonData) ? JSON.stringify(jsonData) : jsonData);
                }
            }

            var deferred = $.deferred();
            $.extend(deferred, options);

            asyncRequest(method || options.method || "POST", uri, deferred, data, user, password);

            return deferred;
        }
    });

    var pub = $.ajax;
    $.extend(pub, {
        useDefaultHeader: true,
        defaultPostHeader: 'application/x-www-form-urlencoded; charset=UTF-8',
        useDefaultXhrHeader: true,
        defaultXhrHeader: 'XMLHttpRequest',
        poll: {},
        timeout: {},
        pollInterval: 50,
        transactionId: 0,
        abort: function (o, callback, isTimeout) {
            var me = this,
                tId = o.tId,
                isAbort = false;

            if (me.isCallInProgress(o)) {
                o.conn.abort();
                clearInterval(me.poll[tId]);
                me.poll[tId] = null;
                clearTimeout(pub.timeout[tId]);
                me.timeout[tId] = null;

                handleTransactionResponse(o, callback, (isAbort = true), isTimeout);
            }
            return isAbort;
        },
        isCallInProgress: function (o) {
            // if there is a connection and readyState is not 0 or 4
            return o.conn && !{0: true, 4: true}[o.conn.readyState];
        }
    });


    var activeX = ['MSXML2.XMLHTTP.3.0',
            'MSXML2.XMLHTTP',
            'Microsoft.XMLHTTP'],
        CONTENTTYPE = 'Content-Type';

    // private
    function setHeader(o) {
        var conn = o.conn,
            prop;

        function setTheHeaders(conn, headers) {
            for (prop in headers) {
                if (headers.hasOwnProperty(prop)) {
                    conn.setRequestHeader(prop, headers[prop]);
                }
            }
        }

        if (pub.defaultHeaders) {
            setTheHeaders(conn, pub.defaultHeaders);
        }

        if (pub.headers) {
            setTheHeaders(conn, pub.headers);
            delete pub.headers;
        }
    }

    // private
    function createExceptionObject(tId, callbackArg, isAbort, isTimeout) {
        return {
            tId: tId,
            status: isAbort ? -1 : 0,
            statusText: isAbort ? 'transaction aborted' : 'communication failure',
            isAbort: isAbort,
            isTimeout: isTimeout,
            argument: callbackArg
        };
    }

    // private
    function initHeader(label, value) {
        (pub.headers = pub.headers || {})[label] = value;
    }

    // private
    function createResponseObject(o, callbackArg) {
        var headerObj = {},
            headerStr,
            conn = o.conn,
            t,
            s;

        try {
            headerStr = o.conn.getAllResponseHeaders();
            $.each(headerStr.replace(/\r\n/g, '\n').split('\n'), function (v) {
                t = v.indexOf(':');
                if (t >= 0) {
                    s = v.substr(0, t).toLowerCase();
                    if (v.charAt(t + 1) == ' ') {
                        ++t;
                    }
                    headerObj[s] = v.substr(t + 1);
                }
            });
        } catch (e) {
        }

        return {
            tId: o.tId,
            status: conn.status,
            statusText: conn.statusText,
            getResponseHeader: function (header) {
                return headerObj[header.toLowerCase()];
            },
            getAllResponseHeaders: function () {
                return headerStr
            },
            responseText: conn.responseText,
            responseXML: conn.responseXML,
            argument: callbackArg
        };
    }

    // private
    function releaseObject(o) {
        o.conn = null;
        o = null;
    }

    // private
    function handleTransactionResponse(o, deferred, isAbort, isTimeout) {
        if (!deferred) {
            releaseObject(o);
            return;
        }

        var httpStatus, responseObject;

        try {
            if (o.conn.status !== undefined && o.conn.status != 0) {
                httpStatus = o.conn.status;
            }
            else {
                httpStatus = 13030;
            }
        }
        catch (e) {
            httpStatus = 13030;
        }

        if ((httpStatus >= 200 && httpStatus < 300)) {
            responseObject = createResponseObject(o, deferred.argument);
            if (!deferred.scope) {
                deferred.resolve(responseObject);
            }
            else {
                deferred.resolveWith(deferred.scope, [responseObject]);
            }
        } else {
            switch (httpStatus) {
                case 12002:
                case 12029:
                case 12030:
                case 12031:
                case 12152:
                case 13030:
                    responseObject = createExceptionObject(o.tId, deferred.argument, (isAbort ? isAbort : false), isTimeout);
                    if (!deferred.scope) {
                        deferred.reject(responseObject);
                    }
                    else {
                        deferred.rejectWith(deferred.scope, [responseObject]);
                    }
                    break;
                default:
                    responseObject = createResponseObject(o, deferred.argument);
                    if (!deferred.scope) {
                        deferred.reject(responseObject);
                    }
                    else {
                        deferred.rejectWith(deferred.scope, [responseObject]);
                    }
            }
        }

        releaseObject(o);
        responseObject = null;
    }

    // private
    function handleReadyState(o, deferred) {
        var conn = o.conn,
            tId = o.tId,
            poll = pub.poll,
            cbTimeout = deferred.timeout || null;

        if (cbTimeout) {
            pub.timeout[tId] = setTimeout(function () {
                pub.abort(o, callback, true);
            }, cbTimeout);
        }

        poll[tId] = setInterval(
            function () {
                if (conn && conn.readyState == 4) {
                    clearInterval(poll[tId]);
                    poll[tId] = null;

                    if (cbTimeout) {
                        clearTimeout(pub.timeout[tId]);
                        pub.timeout[tId] = null;
                    }

                    handleTransactionResponse(o, deferred);
                }
            },
            pub.pollInterval);
    }

    // private
    function getConnectionObject() {
        var o;

        try {
            if (o = createXhrObject(pub.transactionId)) {
                pub.transactionId++;
            }
        } catch (e) {
        } finally {
            return o;
        }
    }

    // private
    function createXhrObject(transactionId) {
        var http;

        try {
            http = new XMLHttpRequest();
        } catch (e) {
            for (var i = 0; i < activeX.length; ++i) {
                try {
                    http = new ActiveXObject(activeX[i]);
                    break;
                } catch (e) {
                }
            }
        } finally {
            return {conn: http, tId: transactionId};
        }
    }

    // private
    function asyncRequest(method, uri, deferred, postData, user, password) {
        var o = getConnectionObject() || null;

        if (o) {
            if (user) {
                o.conn.open(method, uri, true, user, password);
            } else {
                o.conn.open(method, uri, true);
            }

            if (pub.useDefaultXhrHeader) {
                initHeader('X-Requested-With', pub.defaultXhrHeader);
            }

            if (postData && pub.useDefaultHeader && (!pub.headers || !pub.headers[CONTENTTYPE])) {
                initHeader(CONTENTTYPE, pub.defaultPostHeader);
            }

            if (pub.defaultHeaders || pub.headers) {
                setHeader(o);
            }

            handleReadyState(o, deferred);

            o.conn.send(postData || null);
        }
        return o;
    }


})($);