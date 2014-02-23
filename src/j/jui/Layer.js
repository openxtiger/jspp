/**
 * @pakcage jui
 */
'package jui'.j(function () {
    /**
     * @class jui.Layer
     */
    jui.Layer = $.inherit({
            length: 1,
            constructor: function (config, existingEl) {
                config = config || {};
                var cp = config.parentEl, pel = cp ? $.dom(cp) : document.body;
                if (existingEl) {
                    this[0] = $.get(existingEl);
                }
                if (!this[0]) {
                    var o = config.dh || {tag: 'div', cls: 'j-layer'};
                    this[0] = $.append(pel, o);
                }
                if (config.cls) {
                    this.addClass(config.cls);
                }
                this.constrain = config.constrain !== false;
                this.setVisibility(true);
                if (config.id) {
                    this.id = this[0].id = config.id;
                } else {
                    this.id = $.getId(this[0]);
                }
                this.zindex = config.zindex || this.getZIndex();
                this.doPosition('absolute', this.zindex);
                this.shadowOffset = 0;
                this.useDisplay = config.useDisplay;
                this.hide();
            },
            setZIndex: function (zindex) {
                this.zindex = zindex;
                this.css('z-index', zindex + 2);
                return this;
            },
            getZIndex: function () {
                return this.zindex || parseInt(this.css('z-index'), 10) || 11000;
            }
        }
    );

});