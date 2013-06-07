var GOANNOT_VIEW = (function() {
<<<<<<< HEAD
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

	return {
		
		goannotDiv: function(goTermWithScoreArray, ontology) {
			
			var _table, header_row, row, cell;
			
			var GETRequestString = "{";
=======
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
        	GETRequestString += "\"" + currGoTermDict["id"] + "\": {\"title\": \"" + "Score: " + currGoTermDict["score"] + "\", " +
	  	      "\"body\": \"" + currGoTermDict["id"] + ": " + currGoTermDict["name"] + "\", " +
	  	      "\"fill\": \"" + (currGoTermDict["checked"] ? "#FFFF99" : "#E5E4E2") + "\", " +
	  	      "\"font\": \"" + "black" + "\", " +
	  	      "\"border\": \"" + "black" + "\"}";     		

        	if((goTermsSelectedDict.length-1) != i)
        	{
        		GETRequestString += ",";
        	}
    	}

    	
    	GETRequestString += "}";
    	GETRequestStringEncoded = "http://amigo.geneontology.org/cgi-bin/amigo/visualize?mode=advanced&term_data=" + customEncode(GETRequestString) + "&term_data_type=json&format=png";

    	return GETRequestStringEncoded;
    	
    }
    
    return {
       
       
        toggleAll: function(onto) {
            var selected = 0;
            var all=0
           
            $("input[name='" + onto + "']:checked").each(function ()
            {
                selected++;
            });
           
            $("input[name='" + onto + "']").each(function ()
            {
                all++;
            });
           
            target=true;
            if(all-selected == 0)
            {
                target=false;
            }
           
            $("input[name='" + onto + "']").each(function ()
            {
                $(this).attr("checked", target);
            });
           
        },
       
        createHTMLTables: function(dataObj) {
            var ontologyPredictionArray = dataObj.getGOAnnotations("");
            var _table, header_row, row, cell;
            
            _maindiv = $('<div></div>');
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
                                    "<th colspan=5 style=\"text-align: center\"> <div style=\"font-size:larger\">" + currOntology + "</div></th>" +
                                "</tr>" +
                                "<tr>" +
                                    "<th width=\"5%\">#</th>" +
                                    "<th width=\"15%\">GO ID</th>" +
                                    "<th width=\"55%\">GO Term</th>" +
                                    "<th width=\"20%\">Reliability (%)</th>" +
                                    "<th width=\"5%\"><input class=\"allToggler\" type=\"checkbox\" name=\"goSel" + currOntologyShort + "All\" value=\"" + "all" + "\" checked/></th>" +
                                "</tr>" +
                            "</thead>" +
                                "<tbody>";
                                    "<tr><td><td><td>" +
                                    "</tr>";
                   
                    goTermWithScoreArray = currOntologyPrediction.goTermWithScore;
                   
                    for(var j = 0; j< goTermWithScoreArray.length; j++)
                    {
                        currGoTermWithScore = goTermWithScoreArray[j];
                       
                        _mainMainHTML += "<tr>";
                        _mainMainHTML +=     "<td width=\"5%\">"+ j +"</td>";
                        _mainMainHTML +=     "<td width=\"15%\">"+ linkToGO(currGoTermWithScore.gotermid) +"</td>";
                        _mainMainHTML +=     "<td width=\"55%\">"+ currGoTermWithScore.gotermname +"</td>";
                        _mainMainHTML +=     "<td width=\"20%\">"+ currGoTermWithScore.gotermscore +"</td>";
                        _mainMainHTML +=     "<td width=\"5%\"><input type=\"checkbox\" name=\"goSel" + currOntologyShort + "\" value=\"" + currGoTermWithScore.gotermid + "\" checked/></td>";
                        _mainMainHTML += "</tr>";
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
                var _curr_li = jQuery("<li><a data-toggle=\"tab\" id=\"" + currOntologyShort + "_img_link\" href=\"#" + currOntologyShort + "_img_container\">" + currOntology + "</a></li>");

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
                
                var _curr_div;
                if (!currOntologyPrediction)
                {
                    _curr_div = jQuery("<div />").text("Data unavailable");
                }
                else
                {
                    _curr_div = jQuery("<div />");
                    _curr_div.append(  "Image loading..." );
                }
               
                _curr_div.addClass("tab-pane");
                _curr_div.attr("id",currOntologyShort + "_img_container");
               
                if(i == 0)
                {
                    _curr_div.addClass('active');
                }
               
                content_div.append(_curr_div);
            }

            return content_div;
        },
        
        createHTMLLegend: function(dataObj) {
        	
         var mainHTML = "<div id=\"imageLegend\" style=\"display:none; padding-left: 5px; margin-top: 10px;\">" +
	          "<table cellspacing=\"0\" border=\"0\">" +
	              "<thead>" +
	                  "<tr>" +
	                      "<th align=left colspan=9 style=\"padding-bottom:5px;\">Node color legend </th>" +
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
	                  "<thead>" +
	                      "<tr>" +
	                          "<th align=left colspan=9 style=\"padding-top: 15px;\">Edge color legend </th>" +
	                      "</tr>" +
	                  "</thead>" +
	                  "<tbody>" +
	                      "<tr>" +
	                          "<td style=\"padding-left: 10px;\" > is_a </td>" +
	                          "<td style=\"padding-left: 10px;\"> &nbsp </td>" +
	                          "<td><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: blue; width:100%; height: 5px;\">&nbsp;</div></td>" +
	                          "<td style=\"padding-left: 20px;\"> part_of </td>" +
	                          "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
	                          "<td><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: lightblue; width:100%; height: 5px;\">&nbsp;</div></td>" +
	                          "<td style=\"padding-left: 20px;\"> develops_from </td>" +
	                          "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
	                          "<td><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: brown; width:100%; height: 5px;\">&nbsp;</div></td>" +
	                      "</tr>" +
	                      "<tr>" +
	                          "<td style=\"padding-left: 10px;\"> regulates </td>" +
	                          "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
	                          "<td><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: black; width:100%; height: 5px;\">&nbsp;</div></td>" +
	                          "<td style=\"padding-left: 20px;\"> negatively_regulates </td>" +
	                          "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
	                          "<td><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: red; width:100%; height: 5px;\">&nbsp;</div></td>" +
	                          "<td style=\"padding-left: 20px;\"> positively_regulates </td>" +
	                          "<td style=\"padding-left: 10px;\">  &nbsp </td>" +
	                          "<td><div style=\"line-height:1px; margin: 0px; padding:0px; border: 0px; background-color: green; width:100%; height: 5px;\">&nbsp;</div></td>" +
	                      "</tr>" +
	                  "</tbody>" +
	          "</table>" +
          "</div>";

          return mainHTML;
          
        },
        
        renderGoAnnotHTML: function(dataObj, targetDiv) {
	        jQuery("#" + targetDiv).append(this.createHTMLTables(dataObj));
	        jQuery("#" + targetDiv).append(jQuery("<h3>Graphical Result</h3>"));
	        jQuery("#" + targetDiv).append(this.createHTMLImageNavigation(dataObj));
	        jQuery("#" + targetDiv).append(this.createHTMLImageContent(dataObj));
	        jQuery("#" + targetDiv).append(this.createHTMLLegend(dataObj));
	        return;
	    },
	    
	    renderImage: function(tableObj, onto, targetDiv, processGlobalsOnload) {
	    	
	    	
	    	jQuery( ( "#showButton" + onto ) ).hide();
	    	
	    	jQuery("#_goannot_cntnt_img").css("border", "0px solid white");

	    	if(jQuery("#imageLegend").css("display") != "none")
	    	{
	    		processGlobalsOnload = true;
	    	}
	    	
	    	jQuery("#imageLegend").hide();
	    	var imageContainer = jQuery("#" + onto + "_img_container");
			imageContainer.empty();
	    	
	    	rows = tableObj[0].config.rowsCopy;
			goTermsDictArray = new Array();
			
			$(rows).each(function () {
				
				
				var currCells = $(this).children("td");
				var currBox = currCells.children("input");

				currDict = {};
				currDict["id"] = $(currCells[1]).text();
				currDict["name"] = $(currCells[2]).text();
				currDict["score"] = $(currCells[3]).text();
				currDict["checked"] = currBox.is(':checked') ;
				
				goTermsDictArray.push(currDict)
			})
			
			var requestString = generateAmigoRequest(goTermsDictArray);
			
				

			 
			var imageLoaderDiv = $("<div data-toggle=\"goImageLoading\">Image loading...</div>");
			var imageSpan = $("<div></div>");
			imageSpan.css("display", "inline-block");
			imageSpan.css("max-width", "99%");
			imageSpan.attr("data-toggle", "goImage");
			
			imageSpan.css("overflow-x", "hidden");
			imageSpan.css("overflow-y", "hidden");
			

			imageSpan.hide();
			 
			var imageAct = $("<img></img>");
			imageAct.attr("data-toggle", "magnify");
			imageAct.addClass("magnifyGO");
			imageAct.attr("id", "imgMine" + onto);
			imageAct.attr("src", requestString);


			doMagnify = false;
			imageAct.load(function(){
				
				imageLoaderDiv.each(function () {
			          var $div = $(this);
			          $div.hide();
			      });
				
				imageSpan.each(function () {
			      var imagei = $(this);
			      imagei.show();
			      

			    if(imageAct.width() != imageAct[0].naturalWidth)
			    {
			    	  imageAct.magnify();
			    }
			    
			    if(processGlobalsOnload)
			    {
			      $("#imageLegend").show();
			      $("#_goannot_cntnt_img").css("border", "1px solid #E5E5E5");
			      $("#_goannot_cntnt_img").css("border-radius", "4px 4px 4px 4px");
			    }
			      
			  })});

			imageSpan.append(imageAct);  

			imageContainer.append(imageLoaderDiv);
			imageContainer.append(imageSpan);

			$( ("#" + onto + "_img_link") ).click();
			
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
            $('[data-toggle="goImage"]').each(function () {
                var $image = $(this);
                $image.show();
            })
            $('[data-toggle="goImageLoading"]').each(function () {
                var $div = $(this);
                $div.hide();
            })
        }
    }

})();
