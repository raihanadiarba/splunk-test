/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as n}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as i}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var t={visualizations:{viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview
A single value is used for showing a metric or KPI and its related context. Single value visualizations display results and context for searches returning a discrete number. A single value can be a count or other aggregation of specific events.

Any query returning aggregate data using the \`stats\` command is suitable for a Single Value. You can also use a \`timechart\` command to generate a sparkline and then use the visualization DSL to control the major and delta values.

This page covers how to use an emoji to represent a value using a case function in SPL, rather than displaying a number or string.`}},viz_U7wayoPl:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| makeresults 
| eval n="\u{1F333}\u{1F44D}"
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "options": {
        "sparklineDisplay": "off",
        "trendDisplay": "off"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}},viz_xEWPDJdb:{type:"splunk.singlevalue",options:{sparklineDisplay:"off",trendDisplay:"off"},dataSources:{primary:"ds_search1"},context:{},title:"Basic Emoji"},viz_CJrQvPIi:{type:"splunk.singlevalue",options:{sparklineDisplay:"off",trendDisplay:"off"},dataSources:{primary:"ds_search2"},context:{},title:"Conditionally Chosen Emoji"},viz_LoduGjVj:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| makeresults
| eval count = random()%1000
| eval output=case(count<400,"\u2600\uFE0F", count>400 AND count<600,"\u{1F324}", count >600,"\u{1F326}")
| table output
| head 1
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "options": {
        "sparklineDisplay": "off",
        "trendDisplay": "off"
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults 
| eval n="\u{1F333}\u{1F44D}"`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| makeresults
| eval count = random()%1000
| eval output=case(count<400,"\u2600\uFE0F", count>400 AND count<600,"\u{1F324}", count >600,"\u{1F326}")
| table output
| head 1`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Display high level insight by using Emojis to represent values",title:"Single Value with Emoji",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1200,h:148}},{item:"viz_xEWPDJdb",type:"block",position:{x:0,y:148,w:297,h:457}},{item:"viz_U7wayoPl",type:"block",position:{x:297,y:148,w:303,h:457}},{item:"viz_CJrQvPIi",type:"block",position:{x:600,y:148,w:307,h:457}},{item:"viz_LoduGjVj",type:"block",position:{x:907,y:148,w:293,h:457}}]}},globalInputs:[]}};var a=o(i());n(a.default.createElement(e,{definition:t}),{pageTitle:"Single Value with Emoji",hideFooter:!0,layout:"fixed"});
