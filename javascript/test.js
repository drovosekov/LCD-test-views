"use strict"; // Turns on strict mode for this compilation unit
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
        for (let k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k))
                keys.push(k);
        }
        return keys;
    };
}

const full_view_pixel = 3;
const full_view_brk = 1;
const tipDuration = '5000';   // duration of the info notification in ms 

var init_complite = false;
var copiedPanelConfig = "";
var panels_config = {};
var panels_obj = {};

var ToolTip = (text, color_markup, repl_text) => {
    if (color_markup) {
        color_markup = ' alert-' + color_markup;
    } else {
        color_markup = '';
    }

    var tipBlock = document.createElement('div');
    tipBlock.className = 'alert' + color_markup;
    tipBlock.innerHTML = text.replace("%v", repl_text);

    $("ohsnap").appendChild(tipBlock);

    var ohSnapX = (element) => {
        if (element) {
            element.remove();
        }
    }

    tipBlock.onclick = () => {
        ohSnapX(tipBlock);
    };

    setTimeout(() => {
        ohSnapX(tipBlock);
    }, tipDuration);
}

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
    ["full_page", "custom_symbol", "config", "tests"].forEach(element => {
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
}

var selFullViewCP = () => {
    $h('full_view_lcd', '');
    let full_view_lcd = new CharLCD({
        at: 'full_view_lcd',
        rows: 16,
        cols: 16,
        rom: $('full_view_cp').value,
        off: $('lcd_bg_color').value,
        on: $('lcd_text_color').value,
        pixel_size: full_view_pixel,
        break_size: full_view_brk
    });
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            full_view_lcd.char(i, j, String.fromCharCode(i * 16 + j));
        }
    }
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

var createNewPanel = (config) => {
    let newLCD = new CharLCD(config);
    if (config.content) newLCD.text(0, 0, config.content);
    panels_obj[config.id] = newLCD

    $sbg($('panel_' + config.id).parentNode, config.border ? "#000" : "#fff");
}

var setPanelInfoText = (config) => {
    let info = "ROM: " + config.rom;
    info += ", rows=" + config.rows;
    info += ", cols=" + config.cols;
    info += "<br/>pixel size=" + config.pixel_size;
    info += ", break size=" + config.break_size;
    info += config.large ? ", Large LCD" : "";
    $("panel_info_" + config.id).innerHTML = info
}

var addPanel = (config) => {
    if (!config) {
        let new_id = Object.keys(panels_config).length;
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
            border: $('lcd_border').checked,
            content: ""
        }
    }

    let newPanel = document.createElement('div');
    newPanel.className = "card test_panel";
    newPanel.id = "lcd_" + config.id;
    newPanel.innerHTML = $("panel_template").innerHTML.replace("{text}", config.content).replace("{PanelName}", config.name).replace(/{id}/g, config.id);
    $("panels").appendChild(newPanel)

    panels_config[config.id] = config;
    createNewPanel(config);

    if (config.minimized)
        collapsePanel($("min_panel_" + config.id));

    setPanelInfoText(config);
    savePanelsState();

    $(newPanel.id).scrollIntoView();
}

var updatePanel = (p) => {
    let id = getPanelIndex(p);
    let val = p.value;
    panels_obj[id].text(0, 0, val);
    panels_config[id].content = val;
    // savePanelsState();
}

var copyPanelConfig = (el) => {
    if (el == "global") {
        copiedPanelConfig = {
            rows: $('rows').value,
            cols: $('columns').value,
            rom: $('full_view_cp').value,
            off: $('lcd_bg_color').value,
            on: $('lcd_text_color').value,
            pixel_size: $('px_size').value,
            break_size: $('break_size').value,
            large: $('lcd_large').checked,
            border: $('lcd_border').checked
        }
        ToolTip("Global settings saved at inner variable.<br />You can past it to test panels config", "green");
    } else {
        let id = getPanelIndex(el);
        if (!id) return;
        copiedPanelConfig = panels_config[id];
        ToolTip("Panel config saved at inner variable.<br />Past it to other panel config or gloabal settings", "green");
    }
    debug(copiedPanelConfig);
}

var pastPanelConfig = (el) => {
    if (typeof copiedPanelConfig.rom != 'string') {
        ToolTip("Error: empty config", "red");
        return;
    }

    if (el == "global") {
        $v('rows', copiedPanelConfig.rows);
        $v('columns', copiedPanelConfig.cols);
        $v('full_view_cp', copiedPanelConfig.rom);
        $v('lcd_bg_color', copiedPanelConfig.off);
        $v('lcd_text_color', copiedPanelConfig.on);
        $v('px_size', copiedPanelConfig.pixel_size);
        $v('break_size', copiedPanelConfig.break_size);
        $ch('lcd_large', copiedPanelConfig.large);
        $ch('lcd_border', copiedPanelConfig.border);
        $v('lcd_sizes', copiedPanelConfig.rows + "x" + copiedPanelConfig.cols + "x" + copiedPanelConfig.pixel_size);

        ToolTip("Global settings replaced with saved", "yellow");
    } else {
        let id = getPanelIndex(el);
        copiedPanelConfig.id = id;
        copiedPanelConfig.at = "panel_" + id;
        copiedPanelConfig.content = panels_config[id].content;
        if (!copiedPanelConfig.name) copiedPanelConfig.name = panels_config[id].name;
        panels_config[id] = copiedPanelConfig;
        $h("panel_" + id, '');
        createNewPanel(copiedPanelConfig);
        setPanelInfoText(copiedPanelConfig);

        ToolTip("Panel config replaced with saved", "yellow");
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
    if (el.innerText == "_") {
        $sd("panel_area_" + id, 0);
        panels_config[id].minimized = 1;
        el.innerText = "□";
    } else {
        $sd("panel_area_" + id, 1);
        panels_config[id].minimized = 0;
        el.innerText = "_";
    }
}

var delPanel = (el) => {
    let id = getPanelIndex(el);
    if (confirm('Realy delete panel "' + $("panel_name_" + id).innerHTML + '"?')) {
        ToolTip('"' + $("panel_name_" + id).innerHTML + '" R.I.P....', "blue");
        $("lcd_" + id).remove();
        delete panels_obj[id];
        delete panels_config[id];
        savePanelsState();
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
    { name: 'lcd_data' },
    { name: 'lcd_bus' },
];

var saveState = (selPage) => {
    if (!init_complite)
        return;

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
        if ($(element.name).type == 'checkbox') {
            $ch(element.name, localStorage.getItem('LCDtest_' + element.name));
        }
        else
            $v(element.name, localStorage.getItem('LCDtest_' + element.name) || element.defvalue);

        var onCh = $(element.name).onchange;
        $(element.name).onchange = () => { onCh(); saveState() };
    });

    $v('lcd_sizes', $('rows').value + "x" + $('columns').value + "x" + $('px_size').value);
    if (!$('lcd_sizes').value)
        $v('lcd_sizes', "---");
    selMenu(localStorage.getItem('SelPage') || 'full_page');
}

var savePanelsState = () => {
    if (init_complite)
        localStorage.setItem('LCDtest_Panels_config', JSON.stringify(panels_config));
}

var initPanels = () => {
    let cfg = JSON.parse(localStorage.getItem('LCDtest_Panels_config'));
    if (!cfg || Object.keys(cfg).length == 0) {
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
            border: 1,
            content: "Test LCD Display\nEmulator HD44780"
        });
        return;
    }

    for (let i = 0; i < Object.keys(cfg).length; i++) {
        if (cfg[i].at)
            addPanel(cfg[i]);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadState();
    initFullViews();
    initPanels();

    setInterval(savePanelsState, 5000);
    init_complite = true;
});

var addCustomSymbol = () => {

}

var clearCustomSymb = () => {

}

var invertCustomSymb = () => {

}