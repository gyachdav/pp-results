var NAVBAR = function(config) {

	var ul = jQuery('<ul/>').addClass('nav');
	jQuery.each(config.items, function(key, value) {
		console.log(value[Object.keys(value)]);

		if (typeof value[Object.keys(value)] === 'object') {
			var menu = jQuery('<li />').addClass('dropDown')
				.append(jQuery('<a/>').text(Object.keys(value)).addClass('dropdown-toggle').attr('data-toggle', "dropdown").attr('href', '#')
				.append(jQuery('<b/>').addClass('caret')));
			var menuList = jQuery('<ul/>').addClass("dropdown-menu");
			jQuery.each(value[Object.keys(value)], function(key, value) {
				menuList.append(jQuery('<li/>')
					.append(jQuery('<a/>').click(this.func).text(this.text)));
				console.log(this.text);
			});
			menu.append(menuList);
		} else var menu = jQuery('<li />')
			.append(jQuery('<a/>').attr('href', '#')
			.text(Object.keys(value)));

		ul.append(menu);
	})

	;

	jQuery(config.targetDiv)
		.append(jQuery('<div/>').addClass('navbar-inner')
		.append(ul));
};

nv = new NAVBAR({
	targetDiv: ".navbar",
	items: [{
		'Export': [{
			name: 'allExport',
			text: "Download All Data Files",
			func: "APP.export();"
		}, {
			name: 'xmlExport',
			text: "Download in XML format",
			func: "APP.exportXML();"
		}, {
			name: 'jsonExport',
			text: "Download in JSON format",
			func: "APP.exportJson();"
		}]
	}, {
		'Email': ''
	}]
});