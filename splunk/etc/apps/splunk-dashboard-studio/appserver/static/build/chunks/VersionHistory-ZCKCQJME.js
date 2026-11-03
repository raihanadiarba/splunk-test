/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as ie}from"./chunk-JDPOYFAU.js";import{a as u}from"./chunk-MJY2WADW.js";import{a as ce}from"./chunk-EADNKZ7Y.js";import{a as ne}from"./chunk-LQPHASKS.js";import{a as se}from"./chunk-6FUVYGSB.js";import{a as P}from"./chunk-SLMRV67W.js";import{a as le}from"./chunk-JN5E4P73.js";import{a as Y}from"./chunk-YO2THALI.js";import{a as oe}from"./chunk-PO2GNYX3.js";import{a as ae}from"./chunk-GSVTVKTA.js";import{a as S,e as D,f as I,i as o,j as e,l as p,n as C,o as X,p as c,q as O}from"./chunk-4NT7QVA7.js";import{a as J}from"./chunk-ZWC4ABI4.js";import{f as re}from"./chunk-SQGCRNB4.js";import{M as Z,N as ee}from"./chunk-ITHU5P5O.js";import{b as W,c as te}from"./chunk-2JKAJQFP.js";import"./chunk-XHTYW3TC.js";import"./chunk-CC76V3MT.js";import"./chunk-5HYJV7JI.js";import"./chunk-MVRPNTRB.js";import"./chunk-2WVRHQHO.js";import"./chunk-XDFLUOTJ.js";import"./chunk-JHLKKHPY.js";import{Ha as z}from"./chunk-P2UEJLOF.js";import"./chunk-XC3VPJJP.js";import"./chunk-RXGAPRCF.js";import"./chunk-JRJJ2J4W.js";import"./chunk-LZUJU4H4.js";import"./chunk-EMECN227.js";import"./chunk-DXRKKB2D.js";import"./chunk-JKE3YGCJ.js";import"./chunk-JRWCA5GX.js";import"./chunk-KNKTAXQK.js";import"./chunk-BTFYE7V4.js";import"./chunk-KT3UIIGH.js";import"./chunk-2DF7PMOL.js";import"./chunk-O2JJX2RL.js";import"./chunk-6GUZBCIS.js";import"./chunk-7UAJTSFV.js";import"./chunk-REK4W3C7.js";import{h as T}from"./chunk-JHLB3KMN.js";var $=T(te()),Re=T(te()),A=T(W()),Le=T(W()),He={filename:"/builds/devplat/dashboard-enterprise/packages/enterprise-dashboard-dialogs/VersionHistory.js",dirname:"/builds/devplat/dashboard-enterprise/packages/enterprise-dashboard-dialogs",relativefilename:"../enterprise-dashboard-dialogs/VersionHistory.js",relativedirname:"../enterprise-dashboard-dialogs",line:0},fe={};D(fe,{default:()=>ge});I(fe,Re);var me,ue,ge=(ue=(me=$.default)==null?void 0:me.default)!=null?ue:$.default,_e={};D(_e,{default:()=>he});I(_e,Le);var de,pe,he=(pe=(de=A.default)==null?void 0:de.default)!=null?pe:A.default,De=p.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
`,Ie=p.div`
    display: flex;
    align-items: center;
    gap: 15px;
`,Pe=p(he)`
    width: 200px;
    & input {
        border: none;
        background-color: inherit
    }
`,Oe=({numPages:l,currentPage:s,onPageChange:t,searchValue:n,onSearchChange:a,toggled:i,onToggle:_})=>{let d=(0,o.useCallback)((E,{page:f})=>{t(f)},[t]),V=(0,o.useCallback)((E,{value:f})=>{t(1),a(f)},[a,t]),b=(0,o.useCallback)(()=>{t(1),_()},[_,t]);return e.createElement(De,null,e.createElement(Ie,null,e.createElement(Pe,{value:n,onChange:V,placeholder:(0,c._)("Find by user or comment")}),e.createElement(ne,{appearance:"toggle",selected:i,onClick:b,"data-test":"message-toggle"},(0,c._)("Show only commented"))),e.createElement(ge,{onChange:d,current:s,totalPages:l}))},$e=Oe,Ae=p(C)`
    width: 870px;
`,Fe=p.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
`,Ue=p(u.Head)`
    th[data-test='toggle-all'] {
        pointer-events: none !important;
        > div {
            display:none;
        }
    }
`,Be=p(Y)`
    display: flex;
    flex-direction: column;
    align-items: start;
    max-width: none;
    width: 100%;
`,Qe=p(P)`
    width: 100%;
`,M=J(He.filename),je=(0,c._)("Missing a selected version. Select at least one version."),F=10,qe=l=>ie.newSplunkTime({time:l}).splunkFormat("LLL"),Ge=l=>({versions:l.entry.map(t=>({versionMessage:t.content.message?t.content.message:"-",versionID:t.content.sha,time:qe(t.content.time),createdAt:t.content.time,user:t.content.user})),total:l.paging.total}),Ke=(l,s,t,n,a)=>re(["getVersionHistory",s,t,a,n],()=>{let i=a==null?void 0:a.replace(/\\/g,"\\\\").replace(/"/g,'\\"');return z({id:s,sort_key:"time",sort_dir:"desc",count:F,offset:Math.max((t-1)*F,0),search:a?`(user="*${i}*" OR message="*${i}*")`:void 0,with_message:n||void 0})},{select:i=>Ge(i),retry:!1,enabled:l,refetchOnWindowFocus:!1,keepPreviousData:!0}),Ne=(l,s)=>{if(l.length===0)return;let t=l.toSorted((a,i)=>new Date(a.createdAt).getTime()-new Date(i.createdAt).getTime()),n=new URLSearchParams;for(let a=0;a<t.length;a++)n.set(`version${a+1}`,t[a].versionID);return`${s}?${n}`},We=({selectedVersions:l,handleNoSelection:s,baseUrl:t,handleSelectionTelemetry:n})=>{let a=Ne(l,t);return e.createElement(O,S({appearance:"primary",to:a,onClick:a?n:s,label:(0,c._)("Compare")},M("compare-button")))},ze=(l,s,t,n)=>[l,s,t,n],Je=({open:l,onCloseModal:s,app:t,dashboardId:n,version1:a,version2:i,telemetry:_,trackEvent:d,returnFocusRef:V})=>{var b,E;let f=(0,o.useMemo)(()=>{let r=[];return a&&r.push(a),i&&r.push(i),r},[a,i]),[m,x]=(0,o.useState)(f),[ve,k]=(0,o.useState)(!1),[H,U]=(0,o.useState)(),[R,B]=(0,o.useState)(1),[h,Q]=(0,o.useState)(!1),ye=(0,o.useMemo)(()=>ze(n,R,h,H),[n,R,h,H]),Se=le(ye,250),{isLoading:j,data:q,isError:G}=Ke(l,...Se),{versions:v,total:Ce}=q!=null?q:{versions:[],total:0},be=Math.ceil(Ce/F),K=(0,o.useMemo)(()=>j?e.createElement(se,{size:"medium"}):G?e.createElement(P,S({type:"error"},M("fetch-error-message")),e.createElement("span",null,(0,c._)("Unable to fetch versions. If you have a support contract, contact ")," ",e.createElement(oe,{to:"https://www.splunk.com/en_us/customer-success/support-programs.html",openInNewContext:!0},(0,c._)("Splunk Support.")))):null,[G,j]),Ee=`/${(E=(b=window.$C)==null?void 0:b.LOCALE)!=null?E:"en-US"}/app/${t}/${n}/versionhistory`,xe=(0,o.useCallback)((r,{versionID:y})=>{let L=v==null?void 0:v.find(g=>g.versionID===y);if(!L)return;if(m.some(g=>g.versionID===y))x(m.filter(g=>g.versionID!==y));else if(m.length<2)x([...m,L]),k(!1);else{let g=m.slice(-1);x([...g,L]),k(!1)}},[v,m]),w=(0,o.useCallback)(r=>{if(d){d(r);return}_==null||_.emit(r)},[_,d]),ke=(0,o.useCallback)(()=>{w(ee(d===void 0)),k(!0)},[w,d]),we=(0,o.useCallback)(()=>{let r=m.length;w(Z(r,d===void 0))},[w,m,d]),N=(0,o.useCallback)(()=>{s(),setTimeout(()=>{x(f),k(!1),B(1),U(void 0),Q(!1)},500)},[s,f]),Te=(0,o.useCallback)(r=>{B(r)},[]),Me=(0,o.useCallback)(r=>{U(r)},[]),Ve=(0,o.useCallback)(()=>{Q(!h)},[h]);return e.createElement(Ae,{open:l,onRequestClose:N,returnFocus:V},e.createElement(C.Header,{title:(0,c._)("Compare versions")}),e.createElement(C.Body,null,K?e.createElement(Fe,null,K):e.createElement(e.Fragment,null,e.createElement(Be,null,ve&&e.createElement(Qe,{type:"error",appearance:"fill"},je),e.createElement($e,{numPages:be,currentPage:R,onPageChange:Te,searchValue:H,onSearchChange:Me,onToggle:Ve,toggled:h})),v&&e.createElement(u,{stripeRows:!0,rowSelection:m.length>0?"some":"none",onRequestToggleAllRows:()=>ce.noop},e.createElement(Ue,null,e.createElement(u.HeadCell,null,(0,c._)("User")),e.createElement(u.HeadCell,null,(0,c._)("Date")),e.createElement(u.HeadCell,null,(0,c._)("Comment"))),e.createElement(u.Body,null,v.map(r=>e.createElement(u.Row,S({key:r.versionID,data:r,selected:m.some(y=>y.versionID===r.versionID),onRequestToggle:xe},M("version")),e.createElement(u.Cell,{key:r.user},r.user),e.createElement(u.Cell,{key:r.time},r.time),e.createElement(u.Cell,{key:r.versionMessage},r.versionMessage))))))),e.createElement(C.Footer,null,e.createElement(O,S({appearance:"secondary",label:(0,c._)("Cancel"),onClick:N},M("cancel-button"))),e.createElement(We,{selectedVersions:m,handleNoSelection:ke,handleSelectionTelemetry:we,baseUrl:Ee})))},Xe=ae(Je),Vt=(0,X.withSplunkTheme)(Xe);export{je as NO_SELECTED_COMMITS_ERROR,Vt as default,Ke as useHistoryQuery};
