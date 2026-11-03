/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as t}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as o}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_RBdQ2qQ5:{type:"splunk.markdown",options:{markdown:`## Overview
Multiselect inputs allow users to select multiple options from a list to set a token. The list can be manually defined, known as **static**, or it can be populated with the results of a search, known as **dynamic**. These two configurations can be edited using the UI editor for the inputs. By default the input uses a comma as a delimiter for multiple entries.

### SPL for Dynamic Input
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| stats count by host
\`\`\`
### Source  for Dynamic Input
\`\`\`json
{
    "type": "input.multiselect",
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
\`\`\``}},viz_gMr0oNmO:{type:"splunk.line",title:"Line Chart with Dynamic Input",dataSources:{primary:"ds_2A3Efw25"},description:""},viz_dObiuubP:{type:"splunk.table",title:"Line Chart with Static Input",dataSources:{primary:"ds_quzxE8AQ"},description:"",showProgressBar:!1,showLastUpdated:!1},viz_l9R6qtNj:{type:"splunk.markdown",options:{markdown:`### Source  for Static Input
\`\`\`json
{
    "type": "input.multiselect",
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
        "token": "token2",
        "defaultValue": "*"
    },
    "dataSources": {},
    "title": "Static Input - Select Region"
}
\`\`\``}},viz_CzMsyOVW:{type:"splunk.rectangle",options:{fillColor:"transparent",strokeColor:"transparent"}},viz_14zGrW02:{type:"splunk.markdown",options:{markdown:'### SPL for Line Chart with Dynamic Input\n```splunk-spl\n| inputlookup firewall_example.csv \n| eval myTime=strftime(timestamp,"%H:%M") \n| search host IN ($$token1$$) \n| chart count over myTime by host\n```'}},viz_XiBNJ5iK:{type:"splunk.markdown",options:{markdown:'### SPL for Line Chart with Static Input\n```splunk-spl\n| inputlookup outages_example.csv\n| search "Geographic Areas" IN ($$token2$$)\n| stats count by Respondent\n```'}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats count by host`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"},ds_2A3Efw25:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| search host IN ($token1$)
| chart count over myTime by host`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_2"},ds_quzxE8AQ:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| search "Geographic Areas" IN ($token2$)
| stats count by Respondent`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_3"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_ovnr6KpF:{type:"input.multiselect",options:{items:">frame(label, value) | prepend(formattedStatics) | objects()",token:"token1",defaultValue:"*"},dataSources:{primary:"ds_search1"},title:"Dynamic Input - Select Host",context:{formattedConfig:{number:{prefix:""}},formattedStatics:">statics | formatByType(formattedConfig)",statics:[["All"],["*"]],label:'>primary | seriesByName("host") | renameSeries("label") | formatByType(formattedConfig)',value:'>primary | seriesByName("host") | renameSeries("value") | formatByType(formattedConfig)'}},input_9MxBqEwU:{type:"input.multiselect",options:{items:[{label:"All",value:"*"},{label:"Illinois",value:"Illinois"},{label:"New York",value:'"New York"'},{label:"Washington",value:"Washington"}],token:"token2",defaultValue:"*"},dataSources:{},title:"Static Input - Select Region"}},description:"Set a token to multiple values by using a form populated with static or dynamic options",title:"Multiselect Input",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_RBdQ2qQ5",type:"block",position:{x:0,y:0,w:588,h:524}},{item:"input_9MxBqEwU",type:"input",position:{x:0,y:524,w:171,h:90}},{item:"viz_l9R6qtNj",type:"block",position:{x:0,y:614,w:588,h:572}},{item:"viz_CzMsyOVW",type:"block",position:{x:171,y:524,w:1029,h:90}},{item:"viz_dObiuubP",type:"block",position:{x:588,y:727,w:612,h:459}},{item:"viz_XiBNJ5iK",type:"block",position:{x:588,y:614,w:612,h:113}},{item:"viz_gMr0oNmO",type:"block",position:{x:588,y:129,w:612,h:395}},{item:"viz_14zGrW02",type:"block",position:{x:588,y:0,w:612,h:129}}]}},globalInputs:["input_ovnr6KpF"]}};var a=i(o());e(a.default.createElement(t,{definition:n}),{pageTitle:"Multiselect",hideFooter:!0,layout:"fixed"});
