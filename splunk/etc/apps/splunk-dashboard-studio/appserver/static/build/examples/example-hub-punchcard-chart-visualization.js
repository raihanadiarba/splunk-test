/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as n}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var o={visualizations:{viz_ex9bx0og:{type:"splunk.markdown",options:{markdown:`## Overview

Punchcards can visualize cyclical trends in your data. Using a punchcard, you can see relative values for a metric where the dimensions intersect.

A punchcard can be used with any data using some sort of timestamp and a metric you want to track. You can also use a query that returns a another field indicating color to visually separate categories, examples for coloring can be seen in the Punchcard Coloring page.`}},viz_U1QozhCt:{type:"splunk.punchcard",dataSources:{primary:"ds_search1"},title:"Punchcard",description:"Default Configuration, global row scale, bubble scale area",options:{},context:{},showProgressBar:!1,showLastUpdated:!1},viz_g1eVJOyU:{type:"splunk.markdown",options:{markdown:`### SPL Query
\`\`\`splunk-spl
| inputlookup examples.csv
| where punch_count > 0
| fields punch_hour punch_day punch_count punch_region
\`\`\`

### Source Definition
\`\`\`json
{
    "type": "splunk.punchcard",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {}
}

\`\`\``}},viz_EdD4tUJI:{type:"splunk.punchcard",options:{bubbleLabelDisplay:"off",showDefaultSort:!0},dataSources:{primary:"ds_search1"},title:"Punchcard",description:"No Label on bubbles,  sort axis labels",showProgressBar:!1,showLastUpdated:!1},viz_whIwQh9E:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.punchcard",
    "options": {
        "bubbleLabelDisplay": "off",
	       "showDefaultSort":true
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}

\`\`\``}},viz_vfZZQhO2:{type:"splunk.punchcard",options:{bubbleRowScale:"row",bubbleLabelDisplay:"max"},dataSources:{primary:"ds_search1"},title:"Punchcard",description:"Bubble label on max value, bubble row scale per row, bubble scale radius",showProgressBar:!1,showLastUpdated:!1},viz_kUufQvMu:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.punchcard",
    "options": {
        "bubbleRowScale": "row",
        "bubbleLabelDisplay": "max"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}

\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup examples.csv
| where punch_count > 0
| fields punch_hour punch_day punch_count punch_region`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Aggregate metrics over two dimensions to visualize cyclical trends in your data",title:"Punchcards",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_ex9bx0og",type:"block",position:{x:0,y:0,w:1200,h:180}},{item:"viz_U1QozhCt",type:"block",position:{x:0,y:180,w:748,h:400}},{item:"viz_EdD4tUJI",type:"block",position:{x:0,y:580,w:748,h:400}},{item:"viz_vfZZQhO2",type:"block",position:{x:0,y:980,w:748,h:400}},{item:"viz_g1eVJOyU",type:"block",position:{x:748,y:180,w:452,h:400}},{item:"viz_whIwQh9E",type:"block",position:{x:748,y:580,w:452,h:400}},{item:"viz_kUufQvMu",type:"block",position:{x:748,y:980,w:452,h:400}}]}},globalInputs:[]}};var t=a(s());n(t.default.createElement(e,{definition:o}),{pageTitle:"Punchcard",hideFooter:!0,layout:"fixed"});
