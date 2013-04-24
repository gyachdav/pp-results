// App Excpetions

function PPResException(message, error, status) {
	this.message = message;
	this.name = error;
	this.status = status;
}

// App Class
// OBsolete
function PPRes(target_div) {
	this.dataSource = {
		path: ".",
		name: "examples/source.xml",
		type: 'xml'
	};

	// this.feature_types = [
	// 	"secondary structures"];
	// /** 
	// 	NOTE available Features:
	// 		"secondary structure switch",
	// 		"DNA-binding region",
	// 		"disulfide bond",
	// 		"protein binding region",
	// 		"nuclear localisation signal",
	// 		"helical transmembrane region"
	// 		"disordered region", 
	// 		"solvent accessibility",
	// **/
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


function PPResData() {
	this.xml_data_source = '';
	this.prof_data_source = '';
	this.json_data = '';
	this.sequence = '';
	this.alignments =


	this.getFeatureTypeGroup = function() {
		return (this.getJsonData().entry.featureTypeGroup);
	}

	this.getJsonData = function() {
		return (this.json_data);
	}

	this.setJsonData = function(json) {
		this.json_data = json;
		this.sequence = jQuery.trim(this.json_data.entry.sequence).replace(/(\r\n|\n|\r|\s)/gm, "");
		this.alignments = this.json_data.entry.aliProviderGroup.alignment;
		this.protein = this.json_data.entry.protein;
		this.organism = this.json_data.entry.organism;
	}

	this.getProteinName = function() {
		return (this.protein.recommendedName.fullName);
	}

	this.getOrganismName = function() {
		return (this.organism.name);
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
				if ( feature ) return false;
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

		if (feature_ref.featureProviderGroup && feature_ref.featureProviderGroup.feature) {
			location_obj_ref = feature_ref.featureProviderGroup.feature;
		} else if (feature_ref.feature) {
			location_obj_ref = feature_ref.feature;
		} else {
			return null;
		};


		if (jQuery.isArray(location_obj_ref)) {
			jQuery.each(location_obj_ref, function(index, val) {
				locations.push({
					begin: parseInt(val.location.begin.position),
					end: parseInt(val.location.end.position),
					type: val.type
				});
			});
		} else if (location_obj_ref.location) {
			var ref = location_obj_ref.location;
			locations.push({
				begin: parseInt(ref.begin.position),
				end: parseInt(ref.end.position),
				type: ref.type
			});
		}
		return (locations);
	}

	this.getAlignmentLocations = function() {
		var alis = this.getAlignments();
		var locations_array = [];
		jQuery.each(alis, function(index, alignment) {
			locations_array.push({
				begin: parseInt(alignment.queryStart.value),
				end: parseInt(alignment.queryEnd.value)
			});
		});
		return (locations_array);
	}


	this.getAlignmentsByDatabase = function(db_name) {
		var alis = this.getAlignments();
		var count = 0;
		jQuery.each(alis, function(i, v) {
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
		jQuery.each(alis, function(i, v) {
			if ((v.dbReference.type.match(new RegExp(db_name, 'i'))) && (v.identity.value == 1)) {
				topmatch_id = v.dbReference.id;
				return (false);
			}
		});
		return (topmatch_id);
	}
	this.getAlignments = function() {
		return (this.alignments);
	};
	this.getAlignmentsCount = function() {
		return (this.getAlignments().length);
	};

	this.getReferenceByProvider = function(feature_provider) {
		var feature = this.getFeatureByProvider(this.getFeatureTypeGroup(), feature_provider);
		return (this.getReference(feature.featureProviderGroup.ref));
	}
	this.getReference = function(ref_id) {
		var _ref;
		refs = this.json_data.entry.reference;
		jQuery.each(refs, function(index, ref) {
			if (ref.entryKey.entryKeyValue == ref_id) {
				_ref = ref;
				return (false);
			}
		});
		return _ref;
	}


	this.getSSComposition = function(argument) {
		var ss_feature = this.getFeatureByProvider(this.getFeatureTypeGroup(), "PROFsec");
		var ss_feature_array = this.getFeatureLocations(ss_feature);
		var ss_composition = {
			helix: 0,
			strand: 0,
			loop: 0
		};
		jQuery.each(ss_feature_array, function(index, obj) {
			_type = obj.type;
			ss_composition[_type] += parseInt(obj.end) - parseInt(obj.begin);
		});
		ss_composition.loop = this.getSequence().length - parseInt(ss_composition.helix) - parseInt(ss_composition.strand);
		return (ss_composition);
	}

	this.getAAComposition = function(argument) {
		var aa_composition = {};
		jQuery.map(this.getSequence().split(''), function(aa, index) {
			if (!(aa in aa_composition)) aa_composition[aa] = 0;
			aa_composition[aa] = parseInt(aa_composition[aa]) + 1;
		});
		return (aa_composition);
	}
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
				console.log(this.file_path+" load success");
				// populateData(data)
			},
			error: function(jqXHR, textStatus, errorThrown) {
					console.log(this.file_path +" load fail");
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