// App Excpetions

function PPResException(message, error, status) {
	this.message = message;
	this.name = error;
	this.status = status;
}


function PPResData() {
	var xml_data_source = '',
		prof_data_source = '',
		organism = '',
		json_data = {},
		protein = {},
		sequence = '',
		alignments = {};


	this.getAlignments = function() {
		return (this.alignments);
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



	return {

		getSubCellLocations: function(domain) {
			var _ret_obj = {};

			var providers = ["LOCtree", "LOCtree2"];
			if (domain) {
				if (jQuery.inArray(domain, ["arch", "bact", "euka"]) != -1) provider = providers[1];
				else if (jQuery.inArray(domain, ["plant", "animal", "proka"])!= -1) provider = providers[0];
				else return null;
				var subcell_group = this.getFeatureByProvider(this.getFeatureTypeGroup(), provider);
				_tmp_ref = subcell_group.subcellularLocalisation.localisation[domain];
				if (_tmp_ref) {
					_tmp_loc = Object.keys(_tmp_ref)[0];
					_ret_obj[domain] = {
						score: _tmp_ref[_tmp_loc].score,
						goTermId:  _tmp_ref[_tmp_loc].goTermId,
						localisation: _tmp_loc,
						provider: provider
					};
					return (_ret_obj);
				}else
					return null;
			}



			for (var provider in providers) {
				var subcell_group = this.getFeatureByProvider(this.getFeatureTypeGroup(), providers[provider]);
				var domains = ["arch", "bact", "euka", "plant", "animal", "proka"];
				for (var i in domains) {
					_tmp_ref = subcell_group.subcellularLocalisation.localisation[domains[i]];
					if (_tmp_ref) {
						_tmp_loc = Object.keys(_tmp_ref)[0];
						_tmp_score = _tmp_ref[_tmp_loc].score;
						_tmp_go = _tmp_ref[_tmp_loc].goTermId;
						_ret_obj[domains[i]] = {
							score: _tmp_score,
							goTermId: _tmp_go,
							localisation: _tmp_loc,
							provider: providers[provider]
						};
					}
				}
			}


			return (_ret_obj);
		},



		getSSComposition: function(argument) {
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
		},

		getAAComposition: function(argument) {
			var aa_composition = {};
			jQuery.map(this.getSequence().split(''), function(aa, index) {
				if (!(aa in aa_composition)) aa_composition[aa] = 0;
				aa_composition[aa] = parseInt(aa_composition[aa]) + 1;
			});
			return (aa_composition);
		},

		getAlignmentsByDatabaseTopMatch: function(db_name) {
			var alis = this.getAlignments();
			var topmatch_id = '';
			jQuery.each(alis, function(i, v) {
				if ((v.dbReference.type.match(new RegExp(db_name, 'i'))) && (v.identity.value == 1)) {
					topmatch_id = v.dbReference.id;
					return (false);
				}
			});
			return (topmatch_id);
		},


		getAlignmentsByDatabase: function(db_name) {
			var alis = this.getAlignments();
			var count = 0;
			jQuery.each(alis, function(i, v) {
				if (v.dbReference.type.match(new RegExp(db_name, 'i'))) {
					console.log(v.dbReference.id + "\t" + v.identity.value);
					count++;
				}
			});
			return (count);
		},


		getAlignmentsCount: function() {
			return (this.getAlignments().length);
		},


		getJsonData: function() {
			return (json_data);
		},
		setJsonData: function(json) {
			json_data = json;
			sequence = jQuery.trim(json_data.entry.sequence).replace(/(\r\n|\n|\r|\s)/gm, "");
			alignments = json_data.entry.aliProviderGroup.alignment;
			protein = json_data.entry.protein;
			organism = json_data.entry.organism;
		},
		getSequence: function() {
			return (sequence);
		},
		getAlignmentLocations: function() {
			var alis = this.getAlignments();
			var locations_array = [];
			jQuery.each(alis, function(index, alignment) {
				locations_array.push({
					begin: parseInt(alignment.queryStart.value),
					end: parseInt(alignment.queryEnd.value),
					id: alignment.dbReference.id,
					db: alignment.dbReference.type,
					eval: alignment.expect.value,
					matchlen: alignment.matchLen.value,
					identity: alignment.identity.value
				});
			});
			return (locations_array);
		},
		getAlignments: function() {
			return (alignments);
		},

		getFeatureTypeGroup: function() {
			return (json_data.entry.featureTypeGroup);
		},

		getProteinName: function() {
			return (this.protein.recommendedName.fullName);
		},

		getOrganismName: function() {
			return (this.organism.name);
		},

		// Look up feature by feature types
		getFeatureByType: function(featureName) {
			var feature;
			jQuery.each(this.json_data.entry.featureTypeGroup, function(i, v) {
				if (v.type.match(new RegExp(featureName, 'i'))) {
					feature = v;
					return false;
				}
			});
			return (feature);
		},


		getFeatureByProvider: function(feature_list, feature_provider) {
			var getFeatureByProvider = this.getFeatureByProvider;
			var feature;
			var pred_type;

			jQuery.each(feature_list, function(index, feature_type) {
				if (jQuery.isArray(feature_type.featureProviderGroup)) {
					type = feature_type.type;
					feature = getFeatureByProvider(feature_type.featureProviderGroup, feature_provider);
					if (feature) {
						jQuery.merge(feature, type);
						return false;
					};
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
		},

		getFeatureLocations: function(feature_ref) {
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
						type: val.type,
						code: val.soTermId
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
				console.log(this.file_path + " load success");
				// populateData(data)
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(this.file_path + " load fail");
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