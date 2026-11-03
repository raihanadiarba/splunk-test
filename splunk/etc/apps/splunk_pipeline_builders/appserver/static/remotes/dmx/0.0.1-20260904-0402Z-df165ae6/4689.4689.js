/*! For license information please see 4689.4689.js.LICENSE.txt */
"use strict";(self.webpackChunkdmx=self.webpackChunkdmx||[]).push([[4689],{75869(e,a,t){var n=t(26250),i=t.n(n),r=t(78967);const o=i().main.attrs({id:"main"})`
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
`,l=(i().main.attrs({id:"main"})`
    display: flex;
    flex-direction: column;
    margin: ${r.variables.spacingLarge};
    & > .maintenance-message-container {
        margin: -${r.variables.spacingLarge} -${r.variables.spacingLarge} 0;
    }
`,i().div`
    display: flex;
    flex: 1 0 0;
    min-height: 0;
`),s=i().div`
    flex: 1;
    justify-content: center;
    align-items: center;
`;t.d(a,["YA",0,s,"gZ",0,o,"j0",0,l])},44353(e,a,t){t.d(a,{AG:()=>B,c5:()=>W,ZB:()=>Y,CW:()=>X,u4:()=>de,hD:()=>I,Jb:()=>U,Z$:()=>D,db:()=>se,Zd:()=>F,LB:()=>R,H9:()=>q,YW:()=>T,u:()=>V,Ug:()=>te,R7:()=>ce,Eb:()=>le,ee:()=>J,LW:()=>A,ug:()=>pe,A1:()=>Z,hn:()=>ee,Gw:()=>G,cx:()=>ne,Vf:()=>_,Hw:()=>ae,P7:()=>oe,se:()=>Q,b:()=>K,hE:()=>ie,kc:()=>re});var n=t(26250),i=t.n(n),r=t(85959),o=t.n(r),l=t(64200),s=t.n(l),d=t(24379),c=t.n(d),p=t(78967),g=t(31444),m=t(68296),u=function(e,a){var t={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&a.indexOf(n)<0&&(t[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)a.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(t[n[i]]=e[n[i]])}return t};const v=i()(s().Body)`
    position: relative;
    ${e=>e.applying?"overflow: hidden":""};
`,f=i().div`
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(${p.variables.spacingXSmall});
    aria-busy: true;
`,h=i()(g.K)`
    margin-bottom: ${p.variables.spacingSmall};
`,b=e=>{var{error:a,applying:t,children:n}=e,i=u(e,["error","applying","children"]);return o().createElement(v,Object.assign({},i),a&&o().createElement(h,{error:a}),n,t&&o().createElement(f,null,o().createElement(c(),{size:"large"})))},y=(i().div`
    flex: 0 0 auto;
    display: flex;
    gap: ${p.variables.spacingMedium};
    margin-left: auto;
    & > button {
        min-width: 80px;
    }
`,i()(s().Footer)`
    display: flex;
    align-items: center;
`,{s:"480px",m:"640px",l:"960px",xl:"1440px"}),x=i()(s())`
    width: ${({size:e})=>e?y[e]:y.m};
`;var w=t(46813),$=t(15759),k=t.n($),E=t(39643),L=t.n(E),S=t(59421),M=t.n(S),C=t(56143),j=t.n(C),O=t(63616),z=t.n(O),N=t(25094),P=t(48881),H=t(72218);const A=i().div`
    display: grid;
    grid-gap: ${p.variables.spacingLarge};
    grid-template-columns: repeat(
        auto-fit,
        minmax(min(${"340px"}, 100%), 1fr)
    );
    max-width: calc(
        ${4} * ${"480px"} + 2 *
            ${p.variables.spacingLarge}
    );
    margin-top: ${p.variables.spacingMedium};
`,I=i().div`
    margin-top: auto;
    ${(0,N.default)()}
`,B=i().div`
    flex: 0 0 auto;
    background-color: ${p.variables.interactiveColorOverlaySelected};
    color: ${p.variables.contentColorMuted};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    width: 76px;
    height: 76px;
    margin-right: ${p.variables.spacingLarge};

    & > svg {
        width: 30px;
        height: 30px;
    }
`,X=i().div`
    display: flex;
    gap: ${p.variables.spacingLarge};
    flex-wrap: wrap;
    margin-top: ${p.variables.spacingMedium};
`,W=i().div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-start;
`,Y=i().p`
    font-size: ${p.variables.fontSize};
    line-height: 1.2em;
    color: ${p.variables.contentColorActive};
    font-weight: ${p.variables.fontWeightBold};
    margin: 0 0 ${p.variables.spacingSmall} 0;
`,D=i().div`
    padding: ${p.variables.spacingXLarge};
`,F=i().div`
    padding: ${p.variables.spacingMedium};
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    ${(0,P.default)()}
`,R=i().div`
    display: flex;
    flex-direction: column;
    gap: ${p.variables.spacingXSmall};
`,q=i().div`
    padding: ${p.variables.spacingXLarge} 0 0 0;
`,T=i().div`
    padding: 0 ${p.variables.spacingXLarge} ${p.variables.spacingXLarge}
        ${p.variables.spacingXLarge};
    flex: 1;
    ${w.jg}

    [data-test='link'] {
        font-size: ${p.variables.fontSize};
    }
`,V=i().div`
    display: flex;
    align-items: center;
    justify-content: right;
    padding-right: 48px;
    flex: 1 1 auto;
    min-width: 0;

    & > svg {
        height: 210px;
    }
`,Z=i()(L())`
    margin: 0;

    & > [data-test='link'] {
        margin-left: ${p.variables.spacingLarge};
        font-size: ${p.variables.fontSize};
        font-weight: 400;
    }
`,G=i()(L()).attrs({level:3})`
    margin: 0 0 0 ${p.variables.spacingMedium};
    color: ${p.variables.syntaxBlue};
`,U=i().div`
    display: flex;
`,J=i()(k())`
    display: flex;
    flex-direction: row;
    min-height: 154px;
    flex: 1 1 400px;
    min-width: 0;
    padding: ${p.variables.spacingLarge};
    visibility: ${e=>e.$visibility||"visible"};
    ${e=>"hidden"===e.$visibility?"\n    @media screen and (max-width: 1080px) {\n        display: none;\n    }\n    ":""}
`,K=i()(k())`
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
        padding: 0 ${p.variables.spacingLarge};

        & div {
            white-space: pre-wrap;
        }
    }

    & > [data-test='body'] {
        overflow: hidden;
        padding: 0 ${p.variables.spacingLarge};
    }

    & [data-test='link'] {
        color: ${p.variables.contentColorActive};
    }

    & [data-test='try-feature'] {
        margin-left: ${p.variables.spacingLarge};
    }
`,Q=i()(e=>{var{open:a,closeOnClickAway:t,size:n,noHeader:i,title:l,subtitle:d,onRequestClose:c,returnFocus:p,footerContent:g,buttons:v,children:f,applying:h,error:y}=e,w=u(e,["open","closeOnClickAway","size","noHeader","title","subtitle","onRequestClose","returnFocus","footerContent","buttons","children","applying","error"]);const $=(0,r.useCallback)(({event:e,reason:a})=>{("clickAway"!==a||t)&&(null==c||c(e))},[c,t]);return o().createElement(x,Object.assign({open:a,size:n,onRequestClose:$,returnFocus:p},w),!i&&o().createElement(s().Header,{className:m.HN,title:l,subtitle:d}),o().createElement(b,{applying:h,error:y},f),(g||v)&&o().createElement(s().Footer,null,g,v))})`
    & [data-test='body'] {
        padding: 0;
    }
    & video {
        width: 960px;
`,_=i()(k())`
    width: 100%;
    & img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
`,ee=i()(_)`
    visibility: hidden;
`,ae=i()($.Body)`
    width: 100%;
    height: 200px;
    objectfit: cover;
    overflow: hidden;
    padding: 0 !important; // Body provided by SUI has a padding on it we need to override.
`,te=i().div`
    padding-left: ${p.variables.spacingMedium};
    display: flex;
    gap: ${p.variables.spacingSmall};
    min-height: 26px; // size of chips with padding we want the same amount of space in the card even if there are no runtimes
    align-self: flex-start;
`,ne=i()(j())`
    margin-bottom: ${p.variables.spacingMedium};
`,ie=i()(z()).attrs({variant:"title2",as:"h3"})`
    font-size: ${p.variables.fontSizeXXLarge};
    color: ${p.variables.contentColorActive};
`,re=i()(k())`
    display: flex;
    flex-direction: row;
    min-height: 260px;
    min-width: 400px;
    justify-content: space-between;
    padding: ${p.variables.spacingXLarge};
    margin-top: ${p.variables.spacingXLarge};

    @media (max-width: 1400px) {
        ${V} {
            display: none;
        }
    }

    @media (min-width: 1024px) {
        &:only-child {
            ${V} {
                display: flex;
            }
        }
    }
`,oe=i()(z()).attrs({as:"span",variant:"body"})`
    display: block;
`,le=i().div`
    display: flex;
    flex-wrap: wrap;
    gap: ${p.variables.spacingSmall};

    a,
    button {
        flex: 0 0 auto;
        margin: 0 !important;
    }
`,se=i().div`
    display: flex;
    column-gap: ${p.variables.spacingLarge};

    @media (max-width: 890px) {
        flex-direction: column;
    }
`,de=i().div``,ce=i()(M())`
    margin-right: ${p.variables.spacingMedium};
`,pe=i()(H.jd)`
    margin-left: ${p.variables.spacingMedium};
`},5724(e,a,t){var n=t(85959),i=t.n(n),r=t(53209),o=t(89629),l=t(68296),s=t(21906),d=t(72218),c=t(1193),p=t(44353);const g=({handleCloseVideo:e,selectedVideo:a})=>{const t=i().createElement(i().Fragment,null,i().createElement(p.P7,null,a.description),a.docLink&&i().createElement(d.jd,{location:a.docLink.location,product:a.docLink.product,appearance:"standalone"},r.t`${a.docLink.label} documentation`),a.secondaryDocLink&&i().createElement(p.ug,{location:a.secondaryDocLink.location,product:a.secondaryDocLink.product},r.t`${a.secondaryDocLink.label} documentation`));return i().createElement(p.se,{id:`video-modal-${a.videoId}`,className:"video-modal",open:!!a,closeOnClickAway:!0,size:"l",returnFocus:()=>!0,onRequestClose:e,title:a.title,subtitle:t},i().createElement(n.Suspense,{fallback:i().createElement(o.kt,null)},a.videoLink?i().createElement("iframe",{width:"960",height:"540",src:`https://www.youtube.com/embed/${a.videoLink}`,title:`${a.title}`,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",referrerPolicy:"strict-origin-when-cross-origin",allowFullScreen:!0,"data-test":"video"}):i().createElement("video",{"data-test":"video",controls:!0,controlsList:"nodownload",autoPlay:!0},i().createElement("source",{src:`/px-dmx-assets/${a.videoId}.mp4`,type:"video/mp4"}))))},m=({video:e,handleOpen:a})=>{const t=(0,n.useCallback)(()=>{a(e)},[a,e]);return i().createElement(p.Vf,{onClick:t,"data-test":"training-video-card",className:l.HN},i().createElement(p.Hw,null,i().createElement("img",{"data-test":"training-video-poster",src:`/px-dmx-assets/${e.videoId}-poster.png`,alt:e.title})),i().createElement(p.Vf.Header,{title:e.title,subtitle:e.duration}))},u=()=>i().createElement(p.hn,{"data-test":"hidden-training-video-card"});t.d(a,["vj",0,({showAll:e=!0,educationSearchStr:a})=>{const{tenantSupportedRuntimes:t}=(0,s.Pm)(),[r,o]=(0,n.useState)(null),l=(0,n.useCallback)(()=>{o(null)},[]),d=e?(0,c.yx)(t):(0,c.GC)(t),v=a?d.filter(e=>e.title?.toLowerCase().includes(a.toLowerCase())):d,f=Math.max(0,4-v.length);return i().createElement(p.LW,null,v.map(e=>i().createElement(m,{key:e.videoId,video:e,handleOpen:o})),f>0&&Array.from({length:f},(e,a)=>i().createElement(u,{key:a})),r&&i().createElement(g,{handleCloseVideo:l,selectedVideo:r}))}])},89967(e,a,t){t.d(a,{Qn:()=>f});var n=t(85959),i=t.n(n),r=t(53209),o=t(61605),l=t.n(o),s=t(60652),d=t(51625);const c=({onRequestClose:e,maintenanceWindow:a,isNonBlockingMaintenance:t=!1,isInMaintenance:n=!1})=>{const{startDateTime:o,endDateTime:c}=a,p=l()(o).utc().format("dddd, MMMM Do YYYY"),g=l()(c).utc().format("dddd, MMMM Do YYYY"),m=t?n?r.t`The ${s.fI} service is currently undergoing maintenance, scheduled for ${p}-${g}. No disruptions to data ingestion and processing are expected. However, you might encounter errors that prevent you from completing configuration changes. Please contact your Splunk representative for more information.`:r.t`The ${s.fI} service will undergo maintenance, scheduled for ${p}-${g}. No disruptions to data ingestion and processing are expected. However, you might encounter errors that prevent you from completing configuration changes. Please contact your Splunk representative for more information.`:n?r.t`The ${s.fI} service is currently undergoing maintenance, scheduled for ${p}-${g}. No disruptions to data ingestion and processing are expected. However, you cannot make any configuration changes during this time. Please contact your Splunk representative for more information.`:r.t`The ${s.fI} service will undergo maintenance, scheduled for ${p}-${g}. No disruptions to data ingestion and processing are expected. However, you will not be able to make any configuration changes during that time. Please contact your Splunk representative for more information.`;return i().createElement(d.SZ,{"aria-label":"maintenance announcement",type:n?"warning":"info",onRequestClose:e,className:"maintenance-message-container"},m)};var p=t(27198),g=t.n(p),m=t(50128);const u=()=>{const{maintenanceWindow:e,shouldShowEarlyNotification:a,shouldShowMaintenanceBanner:t}=(0,m.M7)(),[r,o]=(0,n.useState)(!window.sessionStorage.getItem("isEPMaintenanceMessageClosed"));return a&&e?i().createElement(g(),{animation:"expandHeight",open:r,outerStyle:{flex:"0 0 auto"},animateOnMount:!1,outerClassName:"maintenance-message-container"},i().createElement(c,{maintenanceWindow:e,onRequestClose:()=>{window.sessionStorage.setItem("isEPMaintenanceMessageClosed","true"),o(!1)},isNonBlockingMaintenance:t})):null},v=()=>{const{maintenanceWindow:e,shouldShowShortNotification:a,shouldShowMaintenancePage:t,shouldShowMaintenanceBanner:n}=(0,m.M7)();return(a||t||n)&&e?i().createElement(c,{maintenanceWindow:e,isInMaintenance:t||n,isNonBlockingMaintenance:n}):null},f=()=>i().createElement(i().Fragment,null,i().createElement(u,null),i().createElement(v,null))},73700(e,a,t){var n=t(85959),i=t(72478);t.d(a,["H",0,e=>{const{updatePageTitle:a}=(0,i.p)();(0,n.useEffect)(()=>(a?.(Array.isArray(e)?e:[e]),()=>a?.()),[a,e])}])}}]);
//# sourceMappingURL=4689.4689.js.map?4e35eff69afa40283d2a