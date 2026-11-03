/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as i}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_RBdQ2qQ5:{type:"splunk.markdown",options:{markdown:`## Overview
Dropdowns allow users to select one option from a list to set a token. The list can be manually defined, known as **static**, or it can be populated with the results of a search, known as **dynamic**. These two configurations can be edited using the UI editor for the inputs.

### SPL for Dynamic Input
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| stats count by host
\`\`\`
### Source  for Dynamic Input
\`\`\`json
{
    "type": "input.dropdown",
    "options": {
        "items": ">frame(label, value) | prepend(formattedStatics) | objects()",
        "token": "token1",
        "defaultValue": "*"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "Dynamic Input - Select Host",
    "context": {
        "formattedConfig": {
            "number": {
                "prefix": ""
            }
        },
        "formattedStatics": ">statics | formatByType(formattedConfig)",
        "statics": [
            [
                "All"
            ],
            [
                "*"
            ]
        ],
        "label": ">primary | seriesByName(\\"host\\") | renameSeries(\\"label\\") | formatByType(formattedConfig)",
        "value": ">primary | seriesByName(\\"host\\") | renameSeries(\\"value\\") | formatByType(formattedConfig)"
    }
}
\`\`\``}},viz_gMr0oNmO:{type:"splunk.line",title:"Line Chart with Dynamic Input",dataSources:{primary:"ds_2A3Efw25"},description:'| inputlookup firewall_example.csv | eval myTime=strftime(timestamp,"%H:%M") | search host IN ($token1$) | chart count over myTime by host'},viz_dObiuubP:{type:"splunk.table",title:"Line Chart with Static Input",dataSources:{primary:"ds_quzxE8AQ"},description:'| inputlookup outages_example.csv | search "Geographic Areas" IN ($dd2$) | stats count by Respondent',options:{},context:{},showProgressBar:!1,showLastUpdated:!1},viz_l9R6qtNj:{type:"splunk.markdown",options:{markdown:`### Source  for Static Input
\`\`\`json
{
    "type": "input.dropdown",
    "options": {
        "items": [
            {
                "label": "All",
                "value": "*"
            },
            {
                "label": "Illinois",
                "value": "Illinois"
            },
            {
                "label": "New York",
                "value": "\\"New York\\""
            },
            {
                "label": "Washington",
                "value": "Washington"
            }
        ],
        "token": "dd2",
        "defaultValue": "*"
    },
    "dataSources": {},
    "title": "Static Input - Select Region"
}
\`\`\``}},viz_98uJHZz3:{type:"splunk.rectangle",options:{fillColor:"transparent",strokeColor:"transparent"}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats count by host`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"},ds_2A3Efw25:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| search host IN ($dd1$)
| chart count over myTime by host`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_2"},ds_quzxE8AQ:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| search "Geographic Areas" IN ($dd2$)
| stats count by Respondent`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_3"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_ovnr6KpF:{type:"input.dropdown",options:{items:">frame(label, value) | prepend(formattedStatics) | objects()",token:"dd1",defaultValue:"*"},dataSources:{primary:"ds_search1"},title:"Dynamic Input - Select Host",context:{formattedConfig:{number:{prefix:""}},formattedStatics:">statics | formatByType(formattedConfig)",statics:[["All"],["*"]],label:'>primary | seriesByName("host") | renameSeries("label") | formatByType(formattedConfig)',value:'>primary | seriesByName("host") | renameSeries("value") | formatByType(formattedConfig)'}},input_9MxBqEwU:{type:"input.dropdown",options:{items:[{label:"All",value:"*"},{label:"Illinois",value:"Illinois"},{label:"New York",value:'"New York"'},{label:"Washington",value:"Washington"}],token:"dd2",defaultValue:"*"},dataSources:{},title:"Static Input - Select Region"}},description:"Set a token to a single value by using a form populated with static or dynamic options",title:"Dropdown Input",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_RBdQ2qQ5",type:"block",position:{x:0,y:0,w:588,h:524}},{item:"input_9MxBqEwU",type:"input",position:{x:0,y:524,w:176,h:93}},{item:"viz_l9R6qtNj",type:"block",position:{x:0,y:617,w:588,h:543}},{item:"viz_98uJHZz3",type:"block",position:{x:176,y:524,w:1024,h:93}},{item:"viz_dObiuubP",type:"block",position:{x:588,y:617,w:612,h:543}},{item:"viz_gMr0oNmO",type:"block",position:{x:588,y:0,w:612,h:524}}]}},globalInputs:["input_ovnr6KpF"]}};var o=a(i());t(o.default.createElement(e,{definition:n}),{pageTitle:"Dropdown",hideFooter:!0,layout:"fixed"});
