var GOANNOT_VIEW = (function() {

    var assets_path =  '/ppres/'+'assets/';
    var arrImg = [];


    function linkToGO(go_term) {
        var __url = 'http://amigo.geneontology.org/cgi-bin/amigo/term_details?term=' + go_term;
        return ("<a href='"+__url+"' target='__blank' title='More Info at the Gene Ontology'>"+go_term+"</a>");
    }

    function capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    
    function customEncode(s)
    {
        s = s.replace(/"/g, '%22');
        s = s.replace(/:/g, '%3A');
        s = s.replace(/ /g, '+');
        s = s.replace(/,/g, '%2C');
        s = s.replace(/\?/g, '%3F');
        s = s.replace(/#/g, '%23');
        return s;
    }

    function generateAmigoRequest(goTermsSelectedDict)
    {
    	var GETRequestString = "{";

    	for(var i=0; i < goTermsSelectedDict.length; i++)
    	{
    		currGoTermDict = goTermsSelectedDict[i];
        	GETRequestString += "\"" + currGoTermDict["id"] + "\": {\"title\":\"" + "Score: " + currGoTermDict["score"] + "<BR/>" + currGoTermDict["id"]  + "\"," +
	  	      "\"fill\":\"" + (currGoTermDict["checked"] ? "#FFFF99" : "#E5E4E2") + "\"}";     		

        	if((goTermsSelectedDict.length-1) != i)
        	{
        		GETRequestString += ",";
        	}
    	}

    	
    	GETRequestString += "}";
	GETRequestStringEncoded = "http://amigo1.geneontology.org/cgi-bin/amigo/visualize?mode=advanced&term_data=" + customEncode(GETRequestString) + "&term_data_type=json&format=png";
    	return GETRequestStringEncoded;
    	
    }
    
    return {
       
       
        toggleAll: function(onto) {
            var selected = 0;
            var all=0
           
            jQuery("input[name='" + onto + "']:checked").each(function ()
            {
                selected++;
            });
           
            jQuery("input[name='" + onto + "']").each(function ()
            {
                all++;
            });
           
            target=true;
            if(all-selected == 0)
            {
                target=false;
            }
           
            jQuery("input[name='" + onto + "']").each(function ()
            {
                jQuery(this).attr("checked", target);
            });
           
        },
       
        createHTMLTables: function(dataObj) {
            var ontologyPredictionArray = dataObj.getGOAnnotations("");
            var _table, header_row, row, cell;
            
            _maindiv = jQuery('<div></div>');
            _mainMainDiv = document.createElement('div');
            _mainMainHTML = "<h3>Tabular Result</h3>";
            for (var i = 0; i < ontologyPredictionArray.length; i++)
            {
                var currOntologyPrediction = ontologyPredictionArray[i];
                var currOntology = currOntologyPrediction.ontology;
                var currOntologyShort = currOntology.split(" ").reduce(function(prev, curr, index, array){return index == 1 ? prev[0] + curr[0] : prev + curr[0];});
                var _curr_li = jQuery('<li><a data-toggle="tab" href="#' + currOntologyShort + '_annot_container">' + currOntology + '</a></li>');
               
                if (!currOntologyPrediction)
                {
                    _mainMainHTML += "<div>Data unavailable</div>";
                }
                else
                {
                    _mainMainHTML +=
                    "<div id=\"tableHolder"+ currOntologyShort +"\" class=\"tableHolder\" style=\"float:left; width: 48%; padding-right: " + ((i==0) ? "3%" : "0px") + "; padding-bottom:0px;margin-bottom:0px\">" +
                        "<table id=\"table"+ currOntologyShort +"\" class=\"table table-striped tablesorter\" style=\"width:100%;margin-bottom:0px;;margin-top:0px\">" +
                            "<thead>" +
                                "<tr>" +
                                    "<th  style=\"background-color: rgb(205, 205, 205); color: #3D3D3D; font-size: 8pt; height: 2em; text-align: center\" colspan=5 > <div style=\"font-size:larger\">" + currOntology + "</div></th>" +
                                "</tr>" +
                                "<tr>" +
                                    "<th style=\"background-color: rgb(205, 205, 205); color: #3D3D3D; font-size: 8pt; height: 2em;\" width=\"5%\">#</th>" +
                                    "<th style=\"background-color: rgb(205, 205, 205); color: #3D3D3D; font-size: 8pt; height: 2em;\" width=\"15%\">GO ID</th>" +
                                    "<th style=\"background-color: rgb(205, 205, 205); color: #3D3D3D; font-size: 8pt; height: 2em;\" width=\"55%\">GO Term</th>" +
                                    "<th style=\"background-color: rgb(205, 205, 205); color: #3D3D3D; font-size: 8pt; height: 2em;\" width=\"20%\">Reliability (%)</th>" +
                                    "<th style=\"background-color: rgb(205, 205, 205); color: #3D3D3D; font-size: 8pt; height: 2em;\" width=\"5%\"><input class=\"allToggler\" type=\"checkbox\" name=\"goSel" + currOntologyShort + "All\" value=\"" + "all" + "\" checked/></th>" +
                                "</tr>" +
                            "</thead>" +
                                "<tbody>";
                                    "<tr><td><td><td>" +
                                    "</tr>";
                   
                    goTermWithScoreArray = currOntologyPrediction.goTermWithScore;
                   
                    if (!(typeof goTermWithScoreArray === "undefined")) 
                    {
	                    if(!jQuery.isArray(goTermWithScoreArray))
	                    {
	                    	goTermWithScoreArray = new Array(goTermWithScoreArray);
	                    }
	 
	                    for(var j = 0; j< goTermWithScoreArray.length; j++)
	                    {
	                        currGoTermWithScore = goTermWithScoreArray[j];
	                       
	                        _mainMainHTML += "<tr>";
	                        _mainMainHTML +=     "<td width=\"5%\">"+ (j+1) +"</td>";
	                        _mainMainHTML +=     "<td width=\"15%\">"+ linkToGO(currGoTermWithScore.gotermid) +"</td>";
	                        _mainMainHTML +=     "<td width=\"55%\">"+ currGoTermWithScore.gotermname +"</td>";
	                        _mainMainHTML +=     "<td width=\"20%\">"+ currGoTermWithScore.gotermscore +"</td>";
	                        _mainMainHTML +=     "<td width=\"5%\"><input type=\"checkbox\" name=\"goSel" + currOntologyShort + "\" value=\"" + currGoTermWithScore.gotermid + "\" checked/></td>";
	                        _mainMainHTML += "</tr>";
	                    }
                    }
                    
                    _mainMainHTML += "</tbody></table><div style=\"margin: 0px; margin-top: 2px;\" class=\"pager\" id=\"pager" + currOntologyShort + "\">" +
                    "<form style=\"font-size: 10pt;margin-bottom: 10px;width: auto;\">" +
                        "<img src=\"" + assets_path + "pager/first.png\" class=\"first\"/> " +
                        "<img src=\"" + assets_path + "pager/prev.png\" class=\"prev\"/>" +
                        "<input style=\"width:30px; line-height: 12px; height:12px; padding: 3px;margin-bottom: 0px; margin-left:5px; margin-right: 5px; font-size: 10px;\" type=\"text\" class=\"pagedisplay\"/>" +
                        "<img style=\"\" src=\"" + assets_path + "pager/next.png\" class=\"next\"/>" +
                        "<img style=\"\" src=\"" + assets_path + "pager/last.png\" class=\"last\"/>" +
                        "<select style=\"width:50px; line-height: 12px; height:20px; padding: 3px;margin-bottom: 0px; margin-left:5px; margin-right: 5px; font-size: 10px;\" class=\"pagesize\">" +
                            "<option selected=\"selected\"  value=\"10\">10</option>" +
                            "<option value=\"20\">20</option>" +
                            "<option value=\"30\">30</option>" +
                            "<option  value=\"40\">40</option>" +
                        "</select>" +
                    "</form>" +
                    "<div style=\"margin: 0px; margin-top: 1px;\" class=\"refreshor\" id=\"refreshor" + currOntologyShort + "\">" +
                    "<form name=\"" + currOntologyShort + "\" class=\"refreshorForm\" style=\"font-size: 10pt;margin-bottom: 20px;width: auto;\">" +
                        "<input id=\"showButton" + currOntologyShort + "\" style=\"display:none; width:100px; height:20px; font-size: 12px;\" type=\"submit\" value=\"Show\" />" +
                    "</form>" +
	                "</div>" +
	                "</div>" +
	                "</div>";
                }
            }
            _mainMainHTML += "<br style=\"clear: left;\" />  </div>";
            
            return _mainMainHTML;
                    
        },
        
        createHTMLImageNavigation: function(dataObj) {
            var nav_div = jQuery("<div style=\"margin-top:0px;\" id='_goannot_nav' />");
            var list = jQuery('<ul/>');
            list.addClass("nav nav-pills nav-tabs");
           
            var ontologyPredictionArray = dataObj.getGOAnnotations("");
            for (var i = 0; i < ontologyPredictionArray.length; i++)
            {
                var currOntologyPrediction = ontologyPredictionArray[i];
                var currOntology = currOntologyPrediction.ontology;
                var currOntologyShort = currOntology.split(" ").reduce(function(prev, curr, index, array){return index == 1 ? prev[0] + curr[0] : prev + curr[0];});
                var _curr_li = jQuery("<li><a data-toggle=\"tab\" id=\"" + currOntologyShort + "_img_link\" href=\"#" + currOntologyShort + "_img_container_container\">" + currOntology + "</a></li>");

                if(i == 0)
                {
                    _curr_li.addClass('active');
                }
               
                list.append(_curr_li);
            }
            nav_div.append(list);
            return nav_div;
        },
        
        createHTMLImageContent: function(dataObj)  {
            var content_div = jQuery("<div id=\"_goannot_cntnt_img\"/>");
            content_div.addClass("tab-content");
           
            var ontologyPredictionArray = dataObj.getGOAnnotations("");
            for (var i = 0; i < ontologyPredictionArray.length; i++)
            {
                var currOntologyPrediction = ontologyPredictionArray[i];
                var currOntology = currOntologyPrediction.ontology;
                var currOntologyShort = currOntology.split(" ").reduce(function(prev, curr, index, array){return index == 1 ? prev[0] + curr[0] : prev + curr[0];});
                
    			var imageContainerContainer = jQuery("<div></div>");
    			imageContainerContainer.attr("id", currOntologyShort + "_img_container_container");
    			imageContainerContainer.css("margin", "0px");
    			imageContainerContainer.css("padding", "0px");
    			imageContainerContainer.addClass("tab-pane");
                
                var _curr_div;
                if (!currOntologyPrediction)
                {
                    _curr_div = jQuery("<div />").text("Data unavailable");
                }
                else
                {
                    _curr_div = jQuery("<div />");
                    jQuery('<img />').attr({ 'id': 'imageLoading' + currOntologyShort, 'src': '/ppres/assets/iviewer/image_loading.gif', 'alt':'Image loading...' }).appendTo(_curr_div);


                    //_curr_div.append(  "Image loading..." );
                }
               
                _curr_div.attr("id",currOntologyShort + "_img_container");
               
                if(i == 0)
                {
                	imageContainerContainer.addClass('active');
                }
               
                imageContainerContainer.append(_curr_div);
                imageContainerContainer.append(this.createHTMLLegend(dataObj, currOntologyShort));
                content_div.append(imageContainerContainer)
            }

            return content_div;
        },
        
        createHTMLLegend: function(dataObj, onto) {
        	
        	 var mainHTML = "<div id=\"imageLegend" + onto + "\" style=\"display:none; padding-left: 5px; padding-right: 5px; margin-top: 10px;\">" +
        	 "<table cellpadding=\"0\" cellspacing=\"0\" style=\"padding:0px; margin:0px; border: 0px;width: 100%\">" +
        	 	"<tr>" + 
        	 		"<td>" +
		        	 	"<div style=\"float: left;margin-right:100px;padding-bottom: 20px;\">" +
					          "<table cellspacing=\"0\" border=\"0\">" +
					              "<thead>" +
					                  "<tr>" +
				                      		"<th align=left colspan=9 style=\"padding-bottom:5px;\"><legend>Node color legend </legend></th>" +
				                      "</tr>" +
					              "</thead>" +
					              "<tbody>" +
					                  "<tr>" +
					                      "<td style=\"padding-left: 10px;\" > inferred </td>" +
					                      "<td style=\"padding-left: 10px;\"> &nbsp </td>" +
					                      "<td style=\"padding-left: 30px; border: 1px solid black\" bgcolor=\"white\"></td>" +
					                      "<td style=\"padding-left: 20px;\"> predicted & selected </td>" +
					                      "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
					                      "<td style=\"padding-left: 30px; border: 1px solid black\" bgcolor=\"#FFFF99\"></td>" +
					                      "<td style=\"padding-left: 20px;\"> predicted & deselected </td>" +
					                      "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
					                      "<td style=\"padding-left: 30px; border: 1px solid black\" bgcolor=\"#E5E4E2\"\"> </td>" +
					                  "</tr>" +
					              "</tbody>" +
					            "</table>" +
					       "</div>" +
					       "<div style=\"float: left;\">" +
					            "<table cellspacing=\"0\" border=\"0\">" +
					                  "<thead>" +
					                      "<tr>" +
					                          "<th align=left colspan=9 style=\"padding-bottom:5px;\"><legend>Edge color legend </legend></th>" +
					                      "</tr>" +
					                  "</thead>" +
					                  "<tbody>" +
					                      "<tr>" +
					                          "<td style=\"padding-left: 10px;\" > is_a </td>" +
					                          "<td style=\"padding-left: 10px;\"> &nbsp </td>" +
					                          "<td style=\"width:30px\"><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: blue; width:100%; height: 3px;\">&nbsp;</div></td>" +
					                          "<td style=\"padding-left: 20px;\"> part_of </td>" +
					                          "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
					                          "<td style=\"width:30px\"><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: lightblue; width:100%; height: 3px;\">&nbsp;</div></td>" +
					                          "<td style=\"padding-left: 20px;\"> develops_from </td>" +
					                          "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
					                          "<td style=\"width:30px\"><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: brown; width:100%; height: 3px;\">&nbsp;</div></td>" +
					                      "</tr>" +
					                      "<tr>" +
					                          "<td style=\"padding-left: 10px;\"> regulates </td>" +
					                          "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
					                          "<td><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: black; width:100%; height: 3px;\">&nbsp;</div></td>" +
					                          "<td style=\"padding-left: 20px;\"> negatively_regulates </td>" +
					                          "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
					                          "<td><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: red; width:100%; height: 3px;\">&nbsp;</div></td>" +
					                          "<td style=\"padding-left: 20px;\"> positively_regulates </td>" +
					                          "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
					                          "<td><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: green; width:100%; height: 3px;\">&nbsp;</div></td>" +
					                      "</tr>" +
					                  "</tbody>" +
					          "</table>" +
				          "</div>" +
				          "<br style=\"clear: left;\" />" +
				          "<br style=\"clear: right;\" />" +
				       "</td>" +
				       "<td style=\"vertical-align: top; width: 200px;\">" +
					       "<div style=\"float: right\"> <a id=\"openExternal" + onto + "\" target=\"_blank\">Open image in new window</a> " +
					       "</div>" +
					       "<br style=\"clear: right;\" />" +
				       "</td>" +
				   "</tr>" +
	          "</table>" +
	          
	          
	          
         "</div>";

          return mainHTML;
          
        },
        
        renderGoAnnotHTML: function(dataObj, targetDiv) {
	        jQuery("#" + targetDiv).append(this.createHTMLTables(dataObj));
	        jQuery("#" + targetDiv).append(jQuery("<h3>Graphical Result</h3>"));
	        jQuery("#" + targetDiv).append(this.createHTMLImageNavigation(dataObj));
	        jQuery("#" + targetDiv).append(this.createHTMLImageContent(dataObj));
	        return;
	    },
	    
	    renderImage: function(tableObj, onto, targetDiv, processGlobalsOnload) {
	    	
	    	
	    	var goTermLimit = 50;
	    	var isChrome = /chrome/.test(navigator.userAgent.toLowerCase());
	    	var isSafari = /safari/.test(navigator.userAgent.toLowerCase());
	    	if((isChrome || isSafari) && onto == "BPO")
	    	{
	    		goTermLimit = 10;		    	
	    	}
	    	
	    	
	    	jQuery( ( "#showButton" + onto ) ).hide();
		    jQuery(("#"+ onto + "_img_container")).css("border", "0px solid white");
	    	jQuery("#_goannot_cntnt_img").css("border", "0px solid white");

	    	if(jQuery(("#imageLegend"+onto)).css("display") != "none")
	    	{
	    		processGlobalsOnload = true;
	    	}
	    	
	    	jQuery(("#imageLegend"+onto)).hide();
	    	
	    	var imageContainer = jQuery("#" + onto + "_img_container");
			imageContainer.empty();
	    	
	    	rows = tableObj[0].config.rowsCopy;
			goTermsDictArray = new Array();
			var goTermsDictArrayReduced;
			
			var goTermCounter = 0;
			var tooManyTerms =false;
			jQuery(rows).each(function () {
				
				
				var currCells = jQuery(this).children("td");
				var currBox = currCells.children("input");

				currDict = {};
				currDict["id"] = jQuery(currCells[1]).text();
				currDict["name"] = jQuery(currCells[2]).text();
				currDict["score"] = jQuery(currCells[3]).text();
				currDict["checked"] = currBox.is(':checked') ;
				
				goTermsDictArray.push(currDict);
				goTermCounter++;
				
				
			})
			
			if(goTermCounter > goTermLimit)
			{
				goTermsDictArrayReduced = new Array();
				tooManyTerms=true;
				for(var i = 0; i<goTermsDictArray.length; i++ )
				{
					if(goTermsDictArrayReduced.length<goTermLimit)
					{
						currDict = goTermsDictArray[i];
						if(currDict["checked"])
						{
							goTermsDictArrayReduced.push(currDict);
						}
					}
					else
					{
						break;
					}
				}
			}
			

			var requestString = generateAmigoRequest(tooManyTerms ? goTermsDictArrayReduced : goTermsDictArray);
			
			var imageLoaderDiv = jQuery("<div data-toggle=\"goImageLoading\"></div>");
            jQuery('<img />').attr({ 'id': 'imageLoading' + onto, 'src': '/ppres/assets/iviewer/image_loading.gif', 'alt':'Image loading...' }).appendTo(imageLoaderDiv);

			var imageSpan = jQuery("<div></div>");
			imageSpan.css("display", "inline-block");
			imageSpan.css("width", "100%");
			imageSpan.attr("data-toggle", "goImage");
			
			imageSpan.css("overflow-x", "hidden");
			imageSpan.css("overflow-y", "hidden");
			imageSpan.hide();
			
			
			var zoomifyWrapper = jQuery("<div></div>");
			zoomifyWrapper.attr("id", "image-zoom-wrapper-" + onto);
			zoomifyWrapper.addClass("viewer");
			zoomifyWrapper.css("width", "100%");
			zoomifyWrapper.css("text-align", "center"); 
			zoomifyWrapper.css("margin-left", "auto"); 
			zoomifyWrapper.css("margin-right", "auto");
			zoomifyWrapper.css("position", "relative");
			
			imageSpan.append(zoomifyWrapper);
			
			imageContainer.append(imageLoaderDiv);
			imageContainer.append(imageSpan);
			
            var zoomifyWrapperObj = jQuery(zoomifyWrapper).iviewer({
                        src: requestString,
                        update_on_resize: true,
                        zoom_animation: false,
        				zoom_min: 1,
        				zoom_max: 100
            });
			


			doMagnify = false;
			
			jQuery("#image-zoom-wrapper-" + onto).bind('ivieweronfinishload', function(ev, src) {
				
				if(isChrome || (isSafari && zoomifyWrapper.children("img")[0].naturalWidth == 0))
				{
					jQuery(zoomifyWrapper).height( (jQuery("#GOAnnotViewerContainer").width() / 2) * 0.98);
					jQuery(zoomifyWrapper).width(jQuery("#GOAnnotViewerContainer").width() * 0.98);
				}
				else if(zoomifyWrapper.children("img")[0].naturalWidth < 100)
				{
					jQuery(zoomifyWrapper).children().each(function() {
						jQuery(this).hide();
					});
					jQuery(zoomifyWrapper).text("n/a");
					
					imageLoaderDiv.each(function () {
				          var jQuerydiv = jQuery(this);
				          jQuerydiv.hide();
				      });
				    
					imageSpan.each(function () {
					      var imagei = jQuery(this);
					      imagei.show();
					});
				    
				    return;
				}
				else if(jQuery("#GOAnnotViewerContainer").width() <= zoomifyWrapper.children("img")[0].naturalWidth)
			    {
				
					var resizeFactorNat = jQuery("#GOAnnotViewerContainer").width() / zoomifyWrapper.children("img")[0].naturalWidth;
					var heightFinal = zoomifyWrapper.children("img")[0].naturalHeight * resizeFactorNat;

					if(resizeFactorNat < 1.0)
					{
	    				var heightForce = jQuery("#GOAnnotViewerContainer").width() / 2;
	    				var heightFinal = Math.max(heightFinal, heightForce)
	    				
					}

					jQuery(zoomifyWrapper).height( heightFinal * 0.98);
					jQuery(zoomifyWrapper).width(jQuery("#GOAnnotViewerContainer").width() * 0.98);

			    }
				else
				{
					jQuery(zoomifyWrapper).width( zoomifyWrapper.children("img")[0].naturalWidth );
					jQuery(zoomifyWrapper).height( zoomifyWrapper.children("img")[0].naturalHeight );
					jQuery(zoomifyWrapper).children("div").each(function() {
						jQuery(this).hide();
					});
				}
				
				
				jQuery(zoomifyWrapper).iviewer('update');
				jQuery(zoomifyWrapper).iviewer('fit');
				jQuery(zoomifyWrapper).iviewer('center');
				
				imageLoaderDiv.each(function () {
			          var jQuerydiv = jQuery(this);
			          jQuerydiv.hide();
			      });
				

			    jQuery(("#"+ onto + "_img_container")).css("border", "1px solid #E5E5E5");
			    jQuery(("#" +onto + "_img_container")).css("border-radius", "4px 4px 4px 4px");
			    jQuery(("#imageLegend"+onto)).show();
			    jQuery( ( "#openExternal" + onto ) ).attr("href", requestString);
			    
			    if (tooManyTerms)
			    {
			    	jQuery(("#imageWarning"+onto)).show();
			    }

			    imageSpan.each(function () {
				      var imagei = jQuery(this);
				      imagei.show();
				});
			    
			});


			if(tooManyTerms)
			{
				var imageWarningDiv = jQuery("<div>Warning: too many terms to display; only showing first " + goTermLimit + " selected terms</div>");
				imageWarningDiv.css("color", "red");
				imageWarningDiv.css("font-weight", "bold");
				imageWarningDiv.attr("id", "imageWarning"+onto);
				imageWarningDiv.attr("padding-left", "5px;");
				imageWarningDiv.hide();
				imageContainer.append(imageWarningDiv);
			}
			jQuery( ("#" + onto + "_img_link") ).click();
	    },
	     
        init: function(subcell_features, target_div) {
            target_div.append("<div id='subcell_container' style='display:block'/>");
            jQuery("#subcell_container").append(createTable(subcell_features));
            jQuery("img").load(function() {
                jQuery("#subcell_container").show();
            });
        },

        preload: function() {
            jQuery(arrImg).each(function() {
                jQuery('<img />').attr('src', this).appendTo(target_div).css('display', 'none');
            });
        },
       
        showGoImage: function() {
            jQuery('[data-toggle="goImage"]').each(function () {
                var jQueryimage = jQuery(this);
                jQueryimage.show();
            })
            jQuery('[data-toggle="goImageLoading"]').each(function () {
                var jQuerydiv = jQuery(this);
                jQuerydiv.hide();
            })
        }
    }
})();
