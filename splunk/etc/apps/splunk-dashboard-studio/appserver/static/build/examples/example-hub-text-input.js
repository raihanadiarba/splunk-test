/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var o={visualizations:{viz_RBdQ2qQ5:{type:"splunk.markdown",options:{markdown:`## Overview
A text input allows users to set tokens based on exact string entries in a text field. It is used best to match titles, descriptions, usernames, and other forms of unique text entries. In this example, the background color of the visualization depends on the hex value that is entered 

### Source  for Text Input
\`\`\`json
{
    "type": "input.text",
    "options": {
        "defaultValue": "#9964F1",
        "token": "color"
    },
    "title": "Input hex color:"
}
\`\`\``}},viz_gMr0oNmO:{type:"splunk.singlevalue",title:"Background Color is $hex$",dataSources:{primary:"ds_search1"},description:"",options:{backgroundColor:"$hex$"}},viz_U1bGC44o:{type:"splunk.markdown",options:{markdown:`### SPL 
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime
\`\`\`
### Source For Single Value
\`\`\`json
{
    "type": "splunk.singlevalue",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "backgroundColor": "$color$"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_ovnr6KpF:{type:"input.text",options:{defaultValue:"#9964F1",token:"hex"},title:"Input hex color:"}},description:"Set tokens based on text entries",title:"Text Input",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_RBdQ2qQ5",type:"block",position:{x:0,y:0,w:1200,h:346}},{item:"viz_gMr0oNmO",type:"block",position:{x:0,y:346,w:600,h:385}},{item:"viz_U1bGC44o",type:"block",position:{x:600,y:346,w:600,h:385}}]}},globalInputs:["input_ovnr6KpF"]}};var n=i(s());t(n.default.createElement(e,{definition:o}),{pageTitle:"Text",hideFooter:!0,layout:"fixed"});
