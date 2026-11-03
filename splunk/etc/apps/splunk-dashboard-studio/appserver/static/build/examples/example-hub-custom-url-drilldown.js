/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_n4X3Gy80:{type:"splunk.markdown",options:{markdown:`## Overview
Drilldowns can be used to direct users to another URL by interacting with a visualization on the dashboard. The configuration can be done through the UI editor and can force a new tab to open when the drilldown is triggered. 

In this example, we also showcase how one can use a dropdown to select a URL and have the drilldown be different depending on the URL being selected. `}},viz_dq5gn4D8:{type:"splunk.singlevalue",dataSources:{primary:"ds_search1"},eventHandlers:[{type:"drilldown.customUrl",options:{url:"https://docs.splunk.com/Documentation/SplunkCloud/latest/DashStudio/IntroFrame",newTab:!0}}],title:"Link To Dashboard Docs"},viz_dZTClhP1:{type:"splunk.singlevalue",dataSources:{primary:"ds_search1"},eventHandlers:[{type:"drilldown.customUrl",options:{url:"$web$",newTab:!0}}],title:"Link to Website in Dropdown"},viz_tQCsZrf1:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "options": {},
    "dataSources": {
        "primary": "ds_search1"
    },
    "eventHandlers": [
        {
            "type": "drilldown.customUrl",
            "options": {
                "url": "https://docs.splunk.com/Documentation/SplunkCloud/latest/DashStudio/IntroFrame",
                "newTab": true
            }
        }
    ],
    "context": {}
}
\`\`\`
`}},viz_63iFyFet:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "options": {},
    "dataSources": {
        "primary": "ds_search1"
    },
    "eventHandlers": [
        {
            "type": "drilldown.customUrl",
            "options": {
                "url": "$website$",
                "newTab": true
            }
        }
    ],
    "context": {}
}
\`\`\`
`}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults 
| eval SV= "Click Here"`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_g8i6DHFR:{options:{items:[{label:"Splunk Dev",value:"https://dev.splunk.com/"},{label:"Splunk Products",value:"https://www.splunk.com/en_us/software.html"},{label:"Splunk Docs",value:"https://docs.splunk.com"}],defaultValue:"https://dev.splunk.com/",token:"web"},title:"Select Website",type:"input.dropdown"}},description:"Direct users to external URLs by interacting with the dashboard",title:"Drilldown to Custom URL",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_n4X3Gy80",type:"block",position:{x:0,y:0,w:1200,h:151}},{item:"viz_dq5gn4D8",type:"block",position:{x:0,y:151,w:600,h:118}},{item:"viz_tQCsZrf1",type:"block",position:{x:0,y:269,w:600,h:389}},{item:"viz_dZTClhP1",type:"block",position:{x:600,y:151,w:600,h:118}},{item:"viz_63iFyFet",type:"block",position:{x:600,y:269,w:600,h:389}}]}},globalInputs:["input_g8i6DHFR"]}};var o=i(s());t(o.default.createElement(e,{definition:n}),{pageTitle:"Drilldown to Custom URL",hideFooter:!0,layout:"fixed"});
