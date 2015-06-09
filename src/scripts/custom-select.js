/**
 * A custom select element.
 *
 * @module custom-select.js
 */

(function($) {

	/**
	 * New Select constructor
	 */
	var Select = function() {
		this._initDefaults();
		this.initialize.apply(this, arguments);
		this._initPlaceholder();
		this._initBindings();
	};

	/**
	 * Select functionality definitions
	 * @type {Object}
	 */
	Select.prototype = {

		/**
		 * Initialize the select
		 * @param {Object} el
		 * @param {Object} params
		 */
		initialize: function(el, params) {
			this.el = el;
			this._onChange = params.onChange || this._onChange;
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
		 * Open the select
		 */
		open: function() {
			this.isOpen = true;
			this.placeholderEl.addClass('open');
			$('body').on('click', this._boundOnBodyClick);
		},


		/**
		 * Close the select
		 */
		close: function() {
			this.isOpen = false;
			this.placeholderEl.removeClass('open');
			$('body').off('click', this._boundOnBodyClick);
		},


		/**
		 * Set the value
		 * @param {Number} index
		 */
		setValue: function(index) {

			// Set the value of the original element
			this.el.children('[selected]').removeAttr('selected');
			this.el.children('option').eq(index).attr('selected', true);

			var val = this.el.val(),
				text = this.el.find(':selected').text();

			this.activeEl.text(text);
			this.placeholderEl.find('li.active').removeClass('active');
			this.placeholderEl.find('li').eq(index).addClass('active');

			if (val === this._currentValue) {
				return;
			}

			this._onChange(this._currentValue = val, text);
		},


		/**
		 * Set the default parameters (fixes clobbering prototypes by accident)
		 */
		_initDefaults: function() {
			this.el = {};
			this.placeholderEl = {};
			this.activeEl = {};
			this.isOpen = false;
			this._currentValue = null;
			this._boundOnBodyClick = this._onBodyClick.bind(this);
		},


		/**
		 * Set event binding listeners
		 */
		_initBindings: function() {
			this.placeholderEl.on('click', this._onClick.bind(this));
		},


		/**
		 * Initialize the placeholder(styled) element
		 */
		_initPlaceholder: function() {

			var placeholder = $('<div />').html('<div class="active"></div><ul></ul>').addClass('custom-select ' + this.el.attr('class')),
				elVal = this.el.val(),
				ul = placeholder.find('ul'),
				active = placeholder.find('.active'),
				t = this;

			this.el.find('option').each(function() {

				var val = $(this).attr('value'),
					text = $(this).text(),
					li = $('<li />').text(text).attr('data-value', val);

				if (val === elVal) {
					active.text(text);
					li.addClass('active');
					t._currentValue = val;
				}

				ul.append(li);
			});

			this.el.hide();
			this.el.before(placeholder);

			this.placeholderEl = placeholder;
			this.activeEl = active;
		},


		/**
		 * When the form is clicked
		 * @param {Object} e
		 */
		_onClick: function(e) {

			e.preventDefault();
			e.stopPropagation();

			// console.log(e, this.el);
			var el = $(e.target);

			if (el.get(0) === this.placeholderEl.get(0) || el.get(0) === this.activeEl.get(0)) {
				this.toggle();
			}
			else {
				this.close();
				this.setValue(el.index());
			}
		},


		/**
		 * When the body is clicked
		 * @param {Object} e
		 */
		_onBodyClick: function(e) {

			var el = $(e.target);

			if (el !== this.placeholderEl.get(0) && !el.parents().filter(this.placeholderEl).length) {
				this.close();
			}
		},


		/**
		 * When the value changes.
		 * This should be overridden by child implementations.
		 */
		_onChange: function() {}
	};

	/**
	 * Create a nav select instance
	 * @param {Object} el The element
	 * @return {Object} this
	 */
	function _createSelect(el, params) {
		this.select = new Select(el, params);
		return this;
	}

	// Register the plugin
	$.fn.extend({
		customSelect: function(params) {
			return this.each(function() {
				return _createSelect($(this), params || {});
			});
		}
	});
})(jQuery);