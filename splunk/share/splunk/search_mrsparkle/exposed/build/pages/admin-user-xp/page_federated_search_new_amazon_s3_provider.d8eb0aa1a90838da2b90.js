"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[6587],{11566:(e,t,a)=>{a.d(t,{b:()=>l,y:()=>r});var i=a(96540);const r=(0,i.createContext)(void 0),l=()=>{const e=(0,i.useContext)(r);if(!e)throw new Error("useCreatorContext must be used within a CreateContextProvider");return e}},20234:(e,t,a)=>{a.d(t,{DE:()=>r,QU:()=>n,SX:()=>l,eT:()=>o});var i=a(20259);let r=function(e){return e.SplunkManagedGlueTablesCloudtrail="aws_glue_table:splunk_managed:cloudtrail",e.SplunkManagedGlueTablesVpcFlow="aws_glue_table:splunk_managed:vpcflow",e.CustomerManagedGlueTables="aws_glue_table",e}({});const l={[r.SplunkManagedGlueTablesCloudtrail]:(0,i._)("AWS Glue table (Splunk-managed: CloudTrail)"),[r.SplunkManagedGlueTablesVpcFlow]:(0,i._)("AWS Glue table (Splunk-managed: VPC flow log)"),[r.CustomerManagedGlueTables]:(0,i._)("AWS Glue table (Customer created)")},o="splunk_managed:cloudtrail",n="splunk_managed:vpcflow"},30223:(e,t,a)=>{var i=a(96540),r=a(20259),l=a(75602),o=a(24379),n=a.n(o),s=a(78967),c=a(64065),d=a.n(c),f=a(99263);const u=f.default.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    place-content: stretch flex-start;
    align-items: stretch;
    font-size: ${s.variables.fontSize};
    color: ${s.variables.contentColorActive};
`,b=f.default.header`
    padding-left: 20px;
    display: flex;
    flex: 0 0 90px;
    gap: 10px;
    align-items: center;
    border-bottom: 1px solid ${s.variables.neutral200};
    background-color: ${s.variables.backgroundColorPage};
`,p=f.default.div`
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${s.variables.contentColorMuted};
    cursor: pointer;

    svg {
        width: 24px;
        height: 24px;
    }
`,m=f.default.h2`
    font-weight: 500;
    font-size: 24px;
    color: ${s.variables.contentColorActive};
`,v=f.default.div`
    display: flex;
    flex: 1;
`,g=f.default.aside`
    box-sizing: border-box;
    width: 230px;
    padding-left: ${s.variables.spacingSmall};
    flex: 0 0 230px;
    background-color: ${s.variables.backgroundColorNavigation};
`,_=f.default.main`
    flex: 0 1 100%;
    background-color: ${s.variables.backgroundColorPage};
`,M=({heading:e,leftPanel:t,content:a,onBack:r})=>i.createElement(u,null,i.createElement(b,null,i.createElement(p,{role:"button",onClick:r},i.createElement(d(),null)),i.createElement(m,null,e)),i.createElement(v,null,i.createElement(g,null,t),i.createElement(_,null,a)));var A=a(81929),T=a(38775),y=a.n(T);const G=({isActive:e})=>e?s.variables.contentColorActive:s.variables.contentColorDefault,S=f.default.div`
    display: flex;
    align-items: center;
    color: ${s.variables.contentColorDefault};
`,h=f.default.div`
    color: ${G};
`,w=f.default.div`
    width: 40px;
    height: 40px;
    margin-right: 5px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${e=>e.isDone&&!e.isActive?s.variables.accentColorPositive:e.isActive?s.variables.contentColorInverted:s.variables.contentColorDefault};

    svg {
        width: 24px;
        height: 24px;
    }

    &::after {
        content: '';
        box-sizing: border-box;
        width: 20px;
        height: 20px;
        position: absolute;
        display: ${({isDone:e,isActive:t})=>e&&!t?"none":"block"};
        border-width: 1px;
        border-style: solid;
        border-color: ${G};
        border-radius: 50%;
        background-color: ${({isActive:e})=>e?s.variables.contentColorActive:"transparent"};
    }
`,k=f.default.div`
    position: relative;
    z-index: 1;
    font-weight: 500;
    font-size: ${s.variables.fontSizeSmall};
`,P=f.default.div`
    margin-top: 10px;
`,x=f.default.div`
    height: 20px;
    margin-bottom: 20px;
    padding-left: 46px;
    position: relative;
    font-size: ${s.variables.fontSizeSmall};

    &::before {
        content: '';
        box-sizing: border-box;
        width: 9px;
        height: 9px;
        position: absolute;
        top: 3px;
        left: 16px;
        border: 1px solid ${s.variables.contentColorActive};
        border-radius: 50%;
        background-color: ${s.variables.contentColorActive};
    }

    &::after {
        content: '';
        position: absolute;
        top: -30px;
        bottom: 10px;
        left: 20px;
        border-left: 1px solid ${s.variables.contentColorActive};
    }
`,C=({step:e,isActive:t,activeSubStepId:a})=>{const r=e.status===A.x.Done;return i.createElement("div",null,i.createElement(S,{isActive:t},i.createElement(w,{"data-testid":t?"icon-active":"icon-default",isActive:t,isDone:r},i.createElement(k,null,r&&!t?i.createElement(y(),{"data-testid":"icon-done",variant:"outlined"}):e.id)),i.createElement(h,{isActive:t},e.title)),!(!t||!e.subSteps?.length)&&i.createElement(P,{"data-testid":"substeps-wrapper"},e.subSteps.map((e=>{const t=a===e.id;return i.createElement(x,{key:e.id,"data-testid":t?"active-substep":"default-substep",isActive:t},i.createElement(h,{isActive:t},e.title))}))))};var E=a(39643),O=a.n(E);const j=f.default.div`
    padding: ${s.variables.spacingLarge} ${s.variables.spacingMedium} ${s.variables.spacingSmall};
`,D=f.default.section`
    margin-bottom: 20px;
`,I=(0,f.default)(O())`
    margin-bottom: 15px;
    color: ${s.variables.contentColorMuted};
`,B=f.default.div`
    margin-left: -8px;
`,z=({config:e,activeStepId:t,activeSubStepId:a})=>{const r=e=>i.createElement(B,null,e.map((e=>i.createElement(C,{key:e.id,isActive:e.id===t,activeSubStepId:a,step:e}))));return i.createElement(j,null,e?.groups?.length?e.groups.map((({title:t,stepIds:a})=>i.createElement(D,{key:t},i.createElement(I,{level:2,variant:"title5"},t),r(e.steps.filter((({id:e})=>a.includes(e))))))):r(e.steps))};var N=a(11566);function $(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,i)}return a}function L(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?$(Object(a),!0).forEach((function(t){R(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):$(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function R(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var i=a.call(e,t||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const K=(e,t)=>(t.forEach(((a,i)=>{const r=L(L({},a),{},{prev:t[i-1]||null,next:t[i+1]||null});e.set(a.id,r)})),e);function H(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,i)}return a}function U(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?H(Object(a),!0).forEach((function(t){V(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):H(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function V(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var i=a.call(e,t||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const F=e=>{const[t,a]=(0,i.useState)(e.steps[0].id),[r,l]=(0,i.useState)(e.steps[0]?.subSteps?.[0]?.id),[o,n]=(0,i.useState)(e),s=(0,i.useMemo)((()=>(e=>{const t=new Map;return K(t,e.steps),e.steps.forEach((({subSteps:e})=>e&&K(t,e))),t})(e)),[e]),c=!(!s.get(t)?.prev&&!s.get(Number(r))?.prev),d=s.get(t),f=!d.subSteps||!s.get(Number(r))?.next,u=!!s.get(t)?.next||!f,b=(0,i.useCallback)((()=>{if(!c)return;const e=s.get(Number(r))?.prev;if(e)return void l(e.id);const i=s.get(t)?.prev;i?.subSteps&&l(i.subSteps.at(-1)?.id),a(i.id)}),[t,r,c,s]),p=(0,i.useCallback)((()=>{if(!u)return;const e=s.get(Number(r))?.next;void 0!==r&&e?l(e.id):a(Number(s.get(t)?.next?.id))}),[t,r,u,s]),m=(0,i.useCallback)(((e,t)=>{n((a=>U(U({},a),{},{steps:a.steps.map((a=>U(U({},a),{},{status:e===a.id?t:a.status})))})))}),[]);return(0,i.useEffect)((()=>{const e=d?.subSteps?.find((e=>e?.id===r)),t=d?.subSteps?.[0];l(e?.id||t?.id||void 0)}),[d,t,r,s]),{activeStepId:t,activeSubStepId:r,backwardEnabled:c,forwardEnabled:u,moveBack:b,moveForward:p,updateStepStatus:m,stepsConfig:o}},W={steps:[{id:1,title:(0,r._)("Provider basics"),status:A.x.Idle},{id:2,title:(0,r._)("Provider details"),status:A.x.Idle},{id:3,title:(0,r._)("Update policies"),status:A.x.Idle},{id:4,title:(0,r._)("Set up federated index"),status:A.x.Idle},{id:5,title:(0,r._)("Summary"),status:A.x.Idle}],groups:[{title:(0,r._)("Connect to Amazon S3"),stepIds:[1,2,3]},{title:(0,r._)("Create index"),stepIds:[4]},{title:(0,r._)("Review"),stepIds:[5]}]};var Y=a(537),q=a(73224);const J={status:q.$.Initial},Q=Object.freeze({providerBasics:J,providerDetails:J,updatePolicies:J,confirmations:J,createProvider:J,updateAcsPolicy:J,indexes:{status:q.$.Initial},summary:J});function X(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,i)}return a}function Z(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?X(Object(a),!0).forEach((function(t){ee(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):X(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function ee(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var i=a.call(e,t||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const te=({children:e})=>{const[t,a]=(0,i.useState)({providers:[],existingFederatedIndexes:[]}),[r,l]=(0,i.useState)(Y.M),[o,n]=(0,i.useState)([]),[s,c]=(0,i.useState)(null),[d,f]=(0,i.useState)(null),[u,b]=(0,i.useState)(null),[p,m]=(0,i.useState)(Q),v=F(W),g=(0,i.useCallback)(((e,t)=>{m((a=>Z(Z({},a),{},{[e]:t})))}),[]);return i.createElement(N.y.Provider,{value:{stackInfo:t,stepsState:v,creatingProvider:r,creatingIndexes:o,cloudtrailData:s,vpcflowStaticData:d,providerPolicies:u,workflow:p,setStackInfo:a,updateCreatingProvider:l,updateCreatingIndexes:n,setCloudtrailData:c,setVpcflowStaticData:f,setProviderPolicies:b,updateWorkflow:g}},e)},ae=e=>{const t=e.stepsConfig.steps.find((({id:t})=>e.activeStepId===t));return`wizard-content-${(t?.title||e.activeStepId.toString()).replace(/\s+/g,"-").toLowerCase()}`},ie={1:i.lazy((()=>Promise.all([a.e(8096),a.e(980),a.e(2546)]).then(a.bind(a,92546)))),2:i.lazy((()=>Promise.all([a.e(8096),a.e(980),a.e(6297)]).then(a.bind(a,66297)))),3:i.lazy((()=>Promise.all([a.e(8096),a.e(980),a.e(2240)]).then(a.bind(a,92240)))),4:i.lazy((()=>Promise.all([a.e(8096),a.e(4355),a.e(7200),a.e(2800)]).then(a.bind(a,97507)))),5:i.lazy((()=>Promise.all([a.e(8096),a.e(4355),a.e(220),a.e(4900)]).then(a.bind(a,64900))))},re=f.default.div`
    padding: 20px 40px;
`,le=({})=>{const{stepsState:e}=(0,N.b)(),t=ie[e.activeStepId];return i.createElement(re,{"data-testid":ae(e)},i.createElement(i.Suspense,{fallback:i.createElement("div",null)},i.createElement(t,null)))};var oe=a(69211),ne=a(82045),se=a(78931),ce=a(29466),de=a(92673),fe=a(97241),ue=a(18458),be=a(16791),pe=a(12624),me=a(13700),ve=a.n(me),ge=a(66481);function _e(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,i)}return a}function Me(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?_e(Object(a),!0).forEach((function(t){Ae(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):_e(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function Ae(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var i=a.call(e,t||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const Te=({})=>{const{setStackInfo:e,stepsState:t,setCloudtrailData:a,setVpcflowStaticData:o,updateCreatingProvider:s}=(0,N.b)(),{loadData:c,isLoading:d}=(0,ce.k)(be.b.getList),{loadData:f,isLoading:u}=(0,ce.k)(pe.y.getList),{loadData:b,isLoading:p}=(0,ce.k)(be.b.getStackRegion),{loadData:m}=(0,ce.k)(fe.S2,de.A.fromDto),{loadData:v}=(0,ce.k)(fe.sL,ge.oc.fromStaticDataDto),[g,_]=(0,i.useState)(!1);(0,i.useEffect)((()=>{(async()=>{try{const{response:t}=await c()||{},{response:a}=await b()||{},{response:i}=await f()||{};if(!t||!i||!a)throw new Error(se.pn.message);const r=t.entry?.map((({name:e,content:t})=>Me(Me({},t),{},{providerName:e})))||[],l=a.entry?.[0]?.content?.region||"",o=i.entry?.map((({name:e,content:t})=>({indexName:e,providerName:t["federated.provider"]})));e({providers:r,existingFederatedIndexes:o}),s((e=>Me(Me({},e),{},{regionKey:l,regionTitle:ue.p.get(l)})))}catch(e){_(!0)}})(),(async()=>{const{convertedData:e}=await m()||{};a(e||null)})(),(async()=>{const{convertedData:e}=await v()||{};o(e||null)})()}),[]);const A=(0,i.useCallback)((()=>{window.location.replace((0,oe.createURL)(`manager/${l.app}/federated_search`))}),[]);return g?i.createElement("div",null,(0,r._)("Page is not loaded")):d||u||p?i.createElement(ne.N,null,i.createElement(n(),{size:"large"})):i.createElement(M,{heading:(0,r._)("Add a new Amazon S3 provider"),onBack:A,leftPanel:i.createElement(z,{config:t.stepsConfig,activeStepId:t.activeStepId,activeSubStepId:t.activeSubStepId}),content:i.createElement(le,null)})},ye=()=>i.createElement(te,null,i.createElement(ve(),{position:"top-center"}),i.createElement(Te,null));var Ge=a(81224),Se=a(79407);(0,a(16685).oh)({family:"prisma",pageTitle:(0,r._)("Federation - New Amazon S3 provider | Splunk Cloud"),Component:()=>i.createElement(Ge.r,null,i.createElement(Se.A,null),i.createElement(ye,null))})},78931:(e,t,a)=>{a.d(t,{J:()=>r,gB:()=>l,pn:()=>o});var i=a(20259);let r=function(e){return e.ERROR="error",e.INFO="info",e.SUCCESS="success",e.WARNING="warning",e}({});const l={type:r.ERROR,message:(0,i._)("Your network connection may have been lost or Splunk may be down.")},o={type:r.ERROR,message:(0,i._)("Something went wrong, please try again.")}},81929:(e,t,a)=>{a.d(t,{x:()=>i});let i=function(e){return e[e.Idle=0]="Idle",e[e.Done=1]="Done",e}({})},90218:(e,t,a)=>{a.d(t,{nr:()=>o,vk:()=>r,wR:()=>l});var i=a(20259);const r="GMT",l=[{label:(0,i._)("(GMT) Greenwich Mean Time"),id:"GMT",offset:0},{label:(0,i._)("(GMT-11:00) Midway Island, Samoa"),id:"Pacific/Midway",offset:-39600},{label:(0,i._)("(GMT-10:00) Hawaii-Aleutian"),id:"America/Adak",offset:-36e3},{label:(0,i._)("(GMT-10:00) Hawaii"),id:"Pacific/Honolulu",offset:-36e3},{label:(0,i._)("(GMT-09:30) Marquesas Islands"),id:"Pacific/Marquesas",offset:-34200},{label:(0,i._)("(GMT-09:00) Gambier Islands"),id:"Pacific/Gambier",offset:-32400},{label:(0,i._)("(GMT-09:00) Alaska"),id:"America/Anchorage",offset:-32400},{label:(0,i._)("(GMT-08:00) Tijuana, Baja California"),id:"America/Ensenada",offset:-28800},{label:(0,i._)("(GMT-08:00) Pitcairn Islands"),id:"Pacific/Pitcairn",offset:-28800},{label:(0,i._)("(GMT-08:00) Pacific Time (US & Canada)"),id:"America/Los_Angeles",offset:-28800},{label:(0,i._)("(GMT-07:00) Mountain Time (US & Canada)"),id:"America/Denver",offset:-25200},{label:(0,i._)("(GMT-07:00) Chihuahua, La Paz, Mazatlan"),id:"America/Chihuahua",offset:-25200},{label:(0,i._)("(GMT-07:00) Arizona"),id:"America/Dawson_Creek",offset:-25200},{label:(0,i._)("(GMT-06:00) Saskatchewan, Central America"),id:"America/Belize",offset:-21600},{label:(0,i._)("(GMT-06:00) Guadalajara, Mexico City, Monterrey"),id:"America/Mexico_City",offset:-21600},{label:(0,i._)("(GMT-06:00) Easter Island"),id:"Chile/EasterIsland",offset:-21600},{label:(0,i._)("(GMT-06:00) Central Time (US & Canada)"),id:"America/Chicago",offset:-21600},{label:(0,i._)("(GMT-05:00) Eastern Time (US & Canada)"),id:"America/New_York",offset:-18e3},{label:(0,i._)("(GMT-05:00) Cuba"),id:"America/Havana",offset:-18e3},{label:(0,i._)("(GMT-05:00) Bogota, Lima, Quito, Rio Branco"),id:"America/Bogota",offset:-18e3},{label:(0,i._)("(GMT-04:00) Caracas"),id:"America/Caracas",offset:-14400},{label:(0,i._)("(GMT-04:00) Santiago"),id:"America/Santiago",offset:-14400},{label:(0,i._)("(GMT-04:00) La Paz"),id:"America/La_Paz",offset:-14400},{label:(0,i._)("(GMT-04:00) Brazil"),id:"America/Campo_Grande",offset:-14400},{label:(0,i._)("(GMT-04:00) Atlantic Time (Goose Bay)"),id:"America/Goose_Bay",offset:-14400},{label:(0,i._)("(GMT-04:00) Atlantic Time (Canada)"),id:"America/Glace_Bay",offset:-14400},{label:(0,i._)("(GMT-03:30) Newfoundland"),id:"America/St_Johns",offset:-12600},{label:(0,i._)("(GMT-03:00) Faukland Islands"),id:"Atlantic/Stanley",offset:-10800},{label:(0,i._)("(GMT-03:00) UTC-3"),id:"America/Araguaina",offset:-10800},{label:(0,i._)("(GMT-03:00) Montevideo"),id:"America/Montevideo",offset:-10800},{label:(0,i._)("(GMT-03:00) Miquelon, St. Pierre"),id:"America/Miquelon",offset:-10800},{label:(0,i._)("(GMT-03:00) Greenland"),id:"America/Godthab",offset:-10800},{label:(0,i._)("(GMT-03:00) Buenos Aires"),id:"America/Argentina/Buenos_Aires",offset:-10800},{label:(0,i._)("(GMT-03:00) Brasilia"),id:"America/Sao_Paulo",offset:-10800},{label:(0,i._)("(GMT-02:00) Mid-Atlantic"),id:"America/Noronha",offset:-7200},{label:(0,i._)("(GMT-01:00) Cape Verde Is."),id:"Atlantic/Cape_Verde",offset:-3600},{label:(0,i._)("(GMT-01:00) Azores"),id:"Atlantic/Azores",offset:-3600},{label:(0,i._)("(GMT) Greenwich Mean Time : Belfast"),id:"Europe/Belfast",offset:0},{label:(0,i._)("(GMT) Greenwich Mean Time : Dublin"),id:"Europe/Dublin",offset:0},{label:(0,i._)("(GMT) Greenwich Mean Time : Lisbon"),id:"Europe/Lisbon",offset:0},{label:(0,i._)("(GMT) Greenwich Mean Time : London"),id:"Europe/London",offset:0},{label:(0,i._)("(GMT) Monrovia, Reykjavik"),id:"Africa/Abidjan",offset:0},{label:(0,i._)("(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna"),id:"Europe/Amsterdam",offset:3600},{label:(0,i._)("(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague"),id:"Europe/Belgrade",offset:3600},{label:(0,i._)("(GMT+01:00) Brussels, Copenhagen, Madrid, Paris"),id:"Europe/Brussels",offset:3600},{label:(0,i._)("(GMT+01:00) West Central Africa"),id:"Africa/Algiers",offset:3600},{label:(0,i._)("(GMT+02:00) Windhoek"),id:"Africa/Windhoek",offset:7200},{label:(0,i._)("(GMT+02:00) Beirut"),id:"Asia/Beirut",offset:7200},{label:(0,i._)("(GMT+02:00) Cairo"),id:"Africa/Cairo",offset:7200},{label:(0,i._)("(GMT+02:00) Gaza"),id:"Asia/Gaza",offset:7200},{label:(0,i._)("(GMT+02:00) Harare, Pretoria"),id:"Africa/Blantyre",offset:7200},{label:(0,i._)("(GMT+02:00) Jerusalem"),id:"Asia/Jerusalem",offset:7200},{label:(0,i._)("(GMT+02:00) Syria"),id:"Asia/Damascus",offset:7200},{label:(0,i._)("(GMT+03:00) Minsk"),id:"Europe/Minsk",offset:10800},{label:(0,i._)("(GMT+03:00) Istanbul"),id:"Europe/Istanbul",offset:10800},{label:(0,i._)("(GMT+03:00) Moscow, St. Petersburg, Volgograd"),id:"Europe/Moscow",offset:10800},{label:(0,i._)("(GMT+03:00) Nairobi"),id:"Africa/Addis_Ababa",offset:10800},{label:(0,i._)("(GMT+03:30) Tehran"),id:"Asia/Tehran",offset:12600},{label:(0,i._)("(GMT+04:00) Abu Dhabi, Muscat"),id:"Asia/Dubai",offset:14400},{label:(0,i._)("(GMT+04:00) Yerevan"),id:"Asia/Yerevan",offset:14400},{label:(0,i._)("(GMT+04:30) Kabul"),id:"Asia/Kabul",offset:16200},{label:(0,i._)("(GMT+05:00) Tashkent"),id:"Asia/Tashkent",offset:18e3},{label:(0,i._)("(GMT+05:00) Ekaterinburg"),id:"Asia/Yekaterinburg",offset:18e3},{label:(0,i._)("(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi"),id:"Asia/Kolkata",offset:19800},{label:(0,i._)("(GMT+05:45) Kathmandu"),id:"Asia/Katmandu",offset:20700},{label:(0,i._)("(GMT+06:00) Astana, Dhaka"),id:"Asia/Dhaka",offset:21600},{label:(0,i._)("(GMT+06:30) Yangon (Rangoon)"),id:"Asia/Rangoon",offset:23400},{label:(0,i._)("(GMT+07:00) Novosibirsk"),id:"Asia/Novosibirsk",offset:25200},{label:(0,i._)("(GMT+07:00) Bangkok, Hanoi, Jakarta"),id:"Asia/Bangkok",offset:25200},{label:(0,i._)("(GMT+07:00) Krasnoyarsk"),id:"Asia/Krasnoyarsk",offset:25200},{label:(0,i._)("(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi"),id:"Asia/Hong_Kong",offset:28800},{label:(0,i._)("(GMT+08:00) Irkutsk, Ulaan Bataar"),id:"Asia/Irkutsk",offset:28800},{label:(0,i._)("(GMT+08:00) Taipei"),id:"Asia/Taipei",offset:28800},{label:(0,i._)("(GMT+08:00) Perth"),id:"Australia/Perth",offset:28800},{label:(0,i._)("(GMT+08:45) Eucla"),id:"Australia/Eucla",offset:31500},{label:(0,i._)("(GMT+09:00) Osaka, Sapporo, Tokyo"),id:"Asia/Tokyo",offset:32400},{label:(0,i._)("(GMT+09:00) Seoul"),id:"Asia/Seoul",offset:32400},{label:(0,i._)("(GMT+09:00) Yakutsk"),id:"Asia/Yakutsk",offset:32400},{label:(0,i._)("(GMT+09:30) Adelaide"),id:"Australia/Adelaide",offset:34200},{label:(0,i._)("(GMT+09:30) Darwin"),id:"Australia/Darwin",offset:34200},{label:(0,i._)("(GMT+10:00) Brisbane"),id:"Australia/Brisbane",offset:36e3},{label:(0,i._)("(GMT+10:00) Hobart"),id:"Australia/Hobart",offset:36e3},{label:(0,i._)("(GMT+10:00) Melbourne"),id:"Australia/Melbourne",offset:36e3},{label:(0,i._)("(GMT+10:00) Sydney"),id:"Australia/Sydney",offset:36e3},{label:(0,i._)("(GMT+10:00) Vladivostok"),id:"Asia/Vladivostok",offset:36e3},{label:(0,i._)("(GMT+10:30) Lord Howe Island"),id:"Australia/Lord_Howe",offset:37800},{label:(0,i._)("(GMT+11:00) Solomon Is., New Caledonia"),id:"Pacific/Guadalcanal",offset:39600},{label:(0,i._)("(GMT+11:00) Magadan"),id:"Asia/Magadan",offset:39600},{label:(0,i._)("(GMT+11:00) Norfolk Island"),id:"Pacific/Norfolk",offset:39600},{label:(0,i._)("(GMT+12:00) Anadyr, Kamchatka"),id:"Asia/Anadyr",offset:43200},{label:(0,i._)("(GMT+12:00) Auckland, Wellington"),id:"Pacific/Auckland",offset:43200},{label:(0,i._)("(GMT+12:00) Fiji, Kamchatka, Marshall Is."),id:"Pacific/Fiji",offset:43200},{label:(0,i._)("(GMT+12:45) Chatham Islands"),id:"Pacific/Chatham",offset:45900},{label:(0,i._)("(GMT+13:00) Nuku Alofa"),id:"Pacific/Tongatapu",offset:46800},{label:(0,i._)("(GMT+14:00) Kiritimati"),id:"Pacific/Kiritimati",offset:50400}],o=new Map(l.map((e=>[e.id,e])))}}]);
//# sourceMappingURL=page_federated_search_new_amazon_s3_provider.d8eb0aa1a90838da2b90.js.map