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