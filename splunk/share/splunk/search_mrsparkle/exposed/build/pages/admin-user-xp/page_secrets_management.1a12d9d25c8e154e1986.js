"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[450],{35663:(e,t,r)=>{var n=r(20259),a=r(96540),o=r(64531),i=r(72403),s=r.n(i),l=r(70181),c=r.n(l),u=r(23840),d=r.n(u),p=r(13700),f=r.n(p),b=r(99263),m=r(78967),g=r(37801),y=r.n(g);const v="912px";var O=r(76806);const E=b.default.div`
    position: relative;
    display: inline-block;
    padding: 0;
`,w=b.default.div`
    position: absolute;
    padding: ${m.variables.spacingLarge};
    inset: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    animation: pulse 2s infinite;

    @keyframes pulse {
        0% {
            background-color: ${(0,O.colorWithAlpha)(m.variables.backgroundColorPage,.2)};
        }
        50% {
            background-color: ${(0,O.colorWithAlpha)(m.variables.backgroundColorPage,.7)};
        }
        100% {
            background-color: ${(0,O.colorWithAlpha)(m.variables.backgroundColorPage,.2)};
        }
    }
`;var h=r(24379),_=r.n(h);const S=b.default.div`
    padding: ${m.variables.spacingLarge};
`,j=b.default.div`
    max-width: ${v};
`,A=b.default.form`
    width: 600px;
`,P=(0,b.default)((({isBusy:e,children:t,className:r})=>a.createElement(E,{"data-testid":"busy-box",className:r},t,e&&a.createElement(w,{"data-testid":"busybox-overlay",role:"progressbar","aria-busy":e},a.createElement(_(),{size:"large"})))))`
    display: flex;
    flex-direction: column;
`,R=(0,b.default)(y())`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: flex-start;
`;var k=r(59421),x=r.n(k),C=r(56143),D=r.n(C),L=r(39643),T=r.n(L);const N=b.default.div`
    padding: ${m.variables.spacingLarge};
    ${e=>e.zeroBottomPadding&&"padding-bottom: 0;"}
`,I=b.default.div`
    float: right;
`,F=(0,b.default)(T())`
    margin-top: 0;
    margin-bottom: ${m.variables.spacingSmall};
    overflow-wrap: anywhere;
    display: flex;
    gap: ${m.variables.spacingMedium};
`,$=({header:e,description:t,externalLink:r,pageControls:n,styling:o={}})=>a.createElement(N,{"data-testid":"header-section",zeroBottomPadding:o.zeroBottomPadding},n&&a.createElement(I,{"data-test":"header-page-controls"},n),a.createElement(F,{"data-testid":"page-header",level:1},e),t&&"string"==typeof t&&a.createElement(D(),{"data-testid":"page-description",style:{maxWidth:"700px"}},t)||a.createElement(a.Fragment,null,t),r&&a.createElement(x(),{to:r.url,openInNewContext:!0,"data-testid":"help-link"},r.text));var W=r(86663),M=r(30376);(function(e){return e.ASC="asc",e.DESC="desc",e})({}).ASC;function B(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function z(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?B(Object(r),!0).forEach((function(t){G(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):B(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function G(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function q(e){return e.entry||[]}function V(e){return{isDisableable:!!e.links?.disable,isEnableable:!!e.links?.enable,isEditable:!!e.links?.edit,isRemovable:!!e.links?.remove}}function K(e){return z(z({},e.content),{},{name:e.name})}function U(e){return z(z({},K(e)),V(e))}function H(e){return q(e).map(U)}const X=e=>!!e&&"dimmed",J=e=>{const t=(e=>Object.entries(e).reduce(((e,[t,r])=>(null!==r&&""!==r&&void 0!==r&&(e[t]=r),e)),{}))(e);return Object.keys(t).length>0?`?${(0,W.stringify)(t)}`:""},Y=({pathname:e=window.location.pathname,params:t={}})=>`${window.location.origin}${e}${J(t)}`;var Z=r(33319),Q=r.n(Z);b.default.div`
    padding: ${m.variables.spacingLarge};
`,b.default.div`
    padding: ${m.variables.spacingLarge};
    display: grid;
    place-items: center;
`,b.default.span`
    color: ${m.variables.contentColorLink};
`;const ee=b.default.div`
    height: 50px;
    padding: 0 ${m.variables.spacingLarge};
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${m.variables.borderColor};
    background-color: ${m.variables.backgroundColorPage};
`,te=(b.default.div`
    max-width: ${v};
`,(0,b.default)(Q())`
    cursor: pointer;
`,m.variables.inputHeight),re=m.variables.spacingLarge,ne=b.default.div`
    height: calc(2 * ${te});
`,ae=(0,b.default)(ne)`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: ${m.variables.zindexFixedNavbar};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-top: 1px solid ${m.variables.borderColorWeak};
    background-color: ${m.variables.backgroundColorPage};
`,oe=b.default.div`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin-left: ${re};
    z-index: ${m.variables.zindexFixedNavbar};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`,ie=b.default.div`
    box-sizing: border-box;
    width: 100%;
    padding: 0;
    display: flex;
    flex-grow: 1;
    gap: ${m.variables.spacingLarge};
    justify-content: flex-start;
    align-items: center;
`,se=b.default.div`
    flex: 1 1 auto;
`,le=b.default.div`
    display: flex;
    gap: ${m.variables.spacingLarge};
    align-items: center;
`;function ce(e){return a.createElement(a.Fragment,null,a.createElement(ne,null),a.createElement(ae,null,a.createElement(oe,null,a.createElement(ie,null,e.children))))}ce.ButtonsGroup=le,ce.Content=se;const ue=/^[0-9]{1,3}(\.[0-9]{1,3}){0,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,de=/^(([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))$/,pe=e=>{if(!ue.test(e))return!1;const[t,r]=e.split("/"),n=t.split(".");if(n.length<4&&void 0===r)return!1;return n.map((e=>parseInt(e,10)<=255)).every((e=>e))},fe=e=>{const t=e.split("/");if(1===t.length)return de.test(t[0]);if(2===t.length){const e=t[0],r=parseInt(t[1],10);return!(Number.isNaN(r)||r<0||r>128)&&(de.test(e)||/^[0-9A-Fa-f]{1,4}(:[0-9A-Fa-f]{1,4})+$/.test(e))}return!1},be=e=>{if(!/^[a-zA-Z0-9\-.*]{1,253}\.?$/g.test(e))return!1;if(e.endsWith("."))return!1;if(e.length>253)return!1;return e.split(".").every((function(e,t){if("*"===e)return 0===t;return/^([a-zA-Z0-9-]+)$/g.test(e)&&e.length<64&&!e.startsWith("-")&&!e.endsWith("-")}))},me=new Set(["127.0.0.1","!127.0.0.1","0:0:0:0:0:0:0:1","!0:0:0:0:0:0:0:1","::1","!::1","localhost","!localhost"]),ge=e=>!(be(e)||pe(e)||fe(e)||(e=>"!"===e[0]&&be(e.slice(1)))(e)||(e=>"!"===e[0]&&pe(e.slice(1)))(e)||(e=>"!"===e[0]&&fe(e.slice(1)))(e)||(e=>""===e.trim())(e)||(e=>"*"===e.trim())(e)),ye={BREADCRUMB_SECRETS_MANAGEMENT:(0,n._)("Secrets management"),BREADCRUMB_NETWORK_ALLOW_LIST:(0,n._)("Network allow list"),HEADER_NETWORK_ALLOW_LIST:(0,n._)("Network allow list"),DESCRIPTION:(0,n._)("Manage access of external networks to passwords in cleartext. Add IPv4 or IPv6 addresses, CIDR blocks, or DNS names. To block access, prefix a network with an exclamation mark (!).")},ve={CLEAR_TEXT_REST_FLAG_SAVED:(0,n._)("view_cleartext_spl_rest flag saved."),NETWORK_ALLOW_LIST_SAVED:(0,n._)("Network allow list saved."),CLEAR_TEXT_REST_FLAG_SAVE_ERROR:(0,n._)("Error saving view_cleartext_spl_rest flag."),NETWORK_ALLOW_LIST_SAVE_ERROR:(0,n._)("Error saving network allow list.")},Oe={ADD_NETWORK:(0,n._)("Add network"),CANCEL:(0,n._)("Cancel"),SAVE:(0,n._)("Save"),SAVING:(0,n._)("Saving...")},Ee={INVALID_NETWORK:(0,n._)("Invalid CIDR range, IP address or hostname."),LOCALHOST_NOT_ALLOWED:(0,n._)("You can't use this value. Localhost addresses always receive passwords in cleartext.")},we={HEADER_OPTIONS:(0,n._)("Options"),DESCRIPTION:(0,n._)("Enable the SPL rest command to return passwords in cleartext in response to calls to the /storage/passwords REST endpoint (view_cleartext_spl_rest)."),RETURN_PASSWORDS:(0,n._)("Return passwords in cleartext"),DONE:(0,n._)("Done")};var he=r(25338),_e=r.n(he);function Se({value:e,error:t,onChange:r}){return a.createElement(R,{"data-testid":"network-control-group",label:"",error:t},a.createElement(_e(),{autoComplete:"off",value:e,error:!!t,onChange:r,"data-testid":"network-input"}))}var je=r(11498),Ae=r.n(je);function Pe(){return Pe=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)({}).hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},Pe.apply(null,arguments)}function Re(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ke(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Re(Object(r),!0).forEach((function(t){xe(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Re(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function xe(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Ce({networks:e,cleartextRest:t,isLoading:r,isSaving:n,onSave:o}){const[i,s]=(0,a.useState)({networks:e.map(((e,t)=>({value:e,id:t}))),cleartextRest:t}),l=(0,a.useCallback)((e=>{e.preventDefault(),o(i.networks.map((({value:e})=>e)).filter((e=>!!e.trim())))}),[i,o]),u=(0,a.useCallback)((()=>{s((e=>ke(ke({},e),{},{networks:[...e.networks,{value:"",id:Math.max(0,...e.networks.map((({id:e})=>e)))+1}]})))}),[s]),d=(0,a.useCallback)((e=>{s((t=>ke(ke({},t),{},{networks:[...t.networks.slice(0,e),...t.networks.slice(e+1)]})))}),[s]),p=(0,a.useCallback)(((e,t,r)=>{s((n=>ke(ke({},n),{},{networks:[...n.networks.slice(0,t),{value:e,id:n.networks[t].id,error:r},...n.networks.slice(t+1,n.networks.length)]})))}),[s]),f=(0,a.useCallback)(((e,t)=>{let r;(e=>me.has(e))(e)?r=Ee.LOCALHOST_NOT_ALLOWED:ge(e)&&(r=Ee.INVALID_NETWORK),p(e,t,r)}),[p]);(0,a.useEffect)((()=>{s({networks:e.map(((e,t)=>({value:e,id:t}))),cleartextRest:t})}),[e,t]);const b=n||r,m=n||r||i.networks.some((({error:e})=>!!e));return a.createElement(a.Fragment,null,a.createElement(j,null,a.createElement(A,{onSubmit:l,"data-testid":"hosts-list-form"},a.createElement(P,{isBusy:r||n},a.createElement(Ae(),{onRequestAdd:u,addLabel:Oe.ADD_NETWORK},i.networks.map(((e,t)=>a.createElement(Ae().Row,{key:t,onRequestRemove:()=>d(t)},a.createElement(Se,Pe({},e,{onChange:(e,{value:r})=>f(r,t)}))))))),a.createElement(ce,null,a.createElement(ce.ButtonsGroup,null,a.createElement(c(),{"data-testid":"cancel-btn",label:Oe.CANCEL,onClick:()=>s({networks:e.map(((e,t)=>({value:e,id:t}))),cleartextRest:t}),disabled:X(b)}),a.createElement(c(),{type:"submit",appearance:"primary","data-testid":"save-btn",label:n?Oe.SAVING:Oe.SAVE,disabled:X(m)}))))))}function De(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Le(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?De(Object(r),!0).forEach((function(t){Te(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):De(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Te(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var Ne=r(69211),Ie=r(37446);let Fe=function(e){return e.ERROR="error",e.INFO="info",e.SUCCESS="success",e.WARNING="warning",e}({});const $e={type:Fe.ERROR,message:(0,n._)("Your network connection may have been lost or Splunk may be down.")},We={type:Fe.ERROR,message:(0,n._)("Something went wrong, please try again.")},Me=e=>{switch(e){case"ERROR":default:return Fe.ERROR;case"WARNING":return Fe.WARNING;case"INFO":return Fe.INFO;case"SUCCESS":return Fe.SUCCESS}};class Be extends Error{constructor(e,t){super(),this.messages=e,this.message=e.map((e=>e.message)).join(" "),this.__aux_metadata=t}}const ze=async(e,t)=>{let r;try{r=await e.json()}catch{return 404===e.status?[{type:Fe.ERROR,message:(0,M.nv)((0,n._)("Could not retrieve %s. Make sure that this resource exists and has the correct permissions."),t)}]:0===e.status||12029===e.status?[$e]:[{type:Fe.ERROR,message:(0,M.nv)((0,n._)("Invalid JSON from: %s."),t)}]}return(e=>{if("object"==typeof e&&Array.isArray(e.messages))return e.messages.every((e=>{const t=e;return!!(t&&t.text&&t.type)}));return!1})(r)&&r.messages.length>0?r.messages.map((e=>({type:Me(e.type),message:e.text}))):[We]};function Ge(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function qe(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Ge(Object(r),!0).forEach((function(t){Ve(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ge(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Ve(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const Ke={app:"-",owner:"-"};async function Ue(e,{method:t,queryParams:r,signal:n,body:a,bodyType:o="form"}){const i=r?`${e}?${(0,W.stringify)(r)}`:e,s="json"===o,l=a?s?JSON.stringify(a):(0,W.stringify)((e=>{const t={};for(const r in e){const n=e[r];Array.isArray(n)&&0==n.length?t[r]="":t[r]=e[r]}return t})(a)):null,c=(0,Ie.getDefaultFetchInit)(),u=s?qe(qe({},c.headers),{},{"Content-Type":"application/json"}):c.headers;let d;const p=Date.now();try{d=await fetch(i,qe(qe({},c),{},{method:t,signal:n,body:l,headers:u}))}catch(e){if(n?.aborted)throw e;throw new Be([$e])}d.ok||await(async(e,t,r)=>{let n;const a=Date.now();try{n=await ze(e,t)}catch{throw new Be([We],{response:e,durationMs:a-r})}throw new Be(n,{response:e,durationMs:a-r})})(d,e,p);const f=Date.now();return qe(qe({},await d.json()),{},{__aux_metadata:{response:d,durationMs:f-p}})}function He(e,t,r,n=!0){const a=n?qe(qe({},Ke),t||{}):void 0;return{url:(0,Ne.createRESTURL)(e,a),queryParams:qe({output_mode:"json"},r||{})}}function Xe(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Je(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Xe(Object(r),!0).forEach((function(t){Ye(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Xe(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Ye(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const Ze="server/status/limits/general/storage_passwords_masking",Qe={async getList({queryParams:e,urlOpts:t,signal:r}){const n=He(Ze,Je({app:"system",owner:"nobody"},t),e);try{return await Ue(n.url,{method:"GET",queryParams:n.queryParams,signal:r})}catch(e){const t=e;if(404===t.__aux_metadata?.response?.status)return{entry:[],generator:{build:"",version:""},links:{},messages:[],origin:"",paging:{offset:0,perPage:0,total:0},updated:""};throw e}},async updateItem({queryParams:e,urlOpts:t,signal:r,body:n}){const a=He(Ze,Je({app:"system",owner:"nobody"},t),e);return await Ue(a.url,{method:"POST",queryParams:a.queryParams,body:n,signal:r})}};var et=r(64200),tt=r.n(et),rt=r(73997),nt=r.n(rt);function at({open:e,value:t,returnFocus:r,isSaving:n,onClose:o,onSave:i}){const[s,l]=(0,a.useState)(t);return(0,a.useEffect)((()=>{l(t)}),[t]),a.createElement(tt(),{returnFocus:r,onRequestClose:o,open:e,style:{width:"600px"}},a.createElement("form",null,a.createElement(tt().Header,{title:we.HEADER_OPTIONS}),a.createElement(tt().Body,null,a.createElement(D(),null,we.DESCRIPTION),a.createElement(R,{"data-testid":"network-control-group",label:""},a.createElement(nt(),{value:s,onClick:(e,{selected:t})=>{l(!t)},selected:s,appearance:"toggle"},we.RETURN_PASSWORDS))),a.createElement(tt().Footer,null,a.createElement(c(),{appearance:"primary",label:we.DONE,type:"button",disabled:n,onClick:()=>i(s)}))))}var ot=r(93139),it=r.n(ot);let st;const lt=(e,t)=>e?.split(/\s+/).includes(t)??!1,ct=["button:not([disabled])","[href]","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", "),ut=e=>{const t=e.closest('[data-test="popover"][id]'),r=t?.id;if(!r)return null;const n=Array.from(e.ownerDocument.querySelectorAll("[data-test-popover-id], [aria-controls], [aria-owns]")).find((e=>e.getAttribute("data-test-popover-id")===r||lt(e.getAttribute("aria-controls"),r)||lt(e.getAttribute("aria-owns"),r)));return n?((a=n).matches(ct)?a:a.querySelector(ct))??n:null;var a};var dt=r(78598),pt=r(86819),ft=r.n(pt);const bt=b.createGlobalStyle`
    body {
        margin: 0;
        background-color: ${m.variables.backgroundColorPage};
        font-family: ${m.variables.fontFamily};
        font-size: ${m.variables.fontSize};
        color: ${m.variables.contentColorDefault};
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
`;function mt(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function gt(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const yt=e=>{const t=document.createElement("span");t.textContent=e,document.body.appendChild(t)},vt=(e,t,r)=>function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?mt(Object(r),!0).forEach((function(t){gt(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):mt(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({theme:t,pageTitle:e,hideFooter:!0,hideAppBar:!0,layout:"scrolling",navLayout:"auto"},r?{themeFamily:r}:{});(({family:e="enterprise",density:t="comfortable",pageTitle:r,Component:n})=>{(0,dt.Fo)().then((o=>{ft()(a.createElement(m.SplunkThemeProvider,{family:e,colorScheme:o,density:t},a.createElement(bt,null),a.createElement(n,null)),vt(r,o,e))})).catch(yt)})({pageTitle:(0,n._)("Secrets management"),Component:()=>{const e=((e,t,r,n)=>{const[o,i]=(0,a.useState)({isLoading:!1,isSuccess:!1,convertedData:null,response:null,error:null}),s=(0,a.useRef)(!0),l=(0,a.useRef)(new AbortController),c=(0,a.useCallback)(((a={},o)=>{l.current.abort(),l.current=new AbortController;const c=l.current.signal;return i((e=>Le(Le({},e),{},{isLoading:!0,error:null}))),e({queryParams:a,urlOpts:o,signal:c}).then((e=>{if(!s.current||c.aborted)return null;const n=t?t(e):null;return i((t=>Le(Le({},t),{},{response:e,convertedData:n,isSuccess:!0,isLoading:!1}))),r&&r(),{response:e,convertedData:n}})).catch((e=>(!s.current||c.aborted||(i((t=>Le(Le({},t),{},{response:null,convertedData:null,error:e,isSuccess:!1,isLoading:!1}))),n&&n()),null)))}),[]),u=(0,a.useCallback)((e=>{i((t=>Le(Le({},t),{},{convertedData:e})))}),[i]);return(0,a.useEffect)((()=>()=>{s.current=!1,l.current.abort("unmounted")}),[]),(0,a.useMemo)((()=>Le(Le({loadData:c},o),{},{isError:!!o.error,setConvertedData:u})),[c,o,u])})(Qe.getList,H),t=(st||(st=(0,ot.makeCreateToast)(it())),st),{captureActiveElement:r,returnFocus:n}=(()=>{const e=(0,a.useRef)(null);return{captureActiveElement:(0,a.useCallback)((()=>{const{activeElement:t}=document;e.current=t instanceof HTMLElement?ut(t)??t:null}),[]),captureElement:(0,a.useCallback)((t=>{e.current=t}),[]),returnFocus:e}})(),[i,l]=(0,a.useState)(!1),[u,p]=(0,a.useState)(!1),b=((e.convertedData||[])[0]||{}).view_cleartext_allowlist,m=(0,a.useMemo)((()=>b?b.split(","):[]),[b]),g=((e.convertedData||[])[0]||{}).view_cleartext_spl_rest,y=!!(0,o._)(g),v=(0,a.useCallback)((async r=>{p(!0);try{await Qe.updateItem({body:{view_cleartext_allowlist:m.join(","),view_cleartext_spl_rest:r?"true":"false"}}),l(!1),p(!1),t({message:ve.CLEAR_TEXT_REST_FLAG_SAVED,type:"success"})}catch(e){const r=String(e instanceof Error?e.message:e);p(!1),t({message:`${ve.CLEAR_TEXT_REST_FLAG_SAVE_ERROR} ${r}`,type:"error"})}e.loadData()}),[m,e,t]),O=(0,a.useCallback)((async r=>{p(!0);try{await Qe.updateItem({body:{view_cleartext_allowlist:r.join(","),view_cleartext_spl_rest:y?"true":"false"}}),p(!1),t({message:ve.NETWORK_ALLOW_LIST_SAVED,type:"success"})}catch(e){const r=String(e instanceof Error?e.message:e);p(!1),t({message:`${ve.NETWORK_ALLOW_LIST_SAVE_ERROR} ${r}`,type:"error"})}e.loadData()}),[y,e,t]);return(0,a.useEffect)((()=>{e.loadData()}),[]),a.createElement("div",{"data-testid":"secrets-management-hosts-page"},a.createElement(ee,null,a.createElement(s(),null,a.createElement(s().Item,{to:"#",label:ye.BREADCRUMB_SECRETS_MANAGEMENT}),a.createElement(s().Item,{to:Y({}),label:ye.BREADCRUMB_NETWORK_ALLOW_LIST}))),a.createElement($,{header:ye.HEADER_NETWORK_ALLOW_LIST,pageControls:a.createElement(c(),{appearance:"secondary","data-testid":"open-cleartext-rest-btn",icon:a.createElement(d(),null),onClick:()=>{r(),l(!0)}}),description:ye.DESCRIPTION}),a.createElement(S,null,a.createElement(Ce,{networks:m,cleartextRest:y,isLoading:e.isLoading,isSaving:u,onSave:O})),a.createElement(at,{returnFocus:n,open:i,value:y,isSaving:u,onClose:()=>l(!1),onSave:v}),a.createElement(f(),{position:"top-center"}))}})}}]);
//# sourceMappingURL=page_secrets_management.1a12d9d25c8e154e1986.js.map