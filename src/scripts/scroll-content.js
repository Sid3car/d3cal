/**
 * Scroll overflow: hidden; content when it is highlighted.
 *
 * @module scroll-content.js
 */

(function($) {

	/**
	 * New ScrollContent constructor
	 */
	var ScrollContent = function() {
		this._initDefaults();
		this.initialize.apply(this, arguments);
		this._initBindings();
	};

	/**
	 * ScrollContent functionality definitions
	 * @type {Object}
	 */
	ScrollContent.prototype = {

		/**
		 * Initialize the scroll content
		 * @param {Object} el
		 * @param {Object} params
		 */
		initialize: function(el, params) {
			this.el = el;
			this.speed = params.speed || this.speed;
		},


		/**
		 * Start the scroll
		 */
		start: function() {

			this._setup();

			var left = this.el.width() - this._sliderEl.width();

			if (this._running || left > 0) {
				this.stop();
				return;
			}

			this._running = true;
			this._sliderEl.animate({left: left}, this.speed);
		},


		/**
		 * Stop the scroll
		 */
		stop: function() {
			this._running = false;
			this._sliderEl.stop();
		},


		/**
		 * Reset the scroll
		 */
		reset: function() {
			this.stop();
			this._teardown();
		},


		/**
		 * Setup the wrapped elements
		 */
		_setup: function() {
			this._sliderEl = $('<span />').text(this.el.text()).css({'position': 'relative'});
			this.el.html('').append(this._sliderEl);
		},


		/**
		 * Teardown the wrapped elements
		 */
		_teardown: function() {
			this.el.text(this.el.text());
			this._sliderEl = null;
		},


		/**
		 * Set the default parameters (fixes clobbering prototypes by accident)
		 */
		_initDefaults: function() {
			this.el = null;
			this._running = false;
			this.speed = 1000;
			this._left = 0;
		},


		/**
		 * Set event binding listeners
		 */
		_initBindings: function() {
			this.el.on('mouseenter', this._onMouseover.bind(this));
			this.el.on('mouseleave', this._onMouseout.bind(this));
		},


		/**
		 * When the mouse rolls over, start scrolling
		 * @param {Object} e
		 */
		_onMouseover: function(e) {
			if (e.currentTarget === this.el.get(0)) {
				this.start();
			}
		},


		/**
		 * When the mouse rolls out, reset the scroll
		 * @param {Object} e
		 */
		_onMouseout: function(e) {
			if (this._running && e.currentTarget === this.el.get(0)) {
				this.reset();
			}
		},
	};

	/**
	 * Create a scroll instance
	 * @param {Object} el The element
	 * @return {Object} this
	 */
	function _createScrollContent(el, params) {
		this.scroll = new ScrollContent(el, params);
		return this;
	}

	// Register the plugin
	$.fn.extend({
		scrollContent: function(params) {
			return this.each(function() {
				return _createScrollContent($(this), params || {});
			});
		}
	});
})(jQuery);