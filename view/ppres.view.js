var PAGE = (function() {


	var active_divs = [],
		inactive_divs = [],
		cached = {},
		page_components = {
			dashboard: [
				'FeatureViewer',
				'SubcellLoc'
			// 'AlignmentTable',
			// 'AlignmentTable',
			// 'AAConsistency',
			// 'SSConsistency'
			]
		},
		default_page = "dashboard",
		dataObj;


	var activate = function(_element) {
		if (!_element.attr('id')) throw new Error('element has no id cannot activate');
		cached[_element.attr('id')].active = true;
	};
	var inactivate = function(_element) {
		if (!_element.attr('id')) throw new Error('element has no id cannot inactivate');
		cached[_element.attr('id')].active = false;
	};
	var empty = function() {
		jQuery.each(active_divs, function(index, element) {
			this.inactivate(element);
		});
	};

	var isCached = function(element_name) {
		if (cached[element_name]) return true;
		return false;
	};

	var cacheFetch = function(_element_id) {
		return (cached[_element_id]);
	};

	var cacheStore = function(_element) {
		if (!_element.attr('id')) throw new Error('element has no id cannot store in cache');
		cached[_element.attr('id')] = _element;
	};

	var cacheRemove = function(_element) {
		if (!_element.attr('id')) throw new Error('element has no id cannot remove from cache');
		delete cached[_element.attr('id')];
	};



	var drawAlignmentTable = function() {
		ALI_VIEW.draw(dataObj.getAlignmentLocations(), jQuery("#alignments"));
	};

	var drawSummaryTable = function() {
		// TODO move modal activation code from this control
		jQuery("#summary_container").append("<div class='summary  left' />");
		jQuery(".summary").append("<h3>Summary</h3>");
		var table = jQuery("<table/>");
		table.addClass("table table-striped");
		if (_rec_name = dataObj.getAlignmentsByDatabaseTopMatch('Swiss-Prot')) table.append("<tr><td>Recommended Name</td><td>" + _rec_name + "</td></tr>");
		table.append("<tr><td>Sequence Length</td><td>" + dataObj.getSequence().length + "</td></tr>");
		table.append("<tr><td>Number of Aligned Proteins</td><td><a href='#myModal' role='button' data-toggle='modal'>" + dataObj.getAlignmentsCount() + "</a></td></tr>");
		table.append("<tr><td>Number of Matched PDB Structures</td><td>" + dataObj.getAlignmentsByDatabase('pdb') + "</td></tr>");
		jQuery(".summary").append(table);
	};

	var drawAAConsistency = function() {
		jQuery("#summary_container").append("<div id='aa-consistency' class='summary  left' />");
		jQuery("#aa-consistency").append("<h3>Amino Acid composition</h3>");
		PIE_CHART.toPieData(dataObj.getAAComposition()).drawPieChart('aa-consistency');
	};

	var drawSSConsistency = function() {
		jQuery("#summary_container").append("<div id='ss-consistency' class='summary  right' />");
		jQuery("#ss-consistency").append("<h3>Secondary Structure composition</h3>");
		PIE_CHART.toPieData(dataObj.getSSComposition()).drawPieChart('ss-consistency');
	};

	return {

		drawSubcellLoc: function() {
			target_div = "SubcellLoc";
			var nav_div = jQuery("<div id='_subcell_nav' />");

			var content_div = jQuery("<div id='_subcell_cntnt'/>");
			var list = jQuery('<ul/>');
			list.addClass("nav nav-pills");


			list.append('<li class="disabled"><a href="#">Domains:</a> </li>')

			var domains = ["arch", "bact", "euka", "plant", "animal", "proka"];
			for (var i in domains) {
				var _curr_div;
				var _curr_li = jQuery('<li><a href=#>' + SUBCELL_VIEW.getDomainFullName(domains[i]) + '</a></li>');
				var prediction = dataObj.getSubCellLocations(domains[i]);
				if (!prediction) _curr_div = jQuery("<div />").text("Data unavailable");
				else _curr_div = SUBCELL_VIEW.localisationDiv(prediction);

				if (domains[i] == 'euka') {
					_curr_div.show();
					_curr_li.addClass('active');
				} else _curr_div.hide();
				list.append(_curr_li);
				content_div.append(_curr_div);
			}
			nav_div.append(list);
			jQuery("#" + target_div).append(nav_div);
			jQuery("#" + target_div).append(content_div);
			return (jQuery("#" + target_div));


		},


		drawFeatureViewer: function() {
			var target_div = "FeatureViewer";
			FEATURE_VIEWER.init({
				targetDiv: target_div,
				dataObj: dataObj
			});

			var features_array = [];
			FEATURE_VIEWER.setFeaturesArray(jQuery.map(APP.providers, function(provider, index) {
				var track, feature_properties;
				track = new Track();
				if (provider == "ISIS") track.setShiftBottomLine(Track.NO_BOTTOMLINE_SHIFT);
				else track.setPosition(FEATURE_VIEWER.getCurrentBottom());

				var feature_group = dataObj.getFeatureByProvider(dataObj.getFeatureTypeGroup(), provider);
				if (!feature_group) return null;
				var feature_type = (feature_group.type) ? feature_group.type : "";
				feature_properties = dataObj.getFeatureLocations(feature_group);


				if (!feature_properties) return null;
				if (feature_properties) i = feature_properties.length;
				while (i--) {
					var feature;
					if (typeof Feature[provider] !== 'undefined') {
						Feature[provider].prototype = new Feature();
						feature = new Feature[provider](feature_properties[i], provider, feature_type);
					} else {
						feature = new Feature().init(feature_properties[i], provider, feature_type);
					}
					track.addFeature(feature);
				}
				FEATURE_VIEWER.addTrack(track);
				return track.getTrack();
			}));


			// Add alignment
			FEATURE_VIEWER.setFeaturesArray(jQuery.map(dataObj.getAlignmentLocations(), function(target, index) {
				var track = new Track(1, 1);
				track.setPosition(FEATURE_VIEWER.getCurrentBottom());
				Feature.Alignment.prototype = new Feature();
				feature = new Feature.Alignment(target, 'blast', 'alignmnet');
				track.addFeature(feature);
				FEATURE_VIEWER.addTrack(track);
				return track.getTrack();
			}));

			FEATURE_VIEWER.draw();
			return (jQuery("#" + target_div));
		},



		draw: function(_dataObj) {
			var _page = default_page;
			dataObj = _dataObj;
			target_div = jQuery("#msg");
			jQuery.get('html/dashboard.html', function(data, textStatus, xhr) {
				jQuery.each(page_components[_page], function(index, component) {
					if (!isCached(component)) {
						var _fn_name = "draw" + component;
						cacheStore(PAGE[_fn_name].call());
					}
					activate(cacheFetch(component));
				});
				jQuery.each(cached, function(index, element) {
					if (cached[element.attr('id')].active) element.show();
				});
			});
		}
	}

})();