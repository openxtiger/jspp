/**
 * @pakcage jui.form
 */
'package jui.form'.j(function () {
    /**
     * @class jui.form.Radio
     * @extends jui.form.Checkbox
     */
    'class Radio extends Checkbox'.j(function () {

        jprotected({
            inputType: 'radio',

            /**
             * Overridden and disabled. The editor element does not support standard valid/invalid marking. @hide
             * @method
             */
            markInvalid: $.noop,
            /**
             * Overridden and disabled. The editor element does not support standard valid/invalid marking. @hide
             * @method
             */
            clearInvalid: $.noop,

            /**
             * If this radio is part of a group, it will return the selected value
             * @return {String}
             */
            /*getGroupValue: function () {
             var p = this.el.up('form') || $.getBody();
             var c = p.child('input[name=' + this.el.dom.name + ']:checked', true);
             return c ? c.value : null;
             },
             */
            onClick: function () {
                /*if (this.el.dom().checked != this.checked) {
                 var els = this.getCheckEl().query('input[name=' + this.el.dom().name + ']');
                 var id = this.id;
                 console.log(els);
                 els.each(function (dom) {
                 if (this.id == id) {
                 $.widget(this.id).setValue(true);
                 } else {
                 $.widget(this.id).setValue(false);
                 }
                 }, this);
                 }*/
            },


            // private
            getCheckEl: function () {
                if (this.inGroup) {
                    return this.el.up('.j-form-radio-group')
                }
                return this.el.up('form') || $.getBody();
            }
        });

        jpublic({
            /**
             * Sets either the checked/unchecked status of this Radio, or, if a string value
             * is passed, checks a sibling Radio of the same name whose value is the value specified.
             * @param value {String/Boolean} Checked value, or the value of the sibling radio button to check.
             * @return {jui.form.Field} this
             */
            setValue: function (value) {
                if (typeof value == 'boolean') {
                    jsuper(this);
                } else if (this.rendered) {
                    var r = this.getCheckEl().down("input[type=radio][name='" + this.el.dom().name + "'][value='" + value + "']", true);
                    if (r) {
                        $.widget(r.id).setValue(true);
                    }
                }
                return this;
            }
        });

    }, "radio");
});