function sequenceViewer(){
	$.ajax({
	    type: "GET",
	    url: "data/source4.xml",
	    dataType: "xml",
	    success: buildSequence
  });
	
		
}


var mySequence;
var theSequence = '';
var xml_source;

function buildSequence(xml){
	
	xml_source = xml;
	theSequence = $(xml).find("sequence").text();
  	theSequence = $.trim(theSequence).replace(/(\r\n|\n|\r)/gm,"");

  	$("#SequenceView").siblings().html('');

	 mySequence = new Biojs.Sequence({
	        sequence : theSequence,
	        target : "SequenceView",
	        format : 'CODATA',
	        id : '',
	        formatOptions : {
			    title:false,
	    		footer:false
			},
			columns:{
				size: 60,
				spacedEach:15
			},
	});

 	if (isEmpty(theSequence) || isBlank(theSequence)){
		// TODO myseq component still overwrites the error message 
		mySequence.clearSequence("No sequence available", "../biojs/css/images/warning_icon.png");
		return;
	}

/**
* Secondary structure
*/
	addSecondaryStructure(xml);
	//addSolvAcc(xml);
	 addTMH(xml);
	addDisorder(xml);
	// addDisulphide(xml);



 position_array = [];
 $(xml).find('featureTypeGroup[type=protein binding region] feature').each(function(){
		var pos_begin  = $(this).find('begin').attr('position');
		var pos_end  = $(this).find('end').attr('position');
		var range = {	
						start: pos_begin,
						end: pos_end, 
						color: 'green',
					};
		position_array.push(range);
		 if (window.console) console.log( pos_begin+"\t"+ pos_end);
	});

	mySequence.setAnnotation({
						name: "Binding Region",
						regions: position_array

					});






 	$('#chk-disulfind').click(function(){
		if (! $(this).is(":checked"))
			mySequence.removeAnnotation ('Disulphide');
	});


	$('#chk-disorder').click(function(){
		if (! $(this).is(":checked"))
			mySequence.removeAnnotation ('Disorder');
		else
			addDisorder(xml_source);
	});

	$('#chk-solvacc').click(function(){
		if (! $(this).is(":checked"))
			mySequence.removeAllHighlights();
		if ($(this).is(":checked"))
			addSolvAcc(xml_source);
	});




	$('#chk-formatSel').click(function(){
		if (! $(this).is(":checked"))
			mySequence.hideFormatSelector();
		if ($(this).is(":checked"))
			mySequence.showFormatSelector();
	});
	
	mySequence.hideFormatSelector();
	
}


function addSolvAcc(xml){

/**
* Solvent accessibility
*/

var position_array = [];
var solv_acc = $(xml).find('featureTypeGroup[type=solvent accessibility] featureString').text();
solv_acc = $.trim(solv_acc).replace(/(\r\n|\n|\r)/gm,"");
	var color = 'black';
	if (solv_acc.length == theSequence.length){
		for (var i=0; i < solv_acc.length ; i++ ){
			if (solv_acc.charAt(i) >5 )
				color='blue';
			else if (solv_acc.charAt(i) <5 )
				color='#E0D01B';
			else if (solv_acc.charAt(i) ==5 )
				color='black';
			mySequence.addHighlight( { "start": i+1, "end": i+1,"color": color, background: "#f5f5f5", id: 'solvAcc' } );
		}
	}
if (window.console) console.log( "solv acc:" +solv_acc.length + " seq length: "+theSequence.length );
if (window.console) console.log(  solv_acc+ "\n"+theSequence+"\n" );


}


function addDisorder(xml){

 	var position_array = [];
	$(xml).find('featureProviderGroup[provider=MD] feature').each(function(){
	var pos_begin  = $(this).find('begin').attr('position');
	var pos_end  = $(this).find('end').attr('position');
	var range = {	
					start: pos_begin,
					end: pos_end, 
					color: 'grey',
				};
	position_array.push(range);
	 if (window.console) console.log( pos_begin+"\t"+ pos_end);
	});

	mySequence.setAnnotation({
				name: "Disorder",
				regions: position_array
	});

}


function addSecondaryStructure(xml){
	 var position_array = [];
 $(xml).find('featureTypeGroup[type=secondary structures] feature').each(function(){
		var ss_type = $(this).attr("type");
		switch(ss_type){
			case 'helix':
			  color = 'red'
			  break;
			case 'strand':
			  color = 'blue'
			  break;
			default:
			  color = 'green'
		}
		var pos_begin  = $(this).find('begin').attr('position');
		var pos_end  = $(this).find('end').attr('position');
		var range = {	
						start: pos_begin,
						end: pos_end, 
						color: color,
						html: ss_type
					};
		position_array.push(range);
		 if (window.console) console.log( ss_type +"\t"+pos_begin+"\t"+ pos_end);
	});

	mySequence.setAnnotation({
						name: "Secondary Structure",
						html: "<font color=red>Helix</font><br/><font color=blue>Strand</font><br/><font color=green>Loop</font><br/>",
						regions: position_array

					});



}


function addTMH(xml){
	 var position_array = [];
 $(xml).find('featureTypeGroup[type=helical transmembrane region] feature').each(function(){
		var pos_begin  = $(this).find('begin').attr('position');
		var pos_end  = $(this).find('end').attr('position');
		var range = {	
						start: pos_begin,
						end: pos_end, 
						color: 'purple'
					};
		position_array.push(range);
		 if (window.console) console.log( pos_begin+"\t"+ pos_end);
	});

	mySequence.setAnnotation({
						name: "Transmembrane Region",
						regions: position_array
					});


}

function addDisulphide(xml){
	/* TODO : need to draw a line for nrgdges but without filling the brackets
*/
	 color = 'rgb(128,128,0)';
 $(xml).find('featureTypeGroup[type=disulfide bond] feature').each(function(){
		var pos_begin  = $(this).find('begin').attr('position');
		var pos_end  = $(this).find('end').attr('position');
		
	
		 if (window.console) console.log( pos_begin+"\t"+ pos_end);
		mySequence.setAnnotation({
							name: "Disulphide",
							regions: [{	
								start: pos_begin,
								end: pos_end, 
								color: color
							}]

						});
	});

}


// Helper Functions

function isEmpty(str) {
    return (!str || 0 === str.length);
}
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
