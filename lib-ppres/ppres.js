function PPRes(){
	this.pp_features=[
	"secondary structure switch",
	// "DNA-binding region",
	"disulfide bond",
	"protein binding region",
	 // "nuclear localisation signal",
	 // "helical transmembrane region",
	 // "disordered region",
	 "secondary structures",
	 // "solvent accessibility",
	 ];
}

PPRes.prototype.run= function(){
	mainObj = new PPResData();  
	mainObj.setXMLDataSource('source4.xml');
	mainObj.loadData();

	// jQuery.each( this.getPPFeatures(), function (i ,v){
	// 	console.log(mainObj.getFeatureLocations(v));
	// });
	this.mainObj = mainObj;

}


PPRes.prototype.getPPFeatures= function(){
	return (this.pp_features);
}
PPRes.prototype.addPPFeatures = function(feature){
	this.pp_features.push(feature);
}

function PPResData(){
	this.xml_data_source = '';
	this.prof_data_source =  '';
	this.json_data ='';
	this.sequence = '';
}

PPResData.prototype.loadData = function (){
	jQuery.ajaxSetup({async: false});
	var json_data;
	jQuery.get(this.xml_data_source, function (data){
		json_data = jQuery.xml2json(data); 
	},"xml");	
	this.json_data = json_data;
	this.sequence = jQuery.trim(json_data.entry.sequence).replace(/(\r\n|\n|\r)/gm,"");	
};
PPResData.prototype.setXMLDataSource = function (source){
		this.xml_data_source = source;
}
PPResData.prototype.getJsonData= function(){
	return (this.json_data);
}
PPResData.prototype.getSequence= function(){
	return (this.sequence);
}
PPResData.prototype.getFeature= function( featureName ){
	var feature;
 	jQuery.each(this.json_data.entry.featureTypeGroup, function(i, v) {
        if (v.type.match(new RegExp(featureName, 'i'))) {
        	feature=v;
        	// alert (v.type);
            return false;
        }
    });
    return (feature);
}

PPResData.prototype.getFeatureLocations= function( featureName ){
	var locations = [];
	var loc_feature = this.getFeature(featureName);
	jQuery.each(loc_feature.featureProviderGroup.feature, function(i, v) {
		var range = {begin:v.location.begin.position, end: v.location.end.position };
		locations.push (range);
		// console.log(v.location.begin+" - "+v.location.end);
	});
	return (locations);
}

PPResData.prototype.getAlignmentsByDatabase = function(db_name) {
	var alis = this.getAlignments();
	var count = 0;
	jQuery.each(alis.alignment, function(i, v) {
        if (v.dbReference.type.match(new RegExp(db_name, 'i'))){ 
        	console.log(v.dbReference.id+"\t"+v.identity.value);
        	count++;
        }
    });
    return (count);
}


PPResData.prototype.getAlignmentsByDatabaseTopMatch = function(db_name) {
	var alis = this.getAlignments();
	var topmatch_id = '';
	jQuery.each(alis.alignment, function(i, v) {
        if (  (v.dbReference.type.match(new RegExp(db_name, 'i'))) && (v.identity.value==1)){ 	
    		topmatch_id = v.dbReference.id;
    		return (false);
        }
    });
    return (topmatch_id);
}


PPResData.prototype.getAlignments = function() {
	return (this.json_data.entry.aliProviderGroup);
};
PPResData.prototype.getAlignmentsCount = function() {
	return (this.getAlignments().alignment.length);
};




