var NAVIGATION = (function() {

	var navigation_items = {
		"views": ["Dashborad"],
		"detailed predictions": 
		["Secondary Structure", 
		"Transmembrane Regions",
		"Non-Regular Secondary Structure",
		"Protein Disorder and Flexibility",
		"Disulphide and Metal Binding",
		"Binding Sites",
		"Subcellular Localization",
		"Transmembrane Betta-barrels"
		],
		"Further Analysis": [
		"Functional Changes",
		"Literature Search"
		],

	},active_item=2;
	var list_root = jQuery('<ul>');
	for (var key in navigation_items) {
		var item = jQuery('<li>');
		item.addClass("nav-header").text(key);
		list_root.append(item);
		var arr = navigation_items[key];
		for (var prop in arr) {
			item = jQuery('<li>');
			var link = jQuery('<a>', {
				text: arr[prop],
				title:  arr[prop],
				href: '#'
			});
			link.append(jQuery("<i/>").addClass("icon-chevron-right"));
			item.append(link);
			list_root.append(item);
		}
	}
	list_root.addClass("nav nav-list bs-docs-sidenav");
	jQuery( "li:nth-child(2)"  ,jQuery(list_root)).addClass("active");	
	


	return {
		show :function ( target_div ){
			target_div.append(list_root);		
		},
		setActiveItem: function( _item_number ){
			jQuery('.active',  jQuery(list_root)).removeClass('active');
			var _item_selector = "li:nth-child("+_item_number+")";
			jQuery( _item_selector  ,jQuery(list_root)).addClass("active");	
			// _item_number = active_item;
		}
	}

})();