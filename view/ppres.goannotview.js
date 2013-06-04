var GOANNOT_VIEW = (function() {
	var assets_path =  '/~hampt/pp-results/'+'assets/';
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
			
			_maindiv = document.createElement('div');
			_mainMainDiv = document.createElement('div');
			_mainMainDiv.style.cssText = "";
			_mainMainHTML = 
			"<div style=\"width: 40%; padding-right:30px; padding-bottom:0px;margin-bottom:0px\">" +
				"<table class=\"table table-striped\" style=\"width:100%;margin-bottom:0px;\">" +
					"<tbody>" +
						"<tr>" +
							"<th width=\"20%\">GO ID</th>" +
							"<th width=\"60%\">GO Term</th>" +
							"<th width=\"20%\">Reliability (%)</th>" +
						"</tr>" +
					"</tbody>" +
				"</table>" +
			"</div>" +
			"<div style=\"width: 100%\">" +
				"<div style=\"float: left; width:40%; padding-right:40px;padding-top:0px; margin-top:0px;\">" +
					"<table class=\"table table-striped\" style=\"width:100%\">" +
						"<tbody>" +
							"<tr>" +
							"</tr>";
								
			for(var i = 0; i< Math.ceil( goTermWithScoreArray.length / 2.0 ); i++)
			{
				currGoTermWithScore = goTermWithScoreArray[i];
				
				_mainMainHTML += "<tr>";
				_mainMainHTML += 	"<td width=\"20%\">"+ linkToGO(currGoTermWithScore.gotermid) +"</td>";
				_mainMainHTML += 	"<td width=\"60%\">"+ currGoTermWithScore.gotermname +"</td>";
				_mainMainHTML += 	"<td width=\"20%\">"+ currGoTermWithScore.gotermscore +"</td>";
				_mainMainHTML += "</tr>";
				
				GETRequestString += "\"" + currGoTermWithScore.gotermid + "\": {\"title\": \"" + "Score: " + currGoTermWithScore.gotermscore + "\", " +
					"\"body\": \"" + currGoTermWithScore.gotermid + ": " + currGoTermWithScore.gotermname + "\", " +
					"\"fill\": \"" + "#FFFF99" + "\", " +
					"\"font\": \"" + "black" + "\", " +
					"\"border\": \"" + "black" + "\"}";
					
				if(!(i == 0 && goTermWithScoreArray.length == 1))
				{
					GETRequestString += ",";
				}
			}
						
			_mainMainHTML += "</tbody></table></div> ";
			_mainMainHTML += "<div style=\"float: left; width:40%; padding-right:40px;padding-top:0px; margin-top:0px;\">" +
								"<table class=\"table table-striped\" style=\"width:100%\">" +
									"<tbody>" +
										"<tr>" +
										"</tr>";
						
			for(var i = Math.ceil( goTermWithScoreArray.length / 2.0 ); i< goTermWithScoreArray.length; i++)
			{
				currGoTermWithScore = goTermWithScoreArray[i];
				
				_mainMainHTML += "<tr>";
				_mainMainHTML += 	"<td width=\"20%\">"+ linkToGO(currGoTermWithScore.gotermid) +"</td>";
				_mainMainHTML += 	"<td width=\"60%\">"+ currGoTermWithScore.gotermname +"</td>";
				_mainMainHTML += 	"<td width=\"20%\">"+ currGoTermWithScore.gotermscore +"</td>";
				_mainMainHTML += "</tr>";

				GETRequestString += "\"" + currGoTermWithScore.gotermid + "\": {\"title\": \"" + "Score: " + currGoTermWithScore.gotermscore + "\", " +
				"\"body\": \"" + currGoTermWithScore.gotermid + ": " + currGoTermWithScore.gotermname + "\", " +
				"\"fill\": \"" + "#FFFF99" + "\", " +
				"\"font\": \"" + "black" + "\", " +
				"\"border\": \"" + "black" + "\"}";
				
				if(i != goTermWithScoreArray.length-1)
				{
					GETRequestString += ",";
				}

			}
			
			_mainMainHTML += "</tbody></table></div>";
			_mainMainHTML += "<br style=\"clear: left;\" />  </div>";
	
			_mainMainDiv.innerHTML = _mainMainHTML;

			GETRequestString += "}";
			
			GETRequestString = "http://amigo.geneontology.org/cgi-bin/amigo/visualize?mode=advanced&term_data=" + customEncode(GETRequestString) + "&term_data_type=json&format=png";
			
			
			//console.log(GETRequestString);
			GETRequestStringEncoded = encodeURIComponent(GETRequestString);
			
			var amigoImage = document.createElement('div');
			
//			{
//				"GO:0002244":{"title": "foo", "fill": "yellow", "font": "black", "border":"red"},
//				"GO:0005575":{"title":"alone", "body":""},
//				"GO:0033060":{}
//				}
//			
//			
			amigoImage.innerHTML = "<span><img data-toggle=\"magnify\" id=\"imgMine\" style=\"border-radius: 4px 4px 4px 4px; border:1px solid #E5E5E5; width: 100%; \" alt=\"\" src=\""+ GETRequestString +"\" width=\"100%\"/></div><span>" +
			"<div><table cellspacing=\"0\" border=\"0\">" +
				"<thead>" +
					"<tr>" +
						"<th align=left colspan=3>Edge color legend </th>" +
					"</tr>" +
				"</thead>" +
				"<tbody>" +
					"<tr>" +
						"<td width=\"60%\"> is_a </td>" +
						"<td width=\"10%\"> &nbsp </td>" + 
						"<td width=\"30%\" bgcolor=\"blue\"></td>" +
					"</tr>" + 
					"<tr>" +
						"<td> part_of </td>" +
						"<td>  &nbsp </td>" +
						"<td bgcolor=\"lightblue\"></td>" +
					"</tr>" +
					"<tr>" +
						"<td> develops_from </td>" +
						"<td>  &nbsp </td>" +
						"<td bgcolor=\"brown\"> </td>" +
					"</tr>" +
					"<tr>" +
						"<td> regulates </td><td>  &nbsp </td><td bgcolor=\"black\"></td>" +
					"</tr>" +
					"<tr>" +
						"<td> negatively_regulates </td><td>  &nbsp </td><td bgcolor=\"red\"></td>" +
					"</tr>" +
					"<tr>" +
						"<td> positively_regulates </td><td>  &nbsp </td><td bgcolor=\"green\"></td>" +
					"</tr>" +
				"</tbody>" +
			"</table></div>";

			_maindiv.appendChild(_mainMainDiv);
			_maindiv.appendChild(amigoImage);
			
			return _maindiv;
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
		}
		
		
	}

})();
