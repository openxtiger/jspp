/**
 * @pakcage jui.form
 */
'package jui.form'.j(function () {
    /**
     * @class jui.form.TextArea
     * @extends jui.form.TextField
     */
    'class TextArea extends TextField'.j(function () {
        jpublic({
            enterIsSpecial: false,
            preventScrollbars: false
        });
        jprotected({
            onRender: function (ct, position) {
                if (!this.el) {
                    this.defaultAutoCreate = {
                        tag: "textarea",
                        style: "width:100px;height:60px;",
                        autocomplete: "off"
                    };
                }
                jsuper(this);
                /*if (this.grow) {
                 this.textSizeEl = Ext.DomHelper.append(document.body, {
                 tag: "pre", cls: "x-form-grow-sizer"
                 });
                 if (this.preventScrollbars) {
                 this.el.setStyle("overflow", "hidden");
                 }
                 this.el.setHeight(this.growMin);
                 }*/
            },

            onDestroy: function () {
                //Ext.removeNode(this.textSizeEl);
                jsuper(this);
            },

            fireKey: function (e) {
                /*if (e.isSpecialKey() && (this.enterIsSpecial || (e.getKey() != e.ENTER || e.hasModifier()))) {
                 this.fireEvent("specialkey", this, e);
                 }*/
            },

            // private
            doAutoSize: function (e) {
                return !e.isNavKeyPress() || e.getKey() == e.ENTER;
            },

            /**
             * Automatically grows the field to accomodate the height of the text up to the maximum field height allowed.
             * This only takes effect if grow = true, and fires the {@link #autosize} event if the height changes.
             */
            autoSize: function () {
                /*if (!this.grow || !this.textSizeEl) {
                 return;
                 }
                 var el = this.el,
                 v = Ext.util.Format.htmlEncode(el.dom.value),
                 ts = this.textSizeEl,
                 h;

                 Ext.fly(ts).setWidth(this.el.getWidth());
                 if (v.length < 1) {
                 v = "&#160;&#160;";
                 } else {
                 v += this.growAppend;
                 if (Ext.isIE) {
                 v = v.replace(/\n/g, '&#160;<br />');
                 }
                 }
                 ts.innerHTML = v;
                 h = Math.min(this.growMax, Math.max(ts.offsetHeight, this.growMin));
                 if (h != this.lastHeight) {
                 this.lastHeight = h;
                 this.el.setHeight(h);
                 this.fireEvent("autosize", this, h);
                 }*/
            }
        });
    }, 'textarea');
});