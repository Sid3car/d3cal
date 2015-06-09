/**
 * Append content to a table without having to deal with the markup.
 *
 * Table should have columns which are named with the "data-name" attribute.
 *
 * @module table-append.js
 */

(function($) {

	/**
	 * New TableAppend constructor
	 */
	var TableAppend = function() {
		this._initDefaults();
		this.initialize.apply(this, arguments);
	};

	/**
	 * TableAppend functionality definitions
	 * @type {Object}
	 */
	TableAppend.prototype = {

		/**
		 * Initialize the append
		 * @param {Object} el
		 * @param {Object} data
		 */
		initialize: function(el, data) {
			this.el = el;
			this._append(data);
		},


		/**
		 * Set the default parameters (fixes clobbering prototypes by accident)
		 */
		_initDefaults: function() {
			this.el = null;
			this._body = null;
			this._columns = null;
		},


		/**
		 * Append data to the table
		 */
		_append: function(data) {

			this._detectColumns();
			this._detectBody();

			if (data instanceof Array) {

				var i = 0,
					len = data.length;

				for (i; i < len; i++) {
					this._appendRow(data[i]);
				}
			}
			else {
				this._appendRow(data);
			}
		},


		/**
		 * Append a row to the body
		 * @param {Object} data A hash of key/value data items
		 */
		_appendRow: function(data) {
			this._body.append(this._buildRow(data));
		},


		/**
		 * Build a row element with data properly placed in tds
		 * @param {Object} data
		 */
		_buildRow: function(data) {

			var row = document.createElement('tr'),
				i = 0,
				len = this._columns.length;

			for (i; i < len; i++) {
				row.innerHTML += '<td>' + (data[this._columns[i]] ? data[this._columns[i]] : '') + '</td>';
			}

			return row;
		},


		/**
		 * Detect if there is a table body or if we're just adding to the base table
		 */
		_detectBody: function() {
			var body = this.el.find('tbody');
			this._body = body.length ? body : this.el;
		},


		/**
		 * Detect the column names
		 */
		_detectColumns: function() {

			var names = {},
				columns = [],
				maxIndex = 0;

			this.el.find('[data-name]').each(function() {

				var index = $(this).index();

				maxIndex = index > maxIndex ? index : maxIndex;

				names[index] = $(this).attr('data-name');
			});

			for (var i = 0, len = maxIndex; i <= len; i++) {
				columns.push(names[i] || null);
			}

			this._columns = columns;
		}
	};

	/**
	 * Create a append instance
	 * @param {Object} el The element
	 * @param {Object} data The data to appaned
	 * @return {Object} this
	 */
	function _createTableAppend(el, data) {
		this.append = new TableAppend(el, data);
		return this;
	}

	// Register the plugin
	$.fn.extend({
		tableAppend: function(data) {
			return this.each(function() {
				return _createTableAppend($(this), data || {});
			});
		}
	});
})(jQuery);