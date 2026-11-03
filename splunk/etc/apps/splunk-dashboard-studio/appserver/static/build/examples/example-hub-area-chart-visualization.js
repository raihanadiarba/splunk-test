/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as n}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var i={visualizations:{viz_3NUrAfkt:{type:"splunk.markdown",options:{markdown:"## Overview\n\nAn area chart is used to show the development of quantitative values over a period of time. It can also be used to show the development of multiple data series summed. \n\nAn area chart can be used for single or multiple series data. Using the `timechart` command in your query makes it so that the first column in a statistics table will be `_time`, which would map to the x-axis of the area chart. The following columns would be y-axis values, each column being a different color on the chart. \n\n`| timechart count by <category_of_interest>`"}},viz_gezCclRK:{type:"splunk.area",dataSources:{primary:"ds_search1"},title:"Area Chart",description:"Single Series"},viz_Zy9SbUug:{type:"splunk.area",dataSources:{primary:"ds_search2"},title:"Area Chart",description:"Multiple Series"},viz_04NOvPv8:{type:"splunk.area",dataSources:{primary:"ds_search2"},options:{stackMode:"stacked"},title:"Area Chart",description:"Multiple Series - Stacked"},viz_IT7zpNRd:{type:"splunk.area",dataSources:{primary:"ds_search2"},options:{stackMode:"stacked100"},title:"Area Chart",description:"Multiple Series - Stacked Mode 100%"},viz_RVNSVBHv:{type:"splunk.markdown",options:{markdown:`### SPL For Single Series
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval mytime=strftime(timestamp,"%H:%M")
| chart count over mytime
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_Hb2gqYLi:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.area",
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
| eval mytime=strftime(timestamp,"%H:%M")
| chart count over mytime by host limit=3
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {},
    "context": {},
}
\`\`\``}},viz_udik1cuo:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {
        "stackMode": "stacked100"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval mytime=strftime(timestamp,"%H:%M")
| chart count over mytime`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval mytime=strftime(timestamp,"%H:%M")
| chart count over mytime by host limit=3`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Use Area Charts to represent data over time",title:"Area Chart",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_3NUrAfkt",type:"block",position:{x:0,y:0,w:1200,h:198}},{item:"viz_gezCclRK",type:"block",position:{x:0,y:198,w:618,h:368}},{item:"viz_Zy9SbUug",type:"block",position:{x:0,y:566,w:618,h:359}},{item:"viz_04NOvPv8",type:"block",position:{x:0,y:925,w:618,h:307}},{item:"viz_IT7zpNRd",type:"block",position:{x:0,y:1232,w:618,h:324}},{item:"viz_RVNSVBHv",type:"block",position:{x:618,y:198,w:582,h:368}},{item:"viz_n67ApED4",type:"block",position:{x:618,y:566,w:582,h:359}},{item:"viz_Hb2gqYLi",type:"block",position:{x:618,y:925,w:582,h:307}},{item:"viz_udik1cuo",type:"block",position:{x:618,y:1232,w:582,h:324}}]}},globalInputs:[]}};var a=o(n());t(a.default.createElement(e,{definition:i}),{pageTitle:"Area Chart",hideFooter:!0,layout:"fixed"});
