/**
 * Take an element and create a expandable/collapsable nav drawer.
 *
 * @module nav-drawer.js
 */

(function($) {

	/**
	 * New Drawer constructor
	 */
	var Drawer = function() {
		this._initDefaults();
		this.initialize.apply(this, arguments);
		this._initBindings();
	};

	/**
	 * Drawer functionality definitions
	 * @type {Object}
	 */
	Drawer.prototype = {

		/**
		 * Initialize the drawer
		 * @param {Object} el
		 * @param {Object} params
		 */
		initialize: function(el, params) {
			this.el = el;
		},


		/**
		 * Toggle the opened state
		 */
		toggle: function() {

			if (!this.isOpen) {
				this.open();
			}
			else {
				this.close();
			}
		},


		/**
		 * Open the drawer
		 */
		open: function() {
			this.isOpen = true;
			this.el.addClass('open');
			$('body').on('click', this._boundOnBodyClick);
		},


		/**
		 * Close the drawer
		 */
		close: function() {
			this.isOpen = false;
			this.el.removeClass('open');
			$('body').off('click', this._boundOnBodyClick);
		},


		/**
		 * Set the default parameters (fixes clobbering prototypes by accident)
		 */
		_initDefaults: function() {
			this.el = {};
			this.isOpen = false;
			this._boundOnBodyClick = this._onBodyClick.bind(this);
		},


		/**
		 * Set event binding listeners
		 */
		_initBindings: function() {
			this.el.find('[data-hook="drawer-toggle"]').on('click', this._onToggleClick.bind(this));
		},


		/**
		 * When the toggle is clicked
		 */
		_onToggleClick: function() {
			this.toggle();
		},


		/**
		 * When the body is clicked
		 * @param {Object} e
		 */
		_onBodyClick: function(e) {

			var el = $(e.target);

			if (el !== this.el && !el.parents().filter(this.el).length) {
				this.close();
			}
		}
	};

	/**
	 * Create a nav drawer instance
	 * @param {Object} el The element
	 * @return {Object} this
	 */
	function _createDrawer(el, params) {
		this.drawer = new Drawer(el, params);
		return this;
	}

	// Register the plugin
	$.fn.extend({
		navDrawer: function(params) {
			return this.each(function() {
				return _createDrawer($(this), params || {});
			});
		}
	});
})(jQuery);