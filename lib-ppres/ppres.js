// App Excpetions

function PPResException(message, error, status) {
	this.message = message;
	this.name = error;
	this.status = status;
}

// App Class

function PPRes(target_div) {
	this.dataSource = {
		path: ".",
		name: "source4.xml",
		type: 'xml'
	};

	this.feature_types = [
		"secondary structures"];
	/** 
		NOTE available Features:
			"secondary structure switch",
			"DNA-binding region",
			"disulfide bond",
			"protein binding region",
			"nuclear localisation signal",
			"helical transmembrane region"
			"disordered region", 
			"solvent accessibility",
	**/
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


	// This block test data loading and parsing all features
	ds = new dataSource(this.dataSource);
	result = ds.loadData();
	result.done(function(data) {
		json = jQuery.xml2json(data);
		ds.file_type = 'json'; //switch to json
		ds.populateData(json);
		console.log(ds.getData());
		mainObj = new PPResData();
		mainObj.setJsonData(ds.getData());
		var feature_types_list = mainObj.json_data.entry.featureTypeGroup;
		jQuery.each(providers, function(i, v) {
			feature = mainObj.getFeatureByProvider(feature_types_list, v);
			target_div.append('<h1>' + v + '</h1>');
			target_div.append(JSON.stringify(mainObj.getFeatureLocations(feature)));
		});
	});

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


function PPResData() {
	this.xml_data_source = '';
	this.prof_data_source = '';
	this.json_data = '';
	this.sequence = '';

	this.getJsonData = function() {
		return (this.json_data);
	}

	this.setJsonData = function(json) {
		this.json_data = json;
	}

	this.getSequence = function() {
		return (this.sequence);
	}
	// Look up feature by feature types
	this.getFeatureByType = function(featureName) {
		var feature;
		jQuery.each(this.json_data.entry.featureTypeGroup, function(i, v) {
			if (v.type.match(new RegExp(featureName, 'i'))) {
				feature = v;
				// alert (v.type);	
				return false;
			}
		});
		return (feature);
	}


	this.getFeatureByProvider = function(feature_list, feature_provider) {
		var getFeatureByProvider = this.getFeatureByProvider;
		var feature;


		jQuery.each(feature_list, function(index, feature_type) {
			if (jQuery.isArray(feature_type.featureProviderGroup)) {
				feature = getFeatureByProvider(feature_type.featureProviderGroup, feature_provider);
				if (!feature === undefined) return false;
			} else {
				var selector = feature_type.featureProviderGroup;
				if (feature_type.featureProviderGroup === undefined) selector = feature_type;
				if (selector.provider.match(new RegExp("^" + feature_provider + "$", 'i'))) {
					feature = feature_type;
					return false;
				}
			}
		});
		return (feature);
	}

	this.getFeatureLocations = function(feature_ref) {
		var locations = [];
		var location_obj_ref;

		if (feature_ref.featureProviderGroup && feature_ref.featureProviderGroup.feature ) {
			location_obj_ref = feature_ref.featureProviderGroup.feature;
		} else if (feature_ref.feature) {
			location_obj_ref = feature_ref.feature;
		} else {
			return null;
		};


		if (jQuery.isArray(location_obj_ref)) {
			jQuery.each(location_obj_ref, function(index, val) {
				locations.push({
					begin: val.location.begin.position,
					end: val.location.end.position,
					type: val.type
				});
			});
		}
		else if (location_obj_ref.location) {
			var ref = location_obj_ref.location;
			locations.push({
				begin: ref.begin.position,
				end: ref.end.position,
				type: ref.type
			});
		}


		return (locations);
	}

	// this.getFeatureLocations= function( featureName ){
	// 	var locations = [];
	// 	var loc_feature = this.getFeature(featureName);
	// 	jQuery.each(loc_feature.featureProviderGroup.feature, function(i, v) {
	// 		var range = {begin:v.location.begin.position, end: v.location.end.position };
	// 		locations.push (range);
	// 		// console.log(v.location.begin+" - "+v.location.end);
	// 	});
	// 	return (locations);
	// }

	this.getAlignmentsByDatabase = function(db_name) {
		var alis = this.getAlignments();
		var count = 0;
		jQuery.each(alis.alignment, function(i, v) {
			if (v.dbReference.type.match(new RegExp(db_name, 'i'))) {
				console.log(v.dbReference.id + "\t" + v.identity.value);
				count++;
			}
		});
		return (count);
	}

	this.getAlignmentsByDatabaseTopMatch = function(db_name) {
		var alis = this.getAlignments();
		var topmatch_id = '';
		jQuery.each(alis.alignment, function(i, v) {
			if ((v.dbReference.type.match(new RegExp(db_name, 'i'))) && (v.identity.value == 1)) {
				topmatch_id = v.dbReference.id;
				return (false);
			}
		});
		return (topmatch_id);
	}
	this.getAlignments = function() {
		return (this.json_data.entry.aliProviderGroup);
	};
	this.getAlignmentsCount = function() {
		return (this.getAlignments().alignment.length);
	};

}

// External data loader

function dataSource(file_obj) {
	this.file_path = file_obj.path;
	this.file_name = file_obj.name
	this.file_type = file_obj.type;

	this.data = {
		data_size: 0,
		data_format: this.file_type,
		xml: '',
		json: ''
	}

	this.loadData = function() {
		var data;
		this.file_path += "/" + this.file_name;
		return (jQuery.ajax({
			url: this.file_path,
			success: function(data) {
				// populateData(data)
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// throw new PPResException ( 
				// 	textStatus,
				// 	errorThrown 
				// 	jqXHR.status
				// );
			},
			dataType: this.file_type
		}));
	};

	this.xml2Json = function(xml) {
		this.data.json = jQuery.xml2json(xml);
	};
	this.populateData = function(data) {
		if (this.file_type == "xml") this.data.xml = data;
		else if (this.file_type == "json") this.data.json = data;
	};
	this.getData = function() {
		if (this.file_type == "xml") this.data.xml = data;
		else if (this.file_type == "json") return (this.data.json);
		else return null;
	};
};