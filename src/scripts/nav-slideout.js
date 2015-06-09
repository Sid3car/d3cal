/**
 * Take an element and create a slideout nav.
 *
 * @module nav-slideout.js
 */

(function($) {

	/**
	 * New Slideout constructor
	 */
	var Slideout = function() {
		this._initDefaults();
		this.initialize.apply(this, arguments);
		this._initBindings();
	};

	/**
	 * Slideout functionality definitions
	 * @type {Object}
	 */
	Slideout.prototype = {

		/**
		 * Initialize the slideout by storing the element and moving the content to the root of the body
		 * so that it isn't affected by styling on the main content.
		 * @param {Object} el
		 * @param {Object} params
		 */
		initialize: function(el, params) {
			this.el = el;
			this.contentEl = this.el.find('[data-hook="slideout-content"]');
			$('body').prepend(this.contentEl);
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
		 * Open the slideout
		 */
		open: function() {
			this.isOpen = true;
			this.el.addClass('open');
			$('body').addClass('slideout').on('click', this._boundOnBodyClick);
		},


		/**
		 * Close the slideout
		 */
		close: function() {
			this.isOpen = false;
			this.el.removeClass('open');
			$('body').removeClass('slideout').off('click', this._boundOnBodyClick);
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
			this.el.find('[data-hook="slideout-toggle"]').on('click', this._onToggleClick.bind(this));
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

			if (el.get(0) !== this.contentEl.get(0) && el !== this.el && !el.parents().filter(this.el).length && !el.parents().filter(this.contentEl.get(0)).length) {
				this.close();
			}
		}
	};

	/**
	 * Create a nav slideout instance
	 * @param {Object} el The element
	 * @return {Object} this
	 */
	function _createSlideout(el, params) {
		this.slideout = new Slideout(el, params);
		return this;
	}

	// Register the plugin
	$.fn.extend({
		navSlideout: function(params) {
			return this.each(function() {
				return _createSlideout($(this), params || {});
			});
		}
	});
})(jQuery);