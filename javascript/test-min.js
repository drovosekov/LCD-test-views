const mis="missed id: ";var debug=e=>{window.console.log(e)},$$=e=>document.getElementById(e),$n=e=>document.getElementsByName(e)[0],$=e=>$$(e)?$$(e):$n(e),$sbg=(e,a)=>{e?e.style.backgroundColor=a:debug(mis+e)},$sc=(e,a)=>{$(e)?$(e).style.color=a:debug(mis+e)},$sd=(e,a,l="block")=>{$(e)?$(e).style.display=a?l:"none":debug(mis+e)},$tt=e=>{if($(e))return $(e).innerText;debug(mis+e)},$h=(e,a)=>{$(e)?$(e).innerHTML=a:debug(mis+e)},$v=(e,a)=>{$(e)?$(e).value=a:debug(mis+e)},$ch=(e,a)=>{$(e)?$(e).checked=!a||"true"!=a.toString()&&1!=a?"":"checked":debug(mis+e)},$qs=e=>document.querySelectorAll(e);const panel_markup='<div id="settings_panel_{id}" class="block">\n<div id="div_rows_text">\n    <textarea id="row_txt" rows="2" cols="16" class="panel_row" onkeyup="updatePanel(this, {id})">{text}</textarea>\n</div>\n</div>\n<span class="r"></span>\n<span class="lcd_border">\n<div id="panel_{id}"></div>\n</span>\n<span class="l"></span>',full_view_pixel=3,full_view_brk=1;var panels_config={},panels_obj={};class tPanel{constructor(e){this.pastPanelConfig=e=>{pastPanelConfig(e)},this.copyPanelConfig=e=>{copyPanelConfig(e)},this.collapsePanel=e=>{collapsePanel(e)},this.delPanel=e=>{delPanel(e)}}}var selMenu=e=>{["full_page","global_settings","tests"].forEach((e=>{$sd(e,0),$ch("m_"+e,0)})),$ch("m_"+e,1),$sd(e,1),saveState(e)},selStndLCDSize=e=>{var a=e.split("x");$("rows").value=a[0],$("columns").value=a[1],$("px_size").value=a[2],saveState()},selFullViewCP=()=>{$h("full_view_lcd","");for(var e=new CharLCD({at:"full_view_lcd",rows:16,cols:16,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_text_color").value,pixel_size:3,break_size:1}),a=0;a<16;a++)for(var l=0;l<16;l++)e.char(a,l,String.fromCharCode(16*a+l));saveState()},initFullViews=()=>{var e=new CharLCD({at:"lcd0",rows:1,cols:1,off:"#fff",on:"#f00",pixel_size:3,break_size:1});e.font(0,[0,10,21,17,10,4]),e.char(0,0,String.fromCharCode(0)),new CharLCD({at:"lcd1",rows:1,cols:16,off:"#fff",on:"#000",pixel_size:3,break_size:1}).text(0,0,"0123456789ABCDEF"),new CharLCD({at:"lcdv",rows:16,cols:1,off:"#fff",on:"#000",pixel_size:3,break_size:1}).text(0,0,"0\n1\n2\n3\n4\n5\n6\n7\n8\n9\nA\nB\nC\nD\nE\nF"),selFullViewCP()},addPanel=(e,a)=>{$sbg($("panel_"+e.toString()).parentNode,$("lcd_border").checked?"#000":"#fff"),a||(a={at:"panel_"+e.toString(),rows:$("rows").value,cols:$("columns").value,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_text_color").value,pixel_size:$("px_size").value,break_size:$("break_size").value,large:$("lcd_large").checked});var l=$("panel_name_"+e).innerHTML;l||(l=$n("panel_name_"+e).value);var n={name:l,panel_config:a,content:""};panels_config[e]=n,panels_obj[e]=new CharLCD(a)},updatePanel=(e,a)=>{let l=e.value+" ";panels_obj[a].text(0,0,l),panels_config[a].content=l},initPanels=()=>{},editPanelName=e=>{let a=e.id;e.parentElement.innerHTML="<input type='text' onfocusout='renamePanel(this)' value='"+e.innerHTML+"' name='"+a+"'/>",$n(a).focus()},renamePanel=e=>{let a=e.name,l=e.value;(e=e.parentElement).innerHTML='<h3 id="'+a+'" onclick="editPanelName(this)">'+l+"</h3>",panels_config[a.replace("panel_name_","")].name=l},elValues=[{name:"full_view_cp",defvalue:"eu"},{name:"rows",defvalue:2},{name:"columns",defvalue:16},{name:"px_size",defvalue:3},{name:"break_size",defvalue:1},{name:"lcd_bg_color",defvalue:"#cd2"},{name:"lcd_text_color",defvalue:"#143"},{name:"lcd_border"},{name:"lcd_large"}],saveState=e=>{elValues.forEach((e=>{"checkbox"==$(e.name).type?localStorage.setItem("LCDtest_"+e.name,$(e.name).checked):localStorage.setItem("LCDtest_"+e.name,$(e.name).value)})),e&&localStorage.setItem("SelPage",e)},loadState=()=>{elValues.forEach((e=>{"checkbox"==$(e.name).type?$ch(e.name,localStorage.getItem("LCDtest_"+e.name)):$v(e.name,localStorage.getItem("LCDtest_"+e.name)||e.defvalue)})),$("lcd_sizes").value=$("rows").value+"x"+$("columns").value+"x"+$("px_size").value,selMenu(localStorage.getItem("SelPage")||"full_page")},savePanelsState=()=>{localStorage.setItem("LCDtest_Panels_config",JSON.stringify(panels_config))},loadPanelsState=()=>{};window.addEventListener("DOMContentLoaded",(()=>{loadState(),initFullViews(),addPanel(0),setInterval(savePanelsState,5e3)}));