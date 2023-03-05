const CW = 5;  // charachter width
const CH = 8;  // character height
const CL = 10; // large character height

class CharLCD {
  constructor(obj) {
    var createAt = (_) => {
      var r, c, rr, cc, x, y, pix;
      var cell = _.arg.pixel_size + _.arg.break_size;
      var HH = _.arg.large ? CL : CH;

      var lcd = document.createElement('div');
      lcd.className = "lcd_panel";
      lcd.style.width = cell * ((1 + CW) * _.arg.cols + 1) + _.arg.break_size + 'px';
      lcd.style.height = cell * ((1 + HH) * _.arg.rows + 1) + _.arg.break_size + 'px';
      lcd.style.backgroundColor = _.arg.off;

      for (r = 0; r < _.arg.rows; r++) {
        for (c = 0; c < _.arg.cols; c++) {
          for (rr = 0; rr < CH; rr++) {
            for (cc = 0; cc < CW; cc++) {
              x = cell * ((1 + CW) * c + 1 + cc) + _.arg.break_size;
              y = cell * ((1 + HH) * r + rr) + _.arg.break_size;
              pix = document.createElement('div');
              pix.style.top = y + 'px';
              pix.style.left = x + 'px';
              pix.style.width = _.arg.pixel_size + 'px';
              pix.style.height = _.arg.pixel_size + 'px';
              pix.style.backgroundColor = _.arg.off;
              _.pix.push(pix);
              lcd.appendChild(pix);
            }
          }
        }
      }
      _.arg.at.appendChild(lcd);
    }

    var set = (_, r, c, data) => {
      if (r != parseInt(r) || r < 0 || r >= _.arg.rows || c != parseInt(c) || c < 0 || c >= _.arg.cols) return;
      if (!data) data = [];
      var offset = (r * _.arg.cols + c) * CW * CH - 1;
      for (var i = 0; i < CH; i++) {
        var mask = (data[i] == parseInt(data[i])) ? parseInt(data[i]) : 0;
        for (var j = 0; j < CW; j++) {
          _.pix[offset + CW - j].style.backgroundColor = ((1 << j) & mask) ? _.arg.on : _.arg.off;
        }
        offset += CW;
      }
    }

    var char = (_, r, c, ch) => {
      var x = ch.charCodeAt(0);
      set(_, r, c, _.font[x] ? _.font[x] : cpList[_.rom].font[x]);
      // set(_, r, c, _.font[x] ? _.font[x] : _.rom.font[x]);
    }

    var text = (_, r, c, str) => {
      if (r != parseInt(r) || r < 0 || r >= _.arg.rows || c != parseInt(c) || c < 0 || c >= _.arg.cols) return;
      var i, k, x;
      for (i = 0; i < str.length; i++) {
        if (str[i] == '\n') {
          c = 0;
          if (r++ >= _.arg.rows) return;
        }
        else {
          x = str.charCodeAt(i);
          if (x >= 0xd800 && x <= 0xdbff) {
            i++;
            k = str[i] ? str.charCodeAt(i) : 0;
            x = 0x10000 + (x - 0xd800) * 0x400 + (k - 0xdc00);
          }
          // if (_.rom.cmap[x]) x = _.rom.cmap[x];
          if (cpList[_.rom].cmap[x]) x = cpList[_.rom].cmap[x];
          if (x instanceof Array) {
            for (k = 0; k < x.length; k++) {
              char(_, r, c, String.fromCharCode(x[k]));
            }
            c += x.length;
          }
          else {
            if (x > 255) x = 0x3f;
            char(_, r, c, String.fromCharCode(x));
            c++;
          }
          if (c >= _.arg.cols) continue;
        }
      }
    }

    var font = (_, n, data) => {
      _.font[n] = data;
    }

    var _ = {
      font: {},
      pix: [],
      rom: 'eu',     // codepage eu|jp
      arg: {
        rows: 2,     // count rows emulated LCD
        cols: 16,    // cout columns emulated LCD
        pixel_size: 3,      // user display pixels per emulated LCD pixel
        break_size: 1,      // user display pixels per emulated LCD break
        off: '#cd2', // color emulated off pixel
        on: '#143',  // color emulated on pixel
        large: false // emulate large LCD symbols
      }
    };

    if (obj) {
      for (var key in obj) {
        if (typeof _.arg[key] != 'undefined' && _.arg[key] == parseInt(_.arg[key])) { // numeric
          if (obj[key] == parseInt(obj[key]) && obj[key] > 0)
            _.arg[key] = parseInt(obj[key]);
        }
        else
          _.arg[key] = obj[key];
      }

      if (obj.rom) {
        var cpID = obj.rom.toString().toLowerCase();
        if (cpList[cpID])
          _.rom = cpID;
      }

      // if (obj.rom) {
      //   var cpID = obj.rom.toString().toLowerCase();
      //   if (cpList[cpID])
      //     _.rom = cpList[cpID]; 
      // } else
      //   _.rom = _eu;
    }
    if (typeof _.arg.at == 'string')
      _.arg.at = document.getElementById(_.arg.at);

    createAt(_);
    this.set = (r, c, data) => { set(_, r, c, data); };
    this.char = (r, c, ch) => { char(_, r, c, ch); };
    this.text = (r, c, str) => { text(_, r, c, str); };
    this.font = (n, data) => { font(_, n, data); };
  }
}


var _jp = {
  name: "Japan CP",
  font: [
    [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [],
    [4, 4, 4, 4, 0, 0, 4], // !
    [10, 10, 10], // "
    [10, 10, 31, 10, 31, 10, 10], // #
    [4, 15, 20, 14, 5, 30, 4], // $
    [24, 25, 2, 4, 8, 19, 3], // %
    [12, 18, 20, 8, 21, 18, 13], // &
    [12, 4, 8], // '
    [2, 4, 8, 8, 8, 4, 2], // (
    [8, 4, 2, 2, 2, 4, 8], // )
    [0, 4, 21, 14, 21, 4], // *
    [0, 4, 4, 31, 4, 4], // +
    [0, 0, 0, 0, 12, 4, 8], // ,
    [0, 0, 0, 31], // -
    [0, 0, 0, 0, 0, 12, 12], // .
    [0, 1, 2, 4, 8, 16], // /
    [14, 17, 19, 21, 25, 17, 14], // 0
    [4, 12, 4, 4, 4, 4, 14], // 1
    [14, 17, 1, 2, 4, 8, 31], // 2
    [31, 2, 4, 2, 1, 17, 14], // 3
    [2, 6, 10, 18, 31, 2, 2], // 4
    [31, 16, 30, 1, 1, 17, 14], // 5
    [6, 8, 16, 30, 17, 17, 14], // 6
    [31, 1, 2, 4, 8, 8, 8], // 7
    [14, 17, 17, 14, 17, 17, 14], // 8
    [14, 17, 17, 15, 1, 2, 12], // 9
    [0, 12, 12, 0, 12, 12], // :
    [0, 12, 12, 0, 12, 4, 8], // ;
    [2, 4, 8, 16, 8, 4, 2], // <
    [0, 0, 31, 0, 31], // =
    [8, 4, 2, 1, 2, 4, 8], // >
    [14, 17, 1, 2, 4, 0, 4], // ?
    [14, 17, 1, 13, 21, 21, 14], // @
    [14, 17, 17, 31, 17, 17, 17], // A
    [30, 17, 17, 30, 17, 17, 30], // B
    [14, 17, 16, 16, 16, 17, 14], // C
    [28, 18, 17, 17, 17, 18, 28], // D
    [31, 16, 16, 30, 16, 16, 31], // E
    [31, 16, 16, 30, 16, 16, 16], // F
    [14, 17, 16, 23, 17, 17, 15], // G
    [17, 17, 17, 31, 17, 17, 17], // H
    [14, 4, 4, 4, 4, 4, 14], // I
    [14, 2, 2, 2, 2, 18, 12], // J
    [17, 18, 20, 24, 20, 18, 17], // K
    [16, 16, 16, 16, 16, 16, 31], // L
    [17, 27, 21, 21, 17, 17, 17], // M
    [17, 17, 25, 21, 19, 17, 17], // N
    [14, 17, 17, 17, 17, 17, 14], // O
    [30, 17, 17, 30, 16, 16, 16], // P
    [14, 17, 17, 17, 21, 18, 13], // Q
    [30, 17, 17, 30, 20, 18, 17], // R
    [15, 16, 16, 14, 1, 1, 30], // S
    [31, 4, 4, 4, 4, 4, 4], // T
    [17, 17, 17, 17, 17, 17, 14], // U
    [17, 17, 17, 17, 17, 10, 4], // V
    [17, 17, 17, 21, 21, 21, 10], // W
    [17, 17, 10, 4, 10, 17, 17], // X
    [17, 17, 17, 10, 4, 4, 4], // Y
    [31, 1, 2, 4, 8, 16, 31], // Z
    [14, 8, 8, 8, 8, 8, 14], // [
    [17, 10, 31, 4, 31, 4, 4], // Yen
    [14, 2, 2, 2, 2, 2, 14], // ]
    [4, 10, 17], // ^
    [0, 0, 0, 0, 0, 0, 31], // _
    [8, 4, 2], // `
    [0, 0, 14, 1, 15, 17, 15], // a
    [16, 16, 22, 25, 17, 17, 30], // b
    [0, 0, 14, 16, 16, 17, 14], // c
    [1, 1, 13, 19, 17, 17, 15], // d
    [0, 0, 14, 17, 31, 16, 14], // e
    [6, 9, 8, 28, 8, 8, 8], // f
    [0, 15, 17, 17, 15, 1, 14], // g
    [16, 16, 22, 25, 17, 17, 17], // h
    [4, 0, 12, 4, 4, 4, 14], // i
    [2, 0, 6, 2, 2, 18, 12], // j
    [16, 16, 18, 20, 24, 20, 18], // k
    [12, 4, 4, 4, 4, 4, 31], // l
    [0, 0, 26, 21, 21, 17, 17], // m
    [0, 0, 22, 25, 17, 17, 17], // n
    [0, 0, 14, 17, 17, 17, 14], // o
    [0, 0, 30, 17, 30, 16, 16], // p
    [0, 0, 13, 19, 15, 1, 1], // q
    [0, 0, 22, 25, 16, 16, 16], // r
    [0, 0, 14, 16, 14, 1, 30], // s
    [8, 8, 28, 8, 8, 9, 6], // t
    [0, 0, 17, 17, 17, 19, 13], // u
    [0, 0, 17, 17, 17, 10, 4], // v
    [0, 0, 17, 17, 21, 21, 10], // w
    [0, 0, 17, 10, 4, 10, 17], // x
    [0, 0, 17, 17, 15, 1, 14], // y
    [0, 0, 31, 2, 4, 8, 31], // z
    [2, 4, 4, 8, 4, 4, 2], // {
    [4, 4, 4, 4, 4, 4, 4], // |
    [8, 4, 4, 2, 4, 4, 8], // }
    [0, 4, 2, 31, 2, 4], // ->
    [0, 4, 8, 31, 8, 4], // <-
    [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [],
    [0, 0, 0, 0, 28, 20, 28],
    [7, 4, 4, 4],
    [0, 0, 0, 4, 4, 4, 28],
    [0, 0, 0, 0, 16, 8, 4],
    [0, 0, 0, 12, 12],
    [0, 31, 1, 31, 1, 2, 4],
    [0, 0, 31, 1, 6, 4, 8],
    [0, 0, 2, 4, 12, 20, 4],
    [0, 0, 4, 31, 17, 1, 14],
    [0, 0, 0, 31, 4, 4, 31],
    [0, 0, 2, 31, 6, 10, 18],
    [0, 0, 8, 31, 9, 10, 8],
    [0, 0, 0, 14, 2, 2, 31],
    [0, 0, 30, 2, 30, 2, 30],
    [0, 0, 0, 21, 21, 1, 6],

    [0, 0, 0, 31],
    [31, 1, 5, 6, 4, 4, 8],
    [1, 2, 4, 12, 20, 4, 4],
    [4, 31, 17, 17, 1, 2, 4],
    [0, 31, 4, 4, 4, 4, 31],
    [2, 31, 2, 6, 10, 18, 2],
    [8, 31, 9, 9, 9, 9, 18],
    [4, 31, 4, 31, 4, 4, 4],
    [0, 15, 9, 17, 1, 2, 12],
    [8, 15, 18, 2, 2, 2, 4],
    [0, 31, 1, 1, 1, 1, 31],
    [10, 31, 10, 10, 2, 4, 8],
    [0, 24, 1, 25, 1, 2, 28],
    [0, 31, 1, 2, 4, 10, 17],
    [8, 31, 9, 10, 8, 8, 7],
    [0, 17, 17, 9, 1, 2, 12],

    [0, 15, 9, 21, 3, 2, 12],
    [2, 28, 4, 31, 4, 4, 8],
    [0, 21, 21, 21, 1, 2, 4],
    [14, 0, 31, 4, 4, 4, 8],
    [8, 8, 8, 12, 10, 8, 8],
    [4, 4, 31, 4, 4, 8, 16],
    [0, 14, 0, 0, 0, 0, 31],
    [0, 31, 1, 10, 4, 10, 16],
    [4, 31, 2, 4, 14, 21, 4],
    [2, 2, 2, 2, 2, 4, 8],
    [0, 4, 2, 17, 17, 17, 17],
    [16, 16, 31, 16, 16, 16, 15],
    [0, 31, 1, 1, 1, 2, 12],
    [0, 8, 20, 2, 1, 1],
    [4, 31, 4, 4, 21, 21, 4],
    [0, 31, 1, 1, 10, 4, 2],

    [0, 14, 0, 14, 0, 14, 1],
    [0, 4, 8, 16, 17, 31, 1],
    [0, 1, 1, 10, 4, 10, 16],
    [0, 31, 8, 31, 8, 8, 7],
    [8, 8, 31, 9, 10, 8, 8],
    [0, 14, 2, 2, 2, 2, 31],
    [0, 31, 1, 31, 1, 1, 31],
    [14, 0, 31, 1, 1, 2, 4],
    [18, 18, 18, 18, 2, 4, 8],
    [0, 4, 20, 20, 21, 21, 22],
    [0, 16, 16, 17, 18, 20, 24],
    [0, 31, 17, 17, 17, 17, 31],
    [0, 31, 17, 17, 1, 2, 4],
    [0, 24, 0, 1, 1, 2, 28],
    [4, 18, 8],
    [28, 20, 28],

    [0, 0, 9, 21, 18, 18, 13], // alpha
    [10, 0, 14, 1, 15, 17, 15], // a:
    [0, 0, 14, 17, 30, 17, 30, 16, 16, 16], // beta
    [0, 0, 14, 16, 12, 17, 14], // epsilon
    [0, 0, 17, 17, 17, 19, 29, 16, 16, 16], // mu
    [0, 0, 15, 20, 18, 17, 14], // sigma
    [0, 0, 6, 9, 17, 17, 30, 16, 16, 16], // ro
    [0, 0, 15, 17, 17, 17, 15, 1, 1, 14], // g
    [0, 0, 7, 4, 4, 20, 8], // sq root
    [0, 2, 26, 2], // -1
    [2, 0, 6, 2, 2, 2, 2, 2, 18, 12], // j
    [0, 20, 8, 20], // x
    [0, 4, 14, 20, 21, 14, 4], // cent
    [8, 8, 28, 8, 28, 8, 15], // poud
    [14, 0, 22, 25, 17, 17, 17], // n~
    [10, 0, 14, 17, 17, 17, 14], // o:
    [0, 0, 22, 25, 17, 17, 30, 16, 16, 16], // p
    [0, 0, 13, 19, 17, 17, 15, 1, 1, 1], // q
    [0, 14, 17, 31, 17, 17, 14], // theta
    [0, 0, 0, 11, 21, 26], // inf
    [0, 0, 14, 17, 17, 10, 27], // Omega
    [10, 0, 17, 17, 17, 19, 13], // u:
    [31, 16, 8, 4, 8, 16, 31], // Sigma
    [0, 0, 31, 10, 10, 10, 19], // pi
    [31, 0, 17, 10, 4, 10, 17], // x-
    [0, 0, 17, 17, 17, 17, 15, 1, 1, 14], // y
    [0, 1, 30, 4, 31, 4, 4],
    [0, 0, 31, 8, 15, 9, 17],
    [0, 0, 31, 21, 31, 17, 17], // yen
    [0, 0, 4, 0, 31, 0, 4], // :-
    [],
    [31, 31, 31, 31, 31, 31, 31, 31, 31, 31]
  ],
  cmap: {
    0x5c: 0xa4, // backslash
    0xa5: 0x5c, 0xffe5: 0x5c, 0x5186: 0xfc, // Yen characters
    // Latin
    0xa2: 0xec, 0xa3: 0xed, 0xb5: 0xe4, 0xb7: 0xa5, 0xe4: 0xe1, 0xdf: 0xe2, 0xf1: 0xee, 0xf6: 0xef, 0xf7: 0xfd,
    // Greek
    0x391: 0x41, 0x392: 0x42, 0x395: 0x45, 0x396: 0x5a, 0x397: 0x48, 0x398: 0xf2, 0x399: 0x49, 0x39a: 0x4b,
    0x39c: 0x4d, 0x39d: 0x4e, 0x39f: 0x4f, 0x3a1: 0x50, 0x3a3: 0xf6, 0x3a4: 0x54, 0x3a5: 0x59, 0x3a7: 0x58, 0x3a9: 0xf4,
    0x3b1: 0xe0, 0x3b2: 0xe2, 0x3b5: 0xe3, 0x3b8: 0xf2, 0x3bc: 0xe4, 0x3bf: 0x6f, 0x3c0: 0xf7, 0x3c1: 0xe6, 0x3c3: 0xe5,
    // Misc
    0x2190: 0x7f, 0x2192: 0x7e, 0x221e: 0xf3, 0x221a: 0xe8, 0x237a: 0xe0,
    // Japanese
    0x3001: 0xa4, 0x3002: 0xa1, 0x300c: 0xa2, 0x300d: 0xa3, 0x3099: 0xde, 0x309a: 0xdf, 0x309b: 0xde, 0x309c: 0xdf,
    // Full Size Katakana
    0x30a0: 0x3d, 0x30a1: 0xa7, 0x30a2: 0xb1, 0x30a3: 0xa8,
    0x30a4: 0xb2, 0x30a5: 0xa9, 0x30a6: 0xb3, 0x30a7: 0xaa,
    0x30a8: 0xb4, 0x30a9: 0xab, 0x30aa: 0xb5, 0x30ab: 0xb6,
    0x30ac: [0xb6, 0xde], 0x30ad: 0xb7, 0x30ae: [0xb7, 0xde], 0x30af: 0xb8,
    0x30b0: [0xb8, 0xde], 0x30b1: 0xb9, 0x30b2: [0xb9, 0xde], 0x30b3: 0xba,
    0x30b4: [0xba, 0xde], 0x30b5: 0xbb, 0x30b6: [0xbb, 0xde], 0x30b7: 0xbc,
    0x30b8: [0xbc, 0xde], 0x30b9: 0xbd, 0x30ba: [0xbd, 0xde], 0x30bb: 0xbe,
    0x30bc: [0xbe, 0xde], 0x30bd: 0xbf, 0x30be: [0xbf, 0xde], 0x30bf: 0xc0,
    0x30c0: [0xc0, 0xde], 0x30c1: 0xc1, 0x30c2: [0xc1, 0xde], 0x30c3: 0xaf,
    0x30c4: 0xc2, 0x30c5: [0xc2, 0xde], 0x30c6: 0xc3, 0x30c7: [0xc3, 0xde],
    0x30c8: 0xc4, 0x30c9: [0xc4, 0xde], 0x30ca: 0xc5, 0x30cb: 0xc6,
    0x30cc: 0xc7, 0x30cd: 0xc8, 0x30ce: 0xc9, 0x30cf: 0xca,
    0x30d0: [0xca, 0xde], 0x30d1: [0xca, 0xdf], 0x30d2: 0xcb, 0x30d3: [0xcb, 0xde],
    0x30d4: [0xcb, 0xdf], 0x30d5: 0xcc, 0x30d6: [0xcc, 0xde], 0x30d7: [0xcc, 0xdf],
    0x30d8: 0xcd, 0x30d9: [0xcd, 0xde], 0x30da: [0xcd, 0xdf], 0x30db: 0xce,
    0x30dc: [0xce, 0xde], 0x30dd: [0xce, 0xdf], 0x30de: 0xcf, 0x30df: 0xd0,
    0x30e0: 0xd1, 0x30e1: 0xd2, 0x30e2: 0xd3, 0x30e3: 0xac,
    0x30e4: 0xd4, 0x30e5: 0xad, 0x30e6: 0xd5, 0x30e7: 0xae,
    0x30e8: 0xd6, 0x30e9: 0xd7, 0x30ea: 0xd8, 0x30eb: 0xd9,
    0x30ec: 0xda, 0x30ed: 0xdb, 0x30ee: 0xdc, 0x30ef: 0xdc,
    0x30f0: 0xb2, 0x30f1: 0xb4, 0x30f2: 0xa6, 0x30f3: 0xdd,
    0x30f4: [0xb3, 0xde], 0x30f5: 0xb6, 0x30f6: 0xb9, 0x30f7: [0xdc, 0xde],
    0x30f8: [0xb2, 0xde], 0x30f9: [0xb4, 0xde], 0x30fa: [0xa6, 0xde], 0x30fb: 0xa5,
    0x30fc: 0xb0, 0x30fd: 0xa4, 0x30fe: [0xa4, 0xde], 0x30ff: [0xba, 0xc4],
    // Half Size Katakana
    0xff61: 0xa1, 0xff62: 0xa2, 0xff63: 0xa3, 0xff64: 0xa4, 0xff65: 0xa5, 0xff66: 0xa6, 0xff67: 0xa7,
    0xff68: 0xa8, 0xff69: 0xa9, 0xff6a: 0xaa, 0xff6b: 0xab, 0xff6c: 0xac, 0xff6d: 0xad, 0xff6e: 0xae, 0xff6f: 0xaf,
    0xff70: 0xb0, 0xff71: 0xb1, 0xff72: 0xb2, 0xff73: 0xb3, 0xff74: 0xb4, 0xff75: 0xb5, 0xff76: 0xb6, 0xff77: 0xb7,
    0xff78: 0xb8, 0xff79: 0xb9, 0xff7a: 0xba, 0xff7b: 0xbb, 0xff7c: 0xbc, 0xff7d: 0xbd, 0xff7e: 0xbe, 0xff7f: 0xbf,
    0xff80: 0xc0, 0xff81: 0xc1, 0xff82: 0xc2, 0xff83: 0xc3, 0xff84: 0xc4, 0xff85: 0xc5, 0xff86: 0xc6, 0xff87: 0xc7,
    0xff88: 0xc8, 0xff89: 0xc9, 0xff8a: 0xca, 0xff8b: 0xcb, 0xff8c: 0xcc, 0xff8d: 0xcd, 0xff8e: 0xce, 0xff8f: 0xcf,
    0xff90: 0xd0, 0xff91: 0xd1, 0xff92: 0xd2, 0xff93: 0xd3, 0xff94: 0xd4, 0xff95: 0xd5, 0xff96: 0xd6, 0xff97: 0xd7,
    0xff98: 0xd8, 0xff99: 0xd9, 0xff9a: 0xda, 0xff9b: 0xdb, 0xff9c: 0xdc, 0xff9d: 0xdd, 0xff9e: 0xde, 0xff9f: 0xdf
  }
};

////////////////////////////

var _eu = {
  name: "Eng CP",
  font: [
    [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [0, 8, 12, 14, 15, 14, 12, 8], // |>
    [0, 2, 6, 14, 30, 14, 6, 2], // <|
    [0, 9, 18, 27], // ``
    [0, 27, 9, 18], // ''
    [0, 4, 14, 31, 0, 4, 14, 31],
    [0, 31, 14, 4, 0, 31, 14, 4],
    [0, 0, 14, 31, 31, 31, 14],
    [0, 1, 1, 5, 9, 31, 8, 4], // return
    [0, 4, 14, 21, 4, 4, 4, 4], // up
    [0, 4, 4, 4, 4, 21, 14, 4], // down
    [0, 0, 4, 2, 31, 2, 4], // ->
    [0, 0, 4, 8, 31, 8, 4], // <-
    [0, 2, 4, 8, 4, 2, 0, 31], // <=
    [0, 8, 4, 2, 4, 8, 0, 31], // >=
    [0, 0, 4, 4, 14, 14, 31],
    [0, 0, 31, 14, 14, 4, 4],
    [],
    [0, 4, 4, 4, 4, 0, 0, 4], // !
    [0, 10, 10, 10], // "
    [0, 10, 10, 31, 10, 31, 10, 10], // #
    [0, 4, 15, 20, 14, 5, 30, 4], // $
    [0, 24, 25, 2, 4, 8, 19, 3], // %
    [0, 12, 18, 20, 8, 21, 18, 13], // &
    [0, 12, 4, 8], // '
    [0, 2, 4, 8, 8, 8, 4, 2], // (
    [0, 8, 4, 2, 2, 2, 4, 8], // )
    [0, 0, 4, 21, 14, 21, 4], // *
    [0, 0, 4, 4, 31, 4, 4], // +
    [0, 0, 0, 0, 0, 12, 4, 8], // ,
    [0, 0, 0, 0, 31], // -
    [0, 0, 0, 0, 0, 0, 12, 12], // .
    [0, 0, 1, 2, 4, 8, 16], // /
    [0, 14, 17, 19, 21, 25, 17, 14], // 0
    [0, 4, 12, 4, 4, 4, 4, 14], // 1
    [0, 14, 17, 1, 2, 4, 8, 31], // 2
    [0, 31, 2, 4, 2, 1, 17, 14], // 3
    [0, 2, 6, 10, 18, 31, 2, 2], // 4
    [0, 31, 16, 30, 1, 1, 17, 14], // 5
    [0, 6, 8, 16, 30, 17, 17, 14], // 6
    [0, 31, 1, 2, 4, 8, 8, 8], // 7
    [0, 14, 17, 17, 14, 17, 17, 14], // 8
    [0, 14, 17, 17, 15, 1, 2, 12], // 9
    [0, 0, 12, 12, 0, 12, 12], // :
    [0, 0, 12, 12, 0, 12, 4, 8], // ;
    [0, 2, 4, 8, 16, 8, 4, 2], // <
    [0, 0, 0, 31, 0, 31], // =
    [0, 8, 4, 2, 1, 2, 4, 8], // >
    [0, 14, 17, 1, 2, 4, 0, 4], // ?
    [0, 14, 17, 1, 13, 21, 21, 14], // @
    [0, 4, 10, 17, 17, 31, 17, 17], // A
    [0, 30, 17, 17, 30, 17, 17, 30], // B
    [0, 14, 17, 16, 16, 16, 17, 14], // C
    [0, 28, 18, 17, 17, 17, 18, 28], // D
    [0, 31, 16, 16, 30, 16, 16, 31], // E
    [0, 31, 16, 16, 30, 16, 16, 16], // F
    [0, 14, 17, 16, 23, 17, 17, 15], // G
    [0, 17, 17, 17, 31, 17, 17, 17], // H
    [0, 14, 4, 4, 4, 4, 4, 14], // I
    [0, 14, 2, 2, 2, 2, 18, 12], // J
    [0, 17, 18, 20, 24, 20, 18, 17], // K
    [0, 16, 16, 16, 16, 16, 16, 31], // L
    [0, 17, 27, 21, 21, 17, 17, 17], // M
    [0, 17, 17, 25, 21, 19, 17, 17], // N
    [0, 14, 17, 17, 17, 17, 17, 14], // O
    [0, 30, 17, 17, 30, 16, 16, 16], // P
    [0, 14, 17, 17, 17, 21, 18, 13], // Q
    [0, 30, 17, 17, 30, 20, 18, 17], // R
    [0, 15, 16, 16, 14, 1, 1, 30], // S
    [0, 31, 4, 4, 4, 4, 4, 4], // T
    [0, 17, 17, 17, 17, 17, 17, 14], // U
    [0, 17, 17, 17, 17, 17, 10, 4], // V
    [0, 17, 17, 17, 21, 21, 21, 10], // W
    [0, 17, 17, 10, 4, 10, 17, 17], // X
    [0, 17, 17, 17, 10, 4, 4, 4], // Y
    [0, 31, 1, 2, 4, 8, 16, 31], // Z
    [0, 14, 8, 8, 8, 8, 8, 14], // [
    [0, 0, 16, 8, 4, 2, 1], // \
    [0, 14, 2, 2, 2, 2, 2, 14], // ]
    [0, 4, 10, 17], // ^
    [0, 0, 0, 0, 0, 0, 0, 31], // _
    [0, 8, 4, 2], // `
    [0, 0, 0, 14, 1, 15, 17, 15], // a
    [0, 16, 16, 22, 25, 17, 17, 30], // b
    [0, 0, 0, 14, 16, 16, 17, 14], // c
    [0, 1, 1, 13, 19, 17, 17, 15], // d
    [0, 0, 0, 14, 17, 31, 16, 14], // e
    [0, 6, 9, 8, 28, 8, 8, 8], // f
    [0, 0, 15, 17, 17, 15, 1, 14], // g
    [0, 16, 16, 22, 25, 17, 17, 17], // h
    [0, 4, 0, 4, 12, 4, 4, 14], // i
    [0, 2, 0, 6, 2, 2, 18, 12], // j
    [0, 16, 16, 18, 20, 24, 20, 18], // k
    [0, 12, 4, 4, 4, 4, 4, 31], // l
    [0, 0, 0, 26, 21, 21, 17, 17], // m
    [0, 0, 0, 22, 25, 17, 17, 17], // n
    [0, 0, 0, 14, 17, 17, 17, 14], // o
    [0, 0, 0, 30, 17, 30, 16, 16], // p
    [0, 0, 0, 13, 19, 15, 1, 1], // q
    [0, 0, 0, 22, 25, 16, 16, 16], // r
    [0, 0, 0, 14, 16, 14, 1, 30], // s
    [0, 8, 8, 28, 8, 8, 9, 6], // t
    [0, 0, 0, 17, 17, 17, 19, 13], // u
    [0, 0, 0, 17, 17, 17, 10, 4], // v
    [0, 0, 0, 17, 17, 21, 21, 10], // w
    [0, 0, 0, 17, 10, 4, 10, 17], // x
    [0, 0, 0, 17, 17, 15, 1, 14], // y
    [0, 0, 0, 31, 2, 4, 8, 31], // z
    [0, 2, 4, 4, 8, 4, 4, 2], // {
    [0, 4, 4, 4, 4, 4, 4, 4], // |
    [0, 8, 4, 4, 2, 4, 4, 8], // }
    [0, 0, 0, 0, 13, 18], // ~
    [0, 4, 10, 17, 17, 17, 31], // del

    [0, 31, 17, 16, 30, 17, 17, 30], // .B
    [15, 5, 5, 9, 17, 31, 17, 17], // .D
    [0, 21, 21, 21, 14, 21, 21, 21], // .Zh
    [0, 30, 1, 1, 6, 1, 1, 30], // .Z
    [0, 17, 17, 19, 21, 25, 17, 17], // .I
    [10, 4, 17, 19, 21, 25, 17, 17], // .J
    [0, 15, 5, 5, 5, 5, 21, 9], // .L
    [0, 31, 17, 17, 17, 17, 17, 17], // .P
    [0, 17, 17, 17, 10, 4, 8, 16], // .U
    [0, 17, 17, 17, 17, 17, 31, 1], // .Ts
    [0, 17, 17, 17, 15, 1, 1, 1], // .Ch
    [0, 0, 21, 21, 21, 21, 21, 31], // .Sh
    [0, 21, 21, 21, 21, 21, 31, 1], // .Sch
    [0, 24, 8, 8, 14, 9, 9, 14], // .'
    [0, 17, 17, 17, 25, 21, 21, 25], // .Y
    [0, 14, 17, 5, 11, 1, 17, 14], // .E
    [0, 0, 0, 9, 21, 18, 18, 13], // alpha
    [0, 4, 6, 5, 5, 4, 28, 28], // note
    [0, 31, 17, 16, 16, 16, 16, 16], // .G
    [0, 0, 0, 31, 10, 10, 10, 19], // pi
    [0, 31, 16, 8, 4, 8, 16, 31], // Sigma
    [0, 0, 0, 15, 18, 18, 18, 12], // sigma
    [6, 5, 7, 5, 5, 29, 27, 3], // notes
    [0, 0, 1, 14, 20, 4, 4, 2], // tau
    [0, 4, 14, 14, 14, 31, 4], // bell
    [0, 14, 17, 17, 31, 17, 17, 14], // Theta
    [0, 0, 14, 17, 17, 17, 10, 27], // Omega
    [0, 6, 9, 4, 10, 17, 17, 14], // delta
    [0, 0, 0, 11, 21, 26], // inf
    [0, 0, 10, 31, 31, 31, 14, 4], // heart
    [0, 0, 0, 14, 16, 12, 17, 14], // epsilon
    [0, 14, 17, 17, 17, 17, 17, 17],
    [0, 27, 27, 27, 27, 27, 27, 27],
    [0, 4, 0, 0, 4, 4, 4, 4], // !!
    [0, 4, 14, 20, 20, 21, 14, 4], // cent
    [0, 6, 8, 8, 28, 8, 9, 22], // pound
    [0, 0, 17, 14, 10, 14, 17], // money
    [0, 17, 10, 31, 4, 31, 4, 4], // yen
    [0, 4, 4, 4, 0, 4, 4, 4], // pipe
    [0, 6, 9, 4, 10, 4, 18, 12], // paragraph
    [0, 2, 5, 4, 31, 4, 20, 8], // f
    [0, 31, 17, 21, 23, 21, 17, 31], // (C)
    [0, 14, 1, 15, 17, 15, 0, 31], // a_
    [0, 0, 5, 10, 20, 10, 5], // <<
    [0, 18, 21, 21, 29, 21, 21, 18], // .Ju
    [0, 15, 17, 17, 15, 5, 9, 17], // .Ja
    [0, 31, 17, 21, 17, 19, 21, 31], // (R)
    [0, 4, 8, 12], // `
    [12, 18, 18, 18, 12], // 0
    [0, 4, 4, 31, 4, 4, 0, 31], // +-
    [12, 18, 4, 8, 30], // 2
    [28, 2, 12, 2, 28], // 3
    [28, 18, 28, 16, 18, 23, 18, 3], // Pt
    [0, 17, 17, 17, 19, 29, 16, 16], // mu
    [0, 15, 19, 19, 15, 3, 3, 3], // pilcrow
    [0, 0, 0, 0, 12, 12], // dot
    [0, 0, 0, 10, 17, 21, 21, 10], // omega
    [8, 24, 8, 8, 28], // 1
    [0, 14, 17, 17, 17, 14, 0, 31], // o_
    [0, 0, 20, 10, 5, 10, 20], // >>
    [17, 18, 20, 10, 22, 10, 15, 2], // 1/4
    [17, 18, 20, 10, 21, 1, 2, 7], // 1/2
    [24, 8, 24, 9, 27, 5, 7, 1], // 3/4
    [0, 4, 0, 4, 8, 16, 17, 14], // !?
    [8, 4, 4, 10, 17, 31, 17, 17], // A\
    [2, 4, 4, 10, 17, 31, 17, 17], // A/
    [4, 10, 0, 14, 17, 31, 17, 17], // A^
    [13, 18, 0, 14, 17, 31, 17, 17], // A~
    [10, 0, 4, 10, 17, 31, 17, 17], // A:
    [4, 10, 4, 10, 17, 31, 17, 17], // Ao
    [0, 7, 12, 20, 23, 28, 20, 23], // AE
    [14, 17, 16, 16, 17, 14, 2, 6], // C,
    [8, 4, 0, 31, 16, 30, 16, 31], // E\
    [2, 4, 0, 31, 16, 30, 16, 31], // E/
    [4, 10, 0, 31, 16, 30, 16, 31], // E^
    [0, 10, 0, 31, 16, 30, 16, 31], // E:
    [8, 4, 0, 14, 4, 4, 4, 14], // I\
    [2, 4, 0, 14, 4, 4, 4, 14], // I/
    [4, 10, 0, 14, 4, 4, 4, 14], // I^
    [0, 10, 0, 14, 4, 4, 4, 14], // I:
    [0, 14, 9, 9, 29, 9, 9, 14], // -D
    [13, 18, 0, 17, 25, 21, 19, 17], // N~
    [8, 4, 14, 17, 17, 17, 17, 14], // O\
    [2, 4, 14, 17, 17, 17, 17, 14], // O/
    [4, 10, 0, 14, 17, 17, 17, 14], // O^
    [13, 18, 0, 14, 17, 17, 17, 14], // O~
    [10, 0, 14, 17, 17, 17, 17, 14], // O:
    [0, 0, 17, 10, 4, 10, 17], // X
    [0, 14, 4, 14, 21, 14, 4, 14], // .F
    [8, 4, 17, 17, 17, 17, 17, 14], // U\
    [2, 4, 17, 17, 17, 17, 17, 14], // U/
    [4, 10, 0, 17, 17, 17, 17, 14], // U^
    [10, 0, 17, 17, 17, 17, 17, 14], // U:
    [2, 4, 17, 10, 4, 4, 4, 4], // Y/
    [24, 8, 14, 9, 9, 14, 8, 28], // -P
    [0, 6, 9, 9, 14, 9, 9, 22], // beta
    [8, 4, 0, 14, 1, 15, 17, 15], // a\
    [2, 4, 0, 14, 1, 15, 17, 15], // a/
    [4, 10, 0, 14, 1, 15, 17, 15], // a^
    [13, 18, 0, 14, 1, 15, 17, 15], // a~
    [0, 10, 0, 14, 1, 15, 17, 15], // a:
    [4, 10, 4, 14, 1, 15, 17, 15], // ao
    [0, 0, 26, 5, 15, 20, 21, 10], // ae
    [0, 0, 14, 16, 17, 14, 4, 12], // c,
    [8, 4, 0, 14, 17, 31, 16, 14], // e\
    [2, 4, 0, 14, 17, 31, 16, 14], // e/
    [4, 10, 0, 14, 17, 31, 16, 14], // e^
    [0, 10, 0, 14, 17, 31, 16, 14], // e:
    [8, 4, 0, 4, 12, 4, 4, 14], // i\
    [2, 4, 0, 4, 12, 4, 4, 14], // i/
    [4, 10, 0, 4, 12, 4, 4, 14], // i^
    [0, 10, 0, 4, 12, 4, 4, 14], // i:
    [0, 20, 8, 20, 2, 15, 17, 14], // -d
    [13, 18, 0, 22, 25, 17, 17, 17], // n~
    [8, 4, 0, 14, 17, 17, 17, 14], // o\
    [2, 4, 0, 14, 17, 17, 17, 14], // o/
    [0, 4, 10, 0, 14, 17, 17, 14], // o^
    [0, 13, 18, 0, 14, 17, 17, 14], // o~
    [0, 10, 0, 14, 17, 17, 17, 14], // o:
    [0, 0, 4, 0, 31, 0, 4], // :/
    [0, 2, 4, 14, 21, 14, 4, 8], // .f
    [8, 4, 0, 17, 17, 17, 19, 13], // u\
    [2, 4, 0, 17, 17, 17, 19, 13], // u/
    [4, 10, 0, 17, 17, 17, 19, 13], // u^
    [0, 10, 0, 17, 17, 17, 19, 13], // u:
    [2, 4, 0, 17, 17, 15, 1, 14], // y/
    [0, 12, 4, 6, 5, 6, 4, 14], // p-
    [0, 10, 0, 17, 17, 15, 1, 14] // y:
  ],
  cmap: {
    // Greek
    0x391: 0x41, 0x392: 0x42, 0x393: 0x92, 0x395: 0x45, 0x396: 0x5a, 0x397: 0x48, 0x398: 0x99, 0x399: 0x49,
    0x39a: 0x4b, 0x39c: 0x4d, 0x39d: 0x4e, 0x39f: 0x4f, 0x3a0: 0x87, 0x3a1: 0x50, 0x3a3: 0x94, 0x3a4: 0x54,
    0x3a5: 0x59, 0x3a6: 0xd8, 0x3a7: 0x58, 0x3a9: 0x9a, 0x3aa: 0xcf, 0x3ab: 0xff, 0x3b1: 0x90, 0x3b2: 0xdf,
    0x3b4: 0x9b, 0x3b5: 0x9e, 0x3b8: 0x99, 0x3bc: 0xb5, 0x3bf: 0x6f, 0x3c0: 0x93, 0x3c3: 0x95, 0x3c4: 0x97, 0x3c9: 0xb8,
    // Cyrillic
    0x400: 0xc8, 0x450: 0xc8, 0x401: 0xcb, 0x451: 0xcb, 0x404: 0x45, 0x454: 0x45, 0x405: 0x53, 0x455: 0x53,
    0x406: 0x49, 0x456: 0x49, 0x407: 0xcf, 0x457: 0xcf, 0x408: 0x4a, 0x458: 0x4a,
    0x410: 0x41, 0x430: 0x41, 0x411: 0x80, 0x431: 0x80, 0x412: 0x42, 0x432: 0x42, 0x413: 0x92, 0x433: 0x92,
    0x414: 0x81, 0x434: 0x81, 0x415: 0x45, 0x435: 0x45, 0x416: 0x82, 0x436: 0x82, 0x417: 0x83, 0x437: 0x83,
    0x418: 0x84, 0x438: 0x84, 0x419: 0x85, 0x439: 0x85, 0x41a: 0x4b, 0x43a: 0x4b, 0x41b: 0x86, 0x43b: 0x86,
    0x41c: 0x4d, 0x43c: 0x4d, 0x41d: 0x48, 0x43d: 0x48, 0x41e: 0x4f, 0x43e: 0x4f, 0x41f: 0x87, 0x43f: 0x87,
    0x420: 0x50, 0x440: 0x50, 0x421: 0x43, 0x441: 0x43, 0x422: 0x54, 0x442: 0x54, 0x423: 0x88, 0x443: 0x88,
    0x424: 0xd8, 0x444: 0xd8, 0x425: 0x58, 0x445: 0x58, 0x426: 0x89, 0x446: 0x89, 0x427: 0x8a, 0x447: 0x8a,
    0x428: 0x8b, 0x448: 0x8b, 0x429: 0x8c, 0x449: 0x8c, 0x42a: 0x8d, 0x44a: 0x8d, 0x42b: 0x8e, 0x44b: 0x8e,
    0x42c: 0x62, 0x44c: 0x62, 0x42d: 0x8f, 0x44d: 0x8f, 0x42e: 0xac, 0x44e: 0xac, 0x42f: 0xad, 0x44f: 0xad,
    // Misc
    0x201c: 0x12, 0x201d: 0x13, 0x20a7: 0xb4, 0x2190: 0x1b, 0x2191: 0x18, 0x2192: 0x1a, 0x2193: 0x19, 0x21b2: 0x17,
    0x2211: 0x94, 0x221e: 0x9c, 0x2229: 0x9f, 0x222a: 0x55, 0x222e: 0xf8, 0x2264: 0x1c, 0x2265: 0x1d, 0x22c2: 0x9f,
    0x22c3: 0x55, 0x237a: 0x90, 0x23eb: 0x14, 0x23ec: 0x15, 0x23f4: 0x11, 0x23f5: 0x10, 0x23f6: 0x1e, 0x23f7: 0x1f,
    0x23f8: 0xa0, 0x23fa: 0x16, 0x2665: 0x9d, 0x2669: 0x91, 0x266a: 0x91, 0x266b: 0x92, 0x266c: 0x92, 0x2a0d: 0xa8,
    0xffe5: 0xa5, 0x5186: 0xa5, // Yen characters
    0x1F514: 0x98
  }
};

////////////////////////////
var cpList = {
  "jp": _jp,
  "eu": _eu
}