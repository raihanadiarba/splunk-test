/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as n}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var t={dataSources:{ds_sankey:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:"| inputlookup examples.csv| fields sankey*| search sankey_source!=null"},name:"Search_1"}},inputs:{},title:"Sankey Diagram",description:"Sankey diagrams help represent flow of resources",visualizations:{viz_lvFt7DS6:{type:"splunk.sankey",dataSources:{primary:"ds_sankey"},title:"Default Configuration"},viz_bHf2plmY:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`json
{
    "type": "splunk.sankey",
    "dataSources": {
        "primary": "ds_sankey"
    },
    "title": "Default Configuration",
    "options": {},
    "context": {}
}
\`\`\``}},viz_oiBQgD6v:{type:"splunk.markdown",options:{markdown:`## Overview

Sankey Diagrams are used to depict flows from a set of elements to another, by using nodes to represent the features and links to visualize their connections. Sankey's are effective at showing multi-stage workflows with a many-to-many mapping. Colors are used to separate elements and the width of the links measure proportion of magnitude. 

The data returned in your query must return a source field, a target field, and a value field which represents the width of the source nodes. You can also have another value field to represent color. This example uses the following query for the Sankey Diagram:

### SPL Query
\`\`\`splunk-spl
| inputlookup examples.csv
| fields sankey*
| search sankey_source!=null
\`\`\`
`}},viz_878tCgMf:{type:"splunk.sankey",dataSources:{primary:"ds_sankey"},title:"Link Value Field Specified",options:{linkValues:"> primary | seriesByName('sankey_value2')"}},viz_wUeFsjNM:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`json
{
    "type": "splunk.sankey",
    "dataSources": {
        "primary": "ds_sankey"
    },
    "title": "Link Value Field Specified",
    "options": {
        "linkValues": "> primary | seriesByName('sankey_value2')"
    },
    "context": {}
}
\`\`\``}},viz_OsVncfnW:{type:"splunk.sankey",dataSources:{primary:"ds_sankey"},title:"Link Opacity",options:{linkOpacity:.8}},viz_PL28GOPg:{type:"splunk.markdown",options:{markdown:`### Source Definition

\`\`\`json
{
    "type": "splunk.sankey",
    "dataSources": {
        "primary": "ds_sankey"
    },
    "title": "Link Opacity",
    "options": {
        "linkOpacity": 0.8
    },
    "context": {}
}
\`\`\``}}},layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_oiBQgD6v",type:"block",position:{x:0,y:0,w:1200,h:312}},{item:"viz_lvFt7DS6",type:"block",position:{x:0,y:312,w:723,h:400}},{item:"viz_878tCgMf",type:"block",position:{x:0,y:712,w:723,h:400}},{item:"viz_OsVncfnW",type:"block",position:{x:0,y:1112,w:723,h:400}},{item:"viz_bHf2plmY",type:"block",position:{x:723,y:312,w:477,h:400}},{item:"viz_wUeFsjNM",type:"block",position:{x:723,y:712,w:477,h:400}},{item:"viz_PL28GOPg",type:"block",position:{x:723,y:1112,w:477,h:400}}]}},globalInputs:[]}};var i=o(a());n(i.default.createElement(e,{definition:t}),{pageTitle:"Sankey Diagram",hideFooter:!0,layout:"fixed"});
