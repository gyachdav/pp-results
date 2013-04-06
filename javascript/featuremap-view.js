var json;
var divName;

function drawFeatureMap( target_div_name ) {

  divName = target_div_name;
   $.ajax({
      type: "GET",
      url: "data/source4.xml",
      dataType: "xml",
      success: buildFeatureMap
    });
  
}

function buildFeatureMap (xml){
 if (window.console) console.log(  $(xml));
 if (window.console) console.log(  $(xml).find("sequence").text());
 var seq = ($(xml).find("sequence").text());
 seq = $.trim(seq).replace(/(\r\n|\n|\r)/gm,"");


	var features_array = [];
	 $(xml).find('featureTypeGroup[type=secondary structures] feature').each(function(){
	    var ss_type = $(this).attr("type");
	    var pos_begin  = $(this).find('begin').attr('position');
	    var pos_end  = $(this).find('end').attr('position');


	    switch (ss_type){
	      case 'helix':
	          SO_ac = 'SO:0001114';
	          color = '#990000';
	          break;
	        case 'strand':
	          SO_ac = 'SO:0001111';
	          color = '#0000CC';
	          break;
	        default:
	          SO_ac = '';
	           color = '#006600';
	        }
	        

	    var feature = {

	           "nonOverlappingStyle":{"heightOrRadius":10,"y":56},
	           "type":"rect",
	           "featureEnd":pos_end,
	           "fillOpacity":0.5
	            ,"evidenceText":"Predicted by PROFphd",
	            "stroke":"#9B7057",
	            "height":10,
	            "path":"",
	            "typeLabel":"Propeptide"
	            ,"featureLabel":"Propeptide",
	            "featureStart":pos_begin
	            ,"strokeWidth":1,
	            "text":""
	            ,"centeredStyle":{"heightOrRadius":44,"y":73},
	            "fill":color
	            ,"width":495
	            ,"typeCategory":"Molecule processing",
	            "typeCode":SO_ac,
	            "cy":56,"cx":27,
	            "evidenceCode":""
	            ,"r":10,
	            "featureId":"",
	            "rowsStyle":{"heightOrRadius":10,"y":169}
	            ,"featureTypeLabel":"propeptide",
	            "y":70,"x":27

	    }
	    features_array.push(feature);
	    if (window.console) console.log( feature);
	  });



	 $(xml).find('featureTypeGroup[type=helical transmembrane region] feature').each(function(){
	    var ss_type = $(this).attr("type");
	    var pos_begin  = $(this).find('begin').attr('position');
	    var pos_end  = $(this).find('end').attr('position');

	    var feature = {

	           "nonOverlappingStyle":{"heightOrRadius":10,"y":56},
	           "type":"rect",
	           "featureEnd":pos_end,
	           "fillOpacity":0.5
	            ,"evidenceText":"Predicted by PROFphd",
	            "stroke":"#9B7057",
	            "height":10,
	            "path":"",
	            "typeLabel":"Propeptide"
	            ,"featureLabel":"Propeptide",
	            "featureStart":pos_begin
	            ,"strokeWidth":1,
	            "text":""
	            ,"centeredStyle":{"heightOrRadius":44,"y":73},
	            "fill":"#990099"
	            ,"width":495
	            ,"typeCategory":"Molecule processing",
	            "typeCode":SO_ac,
	            "cy":56,"cx":27,
	            "evidenceCode":""
	            ,"r":10,
	            "featureId":"",
	            "rowsStyle":{"heightOrRadius":10,"y":169}
	            ,"featureTypeLabel":"propeptide",
	            "y":90,"x":27

	    }
	  features_array.push(feature);
	  if (window.console) console.log( feature);
	  });

	 $(xml).find('featureProviderGroup[provider=MD] feature').each(function(){
	    var ss_type = $(this).attr("type");
	    var pos_begin  = $(this).find('begin').attr('position');
	    var pos_end  = $(this).find('end').attr('position');

	    var feature = {

	           "nonOverlappingStyle":{"heightOrRadius":10,"y":56},
	           "type":"rect",
	           "featureEnd":pos_end,
	           "fillOpacity":0.5
	            ,"evidenceText":"Predicted by PROFphd",
	            "stroke":"#9B7057",
	            "height":10,
	            "path":"",
	            "typeLabel":"Propeptide"
	            ,"featureLabel":"Propeptide",
	            "featureStart":pos_begin
	            ,"strokeWidth":1,
	            "text":""
	            ,"centeredStyle":{"heightOrRadius":44,"y":73},
	            "fill":"#999966"
	            ,"width":495
	            ,"typeCategory":"Molecule processing",
	            "typeCode":SO_ac,
	            "cy":56,"cx":27,
	            "evidenceCode":""
	            ,"r":10,
	            "featureId":"",
	            "rowsStyle":{"heightOrRadius":10,"y":169}
	            ,"featureTypeLabel":"propeptide",
	            "y":110,"x":27

	    }
	  features_array.push(feature);
	  if (window.console) console.log( feature);
	  });



	$(xml).find('featureTypeGroup[type=protein binding region] feature').each(function(){
	    var ss_type = $(this).attr("type");
	    var pos_begin  = $(this).find('begin').attr('position');
	    var pos_end  = $(this).find('end').attr('position');

	    var feature = {

	           "nonOverlappingStyle":{"heightOrRadius":10,"y":56},
	           "type":"rect",
	           "featureEnd":pos_end,
	           "fillOpacity":0.5
	            ,"evidenceText":"Predicted by PROFphd",
	            "stroke":"#9B7057",
	            "height":10,
	            "path":"",
	            "typeLabel":"Propeptide"
	            ,"featureLabel":"Propeptide",
	            "featureStart":pos_begin
	            ,"strokeWidth":1,
	            "text":""
	            ,"centeredStyle":{"heightOrRadius":44,"y":73},
	            "fill":"#996600"
	            ,"width":495
	            ,"typeCategory":"Molecule processing",
	            "typeCode":SO_ac,
	            "cy":56,"cx":27,
	            "evidenceCode":""
	            ,"r":10,
	            "featureId":"",
	            "rowsStyle":{"heightOrRadius":10,"y":169}
	            ,"featureTypeLabel":"propeptide",
	            "y":130,"x":27

	    }
	  features_array.push(feature);
	  if (window.console) console.log( feature);
	  });





	// features_array.push(
	// {
	//             "nonOverlappingStyle":{"heightOrRadius":10,"y":56},"type":"rect","featureEnd":73,"fillOpacity":0.5
	//             ,"evidenceText":"UniProt","stroke":"#9B7057","height":10,"path":"","typeLabel":"Propeptide"
	//             ,"featureLabel":"Propeptide","featureStart":1,"strokeWidth":1,"text":""
	//             ,"centeredStyle":{"heightOrRadius":44,"y":73},"fill":"#9B7057","width":495
	//             ,"typeCategory":"Molecule processing","typeCode":"SO:0001062","cy":56,"cx":27,"evidenceCode":""
	//             ,"r":10,"featureId":"UNIPROTKB_Q8LAX3_PROPEP_1_73","rowsStyle":{"heightOrRadius":10,"y":169}
	//             ,"featureTypeLabel":"propeptide","y":56,"x":27
	//          }
	//   );
	// features_array.push(
	// {
	//             "nonOverlappingStyle":{"heightOrRadius":10,"y":56},"type":"rect","featureEnd":96,"fillOpacity":0.5
	//             ,"evidenceText":"UniProt","stroke":"#7DBAA4","height":10,"path":"","typeLabel":"Peptide"
	//             ,"featureLabel":"Elicitor peptide 3","featureStart":74,"strokeWidth":1,"text":""
	//             ,"centeredStyle":{"heightOrRadius":40,"y":75},"fill":"#7DBAA4","width":151
	//             ,"typeCategory":"Molecule processing","typeCode":"SO:0001064","cy":56,"cx":529,"evidenceCode":""
	//             ,"r":10,"featureId":"UNIPROTKB_Q8LAX3_PEPTIDE_74_96","rowsStyle":{"heightOrRadius":10,"y":157}
	//             ,"featureTypeLabel":"active_peptide","y":56,"x":529
	//         }
	//   );


	json = {
	  "featuresArray": features_array
	    ,"segment":"Q8LAx3"
	    ,"legend":{
	        "segment":{"yPosCentered":190,"text":"Q8LAX3","yPos":250,"xPos":15,"yPosNonOverlapping":106,"yPosRows":290}
	        ,"key":[
	            {
	                "label":{
	                    "total":"1","yPosCentered":210,"text":"Alpha Helix","yPos":276,"xPos":50
	                    ,"yPosNonOverlapping":126,"yPosRows":310
	                }
	                ,"shape":{
	                    "centeredStyle":{"heightOrRadius":5,"y":208},"text":""
	                    ,"nonOverlappingStyle":{"heightOrRadius":5,"y":121},"width":30,"fill":"#990000"
	                    ,"cy":121,"cx":15,"type":"rect","fillOpacity":0.5,"stroke":"#7DBAA4","height":5,"r":10
	                    ,"path":"","rowsStyle":{"heightOrRadius":5,"y":305},"typeLabel":"Peptide","y":276
	                    ,"strokeWidth":1,"x":15
	                }
	            }
	            ,{
	                "label":{
	                    "total":"1","yPosCentered":210,"text":"Strand","yPos":276,"xPos":205
	                    ,"yPosNonOverlapping":126,"yPosRows":310
	                }
	                ,"shape":{
	                    "centeredStyle":{"heightOrRadius":5,"y":208},"text":""
	                    ,"nonOverlappingStyle":{"heightOrRadius":5,"y":121},"width":30,"fill":"#0000CC"
	                    ,"cy":121,"cx":170,"type":"rect","fillOpacity":0.5,"stroke":"#9B7057","height":5,"r":10
	                    ,"path":"","rowsStyle":{"heightOrRadius":5,"y":305},"typeLabel":"Peptide","y":276
	                    ,"strokeWidth":1,"x":170
	                }
	            }
	        ]
	    }
	    ,"configuration":{
	        "requestedStop":seq.length,"horizontalGridNumLines":1,"sequenceLineYCentered":95,"requestedStart":1
	        ,"gridLineHeight":12,"rightMargin":20,"belowRuler":30,"sequenceLength":seq.length
	        ,"horizontalGridNumLinesNonOverlapping":2,"horizontalGridNumLinesCentered":6
	        ,"verticalGridLineLengthRows":284,"unitSize":6.875,"sizeYNonOverlapping":76,"style":"nonOverlapping"
	        ,"sequenceLineYRows":155,"sequenceLineY":54,"verticalGrid":false,"rulerY":20
	        ,"dasSources":"http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot","horizontalGrid":false
	        ,"pixelsDivision":50,"sizeY":76,"sizeX":700
	        ,"dasReference":"http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot","sizeYRows":260,"aboveRuler":10
	        ,"rulerLength":660,"verticalGridLineLengthNonOverlapping":66,"sizeYKey":210,"sizeYCentered":160
	        ,"sequenceLineYNonOverlapping":54,"verticalGridLineLength":66,"horizontalGridNumLinesRows":8
	        ,"leftMargin":20,"nonOverlapping":true,"verticalGridLineLengthCentered":172
	    }
	  }

	  $('#'+divName).siblings().html('');
	   var myPainter = new Biojs.FeatureViewer({
	     target: divName,
	     json: json,
	     featureImageWebService: "http://wwwdev.ebi.ac.uk/uniprot/featureViewer/image"
	  });

}