/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as t}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a}from"../chunks/chunk-REK4W3C7.js";import{h as r}from"../chunks/chunk-JHLB3KMN.js";var i={visualizations:{viz_6nQA9HbF:{type:"splunk.markdown",options:{markdown:`## Overview
Scatter charts are used to identify correlations between discrete points by plotting multiple data points on a graph. The shape that the points make can indicate positive, negative or no correlation between the fields on the x and y axis. Multiple series can also be plotted, with each series being a separate color. 

Using the \`table\` command to return three columns is a good rule of thumb when plotting a scatter chart. By default, the order of columns returned would map to the x-axis, y-axis, and the categories of interest respectively. 

`}},viz_dEmLSTLC:{type:"splunk.scatter",dataSources:{primary:"ds_scatter"},title:"Scatter Chart",description:"Default Configuration"},viz_DWRcsfE2:{type:"splunk.markdown",options:{markdown:`### SPL Query
\`\`\`splunk-spl
| inputlookup examples.csv
| fields nutrients*
| search "nutrients_protein (g)" != null
| head 500
| table "nutrients_protein (g)" nutrients_calories  nutrients_group
\`\`\`
### Source Definition 
\`\`\`json
{
    "type": "splunk.scatter",
    "dataSources": {
        "primary": "ds_scatter"
    },
    "options": {},
    "context": {}
}

\`\`\``}},viz_DsjRH59i:{type:"splunk.scatter",options:{x:"> primary | seriesByName('nutrients_calories')",y:"> primary | seriesByName('nutrients_protein (g)')",markerSize:1},dataSources:{primary:"ds_scatter"},title:"Scatter Chart",description:"X and Y Fields Specified, Smaller Markers"},viz_G2zjCGiT:{type:"splunk.markdown",options:{markdown:`### Source Definition 
\`\`\`json
{
    "type": "splunk.scatter",
    "options": {
        "x": "> primary | seriesByName('nutrients_calories')",
        "y": "> primary | seriesByName('nutrients_protein (g)')",
        "markerSize": 1
    },
    "dataSources": {
        "primary": "ds_scatter"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_scatter:{type:"ds.search",options:{query:'| inputlookup examples.csv| fields nutrients*| search "nutrients_protein (g)" != null| head 500| table "nutrients_protein (g)" nutrients_calories  nutrients_group',queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Examine correlations in your data",title:"Scatter Chart",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_6nQA9HbF",type:"block",position:{x:0,y:0,w:1200,h:158}},{item:"viz_dEmLSTLC",type:"block",position:{x:0,y:158,w:694,h:400}},{item:"viz_DsjRH59i",type:"block",position:{x:0,y:558,w:694,h:400}},{item:"viz_DWRcsfE2",type:"block",position:{x:694,y:158,w:506,h:400}},{item:"viz_G2zjCGiT",type:"block",position:{x:694,y:558,w:506,h:400}}]}},globalInputs:[]}};var n=r(a());e(n.default.createElement(t,{definition:i}),{pageTitle:"Scatter Chart",hideFooter:!0,layout:"fixed"});
