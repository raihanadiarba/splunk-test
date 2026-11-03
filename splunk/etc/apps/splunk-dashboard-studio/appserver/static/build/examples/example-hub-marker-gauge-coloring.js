/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as o}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as t}from"../chunks/chunk-JHLB3KMN.js";var a={visualizations:{viz_omCpZ2ww:{type:"splunk.markdown",options:{markdown:`## Overview
A marker gauge shows value ranges and colors with a marker that moves to indicate one single value from a datasource. It is best used to track KPI's as part of a larger goal or to indicate progression or health. This page shows available coloring options for marker gauges.

The following examples use the following \`makeresults\` query
### SPL
\`\`\`splunk-spl
| makeresults
| eval count=random()%100
| fields count
\`\`\``}},viz_8DHPZzts:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"#5a4575",gaugeRanges:[{from:100,value:"#53a051",to:110},{from:80,value:"#f1813f",to:100},{from:70,value:"#dc4e41",to:80},{from:60,value:"#f8be34",to:70},{from:50,to:60,value:"#CBA700"},{from:20,value:"#0877a6",to:50},{from:0,to:20,value:"#118832"}]},dataSources:{primary:"ds_search1"},title:"Marker Gauge",description:"Horizontal, Background Purple, additional Range",showProgressBar:!1,showLastUpdated:!1},viz_wTp98CwR:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.markergauge",
    "options": {
        "orientation": "horizontal",
        "backgroundColor": "#5a4575",
        "gaugeRanges": [
            {
                "from": 100,
                "value": "#53a051",
                "to": 110
            },
            {
                "from": 80,
                "value": "#f1813f",
                "to": 100
            },
            {
                "from": 70,
                "value": "#dc4e41",
                "to": 80
            },
            {
                "from": 60,
                "value": "#f8be34",
                "to": 70
            },
            {
                "from": 50,
                "to": 60,
                "value": "#CBA700"
            },
            {
                "from": 20,
                "value": "#0877a6",
                "to": 50
            },
            {
                "from": 0,
                "to": 20,
                "value": "#118832"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults
| eval count= random()%100
| fields count`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Adjust Coloring for Marker Gauges",title:"Marker Gauge Coloring",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_omCpZ2ww",type:"block",position:{x:0,y:0,w:1200,h:268}},{item:"viz_8DHPZzts",type:"block",position:{x:0,y:268,w:440,h:498}},{item:"viz_wTp98CwR",type:"block",position:{x:440,y:268,w:760,h:498}}]}},globalInputs:[]}};var n=t(r());e(n.default.createElement(o,{definition:a}),{pageTitle:"Marker Gauge Coloring",hideFooter:!0,layout:"fixed"});
