var SUBCELL_VIEW = (function() {
	var assets_path = 'assets/';
	var arrImg = [];


	function createTable(subcell_features) {

		var _table, header_row, row, cell;

		_table = document.createElement('table');
		header_row = document.createElement('tr');
		header_row.appendChild(document.createElement('th')).appendChild(document.createTextNode("Domain"));
		header_row.appendChild(document.createElement('th')).appendChild(document.createTextNode("Localization"));
		header_row.appendChild(document.createElement('th')).appendChild(document.createTextNode("GO Term"));
		header_row.appendChild(document.createElement('th')).appendChild(document.createTextNode("Score"));
		_table.appendChild(header_row);

		jQuery.each(subcell_features, function(domain, val) {
			var _tmp_img =  assets_path + domain + "/" + val.localisation + ".png";
			row = document.createElement('tr');
			img_html = jQuery('<img />').attr('src', _tmp_img)
			row.appendChild(document.createElement('td')).appendChild(document.createTextNode(domain));		
			row.appendChild(document.createElement('td')). appendChild(document.createTextNode(val.localisation));
			row.appendChild(document.createElement('td')).appendChild(document.createTextNode(val.score));
			row.appendChild(document.createElement('td')).appendChild(document.createTextNode(val.goTermId));
			_table.appendChild(row);
		});
		return _table;
	}



	return {
		init: function(subcell_features, target_div) {
			target_div.append("<div id='subcell_container' style='display:block'/>");
			jQuery("#subcell_container").append(createTable(subcell_features));
			jQuery("img").load( function(){
				jQuery("#subcell_container").show();
			});
		},

		preload: function() {
			jQuery(arrImg).each(function() {
				jQuery('<img />').attr('src', this).appendTo(target_div).css('display', 'none');
			});
		}
	}

})();