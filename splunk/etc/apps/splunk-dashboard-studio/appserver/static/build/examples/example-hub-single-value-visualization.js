/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as n}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as t}from"../chunks/chunk-JHLB3KMN.js";var i={visualizations:{viz_crcN6mzo:{type:"splunk.singlevalue",dataSources:{primary:"ds_search1"},title:"Single Value",description:"Default Single Value"},viz_fKWCh9Ee:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {},
}
\`\`\``}},viz_aik8jLHV:{type:"splunk.singlevalue",options:{unit:"$",unitPosition:"before",trendDisplay:"percent",numberPrecision:2,underLabel:"Sample Label",backgroundColor:"transparent"},dataSources:{primary:"ds_search1"},title:"Single Value",description:"Unit, Precision, Custom Background Color Trend as %"},viz_iRCGXrSr:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "options": {
        "unit": "$",
        "unitPosition": "before",
        "trendDisplay": "percent",
        "numberPrecision": 2,
        "underLabel": "Sample Label",
        "backgroundColor": "#5a4575"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\``}},viz_XoAtwekf:{type:"splunk.singlevalue",dataSources:{primary:"ds_search1"},title:"Single Value",description:"Trend and Sparkline Hidden",options:{sparklineDisplay:"off",trendDisplay:"off"}},viz_kK99DS2i:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "sparklineDisplay": "off",
        "trendDisplay": "off"
    },
    "context": {}
}
\`\`\``}},viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview

A single value is used for showing a metric or KPI and it's related context. Single value visualizations display results and context for searches returning a discrete number. A single value can be a count or other aggregation of specific events.

Any query returning aggregate data using the stats command is suitable for a Single Value. You can also use a \`timechart\` command to generate a sparkline and then use the visualization DSL to control the major and delta values.

An example is also shown how one search can be used with multiple single values, using DSL to specify which field the single value shows.

### SPL for Single Values
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval mytime=strftime(timestamp,"%Y-%m-%dT%H:%M")
| chart count over mytime
\`\`\``}},viz_p9dfZNev:{type:"splunk.table",dataSources:{primary:"ds_search2"},title:"Multiple Single Values Sharing a Search to Display Different Field Values",description:"Sample Search returning different fields"},viz_Vj2Yo7F9:{type:"splunk.markdown",options:{markdown:"### SPL for DSL Controlled Single Value Examples\n```splunk-spl\n| inputlookup firewall_example.csv\n| search host=host18| head 25\n```\n"}},viz_YiSuNX74:{type:"splunk.singlevalue",options:{majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('bytes_in')",numberPrecision:2},dataSources:{primary:"ds_search2"},title:'Single Value Showing "bytes_in"'},viz_h7f0QsOD:{type:"splunk.singlevalue",options:{majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('bytes_out')"},dataSources:{primary:"ds_search2"},title:'Single Value Showing "bytes_out"'},viz_U0uIxeXY:{type:"splunk.singlevalue",options:{majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('host')"},dataSources:{primary:"ds_search2"},title:'Single Value Showing "host"'},viz_WMGcGUty:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "options": {
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('bytes_in')",
        "numberPrecision": 2
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "context": {}
}
\`\`\``}},viz_U7wayoPl:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "options": {
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('host')"
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "context": {}
}
\`\`\``}},viz_tGLA2Gya:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "options": {
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('bytes_out')"
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host=host18| head 25`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Represent a discrete metric with the option of also showing the latest trend value and change over time with a sparkline",title:"Basic Single Value",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1200,h:279}},{item:"viz_crcN6mzo",type:"block",position:{x:0,y:279,w:286,h:284}},{item:"viz_aik8jLHV",type:"block",position:{x:0,y:563,w:600,h:348}},{item:"viz_Vj2Yo7F9",type:"block",position:{x:0,y:911,w:1200,h:118}},{item:"viz_p9dfZNev",type:"block",position:{x:0,y:1029,w:1200,h:251}},{item:"viz_YiSuNX74",type:"block",position:{x:0,y:1280,w:395,h:200}},{item:"viz_WMGcGUty",type:"block",position:{x:0,y:1480,w:395,h:346}},{item:"viz_fKWCh9Ee",type:"block",position:{x:286,y:279,w:314,h:284}},{item:"viz_h7f0QsOD",type:"block",position:{x:395,y:1280,w:395,h:200}},{item:"viz_tGLA2Gya",type:"block",position:{x:395,y:1480,w:395,h:346}},{item:"viz_XoAtwekf",type:"block",position:{x:600,y:279,w:291,h:284}},{item:"viz_iRCGXrSr",type:"block",position:{x:600,y:563,w:600,h:348}},{item:"viz_U0uIxeXY",type:"block",position:{x:790,y:1280,w:410,h:200}},{item:"viz_U7wayoPl",type:"block",position:{x:790,y:1480,w:410,h:346}},{item:"viz_kK99DS2i",type:"block",position:{x:891,y:279,w:309,h:284}}]}},globalInputs:[]}};var a=t(s());n(a.default.createElement(e,{definition:i}),{pageTitle:"Single Value",hideFooter:!0,layout:"fixed"});
