var APP = (function() {

	var req_id = jQuery("#req_id").val();
	if (!req_id)
		req_id = 70; 

	var json,
	ds,
<<<<<<< HEAD
	file_specs = {
		path: "http://pp-dev.informatik.tu-muenchen.de",
		name: 'xml_results?req_id='+req_id,
		type: 'xml'
	}, debug = 0,
		mainObj = new PPResData();


	// file_specs = {
	// 	path: "examples",
	// 	name: 'source.xml',
	// 	type: 'xml'
	// }, debug = 0,
	// 	mainObj = new PPResData();

=======
	 file_specs = {
	 	path: "http://pp-dev.informatik.tu-muenchen.de",
	 	name: 'xml_results?req_id='+req_id,
	 	type: 'xml'
	 }, debug = 0,
	 	mainObj = new PPResData();


>>>>>>> d369e53851cf42cf72b11e0201acbfd6e9d2f346
	NAVIGATION_DIV = "#nav";


	jQuery.noConflict(); // recommended to avoid conflict wiht other libs
	NAVIGATION.setActiveItem(2);
	NAVIGATION.show(jQuery(NAVIGATION_DIV));

	listener = new Listeners();

	mainObj.loadData(file_specs).done(function(data) {
		mainObj.populateData(data);
		page = new PAGE({
			data: mainObj,
			providers: APP.providers,
			showAlignment: true
		}).draw();
		listener.setUp();
	});

	return {
	    export: function(){
		var urlBase = 'http://rostlab.org/~roos/get/ppc/tar.gz/';
		var urlParam = 'md5';
		var urlREST = urlBase + "?" + urlParam + "=" +mainObj.getMD5();
		window.open(urlREST);
	    },
		exportXML: function(){
			var string = (new XMLSerializer()).serializeToString(mainObj.getXMLData() );
			var w = window.open('data:text/xml,' + string);
		},
		exportJSON: function(){
			var w = window.open('');
			jQuery(w.document.body).html( JSON.stringify( mainObj.getJsonData()) );
		},
		populateData: function(data) {
			json = jQuery.xml2json(data);
			ds.file_type = 'json'; //switch to json
			ds.populateData(json);
			mainObj.setJsonData(ds.getData());
		},
		toggleDebug: function() {
			debug = !debug;
		},
		getDataObj: function() {
			return mainObj;
		},
		dump: function() {
			console.log(ds.getData());
			console.log(mainObj.getAlignmentLocations());
			console.log(mainObj.getReferenceByProvider("PROFtmb"));
			console.log(mainObj.getSSComposition());
			console.log(mainObj.getAAComposition());
			console.log(mainObj.getSequence());
			console.log(mainObj.getSequence().length + '</p>');
			console.log(mainObj.getProteinName() + '</p>');
			console.log(mainObj.getOrganismName() + '</p>');
			console.log(mainObj.getAlignmentsCount() + '</p>');
			jQuery.each(['PDB', 'Swiss-Prot', 'trembl'], function(index, val) {
				console.log("Number of hits from " + val + ": " + mainObj.getAlignmentsByDatabase(val));
			});

			jQuery.each(providers, function(i, v) {
				feature = mainObj.getFeatureByProvider(mainObj.getFeatureTypeGroup(), v);
				console.log('<h1>' + v + '</h1>');
				console.log((JSON.stringify(mainObj.getFeatureLocations(feature))));
			});
		},
		showPage: function(action, target_div) {
			if (!target_div) target_div = jQuery("#content");
			switch (action) {
				case 'dash':
					page = new PAGE({
						data: mainObj
					}).draw();
					break;
				case 'secstruct':
					page = new PAGE({
						page: "SecondaryStructure",
						data: mainObj
					}).draw();
					break;
				case 'tmh':
					page = new PAGE({
						page: "Transmembrane",
						data: mainObj
					}).draw();
					break;
				case 'disorder':
					page = new PAGE({
						page: "Disorder",
						data: mainObj
					}).draw();
					break;
				case 'binding':
					page = new PAGE({
						page: "Binding",
						data: mainObj
					}).draw();
					break;
				case 'tmb':
					page = new PAGE({
						page: "TMB",
						data: mainObj
					}).draw();
					break;
				case 'disulphide':
					page = new PAGE({
						page: "Disulphide",
						data: mainObj
					}).draw();
					break;
				case 'subcell':
					page = new PAGE({
						page: "SubcellLoc",
						data: mainObj
					}).draw();
					break;
				case 'func':
					page = new PAGE({
						page: "Heatmap",
						data: mainObj
					}).draw();
					break;
				case 'tutorial':
					target_div.html('<iframe src="http://prezi.com/embed/vg4s_lhh2gal/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;features=undefined&amp;disabled_features=undefined" width="550" height="400" frameBorder="0"></iframe>');
					break;

				default:
					target_div.children().hide();
					target_div.html(action);
			}
		}
	};
})();

APP.path = '/ppres/';
<<<<<<< HEAD
// APP.path = '/~guyyachdav/pp-results/';
=======

>>>>>>> d369e53851cf42cf72b11e0201acbfd6e9d2f346


APP.providers = [
	"PROFsec",
	"PROFacc",
	"PHDhtm",
	"ISIS",
	"DISIS",
	"ASP",
	"DISULFIND",
	"PredictNLS",
	"NORSnet",
	"PROFbval",
	"Ucon",
	"MD",
	"PROFtmb"];



function Listeners() {
	return {
		setUp: function() {
			jQuery(".nav-link").click(function() {
				APP.showPage(jQuery(this).parent().attr('id'));
				jQuery(".nav-list").children(".active").removeClass("active");
				jQuery(this).parent().addClass("active");
				// console.log(jQuery(this).parent().attr('id'));
				return false;
			});
		}
	}
}


// INDEXOF support
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {
		"use strict";
		if (this == null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}
		var n = 0;
		if (arguments.length > 1) {
			n = Number(arguments[1]);
			if (n != n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n != 0 && n != Infinity && n != -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	}
}
// App Class
// OBsolete

function Demo(target_div) {
	this.dataSource = {
		path: ".",
		name: "examples/source.xml",
		type: 'xml'
	};

	var providers = [
		"PROFsec",
		"PROFacc",
		"NORSnet",
		"ISIS",
		"DISIS",
		"ASP",
		"DISULFIND",
		"PredictNLS",
		"PHDhtm",
		"PROFbval",
		"Ucon",
		"MD",
		"PROFtmb",
		"LOCtree"];


	// // This block test data loading and parsing all features
	ds = new dataSource(this.dataSource);
	result = ds.loadData();
	result.done(function(data) {
		json = jQuery.xml2json(data);
		ds.file_type = 'json'; //switch to json
		ds.populateData(json);
		console.log(ds.getData());
		mainObj = new PPResData();
		mainObj.setJsonData(ds.getData());
		console.log(mainObj.getAlignmentLocations());
		//console.log ( SUBCELL_VIEW.init(   mainObj.getSubCellLocations()) );
		SUBCELL_VIEW.init(mainObj.getSubCellLocations(), target_div);
		SUBCELL_VIEW.localisationDiv(mainObj.getSubCellLocations("euka"), target_div)
		console.log(mainObj.getSubCellLocations("animal"));

		// target_div.append('<p>' + mainObj.getSequence() + '</p>');
		// target_div.append('<p>Seq len: ' + mainObj.getSequence().length + '</p>');

		// jQuery.each(providers, function(i, v) {
		// 	feature = mainObj.getFeatureByProvider(mainObj.getFeatureTypeGroup(), v);
		// 	target_div.append('<h1>' + v + '</h1>');
		// 	target_div.append(JSON.stringify(mainObj.getFeatureLocations(feature)));

		// });
	});
	// END TEST BLOCK

	this.getPPFeatures = function() {
		return (this.pp_features);
	}
	this.addPPFeatures = function(feature) {
		this.pp_features.push(feature);
	}
	this.getMainObj = function() {
		return this.mainObj;
	}
}