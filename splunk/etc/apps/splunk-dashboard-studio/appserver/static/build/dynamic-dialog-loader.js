/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as S}from"./chunks/chunk-ZWC4ABI4.js";import{a as Q}from"./chunks/chunk-43PNZDFJ.js";import{a as K}from"./chunks/chunk-JKE3YGCJ.js";import{a as J}from"./chunks/chunk-JRWCA5GX.js";import{Ja as A,Qa as W,a as R,b as U,c as _,ua as $}from"./chunks/chunk-REK4W3C7.js";import{a as l,b as D,d as b,h as i}from"./chunks/chunk-JHLB3KMN.js";var O=i(K()),B=i(A()),o=i(R()),V=i(Q());var H=i($()),X=H.createGlobalStyle`
    /* Reset bootstrap form styles for dialogs from enterprise-dashboard-dialogs package only */
    /* Uses data-view-source attribute to avoid affecting other modals on the page */
    
    [data-test="layer-container"]:has([data-view-source^="enterprise-dashboard-dialogs"]) {
        input[type=color], input[type=date], input[type=datetime-local], input[type=datetime], input[type=email], input[type=month], input[type=number], input[type=password], input[type=search], input[type=tel], input[type=text], input[type=time], input[type=url], input[type=week] {
            height: auto;
            margin-bottom: 0px;
            &:focus {
                box-shadow: none;
            }
            background-color: transparent;
            border: none;
            color: inherit;

            padding-left: 0px;
            padding-right: 0px;
        }
        
        input[type=radio] {
            margin: revert;
            width: 20px;
        }

        textarea {
            height: auto;
            margin-bottom: 0px;
            &:focus {
                box-shadow: none;
            }
        }
    }

`,L=X;var w=i(W()),y=i(J()),T=i(U()),z=i(_()),t=i(R());var Y=()=>{},Z=P=>{var c=P,{defaultOpen:a=!0,title:e,okLabel:x=(0,T._)("Save"),cancelLabel:C=(0,T._)("Cancel"),onClose:p,onApply:n,children:d,width:u=460,disablePrimaryButton:f=!1,centerContent:m=!1,returnFocus:v=void 0,onRequestClose:E=()=>null}=c,h=b(c,["defaultOpen","title","okLabel","cancelLabel","onClose","onApply","children","width","disablePrimaryButton","centerContent","returnFocus","onRequestClose"]);let[j,q]=(0,t.useState)(a),M=(0,t.useCallback)(()=>{q(!1),p==null||p()},[p]),G=(0,t.useCallback)(()=>{n==null||n()},[n]),I=(0,t.useMemo)(()=>m?{display:"flex",justifyContent:"center",width:u}:{width:u},[m,u]);return!e||!p||!n?null:t.default.createElement(y.default,D(l(l({onRequestClose:M,open:j},S("data-test-simple-dialog")),(0,z.omit)(h,"onApply","onClose","defaultOpen")),{returnFocus:Y}),t.default.createElement(y.default.Header,{title:(0,T._)(e)}),t.default.createElement(y.default.Body,{style:I},d),t.default.createElement(y.default.Footer,null,t.default.createElement(w.default,l({appearance:"secondary",onClick:M,label:C},S("data-test-simple-dialog-cancel"))),f?null:t.default.createElement(w.default,l({appearance:"primary",onClick:G,label:x},S("data-test-simple-dialog-ok")))))},N=Z;var ee=(0,o.lazy)(()=>import("./chunks/CloneDashboard-R5YE64VP.js")),oe=(0,o.lazy)(()=>import("./chunks/CreateNewDashboard-CAG224AD.js")),te=(0,o.lazy)(()=>import("./chunks/DeeplinkDashboard-MUTRIFSR.js")),ae=(0,o.lazy)(()=>import("./chunks/SaveToExistingDashboard-XFXQG34Z.js")),ie=(0,o.lazy)(()=>import("./chunks/ScheduledExport-OZCLM2DA.js")),re=(0,o.lazy)(()=>import("./chunks/ClassicSchedulePDF-5U3OY4HN.js")),ne=(0,o.lazy)(()=>import("./chunks/VersionHistory-ZCKCQJME.js")),k={CloneDashboardDialog:ee,CreateNewDashboardDialog:oe,DeeplinkDashboardDialog:te,SaveToExistingDashboardDialog:ae,ScheduledExportDialog:ie,ClassicSchedulePDFDialog:re,VersionHistoryDialog:ne},le=500,g=null,s=null,r=null;function se(){(!g||!s)&&(g=document.createElement("div"),g.setAttribute("data-test","splunk-studio-dialog-mount"),document.body.appendChild(g),s=(0,V.createRoot)(g))}function F(a,e,x){var m,v,E,h,P,c;if(!k[a])throw new Error(`Dialog "${a}" not found`);let C=k[a],f=e,{theme:p,title:n}=f,d=b(f,["theme","title"]),u=n||"Loading...";s.render(o.default.createElement(B.SplunkThemeProvider,{colorScheme:(v=(m=e==null?void 0:e.theme)==null?void 0:m.colorScheme)!=null?v:"light",density:(h=(E=e==null?void 0:e.theme)==null?void 0:E.density)!=null?h:"comfortable",family:(c=(P=e==null?void 0:e.theme)==null?void 0:P.family)!=null?c:"enterprise"},o.default.createElement(L,null),o.default.createElement(o.Suspense,{fallback:o.default.createElement(N,{title:u,width:550,centerContent:!0,disablePrimaryButton:!0,onClose:()=>{"onCloseModal"in d&&typeof d.onCloseModal=="function"&&d.onCloseModal()},onApply:()=>{},cancelLabel:"Cancel"},o.default.createElement(O.default,{size:"medium"}))},o.default.createElement(C,D(l({},d),{open:x})))))}function pe(a,e){if(!k[a])throw new Error(`Dialog "${a}" not found`);se(),r={dialogName:a,props:e},F(a,e,!0)}function de(a=le){return!s||!r?Promise.resolve():(F(r.dialogName,r.props,!0),setTimeout(()=>{!s||!r||F(r.dialogName,r.props,!1)},0),new Promise(e=>{setTimeout(()=>{s&&(s.render(null),r=null),e()},a)}))}var ue=Object.freeze({render:pe,unmount:de,supportedDialogs:Object.keys(k)}),De=ue;export{ue as SplunkStudioDialog,De as default,pe as renderSplunkStudioDialog,de as unmountSplunkStudioDialog};
