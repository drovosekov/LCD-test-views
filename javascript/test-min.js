"use strict";const mis="missed id: ";var debug=e=>{window.console.log(e)},$$=e=>document.getElementById(e),$n=e=>document.getElementsByName(e)[0],$=e=>$$(e)?$$(e):$n(e),$sbg=(e,l)=>{e?e.style.backgroundColor=l:debug(mis+e)},$sc=(e,l)=>{$(e)?$(e).style.color=l:debug(mis+e)},$sd=(e,l,a="block")=>{$(e)?$(e).style.display=l?a:"none":debug(mis+e)},$tt=e=>{if($(e))return $(e).innerText;debug(mis+e)},$h=(e,l)=>{$(e)?$(e).innerHTML=l:debug(mis+e)},$v=(e,l)=>{$(e)?$(e).value=l:debug(mis+e)},$ch=(e,l)=>{$(e)?$(e).checked=!l||"true"!=l.toString()&&1!=l?"":"checked":debug(mis+e)},$qs=e=>document.querySelectorAll(e),$parent=(e,l)=>l&&e?$parent(e.parentNode,--l):e;Object.keys||(Object.keys=e=>{var l=[];for(let a in e)Object.prototype.hasOwnProperty.call(e,a)&&l.push(a);return l});const full_view_pixel=3,full_view_brk=1,tipDuration="5000";var init_complite=!1,copiedPanelConfig="",panels_config={},panels_obj={},ToolTip=(e,l,a)=>{l&&(l=" alert-"+l);var n=document.createElement("div");n.className="alert"+l,n.innerHTML=e.replace("%v",a),$("ohsnap").appendChild(n);var o=e=>{e&&e.remove()};n.onclick=()=>{o(n)},setTimeout((()=>{o(n)}),"5000")},getPanelIndex=e=>e?"card test_panel"==e.className?e.id.replace("lcd_",""):getPanelIndex(e.parentNode):null,selMenu=e=>{["about","cps","custom_symbol","config","tests"].forEach((e=>{$sd(e,0),$ch("m_"+e,0)})),$ch("m_"+e,1),$sd(e,1),saveState(e)},selStndLCDSize=e=>{var l=e.split("x");$("rows").value=l[0],$("columns").value=l[1],$("px_size").value=l[2]},selFullViewCP=()=>{$h("full_view_lcd","");let e=new CharLCD({at:"full_view_lcd",rows:16,cols:16,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_text_color").value,pixel_size:3,break_size:1});for(let l=0;l<16;l++)for(let a=0;a<16;a++)e.char(l,a,String.fromCharCode(16*l+a));$("custom_symb_matrix").style.backgroundColor=$("lcd_bg_color").value},initFullViews=()=>{var e=new CharLCD({at:"lcd0",rows:1,cols:1,off:"#fff",on:"#f00",pixel_size:3,break_size:1});e.font(0,[0,10,21,17,10,4]),e.char(0,0,String.fromCharCode(0)),new CharLCD({at:"lcd1",rows:1,cols:16,off:"#fff",on:"#000",pixel_size:3,break_size:1}).text(0,0,"0123456789ABCDEF"),new CharLCD({at:"lcdv",rows:16,cols:1,off:"#fff",on:"#000",pixel_size:3,break_size:1}).text(0,0,"0\n1\n2\n3\n4\n5\n6\n7\n8\n9\nA\nB\nC\nD\nE\nF"),selFullViewCP()},createNewPanel=e=>{let l=new CharLCD(e);e.content&&l.text(0,0,e.content),panels_obj[e.id]=l,$sbg($("panel_"+e.id).parentNode,e.border?"#000":"#fff")},setPanelInfoText=e=>{let l="ROM: "+e.rom;l+=", rows="+e.rows,l+=", cols="+e.cols,l+="<br/>pixel size="+e.pixel_size,l+=", break size="+e.break_size,l+=e.large?", Large LCD":"",$("panel_info_"+e.id).innerHTML=l},addPanel=e=>{if(!e){let l=Object.keys(panels_config).length;e={id:l,at:"panel_"+l,name:"Panel "+(parseInt(l)+1),minimized:0,rows:$("rows").value,cols:$("columns").value,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_text_color").value,pixel_size:$("px_size").value,break_size:$("break_size").value,large:$("lcd_large").checked,border:$("lcd_border").checked,content:""}}let l=document.createElement("div");l.className="card test_panel",l.id="lcd_"+e.id,l.innerHTML=$("panel_template").innerHTML.replace("{text}",e.content).replace("{PanelName}",e.name).replace(/{id}/g,e.id),$("panels").appendChild(l),panels_config[e.id]=e,createNewPanel(e),e.minimized&&collapsePanel($("min_panel_"+e.id)),setPanelInfoText(e),savePanelsState(),$(l.id).scrollIntoView()},updatePanel=e=>{let l=getPanelIndex(e),a=e.value;panels_obj[l].text(0,0,a),panels_config[l].content=a},copyPanelConfig=e=>{if("global"==e)copiedPanelConfig={rows:$("rows").value,cols:$("columns").value,rom:$("full_view_cp").value,off:$("lcd_bg_color").value,on:$("lcd_text_color").value,pixel_size:$("px_size").value,break_size:$("break_size").value,large:$("lcd_large").checked,border:$("lcd_border").checked},ToolTip("Global settings saved at inner variable.<br />You can past it to test panels config","green");else{let l=getPanelIndex(e);if(!l)return;copiedPanelConfig=panels_config[l],ToolTip("Panel config saved at inner variable.<br />Past it to other panel config or gloabal settings","green")}debug(copiedPanelConfig)},pastPanelConfig=e=>{if("string"==typeof copiedPanelConfig.rom)if("global"==e)$v("rows",copiedPanelConfig.rows),$v("columns",copiedPanelConfig.cols),$v("full_view_cp",copiedPanelConfig.rom),$v("lcd_bg_color",copiedPanelConfig.off),$v("lcd_text_color",copiedPanelConfig.on),$v("px_size",copiedPanelConfig.pixel_size),$v("break_size",copiedPanelConfig.break_size),$ch("lcd_large",copiedPanelConfig.large),$ch("lcd_border",copiedPanelConfig.border),$v("lcd_sizes",copiedPanelConfig.rows+"x"+copiedPanelConfig.cols+"x"+copiedPanelConfig.pixel_size),ToolTip("Global settings replaced with saved","yellow");else{let l=getPanelIndex(e);copiedPanelConfig.id=l,copiedPanelConfig.at="panel_"+l,copiedPanelConfig.content=panels_config[l].content,copiedPanelConfig.name||(copiedPanelConfig.name=panels_config[l].name),panels_config[l]=copiedPanelConfig,$h("panel_"+l,""),createNewPanel(copiedPanelConfig),setPanelInfoText(copiedPanelConfig),ToolTip("Panel config replaced with saved","yellow")}else ToolTip("Error: empty config","red")},editPanelName=e=>{let l=getPanelIndex(e);e.parentNode.innerHTML="<input type='text' onfocusout='renamePanel(this)' id='panel_name_"+l+"' value='"+e.innerHTML+"'/>";let a=$("panel_name_"+l);a.focus(),a.selectionStart=a.value.length},renamePanel=e=>{let l=getPanelIndex(e),a=e.value;e.parentNode.innerHTML='<h3 id="panel_name_'+l+'" onclick="editPanelName(this, '+l+')">'+a+"</h3>",panels_config[l].name=a},collapsePanel=e=>{let l=getPanelIndex(e);"_"==e.innerText?($sd("panel_area_"+l,0),panels_config[l].minimized=1,e.innerText="□"):($sd("panel_area_"+l,1),panels_config[l].minimized=0,e.innerText="_")},delPanel=e=>{let l=getPanelIndex(e);confirm('Realy delete panel "'+$("panel_name_"+l).innerHTML+'"?')&&(ToolTip('"'+$("panel_name_"+l).innerHTML+'" R.I.P....',"blue"),$("lcd_"+l).remove(),delete panels_obj[l],delete panels_config[l],savePanelsState())},elSavedState=[{name:"full_view_cp",defvalue:"eu"},{name:"rows",defvalue:2},{name:"columns",defvalue:16},{name:"px_size",defvalue:3},{name:"break_size",defvalue:1},{name:"lcd_bg_color",defvalue:"#cd2"},{name:"lcd_text_color",defvalue:"#143"},{name:"lcd_border"},{name:"lcd_large"},{name:"lcd_data"},{name:"lcd_bus"}],saveState=e=>{init_complite&&(elSavedState.forEach((e=>{"checkbox"==$(e.name).type?localStorage.setItem("LCDtest_"+e.name,$(e.name).checked):localStorage.setItem("LCDtest_"+e.name,$(e.name).value)})),e&&localStorage.setItem("SelPage",e))},loadState=()=>{elSavedState.forEach((e=>{"checkbox"==$(e.name).type?$ch(e.name,localStorage.getItem("LCDtest_"+e.name)):$v(e.name,localStorage.getItem("LCDtest_"+e.name)||e.defvalue);var l=$(e.name).onchange;$(e.name).onchange=()=>{"function"==typeof l&&l(),saveState()}})),$v("lcd_sizes",$("rows").value+"x"+$("columns").value+"x"+$("px_size").value),$("lcd_sizes").value||$v("lcd_sizes","---"),selMenu(localStorage.getItem("SelPage")||"full_page")},savePanelsState=()=>{init_complite&&localStorage.setItem("LCDtest_Panels_config",JSON.stringify(panels_config))},initPanels=()=>{let e=JSON.parse(localStorage.getItem("LCDtest_Panels_config"));if(e&&0!=Object.keys(e).length)for(let l=0;l<Object.keys(e).length;l++)e[l].at&&addPanel(e[l]);else addPanel({id:0,at:"panel_0",name:"Panel 1",minimized:0,rows:2,cols:16,rom:"eu",off:"#D5D9E0",on:"#143",pixel_size:3,break_size:1,large:0,border:1,content:"Test LCD Display\nEmulator HD44780"})},initCustomSymbolMatrix=()=>{var e=$("custom_symb_matrix");e.style.backgroundColor=$("lcd_bg_color").value,e.style.display="block";for(let l=0;l<8;l++){let a=document.createElement("div");a.className="row";for(let e=0;e<5;e++){let n="dot"+(e+5*l),o=document.createElement("label");o.className="dot-px",o.setAttribute("for",n);let t=document.createElement("input");t.type="checkbox",t.id=n,t.onchange=()=>{updateCustomSymb()},a.appendChild(t),a.appendChild(o)}e.appendChild(a)}};window.addEventListener("DOMContentLoaded",(()=>{loadState(),initFullViews(),initPanels(),initCustomSymbolMatrix(),setInterval(savePanelsState,5e3),init_complite=!0}));var addCustomSymbol=()=>{},clearCustomSymb=()=>{for(let e=0;e<40;e++)$("dot"+e).checked="";updateCustomSymb()},allOnCustomSymb=()=>{for(let e=0;e<40;e++)$("dot"+e).checked="checked";updateCustomSymb()},invertCustomSymb=()=>{for(let e=0;e<40;e++)$("dot"+e).checked=""==$("dot"+e).checked?"checked":"";updateCustomSymb()},updateCustomSymb=()=>{let e=$("code_tempalte").innerText;e=e.replace(/\{columns\}/g,$("columns").value),e=e.replace(/\{rows\}/g,$("rows").value),e=$("lcd_bus").checked?e.replace(/{I2C_bus}(.|\n)*?{\/I2C_bus}/g,"").replace(/({parallel_bus}\n|{\/parallel_bus}\n\n)/g,""):e.replace(/{parallel_bus}(.|\n)*?{\/parallel_bus}/g,"").replace(/(\n{I2C_bus}\n|{\/I2C_bus}\n)/g,"");let l=0,a="";for(let n=0;n<=40;n++){if(n>0&&n%5==0){if(l++,a=$("lcd_data").checked?"0x"+binaryToHex(a):"B"+a,e=e.replace("{row"+l+"}",a),40==n)break;a=""}a+=$("dot"+n).checked?"1":"0"}e=e.replace(/({customCharArrays}|{\/customCharArrays})/g,""),$("custom_sym_code").innerHTML=Prism.highlight(e,Prism.languages.cpp,"cpp"),$sd("div_code",1)},binaryToHex=e=>{var l,a,n,o,t="";for(l=e.length-1;l>=3;l-=4){for(n=e.substr(l+1-4,4),o=0,a=0;a<4;a+=1){if("0"!==n[a]&&"1"!==n[a])return{valid:!1};o=2*o+parseInt(n[a],10)}t=o>=10?String.fromCharCode(o-10+"A".charCodeAt(0))+t:String(o)+t}if(l>=0){for(o=0,a=0;a<=l;a+=1){if("0"!==e[a]&&"1"!==e[a])return{valid:!1};o=2*o+parseInt(e[a],10)}t=String(o)+t}return t};