var PAGE = (function() {


	var activeDivs = [],
		inactiveDivs = [],
		cached = {},
		pageComponents = {
			Dashboard: [
				'FeatureViewer',
				'SubcellLoc',
				'SummaryTable',
				'AlignmentTable',
				'AAConsistency',
				'SSConsistency'],
			SecondaryStructure: [
				'FeatureViewer',
				'SSConsistency'],
			SubcellLoc: [
				"SubcellLoc"]
		},
		defautlPage = "Dashboard",
		currentPage = defautlPage,
		mainContainerDiv = jQuery("#content"),
		loadingDiv = jQuery(".loading"),
		dataObj;


	var activate = function(elementName) {
		if (!elementName) throw new Error('element has no id cannot activate');
		activeDivs.push(elementName);
		jQuery("#" + elementName).show();
	};
	var pageEmpty = function() {
		var item;
		while (item = activeDivs.pop()) {
			jQuery("#" + item).hide();
		}
	};

	var pageFill = function() {
		jQuery.each(activeDivs, function(index, elementName) {
			jQuery("#" + elementName).show();
		});
	};
	var isCached = function(elementName) {
		if (cached[elementName]) return true;
		return false;
	};

	var cacheFetch = function(_element_id) {
		return (cached[_element_id]);
	};

	var cacheStore = function(elementName, element) {
		cached[elementName] = element;
		// jQuery.extend (cached, {elementName: element});
	};

	var cacheRemove = function(_element) {
		if (!_element.attr('id')) throw new Error('element has no id cannot remove from cache');
		delete cached[_element.attr('id')];
	};



	return {
		init: function(argument) {
			if (!dataObj) this.setDataObj(argument.data);
			if (argument.page) page = argument.page;
			return this;
		},
		getDefaultPage: function() {
			return defautlPage;
		},
		setDataObj: function(__dataObj) {
			dataObj = __dataObj;
		},

		drawAlignmentTable: function(targetDiv) {
			ALI_VIEW.draw(dataObj.getAlignmentLocations(), jQuery("#" + targetDiv));
		},

		drawAAConsistency: function(targetDiv) {
			jQuery("#" + targetDiv).append("<h3>Amino Acid composition</h3>");
			PIE_CHART.toPieData(dataObj.getAAComposition()).drawPieChart(targetDiv);
		},

		drawSSConsistency: function(targetDiv) {
			jQuery("#" + targetDiv).append("<h3>Secondary Structure composition</h3>");
			PIE_CHART.toPieData(dataObj.getSSComposition()).drawPieChart(targetDiv);
		},

		drawSummaryTable: function(targetDiv) {
			// TODO move modal activation code from this control

			jQuery("#" + targetDiv).append("<h3>Summary</h3>");
			var table = jQuery("<table/>");
			table.addClass("table table-striped");
			if (_rec_name = dataObj.getAlignmentsByDatabaseTopMatch('Swiss-Prot')) table.append("<tr><td>Recommended Name</td><td>" + _rec_name + "</td></tr>");
			table.append("<tr><td>Sequence Length</td><td>" + dataObj.getSequence().length + "</td></tr>");
			table.append("<tr><td>Number of Aligned Proteins</td><td><a href='#myModal' role='button' data-toggle='modal'>" + dataObj.getAlignmentsCount() + "</a></td></tr>");
			table.append("<tr><td>Number of Matched PDB Structures</td><td>" + dataObj.getAlignmentsByDatabase('pdb') + "</td></tr>");
			jQuery("#" + targetDiv).append(table);
			return (jQuery("#" + targetDiv)).html();
		},

		drawSubcellLoc: function(targetDiv) {
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
			jQuery("#" + targetDiv).append(nav_div);
			jQuery("#" + targetDiv).append(content_div);
			return (jQuery("#" + targetDiv)).html();


		},


		drawFeatureViewer: function(targetDiv) {

			FEATURE_VIEWER.init({
				targetDiv: targetDiv,
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
			 return jQuery("#"+targetDiv).html();
		},

		draw: function(currentPage) {
			loadingDiv.show();
			mainContainerDiv.empty();
			var pagePath = 'html/' + currentPage + ".html";


			var getComponent = function(component) {
				var element;
				if (!isCached(component)) {
					element = PAGE["draw" + component].call(this, component + "Container");
					if (element) cacheStore(component, element);

				} else {
					element = cacheFetch(component);
				}
				return element;
			};

			if (!isCached(currentPage)) {
				jQuery.get(pagePath)
					.done(function(pageHTML) {
					mainContainerDiv.append(pageHTML);
					cacheStore(currentPage, pageHTML);
					jQuery.each(pageComponents[currentPage], function(i, component) {
						var element = getComponent(component);
						if (element) jQuery("#" + component + "Container", mainContainerDiv).html(element);
					});
				});
			} else {
				var pageHTML = cacheFetch(currentPage)
				mainContainerDiv.append(pageHTML);
				jQuery.each(pageComponents[currentPage], function(i, component) {
					var element = getComponent(component);
					if (element) jQuery("#" + component + "Container", mainContainerDiv).html(element);
				});
			}
			loadingDiv.hide();
		}
	}
})();