/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as o}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as l}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var e={visualizations:{viz_crcN6mzo:{type:"splunk.singlevalue",dataSources:{primary:"ds_search_time"},title:"Single Value split by host",description:"Count over time",options:{trellisSplitBy:"host",splitByLayout:"trellis",trellisRowHeight:90,trellisMinColumnWidth:120}},viz_fKWCh9Ee:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "Single Value",
    "description": "Default Single Value",
    "options": {
        "trellisSplitBy": "host",
        "splitByLayout": "trellis",
        "trellisRowHeight": 90,
        "trellisMinColumnWidth": 120
    },
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}},viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview

Trellis layout visualizes your search results by separating each value field or aggregation.

Data is split based on the SPL commands and associated metadata or configurations provided. The data-splitting logic defaults to SPL commands and associated metadata first, then option configurations. If you apply configuration options, any of those options could impact how the logic behaves with SPL commands or data field types. 

Note that in this example, since we are using a lookup file, we use the \`chart\` command and use the over clause to chart over the \`myTime\` field which is the time each event in the lookup took place.

Configure your visualization for the trellis layout by adding the \`"splitByLayout": "trellis"\` option in the options stanza. You might need to adjust the sizing of your trellis layout to fit your page.

The search in the following example returns counts by host. Applying a trellis layout creates a view of each host as its own single value visualization.

### SPL for Single Values
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host
\`\`\``}},viz_qVlcdYrG:{type:"splunk.singlevalue",options:{splitByLayout:"trellis",trellisSplitBy:"aggregations",trellisBackgroundColor:"#000000"},dataSources:{primary:"ds_search_agg"},showProgressBar:!1,showLastUpdated:!1,title:"Single Value split by aggregations",description:"Sum of bytes_in and bytes_out for host8"},viz_VujKEiV0:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "options": {
        "splitByLayout": "trellis",
        "trellisSplitBy": "aggregations"
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "showProgressBar": false,
    "showLastUpdated": false,
    "title": "Single Value split by aggregations",
    "description": "Sum of bytes_in and bytes_out for host8",
    "context": {}
}
\`\`\``},showProgressBar:!1,showLastUpdated:!1},viz_zHxr2PKJ:{type:"splunk.singlevalue",dataSources:{primary:"ds_search_time"},title:"Single Value in trellis layout with custom styling",options:{splitByLayout:"trellis",trellisBackgroundColor:"#171d21",trendColor:"> trendValue | rangeValue(trendColorEditorConfig)",showSparklineAreaGraph:!0,sparklineStrokeColor:"> trendColor",trellisRowHeight:110,majorFontSize:50,trellisPageCount:10,trellisSplitBy:"myTime",trellisMinColumnWidth:150,trellisColumns:5},context:{trendColorEditorConfig:[{value:"#F98C83",to:0},{value:"#55C169",from:0}]},description:"Number of columns, Min column width, Row height, Max number of components per page, Trellis background color"},viz_t3qEuBzE:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_search_time"
    },
    "title": "Single Value in trellis layout with custom styling",
    "options": {
        "splitByLayout": "trellis",
        "trellisBackgroundColor": "#171d21",
        "trendColor": "> trendValue | rangeValue(trendColorEditorConfig)",
        "showSparklineAreaGraph": true,
        "sparklineStrokeColor": "> trendColor",
        "trellisRowHeight": 110,
        "majorFontSize": 50,
        "trellisPageCount": 10,
        "trellisSplitBy": "myTime",
        "trellisMinColumnWidth": 150,
        "trellisColumns": 5
    },
    "context": {
        "trendColorEditorConfig": [
            {
                "value": "#F98C83",
                "to": 0
            },
            {
                "value": "#55C169",
                "from": 0
            }
        ]
    },
    "description": "Number of columns, Min column width, Row height, Max number of components per page, Trellis background color",
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}},viz_NSCDXbC9:{type:"splunk.singlevalueradial",options:{splitByLayout:"trellis",trellisSplitBy:"host",trellisMinColumnWidth:150,trellisRowHeight:100,majorColor:"> majorValue | rangeValue(majorColorEditorConfig)",trellisBackgroundColor:"#000000"},showProgressBar:!1,showLastUpdated:!1,dataSources:{primary:"ds_search_time"},context:{majorColorEditorConfig:[{value:"#FE3A3A",to:20},{value:"#FF7149",from:20,to:40},{value:"#FFD442",from:40,to:60},{value:"#2EB82E",from:60,to:80},{value:"#088F44",from:80}]},title:"Single Value Radial in trellis layout",description:"Min column width, Row height"},viz_ESUXdoVz:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalueradial",
    "options": {
        "splitByLayout": "trellis",
        "trellisSplitBy": "host",
        "trellisMinColumnWidth": 150,
        "trellisRowHeight": 100,
        "majorColor": "> majorValue | rangeValue(majorColorEditorConfig)",
        "trellisBackgroundColor": "#000000"
    },
    "showProgressBar": false,
    "showLastUpdated": false,
    "dataSources": {
        "primary": "ds_search_time"
    },
    "context": {
        "majorColorEditorConfig": [
            {
                "value": "#FE3A3A",
                "to": 20
            },
            {
                "value": "#FF7149",
                "from": 20,
                "to": 40
            },
            {
                "value": "#FFD442",
                "from": 40,
                "to": 60
            },
            {
                "value": "#2EB82E",
                "from": 60,
                "to": 80
            },
            {
                "value": "#088F44",
                "from": 80
            }
        ]
    },
    "title": "Single Value Radial in trellis layout",
    "description": "Min column width, Row height"
}
\`\`\``}},viz_pmA5BfG1:{type:"splunk.singlevalueicon",dataSources:{primary:"ds_search_time"},options:{icon:"activity",splitByLayout:"trellis",trellisSplitBy:"host",showValue:!1,iconColor:"> majorValue | rangeValue(iconColorEditorConfig)",trellisMinColumnWidth:150,trellisRowHeight:100},context:{iconColorEditorConfig:[{to:20,value:"#D41F1F"},{from:20,to:40,value:"#D94E17"},{from:40,to:60,value:"#CBA700"},{from:60,to:80,value:"#669922"},{from:80,value:"#118832"}]}},viz_Cs0DhMdF:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.singlevalueicon",
    "dataSources": {
        "primary": "ds_search_time"
    },
    "options": {
        "icon": "activity",
        "splitByLayout": "trellis",
        "trellisSplitBy": "host",
        "showValue": false,
        "iconColor": "> majorValue | rangeValue(iconColorEditorConfig)",
        "trellisMinColumnWidth": 150,
        "trellisRowHeight": 100
    },
    "context": {
        "iconColorEditorConfig": [
            {
                "to": 20,
                "value": "#D41F1F"
            },
            {
                "from": 20,
                "to": 40,
                "value": "#D94E17"
            },
            {
                "from": 40,
                "to": 60,
                "value": "#CBA700"
            },
            {
                "from": 60,
                "to": 80,
                "value": "#669922"
            },
            {
                "from": 80,
                "value": "#118832"
            }
        ]
    },
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}}},dataSources:{ds_search_time:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host`,queryParameters:{earliest:"0",latest:""}},name:"Search_Timechart"},ds_search_agg:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv 
| stats sum(bytes_in), sum(bytes_out) by host`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_Agg"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Organize your search results with the trellis layout for a holistic view of your data",title:"Trellis Layout",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1200,h:304}},{item:"viz_fKWCh9Ee",type:"block",position:{x:675,y:304,w:765,h:325}},{item:"viz_crcN6mzo",type:"block",position:{x:0,y:304,w:675,h:325}},{item:"viz_VujKEiV0",type:"block",position:{x:675,y:629,w:525,h:322}},{item:"viz_qVlcdYrG",type:"block",position:{x:0,y:629,w:675,h:322}},{item:"viz_t3qEuBzE",type:"block",position:{x:675,y:951,w:525,h:355}},{item:"viz_zHxr2PKJ",type:"block",position:{x:0,y:951,w:675,h:355}},{item:"viz_ESUXdoVz",type:"block",position:{x:675,y:1306,w:525,h:279}},{item:"viz_NSCDXbC9",type:"block",position:{x:0,y:1306,w:675,h:279}},{item:"viz_Cs0DhMdF",type:"block",position:{x:675,y:1585,w:525,h:215}},{item:"viz_pmA5BfG1",type:"block",position:{x:0,y:1585,w:675,h:215}}]}},globalInputs:[]}};var n=i(l());t(n.default.createElement(o,{definition:e}),{pageTitle:"Trellis Layout",hideFooter:!0,layout:"fixed"});
