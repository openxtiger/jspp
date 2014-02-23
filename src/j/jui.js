(function ($) {

    $.extend({
        idSeed: 0,
        jui: {},
        BLANK_IMAGE_URL: 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
        getId: function (el) {
            var me = this,
                sandboxPrefix = '';
            el = $.dom(el) || {};
            if (el === document) {
            }
            else if (el === window) {
            }
            if (!el.id) {
                el.id = sandboxPrefix + "j-gen" + ++$.idSeed;
            }
            return el.id;
        },
        identityFn: function (o) {
            return o;
        },

        baseCSSPrefix: "j-"
    });
    var LEFT = "left",
        RIGHT = "right",
        TOP = "top",
        BOTTOM = "bottom",
        POSITION = "position",
        STATIC = "static",
        RELATIVE = "relative",
        AUTO = "auto",
        ZINDEX = "z-index";


    $().extend({
        doPosition: function (pos, zIndex, x, y) {
            var me = this;

            if (!pos && me.css(POSITION, STATIC)) {
                me.css(POSITION, RELATIVE);
            } else if (pos) {
                me.css(POSITION, pos);
            }
            if (zIndex) {
                me.css(ZINDEX, zIndex);
            }
            if (x || y) me.offset({left: x, top: y});
        },
        alignTo: function (element, position, offsets) {
            var me = this;
            return me.offset(me.getAlignToXY(element, position, offsets));
        },
        getAnchorXY: function (anchor, local, s) {
            //Passing a different size is useful for pre-calculating anchors,
            //especially for anchored animations that change the el size.
            anchor = (anchor || "tl").toLowerCase();
            s = s || {};

            var me = this,
                vp = this[0] == document.body || this[0] == document,
                w = s.width || vp ? $.width() : me.width(),
                h = s.height || vp ? $.height() : me.height(),
                xy,
                r = Math.round,
                o = me.offset(),
                extraX = vp ? me.scrollLeft() : !local ? o.left : 0,
                extraY = vp ? me.scrollTop() : !local ? o.top : 0;
            var hash = {
                c: [r(w * 0.5), r(h * 0.5)],
                t: [r(w * 0.5), 0],
                l: [0, r(h * 0.5)],
                r: [w, r(h * 0.5)],
                b: [r(w * 0.5), h],
                tl: [0, 0],
                bl: [0, h],
                br: [w, h],
                tr: [w, 0]
            };

            xy = hash[anchor];
            return [xy[0] + extraX, xy[1] + extraY];
        },
        getAlignToXY: function (el, p, o) {

            if (!el || !el.dom()) {
                throw "alignToXY with an element that doesn't exist";
            }

            o = o || [0, 0];
            p = (!p || p == "?" ? "tl-bl?" : (!(/-/).test(p) && p !== "" ? "tl-" + p : p || "tl-bl")).toLowerCase();

            var me = this,
                a1,
                a2,
                x,
                y,
            //constrain the aligned el to viewport if necessary
                w,
                h,
                r,
                dw = $.width() - 10, // 10px of margin for ie
                dh = $.height() - 10, // 10px of margin for ie
                p1y,
                p1x,
                p2y,
                p2x,
                swapY,
                swapX,
                doc = document,
                docElement = doc.documentElement,
                docBody = doc.body,
                scrollX = (docElement.scrollLeft || docBody.scrollLeft || 0) + 5,
                scrollY = (docElement.scrollTop || docBody.scrollTop || 0) + 5,
                m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
            if (!m) {
                throw "Element.alignTo with an invalid alignment " + p;
            }

            var p1 = m[1];
            var p2 = m[2];
            var c = !!m[3];

            //Subtract the aligned el's internal xy from the target's offset xy
            //plus custom offset to get the aligned el's new offset xy
            a1 = me.getAnchorXY(p1, true);
            a2 = el.getAnchorXY(p2, false);

            x = a2[0] - a1[0] + o[0];
            y = a2[1] - a1[1] + o[1];

            if (c) {
                w = me.width();
                h = me.height();
                r = el.region();
                //If we are at a viewport boundary and the aligned el is anchored on a target border that is
                //perpendicular to the vp border, allow the aligned el to slide on that border,
                //otherwise swap the aligned el to the opposite border of the target.
                p1y = p1.charAt(0);
                p1x = p1.charAt(p1.length - 1);
                p2y = p2.charAt(0);
                p2x = p2.charAt(p2.length - 1);
                swapY = ((p1y == "t" && p2y == "b") || (p1y == "b" && p2y == "t"));
                swapX = ((p1x == "r" && p2x == "l") || (p1x == "l" && p2x == "r"));


                if (x + w > dw + scrollX) {
                    x = swapX ? r.left - w : dw + scrollX - w;
                }
                if (x < scrollX) {
                    x = swapX ? r.right : scrollX;
                }
                if (y + h > dh + scrollY) {
                    y = swapY ? r.top - h : dh + scrollY - h;
                }
                if (y < scrollY) {
                    y = swapY ? r.bottom : scrollY;
                }
            }
            return {left: x, top: y};
        }
    });

})($);