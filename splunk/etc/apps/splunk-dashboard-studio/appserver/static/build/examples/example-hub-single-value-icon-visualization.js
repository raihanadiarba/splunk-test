/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as n}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var i={visualizations:{viz_rdQEoV7s:{type:"splunk.markdown",options:{markdown:`## Overview
Icons can be added to single values to help signal important changes and give a better understanding to what the single value represents. This is useful in situations where the icon accurately represents the data, and it is undesirable to use a viz title or description to explain the metric. 

The following examples show a few configurations of Single Values with icons beside them. Although very similar to regular single values, there are a few unique options available for the icons particularly. `}},viz_a7ZJlbts:{type:"splunk.singlevalueicon",dataSources:{primary:"ds_search1"}},viz_sm0OIKft:{type:"splunk.markdown",options:{markdown:`### SPL 
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime
\`\`\`

### Basic Configuration w/Default Icon
\`\`\`json
{
    "type": "splunk.singlevalueicon",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_7ib0hJVa:{type:"splunk.singlevalueicon",dataSources:{primary:"ds_search2"},options:{majorValue:"> primary | seriesByName('percent') | lastPoint()",trendValue:"> primary | seriesByName('percent') | delta(-2)"}},viz_W2AiYNs6:{type:"splunk.markdown",options:{markdown:`### SPL 
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| top host limit=5
\`\`\`

### Specify Series for Major and Trend Value
\`\`\`json
{
    "type": "splunk.singlevalueicon",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {
        "majorValue": "> primary | seriesByName('percent') | lastPoint()",
        "trendValue": "> primary | seriesByName('percent') | delta(-2)"
    },
    "context": {}
}
\`\`\``}},viz_ndYHA4eM:{type:"splunk.singlevalueicon",dataSources:{primary:"ds_search1"},options:{underLabel:"Icon Label",iconOpacity:.2,icon:"pencil",iconPosition:"top"}},viz_OZ6lF8tO:{type:"splunk.markdown",options:{markdown:`### SPL 
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime
\`\`\`

### Label, Opacity, Position, Pencil Icon
\`\`\`json
{
    "type": "splunk.singlevalueicon",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "underLabel": "Icon Label",
        "iconOpacity": 0.2,
        "icon": "pencil",
        "iconPosition": "top"
    },
    "context": {}
}
\`\`\``}},viz_TgpLU91P:{type:"splunk.singlevalueicon",dataSources:{primary:"ds_search1"},options:{icon:"star",iconPosition:"> majorValue|rangeValue(iconPositionValues)",majorValue:">primary |seriesByName('count')|lastPoint()"},context:{iconPositionValues:[{from:3,value:"top"},{to:3,value:"after"}]}},viz_FCJLCn2x:{type:"splunk.markdown",options:{markdown:`### SPL 
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime
\`\`\`

### Icon Position based on Major Value
\`\`\`json
{
    "type": "splunk.singlevalueicon",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "icon": "star",
        "iconPosition": "> majorValue|rangeValue(iconPositionValues)",
        "majorValue": ">primary |seriesByName('count')|lastPoint()"
    },
    "context": {
        "iconPositionValues": [
            {
                "from": 50,
                "value": "top"
            },
            {
                "to": 50,
                "value": "after"
            }
        ]
    }
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| top host limit=5`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Use Icons to indicate important changes to your Single Value metrics",title:"Single Value Icons",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_rdQEoV7s",type:"block",position:{x:0,y:0,w:1200,h:185}},{item:"viz_a7ZJlbts",type:"block",position:{x:0,y:185,w:304,h:354}},{item:"viz_ndYHA4eM",type:"block",position:{x:0,y:539,w:304,h:422}},{item:"viz_sm0OIKft",type:"block",position:{x:304,y:185,w:296,h:354}},{item:"viz_OZ6lF8tO",type:"block",position:{x:304,y:539,w:296,h:422}},{item:"viz_7ib0hJVa",type:"block",position:{x:600,y:185,w:300,h:354}},{item:"viz_TgpLU91P",type:"block",position:{x:600,y:539,w:300,h:422}},{item:"viz_W2AiYNs6",type:"block",position:{x:900,y:185,w:300,h:354}},{item:"viz_FCJLCn2x",type:"block",position:{x:900,y:539,w:300,h:422}}]}},globalInputs:[]}};var t=o(a());n(t.default.createElement(e,{definition:i}),{pageTitle:"Single Value Icon",hideFooter:!0,layout:"fixed"});
