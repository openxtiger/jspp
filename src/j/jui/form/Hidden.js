/**
 * @pakcage jui.form
 */
'package jui.form'.j(function () {
    /**
     * @class jui.form.Hidden
     * @extends jui.form.Field
     */
    'class Hidden extends Field'.j(function () {

        jprotected({
            inputType: 'hidden',

            // private
            onRender: function () {
                jsuper(this);
            },

            // private
            initEvents: function () {
                this.originalValue = this.getValue();
            },

            // These are all private overrides
            setSize: $.noop,
            setWidth: $.noop,
            setHeight: $.noop,
            setPosition: $.noop,
            setPagePosition: $.noop,
            markInvalid: $.noop,
            clearInvalid: $.noop
        });

    }, 'hidden');
});