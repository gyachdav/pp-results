var ALI_VIEW = (function() {
	var aliObj = {};



	return {
		draw: function(_objAli, targetDiv) {
			this.aliObj = _objAli;
			var table = document.createElement('table');


			var table = '<table id="aliTable" class="table table-hover tablesorter">';
			table += '<thead><tr><th>Protein Name</th><th>Identity</th><th>Expected Value</th><th>Matched Length</th></tr></thead>';
			table += "<tbody>";
			jQuery.map(this.aliObj, function(target, index) {
				var row = '<tr>';
				row += "<td>" + target.id + "</td>";
				row += "<td>" + parseFloat(target.identity).toFixed(2) + "</td>";
				row += "<td>" + target.eval + "</td>";
				row += "<td>" + target.matchlen + "</td>";
				table += row;
			});
			table += "</tbody>";
			table += '</table>';
			targetDiv.append(table);
			jQuery("#aliTable").tablesorter(  {sortList: [[1,1]]} ); 
		}
	};
})();