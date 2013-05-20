var PAGE = function(argument) {

	var activeDivs = [],
		inactiveDivs = [],
		cached = {},
		pageComponents = {
			Dashboard: [{
				FeatureViewer: {
					showAlignment: true
				}
			},
			// 'SubcellLocViewer',
			'SummaryTable',
				'SequenceViewer',
				'AlignmentTable',
				'AlignmentPDBTable',
				'AAConsistency',
				'SSConsistency', ],
			SecondaryStructure: [{
				FeatureViewer: {
					providers: ["PROFsec"],
					showAlignment: false
				}
			}, {
				'SSConsistency': '',

			}, 'SolvAcc'],
			Transmembrane: [{
				'FeatureViewer': {
					providers: ["PHDhtm"],
					showAlignment: false
				}
			}],
			Disorder: [{
				'FeatureViewer': {
					providers: ["PROFbval", "MD", "Ucon", "NORSnet"],
					showAlignment: false
				}
			}],
			Binding: [{
				'FeatureViewer': {
					providers: ["ISIS"],
					showAlignment: false
				}
			}],
			TMB: [{
				'FeatureViewer': {
					providers: ["PROFtmb"],
					showAlignment: false
				}
			}],
			Disulphide: [{
				'FeatureViewer': {
					providers: ["DISULFIND"],
					showAlignment: false
				}
			}],
			Heatmap: [
				'HeatmapViewer'],
			SubcellLoc: [
				"SubcellLocViewer"]
		},
		defaultPage = "Dashboard",
		currentPage,
		mainContainerDiv = jQuery("#content"),
		loadingDiv = jQuery(".load-div"),
		dataObj,
		providers,
		showAlignment;

    var navBar = {
	Dashboard: {
	    targetDiv: ".navbar",
	    items: [{
		'Export': [{
		    name: 'allExport',
		    text: "Download All Data Files",
		    func: "APP.exportALL();"
		}, {
		    name: 'xmlExport',
		    text: "Download in XML format",
		    func: "APP.exportXML();"
		}, {
		    name: 'jsonExport',
		    text: "Download in JSON format",
		    func: "APP.exportJson();"
		}]
	    }, {
		'Email': 'nothing'
	    }]
	},
	SecondaryStructure: {
	    targetDiv: ".navbar",
	    items: [{
		'Export': [{
		    name: 'allExport',
		    text: "Download Raw Data File",
		    func: "APP.export('PROFsec');"
		}, {
		    name: 'xmlExport',
		    text: "Download in XML format",
		    func: "APP.exportXML();"
		}, {
		    name: 'jsonExport',
		    text: "Download in JSON format",
		    func: "APP.exportJson();"
		}]
	    }, {
		'Email': 'nothing'
	    }]
	}
    };

	(argument.page) ? currentPage = argument.page : currentPage = defaultPage;
	(argument.providers) ? providers = argument.providers : providers = [];
	(argument.showAlignment) ? showAlignment = argument.showAlignment : showAlignment = false;

	if (!dataObj) dataObj = argument.data;

	var isCached = function(elementName) {
		if (cached[elementName]) return true;
		return false;
	};

	var cacheFetch = function(elementName) {
		return (cached[elementName]);
	};

	var cacheStore = function(elementName, element) {
		cached[elementName] = element;
	};


	var cacheRemove = function(elementName) {
		delete(cached[elementName]);
	};

	var visualComponents = {
		drawSequenceViewer: function(argument) {
			sv = new SEQUENCE_VIEWER({
				targetDiv: argument.targetDiv,
				sequence: dataObj.getSequence()
			});
		},
		drawAlignmentTable: function(argument) {
			targetDiv = argument.targetDiv;
			ALI_VIEW.draw(dataObj.getAlignmentLocations(), jQuery("#" + targetDiv));
		},

		drawAlignmentPDBTable: function(argument) {
			targetDiv = argument.targetDiv;
			arrAlignments = dataObj.getAlignmentLocations("pdb");
			if (arrAlignments.length > 0) ALI_VIEW.draw(arrAlignments, jQuery("#" + targetDiv));
		},

		drawAAConsistency: function(argument) {
			targetDiv = argument.targetDiv;
			jQuery("#" + targetDiv).append("<h3>Amino Acid composition</h3>");
			PIE_CHART.toPieData(dataObj.getAAComposition()).drawPieChart(targetDiv);
		},
		drawHeatmapViewer: function(argument) {

			var dataToFetch = 'http://rostlab.org/~roos//get/snap/json/?md5=' + dataObj.getMD5Seq();

			jQuery.getJSON('proxy.php', {
				url: dataToFetch
			},

			function(arr) {
				jQuery("#heatmap").empty();
				jQuery("#zoom").empty();
				console.log(arr);
			    dataObj  = arr.contents;
				var hm = new HEAT_MAP({
					targetDiv: "heatmap",
					dataObj: dataObj
				});
				var increments = Math.floor((dataObj.length / 20) * .1);
				var start, end, zoom;

				jQuery(function() {
					jQuery("#slider").slider({
						animate: "fast",
						value: 0,
						min: 0,
						max: ((dataObj.length) / 20) - increments,
						step: increments,
						slide: function(event, ui) {
							start = ui.value;
							jQuery("#start").text(start);
							((start + increments) > (dataObj.length / 20)) ? end = dataObj.length / 20 : end = start + increments;
							jQuery("#end").text(end);
							jQuery("#zoom").empty();
							zoom = new HEAT_MAP({
								targetDiv: "zoom",
								dataObj: dataObj,
								startPoint: start,
								increments: increments
							});
						}
					});
					start = jQuery("#slider").slider("value");
					jQuery("#start").text(start);
					((start + increments) > (dataObj.length / 20)) ? end = dataObj.length / 20 : end = start + increments;
					jQuery("#end").text(end);
					zoom = new HEAT_MAP({
						targetDiv: "zoom",
						dataObj: dataObj,
						startPoint: start,
						increments: increments
					});
				});


			});
		},
		drawFeatureViewer: function(argument) {
			if (!argument.providers) argument.providers = APP.providers;

			var fv = new FEATURE_VIEWER({
				targetDiv: argument.targetDiv,
				dataObj: dataObj,
				providers: argument.providers,
				showAlignment: argument.showAlignment
			});
			fv.setup();
			fv.draw();
		},
		drawSSConsistency: function(argument) {
			targetDiv = argument.targetDiv;
			jQuery("#" + targetDiv).append("<h3>Secondary Structure composition</h3>");
			PIE_CHART.toPieData(dataObj.getSSComposition()).drawPieChart(targetDiv);
		},

		drawSolvAcc: function(argument) {
			targetDiv = argument.targetDiv;
			jQuery("#" + targetDiv).append("<h3>Solvent Accessibility</h3>");
			PIE_CHART.toPieData(dataObj.getSolvAccComposition()).drawPieChart(targetDiv);
		},


		drawSummaryTable: function(argument) {
			targetDiv = argument.targetDiv;

			jQuery("#" + targetDiv).append("<h3>Summary</h3>");
			var table = jQuery("<table/>");
			table.addClass("table table-striped");
			if (_rec_name = dataObj.getAlignmentsByDatabaseTopMatch('Swiss-Prot')) {
				var url = 'http://www.uniprot.org/uniprot/' + _rec_name;
				var link = jQuery('<a>', {
					text: _rec_name,
					title: _rec_name,
					href: "#",
					click: function() {
						console.log(this);
						window.open(url, '_blank');
						window.focus;
					}
				});
				table.append(jQuery('<tr/>')
					.append(jQuery('<td/>').text('Recommended Name'))
					.append(jQuery('<td/>').append(link)));
			}

			seqModal = new MODAL({
				modalName: 'SequenceViewer',
				modalTitle: "Query Sequence"
			});
			pdbModal = new MODAL({
				modalName: 'AlignmentPDBTable',
				modalTitle: "Aligned Structures"
			});
			aliModal = new MODAL({
				modalName: 'AlignmentTable',
				modalTitle: "Aligned Proteins"
			});
			table.append("<tr><td>Sequence Length</td><td><a href='#SequenceViewer' role='button' data-toggle='modal'>" + dataObj.getSequence().length + "</a></td></tr>");
			table.append("<tr><td>Number of Aligned Proteins</td><td><a href='#AlignmentTable' role='button' data-toggle='modal'>" + dataObj.getAlignmentsCount() + "</a></td></tr>");
			arrAlignments = dataObj.getAlignmentsByDatabase('pdb');
			if (arrAlignments.length > 0) table.append("<tr><td>Number of Matched PDB Structures</td><td><a href='#AlignmentPDBTable' role='button' data-toggle='modal'>" + arrAlignments + "<a/></td></tr>");
			jQuery("#" + targetDiv).append(table);

			return (jQuery("#" + targetDiv)).html();
		},

		drawSubcellLocViewer: function(argument) {
			targetDiv = argument.targetDiv;
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

			// jQuery("#" + targetDiv).append("<h3> Sub-cellular Localization Prediction</h3>");
			jQuery("#" + targetDiv).append(nav_div);

			jQuery("#" + targetDiv).append(content_div);
			jQuery('#_subcell_nav a:last').tab('show');

			return (jQuery("#" + targetDiv)).html();
		}
	};


	var getComponent = function(component, config) {
		var element;

		if (!config) var config = {};
		jQuery.extend(config, {
			targetDiv: component + "Container"
		});

		if (!isCached(component)) {
			var fnName = "draw" + component;
			element = visualComponents[fnName].call(this, config);
			if (element) cacheStore(component, element);

		} else {
			element = cacheFetch(component);
		}
		return element;
	};

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

		draw: function() {
			loadingDiv.show();
			mainContainerDiv.empty();
			jQuery(".modal").remove();
			var pagePath = APP.path + 'html/' + currentPage + ".html";
			var config = undefined;

			if (!isCached(currentPage)) {
				jQuery.get(pagePath)
					.done(function(pageHTML) {
					mainContainerDiv.append(pageHTML);

					if (navBar[currentPage])
					    var nb = new NAVBAR (navBar[currentPage]);

					cacheStore(currentPage, pageHTML);
					jQuery.each(pageComponents[currentPage], function(i, component) {
						if (typeof component === 'object') {
							config = component[Object.keys(component)];
							component = Object.keys(component)[0];
						}
						var element = getComponent(component, config);
						if (element) jQuery("#" + component + "Container", mainContainerDiv).html(element);
					});
				});
			} else {
				var pageHTML = cacheFetch(currentPage)
				mainContainerDiv.append(pageHTML);

				jQuery.each(pageComponents[currentPage], function(i, component) {
					var element = _getComponent(component);
					if (element) jQuery("#" + component + "Container", mainContainerDiv).html(element);
				});
			}
			loadingDiv.hide();
		}
	}
};