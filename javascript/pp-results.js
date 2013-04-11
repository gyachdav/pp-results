$(function(){
	    $('.slide-out-div').tabSlideOut({
	        tabHandle: '.handle',                     //class of the element that will become your tab
	        pathToTabImage: 'images/prefs_tab.png', //path to the image for the tab //Optionally can be set using css
	        imageHeight: '200px',                     //height of tab image           //Optionally can be set using css
	        imageWidth: '43px',                       //width of tab image            //Optionally can be set using css
	        tabLocation: 'right',                      //side of screen where tab lives, top, right, bottom, or left
	        speed: 300,                               //speed of animation
	        action: 'click',                          //options: 'click' or 'hover', action to trigger animation
	        topPos: '200px',                          //position from the top/ use if tabLocation is left or right
	        leftPos: '20px',                          //position from left/ use if tabLocation is bottom or top
	        fixedPosition: false                      //options: true makes it stick(fixed position) on scroll
	    });

});



 /* Menu items listeners */
$('#menu-feature-Map').click(function(){
	drawFeatureMap('FeatureMap');
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});


$('#menu-feature-view').click(function(){
	sequenceViewer();
	$(".slide-out-div").show();
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});

$('#menu-summary').click(function(){
	$('#DetailView').load('summary.html',  function(response, status, xhr) {
  	if (status == "error") {
  		alert (xhr.status)
    	var msg = "Sorry but there was an error: ";
    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
  	}
  	$(this).siblings().html('');
	});
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});

$('#SS-detail').click(function(){
	
	$('#DetailView').load('secondary_structure.html',  function(response, status, xhr) {
	// $('#DetailView').load('html_source/source4.html #prof-content',  function(response, status, xhr) {
	  	$(this).siblings().html('');
	  	if (status == "error") {
	  		alert (xhr.status)
	    	var msg = "Sorry but there was an error: ";
	    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
	  	}
	});
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});

$('#HTM-detail').click(function(){
	$('#DetailView').load('transmembrane.html',  function(response, status, xhr) {
  	if (status == "error") {
  		alert (xhr.status)
    	var msg = "Sorry but there was an error: ";
    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
  	}
  	$(this).siblings().html('');
	});
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});


$('#TMB-detail').click(function(){
	$('#DetailView').load('proftmb.html',  function(response, status, xhr) {
	  	$(this).siblings().html('');
	  	if (status == "error") {
	  		alert (xhr.status)
	    	var msg = "Sorry but there was an error: ";
	    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
	  	}
	  	$(this).siblings().html('');
	});
	
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});

$('#NORS-detail').click(function(){
	$('#DetailView').load('nors.html',  function(response, status, xhr) {
  	if (status == "error") {
  		alert (xhr.status)
    	var msg = "Sorry but there was an error: ";
    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
  	}
		$(this).siblings().html('');	
	});
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});

$('#DISUL-detail').click(function(){
	$('#DetailView').load('disulphide.html',  function(response, status, xhr) {
	  	if (status == "error") {
	  		alert (xhr.status)
	    	var msg = "Sorry but there was an error: ";
	    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
	  	}
  		$(this).siblings().html('');
	});
	
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});

$('#MD-detail').click(function(){
	$('#DetailView').load('disorder.html',  function(response, status, xhr) {
  	if (status == "error") {
  		alert (xhr.status)
    	var msg = "Sorry but there was an error: ";
    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
  	}
		$(this).siblings().html('');
	});
	
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});

$('#ISIS-detail').click(function(){
	$('#DetailView').load('binding-sites.html',  function(response, status, xhr) {
  	if (status == "error") {
  		alert (xhr.status)
    	var msg = "Sorry but there was an error: ";
    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
  	}
  	$(this).siblings().html('');
	});
	
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});

$('#LOC-detail').click(function(){
	$('#DetailView').load('localization.html',  function(response, status, xhr) {
	  	if (status == "error") {
	  		alert (xhr.status)
	    	var msg = "Sorry but there was an error: ";
	    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
	  	}
  		$(this).siblings().html('');
	});
	$(".active").removeClass('active');
	$(this).parent().addClass('active');


	// $.get('source4.html', function(data) {		
	// 	hpa_link = $(data).find('#localization-content').find('a').attr('href');
	// 	var instance = new Biojs.HpaSummaryFeature({
	// 	      target: 'hpa-summary',
	// 	      title: '',
	// 	      imageUrl: 'http://www.proteinatlas.org/images/1012/ihc_selected_medium.jpg',
	// 	      imageTitle: '',
	// 	      notes: [""],
	// 	      linkUrl: hpa_link,
	// 	      linkTitle:'HPA original source',
	// 	      width: '585px',
	// 	      imageWidth: '150px'
	// 	});

	// });
});

$('#menu-snap').click(function(){
	$('#DetailView').load('snap.html',  function(response, status, xhr) {
  	if (status == "error") {
  		alert (xhr.status)
    	var msg = "Sorry but there was an error: ";
    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
  	}
  	$(this).siblings().html('');
	});
	$(".active").removeClass('active');
	$(this).parent().addClass('active');
});


