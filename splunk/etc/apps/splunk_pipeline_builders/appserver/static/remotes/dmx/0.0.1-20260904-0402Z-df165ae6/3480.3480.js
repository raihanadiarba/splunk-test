/*! For license information please see 3480.3480.js.LICENSE.txt */
"use strict";(self.webpackChunkdmx=self.webpackChunkdmx||[]).push([[3480],{53259(e,t,n){var a=n(85959),i=n.n(a),l=n(53209),s=n(33199),r=n(60652),o=n(21906),d=n(67556);n.d(t,["A",0,({onPipelineMenuItemClick:e,isLoading:t=!1})=>{const{isEdgeProcessorSubscribed:n,isCloudProcessorSubscribed:c}=(0,o.Pm)(),u=(0,a.useMemo)(()=>n&&c?[{key:"edge-processor-pipeline",itemLabel:`${r.fI} pipeline`,itemOnClick:()=>e({selectedRuntime:s.jM})},{key:"cloud-processor-pipeline",itemLabel:`${r.Pb} pipeline`,itemOnClick:()=>e({selectedRuntime:s.fU})}]:[],[c,n,e]);return i().createElement(d.l,{dropdownItems:u,label:l.t`New pipeline`,data_test:"create-pipeline-button",isLoading:t,onClick:()=>{e({selectedRuntime:c?s.fU:s.jM})}})},"F",0,({onTemplateMenuItemClick:e,onPipelineMenuItemClick:t})=>{const n=(0,a.useMemo)(()=>[{key:"using-blank-pipeline",itemLabel:"Using a blank pipeline",itemOnClick:t},{key:"using-template",itemLabel:"Using a template",itemOnClick:e}],[t,e]);return i().createElement(d.l,{dropdownItems:n,label:l.t`New pipeline`})}])},32508(e,t,n){var a=n(85959),i=n.n(a),l=n(53209),s=n(39318),r=n(69131),o=n(93060),d=n(53259);n.d(t,["W",0,()=>{const{failure:e}=(0,o.d)(),[t,n]=(0,a.useState)(!1),c=(0,s.Jr)(),u=(0,r.yI)(),p=(0,a.useCallback)(async t=>{try{n(!0),await u(t),c?.track(s.Z2.createPipeline,{selectedRuntime:t.selectedRuntime}),n(!1)}catch(t){n(!1),e({title:l.t`Unable to create draft pipeline`,error:t})}},[u,e,n,c]);return i().createElement(d.A,{onPipelineMenuItemClick:p,isLoading:t})}])},69131(e,t,n){var a=n(85959),i=n(47444),l=n(33199),s=n(72478),r=n(3990),o=n(39318),d=n(83993),c=n(56299);const u=()=>(0,i.Zs)(({refresh:e})=>()=>{e(c.a2),e(c.ZN),e(c.nd)},[]),p=()=>(0,i.Zs)(({refresh:e})=>t=>{e((0,c.Zt)(t))},[]);n.d(t,["Cp",0,()=>{const e=p();return(0,a.useCallback)(async t=>{const n=await(0,d.EO)().publishPipelineSpecFile(t);return e(t),n},[e])},"Df",0,()=>{const e=u();return(0,a.useCallback)(async t=>{const n=await(0,d.EO)().saveDraftPipelineSpec(t);return e(),n},[e])},"LA",0,u,"Qo",0,p,"Tj",0,()=>{const e=u(),t=p();return(0,a.useCallback)(async(n,a)=>{const i=await(0,d.EO)().updatePipelineSpecMetadata(n,a);return e(),t(n),i},[t,e])},"_p",0,()=>{const e=u(),t=p();return(0,a.useCallback)(async n=>{await(0,d.EO)().deletePipelineSpec(n),e(),t(n)},[t,e])},"kB",0,()=>{const e=u(),t=p();return(0,a.useCallback)(async n=>{const a=await(0,d.EO)().saveDraftPipelineSpec(n);return e(),t(n.id),a},[t,e])},"nI",0,()=>{const e=p();return(0,a.useCallback)(async t=>{const n=await(0,d.EO)().unpublishPipelineSpecFile(t);return e(t),n},[e])},"yI",0,()=>{const{history:e}=(0,s.p)(),{editPipeline:t}=(0,r.hI)(),n=(0,o.Jr)();return(0,a.useCallback)(async({selectedRuntime:a=l.jM,...i}={})=>{const{id:s}=await(0,d.EO)().createDraftPipelineSpec({runtimeProfile:a});n?.track(o.Z2.applyPipelineToNodesIP,{pipelineSpecId:s}),e.push(t({id:s}),null,i)},[e,t,n])}])},43480(e,t,n){n.r(t),n.d(t,{Destination:()=>fe,default:()=>Ee});var a=n(85959),i=n.n(a),l=n(26250),s=n.n(l),r=n(53209),o=n(89629),d=n(50571),c=n(75869),u=n(18636),p=n(26223),m=n(6388),h=n(31444),f=n(27265),E=n(44956),g=n.n(E),b=n(39643),y=n.n(b),x=n(80128),k=n.n(x),C=n(56143),v=n.n(C),S=n(25338),w=n.n(S),A=n(63616),I=n.n(A),D=n(78967),F=n(39318),P=n(51625),M=n(30770),B=n(42963),N=n(38945),L=n(3239),Q=n(12843),R=n(18612),T=n(69538),H=n(72478),O=n(3990),$=n(72218),K=n(59082),j=n(75981),V=n(23170);const U=(0,M.Vo)(u.HECExporterDatasetKind.Hecexporter),W=["name","kind","endpoint","token"],z=[...W,"clientPrivateKey","clientCertificate","caCertificate"],G=[{name:"clientPrivateKey",value:""},{name:"clientCertificate",value:""},{name:"caCertificate",value:""}],q=s().div`
    display: inline;
    color: ${D.variables.contentColorActive};
`,J=s()(w())`
    &:disabled {
        color: ${D.variables.contentColorDefault} !important;
    }
`,Z=(e,t)=>({name:e?.name||"",kind:u.HECExporterDatasetKind.Hecexporter,description:e?.description||"",endpoint:e?.endpoint||"",tlsEnabled:!e||!!e.clientCertificate||!!e.caCertificate,token:e?.token||"",source:e?.source||"",sourcetype:e?.sourcetype||"",index:e?.index||"",clientPrivateKey:e?.clientPrivateKey||"",clientCertificate:e?.clientCertificate||"",caCertificate:e?.caCertificate||"",...t?{type:e?.type?.split(" | ")??[f.sW.Logs]}:{}}),Y=({destination:e})=>{const{showDMXEPMetricsDestination:t,showSupportedDatatypes:n}=(0,T.h)(),{history:l,toast:{postToast:s}}=(0,H.p)(),{formState:o,dispatch:d}=(0,K.qt)(Z(e,n)),[c,u]=(0,a.useState)(),E=(0,B.Cc)(),b=(0,B.$M)(),[x,C]=(0,a.useState)(!1),S=(0,a.useMemo)(()=>o.fields.tlsEnabled?z:W,[o.fields.tlsEnabled]),A=!!e,D=A&&!!e?.index,Y=(0,a.useRef)(Z(e,n)).current,{destinations:X}=(0,O.hI)(),_=(0,R.G)(),ee=(0,F.Jr)(),te=(0,a.useCallback)(async()=>{if(x||!o.isFormValid)return;if(!(0,M.vB)(o.fields,S)){const e=S.reduce((e,t)=>(e.push({name:t,value:o.fields[t],options:{checkNull:!0}}),e),[]);return void(0,K.wf)(d,e)}if(!o.isFormDirty)return;const t=A?(0,R.VW)(o,n):(0,R.N6)(o.fields,n,_);t.caCertificate&&(t.caCertificate=`${t.caCertificate}\n-----BEGIN CERTIFICATE-----\nMIIDjjCCAnagAwIBAgIQAzrx5qcRqaC7KGSxHQn65TANBgkqhkiG9w0BAQsFADBh\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBH\nMjAeFw0xMzA4MDExMjAwMDBaFw0zODAxMTUxMjAwMDBaMGExCzAJBgNVBAYTAlVT\nMRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\nb20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IEcyMIIBIjANBgkqhkiG\n9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuzfNNNx7a8myaJCtSnX/RrohCgiN9RlUyfuI\n2/Ou8jqJkTx65qsGGmvPrC3oXgkkRLpimn7Wo6h+4FR1IAWsULecYxpsMNzaHxmx\n1x7e/dfgy5SDN67sH0NO3Xss0r0upS/kqbitOtSZpLYl6ZtrAGCSYP9PIUkY92eQ\nq2EGnI/yuum06ZIya7XzV+hdG82MHauVBJVJ8zUtluNJbd134/tJS7SsVQepj5Wz\ntCO7TG1F8PapspUwtP1MVYwnSlcUfIKdzXOS0xZKBgyMUNGPHgm+F6HmIcr9g+UQ\nvIOlCsRnKPZzFBQ9RnbDhxSJITRNrw9FDKZJobq7nMWxM4MphQIDAQABo0IwQDAP\nBgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBhjAdBgNVHQ4EFgQUTiJUIBiV\n5uNu5g/6+rkS7QYXjzkwDQYJKoZIhvcNAQELBQADggEBAGBnKJRvDkhj6zHd6mcY\n1Yl9PMWLSn/pvtsrF9+wX3N3KjITOYFnQoQj8kVnNeyIv/iPsGEMNKSuIEyExtv4\nNeF22d+mQrvHRAiGfzZ0JFrabA0UWTW98kndth/Jsw1HKj2ZL7tcu7XUIOGZX1NG\nFdtom/DzMNU+MeKNhJ7jitralj41E6Vf8PlwUHBHQRFXGU7Aj64GxJUTFy8bJZ91\n8rGOmaFvE7FBcf6IKshPECBV1/MUReXgRPTqh5Uykw7+U0b6LJ3/iyK5S9kJRaTe\npLiaWN0bfVKfjllDiIGknibVb63dDcY3fe0Dkhvld1927jyNxF1WW6LZZm6zNTfl\nMrY=\n-----END CERTIFICATE-----`),C(!0);try{const n=A?await b(t,e.id):await E(t);C(!1),s({type:"success",message:r.t`${n.name} was successfully ${A?"updated":"added"}`}),l.push(X()),ee?.track(F.Z2.saveDestination,{destinationType:n.kind,destinationName:n.name})}catch(e){C(!1);const t={title:r.t`Failed to ${A?r.t`update`:r.t`create`} destination`,message:e.message,details:e.details};e.httpStatusCode&&409===e.httpStatusCode&&(t.message=r.t`Name must be unique`),u(t)}},[x,o,S,A,n,_,d,b,e?.id,E,s,l,X,ee]),ne=(0,a.useCallback)(()=>{l.push(X())},[l,X]);return i().createElement(i().Fragment,null,i().createElement(p.NF,null,i().createElement(p.n8,null,i().createElement(p.Y9,{heading:e?r.t`Edit ${e.name}`:r.t`Add a Splunk platform destination that uses HEC`,subtitle:e?r.t`Edit destination information`:i().createElement(i().Fragment,null,r.t`Create a destination to send data to Splunk Cloud Platform or Splunk Enterprise using the ${U}. `,i().createElement($.jd,{location:"destination.hec_top"},r.t`HEC destination documentation`))}),c&&i().createElement(h.K,{error:c}),i().createElement(v(),null,r.t`* indicates a required field`),i().createElement(p.PZ,null,i().createElement(y(),{level:3},r.t`Destination information`),i().createElement(P.IF,{label:r.t`Name`,labelPosition:"left",help:A?null:(0,R.U_)(o.errorFields?.name,o.fields.name),labelWidth:200,error:!!o.errorFields?.name,required:!0},A?i().createElement(I(),{as:"p",variant:"body",color:"active",lineHeight:"comfortable","data-test":"name-text-value"},e.name):i().createElement(w(),{"data-test":"dataset-name",value:o.fields.name,name:"name",onChange:(e,t)=>{(0,K.Bx)(d,{...t,options:{checkNull:!0,checkRegex:new RegExp(m.y9)}})},error:!!o.errorFields?.name,maxLength:80})),i().createElement(P.IF,{label:r.t`Description`,labelPosition:"left",help:r.t`Maximum 250 characters (${o.fields.description.length}/250)`,labelWidth:200},i().createElement(w(),{"data-test":"description",name:"description",value:o.fields.description,onChange:(e,t)=>{(0,K.t5)(d,t)},maxLength:250})),n&&i().createElement(P.IF,{label:r.t`Data type`,labelPosition:"left",labelWidth:200},i().createElement(k(),{"data-test":"supportedDatatype",values:o.fields.type,onChange:(e,t)=>{(0,K.Bx)(d,{name:"type",value:t.values,options:{checkNull:!0}})},placeholder:"Select data types",error:!!o.errorFields?.type,compact:!0,filter:!1},Object.keys(f.sW).map(e=>i().createElement(k().Option,{key:e,label:e,value:f.sW[e],disabled:(0,R.sz)(e,Y?.type)&&A}))))),i().createElement(p.PZ,null,i().createElement(y(),{level:3},r.t`Connection settings`),i().createElement(P.IF,{label:r.t`Protocol`,labelPosition:"left",labelWidth:200},i().createElement(I(),{as:"p",variant:"body",color:"active","data-test":"protocol-text-value"},U)),i().createElement(P.IF,{label:r.t`HEC URI`,labelPosition:"left",required:!0,labelWidth:200,error:!!o.errorFields?.endpoint,help:(0,R.AA)(o.errorFields?.endpoint)},i().createElement(w(),{"data-test":"endpoint",name:"endpoint",value:o.fields.endpoint,onChange:(e,t)=>{(0,K.Bx)(d,{...t,options:{checkNull:!0,checkRegex:new RegExp(j._r)}})},maxLength:250,error:!!o.errorFields?.endpoint})),i().createElement(P.IF,{label:r.t`Default HEC token`,labelWidth:200,labelPosition:"left",tooltip:i().createElement(P.sQ,null,r.t`The HEC token used to send events from this destination to The Splunk Platform, if the event is not already associated with a HEC token.`),error:!!o.errorFields?.token,help:(0,R.eA)(o.errorFields?.token),required:!0},i().createElement(w(),{"data-test":"token",name:"token",value:o.fields.token,onChange:(e,t)=>{(0,K.Bx)(d,{...t,options:{checkNull:!0,checkRegex:new RegExp(j.Hh)}})},error:!!o.errorFields?.token,maxLength:250})),i().createElement(P.IF,{label:r.t`Default source`,labelPosition:"left",tooltip:i().createElement(P.sQ,null,r.t`The source assigned to the events that are sent through this destination, if the event does not already specify a source.`),labelWidth:200},i().createElement(w(),{"data-test":"source",name:"source",value:o.fields.source,onChange:(e,t)=>{(0,K.t5)(d,t)},maxLength:250})),i().createElement(P.IF,{label:r.t`Default source type`,labelPosition:"left",tooltip:i().createElement(P.sQ,null,r.t`The source type assigned to the events that are sent through this destination, if the event does not already specify a source type.`),labelWidth:200},i().createElement(w(),{"data-test":"sourcetype",name:"sourcetype",value:o.fields.sourcetype,onChange:(e,t)=>(0,K.t5)(d,t),maxLength:250})),t?i().createElement(i().Fragment,null,D&&i().createElement(P.IF,{label:r.t`Default index`,labelPosition:"left",help:i().createElement(q,null,r.t`The Default index option is deprecated and will be removed at a later date. Use the pipeline SPL2 to specify an index to use. See `,i().createElement($.jd,{location:"hec.index_precedence"},r.t`Index precedence order when using HEC`),r.t` for more information.`),labelWidth:200,tooltip:i().createElement(P.sQ,null,r.t`The index assigned to the events that are sent through this destination, if the event does not already specify an index.`)},i().createElement(J,{"data-test":"index",name:"index",value:o.fields.index,onChange:(e,t)=>(0,K.t5)(d,t),maxLength:250,disabled:!0}))):i().createElement(P.IF,{label:r.t`Default index`,labelPosition:"left",labelWidth:200,tooltip:i().createElement(P.sQ,null,r.t`The index assigned to the events that are sent through this destination, if the event does not already specify an index.`)},i().createElement(w(),{"data-test":"index",name:"index",value:o.fields.index,onChange:(e,t)=>(0,K.t5)(d,t),maxLength:250})),!A&&i().createElement(P.IF,{label:r.t`Mutually authenticated TLS (mTLS)`,labelWidth:200,labelPosition:"left",tooltip:i().createElement(P.sQ,null,r.t`Required only when sending data to a Splunk Enterprise indexer that has the enableSSL setting set to "1" in the inputs.conf file.`),help:i().createElement(i().Fragment,null,r.t`When sending data to a Splunk Enterprise indexer that requires connecting clients to authenticate themselves using TLS certificates, you must turn on this setting and then upload the private key and certificates for proving the identity of your Edge Processor.`," ",i().createElement($.jd,{location:"destination.hec_tls"},r.t`HEC mTLS documentation`))},i().createElement(g(),{"data-test":"tlsEnabled",key:"tlsEnabled",onChange:(e,{checked:t})=>{(0,K.t5)(d,{name:"tlsEnabled",value:t}),(0,K.z6)(d,G)},checked:o.fields.tlsEnabled},r.t`Authenticate identity using TLS certificates`)),i().createElement(Q.dF,{isEdit:A,isTLSEnabled:o.fields.tlsEnabled,hasExistingTLSConfig:!!e?.clientCertificate||!!e?.caCertificate,credentialsVersion:V.z7.splunkEnterprise},i().createElement(N.E,{errorState:o.errorFields,dispatch:d}),i().createElement(L.Ve,{tooltip:r.t`Required only when sending data to a Splunk Enterprise indexer that has the enableSSL setting set to "1" in the inputs.conf file.`,dispatch:d}),i().createElement(L.qS,{tooltip:r.t`Required only when sending data to a Splunk Enterprise indexer that has the enableSSL setting set to "1" in the inputs.conf file.`,dispatch:d}),i().createElement(L.OF,{tooltip:r.t`Required only when sending data to a Splunk Enterprise indexer that has the enableSSL setting set to "1" in the inputs.conf file.`,dispatch:d}))))),i().createElement(p.y2,null,i().createElement(p.wi,{handleAdd:te,handleCancel:ne,primaryBtnLabel:e?r.t`Save`:r.t`Add`})))};var X=n(1744),_=n(67171),ee=n(68296),te=n(70181),ne=n.n(te),ae=n(32508);const ie=({title:e,message:t,onCancel:n,open:a=!1,secondaryButtonLabel:l=r.t`Cancel`})=>i().createElement(P.vq,{width:"512px",divider:"both",open:a,className:ee.HN,returnFocus:()=>!0,onRequestClose:n,"data-test":"create-pipeline-modal"},i().createElement(P.vq.Header,{title:e}),i().createElement(P.vq.Body,null,i().createElement(P.jt,null,t)),i().createElement(P.vq.Footer,null,i().createElement(ne(),{"data-test":"confirm-modal-cancel-button",appearance:"subtle",onClick:n,label:l}),i().createElement(ae.W,null))),le=({destination:e})=>{const[t,n]=(0,a.useState)(!1),l=!!e,{history:s,toast:{postToast:o}}=(0,H.p)(),{destinations:d}=(0,O.hI)(),c=(0,X.EY)(),u=(0,a.useCallback)(e=>{o({type:"success",message:r.t`${e.name} was successfully ${l?"updated":"added"}`}),s.push(d())},[s,l,o,d]),p=(0,a.useCallback)(async e=>{if(l)u(e);else try{1===(await c()).length?n(!0):u(e)}catch(t){u(e)}},[l,u,c,n]),m=(0,a.useCallback)(()=>{n(!1),s.push(d())},[s,d]),h=(0,a.useCallback)(()=>i().createElement(ie,{title:r.t`Splunk Observability Cloud destination created`,message:r.t`Create a pipeline in order to send metrics to Splunk Observability Cloud`,open:t,onCancel:m,secondaryButtonLabel:r.t`Go to Destinations`}),[t,m]);return i().createElement(i().Fragment,null,i().createElement(_.e,{destination:e,onSuccess:p,onCancel:m}),h())};var se=n(89967),re=n(21906),oe=n(88259),de=n(68514),ce=n(56299),ue=n(28592),pe=n(79676),me=n(41956);const he=s()(c.gZ)`
    flex: 1 1 auto;
    min-height: 0;
`,fe=({destinationName:e,kind:t})=>{const{onNavigate:n}=(0,oe.c)(),{destinations:l}=(0,O.hI)(),{history:s,tenantName:c}=(0,H.p)(),m=(0,ue.I$)((0,ce.PO)(e)),{isCloudProcessorSubscribed:h}=(0,re.Pm)(),{enableO11yRegisterRuntimes:f}=(0,T.h)(),E=h?p.r0:p.ML;return t!==u.O11yContextDatasetKind.O11ycontext||h||f||s.push(`/${c}/${pe.tB}`),i().createElement(he,null,i().createElement(se.Qn,null),i().createElement(a.Suspense,{fallback:i().createElement(o.kt,{text:r.t`Loading destination`})},i().createElement(de.E,null,i().createElement(d.N,{"data-test":"breadcrumbs-container",breadcrumbs:[{id:pe.Vp.ROOT,href:l(),name:r.t`Destinations`}],title:(()=>{if(!m)switch(t){case u.S3DatasetKind.Awss3:return r.t`Add an Amazon S3 destination`;case u.O11yContextDatasetKind.O11ycontext:return r.t`Add a Splunk Observability Cloud Destination`;case u.IndexerDatasetKind.Indexer:return r.t`Add a Splunk platform destination that uses S2S`;case u.HECExporterDatasetKind.Hecexporter:return r.t`Add a Splunk platform destination that uses HEC`;case u.AzureBlobDatasetKind.Azureblobdataset:return r.t`Add an Azure Blob destination`;default:return""}return`Edit ${m.name}`})(),onNavigate:n}),i().createElement(me.xr,null,(t===u.S3DatasetKind.Awss3||m?.kind===u.S3DatasetKind.Awss3)&&i().createElement(E,{destination:m}),(t===u.O11yContextDatasetKind.O11ycontext||m?.kind===u.O11yContextDatasetKind.O11ycontext)&&i().createElement(le,{destination:m}),(t===u.IndexerDatasetKind.Indexer||m?.kind===u.IndexerDatasetKind.Indexer)&&i().createElement(p.AV,{destination:m}),(t===u.AzureBlobDatasetKind.Azureblobdataset||m?.kind===u.AzureBlobDatasetKind.Azureblobdataset)&&i().createElement(p.lq,{destination:m}),(t===u.HECExporterDatasetKind.Hecexporter||m?.kind===u.HECExporterDatasetKind.Hecexporter)&&i().createElement(Y,{destination:m})))))},Ee=({routeMatch:e})=>{const{pathParams:{id:t},queryParams:n}=e;return i().createElement(fe,{destinationName:t,kind:n.kind})}},41956(e,t,n){var a=n(26250),i=n.n(a),l=n(50571),s=n(46813),r=n(15759),o=n.n(r),d=n(68870);i().div`
    display: grid;
    justify-content: flex-end;
    padding: 10px;
`;const c=i().div`
    display: flex;
    justify-content: flex-end;
    padding: ${d.default.spacingSmall} 0;

    [data-test='view-debug-logs-button'],
    [data-test='view-history-button'] {
        margin-right: ${d.default.spacingSmall};
    }
`,u=(i().div`
    max-width: 100%;
    padding: 10px;
`,i().div`
    ${s.jg}
    background-color: ${d.default.backgroundColorPage};
    display: flex;
    flex-direction: column;
    flex: 1 0 0;
    min-height: 0;
`),p=i().div`
    padding: 0 ${d.default.spacingMedium};
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    ${s.jg}
`,m=i().div`
    padding: ${d.default.spacingMedium} ${d.default.spacingLarge} 0
        ${d.default.spacingLarge};
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    ${s.jg}
`,h=i()(o())`
    width: 100%;
    height: 363px;
    padding: ${d.default.spacingMedium};
`,f=i()(o().Body)`
    overflow: hidden;
`,E=i().div`
    display: flex;
    justify-content: end;
`,g=i().div`
    display: flex;
    width: 300px;
`,b=i().div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    width: 100%;
    padding-bottom: ${d.default.spacingMedium};
`,y=i()(l.N)`
    button[data-inline] {
        margin-left: 0 !important;
        flex: 0 0 auto;
    }
`,x=i().div`
    padding: ${d.default.spacingMedium} 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: ${d.default.spacingSmall};
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: ${d.default.backgroundColorPage};
`,k=i().div`
    min-width: 0;
`,C=i().div`
    display: flex;
    align-items: center;
    gap: ${d.default.spacingLarge};
    margin-bottom: ${d.default.spacingSmall};

    [data-test='acies-header-title'] {
        flex-shrink: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    [data-test='chip-bowl'] {
        flex-shrink: 0;
    }
`,v=i().div`
    display: flex;
    gap: ${d.default.spacingSmall};
`,S=i().p`
    margin: ${d.default.spacingXSmall};
    margin-left: 0;
    font-size: ${d.default.fontSize};
`;n.d(t,["$5",0,v,"HB",0,f,"VE",0,c,"Vr",0,E,"XR",0,h,"YV",0,g,"_1",0,p,"bw",0,C,"h9",0,x,"k7",0,y,"mc",0,b,"n",0,S,"u6",0,k,"x$",0,m,"xr",0,u])}}]);
//# sourceMappingURL=3480.3480.js.map?ed4a8f964aa30f47266e