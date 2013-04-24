;(function($,$$){var defaults={maxSimulationTime:1000,ungrabifyWhileSimulating:true,fit:true,random:false};function SpringyLayout(options){this.options=$.extend(true,{},defaults,options);}
function exec(fn){if(fn!=null&&typeof fn==typeof function(){}){fn();}}
SpringyLayout.prototype.run=function(){var self=this;var options=this.options;var params=options;$.cytoscapeweb("debug","Running Springy layout with options (%o)",options);var cy=options.cy;var nodes=cy.nodes();var edges=cy.edges();var container=cy.container();var graph=new Graph();nodes.each(function(i,node){node.scratch("springy",{model:graph.newNode({element:node})});});edges.each(function(i,edge){fdSrc=edge.source().scratch("springy.model");fdTgt=edge.target().scratch("springy.model");edge.scratch("springy",{model:graph.newEdge(fdSrc,fdTgt,{element:edge})});});var layout=new Layout.ForceDirected(graph,400.0,400.0,0.5);var currentBB=layout.getBoundingBox();var targetBB={bottomleft:new Vector(-2,-2),topright:new Vector(2,2)};var toScreen=function(p){var size=currentBB.topright.subtract(currentBB.bottomleft);var sx=p.subtract(currentBB.bottomleft).divide(size.x).x*container.width();var sy=p.subtract(currentBB.bottomleft).divide(size.y).y*container.height();return new Vector(sx,sy);};var fromScreen=function(s){var size=currentBB.topright.subtract(currentBB.bottomleft);var px=(s.x/container.width())*size.x+currentBB.bottomleft.x;var py=(s.y/container.height())*size.y+currentBB.bottomleft.y;return new Vector(px,py);};var movedNodes=cy.collection();var numNodes=cy.nodes().size();var drawnNodes=1;var fdRenderer=new Renderer(10,layout,function clear(){},function drawEdge(edge,p1,p2){},function drawNode(node,p){var v=toScreen(p);var element=node.data.element;window.p=p;window.n=node;if(!element.locked()){element._private.position={x:v.x,y:v.y};movedNodes=movedNodes.add(element);}else{setLayoutPositionForElement(element);}
if(drawnNodes==numNodes){cy.one("layoutready",options.ready);cy.trigger("layoutready");}
drawnNodes++;});nodes.each(function(i,ele){if(!options.random){setLayoutPositionForElement(ele);}});setInterval(function(){if(movedNodes.size()>0){movedNodes.rtrigger("position");movedNodes=cy.collection();}},50);nodes.bind("drag",function(){setLayoutPositionForElement(this);});function setLayoutPositionForElement(element){var fdId=element.scratch("springy.model").id;var fdP=fdRenderer.layout.nodePoints[fdId].p;var pos=element.position(false);var positionInFd=(pos.x!=null&&pos.y!=null)?fromScreen(element.position(false)):{x:Math.random()*4-2,y:Math.random()*4-2};fdP.x=positionInFd.x;fdP.y=positionInFd.y;}
var grabbableNodes=nodes.filter(":grabbable");function start(){if(options.ungrabifyWhileSimulating){grabbableNodes.ungrabify();}
fdRenderer.start();}
function stop(callback){graph.filterNodes(function(){return false;});setTimeout(function(){if(options.ungrabifyWhileSimulating){grabbableNodes.grabify();}
callback();},100);}
var stopSystem=self.stopSystem=function(){stop(function(){if(options.fit){cy.fit();}
cy.one("layoutstop",options.stop);cy.trigger("layoutstop");self.stopSystem=null;});};start();setTimeout(function(){stopSystem();},options.maxSimulationTime);};SpringyLayout.prototype.stop=function(){if(this.stopSystem!=null){this.stopSystem();}};$.cytoscapeweb("layout","springy",SpringyLayout);var Graph=function(){this.nodeSet={};this.nodes=[];this.edges=[];this.adjacency={};this.nextNodeId=0;this.nextEdgeId=0;this.eventListeners=[];};var Node=function(id,data){this.id=id;this.data=typeof(data)!=='undefined'?data:{};};var Edge=function(id,source,target,data){this.id=id;this.source=source;this.target=target;this.data=typeof(data)!=='undefined'?data:{};};Graph.prototype.addNode=function(node){if(typeof(this.nodeSet[node.id])==='undefined'){this.nodes.push(node);}
this.nodeSet[node.id]=node;this.notify();return node;};Graph.prototype.addEdge=function(edge){var exists=false;this.edges.forEach(function(e){if(edge.id===e.id){exists=true;}});if(!exists){this.edges.push(edge);}
if(typeof(this.adjacency[edge.source.id])==='undefined'){this.adjacency[edge.source.id]={};}
if(typeof(this.adjacency[edge.source.id][edge.target.id])==='undefined'){this.adjacency[edge.source.id][edge.target.id]=[];}
exists=false;this.adjacency[edge.source.id][edge.target.id].forEach(function(e){if(edge.id===e.id){exists=true;}});if(!exists){this.adjacency[edge.source.id][edge.target.id].push(edge);}
this.notify();return edge;};Graph.prototype.newNode=function(data){var node=new Node(this.nextNodeId++,data);this.addNode(node);return node;};Graph.prototype.newEdge=function(source,target,data){var edge=new Edge(this.nextEdgeId++,source,target,data);this.addEdge(edge);return edge;};Graph.prototype.getEdges=function(node1,node2){if(typeof(this.adjacency[node1.id])!=='undefined'&&typeof(this.adjacency[node1.id][node2.id])!=='undefined'){return this.adjacency[node1.id][node2.id];}
return[];};Graph.prototype.removeNode=function(node){if(typeof(this.nodeSet[node.id])!=='undefined'){delete this.nodeSet[node.id];}
for(var i=this.nodes.length-1;i>=0;i--){if(this.nodes[i].id===node.id){this.nodes.splice(i,1);}}
this.detachNode(node);};Graph.prototype.detachNode=function(node){var tmpEdges=this.edges.slice();tmpEdges.forEach(function(e){if(e.source.id===node.id||e.target.id===node.id){this.removeEdge(e);}},this);this.notify();};Graph.prototype.removeEdge=function(edge){for(var i=this.edges.length-1;i>=0;i--){if(this.edges[i].id===edge.id){this.edges.splice(i,1);}}
for(var x in this.adjacency){for(var y in this.adjacency[x]){var edges=this.adjacency[x][y];for(var j=edges.length-1;j>=0;j--){if(this.adjacency[x][y][j].id===edge.id){this.adjacency[x][y].splice(j,1);}}}}
this.notify();};Graph.prototype.merge=function(data){var nodes=[];data.nodes.forEach(function(n){nodes.push(this.addNode(new Node(n.id,n.data)));},this);data.edges.forEach(function(e){var from=nodes[e.from];var to=nodes[e.to];var id=(e.directed)?(id=e.type+"-"+from.id+"-"+to.id):(from.id<to.id)?e.type+"-"+from.id+"-"+to.id:e.type+"-"+to.id+"-"+from.id;var edge=this.addEdge(new Edge(id,from,to,e.data));edge.data.type=e.type;},this);};Graph.prototype.filterNodes=function(fn){var tmpNodes=this.nodes.slice();tmpNodes.forEach(function(n){if(!fn(n)){this.removeNode(n);}},this);};Graph.prototype.filterEdges=function(fn){var tmpEdges=this.edges.slice();tmpEdges.forEach(function(e){if(!fn(e)){this.removeEdge(e);}},this);};Graph.prototype.addGraphListener=function(obj){this.eventListeners.push(obj);};Graph.prototype.notify=function(){this.eventListeners.forEach(function(obj){obj.graphChanged();});};var Layout={};Layout.ForceDirected=function(graph,stiffness,repulsion,damping){this.graph=graph;this.stiffness=stiffness;this.repulsion=repulsion;this.damping=damping;this.nodePoints={};this.edgeSprings={};};Layout.ForceDirected.prototype.point=function(node){if(typeof(this.nodePoints[node.id])==='undefined'){var mass=typeof(node.data.mass)!=='undefined'?node.data.mass:1.0;this.nodePoints[node.id]=new Layout.ForceDirected.Point(Vector.random(),mass);}
return this.nodePoints[node.id];};Layout.ForceDirected.prototype.spring=function(edge){if(typeof(this.edgeSprings[edge.id])==='undefined'){var length=typeof(edge.data.length)!=='undefined'?edge.data.length:1.0;var existingSpring=false;var from=this.graph.getEdges(edge.source,edge.target);from.forEach(function(e){if(existingSpring===false&&typeof(this.edgeSprings[e.id])!=='undefined'){existingSpring=this.edgeSprings[e.id];}},this);if(existingSpring!==false){return new Layout.ForceDirected.Spring(existingSpring.point1,existingSpring.point2,0.0,0.0);}
var to=this.graph.getEdges(edge.target,edge.source);from.forEach(function(e){if(existingSpring===false&&typeof(this.edgeSprings[e.id])!=='undefined'){existingSpring=this.edgeSprings[e.id];}},this);if(existingSpring!==false){return new Layout.ForceDirected.Spring(existingSpring.point2,existingSpring.point1,0.0,0.0);}
this.edgeSprings[edge.id]=new Layout.ForceDirected.Spring(this.point(edge.source),this.point(edge.target),length,this.stiffness);}
return this.edgeSprings[edge.id];};Layout.ForceDirected.prototype.eachNode=function(callback){var t=this;this.graph.nodes.forEach(function(n){callback.call(t,n,t.point(n));});};Layout.ForceDirected.prototype.eachEdge=function(callback){var t=this;this.graph.edges.forEach(function(e){callback.call(t,e,t.spring(e));});};Layout.ForceDirected.prototype.eachSpring=function(callback){var t=this;this.graph.edges.forEach(function(e){callback.call(t,t.spring(e));});};Layout.ForceDirected.prototype.applyCoulombsLaw=function(){this.eachNode(function(n1,point1){this.eachNode(function(n2,point2){if(point1!==point2)
{var d=point1.p.subtract(point2.p);var distance=d.magnitude()+0.1;var direction=d.normalise();point1.applyForce(direction.multiply(this.repulsion).divide(distance*distance*0.5));point2.applyForce(direction.multiply(this.repulsion).divide(distance*distance*-0.5));}});});};Layout.ForceDirected.prototype.applyHookesLaw=function(){this.eachSpring(function(spring){var d=spring.point2.p.subtract(spring.point1.p);var displacement=spring.length-d.magnitude();var direction=d.normalise();spring.point1.applyForce(direction.multiply(spring.k*displacement*-0.5));spring.point2.applyForce(direction.multiply(spring.k*displacement*0.5));});};Layout.ForceDirected.prototype.attractToCentre=function(){this.eachNode(function(node,point){var direction=point.p.multiply(-1.0);point.applyForce(direction.multiply(this.repulsion/50.0));});};Layout.ForceDirected.prototype.updateVelocity=function(timestep){this.eachNode(function(node,point){point.v=point.v.add(point.a.multiply(timestep)).multiply(this.damping);point.a=new Vector(0,0);});};Layout.ForceDirected.prototype.updatePosition=function(timestep){this.eachNode(function(node,point){point.p=point.p.add(point.v.multiply(timestep));});};Layout.ForceDirected.prototype.totalEnergy=function(timestep){var energy=0.0;this.eachNode(function(node,point){var speed=point.v.magnitude();energy+=0.5*point.m*speed*speed;});return energy;};var __bind=function(fn,me){return function(){return fn.apply(me,arguments);};};Layout.requestAnimationFrame=__bind(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback,element){window.setTimeout(callback,10);},window);Layout.ForceDirected.prototype.start=function(interval,render,done){var t=this;if(this._started)return;this._started=true;Layout.requestAnimationFrame(function step(){t.applyCoulombsLaw();t.applyHookesLaw();t.attractToCentre();t.updateVelocity(0.03);t.updatePosition(0.03);if(typeof(render)!=='undefined')
render();if(t.totalEnergy()<0.01){t._started=false;if(typeof(done)!=='undefined'){done();}}else{Layout.requestAnimationFrame(step);}});};Layout.ForceDirected.prototype.nearest=function(pos){var min={node:null,point:null,distance:null};var t=this;this.graph.nodes.forEach(function(n){var point=t.point(n);var distance=point.p.subtract(pos).magnitude();if(min.distance===null||distance<min.distance){min={node:n,point:point,distance:distance};}});return min;};Layout.ForceDirected.prototype.getBoundingBox=function(){var bottomleft=new Vector(-2,-2);var topright=new Vector(2,2);this.eachNode(function(n,point){if(point.p.x<bottomleft.x){bottomleft.x=point.p.x;}
if(point.p.y<bottomleft.y){bottomleft.y=point.p.y;}
if(point.p.x>topright.x){topright.x=point.p.x;}
if(point.p.y>topright.y){topright.y=point.p.y;}});var padding=topright.subtract(bottomleft).multiply(0.07);return{bottomleft:bottomleft.subtract(padding),topright:topright.add(padding)};};Vector=function(x,y){this.x=x;this.y=y;};Vector.random=function(){return new Vector(10.0*(Math.random()-0.5),10.0*(Math.random()-0.5));};Vector.prototype.add=function(v2){return new Vector(this.x+v2.x,this.y+v2.y);};Vector.prototype.subtract=function(v2){return new Vector(this.x-v2.x,this.y-v2.y);};Vector.prototype.multiply=function(n){return new Vector(this.x*n,this.y*n);};Vector.prototype.divide=function(n){return new Vector((this.x/n)||0,(this.y/n)||0);};Vector.prototype.magnitude=function(){return Math.sqrt(this.x*this.x+this.y*this.y);};Vector.prototype.normal=function(){return new Vector(-this.y,this.x);};Vector.prototype.normalise=function(){return this.divide(this.magnitude());};Layout.ForceDirected.Point=function(position,mass){this.p=position;this.m=mass;this.v=new Vector(0,0);this.a=new Vector(0,0);};Layout.ForceDirected.Point.prototype.applyForce=function(force){this.a=this.a.add(force.divide(this.m));};Layout.ForceDirected.Spring=function(point1,point2,length,k){this.point1=point1;this.point2=point2;this.length=length;this.k=k;};function Renderer(interval,layout,clear,drawEdge,drawNode){this.interval=interval;this.layout=layout;this.clear=clear;this.drawEdge=drawEdge;this.drawNode=drawNode;this.layout.graph.addGraphListener(this);}
Renderer.prototype.graphChanged=function(e){this.start();};Renderer.prototype.start=function(){var t=this;this.layout.start(50,function render(){t.clear();t.layout.eachEdge(function(edge,spring){t.drawEdge(edge,spring.point1.p,spring.point2.p);});t.layout.eachNode(function(node,point){t.drawNode(node,point.p);});});};})(jQuery,jQuery.cytoscapeweb);