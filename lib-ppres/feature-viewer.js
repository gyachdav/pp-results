function FeatureViewer( seq, target_div, prot_name ){
	this.sequenceLength  = seq.length;
	this.displayDiv = target_div;
	this.json = '';
	this.prot_name = 'query';
	if ( prot_name) this.prot_name = prot_name;

	this.pane_width =  target_div.width();
	this.current_bottom = 54;
	this.current_track_count = 0;

	var outer_margin = 25;
	var inner_margin = outer_margin *2;


	this.json = {
		    "segment": this.prot_name
		    ,"legend":{
		        "segment":{"yPosCentered":190,"text":"","yPos":300,"xPos":15,"yPosNonOverlapping":106,"yPosRows":290}
		        ,"key":[
		        ]
		    }
		    ,"configuration":{
		    	"requestedStart":1,
		        "requestedStop":this.sequenceLength,
		        "sequenceLength":this.sequenceLength,
		        "sizeX": this.pane_width - outer_margin,
		        "rulerLength": this.pane_width - inner_margin,
		    //     "horizontalGridNumLines":1,
  				// "sequenceLineYCentered":95,
     		// 	    "gridLineHeight":12,
     		    "rightMargin":5,
				"leftMargin":5,
				 "belowRuler":30,
				// "horizontalGridNumLinesNonOverlapping":2,
				// "horizontalGridNumLinesCentered":6,
				// "verticalGridLineLengthRows":284,
				// "sizeYNonOverlapping":76,
				// "style":"nonOverlapping",
				// "sequenceLineYRows":155,
				"sequenceLineY":54,
				// "verticalGrid":false,
				 "rulerY":20,
				 // "horizontalGrid":false,
				 "pixelsDivision":50,
				// "sizeY":250,
				// "sizeYRows":260,
				 "aboveRuler":10,
				// "verticalGridLineLengthNonOverlapping":66,
				// "sizeYKey":300,
				// "sizeYCentered":160,
				// "sequenceLineYNonOverlapping":54,
				// "verticalGridLineLength":66,
				// "horizontalGridNumLinesRows":8,
				// "nonOverlapping":true,
				// "verticalGridLineLengthCentered":172

		    }
		};
}

FeatureViewer.prototype.addFeatureArray = function(feature_array) {
	this.json.featuresArray = features_array;
};
FeatureViewer.prototype.getCurrentBottom = function  () {
	return (this.current_bottom);	
}

FeatureViewer.prototype.setCurrentBottom = function  ( y ) {
	this.current_bottom = y;
	
}

FeatureViewer.prototype.draw = function() {
	var myPainter = new Biojs.FeatureViewer({
			target: 'FeatureViewer',
			json: this.json,
	});
};
FeatureViewer.prototype.setFeauresArray  = function ( features_array ){
	this.json.featuresArray  = features_array;
};

FeatureViewer.prototype.setProteinName = function(prot_name) {
 	this.json.segment  = prot_name;
 }; 

// FeatureViewer.prototype.addTrack = function( track ) {
// 	this.current_bottom = track.getBottom();
//  	track.setPosition( this.current_bottom );
// };

function Track( height ){

	this.height = 10;
	this.margin = this.height  * 1.5;
	if (height) this.height = height;
	this.config  = {
		"height": this.height
	}
}

Track.prototype.getTrackHeight = function() {
	return (this.track);
};

Track.prototype.setPosition = function( starting_y ) {
	this.config.y = starting_y;
};

Track.prototype.getBottom = function (){
	return (this.config.y+this.height+this.margin);
}

Track.prototype.getConfig = function (){
	return (this.config);
}

Track.prototype.addFeature = function( feature ) {
	jQuery.extend(this.config, feature);
};


// Physical representation of annotation
function Feature( feature_provider, feature_type, data ){
	var default_stroke = 0;
	var default_shape = "rect";
	var default_opacity = 0.5;
	this.color = 'grey';

	this.feature =  {
		    "type": default_shape,
			"fillOpacity": default_opacity,
            "strokeWidth": default_stroke,
            "name": feature_provider,
            //"type": feature_type,			
	    };

};

Feature.prototype.setColor = function( color ) {
	this.feature.fill = color;
	this.feature.stroke = color;
};

Feature.prototype.getFeature = function(first_argument) {
	return (this.feature);
};


Feature.prototype.setFeatureID = function (name, pos) {
	this.feature.featureId = name + pos;
};

Feature.prototype.addLocation = function(start, stop) {
	this.addStart( start );
	this.addStop( stop );
};
Feature.prototype.addStart = function( pos ) {
	this.feature.featureStart = pos;
};
Feature.prototype.addStop = function( pos ) {
	this.feature.featureEnd = pos;
};

Feature.prototype.addLabel = function( label ) {
	label = label.capitalize();
	jQuery.extend(this.feature, {
			"typeLabel": label,
			"typeLabel": label,
			"featureLabel":label, 
			"typeCategory": this.feature_type,
			"typeCode":label,
			"evidenceCode":"",
			"evidenceText": "Prediction",
			"featureTypeLabel": label + "-" + label
	});
};

Feature.prototype.getLabel = function() {
	return (this.label);
};


function feature_SS( feature_provider, feature_type, data ){
	Feature.call(this);
	this.addLocation ( data.location.begin.position, data.location.end.position );
	this.setFeatureID( feature_provider, data.location.begin.position);

	switch (data.type){
		case 'helix':
			color = '#990000';
			break;
		case 'strand':
	        color = '#0000CC';
  		  	break;
        default:
        	color = '#006600';
        	break;
	}
	this.setColor( color );
	this.addLabel( feature_provider );
	this.setFeatureID ( feature_provider,data.location.begin.position );
};

feature_SS.prototype = new Feature();
feature_SS.prototype.constructor = feature_SS;


function feature_ASP( feature_provider, feature_type, data ){
	Feature.call(this);
	this.addLocation ( data.location.begin.position, data.location.end.position );
	this.setColor('green');
	this.addLabel( feature_provider );
	this.setFeatureID ( feature_provider,data.location.begin.position );
};

feature_ASP.prototype = new Feature();
feature_ASP.prototype.constructor = feature_ASP;

// Utility Funciton
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function feature_DS( feature_provider, feature_type, data ){
	Feature.call(this);
	this.addLocation ( data.location.begin.position, data.location.end.position );
	this.setColor('brown');
	this.addLabel( feature_provider );
	this.setFeatureID ( feature_provider,data.location.begin.position );
};

feature_DS.prototype = new Feature();
feature_DS.prototype.constructor = feature_DS;

// Bidning sites
function feature_BS( feature_provider, feature_type, data ){
	Feature.call(this);
	this.addLocation ( data.location.begin.position, data.location.end.position );
	this.setColor('pink');
	this.addLabel( feature_provider );
	this.setFeatureID ( feature_provider,data.location.begin.position );
};

feature_BS.prototype = new Feature();
feature_BS.prototype.constructor = feature_BS;


// Utility Funciton
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}












