var PAGE = function(argument) {

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
				'SSViewer',
				'SSConsistency'],
			Transmembrane: ["TransmembraneViewer"],
			Disorder: ["DisorderViewer"],
			Binding: ["BindingViewer"],
			TMB: ["TMBViewer"],
			Disulphide: ["DisulphideViewer"],
			SubcellLoc: [
				"SubcellLoc"]
		},
		defaultPage = "Dashboard",
		currentPage,

		mainContainerDiv = jQuery("#content"),
		loadingDiv = jQuery(".loading"),
		dataObj,
		providers;
	(argument.page) ? currentPage = argument.page : currentPage = defaultPage;
	(argument.providers) ? providers = argument.providers : providers = [];

	if (!dataObj) dataObj = argument.data;

	
	var somefunc = function  (argument) {
		;
	};

	var isCached = function(elementName) {
		if (cached[elementName]) return true;
		return false;
	};


	var drawFeatureViewer = function(argumnet) {
		var fv = new FEATURE_VIEWER({
			targetDiv: argumnet.targetDiv,
			dataObj: dataObj,
			providers: argument.providers,
			showAlignment: true
		});
		fv.setup();
		fv.draw();
	};

	var cacheFetch = function(elementName) {
		return (cached[elementName]);
	};

	var cacheStore = function(elementName, element) {
		cached[elementName] = element;
	};

	// var cacheRemove = function(elementName) {
	// 	delete(cached[elementName]);
	// };



	return {
		getDefaultPage: function() {
			return defaultPage;
		},
		setDataObj: function(__dataObj) {
			dataObj = __dataObj;
		},
		setShowAlignment: function(flag) {
			showAlignmnet = flag;
		},
		getShowAlignment: function() {
			return showAlignment;
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
			content_div.addClass("tab-content");
			var list = jQuery('<ul/>');
			list.addClass("nav nav-pills nav-tabs");
			list.append('<li class="disabled"><a href="#">Domains:</a> </li>')

			// var domains = ["arch", "bact", "euka", "plant", "animal", "proka"];
			var domains = ["arch", "bact", "euka"];
			for (var i in domains) {
				var _curr_div;
				var _curr_li = jQuery('<li><a data-toggle="tab" href="#' + domains[i] + '_localisation_container">' + SUBCELL_VIEW.getDomainFullName(domains[i]) + '</a></li>');
				var prediction = dataObj.getSubCellLocations(domains[i]);
				if (!prediction) _curr_div = jQuery("<div />").text("Data unavailable");
				else _curr_div = SUBCELL_VIEW.localisationDiv(prediction);
				_curr_div.addClass("tab-pane");
				list.append(_curr_li);
				content_div.append(_curr_div);
			}
			nav_div.append(list);
			jQuery("#" + targetDiv).append("<h3> Sub-cellular Localization Prediction</h3>");
			jQuery("#" + targetDiv).append(nav_div);

			jQuery("#" + targetDiv).append(content_div);
			jQuery('#_subcell_nav a:last').tab('show');

			return (jQuery("#" + targetDiv)).html();
		},

		// drawSSViewer: function(targetDiv) {
		// 	return PAGE.drawFeatureViewer({
		// 		targetDiv: targetDiv,
		// 		providers: ["PROFsec"]
		// 	});
		// },
		// drawTransmembraneViewer: function(targetDiv) {
		// 	return PAGE.drawFeatureViewer(targetDiv);
		// },
		// drawDisorderViewer: function(targetDiv) {
		// 	return PAGE.drawFeatureViewer(targetDiv);
		// },
		// drawBindingViewer: function(targetDiv) {
		// 	return PAGE.drawFeatureViewer(targetDiv);
		// },
		// drawTMBViewer: function(targetDiv) {
		// 	return PAGE.drawFeatureViewer(targetDiv);
		// },
		// drawDisulphideViewer: function(targetDiv) {
		// 	return PAGE.drawFeatureViewer(targetDiv);
		// },
		draw: function() {
			loadingDiv.show();
			mainContainerDiv.empty();
			var pagePath = 'html/' + currentPage + ".html";

			var getComponent = function(component) {
				var element;
				if (!isCached(component)) {
					var fnName = "draw" + component;
					element = fnName.call(this, component + "Container");
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
};