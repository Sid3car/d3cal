/**
 * Make a group of items toggleable.
 *
 * @module toggle-list.js
 */

(function($) {

	/**
	 * New ToggleList constructor
	 */
	var ToggleList = function() {
		this._initDefaults();
		this.initialize.apply(this, arguments);
		this._initBindings();
	};

	/**
	 * ToggleList functionality definitions
	 * @type {Object}
	 */
	ToggleList.prototype = {

		/**
		 * Initialize the toggle
		 * @param {Object} el
		 * @param {Object} params
		 */
		initialize: function(el, params) {
			this.el = el;
			this._onChange = params.onChange && typeof params.onChange === 'function' ? params.onChange : this._onChange;
			this._initActive();
		},


		/**
		 * Make a child element active
		 * @param {Object} el
		 */
		active: function(el) {

			if (el !== this._active.get(0)) {
				this._active.removeClass('active');
				this._active = $(el);
				this._active.addClass('active');
				this._onChange(this._active.attr('data-value'));
			}
		},


		/**
		 * Set the default parameters (fixes clobbering prototypes by accident)
		 */
		_initDefaults: function() {
			this.el = null;
			this._active = null;
			this._onChange = null;
		},


		/**
		 * Set event binding listeners
		 */
		_initBindings: function() {
			this.el.children().on('click', this._onToggleClick.bind(this));
		},


		/**
		 * Initialize the active item
		 */
		_initActive: function() {

			var active = this.el.children('.active');

			if (!active.length) {
				active = this.el.children().first();
				active.addClass('active');
			}

			this._active = active.length ? active : null;
		},


		/**
		 * When a toggle is clicked
		 * @param {Object} e
		 */
		_onToggleClick: function(e) {
			this.active(e.target);
		},


		/**
		 * A user-supplied callback
		 * @param {Mixed} val
		 */
		_onChange: function(val) { }
	};

	/**
	 * Create a toggle instance
	 * @param {Object} el The element
	 * @return {Object} this
	 */
	function _createToggleList(el, params) {
		this.toggle = new ToggleList(el, params);
		return this;
	}

	// Register the plugin
	$.fn.extend({
		toggleList: function(params) {
			return this.each(function() {
				return _createToggleList($(this), params || {});
			});
		}
	});
})(jQuery);