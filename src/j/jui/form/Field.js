/**
 * @pakcage jui.form
 */
'package jui.form'.j(function () {
    /**
     * @class jui.form.Field
     * @extends jui.Component
     */
    'class Field extends jui.Component'.j(function () {
        jprivate({
            /**
             * @event focus
             * Fires when this field receives input focus.
             * @param {jui.form.Field} this
             */
            /**
             * @event blur
             * Fires when this field loses input focus.
             * @param {jui.form.Field} this
             */
            /**
             * @event specialkey
             * Fires when any key related to navigation (arrows, tab, enter, esc, etc.) is pressed.
             * To handle other keys see {@link jui.Panel#keys} or {@link jui.KeyMap}.
             * You can check {@link jui.EventObject#getKey} to determine which key was pressed.
             * For example: <pre><code>
             var form = new jui.form.FormPanel({
                                 * </code></pre>
                                 * @param {jui.form.Field} this
             * @param {jui.EventObject} e The event object
             */
            /**
             * @event change
             * Fires just before the field blurs if the field value has changed.
             * @param {jui.form.Field} this
             * @param {Mixed} newValue The new value
             * @param {Mixed} oldValue The original value
             */
            /**
             * @event invalid
             * Fires after the field has been marked as invalid.
             * @param {jui.form.Field} this
             * @param {String} msg The validation message
             */
            /**
             * @event valid
             * Fires after the field has been validated with no errors.
             * @param {jui.form.Field} this
             */
            invalidClass: 'j-form-invalid',
            /**
             * @cfg {String} invalidText The error text to use when marking a field invalid and no message is provided
             * (defaults to 'The value in this field is invalid')
             */
            invalidText: 'The value in this field is invalid',
            /**
             * @cfg {String} focusClass The CSS class to use when the field receives focus (defaults to 'x-form-focus')
             */
            focusClass: 'j-form-focus',
            /**
             * @cfg {Boolean} preventMark
             * <tt>true</tt> to disable {@link #markInvalid marking the field invalid}.
             * Defaults to <tt>false</tt>.
             */
            /**
             * @cfg {String/Boolean} validationEvent The event that should initiate field validation. Set to false to disable
             automatic validation (defaults to 'keyup').
             */
            validationEvent: 'keyup',
            /**
             * @cfg {Boolean} validateOnBlur Whether the field should validate when it loses focus (defaults to true).
             */
            validateOnBlur: true,
            /**
             * @cfg {Number} validationDelay The length of time in milliseconds after user input begins until validation
             * is initiated (defaults to 250)
             */
            validationDelay: 250,
            /**
             * @cfg {String/Object} autoCreate <p>A {@link jui.DomHelper DomHelper} element spec, or true for a default
             * element spec. Used to create the {@link jui.Component#getEl Element} which will encapsulate this Component.
             * See <tt>{@link jui.Component#autoEl autoEl}</tt> for details.  Defaults to:</p>
             * <pre><code>{tag: 'input', type: 'text', size: '20', autocomplete: 'off'}</code></pre>
             */
            defaultAutoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off'},
            /**
             * @cfg {String} fieldClass The default CSS class for the field (defaults to 'x-form-field')
             */
            fieldClass: 'j-form-field',
            /**
             * @cfg {String} msgTarget<p>The location where the message text set through {@link #markInvalid} should display.
             * Must be one of the following values:</p>
             * <div class="mdetail-params"><ul>
             * <li><code>qtip</code> Display a quick tip containing the message when the user hovers over the field. This is the default.
             * <div class="subdesc"><b>{@link jui.QuickTips#init jui.QuickTips.init} must have been called for this setting to work.</b></div</li>
             * <li><code>title</code> Display the message in a default browser title attribute popup.</li>
             * <li><code>under</code> Add a block div beneath the field containing the error message.</li>
             * <li><code>side</code> Add an error icon to the right of the field, displaying the message in a popup on hover.</li>
             * <li><code>[element id]</code> Add the error message directly to the innerHTML of the specified element.</li>
             * </ul></div>
             */
            msgTarget: 'qtip',
            /**
             * @cfg {String} msgFx <b>Experimental</b> The effect used when displaying a validation message under the field
             * (defaults to 'normal').
             */
            msgFx: 'normal',
            /**
             * @cfg {Boolean} readOnly <tt>true</tt> to mark the field as readOnly in HTML
             * (defaults to <tt>false</tt>).
             * <br><p><b>Note</b>: this only sets the element's readOnly DOM attribute.
             * Setting <code>readOnly=true</code>, for example, will not disable triggering a
             * ComboBox or DateField; it gives you the option of forcing the user to choose
             * via the trigger without typing in the text box. To hide the trigger use
             * <code>{@link jui.form.TriggerField#hideTrigger hideTrigger}</code>.</p>
             */
            readOnly: false,
            /**
             * @cfg {Boolean} disabled True to disable the field (defaults to false).
             * <p>Be aware that conformant with the <a href="http://www.w3.org/TR/html401/interact/forms.html#h-17.12.1">HTML specification</a>,
             * disabled Fields will not be {@link jui.form.BasicForm#submit submitted}.</p>
             */
            disabled: false,
            /**
             * @cfg {Boolean} submitValue False to clear the name attribute on the field so that it is not submitted during a form post.
             * Defaults to <tt>true</tt>.
             */
            submitValue: true,

            // private
            isFormField: true,

            // private
            msgDisplay: '',

            // private
            hasFocus: false
        });
        jprotected({
            initComponent: function () {
                jsuper(this);
            },
            // private
            initValue: function () {
                if (this.value !== undefined) {
                    this.setValue(this.value);
                } else if (!$.isEmpty(this.el.dom.value) && this.el.dom.value != this.emptyText) {
                    this.setValue(this.el.dom.value);
                }
                this.originalValue = this.getValue();
            },
            // private
            afterRender: function () {
                jsuper(this);
                if (this.placeHolder !== undefined) {
                    this.el.attr("placeholder", this.placeHolder);
                }
                this.initEvents();
                this.initValue();

            },

            fireKey: function (e) {
                if (e.isSpecialKey()) {
                    this.fireEvent('specialkey', this, e);
                }
            },

            initEvents: function () {
                this.el.on('keypress', this.fireKey, this);
                this.el.on('focus', this.onFocus, this);
                this.el.on('blur', this.onBlur, this);
            },

            // private
            preFocus: $.noop,

            // private
            onFocus: function () {
                this.preFocus();
                if (this.focusClass) {
                    this.el.addClass(this.focusClass);
                }
                if (!this.hasFocus) {
                    this.hasFocus = true;
                    this.startValue = this.getValue();
                    this.fireEvent('focus', this);
                }
            },

            // private
            beforeBlur: $.noop,

            // private
            onBlur: function () {
                this.beforeBlur();
                if (this.focusClass) {
                    this.el.removeClass(this.focusClass);
                }
                this.hasFocus = false;
                if (this.validationEvent !== false && (this.validateOnBlur || this.validationEvent == 'blur')) {
                    this.validate();
                }
                var v = this.getValue();
                if (String(v) !== String(this.startValue)) {
                    this.fireEvent('change', this, v, this.startValue);
                }
                this.fireEvent('blur', this);
                this.postBlur();
            },

            // private
            postBlur: $.noop,


            /**
             * Gets the active error message for this field.
             * @return {String} Returns the active error message on the field, if there is no error, an empty string is returned.
             */
            getActiveError: function () {
                return this.activeError || '';
            },


            // private
            getMessageHandler: function () {
                return null;//jui.form.MessageTargets[this.msgTarget];
            },

            // private
            getErrorCt: function () {
                return this.el.findParent('.x-form-element', 5, true) || // use form element wrap if available
                    this.el.findParent('.x-form-field-wrap', 5, true);   // else direct field wrap
            },

            // Alignment for 'under' target
            alignErrorEl: function () {
                this.errorEl.setWidth(this.getErrorCt().getWidth(true) - 20);
            },

            // Alignment for 'side' target
            alignErrorIcon: function () {
                this.errorIcon.alignTo(this.el, 'tl-tr', [2, 0]);
            }
        });

        // publc method
        jpublic({
            getName: function () {
                return this.rendered && this.el.dom.name ?
                    this.el.dom.name : this.name || this.id || '';
            },

            // private
            onRender: function (ct, position) {
                if (!this.el) {
                    var cfg = this.getAutoCreate();
                    if (!cfg.name) {
                        cfg.name = this.name || this.id;
                    }
                    if (this.inputType) {
                        cfg.type = this.inputType;
                    }
                    this.autoEl = cfg;
                }
                jsuper(this);

                if (this.submitValue === false) {
                    this.el.dom().removeAttribute('name');
                }
                var type = this.el.dom().type;
                if (type) {
                    if (type == 'password') {
                        type = 'text';
                    }
                    this.el.addClass('j-form-' + type);
                }
                if (this.readOnly) {
                    this.setReadOnly(true);
                }
                if (this.tabIndex !== undefined) {
                    this.el.dom().setAttribute('tabIndex', this.tabIndex);
                }

                this.el.addClass(this.fieldClass);
            },

            // private
            getItemCt: function () {
                return this.itemCt;
            },
            /**
             * <p>Returns true if the value of this Field has been changed from its original value.
             * Will return false if the field is disabled or has not been rendered yet.</p>
             * <p>Note that if the owning {@link jui.form.BasicForm form} was configured with
             * {@link jui.form.BasicForm}.{@link jui.form.BasicForm#trackResetOnLoad trackResetOnLoad}
             * then the <i>original value</i> is updated when the values are loaded by
             * {@link jui.form.BasicForm}.{@link jui.form.BasicForm#setValues setValues}.</p>
             * @return {Boolean} True if this field has been changed from its original value (and
             * is not disabled), false otherwise.
             */
            isDirty: function () {
                if (this.disabled || !this.rendered) {
                    return false;
                }
                return String(this.getValue()) !== String(this.originalValue);
            },

            /**
             * Sets the read only state of this field.
             * @param {Boolean} readOnly Whether the field should be read only.
             */
            setReadOnly: function (readOnly) {
                if (this.rendered) {
                    this.el.dom.readOnly = readOnly;
                }
                this.readOnly = readOnly;
            },
            reset: function () {
                this.setValue(this.originalValue);
                this.clearInvalid();
            },
            /**
             * Returns the raw data value which may or may not be a valid, defined value.  To return a normalized value see {@link #getValue}.
             * @return {Mixed} value The field value
             */
            getRawValue: function () {
                var v = this.rendered ? this.el.val() : this.value;
                if (v === this.emptyText) {
                    v = '';
                }
                return v;
            },

            /**
             * Returns the normalized data value (undefined or emptyText will be returned as '').  To return the raw value see {@link #getRawValue}.
             * @return {Mixed} value The field value
             */
            getValue: function () {
                if (!this.rendered) {
                    return this.value;
                }
                var v = this.el.val();
                if (v === this.emptyText || v === undefined) {
                    v = '';
                }
                return v;
            },

            /**
             * Sets the underlying DOM field's value directly, bypassing validation.  To set the value with validation see {@link #setValue}.
             * @param {String} v The value to set
             * @return {String} value The field value that is set
             */
            setRawValue: function (v) {
                return this.rendered ? (this.el.dom().value = ($.isEmpty(v) ? '' : v)) : '';
            },

            /**
             * Sets a data value into the field and validates it.  To set the value directly without validation see {@link #setRawValue}.
             */
            setValue: function (v) {
                this.value = v;
                if (this.rendered) {
                    this.el.val(($.isEmpty(v) ? '' : v));
                    this.validate();
                }
                return this;
            },

            // private, does not work for all fields
            append: function (v) {
                this.setValue([this.getValue(), v].join(''));
            },
            /**
             * <p>Display an error message associated with this field, using {@link #msgTarget} to determine how to
             * display the message and applying {@link #invalidClass} to the field's UI element.</p>
             * <p><b>Note</b>: this method does not cause the Field's {@link #validate} method to return <code>false</code>
             * if the value does <i>pass</i> validation. So simply marking a Field as invalid will not prevent
             * submission of forms submitted with the {@link jui.form.Action.Submit#clientValidation} option set.</p>
             * {@link #isValid invalid}.
             * @param {String} msg (optional) The validation message (defaults to {@link #invalidText})
             */
            markInvalid: function (msg) {
                if (!this.rendered || this.preventMark) { // not rendered
                    return;
                }
                msg = msg || this.invalidText;

                var mt = this.getMessageHandler();
                if (mt) {
                    mt.mark(this, msg);
                } else if (this.msgTarget) {
                    this.el.addClass(this.invalidClass);
                    var t = $.dom(this.msgTarget);
                    if (t) {
                        t.innerHTML = msg;
                        t.style.display = this.msgDisplay;
                    }
                }
                this.activeError = msg;
                this.fireEvent('invalid', this, msg);
            },

            /**
             * Clear any invalid styles/messages for this field
             */
            clearInvalid: function () {
                if (!this.rendered || this.preventMark) { // not rendered
                    return;
                }
                this.el.removeClass(this.invalidClass);
                var mt = this.getMessageHandler();
                if (mt) {
                    mt.clear(this);
                } else if (this.msgTarget) {
                    this.el.removeClass(this.invalidClass);
                    var t = $.dom(this.msgTarget);
                    if (t) {
                        t.innerHTML = '';
                        t.style.display = 'none';
                    }
                }
                delete this.activeError;
                this.fireEvent('valid', this);
            },

            /**
             * Returns whether or not the field value is currently valid by
             * {@link #validateValue validating} the {@link #processValue processed value}
             * of the field. <b>Note</b>: {@link #disabled} fields are ignored.
             * @param {Boolean} preventMark True to disable marking the field invalid
             * @return {Boolean} True if the value is valid, else false
             */
            isValid: function (preventMark) {
                if (this.disabled) {
                    return true;
                }
                var restore = this.preventMark;
                this.preventMark = preventMark === true;
                var v = this.validateValue(this.processValue(this.getRawValue()));
                this.preventMark = restore;
                return v;
            },

            /**
             * Validates the field value
             * @return {Boolean} True if the value is valid, else false
             */
            validate: function () {
                if (this.disabled || this.validateValue(this.processValue(this.getRawValue()))) {
                    this.clearInvalid();
                    return true;
                }
                return false;
            },

            /**
             * This method should only be overridden if necessary to prepare raw values
             * for validation (see {@link #validate} and {@link #isValid}).  This method
             * is expected to return the processed value for the field which will
             * be used for validation (see validateValue method).
             * @param {Mixed} value
             */
            processValue: function (value) {
                return value;
            },

            /**
             * @private
             * Subclasses should provide the validation implementation by overriding this
             * @param {Mixed} value
             */
            validateValue: function (value) {
                return true;
            }
        });

    });
});