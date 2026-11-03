/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as m}from"./chunk-MJY2WADW.js";import{a as E}from"./chunk-EADNKZ7Y.js";import{a as S}from"./chunk-O2LJZCOI.js";import{a as de}from"./chunk-7A3GRDA5.js";import{a as ce}from"./chunk-LQPHASKS.js";import{a as me}from"./chunk-6FUVYGSB.js";import{b as ne}from"./chunk-DJG2TOO6.js";import{b as W}from"./chunk-56RAFZKA.js";import{a as ae}from"./chunk-SLMRV67W.js";import{a as ie}from"./chunk-GSVTVKTA.js";import{a as P}from"./chunk-L5O4KRWJ.js";import"./chunk-FZU5W2YM.js";import{a as c,b as T,i as p,j as e,l as i,n as M,o as C,p as a,q as H}from"./chunk-4NT7QVA7.js";import{a as le}from"./chunk-ZWC4ABI4.js";import{c as oe,e as se,f as $}from"./chunk-SQGCRNB4.js";import{r as O}from"./chunk-ITHU5P5O.js";import"./chunk-MVRPNTRB.js";import"./chunk-2WVRHQHO.js";import"./chunk-3L4L4Z2V.js";import"./chunk-XDFLUOTJ.js";import"./chunk-JHLKKHPY.js";import{wa as ee,xa as re,ya as te}from"./chunk-P2UEJLOF.js";import"./chunk-XC3VPJJP.js";import"./chunk-CDGSZEQ3.js";import"./chunk-RXGAPRCF.js";import"./chunk-JRJJ2J4W.js";import"./chunk-LZUJU4H4.js";import"./chunk-5I5EF6X3.js";import"./chunk-EMECN227.js";import"./chunk-DXRKKB2D.js";import"./chunk-JKE3YGCJ.js";import"./chunk-JRWCA5GX.js";import"./chunk-KT3UIIGH.js";import"./chunk-2DF7PMOL.js";import"./chunk-O2JJX2RL.js";import"./chunk-6GUZBCIS.js";import"./chunk-7UAJTSFV.js";import"./chunk-REK4W3C7.js";import"./chunk-JHLB3KMN.js";var De={filename:"/builds/devplat/dashboard-enterprise/packages/enterprise-dashboard-dialogs/EditPermissions.js",dirname:"/builds/devplat/dashboard-enterprise/packages/enterprise-dashboard-dialogs",relativefilename:"../enterprise-dashboard-dialogs/EditPermissions.js",relativedirname:"../enterprise-dashboard-dialogs",line:0},ue=(r,t)=>(0,E.includes)(t,"*")?r!=="*":!1,pe=(r,t)=>t.length?!!((0,E.includes)(t,"*")&&r==="*"||(0,E.includes)(t,r)):!1,F=i(M)`
    width: 550px;
`,Te=i(M.Body)`
    overflow-x: hidden;
`,We=i(W)`
    max-width: 1000px;
    margin-bottom: 0px;
    & > div:first-child {
        flex-direction: row-reverse;
    }
    & [data-test="label"] {
        margin-bottom: 0px;
    }
`,Me=i(W)`
    margin-bottom: 0px;
    & > div:first-child {
        flex-direction: row-reverse;
    }
    & [data-test="label"] {
        margin-bottom: 0px;
    }
`,He=i(de)`
    max-width: 100%;
`,fe=i(ce)`
    width: 16px;
    height: 16px;
    align-items: center;
`,Oe=i.div`
    margin-top: 5px;
    margin-left: -27px;
    margin-right: -27px;
`,$e=i(m)`
    margin-top: 10px;
`,A=i(m.HeadCell)`
    background-color: transparent;
    border-top: 1px solid ${C.variables.borderColorWeak};
    padding: 0px;
    > div {
        border-left: 0px;
        justify-content: center;
        font-weight: bold;
        width: 100%;
    }
`,Sr=i(m.Cell)`
    
`,Be=i(m.Row)`
    td:first-child {
        text-indent: 10px;
        min-width: 300px;
        align-content: center;
    }
    
    td {
        padding: 2px 8px;
    }

    &:nth-child(odd) {
        background-color: ${C.variables.backgroundColorHover};
    }
`,Fe=(r,t)=>$(["getDashboard",r],()=>te({id:r}),{select:n=>n.entry[0],retry:!1,enabled:t,refetchOnWindowFocus:!1}),Ae=r=>$(["roles"],ee,{select:t=>{let n=t.entry;for(let d of n)d.value=d.name;return[{name:(0,a._)("Everyone"),value:"*"},...n]},retry:!1,enabled:r,refetchOnWindowFocus:!1}),Le=(r,t)=>se(n=>re(n),{onSuccess:n=>{t.setQueryData(["getDashboard",r],n)}}),f=le(De.filename),Qe=e.memo(({handleCloseModal:r,handleEditPerm:t})=>e.createElement(F.Footer,null,e.createElement(H,c({appearance:"default",onClick:r,label:(0,a._)("Cancel")},f("cancel-permission"))),e.createElement(H,c({appearance:"primary",onClick:t,label:(0,a._)("Save")},f("save-permission"))))),B=({label:r,info:t})=>e.createElement(We,{label:r,labelPosition:"left"},e.createElement(He,c({},f(t)),e.createElement("strong",null,t))),Ge=()=>e.createElement(A,null),je=({name:r,value:t,readPerms:n,writePerms:d,handleRead:u,handleWrite:g})=>e.createElement(Be,null,e.createElement(m.Cell,null,r),e.createElement(m.Cell,{align:"center"},e.createElement(fe,c({"aria-label":`${(0,a._)("Read permissions for")} ${r}`,value:t,onClick:u,selected:pe(t,n),disabled:ue(t,n)},f(`${r}-read`)))),e.createElement(m.Cell,{align:"center"},e.createElement(fe,c({"aria-label":`${(0,a._)("Write permissions for")} ${r}`,value:t,onClick:g,selected:pe(t,d),disabled:ue(t,d)},f(`${r}-write`))))),qe=({roles:r,readPerms:t,writePerms:n,handleRead:d,handleWrite:u})=>e.createElement($e,{innerStyle:{overflowX:"hidden"}},e.createElement(m.Head,null,e.createElement(Ge,null),e.createElement(A,{align:"center"},(0,a._)("Read")),e.createElement(A,{align:"center"},(0,a._)("Write"))),e.createElement(m.Body,null,r.map(g=>e.createElement(je,{key:g.name,name:g.name,value:g.value,readPerms:t,writePerms:n,handleRead:d,handleWrite:u})))),ge={read:void 0,write:void 0},ze={height:"14px"},Ue=[],Ve=({open:r,onCloseModal:t,dashboardTitle:n,dashboardId:d,trackEvent:u,telemetry:g,onUpdateSharing:L,returnFocusRef:he})=>{var Q,G,j,q,z,U,V;let[X,Y]=(0,p.useState)(void 0),[w,R]=(0,p.useState)(ge),[J,v]=(0,p.useState)([]),[K,_e]=(0,p.useState)(!1),be=oe(),{isLoading:ve,data:l,isError:Ee}=Fe(d,r),{isLoading:ye,data:N,isError:xe}=Ae(r),{mutate:Se}=Le(d,be),y=null;(ye||ve)&&(y=e.createElement(me,{size:"small",style:ze})),(xe||Ee)&&(y=e.createElement(ae,{type:"error"},(0,a._)("Permission editing is currently unavailable. Try again in a few minutes.")));let h=(Q=X!=null?X:l==null?void 0:l.acl.sharing)!=null?Q:"",_=(q=(j=w.read)!=null?j:(G=l==null?void 0:l.acl.perms)==null?void 0:G.read)!=null?q:[],b=(V=(U=w.write)!=null?U:(z=l==null?void 0:l.acl.perms)==null?void 0:z.write)!=null?V:[],Z=o=>{u?u(o):g.emit(o)},k=P(o=>{v([]),R(ge),Y(void 0),t(o)}),we=()=>_e(!K),Ce=o=>{if(J.length||h!=="user"&&D(_,b)){we();return}Se({id:d,display:h,owner:l==null?void 0:l.acl.owner,readPerms:_,writePerms:b},{onSuccess:()=>{L==null||L(h),Z(O({name:n,sharing:h,selectedRead:_.length,selectedWrite:b.length},u===void 0,!0)),k(o)},onError:s=>{v([s.message]),Z(O({name:n,sharing:h,selectedRead:_.length,selectedWrite:b.length},u===void 0,!1))}})},D=(0,p.useCallback)((o,s)=>{if(!o.length&&!s.length)return v([(0,a._)('You must select at least one "Read" or "Write" permission.')]),!0;v([])},[]),I=(0,p.useCallback)((o,s)=>(v([]),(0,E.includes)(o,s)?(0,E.without)(o,s):[...o,s]),[]),Pe=P((o,{value:s})=>{let x=I(_,s);D(x,b),R(T(c({},w),{read:x}))}),Re=P((o,{value:s})=>{let x=I(b,s);D(_,x),R(T(c({},w),{write:x}))}),ke=(0,p.useCallback)((o,{value:s})=>{Y(s),s==="user"&&v([])},[]);return e.createElement(F,{open:r,onRequestClose:k,returnFocus:he},e.createElement(F.Header,{title:(0,a._)("Edit Permissions")}),e.createElement(Te,null,y!=null?y:e.createElement(e.Fragment,null,e.createElement(ne,{errors:J,errorA11yToggle:K}),e.createElement(B,{label:(0,a._)("Dashboard"),info:n}),e.createElement(B,{label:(0,a._)("Owner"),info:l==null?void 0:l.author}),e.createElement(B,{label:(0,a._)("App"),info:l==null?void 0:l.acl.app}),e.createElement(Me,{label:(0,a._)("Display"),labelPosition:"left"},e.createElement(S,{value:h,onChange:ke},e.createElement(S.Option,c({value:"user",label:(0,a._)("Owner"),disabled:!(l!=null&&l.acl.can_share_user)},f("user-permission"))),e.createElement(S.Option,c({value:"app",label:(0,a._)("App"),disabled:!(l!=null&&l.acl.can_share_app)},f("app-permission"))),e.createElement(S.Option,c({value:"global",label:(0,a._)("All apps"),disabled:!(l!=null&&l.acl.can_share_global)},f("global-permission"))))),h!=="user"?e.createElement(Oe,null,e.createElement(qe,{roles:N!=null?N:Ue,readPerms:_,writePerms:b,handleRead:Pe,handleWrite:Re})):null)),y?null:e.createElement(Qe,{handleCloseModal:k,handleEditPerm:Ce}))},Xe=ie(Ve),Pr=(0,C.withSplunkTheme)(Xe);export{Pr as default};
