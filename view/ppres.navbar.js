var NAVBAR = function(config) {


	if (!config) {
		config = {
			targetDiv: ".navbar",
			items: [{
				'Export': [{
									name: 'xmlExport',
									text: "Download in XML format",
									func: "APP.exportXML();"
								}]
			}, {
				'Email': 'nothing'
			}]
		};
	}



	var ul = jQuery('<ul/>').addClass('nav');
	jQuery.each(config.items, function(key, value) {
		console.log(value[Object.keys(value)]);
		if (typeof value[Object.keys(value)] === 'object') {
			
			jQuery.each(config.items, function(key, value) {

			});
			var menuItem = ul.append(jQuery('<li />').addClass('dropDown')
				.append(jQuery('<a/>').text(Object.keys(value))
				.append(jQuery('<b/>').addClass('caret'))));



		}
	});

	jQuery(config.targetDiv)
		.append(jQuery('<div/>').addClass('navbar-inner')
		.append(ul));
};

nv = new NAVBAR();