const mis = "missed id: ";
var debug = (v) => { window.console.log(v) }
var $$ = (id) => { return document.getElementById(id) }
var $n = (id) => { return document.getElementsByName(id)[0] }
var $ = (id) => { if ($$(id)) return $$(id); else return $n(id) }
var $sbg = (id, color) => { if (id) id.style.backgroundColor = color; else debug(mis + id) }
var $sc = (id, color) => { if ($(id)) $(id).style.color = color; else debug(mis + id) }
var $sd = (id, v, st = 'block') => { if ($(id)) $(id).style.display = v ? st : 'none'; else debug(mis + id) }
var $tt = (id) => { if ($(id)) return $(id).innerText; else debug(mis + id) }
var $h = (id, v) => { if ($(id)) $(id).innerHTML = v; else debug(mis + id) }
var $v = (id, v) => { if ($(id)) $(id).value = v; else debug(mis + id) }
var $ch = (id, v) => { if ($(id)) $(id).checked = (v && (v.toString() == 'true' || v == 1)) ? 'checked' : ''; else debug(mis + id) }
var $qs = (s) => { return document.querySelectorAll(s) }
var $parent = (el, lvl) => { return (lvl && el) ? $parent(el.parentNode, --lvl) : el; }
if (!Object.keys) {
    Object.keys = (obj) => {
        var keys = [], k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k))
                keys.push(k);
        }
        return keys;
    };
}

const panel_markup =
    `<div>
	<span class="r">
		<h3 onclick="editPanelName(this)" id="panel_name_{id}">{PanelName}</h3>
	</span>
	<span class="l">
		<input type='button' value='▼' onclick='pastPanelConfig(this)'
		title="Past panel config" />
		<input type='button' value='▲' onclick='copyPanelConfig(this)'
		title="Copy panel config" />
		<input type='button' value='_' onclick='collapsePanel(this)'
		title="Collapse panel" />
		<input type='button' value='X' onclick='delPanel(this)'
		title="Delete panel" />
	</span>
</div>
<div class="block" id="panel_area_{id}"> 
	<div>
		<textarea rows="2" cols="16" class="panel_row" onkeyup="updatePanel(this)">{text}</textarea>
	</div> 
	<span class="r"></span>
	<span class="lcd_border">
		<div id="panel_{id}"></div>
	</span>
	<span class="l"></span>
</div>`;

const full_view_pixel = 3;
const full_view_brk = 1;

var copyedPanelConfig = "";
var panels_config = {};
var panels_obj = {};

/*class tPanel {
    constructor(obj) {
        this.pastPanelConfig = (el) => { pastPanelConfig(el) };
        this.copyPanelConfig = (el) => { copyPanelConfig(el) };
        this.collapsePanel = (el) => { collapsePanel(el) };
        this.delPanel = (el) => { delPanel(el) };
    }
}*/

var getPanelIndex = (el) => {
    if (el) {
        if (el.className == "card test_panel")
            return el.id.replace("lcd_", "");
        else
            return getPanelIndex(el.parentNode);
    }
    return null;
}

var selMenu = (id) => {
    ["full_page", "global_settings", "tests"].forEach(element => {
        $sd(element, 0);
        $ch("m_" + element, 0);
    });
    $ch("m_" + id, 1);
    $sd(id, 1);
    saveState(id);
}

var selStndLCDSize = (val) => {
    var v = val.split('x');
    $('rows').value = v[0];
    $('columns').value = v[1];
    $('px_size').value = v[2];
    saveState();
}

var selFullViewCP = () => {
    $h('full_view_lcd', '');
    var full_view_lcd = new CharLCD({
        at: 'full_view_lcd',
        rows: 16,
        cols: 16,
        rom: $('full_view_cp').value,
        off: $('lcd_bg_color').value,
        on: $('lcd_text_color').value,
        pixel_size: full_view_pixel,
        break_size: full_view_brk
    });
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 16; j++) {
            full_view_lcd.char(i, j, String.fromCharCode(i * 16 + j));
        }
    }
    saveState();
}

var initFullViews = () => {
    var lcd0 = new CharLCD({
        at: 'lcd0', rows: 1, cols: 1, off: '#fff', on: '#f00',
        pixel_size: full_view_pixel, break_size: full_view_brk
    });//1 custom symbol panel
    lcd0.font(0, [0, 10, 21, 17, 10, 4]);   //save heart symbol at 0 index
    lcd0.char(0, 0, String.fromCharCode(0));//draw custom symbol saved at 0 index

    var lcd1 = new CharLCD({
        at: 'lcd1', rows: 1, cols: 16, off: '#fff', on: '#000',
        pixel_size: full_view_pixel, break_size: full_view_brk
    });//left horizontal index 
    lcd1.text(0, 0, "0123456789ABCDEF");

    var lcdv = new CharLCD({
        at: 'lcdv', rows: 16, cols: 1, off: '#fff', on: '#000',
        pixel_size: full_view_pixel, break_size: full_view_brk
    });//vertical index 
    lcdv.text(0, 0, "0\n1\n2\n3\n4\n5\n6\n7\n8\n9\nA\nB\nC\nD\nE\nF");

    selFullViewCP();
}

var addPanel = (config) => {
    if (!config) {
        let new_id = Object.keys(panels_obj).length;
        config = {
            id: new_id,
            at: "panel_" + new_id,
            name: "Panel " + (parseInt(new_id) + 1),
            minimized: 0,
            rows: $('rows').value,
            cols: $('columns').value,
            rom: $('full_view_cp').value,
            off: $('lcd_bg_color').value,
            on: $('lcd_text_color').value,
            pixel_size: $('px_size').value,
            break_size: $('break_size').value,
            large: $('lcd_large').checked,
            content: ""
        }
        debug(config);
    }
    let newPanel = document.createElement('div');
    newPanel.className = "card test_panel";
    newPanel.id = "lcd_" + config.id;
    newPanel.innerHTML = panel_markup.replace("{text}", config.content).replace("{PanelName}", config.name).replace(/{id}/g, config.id);
    $("panels").appendChild(newPanel)

    $sbg($('panel_' + config.id).parentNode, $('lcd_border').checked ? "#000" : "#fff");

    var namePanel = $("panel_name_" + config.id).innerHTML;

    panels_config[config.id] = {
        name: namePanel,
        panel_config: config
    }
    // alert(JSON.stringify(p))
    let newLCD = new CharLCD(config);
    if (config.content) newLCD.text(0, 0, config.content);
    panels_obj[config.id] = newLCD

    if (config.minimized) $sd("panel_area_" + id, 0);
}

var updatePanel = (p) => {
    let id = getPanelIndex(p);
    let val = p.value;
    panels_obj[id].text(0, 0, val + "  ");
    panels_config[id].panel_config.content = val;
}

var initPanels = () => {
    let panels_config = localStorage.getItem('LCDtest_Panels_config');
    // debug(panels_config);
}

var copyPanelConfig = (el) => {
    if (el == "global") {
        let config = {
            rows: $('rows').value,
            cols: $('columns').value,
            rom: $('full_view_cp').value,
            off: $('lcd_bg_color').value,
            on: $('lcd_text_color').value,
            pixel_size: $('px_size').value,
            break_size: $('break_size').value,
            large: $('lcd_large').checked
        }
        copyedPanelConfig = config;
        alert("Global settings saved at inner variable. Past it to other panel config.");
    } else {
        let id = getPanelIndex(el);
        if (!id) return;
        copyedPanelConfig = panels_config[id].panel_config;
        alert("Panel config saved at inner variable. Past it to other panel config or gloabal settings.");
    }
}

var editPanelName = (el) => {
    let id = getPanelIndex(el);
    el.parentNode.innerHTML = "<input type='text' onfocusout='renamePanel(this)' id='panel_name_" + id + "' value='" + el.innerHTML + "'/>";
    let t = $("panel_name_" + id);
    t.focus();
    t.selectionStart = t.value.length;
}

var renamePanel = (el) => {
    let id = getPanelIndex(el);
    let val = el.value;
    el.parentNode.innerHTML = '<h3 id="panel_name_' + id + '" onclick="editPanelName(this, ' + id + ')">' + val + '</h3>';
    panels_config[id].name = val;
}

var collapsePanel = (el) => {
    let id = getPanelIndex(el);
    if (el.value == "_") {
        $sd("panel_area_" + id, 0);
        panels_config[id].minimized = 1;
        el.value = "□";
    } else {
        $sd("panel_area_" + id, 1);
        panels_config[id].minimized = 0;
        el.value = "_";
    }
}

var delPanel = (el) => {
    let id = getPanelIndex(el);
    if (confirm('Realy delete panel "' + $("panel_name_" + id).innerHTML + '"?')) {
        $("lcd_" + id).remove();
        delete panels_obj[id];
        delete panels_config[id];
    }
}

var elSavedState = [
    { name: 'full_view_cp', defvalue: 'eu' },
    { name: 'rows', defvalue: 2 },
    { name: 'columns', defvalue: 16 },
    { name: 'px_size', defvalue: 3 },
    { name: 'break_size', defvalue: 1 },
    { name: 'lcd_bg_color', defvalue: '#cd2' },
    { name: 'lcd_text_color', defvalue: '#143' },
    { name: 'lcd_border' },
    { name: 'lcd_large' },
];

var saveState = (selPage) => {
    elSavedState.forEach(element => {
        if ($(element.name).type == 'checkbox')
            localStorage.setItem('LCDtest_' + element.name, $(element.name).checked);
        else
            localStorage.setItem('LCDtest_' + element.name, $(element.name).value);
    });
    if (selPage)
        localStorage.setItem('SelPage', selPage);
}

var loadState = () => {
    elSavedState.forEach(element => {
        if ($(element.name).type == 'checkbox')
            $ch(element.name, localStorage.getItem('LCDtest_' + element.name))
        else
            $v(element.name, localStorage.getItem('LCDtest_' + element.name) || element.defvalue)
    });
    $('lcd_sizes').value = $('rows').value + "x" + $('columns').value + "x" + $('px_size').value;
    selMenu(localStorage.getItem('SelPage') || 'full_page');
}

var savePanelsState = () => {
    // debug(JSON.stringify(panels_test));
    localStorage.setItem('LCDtest_Panels_config', JSON.stringify(panels_config));
}

var loadPanelsState = () => {

}

window.addEventListener('DOMContentLoaded', () => {
    loadState();
    initFullViews();
    initPanels();
    // selMenu("tests");//TODO: for debug
    addPanel({
        id: 0,
        at: "panel_0",
        name: "Panel 1",
        minimized: 0,
        rows: 2,
        cols: 16,
        rom: "eu",
        off: "#D5D9E0",
        on: "#143",
        pixel_size: 3,
        break_size: 1,
        large: 0,
        content: "Test LCD Display\nEmulator HD44780"
    });

    setInterval(savePanelsState, 5000);
});