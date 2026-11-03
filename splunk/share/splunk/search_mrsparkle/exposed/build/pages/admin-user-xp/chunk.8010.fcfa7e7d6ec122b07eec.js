"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[8010],{7826:(e,t,n)=>{n.d(t,{S:()=>d});var a=n(96540),r=n(58156),i=n.n(r),l=n(52529),o=n.n(l),s=n(96514),c=n(12634);const d=({column:e,item:t,tableAttributes:n})=>{const r=(0,a.useMemo)((()=>e.renderer??(0,c.$)()),[e.renderer]),l=e.getValue?e.getValue(t,e.key,n):i()(t,e.key);return e.key===s.Q||e.key===s.q?null:a.createElement(o().Cell,{align:e.align,"data-testid":e.createCellTestId?.(l,t,n)},r(l,t,n))}},12634:(e,t,n)=>{n.d(t,{$:()=>r});var a=n(25805);const r=(e=a.RV)=>t=>e(t)},15047:(e,t,n)=>{n.d(t,{qB:()=>u});var a=n(96540),r=n(20259),i=n(73592),l=n.n(i),o=n(46105),s=n.n(o),c=n(78967);const d=n(99263).default.div`
    display: flex;
    gap: ${c.variables.spacingXSmall};
    align-items: center;
    cursor: pointer;
`,p=l().possibleCloseReasons.filter((e=>"contentClick"!==e)),u=({columnKey:e,header:t,content:n})=>a.createElement(l(),{toggle:a.createElement(d,null,t," ",a.createElement(s(),{"data-testid":`column-heading-filter-icon-${e}`,variant:"filled","aria-label":(0,r._)("Filter")})),defaultPlacement:"right",retainFocus:!0,closeReasons:p},n)},16685:(e,t,n)=>{n.d(t,{oh:()=>g});var a=n(96540),r=n(78598),i=n(86819),l=n.n(i),o=n(95293),s=n(78967);function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function d(e,t,n){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=typeof a)return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}const p=e=>{const t=document.createElement("span");t.textContent=e,document.body.appendChild(t)},u=(e,t,n)=>function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){d(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({theme:t,pageTitle:e,hideFooter:!0,hideAppBar:!0,layout:"scrolling",navLayout:"auto"},n?{themeFamily:n}:{}),g=({family:e="enterprise",density:t="comfortable",pageTitle:n,Component:i})=>{(0,r.Fo)().then((r=>{l()(a.createElement(s.SplunkThemeProvider,{family:e,colorScheme:r,density:t},a.createElement(o.A,null),a.createElement(i,null)),u(n,r,e))})).catch(p)}},18341:(e,t,n)=>{n.d(t,{W:()=>A});var a=n(96540),r=n(20259),i=n(30376),l=n(21973),o=n.n(l),s=n(24379),c=n.n(s),d=n(87149),p=n.n(d),u=n(63616),g=n.n(u),m=n(2404),f=n.n(m),b=n(78967),y=n(99263),v=n(94762),w=n.n(v);const h=y.default.div`
    margin-top: ${({withMarginTop:e})=>e?"18px":"0"};
    padding-bottom: ${b.variables.spacingSmall};
    display: flex;
    flex-flow: row wrap;
    gap: ${b.variables.spacingSmall};
    justify-content: flex-start;
    text-align: left;
`,E=y.default.div`
    max-width: ${({withMaxWidth:e})=>e?"60%":"none"};
    position: relative;
    display: flex;
    flex-grow: ${e=>e.long?"1":"0"};
    align-items: center;
    text-align: center;
`,S=y.default.div`
    max-width: 554px;
    margin-right: ${b.variables.spacingSmall};
    flex-grow: ${e=>e.long?"1":"0"};
`,x=y.default.div`
    display: flex;
    flex-grow: ${e=>e.long?"1":"0"};
    flex-wrap: wrap;
    gap: ${b.variables.spacingSmall};
    justify-content: flex-start;
    align-items: center;
`,P=(y.default.div`
    padding-bottom: ${b.variables.spacingSmall};
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
`,y.default.div`
    padding-top: ${b.variables.spacingSmall};
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
`),O=(0,y.default)(w())`
    margin-left: ${b.variables.spacingSmall};
`,k=y.default.div`
    margin-left: auto;
    display: flex;
    gap: ${b.variables.spacingSmall};
    align-items: center;
`,C=y.default.div`
    display: flex;
    flex-basis: 100%;
    justify-content: flex-end;
`,j=y.css`
    position: absolute;
    top: -26px;

    p.pagination-info-text {
        white-space: nowrap;
    }
`,R=y.default.div`
    ${({positionTop:e})=>e?j:"margin-left: 10px"}
`;var $=n(74460),T=n(54993),L=n(89304),_=n(93681);function D(){return D=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)({}).hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},D.apply(null,arguments)}const A=({isLoading:e,isSuccess:t,dataLength:n,actualParams:l,binders:s,children:d,getPaginationInfo:u=T.pX,modelLabelPlural:m=(0,r._)("Items"),middleElement:b,showSearch:y=!0,showPagingInfo:v=!0,showPaginator:w=!0,showCountSelector:j=!0,showFooterPaginator:A=!0,showNotFoundResetFilters:F=!0,styling:I={},appsData:N})=>{const M=v&&!!u,q=I.isPaginationInfoTopPosition&&M,K=w&&!!I.isPaginatorNextLine,W=e?a.createElement("span",{style:{marginLeft:10}},a.createElement(c(),{size:"small"})):M&&a.createElement("div",null,a.createElement(g(),{as:"p",variant:"body","data-testid":"object-count",className:"pagination-info-text"},u({skipItems:l.pagination?.skipItems,perPage:l.pagination?.perPage,totalItems:l.totalCount,modelLabelPlural:m}))),z=!f()(l,_.c);return a.createElement(a.Fragment,null,a.createElement(h,{"data-testid":"table-filter",withMarginTop:q},a.createElement(E,{long:I.isSearchLong&&y,withMaxWidth:q,"data-testid":"search-component"},y&&a.createElement(S,{long:I.isSearchLong},a.createElement(o(),s.bindSearch())),N?.length&&a.createElement(p(),D({},s.bindAppSelect(),{"data-testid":"app-selector"}),N.map((({label:e,value:t})=>a.createElement(p().Option,{key:t,label:e,value:t})))),a.createElement(R,{positionTop:q,"data-testid":"pagination-info"},W)),!!b&&a.createElement(x,{long:I.isSearchLong},b),l.totalCount>$.T[0]&&a.createElement(a.Fragment,null,(j||w&&!K)&&a.createElement(k,{"data-testid":"pagination-components"},j&&a.createElement(p(),D({menuStyle:{minWidth:160},"data-testid":"page-count-selector"},s.bindCountSelector()),$.T.map((e=>a.createElement(p().Option,{key:e,label:(0,i.nv)((0,r._)("%s Per Page"),e),value:e})))),w&&!K&&a.createElement(O,D({"data-testid":"paginator",alwaysShowLastPageLink:!0},s.bindPaginator()))),K&&a.createElement(C,{"data-testid":"top-paginator-next-line"},a.createElement(O,D({"data-testid":"paginator",alwaysShowLastPageLink:!0},s.bindPaginator()))))),d,F&&t&&0===n&&a.createElement(L.C,D({message:(0,i.nv)((0,r._)("No %s found"),m)},z&&{onReset:s.bindResetFilters()?.onReset})),A&&l.totalCount>0&&a.createElement(P,{"data-testid":"table-filter-footer"},W,l.totalCount>$.T[0]&&a.createElement(O,D({"data-testid":"paginator",alwaysShowLastPageLink:!0},s.bindPaginator()))))}},18781:(e,t,n)=>{n.d(t,{o:()=>C});var a=n(96540),r=n(99263),i=n(20259),l=n(78967),o=n(56143),s=n.n(o),c=n(52529),d=n.n(c),p=n(63616),u=n.n(p),g=n(24379),m=n.n(g),f=n(15047),b=n(96514),y=n(79278),v=n(7826),w=n(38196);const h=["onSortChange","sortKey","sortDirection","tableAttributes","isLoading","screenReaderLoadingText","bindTableHeadCell","loadingText","showNoResults","noResultComponent","config","data","createRowKey","getExpansionRow"];function E(){return E=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)({}).hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},E.apply(null,arguments)}function S(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function x(e,t,n){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=typeof a)return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}const P=r.default.div`
    padding: ${l.variables.spacingLarge};
    display: grid;
    place-items: center;
`,O=(0,r.default)(u())`
    padding-left: ${l.variables.spacingXSmall};
    vertical-align: top;
`,k=r.default.div`
    margin-top: ${l.variables.spacingLarge};
`,C=e=>{let{onSortChange:t,sortKey:n,sortDirection:r,tableAttributes:l,isLoading:o,screenReaderLoadingText:c,bindTableHeadCell:p,loadingText:u,showNoResults:g=!0,noResultComponent:C,config:j=[],data:R=[],createRowKey:$=y.v1,getExpansionRow:T}=e,L=function(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n={};for(var a in e)if({}.hasOwnProperty.call(e,a)){if(-1!==t.indexOf(a))continue;n[a]=e[a]}return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],-1===t.indexOf(n)&&{}.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}(e,h);const _=(0,a.useCallback)(((e,{sortKey:n})=>{t&&n&&t({sortKey:n,sortDir:(0,y.N3)(r)})}),[t,r]),D=(0,a.useMemo)((()=>j.find((e=>e.key===b.Q&&!1!==e.visible))),[j]),A=(0,a.useMemo)((()=>j.find((e=>e.key===b.q&&!1!==e.visible))?.rowSelection),[j]),F=(0,a.useMemo)((()=>j.filter((({visible:e})=>!1!==e))),[j]),I=(0,a.useMemo)((()=>D?[a.createElement(w._,{key:"actionsHeadCell"})]:void 0),[D]),N=(0,a.useMemo)((()=>function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?S(Object(n),!0).forEach((function(t){x(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):S(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({width:"100%"},L.tableStyle)),[L]),M=F.filter((e=>e.key!==b.Q&&e.key!==b.q)),q=M.length+(A?1:0),K=(0,a.useCallback)(((e,t)=>{if(T)return a.createElement(d().Row,{key:`${e}-expansion`},a.createElement(d().Cell,{style:{borderTop:"none"},colSpan:q},T(t)))}),[q,T]);return a.createElement(d(),E({actionsColumnWidth:I?48:void 0,actions:I},L,{onRequestToggleAllRows:A?.onRequestToggleAllRows,rowSelection:A?.state,tableStyle:N}),a.createElement(d().Head,null,M.map((e=>{const t=e.sortKey||String(e.key);return a.createElement(d().HeadCell,E({key:String(e.key),onSort:e.sortable?_:void 0,sortKey:e.sortable?t:void 0,sortDir:(0,y.Qp)(r,n,e.key,e.sortable),"data-testid":e.columnTestId,width:e.width??"auto",align:e.align,truncate:e.truncate??!1,tooltip:e.headerTooltipText},e.sortable&&p?p(t):{}),e.columnFilterContent?a.createElement(f.qB,{columnKey:String(e.key),header:e.header,content:e.columnFilterContent}):e.header)}))),a.createElement(d().Body,null,!R.length&&!o&&g&&a.createElement(d().Row,null,a.createElement(d().Cell,{colSpan:q,align:"center"},a.createElement(P,null,C||a.createElement(s(),{"data-testid":"not-results-message"},(0,i._)("No results"))))),o&&a.createElement(d().Row,{key:"loading","data-testid":"table-row-loading"},a.createElement(d().Cell,{colSpan:q,align:"center"},a.createElement(k,null,a.createElement(m(),{screenReaderText:c??(0,i._)("Loading"),size:"medium"}),u&&a.createElement(O,{as:"span","data-testid":"table-loading-text"},u)))),!o&&R.map(((e,t)=>{const n=$(e,t);return a.createElement(d().Row,{key:n,data:e,actionsSecondary:D?.renderer?.(void 0,e,l),expansionRow:K(n,e),selected:A?.isRowSelected(e,t),disabled:A?.isRowSelectionDisabled?.(e,t),onRequestToggle:A?()=>A.onRequestToggleRow(e,t):void 0,rowScreenReaderText:A?.createRowScreenReaderText?.(e,t)},M.map((t=>a.createElement(v.S,{key:String(t.key),column:t,item:e,tableAttributes:l}))))}))))}},22126:(e,t,n)=>{n.d(t,{A1:()=>c,GP:()=>o,Gf:()=>s});var a=n(39643),r=n.n(a),i=n(78967),l=n(99263);const o=l.default.div`
    padding: ${i.variables.spacingLarge};
    ${e=>e.zeroBottomPadding&&"padding-bottom: 0;"}
`,s=l.default.div`
    float: right;
`,c=(0,l.default)(r())`
    margin-top: 0;
    margin-bottom: ${i.variables.spacingSmall};
    overflow-wrap: anywhere;
    display: flex;
    gap: ${i.variables.spacingMedium};
`},38196:(e,t,n)=>{n.d(t,{_:()=>s});var a=n(96540),r=n(99263),i=n(23840),l=n.n(i);const o=r.default.div`
    height: 100%;
    padding-right: 8px;
    display: grid;
    justify-content: center;
    place-items: center;
`,s=()=>a.createElement(o,null,a.createElement(l(),{variant:"filled"}))},53652:(e,t,n)=>{n.d(t,{A:()=>c});var a=n(96540),r=n(59421),i=n.n(r),l=n(56143),o=n.n(l),s=n(22126);const c=({header:e,description:t,externalLink:n,pageControls:r,styling:l={}})=>a.createElement(s.GP,{"data-testid":"header-section",zeroBottomPadding:l.zeroBottomPadding},r&&a.createElement(s.Gf,{"data-test":"header-page-controls"},r),a.createElement(s.A1,{"data-testid":"page-header",level:1},e),t&&"string"==typeof t&&a.createElement(o(),{"data-testid":"page-description",style:{maxWidth:"700px"}},t)||a.createElement(a.Fragment,null,t),n&&a.createElement(i(),{to:n.url,openInNewContext:!0,"data-testid":"help-link"},n.text))},79278:(e,t,n)=>{n.d(t,{N3:()=>r,Qp:()=>i,v1:()=>l});var a=n(76348);const r=e=>e===a.W.ASC?a.W.DESC:a.W.ASC,i=(e,t,n,r=!1)=>{if(r)return e&&n===t?e===a.W.ASC?"asc":"desc":"none"},l=(e,t)=>String(t)},89304:(e,t,n)=>{n.d(t,{C:()=>u});var a=n(96540),r=n(99263),i=n(78967),l=n(59421),o=n.n(l),s=n(20259),c=n(56143),d=n.n(c);const p=r.default.div`
    padding: ${i.variables.spacingLarge};
    display: grid;
    place-items: center;
`,u=({message:e=(0,s._)("No items found"),onReset:t})=>a.createElement(p,null,a.createElement(d(),{"data-testid":"not-found-message"},e),t&&a.createElement(o(),{onClick:e=>{e.preventDefault(),t()}},(0,s._)("Reset filters")))},95293:(e,t,n)=>{n.d(t,{A:()=>l});var a=n(99263),r=n(78967),i=n(152);const l=a.createGlobalStyle`
    body {
        margin: 0;
        background-color: ${r.variables.backgroundColorPage};
        font-family: ${r.variables.fontFamily};
        font-size: ${r.variables.fontSize};
        color: ${r.variables.contentColorDefault};
        min-width: ${i.Mu};
    }

    // Input overrides because of conflicting styles between our bootstrap css files and SUI
    // can be removed once we remove bootstrap-{theme}.css (ie whenever we handle layout-api being rendered by backbone) 
    input[type=color], input[type=date], input[type=datetime-local], input[type=datetime], input[type=email], input[type=month], input[type=number], input[type=password], input[type=search], input[type=tel], input[type=text], input[type=time], input[type=url], input[type=week], textarea {
        height: auto;
        margin-bottom: 0;
        padding: 0;
        &:focus {
            box-shadow: none;
        }
    }
`},96514:(e,t,n)=>{n.d(t,{Q:()=>a,q:()=>r});const a="actions",r="rowSelection"}}]);
//# sourceMappingURL=chunk.8010.fcfa7e7d6ec122b07eec.js.map