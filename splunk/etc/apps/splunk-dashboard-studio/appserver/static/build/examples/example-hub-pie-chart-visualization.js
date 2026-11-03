/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_3NUrAfkt:{type:"splunk.markdown",options:{markdown:`## Overview

Pie charts are effective at showing the value of different fields in terms of relative importance or volume out of a whole. Pie charts are better at showing visual differences, without the need to know specific values for that field, which can only be done on hover in Dashboard Studio.

Using a simple \`stats\` command that generates two columns is an effective way to compare values over a single category. 

\`|stats count by host\``}},viz_gezCclRK:{type:"splunk.pie",dataSources:{primary:"ds_search1"},title:"Pie Chart",description:"Default Configuration"},viz_Zy9SbUug:{type:"splunk.pie",dataSources:{primary:"ds_search1"},title:"Pie Chart",description:"Labels off",options:{"chart.showLabels":!1,labelDisplay:"off"}},viz_RVNSVBHv:{type:"splunk.markdown",options:{markdown:`### SPL For Pie
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| stats count by host
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.pie",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_Hb2gqYLi:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.pie",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "labelDisplay": "valuesAndPercentage"
    },
    "context": {}
}
\`\`\``}},viz_n67ApED4:{type:"splunk.markdown",options:{markdown:`
### Source Definition
\`\`\`json
{
    "type": "splunk.pie",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "labelDisplay": "off"
    },
    "context": {}
}
\`\`\``}},viz_FiYpf6Mn:{type:"splunk.pie",dataSources:{primary:"ds_search1"},title:"Pie Chart",description:"Show Percentage On",options:{labelDisplay:"valuesAndPercentage"}},viz_JZWNTqRt:{type:"splunk.pie",dataSources:{primary:"ds_search1"},title:"Pie Chart",description:"Show Percentage On",options:{showDonutHole:!0}},viz_VVwXSWkg:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.pie",
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "Pie Chart",
    "description": "Show Percentage On",
    "options": {
        "showDonutHole": true
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats count by host`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"View proportional relationships between categorical data with pie and donut charts",title:"Pie Chart",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_3NUrAfkt",type:"block",position:{x:0,y:0,w:1200,h:175}},{item:"viz_gezCclRK",type:"block",position:{x:0,y:175,w:323,h:343}},{item:"viz_FiYpf6Mn",type:"block",position:{x:0,y:518,w:323,h:368}},{item:"viz_RVNSVBHv",type:"block",position:{x:323,y:175,w:295,h:343}},{item:"viz_Hb2gqYLi",type:"block",position:{x:323,y:518,w:295,h:368}},{item:"viz_Zy9SbUug",type:"block",position:{x:618,y:175,w:313,h:343}},{item:"viz_JZWNTqRt",type:"block",position:{x:618,y:518,w:313,h:368}},{item:"viz_n67ApED4",type:"block",position:{x:931,y:175,w:269,h:343}},{item:"viz_VVwXSWkg",type:"block",position:{x:931,y:518,w:269,h:368}}]}},globalInputs:[]}};var i=o(a());t(i.default.createElement(e,{definition:n}),{pageTitle:"Pie Chart",hideFooter:!0,layout:"fixed"});
