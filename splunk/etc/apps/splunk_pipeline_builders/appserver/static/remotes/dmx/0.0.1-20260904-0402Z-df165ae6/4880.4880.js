/*! For license information please see 4880.4880.js.LICENSE.txt */
"use strict";(self.webpackChunkdmx=self.webpackChunkdmx||[]).push([[4880],{99460(e,t,n){var l=n(2543),i=n(85959),a=n.n(i),s=n(53209),r=n(23465),p=n(15759),o=n.n(p),c=n(36617),d=n(37462);n.d(t,["J",0,({onRefresh:e=l.noop,cardTitle:t="",cardSubtitle:n="",errorTitle:i="",errorDescription:p=""})=>a().createElement(d.Q_,{"data-test":"error-card"},a().createElement(d.ee,null,a().createElement(o().Header,{title:t,subtitle:n}),a().createElement(o().Body,null,a().createElement(c.pp,{button:a().createElement(r.$,{appearance:"primary",label:s.t`Refresh`,onClick:e}),description:p,emptyType:c.kQ.ROBOT_ERROR,title:i}))))])},33723(e,t,n){n.d(t,{w:()=>fe});var l=n(85959),i=n.n(l),a=n(24740),s=n(47444),r=n(53209),p=n(23465),o=n(70214),c=n(91156),d=n(33199),u=n(56143),m=n.n(u),g=n(60652),f=n(46688),h=n(3990),y=n(35407),E=n(71980),S=n(73207),P=n(69131),v=n(78617),b=n(53259),w=n(36617),I=n(38646),x=n(25726),k=n(17965),$=n(72478),C=n(39318),M=n(56299),R=n(39562),T=n(2619),A=n(69538),F=n(1744),L=n(69245),j=n(54307),U=n(17143),N=n(13736),O=n(96056),q=n(8228),J=n(51571),V=n(18182),_=n(2543),B=n(89629),D=n(41194),z=n(63459),H=n.n(z),Z=n(70181),K=n.n(Z),Q=n(37801),X=n.n(Q),W=n(59421),Y=n.n(W),G=n(52529),ee=n.n(G),te=n(18636),ne=n(97746),le=n(22652),ie=n(21906),ae=n(28592),se=n(71928),re=n(44578),pe=n(53632),oe=n(51625),ce=n(30770);const de=({pipelineSpecId:e})=>{const t=(0,ae.I$)((0,M.Zt)(e)),{isCloudProcessorSubscribed:n}=(0,ie.Pm)(),a=n?M.w4:M.FF,s=(0,ae.I$)(a(e)),p=(0,_.uniq)(s?.context?.edgeProcessors),[o,c]=(0,l.useState)(!1),d=(0,l.useRef)(null),u=(0,se.t)(e),m=(0,l.useMemo)(()=>u?.destinations?.map(e=>e.name),[u?.destinations]),f=(0,l.useMemo)(()=>[{content:i().createElement(Y(),{onClick:e=>{e.preventDefault(),c(!0)},ref:d,appearance:"standalone",to:"#"},r.t`Expand`),key:"spl2",testSection:"spl",label:r.t`SPL2 definition`},{content:p.length,key:"number-of-edge-processors",testSection:"number-of-edge-processors",label:r.t`Number of ${g.sP}`},{content:i().createElement(ne.s,{pipelineSpecId:e}),key:"partition",testSection:"partition",label:r.t`Partition`},{content:i().createElement(le.k,{nameList:m}),key:"destinations",testSection:"destinations",label:r.t`Destinations`}],[p.length,e,m]);return i().createElement(i().Fragment,null,i().createElement(re.L,{items:f}),i().createElement(pe.L,{open:o,pipelineSpecName:(0,S.y9)(t),pipelineSpecId:t.id,handleClose:()=>c(!1),returnFocus:d}))},ue=e=>i().createElement(ee().Row,null,i().createElement(ee().Cell,{colSpan:3},i().createElement(l.Suspense,{fallback:i().createElement(B.Ou,null)},i().createElement(de,{pipelineSpecId:e.id})))),me=({pipelineSpecId:e})=>{const t=(0,s.vc)((0,M.FF)(e));return i().createElement(i().Fragment,null,t?.runtime===te.SearchRuntime.IngestEdge&&(0,_.some)(t?.status,e=>e===te.SearchStatus.Pending)&&i().createElement(I.kW,{size:I.Ev.SMALL,status:te.SearchStatus.Pending,tooltip:r.t`Pending apply: This pipeline is being applied to the current ${g.fI}`}))},ge=({expandable:e=!1,nodeId:t,allPipelineSpecs:n,handleAddPipelineSpec:a})=>{const{runtime:p}=(0,f.L)(),[o,c]=(0,l.useState)(""),[u,m]=(0,l.useState)("asc"),[h,y]=(0,l.useState)("name"),E=(0,s.vc)(M.ju),P=(0,ce.dL)(o,n,["title","name"]),[v,b]=(0,s.L4)((0,M.x1)(t)),x=(0,l.useMemo)(()=>P.filter(({parent:e})=>e!==E.id).map(({id:e})=>e),[P,E.id]),k=(0,l.useMemo)(()=>v.filter(e=>!x.includes(e)),[v,x]),$=(0,l.useMemo)(()=>x.filter(e=>v.includes(e)).length,[v,x]),C=()=>0===$?"none":$===x.length?"all":"some",R=(e,{id:t})=>{v.includes(t)?b(v.filter(e=>e!==t)):b(v.concat(t))},T=()=>{"all"===C()?b(k):b([...k,...x])};return i().createElement(i().Fragment,null,i().createElement(oe.Jh,null,i().createElement(X(),{label:r.t`Pipeline search`,labelPosition:"top",hideLabel:!0},i().createElement(oe.cW,{"data-test":"row-filter",onChange:(e,{value:t})=>{c(t)},placeholder:r.t`Enter search terms`,value:o}),i().createElement(K(),{"data-test":"create-pipeline-button",appearance:"primary",className:"fs-unmask",label:r.t`New pipeline`,icon:i().createElement(H(),null),onClick:a}))),P.length?(()=>{const t=[{header:r.t`Name`,key:"name",renderer:e=>i().createElement(i().Fragment,null,(0,S.y9)(e)),sortKey:"name",testId:"pipeline-name"}],n=(e,{sortKey:t})=>{m("asc"===u?"desc":"asc"),y(t)};return i().createElement(ee(),{stripeRows:!0,onRequestToggleAllRows:T,rowSelection:C(),"data-test":"pipeline-spec-table",rowExpansion:e?"multi":"none"},i().createElement(ee().Head,null,t.map(({align:e="left",header:t,key:l,sortKey:a})=>i().createElement(D.mI,{align:e,key:l,onSort:a?n:void 0,sortDir:a===h?u:"none",sortKey:a},t)),i().createElement(ee().HeadCell,{align:"center"},i().createElement(I.kW,{size:18,status:"info",tooltip:p===d.fU?r.t`Icons in this column indicate when a pipeline is being applied to or removed from a ${g.Pb}`:r.t`Icons in this column indicate when a pipeline is being applied to or removed from an ${g.fI}`}))),i().createElement(ee().Body,null,P.sort((e,t)=>"asc"===u?h.split(".").reduce((e,t)=>e[t],e)>h.split(".").reduce((e,t)=>e[t],t)?1:-1:"desc"===u?h.split(".").reduce((e,t)=>e[t],t)>h.split(".").reduce((e,t)=>e[t],e)?1:-1:0).map(e=>i().createElement(ee().Row,{"data-qa-id":`${e.name}-row`,"data-test":`${e.name}-row`,data:e,disabled:E.id===e.parent,key:e.id,onRequestToggle:R,expansionRow:ue(e),selected:v.includes(e.id)},i().createElement(ee().Cell,{"data-test":"pipeline-name"},(0,S.y9)(e)),i().createElement(ee().Cell,{align:"center","data-test":"pipeline-status"},i().createElement(l.Suspense,{fallback:i().createElement(D.nM,null)},i().createElement(me,{pipelineSpecId:e.id})))))))})():i().createElement(w.wT,null))},fe=({nodeId:e,appliedPipelines:t,handleAddPipelineSpec:n})=>{const{history:u,toast:{postToast:_},sharedUtils:B}=(0,$.p)(),{editPipeline:D}=(0,h.hI)(),z=(0,C.Jr)(),[H,Z]=(0,s.L4)(M.ht),{runtime:K}=(0,f.L)(),Q=(0,x.J0)(r.t`Cancel`),X=K===d.fU,W=((e,t=!1)=>{const n=(0,O.V)(),i=(0,N.Uw)(),a=(0,N.$i)(),r=(0,N.TI)(),p=(0,F.ld)(),o=(0,F.bJ)(),{lookupActionIP:c}=(0,A.h)(),u=(0,s.lZ)(M.Kn),m=(0,q.h)(),{pipelinesClient:g}=(0,T.aq)("useApplyOrUnapplyPipelinesToNode");return(0,l.useCallback)(async({unapplyPipelineSpecFiles:l=[],applyPipelineSpecFiles:s=[]})=>{if(!t){const t=s.map(e=>({...m(e),remove:!1})),n=l.map(e=>({...m(e),remove:!0})),i=t.concat(n);return(await g.applyRemoveEdgePipelines({edgeNodeId:e,pipelines:i})).reduce((e,{error:t,pipelineId:n,remove:l})=>(t?400===t.httpStatusCode?e.invalidPipelineSpecs.push({specId:n,error:t}):l?e.failedUnapplyPipelineSpecs.push(n):e.failedApplyPipelineSpecs.push({specId:n,error:t}):l?e.successUnapplyPipelineSpecs.push(n):e.successApplyPipelineSpecs.push(n),e),{invalidPipelineSpecs:[],failedApplyPipelineSpecs:[],failedUnapplyPipelineSpecs:[],successApplyPipelineSpecs:[],successUnapplyPipelineSpecs:[]})}const f=t?await p():await o(),h=(0,y.T0)(f),E=l.map(async t=>{const{context:l,jobId:i}=h.get(t.id),s=(0,U.R3)(t.searchModule),{module:p,parameters:o}=n(t.searchModule,L.XP.PRODUCTION);if(s===d.jM){const n=(0,j.j)([...l.edgeProcessors],[],[e]);if(0===n.length)return a(i,t.id);const s=(0,v.HJ)(l);return r({jobId:i,pipelineSpecId:t.id,spl:p,parameters:o,...n&&{edgeProcessors:n},previousVersion:s?.pipelineVersion,previousJobIds:s?.previousJobIds,runtime:(0,U.R3)(t.searchModule)})}return a(i,t.id)}),S=s.map(async t=>{const l=h.get(t.id),{module:a,parameters:s}=n(t.searchModule,L.XP.PRODUCTION),p=(0,U.R3)(t.searchModule);if(!l)return i({...p===d.jM&&{edgeProcessors:[e]},pipelineSpecId:t.id,spl:a,parameters:s,runtime:p});const o={};if(p===d.jM){const t=(0,j.j)(l.context.edgeProcessors,[e],[]);o.edgeProcessors=t}return r({jobId:l.jobId,pipelineSpecId:t.id,spl:a,parameters:s,...o,runtime:(0,U.R3)(t.searchModule)})}),P=s?.map(e=>e.id),b=l?.map(e=>e.id),w=[...P,...b];return Promise.allSettled([...S,...E]).then(e=>{const n={invalidPipelineSpecs:[],failedApplyPipelineSpecs:[],failedUnapplyPipelineSpecs:[],successApplyPipelineSpecs:[],successUnapplyPipelineSpecs:[]};return e.forEach((e,l)=>{if("rejected"===e.status)400===e.reason.httpStatusCode?n.invalidPipelineSpecs.push({specId:w[l],error:e.reason}):b.includes(w[l])?n.failedUnapplyPipelineSpecs.push(w[l]):n.failedApplyPipelineSpecs.push({specId:w[l],error:e.reason});else if(P.includes(w[l])){if(n.successApplyPipelineSpecs.push(w[l]),t&&c){const{jobId:t}=e.value.queryParameters.pipeline;u(e=>[...e,t])}}else n.successUnapplyPipelineSpecs.push(w[l])}),n})},[t,p,o,g,e,m,n,a,r,i,c,u])})(e,X),Y=(0,P.Cp)(),G=(0,P.nI)(),[ee,te]=(0,s.L4)((0,M.x1)(e)),ne=(0,s.vc)(X?M.nd:M.ZN),le=(0,s.lZ)(M.zi),ie=(0,l.useMemo)(()=>t.reduce((e,t)=>{const n={...e},l=(0,v.wm)(t);return l&&(n[l]=t),n},{}),[t]),ae=(0,l.useMemo)(()=>t.filter(e=>!!(0,v.wm)(e)),[t]),se=(0,l.useMemo)(()=>ne.reduce((e,t)=>({...e,[t.id]:t}),{}),[ne]),re=ee.filter(e=>!ie[e]),pe=ae.filter(e=>!ee.includes((0,v.wm)(e))).map(v.wm),oe=!![...re,...pe].length;return(0,l.useEffect)(()=>{const e=Object.keys(ie);te(e)},[]),i().createElement(i().Fragment,null,i().createElement(k.qp,{icon:i().createElement(I.xQ,null),title:r.t`Apply or remove pipelines`,description:r.t`Choose from existing pipelines or create a new pipeline`}),i().createElement(o.E,null),ne.length?i().createElement(a.ErrorBoundary,{FallbackComponent:J.k},H?i().createElement(c.n9,null):i().createElement(R.P_,null,i().createElement(R.yB,null,i().createElement(ge,{expandable:!0,nodeId:e,allPipelineSpecs:ne.slice(),handleAddPipelineSpec:n}))),i().createElement(R.CG,null,Q,i().createElement(p.$,{appearance:"primary",disabled:!oe||H,key:"save",onClick:async()=>{Z(!0);const e=await Promise.all(pe.map(async e=>(0,y.uf)(e))),t=await Promise.all(re.map(async e=>(0,y.uf)(e))),{invalidPipelineSpecs:n,failedApplyPipelineSpecs:l,failedUnapplyPipelineSpecs:a,successApplyPipelineSpecs:s,successUnapplyPipelineSpecs:o}=await W({unapplyPipelineSpecFiles:e,applyPipelineSpecFiles:t});if(n.length&&n.forEach(({specId:e,error:t})=>{const n=se[e],l=t.message||r.t`Pipelines must contain valid SPL2 and have valid source and destination datasets.`;_({title:r.t`Failed to apply ${(0,S.y9)(n)}`,type:"error",message:i().createElement(i().Fragment,null,i().createElement(m(),null,l),i().createElement(p.$,{appearance:"primary",label:r.t`View Pipeline`,onClick:()=>{u.push(D({id:n.id}))}}))})}),a.length){const e=a.map(e=>(0,S.y9)(se[e])).join(", ");_({title:(0,r.ngettext)(r.msgid`Failed to remove ${a.length} pipeline`,`Failed to remove ${a.length} pipelines`,a.length),type:"error",message:(0,r.ngettext)(r.msgid`Failed to remove pipeline: ${e}. Try again later.`,`Failed to remove pipelines: ${e}. Try again later.`,a.length)})}if(l.length&&l.forEach(({specId:e,error:t})=>{const n=se[e];_({title:r.t`Failed to apply ${(0,S.y9)(n)}`,type:"error",message:(0,v.tP)(t)})}),s.length||o.length){const e=((e=[],t=[])=>{const n=new Set(e);return t.filter(e=>n.has(e.id))})(s,t),n=(0,v.Oh)((c=e,c.filter(e=>(0,E.Y)(e.searchModule?.spl)).length>0)).join("\n");_(X?{type:"info",title:r.t`Saving your changes`,message:n}:{message:n,type:"info",title:r.t`Updates saved`}),s.forEach(e=>{Y(e)}),o.forEach(e=>{const t=ie[e];t?.context?.edgeProcessors?.length<=1&&G(e)})}var c;Z(!1),le(null)},label:r.t`Save`,"data-test":"save-button"}))):i().createElement(i().Fragment,null,i().createElement(w.pp,{title:r.t`No pipelines found`,description:X?r.t`Create a pipeline to process and route data from your ${g.Pb}`:r.t`Create a pipeline to process and route data from your ${g.fI}`,emptyType:w.kQ.EMPTY_PIPELINES,button:i().createElement(b.F,{onTemplateMenuItemClick:()=>{le(V.g.CREATE_FROM_PIPELINE_TEMPLATE)},onPipelineMenuItemClick:()=>{z?.track(C.Z2.createFromTemplate,{templateId:B?.getContentDefaultPipelineTemplate?.({runtimeProfile:K})?.name}),n()}})}),i().createElement(R.CG,null,Q)))}},68514(e,t,n){n.d(t,{E:()=>l.EQ});var l=n(3579)},674(e,t,n){var l=n(85959),i=n(47444),a=n(56299),s=n(83993),r=n(11885),p=n(51322);n.d(t,["A",0,()=>{const[e,t]=(0,l.useState)({isLoading:!1,result:null,error:null}),[n,o]=(0,l.useState)(null),c=(0,i.lZ)(a.Tv),d=(0,r.e)();return{fetchMetrics:(0,l.useCallback)(async({query:e,timeRange:n,handleSearchId:l,enableToastError:i})=>{try{let a;if(t({isLoading:!0,result:null,error:null}),await d({query:e,timeRange:n,onSucceed:e=>{a=e,l?.(e),c((0,p.AV)())},onError:(e,t)=>{throw i&&t(e),e}}),a){const{results:e}=await(0,s.EO)().getJobResult(a);return o((0,p.AV)()),void t({isLoading:!1,result:e,error:null})}t({isLoading:!1,result:null,error:null})}catch(e){t({error:e,isLoading:!1,result:null})}},[d,c]),response:e,dataUpdatedAt:n}}])},73700(e,t,n){var l=n(85959),i=n(72478);n.d(t,["H",0,e=>{const{updatePageTitle:t}=(0,i.p)();(0,l.useEffect)(()=>(t?.(Array.isArray(e)?e:[e]),()=>t?.()),[t,e])}])},41956(e,t,n){var l=n(26250),i=n.n(l),a=n(50571),s=n(46813),r=n(15759),p=n.n(r),o=n(68870);i().div`
    display: grid;
    justify-content: flex-end;
    padding: 10px;
`;const c=i().div`
    display: flex;
    justify-content: flex-end;
    padding: ${o.default.spacingSmall} 0;

    [data-test='view-debug-logs-button'],
    [data-test='view-history-button'] {
        margin-right: ${o.default.spacingSmall};
    }
`,d=(i().div`
    max-width: 100%;
    padding: 10px;
`,i().div`
    ${s.jg}
    background-color: ${o.default.backgroundColorPage};
    display: flex;
    flex-direction: column;
    flex: 1 0 0;
    min-height: 0;
`),u=i().div`
    padding: 0 ${o.default.spacingMedium};
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    ${s.jg}
`,m=i().div`
    padding: ${o.default.spacingMedium} ${o.default.spacingLarge} 0
        ${o.default.spacingLarge};
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    ${s.jg}
`,g=i()(p())`
    width: 100%;
    height: 363px;
    padding: ${o.default.spacingMedium};
`,f=i()(p().Body)`
    overflow: hidden;
`,h=i().div`
    display: flex;
    justify-content: end;
`,y=i().div`
    display: flex;
    width: 300px;
`,E=i().div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    width: 100%;
    padding-bottom: ${o.default.spacingMedium};
`,S=i()(a.N)`
    button[data-inline] {
        margin-left: 0 !important;
        flex: 0 0 auto;
    }
`,P=i().div`
    padding: ${o.default.spacingMedium} 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: ${o.default.spacingSmall};
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: ${o.default.backgroundColorPage};
`,v=i().div`
    min-width: 0;
`,b=i().div`
    display: flex;
    align-items: center;
    gap: ${o.default.spacingLarge};
    margin-bottom: ${o.default.spacingSmall};

    [data-test='acies-header-title'] {
        flex-shrink: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    [data-test='chip-bowl'] {
        flex-shrink: 0;
    }
`,w=i().div`
    display: flex;
    gap: ${o.default.spacingSmall};
`,I=i().p`
    margin: ${o.default.spacingXSmall};
    margin-left: 0;
    font-size: ${o.default.fontSize};
`;n.d(t,["$5",0,w,"HB",0,f,"VE",0,c,"Vr",0,h,"XR",0,g,"YV",0,y,"_1",0,u,"bw",0,b,"h9",0,P,"k7",0,S,"mc",0,E,"n",0,I,"u6",0,v,"x$",0,m,"xr",0,d])}}]);
//# sourceMappingURL=4880.4880.js.map?0011547800be3e1707c6