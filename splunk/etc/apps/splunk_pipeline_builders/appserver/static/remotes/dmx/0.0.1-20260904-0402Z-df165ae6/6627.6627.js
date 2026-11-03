/*! For license information please see 6627.6627.js.LICENSE.txt */
"use strict";(self.webpackChunkdmx=self.webpackChunkdmx||[]).push([[6627],{35319(e,t,n){var a=n(85959),r=n.n(a),l=n(23465),o=n(63459),i=n.n(o),s=n(72478),c=n(30770);const u=r().createElement(i(),null);n.d(t,["M",0,({label:e="",route:t="",icon:n=u})=>{const{history:a,tenantName:o}=(0,s.p)();return r().createElement(l.$,{appearance:"primary",icon:n,label:e,onClick:e=>{const n=`/${o}/${t}`;(0,c.dx)(e)?window.open(n):a.push(n)}})}])},54240(e,t,n){n.d(t,{S0:()=>g,$F:()=>E});var a=n(85959),r=n.n(a),l=n(53209),o=n(22427),i=n.n(o),s=n(59421),c=n.n(s),u=n(26250),d=n.n(u),m=n(23465),p=n(68870);d()(m.$)`
    border-radius: ${p.default.spacingXSmall};
    align-self: start;
`,d()(i())`
    color: ${p.default.contentColorActive};
    margin-right: ${p.default.spacingSmall};
    width: 1em;
    height: 1em;
`;const g=({handleClick:e})=>{const t=(0,a.useCallback)(t=>{t.preventDefault(),e?.()},[e]);return r().createElement(c(),{onClick:t,appearance:"standalone"},r().createElement(i(),null),l.t` Copy ID `)},E=()=>r().createElement(c(),{to:"https://docs.splunk.com/Documentation/SplunkCloud/search2preview/SearchExperience/ConnectingEC",openInNewContext:!0},l.t`Pair with Splunk Cloud`)},36617(e,t,n){n.d(t,{wT:()=>S,pp:()=>$,kQ:()=>b});var a=n(85959),r=n.n(a),l=n(53209),o=n(6891),i=n(26250),s=n.n(i),c=n(39643),u=n.n(c),d=n(56143),m=n.n(d),p=n(68870);const g=s().div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
`,E=s()(u())`
    color: ${p.default.contentColorDefault};
    margin: ${p.default.spacingLarge} 0 0 0;
    max-width: 415px;
    text-align: center;
    font-size: ${p.default.fontSizeXXLarge};
`,h=s()(m())`
    color: ${p.default.contentColorDefault};
    margin: ${p.default.spacingLarge} 0 0 0;
    max-width: 415px;
    text-align: center;
`,v=s().div`
    margin: ${p.default.spacingXXLarge} 0 ${p.default.spacingXXLarge} 0;
`;var f=n(50604);let b=function(e){return e.EMPTY_DESTINATIONS="empty_destinations",e.EMPTY_EVENT_BREAKING_RULES="empty_event_breaking_rules",e.EMPTY_NODES="empty_nodes",e.EMPTY_PIPELINES="empty_pipelines",e.EMPTY_RULESETS="empty_rulesets",e.NO_SEARCH_RESULTS="no_search_results",e.ROBOT_AGENTS="robot_agents",e.ROBOT_ERROR="robot_error",e.ROBOT_PIPELINE="robot_pipeline",e.CONSTRUCTION="construction",e}({});const y=({type:e})=>{switch(e){case b.EMPTY_NODES:return r().createElement(f.TO,null);case b.EMPTY_PIPELINES:return r().createElement(f.$U,null);case b.EMPTY_RULESETS:return r().createElement(f.NY,null);case b.EMPTY_DESTINATIONS:return r().createElement(o.v_,{name:"NoContent"});case b.EMPTY_EVENT_BREAKING_RULES:case b.NO_SEARCH_RESULTS:return r().createElement(o.v_,{name:"NoResults"});case b.ROBOT_AGENTS:return r().createElement(f.PH,null);case b.ROBOT_ERROR:return r().createElement(o.v_,{name:"BadRequest"});case b.ROBOT_PIPELINE:return r().createElement(f.ns,null);case b.CONSTRUCTION:return r().createElement(f._q,null);default:return r().createElement(f.ns,null)}},$=({title:e,description:t,button:n,emptyType:a})=>r().createElement(g,{tabIndex:0,"data-test":"empty-state-container"},r().createElement(y,{type:a}),r().createElement(E,{level:2},e),r().createElement(h,null,t),!!n&&r().createElement(v,null,n)),S=()=>r().createElement($,{description:l.t`Try adjusting your search`,emptyType:b.NO_SEARCH_RESULTS,title:l.t`No results found`})},89967(e,t,n){n.d(t,{Qn:()=>h});var a=n(85959),r=n.n(a),l=n(53209),o=n(61605),i=n.n(o),s=n(60652),c=n(51625);const u=({onRequestClose:e,maintenanceWindow:t,isNonBlockingMaintenance:n=!1,isInMaintenance:a=!1})=>{const{startDateTime:o,endDateTime:u}=t,d=i()(o).utc().format("dddd, MMMM Do YYYY"),m=i()(u).utc().format("dddd, MMMM Do YYYY"),p=n?a?l.t`The ${s.fI} service is currently undergoing maintenance, scheduled for ${d}-${m}. No disruptions to data ingestion and processing are expected. However, you might encounter errors that prevent you from completing configuration changes. Please contact your Splunk representative for more information.`:l.t`The ${s.fI} service will undergo maintenance, scheduled for ${d}-${m}. No disruptions to data ingestion and processing are expected. However, you might encounter errors that prevent you from completing configuration changes. Please contact your Splunk representative for more information.`:a?l.t`The ${s.fI} service is currently undergoing maintenance, scheduled for ${d}-${m}. No disruptions to data ingestion and processing are expected. However, you cannot make any configuration changes during this time. Please contact your Splunk representative for more information.`:l.t`The ${s.fI} service will undergo maintenance, scheduled for ${d}-${m}. No disruptions to data ingestion and processing are expected. However, you will not be able to make any configuration changes during that time. Please contact your Splunk representative for more information.`;return r().createElement(c.SZ,{"aria-label":"maintenance announcement",type:a?"warning":"info",onRequestClose:e,className:"maintenance-message-container"},p)};var d=n(27198),m=n.n(d),p=n(50128);const g=()=>{const{maintenanceWindow:e,shouldShowEarlyNotification:t,shouldShowMaintenanceBanner:n}=(0,p.M7)(),[l,o]=(0,a.useState)(!window.sessionStorage.getItem("isEPMaintenanceMessageClosed"));return t&&e?r().createElement(m(),{animation:"expandHeight",open:l,outerStyle:{flex:"0 0 auto"},animateOnMount:!1,outerClassName:"maintenance-message-container"},r().createElement(u,{maintenanceWindow:e,onRequestClose:()=>{window.sessionStorage.setItem("isEPMaintenanceMessageClosed","true"),o(!1)},isNonBlockingMaintenance:n})):null},E=()=>{const{maintenanceWindow:e,shouldShowShortNotification:t,shouldShowMaintenancePage:n,shouldShowMaintenanceBanner:a}=(0,p.M7)();return(t||n||a)&&e?r().createElement(u,{maintenanceWindow:e,isInMaintenance:n||a,isNonBlockingMaintenance:a}):null},h=()=>r().createElement(r().Fragment,null,r().createElement(g,null),r().createElement(E,null))},72413(e,t,n){n.d(t,{n:()=>d});var a=n(85959),r=n.n(a),l=n(53209),o=n(75869),i=n(60652),s=n(79676),c=n(35319),u=n(36617);const d=({shouldRenderBackToHomeButton:e=!1})=>{let t=null;return e&&(t=r().createElement(c.M,{label:l.t`Back to Home`,route:s.tB,icon:null})),r().createElement(o.YA,null,r().createElement(u.pp,{emptyType:u.kQ.CONSTRUCTION,title:l.t`The ${i.fI} service is currently under maintenance.`,description:l.t`Splunk is currently performing maintenance on the ${i.fI} service. Please do not hesitate to contact Splunk Customer Support for any questions or assistance.`,button:t}))}},65695(e,t,n){n.d(t,{o:()=>Z});var a=n(85959),r=n.n(a),l=n(47444),o=n(34999),i=n.n(o),s=n(53209),c=n(97621),u=n(23465),d=n(70214),m=n(12207),p=n(47468),g=n.n(p),E=n(40426),h=n.n(E),v=n(44956),f=n.n(v),b=n(36156),y=n.n(b),$=n(25338),S=n.n($),k=n(60671),x=n.n(k),w=n(28546),C=n.n(w),B=n(69538),R=n(2543),N=n(56143),T=n.n(N),_=n(10278),M=n(56299),L=n(71103),I=n(26250),P=n.n(I),A=n(64200),O=n.n(A),D=n(78967);const H=P()(O())`
    height: 683px;
    max-width: 960px;
`,X=P()(O().Header)`
    padding: ${D.variables.lineHeight} ${D.variables.spacingXLarge};
`,Y=P()(O().Body)`
    height: calc(100% - ${D.variables.lineHeight} * 6);
    overflow: hidden;
`,V=P()(O().Footer)`
    padding: ${D.variables.lineHeight} ${D.variables.spacingXLarge};

    & > button:first-child {
        margin-right: ${D.variables.spacingSmall};
    }
`,z=P().div`
    display: flex;
    flex-direction: column;
    height: 400px;
    margin-top: ${D.variables.spacingMedium};
    gap: ${D.variables.spacingMedium};

    [data-test='enter-sample-data-input'] {
        textarea {
            height: 240px !important;
        }
    }

    [data-test='file'] {
        flex: 1;
    }
`,j=({handleClose:e=R.noop,open:t=!1,returnFocus:n})=>{const[o,i]=(0,l.L4)(M.HB),[c,d]=(0,a.useState)("");return(0,a.useEffect)(()=>{d(o.context?.events||"")},[o]),r().createElement(H,{"data-test":"edit-sample-data-modal",onRequestClose:e,open:t,returnFocus:n},r().createElement(X,{title:s.t`Edit sample data`}),r().createElement(Y,{"data-test":"preview-sample-data-modal-body"},r().createElement(T(),null,s.t`Enter or upload sample data to view how your source type settings cause incoming data from Splunk forwarders to be processed. Maximum 30,000 characters.`),r().createElement(r().Fragment,null,r().createElement(z,null,r().createElement(x(),{"data-test":"enter-sample-data-input",onChange:(e,{value:t})=>d(t),value:c}),r().createElement(_.q,{accept:".txt, .csv, .json",name:"sampleData",onChange:({value:e})=>d(e),supportsMessage:s.t`Supports .txt, .csv, .json`}))),r().createElement(L.hA,null,c.length," / 30000")),r().createElement(V,null,r().createElement(u.$,{appearance:"subtle","data-test":"cancel-button",label:s.t`Cancel`,onClick:()=>{e()}}),r().createElement(u.$,{appearance:"primary","data-test":"save-button",disabled:!c,label:s.t`Save`,onClick:()=>{i({context:{events:c}}),e()}})))};var q=n(51625),F=n(39562),G=n(72218),K=n(34949),U=n(93568);const W=r().createElement(g(),{variant:"filled",height:"24px",width:"24px"}),Z=({isEdit:e=!1,disabled:t=!1})=>{const{showDMXSPLLineBreaking:n}=(0,B.h)(),[o,p]=(0,l.L4)(M.HB),g=(0,l.vc)(n?M.Qn:M.mM).rules.filter(({id:e})=>e!==o.id).map(({name:e})=>e),[E,v]=(0,a.useState)(!1),[b,$]=(0,a.useState)(!1),[k,w]=(0,l.L4)(M.TV),R=(0,l.lZ)(M.gy),N=(0,a.useRef)(null),T=o.context?.events||"",_=(e,{value:t})=>{p({maxEvents:t||"number"==typeof t?t:c.s0.maxEvents})};let I=s.t`Viewing configuration`;return t||(I=e?s.t`Edit source type`:s.t`Add a source type`),r().createElement(L.j6,{"data-test":"configure-rule-side-panel"},r().createElement(L.KJ,null,r().createElement(q.A1,{level:3,"data-test":"configure-rule-side-panel-header-text"},I),r().createElement(U.I,{element:r().createElement(u.$,{icon:W,"data-test":"preview-button",appearance:"primary",disabled:!(T&&!k.lineBreaker&&!k.maxEvents&&!k.mustBreakBefore),onClick:()=>{const e=(0,c.Dn)(T,o);R(e)}}),content:s.t`Run to preview source type`})),r().createElement(d.E,null),r().createElement(L.ry,null,r().createElement(F.wW,{"data-test":"docs-link-section"},s.t`Configure event breaking for a specific source type. `,r().createElement(G.jd,{"data-test":"docs-link",location:"source_types.create"},s.t`Learn more`)),r().createElement(F.iD,{error:!!k.name,help:k.name||`${o.name.length}/80`,labelPosition:"top",key:"source-type-name",label:s.t`Name *`,controlsLayout:"none","aria-required":!0},r().createElement(L.z5,{type:"info"},s.t`Must be an exact match for the source type of your event`),r().createElement(S(),{"data-test":"source-type-name",error:!!k.name,maxLength:80,onChange:(e,{value:t})=>{e.stopPropagation(),p({name:t.trim(),spec:t.trim()}),t?K._5.test(t)?g.includes(t)?w({...k,name:s.t`Name must be unique`}):w({...k,name:null}):w({...k,name:s.t`Enter a unique name. Names can contain only letters, numbers, spaces, underscores, colons, forward slashes or hyphens. Maximum 80 characters (${t.length}/80)`}):w({...k,name:s.t`Name is required`})},key:"source-type-name-text",value:o.name,disabled:t})),r().createElement(F.iD,{help:s.t`${o.description.length}/512`,label:s.t`Description (optional)`,labelPosition:"top"},r().createElement(L.zo,null,r().createElement(x(),{"data-test":"event-breaking-rule-description",defaultValue:o.description,onChange:(e,{value:t})=>{p({description:t.trim()})},maxLength:512,rowsMin:5,disabled:t}))),r().createElement(F.iD,{labelPosition:"top",key:"line-breaking-options",label:s.t`Line breaking`,error:!!k.lineBreaker,help:k.lineBreaker||s.t`Enter a ${m.PCRE} capture group that matches the delimiter between distinct events`,tooltip:s.t`Same as LINE_BREAKER in props.conf. Recommended default is ([\\r\\n]+)`,controlsLayout:"stack"},r().createElement(L.zo,null,r().createElement(L.Zl,{"data-test":"line-breaking-regex-text",onChange:(e,{value:t})=>{if(e.stopPropagation(),p({lineBreaker:t}),t){const e=(0,m.enclosingSlashes)(t);if(e)w({...k,lineBreaker:e});else try{const e=(0,m.validateRegex)(`/${t}/`,m.PCRE);if(0===e.length)(e=>{try{let t=!1;const n=i().parse(e);return i().traverse(n,{Group:({node:e})=>{!0===e.capturing&&(t=!0)}}),t}catch(t){if((0,m.extractGroupNames)(e).length>1)return!0;if(e.match(/\(.*\)/))return!0}return!1})(t)?w({...k,lineBreaker:null}):w({...k,lineBreaker:`Use ${m.PCRE} syntax for named capture groups: (?P<name>...)`});else{const t=e.reduce((e,t)=>`${e}${t.message}. `,"");w({...k,lineBreaker:t})}}catch(e){w({...k,lineBreaker:s.t`Invalid regular expression`})}}else w({...k,lineBreaker:s.t`Line breaking is required`})},error:!!k?.lineBreaker?.message,value:o.lineBreaker,disabled:t}))),r().createElement(F.iD,{label:s.t`Should line merge`,hideLabel:!0,labelPosition:"top",controlsLayout:"none"},r().createElement(f(),{onChange:()=>p({shouldLineMerge:!o.shouldLineMerge}),checked:o.shouldLineMerge,disabled:t},s.t`Merge lines into events`,r().createElement(C(),{"data-test":"should-merge-tooltip",content:s.t`Same as SHOULD_LINEMERGE in props.conf`}))),r().createElement(F.iD,{labelPosition:"top",key:"multiline-event-delimiter",label:s.t`Multiline event delimiter`,error:!!k.mustBreakBefore,help:k.mustBreakBefore||s.t`Enter a ${m.PCRE} expression that matches the start of a multiline event`,tooltip:s.t`Same as BREAK_ONLY_BEFORE in props.conf`,controlsLayout:"none"},r().createElement(L.zo,null,r().createElement(L.Zl,{error:!!k.mustBreakBefore,"data-test":"multiline-event-delimiter-regex-text",onChange:(e,{value:t})=>{e.stopPropagation(),p({mustBreakBefore:t||c.s0.mustBreakBefore});const n=(0,m.enclosingSlashes)(t);if(n)w({...k,mustBreakBefore:n});else try{const e=(0,m.validateRegex)(`/${t}/`,m.PCRE);if(0===e.length)w({...k,mustBreakBefore:null});else{const t=e.reduce((e,t)=>`${e}${t.message}. `,"");w({...k,mustBreakBefore:t})}}catch(e){w({...k,mustBreakBefore:s.t`Invalid regular expression`})}},value:o.mustBreakBefore,disabled:t})))),(()=>{const e=[{error:k.maxEvents,label:"Maximum lines per event",notes:"Must be 0 or greater",onChange:_,placeholder:c.s0.maxEvents,tooltip:s.t`Same as MAX_EVENTS in props.conf. Recommended default is 256`,value:o.maxEvents===c.s0.maxEvents?null:o.maxEvents}];return r().createElement(L.pn,{onChange:E?()=>v(!1):()=>v(!0),open:E,panelId:"advanced-settings",title:s.t`Advanced settings`,"data-test":"advanced-settings-collapsible-panel"},r().createElement(L.ry,{"data-test":"advanced-settings-body"},r().createElement(L.cx,null,s.t`For more information on these settings, see the props.conf documentation.`," ",r().createElement(G.jd,{location:"source_types.advanced"},s.t`Learn more`)),e.map(({error:e,label:n,notes:a,onChange:l,placeholder:o,tooltip:i,value:s})=>r().createElement(F.iD,{error:!!e,help:e||a,key:n,label:n,labelPosition:"top",tooltip:i},r().createElement(L.zo,null,r().createElement(y(),{"data-test":`${n}-text`,error:!!e,key:`${n}-text`,onChange:l,placeholder:o.toString(),value:s,min:0,disabled:t}))))))})(),r().createElement(d.E,null),r().createElement(L.RR,null,r().createElement(L.hA,{"data-test":"edit-sample-data-section"},s.t`Edit sample data`),r().createElement(u.$,{appearance:"subtle",icon:r().createElement(h(),{"data-test":"edit-sample-data-button",width:"1em",height:"1em","aria-label":s.t`Edit sample data`}),onClick:()=>$(!0),ref:N}),r().createElement(j,{handleClose:()=>$(!1),open:b,returnFocus:N})))}},68514(e,t,n){n.d(t,{E:()=>a.EQ});var a=n(3579)},44657(e,t,n){var a=n(85959),r=n(47444),l=n(83993),o=n(56299);const i=()=>(0,r.Zs)(({refresh:e})=>()=>{e(o.mM)},[]);n.d(t,["Du",0,()=>{const e=i();return(0,a.useCallback)(async t=>{const n=await(0,l.EO)(l.Co.EVENT_BREAKING).createEventBreakingRule(t);return e(),n},[e])},"Ij",0,()=>{const e=i(),t=(0,r.Zs)(({refresh:e})=>t=>{e((0,o.fr)(t)),e(o.xW),e(o.HB),e(o.TV)},[]);return(0,a.useCallback)(async n=>{const a=await(0,l.EO)(l.Co.EVENT_BREAKING).updateEventBreakingRule(n);return e(),t(n.id),a},[e,t])},"QL",0,i,"oo",0,()=>{const e=i();return(0,a.useCallback)(async t=>{await(0,l.EO)(l.Co.EVENT_BREAKING).deleteEventBreakingRule(t),e()},[e])}])},28592(e,t,n){n.d(t,{I$:()=>s,nm:()=>i});var a=n(2543),r=n(85959),l=n(47444),o=(n(55507),n(49449));function i(e,t=1e4,n){const a=(0,o.QR)(),l=(0,r.useRef)(null),i=(0,r.useCallback)(()=>{a||l.current&&(clearTimeout(l.current),n?.())},[a,n]),s=(0,r.useCallback)(()=>{if(a)return Promise.resolve(null);const n=async a=>{e();const r=setTimeout(n,t,a);return l.current=r,r};return new Promise(n)},[e,a,t]);return(0,r.useEffect)(()=>i,[i]),[s,i]}function s(e,t){const n=(0,r.useRef)(t??null),o=(0,l.xf)(e);switch((0,r.useEffect)(()=>{"hasValue"!==o.state||(0,a.isEqual)(o.contents,n.current)||(n.current=o.contents)},[o.contents,o.state]),o.state){case"hasValue":return o.contents;case"loading":case"hasError":if(null!=n.current)return n.current;throw o.contents;default:throw new Error("This line should never be reached.")}}},6334(e,t,n){var a=n(85959),r=n.n(a),l=n(73207),o=n(44317),i=n(54240),s=n(72478),c=n(83993);const u=["Failed to fetch","NetworkError when attempting to fetch resource.","Load failed"];n.d(t,["R",0,()=>{const{toast:{postToast:e}}=(0,s.p)(),{copy:t}=(0,o.C)();return(0,a.useCallback)((n,a,o="Try again later.")=>{const{message:s}=a;let d;d=(e=>{const t=e,n=t?.message;return!("string"!=typeof n||!u.includes(n)||null!=t?.httpStatusCode||t?.code)})(a)?"Cannot connect to the server. Check your network connection and try again.":s||`${o}${(e=>{let t="";return"httpStatusCode"in e&&e.httpStatusCode?t+=` ${e.code}: ${e.httpStatusCode}.`:"status"in e&&e.status&&(t+=` ${e.status}: ${e.statusText}.`),t})(a)}`;const m=(0,c.RE)(a);m&&(d.trim().endsWith(".")||(d=`${d.trim()}.`),d+=(0,l.fp)(m));const p={title:n,dismissOnActionClick:!1,autoDismiss:!1,type:"error",message:d};m&&(p.action={label:r().createElement(i.S0,null),callback:async()=>{await t(m)}}),e(p)},[e,t])}])},73700(e,t,n){var a=n(85959),r=n(72478);n.d(t,["H",0,e=>{const{updatePageTitle:t}=(0,r.p)();(0,a.useEffect)(()=>(t?.(Array.isArray(e)?e:[e]),()=>t?.()),[t,e])}])},34949(e,t,n){n.d(t,["_5",0,/^[a-zA-Z0-9-:_/ ]*$/,"lq",0,/^[a-zA-Z0-9-_]*$/])},13205(e,t,n){n.d(t,{v:()=>$,x:()=>S});var a=n(85959),r=n.n(a),l=n(47444),o=n(53209),i=n(23465),s=n(50571),c=n(47468),u=n.n(c),d=n(56299),m=n(36617),p=n(52529),g=n.n(p),E=n(71103);const h={height:"100%"},v=({data:e=[]})=>!!e.length&&r().createElement(E.PW,null,r().createElement(g(),{stripeRows:!0,headType:"fixed",innerStyle:h,outerStyle:h},r().createElement(g().Head,null,r().createElement(g().HeadCell,null,"_raw")),r().createElement(g().Body,null,e.map((e,t)=>r().createElement(g().Row,{key:`row-${t.toString()}`},r().createElement(g().Cell,{className:t%2==0?"even":"odd",style:{whiteSpace:"pre"}},e))))));var f=n(72478),b=n(88259),y=n(79676);const $=({title:e,onSaveButtonClick:t=null,isSaveButtonDisabled:n=!1})=>{const{tenantName:l}=(0,f.p)(),{onNavigate:c}=(0,b.c)(),u=y.W,d=(0,a.useMemo)(()=>[{id:u.VIEW_EVENT_BREAKING,href:`/${l}/${u.VIEW_EVENT_BREAKING}`,name:o.t`Source types`}],[u.VIEW_EVENT_BREAKING,l]),m=(0,a.useMemo)(()=>t?r().createElement(i.$,{"data-test":"save-source-type",label:o.t`Save source type`,onClick:t,disabled:n}):r().createElement(r().Fragment,null),[n,t]);return r().createElement(s.N,{breadcrumbs:d,"data-test":"breadcrumbs-container",onNavigate:c,rightContent:m,title:e})},S=({rawEventString:e=""})=>{const t=r().createElement(u(),{variant:"filled",height:"1.6em",width:"1.6em",key:"play-icon"}),n=(0,l.vc)(d.gy);return r().createElement(E.Ch,null,n.length?r().createElement(r().Fragment,null,r().createElement(E.A9,{"data-test":"data-container"},e),r().createElement(E.z8,{"data-test":"events-container"},r().createElement(v,{data:n}))):r().createElement(m.pp,{description:o.jt`You can preview how Edge Processors preprocess incoming data with matching source types based on the current source type configuration. Start by selecting "Edit sample data" and providing sample data. Then, select "Run to preview source type" ${t}.`,emptyType:m.kQ.EMPTY_EVENT_BREAKING_RULES,title:o.t`No source type preview to display`}))}},56303(e,t,n){n.d(t,{r:()=>v});var a=n(2543),r=n(85959),l=n.n(r),o=n(47444),i=n(53209),s=n(75869),c=n(6334),u=n(65695),d=n(72478),m=n(79676),p=n(56299),g=n(28592),E=n(44657),h=n(13205);const v=({ruleId:e})=>{const{history:t,tenantName:n,toast:{postToast:v}}=(0,d.p)(),f=(0,o.vc)(p.TV),b=(0,c.R)(),y=(0,g.I$)((0,p.fr)(e)),[$,S]=(0,o.L4)(p.HB),k=(0,E.Du)(),x=(0,E.Ij)(),w=!!f.name||!$.name||!!f.maxEvents||!!f.lineBreaker||!$.lineBreaker||!!f.mustBreakBefore||!!e&&(0,a.isEqual)($,y);return(0,r.useEffect)(()=>{e&&S(y)},[y,e,S]),l().createElement(l().Fragment,null,l().createElement(h.v,{title:y.name||e||i.t`Add source type`,onSaveButtonClick:async()=>{const a=m.W;try{let r;e?(r=await x($),S(r)):(r=await k($),t.replace(`/${n}/${a.EDIT_EVENT_BREAKING_RULE}/${r.id}`)),v({message:i.t`${r.name} was successfully saved`,type:"success"})}catch(e){const t=i.t`There was a problem creating your new event breaking definition.`;b(i.t`Error`,e,t)}},isSaveButtonDisabled:w}),l().createElement(s.j0,{"data-test":"event-breaking-rule-view-page-container"},l().createElement(h.x,{rawEventString:$.context?.events}),l().createElement(u.o,{isEdit:!!e})))}},71103(e,t,n){var a=n(26250),r=n.n(a),l=n(60250),o=n(46813),i=n(36771),s=n.n(i),c=n(52473),u=n.n(c),d=n(56143),m=n.n(d),p=n(98798),g=n.n(p),E=n(60671),h=n.n(E),v=n(78967),f=n(39562);r()(u())`
    height: 100%;
    display: flex;
    width: calc(100% - 340px);
    margin: ${v.variables.spacingMedium};

    [data-test='row'] {
        height: 100%;
    }
`;const b=r().div`
    display: flex;
    width: 70%;
    flex: 2;
    flex-direction: column;
`,y=r().div`
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
`,$=r().div`
    height: ${"40%"};
    ${o.jg}
    overflow-x: hidden;
    width: 100%;
    span {
        border: 0;
    }
    white-space: pre-wrap;
    word-wrap: break-word;
    padding: ${v.variables.spacingXSmall} ${v.variables.spacingMedium}
        ${v.variables.spacingXSmall};
    box-sizing: border-box;
`,S=r().div`
    height: calc(100% - ${"40%"});
    width: 100%;
    position: relative;
    td.odd {
        background: rgba(255, 255, 255, 0.1);
    }
    ${o.Xs}
`,k=r().div`
    box-sizing: border-box;
    height: calc(${v.variables.spacingXXLarge} + 2 * ${v.variables.spacingLarge});
    padding: ${v.variables.spacingLarge};
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
        max-width: ${v.variables.spacingXXLarge};
        border-radius: ${v.variables.spacingXSmall};
    }
`,x=r().div`
    box-sizing: border-box;
    padding: ${v.variables.spacingLarge};
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`,w=r()(l.SR)`
    flex: 0 0 auto;
    z-index: 0;
    height: initial;
    ${o.jg};
`,C=r()(g())`
    margin-top: ${v.variables.spacingSmall};
    height: ${v.variables.spacingXLarge};
`,B=r()(h())`
    font-family: ${v.variables.monoFontFamily};

    textarea {
        font-family: inherit;
    }
`,R=r()(s())`
    margin-bottom: ${v.variables.spacingSmall};
    min-height: calc(${v.variables.lineHeight} + 2 * ${v.variables.spacingSmall});
    background-color: transparent;

    [data-test='toggle'] {
        background-color: ${v.variables.interactiveColorBackground};
        padding-bottom: ${v.variables.spacingSmall};
        padding-top: ${v.variables.spacingSmall};

        > span {
            top: 10px;
        }
    }

    [data-test='advanced-settings-body'] {
        padding: 0;
    }
`,N=r().div`
    box-sizing: border-box;
    background-color: ${v.variables.interactiveColorBackground};
    margin-top: ${v.variables.spacingSmall};
    min-height: calc(${v.variables.lineHeight} + 2 * ${v.variables.spacingSmall});
    padding: 0 ${v.variables.spacingLarge};
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
        max-width: ${v.variables.spacingXXLarge};
        border-radius: ${v.variables.spacingXSmall};
    }
`,T=r().div`
    align-content: center;
    display: flex;
    flex-direction: column;
`,_=(r().span`
    color: ${v.variables.contentColorMuted};
    font-size: ${v.variables.fontSizeSmall};
`,r()(m())`
    margin-bottom: ${v.variables.spacingSmall};
`),M=r()(f.fK)`
    padding-top: 0;
    padding-bottom: 0;
    margin: 0 0 ${v.variables.spacingLarge} 0;

    & > span {
        padding-top: 0;
    }
`;n.d(t,["A9",0,$,"Ch",0,b,"KJ",0,k,"PW",0,y,"RR",0,N,"Zl",0,B,"cx",0,_,"hA",0,C,"j6",0,w,"pn",0,R,"ry",0,x,"z5",0,M,"z8",0,S,"zo",0,T])}}]);
//# sourceMappingURL=6627.6627.js.map?3c08952b728103e985cc