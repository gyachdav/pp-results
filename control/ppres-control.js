var APP = (function() {

	var json,
	ds,
	file_specs = {
		path: ".",
		name: "examples/source.xml",
		type: 'xml'
	}, debug = 0,
		mainObj = new PPResData();


	return {

		

		drawFeatureViewer: function (){
			FEATURE_VIEWER.init( 	{	targetDiv: jQuery("#FeatureViewer"), dataObj: mainObj }	);
			FEATURE_VIEWER.draw();
		},

		populateData: function ( data ){
			json = jQuery.xml2json(data);
			ds.file_type = 'json'; //switch to json
			ds.populateData(json);
			
			mainObj.setJsonData(ds.getData());
		},

		init: function () {
			ds = new dataSource(file_specs);
			result = ds.loadData();
			result.done( [ this.populateData, this.drawFeatureViewer] ) ;
		},
		toggleDebug: function() {
			debug = !debug;
		},
		getDataObj: function() {
			return mainObj;
		},

		dump : function(){
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
		}
	};

})();



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
		"PROFtmb"
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
		console.log(mainObj.getReferenceByProvider("PROFtmb"));
		console.log(mainObj.getSSComposition());
		console.log(mainObj.getAAComposition());
		target_div.append('<p>' + mainObj.getSequence() + '</p>');
		target_div.append('<p>Seq len: ' + mainObj.getSequence().length + '</p>');
		target_div.append('<p>Protein Name: ' + mainObj.getProteinName() + '</p>');
		target_div.append('<p>Organism Name: ' + mainObj.getOrganismName() + '</p>');
		target_div.append('<p>Number of aligments: ' + mainObj.getAlignmentsCount() + '</p>');
		jQuery.each(['PDB', 'Swiss-Prot', 'trembl'], function(index, val) {
			target_div.append('<p>Number of hits from ' + val + ": " + mainObj.getAlignmentsByDatabase(val) + '</p>');
		});

		jQuery.each(providers, function(i, v) {
			feature = mainObj.getFeatureByProvider(mainObj.getFeatureTypeGroup(), v);
			target_div.append('<h1>' + v + '</h1>');
			target_div.append(JSON.stringify(mainObj.getFeatureLocations(feature)));
		});
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

