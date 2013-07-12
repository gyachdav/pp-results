var NAVIGATION = (function() {

	var navigation_items = {
		"views": [{
				id: "dash",
				text: "Dashboard"
			}
		],
		"structure annotation": [{
				text: "Secondary Structure and Solvent Accessibility",
				id: "secstruct"
			}, {
				id: "tmh",
				text: "Transmembrane Helices"
			},
			//  {
			// 	id: "nors",
			// 	text: "Non-Regular Secondary Structure"
			// }, 
			{
				id: "disorder",
				text: "Protein Disorder and Flexibility"
			}, {
				id: "disulphide",
				text: "Disulphide Bridges"
			}
			//  {
			// 	id: "tmb",
			// 	text: "Transmembrane Beta-barrels"
			// }
		],
		
		"Function Annotation": [{
				id: "func",
				text: "Effect of Point Mutations",
			},

			{
				id: "goannotation",
				text: "Gene Ontology Terms"
			},
			{
				id: "subcell",
				text: "Subcellular Localization"
			}, {
				id: "binding",
				text: "Binding Sites"
			}
		],

		"Additional Services": [{
				id: "litsearch",
				text: "Literature Search"
			}
		],

		"Help": [{
				id: "tutorial",
				text: "Site Tutorial"
			}
		]

	},
		active_item = 2;
	var list_root = jQuery('<ul>');
	jQuery.each(navigation_items, function(key, value) {
		var item = jQuery('<li>');
		item.addClass("nav-header").text(key);
		list_root.append(item);
		jQuery.each(value, function(prop, v) {
			item = jQuery('<li>');
			item.attr('id', v.id)
			var link = jQuery('<a>', {
				text: v.text,
				title: v.text,
				href: '#'
			});
			link.addClass("nav-link");
			link.append(jQuery("<i/>").addClass("icon-chevron-right"));
			item.append(link);
			list_root.append(item);
		});
	});

	list_root.addClass("nav nav-list bs-docs-sidenav");
	jQuery("li:nth-child(2)", jQuery(list_root)).addClass("active");
	return {
		show: function(target_div) {
			target_div.append(list_root);
		},
		setActiveItem: function(_item_number) {
			jQuery('.active', jQuery(list_root)).removeClass('active');
			var _item_selector = "li:nth-child(" + _item_number + ")";
			jQuery(_item_selector, jQuery(list_root)).addClass("active");
			// _item_number = active_item;
		}
	}

})();