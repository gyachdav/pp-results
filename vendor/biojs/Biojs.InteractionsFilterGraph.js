
Biojs.InteractionsFilterGraph=Biojs.extend({constructor:function(options){if(this._getObjectSize(this.opt.interactions)){this._setHtmlTemplate();this._createFilterOptions();this._setCytoscapeHeight();this._startCytoscape();}},opt:{target:"YourOwnDivId",instanceName:"instance",graphHeight:500,graphWidth:500,interactions:{},filters:{}},eventTypes:[],_setExample:function(){this.opt.interactions={"i1":["P1","P2"],"i2":["P3","P4"],"i3":["P5","P6"],"i4":["P2","P6"],"i5":["P2","P4"],"i6":["P6","P1"],"i7":["P2","P6"]};this.opt.filters={timeSeries:{title:"Time after Sendai viral infection (hours)",presentation:"radio",active:true,dataType:"edges",data:{"2":["i2","i3","i4"],"6":["i2","i5","i6","i7"],"12":["i1","i2","i3","i4","i6","i7"]}},interactionTypes:{title:"Interaction types",presentation:"radio",active:true,dataType:"edges",data:{"association":["i3","i4"],"physical association":["i2","i5","i6","i7"],"colocalization":["i1","i2"]}},publications:{title:"Publications",presentation:"checkbox",active:false,dataType:"edges",data:{"pumned01":["i1","i2","i3","i4","i5","i6","i7"],"pumned02":["i1","i2","i3","i4","i5","i6"],"pumned03":["i1","i2","i3","i6"],"pumned04":["i1","i3"],"pumned05":["i3"]}}};},_getObjectSize:function(object){var count=0;for(i in object){if(object.hasOwnProperty(i)){count++;}}
return count;},_setCytoscapeHeight:function(){this.opt.graphHeight=this.opt.graphHeight.toString();var height=this.opt.graphHeight;if(this.opt.graphHeight.indexOf("px")!=-1){height=this.opt.graphHeight.substring(0,this.opt.graphHeight.length-2);}
var filterHeight=jQuery("#"+this._filtersTarget).height();var cytoscapeHeight=parseInt(this.opt.graphHeight)-parseInt(filterHeight)-5;var cytoscape=jQuery("#"+this._cytoscapeTarget);cytoscape.height(cytoscapeHeight);},_getCytoscapeElements:function(){var self=this;var nodes=[];var edges=[];var elements=new Object();for(interactionId in self.opt.interactions){var interactors=self.opt.interactions[interactionId];edges.push({data:{id:interactionId,source:interactors[0],target:interactors[1]},classes:"alledges"});nodes.push({data:{id:interactors[0],weight:self.opt.nodeWeight},classes:"allnodes"});nodes.push({data:{id:interactors[1],weight:self.opt.nodeWeight},classes:"allnodes"});}
elements={"nodes":nodes,"edges":edges};return elements;},_startCytoscape:function(){var elements=this._getCytoscapeElements();var nodeSizeMapper={continuousMapper:{attr:{name:"weight",min:0,max:100},mapped:{min:15,max:30}}};jQuery("#"+this._cytoscapeTarget).cytoscapeweb({elements:elements,layout:{name:"arbor"},style:{selectors:{"node":{shape:"ellipse",fillColor:"#888",height:nodeSizeMapper,width:nodeSizeMapper,labelText:{passthroughMapper:"id"}},".unselect":{fillColor:"#888",lineColor:"#ccc"},"edge":{lineColor:"#ccc",targetArrowColor:"#ccc",width:{continuousMapper:{attr:{name:"weight"},mapped:{min:2,max:5}}}},"node:selected":{fillColor:"#CC0000"},"edge:selected":{lineColor:"#FF9999"}}},ready:function(cy){window.cy=cy;}});},_onCytoscapeReady:function(){alert("asdasdaa");},_printInteractionDetails:function(nodes,edges){var edgesMsg=jQuery('<span class="inInformation"><span class="miGreyText">Interactions: </span><span>'+edges+'</span></span>');var nodesMsg=jQuery('<span class="inInformation"><span class="miGreyText">Interactors: </span><span>'+nodes+'</span></span>');jQuery("#"+this._informationTarget).append(edgesMsg);jQuery("#"+this._informationTarget).append(nodesMsg);},highlightFilterOption:function(dataElement,filterName){jQuery(".miRadioBtn").not('.'+filterName+'RadioBtn').prop('checked',false);if(typeof filterName!=undefined){if(typeof dataElement!=undefined){if(dataElement=='none'){this.unselect();}
else if(typeof this.opt.filters[filterName].data[dataElement]!=undefined){var edgeIds="";var nodeIds="";for(key in this.opt.filters[filterName].data[dataElement]){if(this.opt.filters[filterName].data[dataElement].hasOwnProperty(key)){var edgeId=this.opt.filters[filterName].data[dataElement][key];if(typeof edgeId!='function'){edgeIds+="#"+edgeId+", ";if(this.opt.interactions[edgeId]!=undefined){for(i=0;i<this.opt.interactions[edgeId].length;i++){nodeIds+="#"+this.opt.interactions[edgeId][i]+", ";}}else{console.log("interaction"+edgeId+" undefined in interactions object");}}}}
edgeIds=edgeIds.substring(0,edgeIds.length-2);nodeIds=nodeIds.substring(0,nodeIds.length-2);this.unselect();cy.edges(edgeIds).select();this._printInteractionDetails(nodeIds.replace(/#/g,""),edgeIds.replace(/#/g,""));}else{console.log("dataElement undefined");}}else{console.log("dataElement undefined");}}else{console.log("filterName undefined");}},unselect:function(){cy.elements().unselect();jQuery("#"+this._informationTarget).empty();},_createFilterOptions:function(){for(key in this.opt.filters){if(this.opt.filters.hasOwnProperty(key)){if(this.opt.filters[key].active==true){var filterContainer=jQuery('<div class="miFilter" id="'+key+'Filter"></div>');var filterTitle=jQuery('<div class="miFilterTitle" id="'+key+'Title">'+this.opt.filters[key].title+'</div>');var filterOptions=jQuery('<div class="miFilterOptions" id="'+key+'Options"></div>');filterContainer.append(filterTitle);filterContainer.append(filterOptions);jQuery("#"+this._filtersTarget).append(filterContainer);if(this.opt.filters[key].presentation=="radio"){this._createRadioButtons(this.opt.filters[key].data,key,'#'+key+'Options');}else if(this.opt.filters[key].presentation=="checkbox"){}else{Biojs.console.log("ERROR: "+"filter presentation value unknown for filter "+key);}}}}},_createCheckBox:function(data,filterName,target){},_createRadioButtons:function(data,filterName,target){for(key in data){if(data.hasOwnProperty(key)){var br=jQuery('<br/>');var radioBtnContainer=jQuery('<span></span>');var radioBtn=jQuery('<input class="miRadioBtn '+filterName+'RadioBtn" type="radio" name="'+filterName+'" value="'+key+'" onclick="'+this.opt.instanceName+'.highlightFilterOption(\''+key+'\',\''+filterName+'\');" />');var radioBtnName=jQuery('<span class="miRadioBtnName">'+key+'</span>');radioBtnContainer.append(radioBtn);radioBtnContainer.append(radioBtnName);radioBtnContainer.appendTo(target);}}
var nondeRadioBtn=jQuery('<input class="miRadioBtn '+filterName+'RadioBtn" type="radio" name="'+filterName+'" value="'+key+'" onclick="'+this.opt.instanceName+'.highlightFilterOption(\'none\',\''+filterName+'\');" />');var noneRadioBtnName=jQuery('<span class="miRadioBtnName miGreyText">None</span>');nondeRadioBtn.appendTo(target);noneRadioBtnName.appendTo(target);},_setHtmlTemplate:function(){this.opt.graphWidth=this.opt.graphWidth.toString();var width=this.opt.graphWidth+"px";if(this.opt.graphWidth.indexOf("%")!=-1||this.opt.graphWidth.indexOf("px")!=-1){width=this.opt.graphWidth;}
var interactionFilters=jQuery('<div id="'+this._filtersTarget+'" style="width:'+width+';"></div>');var cytoscape=jQuery('<div class="miDisplay" id="'+this._cytoscapeTarget+'" style="width:'+width+';"></div>');var information=jQuery('<div id="'+this._informationTarget+'" style="width:'+width+';"></div>');jQuery("#"+this.opt.target).append(interactionFilters);jQuery("#"+this.opt.target).append(cytoscape);jQuery("#"+this.opt.target).append(information);},_cytoscapeTarget:"miCy",_filtersTarget:"miInteractionFilters",_informationTarget:"miInformation"});