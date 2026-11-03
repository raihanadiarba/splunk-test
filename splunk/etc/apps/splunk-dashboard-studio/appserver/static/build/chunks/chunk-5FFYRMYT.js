/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as Z,b as T}from"./chunk-NGX52ODI.js";import{a as O}from"./chunk-HKUHSW3U.js";import{a as A}from"./chunk-55PAVQ6L.js";import{a as Q}from"./chunk-LQPHASKS.js";import{a as ee}from"./chunk-6FUVYGSB.js";import{b as q}from"./chunk-DJG2TOO6.js";import{b as V}from"./chunk-56RAFZKA.js";import{a as F}from"./chunk-SLMRV67W.js";import{a as K}from"./chunk-PO2GNYX3.js";import{h as R,i as H,k as U,l as G,m as W,n as J,o as z,p as X}from"./chunk-FZU5W2YM.js";import{a as p,b as M,c as j,i as w,j as t,l as d,o as N,p as i,q as Y}from"./chunk-4NT7QVA7.js";import{a as y}from"./chunk-ZWC4ABI4.js";import{m as se,n as me,r as P,t as S}from"./chunk-LZUJU4H4.js";import{a as oe,f as le,l as $}from"./chunk-O2JJX2RL.js";import{h as v}from"./chunk-JHLB3KMN.js";var k=v(se()),L=v(oe()),f=v(le()),te=v(me());var re="scheduled/views",g=e=>{let r=e.trim();return r.length===0?"":r.replace(/\\/g,"\\\\").replace(/"/g,'\\"')},ye=async({dashboardId:e,app:r,emailTo:n,emailBCC:s,emailCC:a,emailPriority:l,emailSubject:m,emailMessage:o,sendPdf:c})=>{let u="0",b="0";try{let E=await Promise.allSettled([ce(),de()]);u=E[0].status==="fulfilled"&&E[0].value||"0",b=E[1].status==="fulfilled"&&E[1].value||"0"}catch(E){console.error("Error encountered while retrieving use_tls and use_ssl from alert-actions.conf.")}let _=c?"0":"1",I=[`| sendemail use_ssl=${b}`,`use_tls=${u}`,`to="${g(n)}"`,`cc="${g(a)}"`,`bcc="${g(s)}"`,`priority="${g(l)}"`,`sendpdf=${c?"1":"0"}`,`sendpng=${_}`,`inline=${_}`,'from="splunk"',`subject="${g(m)}"`,`message="${g(o)}"`,'papersize="letter"','paperorientation="portrait"',`pdfview="${g(e)}"`,'sendtestemail="1"'].join(" ");return await(k.default.default?k.default.default:k.default).create({search:I,earliest_time:"1",latest_time:"2"},{app:r,owner:L.username}).getResults().first().toPromise()},Te=({enabled:e,cronSchedule:r,dashboardId:n,app:s,emailTo:a,emailBCC:l,emailCC:m,emailPriority:o,emailSubject:c,emailMessage:u,includeLink:b,sendPdf:_})=>{let I="_ScheduledView__".concat(n),D=(0,f.createRESTURL)(`${re}/${I}?output_mode=json`,{app:s,owner:L.username});return P(D,{method:"POST",body:te.default.stringify({cron_schedule:r,"action.email.to":a,"action.email.bcc":l,"action.email.cc":m,"action.email.priority":o,"action.email.subject.view":c,"action.email.message.view":u,"action.email.include.view_link":b,"action.email.sendpng":!_,"action.email.inline":!_,"action.email.sendpdf":_,is_scheduled:e})})},ke=(e,r)=>{let n=(0,f.createRESTURL)(`${re}/${e}?output_mode=json`,{app:r,owner:L.username});return P(n,{method:"GET"})},ae=()=>{let e=(0,f.createRESTURL)("properties/alert_actions/email/allowedDomainList");return S(e)},ce=()=>{let e=(0,f.createRESTURL)("properties/alert_actions/email/use_tls");return S(e)},de=()=>{let e=(0,f.createRESTURL)("properties/alert_actions/email/use_ssl");return S(e)};var ne={filename:"/builds/devplat/dashboard-enterprise/packages/enterprise-dashboard-dialogs/chunks/chunk-OV6P6XDV.js",dirname:"/builds/devplat/dashboard-enterprise/packages/enterprise-dashboard-dialogs/chunks",relativefilename:"../enterprise-dashboard-dialogs/chunks/chunk-OV6P6XDV.js",relativedirname:"../enterprise-dashboard-dialogs/chunks",line:0},Qe=d.span`
    margin-left: 10px;
`,h=d(V).attrs({labelPosition:"left",labelWidth:160})`
    max-width: 1000px;
    margin-top: 16px;
    margin-bottom: 16px;
 
    & > div:first-child {
        justify-content: flex-end;
        margin-right: 16px;
    }
    & [data-test="label"] {
        margin-bottom: 0px;
    }
    & [data-test="controls"] {
        gap: 6px;
    }          
`,ue=d(h)`
    & [data-test="controls"] {
        width: 330px;
        flex-grow: 0;
    }
`,Ze=d.hr`
    margin: 20px 0;
    color: lightgray;
`,et=d.div`
    animation: fadeInAnimation ease 1s;
    animation-iteration: 1;

    @keyframes fadeInAnimation {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`,pe={5:(0,i._)("Very low"),4:(0,i._)("Low"),3:(0,i._)("Normal"),2:(0,i._)("High"),1:(0,i._)("Critical")},ge={5:"priority-button-very-low",4:"priority-button-low",3:"priority-button-normal",2:"priority-button-high",1:"priority-button-critical"},_e=d(O)`
    > * {
        padding: 4px 2px;
    }
`,fe=d.small`
    color: ${N.variables.errorColorD10};
`,ie={width:"330px"},Ce={paddingTop:"0px"},he={marginTop:"13px",marginLeft:"0px"},C=y(ne.filename),x=e=>{var r=e,{errorText:n,sidebarContent:s,name:a}=r,l=j(r,["errorText","sidebarContent","name"]);return t.createElement("div",{style:ie},t.createElement(_e,p({error:!!n,name:a},l)),n&&t.createElement(fe,{"data-test":`${a}-error-text`},n))},at=t.memo(e=>{let[r,n]=t.useState(!1),{disabled:s}=t.useContext(Z),{handleGenericEmailChange:a}=e;(0,w.useEffect)(()=>{(e.emailCC!==""||e.emailBCC!=="")&&n(!0)},[e.emailCC,e.emailBCC]);let l=(0,w.useCallback)(()=>{n(o=>!o)},[]),m=(0,w.useCallback)((o,c)=>{let{value:u}=c;a(o,{name:"emailPriority",value:u})},[a]);return t.createElement(t.Fragment,null,t.createElement(h,{label:(0,i._)("Email recipients"),controlsLayout:"stack",error:!!e.errorTo},t.createElement(x,p({rowsMax:5,rowsMin:4,errorText:e.errorTo,name:"emailTo",value:e.emailTo,onChange:a},C("email-field"))),t.createElement(T,{style:e.errorTo?Ce:void 0},(0,i._)("Comma separated list of email addresses.")),t.createElement(Q,{"data-test-name":"show-cc-and-bcc",disabled:s,onClick:l,selected:r,appearance:"toggle",style:he},(0,i._)("Show CC and BCC"))),r&&t.createElement(h,{label:(0,i._)("CC"),error:!!e.errorCc},t.createElement(x,p({rowsMax:3,errorText:e.errorCc,name:"emailCC",value:e.emailCC,onChange:a},C("cc-email-field")))),r&&t.createElement(h,{label:(0,i._)("BCC"),error:!!e.errorBcc},t.createElement(x,p({rowsMax:3,errorText:e.errorBcc,name:"emailBCC",value:e.emailBCC,onChange:a},C("bcc-email-field")))),t.createElement(ue,{label:(0,i._)("Priority")},t.createElement(A,M(p({value:e.emailPriority,onChange:m},C("priority-select")),{name:"emailPriority"}),Object.entries(pe).map(([o,c])=>t.createElement(A.Option,{key:o,value:o,label:c,"data-test-selected":e.emailPriority===o,"data-test-name":ge[o]})))),t.createElement(h,{label:(0,i._)("Subject"),controlsLayout:"stack"},t.createElement(x,p({name:"emailSubject",value:e.emailSubject,onChange:a},C("subject-field"))),t.createElement(T,{style:ie},(0,i._)("The email subject, recipients, and messages can include tokens that insert text based on the search results."),t.createElement("br",null),t.createElement(K,{to:$(),openInNewContext:!0},(0,i._)("Learn more")))),t.createElement(h,{label:(0,i._)("Message")},t.createElement(x,p({name:"emailMessage",value:e.emailMessage,onChange:a,rowsMin:8,rowsMax:10},C("message-field")))))}),Ee=d.div`
    width: 330px;
    margin-top: 10px;
`,xe=d(ee)`
    height: 14px;
    margin-right: 8px;
`,be={padding:"4px 0px"},ve=y(ne.filename);function it(e){let{onClick:r,loading:n}=e;return t.createElement(t.Fragment,null,!n&&t.createElement(Y,M(p({onClick:r},ve("send-test-email")),{label:(0,i._)("Send test email")})),n&&t.createElement(t.Fragment,null,t.createElement(xe,{size:"small"}),t.createElement(T,{style:be},(0,i._)("Sending test email"))))}function lt(e){let{showSuccess:r,onRequestRemove:n,errors:s,errorA11yToggle:a}=e;return t.createElement(Ee,null,t.createElement(q,{appearance:"fill",errors:s,errorA11yToggle:a,testName:"email-error-banner",errorHeader:H}),r&&t.createElement(F,{appearance:"fill",type:"success",onRequestRemove:n},(0,i._)("Test email sent")))}var B=async(e,r)=>{if(!e)return"";if(!/^((?:[^@\s]+@(?:[^@\s.]+\.)+[a-z]{2,})|(\$([\w.*#\- ]+)(?:\{([^}]+)\})?\$))(?:\s*[,;]\s*((?:[^@\s]+@(?:[^@\s.]+\.)+[a-z]{2,})|(\$([\w.*#\- ]+)(?:\{([^}]+)\})?\$)))*$/i.test(e.trim()))return r==="to"?G:r==="cc"?W:r==="bcc"?J:z;let s;try{s=await ae()}catch(m){return(0,i._)("Unable to contact the Splunk server for email domain validation")}if(s.trim().length===0)return"";let a=s.toLowerCase().replace(/\s/g,"").split(",");return a.includes("deny_all")?R:a.length===1&&a[0]==="allow_all"?"":e.split(/[,;]/).map(m=>m.trim()).some(m=>{let o=m.toLowerCase().split("@")[1];return!a.includes(o)})?R:""},dt=async({formState:e})=>{let{emailTo:r,emailBCC:n,emailCC:s,cronSchedule:a}=e,l={};r||(l.errorEmailTo=U);let[m,o,c]=await Promise.all([B(r,"to"),B(n,"bcc"),B(s,"cc")]);m&&(l.errorEmailTo=m),o&&(l.errorEmailBcc=o),c&&(l.errorEmailCc=c),a||(l.errorCron=X);let u=Object.values(l);return u.length?{isValid:!1,errors:u,errorFields:l}:{isValid:!0,errors:[],errorFields:{}}};export{g as a,ye as b,Te as c,ke as d,ce as e,de as f,Qe as g,h,ue as i,Ze as j,et as k,at as l,it as m,lt as n,dt as o};
