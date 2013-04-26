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
						if (__id[1].match(/pdb/i)){
							(__pdb) = __id[2].split('_');
							__url='http://www.rcsb.org/pdb/explore.do?structureId='+__pdb[0];
						}else
							__url = 'http://www.uniprot.org/uniprot/' + __id[2];
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
		setFeatureID: function( feature_id) {
			feature.featureId = feature_id;
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