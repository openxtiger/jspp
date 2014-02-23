/**
 * @pakcage jui
 * @module jui
 */
'package jui'.j(function () {

    /**
     * @class jui.DataView
     * @class dataview
     * @extends jui.Component
     */
    'class DataView extends jui.Component'.j(function (csuper, cob) {
        jprotected({
            /**
             * @event beforeclick
             * Fires before a click is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            /**
             * @event click
             * Fires when a template node is clicked.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            /**
             * @event mouseenter
             * Fires when the mouse enters a template node. trackOver:true or an overClass must be set to enable this event.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            /**
             * @event mouseleave
             * Fires when the mouse leaves a template node. trackOver:true or an overClass must be set to enable this event.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            /**
             * @event containerclick
             * Fires when a click occurs and it is not on a template node.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            /**
             * @event dblclick
             * Fires when a template node is double clicked.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            /**
             * @event contextmenu
             * Fires when a template node is right clicked.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            /**
             * @event containercontextmenu
             * Fires when a right click occurs that is not on a template node.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            /**
             * @event selectionchange
             * Fires when the selected nodes change.
             * @param {Ext.DataView} this
             * @param {Array} selections Array of the selected nodes
             */

            /**
             * @event beforeselect
             * Fires before a selection is made. If any handlers return false, the selection is cancelled.
             * @param {Ext.DataView} this
             * @param {HTMLElement} node The node to be selected
             * @param {Array} selections Array of currently selected nodes
             */
            /**
             * @cfg {String/Array} tpl
             * The HTML fragment or an array of fragments that will make up the template used by this DataView.  This should
             * be specified in the same format expected by the constructor of {@link Ext.XTemplate}.
             */
            /**
             * @cfg {Ext.data.Store} store
             * The {@link Ext.data.Store} to binding this DataView to.
             */
            /**
             * @cfg {String} itemSelector
             * <b>This is a required setting</b>. A simple CSS selector (e.g. <tt>div.some-class</tt> or
             * <tt>span:first-child</tt>) that will be used to determine what nodes this DataView will be
             * working with.
             */
            /**
             * @cfg {Boolean} multiSelect
             * True to allow selection of more than one item at a time, false to allow selection of only a single item
             * at a time or no selection at all, depending on the value of {@link #singleSelect} (defaults to false).
             */
            /**
             * @cfg {Boolean} singleSelect
             * True to allow selection of exactly one item at a time, false to allow no selection at all (defaults to false).
             * Note that if {@link #multiSelect} = true, this value will be ignored.
             */
            /**
             * @cfg {Boolean} simpleSelect
             * True to enable multiselection by clicking on multiple items without requiring the user to hold Shift or Ctrl,
             * false to force the user to hold Ctrl or Shift to select more than on item (defaults to false).
             */
            /**
             * @cfg {String} overClass
             * A CSS class to apply to each item in the view on mouseover (defaults to undefined).
             */
            /**
             * @cfg {String} loadingText
             * A string to display during data load operations (defaults to undefined).  If specified, this text will be
             * displayed in a loading div and the view's contents will be cleared while loading, otherwise the view's
             * contents will continue to display normally until the new data is loaded and the contents are replaced.
             */
            /**
             * @cfg {String} selectedClass
             * A CSS class to apply to each selected item in the view (defaults to 'x-view-selected').
             */
            selectedClass: "j-view-selected",
            /**
             * @cfg {String} emptyText
             * The text to display in the view when there is no data to display (defaults to '').
             */
            emptyText: "",

            /**
             * @cfg {Boolean} deferEmptyText True to defer emptyText being applied until the store's first load
             */
            deferEmptyText: true,
            /**
             * @cfg {Boolean} trackOver True to enable mouseenter and mouseleave events
             */
            trackOver: false,

            /**
             * @cfg {Boolean} blockRefresh Set this to true to ignore datachanged events on the bound store. This is useful if
             * you wish to provide custom transition animations via a plugin (defaults to false)
             */
            blockRefresh: false,

            //private
            last: false,

            // private
            initComponent: function () {
                jsuper(this);
                if ($.isString(this.tpl) || $.isArray(this.tpl)) {
                    this.tpl = $.tpl(this.tpl);
                }

                /*this.store = Ext.StoreMgr.lookup(this.store);
                 this.all = new Ext.CompositeElementLite();
                 this.selected = new Ext.CompositeElementLite();*/
            },

            // private
            afterRender: function () {
                jsuper(this);
                this.getTemplateTarget().on({
                    "click": this.onClick,
                    "dblclick": this.onDblClick,
                    "contextmenu": this.onContextMenu,
                    scope: this
                });

                if (this.overClass || this.trackOver) {
                    this.getTemplateTarget().on({
                        "mouseover": this.onMouseOver,
                        "mouseout": this.onMouseOut,
                        scope: this
                    });
                }

                if (this.jde) {
                    this.bindJDE(this.jde, true);
                }
            },

            /**
             * Refreshes the view by reloading the data from the store and re-rendering the template.
             */
            refresh: function () {
                this.clearSelections(false, true);
                var el = this.getTemplateTarget();
                el.html("");
                var records = this.jde.get();
                if (records.length < 1) {
                    if (!this.deferEmptyText || this.hasSkippedEmptyText) {
                        el.html(this.emptyText);
                    }
                    //this.all.clear();
                } else {
                    this.tpl.overwrite(el, this.prepareData(records));
                    //this.all.fill(Ext.query(this.itemSelector, el.dom));
                    //this.updateIndexes(0);
                }
                this.hasSkippedEmptyText = true;
            },

            getTemplateTarget: function () {
                return this.el;
            },

            /**
             * Function which can be overridden to provide custom formatting for each Record that is used by this
             * DataView's {@link #tpl template} to render each node.
             * @param {Array/Object} data The raw data object that was used to create the Record.
             * @param {Number} recordIndex the index number of the Record being prepared for rendering.
             * @param {Record} record The Record being prepared for rendering.
             * @return {Array/Object} The formatted data in a format expected by the internal {@link #tpl template}'s overwrite() method.
             * (either an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'}))
             */
            prepareData: function (data) {
                return data;
            },

            // private
            bufferRender: function (records) {
                var div = document.createElement('div');
                this.tpl.overwrite(div, this.collectData(records));
                return Ext.query(this.itemSelector, div);
            },

            // private
            onUpdate: function (ds, record) {
                var index = this.store.indexOf(record);
                if (index > -1) {
                    var sel = this.isSelected(index);
                    var original = this.all.elements[index];
                    var node = this.bufferRender([record], index)[0];

                    this.all.replaceElement(index, node, true);
                    if (sel) {
                        this.selected.replaceElement(original, node);
                        this.all.item(index).addClass(this.selectedClass);
                    }
                    this.updateIndexes(index, index);
                }
            },

            // private
            onAdd: function (records, index) {
                console.log(records);
                /*if (this.all.getCount() === 0) {
                 this.refresh();
                 return;
                 }
                 var nodes = this.bufferRender(records, index), n, a = this.all.elements;
                 if (index < this.all.getCount()) {
                 n = this.all.item(index).insertSibling(nodes, 'before', true);
                 a.splice.apply(a, [index, 0].concat(nodes));
                 } else {
                 n = this.all.last().insertSibling(nodes, 'after', true);
                 a.push.apply(a, nodes);
                 }
                 this.updateIndexes(index);*/
                this.refresh();
            },

            // private
            onRemove: function (ds, record, index) {
                /*this.deselect(index);
                 this.all.removeElement(index, true);
                 this.updateIndexes(index);
                 if (this.store.getCount() === 0) {

                 }*/
                this.refresh();
            },

            /**
             * Refreshes an individual node's data from the store.
             * @param {Number} index The item's data index in the store
             */
            refreshNode: function (index) {
                this.onUpdate(this.store, this.store.getAt(index));
            },

            // private
            updateIndexes: function (startIndex, endIndex) {
                var ns = this.all.elements;
                startIndex = startIndex || 0;
                endIndex = endIndex || ((endIndex === 0) ? 0 : (ns.length - 1));
                for (var i = startIndex; i <= endIndex; i++) {
                    ns[i].viewIndex = i;
                }
            },

            /**
             * Returns the store associated with this DataView.
             * @return {Ext.data.Store} The store
             */
            getJDE: function () {
                return this.jde;
            },

            /**
             * Changes the data store bound to this view and refreshes it.
             * @param {Store} store The store to binding to this view
             */
            bindJDE: function (jde, initial) {
                if (!initial && this.jde) {
                    if (jde !== this.jde && this.jde.autoDestroy) {
                        this.jde.destroy();
                    } else {
                        this.jde.off("beforeload", this.onBeforeLoad, this);
                        this.jde.off("datachanged", this.onDataChanged, this);
                        this.jde.off("docinsert", this.onAdd, this);
                        this.jde.off("doccommit", this.onRemove, this);
                        this.jde.off("docupdate", this.onUpdate, this);
                        this.jde.off("clear", this.refresh, this);
                    }
                    if (!jde) {
                        this.store = null;
                    }
                }
                if (jde) {
                    this.jde = jde;
                    this.jde.on("beforeload", this.onBeforeLoad, this);
                    this.jde.on("datachanged", this.onDataChanged, this);
                    this.jde.on("docinsert", this.onAdd, this);
                    this.jde.on("doccommit", this.onRemove, this);
                    this.jde.on("docupdate", this.onUpdate, this);
                    //this.jde.on("clear", this.refresh, this);
                    this.refresh();
                }

            },

            /**
             * @private
             * Calls this.refresh if this.blockRefresh is not true
             */
            onDataChanged: function () {
                if (this.blockRefresh !== true) {
                    this.refresh.apply(this, arguments);
                }
            },

            /**
             * Returns the template node the passed child belongs to, or null if it doesn't belong to one.
             * @param {HTMLElement} node
             * @return {HTMLElement} The template node
             */
            findItemFromChild: function (node) {
                return Ext.fly(node).findParent(this.itemSelector, this.getTemplateTarget());
            },

            // private
            onClick: function (e) {
                var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
                if (item) {
                    var index = this.indexOf(item);
                    if (this.onItemClick(item, index, e) !== false) {
                        this.fireEvent("click", this, index, item, e);
                    }
                } else {
                    if (this.fireEvent("containerclick", this, e) !== false) {
                        this.onContainerClick(e);
                    }
                }
            },

            onContainerClick: function (e) {
                this.clearSelections();
            },

            // private
            onContextMenu: function (e) {
                var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
                if (item) {
                    this.fireEvent("contextmenu", this, this.indexOf(item), item, e);
                } else {
                    this.fireEvent("containercontextmenu", this, e);
                }
            },

            // private
            onDblClick: function (e) {
                var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
                if (item) {
                    this.fireEvent("dblclick", this, this.indexOf(item), item, e);
                }
            },

            // private
            onMouseOver: function (e) {
                var item = e.getTarget(this.itemSelector, this.getTemplateTarget());
                if (item && item !== this.lastItem) {
                    this.lastItem = item;
                    $(item).addClass(this.overClass);
                    //this.fireEvent("mouseenter", this, this.indexOf(item), item, e);
                }
            },

            // private
            onMouseOut: function (e) {
                if (this.lastItem) {
                    if (!e.within(this.lastItem, true, true)) {
                        $(this.lastItem).removeClass(this.overClass);
                        //this.fireEvent("mouseleave", this, this.indexOf(this.lastItem), this.lastItem, e);
                        delete this.lastItem;
                    }
                }
            },

            // private
            onItemClick: function (item, index, e) {
                if (this.fireEvent("beforeclick", this, index, item, e) === false) {
                    return false;
                }
                if (this.multiSelect) {
                    this.doMultiSelection(item, index, e);
                    e.preventDefault();
                } else if (this.singleSelect) {
                    this.doSingleSelection(item, index, e);
                    e.preventDefault();
                }
                return true;
            },

            // private
            doSingleSelection: function (item, index, e) {
                if (e.ctrlKey && this.isSelected(index)) {
                    this.deselect(index);
                } else {
                    this.select(index, false);
                }
            },

            // private
            doMultiSelection: function (item, index, e) {
                if (e.shiftKey && this.last !== false) {
                    var last = this.last;
                    this.selectRange(last, index, e.ctrlKey);
                    this.last = last; // reset the last
                } else {
                    if ((e.ctrlKey || this.simpleSelect) && this.isSelected(index)) {
                        this.deselect(index);
                    } else {
                        this.select(index, e.ctrlKey || e.shiftKey || this.simpleSelect);
                    }
                }
            },

            /**
             * Gets the number of selected nodes.
             * @return {Number} The node count
             */
            getSelectionCount: function () {
                return this.selected.getCount();
            },

            /**
             * Gets the currently selected nodes.
             * @return {Array} An array of HTMLElements
             */
            getSelectedNodes: function () {
                return this.selected.elements;
            },

            /**
             * Gets the indexes of the selected nodes.
             * @return {Array} An array of numeric indexes
             */
            getSelectedIndexes: function () {
                var indexes = [], s = this.selected.elements;
                for (var i = 0, len = s.length; i < len; i++) {
                    indexes.push(s[i].viewIndex);
                }
                return indexes;
            },

            /**
             * Gets an array of the selected records
             * @return {Array} An array of {@link Ext.data.Record} objects
             */
            getSelectedRecords: function () {
                var r = [], s = this.selected.elements;
                for (var i = 0, len = s.length; i < len; i++) {
                    r[r.length] = this.store.getAt(s[i].viewIndex);
                }
                return r;
            },

            /**
             * Gets an array of the records from an array of nodes
             * @param {Array} nodes The nodes to evaluate
             * @return {Array} records The {@link Ext.data.Record} objects
             */
            getRecords: function (nodes) {
                var r = [], s = nodes;
                for (var i = 0, len = s.length; i < len; i++) {
                    r[r.length] = this.store.getAt(s[i].viewIndex);
                }
                return r;
            },

            /**
             * Gets a record from a node
             * @param {HTMLElement} node The node to evaluate
             * @return {Record} record The {@link Ext.data.Record} object
             */
            getRecord: function (node) {
                return this.store.getAt(node.viewIndex);
            },

            /**
             * Clears all selections.
             * @param {Boolean} suppressEvent (optional) True to skip firing of the selectionchange event
             */
            clearSelections: function (suppressEvent, skipUpdate) {
                /*if ((this.multiSelect || this.singleSelect) && this.selected.getCount() > 0) {
                 if (!skipUpdate) {
                 this.selected.removeClass(this.selectedClass);
                 }
                 this.selected.clear();
                 this.last = false;
                 if (!suppressEvent) {
                 this.fireEvent("selectionchange", this, this.selected.elements);
                 }
                 }*/
            },

            /**
             * Returns true if the passed node is selected, else false.
             * @param {HTMLElement/Number} node The node or node index to check
             * @return {Boolean} True if selected, else false
             */
            isSelected: function (node) {
                return this.selected.contains(this.getNode(node));
            },

            /**
             * Deselects a node.
             * @param {HTMLElement/Number} node The node to deselect
             */
            deselect: function (node) {
                if (this.isSelected(node)) {
                    node = this.getNode(node);
                    this.selected.removeElement(node);
                    if (this.last == node.viewIndex) {
                        this.last = false;
                    }
                    $(node).removeClass(this.selectedClass);
                    this.fireEvent("selectionchange", this, this.selected.elements);
                }
            },

            /**
             * Selects a set of nodes.
             * @param {Array/HTMLElement/String/Number} nodeInfo An HTMLElement template node, index of a template node,
             * id of a template node or an array of any of those to select
             * @param {Boolean} keepExisting (optional) true to keep existing selections
             * @param {Boolean} suppressEvent (optional) true to skip firing of the selectionchange vent
             */
            select: function (nodeInfo, keepExisting, suppressEvent) {
                if ($.isArray(nodeInfo)) {
                    if (!keepExisting) {
                        this.clearSelections(true);
                    }
                    for (var i = 0, len = nodeInfo.length; i < len; i++) {
                        this.select(nodeInfo[i], true, true);
                    }
                    if (!suppressEvent) {
                        this.fireEvent("selectionchange", this, this.selected.elements);
                    }
                } else {
                    var node = this.getNode(nodeInfo);
                    if (!keepExisting) {
                        this.clearSelections(true);
                    }
                    if (node && !this.isSelected(node)) {
                        if (this.fireEvent("beforeselect", this, node, this.selected.elements) !== false) {
                            $.fly(node).addClass(this.selectedClass);
                            this.selected.add(node);
                            this.last = node.viewIndex;
                            if (!suppressEvent) {
                                this.fireEvent("selectionchange", this, this.selected.elements);
                            }
                        }
                    }
                }
            },

            /**
             * Selects a range of nodes. All nodes between start and end are selected.
             * @param {Number} start The index of the first node in the range
             * @param {Number} end The index of the last node in the range
             * @param {Boolean} keepExisting (optional) True to retain existing selections
             */
            selectRange: function (start, end, keepExisting) {
                if (!keepExisting) {
                    this.clearSelections(true);
                }
                this.select(this.getNodes(start, end), true);
            },

            /**
             * Gets a template node.
             * @param {HTMLElement/String/Number} nodeInfo An HTMLElement template node, index of a template node or the id of a template node
             * @return {HTMLElement} The node or null if it wasn't found
             */
            getNode: function (nodeInfo) {
                if ($.isString(nodeInfo)) {
                    return document.getElementById(nodeInfo);
                } else if ($.isNumber(nodeInfo)) {
                    return this.all.elements[nodeInfo];
                }
                return nodeInfo;
            },

            /**
             * Gets a range nodes.
             * @param {Number} start (optional) The index of the first node in the range
             * @param {Number} end (optional) The index of the last node in the range
             * @return {Array} An array of nodes
             */
            getNodes: function (start, end) {
                var ns = this.all.elements;
                start = start || 0;
                end = !$.isDefined(end) ? Math.max(ns.length - 1, 0) : end;
                var nodes = [], i;
                if (start <= end) {
                    for (i = start; i <= end && ns[i]; i++) {
                        nodes.push(ns[i]);
                    }
                } else {
                    for (i = start; i >= end && ns[i]; i--) {
                        nodes.push(ns[i]);
                    }
                }
                return nodes;
            },

            /**
             * Finds the index of the passed node.
             * @param {HTMLElement/String/Number} nodeInfo An HTMLElement template node, index of a template node or the id of a template node
             * @return {Number} The index of the node or -1
             */
            indexOf: function (node) {
                node = this.getNode(node);
                if ($.isNumber(node.viewIndex)) {
                    return node.viewIndex;
                }
                return this.all.indexOf(node);
            },

            // private
            onBeforeLoad: function () {
                if (this.loadingText) {
                    this.clearSelections(false, true);
                    this.getTemplateTarget().update('<div class="loading-indicator">' + this.loadingText + '</div>');
                    this.all.clear();
                }
            },

            onDestroy: function () {
                this.all.clear();
                this.selected.clear();
                jsuper(this);
                this.bindJDE(null);
            }
        });

    }, 'dataview');

});