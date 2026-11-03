/*! For license information please see 889.889.584828c6407a63d44fbb.js.LICENSE.txt */
"use strict";(self.webpackChunksplunk_data_management=self.webpackChunksplunk_data_management||[]).push([[889],{17889(e,t,a){a.r(t),a.d(t,{default:()=>Ut});var n=a(96540),l=a(53209),r=a(47681),i=a(32291),o=a(89026);const s=(0,r.default)(o.IT)`
    flex: 1 1 auto;
    min-height: 0;
`,c=({selected:e,children:t})=>n.createElement(s,null,n.createElement(i.j,{selected:e}),t);var d=a(39643),u=a.n(d),p=a(24379),m=a.n(p),g=a(15759),h=a.n(g),f=a(68870);const v=(0,r.default)(h())`
    width: 400px;
    height: 200px;
    display: flex;
    flex-direction: column;

    // This is to make the card hover over the content when used for API response waiting
    z-index: 1000;

    // This is to center the card.
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`,E=(0,r.default)(h().Body)`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${f.default.spacingXLarge};
`,b=({text:e=l.t`Loading...`})=>n.createElement(v,null,n.createElement(E,null,n.createElement(m(),{size:"large"}),n.createElement(u(),{level:2},e)));var y=a(70181),S=a.n(y),w=a(63616),k=a.n(w),x=a(69211),I=a(78967),C=a(65798),M=a(21268),D=a(56143),_=a.n(D),$=a(25094),A=a(48881);const L="26px",N=r.default.div`
    display: grid;
    grid-gap: ${I.variables.spacingLarge};
    grid-template-columns: repeat(auto-fit, minmax(min(${"340px"}, 100%), 1fr));
    max-width: calc(
        ${4} * ${"480px"} + 2 * ${I.variables.spacingLarge}
    );
    margin-top: ${I.variables.spacingMedium};
`,T=r.default.div`
    flex: 0 0 auto;
    background-color: ${I.variables.interactiveColorOverlaySelected};
    color: ${I.variables.contentColorMuted};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    width: 76px;
    height: 76px;
    margin-right: ${I.variables.spacingLarge};

    & > svg {
        width: 30px;
        height: 30px;
    }
`,O=r.default.div`
    display: flex;
    gap: ${I.variables.spacingLarge};
    flex-wrap: wrap;
    margin-top: ${I.variables.spacingMedium};
`,P=r.default.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-start;
    padding-top: 20px;
`,G=r.default.p`
    font-size: ${I.variables.fontSize};
    line-height: 1.2em;
    color: ${I.variables.contentColorActive};
    font-weight: ${I.variables.fontWeightBold};
    margin: 0 0 ${I.variables.spacingSmall} 0;
`,R=r.default.div`
    padding: ${I.variables.spacingXLarge};
`,z=r.default.div`
    padding: ${I.variables.spacingMedium};
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    ${(0,A.default)()}
`,B=r.default.div`
    display: flex;
    flex-direction: column;
    gap: ${I.variables.spacingXSmall};
`,U=r.default.div`
    padding: ${I.variables.spacingXLarge} 0 0 0;
`,F=r.default.main.attrs({id:"main"})`
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
`,j=r.default.div`
    padding: 0 ${I.variables.spacingXLarge} ${I.variables.spacingXLarge} ${I.variables.spacingXLarge};
    flex: 1;
    ${M.jg}

    [data-test='link'] {
        font-size: ${I.variables.fontSize};
    }
`,H=r.default.div`
    display: flex;
    align-items: center;
    justify-content: right;
    padding-right: 48px;
    flex: 1 1 auto;
    min-width: 0;

    & > svg {
        height: 210px;
    }
`,X=(0,r.default)(u())`
    margin: 0;

    & > [data-test='link'] {
        margin-left: ${I.variables.spacingLarge};
        font-size: ${I.variables.fontSize};
        font-weight: 400;
    }
`,K=(0,r.default)(u()).attrs({level:3})`
    margin: 0 0 0 ${I.variables.spacingMedium};
    color: ${I.variables.syntaxBlue};
`,q=r.default.div`
    display: flex;
`,V=r.default.div`
    margin-top: auto;
    ${(0,$.default)()}
`,W=(0,r.default)(h())`
    display: flex;
    flex-direction: row;
    min-height: 154px;
    flex: 1 1 400px;
    min-width: 0;
    padding: ${I.variables.spacingLarge};
    visibility: ${e=>e.$visibility||"visible"};
    ${e=>"hidden"===e.$visibility?"\n    @media screen and (max-width: 1080px) {\n        display: none;\n    }\n    ":""}
`,J=(0,r.default)(h())`
    grid-template-rows: auto auto auto 1fr auto;

    & > [data-test='image'] {
        height: 200px;
        flex: none;
        padding: 0;
        overflow: hidden;
        border-radius: 0;
    }

    & img {
        width: 100%;
    }

    & > [data-test='header'] {
        padding: 0 ${I.variables.spacingLarge};

        & div {
            white-space: pre-wrap;
        }
    }

    & > [data-test='body'] {
        overflow: hidden;
        padding: 0 ${I.variables.spacingLarge};
    }

    & [data-test='link'] {
        color: ${I.variables.contentColorActive};
    }

    & [data-test='try-feature'] {
        margin-left: ${I.variables.spacingLarge};
    }
`,Q=r.default.div`
    padding-left: ${I.variables.spacingMedium};
    display: flex;
    gap: ${I.variables.spacingSmall};
    min-height: ${L};
    align-self: flex-start;
`,Y=r.default.div`
    display: flex;
    align-items: center;
    gap: ${I.variables.spacingSmall};
    min-height: ${L};
`,Z=(0,r.default)(C.aF)`
    & [data-test='body'] {
        padding: 0;
    }
    & video,
    & iframe {
        width: 960px;
        display: block;
        border: none;
    }
`,ee=(0,r.default)(h())`
    width: 100%;
    overflow: hidden;
    & img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    /* Make the Card.Header title container grow so space-between can push icons to the right */
    & [data-test='header'] > div:first-child {
        flex: 1 1 auto;
    }

    & [data-test='header'] {
        align-self: start;
    }
`,te=(0,r.default)(ee)`
    visibility: hidden;
`,ae=(0,r.default)(g.Body)`
    width: 100%;
    height: 200px;
    objectfit: cover;
    overflow: hidden;
    padding: 0 !important; // Body provided by SUI has a padding on it we need to override.
`,ne=r.default.span`
    display: flex;
    justify-content: space-between;
    width: 100%;

    & > span:first-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
    }

    & svg {
        flex-shrink: 0;
        width: 1em;
        height: 1em;
    }
`,le=(0,r.default)(_())`
    margin-bottom: ${I.variables.spacingMedium};
`,re=(0,r.default)(k()).attrs({variant:"title2",as:"h2"})`
    font-size: ${I.variables.fontSizeXXLarge};
    color: ${I.variables.contentColorActive};
    margin-top: 0px;
`,ie=(0,r.default)(h())`
    display: flex;
    flex-direction: row;
    min-height: 260px;
    min-width: 400px;
    justify-content: space-between;
    padding: ${I.variables.spacingXLarge};
    margin-top: ${I.variables.spacingXLarge};

    @media (max-width: 1400px) {
        ${H} {
            display: none;
        }
    }

    @media (min-width: 1024px) {
        &:only-child {
            ${H} {
                display: flex;
            }
        }
    }
`,oe=(0,r.default)(k()).attrs({as:"span",variant:"body"})`
    display: block;
`,se=r.default.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${I.variables.spacingSmall};

    a,
    button {
        flex: 0 0 auto;
        margin: 0 !important;
    }
`,ce=(0,n.createContext)(void 0),de=ce.Provider,ue=()=>(0,n.useContext)(ce);var pe=a(65712),me=a(59421),ge=a.n(me);const he={DATA_MANAGEMENT:"splunk-data-management",INGEST_MONITORING:"splunk-ingest-monitoring",GUIDED_ONBOARDING:"guided_experience",DATA_INPUTS:"data_manager"},fe=Object.values(he);let ve=function(e){return e.IM="IngestMonitoring",e.DM="DM",e.SCS="SplunkCloud",e.SPLUNK="Splunk",e}({});const Ee=(e,t=ve.SCS)=>(0,pe.T)({product:t,version:"latest"},e),be=(0,n.memo)(({location:e,product:t,children:a,className:l,style:r,appearance:i,onClick:o})=>n.createElement(ge(),{openInNewContext:!0,to:Ee(e,t),className:l,style:r,appearance:i,onClick:o},a)),ye=(0,n.memo)(({location:e,product:t,children:a,label:l,appearance:r,className:i,style:o,onClick:s})=>n.createElement(S(),{openInNewContext:!0,to:Ee(e,t),label:l,appearance:r,className:i,style:o,onClick:s},a)),Se=n.lazy(()=>a.e(48).then(a.bind(a,88048))),we=n.lazy(()=>a.e(826).then(a.bind(a,20826))),ke=n.lazy(()=>a.e(492).then(a.bind(a,51492))),xe=n.lazy(()=>a.e(630).then(a.bind(a,42630))),Ie=()=>{const{colorScheme:e}=(0,I.useSplunkTheme)();return"light"===e?n.createElement(ke,null):n.createElement(xe,null)},Ce=()=>{const{colorScheme:e}=(0,I.useSplunkTheme)();return"light"===e?n.createElement(Se,null):n.createElement(we,null)},Me=({testId:e,title:t,description:a,children:r,isNew:i=!1,illustration:o})=>n.createElement(ie,{"data-test":e},n.createElement(z,null,n.createElement(q,null,n.createElement(re,null,t),i&&n.createElement(K,null,l.t`New!`)),n.createElement(k(),{as:"p",variant:"body"},a),n.createElement(V,null,r)),!!o&&n.createElement(H,null,o)),De=({hasSCS:e,scsUrl:t})=>{const a=ue(),r=n.createElement(S(),{openInNewContext:!0,label:l.t`Data Management processing`,appearance:"primary",to:t,disabled:!t,onClick:()=>a?.track("dm.home.getting_started.ec.click")}),i=n.createElement(ye,{label:l.t`Request Data Management processing`,appearance:"primary",location:"dm_home.request_dm_processing",product:ve.SCS,onClick:()=>a?.track("dm.home.getting_started.ec.signup")}),o=e?r:i;return n.createElement(Me,{testId:"getting-started-dm-on-scs",title:l.t`Data Management on Splunk Cloud Platform`,description:l.t`Maximize data value by using SPL2 pipelines to process and route data before indexing, reducing storage overhead. Combine with federation to search and manage data efficiently across any location.`,illustration:n.createElement(Ce,null)},n.createElement(ye,{label:l.t`Data Management documentation`,appearance:"secondary",location:"dm_home.dm_docs",product:ve.SCS,onClick:()=>a?.track("dm.home.getting_started.ec.docs")}),o)},_e=()=>{const e=ue();return n.createElement(Me,{testId:"getting-started-ep-on-cmp",title:l.t`Edge Processor on Splunk Enterprise`,description:l.t`Get started with processing your data on the edge using pipelines on Splunk Enterprise. Select the button below to navigate to Edge Processor on Splunk Enterprise or view Edge Processor documentation.`,illustration:n.createElement(Ie,null)},n.createElement(ye,{label:l.t`Edge Processor documentation`,appearance:"secondary",location:"dm_home.EPAbout",product:ve.SPLUNK,onClick:()=>e?.track("dm.home.getting_started.cmp.docs")}),n.createElement(S(),{label:l.t`Edge Processor on Splunk Enterprise`,appearance:"primary",to:(0,x.createURL)("app/splunk_pipeline_builders/edge-processors"),onClick:()=>e?.track("dm.home.getting_started.cmp.click")}))};var $e=a(68296),Ae=a(8610),Le=a(57914),Ne=a.n(Le),Te=a(40881),Oe=a.n(Te),Pe=a(55297),Ge=a.n(Pe);const Re=()=>n.createElement(Oe(),null),ze=()=>n.createElement(Ge(),null),Be=({children:e})=>n.createElement(W,{"data-test":"get-started-documentation"},n.createElement(T,null,n.createElement(Re,null)),n.createElement(P,null,n.createElement(B,null,e))),Ue=({children:e})=>n.createElement(W,{"data-test":"feedback"},n.createElement(T,null,n.createElement(ze,null)),n.createElement(P,null,n.createElement(G,null,l.t`Send us some feedback!`),n.createElement(le,null,l.t`Do you have a suggestion? Did you find a bug? Let us
            know!`),n.createElement(se,null,e))),Fe=r.default.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`,je=()=>n.createElement(Fe,null,n.createElement(X,{level:2},l.t`Education center`)),He=()=>n.createElement(Fe,null,n.createElement(X,{level:2},l.t`What's new`)),Xe=()=>n.createElement(X,{level:2},l.t`Resources and feedback`);var Ke=a(59773),qe=a.n(Ke),Ve=a(41574),We=a.n(Ve),Je=a(30242),Qe=a.n(Je),Ye=a(28546),Ze=a.n(Ye),et=a(75602);const tt=(e,t=!1)=>{const{colorScheme:a}=(0,I.useSplunkTheme)();return(0,n.useMemo)(()=>{const n=`app/splunk-data-management/${e}${t?"-poster-"+("dark"===a?"dark":"light"):"-poster"}.webp`;return et.locale?(0,x.createStaticURL)(n):`/static/${n}`},[e,t,a])},at=e=>({[he.DATA_MANAGEMENT]:l.t`Data Management`,[he.INGEST_MONITORING]:l.t`Ingest Monitoring`,[he.GUIDED_ONBOARDING]:l.t`Guided Onboarding`,[he.DATA_INPUTS]:l.t`Data Inputs`}[e]),nt=[{sourceId:"Community-Onboarding-Data-with-Guided-Onboarding-and-Auto-Schema",type:"community",title:l.t`Learn how to Onboard data with Guided Onboarding and Auto-schema`,link:{location:"go_as_release",product:ve.SCS},app:he.GUIDED_ONBOARDING},{sourceId:"Splunk-Data-Management-Overview",duration:"1:37",title:l.t`Splunk Data Management Overview`,description:l.t`Learn how Splunk's new Data Management experience and Pipeline Builders (Edge Processor and Ingest Processor) allow you to increase visibility, reduce costs, and gain full control over your growing data volumes.`,videoLink:{link:"8X8nQRcnK8s?si=2jGodbLdhz6smv7r",platform:"youtube"}},{sourceId:"Splunk-Data-Management-and-Federation-outcomes",duration:"1:27",title:l.t`Splunk Data Management and Federation outcomes`,description:l.t`IT environments are more complex than ever, with data scattered across multiple sources. Splunk's data management and federation capabilities provide efficient, cost-effective ways to control, shape, and access data in real-time. Ensure visibility, security, and compliance while optimizing costs. Manage your data at scale and access it wherever it resides with Splunk's flexible tools.`,videoLink:{link:"Key5vJXLsEoxp5pY1eJ8QW",platform:"vidyard"}},{sourceId:"Splunk-Data-Management-Navattic",type:"navattic",title:l.t`Splunk Data Management: Key Benefits`,link:"https://cisco-full-stack-observability.navattic.com/DMXdemo?g=cmmh2skkg000004l846vn8f35&s=0"},{sourceId:"Lantern-Article-Building-a-Data-Management-Strategy",type:"lantern",title:l.t`Building a Data Management Strategy`,link:"https://lantern.splunk.com/Platform_Data_Management/Optimize_Data/Building_a_data_management_strategy"}],lt=e=>nt.filter(({app:t})=>!t||!0===e[t]),rt=Array.from({length:4},(e,t)=>`hidden-card-${t}`),it=({items:e,renderCard:t,hiddenCardTestId:a,showAll:l=!0,searchStr:r,children:i})=>{const o=e.filter(e=>!r||e.title.toLocaleLowerCase().includes(r.toLocaleLowerCase())),s=l?o:o.slice(0,4),c=Math.max(0,4-s.length);return n.createElement(N,null,s.map(e=>n.createElement(n.Fragment,{key:e.sourceId},t(e))),rt.slice(0,c).map(e=>n.createElement(te,{key:e,"data-test":a})),i)},ot=({title:e,icon:t})=>n.createElement(Ze(),{content:e,contentRelationship:"label",renderAnchor:({onFocus:a,onBlur:l,elementRef:r,"aria-describedby":i})=>n.createElement("span",{onFocus:a,onBlur:l,ref:r,"aria-describedby":i,style:t?{display:"block"}:void 0},t?n.createElement(ne,null,n.createElement("span",null,e),t):e)}),st=({app:e,children:t})=>n.createElement(Y,{"data-test":"app-badges"},t,e&&n.createElement(Qe(),{label:at(e)})),ct=({handleCloseVideo:e,selectedVideo:t})=>{const a=n.createElement(oe,null,t.description);return n.createElement(Z,{id:`video-modal-${t.sourceId}`,className:"video-modal",open:!!t,closeOnClickAway:!0,size:"l",returnFocus:()=>!0,onRequestClose:e,title:t.title,subtitle:a},n.createElement(n.Suspense,{fallback:n.createElement(b,null)},(l=t,"youtube"===l.videoLink?.platform?n.createElement("iframe",{width:"960",height:"540",src:`https://www.youtube.com/embed/${l.videoLink.link}`,title:`${l.title}`,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",referrerPolicy:"strict-origin-when-cross-origin",allowFullScreen:!0,"data-test":"video"}):n.createElement("iframe",{width:"960",height:"540",src:`https://play.vidyard.com/${l.videoLink.link}.html?`,title:`${l.title}`,allowFullScreen:!0,"data-test":"video"}))));var l},dt=({video:e,handleOpen:t})=>{const a=ue(),l=(0,n.useCallback)(()=>{a?.track("dm.home.education_center.video.open",{sourceId:e.sourceId}),t(e)},[t,a,e]),r=tt(e.sourceId);return n.createElement(ee,{onClick:l,"data-test":"training-video-card",className:$e.HN},n.createElement(ae,null,n.createElement("img",{"data-test":"training-video-poster",src:r,alt:e.title})),n.createElement(ee.Header,{title:n.createElement(ot,{title:e.title,icon:n.createElement(We(),null)}),subtitle:n.createElement(st,{app:e.app},e.duration)}))},ut=({sourceId:e,title:t,link:a,app:l})=>{const r=ue(),i=(0,n.useCallback)(()=>{r?.track("dm.home.education_center.external_source.open",{sourceId:e})},[e,r]),o=tt(e),s=(0,n.useMemo)(()=>"string"==typeof a?a:Ee(a.location,a.product),[a]);return n.createElement(ee,{onClick:i,to:s,openInNewContext:!0,"data-test":"external-source-card",className:$e.HN},n.createElement(ae,null,n.createElement("img",{"data-test":"external-source-poster",src:o,alt:t})),n.createElement(ee.Header,{title:n.createElement(ot,{title:t,icon:n.createElement(qe(),null)}),subtitle:n.createElement(st,{app:l})}))},pt=({installedApps:e,showAll:t=!0,searchStr:a})=>{const[l,r]=(0,n.useState)(null),i=(0,n.useCallback)(()=>{r(null)},[]);return n.createElement(it,{items:lt(e),showAll:t,searchStr:a,hiddenCardTestId:"hidden-education-card",renderCard:e=>(e=>"videoLink"in e)(e)?n.createElement(dt,{video:e,handleOpen:r}):n.createElement(ut,{sourceId:e.sourceId,type:e.type,title:e.title,link:e.link,app:e.app})},l&&n.createElement(ct,{handleCloseVideo:i,selectedVideo:l}))},mt=n.createElement(k(),{as:"code",variant:"monoBody",key:"federated-prefix"},"~.federated."),gt=[{sourceId:"Self-Healing-Pipelines",title:l.t`Self-healing data management pipelines`,releaseDateISO:"2026-07-30",description:l.t`Introduced the self-healing data management feature. The self-healing pipeline feature can detect Common Information Model (CIM) mapping issues, performs root-cause analysis, and suggests remediation steps.`,learnMoreLink:{location:"IngestMonitoring.ingestmonitoring.releasenotes",product:ve.IM},app:he.INGEST_MONITORING},{sourceId:"Send-Data-to-Federated-Destinations-in-MDL",title:l.t`Send data to federated destinations in Machine Data Lake (MDL)`,releaseDateISO:"2026-07-30",description:l.jt`Send data to a standard Splunk index or an MDL dataset. To use MDL, manually enter a federated destination with the ${mt} prefix. The value is validated before saving.`,learnMoreLink:{location:"learnmore.dm_release_notes",product:ve.DM},app:he.DATA_INPUTS},{sourceId:"Connect-to-Azure-Event-Hub",title:l.t`Connect to Azure Event Hub using managed identity`,releaseDateISO:"2026-07-30",description:l.t`Azure ARM template v4.7 gives the Azure Function a system-assigned managed identity and grants Event Hub permissions, so no shared-access key is required.`,learnMoreLink:{location:"learnmore.dm_release_notes",product:ve.DM},app:he.DATA_INPUTS},{sourceId:"Release-Onboard-Data-with-Guided-Onboarding-and-Auto-Schema",title:l.t`Onboard data with Guided Onboarding and Auto-schema`,releaseDateISO:"2026-07-30",description:l.t`Use Guided Onboarding to plan how to bring your data into Splunk. With Auto-schema, you can create a schema from representative custom data.`,learnMoreLink:{location:"learnmore.go_as_introduction",product:ve.SCS},app:he.GUIDED_ONBOARDING}],ht=(e,t)=>t.releaseDateISO.localeCompare(e.releaseDateISO),ft=e=>gt.filter(({app:t})=>!0===e[t]).sort(ht),vt=({title:e})=>n.createElement(Ze(),{content:e,contentRelationship:"label",renderAnchor:({onFocus:t,onBlur:a,elementRef:l,"aria-describedby":r})=>n.createElement("span",{onFocus:t,onBlur:a,ref:l,"aria-describedby":r},e)}),Et=e=>new Intl.DateTimeFormat(et.locale,{dateStyle:"long",timeZone:"UTC"}).format(new Date(e)),bt=({sourceId:e,title:t,releaseDateISO:a,description:r,learnMoreLink:i,app:o})=>{const s=ue(),c=(0,n.useCallback)(()=>{s?.track("dm.home.whats_new.card.learn_more.click",{sourceId:e})},[e,s]),d=tt(e,!0);return n.createElement(J,{"data-test":"whats-new-card",className:$e.HN},n.createElement(J.Body,{"data-test":"image"},n.createElement("img",{"data-test":"whats-new-poster",src:d,alt:t})),n.createElement(J.Header,{title:n.createElement(vt,{title:t}),subtitle:Et(a)}),n.createElement(Q,{"data-test":"app-badges"},n.createElement(Qe(),{label:at(o)})),n.createElement(J.Body,null,r),n.createElement(J.Footer,null,i&&n.createElement(be,{location:i.location,product:i.product,onClick:c},l.t`Learn more`)))},yt=({installedApps:e,showAll:t=!0,searchStr:a})=>n.createElement(it,{items:ft(e),showAll:t,searchStr:a,hiddenCardTestId:"hidden-whats-new-card",renderCard:e=>n.createElement(bt,{sourceId:e.sourceId,title:e.title,releaseDateISO:e.releaseDateISO,description:e.description,learnMoreLink:e.learnMoreLink,app:e.app})}),St=()=>{const e=ue();return n.createElement(be,{appearance:"standalone",location:"dm_home.adoption_hub",product:ve.SCS,onClick:()=>e?.track("dm.home.resources.adoption_hub.click")},l.t`Splunk Data Management Adoption Hub`)},wt=()=>{const e=ue();return n.createElement(be,{appearance:"standalone",location:"dm_home.get_started",product:ve.SCS,onClick:()=>e?.track("dm.home.resources.explore_data_management.click")},l.t`Explore Data Management Solutions`)},kt=()=>{const e=ue();return n.createElement(be,{appearance:"standalone",location:"dm_home.dm_lantern",product:ve.SCS,onClick:()=>e?.track("dm.home.resources.pipeline_builders_link.click")},l.t`Getting started with Splunk Data Management Pipeline Builders`)},xt=()=>n.createElement(S(),{openInNewContext:!0,to:"https://ideas.splunk.com/ideas/new?project_id=6789809480962944345","data-test":"send-feedback-btn"},l.t`Send feedback`),It=()=>n.createElement(Ne(),{appearance:"fill",type:"error"},n.createElement(Ne().Title,null,l.t`Configuration unavailable`),l.t`The page content shown may not reflect your actual configuration.`),Ct=({gettingStartedTile:e,installedApps:t,error:a})=>n.createElement(F,null,n.createElement(R,{"data-test":"header"},n.createElement(Ae.s,null,l.t`Data Management`)),n.createElement(j,{className:$e.HN},a&&n.createElement(It,null),e,ft(t).length>0&&n.createElement(U,{"data-test":"whats-new-section"},n.createElement(He,null),n.createElement(yt,{installedApps:t,showAll:!1})),n.createElement(U,null,n.createElement(je,null),n.createElement(pt,{installedApps:t,showAll:!1})),n.createElement(U,null,n.createElement(Xe,null),n.createElement(O,null,n.createElement(Be,null,n.createElement(St,null),n.createElement(wt,null),n.createElement(kt,null)),n.createElement(Ue,null,n.createElement(xt,null)))))),Mt=({installedApps:e,error:t})=>n.createElement(Ct,{error:t,installedApps:e,gettingStartedTile:n.createElement(_e,null)}),Dt=({hasSCS:e,scsUrl:t,installedApps:a,error:l})=>n.createElement(Ct,{error:l,installedApps:a,gettingStartedTile:n.createElement(De,{hasSCS:e,scsUrl:t})});var _t=a(45899);const $t=()=>{const[e,t]=(0,n.useState)(null),[a,l]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{(0,_t.getServerInfo)().then(e=>{if(!e)return l(!0),void t(!0);t("cloud"!==e.instance_type)}).catch(()=>{l(!0),t(!0)})},[]),{isCMP:e,error:a}};var At=a(17197),Lt=a(46657);const Nt=({children:e})=>{const{isCMP:t}=$t(),[a,l]=(0,n.useState)("");(0,n.useEffect)(()=>{!1===t&&(0,_t.getTenantInfo)().then(e=>l(e?.tenant??"")).catch(()=>{})},[t]);const r=(0,n.useMemo)(()=>{if(null===t)return;const e="true"===window.localStorage.getItem("dmx_dev_enable")?"play":"prod",a=t?"cmp":"ec",n=(0,At.createTelemetry)(),l=(0,Lt.createSplunkOtelPlugin)({appType:a,appName:et.app,environment:e,shouldRemovePII:"prod"===e,shouldDisableAutocapture:!0});return n.addPlugin(l),n},[t]);return(0,n.useEffect)(()=>{r&&r.identify({tenant:a,user:et.username})},[r,a]),n.createElement(de,{value:r},e)},Tt=(e,t)=>`https://${e}/${t}/data-management?${new URLSearchParams({navigatingFrom:"EC",appName:et.app})}`,Ot=()=>{const[e,t]=(0,n.useState)("");return(0,n.useEffect)(()=>{(async(e=window.location.hostname)=>{const t=await(0,_t.getTenantInfo)(),{legacyAppHostname:a,tenant:n}=t??{};return a&&n?Tt(a.replace("app","px"),n):(e=>{const t=e.split(".")[0],a=e.includes(".stg.");return Tt(a?"px.staging.scs.splunk.com":"px.scs.splunk.com",t)})(e)})().then(t)},[]),e};var Pt=a(37446);let Gt;const Rt=()=>{const[e,t]=(0,n.useState)(null);return(0,n.useEffect)(()=>{let e=!1;return(e=>{if(!Gt||e){const e=(async()=>{const e=(0,x.createRESTURL)(`apps/local?${new URLSearchParams({output_mode:"json",count:"0",f:"name",search:"disabled=0"})}`),t=await fetch(e,(0,Pt.getDefaultFetchInit)()),{entry:a=[]}=await(0,_t.jsonFromResponse)("GET",e)(t);return new Set(a.map(({name:e})=>e))})().catch(t=>{throw Gt===e&&(Gt=void 0),t});Gt=e}return Gt})().then(a=>{e||t(a)}).catch(()=>{e||t(new Set)}),()=>{e=!0}},[]),(0,n.useMemo)(()=>fe.reduce((t,a)=>({...t,[a]:e?e.has(a):null}),{}),[e])},zt=n.createElement(b,{text:l.t`Loading Data Management page`}),Bt=({installedApps:e})=>{const{hasSCS:t,error:a}=(()=>{const[e,t]=(0,n.useState)(null),[a,l]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{Promise.all([(0,_t.getServerInfo)(),(0,_t.getTenantInfo)()]).then(([e,a])=>{if(!e||!a)return l(!0),void t(!1);t(!!e.isConverged&&!!a.tenant)}).catch(()=>{l(!0),t(!1)})},[]),{hasSCS:e,error:a}})(),l=Ot();return null===t?zt:n.createElement(Dt,{hasSCS:t,scsUrl:l,installedApps:e,error:a})},Ut=()=>{const{isCMP:e,error:t}=$t(),a=Rt(),l=(0,n.useMemo)(()=>{return null===e||(l=a,fe.some(e=>null===l[e]))?zt:e||t?n.createElement(Mt,{installedApps:a,error:t}):n.createElement(Bt,{installedApps:a});var l},[t,e,a]);return n.createElement(Nt,null,n.createElement(c,{selected:"dmx_home"},l))}}}]);