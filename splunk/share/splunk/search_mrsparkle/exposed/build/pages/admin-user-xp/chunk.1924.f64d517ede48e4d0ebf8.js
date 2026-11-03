"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[1924],{1924:(e,t,r)=>{r.r(t),r.d(t,{default:()=>R});var a=r(96540),n=r(78967),l=r(99263),i=r(37801),o=r.n(i),d=r(39643),c=r.n(d),s=r(59421),p=r.n(s),u=r(56143),m=r.n(u),E=r(25338),b=r.n(E),v=r(66565),f=r(6965),g=r(32415),x=r(8209),y=r(33101);const h=new RegExp(/^[a-zA-Z\d][a-zA-Z\d\-_]*$/);var P=r(73224),w=r(29373),S=r(81929),C=r(57337),I=r(6492),k=r(77422),O=r(91311);function T(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function _(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?T(Object(r),!0).forEach((function(t){N(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):T(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function N(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var a=r.call(e,t||"default");if("object"!=typeof a)return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const j=l.default.div`
    width: 400px;
    margin-bottom: ${n.variables.spacingXLarge};
`,D=l.default.div`
    width: 660px;
    margin-top: ${n.variables.spacingXXXLarge};
    margin-bottom: ${n.variables.spacingXXXLarge};
    padding: 16px;
    gap: 12px;
    border: 1px solid ${n.variables.neutral200};
    border-radius: 4px;
    background: ${n.variables.backgroundColorSection};

    h3 {
        margin-top: ${n.variables.spacingSmall};
    }
`,R=()=>{const{stepsState:e,stackInfo:t,providerData:r,updateProviderData:n,updateWorkflow:l}=(0,x.b)(),[i,d]=(0,a.useState)(r.providerName),[s,u]=(0,a.useState)(),E=(0,a.useMemo)((()=>t.providers.map((e=>e?.providerName))),[t.providers]),T=(0,a.useCallback)((()=>{const t=((e,t)=>{const r=e?.trim()||"";return r?h.test(r)?t.includes(r)?y.EI:null:y.Gz:y.Ze})(i,E);t?u(t):(n((e=>_(_({},e),{},{providerName:i}))),l("providerBasics",{status:P.$.Success}),e.updateStepStatus(e.activeStepId,S.x.Done),e.moveForward())}),[E,i,e,l,n]);return a.createElement(v.s,null,a.createElement("div",null,a.createElement(f.a,{heading:C.C1.HEADING}),a.createElement(j,null,a.createElement(o(),{labelPosition:"top",required:!0,error:s,label:C.C1.NAME_INPUT.LABEL,help:C.C1.NAME_INPUT.HELP},a.createElement(b(),{"data-testid":"provider-name-input",canClear:!0,error:!!s,value:i,onChange:(e,{value:t})=>d(t)}))),a.createElement(D,null,a.createElement(k.h,{level:3,mb:3},C.C1.SETUP.HEADING),a.createElement(O.b,{mb:4},a.createElement(c(),{level:4},C.C1.SETUP.PREREQUISITE_1.HEADING),a.createElement(m(),null,C.C1.SETUP.PREREQUISITE_1.DESCRIPTION,a.createElement(p(),{to:I.l,openInNewContext:!0},C.C1.SETUP.PREREQUISITE_1.LINK_TEXT))),a.createElement(c(),{level:4},C.C1.SETUP.PREREQUISITE_2.HEADING),a.createElement(m(),null,C.C1.SETUP.PREREQUISITE_2.DESCRIPTION)),a.createElement(g.s,{onBack:w.$,onForward:T,backCaption:C.sE.CANCEL})))}},6492:(e,t,r)=>{r.d(t,{Z:()=>l,l:()=>n});var a=r(69211);const n=(0,a.createDocsURL)("learnmore.security.tokenauth"),l=(0,a.createDocsURL)("Splexicon:Federatedindex")},6965:(e,t,r)=>{r.d(t,{a:()=>s});var a=r(96540),n=r(39643),l=r.n(n),i=r(78967),o=r(99263);const d=(0,o.default)(l())`
    margin-top: ${i.variables.spacingMedium};
`,c=(0,o.default)(l())`
    margin-top: ${i.variables.spacingSmall};
    margin-bottom: ${i.variables.spacingLarge};
`,s=({workflowTitle:e,heading:t})=>a.createElement(a.Fragment,null,e&&a.createElement(d,{level:6,variant:"title6"},e),a.createElement(c,{level:1,variant:"title1"},t))},32415:(e,t,r)=>{r.d(t,{s:()=>p});var a=r(96540),n=r(20259),l=r(70181),i=r.n(l),o=r(99263);const d=(0,n._)("Back"),c=(0,n._)("Continue"),s=o.default.div`
    padding-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > button {
        flex: 0 1 auto;
    }
`,p=({disableBack:e,disableForward:t,backCaption:r=d,forwardCaption:n=c,onBack:l,onForward:o})=>a.createElement(s,{"data-testid":"screen-footer"},a.createElement(i(),{appearance:"secondary","data-testid":"back-button",label:r,disabled:e,onClick:l}),a.createElement(i(),{appearance:"primary","data-testid":"forward-button",label:n,disabled:t,onClick:o}))},66565:(e,t,r)=>{r.d(t,{s:()=>d});var a=r(96540),n=r(99263);const l=n.default.div`
    max-width: ${({extendedBodyWidth:e})=>e?"1280px":"1120px"};
    padding-right: ${e=>(({withHelper:e,extendedBodyWidth:t})=>t?"20px;":e?"0":"200px")(e)};
    display: flex;
`,i=n.default.div`
    flex: 0 1 100%;
`,o=n.default.aside`
    margin-left: ${({extendedBodyWidth:e})=>e?"20px":"100px"};
    flex: 0;
`,d=({helper:e,extendedBodyWidth:t,children:r})=>a.createElement(l,{withHelper:!!e,extendedBodyWidth:t},a.createElement(i,null,r),e&&a.createElement(o,{extendedBodyWidth:t},e))}}]);
//# sourceMappingURL=chunk.1924.f64d517ede48e4d0ebf8.js.map