/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as t}from"../chunks/chunk-REK4W3C7.js";import{h as r}from"../chunks/chunk-JHLB3KMN.js";var e={visualizations:{viz_kK99DS2i:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalueradial",
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {
        "fillRangeValueContext": [
            {
                "from": 100,
                "value": "#cb3b43"
            },
            {
                "from": 70,
                "to": 100,
                "value": "#ff7152"
            },
            {
                "from": 50,
                "to": 70,
                "value": "#fc9850"
            },
            {
                "from": 30,
                "to": 50,
                "value": "#f4df7a"
            },
            {
                "from": 10,
                "to": 30,
                "value": "#4beba8"
            },
            {
                "to": 10,
                "value": "#5fbcff"
            }
        ],
        "backgroundColorEditorConfig": [
            {
                "value": "#D41F1F",
                "to": 100
            },
            {
                "value": "#D94E17",
                "from": 100,
                "to": 200
            },
            {
                "value": "#CBA700",
                "from": 200,
                "to": 300
            },
            {
                "value": "#669922",
                "from": 300,
                "to": 400
            },
            {
                "value": "#118832",
                "from": 400
            }
        ]
    },
    "showProgressBar": false,
    "showLastUpdated": false,
    "options": {
        "majorValue": "> primary | seriesByIndex(0) | lastPoint()",
        "trendValue": "> primary | seriesByIndex(0) | delta(-2)",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)"
    },
}
\`\`\``}},viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview

A single value is used for showing a metric or KPI and its related context. Single value visualizations display results and context for searches returning a discrete number. A single value can be a count or other aggregation of specific events. 

Any query returning aggregate data using the \`stats\` command is suitable for a Single Value. You can also use a \`timechart\` command to generate a sparkline and then use the visualization DSL to control the major and delta values.

This page covers the coloring options of a Single Value Radial visualization, which is similar to a regular single value however it shows context with a radial gauge and delta value indicator rather than a sparkline. 


### SPL for Single Value Radial
\`\`\`splunk-spl
| makeresults
| eval count = random() % 1000
| append
[| makeresults | eval count = random() % 1000]
| fields count
\`\`\``}},viz_2m8dKv9L:{type:"splunk.singlevalueradial",dataSources:{primary:"ds_search1"},context:{fillRangeValueContext:[{from:100,value:"#cb3b43"},{from:70,to:100,value:"#ff7152"},{from:50,to:70,value:"#fc9850"},{from:30,to:50,value:"#f4df7a"},{from:10,to:30,value:"#4beba8"},{to:10,value:"#5fbcff"}],backgroundColorEditorConfig:[{value:"#D41F1F",to:100},{value:"#D94E17",from:100,to:200},{value:"#CBA700",from:200,to:300},{value:"#669922",from:300,to:400},{value:"#118832",from:400}]},showProgressBar:!1,showLastUpdated:!1,options:{majorValue:"> primary | seriesByIndex(0) | lastPoint()",trendValue:"> primary | seriesByIndex(0) | delta(-2)",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)"},title:"Dynamic Background"},viz_wHENNaGN:{type:"splunk.singlevalueradial",options:{majorColor:"> majorValue | rangeValue(majorColorEditorConfig)",trendColor:"> trendValue | rangeValue(trendColorEditorConfig)"},dataSources:{primary:"ds_search1"},context:{majorColorEditorConfig:[{value:"#D41F1F",to:100},{value:"#D94E17",from:100,to:200},{value:"#CBA700",from:200,to:300},{value:"#669922",from:300,to:400},{value:"#118832",from:400}],trendColorEditorConfig:[{to:0,value:"#9E2520"},{from:0,value:"#1C6B2D"}]},title:"Dynamic Major Value and Trend"},viz_Ewb9FDj6:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalueradial",
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {
        "fillRangeValueContext": [
            {
                "from": 100,
                "value": "#cb3b43"
            },
            {
                "from": 70,
                "to": 100,
                "value": "#ff7152"
            },
            {
                "from": 50,
                "to": 70,
                "value": "#fc9850"
            },
            {
                "from": 30,
                "to": 50,
                "value": "#f4df7a"
            },
            {
                "from": 10,
                "to": 30,
                "value": "#4beba8"
            },
            {
                "to": 10,
                "value": "#5fbcff"
            }
        ],
        "backgroundColorEditorConfig": [
            {
                "value": "#D41F1F",
                "to": 100
            },
            {
                "value": "#D94E17",
                "from": 100,
                "to": 200
            },
            {
                "value": "#CBA700",
                "from": 200,
                "to": 300
            },
            {
                "value": "#669922",
                "from": 300,
                "to": 400
            },
            {
                "value": "#118832",
                "from": 400
            }
        ]
    },
    "showProgressBar": false,
    "showLastUpdated": false,
    "options": {
        "majorValue": "> primary | seriesByIndex(0) | lastPoint()",
        "trendValue": "> primary | seriesByIndex(0) | delta(-2)",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)"
    },
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults
| eval count = random() % 1000
| append
[| makeresults| eval count = random() % 1000]
| fields count`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Dynamically color various parts of the Single Value Radial visualization based on your data",title:"Single Value Radial Coloring",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1200,h:418}},{item:"viz_2m8dKv9L",type:"block",position:{x:0,y:418,w:603,h:380}},{item:"viz_wHENNaGN",type:"block",position:{x:0,y:798,w:603,h:400}},{item:"viz_kK99DS2i",type:"block",position:{x:603,y:418,w:597,h:380}},{item:"viz_Ewb9FDj6",type:"block",position:{x:603,y:798,w:597,h:400}}]}},globalInputs:[]}};var o=r(t());a(o.default.createElement(n,{definition:e}),{pageTitle:"Single Value Radial Coloring",hideFooter:!0,layout:"fixed"});
