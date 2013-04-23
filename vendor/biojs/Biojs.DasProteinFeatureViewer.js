
Biojs.DasProteinFeatureViewer=Biojs.FeatureViewer.extend({_webservice:"http://wwwdev.ebi.ac.uk/uniprot/featureViewer/image",_dasReference:"http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot/",constructor:function(options){this.base(options);var self=this;var params="?";params=params+"&option=raphael";if(!Biojs.Utils.isEmpty(options.segment)){params=params+"&segment="+options.segment;}else{throw"A UniProt accession or identifier is mandatory";}
if(!Biojs.Utils.isEmpty(options.dasSources)){params=params+"&dasSources="+options.dasSources;}
if(!Biojs.Utils.isEmpty(options.featureTypes)){params=params+"&"+options.featureTypes;}
if(!Biojs.Utils.isEmpty(options.featureNames)){params=params+"&"+options.featureNames;}
if((options.imageWidth!=undefined)&&(!isNaN(options.imageWidth))){params=params+"&width="+options.imageWidth;}
if(!Biojs.Utils.isEmpty(options.imageStyle)){params=params+"&style="+options.imageStyle;}
if((options.hgrid!=undefined)&&(options.hgrid==true)){params=params+"&hgrid";}
if((options.vgrid!=undefined)&&(options.vgrid==true)){params=params+"&vgrid";}
if((options.allFeatures!=undefined)&&(options.allFeatures==true)){params=params+"&allFeatures";}
if((options.allRectangles!=undefined)&&(options.allRectangles==true)){params=params+"&allRectangles";}
if((options.allSameSize!=undefined)&&(options.allSameSize==true)){params=params+"&allSameSize";}
this.opt.json="";this.opt.featureImageWebService=this._webservice;jQuery.ajax({url:self.opt.proxyUrl,data:"url="+this._webservice+params,success:function(response,callOptions){json=jQuery.parseJSON(response);try{self.opt.json=json;if(!Biojs.Utils.isEmpty(self.opt.json)){self.paintFeatures(self.opt.json)}}catch(err){Biojs.console.log(err);document.getElementById(self.opt.target).innerHTML='';document.getElementById(self.opt.target).innerHTML='No image available. Did you provide a valid UniProt accession or identifier, and valid limits?';}},error:function(response,callOptions){Biojs.console.log(error);document.getElementById(self.opt.target).innerHTML='';document.getElementById(self.opt.target).innerHTML='No image available. Did you provide a valid UniProt accession or identifier, and valid limits?';}});},opt:{dasSources:"http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot",featureTypes:"",featureNames:"",imageWidth:700,imageStyle:"nonOverlapping",optionResponse:"raphael",hgrid:false,vgrid:false,allFeatures:true,allRectangles:false,allSameSize:false,proxyUrl:"../biojs/dependencies/proxy/proxy.php"},eventTypes:[],applyStyle:function(style){if((style!=undefined)&&((style=="centered")||(style=="nonOverlapping")||(style="rows"))){var config=this.opt.json.configuration;this.customize(style,config.horizontalGrid,config.verticalGrid);}},showHideHorizontalGrid:function(show){if((show!=undefined)&&((show==true)||(show==false))){var config=this.opt.json.configuration;this.customize(config.style,show,config.verticalGrid);}},showHideVerticalGrid:function(show){if((show!=undefined)&&((show==true)||(show==false))){var config=this.opt.json.configuration;this.customize(config.style,config.horizontalGrid,show);}}});