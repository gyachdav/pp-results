var SEQUENCE_VIEWER = function(config) {
  var targetDiv = config.targetDiv,
    theSequence = config.sequence;

  var numColumns = Math.floor((jQuery("#"+targetDiv).width()/10) / 20) * 10;
numColumns=20;
  var seqDiv = new Biojs.Sequence({
          sequence : theSequence,
          target : targetDiv,
          format : 'CODATA',
          id : '',
          formatOptions : {
          title:false,
          footer:false
      },
      columns:{
        size: numColumns,  
        spacedEach:15
      },
  });

  jQuery('#'+targetDiv).append(seqDiv);
};