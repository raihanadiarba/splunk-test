/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_6nQA9HbF:{type:"splunk.markdown",options:{markdown:"## Overview\nBubble charts are useful for finding correlation between three or four dimensions of data. The first two dimensions are the coordinates of the chart, the third is the size of the bubble and the fourth is the color of the bubble. When comparing multiple categories, color can be an easy way to differentiate between bubbles on the chart.\n\nThe best way to generate a bubble chart is to have a search that returns multiple data series, which can be done with a `stats` command. Leverage the visualization DSL in the options to control your `x`, `y` and `category` fields for finer control which is an alternate to formatting your SPL. In the following examples we use a combination of SPL and DSL to format the fields correctly.\n"}},viz_dEmLSTLC:{type:"splunk.bubble",dataSources:{primary:"ds_search1"},title:"Bubble Chart",description:"Default Configuration"},viz_DWRcsfE2:{type:"splunk.markdown",options:{markdown:`### SPL Query
\`\`\`splunk-spl
| inputlookup examples.csv| fields nutrients*
| search "nutrients_protein (g)" != null| head 500
| table "nutrients_protein (g)" nutrients_calories "nutrients_carbohydrate (g)" nutrients_group
\`\`\`

### Source Definition 
\`\`\`json
{
    "type": "splunk.bubble",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {},
}
\`\`\``}},viz_DsjRH59i:{type:"splunk.bubble",options:{category:"> primary | seriesByIndex(3)"},dataSources:{primary:"ds_search1"},title:"Bubble Chart",description:"Fields Specified"},viz_G2zjCGiT:{type:"splunk.markdown",options:{markdown:`### Source Definition 
\`\`\`json
{
    "type": "splunk.bubble",
    "options": {
        "category": "> primary | seriesByIndex(3)"
    },
    "dataSources": {
        "primary": "ds_dczSkyIq"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:'| inputlookup examples.csv| fields nutrients*| search "nutrients_protein (g)" != null| head 500| table "nutrients_protein (g)" nutrients_calories "nutrients_carbohydrate (g)" nutrients_group',queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Use bubble charts to represent data in three dimensions",title:"Bubble Chart",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_6nQA9HbF",type:"block",position:{x:0,y:0,w:1200,h:217}},{item:"viz_dEmLSTLC",type:"block",position:{x:0,y:217,w:704,h:418}},{item:"viz_DsjRH59i",type:"block",position:{x:0,y:635,w:704,h:382}},{item:"viz_DWRcsfE2",type:"block",position:{x:704,y:217,w:496,h:418}},{item:"viz_G2zjCGiT",type:"block",position:{x:704,y:635,w:496,h:382}}]}},globalInputs:[]}};var i=o(r());t(i.default.createElement(e,{definition:n}),{pageTitle:"Bubble Chart",hideFooter:!0,layout:"fixed"});
