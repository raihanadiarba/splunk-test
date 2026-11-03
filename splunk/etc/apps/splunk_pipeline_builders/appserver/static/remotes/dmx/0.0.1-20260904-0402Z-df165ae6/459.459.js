/*! For license information please see 459.459.js.LICENSE.txt */
(self.webpackChunkdmx=self.webpackChunkdmx||[]).push([[459],{50571(e,t,n){"use strict";var r=n(85959),a=n.n(r),o=n(26250),i=n.n(o),l=n(2543),s=n(78967),c=n(72403),u=n.n(c),d=n(68870),m=n(77289),f=n(34903);const p=i().div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${d.default.backgroundColorNavigation};
    gap: ${d.default.spacingMedium};
    min-height: 42px;
    padding: 0 ${d.default.spacingMedium};

    border-bottom: 1px solid ${d.default.borderColorWeak};
    ${(0,s.pick)({dark:o.css`
            border-top: 1px solid ${d.default.borderColorWeak};
        `})}
`,g=i().div`
    display: flex;
    flex: 1;
    flex-shrink: 0;
    justify-content: flex-start;
    align-items: center;

    & > nav {
        a,
        span {
            color: ${d.default.contentColorDefault};
        }

        [data-unsaved='true']:last-child {
            color: ${d.default.contentColorMuted};
        }
    }
`,h=i().div`
    margin: 0 0 0 ${d.default.spacingSmall};
`,b=i().div``,v=i().div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
    gap: ${d.default.spacingMedium};
`;n.d(t,["N",0,e=>{var{breadcrumbs:t,onNavigate:n,title:r,hasUnsavedChanges:o,statusIcon:i,centeredContent:s,rightContent:c,className:d}=e,y=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n}(e,["breadcrumbs","onNavigate","title","hasUnsavedChanges","statusIcon","centeredContent","rightContent","className"]);const w=(0,l.reduce)(y,(e,t,n)=>{var r;return("role"===(r=n)||r.startsWith("aria-")||r.startsWith("data-"))&&(e[n]=t),e},{});return a().createElement(p,Object.assign({className:d},w),a().createElement(f.N,{id:"document-toolbar",level:2,title:"Document Toolbar"}),a().createElement(g,null,t?a().createElement(a().Fragment,null,a().createElement(u(),null,[...t,{href:"#current",name:`${r}${o?" *":""}`}].map(({href:e,name:t})=>a().createElement(u().Item,{onClick:n,key:e,label:t,to:e}))),i&&a().createElement(h,null,i)):a().createElement(m.x,{width:"132px"})),a().createElement(b,null,s),a().createElement(v,null,c))}])},34903(e,t,n){"use strict";var r=n(85959),a=n.n(r),o=n(26250),i=n.n(o);const l=o.css`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`,s=i().h1`
    ${l}
`,c=i().h2`
    ${l}
`,u=i().h3`
    ${l}
`;n.d(t,["N",0,({level:e,id:t,title:n})=>{const r=(e=>{switch(e){case 1:default:return s;case 2:return c;case 3:return u}})(e);return a().createElement(r,{id:t},n)}])},75869(e,t,n){"use strict";var r=n(26250),a=n.n(r),o=n(78967);const i=a().main.attrs({id:"main"})`
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
`,l=(a().main.attrs({id:"main"})`
    display: flex;
    flex-direction: column;
    margin: ${o.variables.spacingLarge};
    & > .maintenance-message-container {
        margin: -${o.variables.spacingLarge} -${o.variables.spacingLarge} 0;
    }
`,a().div`
    display: flex;
    flex: 1 0 0;
    min-height: 0;
`),s=a().div`
    flex: 1;
    justify-content: center;
    align-items: center;
`;n.d(t,["YA",0,s,"gZ",0,i,"j0",0,l])},49449(e,t,n){"use strict";var r=n(85959);const a=(0,r.createContext)(!1);a.displayName="IsVisualTestContext",a.Provider,n.d(t,["QR",0,()=>(0,r.useContext)(a)])},72403(e,t,n){(()=>{"use strict";var t={n:e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},r={};t.r(r),t.d(r,{BreadcrumbsContext:()=>d,Item:()=>S,default:()=>I});const a=n(85959);var o=t.n(a);const i=n(5556);var l=t.n(i);const s=n(20259),c=n(11939);var u=(0,a.createContext)({});u.displayName="Breadcrumbs";const d=u,m=n(26250);var f=t.n(m);const p=n(78967);var g=f().ol.withConfig({displayName:"BreadcrumbsStyles__StyledList",componentId:"sc-1maeyfk-0"})([""," flex-wrap:wrap;"],p.mixins.reset("flex")),h=f().li.withConfig({displayName:"BreadcrumbsStyles__StyledListItem",componentId:"sc-1maeyfk-1"})(["display:flex;min-width:max-content;a[aria-current]{font-weight:",";color:",";cursor:default;}"],p.variables.fontWeightSemiBold,p.variables.contentColorActive),b=f().span.withConfig({displayName:"BreadcrumbsStyles__StyledSeparator",componentId:"sc-1maeyfk-2"})(["cursor:default;padding:0 ",";color:",";"],p.variables.spacingSmall,p.variables.contentColorDefault);const v=n(59421);var y=t.n(v),w=f()(y()).withConfig({displayName:"ItemStyles__StyledLink",componentId:"sc-1ywtawf-0"})(["display:flex;align-items:center;gap:",";white-space:nowrap;color:",";&:where(:hover,:focus):not([disabled],[aria-disabled='true']){color:",";}"],p.variables.spacingXSmall,p.variables.contentColorDefault,p.variables.contentColorActive),C=["enableCurrentPage","endAdornment","isCurrent","label","onClick","startAdornment","to"];function x(){return x=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},x.apply(null,arguments)}var E={elementRef:l().oneOfType([l().func,l().object]),enableCurrentPage:l().bool,endAdornment:l().node,isCurrent:l().bool,label:l().string.isRequired,onClick:l().func,startAdornment:l().node,to:l().string.isRequired};function k(e){var t=e.enableCurrentPage,n=e.endAdornment,r=e.isCurrent,i=e.label,l=e.onClick,s=e.startAdornment,c=e.to,u=function(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(-1!==t.indexOf(r))continue;n[r]=e[r]}return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],-1===t.indexOf(n)&&{}.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}(e,C),m=(0,a.useContext)(d).onClick,f={to:c},p=(0,a.useCallback)(function(e){null==l||l(e,{label:i,to:c}),null==m||m(e,{label:i,to:c})},[l,m,i,c]);r&&(f["aria-current"]="page",t||(f.disabled=!0));var g=l||m?{onClick:p}:{};return o().createElement(w,x({appearance:"standalone","data-test":"item"},g,f,u),s&&s,i,n&&n)}k.propTypes=E;const S=k;var O=["children","elementRef","enableCurrentPage","onClick"];function $(){return $=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},$.apply(null,arguments)}var M={children:l().node.isRequired,elementRef:l().oneOfType([l().func,l().object]),enableCurrentPage:l().bool,onClick:l().func};function P(e){var t,n=e.children,r=e.elementRef,i=e.enableCurrentPage,l=e.onClick,u=function(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(-1!==t.indexOf(r))continue;n[r]=e[r]}return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],-1===t.indexOf(n)&&{}.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}(e,O),m=a.Children.toArray(n).filter(a.isValidElement).map(function(e,r){(0,c.isDev)()&&(e.type!==S&&(0,c.log)("warn","Child type of ".concat(e.type," is not supported, `children` must be `Breadcrumbs.Item`s.")),void 0===t&&(t=new Set),t.add(e.props.to),t.size!==r+1&&(0,c.log)("warn","Warning: `Breadcrumbs` encountered children with the same `to` prop. The `to` prop must be unique for sibling `Breadcrumbs.Item`s. This will cause `react` to throw a warning for children having the same keys."));var l=r===a.Children.count(n)-1,s=(0,a.cloneElement)(e,{isCurrent:l,enableCurrentPage:i});return o().createElement(h,{key:e.props.to},s,!l&&o().createElement(b,{"aria-hidden":"true"},"/"))}),f=(0,a.useMemo)(function(){return{onClick:l}},[l]);return o().createElement(d.Provider,{value:f},o().createElement("nav",$({"data-test":"breadcrumbs","aria-label":(0,s._)("Breadcrumbs"),ref:r},u),o().createElement(g,null,m)))}P.propTypes=M,P.Item=S;const I=P;e.exports=r})()},35319(e,t,n){"use strict";var r=n(85959),a=n.n(r),o=n(23465),i=n(63459),l=n.n(i),s=n(72478),c=n(30770);const u=a().createElement(l(),null);n.d(t,["M",0,({label:e="",route:t="",icon:n=u})=>{const{history:r,tenantName:i}=(0,s.p)();return a().createElement(o.$,{appearance:"primary",icon:n,label:e,onClick:e=>{const n=`/${i}/${t}`;(0,c.dx)(e)?window.open(n):r.push(n)}})}])},67556(e,t,n){"use strict";n.d(t,{l:()=>b});var r=n(85959),a=n.n(r),o=n(53209),i=n(68296),l=n(63459),s=n.n(l),c=n(73592),u=n.n(c),d=n(76646),m=n.n(d),f=n(24379),p=n.n(f),g=n(51625),h=n(35319);const b=({dropdownItems:e=[],label:t,route:n,data_test:r,isLoading:l,onClick:c})=>{const d=r||"create-btn";return e.length?a().createElement(u(),{toggle:a().createElement(g.e5,{appearance:"primary",label:o.t`${t}`,isMenu:!0,icon:l?a().createElement(p(),null):a().createElement(s(),null),"data-test":d,disabled:l})},a().createElement(m(),{style:{width:205}},e.map(e=>a().createElement(m().Item,{"data-test":e.key,className:i.HN,key:e.key,onClick:e.itemOnClick,to:e.itemLink,openInNewContext:e.openInNewContext},o.t`${e.itemLabel}`)))):n?a().createElement(h.M,{label:t,route:n,"data-test":d}):a().createElement(g.e5,{appearance:"primary",label:o.t`${t}`,"data-test":d,icon:a().createElement(s(),null),onClick:c})}},89967(e,t,n){"use strict";n.d(t,{Qn:()=>h});var r=n(85959),a=n.n(r),o=n(53209),i=n(61605),l=n.n(i),s=n(60652),c=n(51625);const u=({onRequestClose:e,maintenanceWindow:t,isNonBlockingMaintenance:n=!1,isInMaintenance:r=!1})=>{const{startDateTime:i,endDateTime:u}=t,d=l()(i).utc().format("dddd, MMMM Do YYYY"),m=l()(u).utc().format("dddd, MMMM Do YYYY"),f=n?r?o.t`The ${s.fI} service is currently undergoing maintenance, scheduled for ${d}-${m}. No disruptions to data ingestion and processing are expected. However, you might encounter errors that prevent you from completing configuration changes. Please contact your Splunk representative for more information.`:o.t`The ${s.fI} service will undergo maintenance, scheduled for ${d}-${m}. No disruptions to data ingestion and processing are expected. However, you might encounter errors that prevent you from completing configuration changes. Please contact your Splunk representative for more information.`:r?o.t`The ${s.fI} service is currently undergoing maintenance, scheduled for ${d}-${m}. No disruptions to data ingestion and processing are expected. However, you cannot make any configuration changes during this time. Please contact your Splunk representative for more information.`:o.t`The ${s.fI} service will undergo maintenance, scheduled for ${d}-${m}. No disruptions to data ingestion and processing are expected. However, you will not be able to make any configuration changes during that time. Please contact your Splunk representative for more information.`;return a().createElement(c.SZ,{"aria-label":"maintenance announcement",type:r?"warning":"info",onRequestClose:e,className:"maintenance-message-container"},f)};var d=n(27198),m=n.n(d),f=n(50128);const p=()=>{const{maintenanceWindow:e,shouldShowEarlyNotification:t,shouldShowMaintenanceBanner:n}=(0,f.M7)(),[o,i]=(0,r.useState)(!window.sessionStorage.getItem("isEPMaintenanceMessageClosed"));return t&&e?a().createElement(m(),{animation:"expandHeight",open:o,outerStyle:{flex:"0 0 auto"},animateOnMount:!1,outerClassName:"maintenance-message-container"},a().createElement(u,{maintenanceWindow:e,onRequestClose:()=>{window.sessionStorage.setItem("isEPMaintenanceMessageClosed","true"),i(!1)},isNonBlockingMaintenance:n})):null},g=()=>{const{maintenanceWindow:e,shouldShowShortNotification:t,shouldShowMaintenancePage:n,shouldShowMaintenanceBanner:r}=(0,f.M7)();return(t||n||r)&&e?a().createElement(u,{maintenanceWindow:e,isInMaintenance:n||r,isNonBlockingMaintenance:r}):null},h=()=>a().createElement(a().Fragment,null,a().createElement(p,null),a().createElement(g,null))},68514(e,t,n){"use strict";n.d(t,{E:()=>r.EQ});var r=n(3579)},28592(e,t,n){"use strict";n.d(t,{I$:()=>s,nm:()=>l});var r=n(2543),a=n(85959),o=n(47444),i=(n(55507),n(49449));function l(e,t=1e4,n){const r=(0,i.QR)(),o=(0,a.useRef)(null),l=(0,a.useCallback)(()=>{r||o.current&&(clearTimeout(o.current),n?.())},[r,n]),s=(0,a.useCallback)(()=>{if(r)return Promise.resolve(null);const n=async r=>{e();const a=setTimeout(n,t,r);return o.current=a,a};return new Promise(n)},[e,r,t]);return(0,a.useEffect)(()=>l,[l]),[s,l]}function s(e,t){const n=(0,a.useRef)(t??null),i=(0,o.xf)(e);switch((0,a.useEffect)(()=>{"hasValue"!==i.state||(0,r.isEqual)(i.contents,n.current)||(n.current=i.contents)},[i.contents,i.state]),i.state){case"hasValue":return i.contents;case"loading":case"hasError":if(null!=n.current)return n.current;throw i.contents;default:throw new Error("This line should never be reached.")}}},93060(e,t,n){"use strict";var r=n(85959),a=n(72478),o=n(83993);n.d(t,["d",0,()=>{const{toast:e}=(0,a.p)();return(0,r.useMemo)(()=>({failure:({title:t,message:n,error:r})=>{const a=(0,o.RE)(r);e?.postError?.({title:t,message:n?[n,r.message]:r.message,requestID:a})},success:({title:t,message:n})=>{e?.postSuccess?.({title:t,message:n})},info:({title:t,message:n})=>{e?.postInfo?.({title:t,message:n})}}),[e])}])}}]);
//# sourceMappingURL=459.459.js.map?d3d1208448aad4961f86