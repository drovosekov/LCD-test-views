"use strict"; // Turns on strict mode for this compilation unit
const mis = "missed id: ";
var debug = (v) => { if (typeof (v) == "object") v = JSON.stringify(v); window.console.log(v) }
var $$ = (id) => { return document.getElementById(id) }
var $n = (id) => { return document.getElementsByName(id)[0] }
var $ = (id) => { if ($$(id)) return $$(id); else return $n(id) }
var $sbg = (id, color) => { if (id) id.style.backgroundColor = color; else debug(mis + id) }
var $sc = (id, color) => { if ($(id)) $(id).style.color = color; else debug(mis + id) }
var $sd = (id, v, st = 'block') => { if ($(id)) { $(id).classList.remove("hidden"); $(id).style.display = v ? st : 'none' } else debug(mis + id) }
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

var full_view_lcd;
var CustomSymbolsPanel;
var symbol_code;
var init_complite = false;
var copiedPanelConfig = "";
var panels_config = {};
var panels_obj = {};
var menuItems = ["about", "cps", "custom_symbol", "config", "tests"];
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
    { name: 'symbols_data_type' },
    { name: 'lcd_bus' },
    { name: 'code_gen' },
    { name: 'show_hover_grid' }
];

var ToolTipText;
var ToolTip = (text, color_markup, repl_text) => {
    if (color_markup)
        color_markup = ' alert-' + color_markup;

    text = text.replace("%v", repl_text);
    if (ToolTipText == text) return;
    var tipBlock = document.createElement('div');
    tipBlock.className = 'alert' + color_markup;
    tipBlock.innerHTML = text;
    ToolTipText = text;

    $("ohsnap").appendChild(tipBlock);

    var ohSnapX = (element) => {
        if (element)
            element.remove();
        ToolTipText = "";
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
    menuItems.forEach(element => {
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
    full_view_lcd = new CharLCD({
        at: 'full_view_lcd',
        rows: 16,
        cols: 16,
        rom: $('full_view_cp').value,
        off: $('lcd_bg_color').value,
        on: $('lcd_text_color').value,
        pixel_size: full_view_pixel,
        break_size: full_view_brk,
        sym_border: $('show_hover_grid').checked ? 1 : 0
    });
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            full_view_lcd.char(i, j, String.fromCharCode(i * 16 + j));
        }
    }
    $('custom_symb_matrix').style.backgroundColor = $('lcd_bg_color').value;
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
            sym_border: $('show_hover_grid').checked ? 1 : 0,
            large: $('lcd_large').checked,
            border: $('lcd_border').checked,
            content: ""
        }
    }

    let newPanel = document.createElement('div');
    newPanel.className = "card test_panel";
    newPanel.id = "lcd_" + config.id;
    newPanel.innerHTML = $("panel_template").innerHTML.replace("{text}", config.content).replace("{PanelName}", config.name).replace(/{id}/g, config.id);
    $("panels").appendChild(newPanel);

    panels_config[config.id] = config;
    createNewPanel(config);

    if (config.minimized)
        collapsePanel($("min_panel_" + config.id));
    setPanelInfoText(config);
    savePanelsState();

    $(newPanel.id).scrollIntoView();
    $("text_" + config.id).focus();
}

var updatePanel = (p) => {
    let id = getPanelIndex(p);
    let val = p.value;
    panels_obj[id].text(0, 0, val);
    panels_config[id].content = val;
    // savePanelsState();
}

var copyPanelConfig = (type, el) => {
    if (type == "global") {
        copiedPanelConfig = {
            rows: $('rows').value,
            cols: $('columns').value,
            rom: $('full_view_cp').value,
            off: $('lcd_bg_color').value,
            on: $('lcd_text_color').value,
            pixel_size: $('px_size').value,
            break_size: $('break_size').value,
            large: $('lcd_large').checked,
            border: $('lcd_border').checked,
            sym_border: $('show_hover_grid').checked ? 1 : 0
        }
        ToolTip("Global settings saved at inner variable.<br />You can past it to test panels config", "green");
    } else if (type == "CustomSymbol") {
        symbol_code = CustomSymbolsPanel.getSymbolByIndex($('currentSymbolIndex').value);
        ToolTip("Custom symbol saved at innet variable", "green");
    } else if (type == "config") {
        let id = getPanelIndex(el);
        if (!id) return;
        copiedPanelConfig = panels_config[id];
        ToolTip("Panel config saved at inner variable.<br />Past it to other panel config or gloabal settings", "green");
    }
}

var pastPanelConfig = (type, el, data) => {
    if (type == "global") {
        if (typeof copiedPanelConfig.rom != 'string') {
            ToolTip("Error: empty config", "red");
            return;
        }
        $v('rows', copiedPanelConfig.rows);
        $v('columns', copiedPanelConfig.cols);
        $v('full_view_cp', copiedPanelConfig.rom);
        $v('lcd_bg_color', copiedPanelConfig.off);
        $v('lcd_text_color', copiedPanelConfig.on);
        $v('px_size', copiedPanelConfig.pixel_size);
        $v('break_size', copiedPanelConfig.break_size);
        $ch('lcd_large', copiedPanelConfig.large);
        $ch('lcd_border', copiedPanelConfig.border);
        $ch('show_hover_grid', copiedPanelConfig.show_hover_grid);
        $v('lcd_sizes', copiedPanelConfig.rows + "x" + copiedPanelConfig.cols + "x" + copiedPanelConfig.pixel_size);

        ToolTip("Global settings replaced with saved", "yellow");
    } else if (type == "CustomSymbol") {
        if (!data && !symbol_code && init_complite) {
            ToolTip("Error: empty symbol code", "red");
            return;
        }
        if (!data) data = symbol_code;
        if (!data) return;
        let rowIdx = 0;
        let code;
        let b = 0;
        for (let d = 0; d < 40; d++) {
            if (d % 5 == 0) {
                code = "00000" + dec2bin(data[rowIdx]);
                code = code.substring(code.length - 5, code.length);
                rowIdx++;
                b = 0;
            }
            $('dot' + d).checked = code.substring(b, b + 1) == "1";
            b++;
        }
        updateCustomSymb();
    } else if (type == "panel") {
        if (typeof copiedPanelConfig.rom != 'string') {
            ToolTip("Error: empty config", "red");
            return;
        }
        let id = getPanelIndex(el);
        copiedPanelConfig.id = id;
        copiedPanelConfig.at = "panel_" + id;
        copiedPanelConfig.content = panels_config[id].content;
        if (!copiedPanelConfig.name) copiedPanelConfig.name = panels_config[id].name;
        panels_config[id] = copiedPanelConfig;
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
        localStorage.setItem('LCDtest_SelPage', selPage);
}

var loadState = () => {
    selMenu(localStorage.getItem('LCDtest_SelPage') || 'about');
    elSavedState.forEach(element => {
        if ($(element.name).type == 'checkbox') {
            $ch(element.name, localStorage.getItem('LCDtest_' + element.name));
        }
        else
            $v(element.name, localStorage.getItem('LCDtest_' + element.name) || element.defvalue);

        var onCh = $(element.name).onchange;
        $(element.name).onchange = () => { if (typeof (onCh) == "function") onCh(); saveState() };
    });

    $v('lcd_sizes', $('rows').value + "x" + $('columns').value + "x" + $('px_size').value);
    if (!$('lcd_sizes').value)
        $v('lcd_sizes', "---");
}

var savePanelsState = () => {
    if (init_complite) {
        localStorage.setItem('LCDtest_Panels_config', JSON.stringify(panels_config));
    }
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
            sym_border: $('show_hover_grid').checked ? 1 : 0,
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

var initCustomSymbolMatrix = () => {
    var matrix = $('custom_symb_matrix');
    matrix.style.backgroundColor = $('lcd_bg_color').value;
    matrix.style.display = "block";
    for (let row = 0; row < 8; row++) {
        let mRow = document.createElement('div');
        mRow.className = "row";
        // mRow.setAttribute("dataX", row);
        for (let col = 0; col < 5; col++) {
            let index = "dot" + (col + row * 5);
            let mLabel = document.createElement('label');
            mLabel.className = "dot-px";
            mLabel.setAttribute("for", index);
            let mCell = document.createElement('input');
            mCell.type = "checkbox";
            mCell.id = index;
            mCell.onchange = () => { updateCustomSymb() };
            mRow.appendChild(mCell);
            mRow.appendChild(mLabel);
        }
        matrix.appendChild(mRow);
    }
}

var initCustomSymbolsPanel = () => {
    CustomSymbolsPanel = new CharLCD({
        at: 'custom_symbols_panel',
        rows: 1,
        cols: 8,
        rom: $('full_view_cp').value,
        off: $('lcd_bg_color').value,
        on: $('lcd_text_color').value,
        pixel_size: full_view_pixel,
        break_size: full_view_brk,
        sym_border: $('show_hover_grid').checked ? 1 : 0
    });
    let font = JSON.parse(localStorage.getItem('LCDtest_CustomSymbolsFont') || "[]");
    CustomSymbolsPanel.param.font = font;
    for (let f = 0; f < font.length; f++)
        if (font[f] && font[f] != null)
            CustomSymbolsPanel.char(0, f, String.fromCharCode(f));
}

var initSwipes = () => {//TODO
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }

    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    function handleTouchMove(evt) {
        if (!xDown || !yDown) return;

        var xDiff = xDown - evt.touches[0].clientX;
        var yDiff = yDown - evt.touches[0].clientY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {
                /* right swipe */
            } else {
                /* left swipe */
            }
            // } else {
            //     if (yDiff > 0) {
            //         /* down swipe */
            //     } else {
            //         /* up swipe */
            //     }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };
}

var selSymbol = (func) => {
    let setCustomSymbolMatrix = (index) => {
        $('currentSymbolIndex').value = index;
        let customSymb = CustomSymbolsPanel.getSymbolByIndex(index, true);
        if (!customSymb && customSymb == null) customSymb = [];
        pastPanelConfig('CustomSymbol', null, customSymb);
    }
    if (func == "selCustomSymbolIndex") {
        setCustomSymbolMatrix($('currentSymbolIndex').value);
        return;
    }
    var hoveredElement = $qs('ul:hover');
    hoveredElement = hoveredElement[hoveredElement.length - 1];
    if (!hoveredElement) return;
    let st = hoveredElement.style;
    let col = parseInt((parseInt(st.left) - 1) / 24);
    let row = parseInt((parseInt(st.top) - 1) / 36);
    let index = row * 16 + col;
    if (func == "cps") {
        symbol_code = full_view_lcd.getSymbolByIndex(index);
        ToolTip('Symbol config copyed. You can past it in custom symbol generator page', 'green');
    } else if (func = "custom_sym") {
        setCustomSymbolMatrix(index);
    }
}

var clearCustomPanel = () => {
    if (!window.confirm("Clear all custom symbols?")) return;
    CustomSymbolsPanel.param.font = [];
    for (let f = 0; f < 8; f++)
        CustomSymbolsPanel.set(0, f);
}

var allOffCustomSymb = () => {
    for (let d = 0; d < 40; d++) {
        $("dot" + d).checked = "";
    }
    updateCustomSymb();
}

var allOnCustomSymb = () => {
    for (let d = 0; d < 40; d++) {
        $("dot" + d).checked = "checked";
    }
    updateCustomSymb();
}

var invertCustomSymb = () => {
    for (let d = 0; d < 40; d++) {
        $("dot" + d).checked = $("dot" + d).checked == "" ? "checked" : "";
    }
    updateCustomSymb();
}

var updateCustomSymb = () => {
    let fullCode = $('code_gen').checked;
    let code = $('code_arduino_tempalte').innerText;
    if (fullCode) {
        code = code.replace(/\{columns\}/g, $('columns').value);
        code = code.replace(/\{rows\}/g, $('rows').value);
        if ($('lcd_bus').checked)
            code = code.replace(/{I2C_bus}(.|\n)*?{\/I2C_bus}/g, "").replace(/({parallel_bus}|{\/parallel_bus})/g, "");
        else
            code = code.replace(/{parallel_bus}(.|\n)*?{\/parallel_bus}/g, "").replace(/({I2C_bus}|{\/I2C_bus})/g, "");
    }

    let rowIdx = 0;
    let rowByte = "";
    let charUpload = "[";
    for (let d = 0; d <= 40; d++) {
        if (d > 0 && d % 5 == 0) {
            rowIdx++;
            charUpload += bin2dec(rowByte);
            if (d == 40) break;
            else charUpload += ",";
            rowByte = "";
        }
        rowByte += $('dot' + d).checked ? "1" : "0";
    }
    charUpload += "]";
    let customCharIndex = $('currentSymbolIndex').value;
    CustomSymbolsPanel.font(customCharIndex, JSON.parse(charUpload));
    CustomSymbolsPanel.char(0, customCharIndex, String.fromCharCode(customCharIndex));

    let charsArray = "";
    let loadCharArray = "";
    const charsArrayTmpl = /(?<={customCharArrays})(.|\n)*(?={\/customCharArrays})/g.exec(code)[0];
    const loadArrayTmpl = /(?<={loadChar})(.|\n)*(?={\/loadChar})/g.exec(code)[0];
    let i = 0;
    CustomSymbolsPanel.param.font.forEach(f => {
        if (i == 0 || (f && JSON.stringify(f) != "[0,0,0,0,0,0,0,0]")) {
            let dType = $('symbols_data_type').value;
            var ff = f.slice();//copy array by value
            if (dType != 'dec')
                for (let u = 0; u < 8; u++) {
                    if (dType == "bin") ff[u] = "0b" + dec2bin(f[u]);
                    else if (dType == "hex") ff[u] = "0x" + dec2hex(f[u]);
                };
            let sym = JSON.stringify(ff).replace(/(\[|\]|\")/g, "");
            if (dType == "bin") sym = sym.replace(/,/g, ",\n\t");
            charsArray += charsArrayTmpl.replace("{char_index}", i).replace("{symbol_data}", sym);
            if (fullCode) loadCharArray += loadArrayTmpl.replace(/{char_index}/g, i);
            i++;
        }
    });

    if (fullCode) {
        code = code.replace("{chars_count}", i);
        code = code.replace(/({loadChar}(.|\n)*{\/loadChar})/g, loadCharArray);
        code = code.replace(/({customCharArrays}(.|\n)*{\/customCharArrays})/g, charsArray);
    } else
        code = charsArray;

    $('custom_sym_code').innerHTML = Prism.highlight(code, Prism.languages.cpp, 'cpp');

    localStorage.setItem('LCDtest_CustomSymbolsFont', JSON.stringify(CustomSymbolsPanel.param.font));

    $sd("div_code", 1);
}

var bin2hex = (b) => {
    return b.match(/.{5}/g).reduce((acc, i) => {
        return acc + parseInt(i, 2).toString(16);
    }, '')
}

var hex2bin = (h) => {
    return h.split('').reduce((acc, i) => {
        return acc + ('0000' + parseInt(i, 16).toString(2));
    }, '')
}

var dec2bin = (number) => {
    let r = '0000' + Number(number).toString(2);
    return r.substring(r.length - 5, r.length);
}

var bin2dec = (bin) => {
    return parseInt(bin, 2);
}

var dec2hex = (dec) => {
    return dec.toString(16);
}

window.addEventListener('DOMContentLoaded', () => {
    loadState();
    initFullViews();
    initPanels();
    initCustomSymbolMatrix();
    initCustomSymbolsPanel();
    selSymbol('selCustomSymbolIndex');
    // initTableCoord();

    setInterval(savePanelsState, 5000);
    init_complite = true;
});