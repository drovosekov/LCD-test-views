var debug = (v) => { console.log(v) }
var $$ = (id) => { return document.getElementById(id) }
var $n = (id) => { return document.getElementsByName(id)[0] }
var $ = (id) => { if ($$(id)) return $$(id); else return $n(id) }
var $sc = (id, color) => { if ($(id)) $(id).style.color = color; else debug(mis + id) }
var $sd = (id, v, st = 'block') => { if ($(id)) $(id).style.display = v ? st : 'none'; else debug(mis + id) }
var $tt = (id) => { if ($(id)) return $(id).innerText; else debug(mis + id) }
var $h = (id, v) => { if ($(id)) $(id).innerHTML = v; else debug(mis + id) }
var $v = (id, v) => { if ($(id)) $(id).value = v; else debug(mis + id) }
var $ch = (id, v) => { if ($(id)) $(id).checked = v ? 'checked' : ''; else debug(mis + id) }
var $qs = (s) => { return document.querySelectorAll(s) }

const full_view_pixel=3;
const full_view_brk=1;
var full_view_lcd;
var panels_test = {};
class tPanel {

}

var selMenu = (id) => {
    ["full_page", "global_settings", "tests"].forEach(element => {
        $sd(element, 0);
        $ch("m_" + element, 0);
    });
    $ch("m_" + id, 1);
    $sd(id, 1);
    saveState();
}

var selFullViewCP = () => {
    $h('full_view_lcd', '');
    full_view_lcd = new CharLCD({
        at: 'full_view_lcd',
        rows: 16,
        cols: 16,
        rom: $('full_view_cp').value,
        off: $('lcd_bg_color').value,
        on: $('lcd_text_color').value,
        pix: full_view_pixel,
        brk: full_view_brk
        // pix: $('px_size').value,
        // brk: $('break_size').value
    });
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 16; j++) {
            full_view_lcd.char(i, j, String.fromCharCode(i * 16 + j));
        }
    }
    saveState();
}

var initFullViews = () => {
    var lcd0 = new CharLCD({ at: 'lcd0', rows: 1, cols: 1, off: '#fff', on: '#f00', pix: full_view_pixel, brk: full_view_brk });//1 custom symbol panel
    var lcd1 = new CharLCD({ at: 'lcd1', rows: 1, cols: 16, off: '#fff', on: '#000', pix: full_view_pixel, brk: full_view_brk });//left horizontal index 
    var lcdv = new CharLCD({ at: 'lcdv', rows: 16, cols: 1, off: '#fff', on: '#000', pix: full_view_pixel, brk: full_view_brk });//vertical index 
    full_view_lcd = new CharLCD({
        at: 'full_view_lcd', rows: 16, cols: 16,
        rom: $('full_view_cp').value,
        off: $('lcd_bg_color').value,
        on: $('lcd_text_color').value,
        pix: full_view_pixel, brk: full_view_brk
    });

    lcd0.font(0, [0, 10, 21, 17, 10, 4]);//save heart symbol at 0 index
    lcd0.char(0, 0, String.fromCharCode(0));//draw custom symbol saved at 0 index

    for (var i = 0; i < 16; i++) {
        lcd1.char(0, i, "0123456789ABCDEF"[i]);
        lcdv.char(i, 0, "0123456789ABCDEF"[i]);
        for (var j = 0; j < 16; j++) {
            full_view_lcd.char(i, j, String.fromCharCode(i * 16 + j));
        }
    }
}

var addPanel = (id, config) => {
    var panel = new CharLCD({
        at: 'panel_' + id.toString(),
        rows: $('rows').value,
        cols: $('columns').value,
        rom: $('full_view_cp').value,
        off: $('lcd_bg_color').value,
        on: $('lcd_text_color').value,
        pix: $('px_size').value,
        brk: $('break_size').value
    });
    var namePanel = $("panel_name_" + id).innerHTML;
    if (!namePanel) namePanel = $n("panel_name_" + id).value;
    var p = {
        index: id,
        name: namePanel,
        content: [],
        lcd_panel: panel
    }
    //alert(JSON.)
    panels_test[id] = p;
}

var updatePanel = (p) => {
    let val = p.value + " ";
    panels_test[0].lcd_panel.text(0, 0, val);
    panels_test[0].content = val; 
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
}

var elValues = [
    { name: 'full_view_cp', defvalue: 'eu' },
    { name: 'rows', defvalue: 2 },
    { name: 'columns', defvalue: 16 },
    { name: 'px_size', defvalue: 3 },
    { name: 'break_size', defvalue: 1 },
    { name: 'lcd_bg_color', defvalue: '#cd2' },
    { name: 'lcd_text_color', defvalue: '#143' },
];

var saveState = () => {
    elValues.forEach(element => {
        localStorage.setItem('LCDtest_' + element.name, $(element.name).value);
    });
}

var loadState = () => {
    elValues.forEach(element => {
        $v(element.name, localStorage.getItem('LCDtest_' + element.name) || element.defvalue)
    });
}

window.addEventListener('DOMContentLoaded', () => {
    loadState();
    initFullViews();
    selMenu("tests");//TODO: for debug
    addPanel(0);
});