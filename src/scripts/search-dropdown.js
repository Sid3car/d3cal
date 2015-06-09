/**
 * As a user searches, show the search in place.
 *
 * @module search-dropdown.js
 */

(function($) {

	/**
	 * New SearchDropdown constructor
	 */
	var SearchDropdown = function() {
		this._initDefaults();
		this.initialize.apply(this, arguments);
		this._initBindings();
	};

	/**
	 * SearchDropdown functionality definitions
	 * @type {Object}
	 */
	SearchDropdown.prototype = {

		/**
		 * Initialize the slideout by storing the element and moving the content to the root of the body
		 * so that it isn't affected by styling on the main content.
		 * @param {Object} el
		 * @param {Object} params
		 */
		initialize: function(el, params) {
			this.el = el;
			this._search = params.search || this._search;
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

			return this;
		},


		/**
		 * Open the slideout
		 */
		open: function() {
			this.isOpen = true;
			this.el.addClass('open');
			$('body').addClass('slideout').on('click', this._boundOnBodyClick);
			return this;
		},


		/**
		 * Close the slideout
		 */
		close: function() {
			this.isOpen = false;
			this.el.removeClass('open');
			$('body').removeClass('slideout').off('click', this._boundOnBodyClick);
			return this;
		},


		/**
		 * Search
		 * @param {String} query
		 */
		search: function(query) {
			this._search.apply(this, arguments);
			return this;
		},


		/**
		 * A user-supplied function for searching
		 */
		_search: function() {},


		/**
		 * Set the default parameters (fixes clobbering prototypes by accident)
		 */
		_initDefaults: function() {
			this.el = {};
			this.isOpen = false;
			this._boundOnBodyClick = this._onBodyClick.bind(this);
			this._search = null;
		},


		/**
		 * Set event binding listeners
		 */
		_initBindings: function() {
			this.el.find('input[type="text"]').on('keyup', this._onInputKeyup.bind(this));
			this.el.on('submit', this._onSubmit.bind(this));
		},


		/**
		 * When the user types in the search box
		 * @param {Object} e
		 */
		_onInputKeyup: function(e) {

			var val = $(e.currentTarget).val();

			if (val) {
				this.search(val);
			}
			else {
				this.close();
			}
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
		},


		/**
		 * When the server returns an error on search
		 * @param {Object} err
		 */
		_onSearchError: function(err) {
			console.log(err);
		},


		/**
		 * When the form is submitted
		 * @param {Object} e
		 */
		_onSubmit: function(e) {
			e.preventDefault();
		}
	};

	/**
	 * Create a search dropdown instance
	 * @param {Object} el The element
	 * @return {Object} this
	 */
	function _createSearchDropdown(el, params) {
		this.slideout = new SearchDropdown(el, params);
		return this;
	}

	// Register the plugin
	$.fn.extend({
		searchDropdown: function(params) {
			return this.each(function() {
				return _createSearchDropdown($(this), params || {});
			});
		}
	});
})(jQuery);