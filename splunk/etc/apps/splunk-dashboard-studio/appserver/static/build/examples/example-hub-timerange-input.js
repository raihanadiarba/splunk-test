/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as o}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var a={visualizations:{viz_eywUFugw:{type:"splunk.markdown",options:{markdown:`## Overview
By default, a new dashboard comes with a global time range input. A global time range affects every datasource on the dashboard by default.

You can also add another time range, and make it specific to a certain datasource, so that the datasource no longer depends on the default time range picker.  

Lastly, you can also configure a datasource to use a **static** time range, which makes it not dependent on any input and will always stay to what was selected in the datasource's configuration. 

In the following example, the top chart uses the global time range, the middle chart uses the local time range, and the bottom uses "real time" as the static time range selection. All charts use an internal index search (so it may be blocked to some users) however the example source code below can be applied when searching through any index.

### Source for Global Time Range
\`\`\`json
{
    "type": "input.timerange",
    "options": {
       "token": "global",
       "defaultValue": "-15m,now"
    },
    "title": "Global Time Range"
}
\`\`\`
### Source for Local Time Range
\`\`\`json
{
    "options": {
        "defaultValue": "-5m@m,now",
        "token": "local_time"
    },
    "title": "Local Time",
    "type": "input.timerange"
}
\`\`\``}},viz_vB26gQSP:{type:"splunk.line",dataSources:{primary:"ds_xRZBjW3q"},title:"Global Time"},viz_6tGDmtX1:{type:"splunk.line",dataSources:{primary:"ds_AQGDZTdz"},title:"Local Time"},viz_UQ6JDrTB:{type:"splunk.line",dataSources:{primary:"ds_qOfkgqY1"},title:"Static Time"}},dataSources:{ds_qOfkgqY1:{type:"ds.search",options:{query:`index=_internal
| timechart count by sourcetype`,queryParameters:{earliest:"rt-30s",latest:"rt"}},name:"Search_1"},ds_xRZBjW3q:{type:"ds.search",options:{query:`index=_internal
| timechart count by sourcetype`},name:"Search_2"},ds_AQGDZTdz:{type:"ds.search",options:{query:`index=_internal
| timechart count by sourcetype`,queryParameters:{earliest:"$local_time.earliest$",latest:"$local_time.latest$"}},name:"Search_3"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_global_trp:{type:"input.timerange",options:{token:"global_time",defaultValue:"-15m,now"},title:"Global Time Range"},input_94Exx6lW:{options:{defaultValue:"-5m@m,now",token:"local_time"},title:"Local Time",type:"input.timerange"}},description:"Select the time range used by data sources powering your visualizations",title:"Time Range Input",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_eywUFugw",type:"block",position:{x:0,y:0,w:600,h:741}},{item:"viz_UQ6JDrTB",type:"block",position:{x:600,y:481,w:600,h:260}},{item:"viz_vB26gQSP",type:"block",position:{x:600,y:0,w:600,h:234}},{item:"viz_6tGDmtX1",type:"block",position:{x:600,y:234,w:600,h:247}}]}},globalInputs:["input_global_trp","input_94Exx6lW"]}};var n=i(o());t(n.default.createElement(e,{definition:a}),{pageTitle:"Time Range Input",hideFooter:!0,layout:"fixed"});
