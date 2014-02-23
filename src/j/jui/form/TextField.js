/**
 * @pakcage jui.form
 */
'package jui.form'.j(function () {
    /**
     * @class jui.form.TextField
     * @extends jui.form.Field
     */
    'class TextField extends Field'.j(function () {

        jprotected({
            /**
             * @cfg {String} vtypeText A custom error message to display in place of the default message provided
             * for the <b><code>{@link #vtype}</code></b> currently set for this field (defaults to <tt>''</tt>).  <b>Note</b>:
             * only applies if <b><code>{@link #vtype}</code></b> is set, else ignored.
             */
            /**
             * @cfg {RegExp} stripCharsRe A JavaScript RegExp object used to strip unwanted content from the value
             * before validation (defaults to <tt>null</tt>).
             */
            /**
             * @cfg {Boolean} grow <tt>true</tt> if this field should automatically grow and shrink to its content
             * (defaults to <tt>false</tt>)
             */
            grow: false,
            /**
             * @cfg {Number} growMin The minimum width to allow when <code><b>{@link #grow}</b> = true</code> (defaults
             * to <tt>30</tt>)
             */
            growMin: 30,
            /**
             * @cfg {Number} growMax The maximum width to allow when <code><b>{@link #grow}</b> = true</code> (defaults
             * to <tt>800</tt>)
             */
            growMax: 800,
            /**
             * @cfg {String} vtype A validation type name as defined in {@link Ext.form.VTypes} (defaults to <tt>null</tt>)
             */
            vtype: null,
            /**
             * @cfg {RegExp} maskRe An input mask regular expression that will be used to filter keystrokes that do
             * not match (defaults to <tt>null</tt>)
             */
            maskRe: null,
            /**
             * @cfg {Boolean} disableKeyFilter Specify <tt>true</tt> to disable input keystroke filtering (defaults
             * to <tt>false</tt>)
             */
            disableKeyFilter: false,
            /**
             * @cfg {Boolean} allowBlank Specify <tt>false</tt> to validate that the value's length is > 0 (defaults to
             * <tt>true</tt>)
             */
            allowBlank: true,
            /**
             * @cfg {Number} minLength Minimum input field length required (defaults to <tt>0</tt>)
             */
            minLength: 0,
            /**
             * @cfg {Number} maxLength Maximum input field length allowed by validation (defaults to Number.MAX_VALUE).
             * This behavior is intended to provide instant feedback to the user by improving usability to allow pasting
             * and editing or overtyping and back tracking. To restrict the maximum number of characters that can be
             * entered into the field use <tt><b>{@link jui.form.Field#autoCreate autoCreate}</b></tt> to add
             * any attributes you want to a field, for example:<pre><code>
             var myField = new jui.form.NumberField({
                id: 'mobile',
                anchor:'90%',
                fieldLabel: 'Mobile',
                maxLength: 16, // for validation
                autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '10'}
            });
             </code></pre>
             */
            maxLength: Number.MAX_VALUE,
            /**
             * @cfg {String} minLengthText Error text to display if the <b><tt>{@link #minLength minimum length}</tt></b>
             * validation fails (defaults to <tt>'The minimum length for this field is {minLength}'</tt>)
             */
            minLengthText: 'The minimum length for this field is {0}',
            /**
             * @cfg {String} maxLengthText Error text to display if the <b><tt>{@link #maxLength maximum length}</tt></b>
             * validation fails (defaults to <tt>'The maximum length for this field is {maxLength}'</tt>)
             */
            maxLengthText: 'The maximum length for this field is {0}',
            /**
             * @cfg {Boolean} selectOnFocus <tt>true</tt> to automatically select any existing field text when the field
             * receives input focus (defaults to <tt>false</tt>)
             */
            selectOnFocus: false,
            /**
             * @cfg {String} blankText The error text to display if the <b><tt>{@link #allowBlank}</tt></b> validation
             * fails (defaults to <tt>'This field is required'</tt>)
             */
            blankText: 'This field is required',
            /**
             * @cfg {Function} validator
             * <p>A custom validation function to be called during field validation ({@link #validateValue})
             * (defaults to <tt>null</tt>). If specified, this function will be called first, allowing the
             * developer to override the default validation process.</p>
             * <br><p>This function will be passed the following Parameters:</p>
             * <div class="mdetail-params"><ul>
             * <li><code>value</code>: <i>Mixed</i>
             * <div class="sub-desc">The current field value</div></li>
             * </ul></div>
             * <br><p>This function is to Return:</p>
             * <div class="mdetail-params"><ul>
             * <li><code>true</code>: <i>Boolean</i>
             * <div class="sub-desc"><code>true</code> if the value is valid</div></li>
             * <li><code>msg</code>: <i>String</i>
             * <div class="sub-desc">An error message if the value is invalid</div></li>
             * </ul></div>
             */
            validator: null,
            /**
             * @cfg {RegExp} regex A JavaScript RegExp object to be tested against the field value during validation
             * (defaults to <tt>null</tt>). If the test fails, the field will be marked invalid using
             * <b><tt>{@link #regexText}</tt></b>.
             */
            regex: null,
            /**
             * @cfg {String} regexText The error text to display if <b><tt>{@link #regex}</tt></b> is used and the
             * test fails during validation (defaults to <tt>''</tt>)
             */
            regexText: ''

        });

        jprotected({
            initComponent: function () {
                jsuper(this);
            },

            // private
            initEvents: function () {
                jsuper(this);
                if (this.validationEvent == 'keyup') {
                    this.validationTask = $.delay(this.validate, this);
                    this.el.on('keyup', this.filterValidation, this);
                }
                else if (this.validationEvent !== false && this.validationEvent != 'blur') {
                    this.el.on(this.el, this.validationEvent, this.validate, this, {buffer: this.validationDelay});
                }
                if (this.selectOnFocus) {
                    this.el.on('mousedown', this.onMouseDown, this);
                }
                if (this.maskRe/* || (this.vtype && this.disableKeyFilter !== true && (this.maskRe = Ext.form.VTypes[this.vtype + 'Mask']))*/) {
                    this.el.on('keypress', this.filterKeys, this);
                }
                if (this.grow) {
                    //this.mon(this.el, 'keyup', this.onKeyUpBuffered, this, {buffer: 50});
                    this.el.on('click', this.autoSize, this);
                }
                /*if (this.enableKeyEvents) {
                 this.mon(this.el, {
                 scope: this,
                 keyup: this.onKeyUp,
                 keydown: this.onKeyDown,
                 keypress: this.onKeyPress
                 });
                 }*/
            },

            onMouseDown: function (e) {
                /*if (!this.hasFocus) {
                 this.mon(this.el, 'mouseup', Ext.emptyFn, this, { single: true, preventDefault: true });
                 }*/
            },
            //private
            onDisable: function () {
                jsuper(this);
            },

            //private
            onEnable: function () {
                jsuper(this);
            },

            // private
            onKeyUpBuffered: function (e) {
                if (this.doAutoSize(e)) {
                    this.autoSize();
                }
            },

            // private
            doAutoSize: function (e) {
                return !e.isNavKeyPress();
            },

            // private
            onKeyUp: function (e) {
                this.fireEvent('keyup', this, e);
            },

            // private
            onKeyDown: function (e) {
                this.fireEvent('keydown', this, e);
            },

            // private
            onKeyPress: function (e) {
                this.fireEvent('keypress', this, e);
            },
            // private
            preFocus: function () {
                var el = this.el;
                if (this.selectOnFocus) {
                    el.dom.select();
                }
            },

            // private
            postBlur: function () {
            },

            // private
            filterKeys: function (e) {
                if (e.ctrlKey) {
                    return;
                }
                var k = e.getKey();
                if (e.isNavKeyPress() || k == e.BACKSPACE || (k == e.DELETE && e.button == -1)) {
                    return;
                }
                var cc = String.fromCharCode(e.getCharCode());
                /*if (!Ext.isGecko && e.isSpecialKey() && !cc) {
                 return;
                 }*/
                if (!this.maskRe.test(cc)) {
                    e.stopEvent();
                }
            },

            onDestroy: function () {
                if (this.validationTask) {
                    this.validationTask.cancel();
                    this.validationTask = null;
                }
                jsuper(this);
            }

        });

        // publc method
        jpublic({
            processValue: function (value) {
                if (this.stripCharsRe) {
                    var newValue = value.replace(this.stripCharsRe, '');
                    if (newValue !== value) {
                        this.setRawValue(newValue);
                        return newValue;
                    }
                }
                return value;
            },

            filterValidation: function (e) {
                if (!e.isNavKeyPress()) {
                    this.validationTask.delay(this.validationDelay);
                }
            },


            /**
             * Resets the current field value to the originally-loaded value and clears any validation messages.
             * original value was blank.
             */
            reset: function () {
                jsuper(this);
            },

            setValue: function (v) {
                jsuper(this);
                this.autoSize();
                return this;
            },
            validateValue: function (value) {
                if ($.isFunction(this.validator)) {
                    var msg = this.validator(value);
                    if (msg !== true) {
                        this.markInvalid(msg);
                        return false;
                    }
                }
                if (value.length < 1) { // if it's blank
                    if (this.allowBlank) {
                        this.clearInvalid();
                        return true;
                    } else {
                        this.markInvalid(this.blankText);
                        return false;
                    }
                }
                if (value.length < this.minLength) {
                    this.markInvalid(String.format(this.minLengthText, this.minLength));
                    return false;
                }
                if (value.length > this.maxLength) {
                    this.markInvalid(String.format(this.maxLengthText, this.maxLength));
                    return false;
                }
                /*if (this.vtype) {
                 var vt = Ext.form.VTypes;
                 if (!vt[this.vtype](value, this)) {
                 this.markInvalid(this.vtypeText || vt[this.vtype + 'Text']);
                 return false;
                 }
                 }*/
                if (this.regex && !this.regex.test(value)) {
                    this.markInvalid(this.regexText);
                    return false;
                }
                return true;
            },

            /**
             * Selects text in this field
             * @param {Number} start (optional) The index where the selection should start (defaults to 0)
             * @param {Number} end (optional) The index where the selection should end (defaults to the text length)
             */
            selectText: function (start, end) {
                var v = this.getRawValue();
                var doFocus = false;
                if (v.length > 0) {
                    start = start === undefined ? 0 : start;
                    end = end === undefined ? v.length : end;
                    var d = this.el.dom;
                    if (d.setSelectionRange) {
                        d.setSelectionRange(start, end);
                    } else if (d.createTextRange) {
                        var range = d.createTextRange();
                        range.moveStart('character', start);
                        range.moveEnd('character', end - v.length);
                        range.select();
                    }
                    doFocus = true;
                } else {
                    doFocus = true;
                }
                if (doFocus) {
                    this.focus();
                }
            },

            /**
             * Automatically grows the field to accomodate the width of the text up to the maximum field width allowed.
             * This only takes effect if <tt><b>{@link #grow}</b> = true</tt>, and fires the {@link #autosize} event.
             */
            autoSize: function () {
                if (!this.grow || !this.rendered) {
                    return;
                }
                /*if (!this.metrics) {
                 this.metrics = Ext.util.TextMetrics.createInstance(this.el);
                 }*/
                var el = this.el;
                var v = el.dom.value;
                var d = document.createElement('div');
                d.appendChild(document.createTextNode(v));
                v = d.innerHTML;
                $.remove(d);
                d = null;
                v += '&#160;';
                var w = Math.min(this.growMax, Math.max(this.metrics.getWidth(v) + /* add extra padding */ 10, this.growMin));
                this.el.setWidth(w);
                this.fireEvent('autosize', this, w);
            }
        });

    }, 'textfield');
});