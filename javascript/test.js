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

const panel_markup =
    `<div id="settings_panel_{id}" class="block">
<div id="div_rows_text">
    <textarea id="row_txt" rows="2" cols="16" class="panel_row" onkeyup="updatePanel(this, {id})">{text}</textarea>
</div>
</div>
<span class="r"></span>
<span class="lcd_border">
<div id="panel_{id}"></div>
</span>
<span class="l"></span>`;
const full_view_pixel = 3;
const full_view_brk = 1;
var panels_config = {};
var panels_obj = {};
class tPanel {
    constructor(obj) {
        this.pastPanelConfig = (el) => { pastPanelConfig(el) };
        this.copyPanelConfig = (el) => { copyPanelConfig(el) };
        this.collapsePanel = (el) => { collapsePanel(el) };
        this.delPanel = (el) => { delPanel(el) };
    }
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

var addPanel = (id, config) => {
    $sbg($('panel_' + id.toString()).parentNode, $('lcd_border').checked ? "#000" : "#fff");
    if (!config)
        config = {
            at: 'panel_' + id.toString(),
            rows: $('rows').value,
            cols: $('columns').value,
            rom: $('full_view_cp').value,
            off: $('lcd_bg_color').value,
            on: $('lcd_text_color').value,
            pixel_size: $('px_size').value,
            break_size: $('break_size').value,
            large: $('lcd_large').checked
        }

    var namePanel = $("panel_name_" + id).innerHTML;
    if (!namePanel) namePanel = $n("panel_name_" + id).value;

    var p = {
        name: namePanel,
        panel_config: config,
        content: ""
    }
    // alert(JSON.stringify(p))
    panels_config[id] = p;
    panels_obj[id] = new CharLCD(config);
}

var updatePanel = (p, id) => {
    let val = p.value + " ";
    panels_obj[id].text(0, 0, val);
    panels_config[id].content = val;
}

var initPanels = () => {

}

var editPanelName = (el) => {
    let id = el.id;
    el.parentElement.innerHTML = "<input type='text' onfocusout='renamePanel(this)' value='" + el.innerHTML + "' name='" + id + "'/>";
    $n(id).focus();
}

var renamePanel = (el) => {
    let id = el.name;
    let val = el.value;
    el = el.parentElement;
    el.innerHTML = '<h3 id="' + id + '" onclick="editPanelName(this)">' + val + '</h3>';
    panels_config[id.replace("panel_name_", "")].name = val;
}

var elValues = [
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
    elValues.forEach(element => {
        if ($(element.name).type == 'checkbox')
            localStorage.setItem('LCDtest_' + element.name, $(element.name).checked);
        else
            localStorage.setItem('LCDtest_' + element.name, $(element.name).value);
    });
    if (selPage)
        localStorage.setItem('SelPage', selPage);
}

var loadState = () => {
    elValues.forEach(element => {
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
    // selMenu("tests");//TODO: for debug
    addPanel(0);

    setInterval(savePanelsState, 5000);
});