/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as b}from"./chunk-HKUHSW3U.js";import{b as T}from"./chunk-DJG2TOO6.js";import{b as y}from"./chunk-56RAFZKA.js";import"./chunk-SLMRV67W.js";import{a as n}from"./chunk-6VYXRB3E.js";import{a as L}from"./chunk-YO2THALI.js";import{B as M,C as S}from"./chunk-FZU5W2YM.js";import{a as u,i as a,j as e,l as r,n as s,o as t,p as o,q as f}from"./chunk-4NT7QVA7.js";import{a as C}from"./chunk-ZWC4ABI4.js";import"./chunk-IOZKLKL3.js";import"./chunk-243HL53J.js";import"./chunk-5I5EF6X3.js";import"./chunk-EMECN227.js";import"./chunk-DXRKKB2D.js";import"./chunk-JRWCA5GX.js";import"./chunk-KNKTAXQK.js";import"./chunk-6GUZBCIS.js";import"./chunk-7UAJTSFV.js";import"./chunk-REK4W3C7.js";import"./chunk-JHLB3KMN.js";var N={filename:"/builds/devplat/dashboard-enterprise/packages/enterprise-dashboard-dialogs/SaveWithComment.js",dirname:"/builds/devplat/dashboard-enterprise/packages/enterprise-dashboard-dialogs",relativefilename:"../enterprise-dashboard-dialogs/SaveWithComment.js",relativedirname:"../enterprise-dashboard-dialogs",line:0},P=r(s)`
    width: 600px;
`,A=r(L)`
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-top: ${t.variables.spacingXSmall};
`,H=r(s.Body)`
    padding: 20px 28px;
`,$=r(b)`
    > * {
        padding: 4px 8px;
    }
`,D=r(y)`
    label {
        padding-bottom: 0px;
    }
    margin-bottom: 0px;
    margin-top: ${t.variables.spacingMedium};
`,V=r.div`
    display: flex;
    flex-direction: column;
    margin-top: ${t.variables.spacingXSmall};
`,W=r(n)`
    font-size: 12px;
`,z=r(n)`
    font-size: 12px;
    color: ${t.variables.errorColorD10};
`,R=r(n)`
    margin-bottom: 0;
    font-weight: 500;
`,j=r(n)`
    font-size: 13px;
    color: ${t.variables.textGray};
`,k=C(N.filename),F=100,I=({commentLength:d})=>{let i=S(d);return e.createElement(z,null,i)},X=({open:d,onCloseModal:i,onSave:_,revertInformation:p,returnFocusRef:O})=>{let[c,g]=(0,a.useState)(""),[l,h]=(0,a.useState)(!1),[v,E]=(0,a.useState)(!1),w=(0,a.useCallback)((q,{value:x})=>{let B=x.length>F;h(B),g(x)},[]),m=(0,a.useCallback)(()=>{g(""),h(!1),E(!1),i()},[i]),G=(0,a.useCallback)(()=>{E(l),l||(_({comment:c,from:"dialog"}),m())},[_,m,c,l]);return e.createElement(P,{open:d,onRequestClose:m,returnFocus:O},e.createElement(s.Header,{title:(0,o._)("Add comment and save version")}),e.createElement(H,null,v?e.createElement(T,{appearance:"fill",errorA11yToggle:v,errors:[M]}):null,p&&e.createElement(A,null,e.createElement(n,null,(0,o._)("Revert version")),e.createElement(R,null,p.versionDate),e.createElement(j,null,p.versionMessage)),e.createElement(D,{label:(0,o._)("Comment"),labelPosition:"top",error:l},e.createElement($,{rowsMax:7,rowsMin:6,onChange:w,error:l})),e.createElement(V,null,e.createElement(W,null,(0,o._)("100 character limit")),l?e.createElement(I,{commentLength:c.length}):null)),e.createElement(s.Footer,null,e.createElement(f,u({appearance:"default",onClick:m,label:(0,o._)("Cancel")},k("modal-cancel"))),e.createElement(f,u({appearance:"primary",onClick:G,label:(0,o._)("Save")},k("modal-save")))))},fe=(0,t.withSplunkTheme)(X);export{fe as default};
