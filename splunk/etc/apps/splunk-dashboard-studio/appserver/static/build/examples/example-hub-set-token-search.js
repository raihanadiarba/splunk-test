/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as o}from"../chunks/chunk-REK4W3C7.js";import{h as n}from"../chunks/chunk-JHLB3KMN.js";var s={visualizations:{viz_XoAtwekf:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Search id: $my_search:job.sid$ - Top Result: $my_search:result.host$",description:"Returned $my_search:job.resultCount$ results",eventHandlers:[]},viz_kK99DS2i:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| chart count by host
| sort - count
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "$my search:job.sid$ -  Top Result: $my search:result.host$",
    "description": "Returned $my search:job.resultCount$ results"
    "eventHandlers": [],
    "options": {},
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}},viz_YxUwAzLI:{type:"splunk.markdown",options:{markdown:`## Overview

Set tokens from search results or search job metadata to embed search-related information in other searches or visualizations. For example, you can set tokens using the result of a general qery to filter subsequent queries on your dashboard. 

## Syntax
To set a token using **search results** us the syntax:
\`$<search name>:result.<field>$\`

To set a token using **job metadata** us the syntax:
\`$<search name>:job.<metadata option>$\`
`}},viz_xSc6MKql:{type:"splunk.singlevalue",title:"Search id: $my_search:job.sid$",description:"",dataSources:{primary:"ds_search1"},eventHandlers:[{type:"drilldown.setToken",options:{tokens:[{token:"staticToken",value:'"User Has Clicked the Visualization"'}]}}]},viz_w3BDtfy2:{type:"splunk.markdown",options:{markdown:`## Search Metadata

### Search job status
Syntax: \`$search name:job.status$\`  
Example: $my_search:job.status$

### Initial time a search job starts
Syntax: \`$search name:job.startTime$\`  
Example: $my_search:job.startTime$

### Number of results returned
Syntax: \`$search name:job.resultCount$\`  
Example: $my_search:job.resultCount$


### Indicate whether the search has results 
Syntax: \`$search name:job.hasResults$\`  
Example: $my_search:job.hasResults$

`}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| chart count by host
| sort - count`,queryParameters:{earliest:"-60m@m",latest:"now"},enableSmartSources:!0},name:"my_search"},ds_qytaWndI_ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| chart count by host
| where host=NULL`,queryParameters:{earliest:"-60m@m",latest:"now"},enableSmartSources:!0},name:"other_search"}},defaults:{},inputs:{},description:"Set tokens based on search results and job metadata",title:"Set Token from Search",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_YxUwAzLI",type:"block",position:{x:0,y:0,w:1200,h:231}},{item:"viz_XoAtwekf",type:"block",position:{x:0,y:231,w:600,h:413}},{item:"viz_xSc6MKql",type:"block",position:{x:0,y:644,w:600,h:415}},{item:"viz_kK99DS2i",type:"block",position:{x:600,y:231,w:600,h:413}},{item:"viz_w3BDtfy2",type:"block",position:{x:600,y:644,w:600,h:415}}]}},globalInputs:[]}};var a=n(o());t(a.default.createElement(e,{definition:s}),{pageTitle:"Set Token from Search",hideFooter:!0,layout:"fixed"});
