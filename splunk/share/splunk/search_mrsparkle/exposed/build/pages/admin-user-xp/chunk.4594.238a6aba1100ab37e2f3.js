"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[4594],{482:(e,t,r)=>{r.d(t,{y:()=>i});var a=r(96540),n=r(47767);const i=(e="/")=>{const t=(0,n.zy)(),r=(0,n.Zp)();return(0,a.useCallback)((()=>{t.state?.prevPath?r(-1):r(e)}),[e,t.state?.prevPath,r])}},9974:(e,t,r)=>{r.d(t,{E7:()=>s,UC:()=>d,_:()=>l,bO:()=>c,fI:()=>u,tK:()=>f});var a=r(99263),n=r(78967);const i=n.variables.inputHeight,o=n.variables.spacingLarge,l=a.default.div`
    height: calc(2 * ${i});
`,s=(0,a.default)(l)`
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
    margin-left: ${o};
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
`,f=a.default.div`
    display: flex;
    gap: ${n.variables.spacingLarge};
    align-items: center;
`},25674:(e,t,r)=>{r.d(t,{DF:()=>l,GV:()=>s,ds:()=>o});var a=r(91091);const n="owner",i="app",o=e=>{if(!e)return;const t=(0,a.on)(e);return t.owner&&t.app?{owner:t.owner,app:t.app}:void 0},l=e=>{const t=e.get(n),r=e.get(i);return t&&r?{owner:t,app:r}:void 0},s=e=>{if(!e?.owner||!e?.app)return"";const t=new URLSearchParams;return t.set(n,e.owner),t.set(i,e.app),`?${t.toString()}`}},45023:(e,t,r)=>{r.d(t,{rI:()=>a});const a=e=>!(0!==e.button||e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},54318:(e,t,r)=>{r.d(t,{U:()=>c});var a=r(96540),n=r(9421),i=r(9104);const o=["dataQueryKey","request","convertData","useQueryParams","trackDataSuccess","trackDataFailure"];function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){u(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var a=r.call(e,t||"default");if("object"!=typeof a)return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const c=e=>{let{dataQueryKey:t,request:r,convertData:l,useQueryParams:u,trackDataSuccess:c,trackDataFailure:d}=e,f=function(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r={};for(var a in e)if({}.hasOwnProperty.call(e,a)){if(-1!==t.indexOf(a))continue;r[a]=e[a]}return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)r=i[a],-1===t.indexOf(r)&&{}.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}(e,o);const p=(0,a.useMemo)((()=>{const e=new URLSearchParams(f.actualParams.searchParams);return e.sort(),[t,e.toString()]}),[t,f]),b=!!u?.enabled||!!p?.[1]?.length,m=(0,n.I)(s(s({},u||{}),{},{queryKey:p,queryFn:(0,i.xs)({request:r,filters:f,trackDataSuccess:c}),enabled:b,select:e=>({response:e,convertedData:l&&e?l(e):null})})),y=(0,a.useCallback)((()=>{f.verifyPaginationAfterDeletion().shouldRefetchData&&m.refetch()}),[f,m]);return(0,a.useEffect)((()=>{"error"===m.status&&d&&d()}),[m.status,d]),s(s({},m),{},{response:m.data?.response||null,convertedData:m.data?.convertedData||null,formattedError:m.isError?(0,i.$e)(m.error):null,verifyDataPaginationState:y})}},74460:(e,t,r)=>{r.d(t,{D:()=>n,T:()=>a});const a=[10,25,50,100],n={currentPage:1,perPage:a[0],skipItems:0,totalItems:0}},84655:(e,t,r)=>{r.d(t,{U:()=>u});var a=r(67629);function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var a=r.call(e,t||"default");if("object"!=typeof a)return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const l={queries:{refetchOnWindowFocus:!1,retry:!1}},s=(i(i({},l),{},{mutations:{retry:!1}}),(e,t)=>i(i(i({},e),t),{},{queries:i(i({},e.queries),t?.queries),mutations:i(i({},e.mutations),t?.mutations)})),u=({defaultOptions:e}={})=>new a.E(i({defaultOptions:s(l,e)},{}))},86483:(e,t,r)=>{r.d(t,{r5:()=>n,sx:()=>i});var a=r(75602);let n=function(e){return e.OpenPage="page was opened",e.CreateItem="item was created",e.FailedToCreateItem="failed to create item",e.UpdateItem="item was updated",e.FailedToUpdateItem="failed to update item",e.CloneItem="item was cloned",e.FailedToCloneItem="failed to clone item",e.DeleteItem="item was deleted",e.FailedToDeleteItem="failed to delete item",e.EnableItem="item was enabled",e.FailedToEnableItem="failed to enable item",e.DisableItem="item was disabled",e.FailedToDisableItem="failed to disable item",e.ValidationOk="validation was successful",e.ValidationFailed="validation failed",e}({});const i=(e,t,r={})=>{window._splunk_metrics_events&&window._splunk_metrics_events.push({type:e,data:{app:a.app,pageAction:t,page:window.location.pathname,custom:r}})}},89612:(e,t,r)=>{r.d(t,{y:()=>i});var a=r(96540),n=r(9974);function i(e){return a.createElement(a.Fragment,null,a.createElement(n._,null),a.createElement(n.E7,null,a.createElement(n.fI,null,a.createElement(n.bO,null,e.children))))}i.ButtonsGroup=n.tK,i.Content=n.UC}}]);
//# sourceMappingURL=chunk.4594.238a6aba1100ab37e2f3.js.map