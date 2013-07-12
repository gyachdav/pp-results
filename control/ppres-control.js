var EXPORT = function(argument) {
	var exportALL = function() {
		var urlBase = '/~roos/get/ppc/tar.gz/';
		var urlParam = 'md5';
		var urlREST = urlBase + "?" + urlParam + "=" + APP.getDataObj().getMD5Seq();
	    if (APP.getDataObj().getProteinName())
	        urlREST += '&filename=predictprotein_'+ APP.getDataObj().getProteinName()+'.tar.gz';
		window.open(urlREST);
	};

	var exportMethod = function(methodName) {
		//http://rostlab.org/~roos/get/reprof/?md5=0ffaf7ed79c69f9db1c6fe1440558d57
		var urlBase = '/~roos/get/';
		urlBase += methodName + '/';
		var urlParam = 'md5';
		var urlREST = urlBase + "?" + urlParam + "=" + APP.getDataObj().getMD5Seq();
	    jQuery.get('proxy.php',{url:urlREST}, function( data ){
		window.open('data:Application/octet-stream;filename=file.'+methodName+',' + encodeURIComponent(data));
//		window.open('data:application/octet-stream;', data);
	    }, 'text');
	};



	exportXML = function(predType) {
		var string;
		if (predType) {
			string = jQuery(APP.getDataObj().getXMLData()).find(predType);
			string = (new XMLSerializer()).serializeToString(string);
		} else
			string = (new XMLSerializer()).serializeToString(APP.getDataObj().getXMLData());

		console.log(string);
		var w = window.open('data:text/xml,' + string);
	};
	exportJSON = function(methodName) {
		var w = window.open('');
		if (methodName)
			jQuery(w.document.body).html(JSON.stringify(
				APP.getDataObj().getFeatureByProvider(APP.getDataObj().getFeatureTypeGroup(), methodName)));
		else
			jQuery(w.document.body).html(JSON.stringify(APP.getDataObj().getJsonData()));
	};

	return {
		exportALL: exportALL,
		exportMethod: exportMethod,
		exportJSON: exportJSON,
		exportXML: exportXML
	};
}

var POPOVER = function (button){
    var popOverPageIntro = function (){
	button.attr('rel','popover').attr('data-content','blah blah').attr('data-original-title','What is Presented in This Page').popover();
    };
    return{
	popOverPageIntro:popOverPageIntro
    };
}



var APP = (function() {

	var req_id = jQuery("#req_id").val();
	var req_name = jQuery("#req_name").val();

	if (!req_id) req_id = 70;

	var json,
		ds,
		debug = 0,
		file_specs = {
		 	//path: "http://pp-dev.informatik.tu-muenchen.de",
		 	path: "https://dl.dropboxusercontent.com", //"localhost:",
		 	name: '/u/51598079/xml_results', //'//'xml_results?req_id=' + req_id,
		 	type: 'xml'
		 },
		mainObj = new PPResData();

	NAVIGATION_DIV = "#nav";


	jQuery.noConflict(); // recommended to avoid conflict wiht other libs
	NAVIGATION.setActiveItem(2);
	NAVIGATION.show(jQuery(NAVIGATION_DIV));

	listener = new Listeners();

	mainObj.loadData(file_specs).done(function(data) {
		mainObj.populateData(data, req_id, req_name);
		page = new PAGE({
			data: mainObj,
			providers: APP.providers,
			showAlignment: true
		}).draw();
		listener.setUp();
	});


	return {

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
				case 'goannotation':
					page = new PAGE({
						page: "GOAnnot",
						data: mainObj
					}).draw();
					
					break;
				case 'tutorial':
					page = new PAGE({
						page: "Tutorial",
						data: mainObj
					}).draw();
					break;

				default:
					target_div.children().hide();
					target_div.html(action);
			}
		}
	};
})();

APP.path = 'Users/jmcejuela/git/pp-results/ppres/';



APP.providers = [
		"PROFsec",
		"PROFAcc",
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
		"PROFtmb",
		"Metastudent"
];



function Listeners() {
	return {
		setUp: function() {
			jQuery(".nav-link").click(function() {
				APP.showPage(jQuery(this).parent().attr('id'));
				jQuery(".nav-list").children(".active").removeClass("active");
				jQuery(this).parent().addClass("active");
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
			"LOCtree",
			"Metastudent"
	];


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
