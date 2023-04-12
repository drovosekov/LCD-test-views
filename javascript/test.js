"use strict"; // Turns on strict mode for this compilation unit
const mis = "missed id: ";
var debug = (v) => { if (typeof (v) == "object") v = JSON.stringify(v); window.console.log(v) }
var $$ = (id) => { return document.getElementById(id) }
var $n = (id) => { return document.getElementsByName(id)[0] }
var $ = (id) => { if ($$(id)) return $$(id); else return $n(id) }
var $sbg = (id, color) => { if (id && id.style) id.style.backgroundColor = color; /*else debug(mis + id) */ }
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
var selectedMenu;
var menuItems = ["about", "cps", "custom_symbol", "config", "tests"];
var elSavedState = [
    { name: 'full_view_cp', defvalue: 'eu' },
    { name: 'rows', defvalue: 2 },
    { name: 'columns', defvalue: 16 },
    { name: 'px_size', defvalue: 3 },
    { name: 'break_size', defvalue: 1 },
    { name: 'lcd_bg_color', defvalue: '#cd2' },
    { name: 'lcd_pixel_color', defvalue: '#143' },
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
    selectedMenu = id;
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

var selLCDColors = () => {
    let bg = $('lcd_bg_color').value;
    let px = $('lcd_pixel_color').value;
    full_view_lcd.setBGColor(bg);
    full_view_lcd.setPixelsColor(px);
    CustomSymbolsPanel.setPixelsColor(px);
    CustomSymbolsPanel.setBGColor(bg);
    $sbg($('custom_symb_matrix'), bg);
    $qs("label[class='dot-px']").forEach(el => {
        if (el.style.backgroundColor)
            $sbg(el, px);
    });
    let tmpl = $('colors_tmpl');
    $sbg(tmpl, bg);
    tmpl.childNodes.forEach(i => {
        $sbg(i, px);
    });
}

var updateFullViewCustomSymbols = () => {
    full_view_lcd.param.font = CustomSymbolsPanel.param.font;
    for (let f = 0; f < 8; f++)
        full_view_lcd.char(0, f, String.fromCharCode(f));
}

var selFullViewCP = () => {
    full_view_lcd = new CharLCD({
        at: 'full_view_lcd',
        rows: 16,
        cols: 16,
        rom: $('full_view_cp').value,
        off: $('lcd_bg_color').value,
        on: $('lcd_pixel_color').value,
        pixel_size: full_view_pixel,
        break_size: full_view_brk,
        show_hover_grid: $('show_hover_grid').checked ? 1 : 0
    });
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            full_view_lcd.char(i, j, String.fromCharCode(i * 16 + j));
        }
    }
    $('custom_symb_matrix').style.backgroundColor = $('lcd_bg_color').value;

    updateFullViewCustomSymbols();
}

var initFullViews = () => {
    var lcd0 = new CharLCD({
        at: 'lcd0', rows: 1, cols: 1, off: '#fff', on: '#f00',
        pixel_size: full_view_pixel, break_size: full_view_brk
    });//1 custom symbol panel
    lcd0.font(0, [0, 0, 10, 21, 17, 10, 4]);   //save heart symbol at 0 index
    lcd0.char(0, 0, String.fromCharCode(0));//draw custom symbol saved at 0 index

    new CharLCD({
        at: 'lcd1', rows: 1, cols: 16, off: '#fff', on: '#000',
        pixel_size: full_view_pixel, break_size: full_view_brk,
        content: "0123456789ABCDEF"
    });//left horizontal index  

    new CharLCD({
        at: 'lcdv', rows: 16, cols: 1, off: '#fff', on: '#000',
        pixel_size: full_view_pixel, break_size: full_view_brk,
        content: "0\n1\n2\n3\n4\n5\n6\n7\n8\n9\nA\nB\nC\nD\nE\nF"
    });//vertical index  

    selFullViewCP();
}

var createNewPanel = (config) => {
    let newLCD = new CharLCD(config);
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
            on: $('lcd_pixel_color').value,
            pixel_size: $('px_size').value,
            break_size: $('break_size').value,
            show_hover_grid: $('show_hover_grid').checked ? 1 : 0,
            large: $('lcd_large').checked,
            border: $('lcd_border').checked,
            custom_font: CustomSymbolsPanel.param.font,
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

    panels_config[id].content = val;
    panels_obj[id].text(0, 0, val);
}

var copyPanelConfig = (type, el) => {
    if (type == "global") {
        copiedPanelConfig = {
            rows: $('rows').value,
            cols: $('columns').value,
            rom: $('full_view_cp').value,
            off: $('lcd_bg_color').value,
            on: $('lcd_pixel_color').value,
            pixel_size: $('px_size').value,
            break_size: $('break_size').value,
            large: $('lcd_large').checked,
            border: $('lcd_border').checked,
            show_hover_grid: $('show_hover_grid').checked ? 1 : 0,
        }
        ToolTip("Global settings saved at inner variable.<br />You can past it to test panels config", "green");
    } else if (type == "CustomSymbol") {
        symbol_code = CustomSymbolsPanel.getSymbolByIndex($('currentSymbolIndex').value);
        copiedPanelConfig = {
            custom_font: CustomSymbolsPanel.param.font
        };
        ToolTip("Custom symbols saved at inner variable", "green");
    } else if (type == "panel") {
        copiedPanelConfig = panels_config[getPanelIndex(el)];
        ToolTip("Panel config saved at inner variable.<br />Past it to other panel config or gloabal settings page", "green");
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
        $v('lcd_pixel_color', copiedPanelConfig.on);
        $v('px_size', copiedPanelConfig.pixel_size);
        $v('break_size', copiedPanelConfig.break_size);
        $ch('lcd_large', copiedPanelConfig.large);
        $ch('lcd_border', copiedPanelConfig.border);
        $ch('show_hover_grid', copiedPanelConfig.show_hover_grid);
        $v('lcd_sizes', copiedPanelConfig.rows + "x" + copiedPanelConfig.cols + "x" + copiedPanelConfig.pixel_size);

        ToolTip("Global settings replaced with saved", "yellow");
    } else if (type == "CustomSymbol") {
        let updateCustomMatrix = (data) => {
            for (let d = 0; d < 8; d++) {
                dec2bin(data[d]).split('').reduce((prev, curr, index) => {
                    $('dot' + (d * 5 + index - 1)).checked = curr == "1";
                });
            }
        }

        if (data) {
            updateCustomMatrix(data);
        }
        else if (copiedPanelConfig.custom_font) {
            CustomSymbolsPanel.param.font = copiedPanelConfig.custom_font.slice();
            copiedPanelConfig.custom_font = null;
            if (symbol_code instanceof Array)
                updateCustomMatrix(symbol_code);
        }
        else if (symbol_code instanceof Array) {
            updateCustomMatrix(symbol_code);
        } else if (init_complite) {
            ToolTip("Error: empty symbol code", "red");
            return;
        }

        updateCustomSymb();
    } else if (type == "panel") {
        let id = getPanelIndex(el);
        let fnt = copiedPanelConfig.custom_font;
        if (fnt instanceof Array) {//copy custom font
            copiedPanelConfig = panels_config[id];
            copiedPanelConfig.custom_font = fnt.slice();
            panels_config[id].custom_font = fnt.slice();
            createNewPanel(copiedPanelConfig);
            setPanelInfoText(copiedPanelConfig);
            ToolTip("Panel custom symbols replaced with saved", "yellow");
        } else if (typeof copiedPanelConfig.rom != 'string') {
            ToolTip("Error: empty config", "red");
        } else if (copiedPanelConfig) {
            copiedPanelConfig.id = id;
            copiedPanelConfig.at = "panel_" + id;
            copiedPanelConfig.content = panels_config[id].content;
            copiedPanelConfig.custom_font = panels_config[id].custom_font;
            if (!copiedPanelConfig.name) copiedPanelConfig.name = panels_config[id].name;
            panels_config[id] = copiedPanelConfig;
            createNewPanel(copiedPanelConfig);
            setPanelInfoText(copiedPanelConfig);

            ToolTip("Panel config replaced with saved", "yellow");
        }
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
    el.parentNode.innerHTML = '<h2 id="panel_name_' + id + '" onclick="editPanelName(this, ' + id + ')">' + val + '</h2>';
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
            show_hover_grid: $('show_hover_grid').checked ? 1 : 0,
            large: 0,
            border: 1,
            content: "Test LCD Display\nEmulator HD44780"
        });
        return;
    }

    let id = 0;
    Object.keys(cfg).forEach(p => {
        cfg[p].id = id;
        cfg[p].at = "panel_" + id;
        addPanel(cfg[p]);
        id++;
    });
}

var initCustomSymbolMatrix = () => {
    var matrix = $('custom_symb_matrix');
    matrix.style.backgroundColor = $('lcd_bg_color').value;
    matrix.style.display = "block";
    for (let row = 0; row < 8; row++) {
        let mRow = document.createElement('div');
        mRow.className = "row";
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
        on: $('lcd_pixel_color').value,
        pixel_size: full_view_pixel,
        break_size: full_view_brk,
        show_hover_grid: $('show_hover_grid').checked ? 1 : 0
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

    var getTouches = (evt) => {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }

    var handleTouchStart = (evt) => {
        const firstTouch = getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    var handleTouchMove = (evt) => {
        if (!xDown || !yDown) return;

        var xDiff = xDown - evt.touches[0].clientX;
        var yDiff = yDown - evt.touches[0].clientY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {//right swipe 

            } else { //left swipe 

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
        if (!customSymb || customSymb == null) customSymb = [];
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
    full_view_lcd.param.font = [];
    for (let f = 0; f < 8; f++) {
        CustomSymbolsPanel.set(0, f);
        full_view_lcd.set(0, f);
    }
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
    $qs("input+[class='dot-px']").forEach(el => {
        el.style.backgroundColor = "";
    });
    let px_color = $('lcd_pixel_color').value;
    $qs("input:checked+[class='dot-px']").forEach(el => {
        el.style.backgroundColor = px_color;
    });

    let rowByte = "";
    let charUpload = "[";
    for (let d = 0; d < 40; d++) {
        rowByte += $('dot' + d).checked ? "1" : "0";
        if (rowByte.length == 5) {
            charUpload += bin2dec(rowByte);
            if (d < 35) charUpload += ",";
            rowByte = "";
        }
    }
    charUpload += "]";

    let customCharIndex = $('currentSymbolIndex').value;
    CustomSymbolsPanel.font(customCharIndex, JSON.parse(charUpload));
    CustomSymbolsPanel.char(0, customCharIndex, String.fromCharCode(customCharIndex));

    let code = $('code_arduino_tempalte').innerText;
    let fullCode = $('code_gen').checked;
    let charsArray = "";
    let loadCharArray = "";
    const charsArrayTmpl = /(?<={customCharArrays})(.|\n)*(?={\/customCharArrays})/g.exec(code)[0];
    const loadArrayTmpl = /(?<={loadChar})(.|\n)*(?={\/loadChar})/g.exec(code)[0];
    let i = 0;
    let dType = $('symbols_data_type').value;
    CustomSymbolsPanel.param.font.forEach(f => {
        if (i == 0 || (f && JSON.stringify(f) != "[0,0,0,0,0,0,0,0]")) {
            var ff = Array(8);
            for (let u = 0; u < 8; u++) {
                if (dType == "bin") ff[u] = "0b" + dec2bin(f[u]);
                else if (dType == "hex") ff[u] = "0x" + dec2hex(f[u]);
                else ff[u] = f[u];//decimal by default format
            };
            let sym = JSON.stringify(ff).replace(/(\[|\]|\")/g, "");
            let chrD = charsArrayTmpl.replace("{char_index}", i);
            if (dType == "bin") {
                charsArray += chrD.replace("{symbol_data}", "\n\t\t\t" + sym.replace(/,/g, ",\n\t\t\t") + "\n");
            } else {
                charsArray += chrD.replace("{symbol_data}", sym + " ");
            }
            if (fullCode)
                loadCharArray += loadArrayTmpl.replace(/{char_index}/g, i);
            i++;
        }
    });

    if (fullCode) {
        code = code.replace(/\{columns\}/g, $('columns').value);
        code = code.replace(/\{rows\}/g, $('rows').value);
        if ($('lcd_bus').checked)
            code = code.replace(/{I2C_bus}(.|\n)*?{\/I2C_bus}/g, "").replace(/({parallel_bus}|{\/parallel_bus})/g, "");
        else
            code = code.replace(/{parallel_bus}(.|\n)*?{\/parallel_bus}/g, "").replace(/({I2C_bus}|{\/I2C_bus})/g, "");

        code = code.replace("{chars_count}", i);
        code = code.replace(/({loadChar}(.|\n)*{\/loadChar})/g, loadCharArray);
        code = code.replace(/({customCharArrays}(.|\n)*{\/customCharArrays})/g, charsArray);
    } else
        code = charsArray;

    $('custom_sym_code').innerHTML = Prism.highlight(code, Prism.languages.cpp, 'cpp');

    localStorage.setItem('LCDtest_CustomSymbolsFont', JSON.stringify(CustomSymbolsPanel.param.font));

    $sd("div_code", 1);

    updateFullViewCustomSymbols();
}

var bin2hex = (b) => {
    return b.match(/.{4}/g).reduce((acc, i) => {
        return acc + parseInt(i, 2).toString(16);
    }, '')
}

var hex2bin = (h) => {
    return h.split('').reduce((acc, i) => {
        return acc + (parseInt(i, 16).toString(2));
    }, '')
}

var dec2bin = (number) => {
    let r = '00000' + Number(number).toString(2);
    return r.substring(r.length - 6);
}

var bin2dec = (bin) => {
    return parseInt(bin, 2);
}

var dec2hex = (dec) => {
    return dec.toString(16);
}

var hex2dec = (hex) => {
    if (hex.length % 2) hex = '0' + hex;
    return BigInt('0x' + hex).toString(10);
}

window.addEventListener('DOMContentLoaded', () => {
    loadState();
    initCustomSymbolsPanel();
    initCustomSymbolMatrix();
    initPanels();
    initFullViews();
    selSymbol('selCustomSymbolIndex');
    selLCDColors();

    setInterval(savePanelsState, 5000);
    init_complite = true;
});