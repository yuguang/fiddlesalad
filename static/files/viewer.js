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

window.console.log = function () {
  var div = document.createElement('div');
  div.style.color = 'gray';
  div.style.fontFamily = 'Helvetica, Univers, Futura, "Franklin Gothic", Gotham, sans-serif';
  div.innerHTML = '<strong>console</strong>: ' + Array.prototype.slice.call(arguments).join(', ');

  document.body.appendChild(div);
};

(function () {
  var init = setInterval(function () {
    if (window.parent.codeRunner != null) {
      clearInterval(init);
      window.parent.codeRunner.initialize();
    }
  }, 250);
})();

function execute(scripts, main) {
  var lineNumber;
  $LAB
    .setOptions({AlwaysPreserveOrder:true})
    .script(scripts)
    .wait(function () {
      try {
        eval(main)
      }
      catch (e) {
        lineNumber = e.lineNumber - 46 + 1 || (e.stack.match(/<anonymous>:(\d+):\d+/) || [, ])[1];

        prepareJavascriptError(e.name, e.message);
      }
      finally {
        window.parent.postMessage(lineNumber ? lineNumber - 1 : -1, '*');

        // clear error
        if (!lineNumber) {
          if (jserror) {
            removeError();
          }
        }
      }
    });
}

var jserror;

function removeError() {
  jserror.className = '';
}

function prepareJavascriptError(name, message) {
  if (!jserror) {
    jserror = document.createElement('div');
    jserror.setAttribute('id', 'jserror');
    document.body.appendChild(jserror);
  }

  jserror.innerHTML = (name ? '<strong>' + name + '</strong>: ' : '') +
    (message || 'JavaScript Error');
}

function displayJavascriptError(immediate) {
  var visibleOnHover = !immediate;
  function showError() {
    jserror.className = 'active';
  };
  if (visibleOnHover) {
    window.onmouseover = showError;
    window.onmouseout = removeError;
  } else {
    showError();
  }
}