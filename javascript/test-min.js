var debug=e=>{},$$=e=>document.getElementById(e),$n=e=>document.getElementsByName(e)[0],$=e=>$$(e)?$$(e):$n(e),$sc=(e,l)=>{$(e)?$(e).style.color=l:debug(mis+e)},$sd=(e,l,a="block")=>{$(e)?$(e).style.display=l?a:"none":debug(mis+e)},$tt=e=>{if($(e))return $(e).innerText;debug(mis+e)},$h=(e,l)=>{$(e)?$(e).innerHTML=l:debug(mis+e)},$v=(e,l)=>{$(e)?$(e).value=l:debug(mis+e)},$ch=(e,l)=>{$(e)?$(e).checked=l?"checked":"":debug(mis+e)},$qs=e=>document.querySelectorAll(e);const full_view_pixel=3,full_view_brk=1;var full_view_lcd,panels_test={};class tPanel{}var selMenu=e=>{["full_page","global_settings","tests"].forEach((e=>{$sd(e,0),$ch("m_"+e,0)})),$ch("m_"+e,1),$sd(e,1),saveState()},selFullViewCP=()=>{$h("full_view_lcd",""),full_view_lcd=new CharLCD({at:"full_view_lcd",rows:16,cols:16,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_text_color").value,pix:3,brk:1});for(var e=0;e<16;e++)for(var l=0;l<16;l++)full_view_lcd.char(e,l,String.fromCharCode(16*e+l));saveState()},initFullViews=()=>{var e=new CharLCD({at:"lcd0",rows:1,cols:1,off:"#fff",on:"#f00",pix:3,brk:1}),l=new CharLCD({at:"lcd1",rows:1,cols:16,off:"#fff",on:"#000",pix:3,brk:1}),a=new CharLCD({at:"lcdv",rows:16,cols:1,off:"#fff",on:"#000",pix:3,brk:1});full_view_lcd=new CharLCD({at:"full_view_lcd",rows:16,cols:16,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_text_color").value,pix:3,brk:1}),e.font(0,[0,10,21,17,10,4]),e.char(0,0,String.fromCharCode(0));for(var t=0;t<16;t++){l.char(0,t,"0123456789ABCDEF"[t]),a.char(t,0,"0123456789ABCDEF"[t]);for(var n=0;n<16;n++)full_view_lcd.char(t,n,String.fromCharCode(16*t+n))}},addPanel=(e,l)=>{var a=new CharLCD({at:"panel_"+e.toString(),rows:$("rows").value,cols:$("columns").value,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_text_color").value,pix:$("px_size").value,brk:$("break_size").value}),t=$("panel_name_"+e).innerHTML;t||(t=$n("panel_name_"+e).value);var n={index:e,name:t,content:[],lcd_panel:a};panels_test[e]=n},updatePanel=e=>{let l=e.value+" ";panels_test[0].lcd_panel.text(e.id.replace("row_txt_",""),0,l),panels_test[0].content={};for(var a=0;;){var t=$("row_txt"+a);if(!t)break;panels_test[0].content[a]=t.value,a++}},initPanels=()=>{},editPanelName=e=>{let l=e.id;e.parentElement.innerHTML="<input type='text' onfocusout='renamePanel(this)' value='"+e.innerHTML+"' name='"+l+"'/>",$n(l).focus()},renamePanel=e=>{let l=e.name,a=e.value;(e=e.parentElement).innerHTML='<h3 id="'+l+'" onclick="editPanelName(this)">'+a+"</h3>"},elValues=[{name:"full_view_cp",defvalue:"eu"},{name:"rows",defvalue:2},{name:"columns",defvalue:16},{name:"px_size",defvalue:3},{name:"break_size",defvalue:1},{name:"lcd_bg_color",defvalue:"#cd2"},{name:"lcd_text_color",defvalue:"#143"}],saveState=()=>{elValues.forEach((e=>{localStorage.setItem("LCDtest_"+e.name,$(e.name).value)}))},loadState=()=>{elValues.forEach((e=>{$v(e.name,localStorage.getItem("LCDtest_"+e.name)||e.defvalue)}))};window.addEventListener("DOMContentLoaded",(()=>{loadState(),initFullViews(),selMenu("tests"),addPanel(0)}));