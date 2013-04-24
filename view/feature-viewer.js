var FEATURE_VIEWER = (

function() {

	var displayDiv,
	prot_name = 'query',
		displayDivWidth = 0,
		current_bottom = 54;
	current_track_count = 0,
	outer_margin = 25.
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
			"requestedStart": 1,


			"rightMargin": 5,
			"leftMargin": 5,
			"belowRuler": 30,
			"sequenceLineY": 54,
			"rulerY": 20,
			"pixelsDivision": 50,
			"aboveRuler": 10,

		}
	};



	var Feature = function() {
		// // Physical representation of annotation
		var default_stroke = 0,
			default_shape = "rect",
			default_opacity = 0.5,
			color = 'grey',
			feature = {
				"type": default_shape,
				"fillOpacity": default_opacity,
				"strokeWidth": default_stroke,
				"name": feature_provider,
			};

		return {
			setColor: function(color) {
				feature.fill = color;
				feature.stroke = color;
			},
			getFeature: function() {
				return (feature);
			},
			setFeatureID: function(name, pos) {
				feature.featureId = name + pos;
			},
			addLocation: function(start, stop) {
				addStart(start);
				addStop(stop);
			},
			addStart: function(pos) {
				feature.featureStart = pos;
			},
			addStop: function(pos) {
				feature.featureEnd = pos;
			},
			getLabel: function() {
				return (label);
			},
			addLabel: function(label) {
				label = label.capitalize();
				jQuery.extend(this.feature, {
					"typeLabel": label,
					"typeLabel": label,
					"featureLabel": label,
					"typeCategory": this.feature_type,
					"typeCode": label,
					"evidenceCode": "",
					"evidenceText": "Prediction",
					"featureTypeLabel": label + "-" + label
				});
			}
		}
	}


	var Track = function(__height) {

		var default_height = 10,
			margin = default_height * 1.5,
			config = {};

		(__height) ? config.height = __height : config.height = height;

		return {
			setPosition: function(starting_y) {
				config.y = starting_y;
			},
			getTrackHeight: function() {
				return config.height;
			},
			getBottom: function() {
				return (config.y + config.height + margin)
			},
			getConfig: function() {
				return (config);
			},
			addFeature: function(feature) {
				jQuery.extend(config, feature)
			}
		}
	};

	return {
		init: function(argument) {
			var dataObj = argument.dataObj;
			displayDivWidth = argument.targetDiv.width();
			json_config_obj.sizeX = (displayDivWidth - outer_margin);
			json_config_obj.rulerLength = (displayDivWidth - inner_margin);
			json_config_obj.sequenceLength = dataObj.getSequence().length;
			json_config_obj.requestedStop = dataObj.getSequence().length;
			json_config_obj.requestedStop = json_config_obj.sequenceLength = 742;

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
		},
		setFeauresArray: function(features_array) {
			json_config_obj.featuresArray = features_array;
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
			track.setPosition(this.current_bottom);
		}
	};
})();



// 



// function feature_SS( feature_provider, feature_type, data ){
// 	Feature.call(this);
// 	this.addLocation ( data.location.begin.position, data.location.end.position );
// 	this.setFeatureID( feature_provider, data.location.begin.position);

// 	switch (data.type){
// 		case 'helix':
// 			color = '#990000';
// 			break;
// 		case 'strand':
// 	        color = '#0000CC';
//   		  	break;
//         default:
//         	color = '#006600';
//         	break;
// 	}
// 	this.setColor( color );
// 	this.addLabel( feature_provider );
// 	this.setFeatureID ( feature_provider,data.location.begin.position );
// };

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