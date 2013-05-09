var ALI_VIEW = (function() {
	var aliObj = {};



	return {
		draw: function(_objAli, targetDiv) {
			this.aliObj = _objAli;
			// var table = document.createElement('table');

			var table = jQuery('<table/>').append('</tbody>');
			table.addClass("table table-hover tablesorter");
			table.append(jQuery('<thead/>').append(jQuery('<tr/>')
				.append(jQuery('<th/>').text('Protein Name'))
				.append(jQuery('<th/>').text('Identity'))
				.append(jQuery('<th/>').text('Expected Value'))
				.append(jQuery('<th/>').text('Matched Length'))
			));

			// var table = '<table id="aliTable" class="table table-hover tablesorter">';
			// table += '<thead><tr><th>Protein Name</th><th>Identity</th><th>Expected Value</th><th>Matched Length</th></tr></thead>';
			// table += "<tbody>";
			jQuery.map(this.aliObj, function(target, index) {
				var proteinId = chain = url='';
				proteinId = target.id;
				if (target.db.match(/pdb/i)) {
					(__pdb) = target.id.split('_');
					proteinId = __pdb[0];
					chain = "Chain("+__pdb[1]+")"
					// if (__pdb[1]) _feature.id += " Chain: " + __pdb[1];
					url = 'http://www.rcsb.org/pdb/explore.do?structureId=';
				} else url = 'http://www.uniprot.org/uniprot/';


				var link = jQuery('<a>', {
					text: proteinId+ " " + chain,
					title: proteinId+ " " + chain,
					href: "#",
					click: function() {
						window.open(url+proteinId, '_blank');
						window.focus;
					}
				});

				var row = jQuery('<tr/>');
				row.append(jQuery('<td/>').append(link));
				row.append(jQuery('<td/>').text(parseFloat(target.identity).toFixed(2)));
				row.append(jQuery('<td/>').text( target.eval ));
				row.append(jQuery('<td/>').text( target.matchlen ));
				table.append(row);
				// row += "<td>" + link + "</td>";
				// row += "<td>" + parseFloat(target.identity).toFixed(2) + "</td>";
				// row += "<td>" + target.eval + "</td>";
				// row += "<td>" + target.matchlen + "</td>";
				// jQuery(table).append(row);
			});
			// table += "</tbody>";
			// table += '</table>';
			targetDiv.append(table);
			jQuery('table', targetDiv).tablesorter({
				sortList: [
					[1, 1]
				]
			});
		}
	};
})();