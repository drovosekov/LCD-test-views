"use strict";const mis="missed id: ";var debug=e=>{"object"==typeof e&&(e=JSON.stringify(e)),window.console.log(e)},$$=e=>document.getElementById(e),$n=e=>document.getElementsByName(e)[0],$=e=>$$(e)?$$(e):$n(e),$sbg=(e,l)=>{e&&e.style&&(e.style.backgroundColor=l)},$sc=(e,l)=>{$(e)?$(e).style.color=l:debug(mis+e)},$sd=(e,l,o="block")=>{$(e)?($(e).classList.remove("hidden"),$(e).style.display=l?o:"none"):debug(mis+e)},$tt=e=>{if($(e))return $(e).innerText;debug(mis+e)},$h=(e,l)=>{$(e)?$(e).innerHTML=l:debug(mis+e)},$v=(e,l)=>{$(e)?$(e).value=l:debug(mis+e)},$ch=(e,l)=>{$(e)?$(e).checked=!l||"true"!=l.toString()&&1!=l?"":"checked":debug(mis+e)},$qs=e=>document.querySelectorAll(e),$parent=(e,l)=>l&&e?$parent(e.parentNode,--l):e;Object.keys||(Object.keys=e=>{var l=[];for(let o in e)Object.prototype.hasOwnProperty.call(e,o)&&l.push(o);return l});const full_view_pixel=3,full_view_brk=1,tipDuration="5000";var full_view_lcd,CustomSymbolsPanel,symbol_code,selectedMenu,ToolTipText,init_complite=!1,copiedPanelConfig="",panels_config={},panels_obj={},menuItems=["about","cps","custom_symbol","config","tests"],elSavedState=[{name:"full_view_cp",defvalue:"eu"},{name:"rows",defvalue:2},{name:"columns",defvalue:16},{name:"px_size",defvalue:3},{name:"break_size",defvalue:1},{name:"lcd_bg_color",defvalue:"#cd2"},{name:"lcd_pixel_color",defvalue:"#143"},{name:"lcd_border"},{name:"lcd_large"},{name:"symbols_data_type"},{name:"lcd_bus"},{name:"code_gen"},{name:"show_hover_grid"}],ToolTip=(e,l,o)=>{if(l&&(l=" alert-"+l),e=e.replace("%v",o),ToolTipText!=e){var n=document.createElement("div");n.className="alert"+l,n.innerHTML=e,ToolTipText=e,$("ohsnap").appendChild(n);var a=e=>{e&&e.remove(),ToolTipText=""};n.onclick=()=>{a(n)},setTimeout((()=>{a(n)}),"5000")}},getPanelIndex=e=>e?"card test_panel"==e.className?e.id.replace("lcd_",""):getPanelIndex(e.parentNode):null,selMenu=e=>{menuItems.forEach((e=>{$sd(e,0),$ch("m_"+e,0)})),selectedMenu=e,$ch("m_"+e,1),$sd(e,1),saveState(e)},initSwipes=()=>{let e=0,l=0;var o=e=>{let l=menuItems.indexOf(selectedMenu);l+=e,l<0?l=menuItems.length:l>menuItems.length&&(l=0),selMenu(menuItems[l])};document.addEventListener("touchstart",(l=>{e=l.changedTouches[0].screenX})),document.addEventListener("touchend",(n=>{l=n.changedTouches[0].screenX,l<e?o(1):l>e&&o(-1)}))},selStndLCDSize=e=>{var l=e.split("x");$("rows").value=l[0],$("columns").value=l[1],$("px_size").value=l[2]},selLCDColors=()=>{let e=$("lcd_bg_color").value,l=$("lcd_pixel_color").value;full_view_lcd.setBGColor(e),full_view_lcd.setPixelsColor(l),CustomSymbolsPanel.setPixelsColor(l),CustomSymbolsPanel.setBGColor(e),$sbg($("custom_symb_matrix"),e),$qs("label[class='dot-px']").forEach((e=>{e.style.backgroundColor&&$sbg(e,l)}));let o=$("colors_tmpl");$sbg(o,e),o.childNodes.forEach((e=>{$sbg(e,l)}))},updateFullViewCustomSymbols=()=>{full_view_lcd.param.font=CustomSymbolsPanel.param.font;for(let e=0;e<8;e++)full_view_lcd.char(0,e,String.fromCharCode(e))},selFullViewCP=()=>{full_view_lcd=new CharLCD({at:"full_view_lcd",rows:16,cols:16,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_pixel_color").value,pixel_size:3,break_size:1,show_hover_grid:$("show_hover_grid").checked?1:0});for(let e=0;e<16;e++)for(let l=0;l<16;l++)full_view_lcd.char(e,l,String.fromCharCode(16*e+l));$("custom_symb_matrix").style.backgroundColor=$("lcd_bg_color").value,updateFullViewCustomSymbols()},initFullViews=()=>{var e=new CharLCD({at:"lcd0",rows:1,cols:1,off:"#fff",on:"#f00",pixel_size:3,break_size:1});e.font(0,[0,0,10,21,17,10,4]),e.char(0,0,String.fromCharCode(0)),new CharLCD({at:"lcd1",rows:1,cols:16,off:"#fff",on:"#000",pixel_size:3,break_size:1,content:"0123456789ABCDEF"}),new CharLCD({at:"lcdv",rows:16,cols:1,off:"#fff",on:"#000",pixel_size:3,break_size:1,content:"0\n1\n2\n3\n4\n5\n6\n7\n8\n9\nA\nB\nC\nD\nE\nF"}),selFullViewCP()},createNewPanel=e=>{let l=new CharLCD(e);panels_obj[e.id]=l,$sbg($("panel_"+e.id).parentNode,e.border?"#000":"#fff")},setPanelInfoText=e=>{let l="ROM: "+e.rom;l+=", rows="+e.rows,l+=", cols="+e.cols,l+="<br/>pixel size="+e.pixel_size,l+=", break size="+e.break_size,l+=e.large?", Large LCD":"",$("panel_info_"+e.id).innerHTML=l},addPanel=e=>{if(!e){let l=Object.keys(panels_config).length;e={id:l,at:"panel_"+l,name:"Panel "+(parseInt(l)+1),minimized:0,rows:$("rows").value,cols:$("columns").value,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_pixel_color").value,pixel_size:$("px_size").value,break_size:$("break_size").value,show_hover_grid:$("show_hover_grid").checked?1:0,large:$("lcd_large").checked,border:$("lcd_border").checked,custom_font:CustomSymbolsPanel.param.font,content:""}}let l=document.createElement("div");l.className="card test_panel",l.id="lcd_"+e.id,l.innerHTML=$("panel_template").innerHTML.replace("{text}",e.content).replace("{PanelName}",e.name).replace(/{id}/g,e.id),$("panels").appendChild(l),panels_config[e.id]=e,createNewPanel(e),e.minimized&&collapsePanel($("min_panel_"+e.id)),setPanelInfoText(e),savePanelsState(),$(l.id).scrollIntoView(),$("text_"+e.id).focus()},updatePanel=e=>{let l=getPanelIndex(e),o=e.value;panels_config[l].content=o,panels_obj[l].text(0,0,o)},copyPanelConfig=(e,l)=>{"global"==e?(copiedPanelConfig={rows:$("rows").value,cols:$("columns").value,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_pixel_color").value,pixel_size:$("px_size").value,break_size:$("break_size").value,large:$("lcd_large").checked,border:$("lcd_border").checked,show_hover_grid:$("show_hover_grid").checked?1:0},ToolTip("Global settings saved at inner variable.<br />You can past it to test panels config","green")):"CustomSymbol"==e?(symbol_code=CustomSymbolsPanel.getSymbolByIndex($("currentSymbolIndex").value),copiedPanelConfig={custom_font:CustomSymbolsPanel.param.font},ToolTip("Custom symbols saved at inner variable","green")):"panel"==e&&(copiedPanelConfig=panels_config[getPanelIndex(l)],ToolTip("Panel config saved at inner variable.<br />Past it to other panel config or gloabal settings page","green"))},pastPanelConfig=(e,l,o)=>{if("global"==e){if("string"!=typeof copiedPanelConfig.rom)return void ToolTip("Error: empty config","red");$v("rows",copiedPanelConfig.rows),$v("columns",copiedPanelConfig.cols),$v("full_view_cp",copiedPanelConfig.rom),$v("lcd_bg_color",copiedPanelConfig.off),$v("lcd_pixel_color",copiedPanelConfig.on),$v("px_size",copiedPanelConfig.pixel_size),$v("break_size",copiedPanelConfig.break_size),$ch("lcd_large",copiedPanelConfig.large),$ch("lcd_border",copiedPanelConfig.border),$ch("show_hover_grid",copiedPanelConfig.show_hover_grid),$v("lcd_sizes",copiedPanelConfig.rows+"x"+copiedPanelConfig.cols+"x"+copiedPanelConfig.pixel_size),ToolTip("Global settings replaced with saved","yellow")}else if("CustomSymbol"==e){let e=e=>{for(let l=0;l<8;l++)dec2bin(e[l]).split("").reduce(((e,o,n)=>{$("dot"+(5*l+n-1)).checked="1"==o}))};if(o)e(o);else if(copiedPanelConfig.custom_font)CustomSymbolsPanel.param.font=copiedPanelConfig.custom_font.slice(),copiedPanelConfig.custom_font=null,symbol_code instanceof Array&&e(symbol_code);else if(symbol_code instanceof Array)e(symbol_code);else if(init_complite)return void ToolTip("Error: empty symbol code","red");updateCustomSymb()}else if("panel"==e){let e=getPanelIndex(l),o=copiedPanelConfig.custom_font;o instanceof Array?((copiedPanelConfig=panels_config[e]).custom_font=o.slice(),panels_config[e].custom_font=o.slice(),createNewPanel(copiedPanelConfig),setPanelInfoText(copiedPanelConfig),ToolTip("Panel custom symbols replaced with saved","yellow")):"string"!=typeof copiedPanelConfig.rom?ToolTip("Error: empty config","red"):copiedPanelConfig&&(copiedPanelConfig.id=e,copiedPanelConfig.at="panel_"+e,copiedPanelConfig.content=panels_config[e].content,copiedPanelConfig.custom_font=panels_config[e].custom_font,copiedPanelConfig.name||(copiedPanelConfig.name=panels_config[e].name),panels_config[e]=copiedPanelConfig,createNewPanel(copiedPanelConfig),setPanelInfoText(copiedPanelConfig),ToolTip("Panel config replaced with saved","yellow"))}},editPanelName=e=>{let l=getPanelIndex(e);e.parentNode.innerHTML="<input type='text' onfocusout='renamePanel(this)' id='panel_name_"+l+"' value='"+e.innerHTML+"'/>";let o=$("panel_name_"+l);o.focus(),o.selectionStart=o.value.length},renamePanel=e=>{let l=getPanelIndex(e),o=e.value;e.parentNode.innerHTML='<h2 id="panel_name_'+l+'" onclick="editPanelName(this, '+l+')">'+o+"</h2>",panels_config[l].name=o},collapsePanel=e=>{let l=getPanelIndex(e);"_"==e.innerText?($sd("panel_area_"+l,0),panels_config[l].minimized=1,e.innerText="□"):($sd("panel_area_"+l,1),panels_config[l].minimized=0,e.innerText="_")},delPanel=e=>{let l=getPanelIndex(e);confirm('Realy delete panel "'+$("panel_name_"+l).innerHTML+'"?')&&(ToolTip('"'+$("panel_name_"+l).innerHTML+'" R.I.P....',"blue"),$("lcd_"+l).remove(),delete panels_obj[l],delete panels_config[l],savePanelsState())},saveState=e=>{init_complite&&(elSavedState.forEach((e=>{"checkbox"==$(e.name).type?localStorage.setItem("LCDtest_"+e.name,$(e.name).checked):localStorage.setItem("LCDtest_"+e.name,$(e.name).value)})),e&&localStorage.setItem("LCDtest_SelPage",e))},loadState=()=>{selMenu(localStorage.getItem("LCDtest_SelPage")||"about"),elSavedState.forEach((e=>{"checkbox"==$(e.name).type?$ch(e.name,localStorage.getItem("LCDtest_"+e.name)):$v(e.name,localStorage.getItem("LCDtest_"+e.name)||e.defvalue);var l=$(e.name).onchange;$(e.name).onchange=()=>{"function"==typeof l&&l(),saveState()}})),$v("lcd_sizes",$("rows").value+"x"+$("columns").value+"x"+$("px_size").value),$("lcd_sizes").value||$v("lcd_sizes","---")},savePanelsState=()=>{init_complite&&localStorage.setItem("LCDtest_Panels_config",JSON.stringify(panels_config))},initPanels=()=>{let e=JSON.parse(localStorage.getItem("LCDtest_Panels_config"));if(!e||0==Object.keys(e).length)return void addPanel({id:0,at:"panel_0",name:"Panel 1",minimized:0,rows:2,cols:16,rom:"eu",off:"#D5D9E0",on:"#143",pixel_size:3,break_size:1,show_hover_grid:$("show_hover_grid").checked?1:0,large:0,border:1,content:"Test LCD Display\nEmulator HD44780"});let l=0;Object.keys(e).forEach((o=>{e[o].id=l,e[o].at="panel_"+l,addPanel(e[o]),l++}))},initCustomSymbolMatrix=()=>{var e=$("custom_symb_matrix");e.style.backgroundColor=$("lcd_bg_color").value,e.style.display="block";for(let l=0;l<8;l++){let o=document.createElement("div");o.className="row";for(let e=0;e<5;e++){let n="dot"+(e+5*l),a=document.createElement("label");a.className="dot-px",a.setAttribute("for",n);let t=document.createElement("input");t.type="checkbox",t.id=n,t.onchange=()=>{updateCustomSymb()},o.appendChild(t),o.appendChild(a)}e.appendChild(o)}},initCustomSymbolsPanel=()=>{CustomSymbolsPanel=new CharLCD({at:"custom_symbols_panel",rows:1,cols:8,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_pixel_color").value,pixel_size:3,break_size:1,show_hover_grid:$("show_hover_grid").checked?1:0});let e=JSON.parse(localStorage.getItem("LCDtest_CustomSymbolsFont")||"[]");CustomSymbolsPanel.param.font=e;for(let l=0;l<e.length;l++)e[l]&&null!=e[l]&&CustomSymbolsPanel.char(0,l,String.fromCharCode(l))},selSymbol=e=>{let l=e=>{$("currentSymbolIndex").value=e;let l=CustomSymbolsPanel.getSymbolByIndex(e,!0);l&&null!=l||(l=[]),pastPanelConfig("CustomSymbol",null,l)};if("selCustomSymbolIndex"==e)return void l($("currentSymbolIndex").value);var o=$qs("ul:hover");if(!(o=o[o.length-1]))return;let n=o.style,a=parseInt((parseInt(n.left)-1)/24),t=16*parseInt((parseInt(n.top)-1)/36)+a;"cps"==e?(symbol_code=full_view_lcd.getSymbolByIndex(t),ToolTip("Symbol config view saved at inner variable. You can past it in custom symbol generator page","green")):(e="custom_sym")&&l(t)},clearCustomPanel=()=>{if(window.confirm("Clear all custom symbols?")){CustomSymbolsPanel.param.font=[],full_view_lcd.param.font=[];for(let e=0;e<8;e++)CustomSymbolsPanel.set(0,e),full_view_lcd.set(0,e)}},allOffCustomSymb=()=>{for(let e=0;e<40;e++)$("dot"+e).checked="";updateCustomSymb()},allOnCustomSymb=()=>{for(let e=0;e<40;e++)$("dot"+e).checked="checked";updateCustomSymb()},invertCustomSymb=()=>{for(let e=0;e<40;e++)$("dot"+e).checked=""==$("dot"+e).checked?"checked":"";updateCustomSymb()},updateCustomSymb=()=>{$qs("input+[class='dot-px']").forEach((e=>{e.style.backgroundColor=""}));let e=$("lcd_pixel_color").value;$qs("input:checked+[class='dot-px']").forEach((l=>{l.style.backgroundColor=e}));let l="",o="[";for(let e=0;e<40;e++)l+=$("dot"+e).checked?"1":"0",5==l.length&&(o+=bin2dec(l),e<35&&(o+=","),l="");o+="]";let n=$("currentSymbolIndex").value;CustomSymbolsPanel.font(n,JSON.parse(o)),CustomSymbolsPanel.char(0,n,String.fromCharCode(n));let a=$("code_arduino_tempalte").innerText,t=$("code_gen").checked,s="",i="";const r=/(?<={customCharArrays})(.|\n)*(?={\/customCharArrays})/g.exec(a)[0],c=/(?<={loadChar})(.|\n)*(?={\/loadChar})/g.exec(a)[0];let d=0,m=$("symbols_data_type").value;CustomSymbolsPanel.param.font.forEach((e=>{if(0==d||e&&"[0,0,0,0,0,0,0,0]"!=JSON.stringify(e)){var l=Array(8);for(let o=0;o<8;o++)l[o]="bin"==m?"0b"+dec2bin(e[o]):"hex"==m?"0x"+dec2hex(e[o]):e[o];let o=JSON.stringify(l).replace(/(\[|\]|\")/g,""),n=r.replace("{char_index}",d);s+="bin"==m?n.replace("{symbol_data}","\n\t\t\t"+o.replace(/,/g,",\n\t\t\t")+"\n"):n.replace("{symbol_data}",o+" "),t&&(i+=c.replace(/{char_index}/g,d)),d++}})),t?(a=a.replace(/\{columns\}/g,$("columns").value),a=a.replace(/\{rows\}/g,$("rows").value),a=$("lcd_bus").checked?a.replace(/{I2C_bus}(.|\n)*?{\/I2C_bus}/g,"").replace(/({parallel_bus}|{\/parallel_bus})/g,""):a.replace(/{parallel_bus}(.|\n)*?{\/parallel_bus}/g,"").replace(/({I2C_bus}|{\/I2C_bus})/g,""),a=a.replace("{chars_count}",d),a=a.replace(/({loadChar}(.|\n)*{\/loadChar})/g,i),a=a.replace(/({customCharArrays}(.|\n)*{\/customCharArrays})/g,s)):a=s,$("custom_sym_code").innerHTML=Prism.highlight(a,Prism.languages.cpp,"cpp"),localStorage.setItem("LCDtest_CustomSymbolsFont",JSON.stringify(CustomSymbolsPanel.param.font)),$sd("div_code",1),updateFullViewCustomSymbols()},bin2hex=e=>e.match(/.{4}/g).reduce(((e,l)=>e+parseInt(l,2).toString(16)),""),hex2bin=e=>e.split("").reduce(((e,l)=>e+parseInt(l,16).toString(2)),""),dec2bin=e=>{let l="00000"+Number(e).toString(2);return l.substring(l.length-6)},bin2dec=e=>parseInt(e,2),dec2hex=e=>e.toString(16),hex2dec=e=>(e.length%2&&(e="0"+e),BigInt("0x"+e).toString(10));window.addEventListener("DOMContentLoaded",(()=>{loadState(),initCustomSymbolsPanel(),initCustomSymbolMatrix(),initPanels(),initFullViews(),selSymbol("selCustomSymbolIndex"),selLCDColors(),initSwipes(),setInterval(savePanelsState,5e3),init_complite=!0}));