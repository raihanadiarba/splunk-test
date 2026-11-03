/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as i}from"../chunks/chunk-REK4W3C7.js";import{h as s}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_3X53kBj2:{type:"splunk.markdown",options:{markdown:`## Overview
Adjusting scaling can help viewers of your dashboard get a better understanding of your data. By splitting series and adjusting axis scales, you can make sure you display your data in a way that makes more sense for the user. For example, a log scale quickly provides context about the magnitude of different events. 

The below examples showcase simple use cases of available scaling options in dashboards.`}},viz_25GoP8BK:{type:"splunk.area",dataSources:{primary:"ds_search1"},title:"Area Chart With Scaling Adjustment",description:"Log Scale, Split Series, Independent Axis, Abbreviations Off",options:{yAxisAbbreviation:"off",showSplitSeries:!0,showIndependentYRanges:!0,yAxisScale:"log"}},viz_iRt4kmkB:{type:"splunk.markdown",options:{markdown:`### SPL For Area Chart
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| search host IN (host2 host18 host19 host248)
| eval mytime=strftime(timestamp,"%H:%M")
| chart count over mytime by host
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {
        "yAxisAbbreviation": "off",
        "showSplitSeries": true,
        "showIndependentYRanges": true,
        "yAxisScale": "log"
    },
    "context": {}
}
\`\`\`
`}},viz_SVFZ5kdo:{type:"splunk.bar",dataSources:{primary:"ds_FgPlRCzA"},title:"Bar Chart with Scaling Adjustment",description:"Split Series and Independent Y Range",options:{showSplitSeries:!0,showIndependentYRanges:!0}},viz_lLqfBZ0k:{type:"splunk.markdown",options:{markdown:`### SPL For Bar Chart
\`\`\`splunk-spl
| inputlookup outages_example.csv
| top Tags limit=5
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.bar",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "showSplitSeries": true,
        "showIndependentYRanges": true
    },
    "context": {}
}
\`\`\`
`}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host IN (host2 host18 host19 host248)
| eval mytime=strftime(timestamp,"%H:%M")
| chart count over mytime by host`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_1"},ds_FgPlRCzA:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| top Tags limit=5`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Adjust chart scaling properties to help contextualize your data",title:"Chart Scaling",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_3X53kBj2",type:"block",position:{x:0,y:0,w:1200,h:167}},{item:"viz_25GoP8BK",type:"block",position:{x:0,y:167,w:698,h:463}},{item:"viz_SVFZ5kdo",type:"block",position:{x:0,y:630,w:698,h:387}},{item:"viz_iRt4kmkB",type:"block",position:{x:698,y:167,w:502,h:463}},{item:"viz_lLqfBZ0k",type:"block",position:{x:698,y:630,w:502,h:387}}]}},globalInputs:[]}};var o=s(i());t(o.default.createElement(e,{definition:n}),{pageTitle:"Chart Scaling",hideFooter:!0,layout:"fixed"});
