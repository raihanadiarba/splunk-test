/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as n}from"../chunks/chunk-JHLB3KMN.js";var a={visualizations:{viz_3X53kBj2:{type:"splunk.markdown",options:{markdown:"## Overview\nOverlays provide a way to add additional data on a single chart. It is available for column, area and bar charts. Use overlays for data that is useful to view together, such as overlaying an average of a field while showing the total value of its individual categories. The overlay field can be controlled using the `overlayFields` option, or in the case of predictions, with the `predict` command in SPL. \n\nThe below examples showcase simple use cases of available overlay options in dashboards."}},viz_RSb0jRKz:{type:"splunk.bar",options:{overlayFields:"average"},dataSources:{primary:"ds_search1"},title:"Bar Chart Overlay",description:"Average of Categories"},viz_jHj4nb3Y:{type:"splunk.markdown",options:{markdown:`### SPL For Bar Chart Overlay
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| stats count by host
| eventstats avg(count) as average
| eval average=round(average,0)
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.bar",
    "options": {
        "overlayFields": "average"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\`
`}},viz_25GoP8BK:{type:"splunk.column",options:{overlayFields:"host8"},dataSources:{primary:"ds_search2"},title:"Column Chart Overlay",description:"Overlay Timeseries Data"},viz_iRt4kmkB:{type:"splunk.markdown",options:{markdown:`### SPL For Column Chart Overlay
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| search host IN (host18, host8, host248)
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.column",
    "options": {
        "overlayFields": "host8"    
},
    "dataSources": {
        "primary": "ds_search2"
    },
    "title": "Overlay",
    "context": {}
}
\`\`\`
`}},viz_5jEsD8lR:{type:"splunk.area",dataSources:{primary:"ds_search2"},title:"Area Chart Overlay with Y2 Axis",description:"Overlay Time Series Data on y2-axis",options:{overlayFields:"host18",showOverlayY2Axis:!0,stackMode:"stacked"}},viz_wo3MmrZc:{type:"splunk.markdown",options:{markdown:`### SPL For Area Chart Overlay
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| search host IN (host18, host8, host248)
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {
        "overlayFields": "host18",
        "showOverlayY2Axis": true,
        "stackMode": "stacked"
    },
    "context": {}
}
\`\`\`
`}},viz_SVFZ5kdo:{type:"splunk.column",dataSources:{primary:"ds_search4"},title:"Overlay - Forecasting",description:"Time series forecasting using the predict command"},viz_lLqfBZ0k:{type:"splunk.markdown",options:{markdown:`### SPL For Column Chart Overlay
\`\`\`splunk-spl
| makeresults count=10
| streamstats count
| eval _time=_time-(count*86400)
| eval value=random()%100 +15
| timechart span=1d sum(value) as Value
| predict Value
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.column",
    "dataSources": {
        "primary": "ds_search4"
    },
    "options": {},
    "context": {}
}
\`\`\`
`}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats count by host
| eventstats avg(count) as average
| eval average=round(average,0)`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host IN (host18, host8, host248)
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search 2"},ds_search3:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host IN (host18, host8, host248)
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_3"},ds_search4:{type:"ds.search",options:{query:`| makeresults count=10
| streamstats count
| eval _time=_time-(count*86400)
| eval value=random()%100 +15
| timechart span=1d sum(value) as Value
| predict Value`,queryParameters:{earliest:"-7d@h",latest:"now"}},name:"Search_4"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Overlay limits and other data on your charts",title:"Chart Overlays",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_3X53kBj2",type:"block",position:{x:0,y:0,w:1200,h:172}},{item:"viz_RSb0jRKz",type:"block",position:{x:0,y:172,w:698,h:413}},{item:"viz_25GoP8BK",type:"block",position:{x:0,y:585,w:698,h:460}},{item:"viz_5jEsD8lR",type:"block",position:{x:0,y:1045,w:698,h:461}},{item:"viz_SVFZ5kdo",type:"block",position:{x:0,y:1506,w:698,h:411}},{item:"viz_jHj4nb3Y",type:"block",position:{x:698,y:172,w:502,h:413}},{item:"viz_iRt4kmkB",type:"block",position:{x:698,y:585,w:502,h:460}},{item:"viz_wo3MmrZc",type:"block",position:{x:698,y:1045,w:502,h:461}},{item:"viz_lLqfBZ0k",type:"block",position:{x:698,y:1506,w:502,h:411}}]}},globalInputs:[]}};var o=n(s());t(o.default.createElement(e,{definition:a}),{pageTitle:"Chart Overlays",hideFooter:!0,layout:"fixed"});
