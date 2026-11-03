/*! For license information please see 2902.2902.js.LICENSE.txt */
"use strict";(self.webpackChunkdmx=self.webpackChunkdmx||[]).push([[2902],{11440(e,t,n){var a=n(85959),r=n.n(a),l=n(17040),s=n(83993);n.d(t,["q",0,({title:e,error:t})=>r().createElement(l.w,{title:e,subtitle:(0,s.I4)(t),errorCode:(0,s.RE)(t),httpStatusCode:(0,s.w7)(t),request:(0,s.iq)(t)})])},84707(e,t,n){var a=n(85959),r=n.n(a),l=n(47444),s=n(53209),o=n(59421),c=n.n(o),i=n(51625),u=n(72478),d=n(79676),E=n(56299);n.d(t,["j",0,({location:e})=>{const{tenantName:t}=(0,u.p)(),[n,a]=(0,l.L4)(E.J3),o="home"===e?r().createElement(r().Fragment,null,s.t`Metrics processing capabilities are coming soon to Edge Processors! Configure a default destination for metrics in advance of this release. Go to `,r().createElement(c(),{to:`/${t}/${d.dA.ROOT}`},s.t`Edge Processors.`)):s.t`Metrics processing capabilities are coming soon! Configure a metrics default destination for any Edge Processors that receive metrics.`;return r().createElement(r().Fragment,null,!n[e]&&r().createElement(i.SZ,{type:"info",id:"metric-notification",onRequestClose:()=>{a(t=>({...t,[e]:!0}))}},o))}])},69405(e,t,n){var a=n(85959),r=n.n(a),l=n(47444),s=n(53209),o=n(23465),c=n(63459),i=n.n(c),u=n(39318),d=n(18182),E=n(56299),m=n(69245);n.d(t,["S",0,({appearance:e=m.EY.PRIMARY,disabled:t=!1})=>{const n=(0,l.lZ)(E.zi),a=(0,u.Jr)();return r().createElement(o.$,{appearance:e,icon:r().createElement(i(),null),"data-testid":"add-edge-processor",label:s.t`New Edge Processor`,onClick:()=>{n(d.g.CREATE_NODE),a?.track(u.Z2.clickNewEdgeProcessor)},disabled:t})}])},82464(e,t,n){var a=n(85959),r=n.n(a),l=n(53209),s=n(60652),o=n(69405),c=n(36617);n.d(t,["p",0,()=>r().createElement(c.pp,{button:r().createElement(o.S,null),description:l.t`Add an ${s.fI} to transform and route data`,emptyType:c.kQ.EMPTY_NODES,title:l.t`No Edge Processors to display`})])},20266(e,t,n){var a=n(85959);n.d(t,["b",0,(e,t)=>{const[n,r]=(0,a.useState)(()=>{const n=sessionStorage.getItem(e);return n?JSON.parse(n):t});return[n,t=>{r(t),sessionStorage.setItem(e,JSON.stringify(t))}]}])},22902(e,t,n){n.r(t),n.d(t,{default:()=>qe});var a=n(85959),r=n.n(a),l=n(47444),s=n(53209),o=n(75869),c=n(33199),i=n(65732),u=n(89967),d=n(72413),E=n(84707),m=n(2543),g=n(26250),p=n.n(g),h=n(86920),b=n(8610),S=n(80128),f=n.n(S),v=n(78967),C=n(72478),I=n(1744),P=n(17907),y=n(82445),_=n(36617),N=n(3990),L=n(25785),T=n(95972),k=n(51625),O=n(30770),w=n(73207),A=n(41956),D=n(6912),$=n(38646),R=n(69405),M=n(59475),U=n(82464),z=n(44398),F=n(38485),W=n(41194),Y=n(57323),x=n(65429),G=n(5975),V=n(18182),B=n(56299),J=n(15002);const Z=p()(W.J0)`
    margin: 0 ${v.variables.spacingLarge};
`,q=({nodes:e})=>{const{history:t}=(0,C.p)(),[n,o]=(0,a.useState)(null),c=(0,l.lZ)(B.sy),i=(0,l.lZ)(B.zi),u=(0,x.Q)(),d=(0,Y.W)(),{isOpen:E,open:m,isPending:g,title:p,message:h,onCancel:b,onConfirm:S,returnFocus:f}=(0,J.J)(),v=(0,a.useCallback)(async(...e)=>{try{await S(...e)&&o(null)}catch(e){}},[S]),I=(0,a.useCallback)((e,t,n)=>{c(t),i(n)},[i,c]),P=(0,a.useCallback)((e,t)=>{o(t),m()},[m]),{edgeProcessor:y,setUrlParam:_}=(0,N.hI)(),T=(0,a.useCallback)(e=>{const n=y({id:e.id});t.push(n)},[t,y]),k=(0,a.useCallback)(e=>{const n=y({id:e.id}),a=_("initialTab","instances",n),{pathname:r}=new URL(n,window.location.origin);t.push(r+a)},[y,_,t]),O=(0,a.useCallback)((e,t)=>T(t),[T]),w=({node:e})=>{const t=(0,l.vc)((0,B.O6)(e.id))||[],n={OPEN_DETAIL_VIEW:{key:"open",label:s.t`Open`,handler:O},APPLY_PIPELINE_SPECS_TO_NODE:{key:"apply-remove-pipelines",label:s.t`Apply/remove pipelines`,handler:t=>I(t,e,V.g.APPLY_PIPELINE_SPECS_TO_NODE)},CONFIGURE_DATA_SOURCES:{key:"configure-data-sources",label:s.t`Configure data sources`,handler:t=>I(t,e,V.g.CONFIGURE_DATA_SOURCES)},INSTALL_UNINSTALL:{key:"install-uninstall",label:s.t`Install/uninstall`,handler:t=>I(t,e,V.g.INSTALL_UNINSTALL)},VIEW_INSTANCES:{key:"view-instances",label:s.t`View instances`,handler:()=>{k(e)}},VIEW_HISTORY_LOGS:{key:"view-history",label:s.t`View history`,handler:()=>{u(e.id)}},VIEW_DEBUG_LOGS:{key:"view-debug-logs",label:s.t`View debug logs`,handler:()=>{d(e.id)}},EDIT_NODE:{key:"edit-edge-processor",label:s.t`Edit Edge Processor`,handler:t=>I(t,e,V.g.EDIT_NODE)},DELETE_NODE:{key:"delete-edge-processor",label:s.t`Delete Edge Processor`,handler:P}},a=[n.OPEN_DETAIL_VIEW],o=e.instanceStatus.filter(e=>e.status===L.bg.Disconnected);return e.instanceStatus.length?(a.push(n.APPLY_PIPELINE_SPECS_TO_NODE),a.push(n.CONFIGURE_DATA_SOURCES)):(a.push({...n.APPLY_PIPELINE_SPECS_TO_NODE,disabled:!0,tooltip:s.t`You must set up an Edge Processor before you can apply any pipelines`}),a.push({...n.CONFIGURE_DATA_SOURCES,disabled:!0,tooltip:s.t`You must set up an Edge Processor before you can configure data sources`})),a.push(n.INSTALL_UNINSTALL),e.instanceStatus.length?a.push(n.VIEW_INSTANCES):a.push({...n.VIEW_INSTANCES,disabled:!0,tooltip:s.t`You must set up an Edge Processor before you can view instances`}),a.push(n.VIEW_HISTORY_LOGS),a.push(n.VIEW_DEBUG_LOGS),a.push(n.EDIT_NODE),e.instanceStatus.length&&e.instanceStatus.length!==o.length||t.length?a.push({...n.DELETE_NODE,disabled:!0,tooltip:s.t`You must remove all pipelines and uninstall all instances from the Edge Processor before you can delete it`}):a.push(n.DELETE_NODE),r().createElement(F.$6,{actions:a,entity:e})};return r().createElement(r().Fragment,null,r().createElement(G.u,{open:E,title:p,message:h,data:n,disabled:g,onCancel:b,onConfirm:v,actionButtonAppearance:"destructive",actionButtonLabel:s.t`Delete`,returnFocus:f}),r().createElement(Z,{fixedHeaders:!0,entities:e,entityPropForKey:"name",rowActions:e=>r().createElement(w,{node:e}),columns:M.z,handleRowDblClick:T}))};var H=n(14361),Q=n(97068),j=n.n(Q),K=n(57914),X=n.n(K),ee=n(2619);const te=p()(X())`
    margin-top: ${v.variables.spacingSmall};

    p {
        margin: 0;
    }
`,ne=()=>{const[e,t]=(0,a.useState)(!1),n=(0,ee.$G)(),l=(0,N.hI)().sourceTypes(),o=s.t`You must sync your Splunk Enterprise source types to the Edge Processor solution in the [Synced source types](${l}) page to use them in a pipeline.`;return(0,a.useEffect)(()=>{let e=!1;return(async e=>{const t=await(0,H.S)(e),{results:n}=await e.listFunctions({namespace:t,pageSize:1});return n.length>0})(n).then(n=>{e||t(!n)}),()=>{e=!0}},[n]),e?r().createElement(te,{"data-test":"warn-no-source-types",appearance:"fill",type:"warning"},r().createElement(j(),{text:o})):null};var ae=n(11440),re=n(30376),le=n(15759),se=n.n(le),oe=n(39643),ce=n.n(oe);const ie=p()(se())`
    --color-healthy: ${v.variables.accentColorPositive};
    --color-active: ${v.variables.accentColorPositive};
    --color-warning: ${v.variables.accentColorWarning};
    --color-disconnected: ${v.variables.contentColorMuted};
    --color-error: ${v.variables.accentColorNegative};
    --font-color: ${v.variables.contentColorActive};
    --background-color: ${v.variables.backgroundColorSection};
    // use font-color as fallback if status color isn't defined
    --status-color: ${v.variables.contentColorDefault};
    overflow: hidden;
    width: 156px;
`,ue=p()(se().Body)`
    display: grid;
    align-items: center;
    grid-template-rows: 1fr 1fr 2fr;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: ${v.variables.spacingXSmall};
    background-color: var(--background-color);

    :first-child,
    :last-child {
        // first and last children of card get 28px padding
        padding: ${v.variables.spacingLarge} ${v.variables.spacingMedium} 0;
    }

    h2 {
        margin: unset;
    }
`,de=(p()(ce())`
    text-transform: capitalize;
    grid-row-start: 2;
    grid-column-start: 2;
    grid-column-end: 5;
    font-size: ${v.variables.fontSize};
    font-weight: ${v.variables.fontWeightNormal};
    color: var(--status-color);
`,p()(ce())`
    grid-row-start: 1;
    grid-column-start: 1;
    grid-column-end: 4;
    font-size: ${v.variables.fontSize};
    font-weight: ${v.variables.fontWeightSemiBold};
    color: var(--font-color);
    line-height: ${v.variables.lineHeightSpacious};
`),Ee=p().div`
    grid-column-start: 1;
    grid-column-end: 5;
    grid-row-start: 2;
    font-size: ${v.variables.fontSize};
    font-weight: 400;
    color: var(--status-color);
`,me=p().span`
    display: inline-block;
    font-size: 36px;
    grid-column-start: 1;
    grid-column-end: 4;
    grid-row-start: 3;
    color: var(--font-color);
    font-weight: ${v.variables.fontWeightBold};
`,ge=p().span`
    display: inline-block;
    font-size: ${v.variables.fontSize};
    grid-column-start: 4;
    grid-row-start: 3;
    grid-row-end: 4;
    align-self: center;
`,pe=({status:e,count:t=0,time:n})=>r().createElement(ie,null,r().createElement(ue,null,r().createElement(de,{level:2},s.t`Instances with`),r().createElement(Ee,null,r().createElement($.kW,{tabIndex:-1,status:e,size:$.Ev.MEDIUM,showStatusText:!0})),r().createElement(me,null,(0,re.$t)(t)),n&&r().createElement(ge,null,n))),he=({count:e=0,time:t})=>r().createElement(ie,null,r().createElement(ue,null,r().createElement(de,{level:2},s.t`All instances`),r().createElement(me,null,(0,re.$t)(e)),t&&r().createElement(ge,null,t))),be=({disableCreateButton:e=!1,disableSearchInput:t=!1,handleFilterChange:n,searchString:a="",onSearchChange:l=m.noop,instancesStatusCounter:o,selectedInstances:c,noSourceTypes:i})=>{const u=[L.bg.Error,L.bg.Warning,L.bg.Disconnected,L.bg.Healthy],d=(0,m.map)(T.I,(e,t)=>r().createElement(f().Option,{key:t,label:(0,m.upperFirst)(t),value:t,icon:r().createElement($.kW,{size:$.Ev.SMALL,status:t})})),{edgeProcessorSharedSettings:E,edgeProcessorTroubleshooting:g}=(0,N.hI)(),p=(0,D.b)();return r().createElement(z.lb,null,r().createElement(z.mc,null,r().createElement(b.s,null,s.t`Edge Processors`),r().createElement(A.VE,null,g&&g!==N.hQ&&r().createElement(k.Pm,{label:s.t`Troubleshooting`,to:g()}),r().createElement(k.Pm,{label:s.t`Shared settings`,to:E(),onClick:p}),r().createElement(R.S,{disabled:e}))),i,r().createElement(z.Oo,{"data-test":"instance-cards-container"},r().createElement(z.xz,{"data-test":"instance-card-total-instances"},r().createElement(he,{count:(0,m.sum)((0,m.values)(o))||0})),u.map(e=>r().createElement(z.xz,{"data-test":`${e}-instance-card-container`,key:`${e}-instance-card-container`},r().createElement(pe,{status:e.toLowerCase(),count:o?.[e]})))),r().createElement(z.iD,{"data-test":"search-control-group",label:s.t`Edge Processor search`,labelPosition:"top",hideLabel:!0},r().createElement(z.KL,{"data-test":"search-edge-processors-input",onChange:l,placeholder:s.t`Filter by name`,value:a,disabled:t}),r().createElement(z.xH,{"data-test":"instance-health-filter",values:c,onChange:n,inline:!0,compact:!0,placeholder:s.t`Filter by instance health`},d)))},Se=p()(h.v)`
    margin: 0 ${v.variables.spacingLarge};
`,fe=({disableCreateButton:e=!1,disableSearchInput:t=!0}={})=>r().createElement(r().Fragment,null,r().createElement(be,{disableCreateButton:e,disableSearchInput:t}),r().createElement(Se,{columns:M.z})),ve=({noSourceTypes:e})=>{const{edgeProcessorSharedSettings:t,edgeProcessorTroubleshooting:n}=(0,N.hI)(),a=(0,D.b)();return r().createElement(r().Fragment,null,r().createElement(z.lb,null,r().createElement(z.mc,null,r().createElement(k.A1,{level:2,className:"fs-unmask"},s.t`Edge Processors`),r().createElement(A.VE,null,n&&n!==N.hQ&&r().createElement(k.Pm,{label:s.t`Troubleshooting`,to:n()}),r().createElement(k.Pm,{label:s.t`Shared settings`,to:t(),onClick:a}))),e),r().createElement(z.YA,null,r().createElement(U.p,null)))},Ce=()=>{const{tenantName:e}=(0,C.p)(),{nodes:t,error:n}=(0,l.vc)(I.OC),o=(0,l.vc)(I.sc),[c,i]=(0,a.useState)(""),[u,d]=(0,a.useState)([]),E=(0,y.Tn)(e),g=t.map(e=>{const t=o.filter(t=>t.context.edgeProcessors.includes(e.id)),n=E.find(t=>t.processor_id===e.id);return{...e,pipelines:t,metrics:n}}),p=u.length?g.filter(({instanceStatus:e})=>{const t=e.map(({status:e})=>e);return!!(0,m.intersection)(u,t).length}):g,h=(0,O.dL)(c,p,["name"]),b=(0,w.j4)(g),S=(0,P.K)(),f=(0,a.useMemo)(()=>S?r().createElement(ne,null):void 0,[S]);return n||g.length?r().createElement(a.Suspense,{fallback:r().createElement(fe,null)},r().createElement(be,{searchString:c,handleFilterChange:(e,{values:t})=>d(t),onSearchChange:(e,{value:t})=>{i(t)},instancesStatusCounter:b,selectedInstances:u,noSourceTypes:f}),h.length>0&&r().createElement(q,{nodes:h}),0===h.length&&n&&r().createElement(ae.q,{title:s.t`Unable to list Edge Processors`,error:n}),0===h.length&&!n&&r().createElement(_.wT,null)):r().createElement(ve,{noSourceTypes:f})};var Ie=n(47352),Pe=n(26290),ye=n(66118),_e=n(94330),Ne=n(36047),Le=n(75045),Te=n(45953),ke=n(2259),Oe=n(46688),we=n(50128),Ae=n(69538),De=n(13736),$e=n(59421),Re=n.n($e),Me=n(21189),Ue=n(72218),ze=n(86690),Fe=n(20266);const We=()=>{const[e,t]=(0,Fe.b)("ep-auth-migration-banner-dismissed",!1);return e?null:r().createElement(k.SZ,{type:"warning","data-test":"ep-auth-migration-banner",onRequestClose:()=>t(!0)},s.t`Update your Edge Processor instances to prepare for authenticated package downloads. `,r().createElement(Re(),{openInNewContext:!0,to:(0,Ue.Yc)(Me.yo)},s.t`Review migration documentation`))},Ye=()=>{const{nodes:e}=(0,l.vc)(I.OC);return(0,ze.J)(e.flatMap(({instanceStatus:e})=>e??[]))?r().createElement(We,null):null};var xe=n(76296);const Ge=()=>{const[e,t]=(0,Fe.b)("ep-script-migration-banner-dismissed",!1),{migrationBannerContent:n}=(0,xe.L)();return e?null:r().createElement(k.SZ,{type:"info","data-test":"ep-script-migration-banner",onRequestClose:()=>{t(!0)}},n)};var Ve=n(3579),Be=n(73700);const Je=()=>{const{runtime:e}=(0,Oe.L)(),[t,n]=(0,l.L4)(B.zi),s=(0,l.vc)(B.sy);let o=null;switch(t){case V.g.CREATE_NODE:o=r().createElement(_e.A,{"data-test":"create-edge-processor-side-panel"});break;case V.g.APPLY_PIPELINE_SPECS_TO_NODE:o=r().createElement(Ie.D,{"data-test":"apply-pipeline-spec-side-panel",node:s});break;case V.g.INSTALL_UNINSTALL:o=r().createElement(ye.I,{nodeId:s.id});break;case V.g.CREATE_FROM_PIPELINE_TEMPLATE:o=r().createElement(Te.A,{"data-test":"pipeline-template-side-panel",runtime:e});break;case V.g.CONFIGURE_DATA_SOURCES:o=r().createElement(Pe.d,{"data-test":"configure-data-sources-side-panel",nodeId:s.id});break;case V.g.EDIT_NODE:o=r().createElement(Ne.n,{nodeId:s.id},r().createElement(_e.A,{"data-test":"edit-edge-processor-side-panel",node:s}));break;default:o=null}return(0,a.useEffect)(()=>()=>n(null),[n]),r().createElement(Le.G,null,o)},Ze=()=>{const e=(0,l.vc)(B.sy);return r().createElement(ke.Qk,{processorId:e?.id},r().createElement(a.Suspense,{fallback:r().createElement(fe,null)},r().createElement(Ce,null)),r().createElement(Je,null))},qe=()=>{const e=(0,I.dr)(),t=(0,De.mT)();(0,a.useLayoutEffect)(()=>{e(),t(c.jM)},[]),(0,Be.H)(s.t`Edge Processors`);const{shouldShowMaintenancePage:n}=(0,we.M7)(),{showMigrationBanner:l}=(0,xe.L)(),{showDMXEPMetricsDestination:m,enableMetricsProcessing:g}=(0,Ae.h)(),p=(0,P.K)(),h=m&&!g;return n?r().createElement(d.n,null):r().createElement(o.gZ,{"data-test":"edge-processors"},r().createElement(u.Qn,null),r().createElement(a.Suspense,{fallback:r().createElement(fe,{disableCreateButton:!0})},r().createElement(Ve.EQ,null,r().createElement(i.y,null,r().createElement(Oe.J,{runtime:c.jM},p&&r().createElement(Ye,null),l&&r().createElement(Ge,null),h&&r().createElement(E.j,{location:"edge"}),r().createElement(Ze,null))))))}}}]);
//# sourceMappingURL=2902.2902.js.map?6b8c1d531c6690740778