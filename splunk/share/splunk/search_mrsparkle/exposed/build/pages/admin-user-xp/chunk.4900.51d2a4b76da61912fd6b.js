"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[4900],{6965:(e,t,a)=>{a.d(t,{a:()=>c});var n=a(96540),r=a(39643),s=a.n(r),i=a(78967),l=a(99263);const d=(0,l.default)(s())`
    margin-top: ${i.variables.spacingMedium};
`,o=(0,l.default)(s())`
    margin-top: ${i.variables.spacingSmall};
    margin-bottom: ${i.variables.spacingLarge};
`,c=({workflowTitle:e,heading:t})=>n.createElement(n.Fragment,null,e&&n.createElement(d,{level:6,variant:"title6"},e),n.createElement(o,{level:1,variant:"title1"},t))},32415:(e,t,a)=>{a.d(t,{s:()=>u});var n=a(96540),r=a(20259),s=a(70181),i=a.n(s),l=a(99263);const d=(0,r._)("Back"),o=(0,r._)("Continue"),c=l.default.div`
    padding-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > button {
        flex: 0 1 auto;
    }
`,u=({disableBack:e,disableForward:t,backCaption:a=d,forwardCaption:r=o,onBack:s,onForward:l})=>n.createElement(c,{"data-testid":"screen-footer"},n.createElement(i(),{appearance:"secondary","data-testid":"back-button",label:a,disabled:e,onClick:s}),n.createElement(i(),{appearance:"primary","data-testid":"forward-button",label:r,disabled:t,onClick:l}))},54414:(e,t,a)=>{a.d(t,{P:()=>m});var n=a(96540),r=a(20259),s=a(64200),i=a.n(s),l=a(70181),d=a.n(l),o=a(57914),c=a.n(o),u=a(73224),p=a(62215);function m({acsPolicyUpdateState:e,returnFocus:t,onClose:a,onUpdate:s}){const l=e.status===u.$.Failed&&e.details||null;return n.createElement(i(),{style:{width:550},returnFocus:t,onRequestClose:a,open:e.status===u.$.Failed},n.createElement(i().Header,{title:(0,r._)("Incomplete Amazon S3 permission update")}),n.createElement(i().Body,null,n.createElement(c(),{appearance:"fill",type:"error"},l?.join("\n")||p.A.message)),n.createElement(i().Footer,null,n.createElement(d(),{appearance:"primary",label:(0,r._)("Update Amazon S3 permissions"),onClick:s})))}},62215:(e,t,a)=>{a.d(t,{A:()=>r});var n=a(20259);const r={type:a(78931).J.ERROR,message:(0,n._)("Something went wrong during the update of ACS policy.")}},64900:(e,t,a)=>{a.r(t),a.d(t,{default:()=>Y});var n=a(96540),r=a(20259),s=a(69211),i=a(11566),l=a(56124),d=a(61665),o=a(8231),c=a(73224),u=a(93127),p=a(16791),m=a(81929),g=a(12624),f=a(87522),v=a(78931);const y=(0,r._)("Some indexes are not saved!"),x=(0,r._)("Provider name is not defined."),E=()=>{const{creatingProvider:e,creatingIndexes:t,cloudtrailData:a,vpcflowStaticData:r,stepsState:s,workflow:E,updateWorkflow:S}=(0,i.b)(),h=(0,l._)(),[b,w]=(0,n.useState)(!1),[k,$]=(0,n.useState)(!1),A=(0,d.z)(),_=(0,n.useCallback)((async(e=!0)=>{if(e||E.updateAcsPolicy.status!==c.$.Success){try{await p.b.updateAcsPolicy({})}catch(e){const t=(0,u.jt)(e);return S("updateAcsPolicy",{status:c.$.Failed,details:t}),void $(!1)}S("updateAcsPolicy",{status:c.$.Success})}A.set(!0),$(!1),S("summary",{status:c.$.Success}),s.updateStepStatus(s.activeStepId,m.x.Done),w(!0)}),[E.updateAcsPolicy,S,$,w,s,A]);return{isSaving:k,onSave:(0,n.useCallback)((async()=>{if(A.get()||E.summary.status===c.$.Success)return;if(E.indexes.status===c.$.Success)return await _(!1);if(!e.providerName)return h({type:o.TOAST_TYPES.ERROR,message:x,autoDismiss:!1}),void S("indexes",{status:c.$.Failed,details:[x]});$(!0);const n=((e,t)=>{const a=e.filter((e=>e.editingMeta.touched&&!e.editingMeta.forRemovingFromServer));return t?.status===c.$.Initial?a:a.filter((({id:e})=>t?.status===c.$.Failed&&t?.details?.has(e)))})(t,E.indexes),i=n.some((e=>(0,u.sC)(e).splunkManaged));i&&S("updateAcsPolicy",{status:c.$.Initial});const l=await(async(e,t,a)=>{const n=new Map;for(const r of e){const e=f.B.toSavingDto(r,t,a);try{const t=r.editingMeta.existsOnServer?g.y.updateItem:g.y.createItem;await t({body:e})}catch(e){n.set(r.id,{indexId:r.id,indexName:r.indexName,errors:(0,u.jt)(e)})}}return n.size?n:null})(n,a,r);if(l){S("indexes",{status:c.$.Failed,details:l});const e=(e=>{const t=e&&Array.from(e.values()).map((({indexName:e})=>e));return{type:o.TOAST_TYPES.ERROR,title:y,message:t?t.join(", "):v.pn.message,autoDismiss:!1}})(l);return h(e),$(!1),void s.moveBack()}return S("indexes",{status:c.$.Success}),await _(i)}),[a,h,t,e.providerName,r,A,S,E,_,s]),isHandoffVisible:b,finalizeSave:_}};var S=a(70181),h=a.n(S),b=a(40787),w=a.n(b),k=a(39643),$=a.n(k),A=a(56143),_=a.n(A),C=a(32783),F=a.n(C),P=a(78967),B=a(99263);const I=B.default.div`
    position: fixed;
    inset: 0;
    z-index: 10;
    background-color: ${P.variables.backgroundColorPage};
`,R=({children:e})=>n.createElement(I,{"data-testid":"handoff-overlay"},e);var D=a(75602);const M=`manager/${D.app}/federated_search`,T=`app/${D.app}/search`,z=B.default.div`
    max-width: 800px;
    margin: 0 auto;
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`,j=(0,B.default)(_())`
    margin-top: ${P.variables.spacingXLarge};
`,U=B.default.div`
    margin-top: 40px;
`,W=({h1:e,h2:t,description:a,actions:i})=>n.createElement(R,null,n.createElement(z,null,n.createElement(h(),{appearance:"secondary",icon:n.createElement(F(),null),to:(0,s.createURL)(M),label:(0,r._)("Back to homepage")}),n.createElement($(),{level:1},e),n.createElement($(),{level:2},t),a&&n.createElement(j,null,a),i&&n.createElement(U,null,i)));var L=a(66565),N=a(6965),O=a(32415),H=a(70220),Q=a(54414),V=a(3423);const Y=()=>{const{stepsState:e,creatingProvider:t,creatingIndexes:a,workflow:l,updateWorkflow:d,cloudtrailData:o}=(0,i.b)(),{onSave:u,isSaving:p,isHandoffVisible:m,finalizeSave:g}=E(),{captureActiveElement:f,returnFocus:v}=(0,V.$)(),y=(0,n.useCallback)((()=>{f(),u()}),[f,u]);return n.createElement(n.Fragment,null,n.createElement(L.s,null,n.createElement("div",null,n.createElement(Q.P,{returnFocus:v,onClose:()=>d("updateAcsPolicy",{status:c.$.Initial}),onUpdate:g,acsPolicyUpdateState:l.updateAcsPolicy}),n.createElement(N.a,{workflowTitle:(0,r._)("Review"),heading:(0,r._)("Summary")}),n.createElement(H.e,{provider:t,federatedIndexes:a,pageMode:"summary",cloudtrailData:o}),n.createElement(O.s,{onBack:e.moveBack,onForward:y,disableBack:p,disableForward:p}))),m&&n.createElement(W,{h1:(0,r._)("Amazon S3 provider and indexes created"),h2:(0,r._)("You can now run federated search on Amazon S3 data"),actions:n.createElement("div",null,n.createElement(h(),{appearance:"primary",icon:n.createElement(w(),null),to:(0,s.createURL)(T),label:(0,r._)("Start Searching")}))}))}},66565:(e,t,a)=>{a.d(t,{s:()=>d});var n=a(96540),r=a(99263);const s=r.default.div`
    max-width: ${({extendedBodyWidth:e})=>e?"1280px":"1120px"};
    padding-right: ${e=>(({withHelper:e,extendedBodyWidth:t})=>t?"20px;":e?"0":"200px")(e)};
    display: flex;
`,i=r.default.div`
    flex: 0 1 100%;
`,l=r.default.aside`
    margin-left: ${({extendedBodyWidth:e})=>e?"20px":"100px"};
    flex: 0;
`,d=({helper:e,extendedBodyWidth:t,children:a})=>n.createElement(s,{withHelper:!!e,extendedBodyWidth:t},n.createElement(i,null,a),e&&n.createElement(l,{extendedBodyWidth:t},e))},93127:(e,t,a)=>{a.d(t,{Kj:()=>i,ND:()=>c,jt:()=>d,mD:()=>l,sC:()=>o});a(86663);var n=a(14801),r=a(78931),s=a(20234);const i=(e,t)=>{const a=((e,t,a)=>{if(!Array.isArray(e)||!Array.isArray(t))return[];let n=e,r=t;return e.length<t.length&&(n=t,r=e),n.filter((e=>!a(e,r,n)))})(e,t,((e,t)=>t.includes(e)));return!a.length},l=(new Set([n.Q.AddFedIndex,n.Q.AddLakeIndex,n.Q.EditFedIndex,n.Q.EditLakeIndex]),(e,t,a=",")=>e?.join?.(a)||t),d=e=>e?.messages?e.messages.map((({message:e})=>e)):[e.message||r.pn.message],o=e=>{const{datasetType:t,isSplunkManaged:a}=e,n=t===s.DE.SplunkManagedGlueTablesCloudtrail,r=t===s.DE.SplunkManagedGlueTablesVpcFlow;return{splunkManaged:a||n||r,isCloudtrail:n,isVpcflow:r}},c=e=>`${e.charAt(0).toUpperCase()}${e.substring(1).toLowerCase()}`}}]);
//# sourceMappingURL=chunk.4900.51d2a4b76da61912fd6b.js.map