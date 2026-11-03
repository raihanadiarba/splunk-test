/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as o}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_OPQATCGl:{type:"splunk.fillergauge",dataSources:{primary:"ds_search1"},title:"Filler Gauge",description:"Default Confguration",options:{},context:{},showProgressBar:!1,showLastUpdated:!1},viz_omCpZ2ww:{type:"splunk.markdown",options:{markdown:`## Overview
Use a filler gauge to map a value in relation to a range. A filler gauge includes a value scale container that fills and empties as the current value changes. The fill level shows where the current value is on the value scale.

Any search that returns a single value for a single field would work with a filler gauge. The following examples use the following \`makeresults\` query
### SPL
\`\`\`splunk-spl
| makeresults
| eval count=random()%100
| fields count
\`\`\``}},viz_02J4knli:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.fillergauge",
    "dataSources": {
        "primary": "ds_search1"
    }
    "options": {},
    "context": {}
}
\`\`\``}},viz_8DHPZzts:{type:"splunk.fillergauge",options:{labelDisplay:"off",backgroundColor:"transparent",orientation:"horizontal"},dataSources:{primary:"ds_search1"},title:"Filler Gauge",description:"Horizontal, Background Transparent, No Labels",showProgressBar:!1,showLastUpdated:!1},viz_wTp98CwR:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.fillergauge",
    "options": {
        "labelDisplay": "off",
        "backgroundColor": "transparent",
        "orientation": "horizontal"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\``}},viz_89VZhpcS:{type:"splunk.fillergauge",dataSources:{primary:"ds_search1"},title:"Filler Gauge",description:"Percentages for Value and Range",options:{labelDisplay:"percentage",valueDisplay:"percentage"},showProgressBar:!1,showLastUpdated:!1},viz_fUNTuXpK:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.fillergauge",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "labelDisplay": "percentage",
        "valueDisplay": "percentage"
    }
    "context": {}
}
\`\`\``}},viz_SvRSI63X:{type:"splunk.fillergauge",title:"Filler Gauge",description:"Major Tick Marks in Units of 25",dataSources:{primary:"ds_search1"},showProgressBar:!1,showLastUpdated:!1,options:{majorTickInterval:25}},viz_4lxUHIyp:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.fillergauge",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "majorTickInterval": 25
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| makeresults
| eval count=random()%100
| fields count`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Visualize a single numeric value and represent values in relation to a limit with a filler gauge",title:"Filler Gauge",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",options:{display:"auto-scale"},structure:[{item:"viz_omCpZ2ww",type:"block",position:{x:0,y:0,w:1200,h:268}},{item:"viz_OPQATCGl",type:"block",position:{x:0,y:268,w:300,h:311}},{item:"viz_89VZhpcS",type:"block",position:{x:0,y:579,w:300,h:335}},{item:"viz_02J4knli",type:"block",position:{x:300,y:268,w:300,h:311}},{item:"viz_fUNTuXpK",type:"block",position:{x:300,y:579,w:300,h:335}},{item:"viz_8DHPZzts",type:"block",position:{x:600,y:268,w:294,h:311}},{item:"viz_SvRSI63X",type:"block",position:{x:600,y:579,w:294,h:335}},{item:"viz_wTp98CwR",type:"block",position:{x:894,y:268,w:306,h:311}},{item:"viz_4lxUHIyp",type:"block",position:{x:894,y:579,w:306,h:335}}]}},globalInputs:[]}};var t=i(o());a(t.default.createElement(e,{definition:n}),{pageTitle:"Filler Gauge",hideFooter:!0,layout:"fixed"});
