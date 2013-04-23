
Biojs.Protein3D=Biojs.extend({constructor:function(options){var self=this;var width=this.opt.width;var height=this.opt.height;this._appletId="jmolApplet"+self.getId();this._container=jQuery('#'+this.opt.target).addClass('Protein3D');if(width==undefined){width=this._container.css('width');}else{this._container.width(width);}
if(height==undefined){height=this._container.css('height');}else{this._container.height(height);}
this.opt.backgroundColor=(this.opt.backgroundColor!==undefined)?this.opt.backgroundColor:this._container.css('background-color');this._container.html('');this._controlsContainer=jQuery('<div id="controlSection" class="Protein3D_tab"></div>').appendTo(this._container);this._appletContainer=jQuery('<div id="div'+self._appletId+'" class="Protein3D_applet"></div>').appendTo(this._container);this._loadingImage=jQuery('<div class="Protein3D_loadingImage" />').appendTo(this._container).hide();if(this.opt.loadingStatusImage!==undefined){this._loadingImage.css('background-image','url('+this.opt.loadingStatusImage+')');}
this._initializeJmolApplet();Biojs.console.log("ending Biojs.Protein3D constructor");},opt:{target:'component',width:597,height:400,jmolFolder:'../biojs/dependencies/jmol-12.0.48',unpolarColor:"salmon",negativeColor:"red",positiveColor:"blue",polarColor:"yellow",backgroundColor:"white",enableControls:true,loadingStatusImage:undefined,surface:"None",style:"Cartoon",colorScheme:"By Chain",antialias:false,rotate:false},eventTypes:["onPdbLoaded","onSelection"],_appletId:undefined,_controlsReady:false,_jmoljarfile:"JmolApplet.jar",_jmolAppletInitialized:false,_selection:undefined,_selectionType:undefined,_display:{property:{polar:false,unpolar:false,positive:false,negative:false},surface:false,halos:true},_initializeJmolApplet:function(){var self=this;jmolInitialize(self.opt.jmolFolder);jmolSetAppletColor(self.opt.backgroundColor);jmolSetDocument(0);var functionCbName=self._appletId+"_pdbLoadCb";Biojs.console.log("registring callback function loadStructCallback "+functionCbName);Biojs.registerGlobal(functionCbName,self._loadStructCallback);jmolSetCallback("loadStructCallback",functionCbName);},showControls:function(){this.changeControlsVisiblility(true);},hideControls:function(){this.changeControlsVisiblility(false);},changeControlsVisiblility:function(flag){if(this.opt.enableControls){if(!this._controlsReady){this._buildControls();}
if(flag!=this._controlsAreVisible()){this._toggleControls();}}},getSelection:function(){return Biojs.Utils.clone(this._selection);},reset:function(){jmolScriptWait(this._getDisplayColor(this.opt.colorScheme)+this._getDisplayStyle(this.opt.style),this.getId());var theTargetDiv=jQuery("#"+this.opt.target);theTargetDiv.find("div#controlSection > div#controls > input[type='checkbox']").attr("checked",false);theTargetDiv.find('#styleSelect').val(this.opt.style);theTargetDiv.find('#colorSelect').val(this.opt.colorScheme);theTargetDiv.find('#surfaceSelect').val(this.opt.style);for(var key in this._display.property){this._display.property[key]=false;}
this.setHalosVisible(true);},showLoadingImage:function(flag){var visible=(flag===undefined)?true:flag;if(this._loadingImage.is(':visible')!=visible){this._controlsContainer.toggle();this._appletContainer.toggle();this._loadingImage.toggle();}},setPdb:function(pdb){Biojs.console.log("LOADING pdb content");var self=this;var surfaceCmd=this._getDisplaySurface(this.opt.surface);var styleCmd=this._getDisplayStyle(this.opt.style);var colorSchemeCmd=this._getDisplayColor(this.opt.colorScheme);var scr=colorSchemeCmd+styleCmd+surfaceCmd+this._getSelectionScript(this._selection);this.showLoadingImage(false);if(this._jmolAppletInitialized){this.reset();}
htmlContent=jmolAppletInline([self._appletContainer.width(),self._appletContainer.height()],pdb,scr,self.getId());this._appletContainer.html(htmlContent);this._jmolAppletInitialized=true;Biojs.console.log("setPdb() ending");},removeSelection:function(){this._selection=undefined;var scr='select all; ';scr+=(!this._display.halos)?'color translucent 1; ':'selectionHalos off; ';scr+='select none;'
jmolScriptWait(scr,this.getId());},setSelection:function(selection){if(selection instanceof Array){this._selection=Biojs.Utils.clone(selection);this._drawSelection();this.raiseEvent(Biojs.Protein3D.EVT_ON_SELECTION,{selectionType:this._selectionType,selection:Biojs.Utils.clone(selection)});}
else if(selection instanceof Object&&selection.start<=selection.end){this._selection=Biojs.Utils.clone(selection);this._drawSelection();this.raiseEvent(Biojs.Protein3D.EVT_ON_SELECTION,{selectionType:"region",selection:Biojs.Utils.clone(selection)});}else{Biojs.console.log("selection not valid");}},_getSelectionScript:function(selection){var scr="";var selectionText="";var singleRegion=false;var regionInSelection=false;var positionInSelection=false;if(selection){scr='select all; color translucent 1;';if(selection instanceof Array){for(i=0;i<selection.length;i++){if(selection[i]instanceof Object){selectionText=selectionText+selection[i].start+"-"+selection[i].end;regionInSelection=true;}else{selectionText=selectionText+selection[i];positionInSelection=true;}
if(i!=(selection.length-1)){selectionText=selectionText+",";}}}else{selectionText=selection.start+"-"+selection.end;singleRegion=true;}
if(!this._display.halos){scr+='select not '+selectionText+'; color translucent 0.8; selectionHalos off;';}else{scr+='select '+selectionText+'; selectionHalos on;';}}else{scr="select none";}
Biojs.console.log("Selection script: "+scr);if(singleRegion==true){this._selectionType="region";}else if((regionInSelection==true)&&(positionInSelection==true)){this._selectionType="mixed";}else if((regionInSelection==true)&&(positionInSelection==false)){this._selectionType="multipleRegion";}else if((regionInSelection==false)&&(positionInSelection==true)){this._selectionType="positions";}else{this._selectionType="region";}
Biojs.console.log("Selection type: "+this._selectionType);return scr;},_drawSelection:function(){if(this._selection!==undefined){result=jmolScriptWait(this._getSelectionScript(this._selection),this.getId());Biojs.console.log("Selection done, result: "+result);}},displayAntialias:function(flag){this._getControl('antialiasCheck').attr("checked",flag);this.applyJmolCommand('set antialiasDisplay '+flag);},rotate:function(flag){this._getControl('rotationCheck').attr("checked",flag);this.applyJmolCommand('spin '+flag);},displaySurface:function(name){var surfaceCmd=this._getDisplaySurface(name);if(surfaceCmd===undefined){Biojs.console.log("Unknown surface name "+name);return;}
this._getControl('surfaceSelect').val(name);this.applyJmolCommand(surfaceCmd+this._getSelectionScript(this._selection));},hideSurface:function(){this.displaySurface(Biojs.Protein3D.SURFACE_NONE);},displayNegative:function(color,flag){color=(color!==undefined)?color:this.opt.positiveColor;flag=(flag!==undefined)?flag:true;this._getControl('negativeCheck').attr("checked",flag);(flag)?this.display('acidic',color):this.undisplay('acidic');this._display.property.negative=flag;},hideNegative:function(){this.displayNegative(undefined,false);},displayPositive:function(color,flag){color=(color!==undefined)?color:this.opt.positiveColor;flag=(flag!==undefined)?flag:true;this._getControl('positiveCheck').attr("checked",flag);(flag)?this.display('basic',color):this.undisplay('basic');this._display.property.positive=flag;},hidePositive:function(){this.displayPositive(undefined,false);},displayPolar:function(color,flag){polarColor=(color!==undefined)?color:this.opt.polarColor;flag=(flag!==undefined)?flag:true;this._getControl('polarCheck').attr("checked",flag);(flag)?this.display('polar',polarColor):this.undisplay('polar');this._display.property.polar=flag;},_getControl:function(name){return jQuery(jQuery("#"+this.opt.target).find('#'+name)[0]);},hidePolar:function(){this.displayPolar(undefined,false);},displayUnPolar:function(color,flag){color=(color!==undefined)?color:this.opt.unpolarColor;flag=(flag!==undefined)?flag:true;this._getControl('unpolarCheck').attr("checked",flag);(flag)?this.display('hydrophobic',color):this.undisplay('hydrophobic');this._display.property.unpolar=flag;},displayColorScheme:function(colorScheme){colorCmd=this._getDisplayColor(colorScheme);if(colorCmd===undefined){Biojs.console.log("Unknown color scheme "+colorScheme);return;}
this._getControl("colorSelect").val(colorScheme);this.applyJmolCommand(colorCmd+this._getSelectionScript(this._selection));},displayStyle:function(style){var styleCmd=this._getDisplayStyle(style);if(styleCmd===undefined){Biojs.console.log("Unknown style name "+style);return;}
this._getControl("styleSelect").val(style);this.applyJmolCommand(styleCmd+this._getSelectionScript(this._selection));},hideUnPolar:function(){this.displayUnPolar(undefined,false);},setHalosVisible:function(value){this._display.halos=value;if(value){if(!jQuery("#"+this.opt.target).find('#halosRadio:checked').val()){jQuery("#"+this.opt.target).find('#halosRadio').attr("checked","halosRadio");jQuery("#"+this.opt.target).find('#translucentRadio').removeAttr("checked");}}else{if(jQuery("#"+this.opt.target).find('#halosRadio:checked').val()){jQuery("#"+this.opt.target).find('#halosRadio').removeAttr("checked");jQuery("#"+this.opt.target).find('#translucentRadio').attr("checked","translucentRadio");}}
this._drawSelection();},applyJmolCommand:function(cmd){jmolScriptWait(cmd,this.getId());},display:function(property,color){scr=(this._isAnyDisplayed())?'':'select all; color lightgrey;';scr+='select '+property+';color '+color+'; select none';jmolScriptWait(scr,this.getId());Biojs.console.log("applied: "+scr);this._drawSelection();},changeBackgroundColor:function(color){this.applyJmolCommand('background '+((color!==undefined)?color:this.opt.backgroundColor));},undisplay:function(property){scr='select '+property+';color lightgrey; select none;'
scr+=(this._isAnyDisplayed())?'':'select all; color chain; select none;';jmolScriptWait(scr,this.getId());Biojs.console.log("applied: "+scr);this._drawSelection();},_isAnyDisplayed:function(){for(var key in this._display.property){if(this._display.property[key]){return true;}}
return false;},_buildTabPanel:function(container,onVisibilityChangeCb){container.html('');var content=jQuery('<div class="content"></div>').appendTo(container);content.expand=jQuery('<div style="display: none;" class="toggle expand"></div>').appendTo(container);content.collapse=jQuery('<div class="toggle collapse"/>').appendTo(container);var contentWidth=container.width()-content.expand.outerWidth();container.css('left',0).find('.toggle.collapse').click(function(){container.animate({left:(content.expand.width()-container.outerWidth())+"px"},function(){container.find('.toggle').toggle();if("function"==typeof onVisibilityChangeCb){onVisibilityChangeCb.call(content,false,content.expand.outerWidth());}
content.hide();container.css({left:'0px',width:'auto'});});}).css({'float':'right','position':'relative'});container.find('.toggle.expand').click(function(){container.css({left:(-contentWidth)+"px"});content.show();container.animate({left:'0px'},function(){container.find('.toggle').toggle();if("function"==typeof onVisibilityChangeCb){onVisibilityChangeCb.call(content,true,container.outerWidth());}});});Biojs.console.log('content width '+contentWidth);content.css({'width':contentWidth+"px",'height':container.height()+"px",'word-wrap':'break-word'});return content;},_buildControls:function(){Biojs.console.log("_buildControls()");if(this._controlsReady){Biojs.console.log("exiting _buildControls(): controls has been built already.");return;}
var self=this;jmolResizeApplet([self._container.width()-self._controlsContainer.outerWidth(),self._container.height()],self.getId());this._controlsDiv=this._buildTabPanel(this._controlsContainer,function(isVisible,visibleWidth){jmolResizeApplet([self._container.width()-visibleWidth,self._container.height()],self.getId());self._appletContainer.css("width",self._container.width()-visibleWidth);});var controlDiv=this._controlsDiv.append('<h1> Display: </h1>'+'<input id="polarCheck" type="checkbox" name="polarCheck" value="polarCheck"/> Hydrophylic residues<br/>'+'<input id="unpolarCheck" type="checkbox" name="unpolarCheck" value="unpolarCheck"/> Hydrophobic residues<br/>'+'<input id="positiveCheck" type="checkbox" name="positiveCheck" value="positiveCheck"/> Basic(+) residues<br/>'+'<input id="negativeCheck" type="checkbox" name="negativeCheck" value="negativeCheck"/> Acidic(-) residues<br/>'+'<input id="antialiasCheck" type="checkbox" name="antialiasCheck" value="antialiasCheck"/> Antialias<br/>'+'<input id="backgroundCheck" type="checkbox" name="backgroundCheck" value="backgroundCheck"/> Black background<br/>'+'<input id="rotationCheck" type="checkbox" name="rotationCheck" value="rotationCheck"/> Rotation'+'<h1>Style:</h1><select id="styleSelect">'+'<option selected="selected">'+Biojs.Protein3D.STYLE_CARTOON+'</option>'+'<option >'+Biojs.Protein3D.STYLE_BACKBONE+'</option>'+'<option >'+Biojs.Protein3D.STYLE_CPK+'</option>'+'<option >'+Biojs.Protein3D.STYLE_BALL_STICK+'</option>'+'<option >'+Biojs.Protein3D.STYLE_LIGANDS+'</option>'+'<option >'+Biojs.Protein3D.STYLE_LIGANDS_POCKET+'</option>'+'</select>'+'<h1>Color:</h1><select id="colorSelect">'+'<option selected="selected">'+Biojs.Protein3D.COLOR_BY_CHAIN+'</option>'+'<option >'+Biojs.Protein3D.COLOR_SECONDARY_STRUCTURE+'</option>'+'<option >'+Biojs.Protein3D.COLOR_RAINBOW+'</option>'+'<option >'+Biojs.Protein3D.COLOR_BY_ELEMENT+'</option>'+'<option >'+Biojs.Protein3D.COLOR_BY_AMINO_ACID+'</option>'+'<option >'+Biojs.Protein3D.COLOR_BY_TEMPERATURE+'</option>'+'<option >'+Biojs.Protein3D.COLOR_HIDROPHOBICITY+'</option>'+'</select>'+'<h1>Surface:</h1><select  id="surfaceSelect">'+'<option selected="selected">'+Biojs.Protein3D.SURFACE_NONE+'</option>'+'<option >'+Biojs.Protein3D.SURFACE_ACCESSIBLE+'</option>'+'<option >'+Biojs.Protein3D.SURFACE_EXCLUDED+'</option>'+'<option >'+Biojs.Protein3D.SURFACE_CAVITIES+'</option>'+'</select>'+'<h1> Show selection using:</h1>'+'<input id="translucentRadio" type="radio" name="selection" value="translucentRadio"/> Translucent '+'<input id="halosRadio" type="radio" name="selection" value="halosRadio" checked="halosRadio"/> Halos').change(function(e){var targetId=jQuery(e.target).attr('id');switch(targetId){case"polarCheck":self.displayPolar(undefined,e.target.checked);break;case"unpolarCheck":self.displayUnPolar(undefined,e.target.checked);break;case"positiveCheck":self.displayPositive(undefined,e.target.checked);break;case"negativeCheck":self.displayNegative(undefined,e.target.checked);break;case"antialiasCheck":self.displayAntialias(event.target.checked);break;case"rotationCheck":self.rotate(event.target.checked);break;case"backgroundCheck":self.changeBackgroundColor("black",e.target);break;case"styleSelect":self.displayStyle(e.target.value);break;case"colorSelect":self.displayColorScheme(e.target.value);break;case"surfaceSelect":self.displaySurface(e.target.value);break;case"translucentRadio":self.setHalosVisible(false);break;case"halosRadio":self.setHalosVisible(true);break;default:;}});this._controlsReady=true;Biojs.console.log("_buildControls done");},_controlsAreVisible:function(){return this._controlsContainer.find('.toggle.collapse').is(':visible');},_toggleControls:function(){if(this._controlsAreVisible()){this._controlsContainer.find('.toggle.collapse').click();}else{this._controlsContainer.find('.toggle.expand').click();}},_addControl:function(html){this._controlsDiv.append(html);},_getDisplayStyle:function(text){if(text==Biojs.Protein3D.STYLE_CARTOON){return"hide null; select all;  spacefill off; wireframe off; backbone off;"+" cartoon on; "+" select ligand; wireframe 0.16;spacefill 0.5; color cpk; "+" select *.FE; spacefill 0.7; color cpk ; "+" select *.CU; spacefill 0.7; color cpk ; "+" select *.ZN; spacefill 0.7; color cpk ; "+" select all; ";}
else if(text==Biojs.Protein3D.STYLE_BACKBONE){return"hide null; select all; spacefill off; wireframe off; backbone 0.4;"+" cartoon off; "+" select ligand; wireframe 0.16;spacefill 0.5; color cpk; "+" select *.FE; spacefill 0.7; color cpk ; "+" select *.CU; spacefill 0.7; color cpk ; "+" select *.ZN; spacefill 0.7; color cpk ; "+" select all; ";}else if(text==Biojs.Protein3D.STYLE_CPK){return"hide null; select all; spacefill off; wireframe off; backbone off;"+" cartoon off; cpk on;"+" select ligand; wireframe 0.16;spacefill 0.5; color cpk; "+" select *.FE; spacefill 0.7; color cpk ; "+" select *.CU; spacefill 0.7; color cpk ; "+" select *.ZN; spacefill 0.7; color cpk ; "+" select all; ";}
else if(text==Biojs.Protein3D.STYLE_LIGANDS){return"restrict ligand; cartoon off; wireframe on;  display selected;"+" select *.FE; spacefill 0.7; color cpk ; "+" select *.CU; spacefill 0.7; color cpk ; "+" select *.ZN; spacefill 0.7; color cpk ; "+" select all; ";}
else if(text==Biojs.Protein3D.STYLE_LIGANDS_POCKET){return" select within (6.0, true, ligand); cartoon off; wireframe on; backbone off; display selected; "+" select *.FE; spacefill 0.7; color cpk ; "+" select *.CU; spacefill 0.7; color cpk ; "+" select *.ZN; spacefill 0.7; color cpk ; "+" select all; ";}
else if(text==Biojs.Protein3D.STYLE_BALL_STICK){return"hide null; restrict not water;  wireframe 0.2; spacefill 25%;"+" cartoon off; backbone off; "+" select ligand; wireframe 0.16; spacefill 0.5; color cpk; "+" select *.FE; spacefill 0.7; color cpk ; "+" select *.CU; spacefill 0.7; color cpk ; "+" select *.ZN; spacefill 0.7; color cpk ; "+" select all; ";}else{return undefined;}},_getDisplayColor:function(text){if(text==Biojs.Protein3D.COLOR_BY_CHAIN){return"hide null; select all; cartoon on; wireframe off; spacefill off; color chain; select ligand; wireframe 0.16; spacefill 0.5; color chain ; select all; ";}
else if(text==Biojs.Protein3D.COLOR_BY_TEMPERATURE){return"hide null; select all;spacefill off; wireframe off; backbone 0.4; cartoon off; set defaultColors Jmol; color relativeTemperature; color cartoon relateiveTemperature select ligand;wireframe 0.16;spacefill 0.5; color cpk ;; select all; ";}
else if(text==Biojs.Protein3D.COLOR_RAINBOW){return"hide null; select all; set defaultColors Jmol; color group; color cartoon group; select ligand;wireframe 0.16;spacefill 0.5; color cpk ; select all; ";}
else if(text==Biojs.Protein3D.COLOR_SECONDARY_STRUCTURE){return"hide null; select all; set defaultColors Jmol; color structure; color cartoon structure;select ligand;wireframe 0.16;spacefill 0.5; color cpk ;; select all; ";}
else if(text==Biojs.Protein3D.COLOR_BY_ELEMENT){return"hide null; select all; set defaultColors Jmol; color cpk; color cartoon cpk; select ligand;wireframe 0.16; spacefill 0.5; color cpk ; select all; ";}
else if(text==Biojs.Protein3D.COLOR_BY_AMINO_ACID){return"hide null; select all; set defaultColors Jmol; color amino; color cartoon amino; select ligand;wireframe 0.16;spacefill 0.5; color cpk ;; select all; ";}
else if(text==Biojs.Protein3D.COLOR_HIDROPHOBICITY){return"hide null; set defaultColors Jmol; select hydrophobic; color red; color cartoon red; select not hydrophobic ; color blue ; color cartoon blue; select ligand;wireframe 0.16;spacefill 0.5; color cpk ;; select all; ";}else{return undefined;}},_getDisplaySurface:function(text){if(text==Biojs.Protein3D.SURFACE_NONE){return"select all; isosurface off; select none;";}
else if(text==Biojs.Protein3D.SURFACE_ACCESSIBLE){return"select all; isosurface sasurface 1.2; color isoSurface translucent 0.8; select none;";}
else if(text==Biojs.Protein3D.SURFACE_EXCLUDED){return"select all; isosurface solvent 1.2; color isoSurface translucent 0.8; select none;";}
else if(text==Biojs.Protein3D.SURFACE_CAVITIES){return"select all; isosurface cavity 1.2 10; color isoSurface translucent 0.8; select none;";}else{return undefined;}},toString:function(){return"Biojs.Protein3D";},_loadStructCallback:function(appletId,url,file,title,message,code,formerFrame,frame){Biojs.console.log("executing _loadStructCallback for "+appletId);switch(code){case 3:result='success';break;case 0:result='zapped';break;case-1:result='failure';break;default:result='undefined';break;}
if("zapped"!=result){var instanceId=parseInt(appletId.replace("jmolApplet",''));var instance=Biojs.getInstance(instanceId);if("success"==result){instance.showControls();instance.displayAntialias(instance.opt.antialias);instance.rotate(instance.opt.rotate);}
instance.raiseEvent(Biojs.Protein3D.EVT_ON_PDB_LOADED,{"file":title,"result":result,"message":message});}}},{COLOR_BY_CHAIN:"By Chain",COLOR_SECONDARY_STRUCTURE:"Secondary Structure",COLOR_RAINBOW:"Rainbow",COLOR_BY_ELEMENT:"By Element",COLOR_BY_AMINO_ACID:"By Amino Acid",COLOR_BY_TEMPERATURE:"By Temperature",COLOR_HIDROPHOBICITY:"Hidrophobicity",SURFACE_NONE:"None",SURFACE_ACCESSIBLE:"Solvent Accessible",SURFACE_EXCLUDED:"Solvent Excluded",SURFACE_CAVITIES:"Cavities",STYLE_CARTOON:"Cartoon",STYLE_BACKBONE:"Backbone",STYLE_CPK:"CPK",STYLE_BALL_STICK:"Ball and Stick",STYLE_LIGANDS:"Ligands",STYLE_LIGANDS_POCKET:"Ligands and Pocket",EVT_ON_PDB_LOADED:"onPdbLoaded",EVT_ON_SELECTION:"onSelection"});