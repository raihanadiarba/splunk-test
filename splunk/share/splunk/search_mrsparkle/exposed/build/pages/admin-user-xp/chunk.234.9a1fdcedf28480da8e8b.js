"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[234],{152:(e,t,a)=>{a.d(t,{FM:()=>i,Mu:()=>n});const n="960px",i="912px"},25805:(e,t,a)=>{a.d(t,{RV:()=>n});a(64531),a(20259);const n=e=>String(e??"")},70466:(e,t,a)=>{a.d(t,{o:()=>U});var n=a(96540),i=a(57914),l=a.n(i),d=a(56143),s=a.n(d),r=a(75602),o=a(18781),c=a(18341),u=a(152),p=a(63459),m=a.n(p),g=a(20259);const b={TYPE:(0,g._)("Type"),INPUTS:(0,g._)("Inputs"),ACTIONS:(0,g._)("Actions")},f={ADD_NEW:(0,g._)("Add new")};var h=a(39643),v=a.n(h),w=a(70181),I=a.n(w),E=a(78967),T=a(99263);const _=T.default.div`
    display: grid;
    gap: ${E.variables.spacingSmall};
    padding: ${E.variables.spacingLarge};
    justify-content: center;
`,S=T.default.div`
    display: grid;
    gap: ${E.variables.spacingXSmall};
`,k=(0,T.default)(v())`
    margin: 0;
`,y=(0,T.default)(s())`
    margin: 0;
    max-width: 700px;
`,C=T.default.div`
    ${({$hideHeader:e})=>e&&T.css`
            thead {
                display: none;
            }
        `}

    tbody td {
        padding: ${E.variables.spacingLarge} ${E.variables.spacingSmall};
        vertical-align: top;
        background-color: ${E.variables.backgroundColorPage};
    }
`,P=T.default.div`
    display: flex;
    flex-direction: column;
    gap: ${E.variables.spacingXSmall};
`,$=T.default.div`
    color: ${E.variables.contentColorDefault};
    font-size: ${E.variables.fontSize};
`,A=T.default.div`
    min-width: 0;
`,L=T.default.div`
    width: 100%;
    text-align: right;
`,D=(0,T.default)(I())`
    margin: -${E.variables.spacingSmall} 0;
`;var x=a(61038);const F=e=>(t,a)=>{const{action:i}=a;if(!i)return"";if("add"===i)return n.createElement(L,null,n.createElement(D,{appearance:"subtle","data-testid":a.actionTestId??(0,x.$f)(a.id),icon:n.createElement(m(),null),to:(0,x.Aq)(a.destination,e)},f.ADD_NEW));const l=i.destination?(0,x.eA)(i.destination,e):(0,x.eA)(a.destination,e),d=i.label??f.ADD_NEW,s=void 0===i.label?n.createElement(m(),null):void 0;return n.createElement(L,null,n.createElement(D,{appearance:"subtle","data-testid":i.testId??a.actionTestId??(0,x.$f)(a.id),icon:s,to:l},d))};var N=a(59421),M=a.n(N);const W=r.app||"launcher",R=({children:e,pagination:t,rowsLength:a})=>n.createElement(c.W,{actualParams:t.actualParams,binders:t.binders,dataLength:t.dataLength??a,getPaginationInfo:t.getPaginationInfo,isLoading:t.isLoading??!1,isSuccess:t.isSuccess??!0,modelLabelPlural:t.modelLabelPlural,showCountSelector:!1,showFooterPaginator:!1,showNotFoundResetFilters:!1,showSearch:!1},e),U=({ariaLabel:e,dataTestId:t="links-table",description:a,emptyMessage:i,error:d=!1,errorMessage:r,isLoading:c=!1,labels:p,loadingMessage:m,pagination:g,rows:f,tableTestId:h,title:v,width:w=u.FM})=>{const I=(0,n.useMemo)((()=>((e,t)=>{const a=[{key:"title",header:e?.type??b.TYPE,renderer:(i=W,(e,t)=>n.createElement(P,null,n.createElement(M(),{to:(0,x.eA)(t.destination,i),appearance:"standalone","data-testid":t.linkTestId??(0,x.hP)(t.id)},t.title),t.description&&n.createElement($,null,t.description)))}];var i;return(0,x.gn)(t)&&a.push({key:"count",header:e?.inputs??b.INPUTS,width:120,renderer:(e,t)=>n.createElement(A,null,t.count??""),createCellTestId:(e,t)=>t.inputsTestId??(0,x.UY)(t.id)}),(0,x.l$)(t)&&a.push({key:"action",header:e?.actions??b.ACTIONS,width:220,renderer:F(W)}),a})(p,f)),[p,f]),E=!c&&!d&&(0,x.oz)(f),T=d?r&&n.createElement(l(),{type:"error"},r):i&&("string"==typeof(L=i)?n.createElement(s(),null,L):L);var L;const D=n.createElement(C,{$hideHeader:E},n.createElement(o.o,{"aria-label":e,config:I,createRowKey:e=>e.id,data:d?[]:f,"data-testid":h,isLoading:c&&!d,loadingText:m,noResultComponent:T,screenReaderLoadingText:m,tableStyle:{width:w}})),N=!d&&g&&g.actualParams.totalCount>0?n.createElement(R,{pagination:g,rowsLength:f.length},D):D;return n.createElement(_,{"data-testid":t},(v||a)&&n.createElement(S,null,v&&n.createElement(k,{level:2},v),a&&n.createElement(y,null,a)),N)}},74460:(e,t,a)=>{a.d(t,{D:()=>i,T:()=>n});const n=[10,25,50,100],i={currentPage:1,perPage:n[0],skipItems:0,totalItems:0}},76348:(e,t,a)=>{a.d(t,{W:()=>n});let n=function(e){return e.ASC="asc",e.DESC="desc",e}({})},86483:(e,t,a)=>{a.d(t,{r5:()=>i,sx:()=>l});var n=a(75602);let i=function(e){return e.OpenPage="page was opened",e.CreateItem="item was created",e.FailedToCreateItem="failed to create item",e.UpdateItem="item was updated",e.FailedToUpdateItem="failed to update item",e.CloneItem="item was cloned",e.FailedToCloneItem="failed to clone item",e.DeleteItem="item was deleted",e.FailedToDeleteItem="failed to delete item",e.EnableItem="item was enabled",e.FailedToEnableItem="failed to enable item",e.DisableItem="item was disabled",e.FailedToDisableItem="failed to disable item",e.ValidationOk="validation was successful",e.ValidationFailed="validation failed",e}({});const l=(e,t,a={})=>{window._splunk_metrics_events&&window._splunk_metrics_events.push({type:e,data:{app:n.app,pageAction:t,page:window.location.pathname,custom:a}})}},93681:(e,t,a)=>{a.d(t,{c:()=>l});var n=a(74460),i=a(76348);const l={searchQuery:"",pagination:{skipItems:0,perPage:n.T[0]},sorting:null,totalCount:0};i.W.ASC}}]);
//# sourceMappingURL=chunk.234.9a1fdcedf28480da8e8b.js.map