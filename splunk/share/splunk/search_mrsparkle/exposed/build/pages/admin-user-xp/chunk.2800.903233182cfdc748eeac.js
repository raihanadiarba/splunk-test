"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[2800],{6965:(e,a,t)=>{t.d(a,{a:()=>c});var n=t(96540),d=t(39643),s=t.n(d),r=t(78967),l=t(99263);const i=(0,l.default)(s())`
    margin-top: ${r.variables.spacingMedium};
`,o=(0,l.default)(s())`
    margin-top: ${r.variables.spacingSmall};
    margin-bottom: ${r.variables.spacingLarge};
`,c=({workflowTitle:e,heading:a})=>n.createElement(n.Fragment,null,e&&n.createElement(i,{level:6,variant:"title6"},e),n.createElement(o,{level:1,variant:"title1"},a))},26283:(e,a,t)=>{t.d(a,{KC:()=>c,L1:()=>u,PV:()=>l,V8:()=>d,YX:()=>i,ef:()=>o,fj:()=>p,ln:()=>s,wR:()=>x,yS:()=>r,z0:()=>m});var n=t(69211);const d=(0,n.createDocsURL)("fss3.about.search"),s=((0,n.createDocsURL)("learnmore.authtoken.enable"),"https://docs.aws.amazon.com/glue/latest/dg/how-it-works.html"),r=(0,n.createDocsURL)("fss3.create.gluetable"),l=(0,n.createDocsURL)("fss3.update.policies"),i="https://aws.amazon.com/s3/pricing/",o=(0,n.createDocsURL)("sds.index.timeformats"),c=(0,n.createDocsURL)("time.format.variables"),u=(0,n.createDocsURL)("sds.index.splunkmanaged"),p=(0,n.createDocsURL)("sds.index.partitions"),m=(0,n.createDocsURL)("sds.index.timesettings"),x=(0,n.createDocsURL)("sds.index.s3location");(0,n.createDocsURL)("sds.index.vpcflow"),(0,n.createDocsURL)("")},32415:(e,a,t)=>{t.d(a,{s:()=>u});var n=t(96540),d=t(20259),s=t(70181),r=t.n(s),l=t(99263);const i=(0,d._)("Back"),o=(0,d._)("Continue"),c=l.default.div`
    padding-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > button {
        flex: 0 1 auto;
    }
`,u=({disableBack:e,disableForward:a,backCaption:t=i,forwardCaption:d=o,onBack:s,onForward:l})=>n.createElement(c,{"data-testid":"screen-footer"},n.createElement(r(),{appearance:"secondary","data-testid":"back-button",label:t,disabled:e,onClick:s}),n.createElement(r(),{appearance:"primary","data-testid":"forward-button",label:d,disabled:a,onClick:l}))},37747:(e,a,t)=>{t.d(a,{KX:()=>c,QV:()=>d,Qf:()=>l,SK:()=>o,cm:()=>r,hd:()=>n,jU:()=>i,ms:()=>s});const n=new RegExp(/^([a-z0-9_-]*)$/),d=new RegExp(/^([a-z0-9_,*-]*)$/),s=/^([a-zA-Z0-9_-]*)$/,r=/^\d{12}$/,l=/^[a-z]([a-z0-9-]*)$/,i=/^([A-Za-z0-9:/!.*'()=_-]*)$/,o=/^([A-Za-z0-9,:/_-]*)$/,c=/^([a-zA-Z0-9_-]*)$/},66565:(e,a,t)=>{t.d(a,{s:()=>i});var n=t(96540),d=t(99263);const s=d.default.div`
    max-width: ${({extendedBodyWidth:e})=>e?"1280px":"1120px"};
    padding-right: ${e=>(({withHelper:e,extendedBodyWidth:a})=>a?"20px;":e?"0":"200px")(e)};
    display: flex;
`,r=d.default.div`
    flex: 0 1 100%;
`,l=d.default.aside`
    margin-left: ${({extendedBodyWidth:e})=>e?"20px":"100px"};
    flex: 0;
`,i=({helper:e,extendedBodyWidth:a,children:t})=>n.createElement(s,{withHelper:!!e,extendedBodyWidth:a},n.createElement(r,null,t),e&&n.createElement(l,{extendedBodyWidth:a},e))},93127:(e,a,t)=>{t.d(a,{Kj:()=>r,ND:()=>c,jt:()=>i,mD:()=>l,sC:()=>o});t(86663);var n=t(14801),d=t(78931),s=t(20234);const r=(e,a)=>{const t=((e,a,t)=>{if(!Array.isArray(e)||!Array.isArray(a))return[];let n=e,d=a;return e.length<a.length&&(n=a,d=e),n.filter((e=>!t(e,d,n)))})(e,a,((e,a)=>a.includes(e)));return!t.length},l=(new Set([n.Q.AddFedIndex,n.Q.AddLakeIndex,n.Q.EditFedIndex,n.Q.EditLakeIndex]),(e,a,t=",")=>e?.join?.(t)||a),i=e=>e?.messages?e.messages.map((({message:e})=>e)):[e.message||d.pn.message],o=e=>{const{datasetType:a,isSplunkManaged:t}=e,n=a===s.DE.SplunkManagedGlueTablesCloudtrail,d=a===s.DE.SplunkManagedGlueTablesVpcFlow;return{splunkManaged:t||n||d,isCloudtrail:n,isVpcflow:d}},c=e=>`${e.charAt(0).toUpperCase()}${e.substring(1).toLowerCase()}`},97507:(e,a,t)=>{t.r(a),t.d(a,{default:()=>g});var n=t(96540),d=t(20259),s=t(11566),r=t(56143),l=t.n(r),i=t(66565),o=t(6965),c=t(32415),u=t(86079),p=t(10734),m=t(81929),x=t(87522);const f=t(99263).default.div`
    width: 870px;
`,g=()=>{const{stepsState:e,stackInfo:a,creatingProvider:t,creatingIndexes:r,cloudtrailData:g,vpcflowStaticData:w,workflow:h,updateCreatingIndexes:k}=(0,s.b)(),[b,v]=(0,n.useState)(null),[E,D]=(0,n.useState)(!1),_=`${(0,d._)("Federated indexes")} (${r.length})`,y=(0,n.useCallback)(((e=!1)=>{if(e)return v(null),null;const t=(0,u.DT)(r,a.existingFederatedIndexes);return v(t),t}),[r,a.existingFederatedIndexes]),L=(0,n.useCallback)((()=>{if(E)return;const a=y();r.some((({indexName:e})=>a?.has(e||"")))||(e.updateStepStatus(e.activeStepId,m.x.Done),e.moveForward())}),[r,E,e,y]),C=(0,n.useMemo)((()=>x.F.fromWorkflowToInvalidIndexes(h.indexes)),[h.indexes]);return n.createElement(i.s,null,n.createElement("div",null,n.createElement(o.a,{workflowTitle:(0,d._)("Create index"),heading:(0,d._)("Set up federated index")}),n.createElement(l(),null,(0,d._)("Add federated index for federated search...")),n.createElement(f,null,n.createElement(p.p,{list:r,onListChange:k,heading:_,validationResult:b,cloudtrailData:g,invalidIndexes:C,providerData:t,vpcflowStaticData:w,triggerValidation:y,indexesEditorInfo:null,setListIsBusyExternally:D})),n.createElement(c.s,{disableBack:!0,onBack:e.moveBack,onForward:L,disableForward:E})))}}}]);
//# sourceMappingURL=chunk.2800.903233182cfdc748eeac.js.map