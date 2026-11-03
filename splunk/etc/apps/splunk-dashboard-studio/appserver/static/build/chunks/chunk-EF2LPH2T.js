/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{b as ao}from"./chunk-N4UQPXS4.js";import{N as so,ba as L,e as to,fa as O,ga as P,kb as S,u as ro}from"./chunk-2T25FCZ6.js";import{d as F}from"./chunk-4L5RKU62.js";import{s as X}from"./chunk-P2UEJLOF.js";import{a as no}from"./chunk-JKE3YGCJ.js";import{f as Z}from"./chunk-O2JJX2RL.js";import{Ha as oo,Ja as I,Qa as eo,a as w,b as Q,ua as D}from"./chunk-REK4W3C7.js";import{a as C,b as k,h as a}from"./chunk-JHLB3KMN.js";var U=a(ao()),u=a(to()),_=a(so()),G=a(X()),$=a(no()),b=a(Z()),H=a(I()),K=a(oo()),Y=a(F()),l=a(w()),h=a(D());var B=a(F()),io="full source",lo=(o,e)=>{var r,t;Object.values((t=(r=o.layout)==null?void 0:r.layoutDefinitions)!=null?t:{}).forEach(n=>{let i=[];n.structure.forEach(d=>{var m;if(d.item===e){let g=(m=n.options)==null?void 0:m.height;g&&(n.options.height=g-d.position.h);return}i.push(d)}),n.structure=i})},co=o=>{var e;return Object.entries((e=o.visualizations)!=null?e:{}).find(([r,t])=>{var n;return t.type==="splunk.markdown"&&((n=t.options)==null?void 0:n.markdown)&&typeof t.options.markdown=="string"&&t.options.markdown.toLowerCase().includes(io)})},po=o=>{var t;let[e]=(t=co(o))!=null?t:[];if(!e)return o;let r=(0,B.default)(o);return delete r.visualizations[e],lo(r,e),r},T=po;var M=a(eo()),E=a(Q()),s=a(w()),uo=(0,s.lazy)(()=>import("./CloneDashboard-R5YE64VP.js")),mo=(o,{dashboardURL:e})=>{o&&window.open(e,"_blank")},go=({definition:o,dashboardTitle:e})=>{let[r,t]=(0,s.useState)(!1),n=(0,s.useMemo)(()=>T(o),[o]),i=(0,s.useRef)(null),d=(0,s.useCallback)(()=>{t(!0)},[]),m=(0,s.useCallback)(()=>t(!1),[]),g=s.default.createElement(s.Suspense,{fallback:null},s.default.createElement(uo,{open:r,dashboardTitle:e,dashboardType:"UDF",getUdfDefinition:(0,s.useCallback)(()=>n,[n]),handleSuccess:mo,onCloseModal:m,fromExamplesHub:!0,returnFocusRef:i}));return s.default.createElement(s.default.Fragment,null,g,s.default.createElement(M.default,{ref:i,label:(0,E._)("Clone in Studio"),onClick:d,"data-clickable":!0,"data-test":"clone-button",appearance:"subtle"}))},N=go;var J=a(ro()),R=a(I()),p=a(w()),x=a(D());var fo={content:"",language:"json"},ho=x.default.div`
    background-color: ${(0,R.pick)({enterprise:{light:"#121316",dark:"#121316"},prisma:"#121316"})};
    overflow: hidden;
    height: ${o=>o.height?o.height:200}px;
    color: #9cdcfe;
`,bo=x.default.div`
    padding: 12px 24px;
    overflow: auto;
    height: 100%;
`,V=({height:o,options:{content:e,language:r}=fo})=>{let t=(0,p.useRef)(null),[n,i]=(0,p.useState)(!1),d=(0,p.useCallback)(()=>{if(!(!t.current||!document.createRange||!window.getSelection))if(n){let c=window.getSelection();c==null||c.removeAllRanges(),i(!1)}else{let c=document.createRange();c.selectNodeContents(t.current);let f=window.getSelection();f==null||f.removeAllRanges(),f==null||f.addRange(c),i(!0)}},[n]),m=(0,p.useCallback)(()=>{if(!(!t.current||!document.createRange||!window.getSelection)&&n){let c=window.getSelection();c==null||c.removeAllRanges(),i(!1)}},[n]),g=(0,p.useCallback)(c=>{t.current=c},[]);return p.default.createElement(ho,{height:o},p.default.createElement(bo,null,p.default.createElement(J.default,{value:e,language:r,onDoubleClick:d,onClick:m,elementRef:g})))};V.showTitleAndDescription=!0;var A=V;var W=a(D()),z=W.createGlobalStyle`
    div:has(> .example-core-layout-container) {
        min-width: 0;
    }
`;var Co=k(C({},S),{visualizations:k(C({},S.visualizations),{"viz.code":A})}),yo=h.default.div`
    display: flex;
    flex-direction: row;
    ${o=>(0,G.toDimension)({width:o.width,height:o.height})};
`,ko=h.default.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
    min-width: 0;
`,wo=(0,h.default)("div")`
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    padding: 0px 0px 8px 0px;
    background-color: ${H.variables.backgroundColorPage};
`,Do=h.default.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
    z-index: 5;
`,Wo=(0,h.default)($.default)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`,q=u.GeoRegistry.create();q.addDefaultProvider(new u.GeoJsonProvider);var v=u.IconRegistry.create();v.addDefaultProvider(new u.LocalIconProvider);v.addProvider(new u.StandardIconProvider);var So=new _.SWACollector,j,xo={enableRiskyCommand:!!((j=window.$C)!=null&&j.ENABLE_RISKY_COMMAND_CHECK_DASHBOARD)},vo=o=>{var e;(e=o.layout)!=null&&e.layoutDefinitions&&Object.values(o.layout.layoutDefinitions).forEach(r=>{var t,n,i,d;(n=(t=r.options)==null?void 0:t.backgroundImage)!=null&&n.src&&y((d=(i=r.options)==null?void 0:i.backgroundImage)==null?void 0:d.src)&&(r.options.backgroundImage.src=(0,b.createURL)(r.options.backgroundImage.src))})},Io=o=>{o.visualizations&&Object.values(o.visualizations).forEach(e=>{var t,n;(t=e.options)!=null&&t.src&&y(e.options.src)&&(e.options.src=(0,b.createURL)(e.options.src)),(n=e.options)!=null&&n.icon&&y(e.options.icon)&&(e.options.icon=(0,b.createURL)(e.options.icon));let{eventHandlers:r=[]}=e;r.forEach(i=>{var d;(d=i.options)!=null&&d.url&&y(i.options.url)&&(i.options.url=(0,b.createURL)(i.options.url))})})},y=o=>!!(o!=null&&o.startsWith("/")),Fo=o=>{let e=(0,Y.default)(o);return vo(e),Io(e),e},Lo=({definition:o,isCompleteDashboard:e=!1,dashboardTitle:r})=>{let t=L(),[n,i]=(0,l.useState)({}),d=(0,l.useMemo)(()=>Fo(o),[o]),m=(0,l.useMemo)(()=>[l.default.createElement(N,{definition:o,dashboardTitle:r})],[o,r]);return l.default.createElement(u.DashboardContextProvider,{featureFlags:t,geoRegistry:q,iconRegistry:v,mapTileConfig:P,metricsCollectors:So,preset:Co,initialDefinition:d,onTokenBindingChange:i,initialTokenBinding:n,dataSourceContext:xo},l.default.createElement(K.default,{family:"enterprise",colorScheme:"dark",density:"comfortable"},l.default.createElement(z,null),l.default.createElement(yo,{className:"example-core-layout-container",width:"100%",height:"calc(100vh - 78px)"},l.default.createElement(ko,null,l.default.createElement(Do,null,l.default.createElement(wo,null,l.default.createElement(U.Dashboard,{toolbarItems:e?m:void 0,width:"100%",height:"100%"})))))))},zo=o=>l.default.createElement(O,{initialWebFlags:o.webFeatureFlags},l.default.createElement(Lo,C({},o)));export{zo as a};
