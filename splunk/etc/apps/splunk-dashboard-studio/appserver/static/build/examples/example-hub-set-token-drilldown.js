/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_crcN6mzo:{type:"splunk.column",dataSources:{primary:"ds_search2"},title:"Sourcetype Column Chart",description:"Chart content updates when selecting users"},viz_fKWCh9Ee:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| search host = $user$
| chart count over myTime by host
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.column",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_XoAtwekf:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Host Table",description:"Click a host below to update column chart",eventHandlers:[{type:"drilldown.setToken",options:{events:["any"],key:"value",token:"user"}}]},viz_kK99DS2i:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| chart count by host
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "User Table",
    "description": "Click a user below to update column chart",
    "options": {},
    "context": {},
    "eventHandlers": [
        {
            "type": "drilldown.setToken",
            "options": {
                "events": [
                    "any"
                ],
                "key": "value",
                "token": "token"
            }
        }
    ]
}
\`\`\``}},viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview

Drilldowns allow for more complex, interactive behaviour turning the dashboard experience from viewing to discovering. 

This page covers an example using the \`setToken\` event handler. Like an input, this type of event handler sets a token value based on an interaction with an existing visualization. The token can then be used elsewhere in the dashboard to control the data for another visualization. 

By clicking on a cell in the table below, the corresponding information on the column chart updates. The click sets a token, which is then used in the search for the column chart. 

There is also support for static tokens, which provides a static string as the value of a token when a certain interaction takes place. Both configurations are available to the `}},viz_xSc6MKql:{type:"splunk.singlevalue",title:"Static Tokens",description:"Clicking on the Visualization Changes Background Color",dataSources:{primary:"ds_click"},eventHandlers:[{type:"drilldown.setToken",options:{tokens:[{token:"staticToken",value:"transparent"}]}}]},viz_3bXQ7bMn:{type:"splunk.markdown",options:{markdown:`### Source Definition for Static Token

\`\`\`json
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_click"
    },
    "eventHandlers": [
        {
            "type": "drilldown.setToken",
            "options": {
                "tokens": [
                    {
                        "token": "staticToken",
                        "value": "transparent"
                    }
                ]
            }
        }
    ]
}

\`\`\``}},viz_zAjOTJcM:{type:"splunk.column",options:{backgroundColor:"$staticToken$"},dataSources:{primary:"ds_x8Fc75MI"},title:"Chart with Static Token set up for backgroundColor"}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| chart count by host`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| search host = $user$
| chart count over myTime by host`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_2"},ds_click:{type:"ds.search",options:{query:`| makeresults
| eval value = "Click to change color" `,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_3"},ds_x8Fc75MI:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| search host = host254
| chart count over myTime by host`},name:"Search_4"}},defaults:{},inputs:{},description:"Set tokens based on interactions with visualizations",title:"Drilldown to Visualization with setToken",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1200,h:221}},{item:"viz_XoAtwekf",type:"block",position:{x:0,y:221,w:297,h:376}},{item:"viz_xSc6MKql",type:"block",position:{x:0,y:597,w:300,h:382}},{item:"viz_kK99DS2i",type:"block",position:{x:297,y:221,w:303,h:376}},{item:"viz_3bXQ7bMn",type:"block",position:{x:300,y:597,w:300,h:382}},{item:"viz_crcN6mzo",type:"block",position:{x:600,y:221,w:327,h:376}},{item:"viz_zAjOTJcM",type:"block",position:{x:600,y:597,w:600,h:382}},{item:"viz_fKWCh9Ee",type:"block",position:{x:927,y:221,w:273,h:376}}]}},globalInputs:[]}};var o=i(a());t(o.default.createElement(e,{definition:n}),{pageTitle:"Drilldown with Set Token",hideFooter:!0,layout:"fixed"});
