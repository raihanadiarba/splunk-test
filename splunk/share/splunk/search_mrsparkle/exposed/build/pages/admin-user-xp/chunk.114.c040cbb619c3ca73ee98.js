"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[114],{152:(e,t,a)=>{a.d(t,{Mu:()=>n});const n="960px"},9974:(e,t,a)=>{a.d(t,{E7:()=>l,UC:()=>p,_:()=>s,bO:()=>c,fI:()=>d,tK:()=>u});var n=a(99263),r=a(78967);const i=r.variables.inputHeight,o=r.variables.spacingLarge,s=n.default.div`
    height: calc(2 * ${i});
`,l=(0,n.default)(s)`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: ${r.variables.zindexFixedNavbar};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-top: 1px solid ${r.variables.borderColorWeak};
    background-color: ${r.variables.backgroundColorPage};
`,d=n.default.div`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin-left: ${o};
    z-index: ${r.variables.zindexFixedNavbar};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`,c=n.default.div`
    box-sizing: border-box;
    width: 100%;
    padding: 0;
    display: flex;
    flex-grow: 1;
    gap: ${r.variables.spacingLarge};
    justify-content: flex-start;
    align-items: center;
`,p=n.default.div`
    flex: 1 1 auto;
`,u=n.default.div`
    display: flex;
    gap: ${r.variables.spacingLarge};
    align-items: center;
`},16685:(e,t,a)=>{a.d(t,{oh:()=>m});var n=a(96540),r=a(78598),i=a(86819),o=a.n(i),s=a(95293),l=a(78967);function d(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function c(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var n=a.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const p=e=>{const t=document.createElement("span");t.textContent=e,document.body.appendChild(t)},u=(e,t,a)=>function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?d(Object(a),!0).forEach((function(t){c(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):d(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({theme:t,pageTitle:e,hideFooter:!0,hideAppBar:!0,layout:"scrolling",navLayout:"auto"},a?{themeFamily:a}:{}),m=({family:e="enterprise",density:t="comfortable",pageTitle:a,Component:i})=>{(0,r.Fo)().then((r=>{o()(n.createElement(l.SplunkThemeProvider,{family:e,colorScheme:r,density:t},n.createElement(s.A,null),n.createElement(i,null)),u(a,r,e))})).catch(p)}},22126:(e,t,a)=>{a.d(t,{A1:()=>d,GP:()=>s,Gf:()=>l});var n=a(39643),r=a.n(n),i=a(78967),o=a(99263);const s=o.default.div`
    padding: ${i.variables.spacingLarge};
    ${e=>e.zeroBottomPadding&&"padding-bottom: 0;"}
`,l=o.default.div`
    float: right;
`,d=(0,o.default)(r())`
    margin-top: 0;
    margin-bottom: ${i.variables.spacingSmall};
    overflow-wrap: anywhere;
    display: flex;
    gap: ${i.variables.spacingMedium};
`},43104:(e,t,a)=>{a.d(t,{Ly:()=>n});const n=e=>{const t=(e?.split("?")[0]??"").split("/").filter(Boolean).at(-1);return t?((e="")=>{try{return decodeURIComponent(e)}catch{return e}})(t):""}},53652:(e,t,a)=>{a.d(t,{A:()=>d});var n=a(96540),r=a(59421),i=a.n(r),o=a(56143),s=a.n(o),l=a(22126);const d=({header:e,description:t,externalLink:a,pageControls:r,styling:o={}})=>n.createElement(l.GP,{"data-testid":"header-section",zeroBottomPadding:o.zeroBottomPadding},r&&n.createElement(l.Gf,{"data-test":"header-page-controls"},r),n.createElement(l.A1,{"data-testid":"page-header",level:1},e),t&&"string"==typeof t&&n.createElement(s(),{"data-testid":"page-description",style:{maxWidth:"700px"}},t)||n.createElement(n.Fragment,null,t),a&&n.createElement(i(),{to:a.url,openInNewContext:!0,"data-testid":"help-link"},a.text))},57423:(e,t,a)=>{a.d(t,{o:()=>n});const n=(e,t={})=>{const a={};for(const[e,n]of Object.entries(t))void 0!==n&&(a[e]=n);const n=e.split("/").filter((e=>"{"===e[0]&&"}"===e.at(-1))).map((e=>e.slice(1,-1)));let r=`${e}`;return n.forEach((e=>{if(a[e]){const t=encodeURIComponent(a[e]);r=r.replace(`{${e}}`,`${t}`)}else r=r.replace(`/{${e}}`,"")})),r}},66567:(e,t,a)=>{a.d(t,{P:()=>s,b:()=>l});var n=a(30376),r=a(20259),i=a(78931);const o=e=>{switch(e){case"ERROR":default:return i.J.ERROR;case"WARNING":return i.J.WARNING;case"INFO":return i.J.INFO;case"SUCCESS":return i.J.SUCCESS}};class s extends Error{constructor(e,t){super(),this.messages=e,this.message=e.map((e=>e.message)).join(" "),this.__aux_metadata=t}}const l=async(e,t)=>{let a;try{a=await e.json()}catch{return 404===e.status?[{type:i.J.ERROR,message:(0,n.nv)((0,r._)("Could not retrieve %s. Make sure that this resource exists and has the correct permissions."),t)}]:0===e.status||12029===e.status?[i.gB]:[{type:i.J.ERROR,message:(0,n.nv)((0,r._)("Invalid JSON from: %s."),t)}]}return(e=>{if("object"==typeof e&&Array.isArray(e.messages))return e.messages.every((e=>{const t=e;return!!(t&&t.text&&t.type)}));return!1})(a)&&a.messages.length>0?a.messages.map((e=>({type:o(e.type),message:e.text}))):[i.pn]}},78931:(e,t,a)=>{a.d(t,{J:()=>r,gB:()=>i,pn:()=>o});var n=a(20259);let r=function(e){return e.ERROR="error",e.INFO="info",e.SUCCESS="success",e.WARNING="warning",e}({});const i={type:r.ERROR,message:(0,n._)("Your network connection may have been lost or Splunk may be down.")},o={type:r.ERROR,message:(0,n._)("Something went wrong, please try again.")}},86483:(e,t,a)=>{a.d(t,{r5:()=>r,sx:()=>i});var n=a(75602);let r=function(e){return e.OpenPage="page was opened",e.CreateItem="item was created",e.FailedToCreateItem="failed to create item",e.UpdateItem="item was updated",e.FailedToUpdateItem="failed to update item",e.CloneItem="item was cloned",e.FailedToCloneItem="failed to clone item",e.DeleteItem="item was deleted",e.FailedToDeleteItem="failed to delete item",e.EnableItem="item was enabled",e.FailedToEnableItem="failed to enable item",e.DisableItem="item was disabled",e.FailedToDisableItem="failed to disable item",e.ValidationOk="validation was successful",e.ValidationFailed="validation failed",e}({});const i=(e,t,a={})=>{window._splunk_metrics_events&&window._splunk_metrics_events.push({type:e,data:{app:n.app,pageAction:t,page:window.location.pathname,custom:a}})}},89612:(e,t,a)=>{a.d(t,{y:()=>i});var n=a(96540),r=a(9974);function i(e){return n.createElement(n.Fragment,null,n.createElement(r._,null),n.createElement(r.E7,null,n.createElement(r.fI,null,n.createElement(r.bO,null,e.children))))}i.ButtonsGroup=r.tK,i.Content=r.UC},95293:(e,t,a)=>{a.d(t,{A:()=>o});var n=a(99263),r=a(78967),i=a(152);const o=n.createGlobalStyle`
    body {
        margin: 0;
        background-color: ${r.variables.backgroundColorPage};
        font-family: ${r.variables.fontFamily};
        font-size: ${r.variables.fontSize};
        color: ${r.variables.contentColorDefault};
        min-width: ${i.Mu};
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
`}}]);
//# sourceMappingURL=chunk.114.c040cbb619c3ca73ee98.js.map