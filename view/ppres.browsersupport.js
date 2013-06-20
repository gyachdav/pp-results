var BROWSER_SUPPORT = (function($) {
	function check() {
		var supported = true;

		if(!Modernizr.svg)
			supported = false;

		return supported;
	}

	function ignore() {
		document.cookie="ignore_browser_warning=true; expires=Mon, 31 Dec 2035 23:59:59 GMT;";
	}

	function is_ignored() {
		var c_value = document.cookie;
		var c_start = c_value.indexOf(" ignore_browser_warning=");
		if (c_start == -1) {
			c_start = c_value.indexOf("ignore_browser_warning=");
		}
		if (c_start == -1) {
			return false;
		} 
		return true;
	}

	function draw() {
		var pagePath = "js/plugins/compat/BrowserSupport.html";
		$.get(pagePath).done(function(result) {
			$('#modal-container').remove('#browser-support');
			$('#modal-container').append(result);
			$('#browser-support', '#modal-container').modal({
				'show': true,
				'backdrop': 'static',
				'keyboard': false
			});
			$('#ignore_browser_warning').on('click', function() {
				ignore();
				$('#browser-support', '#modal-container').modal('hide');
			});
		});
	}

	return {
		ignore: ignore,
		is_ignored: is_ignored,
		check: check,
		draw: draw
	};
})(jQuery);