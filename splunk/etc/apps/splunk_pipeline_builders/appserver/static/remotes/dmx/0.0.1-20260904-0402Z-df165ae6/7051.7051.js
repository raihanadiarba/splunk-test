/*! For license information please see 7051.7051.js.LICENSE.txt */
(self.webpackChunkdmx=self.webpackChunkdmx||[]).push([[7051],{50571(e,t,n){"use strict";var a=n(85959),r=n.n(a),i=n(26250),l=n.n(i),s=n(2543),o=n(78967),c=n(72403),d=n.n(c),u=n(68870),p=n(77289),m=n(34903);const f=l().div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${u.default.backgroundColorNavigation};
    gap: ${u.default.spacingMedium};
    min-height: 42px;
    padding: 0 ${u.default.spacingMedium};

    border-bottom: 1px solid ${u.default.borderColorWeak};
    ${(0,o.pick)({dark:i.css`
            border-top: 1px solid ${u.default.borderColorWeak};
        `})}
`,g=l().div`
    display: flex;
    flex: 1;
    flex-shrink: 0;
    justify-content: flex-start;
    align-items: center;

    & > nav {
        a,
        span {
            color: ${u.default.contentColorDefault};
        }

        [data-unsaved='true']:last-child {
            color: ${u.default.contentColorMuted};
        }
    }
`,h=l().div`
    margin: 0 0 0 ${u.default.spacingSmall};
`,b=l().div``,y=l().div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
    gap: ${u.default.spacingMedium};
`;n.d(t,["N",0,e=>{var{breadcrumbs:t,onNavigate:n,title:a,hasUnsavedChanges:i,statusIcon:l,centeredContent:o,rightContent:c,className:u}=e,v=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(a=Object.getOwnPropertySymbols(e);r<a.length;r++)t.indexOf(a[r])<0&&Object.prototype.propertyIsEnumerable.call(e,a[r])&&(n[a[r]]=e[a[r]])}return n}(e,["breadcrumbs","onNavigate","title","hasUnsavedChanges","statusIcon","centeredContent","rightContent","className"]);const E=(0,s.reduce)(v,(e,t,n)=>{var a;return("role"===(a=n)||a.startsWith("aria-")||a.startsWith("data-"))&&(e[n]=t),e},{});return r().createElement(f,Object.assign({className:u},E),r().createElement(m.N,{id:"document-toolbar",level:2,title:"Document Toolbar"}),r().createElement(g,null,t?r().createElement(r().Fragment,null,r().createElement(d(),null,[...t,{href:"#current",name:`${a}${i?" *":""}`}].map(({href:e,name:t})=>r().createElement(d().Item,{onClick:n,key:e,label:t,to:e}))),l&&r().createElement(h,null,l)):r().createElement(p.x,{width:"132px"})),r().createElement(b,null,o),r().createElement(y,null,c))}])},86920(e,t,n){"use strict";var a=n(85959),r=n.n(a),i=n(26250),l=n.n(i),s=n(2543),o=n(52529),c=n.n(o),d=n(41194);const u=l()(c().Row)`
    &:hover {
        background-color: transparent !important;
    }
`,p={maxHeight:"calc(100vh - 100px)"};n.d(t,["v",0,({columns:e=[],numberOfLoadingRows:t=5,className:n,style:a,stripeRows:i=!0})=>r().createElement(c(),{headType:"fixed",innerStyle:p,stripeRows:i,"data-test":"filterable-sortable-table-loading",className:n,style:a,"aria-busy":"true"},r().createElement(c().Head,null,e.map(({align:e="left",header:t,key:n,sortKey:a,width:i})=>r().createElement(d.mI,Object.assign({align:e,key:n||a},null!=i?{width:i}:{}),t))),r().createElement(c().Body,null,(0,s.range)(t).map(t=>r().createElement(u,{key:t},e.map(({key:e,sortKey:t})=>r().createElement(c().Cell,{key:e||t},r().createElement(d.nM,null)))))))])},34903(e,t,n){"use strict";var a=n(85959),r=n.n(a),i=n(26250),l=n.n(i);const s=i.css`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`,o=l().h1`
    ${s}
`,c=l().h2`
    ${s}
`,d=l().h3`
    ${s}
`;n.d(t,["N",0,({level:e,id:t,title:n})=>{const a=(e=>{switch(e){case 1:default:return o;case 2:return c;case 3:return d}})(e);return r().createElement(a,{id:t},n)}])},75869(e,t,n){"use strict";var a=n(26250),r=n.n(a),i=n(78967);const l=r().main.attrs({id:"main"})`
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
`,s=(r().main.attrs({id:"main"})`
    display: flex;
    flex-direction: column;
    margin: ${i.variables.spacingLarge};
    & > .maintenance-message-container {
        margin: -${i.variables.spacingLarge} -${i.variables.spacingLarge} 0;
    }
`,r().div`
    display: flex;
    flex: 1 0 0;
    min-height: 0;
`),o=r().div`
    flex: 1;
    justify-content: center;
    align-items: center;
`;n.d(t,["YA",0,o,"gZ",0,l,"j0",0,s])},49449(e,t,n){"use strict";var a=n(85959);const r=(0,a.createContext)(!1);r.displayName="IsVisualTestContext",r.Provider,n.d(t,["QR",0,()=>(0,a.useContext)(r)])},72403(e,t,n){(()=>{"use strict";var t={n:e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},d:(e,n)=>{for(var a in n)t.o(n,a)&&!t.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:n[a]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},a={};t.r(a),t.d(a,{BreadcrumbsContext:()=>u,Item:()=>k,default:()=>M});const r=n(85959);var i=t.n(r);const l=n(5556);var s=t.n(l);const o=n(20259),c=n(11939);var d=(0,r.createContext)({});d.displayName="Breadcrumbs";const u=d,p=n(26250);var m=t.n(p);const f=n(78967);var g=m().ol.withConfig({displayName:"BreadcrumbsStyles__StyledList",componentId:"sc-1maeyfk-0"})([""," flex-wrap:wrap;"],f.mixins.reset("flex")),h=m().li.withConfig({displayName:"BreadcrumbsStyles__StyledListItem",componentId:"sc-1maeyfk-1"})(["display:flex;min-width:max-content;a[aria-current]{font-weight:",";color:",";cursor:default;}"],f.variables.fontWeightSemiBold,f.variables.contentColorActive),b=m().span.withConfig({displayName:"BreadcrumbsStyles__StyledSeparator",componentId:"sc-1maeyfk-2"})(["cursor:default;padding:0 ",";color:",";"],f.variables.spacingSmall,f.variables.contentColorDefault);const y=n(59421);var v=t.n(y),E=m()(v()).withConfig({displayName:"ItemStyles__StyledLink",componentId:"sc-1ywtawf-0"})(["display:flex;align-items:center;gap:",";white-space:nowrap;color:",";&:where(:hover,:focus):not([disabled],[aria-disabled='true']){color:",";}"],f.variables.spacingXSmall,f.variables.contentColorDefault,f.variables.contentColorActive),w=["enableCurrentPage","endAdornment","isCurrent","label","onClick","startAdornment","to"];function C(){return C=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)({}).hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},C.apply(null,arguments)}var x={elementRef:s().oneOfType([s().func,s().object]),enableCurrentPage:s().bool,endAdornment:s().node,isCurrent:s().bool,label:s().string.isRequired,onClick:s().func,startAdornment:s().node,to:s().string.isRequired};function S(e){var t=e.enableCurrentPage,n=e.endAdornment,a=e.isCurrent,l=e.label,s=e.onClick,o=e.startAdornment,c=e.to,d=function(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n={};for(var a in e)if({}.hasOwnProperty.call(e,a)){if(-1!==t.indexOf(a))continue;n[a]=e[a]}return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],-1===t.indexOf(n)&&{}.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}(e,w),p=(0,r.useContext)(u).onClick,m={to:c},f=(0,r.useCallback)(function(e){null==s||s(e,{label:l,to:c}),null==p||p(e,{label:l,to:c})},[s,p,l,c]);a&&(m["aria-current"]="page",t||(m.disabled=!0));var g=s||p?{onClick:f}:{};return i().createElement(E,C({appearance:"standalone","data-test":"item"},g,m,d),o&&o,l,n&&n)}S.propTypes=x;const k=S;var $=["children","elementRef","enableCurrentPage","onClick"];function P(){return P=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)({}).hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},P.apply(null,arguments)}var I={children:s().node.isRequired,elementRef:s().oneOfType([s().func,s().object]),enableCurrentPage:s().bool,onClick:s().func};function O(e){var t,n=e.children,a=e.elementRef,l=e.enableCurrentPage,s=e.onClick,d=function(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n={};for(var a in e)if({}.hasOwnProperty.call(e,a)){if(-1!==t.indexOf(a))continue;n[a]=e[a]}return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],-1===t.indexOf(n)&&{}.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}(e,$),p=r.Children.toArray(n).filter(r.isValidElement).map(function(e,a){(0,c.isDev)()&&(e.type!==k&&(0,c.log)("warn","Child type of ".concat(e.type," is not supported, `children` must be `Breadcrumbs.Item`s.")),void 0===t&&(t=new Set),t.add(e.props.to),t.size!==a+1&&(0,c.log)("warn","Warning: `Breadcrumbs` encountered children with the same `to` prop. The `to` prop must be unique for sibling `Breadcrumbs.Item`s. This will cause `react` to throw a warning for children having the same keys."));var s=a===r.Children.count(n)-1,o=(0,r.cloneElement)(e,{isCurrent:s,enableCurrentPage:l});return i().createElement(h,{key:e.props.to},o,!s&&i().createElement(b,{"aria-hidden":"true"},"/"))}),m=(0,r.useMemo)(function(){return{onClick:s}},[s]);return i().createElement(u.Provider,{value:m},i().createElement("nav",P({"data-test":"breadcrumbs","aria-label":(0,o._)("Breadcrumbs"),ref:a},d),i().createElement(g,null,p)))}O.propTypes=I,O.Item=k;const M=O;e.exports=a})()},54240(e,t,n){"use strict";n.d(t,{S0:()=>f,$F:()=>g});var a=n(85959),r=n.n(a),i=n(53209),l=n(22427),s=n.n(l),o=n(59421),c=n.n(o),d=n(26250),u=n.n(d),p=n(23465),m=n(68870);u()(p.$)`
    border-radius: ${m.default.spacingXSmall};
    align-self: start;
`,u()(s())`
    color: ${m.default.contentColorActive};
    margin-right: ${m.default.spacingSmall};
    width: 1em;
    height: 1em;
`;const f=({handleClick:e})=>{const t=(0,a.useCallback)(t=>{t.preventDefault(),e?.()},[e]);return r().createElement(c(),{onClick:t,appearance:"standalone"},r().createElement(s(),null),i.t` Copy ID `)},g=()=>r().createElement(c(),{to:"https://docs.splunk.com/Documentation/SplunkCloud/search2preview/SearchExperience/ConnectingEC",openInNewContext:!0},i.t`Pair with Splunk Cloud`)},48469(e,t,n){"use strict";n.d(t,{l:()=>b});var a=n(85959),r=n.n(a),i=n(53209),l=n(64200),s=n.n(l),o=n(39643),c=n.n(o),d=n(24379),u=n.n(d),p=n(14250),m=n(89505);const f=({onRequestClose:e})=>r().createElement(r().Fragment,null,r().createElement(m.hb,null,r().createElement(m.ES,null,r().createElement(u(),{size:"large"}),r().createElement(c(),{level:6},i.t`Loading...`))),r().createElement(p.j,{onRequestClose:e})),g=r().lazy(()=>n.e(21).then(n.bind(n,20021))),h=({open:e,destination:t,onRequestClose:n,returnFocus:a,children:l})=>r().createElement(m.jO,{open:e,"data-test":"destinations-table-delete-modal",onRequestClose:n,returnFocus:a},r().createElement(s().Header,null,r().createElement(m.oR,null,i.t`Delete ${t?.name}`)),l),b=({open:e,destination:t,onDeleteSuccess:n,onRequestClose:i,returnFocus:l})=>r().createElement(h,{open:e,destination:t,onRequestClose:i,returnFocus:l},r().createElement(a.Suspense,{fallback:r().createElement(f,{onRequestClose:i})},r().createElement(g,{key:t?.id,destination:t,onDeleteSuccess:n,onRequestClose:i})))},14250(e,t,n){"use strict";var a=n(85959),r=n.n(a),i=n(53209),l=n(70181),s=n.n(l),o=n(64200),c=n.n(o);n.d(t,["j",0,({onRequestClose:e})=>r().createElement(c().Footer,null,r().createElement(s(),{label:i.t`Close`,onClick:e,appearance:"subtle"}))])},89967(e,t,n){"use strict";n.d(t,{Qn:()=>h});var a=n(85959),r=n.n(a),i=n(53209),l=n(61605),s=n.n(l),o=n(60652),c=n(51625);const d=({onRequestClose:e,maintenanceWindow:t,isNonBlockingMaintenance:n=!1,isInMaintenance:a=!1})=>{const{startDateTime:l,endDateTime:d}=t,u=s()(l).utc().format("dddd, MMMM Do YYYY"),p=s()(d).utc().format("dddd, MMMM Do YYYY"),m=n?a?i.t`The ${o.fI} service is currently undergoing maintenance, scheduled for ${u}-${p}. No disruptions to data ingestion and processing are expected. However, you might encounter errors that prevent you from completing configuration changes. Please contact your Splunk representative for more information.`:i.t`The ${o.fI} service will undergo maintenance, scheduled for ${u}-${p}. No disruptions to data ingestion and processing are expected. However, you might encounter errors that prevent you from completing configuration changes. Please contact your Splunk representative for more information.`:a?i.t`The ${o.fI} service is currently undergoing maintenance, scheduled for ${u}-${p}. No disruptions to data ingestion and processing are expected. However, you cannot make any configuration changes during this time. Please contact your Splunk representative for more information.`:i.t`The ${o.fI} service will undergo maintenance, scheduled for ${u}-${p}. No disruptions to data ingestion and processing are expected. However, you will not be able to make any configuration changes during that time. Please contact your Splunk representative for more information.`;return r().createElement(c.SZ,{"aria-label":"maintenance announcement",type:a?"warning":"info",onRequestClose:e,className:"maintenance-message-container"},m)};var u=n(27198),p=n.n(u),m=n(50128);const f=()=>{const{maintenanceWindow:e,shouldShowEarlyNotification:t,shouldShowMaintenanceBanner:n}=(0,m.M7)(),[i,l]=(0,a.useState)(!window.sessionStorage.getItem("isEPMaintenanceMessageClosed"));return t&&e?r().createElement(p(),{animation:"expandHeight",open:i,outerStyle:{flex:"0 0 auto"},animateOnMount:!1,outerClassName:"maintenance-message-container"},r().createElement(d,{maintenanceWindow:e,onRequestClose:()=>{window.sessionStorage.setItem("isEPMaintenanceMessageClosed","true"),l(!1)},isNonBlockingMaintenance:n})):null},g=()=>{const{maintenanceWindow:e,shouldShowShortNotification:t,shouldShowMaintenancePage:n,shouldShowMaintenanceBanner:a}=(0,m.M7)();return(t||n||a)&&e?r().createElement(d,{maintenanceWindow:e,isInMaintenance:n||a,isNonBlockingMaintenance:a}):null},h=()=>r().createElement(r().Fragment,null,r().createElement(f,null),r().createElement(g,null))},22301(e,t,n){"use strict";var a=n(85959),r=n.n(a),i=n(47444),l=n(53209),s=n(28592),o=n(56299),c=n(51322);const d=({timestamp:e})=>{const[t,n]=(0,a.useState)(""),[i,o]=(0,s.nm)(()=>n((e=>{const t=(e=>{const t=(0,c.AV)()-(0,c.pp)(e).getTime();return{days:Math.floor(t/c.d_),hours:Math.floor(t/c.dp%24),minutes:Math.floor(t/6e4%60),seconds:Math.floor(t/1e3)}})(e);return t.days?l.t`Last updated: More than 24 hours ago`:t.hours?(0,l.ngettext)(l.msgid`Last updated: 1 hour ago`,`Last updated: ${t.hours} hours ago`,t.hours):t.minutes?(0,l.ngettext)(l.msgid`Last updated: 1 minute ago`,`Last updated: ${t.minutes} minutes ago`,t.minutes):l.t`Last updated: A few seconds ago`})(e)),3e4);return(0,a.useEffect)(()=>(e&&i(),()=>{o(),n("")}),[e]),t?r().createElement(r().Fragment,null,t):null};n.d(t,["O",0,({nodeId:e,pipelineId:t})=>{const n=(0,i.vc)((0,o.b5)({nodeId:e,pipelineId:t}));return r().createElement(d,{timestamp:n})},"d",0,()=>{const e=(0,i.vc)(o.Tv);return r().createElement(d,{timestamp:e})}])},68514(e,t,n){"use strict";n.d(t,{E:()=>a.EQ});var a=n(3579)},28592(e,t,n){"use strict";n.d(t,{I$:()=>o,nm:()=>s});var a=n(2543),r=n(85959),i=n(47444),l=(n(55507),n(49449));function s(e,t=1e4,n){const a=(0,l.QR)(),i=(0,r.useRef)(null),s=(0,r.useCallback)(()=>{a||i.current&&(clearTimeout(i.current),n?.())},[a,n]),o=(0,r.useCallback)(()=>{if(a)return Promise.resolve(null);const n=async a=>{e();const r=setTimeout(n,t,a);return i.current=r,r};return new Promise(n)},[e,a,t]);return(0,r.useEffect)(()=>s,[s]),[o,s]}function o(e,t){const n=(0,r.useRef)(t??null),l=(0,i.xf)(e);switch((0,r.useEffect)(()=>{"hasValue"!==l.state||(0,a.isEqual)(l.contents,n.current)||(n.current=l.contents)},[l.contents,l.state]),l.state){case"hasValue":return l.contents;case"loading":case"hasError":if(null!=n.current)return n.current;throw l.contents;default:throw new Error("This line should never be reached.")}}},54307(e,t,n){"use strict";var a=n(12358),r=n.n(a),i=n(80299),l=n.n(i);n.d(t,["j",0,(e,t,n)=>{return((e,t)=>l()(e,t))((a=e,i=n,r()(a,i)),t);var a,i}])},13736(e,t,n){"use strict";var a=n(85959),r=n.n(a),i=n(47444),l=n(53209),s=n(27265),o=n(33199),c=n(18636),d=n(2619),u=n(11437),p=n(35407),m=n(1744),f=n(69245),g=n(54240),h=n(72478),b=n(21906),y=n(83993),v=n(56299),E=n(54307),w=n(69131),C=n(96056),x=n(78617),S=n(6334);const k=()=>{const{isCloudProcessorSubscribed:e}=(0,b.Pm)(),t=(0,m.ld)(),n=(0,m.af)(),a=(0,m.bJ)();return(0,i.Zs)(()=>r=>{switch(r){case o.fU:case s.hM:t(),n();break;case o.jM:a();break;default:a(),e&&(t(),n())}},[e])},$=()=>{const e=(0,d.$G)(),t=k(),n=(0,w.nI)();return(0,a.useCallback)(async(a,r)=>{const i=await e.updateJob(a,{status:u.qM.Canceled}),l=i.runtime===c.SearchRuntime.IngestEdge?o.jM:o.fU;return t(l),r&&await n(r),i},[e,t,n])},P=()=>{const e=k();return(0,a.useCallback)(async t=>{const n=await(0,y.EO)().updateRunningPipeline({...t});return e((0,s.KH)(t.runtime)),n},[e])};n.d(t,["$i",0,$,"Jn",0,()=>{const e=(0,m.ld)(),t=(0,m.An)();return()=>{e(),t()}},"TI",0,P,"Uw",0,()=>{const e=k(),t=(0,w.Cp)();return(0,a.useCallback)(async n=>{const a=await(0,y.EO)().applyPipeline({...n});return await t(n.pipelineSpecId),e((0,s.KH)(n.runtime)),a},[t,e])},"dp",0,()=>{const e=(0,S.R)(),{toast:{postToast:t}}=(0,h.p)();return(0,i.Zs)(({refresh:n})=>async()=>{const a=(await(0,y.EO)().listDatasetsAll({kind:c.IndexerDatasetKind.Indexer})).results.filter(e=>!!e.connection);try{await(0,y.EO)().postSystemPipelineModules(),n(v.FT)}catch(n){0===a.length&&t({type:"error",dismissOnActionClick:!0,message:r().createElement(r().Fragment,null,l.t`Tenant not paired with Splunk Cloud. Connection dataset not found. `,r().createElement(g.$F,null))}),e("Error",n)}},[e,t])},"mT",0,k,"mu",0,()=>(0,a.useCallback)(async(e,t,n)=>(0,y.EO)().validatePipeline(e,t,n),[]),"yt",0,()=>{const e=P(),t=$(),n=(0,C.V)();return(0,a.useCallback)(async(a,r)=>{const i=(0,E.j)([...r.context?.edgeProcessors??[]],[],[a]),l=(0,x.HJ)(r.context),s=l?.pipelineSpecId;if(0!==i.length&&s){const t=(await(0,p.uf)(s))?.searchModule,{module:a,parameters:c}=n(t,f.XP.PRODUCTION);await e({jobId:r.jobId,pipelineSpecId:s,spl:a,parameters:c,edgeProcessors:i,previousVersion:l?.pipelineVersion,previousJobIds:l?.previousJobIds,runtime:o.jM})}else await t(r.jobId,s)},[t,e,n])}])},69131(e,t,n){"use strict";var a=n(85959),r=n(47444),i=n(33199),l=n(72478),s=n(3990),o=n(39318),c=n(83993),d=n(56299);const u=()=>(0,r.Zs)(({refresh:e})=>()=>{e(d.a2),e(d.ZN),e(d.nd)},[]),p=()=>(0,r.Zs)(({refresh:e})=>t=>{e((0,d.Zt)(t))},[]);n.d(t,["Cp",0,()=>{const e=p();return(0,a.useCallback)(async t=>{const n=await(0,c.EO)().publishPipelineSpecFile(t);return e(t),n},[e])},"Df",0,()=>{const e=u();return(0,a.useCallback)(async t=>{const n=await(0,c.EO)().saveDraftPipelineSpec(t);return e(),n},[e])},"LA",0,u,"Qo",0,p,"Tj",0,()=>{const e=u(),t=p();return(0,a.useCallback)(async(n,a)=>{const r=await(0,c.EO)().updatePipelineSpecMetadata(n,a);return e(),t(n),r},[t,e])},"_p",0,()=>{const e=u(),t=p();return(0,a.useCallback)(async n=>{await(0,c.EO)().deletePipelineSpec(n),e(),t(n)},[t,e])},"kB",0,()=>{const e=u(),t=p();return(0,a.useCallback)(async n=>{const a=await(0,c.EO)().saveDraftPipelineSpec(n);return e(),t(n.id),a},[t,e])},"nI",0,()=>{const e=p();return(0,a.useCallback)(async t=>{const n=await(0,c.EO)().unpublishPipelineSpecFile(t);return e(t),n},[e])},"yI",0,()=>{const{history:e}=(0,l.p)(),{editPipeline:t}=(0,s.hI)(),n=(0,o.Jr)();return(0,a.useCallback)(async({selectedRuntime:a=i.jM,...r}={})=>{const{id:l}=await(0,c.EO)().createDraftPipelineSpec({runtimeProfile:a});n?.track(o.Z2.applyPipelineToNodesIP,{pipelineSpecId:l}),e.push(t({id:l}),null,r)},[e,t,n])}])},6334(e,t,n){"use strict";var a=n(85959),r=n.n(a),i=n(73207),l=n(44317),s=n(54240),o=n(72478),c=n(83993);const d=["Failed to fetch","NetworkError when attempting to fetch resource.","Load failed"];n.d(t,["R",0,()=>{const{toast:{postToast:e}}=(0,o.p)(),{copy:t}=(0,l.C)();return(0,a.useCallback)((n,a,l="Try again later.")=>{const{message:o}=a;let u;u=(e=>{const t=e,n=t?.message;return!("string"!=typeof n||!d.includes(n)||null!=t?.httpStatusCode||t?.code)})(a)?"Cannot connect to the server. Check your network connection and try again.":o||`${l}${(e=>{let t="";return"httpStatusCode"in e&&e.httpStatusCode?t+=` ${e.code}: ${e.httpStatusCode}.`:"status"in e&&e.status&&(t+=` ${e.status}: ${e.statusText}.`),t})(a)}`;const p=(0,c.RE)(a);p&&(u.trim().endsWith(".")||(u=`${u.trim()}.`),u+=(0,i.fp)(p));const m={title:n,dismissOnActionClick:!1,autoDismiss:!1,type:"error",message:u};p&&(m.action={label:r().createElement(s.S0,null),callback:async()=>{await t(p)}}),e(m)},[e,t])}])},96056(e,t,n){"use strict";var a=n(85959),r=n(72478);n.d(t,["V",0,()=>{const{sharedUtils:{generateDispatchConfig:e}}=(0,r.p)();return(0,a.useCallback)((t,n)=>e(t,{configuration:n}),[e])}])},73700(e,t,n){"use strict";var a=n(85959),r=n(72478);n.d(t,["H",0,e=>{const{updatePageTitle:t}=(0,r.p)();(0,a.useEffect)(()=>(t?.(Array.isArray(e)?e:[e]),()=>t?.()),[t,e])}])},75772(e,t,n){"use strict";var a=n(72218);n.d(t,["OW",0,e=>e?a.OI.IP:a.OI.EP,"Yp",0,e=>"pipelines"===e?"pipelines.migrate_to_dataset":"destinations.migrate_to_dataset","k4",0,"migrate_destination.instructions","ze",0,"destination_panel.migrate_to_dataset","zn",0,"pipeline_panel.migrate_to_dataset"])},83716(e,t,n){"use strict";const a=e=>`https://${e}/en-US/app/splunk-unified-dataset-management/manage-datasets`,r=e=>`${a(e)}?create`;n.d(t,["AH",0,e=>`${r(e)}&kind=Azure`,"Ls",0,a,"Xq",0,(e,t)=>`${a(e)}?edit=${t}`,"s0",0,e=>`${r(e)}&kind=AWS`,"zE",0,r])},77051(e,t,n){"use strict";n.r(t),n.d(t,{UpgradeDestination:()=>Se,default:()=>ke});var a=n(85959),r=n.n(a),i=n(47444),l=n(53209),s=n(89629),o=n(18636),c=n(48469),d=n(69538),u=n(72478),p=n(21906),m=n(3990),f=n(88259),g=n(68514),h=n(3579),b=n(56299),y=n(51322),v=n(51337),E=n(28592),w=n(42963),C=n(13736),x=n(15002),S=n(73700),k=n(75772),$=n(83716),P=n(26250),I=n.n(P),O=n(8610),M=n(75869),T=n(46813),D=n(78967),j=n(51625),R=n(41956);const N=I()(M.gZ)`
    flex: 1 1 auto;
    min-height: 0;
`,A=I()(R.xr)`
    overflow: hidden;
`,L=I().div`
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
`,_=I().div`
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    min-height: 0;
    overflow: hidden;
`,F=I().div`
    box-sizing: border-box;
    flex: 0 1 720px;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    min-height: 0;
    padding: calc(${D.variables.spacingXXXLarge} / 2);
    width: 100%;
`,B=I().div`
    box-sizing: border-box;
    flex: 1 1 auto;
    min-height: 0;
    padding: ${D.variables.spacingXSmall};
    ${T.jg}
`,q=I()(O.s)`
    margin: 0 0 ${D.variables.spacingLarge};
`,z=I().p`
    color: ${D.variables.contentColorMuted};
    font-size: ${D.variables.fontSize};
    margin: 0 0 ${D.variables.spacingLarge};
`,H=I().section`
    margin-bottom: ${D.variables.spacingXLarge};
`,U=I().h3`
    margin: 0 0 ${D.variables.spacingXSmall};
    color: ${D.variables.contentColorActive};
`,V=I().p`
    margin: 0 0 ${D.variables.spacingMedium};
    color: ${D.variables.contentColorMuted};
    font-size: ${D.variables.fontSize};
`,W=I().div`
    display: flex;
    gap: ${D.variables.spacingSmall};
    justify-content: flex-start;
`,Y=I().div`
    align-self: flex-start;
    display: flex;
    flex: none;
    width: fit-content;

    & > * {
        flex: 0 0 auto;
        width: fit-content;
    }
`,X=I()(j.e5)`
    display: inline-flex;
    width: fit-content !important;
`,Z=I().div`
    align-items: center;
    display: flex;
    gap: ${D.variables.spacingSmall};
    justify-content: space-between;
    margin-bottom: ${D.variables.spacingSmall};
`,K=I().div`
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    gap: ${D.variables.spacingSmall};
`,J=I().div`
    flex: 0 0 auto;
`,Q=I().div`
    flex: 0 0 auto;
    font-size: ${D.variables.fontSize};
`,G=I().div`
    margin-top: ${D.variables.spacingXSmall};
    max-width: 520px;
    text-align: center;
`,ee=I().div`
    border-top: 1px solid ${D.variables.borderColor};
    display: flex;
    flex: 0 0 auto;
    justify-content: flex-end;
    padding-top: ${D.variables.spacingMedium};
`;var te=n(60652),ne=n(73207),ae=n(78617),re=n(17143),ie=n(2543),le=n(6891);const se=I().div`
    display: flex;
    flex-direction: column;
    align-items: center;
`,oe=I().div`
    font-weight: ${D.variables.fontWeightBold};
`,ce=({illustration:e,title:t,message:n})=>r().createElement(se,null,e||r().createElement(le.v_,{name:"NoResults"}),r().createElement(oe,null,t||l.t`No matches found`),n);var de=n(41194),ue=n(86920),pe=n(59421),me=n.n(pe),fe=n(21973),ge=n.n(fe),he=n(22301),be=n(72218);const ye=[{header:l.t`Name`,key:"name",renderer:({editLink:e,name:t})=>r().createElement(me(),{to:e,openInNewContext:!0},t),sortKey:"name",testId:"name"},{header:l.t`Processor type`,key:"processorType",renderer:({processorType:e})=>e,sortKey:"processorType",testId:"processor-type"}],ve=e=>e?r().createElement(ce,{title:l.t`No matching pipelines`,message:r().createElement(G,null,l.t`Try a different filter value.`)}):r().createElement(ce,{title:l.t`This destination is not used in any applied pipelines`,message:r().createElement(G,null,l.t`You can delete this destination without disrupting current data ingestion. Unapplied pipelines might still be using this destination.`)}),Ee=({destinationName:e,displayedPipelines:t,hasAffectedPipelines:n,isLoadingPipelines:a,manageDatasetsHref:i,onDelete:s,onDone:o,onRefresh:c,onSearchChange:d,product:u=be.OI.EP,search:p})=>r().createElement(L,null,r().createElement(B,null,r().createElement(q,null,l.t`Migrate ${e}`),r().createElement(z,null,l.t`The Data Management app on the Splunk platform now supports datasets that can be used as both pipeline destinations and data sources for federated searches. Migrate this destination by replacing it with a Data Management dataset. `,r().createElement(me(),{openInNewContext:!0,to:(0,be.Yc)(k.k4,u)},l.t`Destination migration documentation`)),r().createElement(H,null,r().createElement(U,null,l.t`Step 1: Create a connection and dataset in the Data Management app`),r().createElement(V,null,l.t`Create the replacement connection and dataset in the Data Management app before updating your pipelines.`),r().createElement(W,null,r().createElement(Y,null,r().createElement(X,{appearance:"primary",to:i,openInNewContext:!0},l.t`Data Management app`)))),r().createElement(H,null,r().createElement(U,null,l.t`Step 2: Update pipelines to use the dataset`),r().createElement(V,null,l.t`The following pipelines are configured to send data to this destination. Update these pipelines to send data to the dataset that you created in the Data Management app.`),r().createElement(Z,null,r().createElement(K,null,r().createElement(J,null,r().createElement(ge(),{inline:!0,value:p,onChange:(e,{value:t})=>d(t??""),placeholder:l.t`Filter by name`})),r().createElement(Y,null,r().createElement(X,{appearance:"secondary",onClick:c},l.t`Refresh`))),r().createElement(Q,null,r().createElement(he.d,null))),a?r().createElement(ue.v,{columns:ye}):r().createElement(de.J0,{columns:ye,emptyState:ve(n),entities:t,entityPropForKey:"id",handleRowClick:ie.noop,rowIdentifierForTest:"name"})),r().createElement(H,null,r().createElement(U,null,l.t`Step 3: Delete the legacy destination`),r().createElement(W,null,r().createElement(Y,null,r().createElement(X,{appearance:"secondary",onClick:s},l.t`Delete`))))),r().createElement(ee,null,r().createElement(Y,null,r().createElement(X,{appearance:"primary",onClick:o},l.t`Done`))));var we=n(89967),Ce=n(79676);const xe=({destinationId:e})=>{const{showFAS3MigrationUI:t}=(0,d.h)(),n=(0,E.I$)((0,b.PO)(e)),g=(0,i.xf)((0,b.r1)(n??{})),S=(0,w.PH)(),P=(0,C.mT)(),I=(0,m.hI)(),{onNavigate:O}=(0,f.c)(),{history:M}=(0,u.p)(),{isCloudProcessorSubscribed:T}=(0,p.Pm)(),D=(0,h.eK)(),j=(0,i.lZ)(b.Tv),[N,L]=(0,a.useState)(""),[B,q,z,H]=(0,x.h)(),U=(0,a.useCallback)(()=>{S(e),P(),j((0,y.AV)())},[e,S,P,j]),V=(0,a.useCallback)(()=>{U(),q()},[U,q]),W=(0,a.useCallback)(()=>{M.push(I.destinations())},[M,I]),Y=!t||!n||n.kind!==o.S3DatasetKind.Awss3;(0,a.useEffect)(()=>{Y&&M.replace(I.destinations())},[M,I,Y]);const X=(0,a.useMemo)(()=>Y||"hasValue"!==g.state?[]:g.contents,[g.contents,g.state,Y]),Z=!Y&&"loading"===g.state,K=(0,a.useMemo)(()=>(({editPipelinePath:e,pipelines:t,search:n})=>t.flatMap(t=>{const n=t.pipelineSpecFile?.id??(0,ae.wm)(t),a=(0,ne.y9)(t.pipelineSpecFile)??n??"";return n?[{id:n,name:a,editLink:e(n),processorType:(0,te.Ls)((0,re.uD)(t))}]:[]}).filter(({name:e})=>e.toLowerCase().includes(n.trim().toLowerCase())))({editPipelinePath:e=>I.editPipeline({id:e}),pipelines:X,search:N}),[X,I,N]);if(!Y&&"hasError"===g.state)throw g.contents;if(Y)return r().createElement(s.Ou,null);const J=(0,v.I)(D);return r().createElement(r().Fragment,null,r().createElement(R.k7,{"data-test":"breadcrumbs-container",breadcrumbs:[{id:Ce.Vp.ROOT,href:I.destinations(),name:l.t`Destinations`}],title:l.t`Migrate ${n.name}`,onNavigate:O}),r().createElement(A,null,r().createElement(_,null,r().createElement(F,null,r().createElement(Ee,{destinationName:n.name,manageDatasetsHref:(0,$.Ls)(J),displayedPipelines:K,hasAffectedPipelines:X.length>0,isLoadingPipelines:Z,onDelete:V,onDone:W,onRefresh:U,onSearchChange:L,product:(0,k.OW)(T),search:N})))),r().createElement(c.l,{open:B,destination:n,onDeleteSuccess:W,onRequestClose:z,returnFocus:H}))},Se=({routeMatch:e})=>{const t=e?.pathParams?.id;return(0,S.H)(l.t`Migrate destination`),r().createElement(N,{"data-test":"upgrade-destination"},r().createElement(we.Qn,null),r().createElement(g.E,null,t?r().createElement(xe,{destinationId:t}):r().createElement(s.Ou,null)))},ke=Se},41956(e,t,n){"use strict";var a=n(26250),r=n.n(a),i=n(50571),l=n(46813),s=n(15759),o=n.n(s),c=n(68870);r().div`
    display: grid;
    justify-content: flex-end;
    padding: 10px;
`;const d=r().div`
    display: flex;
    justify-content: flex-end;
    padding: ${c.default.spacingSmall} 0;

    [data-test='view-debug-logs-button'],
    [data-test='view-history-button'] {
        margin-right: ${c.default.spacingSmall};
    }
`,u=(r().div`
    max-width: 100%;
    padding: 10px;
`,r().div`
    ${l.jg}
    background-color: ${c.default.backgroundColorPage};
    display: flex;
    flex-direction: column;
    flex: 1 0 0;
    min-height: 0;
`),p=r().div`
    padding: 0 ${c.default.spacingMedium};
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    ${l.jg}
`,m=r().div`
    padding: ${c.default.spacingMedium} ${c.default.spacingLarge} 0
        ${c.default.spacingLarge};
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    ${l.jg}
`,f=r()(o())`
    width: 100%;
    height: 363px;
    padding: ${c.default.spacingMedium};
`,g=r()(o().Body)`
    overflow: hidden;
`,h=r().div`
    display: flex;
    justify-content: end;
`,b=r().div`
    display: flex;
    width: 300px;
`,y=r().div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    width: 100%;
    padding-bottom: ${c.default.spacingMedium};
`,v=r()(i.N)`
    button[data-inline] {
        margin-left: 0 !important;
        flex: 0 0 auto;
    }
`,E=r().div`
    padding: ${c.default.spacingMedium} 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: ${c.default.spacingSmall};
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: ${c.default.backgroundColorPage};
`,w=r().div`
    min-width: 0;
`,C=r().div`
    display: flex;
    align-items: center;
    gap: ${c.default.spacingLarge};
    margin-bottom: ${c.default.spacingSmall};

    [data-test='acies-header-title'] {
        flex-shrink: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    [data-test='chip-bowl'] {
        flex-shrink: 0;
    }
`,x=r().div`
    display: flex;
    gap: ${c.default.spacingSmall};
`,S=r().p`
    margin: ${c.default.spacingXSmall};
    margin-left: 0;
    font-size: ${c.default.fontSize};
`;n.d(t,["$5",0,x,"HB",0,g,"VE",0,d,"Vr",0,h,"XR",0,f,"YV",0,b,"_1",0,p,"bw",0,C,"h9",0,E,"k7",0,v,"mc",0,y,"n",0,S,"u6",0,w,"x$",0,m,"xr",0,u])},69245(e,t,n){"use strict";n.d(t,{EY:()=>a,XP:()=>r});let a=function(e){return e.DEFAULT="default",e.DESTRUCTIVE="destructive",e.DESTRUCTIVE_SECONDARY="destructiveSecondary",e.STANDALONE="standalone",e.PRIMARY="primary",e.SECONDARY="secondary",e.SUBTLE="subtle",e}({}),r=function(e){return e.PREVIEW="preview",e.PRODUCTION="production",e}({})}}]);
//# sourceMappingURL=7051.7051.js.map?dbf6d057ad9d219977b6