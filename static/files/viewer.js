(function(f,q){function p(){}function a(a,c){if(a){"object"===typeof a&&(a=[].slice.call(a));for(var b=0,e=a.length;b<e;b++)c.call(a,a[b],b)}}function k(a,c){var b=Object.prototype.toString.call(c).slice(8,-1);return c!==q&&null!==c&&b===a}function c(a){return k("Function",a)}function d(a){a=a||p;a._done||(a(),a._done=1)}function e(a){var c={};if("object"===typeof a)for(var b in a)a[b]&&(c={name:b,url:a[b]});else c=a.split("/"),c=c[c.length-1],b=c.indexOf("?"),c={name:-1!==b?c.substring(0,b):c,url:a};
return(a=m[c.name])&&a.url===c.url?a:m[c.name]=c}function g(a){a=a||m;for(var c in a)if(a.hasOwnProperty(c)&&a[c].state!==u)return!1;return!0}function l(c,b){b=b||p;c.state===u?b():c.state===w?j.ready(c.name,b):c.state===x?c.onpreload.push(function(){l(c,b)}):(c.state=w,y(c,function(){c.state=u;b();a(s[c.name],function(a){d(a)});r&&g()&&a(s.ALL,function(a){d(a)})}))}function y(a,c){c=c||p;var b;/\.css[^\.]*$/.test(a.url)?(b=h.createElement("link"),b.type="text/"+(a.type||"css"),b.rel="stylesheet",
b.href=a.url):(b=h.createElement("script"),b.type="text/"+(a.type||"javascript"),b.src=a.url);b.onload=b.onreadystatechange=function(a){a=a||f.event;if("load"===a.type||/loaded|complete/.test(b.readyState)&&(!h.documentMode||9>h.documentMode))b.onload=b.onreadystatechange=b.onerror=null,c()};b.onerror=function(){b.onload=b.onreadystatechange=b.onerror=null;c()};b.async=!1;b.defer=!1;var e=h.head||h.getElementsByTagName("head")[0];e.insertBefore(b,e.lastChild)}function n(){h.body?r||(r=!0,a(t,function(a){d(a)})):
(f.clearTimeout(j.readyTimeout),j.readyTimeout=f.setTimeout(n,50))}function b(){h.addEventListener?(h.removeEventListener("DOMContentLoaded",b,!1),n()):"complete"===h.readyState&&(h.detachEvent("onreadystatechange",b),n())}var h=f.document,t=[],z=[],s={},m={},D="async"in h.createElement("script")||"MozAppearance"in h.documentElement.style||f.opera,A,r,B=f.head_conf&&f.head_conf.head||"head",j=f[B]=f[B]||function(){j.ready.apply(null,arguments)},x=1,w=3,u=4;j.load=D?function(){var b=arguments,h=b[b.length-
1],t={};c(h)||(h=null);a(b,function(a,c){a!==h&&(a=e(a),t[a.name]=a,l(a,h&&c===b.length-2?function(){g(t)&&d(h)}:null))});return j}:function(){var b=arguments,d=[].slice.call(b,1),h=d[0];if(!A)return z.push(function(){j.load.apply(null,b)}),j;h?(a(d,function(b){if(!c(b)){var d=e(b);d.state===q&&(d.state=x,d.onpreload=[],y({url:d.url,type:"cache"},function(){d.state=2;a(d.onpreload,function(a){a.call()})}))}}),l(e(b[0]),c(h)?h:function(){j.load.apply(null,d)})):l(e(b[0]));return j};j.js=j.load;j.test=
function(a,b,c,d){a="object"===typeof a?a:{test:a,success:b?k("Array",b)?b:[b]:!1,failure:c?k("Array",c)?c:[c]:!1,callback:d||p};(b=!!a.test)&&a.success?(a.success.push(a.callback),j.load.apply(null,a.success)):!b&&a.failure?(a.failure.push(a.callback),j.load.apply(null,a.failure)):d();return j};j.ready=function(a,b){if(a===h)return r?d(b):t.push(b),j;c(a)&&(b=a,a="ALL");if("string"!==typeof a||!c(b))return j;var e=m[a];if(e&&e.state===u||"ALL"===a&&g()&&r)return d(b),j;(e=s[a])?e.push(b):s[a]=[b];
return j};j.ready(h,function(){g()&&a(s.ALL,function(a){d(a)});j.feature&&j.feature("domloaded",!0)});if("complete"===h.readyState)n();else if(h.addEventListener)h.addEventListener("DOMContentLoaded",b,!1),f.addEventListener("load",n,!1);else{h.attachEvent("onreadystatechange",b);f.attachEvent("onload",n);var v=!1;try{v=null==f.frameElement&&h.documentElement}catch(E){}v&&v.doScroll&&function C(){if(!r){try{v.doScroll("left")}catch(a){f.clearTimeout(j.readyTimeout);j.readyTimeout=f.setTimeout(C,50);
return}n()}}()}setTimeout(function(){A=!0;a(z,function(a){a()})},300)})(window);
var prettyPrint=function(){var f;f=document.createElement("canvas");if(f.getContext){var q=f.getContext("2d");f.height=30;f.width=1;var p=q.createLinearGradient(0,0,0,30);p.addColorStop(0,"rgba(0,0,0,0)");p.addColorStop(1,"rgba(0,0,0,0.25)");q.fillStyle=p;q.fillRect(0,0,1,30);f="url("+(f.toDataURL&&f.toDataURL()||"")+")"}else f="";var a={el:function(c,d){var e=document.createElement(c),g;if((d=a.merge({},d))&&d.style)a.applyCSS(e,d.style),delete d.style;for(g in d)d.hasOwnProperty(g)&&(e[g]=d[g]);
return e},applyCSS:function(a,d){for(var e in d)if(d.hasOwnProperty(e))try{a.style[e]=d[e]}catch(g){}},txt:function(a){return document.createTextNode(a)},row:function(c,d,e){e=e||"td";var g=a.count(c,null)+1,l=a.el("tr"),f,n={style:a.getStyles(e,d),colSpan:g,onmouseover:function(){a.forEach(this.parentNode.childNodes,function(b){"td"===b.nodeName.toLowerCase()&&a.applyCSS(b,a.getStyles("td_hover",d))})},onmouseout:function(){a.forEach(this.parentNode.childNodes,function(b){"td"===b.nodeName.toLowerCase()&&
a.applyCSS(b,a.getStyles("td",d))})}};a.forEach(c,function(b){null!==b&&(f=a.el(e,n),b.nodeType?f.appendChild(b):f.innerHTML=a.shorten(b.toString()),l.appendChild(f))});return l},hRow:function(c,d){return a.row(c,d,"th")},table:function(c,d){c=c||[];var e={style:a.getStyles("thead",d)},g={style:a.getStyles("tbody",d)},f={style:a.getStyles("table",d)},f=a.el("table",f),e=a.el("thead",e),g=a.el("tbody",g);c.length&&(f.appendChild(e),e.appendChild(a.hRow(c,d)));f.appendChild(g);return{node:f,tbody:g,
thead:e,appendChild:function(a){this.tbody.appendChild(a)},addRow:function(c,e,b){this.appendChild(a.row.call(a,c,e||d,b));return this}}},shorten:function(a){a=a.replace(/^\s\s*|\s\s*$|\n/g,"");return 40<a.length?a.substring(0,39)+"...":a},htmlentities:function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},merge:function(c,d){"object"!==typeof c&&(c={});for(var e in d)if(d.hasOwnProperty(e)){var g=d[e];c[e]="object"===typeof g?a.merge(c[e],g):g}e=2;for(g=arguments.length;e<
g;e++)a.merge(c,arguments[e]);return c},count:function(a,d){for(var e=0,g=0,f=a.length;g<f;g++)a[g]===d&&e++;return e},thead:function(a){return a.getElementsByTagName("thead")[0]},forEach:function(a,d,e){e||(e=d);d=a.length;for(var f=-1;++f<d&&!1!==e(a[f],f,a););return!0},type:function(a){try{if(null===a)return"null";if(void 0===a)return"undefined";var d=Object.prototype.toString.call(a).match(/\s(.+?)\]/)[1].toLowerCase();return a.nodeType?1===a.nodeType?"domelement":"domnode":/^(string|number|array|regexp|function|date|boolean)$/.test(d)?
d:"object"===typeof a?a.jquery&&"string"===typeof a.jquery?"jquery":"object":a===window||a===document?"object":"default"}catch(e){return"default"}},within:function(a){return{is:function(d){for(var e in a)if(a[e]===d)return e;return""}}},common:{circRef:function(c,d){return a.expander("[POINTS BACK TO <strong>"+d+"</strong>]","Click to show this item anyway",function(){this.parentNode.appendChild(k(c,{maxDepth:1}))})},depthReached:function(c){return a.expander("[DEPTH REACHED]","Click to show this item anyway",
function(){try{this.parentNode.appendChild(k(c,{maxDepth:1}))}catch(d){this.parentNode.appendChild(a.table(["ERROR OCCURED DURING OBJECT RETRIEVAL"],"error").addRow([d.message]).node)}})}},getStyles:function(c,d){d=k.settings.styles[d]||{};return a.merge({},k.settings.styles["default"][c],d[c])},expander:function(c,d,e){return a.el("a",{innerHTML:a.shorten(c)+' <b style="visibility:hidden;">[+]</b>',title:d,onmouseover:function(){this.getElementsByTagName("b")[0].style.visibility="visible"},onmouseout:function(){this.getElementsByTagName("b")[0].style.visibility=
"hidden"},onclick:function(){this.style.display="none";e.call(this);return!1},style:{cursor:"pointer"}})},stringify:function(c){var d=a.type(c),e,f=!0;if("array"===d)return e="[",a.forEach(c,function(c,d){e+=(0===d?"":", ")+a.stringify(c)}),e+"]";if("object"===typeof c){e="{";for(var l in c)c.hasOwnProperty(l)&&(e+=(f?"":", ")+l+":"+a.stringify(c[l]),f=!1);return e+"}"}return"regexp"===d?"/"+c.source+"/":"string"===d?'"'+c.replace(/"/g,'\\"')+'"':c.toString()},headerGradient:f},k=function(c,d){d=
d||{};var e=a.merge({},k.config,d),f=a.el("div"),l={},p=!1;k.settings=e;var n={string:function(b){return a.txt('"'+a.shorten(b.replace(/"/g,'\\"'))+'"')},number:function(b){return a.txt(b)},regexp:function(b){var c=a.table(["RegExp",null],"regexp"),d=a.table(),f=a.expander("/"+b.source+"/","Click to show more",function(){this.parentNode.appendChild(c.node)});d.addRow(["g",b.global]).addRow(["i",b.ignoreCase]).addRow(["m",b.multiline]);c.addRow(["source","/"+b.source+"/"]).addRow(["flags",d.node]).addRow(["lastIndex",
b.lastIndex]);return e.expanded?c.node:f},domelement:function(b){var c=a.table(["DOMElement",null],"domelement"),d=b.nodeName||"";c.addRow(["tag","&lt;"+d.toLowerCase()+"&gt;"]);a.forEach(["id","className","innerHTML","src","href"],function(d){b[d]&&c.addRow([d,a.htmlentities(b[d])])});return e.expanded?c.node:a.expander("DOMElement ("+d.toLowerCase()+")","Click to show more",function(){this.parentNode.appendChild(c.node)})},domnode:function(b){var c=a.table(["DOMNode",null],"domelement"),d=a.htmlentities((b.data||
"UNDEFINED").replace(/\n/g,"\\n"));c.addRow(["nodeType",b.nodeType+" ("+b.nodeName+")"]).addRow(["data",d]);return e.expanded?c.node:a.expander("DOMNode","Click to show more",function(){this.parentNode.appendChild(c.node)})},jquery:function(a,c,d){return n.array(a,c,d,!0)},object:function(b,c,d){var f=a.within(l).is(b);if(f)return a.common.circRef(b,f,e);l[d||"TOP"]=b;if(c===e.maxDepth)return a.common.depthReached(b,e);var g=a.table(["Object",null],"object");d=!0;for(var m in b)if(!b.hasOwnProperty||
b.hasOwnProperty(m)){var f=b[m],k=a.type(f);d=!1;try{g.addRow([m,n[k](f,c+1,m)],k)}catch(q){window.console&&window.console.log&&console.log(q.message)}}d?g.addRow(["<small>[empty]</small>"]):g.thead.appendChild(a.hRow(["key","value"],"colHeader"));b=e.expanded||p?g.node:a.expander(a.stringify(b),"Click to show more",function(){this.parentNode.appendChild(g.node)});p=!0;return b},array:function(b,c,d,f){var g=a.within(l).is(b);if(g)return a.common.circRef(b,g);l[d||"TOP"]=b;if(c===e.maxDepth)return a.common.depthReached(b);
d=f?"jQuery":"Array";var m=a.table([d+"("+b.length+")",null],f?"jquery":d.toLowerCase()),k=!0,p=0;f&&m.addRow(["selector",b.selector]);a.forEach(b,function(d,f){if(++p>e.maxArray)return m.addRow([f+".."+(b.length-1),n[a.type(d)]("...",c+1,f)]),!1;k=!1;m.addRow([f,n[a.type(d)](d,c+1,f)])});f||(k?m.addRow(["<small>[empty]</small>"]):m.thead.appendChild(a.hRow(["index","value"],"colHeader")));return e.expanded?m.node:a.expander(a.stringify(b),"Click to show more",function(){this.parentNode.appendChild(m.node)})},
"function":function(b,c,d){if(c=a.within(l).is(b))return a.common.circRef(b,c);l[d||"TOP"]=b;var f=a.table(["Function",null],"function");a.table(["Arguments"]);d=b.toString().match(/\((.+?)\)/);b=b.toString().match(/\(.*?\)\s+?\{?([\S\s]+)/)[1].replace(/\}?$/,"");f.addRow(["arguments",d?d[1].replace(/[^\w_,\s]/g,""):"<small>[none/native]</small>"]).addRow(["body",b]);return e.expanded?f.node:a.expander("function(){...}","Click to see more about this function.",function(){this.parentNode.appendChild(f.node)})},
date:function(b){var c=a.table(["Date",null],"date"),d=b.toString().split(/\s/);c.addRow(["Time",d[4]]).addRow(["Date",d.slice(0,4).join("-")]);return e.expanded?c.node:a.expander("Date (timestamp): "+ +b,"Click to see a little more info about this date",function(){this.parentNode.appendChild(c.node)})},"boolean":function(b){return a.txt(b.toString().toUpperCase())},undefined:function(){return a.txt("UNDEFINED")},"null":function(){return a.txt("NULL")},"default":function(){return a.txt("prettyPrint: TypeNotFound Error")}};
f.appendChild(n[e.forceObject?"object":a.type(c)](c,0));return f};k.config={expanded:!0,forceObject:!1,maxDepth:3,maxArray:-1,styles:{array:{th:{backgroundColor:"#6DBD2A",color:"white"}},"function":{th:{backgroundColor:"#D82525"}},regexp:{th:{backgroundColor:"#E2F3FB",color:"#000"}},object:{th:{backgroundColor:"#1F96CF"}},jquery:{th:{backgroundColor:"#FBF315"}},error:{th:{backgroundColor:"red",color:"yellow"}},domelement:{th:{backgroundColor:"#F3801E"}},date:{th:{backgroundColor:"#A725D8"}},colHeader:{th:{backgroundColor:"#EEE",
color:"#000",textTransform:"uppercase"}},"default":{table:{borderCollapse:"collapse",width:"100%"},td:{padding:"5px",fontSize:"12px",backgroundColor:"#FFF",color:"#222",border:"1px solid #000",verticalAlign:"top",fontFamily:'"Consolas","Lucida Console",Courier,mono',whiteSpace:"nowrap"},td_hover:{},th:{padding:"5px",fontSize:"12px",backgroundColor:"#222",color:"#EEE",textAlign:"left",border:"1px solid #000",verticalAlign:"top",fontFamily:'"Consolas","Lucida Console",Courier,mono',backgroundImage:a.headerGradient,
backgroundRepeat:"repeat-x"}}}};return k}();

locals = {};

window.console.log = function(){
    var div = document.createElement('div');
    div.style.color = 'gray';
    div.style.fontFamily = 'Helvetica, Univers, Futura, "Franklin Gothic", Gotham, sans-serif';
    div.innerHTML = '<strong>console</strong>: ' + Array.prototype.slice.call(arguments).join(', ');

    document.body.appendChild(div);
};

(function(){
    var init = setInterval(function(){
        if (window.parent.codeRunner != null) {
            clearInterval(init);
            window.parent.codeRunner.initialize();
        }
    }, 250);
})();

function execute (scripts, main) {
    var lineNumber;
    head.js(scripts, function() {
        try {
            eval(main)
        }
        catch (e) {
            lineNumber = e.lineNumber - 50 + 1 || (e.stack.match(/<anonymous>:(\d+):\d+/) || [,])[1];

            displayJavascriptError(e.name, e.message);
        }
        finally {
            window.parent.postMessage(lineNumber? lineNumber - 1: -1, '*');
        }
    });
}

function displayJavascriptError (name, message) {
    if (!window.jserror) {
        var div = document.createElement('div');
        div.setAttribute('id', 'jserror');
        document.body.appendChild(div);
    }

    window.jserror.className = 'active';
    window.jserror.innerHTML = (name? '<strong>' + name + '</strong>: ' : '') +
                               (message || 'JavaScript Error');
}