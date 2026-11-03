/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as i}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var o={visualizations:{viz_3NUrAfkt:{type:"splunk.markdown",options:{markdown:`## Overview

Tables can help you compare and aggregate field values. Use a table to visualize patterns for one or more metrics across a dataset. Tables are also very useful for debugging a dashboard. If you feel a visualization isn't displaying data the way you expect, create a table with the same search to see exactly what data is being returned. 

The following examples cover basic table configurations. Most of the options are available through the visual editor for the visualization.  `}},viz_gezCclRK:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Table",description:"Default Configuration"},viz_Zy9SbUug:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Table",description:"Alternate Row Coloring off, fixed header, row numbers",options:{tableFormat:{rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableRowBackgroundColorsByTheme)"},showRowNumbers:!0}},viz_RVNSVBHv:{type:"splunk.markdown",options:{markdown:`### SPL For Table
\`\`\`splunk-spl
| inputlookup outages_example.csv
| search "Number of Customers Affected"!="Unknown"
| fields "Date Event Began", "Event Description", "Geographic Areas", "Number of Customers Affected"
| head 100
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {},
    "context": {}
}
\`\`\``}},viz_Hb2gqYLi:{type:"splunk.markdown",options:{markdown:`### SPL for Column Width
\`\`\`splunk-spl
| inputlookup outages_example.csv
| fields "Event Description" "Geographic Areas" "Respondent" "Tags"
\`\`\`

### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search2"
    }
   "options": {
        "columnFormat": {
            "Event Description": {
                "width": 120,
                "textOverflow": "ellipsis"
            },
            "Geographic Areas": {
                "width": 120,
                "textOverflow": "break-word"
            },
            "Respondent": {
                "width": 120,
                "textOverflow": "anywhere"
            }
        }
    },
    "context": {}
}
\`\`\``}},viz_n67ApED4:{type:"splunk.markdown",options:{markdown:`
### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "tableFormat": {
            "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableRowBackgroundColorsByTheme)"
        },
        "showRowNumbers": true
    },
    "context": {}
}
\`\`\``}},viz_FiYpf6Mn:{type:"splunk.table",dataSources:{primary:"ds_search2"},title:"Specified Column Width",description:"Text overflow options: ellipsis, break-word, anywhere",options:{columnFormat:{"Event Description":{width:120,textOverflow:"ellipsis"},"Geographic Areas":{width:120,textOverflow:"break-word"},Respondent:{width:120,textOverflow:"anywhere"}}}}},dataSources:{ds_search1:{type:"ds.search",options:{query:'| inputlookup outages_example.csv| search "Number of Customers Affected"!="Unknown"| fields "Date Event Began", "Event Description", "Geographic Areas", "Number of Customers Affected"| head 100',queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| fields "Event Description" "Geographic Areas" "Respondent" "Tags"`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_2"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Use Tables to display field and row data from datasources",title:"Table",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_3NUrAfkt",type:"block",position:{x:0,y:0,w:1200,h:179}},{item:"viz_gezCclRK",type:"block",position:{x:0,y:179,w:618,h:408}},{item:"viz_Zy9SbUug",type:"block",position:{x:0,y:587,w:618,h:419}},{item:"viz_FiYpf6Mn",type:"block",position:{x:0,y:1006,w:618,h:460}},{item:"viz_RVNSVBHv",type:"block",position:{x:618,y:179,w:582,h:408}},{item:"viz_n67ApED4",type:"block",position:{x:618,y:587,w:582,h:419}},{item:"viz_Hb2gqYLi",type:"block",position:{x:618,y:1006,w:582,h:460}}]}},globalInputs:[]}};var n=a(i());t(n.default.createElement(e,{definition:o}),{pageTitle:"Table",hideFooter:!0,layout:"fixed"});
