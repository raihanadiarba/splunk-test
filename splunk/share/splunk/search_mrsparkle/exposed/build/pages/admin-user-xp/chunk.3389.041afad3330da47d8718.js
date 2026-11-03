"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[3389],{4920:(e,t,r)=>{r.d(t,{g:()=>s});var a=r(96540),n=r(63064),i=r(84655);const s=({children:e,clientOptions:t})=>{const[r]=(0,a.useState)((()=>(0,i.U)(t)));return a.createElement(n.Ht,{client:r},e)}},9974:(e,t,r)=>{r.d(t,{E7:()=>l,UC:()=>d,_:()=>o,bO:()=>c,fI:()=>u,tK:()=>m});var a=r(99263),n=r(78967);const i=n.variables.inputHeight,s=n.variables.spacingLarge,o=a.default.div`
    height: calc(2 * ${i});
`,l=(0,a.default)(o)`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: ${n.variables.zindexFixedNavbar};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-top: 1px solid ${n.variables.borderColorWeak};
    background-color: ${n.variables.backgroundColorPage};
`,u=a.default.div`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin-left: ${s};
    z-index: ${n.variables.zindexFixedNavbar};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`,c=a.default.div`
    box-sizing: border-box;
    width: 100%;
    padding: 0;
    display: flex;
    flex-grow: 1;
    gap: ${n.variables.spacingLarge};
    justify-content: flex-start;
    align-items: center;
`,d=a.default.div`
    flex: 1 1 auto;
`,m=a.default.div`
    display: flex;
    gap: ${n.variables.spacingLarge};
    align-items: center;
`},64182:(e,t,r)=>{r.d(t,{g:()=>n});var a=r(91091);const n={getEntity({uri:e,signal:t}){const r=(0,a.u2)(e,void 0,void 0,!1);return(0,a.AT)(r.url,{method:"GET",queryParams:r.queryParams,signal:t})},updateAcl({uri:e,body:t,signal:r}){const n=(0,a.u2)((e=>`${e.replace("/scheduled/views/","/saved/searches/").replace(/\/$/,"")}/acl`)(e),void 0,void 0,!1);return(0,a.AT)(n.url,{method:"POST",queryParams:n.queryParams,body:t,signal:r})}}},66567:(e,t,r)=>{r.d(t,{P:()=>o,b:()=>l});var a=r(30376),n=r(20259),i=r(78931);const s=e=>{switch(e){case"ERROR":default:return i.J.ERROR;case"WARNING":return i.J.WARNING;case"INFO":return i.J.INFO;case"SUCCESS":return i.J.SUCCESS}};class o extends Error{constructor(e,t){super(),this.messages=e,this.message=e.map((e=>e.message)).join(" "),this.__aux_metadata=t}}const l=async(e,t)=>{let r;try{r=await e.json()}catch{return 404===e.status?[{type:i.J.ERROR,message:(0,a.nv)((0,n._)("Could not retrieve %s. Make sure that this resource exists and has the correct permissions."),t)}]:0===e.status||12029===e.status?[i.gB]:[{type:i.J.ERROR,message:(0,a.nv)((0,n._)("Invalid JSON from: %s."),t)}]}return(e=>{if("object"==typeof e&&Array.isArray(e.messages))return e.messages.every((e=>{const t=e;return!!(t&&t.text&&t.type)}));return!1})(r)&&r.messages.length>0?r.messages.map((e=>({type:s(e.type),message:e.text}))):[i.pn]}},78931:(e,t,r)=>{r.d(t,{J:()=>n,gB:()=>i,pn:()=>s});var a=r(20259);let n=function(e){return e.ERROR="error",e.INFO="info",e.SUCCESS="success",e.WARNING="warning",e}({});const i={type:n.ERROR,message:(0,a._)("Your network connection may have been lost or Splunk may be down.")},s={type:n.ERROR,message:(0,a._)("Something went wrong, please try again.")}},84655:(e,t,r)=>{r.d(t,{U:()=>u});var a=r(67629);function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){s(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var a=r.call(e,t||"default");if("object"!=typeof a)return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const o={queries:{refetchOnWindowFocus:!1,retry:!1}},l=(i(i({},o),{},{mutations:{retry:!1}}),(e,t)=>i(i(i({},e),t),{},{queries:i(i({},e.queries),t?.queries),mutations:i(i({},e.mutations),t?.mutations)})),u=({defaultOptions:e}={})=>new a.E(i({defaultOptions:l(o,e)},{}))},86483:(e,t,r)=>{r.d(t,{r5:()=>n,sx:()=>i});var a=r(75602);let n=function(e){return e.OpenPage="page was opened",e.CreateItem="item was created",e.FailedToCreateItem="failed to create item",e.UpdateItem="item was updated",e.FailedToUpdateItem="failed to update item",e.CloneItem="item was cloned",e.FailedToCloneItem="failed to clone item",e.DeleteItem="item was deleted",e.FailedToDeleteItem="failed to delete item",e.EnableItem="item was enabled",e.FailedToEnableItem="failed to enable item",e.DisableItem="item was disabled",e.FailedToDisableItem="failed to disable item",e.ValidationOk="validation was successful",e.ValidationFailed="validation failed",e}({});const i=(e,t,r={})=>{window._splunk_metrics_events&&window._splunk_metrics_events.push({type:e,data:{app:a.app,pageAction:t,page:window.location.pathname,custom:r}})}},89612:(e,t,r)=>{r.d(t,{y:()=>i});var a=r(96540),n=r(9974);function i(e){return a.createElement(a.Fragment,null,a.createElement(n._,null),a.createElement(n.E7,null,a.createElement(n.fI,null,a.createElement(n.bO,null,e.children))))}i.ButtonsGroup=n.tK,i.Content=n.UC},94924:(e,t,r)=>{r.d(t,{k:()=>o});var a=r(96540),n=r(57914),i=r.n(n);const s={block:"start"},o=({message:e,dataTestId:t,role:r="alert",scrollOptions:n=s,type:o="error"})=>{const l=(0,a.useRef)(null);return(0,a.useEffect)((()=>{l.current?.scrollIntoView(n)}),[e,n]),a.createElement(i(),{type:o,role:r,elementRef:l,"data-testid":t},e)}}}]);
//# sourceMappingURL=chunk.3389.041afad3330da47d8718.js.map