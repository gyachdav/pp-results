
Biojs.Table=Biojs.extend({constructor:function(options){var self=this;self._tableId='biojs_Table_'+self.getId();self._tableSelector='#'+self._tableId;self._topControls=jQuery('<div></div>').appendTo("#"+self.opt.target);self._body=jQuery('<div></div>').appendTo("#"+self.opt.target);self._table=jQuery('<table id="'+self._tableId+'" cellpadding="0" cellspacing="0" border="0" class="display"></table>').appendTo(self._body);self._columnsOffset=(this.opt.rowSelection)?1:0;self._settings={};self._settings.opt=this.opt;self._initSettings(self._settings);self.setDataSource(self.opt.dataSet);self._addEvents();Biojs.console.log("Biojs.Table constructor has finished");},opt:{target:"YourOwnDivId",hideColumns:[],columns:[""],dataSet:[],paginate:true,pageLength:10,width:597,height:400,rowSelection:true,orderBy:[]},eventTypes:["onCellClicked","onRowSelected","onHeaderClicked","onDataArrived"],setDataSource:function(dataSet){this.opt.dataSet=dataSet;if(dataSet instanceof Array){this._initSettingsForLocalData(this._settings);}else{this._initSettingsForRemoteData(this._settings);}
Biojs.console.log("Drawing..");this._settings.bDestroy=true;this._table.dataTable(this._settings);this._setColumnSelector(this._table.fnSettings());},toggleColumns:function(columns,flag){Biojs.console.log("Toggle columns to :"+flag);Biojs.console.log(columns);var checkbox=jQuery('input[name="multiselect_'+this._tableId+'_columns"]');for(i=0;i<columns.length;i++){toToggle=jQuery(checkbox[columns[i]]);if(toToggle.attr("checked")!=flag){toToggle.click();}
this._table.fnSetColumnVis(columns[i]+this._columnsOffset,flag);}},showColumns:function(columns){Biojs.console.log("Showing columns:");Biojs.console.log(columns);this.toggleColumns(columns,true);},hideColumns:function(columns){Biojs.console.log("Hiding columns:");Biojs.console.log(columns);this.toggleColumns(columns,false);},orderBy:function(columnIndex,direction){this._table.fnSort([[columnIndex+this._columnsOffset,direction]]);},getSelectedRows:function(){var self=this;var selectedRows=[];jQuery(self._tableSelector+' tr.selected').each(function(index,e){selectedRows.push(self._table.fnGetData(e));});Biojs.console.log(selectedRows)
return selectedRows;},_initSettings:function(settings){Biojs.console.log("initializing settings...");settings.aoColumnDefs=[];this._setColumns(this.opt.columns,settings);if(this.opt.hideColumns.length>0){settings.aoColumnDefs.push({"bVisible":false,"aTargets":this.opt.hideColumns});}
if(this.opt.orderBy.length>0){settings.aaSorting=this.opt.orderBy;}
if(this.opt.rowSelection){var columnsToHide=settings.aoColumnDefs[0].aTargets;for(i in columnsToHide){columnsToHide[i]+=1;}
for(i in settings.aaSorting){settings.aaSorting[i][0]+=1;}
settings.aoColumnDefs.push({"bSortable":false,"aTargets":[0]});}
if(!this.opt.paginate){settings.bScrollInfinite=true;settings.bScrollCollapse=true;}else{settings.sPaginationType="full_numbers";settings.iDisplayLength=this.opt.pageLength;settings.oLanguage={"oPaginate":{"sPrevious":"<","sNext":">","sFirst":"|","sLast":"|"}};}
settings.bProcessing=true;settings.bLengthChange=false;settings.sScrollX=this.opt.height;settings.sScrollY="100%";},_initSettingsForLocalData:function(settings){Biojs.console.log("Using local data");this._setData(this.opt.dataSet,settings);;settings.bServerSide=false;settings.sAjaxSource=null;settings.fnServerData=null;settings.bFilter=true;},_initSettingsForRemoteData:function(settings){Biojs.console.log("Using data from remote URL: "+this.opt.dataSet.url);settings.bServerSide=true;settings.sAjaxSource=this.opt.dataSet.url;settings.fnServerData=this._fetchData;settings.bFilter=this.opt.dataSet.filter;},_fetchData:function(sSource,aoData,fnCallback,oSettings){var httpRequest={url:sSource};var params=aoData;var biojsId=oSettings.sTableId.substr("biojs_Table_".length);var instance=Biojs.getInstance(biojsId);instance._mapUrlParams(aoData);httpRequest.dataType='json';if(instance.getProxy()!=undefined){httpRequest.url=instance.getProxy();params=[{name:"url",value:sSource+'?'+jQuery.param(aoData)}];httpRequest.dataType=instance.getProxyDataType();}
httpRequest.success=function(data){jsonData=instance._decodeToJSON(data);jsonData.sEcho=this.sEcho;instance._setSelectionColumn(jsonData);fnCallback(jsonData);instance.raiseEvent(Biojs.Table.EVT_ON_DATA_ARRIVED,{"jsonData":jsonData});}
httpRequest.type='GET';httpRequest.data=params;httpRequest.sEcho=aoData[0].value;jQuery.ajax(httpRequest);},getProxy:function(){return this.opt.dataSet.proxyUrl;},getProxyDataType:function(){return this.opt.dataSet.dataType|"text";},getTotalRecords:function(){return this.opt.dataSet.totalRecords;},_setSelectionColumn:function(jsonData){if(this.opt.rowSelection&&jsonData.aaData instanceof Array){for(i=0;i<jsonData.aaData.length;i++){jsonData.aaData[i].unshift('<input type="checkbox" id="'+i+'" />');}}},_decodeToJSON:function(data){var jsonData=data;if(Biojs.Utils.isEmpty(data)){Biojs.console.log("Empty data was received");}else if(!(jsonData instanceof Object)||!(jsonData.aaData instanceof Array)){jsonData={};jsonData.aaData=[];jsonData.iTotalRecords=0;jsonData.iTotalDisplayRecords=0;Biojs.console.log("Error: data with unknown format was detected.");}
Biojs.console.log(jsonData);return jsonData;},_mapUrlParams:function(params){var map=this.opt.dataSet.paramsMap;for(key in map){for(i=0;i<params.length;i++){if(params[i].name==key){Biojs.console.log("Renaming param <"+key+"> with <"+map[key]+">");params[i].name=map[key];}}}},_setColumnSelector:function(settings){var self=this;var columns=settings.aoColumns;var select=jQuery('<select id="'+self._tableId+'_columns" name="columns" multiselect="multiselect" />');for(i=this._columnsOffset;i<columns.length;i++){select.append('<option value="'+i+'">'+columns[i].sTitle+'</option>');}
jQuery(self._tableSelector+'_wrapper > '+self._tableId+'_columns').remove();select.prependTo(self._tableSelector+'_wrapper');self._columnSelector=select.multiselect({header:false,click:function(event,ui){self._table.fnSetColumnVis(ui.value,ui.checked);}});jQuery(self._tableSelector+'_wrapper > button').html('<span class="ui-icon ui-icon-carat-2-e-w"></span>').css("width","auto").addClass('dataTables_settings').attr("title","Show/hide columns");self._columnSelector.multiselect('uncheckAll');var visibleCols=settings.aiDisplayMaster;var checkbox=jQuery('input[name="multiselect_'+this._tableId+'_columns"]');for(i=0;i<checkbox.length;i++){jQuery(checkbox[i]).attr("checked",settings.aoColumns[i+this._columnsOffset].bVisible);}},addDataRow:function(row){if(this.opt.rowSelection){row.unshift('<input type="checkbox" id="" />');}
this._table.fnAddData(row);},removeDataRow:function(i){this._table.fnDeleteRow(i)},_setColumns:function(columns,oSettings){var self=this;var result=[];if(this.opt.rowSelection){columns.splice(0,0,{"name":'<input type="checkbox" />'});}
for(j in columns){if(typeof columns[j]=="string"){result[j]={"sTitle":columns[j]};}else{result[j]={"sTitle":columns[j].name};if(columns[j].render&&typeof columns[j].render=="function"){result[j].fnRender=function(o,value){return columns[o.iDataColumn].render(o.iDataColumn,o.aData,value);}}
if(columns[j].width&&typeof columns[j].width=="string"){result[j].sWidth=columns[j].width;}}}
oSettings.aoColumns=result;},_setData:function(data,oSettings){if(this.opt.rowSelection){for(r in data){data[r].splice(0,0,'<input type="checkbox" id="'+r+'" />');}}
oSettings.aaData=data;},_showEmptyMessage:function(){this._body.html("Empty");},_addEvents:function(){var self=this;jQuery(this._tableSelector).click(function(eventData){var cell=eventData.target;while(cell.tagName!="TD"){cell=cell.parentNode;}
var column=new Number(cell.cellIndex);var row=new Number(cell.parentNode.rowIndex-1);if(self.opt.rowSelection&&column==0){if(cell.children[0].checked){jQuery(cell).parent().addClass('selected');self.raiseEvent(Biojs.Table.EVT_ON_ROW_SELECTED,{rowIndex:row,row:jQuery(cell).parent()});}else{jQuery(cell).parent().removeClass('selected');}}else{self.raiseEvent(Biojs.Table.EVT_ON_CELL_CLICKED,{"cell":cell,"rowIndex":row,"colIndex":column});}
Biojs.console.log(eventData);});jQuery(self._tableSelector+'_wrapper table.dataTable thead tr th').click(function(eventData){var cell=eventData.currentTarget;var column=cell.cellIndex;if(self.opt.rowSelection&&column==0){if(cell.children[0].checked){jQuery(self._tableSelector+' tr').addClass('selected');jQuery(self._tableSelector+' tr td input').attr('checked',true);}else{jQuery(self._tableSelector+' tr').removeClass('selected');jQuery(self._tableSelector+' tr td input').attr('checked',false);}}else{self.raiseEvent(Biojs.Table.EVT_ON_HEADER_CLICKED,{"colName":cell.innerHTML,"colIndex":column});}
Biojs.console.log(eventData);});}},{EVT_ON_CELL_CLICKED:"onCellClicked",EVT_ON_ROW_SELECTED:"onRowSelected",EVT_ON_HEADER_CLICKED:"onHeaderClicked",EVT_ON_DATA_ARRIVED:"onDataArrived"});