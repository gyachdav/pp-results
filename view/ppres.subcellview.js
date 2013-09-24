var SUBCELL_VIEW = (function() {
	var assets_path =  '/ppres/'+'assets/';
	var arrImg = [];

	var Domains = {
		"euka": "Eukarya",
		"plant": "Plant",
		"animal": "Animal",
		"bact": "Bacteria",
		"proka": "Prokaryotic",
		"arch": "Archaea",
		"virus": "Virus"
	}

		function linkToGO(go_term) {
			var __url = 'http://amigo.geneontology.org/cgi-bin/amigo/term_details?term=' + go_term;
			return ("<a href='"+__url+"' target='__blank' title='More Info at the GO Ontology'>"+go_term+"</a>");
		}

		function getPathToImage(domain, loc) {
			// TODO need to pass the path from app settings
			return (assets_path + domain + "/" + loc + ".PNG");
		}


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
				var _tmp_img = assets_path + domain + "/" + val.localisation + ".png";
				row = document.createElement('tr');
				img_html = jQuery('<img />').attr('src', _tmp_img)
				row.appendChild(document.createElement('td')).appendChild(document.createTextNode(Domains[domain]));
				row.appendChild(document.createElement('td')).appendChild(document.createTextNode(val.localisation));
				row.appendChild(document.createElement('td')).appendChild(document.createTextNode(val.score));
				row.appendChild(document.createElement('td')).appendChild(document.createTextNode(val.goTermId));
				_table.appendChild(row);
			});
			return _table;
		}

		function capitalize(s) {
			return s[0].toUpperCase() + s.slice(1);
		}

	return {
		linkToGO: linkToGO,
		resolveName: function(prediction){
			var predictionName = prediction;
			switch (prediction) {
				  case 'endoplasmicReticulum':
				    predictionName = 'Endoplasmic Reticulum';
				    break;
				  case 'endoplasmicReticulumMembrane':
				    predictionName = 'Endoplasmic Reticulum Membrane';
				    break;
				  case 'golgiApparatus':
				    predictionName = 'Golgi Apparatus';
				    break;
				case 'golgiApparatusMembrane':
				    predictionName = 'Golgi Apparatus Membrane';
				    break;
				case 'innerMembrane':
				    predictionName = 'Inner Membrane';
				    break;
				case 'mitochondriaMembrane':
				    predictionName = 'mitochondria Membrane';
				    break;
				case 'nucleusMembrane':
				    predictionName = 'Nucleus Membrane';
				    break;
				case 'outerMembrane':
				    predictionName = 'Outer Membrane';
				    break;
				case 'peroxisomeMembrane':
				    predictionName = 'Peroxisome Membrane';
				    break;
				case 'plasmaMembrane':
				    predictionName = 'Plasma Membrane';
				    break;
				case 'vacuoleMembrane':
				    predictionName = 'Vacuole Membrane';
				    break;
				case 'dNABinding':
				    predictionName = 'DNA Binding';
				    break;
				case 'extraCellular':
				    predictionName = 'Extra Cellular';
				    break;
				case 'notDNABinding':
				    predictionName = 'Not DNAB inding';
				    break;
				  default:
				    predictionName = capitalize(prediction);
				    break;
			}
			return (predictionName);
		},
		getDomainFullName: function (domain){
			return (Domains[domain]);
		},
		localisationDiv: function(domain_to_show) {
			

			tmpDomain = Object.keys(domain_to_show)[0];
			_tmp_pred_str = 'Predicted localisation for the ' + this.getDomainFullName(tmpDomain) +
				' domain: ' + this.resolveName(domain_to_show[tmpDomain].localisation) +
				' (GO term ID: ' + domain_to_show[tmpDomain].goTermId + ') Prediction confidence ' + domain_to_show[tmpDomain].score;

			_tmp_pred_html = 'Predicted localization for the ' + this.getDomainFullName(tmpDomain) +
				' domain: ' + this.resolveName(domain_to_show[tmpDomain].localisation) +
				' (GO term ID: '+linkToGO(domain_to_show[tmpDomain].goTermId)+') Prediction confidence ' + domain_to_show[tmpDomain].score;
			container = jQuery("<div>").attr('id', tmpDomain+"_localisation_container");
			tmpImg = getPathToImage([tmpDomain], domain_to_show[tmpDomain].localisation);
			html = '<span><img class="round-corners" src=' + tmpImg + ' title="' + _tmp_pred_str + '"/></span>';
			html += '<div>' + _tmp_pred_html + '</div>';

			container.append(html);
			return (container);

		},
		init: function(subcell_features, target_div) {
			target_div.append("<div id='subcell_container' style='display:block'/>");
			jQuery("#subcell_container").append(createTable(subcell_features));
			jQuery("img").load(function() {
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