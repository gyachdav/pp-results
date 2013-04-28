var APP = (function() {

	var json,
	ds,
	file_specs = {
		path: ".",
		name: "examples/source.xml",
		type: 'xml'
	}, debug = 0,
		mainObj = new PPResData(),
		providers = [
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
			"PROFtmb"],
		providers_specs = {
			"PROFsec": {
				color: "blue"
			},
			"PROFacc": {
				color: "magenta"
			},
			"NORSnet": {
				color: "gray"
			},
			"ISIS": {
				color: "red"
			},
			"DISIS": {
				color: "pink"
			},
			"ASP": {
				color: "green"
			},
			"DISULFIND": {
				color: "brwon"
			},
			// "PredictNLS",
			"PHDhtm": {
				color: "purple"
			},
			"PROFbval": {
				color: "yellow"
			},
			"Ucon": {
				color: "orange"
			},
			"MD": {
				color: "#225533"
			}


		};


	return {

		drawCell: function() {
			 function preload(arrImg) {
				jQuery(arrImg).each(function() {
					jQuery('<img />').attr('src', this).appendTo('#cell').css('display', 'none');
				});
			};

			preload(['assets/EukaryoticCell/chloroplast.PNG', 'assets/EukaryoticCell/chloroplast_membrane.PNG', 'assets/EukaryoticCell/peroxisome.PNG']);
			jQuery('img').first().show();
		},

		drawSummaryTable: function() {
			jQuery("#summary_container").append("<div class='summary pie container-left' />");
			jQuery(".summary").append("<h3>Summary</h3>");
			jQuery(".summary").append("<tr><td>Recommended Name</td><td>" + mainObj.getAlignmentsByDatabaseTopMatch('Swiss-Prot') + "</td></tr>");
			jQuery(".summary").append("<tr><td>Sequence Length</td><td>" + mainObj.getSequence().length + "</td></tr>");
			jQuery(".summary").append("<tr><td>Number of Aligned Proteins</td><td>" + mainObj.getAlignmentsCount() + "</td></tr>");
			jQuery(".summary").append("<tr><td>Number of Matched PDB Structures</td><td>" + mainObj.getAlignmentsByDatabase('pdb') + "</td></tr>");

		},

		drawAAConsistency: function() {

			jQuery("#summary_container").append("<div id='aa-consistency' class='pie container-left' />");
			jQuery("#aa-consistency").append("<h3>Amino Acid composition</h3>");
			PIE_CHART.toPieData(mainObj.getAAComposition()).drawPieChart('aa-consistency');
		},

		drawSSConsistency: function() {

			jQuery("#summary_container").append("<div id='ss-consistency' class='pie container-left' />");
			jQuery("#ss-consistency").append("<h3>Secondary Structure composition</h3>");
			PIE_CHART.toPieData(mainObj.getSSComposition()).drawPieChart('ss-consistency');
		},

		drawFeatureViewer: function() {
			FEATURE_VIEWER.init({
				targetDiv: jQuery("#FeatureViewer"),
				dataObj: mainObj
			});
			var features_array = [];
			FEATURE_VIEWER.setFeauresArray(jQuery.map(providers, function(provider, index) {
				var track = new Track();
				track.setPosition(FEATURE_VIEWER.getCurrentBottom());

				var feature_group = mainObj.getFeatureByProvider(mainObj.getFeatureTypeGroup(), provider);
				var feature_type = (feature_group.type) ? feature_group.type : "";
				locations = mainObj.getFeatureLocations(feature_group);
				if (!locations) return null;
				if (locations) i = locations.length;
				while (i--) {
					feature = new Feature(provider);
					feature.setFeatureID(provider + "__" + locations[i].begin);
					feature.setColor(providers_specs[provider].color);
					feature.setLocation(locations[i].begin, locations[i].end);
					(locations[i].type && typeof locations[i].type !== undefined) ? featureTypeLabel = locations[i].type : featureTypeLabel = "";
					feature.addLabel({
						"typeCategory": feature_type,
						"typeCode": locations[i].code,
						"evidenceText": provider,
						"featureTypeLabel": featureTypeLabel,
						"featureLabel": feature_type ? feature_type : featureTypeLabel,
						"evidenceCode": ""
					});
					track.addFeature(feature.getFeature());
				}
				// FEATURE_VIEWER.setCurrentBottom(track.getBottom());
				FEATURE_VIEWER.addTrack(track);
				return track.getTrack();
			}));

			FEATURE_VIEWER.setFeauresArray(jQuery.map(mainObj.getAlignmentLocations(), function(target, index) {
				var track = new Track(1, 1);
				track.setPosition(FEATURE_VIEWER.getCurrentBottom());
				feature = new Feature("Alignment");
				feature.setFeatureID('alignment__' + target.db + '__' + target.id + '__' + index);

				if (target.db.match(/pdb/i)) {
					(__pdb) = target.id.split('_');
					target.id = __pdb[0];
					if (__pdb[1]) target.id += " Chain: " + __pdb[1];
				}
				feature.setColor("blue");
				feature.setLocation(target.begin, target.end);
				feature.addLabel({
					"featureLabel": "Aligned Target " + target.db + ":" + target.id,
					"typeCode": "Eval: " + target.eval,
					"evidenceText": '',
					"featureTypeLabel": " Matched Length: " + target.matchlen,
					"typeCategory": "Identity: " + parseFloat(target.identity).toFixed(2),
					"evidenceCode": "http://edamontology.org/data_1387"
					// todo: add dbreference to label
				});
				track.addFeature(feature.getFeature());
				FEATURE_VIEWER.addTrack(track);

				return track.getTrack();
				//iterate through array or object
			}));
			FEATURE_VIEWER.draw();
		},

		populateData: function(data) {
			json = jQuery.xml2json(data);
			ds.file_type = 'json'; //switch to json
			ds.populateData(json);
			mainObj.setJsonData(ds.getData());
		},

		init: function() {
			jQuery.noConflict(); // recommended to avoid conflict wiht other libs
			ds = new dataSource(file_specs);
			result = ds.loadData();
			result.done([
			this.populateData,
			this.drawFeatureViewer,
			this.drawSummaryTable,
			this.drawAAConsistency,
			this.drawSSConsistency,
			this.drawCell]);
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
		"PROFtmb"];


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
		// console.log(mainObj.getReferenceByProvider("PROFtmb"));
		// console.log(mainObj.getSSComposition());
		// console.log(mainObj.getAAComposition());
		target_div.append('<p>' + mainObj.getSequence() + '</p>');
		target_div.append('<p>Seq len: ' + mainObj.getSequence().length + '</p>');
		// target_div.append('<p>Protein Name: ' + mainObj.getProteinName() + '</p>');
		// target_div.append('<p>Organism Name: ' + mainObj.getOrganismName() + '</p>');
		// target_div.append('<p>Number of aligments: ' + mainObj.getAlignmentsCount() + '</p>');
		// jQuery.each(['PDB', 'Swiss-Prot', 'trembl'], function(index, val) {
		// 	target_div.append('<p>Number of hits from ' + val + ": " + mainObj.getAlignmentsByDatabase(val) + '</p>');
		// });

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