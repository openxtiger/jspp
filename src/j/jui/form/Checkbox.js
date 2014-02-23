/**
 * @pakcage jui.form
 */
'package jui.form'.j(function () {
    /**
     * @class jui.form.Checkbox
     * @extends jui.form.Field
     */
    'class Checkbox extends Field'.j(function () {

        jprotected({
            /**
             * @cfg {String} focusClass The CSS class to use when the checkbox receives focus (defaults to undefined)
             */
            focusClass: undefined,
            /**
             * @cfg {String} fieldClass The default CSS class for the checkbox (defaults to 'x-form-field')
             */
            fieldClass: 'j-form-field',
            /**
             * @cfg {Boolean} checked <tt>true</tt> if the checkbox should render initially checked (defaults to <tt>false</tt>)
             */
            checked: false,
            /**
             * @cfg {String} boxLabel The text that appears beside the checkbox
             */
            boxLabel: '&#160;',
            /**
             * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
             * {tag: 'input', type: 'checkbox', autocomplete: 'off'})
             */
            defaultAutoCreate: { tag: 'input', type: 'checkbox', autocomplete: 'off'},

            actionMode: 'wrap'

        });
        jprotected({
            initComponent: function () {
                jsuper(this);
            },

            // private
            onResize: function () {
                jsuper(this);
                /*if (!this.boxLabel && !this.fieldLabel) {
                 this.el.alignTo(this.wrap, 'c-c');
                 }*/
            },

            // private
            initEvents: function () {
                jsuper(this);
                this.el.on("click change", this.onClick, this);
            },

            /**
             * @hide
             * Overridden and disabled. The editor element does not support standard valid/invalid marking.
             * @method
             */
            markInvalid: $.noop,
            /**
             * @hide
             * Overridden and disabled. The editor element does not support standard valid/invalid marking.
             * @method
             */
            clearInvalid: $.noop,

            // private
            onRender: function (ct, position) {
                jsuper(this);
                if (this.inputValue !== undefined) {
                    this.el.val(this.inputValue);
                }
                this.wrap = this.el.wrap({cls: 'j-form-check-wrap'});
                if (this.boxLabel) {
                    this.wrap.createChild({tag: 'label', htmlFor: this.el.dom().id, cls: 'j-form-cb-label', html: this.boxLabel});
                }
                if (this.checked) {
                    this.setValue(true);
                } else {
                    this.checked = this.el.dom.checked;
                }
                this.resizeEl = this.positionEl = this.wrap;
            },

            // private
            onDestroy: function () {
                $.remove(this.wrap);
                jsuper(this);
            },

            // private
            initValue: function () {
                this.originalValue = this.getValue();
            },

            /**
             * Returns the checked state of the checkbox.
             * @return {Boolean} True if checked, else false
             */
            getValue: function () {
                if (this.rendered) {
                    return this.el.dom().checked;
                }
                return this.checked;
            },

            // private
            onClick: function () {
                if (this.el.dom().checked != this.checked) {
                    this.setValue(this.el.dom().checked);
                }
            },

            /**
             * Sets the checked state of the checkbox, fires the 'check' event, and calls a
             * <code>{@link #handler}</code> (if configured).
             * @param {Boolean/String} checked The following values will check the checkbox:
             * <code>true, 'true', '1', or 'on'</code>. Any other value will uncheck the checkbox.
             * @return {jui.form.Field} this
             */
            setValue: function (v) {
                var checked = this.checked;
                this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() == 'on');
                if (this.rendered) {
                    this.el.dom().checked = this.checked;
                    this.el.dom().defaultChecked = this.checked;
                }
                if (checked != this.checked) {
                    this.fireEvent('check', this, this.checked);
                    if (this.handler) {
                        this.handler.call(this.scope || this, this, this.checked);
                    }
                }
                return this;
            }
        });

    }, 'checkbox');
});