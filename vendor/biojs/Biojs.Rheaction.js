
Biojs.Rheaction=Biojs.extend({constructor:function(options){this.setId(this.opt.id);},setId:function(id){this._clearContent();var self=this;var rheaId=id.replace('RHEA:','');this._rheaIdLabel='RHEA_'+rheaId;if("string"==(typeof this.opt.target)){this._container=jQuery("#"+this.opt.target);}else{this.opt.target="biojs_Rheaction_"+rheaId;this._container=jQuery('<div id="'+this.opt.target+'"></div>');}
this._container.addClass('scrollpane');this._reactionRow=jQuery('<div/>',{"class":'reactionRow'});this._container.append(this._reactionRow);this._getCml(rheaId);},opt:{target:undefined,id:undefined,dimensions:'200',proxyUrl:'../biojs/dependencies/proxy/proxy.php',rheaWsUrl:'http://www.ebi.ac.uk/rhea/rest/1.0/ws/reaction/cmlreact/',chebiUrl:'http://www.ebi.ac.uk/chebi/searchId.do?chebiId=',chebiImgUrl:'http://www.ebi.ac.uk/chebi/displayImage.do?defaultImage=true&scaleMolecule=true&chebiId='},_clearContent:function(){jQuery("#"+this.opt.target).html("");},_displayNoDataMessage:function(){jQuery('#'+this.opt.target+'').html(Biojs.Rheaction.MESSAGE_NODATA);},_getCml:function(rheaId){var self=this;var reactionUrl=this.opt.rheaWsUrl+rheaId;var httpRequest={url:reactionUrl,method:'GET',success:function(xml){self._dataReceived(xml);},error:function(qXHR,textStatus,errorThrown){Biojs.console.log("ERROR requesting reaction. Response: "+textStatus);}};if(this.opt.proxyUrl!=undefined){httpRequest.url=this.opt.proxyUrl;httpRequest.data=[{name:"url",value:reactionUrl}];httpRequest.dataType="text";}
jQuery.ajax(httpRequest);},_dataReceived:function(xml){var self=this;var data={};var xmlDoc="";if(xml.length>0){try{xmlDoc=jQuery.parseXML(xml);xmlResult=jQuery(xmlDoc).find('reaction');var reactants=xmlResult.find('reactant');for(var i=0;i<reactants.length;i++){if(i>0)self._addPlus();self._addParticipant(reactants[i]);}
self._addDirection(xmlResult.attr('convention'));var products=xmlResult.find('product');for(var i=0;i<products.length;i++){if(i>0)self._addPlus();self._addParticipant(products[i]);}}catch(e){Biojs.console.log("ERROR decoding ");Biojs.console.log(e);this._displayNoDataMessage();}}},_addPlus:function(){jQuery('<div/>',{"class":'direction',html:'+'}).appendTo(this._reactionRow);},_addDirection:function(convention){var direction=convention.replace('rhea:direction.','');var dirLabel=undefined;switch(direction){case'UN':dirLabel='&lt;?&gt;';break;case'BI':dirLabel='&lt;=&gt;';break;default:dirLabel='=&gt;';break;}
jQuery('<div/>',{"class":'direction',html:dirLabel}).appendTo(this._reactionRow);},_addParticipant:function(participant){var coef=parseInt(participant.attributes['count'].value);var molecule=jQuery(participant).find('molecule')[0];var compoundName=molecule.attributes['title'].value;var chebiId=molecule.attributes['id'].value.replace('CHEBI:','');var compDivId=this._rheaIdLabel+'_CHEBI_'+chebiId;jQuery('<div/>',{id:compDivId,"class":'compound',css:{width:this.opt.dimensions}}).appendTo(this._reactionRow);if(coef>1){$('#'+compDivId).append(jQuery('<span/>',{"class":'stoichCoef',html:coef}));}
$('#'+compDivId).append(jQuery('<a/>',{"class":'compoundName',html:compoundName,href:this.opt.chebiUrl+chebiId,title:'CHEBI:'+chebiId}));$('#'+compDivId).append(jQuery('<br/>'));var imgUrl=this.opt.chebiImgUrl+chebiId
+'&dimensions='+this.opt.dimensions;$('#'+compDivId).append(jQuery('<img/>',{src:imgUrl,"class":'compoundStructure',title:'CHEBI:'+chebiId}));}},{MESSAGE_NODATA:"Sorry, no results for your request",});