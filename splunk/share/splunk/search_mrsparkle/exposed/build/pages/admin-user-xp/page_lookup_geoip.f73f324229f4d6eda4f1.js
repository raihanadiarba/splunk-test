"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[4338],{63494:(e,t,a)=>{var r=a(96540),n=a(72403),o=a.n(n),s=a(75602),i=a(69211),l=a(86663),c=a(37446),u=a(30376),p=a(20259);let d=function(e){return e.ERROR="error",e.INFO="info",e.SUCCESS="success",e.WARNING="warning",e}({});const m={type:d.ERROR,message:(0,p._)("Your network connection may have been lost or Splunk may be down.")},f={type:d.ERROR,message:(0,p._)("Something went wrong, please try again.")},g=e=>{switch(e){case"ERROR":default:return d.ERROR;case"WARNING":return d.WARNING;case"INFO":return d.INFO;case"SUCCESS":return d.SUCCESS}};class y extends Error{constructor(e,t){super(),this.messages=e,this.message=e.map((e=>e.message)).join(" "),this.__aux_metadata=t}}const b=async(e,t)=>{let a;try{a=await e.json()}catch{return 404===e.status?[{type:d.ERROR,message:(0,u.nv)((0,p._)("Could not retrieve %s. Make sure that this resource exists and has the correct permissions."),t)}]:0===e.status||12029===e.status?[m]:[{type:d.ERROR,message:(0,u.nv)((0,p._)("Invalid JSON from: %s."),t)}]}return(e=>{if("object"==typeof e&&Array.isArray(e.messages))return e.messages.every((e=>{const t=e;return!!(t&&t.text&&t.type)}));return!1})(a)&&a.messages.length>0?a.messages.map((e=>({type:g(e.type),message:e.text}))):[f]};function h(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function E(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?h(Object(a),!0).forEach((function(t){v(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):h(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function v(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const w={app:"-",owner:"-"};async function O(e,{method:t,queryParams:a,signal:r,body:n,bodyType:o="form"}){const s=a?`${e}?${(0,l.stringify)(a)}`:e,i="json"===o,u=n?i?JSON.stringify(n):(0,l.stringify)((e=>{const t={};for(const a in e){const r=e[a];Array.isArray(r)&&0==r.length?t[a]="":t[a]=e[a]}return t})(n)):null,p=(0,c.getDefaultFetchInit)(),d=i?E(E({},p.headers),{},{"Content-Type":"application/json"}):p.headers;let g;const h=Date.now();try{g=await fetch(s,E(E({},p),{},{method:t,signal:r,body:u,headers:d}))}catch(e){if(r?.aborted)throw e;throw new y([m])}g.ok||await(async(e,t,a)=>{let r;const n=Date.now();try{r=await b(e,t)}catch{throw new y([f],{response:e,durationMs:n-a})}throw new y(r,{response:e,durationMs:n-a})})(g,e,h);const v=Date.now();return E(E({},await g.json()),{},{__aux_metadata:{response:g,durationMs:v-h}})}const R=e=>{const t=e?.reason;return t instanceof Error?t:new Error("string"==typeof t?t:"AbortError: The operation was aborted.")},P=e=>{switch(e){case"WARNING":return d.WARNING;case"INFO":return d.INFO;case"SUCCESS":return d.SUCCESS;default:return d.ERROR}},S=e=>{if(0===e.status)return[m];if(!e.responseText)return e.statusText?[{type:d.ERROR,message:e.statusText}]:[f];try{const t=JSON.parse(e.responseText);if(Array.isArray(t.messages)&&t.messages.length>0)return t.messages.filter((e=>e.text)).map((e=>({type:P(e.type),message:e.text||f.message})));if(t.msg)return[{type:d.ERROR,message:t.msg}]}catch{}return e.statusText?[{type:d.ERROR,message:e.statusText}]:[f]},I=(e,{method:t,signal:a,body:r,onUploadProgress:n})=>new Promise(((o,s)=>{const i=new XMLHttpRequest,l=()=>i.abort();if(a?.aborted)return void s(R(a));a?.addEventListener("abort",l,{once:!0});const u=()=>{a?.removeEventListener("abort",l)};i.open(t,e),(e=>{const{credentials:t,headers:a}=(0,c.getDefaultFetchInit)(),r=new Headers(a);r.delete("Content-Type"),e.withCredentials="include"===t,r.forEach(((t,a)=>{t&&e.setRequestHeader(a,t)}))})(i),i.onload=()=>{if(u(),i.status>=200&&i.status<300)try{o((e=>{if(!e.responseText)return{};try{return JSON.parse(e.responseText)}catch{throw new y([f])}})(i))}catch(e){s(e)}else s(new y(S(i)))},i.onerror=()=>{u(),s(new y(S(i)))},i.onabort=()=>{u(),s(R(a))},i.upload.addEventListener("progress",(e=>{if(!e.lengthComputable)return;const t=e.loaded||0,a=e.total||1;n?.(Math.round(t/a*100))})),i.send(r)})),x="data/lookup-table-files",_={app:"search",owner:"nobody"},k="GeoIP2-City.mmdb",C=(e,t)=>{const a=new FormData;return a.append("spl-ctrl_lookupfile",e),a.append("__owner",_.owner),t||a.append("name",k),a},L={async checkLookupFileExists({signal:e}={}){const{url:t,queryParams:a}=function(e,t,a,r=!0){const n=r?E(E({},w),t||{}):void 0;return{url:(0,i.createRESTURL)(e,n),queryParams:E({output_mode:"json"},a||{})}}(`${x}/${k}`,_);try{return await O(t,{method:"GET",queryParams:a,signal:e}),!0}catch{return!1}},uploadLookupFile:({file:e,overwrite:t,onProgress:a})=>I((e=>e?(0,i.createURL)(`manager/search/${x}/${k}`):(0,i.createURL)(`manager/search/${x}/_new`))(t),{method:"POST",body:C(e,t),onUploadProgress:a})};var T=a(70181),j=a.n(T),F=a(57914),N=a.n(F);const $={PAGE_TITLE:(0,p._)("GeoIP lookup"),TITLE:(0,p._)("GeoIP lookups file"),DESCRIPTION:(0,p._)("Update the file used for GeoIP lookups."),LOOKUPS:(0,p._)("Lookups"),UPLOAD_DESCRIPTION:(0,p._)("Update the lookup file used for GeoIP searches by uploading it here."),FILE_INPUT_LABEL:(0,p._)("GeoIP lookup file"),FILE_REQUIRED_ERROR:(0,p._)("No file was selected. Please select a file."),FILE_TYPE_ERROR:(0,p._)("Only .mmdb files are supported."),SAVE:(0,p._)("Save"),SAVING:(0,p._)("Saving..."),UPLOAD_SUCCESS:(0,p._)("Successfully uploaded the new file.")};var D=a(78967),U=a(99263);var A=a(78374),G=a.n(A),z=a(19683),M=a.n(z);const q=U.default.div`
    padding: ${D.variables.spacingLarge} ${D.variables.spacingLarge} 0;
`,W=U.default.div`
    padding: ${D.variables.spacingLarge};
`,B=U.default.div`
    max-width: ${"912px"};
`,V=(0,U.default)(G())`
    width: 100%;
`,H=(0,U.default)(M())`
    min-width: 380px;
`,J=D.variables.inputHeight,Y=D.variables.spacingLarge,K=U.default.div`
    height: calc(2 * ${J});
`,Q=(0,U.default)(K)`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: ${D.variables.zindexFixedNavbar};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-top: 1px solid ${D.variables.borderColorWeak};
    background-color: ${D.variables.backgroundColorPage};
`,X=U.default.div`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin-left: ${Y};
    z-index: ${D.variables.zindexFixedNavbar};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`,Z=U.default.div`
    box-sizing: border-box;
    width: 100%;
    padding: 0;
    display: flex;
    flex-grow: 1;
    gap: ${D.variables.spacingLarge};
    justify-content: flex-start;
    align-items: center;
`,ee=U.default.div`
    flex: 1 1 auto;
`,te=U.default.div`
    display: flex;
    gap: ${D.variables.spacingLarge};
    align-items: center;
`;function ae(e){return r.createElement(r.Fragment,null,r.createElement(K,null),r.createElement(Q,null,r.createElement(X,null,r.createElement(Z,null,e.children))))}ae.ButtonsGroup=te,ae.Content=ee;var re=a(15091),ne=a.n(re);const oe=".mmdb",se=({errorMessage:e,successMessage:t,isSaving:a,uploadPercentage:n,onFileSelectionChange:o,onSave:s})=>{const i=(0,r.useRef)(null),[l,c]=(0,r.useState)(null),[u,p]=(0,r.useState)(""),d=u||e,m=()=>i.current?.querySelector('input[type="file"]'),f=()=>{const e=m();e&&(e.value="")},g=()=>{c(null),p(""),f()};return r.createElement(B,{"data-testid":"lookup-geoip-upload-form"},r.createElement(ne(),{style:{flexDirection:"column",alignItems:"flex-start"}},r.createElement(H,{accept:oe,"data-testid":"lookup-geoip-upload-field",disabled:a,elementRef:i,error:!!u,help:$.UPLOAD_DESCRIPTION,onRequestAdd:e=>{const t=e[0]||null;if(o(),t){if(!t.name.toLowerCase().endsWith(oe))return c(null),p($.FILE_TYPE_ERROR),f(),void m()?.focus();c(t),u&&p("")}else g()},onRequestRemove:()=>{g(),o()}},l&&r.createElement(H.Item,{name:l.name})),n>0&&r.createElement(V,{"data-testid":"lookup-geoip-upload-progress",percentage:n,tooltip:`${n}%`,type:"info"}),d&&r.createElement(N(),{"data-testid":"lookup-geoip-error",type:"error",appearance:"fill"},d),t&&!d&&r.createElement(N(),{"data-testid":"lookup-geoip-success",type:"success",appearance:"fill"},t)),r.createElement(ae,null,r.createElement(ae.ButtonsGroup,null,r.createElement(j(),{appearance:"primary","data-testid":"lookup-geoip-save-button",disabled:a,label:a?$.SAVING:$.SAVE,onClick:async()=>{if(!l)return u||p($.FILE_REQUIRED_ERROR),void m()?.focus();p("");await s(l)&&g()}}))))};let ie=function(e){return e.OpenPage="page was opened",e.CreateItem="item was created",e.FailedToCreateItem="failed to create item",e.UpdateItem="item was updated",e.FailedToUpdateItem="failed to update item",e.CloneItem="item was cloned",e.FailedToCloneItem="failed to clone item",e.DeleteItem="item was deleted",e.FailedToDeleteItem="failed to delete item",e.EnableItem="item was enabled",e.FailedToEnableItem="failed to enable item",e.DisableItem="item was disabled",e.FailedToDisableItem="failed to disable item",e.ValidationOk="validation was successful",e.ValidationFailed="validation failed",e}({});let le=function(e){return e.LookupGeoIPPage="lookupGeoIPPage",e}({});const ce=(e,t,a={})=>((e,t,a={})=>{window._splunk_metrics_events&&window._splunk_metrics_events.push({type:e,data:{app:s.app,pageAction:t,page:window.location.pathname,custom:a}})})(e,t,a);var ue=a(59421),pe=a.n(ue),de=a(56143),me=a.n(de),fe=a(39643),ge=a.n(fe);const ye=U.default.div`
    padding: ${D.variables.spacingLarge};
    ${e=>e.zeroBottomPadding&&"padding-bottom: 0;"}
`,be=U.default.div`
    float: right;
`,he=(0,U.default)(ge())`
    margin-top: 0;
    margin-bottom: ${D.variables.spacingSmall};
    overflow-wrap: anywhere;
    display: flex;
    gap: ${D.variables.spacingMedium};
`,Ee=({header:e,description:t,externalLink:a,pageControls:n,styling:o={}})=>r.createElement(ye,{"data-testid":"header-section",zeroBottomPadding:o.zeroBottomPadding},n&&r.createElement(be,{"data-test":"header-page-controls"},n),r.createElement(he,{"data-testid":"page-header",level:1},e),t&&"string"==typeof t&&r.createElement(me(),{"data-testid":"page-description",style:{maxWidth:"700px"}},t)||r.createElement(r.Fragment,null,t),a&&r.createElement(pe(),{to:a.url,openInNewContext:!0,"data-testid":"help-link"},a.text));const ve=(0,i.createURL)(`manager/${s.app}/lookups`),we=(0,i.createURL)(`manager/${s.app}/lookup_geoip`);var Oe=a(78598),Re=a(86819),Pe=a.n(Re);const Se=U.createGlobalStyle`
    body {
        margin: 0;
        background-color: ${D.variables.backgroundColorPage};
        font-family: ${D.variables.fontFamily};
        font-size: ${D.variables.fontSize};
        color: ${D.variables.contentColorDefault};
        min-width: ${"960px"};
    }

    // Input overrides because of conflicting styles between our bootstrap css files and SUI
    // can be removed once we remove bootstrap-{theme}.css (ie whenever we handle layout-api being rendered by backbone) 
    input[type=color], input[type=date], input[type=datetime-local], input[type=datetime], input[type=email], input[type=month], input[type=number], input[type=password], input[type=search], input[type=tel], input[type=text], input[type=time], input[type=url], input[type=week], textarea {
        height: auto;
        margin-bottom: 0;
        padding: 0;
        &:focus {
            box-shadow: none;
        }
    }
`;function Ie(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function xe(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const _e=e=>{const t=document.createElement("span");t.textContent=e,document.body.appendChild(t)},ke=(e,t,a)=>function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?Ie(Object(a),!0).forEach((function(t){xe(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):Ie(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({theme:t,pageTitle:e,hideFooter:!0,hideAppBar:!0,layout:"scrolling",navLayout:"auto"},a?{themeFamily:a}:{});(({family:e="enterprise",density:t="comfortable",pageTitle:a,Component:n})=>{(0,Oe.Fo)().then((o=>{Pe()(r.createElement(D.SplunkThemeProvider,{family:e,colorScheme:o,density:t},r.createElement(Se,null),r.createElement(n,null)),ke(a,o,e))})).catch(_e)})({pageTitle:$.PAGE_TITLE,Component:()=>{const[e,t]=(0,r.useState)(""),[a,n]=(0,r.useState)(""),[s,i]=(0,r.useState)(!1),[l,c]=(0,r.useState)(0);(0,r.useEffect)((()=>{ce(le.LookupGeoIPPage,ie.OpenPage)}),[]);const u=()=>{t(""),n("")};return r.createElement("div",{"data-testid":"lookup-geoip-page"},r.createElement(q,null,r.createElement(o(),null,r.createElement(o().Item,{to:ve,label:$.LOOKUPS}),r.createElement(o().Item,{to:we,label:$.TITLE}))),r.createElement(Ee,{header:$.TITLE,description:$.DESCRIPTION}),r.createElement(W,null,r.createElement(se,{errorMessage:e,successMessage:a,isSaving:s,uploadPercentage:l,onFileSelectionChange:u,onSave:async e=>{u(),i(!0),c(0);const a=await L.checkLookupFileExists();try{const r=await L.uploadLookupFile({file:e,overwrite:a,onProgress:c});"ERROR"===r.status?t(r.msg||f.message):n($.UPLOAD_SUCCESS)}catch(e){t(function(e){const t=e,a=t?.messages?.[0]?.message;return a||e instanceof Error&&e.message||f.message}(e))}finally{c(0),i(!1)}return!0}})))},family:"prisma"})}}]);
//# sourceMappingURL=page_lookup_geoip.f73f324229f4d6eda4f1.js.map