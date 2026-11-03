/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as t}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as n}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var o={visualizations:{viz_3NUrAfkt:{type:"splunk.markdown",options:{markdown:"## Overview\n\nBar charts are one of the best options for comparing categorical data in one period or point in time, for both single and multiple series of data. Bar charts are generally a poor option for time series data, as the magnitude of values are displayed on the x-axis. \n\nBar charts get their y-axis from the first column in a statistics table, the following columns contain the x-values. Use the `chart` command with the `over`  and `by` clause to choose how you want to format your y-axis and series.\n\n`| chart count by host`"}},viz_gezCclRK:{type:"splunk.bar",dataSources:{primary:"ds_search1"},title:"Bar Chart",description:"Single Series"},viz_Zy9SbUug:{type:"splunk.bar",dataSources:{primary:"ds_search2"},title:"Bar Chart",description:"Multiple Series"},viz_04NOvPv8:{type:"splunk.bar",dataSources:{primary:"ds_search2"},options:{stackMode:"stacked"},title:"Bar Chart",description:"Multiple Series - Stacked"},viz_IT7zpNRd:{type:"splunk.bar",dataSources:{primary:"ds_search2"},options:{stackMode:"stacked100"},title:"Bar Chart",description:"Multiple Series - Stacked Mode 100%"},viz_RVNSVBHv:{type:"splunk.markdown",options:{markdown:`### SPL For Single Series
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| chart count by host
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.bar",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_Hb2gqYLi:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.bar",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {
        "stackMode": "stacked"
    },
    "context": {}
}
\`\`\``}},viz_n67ApED4:{type:"splunk.markdown",options:{markdown:`### SPL For Multiple Series
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| search host IN (host8, host18, host248, host254)
| chart sum(bytes_in) sum(bytes_out) by host
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.bar",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {},
    "context": {},
}
\`\`\``}},viz_udik1cuo:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.bar",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {
        "stackMode": "stacked100"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:"| inputlookup firewall_example.csv| chart count by host",queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:"| inputlookup firewall_example.csv| search host IN (host8, host18, host248, host254)| chart sum(bytes_in) sum(bytes_out) by host",queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Bar charts are used to compare data of one period or point in time across multiple categories",title:"Bar Chart",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",options:{display:"auto-scale"},structure:[{item:"viz_3NUrAfkt",type:"block",position:{x:0,y:0,w:1200,h:190}},{item:"viz_gezCclRK",type:"block",position:{x:0,y:190,w:618,h:336}},{item:"viz_Zy9SbUug",type:"block",position:{x:0,y:526,w:618,h:353}},{item:"viz_04NOvPv8",type:"block",position:{x:0,y:879,w:618,h:283}},{item:"viz_IT7zpNRd",type:"block",position:{x:0,y:1162,w:618,h:286}},{item:"viz_RVNSVBHv",type:"block",position:{x:618,y:190,w:582,h:336}},{item:"viz_n67ApED4",type:"block",position:{x:618,y:526,w:582,h:353}},{item:"viz_Hb2gqYLi",type:"block",position:{x:618,y:879,w:582,h:283}},{item:"viz_udik1cuo",type:"block",position:{x:618,y:1162,w:582,h:286}}]}},globalInputs:[]}};var i=a(n());e(i.default.createElement(t,{definition:o}),{pageTitle:"Bar Chart",hideFooter:!0,layout:"fixed"});
