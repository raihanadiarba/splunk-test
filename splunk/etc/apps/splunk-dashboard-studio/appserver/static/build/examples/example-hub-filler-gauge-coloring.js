/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as o}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as i}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_OPQATCGl:{type:"splunk.fillergauge",dataSources:{primary:"ds_search1"},options:{gaugeColor:"> value | rangeValue(gaugeColorEditorConfig)"},title:"Filler Gauge",description:"Conditional coloring",context:{gaugeColorEditorConfig:[{value:"#252214",to:9},{value:"#253223",from:9,to:29},{value:"#244333",from:29,to:60},{value:"#245442",from:60,to:70},{value:"#246451",from:70,to:80},{value:"#237561",from:80,to:90},{value:"#238570",from:90}]},showProgressBar:!1,showLastUpdated:!1},viz_omCpZ2ww:{type:"splunk.markdown",options:{markdown:`## Overview
A Filler gauges shows value ranges and colors with a Filler that moves to indicate the current value. This page shows available coloring options for filler gauges.

The following examples use this makeresults query
### SPL
\`\`\`splunk-spl
| makeresults
| eval count= random()%100
| fields count
\`\`\``}},viz_02J4knli:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.fillergauge",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "gaugeColor": "> value | rangeValue(gaugeColorEditorConfig)"
    },
    "context": {
        "gaugeColorEditorConfig": [
            {
                "value": "#252214",
                "to": 9
            },
            {
                "value": "#253223",
                "from": 9,
                "to": 29
            },
            {
                "value": "#244333",
                "from": 29,
                "to": 60
            },
            {
                "value": "#245442",
                "from": 60,
                "to": 70
            },
            {
                "value": "#246451",
                "from": 70,
                "to": 80
            },
            {
                "value": "#237561",
                "from": 80,
                "to": 90
            },
            {
                "value": "#238570",
                "from": 90
            }
        ]
    }
}
\`\`\``}},viz_8DHPZzts:{type:"splunk.fillergauge",options:{orientation:"horizontal",backgroundColor:"#5a4575"},dataSources:{primary:"ds_search1"},title:"Filler Gauge",description:"Horizontal, Background Purple",showProgressBar:!1,showLastUpdated:!1},viz_wTp98CwR:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.fillergauge",
    "options": {
        "orientation": "horizontal",
        "backgroundColor": "#5a4575"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults
| eval count=random()%100
| fields count`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Adjust Coloring for Filler Gauges",title:"Filler Gauge Coloring",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_omCpZ2ww",type:"block",position:{x:0,y:0,w:1200,h:268}},{item:"viz_OPQATCGl",type:"block",position:{x:0,y:268,w:300,h:462}},{item:"viz_02J4knli",type:"block",position:{x:300,y:268,w:300,h:462}},{item:"viz_8DHPZzts",type:"block",position:{x:600,y:268,w:294,h:462}},{item:"viz_wTp98CwR",type:"block",position:{x:894,y:268,w:306,h:462}}]}},globalInputs:[]}};var t=a(i());e(t.default.createElement(o,{definition:n}),{pageTitle:"Filler Gauge Coloring",hideFooter:!0,layout:"fixed"});
