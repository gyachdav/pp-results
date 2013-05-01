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



	return {
		drawSubcellLoc: function() {
			var nav_div = jQuery("<div id='_subcell_nav' />").appendTo(jQuery("#cell"));

			var content_div = jQuery("<div id='_subcell_cntnt'/>").appendTo(jQuery("#cell"));
			var list = jQuery('<ul/>');
			list.addClass("nav nav-pills");


			list.append('<li class="disabled"><a href="#">Domains:</a> </li>')

			var domains = ["arch", "bact", "euka", "plant", "animal", "proka"];
			for (var i in domains) {
				var _curr_div;
				var _curr_li = jQuery('<li><a href=#>' + SUBCELL_VIEW.getDomainFullName(domains[i]) + '</a></li>');
				var prediction = mainObj.getSubCellLocations(domains[i]);
				if (!prediction) _curr_div = jQuery("<div />").text("Data unavailable");
				else  _curr_div = SUBCELL_VIEW.localisationDiv(prediction);

				if (domains[i] == 'euka') {
					_curr_div.show();
					_curr_li.addClass('active');
				} else _curr_div.hide();
				list.append(_curr_li);
				content_div.append(_curr_div);
			}
			nav_div.append(list);
		},

		drawAlignmentTable: function() {
			ALI_VIEW.draw(mainObj.getAlignmentLocations(), jQuery("#alignments"));
		},

		drawSummaryTable: function() {
			// TODO move modal activation code from this control
			jQuery("#summary_container").append("<div class='summary  left' />");
			jQuery(".summary").append("<h3>Summary</h3>");
			var table = jQuery("<table/>");
			table.addClass("table table-striped");
			if (_rec_name = mainObj.getAlignmentsByDatabaseTopMatch('Swiss-Prot'))
				table.append("<tr><td>Recommended Name</td><td>" + _rec_name + "</td></tr>");
			table.append("<tr><td>Sequence Length</td><td>" + mainObj.getSequence().length + "</td></tr>");
			table.append("<tr><td>Number of Aligned Proteins</td><td><a href='#myModal' role='button' data-toggle='modal'>" + mainObj.getAlignmentsCount() + "</a></td></tr>");
			table.append("<tr><td>Number of Matched PDB Structures</td><td>" + mainObj.getAlignmentsByDatabase('pdb') + "</td></tr>");


			//<a href="#myModal" role="button" class="btn" data-toggle="modal">Launch demo modal</a>

			jQuery(".summary").append(table);
		},

		drawAAConsistency: function() {

			jQuery("#summary_container").append("<div id='aa-consistency' class='summary  left' />");
			jQuery("#aa-consistency").append("<h3>Amino Acid composition</h3>");
			PIE_CHART.toPieData(mainObj.getAAComposition()).drawPieChart('aa-consistency');
		},

		drawSSConsistency: function() {

			jQuery("#summary_container").append("<div id='ss-consistency' class='summary  right' />");
			jQuery("#ss-consistency").append("<h3>Secondary Structure composition</h3>");
			PIE_CHART.toPieData(mainObj.getSSComposition()).drawPieChart('ss-consistency');
		},

		drawFeatureViewer: function() {
			FEATURE_VIEWER.init({
				targetDiv: jQuery("#FeatureViewer"),
				dataObj: mainObj
			});

			var features_array = [];
			FEATURE_VIEWER.setFeaturesArray(jQuery.map(providers, function(provider, index) {
				var track, feature_properties;
				track = new Track();
				if (provider == "ISIS") track.setShiftBottomLine(Track.NO_BOTTOMLINE_SHIFT);
				else track.setPosition(FEATURE_VIEWER.getCurrentBottom());

				var feature_group = mainObj.getFeatureByProvider(mainObj.getFeatureTypeGroup(), provider);
				if (!feature_group) return null;
				var feature_type = (feature_group.type) ? feature_group.type : "";
				feature_properties = mainObj.getFeatureLocations(feature_group);


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
			FEATURE_VIEWER.setFeaturesArray(jQuery.map(mainObj.getAlignmentLocations(), function(target, index) {
				var track = new Track(1, 1);
				track.setPosition(FEATURE_VIEWER.getCurrentBottom());
				Feature.Alignment.prototype = new Feature();
				feature = new Feature.Alignment(target, 'blast', 'alignmnet');
				track.addFeature(feature);
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
			NAVIGATION.setActiveItem(2);
			NAVIGATION.show(jQuery("#nav"));
			ds = new dataSource(file_specs);
			result = ds.loadData();

			result.done([
			this.populateData,
			this.drawFeatureViewer,
			this.drawSummaryTable,
			this.drawAAConsistency,
			this.drawSSConsistency,
			this.drawSubcellLoc,
			this.drawAlignmentTable]);
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