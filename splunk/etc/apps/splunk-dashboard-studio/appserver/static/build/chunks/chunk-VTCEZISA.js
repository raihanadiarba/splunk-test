/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{b as bn,c as yn,d as jn,e as wn}from"./chunk-OCET6F2C.js";import{a as kn}from"./chunk-3F24R2A4.js";import{f as cn,g as sn}from"./chunk-O2JJX2RL.js";import{Ha as vn,Ja as pn,Ka as mn,Ra as gn,Za as hn,a as un,b as ln,ua as dn,va as fn}from"./chunk-REK4W3C7.js";import{f as ie}from"./chunk-JHLB3KMN.js";var Ce=ie((xn,G)=>{function En(o,y){return y||(y=o.slice(0)),Object.freeze(Object.defineProperties(o,{raw:{value:Object.freeze(y)}}))}G.exports=En,G.exports.__esModule=!0,G.exports.default=G.exports});var Pe=ie((On,V)=>{(function(o,y){typeof V!="undefined"&&V.exports?V.exports=y():this[o]=y()})("$script",function(){var o=document,y=o.getElementsByTagName("head")[0],J="string",K=!1,C="push",H="readyState",$="onreadystatechange",P={},R={},x={},w={},_,L;function N(t,l){for(var i=0,p=t.length;i<p;++i)if(!l(t[i]))return K;return 1}function u(t,l){N(t,function(i){return l(i),1})}function m(t,l,i){t=t[C]?t:[t];var p=l&&l.call,v=p?l:i,s=p?t.join(""):l,Q=t.length;function A(E){return E.call?E():P[E]}function z(){if(!--Q){P[s]=1,v&&v();for(var E in x)N(E.split("|"),A)&&!u(x[E],A)&&(x[E]=[])}}return setTimeout(function(){u(t,function E(k,q){if(k===null)return z();if(!q&&!/^https?:\/\//.test(k)&&_&&(k=k.indexOf(".js")===-1?_+k+".js":_+k),w[k])return s&&(R[s]=1),w[k]==2?z():setTimeout(function(){E(k,!0)},0);w[k]=1,s&&(R[s]=1),I(k,z)})},0),m}function I(t,l){var i=o.createElement("script"),p;i.onload=i.onerror=i[$]=function(){i[H]&&!/^c|loade/.test(i[H])||p||(i.onload=i[$]=null,p=1,w[t]=2,l())},i.async=1,i.src=L?t+(t.indexOf("?")===-1?"?":"&")+L:t,y.insertBefore(i,y.lastChild)}return m.get=I,m.order=function(t,l,i){(function p(v){v=t.shift(),t.length?m(v,p):m(v,l,i)})()},m.path=function(t){_=t},m.urlArgs=function(t){L=t},m.ready=function(t,l,i){t=t[C]?t:[t];var p=[];return!u(t,function(v){P[v]||p[C](v)})&&N(t,function(v){return P[v]})?l():(function(v){x[v]=x[v]||[],x[v][C](l),i&&i(p)})(t.join("|")),m},m.done=function(t){m([null],t)},m})});var Sn=ie((qn,_e)=>{(()=>{"use strict";var o={};o.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return o.d(n,{a:n}),n},o.d=(e,n)=>{for(var r in n)o.o(n,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),o.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var y={};o.r(y),o.d(y,{AppBar:()=>X,SplunkBar:()=>W,default:()=>nn});let J=gn(),K=yn();var C=o.n(K);let H=bn();var $=o.n(H);let P=wn();var R=o.n(P);let x=Ce();var w=o.n(x);let _=jn();var L=o.n(_);let N=un();var u=o.n(N);let m=Pe();var I=o.n(m);let t=dn();var l=o.n(t);let i=hn(),p=sn(),v=cn(),s=pn(),Q=vn();var A=o.n(Q);let z=kn(),E=ln(),k=fn();var q=o.n(k);let Le=mn();var Ae=o.n(Le);function ue(){var e=w()([`
    animation-name: `,`;
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    background-color: `,`;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    display: inline-block;
    margin-right: `,`;

    &:nth-child(2) {
        animation-delay: 0.2s;
    }

    &:nth-child(3) {
        animation-delay: 0.4s;
    }
`]);return ue=function(){return e},e}function le(){var e=w()([`
    color: `,`;
    padding-top: 30vh;
    text-align: center;
    min-height: 400px;
`]);return le=function(){return e},e}function ce(){var e=w()([`
    background-color: `,`;
    min-height: `,`px;
`]);return ce=function(){return e},e}function se(){var e=w()([`
    padding: 0;
    background-color: `,`;
    height: `,`px;
`]);return se=function(){return e},e}function de(){var e=w()([`
    background-color: `,`;
    position: fixed;
    opacity: 1;
    z-index: 10000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`]);return de=function(){return e},e}function fe(){var e=w()([`
    0% {
        opacity: 0.2;
    }

    20% {
        opacity: 1;
    }

    100% {
        opacity: 0.2;
    }
`]);return fe=function(){return e},e}var ve=45,pe=34,Te=54,Fe=(0,t.keyframes)(fe()),Me=l().div(de(),s.variables.backgroundColorPage),W=l().div(se(),(0,s.pickVariant)("$isModernNavEnabled",{true:s.variables.backgroundColorNavigation,false:{prisma:s.variables.backgroundColorSection,enterprise:s.variables.gray20}}),(function(e){var n=e.$isModernNavEnabled;return n?Te:pe})),X=l().div(ce(),(0,s.pick)({prisma:s.variables.backgroundColorPopup,enterprise:s.variables.gray30}),ve),Ne=l().div(le(),s.variables.contentColorInverted),Y=l().div(ue(),Fe,s.variables.neutral500,(0,s.pick)({prisma:s.variables.spacingMedium,enterprise:s.variables.spacingSmall})),ze={hideAppBar:q().bool,hideChrome:q().bool,hideSplunkBar:q().bool,AppBarFallback:q().elementType,SplunkBarFallback:q().elementType};function me(e){var n=e.AppBarFallback,r=n===void 0?X:n,a=e.hideAppBar,c=e.hideChrome,d=e.hideSplunkBar,f=e.SplunkBarFallback,g=f===void 0?W:f;return u().createElement(Me,null,!c&&!d&&u().createElement(g,null),!c&&!a&&u().createElement(r,null),u().createElement(Ne,null,u().createElement(Y,null),u().createElement(Y,null),u().createElement(Y,null),u().createElement(Ae(),null,(0,E._)("Loading"))))}me.propTypes=ze;let De=me;function ge(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(c){return Object.getOwnPropertyDescriptor(e,c).enumerable}))),r.push.apply(r,a)}return r}function he(e){for(var n=1;n<arguments.length;n++){var r=arguments[n]!=null?arguments[n]:{};n%2?ge(Object(r),!0).forEach((function(a){$()(e,a,r[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ge(Object(r)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(r,a))}))}return e}function be(){var e=w()([`
    body {
        background-color: `,`;
    }
`]);return be=function(){return e},e}var Z=(0,t.createGlobalStyle)(be(),s.variables.backgroundColorPage),Ge=function(){return fetch((0,v.createRESTURL)("web-features?output_mode=json",{app:"-",owner:"-",sharing:"system"})).then((0,p.handleResponse)(200)).catch((0,p.handleError)((0,E._)("failed to get web features")))},He="feature:modern-nav",$e=(function(){var e=R()(L().mark((function n(r){var a,c,d,f;return L().wrap((function(j){for(;;)switch(j.prev=j.next){case 0:if(r==="auto"){j.next=2;break}return j.abrupt("return",!1);case 2:return j.next=4,Ge();case 4:return d=j.sent,f=d.entry.find((function(B){return B.name===He})),j.abrupt("return",(a=(0,z.normalizeBoolean)(f==null||(c=f.content)===null||c===void 0?void 0:c.enable_nav_vnext))!==null&&a!==void 0?a:!1);case 7:case"end":return j.stop()}}),n)})));return function(r){return e.apply(this,arguments)}})(),Re="build/api/layout.js",Ie="build/api/layout-dark.js",Ue="build/api/layout-modern-nav.js",Ve='header[data-view="splunkjs/mvc/headerview"]';function Je(e,n,r){var a=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},c=a.hideSplunkBar,d=a.hideAppBar;if(e)if(e.unmount(),r)n.remove();else{var f=document.querySelector(Ve),g=(c?0:pe)+(d?0:ve);Object.assign(n.style,{minHeight:"".concat(g,"px"),height:"auto"}),n.appendChild(f)}}function Ke(e,n,r){var a=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},c=a.loader,d=c===void 0?"scriptjs":c,f;n?f=Ue:f=e==="dark"?Ie:Re;var g=(0,v.createStaticURL)(f);if(d==="scriptjs")I()(g,(function(){r(window.__splunk_layout__)}));else if(d==="requirejs")if(window.requirejs)window.requirejs([g],r);else throw new Error('Error in react-page: options.loader = "requirejs" was set but window.requirejs does not exist.')}function Qe(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.hideSplunkBar,a=n.hideAppBar,c=n.headerHeight,d=e.children[0],f=d&&getComputedStyle(d).backgroundColor;if(!(r||a)){var g=d==null?void 0:d.offsetHeight,j=e.children[1],B=j&&getComputedStyle(j).backgroundColor,T=Math.round(g/c*100);return`linear-gradient(
                `.concat(f,` 0%,
                `).concat(f," ").concat(T,`%,
                `).concat(B," ").concat(T,`%,
                `).concat(B,` 100%
            )`)}return f}function We(e){var n=e.navLayout,r=e.baseOptions,a=e.additionalOptions;return n==="auto"?he(he({},r),a):r}function ye(e,n,r){var a=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1,c=arguments.length>4&&arguments[4]!==void 0?arguments[4]:{},d=a?u().createElement(i.LayerStackGlobalProvider,null,u().createElement(A(),c,u().createElement(Z,null),e)):u().createElement(A(),c,u().createElement(Z,null),e);return n(d,r)}function Xe(e,n){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},a=r.useGlobalLayerStack,c=a===void 0?!0:a,d=r.pageTitle,f=r.theme,g=f===void 0?"light":f,j=r.themeDensity,B=r.loader,T=B===void 0?"scriptjs":B,h=C()(r,["useGlobalLayerStack","pageTitle","theme","themeDensity","loader"]);if(d&&(document.title=d),T!=="scriptjs"&&T!=="requirejs")throw new Error('Error in react-page: Invalid options.loader configuration: must be "scriptjs" or "requirejs".');var ke=h.hideChrome,je=h.themeFamily,ee=je===void 0?"enterprise":je,ne=h.hideAppBar,re=h.hideSplunkBar,we=h.SplunkBarFallback,rn=we===void 0?W:we,Ee=h.AppBarFallback,tn=Ee===void 0?X:Ee,Se=h.lazyLoadLayout,xe=Se===void 0?!1:Se,F=h.onLayoutComplete,te=h.onLayoutStart,Oe=h.navLayout,ae=Oe===void 0?"classic":Oe,qe=ae==="classic"?Promise.resolve(!1):$e(ae).catch((function(){return!1})),S=document.createElement("div"),O=document.createElement("div");te==null||te({headerContainer:O,bodyContainer:S});var an=g==="light"||g==="enterprise"?"light":"dark",oe={family:ee,colorScheme:an,density:j||(ee==="prisma"?"compact":"comfortable")},U,Be;h.navLayout==="auto"&&(S.style.flexGrow="1"),xe?(document.body.appendChild(S),U=ye(e,n,S,c,oe),ke||qe.then((function(M){document.body.insertBefore(O,S),Be=n(u().createElement(u().Fragment,null,!re&&u().createElement(rn,{$isModernNavEnabled:M}),!ne&&!M&&u().createElement(tn,null)),O);var D=O.offsetHeight,b=Qe(O,{hideSplunkBar:re,hideAppBar:M||ne,headerHeight:D});O.style.height="".concat(D,"px"),O.style.background="".concat(b)}))):(document.body.appendChild(S),U=n(u().createElement(A(),oe,u().createElement(Z,null),u().createElement(De,h)),S)),qe.then((function(M){Ke(g,M,(function(D){var b;if(D){var on=We({navLayout:ae,baseOptions:h,additionalOptions:{theme:g,themeFamily:ee}});b=D.create(on).getContainerElement(),h.layout==="fixed"&&((!b.style.flex||b.style.flex==="1 0 0px")&&(b.style.flex="1 0 0%"),b.style.overflow||(b.style.overflow="hidden"),b.style.width||(b.style.width="100vw"))}else console.error("Unable to load layout."),b=document.createElement("div"),document.body.appendChild(b);xe?(ke||Je(Be,O,M,{hideSplunkBar:re,hideAppBar:ne}),b.appendChild(S),F==null||F()):setTimeout((function(){U.unmount(),U=ye(e,n,S,c,oe),b.appendChild(S),F==null||F()}),30)}),{loader:T})}))}let Ye=Xe;var Ze=function(n,r){return(0,J.render)(n,r),{unmount:function(){return(0,J.unmountComponentAtNode)(r)}}};function en(e,n){Ye(e,Ze,n)}let nn=en;_e.exports=y})()});export{Pe as a,Sn as b};
