
Biojs.DetailsFrame=Biojs.extend({constructor:function(options){var self=this;var target=self.opt.target;var html='';if(self.opt.minizable)
html+='  <div class="minimize to_minimize" " ></div>';if(self.opt.draggable)
html+='  <div class="dragger" src="../../main/resources/css/images/draggable.png" ></div>';html+='  <header class="protein-label" />';html+='  <ul />';$("#"+target).addClass("protein");$("#"+target).append(html);self.updateFeatures();if(self.opt.minizable)
$("#"+target+" .minimize").click(function(){if($("#"+target+" ul").css('display')=="none"){$("#"+target+" ul").show();$(this).removeClass("minimized");$(this).addClass("to_minimize");}else{$("#"+target+" ul").hide();$(this).removeClass("to_minimize");$(this).addClass("minimized");}});if(self.opt.draggable){$("#"+target).draggable({cursor:"move",cancel:"ul"});}},opt:{target:"YourOwnDivId",features:{"id":"Not loaded"},minizable:true,draggable:true},eventTypes:["onFeaturesUpdated"],updateFeatures:function(features,order){var self=this;if(typeof features!="undefined")
self.opt.features=features;$("#"+self.opt.target+" header").html(self.opt.features.id);var html='';if(typeof self.opt.features["description"]!="undefined")
html+='   <li class="protein-description"><h2>'+self.opt.features["description"]+'</h2></li>';if(typeof order=="undefined")
for(var i in self.opt.features){if((i!="description")&&(i!='id'))
html+='   <li><b>'+i+':</b>'+self.opt.features[i]+'</li>';}
else
for(var i=0;i<order.length;i++){html+='   <li><b>'+order[i]+':</b>'+self.opt.features[order[i]]+'</li>';}
$("#"+self.opt.target+" ul").html(html);self.raiseEvent('onFeaturesUpdated',{});}});