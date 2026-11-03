"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[2439],{6965:(e,t,a)=>{a.d(t,{a:()=>s});var n=a(96540),r=a(39643),l=a.n(r),i=a(78967),c=a(99263);const o=(0,c.default)(l())`
    margin-top: ${i.variables.spacingMedium};
`,d=(0,c.default)(l())`
    margin-top: ${i.variables.spacingSmall};
    margin-bottom: ${i.variables.spacingLarge};
`,s=({workflowTitle:e,heading:t})=>n.createElement(n.Fragment,null,e&&n.createElement(o,{level:6,variant:"title6"},e),n.createElement(d,{level:1,variant:"title1"},t))},32415:(e,t,a)=>{a.d(t,{s:()=>m});var n=a(96540),r=a(20259),l=a(70181),i=a.n(l),c=a(99263);const o=(0,r._)("Back"),d=(0,r._)("Continue"),s=c.default.div`
    padding-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > button {
        flex: 0 1 auto;
    }
`,m=({disableBack:e,disableForward:t,backCaption:a=o,forwardCaption:r=d,onBack:l,onForward:c})=>n.createElement(s,{"data-testid":"screen-footer"},n.createElement(i(),{appearance:"secondary","data-testid":"back-button",label:a,disabled:e,onClick:l}),n.createElement(i(),{appearance:"primary","data-testid":"forward-button",label:r,disabled:t,onClick:c}))},66565:(e,t,a)=>{a.d(t,{s:()=>o});var n=a(96540),r=a(99263);const l=r.default.div`
    max-width: ${({extendedBodyWidth:e})=>e?"1280px":"1120px"};
    padding-right: ${e=>(({withHelper:e,extendedBodyWidth:t})=>t?"20px;":e?"0":"200px")(e)};
    display: flex;
`,i=r.default.div`
    flex: 0 1 100%;
`,c=r.default.aside`
    margin-left: ${({extendedBodyWidth:e})=>e?"20px":"100px"};
    flex: 0;
`,o=({helper:e,extendedBodyWidth:t,children:a})=>n.createElement(l,{withHelper:!!e,extendedBodyWidth:t},n.createElement(i,null,a),e&&n.createElement(c,{extendedBodyWidth:t},e))},92439:(e,t,a)=>{a.r(t),a.d(t,{default:()=>K});var n=a(96540),r=a(78967),l=a(32415),i=a(8209),c=a(57337),o=a(6965),d=a(39643),s=a.n(d),m=a(93410),p=a(23347),E=a(36724),u=a(66565),b=a(20259),f=a(69211),v=a(70181),g=a.n(v),y=a(56143),_=a.n(y),h=a(32783),x=a.n(h),O=a(99263);const w=O.default.div`
    position: fixed;
    inset: 0;
    z-index: 10;
    background-color: ${r.variables.backgroundColorPage};
`,A=({children:e})=>n.createElement(w,{"data-testid":"handoff-overlay"},e);var D=a(75602);const k=`manager/${D.app}/federated_search`,I=`app/${D.app}/search`,N=O.default.div`
    max-width: 800px;
    margin: 0 auto;
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`,P=(0,O.default)(_())`
    margin-top: ${r.variables.spacingXLarge};
`,S=O.default.div`
    margin-top: 40px;
`,R=({h1:e,h2:t,description:a,actions:r})=>n.createElement(A,null,n.createElement(N,null,n.createElement(g(),{appearance:"secondary",icon:n.createElement(x(),null),to:(0,f.createURL)(k),label:(0,b._)("Back to homepage")}),n.createElement(s(),{level:1},e),n.createElement(s(),{level:2},t),a&&n.createElement(P,null,a),r&&n.createElement(S,null,r)));var T=a(40787),B=a.n(T),C=a(21036),j=a(12624),L=a(8231),H=a(56124),W=a(283),F=a(91311);function G(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function $(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var n=a.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const Y=O.default.div`
    display: flex;
    flex-direction: column;
    gap: ${r.variables.spacingMedium};
    justify-content: center;
    align-items: center;
`,K=()=>{const{stepsState:e,providerData:t,indexData:a}=(0,i.b)(),[r,d]=(0,n.useState)(!1),[b,v]=(0,n.useState)(!1),y=(0,H._)();return n.createElement(n.Fragment,null,n.createElement(u.s,null,n.createElement(o.a,{heading:c.nb.HEADING}),n.createElement(C.Z,{isBusy:b},n.createElement(s(),{level:2},c.nb.AUTHENTICATION_HEADING),n.createElement(m.s,{items:[{key:c.nb.API_TOKEN_KEY,value:"********"}]}),n.createElement(F.b,{mt:8,mb:6},n.createElement(s(),{level:2},c.nb.PROVIDER_BASICS_HEADING),n.createElement(m.s,{items:[{key:c.nb.PROVIDER_NAME_KEY,value:t.providerName},{key:c.nb.PROVIDER_TYPE_KEY,value:c.nb.PROVIDER_TYPE}]})),t.config&&n.createElement(F.b,{mb:8},n.createElement(s(),{level:3},c.nb.CONFIGURATIONS_HEADING),n.createElement(m.s,{items:(0,p.k)(t.config)})),n.createElement(s(),{level:2},c.nb.FEDERATED_INDEX_HEADING),n.createElement(m.s,{items:[{key:c.nb.FEDERATED_INDEX_NAME_KEY,value:a?.name},{key:c.wD.LOG_TYPE_KEY,value:c.wD.LOG_TYPE_CISCO_FIREWALL}]}),a&&n.createElement(F.b,{mt:6},n.createElement(E.z,{indexData:a}))),n.createElement(l.s,{onBack:e.moveBack,onForward:async()=>{if(v(!0),a)try{const e=function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?G(Object(a),!0).forEach((function(t){$(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):G(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({},(0,W.hw)(a,t.providerName));await j.y.createItem({body:e}),d(!0)}catch(e){const t=e;y({type:L.TOAST_TYPES.ERROR,message:t.toString()||c.nb.FAILED_TO_SAVE_INDEX,autoDismiss:!1})}finally{v(!1)}},forwardCaption:c.sE.SAVE,disableBack:b,disableForward:b})),r&&n.createElement(R,{h1:c.AW.HEADING,h2:c.AW.SUBHEADING,description:c.AW.DESCRIPTION,actions:n.createElement(Y,null,n.createElement(g(),{appearance:"primary",icon:n.createElement(B(),null),to:(0,f.createURL)(I),label:c.AW.START_SEARCHING_LABEL}),n.createElement(g(),{to:"https://www.splunk.com",openInNewContext:!0,label:c.AW.DASHBOARD_LABEL}))}))}}}]);
//# sourceMappingURL=chunk.2439.d6ee54d7689a8f9859fe.js.map