/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as t}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_fKWCh9Ee:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalueradial",
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "Single Value Radial",
    "description": "Trend Off",
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false,
    "options": {
        "majorValue": "> primary | seriesByIndex(0) | lastPoint()",
        "trendValue": "> primary | seriesByIndex(0) | delta(-2)",
        "trendDisplay": "off"
    }
}
\`\`\``}},viz_aik8jLHV:{type:"splunk.singlevalueradial",dataSources:{primary:"ds_search1"},title:"Single Value Radial",description:"Unit, Precision, Custom Background Color,  Trend as %, Label",showProgressBar:!1,showLastUpdated:!1,options:{majorValue:"> primary | seriesByIndex(0) | lastPoint()",trendValue:"> primary | seriesByIndex(0) | delta(-2)",unit:"$",unitPosition:"before",numberPrecision:2,underLabel:"Sample Label",trendDisplay:"percent"}},viz_iRCGXrSr:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalueradial",
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "Single Value Radial",
    "description": "Unit, Precision, Custom Background Color,  Trend as %, Label",
    "showProgressBar": false,
    "showLastUpdated": false,
    "options": {
        "majorValue": "> primary | seriesByIndex(0) | lastPoint()",
        "trendValue": "> primary | seriesByIndex(0) | delta(-2)",
        "unit": "$",
        "unitPosition": "before",
        "numberPrecision": 2,
        "underLabel": "Sample Label",
        "trendDisplay": "percent"
    },
    "context": {}
}
\`\`\``}},viz_kK99DS2i:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalueradial",
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "Single Value Radial",
    "description": "Default SVR",
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false,
    "options": {
        "majorValue": "> primary | seriesByIndex(0) | lastPoint()",
        "trendValue": "> primary | seriesByIndex(0) | delta(-2)"
    }
}
\`\`\``}},viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview

A single value is used for showing a metric or KPI and its related context. Single value visualizations display results and context for searches returning a discrete number. A single value can be a count or other aggregation of specific events. 

Any query returning aggregate data using the \`stats\` command is suitable for a Single Value. You can also use a \`timechart\` command to generate a sparkline and then use the visualization DSL to control the major and delta values.

This page covers the basic functionality of a Single Value Radial visualization, which is similar to a regular single value however it shows context with a radial gauge and delta value indicator rather than a sparkline. 


### SPL for Single Value Radial
\`\`\`splunk-spl
| makeresults
| eval count = random() % 1000
| append
[| makeresults | eval count = random() % 1000]
| fields count
\`\`\``}},viz_64v6gAPa:{type:"splunk.singlevalueradial",dataSources:{primary:"ds_search1"},title:"Single Value Radial",description:"Default SVR",context:{},showProgressBar:!1,showLastUpdated:!1,options:{majorValue:"> primary | seriesByIndex(0) | lastPoint()",trendValue:"> primary | seriesByIndex(0) | delta(-2)"}},viz_dKCDzdJs:{type:"splunk.singlevalueradial",dataSources:{primary:"ds_search1"},title:"Single Value Radial",description:"Trend Off",context:{},showProgressBar:!1,showLastUpdated:!1,options:{majorValue:"> primary | seriesByIndex(0) | lastPoint()",trendValue:"> primary | seriesByIndex(0) | delta(-2)",trendDisplay:"off"}},viz_lKJ8gmA9:{type:"splunk.singlevalueradial",title:"Single Value Radial",dataSources:{primary:"ds_search1"},description:"Max Value 1000, Radial Stroke and Background Color",showProgressBar:!1,showLastUpdated:!1,options:{majorValue:"> primary | seriesByIndex(0) | lastPoint()",trendValue:"> primary | seriesByIndex(0) | delta(-2)",radialBackgroundColor:"#DC4E41",radialStrokeColor:"#F1813F",maxValue:1e3}},viz_UKMG3TLk:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalueradial",
    "title": "Single Value Radial",
    "dataSources": {
        "primary": "ds_search1"
    },
    "description": "Radial Stroke and Background Color",
    "showProgressBar": false,
    "showLastUpdated": false,
    "options": {
        "majorValue": "> primary | seriesByIndex(0) | lastPoint()",
        "trendValue": "> primary | seriesByIndex(0) | delta(-2)",
        "radialBackgroundColor": "#DC4E41",
        "radialStrokeColor": "#F1813F",
        "maxValue": 1000
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults
| eval count = random() % 1000
| append
[| makeresults | eval count = random() % 1000]
| fields count`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Represent high level metrics and their context with a radial gauge",title:"Single Value Radial",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1200,h:317}},{item:"viz_64v6gAPa",type:"block",position:{x:0,y:317,w:333,h:311}},{item:"viz_aik8jLHV",type:"block",position:{x:0,y:628,w:333,h:360}},{item:"viz_kK99DS2i",type:"block",position:{x:333,y:317,w:267,h:311}},{item:"viz_iRCGXrSr",type:"block",position:{x:333,y:628,w:267,h:360}},{item:"viz_dKCDzdJs",type:"block",position:{x:600,y:317,w:296,h:311}},{item:"viz_lKJ8gmA9",type:"block",position:{x:600,y:628,w:300,h:360}},{item:"viz_fKWCh9Ee",type:"block",position:{x:896,y:317,w:304,h:311}},{item:"viz_UKMG3TLk",type:"block",position:{x:900,y:628,w:300,h:360}}]}},globalInputs:[]}};var i=t(r());a(i.default.createElement(e,{definition:n}),{pageTitle:"Single Value Radial",hideFooter:!0,layout:"fixed"});
