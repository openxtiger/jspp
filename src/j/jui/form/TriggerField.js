/**
 * @pakcage jui.form
 */
'package jui.form'.j(function () {
    /**
     * @class jui.form.TriggerField
     * @extends jui.form.TextField
     */
    'class TriggerField extends TextField'.j(function () {
        /**
         * @cfg {String} triggerClass
         * An additional CSS class used to style the trigger button.  The trigger will always get the
         * class <tt>'x-form-trigger'</tt> by default and <tt>triggerClass</tt> will be <b>appended</b> if specified.
         */
        /**
         * @cfg {Mixed} triggerConfig
         * <p>A config object specifying the structure of the
         * trigger element for this Field. (Optional).</p>
         * <p>Specify this when you need a customized element to act as the trigger button for a TriggerField.</p>
         * <p>Note that when using this option, it is the developer's responsibility to ensure correct sizing, positioning
         * and appearance of the trigger.  Defaults to:</p>
         * <pre><code>{tag: "img", src: $.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.triggerClass}</code></pre>
         */

        jprotected({
            defaultAutoCreate: {tag: "input", type: "text", size: "16", autocomplete: "off"},
            /**
             * @cfg {Boolean} hideTrigger <tt>true</tt> to hide the trigger element and display only the base
             * text field (defaults to <tt>false</tt>)
             */
            hideTrigger: false,
            /**
             * @cfg {Boolean} editable <tt>false</tt> to prevent the user from typing text directly into the field,
             * the field will only respond to a click on the trigger to set the value. (defaults to <tt>true</tt>).
             */
            editable: true,
            /**
             * @cfg {Boolean} readOnly <tt>true</tt> to prevent the user from changing the field, and
             * hides the trigger.  Superceeds the editable and hideTrigger options if the value is true.
             * (defaults to <tt>false</tt>)
             */
            readOnly: false,
            /**
             * @cfg {String} wrapFocusClass The class added to the to the wrap of the trigger element. Defaults to
             * <tt>x-trigger-wrap-focus</tt>.
             */
            wrapFocusClass: 'j-trigger-wrap-focus',
            /**
             * @hide
             * @method autoSize
             */
            autoSize: $.noop,
            // private
            monitorTab: true,
            // private
            deferHeight: true,
            // private
            mimicing: false,

            actionMode: 'wrap',

            defaultTriggerWidth: 17
        });

        jprotected({
            onResize: function (w, h) {
                jsuper(this);
                var tw = this.getTriggerWidth();
                if ($.isNumber(w)) {
                    this.el.width(w - tw);
                }
                this.wrap.width(this.el.width() + tw);
            },

            getTriggerWidth: function () {
                var tw = this.trigger.width();
                if (!this.hideTrigger && !this.readOnly && tw === 0) {
                    tw = this.defaultTriggerWidth;
                }
                return tw;
            },

            // private
            alignErrorIcon: function () {
                if (this.wrap) {
                    this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
                }
            },

            // private
            onRender: function (ct, position) {
                this.doc = $.getBody();
                jsuper(this);

                this.wrap = this.el.wrap({cls: 'j-form-field-wrap j-form-field-trigger-wrap'});
                this.trigger = this.wrap.createChild(this.triggerConfig ||
                {tag: "img", src: $.BLANK_IMAGE_URL, cls: "j-form-trigger " + this.triggerClass});
                this.initTrigger();
                if (!this.width) {
                    this.wrap.width(this.el.width() + this.trigger.width());
                }
                this.resizeEl = this.positionEl = this.wrap;
            },


            // private
            initTrigger: function () {
                this.trigger.on('click', this.onTriggerClick, this);
                //this.trigger.addClassOnOver('j-form-trigger-over');
                //this.trigger.addClassOnClick('j-form-trigger-click');
            },

            // private
            onDestroy: function () {
                $.destroy(this.trigger, this.wrap);
                if (this.mimicing) {
                    this.doc.off('mousedown', this.mimicBlur, this);
                }
                delete this.doc;
                jsuper(this);
            },

            // private
            onFocus: function () {
                jsuper(this);
                if (!this.mimicing) {
                    this.wrap.addClass(this.wrapFocusClass);
                    this.mimicing = true;
                    this.doc.on('mousedown', this.mimicBlur, this);
                    if (this.monitorTab) {
                        this.el.on('specialkey', this.checkTab, this);
                    }
                }
            },

            // private
            checkTab: function (me, e) {
                if (e.getKey() == e.TAB) {
                    this.triggerBlur();
                }
            },


            // private
            mimicBlur: function (e) {
                /*if (!this.isDestroyed && !this.wrap.contains(e.target) && this.validateBlur(e)) {
                 this.triggerBlur();
                 }*/
            },

            // private
            triggerBlur: function () {
                this.mimicing = false;
                this.doc.off('mousedown', this.mimicBlur, this);
                if (this.monitorTab && this.el) {
                    this.off('specialkey', this.checkTab, this);
                }
                jsuper(this);
                if (this.wrap) {
                    this.wrap.removeClass(this.wrapFocusClass);
                }
            },

            afterRender: function () {
                jsuper(this);
                this.updateEditState();
            },

            // private
            // This should be overriden by any subclass that needs to check whether or not the field can be blurred.
            validateBlur: function (e) {
                return true;
            }


        });

        jpublic({
            updateEditState: function () {
                if (this.rendered) {
                    if (this.readOnly) {
                        this.el.dom.readOnly = true;
                        this.el.addClass('x-trigger-noedit');
                        this.el.on('click', this.onTriggerClick, this);
                        this.trigger.hide();
                    } else {
                        if (!this.editable) {
                            this.el.dom.readOnly = true;
                            this.el.addClass('x-trigger-noedit');
                            this.el.on('click', this.onTriggerClick, this);
                        } else {
                            this.el.dom.readOnly = false;
                            this.el.removeClass('x-trigger-noedit');
                            this.el.off('click', this.onTriggerClick, this);
                        }
                        this.trigger.toggle(!this.hideTrigger);
                    }
                    this.onResize(this.width || this.wrap.width());
                }
            },

            setHideTrigger: function (hideTrigger) {
                if (hideTrigger != this.hideTrigger) {
                    this.hideTrigger = hideTrigger;
                    this.updateEditState();
                }
            },

            /**
             * @param {Boolean} value True to allow the user to directly edit the field text
             * Allow or prevent the user from directly editing the field text.  If false is passed,
             * the user will only be able to modify the field using the trigger.  Will also add
             * a click event to the text field which will call the trigger. This method
             * is the runtime equivalent of setting the 'editable' config option at config time.
             */
            setEditable: function (editable) {
                if (editable != this.editable) {
                    this.editable = editable;
                    this.updateEditState();
                }
            },

            /**
             * @param {Boolean} value True to prevent the user changing the field and explicitly
             * hide the trigger.
             * Setting this to true will superceed settings editable and hideTrigger.
             * Setting this to false will defer back to editable and hideTrigger. This method
             * is the runtime equivalent of setting the 'readOnly' config option at config time.
             */
            setReadOnly: function (readOnly) {
                if (readOnly != this.readOnly) {
                    this.readOnly = readOnly;
                    this.updateEditState();
                }
            },


            onBlur: $.noop,

            beforeBlur: $.noop,
            /**
             * The function that should handle the trigger's click event.  This method does nothing by default
             * until overridden by an implementing function.  See Ext.form.ComboBox and Ext.form.DateField for
             * sample implementations.
             * @method
             * @param {EventObject} e
             */
            onTriggerClick: $.noop
        });

    }, 'triggerfield');

    /**
     * @class jui.form.TwinTriggerField
     * @extends jui.form.TriggerField
     */
    'class TwinTriggerField extends TriggerField'.j(function () {

        /**
         * @cfg {Mixed} triggerConfig
         * <p>A  config object specifying the structure of the trigger elements
         * for this Field. (Optional).</p>
         * <p>Specify this when you need a customized element to contain the two trigger elements for this Field.
         * Each trigger element must be marked by the CSS class <tt>x-form-trigger</tt> (also see
         * <tt>{@link #trigger1Class}</tt> and <tt>{@link #trigger2Class}</tt>).</p>
         * <p>Note that when using this option, it is the developer's responsibility to ensure correct sizing,
         * positioning and appearance of the triggers.</p>
         */
        /**
         * @cfg {String} trigger1Class
         * An additional CSS class used to style the trigger button.  The trigger will always get the
         * class <tt>'x-form-trigger'</tt> by default and <tt>triggerClass</tt> will be <b>appended</b> if specified.
         */
        /**
         * @cfg {String} trigger2Class
         * An additional CSS class used to style the trigger button.  The trigger will always get the
         * class <tt>'x-form-trigger'</tt> by default and <tt>triggerClass</tt> will be <b>appended</b> if specified.
         */
        jprotected({
            initComponent: function () {
                jsuper(this);

                this.triggerConfig = {
                    tag: 'span', cls: 'x-form-twin-triggers', cn: [
                        {tag: "img", src: $.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger1Class},
                        {tag: "img", src: $.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger2Class}
                    ]};
            },

            getTrigger: function (index) {
                return this.triggers[index];
            },

            initTrigger: function () {
                var ts = this.trigger.select('.x-form-trigger', true);
                var triggerField = this;
                ts.each(function (t, all, index) {
                    var triggerIndex = 'Trigger' + (index + 1);
                    t.hide = function () {
                        var w = triggerField.wrap.getWidth();
                        this.dom.style.display = 'none';
                        triggerField.el.setWidth(w - triggerField.trigger.getWidth());
                        this['hidden' + triggerIndex] = true;
                    };
                    t.show = function () {
                        var w = triggerField.wrap.getWidth();
                        this.dom.style.display = '';
                        triggerField.el.setWidth(w - triggerField.trigger.getWidth());
                        this['hidden' + triggerIndex] = false;
                    };

                    if (this['hide' + triggerIndex]) {
                        t.dom.style.display = 'none';
                        this['hidden' + triggerIndex] = true;
                    }
                    t.on('click', this['on' + triggerIndex + 'Click'], this);
                    //t.addClassOnOver('x-form-trigger-over');
                    //t.addClassOnClick('x-form-trigger-click');
                }, this);
                this.triggers = ts.elements;
            },

            getTriggerWidth: function () {
                var tw = 0;
                $.each(this.triggers, function (t, index) {
                    var triggerIndex = 'Trigger' + (index + 1),
                        w = t.getWidth();
                    if (w === 0 && !this['hidden' + triggerIndex]) {
                        tw += this.defaultTriggerWidth;
                    } else {
                        tw += w;
                    }
                }, this);
                return tw;
            },

            // private
            onDestroy: function () {
                $.destroy(this.triggers);
                jsuper(this);
            }
        });

        jpublic({
            /**
             * The function that should handle the trigger's click event.  This method does nothing by default
             * until overridden by an implementing function. See {@link Ext.form.TriggerField#onTriggerClick}
             * for additional information.
             * @method
             * @param {EventObject} e
             */
            onTrigger1Click: $.noop,
            /**
             * The function that should handle the trigger's click event.  This method does nothing by default
             * until overridden by an implementing function. See {@link Ext.form.TriggerField#onTriggerClick}
             * for additional information.
             * @method
             * @param {EventObject} e
             */
            onTrigger2Click: $.noop
        });

    });

});