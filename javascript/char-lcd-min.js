const CW=5,CH=8,CL=10;class CharLCD{constructor(r){var a=(r,a,e,t)=>{if(!(a!=parseInt(a)||a<0||a>=r.arg.rows||e!=parseInt(e)||e<0||e>=r.arg.cols)){t||(t=[]);for(var o=5*(a*r.arg.cols+e)*8-1,s=0;s<8;s++){for(var n=t[s]==parseInt(t[s])?parseInt(t[s]):0,g=0;g<5;g++)r.pix[o+5-g].style.backgroundColor=1<<g&n?r.arg.on:r.arg.off;o+=5}}},e=(r,e,t,o)=>{var s=o.charCodeAt(0);a(r,e,t,r.font[s]?r.font[s]:cpList[r.rom].font[s])},t={font:{},pix:[],rom:"eu",arg:{rows:2,cols:16,pixel_size:3,break_size:1,off:"#cd2",on:"#143",large:!1}};if(r){for(var o in r)void 0!==t.arg[o]&&t.arg[o]==parseInt(t.arg[o])?r[o]==parseInt(r[o])&&r[o]>0&&(t.arg[o]=parseInt(r[o])):t.arg[o]=r[o];if(r.rom){var s=r.rom.toString().toLowerCase();cpList[s]&&(t.rom=s)}}"string"==typeof t.arg.at&&(t.arg.at=document.getElementById(t.arg.at)),(r=>{var a,e,t,o,s,n,g,i=r.arg.pixel_size+r.arg.break_size,p=r.arg.large?10:8,l=document.createElement("div");for(l.className="lcd_panel",l.style.width=i*(6*r.arg.cols+1)+r.arg.break_size+"px",l.style.height=i*((1+p)*r.arg.rows+1)+r.arg.break_size+"px",l.style.backgroundColor=r.arg.off,a=0;a<r.arg.rows;a++)for(e=0;e<r.arg.cols;e++)for(t=0;t<8;t++)for(o=0;o<5;o++)s=i*(6*e+1+o)+r.arg.break_size,n=i*((1+p)*a+t)+r.arg.break_size,(g=document.createElement("div")).style.top=n+"px",g.style.left=s+"px",g.style.width=r.arg.pixel_size+"px",g.style.height=r.arg.pixel_size+"px",g.style.backgroundColor=r.arg.off,r.pix.push(g),l.appendChild(g);r.arg.at.appendChild(l)})(t),this.set=(r,e,o)=>{a(t,r,e,o)},this.char=(r,a,o)=>{e(t,r,a,o)},this.text=(r,a,o)=>{((r,a,t,o)=>{var s,n,g;if(!(a!=parseInt(a)||a<0||a>=r.arg.rows||t!=parseInt(t)||t<0||t>=r.arg.cols))for(s=0;s<o.length;s++)if("\n"==o[s]){if(t=0,a++>=r.arg.rows)return}else{if((g=o.charCodeAt(s))>=55296&&g<=56319&&(g=65536+1024*(g-55296)+((n=o[++s]?o.charCodeAt(s):0)-56320)),cpList[r.rom].cmap[g]&&(g=cpList[r.rom].cmap[g]),g instanceof Array){for(n=0;n<g.length;n++)e(r,a,t,String.fromCharCode(g[n]));t+=g.length}else g>255&&(g=63),e(r,a,t,String.fromCharCode(g)),t++;if(t>=r.arg.cols)continue}})(t,r,a,o)},this.font=(r,a)=>{((r,a,e)=>{r.font[a]=e})(t,r,a)}}}var _jp={name:"Japan CP",font:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[4,4,4,4,0,0,4],[10,10,10],[10,10,31,10,31,10,10],[4,15,20,14,5,30,4],[24,25,2,4,8,19,3],[12,18,20,8,21,18,13],[12,4,8],[2,4,8,8,8,4,2],[8,4,2,2,2,4,8],[0,4,21,14,21,4],[0,4,4,31,4,4],[0,0,0,0,12,4,8],[0,0,0,31],[0,0,0,0,0,12,12],[0,1,2,4,8,16],[14,17,19,21,25,17,14],[4,12,4,4,4,4,14],[14,17,1,2,4,8,31],[31,2,4,2,1,17,14],[2,6,10,18,31,2,2],[31,16,30,1,1,17,14],[6,8,16,30,17,17,14],[31,1,2,4,8,8,8],[14,17,17,14,17,17,14],[14,17,17,15,1,2,12],[0,12,12,0,12,12],[0,12,12,0,12,4,8],[2,4,8,16,8,4,2],[0,0,31,0,31],[8,4,2,1,2,4,8],[14,17,1,2,4,0,4],[14,17,1,13,21,21,14],[14,17,17,31,17,17,17],[30,17,17,30,17,17,30],[14,17,16,16,16,17,14],[28,18,17,17,17,18,28],[31,16,16,30,16,16,31],[31,16,16,30,16,16,16],[14,17,16,23,17,17,15],[17,17,17,31,17,17,17],[14,4,4,4,4,4,14],[14,2,2,2,2,18,12],[17,18,20,24,20,18,17],[16,16,16,16,16,16,31],[17,27,21,21,17,17,17],[17,17,25,21,19,17,17],[14,17,17,17,17,17,14],[30,17,17,30,16,16,16],[14,17,17,17,21,18,13],[30,17,17,30,20,18,17],[15,16,16,14,1,1,30],[31,4,4,4,4,4,4],[17,17,17,17,17,17,14],[17,17,17,17,17,10,4],[17,17,17,21,21,21,10],[17,17,10,4,10,17,17],[17,17,17,10,4,4,4],[31,1,2,4,8,16,31],[14,8,8,8,8,8,14],[17,10,31,4,31,4,4],[14,2,2,2,2,2,14],[4,10,17],[0,0,0,0,0,0,31],[8,4,2],[0,0,14,1,15,17,15],[16,16,22,25,17,17,30],[0,0,14,16,16,17,14],[1,1,13,19,17,17,15],[0,0,14,17,31,16,14],[6,9,8,28,8,8,8],[0,15,17,17,15,1,14],[16,16,22,25,17,17,17],[4,0,12,4,4,4,14],[2,0,6,2,2,18,12],[16,16,18,20,24,20,18],[12,4,4,4,4,4,31],[0,0,26,21,21,17,17],[0,0,22,25,17,17,17],[0,0,14,17,17,17,14],[0,0,30,17,30,16,16],[0,0,13,19,15,1,1],[0,0,22,25,16,16,16],[0,0,14,16,14,1,30],[8,8,28,8,8,9,6],[0,0,17,17,17,19,13],[0,0,17,17,17,10,4],[0,0,17,17,21,21,10],[0,0,17,10,4,10,17],[0,0,17,17,15,1,14],[0,0,31,2,4,8,31],[2,4,4,8,4,4,2],[4,4,4,4,4,4,4],[8,4,4,2,4,4,8],[0,4,2,31,2,4],[0,4,8,31,8,4],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[0,0,0,0,28,20,28],[7,4,4,4],[0,0,0,4,4,4,28],[0,0,0,0,16,8,4],[0,0,0,12,12],[0,31,1,31,1,2,4],[0,0,31,1,6,4,8],[0,0,2,4,12,20,4],[0,0,4,31,17,1,14],[0,0,0,31,4,4,31],[0,0,2,31,6,10,18],[0,0,8,31,9,10,8],[0,0,0,14,2,2,31],[0,0,30,2,30,2,30],[0,0,0,21,21,1,6],[0,0,0,31],[31,1,5,6,4,4,8],[1,2,4,12,20,4,4],[4,31,17,17,1,2,4],[0,31,4,4,4,4,31],[2,31,2,6,10,18,2],[8,31,9,9,9,9,18],[4,31,4,31,4,4,4],[0,15,9,17,1,2,12],[8,15,18,2,2,2,4],[0,31,1,1,1,1,31],[10,31,10,10,2,4,8],[0,24,1,25,1,2,28],[0,31,1,2,4,10,17],[8,31,9,10,8,8,7],[0,17,17,9,1,2,12],[0,15,9,21,3,2,12],[2,28,4,31,4,4,8],[0,21,21,21,1,2,4],[14,0,31,4,4,4,8],[8,8,8,12,10,8,8],[4,4,31,4,4,8,16],[0,14,0,0,0,0,31],[0,31,1,10,4,10,16],[4,31,2,4,14,21,4],[2,2,2,2,2,4,8],[0,4,2,17,17,17,17],[16,16,31,16,16,16,15],[0,31,1,1,1,2,12],[0,8,20,2,1,1],[4,31,4,4,21,21,4],[0,31,1,1,10,4,2],[0,14,0,14,0,14,1],[0,4,8,16,17,31,1],[0,1,1,10,4,10,16],[0,31,8,31,8,8,7],[8,8,31,9,10,8,8],[0,14,2,2,2,2,31],[0,31,1,31,1,1,31],[14,0,31,1,1,2,4],[18,18,18,18,2,4,8],[0,4,20,20,21,21,22],[0,16,16,17,18,20,24],[0,31,17,17,17,17,31],[0,31,17,17,1,2,4],[0,24,0,1,1,2,28],[4,18,8],[28,20,28],[0,0,9,21,18,18,13],[10,0,14,1,15,17,15],[0,0,14,17,30,17,30,16,16,16],[0,0,14,16,12,17,14],[0,0,17,17,17,19,29,16,16,16],[0,0,15,20,18,17,14],[0,0,6,9,17,17,30,16,16,16],[0,0,15,17,17,17,15,1,1,14],[0,0,7,4,4,20,8],[0,2,26,2],[2,0,6,2,2,2,2,2,18,12],[0,20,8,20],[0,4,14,20,21,14,4],[8,8,28,8,28,8,15],[14,0,22,25,17,17,17],[10,0,14,17,17,17,14],[0,0,22,25,17,17,30,16,16,16],[0,0,13,19,17,17,15,1,1,1],[0,14,17,31,17,17,14],[0,0,0,11,21,26],[0,0,14,17,17,10,27],[10,0,17,17,17,19,13],[31,16,8,4,8,16,31],[0,0,31,10,10,10,19],[31,0,17,10,4,10,17],[0,0,17,17,17,17,15,1,1,14],[0,1,30,4,31,4,4],[0,0,31,8,15,9,17],[0,0,31,21,31,17,17],[0,0,4,0,31,0,4],[],[31,31,31,31,31,31,31,31,31,31]],cmap:{92:164,165:92,65509:92,20870:252,162:236,163:237,181:228,183:165,228:225,223:226,241:238,246:239,247:253,913:65,914:66,917:69,918:90,919:72,920:242,921:73,922:75,924:77,925:78,927:79,929:80,931:246,932:84,933:89,935:88,937:244,945:224,946:226,949:227,952:242,956:228,959:111,960:247,961:230,963:229,8592:127,8594:126,8734:243,8730:232,9082:224,12289:164,12290:161,12300:162,12301:163,12441:222,12442:223,12443:222,12444:223,12448:61,12449:167,12450:177,12451:168,12452:178,12453:169,12454:179,12455:170,12456:180,12457:171,12458:181,12459:182,12460:[182,222],12461:183,12462:[183,222],12463:184,12464:[184,222],12465:185,12466:[185,222],12467:186,12468:[186,222],12469:187,12470:[187,222],12471:188,12472:[188,222],12473:189,12474:[189,222],12475:190,12476:[190,222],12477:191,12478:[191,222],12479:192,12480:[192,222],12481:193,12482:[193,222],12483:175,12484:194,12485:[194,222],12486:195,12487:[195,222],12488:196,12489:[196,222],12490:197,12491:198,12492:199,12493:200,12494:201,12495:202,12496:[202,222],12497:[202,223],12498:203,12499:[203,222],12500:[203,223],12501:204,12502:[204,222],12503:[204,223],12504:205,12505:[205,222],12506:[205,223],12507:206,12508:[206,222],12509:[206,223],12510:207,12511:208,12512:209,12513:210,12514:211,12515:172,12516:212,12517:173,12518:213,12519:174,12520:214,12521:215,12522:216,12523:217,12524:218,12525:219,12526:220,12527:220,12528:178,12529:180,12530:166,12531:221,12532:[179,222],12533:182,12534:185,12535:[220,222],12536:[178,222],12537:[180,222],12538:[166,222],12539:165,12540:176,12541:164,12542:[164,222],12543:[186,196],65377:161,65378:162,65379:163,65380:164,65381:165,65382:166,65383:167,65384:168,65385:169,65386:170,65387:171,65388:172,65389:173,65390:174,65391:175,65392:176,65393:177,65394:178,65395:179,65396:180,65397:181,65398:182,65399:183,65400:184,65401:185,65402:186,65403:187,65404:188,65405:189,65406:190,65407:191,65408:192,65409:193,65410:194,65411:195,65412:196,65413:197,65414:198,65415:199,65416:200,65417:201,65418:202,65419:203,65420:204,65421:205,65422:206,65423:207,65424:208,65425:209,65426:210,65427:211,65428:212,65429:213,65430:214,65431:215,65432:216,65433:217,65434:218,65435:219,65436:220,65437:221,65438:222,65439:223}},_eu={name:"Eng CP",font:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[0,8,12,14,15,14,12,8],[0,2,6,14,30,14,6,2],[0,9,18,27],[0,27,9,18],[0,4,14,31,0,4,14,31],[0,31,14,4,0,31,14,4],[0,0,14,31,31,31,14],[0,1,1,5,9,31,8,4],[0,4,14,21,4,4,4,4],[0,4,4,4,4,21,14,4],[0,0,4,2,31,2,4],[0,0,4,8,31,8,4],[0,2,4,8,4,2,0,31],[0,8,4,2,4,8,0,31],[0,0,4,4,14,14,31],[0,0,31,14,14,4,4],[],[0,4,4,4,4,0,0,4],[0,10,10,10],[0,10,10,31,10,31,10,10],[0,4,15,20,14,5,30,4],[0,24,25,2,4,8,19,3],[0,12,18,20,8,21,18,13],[0,12,4,8],[0,2,4,8,8,8,4,2],[0,8,4,2,2,2,4,8],[0,0,4,21,14,21,4],[0,0,4,4,31,4,4],[0,0,0,0,0,12,4,8],[0,0,0,0,31],[0,0,0,0,0,0,12,12],[0,0,1,2,4,8,16],[0,14,17,19,21,25,17,14],[0,4,12,4,4,4,4,14],[0,14,17,1,2,4,8,31],[0,31,2,4,2,1,17,14],[0,2,6,10,18,31,2,2],[0,31,16,30,1,1,17,14],[0,6,8,16,30,17,17,14],[0,31,1,2,4,8,8,8],[0,14,17,17,14,17,17,14],[0,14,17,17,15,1,2,12],[0,0,12,12,0,12,12],[0,0,12,12,0,12,4,8],[0,2,4,8,16,8,4,2],[0,0,0,31,0,31],[0,8,4,2,1,2,4,8],[0,14,17,1,2,4,0,4],[0,14,17,1,13,21,21,14],[0,4,10,17,17,31,17,17],[0,30,17,17,30,17,17,30],[0,14,17,16,16,16,17,14],[0,28,18,17,17,17,18,28],[0,31,16,16,30,16,16,31],[0,31,16,16,30,16,16,16],[0,14,17,16,23,17,17,15],[0,17,17,17,31,17,17,17],[0,14,4,4,4,4,4,14],[0,14,2,2,2,2,18,12],[0,17,18,20,24,20,18,17],[0,16,16,16,16,16,16,31],[0,17,27,21,21,17,17,17],[0,17,17,25,21,19,17,17],[0,14,17,17,17,17,17,14],[0,30,17,17,30,16,16,16],[0,14,17,17,17,21,18,13],[0,30,17,17,30,20,18,17],[0,15,16,16,14,1,1,30],[0,31,4,4,4,4,4,4],[0,17,17,17,17,17,17,14],[0,17,17,17,17,17,10,4],[0,17,17,17,21,21,21,10],[0,17,17,10,4,10,17,17],[0,17,17,17,10,4,4,4],[0,31,1,2,4,8,16,31],[0,14,8,8,8,8,8,14],[0,0,16,8,4,2,1],[0,14,2,2,2,2,2,14],[0,4,10,17],[0,0,0,0,0,0,0,31],[0,8,4,2],[0,0,0,14,1,15,17,15],[0,16,16,22,25,17,17,30],[0,0,0,14,16,16,17,14],[0,1,1,13,19,17,17,15],[0,0,0,14,17,31,16,14],[0,6,9,8,28,8,8,8],[0,0,15,17,17,15,1,14],[0,16,16,22,25,17,17,17],[0,4,0,4,12,4,4,14],[0,2,0,6,2,2,18,12],[0,16,16,18,20,24,20,18],[0,12,4,4,4,4,4,31],[0,0,0,26,21,21,17,17],[0,0,0,22,25,17,17,17],[0,0,0,14,17,17,17,14],[0,0,0,30,17,30,16,16],[0,0,0,13,19,15,1,1],[0,0,0,22,25,16,16,16],[0,0,0,14,16,14,1,30],[0,8,8,28,8,8,9,6],[0,0,0,17,17,17,19,13],[0,0,0,17,17,17,10,4],[0,0,0,17,17,21,21,10],[0,0,0,17,10,4,10,17],[0,0,0,17,17,15,1,14],[0,0,0,31,2,4,8,31],[0,2,4,4,8,4,4,2],[0,4,4,4,4,4,4,4],[0,8,4,4,2,4,4,8],[0,0,0,0,13,18],[0,4,10,17,17,17,31],[0,31,17,16,30,17,17,30],[15,5,5,9,17,31,17,17],[0,21,21,21,14,21,21,21],[0,30,1,1,6,1,1,30],[0,17,17,19,21,25,17,17],[10,4,17,19,21,25,17,17],[0,15,5,5,5,5,21,9],[0,31,17,17,17,17,17,17],[0,17,17,17,10,4,8,16],[0,17,17,17,17,17,31,1],[0,17,17,17,15,1,1,1],[0,0,21,21,21,21,21,31],[0,21,21,21,21,21,31,1],[0,24,8,8,14,9,9,14],[0,17,17,17,25,21,21,25],[0,14,17,5,11,1,17,14],[0,0,0,9,21,18,18,13],[0,4,6,5,5,4,28,28],[0,31,17,16,16,16,16,16],[0,0,0,31,10,10,10,19],[0,31,16,8,4,8,16,31],[0,0,0,15,18,18,18,12],[6,5,7,5,5,29,27,3],[0,0,1,14,20,4,4,2],[0,4,14,14,14,31,4],[0,14,17,17,31,17,17,14],[0,0,14,17,17,17,10,27],[0,6,9,4,10,17,17,14],[0,0,0,11,21,26],[0,0,10,31,31,31,14,4],[0,0,0,14,16,12,17,14],[0,14,17,17,17,17,17,17],[0,27,27,27,27,27,27,27],[0,4,0,0,4,4,4,4],[0,4,14,20,20,21,14,4],[0,6,8,8,28,8,9,22],[0,0,17,14,10,14,17],[0,17,10,31,4,31,4,4],[0,4,4,4,0,4,4,4],[0,6,9,4,10,4,18,12],[0,2,5,4,31,4,20,8],[0,31,17,21,23,21,17,31],[0,14,1,15,17,15,0,31],[0,0,5,10,20,10,5],[0,18,21,21,29,21,21,18],[0,15,17,17,15,5,9,17],[0,31,17,21,17,19,21,31],[0,4,8,12],[12,18,18,18,12],[0,4,4,31,4,4,0,31],[12,18,4,8,30],[28,2,12,2,28],[28,18,28,16,18,23,18,3],[0,17,17,17,19,29,16,16],[0,15,19,19,15,3,3,3],[0,0,0,0,12,12],[0,0,0,10,17,21,21,10],[8,24,8,8,28],[0,14,17,17,17,14,0,31],[0,0,20,10,5,10,20],[17,18,20,10,22,10,15,2],[17,18,20,10,21,1,2,7],[24,8,24,9,27,5,7,1],[0,4,0,4,8,16,17,14],[8,4,4,10,17,31,17,17],[2,4,4,10,17,31,17,17],[4,10,0,14,17,31,17,17],[13,18,0,14,17,31,17,17],[10,0,4,10,17,31,17,17],[4,10,4,10,17,31,17,17],[0,7,12,20,23,28,20,23],[14,17,16,16,17,14,2,6],[8,4,0,31,16,30,16,31],[2,4,0,31,16,30,16,31],[4,10,0,31,16,30,16,31],[0,10,0,31,16,30,16,31],[8,4,0,14,4,4,4,14],[2,4,0,14,4,4,4,14],[4,10,0,14,4,4,4,14],[0,10,0,14,4,4,4,14],[0,14,9,9,29,9,9,14],[13,18,0,17,25,21,19,17],[8,4,14,17,17,17,17,14],[2,4,14,17,17,17,17,14],[4,10,0,14,17,17,17,14],[13,18,0,14,17,17,17,14],[10,0,14,17,17,17,17,14],[0,0,17,10,4,10,17],[0,14,4,14,21,14,4,14],[8,4,17,17,17,17,17,14],[2,4,17,17,17,17,17,14],[4,10,0,17,17,17,17,14],[10,0,17,17,17,17,17,14],[2,4,17,10,4,4,4,4],[24,8,14,9,9,14,8,28],[0,6,9,9,14,9,9,22],[8,4,0,14,1,15,17,15],[2,4,0,14,1,15,17,15],[4,10,0,14,1,15,17,15],[13,18,0,14,1,15,17,15],[0,10,0,14,1,15,17,15],[4,10,4,14,1,15,17,15],[0,0,26,5,15,20,21,10],[0,0,14,16,17,14,4,12],[8,4,0,14,17,31,16,14],[2,4,0,14,17,31,16,14],[4,10,0,14,17,31,16,14],[0,10,0,14,17,31,16,14],[8,4,0,4,12,4,4,14],[2,4,0,4,12,4,4,14],[4,10,0,4,12,4,4,14],[0,10,0,4,12,4,4,14],[0,20,8,20,2,15,17,14],[13,18,0,22,25,17,17,17],[8,4,0,14,17,17,17,14],[2,4,0,14,17,17,17,14],[0,4,10,0,14,17,17,14],[0,13,18,0,14,17,17,14],[0,10,0,14,17,17,17,14],[0,0,4,0,31,0,4],[0,2,4,14,21,14,4,8],[8,4,0,17,17,17,19,13],[2,4,0,17,17,17,19,13],[4,10,0,17,17,17,19,13],[0,10,0,17,17,17,19,13],[2,4,0,17,17,15,1,14],[0,12,4,6,5,6,4,14],[0,10,0,17,17,15,1,14]],cmap:{913:65,914:66,915:146,917:69,918:90,919:72,920:153,921:73,922:75,924:77,925:78,927:79,928:135,929:80,931:148,932:84,933:89,934:216,935:88,937:154,938:207,939:255,945:144,946:223,948:155,949:158,952:153,956:181,959:111,960:147,963:149,964:151,969:184,1024:200,1104:200,1025:203,1105:203,1028:69,1108:69,1029:83,1109:83,1030:73,1110:73,1031:207,1111:207,1032:74,1112:74,1040:65,1072:65,1041:128,1073:128,1042:66,1074:66,1043:146,1075:146,1044:129,1076:129,1045:69,1077:69,1046:130,1078:130,1047:131,1079:131,1048:132,1080:132,1049:133,1081:133,1050:75,1082:75,1051:134,1083:134,1052:77,1084:77,1053:72,1085:72,1054:79,1086:79,1055:135,1087:135,1056:80,1088:80,1057:67,1089:67,1058:84,1090:84,1059:136,1091:136,1060:216,1092:216,1061:88,1093:88,1062:137,1094:137,1063:138,1095:138,1064:139,1096:139,1065:140,1097:140,1066:141,1098:141,1067:142,1099:142,1068:98,1100:98,1069:143,1101:143,1070:172,1102:172,1071:173,1103:173,8220:18,8221:19,8359:180,8592:27,8593:24,8594:26,8595:25,8626:23,8721:148,8734:156,8745:159,8746:85,8750:248,8804:28,8805:29,8898:159,8899:85,9082:144,9195:20,9196:21,9204:17,9205:16,9206:30,9207:31,9208:160,9210:22,9829:157,9833:145,9834:145,9835:146,9836:146,10765:168,65509:165,20870:165,128276:152}},cpList={jp:_jp,eu:_eu};