/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as i}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var a={visualizations:{viz_XhKERoP3:{type:"splunk.markdown",options:{markdown:`## Overview
Ad Hoc datasources are SPL searches you are prompted to create when adding new datasources through the visual editor. You can add your query, edit the name, ID, and adjust the timerange used for the datasource. This example covers basic ad hoc searches, with one visualization having the extra option which controls the refresh. 

Both of these examples are not searching against an index. If you are running a search against an index, you have the additional option to control the time range, whether that is the global time range configured for the dashboard or a static time range configured for that specific data source. The time range parameters can be configured with this following example code:

### Source for Different Time Ranges
\`\`\`json
{
    "type": "ds.search",
    "options": {
        "query": "<SPL Query>",
        "refresh": "10s",
        "queryParameters": {
            "earliest": "-15m",
            "latest": "now"
        }
    },
    "name": "<search name>"
}
\`\`\``}},viz_4Yv2URkp:{type:"splunk.bar",title:"Simple Ad Hoc Data Example",dataSources:{primary:"ds_search1"},showProgressBar:!1,showLastUpdated:!1},viz_RaLJxsMa:{type:"splunk.line",title:"Line Chart Using Static Time Search",dataSources:{primary:"ds_search2"}},viz_gg2855Ju:{type:"splunk.markdown",options:{markdown:`### Data Source Definition
\`\`\`json
{
    "type": "ds.search",
    "options": {
        "query": "| inputlookup firewall_example.csv\\n| stats count by host"
    },
    "name": "Search_1"
}
\`\`\`
`}},viz_MOovk2sf:{type:"splunk.markdown",options:{markdown:`### Data Source Definition
\`\`\`json
{
    "type": "ds.search",
    "options": {
        "query": "| makeresults count=15\\n| streamstats count\\n| eval _time=_time-(count*86400)\\n| eval value=random()%100\\n| fields _time value",
        "refresh": "10s",
        "queryParameters": {}
    },
    "name": "Search 2"
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats count by host`},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| makeresults count=15
| streamstats count
| eval _time=_time-(count*86400)
| eval value=random()%100
| fields _time value`,refresh:"10s",queryParameters:{earliest:"-15m",latest:"now"}},name:"Search 2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_global_trp:{type:"input.timerange",options:{token:"global_time",defaultValue:"-15m,now"},title:"Default Time Range"}},description:"Power a visualization using an Ad-Hoc Search",title:"Ad Hoc Data Source",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_XhKERoP3",type:"block",position:{x:0,y:0,w:1200,h:447}},{item:"viz_4Yv2URkp",type:"block",position:{x:0,y:447,w:600,h:333}},{item:"viz_RaLJxsMa",type:"block",position:{x:0,y:780,w:600,h:327}},{item:"viz_gg2855Ju",type:"block",position:{x:600,y:447,w:600,h:333}},{item:"viz_MOovk2sf",type:"block",position:{x:600,y:780,w:600,h:327}}]}}}};var n=o(i());t(n.default.createElement(e,{definition:a}),{pageTitle:"Ad Hoc Data Source",hideFooter:!0,layout:"fixed"});
