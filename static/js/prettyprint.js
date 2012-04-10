/*
Copyright (c) 2009 James Padolsey.  All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

   1. Redistributions of source code must retain the above copyright
	  notice, this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright
	  notice, this list of conditions and the following disclaimer in the
	  documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY James Padolsey ``AS IS'' AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL James Padolsey OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
SUCH DAMAGE.

The views and conclusions contained in the software and documentation are
those of the authors and should not be interpreted as representing official
policies, either expressed or implied, of James Padolsey.

 AUTHOR James Padolsey (http://james.padolsey.com)
 VERSION 1.03.0
 UPDATED 29-10-2011
 CONTRIBUTORS
	David Waller
    Benjamin Drucker

*/

var prettyPrint=function(){var b={el:function(a,c){var d=document.createElement(a),e;if((c=b.merge({},c))&&c.style)b.applyCSS(d,c.style),delete c.style;for(e in c)c.hasOwnProperty(e)&&(d[e]=c[e]);return d},applyCSS:function(b,c){for(var d in c)if(c.hasOwnProperty(d))try{b.style[d]=c[d]}catch(e){}},txt:function(b){return document.createTextNode(b)},row:function(a,c,d){var d=d||"td",e=b.count(a,null)+1,f=b.el("tr"),i,j={style:b.getStyles(d,c),colSpan:e,onmouseover:function(){b.forEach(this.parentNode.childNodes,
function(a){"td"===a.nodeName.toLowerCase()&&b.applyCSS(a,b.getStyles("td_hover",c))})},onmouseout:function(){b.forEach(this.parentNode.childNodes,function(a){"td"===a.nodeName.toLowerCase()&&b.applyCSS(a,b.getStyles("td",c))})}};b.forEach(a,function(a){null!==a&&(i=b.el(d,j),a.nodeType?i.appendChild(a):i.innerHTML=b.shorten(a.toString()),f.appendChild(i))});return f},hRow:function(a,c){return b.row(a,c,"th")},table:function(a,c){var a=a||[],d={style:b.getStyles("thead",c)},e={style:b.getStyles("tbody",
c)},f={style:b.getStyles("table",c)},f=b.el("table",f),d=b.el("thead",d),e=b.el("tbody",e);a.length&&(f.appendChild(d),d.appendChild(b.hRow(a,c)));f.appendChild(e);return{node:f,tbody:e,thead:d,appendChild:function(a){this.tbody.appendChild(a)},addRow:function(a,d,n){this.appendChild(b.row.call(b,a,d||c,n));return this}}},shorten:function(a){a=a.replace(/^\s\s*|\s\s*$|\n/g,"");return 40<a.length?a.substring(0,39)+"...":a},htmlentities:function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,
"&gt;")},merge:function(a,c){"object"!==typeof a&&(a={});for(var d in c)if(c.hasOwnProperty(d)){var e=c[d];a[d]="object"===typeof e?b.merge(a[d],e):e}d=2;for(e=arguments.length;d<e;d++)b.merge(a,arguments[d]);return a},count:function(a,b){for(var d=0,e=0,f=a.length;e<f;e++)a[e]===b&&d++;return d},thead:function(a){return a.getElementsByTagName("thead")[0]},forEach:function(a,b,d){d||(d=b);for(var b=a.length,e=-1;++e<b&&!1!==d(a[e],e,a););return!0},type:function(a){try{if(null===a)return"null";if(void 0===
a)return"undefined";var b=Object.prototype.toString.call(a).match(/\s(.+?)\]/)[1].toLowerCase();return a.nodeType?1===a.nodeType?"domelement":"domnode":/^(string|number|array|regexp|function|date|boolean)$/.test(b)?b:"object"===typeof a?a.jquery&&"string"===typeof a.jquery?"jquery":"object":a===window||a===document?"object":"default"}catch(d){return"default"}},within:function(b){return{is:function(c){for(var d in b)if(b[d]===c)return d;return""}}},common:{circRef:function(a,c){return b.expander("[POINTS BACK TO <strong>"+
c+"</strong>]","Click to show this item anyway",function(){this.parentNode.appendChild(g(a,{maxDepth:1}))})},depthReached:function(a){return b.expander("[DEPTH REACHED]","Click to show this item anyway",function(){try{this.parentNode.appendChild(g(a,{maxDepth:1}))}catch(c){this.parentNode.appendChild(b.table(["ERROR OCCURED DURING OBJECT RETRIEVAL"],"error").addRow([c.message]).node)}})}},getStyles:function(a,c){c=g.settings.styles[c]||{};return b.merge({},g.settings.styles["default"][a],c[a])},expander:function(a,
c,d){return b.el("a",{innerHTML:b.shorten(a)+' <b style="visibility:hidden;">[+]</b>',title:c,onmouseover:function(){this.getElementsByTagName("b")[0].style.visibility="visible"},onmouseout:function(){this.getElementsByTagName("b")[0].style.visibility="hidden"},onclick:function(){this.style.display="none";d.call(this);return!1},style:{cursor:"pointer"}})},stringify:function(a){var c=b.type(a),d,e=!0;if("array"===c)return d="[",b.forEach(a,function(a,c){d+=(0===c?"":", ")+b.stringify(a)}),d+"]";if("object"===
typeof a){d="{";for(var f in a)a.hasOwnProperty(f)&&(d+=(e?"":", ")+f+":"+b.stringify(a[f]),e=!1);return d+"}"}return"regexp"===c?"/"+a.source+"/":"string"===c?'"'+a.replace(/"/g,'\\"')+'"':a.toString()},headerGradient:function(){var b=document.createElement("canvas");if(!b.getContext)return"";var c=b.getContext("2d");b.height=30;b.width=1;var d=c.createLinearGradient(0,0,0,30);d.addColorStop(0,"rgba(0,0,0,0)");d.addColorStop(1,"rgba(0,0,0,0.25)");c.fillStyle=d;c.fillRect(0,0,1,30);return"url("+(b.toDataURL&&
b.toDataURL()||"")+")"}()},g=function(a,c){var c=c||{},d=b.merge({},g.config,c),e=b.el("div"),f={},i=!1;g.settings=d;var j={string:function(a){return b.txt('"'+b.shorten(a.replace(/"/g,'\\"'))+'"')},number:function(a){return b.txt(a)},regexp:function(a){var c=b.table(["RegExp",null],"regexp"),e=b.table(),f=b.expander("/"+a.source+"/","Click to show more",function(){this.parentNode.appendChild(c.node)});e.addRow(["g",a.global]).addRow(["i",a.ignoreCase]).addRow(["m",a.multiline]);c.addRow(["source",
"/"+a.source+"/"]).addRow(["flags",e.node]).addRow(["lastIndex",a.lastIndex]);return d.expanded?c.node:f},domelement:function(a){var c=b.table(["DOMElement",null],"domelement"),e=a.nodeName||"";c.addRow(["tag","&lt;"+e.toLowerCase()+"&gt;"]);b.forEach(["id","className","innerHTML","src","href"],function(d){a[d]&&c.addRow([d,b.htmlentities(a[d])])});return d.expanded?c.node:b.expander("DOMElement ("+e.toLowerCase()+")","Click to show more",function(){this.parentNode.appendChild(c.node)})},domnode:function(a){var c=
b.table(["DOMNode",null],"domelement"),e=b.htmlentities((a.data||"UNDEFINED").replace(/\n/g,"\\n"));c.addRow(["nodeType",a.nodeType+" ("+a.nodeName+")"]).addRow(["data",e]);return d.expanded?c.node:b.expander("DOMNode","Click to show more",function(){this.parentNode.appendChild(c.node)})},jquery:function(b,a,d){return j.array(b,a,d,!0)},object:function(a,c,e){var k=b.within(f).is(a);if(k)return b.common.circRef(a,k,d);f[e||"TOP"]=a;if(c===d.maxDepth)return b.common.depthReached(a,d);var g=b.table(["Object",
null],"object"),e=!0,h;for(h in a)if(!a.hasOwnProperty||a.hasOwnProperty(h)){var k=a[h],l=b.type(k),e=!1;try{g.addRow([h,j[l](k,c+1,h)],l)}catch(m){window.console&&window.console.log&&console.log(m.message)}}e?g.addRow(["<small>[empty]</small>"]):g.thead.appendChild(b.hRow(["key","value"],"colHeader"));a=d.expanded||i?g.node:b.expander(b.stringify(a),"Click to show more",function(){this.parentNode.appendChild(g.node)});i=!0;return a},array:function(a,c,e,g){var i=b.within(f).is(a);if(i)return b.common.circRef(a,
i);f[e||"TOP"]=a;if(c===d.maxDepth)return b.common.depthReached(a);var e=g?"jQuery":"Array",h=b.table([e+"("+a.length+")",null],g?"jquery":e.toLowerCase()),l=!0,m=0;g&&h.addRow(["selector",a.selector]);b.forEach(a,function(e,f){if(++m>d.maxArray)return h.addRow([f+".."+(a.length-1),j[b.type(e)]("...",c+1,f)]),!1;l=!1;h.addRow([f,j[b.type(e)](e,c+1,f)])});g||(l?h.addRow(["<small>[empty]</small>"]):h.thead.appendChild(b.hRow(["index","value"],"colHeader")));return d.expanded?h.node:b.expander(b.stringify(a),
"Click to show more",function(){this.parentNode.appendChild(h.node)})},"function":function(a,c,e){if(c=b.within(f).is(a))return b.common.circRef(a,c);f[e||"TOP"]=a;var g=b.table(["Function",null],"function");b.table(["Arguments"]);e=a.toString().match(/\((.+?)\)/);a=a.toString().match(/\(.*?\)\s+?\{?([\S\s]+)/)[1].replace(/\}?$/,"");g.addRow(["arguments",e?e[1].replace(/[^\w_,\s]/g,""):"<small>[none/native]</small>"]).addRow(["body",a]);return d.expanded?g.node:b.expander("function(){...}","Click to see more about this function.",
function(){this.parentNode.appendChild(g.node)})},date:function(a){var c=b.table(["Date",null],"date"),e=a.toString().split(/\s/);c.addRow(["Time",e[4]]).addRow(["Date",e.slice(0,4).join("-")]);return d.expanded?c.node:b.expander("Date (timestamp): "+ +a,"Click to see a little more info about this date",function(){this.parentNode.appendChild(c.node)})},"boolean":function(a){return b.txt(a.toString().toUpperCase())},undefined:function(){return b.txt("UNDEFINED")},"null":function(){return b.txt("NULL")},
"default":function(){return b.txt("prettyPrint: TypeNotFound Error")}};e.appendChild(j[d.forceObject?"object":b.type(a)](a,0));return e};g.config={expanded:!0,forceObject:!1,maxDepth:3,maxArray:-1,styles:{array:{th:{backgroundColor:"#6DBD2A",color:"white"}},"function":{th:{backgroundColor:"#D82525"}},regexp:{th:{backgroundColor:"#E2F3FB",color:"#000"}},object:{th:{backgroundColor:"#1F96CF"}},jquery:{th:{backgroundColor:"#FBF315"}},error:{th:{backgroundColor:"red",color:"yellow"}},domelement:{th:{backgroundColor:"#F3801E"}},
date:{th:{backgroundColor:"#A725D8"}},colHeader:{th:{backgroundColor:"#EEE",color:"#000",textTransform:"uppercase"}},"default":{table:{borderCollapse:"collapse",width:"100%"},td:{padding:"5px",fontSize:"12px",backgroundColor:"#FFF",color:"#222",border:"1px solid #000",verticalAlign:"top",fontFamily:'"Consolas","Lucida Console",Courier,mono',whiteSpace:"nowrap"},td_hover:{},th:{padding:"5px",fontSize:"12px",backgroundColor:"#222",color:"#EEE",textAlign:"left",border:"1px solid #000",verticalAlign:"top",
fontFamily:'"Consolas","Lucida Console",Courier,mono',backgroundImage:b.headerGradient,backgroundRepeat:"repeat-x"}}}};return g}();