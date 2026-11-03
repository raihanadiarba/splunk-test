/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as n}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var t={dataSources:{ds_parallel:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:'| inputlookup examples.csv| fields nutrients*| search "nutrients_protein (g)" != null| stats count by nutrients_group nutrients_calories "nutrients_protein (g)" "nutrients_water (g)" | fields - count'},name:"Search_1"}},inputs:{},title:"Parallel Coordinates",description:"Visualize Correlations in multi-dimensional datasets",visualizations:{viz_lvFt7DS6:{type:"splunk.parallelcoordinates",dataSources:{primary:"ds_parallel"},title:"Parallel Coordinates",showProgressBar:!1,showLastUpdated:!1,description:"Default configuration"},viz_bHf2plmY:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`json
{
    "type": "splunk.parallelcoordinates",
    "dataSources": {
        "primary": "ds_parallel"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_oiBQgD6v:{type:"splunk.markdown",options:{markdown:`## Overview

Parallel coordinates are used to depict relationships in multi-dimensional datasets. This visualization is ideal for comparing many variables together and seeing the relationships between them. Each variable is given its own axis and corresponding scale. Lines then map item values for each variable. The ordering of axes can help discover patterns or correlations across variables.

The order of the columns returned would be the order of the axes shown in the chart. The direction of the lines indicate the correlation between the axes for that particular data point. The following examples use this query:

### SPL Query
\`\`\`splunk-spl
| inputlookup examples.csv
| fields nutrients*
| search "nutrients_protein (g)" != null
| stats count by nutrients_group nutrients_calories "nutrients_protein (g)" "nutrients_water (g)" 
| fields - count
\`\`\` `}},viz_878tCgMf:{type:"splunk.parallelcoordinates",dataSources:{primary:"ds_parallel"},title:"Parallel Coordinates",showProgressBar:!1,showLastUpdated:!1,options:{lineColor:"#FFC0CB",lineOpacity:.3},description:"Line Color and Opacity"},viz_wUeFsjNM:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`json
{
    "type": "splunk.parallelcoordinates",
    "dataSources": {
        "primary": "ds_parallel"
    },
    "options": {
        "lineColor": "#FFC0CB",
        "lineOpacity": 0.3
    },
    "context": {}
}
\`\`\``}},viz_OsVncfnW:{type:"splunk.parallelcoordinates",dataSources:{primary:"ds_parallel"},title:"Parallel Coordinates",showProgressBar:!1,showLastUpdated:!1,options:{showNullAxis:!1},description:"Null Axis Hidden"},viz_PL28GOPg:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`json
{
    "type": "splunk.parallelcoordinates",
    "dataSources": {
        "primary": "ds_parallel"
    },
    "options": {
        "showNullAxis": false
    },
    "context": {}
}
\`\`\``}}},layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_oiBQgD6v",type:"block",position:{x:0,y:0,w:1200,h:321}},{item:"viz_lvFt7DS6",type:"block",position:{x:0,y:321,w:723,h:426}},{item:"viz_878tCgMf",type:"block",position:{x:0,y:747,w:723,h:391}},{item:"viz_OsVncfnW",type:"block",position:{x:0,y:1138,w:723,h:383}},{item:"viz_bHf2plmY",type:"block",position:{x:723,y:321,w:477,h:426}},{item:"viz_wUeFsjNM",type:"block",position:{x:723,y:747,w:477,h:391}},{item:"viz_PL28GOPg",type:"block",position:{x:723,y:1138,w:477,h:383}}]}},globalInputs:[]}};var i=o(a());n(i.default.createElement(e,{definition:t}),{pageTitle:"Parallel Coordinates",hideFooter:!0,layout:"fixed"});
