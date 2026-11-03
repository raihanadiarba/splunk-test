/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as t}from"../chunks/chunk-REK4W3C7.js";import{h as s}from"../chunks/chunk-JHLB3KMN.js";var o={visualizations:{viz_rbsVgtoZ:{type:"splunk.markdown",options:{markdown:`## Overview
Saved searches refer to reports, whether within the same app or different apps. You can use saved data sources on a schedule, which lightens the processing loads and concurrent data source limits. 

When a saved search is added into the dashboard definition, it becomes available to select in the datasource editor panel. 

The following provides a template on how you can use a saved search in your dashboards. Copy and paste the following code and make the adjustments you need to make it work in your dashboard. You should then see your resulting saved search appear in the datasource editor,`}},viz_cUYmS9vD:{type:"splunk.markdown",options:{markdown:`### Saved Search from Another App
\`\`\`json
"ds_saved_search_from_app": {
 "type": "ds.savedSearch",
 "options": {
  "ref": "<your data source name>",
   "app": "<your-app-name>"
 },
 "name": "Saved Search Data Source From App"
}
\`\`\``}},viz_w7HI1R9h:{type:"splunk.markdown",options:{markdown:`### Saved Search with Additional Options
\`\`\`json
"ds_saved_search_from_app": {
 "type": "ds.savedSearch",
 "options": {
  "ref": "<your data source name>",
  "refresh":"5s",
  "refreshType": "interval"
 },
 "name": "Saved Search Data with Refresh"
}
\`\`\``}},viz_T3X9eU4a:{type:"splunk.markdown",options:{markdown:`### Saved Search From Search and Reporting
\`\`\`json
"ds_saved_search_from_sr": {
 "type": "ds.savedSearch",
 "options": {
  "ref": "<your data source name>"
 },
 "name": "Saved Search Data Source From S&R"
}
\`\`\``}}},dataSources:{"ds_saved_search_from_S&R":{type:"ds.savedSearch",options:{ref:"<your report name>"},name:"Saved Search Data Source From S&R"},ds_saved_search_from_app:{type:"ds.savedSearch",options:{ref:"<your data source name>",app:"<your-app-name>"},name:"Saved Search Data Source From App"},"ds_saved_search_from_S&R_specified":{type:"ds.savedSearch",options:{ref:"<your data source name>",refresh:"5s",refreshType:"interval"},name:"Saved Search Data Source From S&R"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Use saved searches from various apps to use in your Dashboard",title:"Saved Searches",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_rbsVgtoZ",type:"block",position:{x:0,y:0,w:1200,h:175}},{item:"viz_T3X9eU4a",type:"block",position:{x:0,y:175,w:391,h:248}},{item:"viz_w7HI1R9h",type:"block",position:{x:391,y:175,w:399,h:248}},{item:"viz_cUYmS9vD",type:"block",position:{x:790,y:175,w:410,h:248}}]}},globalInputs:[]}};var r=s(t());a(r.default.createElement(e,{definition:o}),{pageTitle:"Saved Search Data Source",hideFooter:!0,layout:"fixed"});
