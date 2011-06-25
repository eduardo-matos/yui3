YUI.add("dataschema-base",function(b){var a=b.Lang,c={apply:function(d,e){return e;},parse:function(d,e){if(e.parser){var f=(a.isFunction(e.parser))?e.parser:b.Parsers[e.parser+""];if(f){d=f.call(this,d);}else{}}return d;}};b.namespace("DataSchema").Base=c;b.namespace("Parsers");},"@VERSION@",{requires:["base"]});YUI.add("dataschema-json",function(g){var c=g.Lang,f=c.isFunction,a=c.isObject,b=c.isArray,e=g.DataSchema.Base,d;d={getPath:function(h){var l=null,k=[],j=0;if(h){h=h.replace(/\[\s*(['"])(.*?)\1\s*\]/g,function(m,i,n){k[j]=n;return".@"+(j++);}).replace(/\[(\d+)\]/g,function(m,i){k[j]=parseInt(i,10)|0;return".@"+(j++);}).replace(/^\./,"");l=h.split(".");for(j=l.length-1;j>=0;--j){if(l[j].charAt(0)==="@"){l[j]=k[parseInt(l[j].substr(1),10)];}}}return l;},getLocationValue:function(l,k){var j=0,h=l.length;for(;j<h;j++){if(a(k)&&(l[j] in k)){k=k[l[j]];}else{k=undefined;break;}}return k;},apply:function(j,k){var h=k,i={results:[],meta:{}};if(!a(k)){try{h=g.JSON.parse(k);}catch(l){i.error=l;return i;}}if(a(h)&&j){i=d._parseResults.call(this,j,h,i);if(j.metaFields!==undefined){i=d._parseMeta(j.metaFields,h,i);}}else{i.error=new Error("JSON schema parse failure");}return i;},_parseResults:function(m,h,l){var i=d.getPath,j=d.getLocationValue,n=i(m.resultListLocator),k=n?(j(n,h)||h[m.resultListLocator]):h;if(b(k)){if(b(m.resultFields)){l=d._getFieldValues.call(this,m.resultFields,k,l);}else{l.results=k;}}else{l.results=[];l.error=new Error("JSON results retrieval failure");}return l;},_getFieldValues:function(s,p,n){var u=[],x=s.length,w,v,h,z,m,r,l,A,t=[],y=[],o=[],q,k;for(w=0;w<x;w++){h=s[w];z=h.key||h;m=h.locator||z;r=d.getPath(m);if(r){if(r.length===1){t.push({key:z,path:r[0]});}else{y.push({key:z,path:r,locator:m});}}else{}l=(f(h.parser))?h.parser:g.Parsers[h.parser+""];if(l){o.push({key:z,parser:l});}}for(w=p.length-1;w>=0;--w){k={};q=p[w];if(q){for(v=y.length-1;v>=0;--v){r=y[v];A=d.getLocationValue(r.path,q);if(A===undefined){A=d.getLocationValue([r.locator],q);if(A!==undefined){t.push({key:r.key,path:r.locator});y.splice(w,1);continue;}}k[r.key]=e.parse.call(this,(d.getLocationValue(r.path,q)),r);}for(v=t.length-1;v>=0;--v){r=t[v];k[r.key]=e.parse.call(this,((q[r.path]===undefined)?q[v]:q[r.path]),r);}for(v=o.length-1;v>=0;--v){z=o[v].key;k[z]=o[v].parser.call(this,k[z]);if(k[z]===undefined){k[z]=null;}}u[w]=k;}}n.results=u;return n;},_parseMeta:function(k,h,j){if(a(k)){var i,l;for(i in k){if(k.hasOwnProperty(i)){l=d.getPath(k[i]);if(l&&h){j.meta[i]=d.getLocationValue(l,h);}}}}else{j.error=new Error("JSON meta data retrieval failure");}return j;}};g.DataSchema.JSON=g.mix(d,e);},"@VERSION@",{requires:["dataschema-base","json"]});YUI.add("dataschema-xml",function(c){var b=c.Lang,a={apply:function(f,g){var d=g,e={results:[],meta:{}};if(d&&d.nodeType&&(9===d.nodeType||1===d.nodeType||11===d.nodeType)&&f){e=a._parseResults.call(this,f,d,e);e=a._parseMeta.call(this,f.metaFields,d,e);}else{e.error=new Error("XML schema parse failure");}return e;},_getLocationValue:function(l,i){var g=l.locator||l.key||l,f=i.ownerDocument||i,d,h,j=null;try{d=a._getXPathResult(g,i,f);while(h=d.iterateNext()){j=h.textContent||h.value||h.text||h.innerHTML||null;}return c.DataSchema.Base.parse.call(this,j,l);}catch(k){}return null;},_getXPathResult:function(k,f,s){if(!b.isUndefined(s.evaluate)){return s.evaluate(k,f,s.createNSResolver(f.ownerDocument?f.ownerDocument.documentElement:f.documentElement),0,null);}else{var p=[],r=k.split(/\b\/\b/),j=0,h=r.length,o,d,g,q;try{s.setProperty("SelectionLanguage","XPath");p=f.selectNodes(k);}catch(n){for(;j<h&&f;j++){o=r[j];if((o.indexOf("[")>-1)&&(o.indexOf("]")>-1)){d=o.slice(o.indexOf("[")+1,o.indexOf("]"));d--;f=f.children[d];q=true;}else{if(o.indexOf("@")>-1){d=o.substr(o.indexOf("@"));f=d?f.getAttribute(d.replace("@","")):f;}else{if(-1<o.indexOf("//")){d=f.getElementsByTagName(o.substr(2));f=d.length?d[d.length-1]:null;}else{if(h!=j+1){for(g=f.childNodes.length-1;0<=g;g-=1){if(o===f.childNodes[g].tagName){f=f.childNodes[g];g=-1;}}}}}}}if(f){if(b.isString(f)){p[0]={value:f};}else{if(q){p[0]={value:f.innerHTML};}else{p=c.Array(f.childNodes,0,true);}}}}return{index:0,iterateNext:function(){if(this.index>=this.values.length){return undefined;}var e=this.values[this.index];this.index+=1;return e;},values:p};}},_parseField:function(f,d,e){if(f.schema){d[f.key]=a._parseResults.call(this,f.schema,e,{results:[],meta:{}}).results;}else{d[f.key||f]=a._getLocationValue.call(this,f,e);}},_parseMeta:function(h,g,f){if(b.isObject(h)){var e,d=g.ownerDocument||g;for(e in h){if(h.hasOwnProperty(e)){f.meta[e]=a._getLocationValue.call(this,h[e],d);}}}return f;},_parseResult:function(e,g){var d={},f;for(f=e.length-1;0<=f;f--){a._parseField.call(this,e[f],d,g);}return d;},_parseResults:function(g,d,h){if(g.resultListLocator&&b.isArray(g.resultFields)){var m=d.ownerDocument||d,l=g.resultFields,k=[],e,n,f,j=0;if(g.resultListLocator.match(/^[:\-\w]+$/)){f=d.getElementsByTagName(g.resultListLocator);for(j=f.length-1;0<=j;j--){k[j]=a._parseResult.call(this,l,f[j]);}}else{f=a._getXPathResult(g.resultListLocator,d,m);while(e=f.iterateNext()){k[j]=a._parseResult.call(this,l,e);j+=1;}}if(k.length){h.results=k;}else{h.error=new Error("XML schema result nodes retrieval failure");}}return h;}};c.DataSchema.XML=c.mix(a,c.DataSchema.Base);},"@VERSION@",{requires:["dataschema-base"]});YUI.add("dataschema-array",function(c){var a=c.Lang,b={apply:function(f,g){var d=g,e={results:[],meta:{}};if(a.isArray(d)){if(f&&a.isArray(f.resultFields)){e=b._parseResults.call(this,f.resultFields,d,e);}else{e.results=d;}}else{e.error=new Error("Array schema parse failure");}return e;},_parseResults:function(h,m,d){var g=[],q,p,k,l,o,n,f,e;for(f=m.length-1;f>-1;f--){q={};p=m[f];k=(a.isObject(p)&&!a.isFunction(p))?2:(a.isArray(p))?1:(a.isString(p))?0:-1;if(k>0){for(e=h.length-1;e>-1;e--){l=h[e];o=(!a.isUndefined(l.key))?l.key:l;n=(!a.isUndefined(p[o]))?p[o]:p[e];q[o]=c.DataSchema.Base.parse.call(this,n,l);}}else{if(k===0){q=p;
}else{q=null;}}g[f]=q;}d.results=g;return d;}};c.DataSchema.Array=c.mix(b,c.DataSchema.Base);},"@VERSION@",{requires:["dataschema-base"]});YUI.add("dataschema-text",function(c){var b=c.Lang,a={apply:function(f,g){var d=g,e={results:[],meta:{}};if(b.isString(d)&&b.isString(f.resultDelimiter)){e=a._parseResults.call(this,f,d,e);}else{e.error=new Error("Text schema parse failure");}return e;},_parseResults:function(d,m,e){var k=d.resultDelimiter,h=[],n,r,u,t,l,p,s,q,g,f,o=m.length-k.length;if(m.substr(o)==k){m=m.substr(0,o);}n=m.split(d.resultDelimiter);for(g=n.length-1;g>-1;g--){u={};t=n[g];if(b.isString(d.fieldDelimiter)){r=t.split(d.fieldDelimiter);if(b.isArray(d.resultFields)){l=d.resultFields;for(f=l.length-1;f>-1;f--){p=l[f];s=(!b.isUndefined(p.key))?p.key:p;q=(!b.isUndefined(r[s]))?r[s]:r[f];u[s]=c.DataSchema.Base.parse.call(this,q,p);}}}else{u=t;}h[g]=u;}e.results=h;return e;}};c.DataSchema.Text=c.mix(a,c.DataSchema.Base);},"@VERSION@",{requires:["dataschema-base"]});YUI.add("dataschema",function(a){},"@VERSION@",{use:["dataschema-base","dataschema-json","dataschema-xml","dataschema-array","dataschema-text"]});