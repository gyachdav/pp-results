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
					id:  url+proteinId,
					text: proteinId+ " " + chain,
					title: proteinId+ " " + chain,
					href: "#",
					click: function() {
						window.open( this.id, '_blank');
						window.focus;
					}
				});

				var row = jQuery('<tr/>');
				row.append(jQuery('<td/>').append(link));
				row.append(jQuery('<td/>').text(parseFloat(target.identity).toFixed(2)));
				row.append(jQuery('<td/>').text( target.eval ));
				row.append(jQuery('<td/>').text( target.matchlen ));
				table.append(row);
			});
			targetDiv.append(table);
			jQuery('table', targetDiv).tablesorter({
				sortList: [
					[1, 1]
				]
			});
		}
	};
})();