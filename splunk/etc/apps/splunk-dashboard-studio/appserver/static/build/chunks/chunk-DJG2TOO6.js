/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as f}from"./chunk-SLMRV67W.js";import{w as c}from"./chunk-FZU5W2YM.js";import{e as _,f as u,i as d,j as e,l as a,p as r}from"./chunk-4NT7QVA7.js";import{a as p}from"./chunk-5I5EF6X3.js";import{h as i}from"./chunk-JHLB3KMN.js";var o=i(p(),1),I=i(p(),1),x={};_(x,{default:()=>s});u(x,I);var g,v,s=(v=(g=o.default)==null?void 0:g.default)!=null?v:o.default,L=a(s)`
    margin-bottom: 0px;
    margin-top: 3px;
`,h=a(f)`
    > [data-test='content'] {
        display: inline;
    }
`,S=a.div`
    display: block;
`,b=({errors:t,errorA11yToggle:y,appearance:E="default",testName:M,errorHeader:l})=>{let n=(0,d.useMemo)(()=>t.length?t.length===1?t[0]:l!=null?l:(0,r._)("Please correct the following errors: "):"",[t,l]);return n?e.createElement(h,{appearance:E,type:"error","aria-live":"assertive",role:"alert","aria-atomic":!0,"data-test-name":M},e.createElement(S,null,(0,r._)(n),y?"":c,t.length>1&&e.createElement(L,null,t.map(m=>e.createElement(s.Item,{key:m},(0,r._)(m)))))):e.createElement(e.Fragment,null)},P=b;export{s as a,P as b};
