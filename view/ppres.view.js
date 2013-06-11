var PAGE = function(argument) {

	var activeDivs = [],
		inactiveDivs = [],
		cached = {},
		quotes = [],
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
					'SSConsistency',
					'Quotes',
			],
			SecondaryStructure: [{
					FeatureViewer: {
						providers: ["PROFsec", "PROFAcc", "ASP", "PROFtmb"],
						showAlignment: false
					}
				}, {
					'SSConsistency': '',

				}, 'SolvAcc',
					'Quotes',
			],
			Transmembrane: [{
					'FeatureViewer': {
						providers: ["PHDhtm"],
						showAlignment: false
					}
				}, 'Quotes',
			],
			Disorder: [{
					'FeatureViewer': {
						providers: ["PROFbval", "MD", "Ucon", "NORSnet"],
						showAlignment: false
					}
				}, 'Quotes'
			],
			Binding: [{
					'FeatureViewer': {
						providers: ["ISIS", "DISIS"],
						showAlignment: false
					}
				}, 'Quotes',
			],
			Disulphide: [{
					'FeatureViewer': {
						providers: ["DISULFIND"],
						showAlignment: false
					}
				}, 'Quotes',
			],
			Heatmap: [
					'HeatmapViewer'
			],
			SubcellLoc: [
					"SubcellLocViewer",
					'Quotes'
			],
			GOAnnot: [
							"GOAnnotViewer",
							'Quotes'
					]
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
							func: "exportALL"
						}, {
							name: 'xmlExport',
							text: "Download in XML format",
							func: "exportXML"
						}, {
							name: 'jsonExport',
							text: "Download in JSON format",
							func: "exportJSON"
						}
					]
				}, {
					'Email': 'nothing'
				}
			]
		},
		SecondaryStructure: {
			targetDiv: ".navbar",
			items: [{
					'Export': [{
							name: 'secstructExport',
							text: "Download Raw Data File",
							func: "exportMethod",
							params: ["profRdb"]
						}, {
							name: 'jsonExport',
							text: "Download in JSON format",
							func: "exportJSON",
							params: ['PROFsec']
						}
					]
				}, {
					'Email': 'nothing'
				}
			]
		},
		Transmembrane: {
			targetDiv: ".navbar",
			items: [{
					'Export': [{
							name: 'htmExport',
							text: "Download Raw Data File",
							func: "exportMethod",
							params: ["reprof"]
						}, {
							name: 'jsonExport',
							text: "Download in JSON format",
							func: "exportJSON",
							params: ['PHDhtm']
						}
					]
				}, {
					'Email': 'nothing'
				}
			]
		},

		Disorder: {
			targetDiv: ".navbar",
			items: [{
					'Export': [{
							name: 'disorderExport',
							text: "Download Raw Data File",
							func: "exportMethod",
							params: ["mdisorder"]
						}, {
							name: 'jsonExport',
							text: "Download PROFbval prediction in JSON format",
							func: "exportJSON",
							params: ['PROFbval']
						}, {
							name: 'jsonExport',
							text: "Download UCON prediction in JSON format",
							func: "exportJSON",
							params: ['UCON']
						}, {
							name: 'jsonExport',
							text: "Download NORSnet prediction in JSON format",
							func: "exportJSON",
							params: ['NORSnet']
						}, {
							name: 'jsonExport',
							text: "Download MetaDisorder prediction in JSON format",
							func: "exportJSON",
							params: ['MD']
						}
					]
				}, {
					'Email': 'nothing'
				}
			]
		},
		Disulphide: {
			targetDiv: ".navbar",
			items: [{
					'Export': [{
							name: 'htmExport',
							text: "Download Raw Data File",
							func: "exportMethod",
							params: ["disulfinder"]
						}, {
							name: 'jsonExport',
							text: "Download DISULFIND prediction in JSON format",
							func: "exportJSON",
							params: ['DISULFIND']
						}
					]
				}, {
					'Email': 'nothing'
				}
			]
		},
		Binding: {
			targetDiv: ".navbar",
			items: [{
					'Export': [{
							name: 'isisExport',
							text: "Download Raw Data File",
							func: "exportMethod",
							params: ["isis"]
						}, {
							name: 'jsonExport',
							text: "Download ISIS prediction in JSON format",
							func: "exportJSON",
							params: ['ISIS']
						}
					]
				}, {
					'Email': 'nothing'
				}
			]
		},
		SubcellLoc: {
			targetDiv: ".navbar",
			items: [{
					'Export': [{
							name: 'subcellExport',
							text: "Download Raw Data File",
							func: "exportMethod",
							params: ["lc2"]
						}, {
							name: 'jsonExport',
							text: "Download LocTree2 prediction in JSON format",
							func: "exportJSON",
							params: ['LocTree2']
						}
					]
				}, {
					'Email': 'nothing'
				}
			]
		},
		GOAnnot: {
			targetDiv: ".navbar",
			items: [{
					'Export': [{
							name: 'goannotExport',
							text: "Download Raw Data File",
							func: "exportMethod",
							params: ["metastudent"]
						}, {
							name: 'jsonExport',
							text: "Download Metastudent prediction in JSON format",
							func: "exportJSON",
							params: ['Metastudent']
						}
					]
				}, {
					'Email': 'nothing'
				}
			]
		},
		Heatmap: {
			targetDiv: ".navbar",
			items: [{
					'Export': [{
							name: 'heatmapExport',
							text: "Download Raw Data File",
							func: "exportMethod",
							params: ["snap"]
						}
					]
				}, {
					'Email': 'nothing'
				}
			]
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
				dataObj = arr.contents;
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
			// TODO this wil have to be refactored so the reference object is retrieve via the getReferenceByProvider in the ppres.data class
			if (  argument.showAlignment )
				quotes.push( dataObj.getReference(dataObj.getJsonData().entry.aliProviderGroup.ref));

			if (!argument.providers) argument.providers = APP.providers;

			i = argument.providers.length;
			while (i--)
				quotes.push(dataObj.getReferenceByProvider(argument.providers[i]));

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

		drawQuotes: function(argument) {

			var pleaseCite = 'If you find any of the above annotations useful in your research please cite the relevant method:';

			targetDiv = argument.targetDiv;

			i = quotes.length;
			var refList = jQuery('<div>').addClass('alert alert-info').append(jQuery('<p/>').text(pleaseCite).addClass('text-error'));
			while (i--) {
				if (quotes[i]){
				refList.append(
					jQuery('<ul/>')
				   
					.append(jQuery('<li/>')
					.append(jQuery('<strong/>').text(' "' + quotes[i].citation.title + '" '))
					.append(jQuery('<span>').text(jQuery.map(quotes[i].citation.authorList.person, function(n, i) {
					return n.name;
					}).join(', ')))

				.append(jQuery('<span/>').text(' ' + quotes[i].citation.name +
					' ' + quotes[i].citation.volume + ': ' +
					quotes[i].citation.first + '-' + quotes[i].citation.last + ' ' + '(' + quotes[i].citation.date + ')'))));
				}
			}



			var accordionContainer = jQuery('<div/>').addClass('accordion').attr('id', 'referencesInfo');
			var accordionGroup = jQuery('<div/>').addClass('accordion-group');
			var accordionHeader = jQuery('<div/>').addClass('accordion-heading')
				.append(jQuery('<a/>').addClass('accordion-toggle').attr('data-toggle', 'collapse').attr('data-parent', '#referencesInfo').attr('href', '#referencesInfoList')
				.append(jQuery('<span/>').text('References (Click to Exapnd)')));
			var accordionInner = jQuery('<div>').attr('id', 'referencesInfoList').addClass('accordion-body collapse')
									.append(jQuery('<div>').addClass('accordion-inner')
										.append(refList));
		 	accordionContainer.append(accordionGroup.append(accordionHeader)).append(accordionInner);
			jQuery("#" + targetDiv).append(accordionContainer);

			//jQuery("#" + targetDiv).addClass('alert alert-warning');

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
						//console.log(this);
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
			if (arrAlignments > 0) table.append("<tr><td>Number of Matched PDB Structures</td><td><a href='#AlignmentPDBTable' role='button' data-toggle='modal'>" + arrAlignments + "<a/></td></tr>");
			jQuery("#" + targetDiv).append(table);

			return (jQuery("#" + targetDiv)).html();
		},

		drawSubcellLocViewer: function(argument) {
			targetDiv = argument.targetDiv;
			quotes.push(dataObj.getReferenceByProvider('LocTree2'));


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
				content_div.append(_curr_div);
				if (domains[i] == 'euka') {
					_curr_li.addClass('active');
					_curr_div.addClass('active');
				}
				list.append(_curr_li);

			}
			nav_div.append(list);

			jQuery("#" + targetDiv).append(nav_div);
			jQuery("#" + targetDiv).append(content_div);

			return (jQuery("#" + targetDiv)).html();
		},
	   
	   
		drawGOAnnotViewer: function(argument) {
			targetDiv = argument.targetDiv;
		   
			quotes.push(dataObj.getReferenceByProvider('Metastudent'));
		   
			GOANNOT_VIEW.renderGoAnnotHTML(dataObj, targetDiv);
			
			targetDivCopy = targetDiv

			jQuery( "#_goannot_cntnt_img" ).hide();

			jQuery((jQuery('.tableHolder').get().reverse())).each(function () {
				var holder = jQuery(this);

				var isEmpty = jQuery("td", holder.children("table")).length == 0;
				
				if (!isEmpty)
				{
					holder.children("table").tablesorter({
						sortList: [
								   [3, 3]
								   ],
								   headers: {0: {sorter: false},1: {sorter: false}, 5: {sorter: false}}
					});
				
					jQuery(this).children("table").tablesorterPager({
						container: holder.children(".pager"),
						toggler: jQuery(".allToggler", holder)
					});
				}
				var refreshorForm =  jQuery(".refreshorForm", jQuery(".refreshor", holder));
				var onto = refreshorForm.attr("name");

				refreshorForm.submit(function() {
					if (!isEmpty)
					{
						GOANNOT_VIEW.renderImage(holder.children("table"), onto, targetDivCopy, jQuery('.tableHolder')[0] == holder[0]  );
					}
					else
					{
						jQuery(("#" + onto + "_img_container")).text("n/a");
					}
					return false;
				});


				jQuery( ("[name=goSel" + onto + "]") ).each(function(){
					jQuery(this).change( function() {

						jQuery( ( "#showButton" + onto ) ).show();

					});
				});

				jQuery(".refreshorForm", jQuery(".refreshor", holder)).submit();
			});

			jQuery( "#_goannot_cntnt_img" ).show();
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

					var nc = new NAME_CHANGE({
						targetDiv: jQuery('.job-name'),
						dataObj: dataObj
					});

					if (navBar[currentPage])
						var nb = new NAVBAR(navBar[currentPage]);

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