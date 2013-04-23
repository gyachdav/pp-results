
Biojs.HpaSummaryFeatures=Biojs.HpaSummaryFeature.extend({constructor:function(options){var self=this;this.setHpaDasUrl(self.opt.hpaDasUrl);},setHpaDasUrl:function(hpaDasUrl){var self=this;self._url;if(self.opt.proxyUrl!=""){self._url=self.opt.proxyUrl+"?url="+hpaDasUrl;}else{self._url=hpaDasUrl;}
jQuery.ajax({type:"GET",url:self._url,dataType:"xml",success:function(a){self._processDasHpaXml(a);},error:function(a){self._processErrorRequest(a);}});},_processDasHpaXml:function(xml)
{var self=this;Biojs.console.log("SUCCESS: data received");var antibodies=this._getAntibodiesAccessions(xml);if(antibodies.length>0){var html=this._createHtmlContainer(antibodies);jQuery('#'+self.opt.target+'').html(html);this._displayHpaSummaries(xml,antibodies)}else{jQuery('#'+self.opt.target+'').html(Biojs.HpaSummaryFeatures.MESSAGE_NODATA);}},_processErrorRequest:function(textStatus){var self=this;Biojs.console.log("ERROR: "+textStatus);self.raiseEvent(Biojs.HpaSummaryFeatures.EVT_ON_REQUEST_ERROR,{message:textStatus});},_getAntibodiesAccessions:function(xml){var tempSet=new Object();jQuery(xml).find("PARENT").each(function(){var antibodyTextSplit=jQuery(this).attr("id").split("_");if(antibodyTextSplit.length==2){tempSet[antibodyTextSplit[0]]=true;}});var antibodies=new Array();for(var a in tempSet){antibodies.push(a);}
return antibodies;},_createHtmlContainer:function(antibodies){var self=this;var html='';jQuery.each(antibodies,function(key,value){html+='<div style="width:'+self.opt.width+';" class="'+Biojs.HpaSummaryFeatures.COMPONENT_PREFIX+'antibodyTitle">Antibody '+value+'</div>'
html+='<div class="'+Biojs.HpaSummaryFeatures.COMPONENT_PREFIX+'summary" id="'+value+'_cell_line_immunofluorescence_summary"></div>';html+='<div class="'+Biojs.HpaSummaryFeatures.COMPONENT_PREFIX+'summary" id="'+value+'_cell_line_immunohistochemistry_summary"></div>';html+='<div class="'+Biojs.HpaSummaryFeatures.COMPONENT_PREFIX+'summary" id="'+value+'_cell_line_immunohistochemistry_summary"></div>';html+='<div class="'+Biojs.HpaSummaryFeatures.COMPONENT_PREFIX+'summary" id="'+value+'_cancer_tissue_immunohistochemistry_summary"></div>';html+='<div class="'+Biojs.HpaSummaryFeatures.COMPONENT_PREFIX+'summary" id="'+value+'_normal_tissue_immunohistochemistry_summary"></div>';});return html;},_displayHpaSummaries:function(xml){var self=this;jQuery(xml).find("FEATURE").each(function(){if(jQuery(this).attr("id").indexOf("_summary")!=-1){var notes=new Array();var xmlNotes=jQuery(this).find("NOTE");xmlNotes.each(function(){notes.push(jQuery(this).text());});var imageUrl="";var imageTitle="";var linkUrl="";var linkTitle="";var xmlLinks=jQuery(this).find("LINK");xmlLinks.each(function(){if(jQuery(this).attr("href").indexOf(".jpg")!=-1||jQuery(this).attr("href").indexOf(".png")!=-1){imageUrl=jQuery(this).attr("href");imageTitle=jQuery(this).text();}
else
if(jQuery(this).text().indexOf("original source")!=-1){linkUrl=jQuery(this).attr("href");linkTitle=jQuery(this).text();}});new Biojs.HpaSummaryFeature({target:jQuery(this).attr("id"),title:jQuery(this).attr("label"),imageUrl:imageUrl,imageTitle:imageTitle,notes:notes,linkUrl:linkUrl,linkTitle:linkTitle,width:self.opt.width,imageWidth:self.opt.imageWidth});}});},opt:{target:'hpaSummaryFeatues',hpaDasUrl:'',proxyUrl:'../biojs/dependencies/proxy/proxy.php',width:'900px',imageWidth:'200px'},eventTypes:["onRequestError"]},{COMPONENT_PREFIX:"hpaSummaryFeatures_",MESSAGE_NODATA:"Sorry, we could not find summary data for your request",EVT_ON_REQUEST_ERROR:"onRequestError",});