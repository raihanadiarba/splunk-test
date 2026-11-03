/*! For license information please see 15.15.0ac9ee94ae34957a1428.js.LICENSE.txt */
"use strict";(self.webpackChunksplunk_data_management=self.webpackChunksplunk_data_management||[]).push([[15],{3015(e,a,t){t.r(a),t.d(a,{default:()=>re});var i=t(96540),n=t(47681),l=t(53209),r=t(75869),d=t(21268),s=t(78967),o=t(23893),c=t(68296),p=t(59773),u=t.n(p),g=t(41574),m=t.n(g),f=t(30242),h=t.n(f),v=t(28546),b=t.n(v),y=t(70363);var w=t(44169),x=t(75602),$=t(69211),k=t(37726);const E=(e,a=!1)=>{const{colorScheme:t}=(0,s.useSplunkTheme)();return(0,i.useMemo)(()=>{const i=a?"-poster-"+("dark"===t?"dark":"light"):"-poster",n=`app/${k.C3}/${e}${i}.webp`;return x.locale?(0,$.createStaticURL)(n):`/static/${n}`},[e,a,t])},S=e=>({[k.Z5.DATA_MANAGEMENT]:l.t`Data Management`,[k.Z5.INGEST_MONITORING]:l.t`Ingest Monitoring`,[k.Z5.GUIDED_ONBOARDING]:l.t`Guided Onboarding`,[k.Z5.DATA_INPUTS]:l.t`Data Inputs`}[e]),L=[{sourceId:"Community-Onboarding-Data-with-Guided-Onboarding-and-Auto-Schema",type:"community",title:l.t`Learn how to Onboard data with Guided Onboarding and Auto-schema`,link:{location:"go_as_release",product:k.OI.SCS},app:k.Z5.GUIDED_ONBOARDING},{sourceId:"Splunk-Data-Management-Overview",duration:"1:37",title:l.t`Splunk Data Management Overview`,description:l.t`Learn how Splunk's new Data Management experience and Pipeline Builders (Edge Processor and Ingest Processor) allow you to increase visibility, reduce costs, and gain full control over your growing data volumes.`,videoLink:{link:"8X8nQRcnK8s?si=2jGodbLdhz6smv7r",platform:"youtube"}},{sourceId:"Splunk-Data-Management-and-Federation-outcomes",duration:"1:27",title:l.t`Splunk Data Management and Federation outcomes`,description:l.t`IT environments are more complex than ever, with data scattered across multiple sources. Splunk's data management and federation capabilities provide efficient, cost-effective ways to control, shape, and access data in real-time. Ensure visibility, security, and compliance while optimizing costs. Manage your data at scale and access it wherever it resides with Splunk's flexible tools.`,videoLink:{link:"Key5vJXLsEoxp5pY1eJ8QW",platform:"vidyard"}},{sourceId:"Splunk-Data-Management-Navattic",type:"navattic",title:l.t`Splunk Data Management: Key Benefits`,link:"https://cisco-full-stack-observability.navattic.com/DMXdemo?g=cmmh2skkg000004l846vn8f35&s=0"},{sourceId:"Lantern-Article-Building-a-Data-Management-Strategy",type:"lantern",title:l.t`Building a Data Management Strategy`,link:"https://lantern.splunk.com/Platform_Data_Management/Optimize_Data/Building_a_data_management_strategy"}],I=e=>L.filter(({app:a})=>!a||!0===e[a]);var C=t(65798),M=t(15759),A=t.n(M),D=t(39643),_=t.n(D),O=t(56143),N=t.n(O),B=t(63616),X=t.n(B),z=t(25094),G=t(48881);const T="26px",j=n.default.div`
    display: grid;
    grid-gap: ${s.variables.spacingLarge};
    grid-template-columns: repeat(auto-fit, minmax(min(${"340px"}, 100%), 1fr));
    max-width: calc(
        ${4} * ${"480px"} + 2 * ${s.variables.spacingLarge}
    );
    margin-top: ${s.variables.spacingMedium};
`,F=(n.default.div`
    flex: 0 0 auto;
    background-color: ${s.variables.interactiveColorOverlaySelected};
    color: ${s.variables.contentColorMuted};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    width: 76px;
    height: 76px;
    margin-right: ${s.variables.spacingLarge};

    & > svg {
        width: 30px;
        height: 30px;
    }
`,n.default.div`
    display: flex;
    gap: ${s.variables.spacingLarge};
    flex-wrap: wrap;
    margin-top: ${s.variables.spacingMedium};
`,n.default.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-start;
    padding-top: 20px;
`,n.default.p`
    font-size: ${s.variables.fontSize};
    line-height: 1.2em;
    color: ${s.variables.contentColorActive};
    font-weight: ${s.variables.fontWeightBold};
    margin: 0 0 ${s.variables.spacingSmall} 0;
`,n.default.div`
    padding: ${s.variables.spacingXLarge};
`,n.default.div`
    padding: ${s.variables.spacingMedium};
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    ${(0,G.default)()}
`,n.default.div`
    display: flex;
    flex-direction: column;
    gap: ${s.variables.spacingXSmall};
`,n.default.div`
    padding: ${s.variables.spacingXLarge} 0 0 0;
`,n.default.main.attrs({id:"main"})`
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
`,n.default.div`
    padding: 0 ${s.variables.spacingXLarge} ${s.variables.spacingXLarge} ${s.variables.spacingXLarge};
    flex: 1;
    ${d.jg}

    [data-test='link'] {
        font-size: ${s.variables.fontSize};
    }
`,n.default.div`
    display: flex;
    align-items: center;
    justify-content: right;
    padding-right: 48px;
    flex: 1 1 auto;
    min-width: 0;

    & > svg {
        height: 210px;
    }
`),R=((0,n.default)(_())`
    margin: 0;

    & > [data-test='link'] {
        margin-left: ${s.variables.spacingLarge};
        font-size: ${s.variables.fontSize};
        font-weight: 400;
    }
`,(0,n.default)(_()).attrs({level:3})`
    margin: 0 0 0 ${s.variables.spacingMedium};
    color: ${s.variables.syntaxBlue};
`,n.default.div`
    display: flex;
`,n.default.div`
    margin-top: auto;
    ${(0,z.default)()}
`,(0,n.default)(A())`
    display: flex;
    flex-direction: row;
    min-height: 154px;
    flex: 1 1 400px;
    min-width: 0;
    padding: ${s.variables.spacingLarge};
    visibility: ${e=>e.$visibility||"visible"};
    ${e=>"hidden"===e.$visibility?"\n    @media screen and (max-width: 1080px) {\n        display: none;\n    }\n    ":""}
`,(0,n.default)(A())`
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
        padding: 0 ${s.variables.spacingLarge};

        & div {
            white-space: pre-wrap;
        }
    }

    & > [data-test='body'] {
        overflow: hidden;
        padding: 0 ${s.variables.spacingLarge};
    }

    & [data-test='link'] {
        color: ${s.variables.contentColorActive};
    }

    & [data-test='try-feature'] {
        margin-left: ${s.variables.spacingLarge};
    }
`,n.default.div`
    padding-left: ${s.variables.spacingMedium};
    display: flex;
    gap: ${s.variables.spacingSmall};
    min-height: ${T};
    align-self: flex-start;
`,n.default.div`
    display: flex;
    align-items: center;
    gap: ${s.variables.spacingSmall};
    min-height: ${T};
`),P=(0,n.default)(C.aF)`
    & [data-test='body'] {
        padding: 0;
    }
    & video,
    & iframe {
        width: 960px;
        display: block;
        border: none;
    }
`,Z=(0,n.default)(A())`
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
`,H=(0,n.default)(Z)`
    visibility: hidden;
`,U=(0,n.default)(M.Body)`
    width: 100%;
    height: 200px;
    objectfit: cover;
    overflow: hidden;
    padding: 0 !important; // Body provided by SUI has a padding on it we need to override.
`,J=n.default.span`
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
`,V=((0,n.default)(N())`
    margin-bottom: ${s.variables.spacingMedium};
`,(0,n.default)(X()).attrs({variant:"title2",as:"h2"})`
    font-size: ${s.variables.fontSizeXXLarge};
    color: ${s.variables.contentColorActive};
    margin-top: 0px;
`,(0,n.default)(A())`
    display: flex;
    flex-direction: row;
    min-height: 260px;
    min-width: 400px;
    justify-content: space-between;
    padding: ${s.variables.spacingXLarge};
    margin-top: ${s.variables.spacingXLarge};

    @media (max-width: 1400px) {
        ${F} {
            display: none;
        }
    }

    @media (min-width: 1024px) {
        &:only-child {
            ${F} {
                display: flex;
            }
        }
    }
`,(0,n.default)(X()).attrs({as:"span",variant:"body"})`
    display: block;
`),K=(n.default.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${s.variables.spacingSmall};

    a,
    button {
        flex: 0 0 auto;
        margin: 0 !important;
    }
`,Array.from({length:4},(e,a)=>`hidden-card-${a}`)),Q=({items:e,renderCard:a,hiddenCardTestId:t,showAll:n=!0,searchStr:l,children:r})=>{const d=e.filter(e=>!l||e.title.toLocaleLowerCase().includes(l.toLocaleLowerCase())),s=n?d:d.slice(0,4),o=Math.max(0,4-s.length);return i.createElement(j,null,s.map(e=>i.createElement(i.Fragment,{key:e.sourceId},a(e))),K.slice(0,o).map(e=>i.createElement(H,{key:e,"data-test":t})),r)};var W=t(65712);t(70181),t(59421);const q=({title:e,icon:a})=>i.createElement(b(),{content:e,contentRelationship:"label",renderAnchor:({onFocus:t,onBlur:n,elementRef:l,"aria-describedby":r})=>i.createElement("span",{onFocus:t,onBlur:n,ref:l,"aria-describedby":r,style:a?{display:"block"}:void 0},a?i.createElement(J,null,i.createElement("span",null,e),a):e)}),Y=({app:e,children:a})=>i.createElement(R,{"data-test":"app-badges"},a,e&&i.createElement(h(),{label:S(e)})),ee=({handleCloseVideo:e,selectedVideo:a})=>{const t=i.createElement(V,null,a.description);return i.createElement(P,{id:`video-modal-${a.sourceId}`,className:"video-modal",open:!!a,closeOnClickAway:!0,size:"l",returnFocus:()=>!0,onRequestClose:e,title:a.title,subtitle:t},i.createElement(i.Suspense,{fallback:i.createElement(y.k,null)},(n=a,"youtube"===n.videoLink?.platform?i.createElement("iframe",{width:"960",height:"540",src:`https://www.youtube.com/embed/${n.videoLink.link}`,title:`${n.title}`,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",referrerPolicy:"strict-origin-when-cross-origin",allowFullScreen:!0,"data-test":"video"}):i.createElement("iframe",{width:"960",height:"540",src:`https://play.vidyard.com/${n.videoLink.link}.html?`,title:`${n.title}`,allowFullScreen:!0,"data-test":"video"}))));var n},ae=({video:e,handleOpen:a})=>{const t=(0,w.Jr)(),n=(0,i.useCallback)(()=>{t?.track("dm.home.education_center.video.open",{sourceId:e.sourceId}),a(e)},[a,t,e]),l=E(e.sourceId);return i.createElement(Z,{onClick:n,"data-test":"training-video-card",className:c.HN},i.createElement(U,null,i.createElement("img",{"data-test":"training-video-poster",src:l,alt:e.title})),i.createElement(Z.Header,{title:i.createElement(q,{title:e.title,icon:i.createElement(m(),null)}),subtitle:i.createElement(Y,{app:e.app},e.duration)}))},te=({sourceId:e,title:a,link:t,app:n})=>{const l=(0,w.Jr)(),r=(0,i.useCallback)(()=>{l?.track("dm.home.education_center.external_source.open",{sourceId:e})},[e,l]),d=E(e),s=(0,i.useMemo)(()=>"string"==typeof t?t:((e,a=k.OI.SCS)=>(0,W.T)({product:a,version:"latest"},e))(t.location,t.product),[t]);return i.createElement(Z,{onClick:r,to:s,openInNewContext:!0,"data-test":"external-source-card",className:c.HN},i.createElement(U,null,i.createElement("img",{"data-test":"external-source-poster",src:d,alt:a})),i.createElement(Z.Header,{title:i.createElement(q,{title:a,icon:i.createElement(u(),null)}),subtitle:i.createElement(Y,{app:n})}))},ie=({installedApps:e,showAll:a=!0,searchStr:t})=>{const[n,l]=(0,i.useState)(null),r=(0,i.useCallback)(()=>{l(null)},[]);return i.createElement(Q,{items:I(e),showAll:a,searchStr:t,hiddenCardTestId:"hidden-education-card",renderCard:e=>(e=>"videoLink"in e)(e)?i.createElement(ae,{video:e,handleOpen:l}):i.createElement(te,{sourceId:e.sourceId,type:e.type,title:e.title,link:e.link,app:e.app})},n&&i.createElement(ee,{handleCloseVideo:r,selectedVideo:n}))},ne=n.default.div`
    padding-left: ${s.variables.spacingLarge};
`,le=n.default.div`
    padding: 0 ${s.variables.spacingLarge} ${s.variables.spacingLarge} ${s.variables.spacingLarge};
    flex: 1 1 auto;
    min-height: 0;
    ${d.jg};
`,re=({installedApps:e})=>{const[a,t]=(0,i.useState)(""),n=(0,i.useCallback)((e,{value:a})=>{t(a)},[]);return i.createElement(r.gZ,{"data-test":"education-center"},i.createElement(ne,null,i.createElement(o.A,{onSearchChange:n,searchStr:a,title:l.t`Education center`})),i.createElement(le,null,i.createElement(ie,{installedApps:e,searchStr:a})))}}}]);