var FEATURE_VIEWER = (

function() {
	var displayDiv,
	prot_name = 'query',
		displayDivWidth = 0,
		current_bottom = 54;
	current_track_count = 0,
	outer_margin = 30.
	inner_margin = outer_margin * 2,
	json_config_obj = {
		"featuresArray": [],
		"segment": prot_name,
		"legend": {
			"segment": {
				"yPosCentered": 190,
				"text": "",
				"yPos": 300,
				"xPos": 15,
				"yPosNonOverlapping": 106,
				"yPosRows": 290
			},
			"key": []
		},

		"configuration": {
			// "horizontalGridNumLines": 2,
			// "sequenceLineYCentered": 95,
			"requestedStart": 1,
			// "gridLineHeight": 12,
			"rightMargin": 5,
			"belowRuler": 30,
			"horizontalGridNumLinesNonOverlapping": 2,
			"horizontalGridNumLinesCentered": 6,
			"verticalGridLineLengthRows": 284,
			"unitSize": 6.875,
			"sizeYNonOverlapping": 76,
			"style": "rows",
			"sequenceLineYRows": 155,
			"sequenceLineY": 54,
			"verticalGrid": false,
			"rulerY": 20,
			"horizontalGrid": false,
			"pixelsDivision": 50,
			"aboveRuler": 10,
			"sizeYKey": 20,
			"sizeYCentered": 160,
			"sequenceLineYNonOverlapping": 54,
			// "horizontalGridNumLinesRows": 8,
			"leftMargin": 20,
			"nonOverlapping": true
		}
	};

	return {
		init: function(argument) {
			var dataObj = argument.dataObj;
			displayDivWidth = argument.targetDiv.width();
			json_config_obj.configuration.sizeX = (displayDivWidth - outer_margin);
			json_config_obj.configuration.rulerLength = (displayDivWidth - inner_margin);
			json_config_obj.configuration.sequenceLength = dataObj.getSequence().length;
			json_config_obj.configuration.requestedStop = dataObj.getSequence().length;


		},
		getCurrentBottom: function() {
			return (current_bottom);
		},
		setCurrentBottom: function(y) {
			current_bottom = y;
		},

		draw: function() {
			var myPainter = new Biojs.FeatureViewer({
				target: 'FeatureViewer',
				json: json_config_obj
			});


			console.log(json_config_obj);

			myPainter.onFeatureSelected(

			function(obj) {
				if (obj.featureId.match(/^alignment/)) {

					// 'alignment', (target.db"-"+target.id+"-"+index)
					__id = /^alignment__(\w+[\-\w+]+)__(\w+)__(\w+)/.exec(obj.featureId);
					if (__id[1] && __id[2]) {
						if (__id[1].match(/pdb/i)) {
							(__pdb) = __id[2].split('_');
							__url = 'http://www.rcsb.org/pdb/explore.do?structureId=' + __pdb[0];
						} else __url = 'http://www.uniprot.org/uniprot/' + __id[2];
						var win = window.open(__url, '_blank');
						win.focus();
					}
				}
			});
		},
		setFeauresArray: function(features_array) {
			jQuery.merge(json_config_obj.featuresArray, features_array);
			// console.log(json_config_obj.featuresArray);
		},
		setProteinName: function(prot_name) {
			json_config_obj.segment = prot_name;
		},
		getProteinName: function() {
			return prot_name;
		},
		getDisplayWidth: function() {
			return displayDivWidth;
		},
		addTrack: function(track) {
			current_bottom = track.getBottom();
			track.setPosition(this.getCurrentBottom());
			json_config_obj.configuration.sizeY = track.getBottom();
			json_config_obj.configuration.sizeYRows = track.getBottom();
			this.setCurrentBottom(track.getBottom());
		}
	};
})();



/**
 @params 
	_feature = {
		begin: int,
		end: int,
		code : string,
		type: string
	},
	_feature_provider = string,
	_feature_type  = string
@returns Feature
*/
var Feature = Feature || {};

var Feature = function( ) {
	var default_stroke = 0,
		default_shape = "rect",
		default_opacity = 0.5,
		color = 'grey',
		feature = {},
		being,
		end,
		featureTypeLabel;


	var setFeatureID = function(feature_id) {
		feature.featureId = feature_id;
	};
	var setLocation = function(start, stop) {
		addStart(start);
		addStop(stop);
	};
	var addStart = function(pos) {
		feature.featureStart = pos;
	};
	var addStop = function(pos) {
		feature.featureEnd = pos;
	};
	var getLabel = function() {
		return (label);
	};
	var addLabel = function(_feature, _feature_provider, _feature_type) {
		var featureTypeLabel;

		(_feature.type && typeof _feature.type !== undefined) ? featureTypeLabel = _feature.type : featureTypeLabel = "";
		var label = {
			"typeCode": _feature.code,
			"evidenceText": _feature_provider,
			"featureTypeLabel": featureTypeLabel,
			"featureLabel": _feature_type ? _feature_type : featureTypeLabel,
			"evidenceCode": ""

		};
		jQuery.extend(feature, label);
	};



	return {
		getFeature: function() {
			return (feature);
		},
		setColor: function() {
			feature.fill = this.color;
			feature.stroke = this.color;
		},
		init: function(_feature, _feature_provider, _feature_type) {
			feature = {
				"type": default_shape,
				"fillOpacity": default_opacity,
				"strokeWidth": default_stroke,
				"name": _feature_provider,
				"fill": 'grey',
				'stroke': 'grey'
			}, begin = _feature.begin,
			end = _feature.end;

			addLabel(_feature, _feature_provider, _feature_type);
			setLocation(begin, end);
			setFeatureID(_feature_provider + "__" + begin);

			return this.getFeature();
		}
	}

};




Feature.Alignment = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);

	
	// var feature = {
	// 	"type": "rect",
	// 	"fillOpacity": '0.5',
	// 	"strokeWidth": 0,
	// 	"name": _feature_provider
	// }, begin = _feature.begin,
	// 	end = _feature.end,
	// 	featureTypeLabel;



	// setLocation(begin, end);
	// setFeatureID('alignment__' + _feature.db + '__' + _feature.id + '__' + begin + end);



	// (_feature.type && typeof _feature.type !== undefined) ? featureTypeLabel = _feature.type : featureTypeLabel = "";
	// if (_feature.db.match(/pdb/i)) {
	// 	(__pdb) = _feature.id.split('_');
	// 	_feature.id = __pdb[0];
	// 	if (__pdb[1]) _feature.id += " Chain: " + __pdb[1];
	// }

	// var _label = {
	// 	"featureLabel": "Aligned Target " + target.db + ":" + target.id,
	// 	"typeCode": "Eval: " + target.eval,
	// 	"evidenceText": '',
	// 	"featureTypeLabel": " Matched Length: " + target.matchlen,
	// 	"typeCategory": "Identity: " + parseFloat(target.identity).toFixed(2),
	// 	"evidenceCode": "http://edamontology.org/data_1387"
	// 	// todo: add dbreference to label
	// };




	// addLabel(label);
	this.color = "blue";
	this.setColor();
	return this.getFeature();

};


Feature.PROFsec = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);

	switch (_feature.type) {
		case 'helix':
			this.color = '#990000';
			break;
		case 'strand':
			this.color = '#0000CC';
			break;
		default:
			this.color = '#006600';
			break;
	}

	this.setColor();
	return this.getFeature();
};




Feature.NORSnet = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);

	this.color = "gray";
	this.setColor();
	return this.getFeature();

};

Feature.ISIS = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);
	this.color = "red";
	this.setColor();
	return this.getFeature();

};

Feature.DISIS = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);
	this.color = "orange";
	this.setColor();
	return this.getFeature();

};

Feature.ASP = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);
	this.color = "green";
	this.setColor();
	return this.getFeature();

};

Feature.ASP = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);
	this.color = "orange";
	this.setColor();
	return this.getFeature();

};

Feature.DISULFIND = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);
	this.color = "brown";
	this.setColor();
	return this.getFeature();

};

Feature.PredictNLS = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);
	this.color = "brown";
	this.setColor();
	return this.getFeature();

};

Feature.PHDhtm = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);
	this.color = "purple";
	this.setColor();
	return this.getFeature();
};

Feature.PROFbval = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);
	this.color = "yellow";
	this.setColor();
	return this.getFeature();
};

Feature.Ucon = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);
	this.color = "orange";
	this.setColor();
	return this.getFeature();
};

Feature.MD = function(_feature, _feature_provider, _feature_type) {
	this.init.call(this, _feature, _feature_provider, _feature_type);
	this.color = "#225533";
	this.setColor();
	return this.getFeature();
};



var Track = function(__height, __margin) {

	var default_height = 10,
		config = {},
		features = [];

	(__height) ? config.height = __height : config.height = default_height;
	(__margin) ? config.margin = __margin : config.margin = default_height * .2;

	return {
		setPosition: function(starting_y) {
			config.y = starting_y;
		},
		getTrackHeight: function() {
			return config;
		},
		getBottom: function() {
			return (config.y + config.height + config.margin)
		},
		getConfig: function() {
			return (config);
		},
		addFeature: function(feature) {
			features.push(jQuery.extend(feature, config));
		},
		getTrack: function() {
			return features;
		}
	}
};


// 



// feature_SS.prototype = new Feature();
// feature_SS.prototype.constructor = feature_SS;


// function feature_ASP( feature_provider, feature_type, data ){
// 	Feature.call(this);
// 	this.addLocation ( data.location.begin.position, data.location.end.position );
// 	this.setColor('green');
// 	this.addLabel( feature_provider );
// 	this.setFeatureID ( feature_provider,data.location.begin.position );
// };

// feature_ASP.prototype = new Feature();
// feature_ASP.prototype.constructor = feature_ASP;

// // Utility Funciton
// String.prototype.capitalize = function() {
//     return this.charAt(0).toUpperCase() + this.slice(1);
// }

// function feature_DS( feature_provider, feature_type, data ){
// 	Feature.call(this);
// 	this.addLocation ( data.location.begin.position, data.location.end.position );
// 	this.setColor('brown');
// 	this.addLabel( feature_provider );
// 	this.setFeatureID ( feature_provider,data.location.begin.position );
// };

// feature_DS.prototype = new Feature();
// feature_DS.prototype.constructor = feature_DS;

// // Bidning sites
// function feature_BS( feature_provider, feature_type, data ){
// 	Feature.call(this);
// 	this.addLocation ( data.location.begin.position, data.location.end.position );
// 	this.setColor('pink');
// 	this.addLabel( feature_provider );
// 	this.setFeatureID ( feature_provider,data.location.begin.position );
// };

// feature_BS.prototype = new Feature();
// feature_BS.prototype.constructor = feature_BS;


// // Utility Funciton
// String.prototype.capitalize = function() {
//     return this.charAt(0).toUpperCase() + this.slice(1);
// }