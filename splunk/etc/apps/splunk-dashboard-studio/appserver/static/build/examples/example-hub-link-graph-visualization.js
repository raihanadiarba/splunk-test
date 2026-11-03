/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as t}from"../chunks/chunk-JHLB3KMN.js";var i={dataSources:{ds_link:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:"| inputlookup examples.csv| fields link*| search link_ip_address!=null"},name:"Search_1"}},inputs:{},title:"Link Graph",description:"Visualize links between fields",visualizations:{viz_lvFt7DS6:{type:"splunk.linkgraph",dataSources:{primary:"ds_link"},title:"Link Graph",showProgressBar:!1,showLastUpdated:!1,description:"Default configuration",options:{nodeHeight:30,nodeSpacingX:70,nodeSpacingY:20,linkWidth:2}},viz_bHf2plmY:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`json
{
    "type": "splunk.linkgraph",
    "dataSources": {
        "primary": "ds_link"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_oiBQgD6v:{type:"splunk.markdown",options:{markdown:`## Overview

The link graph shows the connections between distinct values in various fields. It highlights relationships between entities, where nodes are the entities and lines are the links between them. Values within a specific field are displayed in a column. The aggregated node values allow users to quickly visualize highly connected data points that may be otherwise overlooked.

The following examples use this query:

### SPL Query
\`\`\`splunk-spl
| inputlookup examples.csv
| fields link*
| search link_ip_address!=null
\`\`\`


`}},viz_pt7pepDM:{type:"splunk.linkgraph",dataSources:{primary:"ds_link"},title:"Link Graph",description:"Color, Layout and Display Options",options:{nodeHighlightColor:"#5a4575",linkColor:"#5a4575",backgroundColor:"transparent",nodeColor:"transparent",nodeWidth:200,nodeHeight:40,linkWidth:3,showNodeCounts:!1,showValueCounts:!1}},viz_rfj0B7PE:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`json
{
    "type": "splunk.linkgraph",
    "dataSources": {
        "primary": "ds_link"
    },
    "options": {
        "nodeHighlightColor": "#5a4575",
        "linkColor": "#5a4575",
        "backgroundColor": "transparent",
        "nodeColor": "transparent",
        "nodeWidth": 200,
        "nodeHeight": 40,
        "linkWidth": 3,
        "showNodeCounts": false,
        "showValueCounts": false
    },
    "context": {}
}
\`\`\``}}},layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_oiBQgD6v",type:"block",position:{x:0,y:0,w:1200,h:300}},{item:"viz_lvFt7DS6",type:"block",position:{x:0,y:300,w:752,h:461}},{item:"viz_pt7pepDM",type:"block",position:{x:0,y:761,w:752,h:559}},{item:"viz_bHf2plmY",type:"block",position:{x:752,y:300,w:448,h:461}},{item:"viz_rfj0B7PE",type:"block",position:{x:752,y:761,w:448,h:559}}]}},globalInputs:[]}};var o=t(s());e(o.default.createElement(n,{definition:i}),{pageTitle:"Link Graph",hideFooter:!0,layout:"fixed"});
