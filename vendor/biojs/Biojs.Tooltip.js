
Biojs.Tooltip=Biojs.extend({constructor:function(options){var self=this;var arrowType=this.opt.arrowType;this._container=jQuery('<div id="biojsTooltip'+self.getId()+'"></div>').addClass("Tooltip");this._arrow=jQuery('<div class="arrow"></div>').appendTo(self._container);this._body=jQuery('<div class="body"></div>').appendTo(self._container);this._container.appendTo('body');this._initialize();},opt:{targetSelector:"a",cbRender:undefined,arrowType:"left_top",position:2,delay:200},eventTypes:["onShowUp"],_initialize:function(){var self=this;var timer=0;var targetSelector=this.opt.targetSelector;var cbRender=this.opt.cbRender;var refPos=this.opt.position;var target;if("function"!=typeof cbRender){cbRender=function(element){return jQuery(element).attr('title');}}
this.setArrowType(this.opt.arrowType);this._arrow.css({"position":"absolute","z-index":"99999"});this._body.css({'position':'absolute','z-index':'99998','margin':'0px'});if(refPos==Biojs.Tooltip.MOUSE_POSITION){jQuery(targetSelector).mousemove(function(e){target=jQuery(e.target);if(timer){clearTimeout(timer);}
timer=0;content=cbRender.call(self,e.target);self._body.html(content);self._show();self._setPosition({left:e.pageX-10,top:e.pageY-10},{width:20,height:20});self.raiseEvent(Biojs.Tooltip.EVT_ON_SHOW_UP,{'target':target});}).mouseout(function(){timer=setTimeout('Biojs.getInstance('+self.getId()+')._hide()',self.opt.delay);});}else{jQuery(targetSelector).mouseover(function(e){target=jQuery(e.target);if(timer){clearTimeout(timer);}
timer=0;content=cbRender.call(self,e.target);self._body.html(content);self._show();self._setPosition(target.offset(),{width:target.width(),height:target.height()});self.raiseEvent(Biojs.Tooltip.EVT_ON_SHOW_UP,{'target':target});}).mouseout(function(){timer=setTimeout('Biojs.getInstance('+self.getId()+')._hide()',self.opt.delay);});}
self._container.mouseover(function(){clearTimeout(timer);timer=0;self._show();}).mouseout(function(){timer=setTimeout('Biojs.getInstance('+self.getId()+')._hide()',self.opt.delay);});this._hide();},_hide:function(){this._container.hide();},_show:function(){this._container.show();},_setPosition:function(offset,dim){var arrow=this._arrow;var arrowType=this.opt.arrowType;var arrowPos={top:offset.top,left:offset.left};var body=this._body;var bodyPos={};arrow.removeClass();arrow.addClass('arrow '+arrowType.match(/^(left|top|right|bottom)/g)[0]);if(arrowType==Biojs.Tooltip.ARROW_LEFT_TOP){arrowPos.top+=Math.floor(dim.height/2)-Math.floor(arrow.height()/2);arrowPos.left+=arrow.width()+dim.width;bodyPos.left=arrowPos.left+arrow.width()-1;bodyPos.top=arrowPos.top+Math.floor(arrow.height()/2)-Math.floor(body.height()/4);}else if(arrowType==Biojs.Tooltip.ARROW_LEFT_MIDDLE){arrowPos.top+=Math.floor(dim.height/2)-Math.floor(arrow.height()/2);arrowPos.left+=arrow.width()+dim.width;bodyPos.left=arrowPos.left+arrow.width()-1;bodyPos.top=arrowPos.top+Math.floor(arrow.height()/2)-Math.floor(body.height()/2);}else if(arrowType==Biojs.Tooltip.ARROW_LEFT_BOTTOM){arrowPos.top+=Math.floor(dim.height/2)-Math.floor(arrow.height()/2);arrowPos.left+=arrow.width()+dim.width;bodyPos.left=arrowPos.left+arrow.width()-1;bodyPos.top=arrowPos.top+Math.floor(arrow.height()/2)-Math.floor(body.height()*(3/4));}else if(arrowType==Biojs.Tooltip.ARROW_TOP_LEFT){arrowPos.top+=dim.height;arrowPos.left+=Math.floor(dim.width/2)-Math.floor(arrow.width()/2);bodyPos.left=arrowPos.left+Math.floor(arrow.height()/2)-Math.floor(body.width()/4);bodyPos.top=arrowPos.top+arrow.height()-1;}else if(arrowType==Biojs.Tooltip.ARROW_TOP_MIDDLE){arrowPos.top+=dim.height;arrowPos.left+=Math.floor(dim.width/2)-Math.floor(arrow.width()/2);bodyPos.left=arrowPos.left+Math.floor(arrow.height()/2)-Math.floor(body.width()/2);bodyPos.top=arrowPos.top+arrow.height()-1;}else if(arrowType==Biojs.Tooltip.ARROW_TOP_RIGHT){arrowPos.top+=dim.height;arrowPos.left+=Math.floor(dim.width/2)-Math.floor(arrow.width()/2);bodyPos.left=arrowPos.left+Math.floor(arrow.height()/2)-Math.floor(body.width()*(3/4));bodyPos.top=arrowPos.top+arrow.height()-1;}else if(arrowType==Biojs.Tooltip.ARROW_RIGHT_TOP){arrowPos.top+=Math.floor(dim.height/2)-Math.floor(arrow.height()/2);arrowPos.left-=arrow.width();bodyPos.left=arrowPos.left-body.outerWidth()+1;bodyPos.top=arrowPos.top+Math.floor(arrow.height()/2)-Math.floor(body.height()/4);}else if(arrowType==Biojs.Tooltip.ARROW_RIGHT_MIDDLE){arrowPos.top+=Math.floor(dim.height/2)-Math.floor(arrow.height()/2);arrowPos.left-=arrow.width();bodyPos.left=arrowPos.left-body.outerWidth()+1;bodyPos.top=arrowPos.top+Math.floor(arrow.height()/2)-Math.floor(body.height()/2);}else if(arrowType==Biojs.Tooltip.ARROW_RIGHT_BOTTOM){arrowPos.top+=Math.floor(dim.height/2)-Math.floor(arrow.height()/2);arrowPos.left-=arrow.width();bodyPos.left=arrowPos.left-body.outerWidth()+1;bodyPos.top=arrowPos.top+Math.floor(arrow.height()/2)-Math.floor(body.height()*(3/4));}else if(arrowType==Biojs.Tooltip.ARROW_BOTTOM_LEFT){arrowPos.top-=arrow.height();arrowPos.left+=Math.floor(dim.width/2)+Math.floor(arrow.width()/2);bodyPos.left=arrowPos.left+Math.floor(arrow.width()/2)-Math.floor(body.width()/4);bodyPos.top=arrowPos.top-body.outerHeight()+1;}else if(arrowType==Biojs.Tooltip.ARROW_BOTTOM_MIDDLE){arrowPos.top-=arrow.height();arrowPos.left+=Math.floor(dim.width/2)-Math.floor(arrow.width()/2);bodyPos.left=arrowPos.left+Math.floor(arrow.width()/2)-Math.floor(body.width()/2);bodyPos.top=arrowPos.top-body.outerHeight()+1;}else if(arrowType==Biojs.Tooltip.ARROW_BOTTOM_RIGHT){arrowPos.top-=arrow.height();arrowPos.left+=Math.floor(dim.width/2)-Math.floor(arrow.width()/2);bodyPos.left=arrowPos.left+Math.floor(arrow.width()/2)-Math.floor(body.width()*(3/4));bodyPos.top=arrowPos.top-body.outerHeight()+1;}
this._arrow.css(arrowPos);this._body.css(bodyPos);},setArrowType:function(arrowType){var newClass=arrowType.match(/^(left|top|right|bottom)/g)[0];if(newClass!==undefined){this.opt.arrowType=arrowType;}},getArrowType:function(arrowType){return this.opt.arrowType;},getIdentifier:function(){return this._container.attr('id');},setIdentifier:function(value){return this._container.attr('id',value);}},{ARROW_LEFT_TOP:"left_top",ARROW_LEFT_MIDDLE:"left_middle",ARROW_LEFT_BOTTOM:"left_bottom",ARROW_TOP_LEFT:"top_left",ARROW_TOP_MIDDLE:"top_middle",ARROW_TOP_RIGHT:"top_right",ARROW_RIGHT_TOP:"right_top",ARROW_RIGHT_MIDDLE:"right_middle",ARROW_RIGHT_BOTTOM:"right_bottom",ARROW_BOTTOM_LEFT:"bottom_left",ARROW_BOTTOM_MIDDLE:"bottom_middle",ARROW_BOTTOM_RIGHT:"bottom_right",EVT_ON_SHOW_UP:"onShowUp",MOUSE_POSITION:1,ELEMENT_POSITION:2});