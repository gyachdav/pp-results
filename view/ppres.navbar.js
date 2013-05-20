var NAVBAR = function(config) {
    var ul = jQuery('<ul/>').addClass('nav');
    jQuery.each(config.items, function(key, value) {
	console.log(value[Object.keys(value)]);

	if (typeof value[Object.keys(value)] === 'object') {
	    var menu = jQuery('<li />').addClass('dropDown')
		.append(jQuery('<a/>').text(Object.keys(value)).addClass('dropdown-toggle').attr('data-toggle', "dropdown").attr('href', '#')
			.append(jQuery('<b/>').addClass('caret')));
	    var menuList = jQuery('<ul/>').addClass("dropdown-menu");
	    jQuery.each(value[Object.keys(value)], function(k, v) {
		menuList.append(jQuery('<li/>')
				.append(jQuery('<a/>').click(function(){
					ex= new EXPORT();
					var p = '';
					if (v.params)
				    	ex[v.func].apply(null, v.params );
				    else
				    	ex[v.func].apply();

				}).text(this.text)));
	    });
	    menu.append(menuList);
	} else var menu = jQuery('<li />')
	    .append(jQuery('<a/>').attr('href', '#')
		    .text(Object.keys(value)));

	ul.append(menu);
    });

    jQuery(config.targetDiv)
	.append(jQuery('<div/>').addClass('navbar-inner')
		.append(ul));
};
