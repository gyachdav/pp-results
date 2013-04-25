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
			"sizeY": 10000,
			"sizeYRows": 1000
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
		},
		setFeauresArray: function(features_array) {
			jQuery.merge(json_config_obj.featuresArray, features_array);
			console.log(json_config_obj.featuresArray);
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


var Feature = function(feature_provider) {
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
		setLocation: function(start, stop) {
			this.addStart(start);
			this.addStop(stop);
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
			jQuery.extend(feature, label);
		}
	}
}

var Track = function(__height, __margin) {

	var default_height = 10,
		config = {},
		features = [];

	(__height) ? config.height = __height : config.height = default_height;
	(__margin) ? config.margin = __margin : config.margin = default_height * 1.5;

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