/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as o}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as n}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var t={visualizations:{viz_3NUrAfkt:{type:"splunk.markdown",options:{markdown:`## Overview

Tables can help you compare and aggregate field values. Use a table to visualize patterns for one or more metrics across a dataset. Tables are also very useful for debugging a dashboard. If you feel a visualization isn't displaying data the way you expect, create a table with the same search to see exactly what data is being returned. 

The following examples cover ways to color your tables, both statically and dynamically depending on your data. Coloring can be used to provide context for certain fields, and emphasize data. `}},viz_gezCclRK:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Table Coloring",options:{columnFormat:{count:{data:'> table | seriesByName("count") | formatByType(countColumnFormatEditorConfig)',rowColors:"> table | seriesByName('count') | pick(countRowColorsEditorConfig)",rowBackgroundColors:'> table | seriesByName("count") | gradient(countRowBackgroundColorsEditorConfig)'}}},context:{countColumnFormatEditorConfig:{number:{thousandSeparated:!1,unitPosition:"after"}},countRowColorsEditorConfig:["#ffffff"],countRowBackgroundColorsEditorConfig:{colors:["#602CA1","#333022","#277C52"],stops:[-10,50,200]}},description:"Gradient Coloring for Specified Column"},viz_Zy9SbUug:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Table Coloring",options:{columnFormat:{Tags:{data:'> table | seriesByName("Tags") | formatByType(TagsColumnFormatEditorConfig)',rowBackgroundColors:"> table | seriesByName('Tags') | matchValue(tagsRowBackgroundColorsEditorConfig)"},count:{data:'> table | seriesByName("count") | formatByType(countColumnFormatEditorConfig)',rowColors:"> table | seriesByName('count') | rangeValue(countRowColorsEditorConfig)"}}},context:{countColumnFormatEditorConfig:{number:{thousandSeparated:!1,unitPosition:"after"}},countRowColorsEditorConfig:[{to:20,value:"#D41F1F"},{from:20,to:60,value:"#D94E17"},{from:60,to:90,value:"#CBA700"},{from:90,to:140,value:"#669922"},{from:140,value:"#118832"}],tagsColumnFormatEditorConfig:{string:{unitPosition:"after"}},tagsRowBackgroundColorsEditorConfig:[{match:"vandalism",value:"#1F4D5B"},{match:"severe weather, thunderstorm",value:"#D81E5B"}]},description:'Dynamic matchValue for "Tags", rangeValue for "count"'},viz_RVNSVBHv:{type:"splunk.markdown",options:{markdown:`
### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "columnFormat": {
            "count": {
                "data": "> table | seriesByName(\\"count\\") | formatByType(countColumnFormatEditorConfig)",
                "rowColors": "> table | seriesByName('count') | pick(countRowColorsEditorConfig)",
                "rowBackgroundColors": "> table | seriesByName(\\"count\\") | gradient(countRowBackgroundColorsEditorConfig)"
            }
        }
    },
    "context": {
        "countColumnFormatEditorConfig": {
            "number": {
                "thousandSeparated": false,
                "unitPosition": "after"
            }
        },
        "countRowColorsEditorConfig": [
            "#ffffff"
        ],
        "countRowBackgroundColorsEditorConfig": {
            "colors": [
                "#602CA1",
                "#333022",
                "#277C52"
            ],
            "stops": [
                -1000,
                0,
                1000
            ]
        }
    }
}
\`\`\``}},viz_Hb2gqYLi:{type:"splunk.markdown",options:{markdown:`### SPL For Table Coloring
\`\`\`splunk-spl
| inputlookup outages_example.csv
| top Tags limit=15
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "Table Coloring",
    "description": "Static Background Coloring",
    "options": {
        "backgroundColor": "transparent",
        "tableFormat": {
            "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",
            "headerBackgroundColor": "> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",
            "rowColors": "> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",
            "headerColor": "> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"
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
    "title": "Table Coloring",
    "options": {
        "columnFormat": {
            "Tags": {
                "data": "> table | seriesByName(\\"Tags\\") | formatByType(tagsColumnFormatEditorConfig)",
                "rowBackgroundColors": "> table | seriesByName('Tags') | matchValue(tagsRowBackgroundColorsEditorConfig)"
            },
            "count": {
                "data": "> table | seriesByName(\\"count\\") | formatByType(countColumnFormatEditorConfig)",
                "rowColors": "> table | seriesByName('count') | rangeValue(countRowColorsEditorConfig)"
            }
        }
    },
    "context": {
        "tagsColumnFormatEditorConfig": {
            "string": {
                "unitPosition": "after"
            }
        },
        "countColumnFormatEditorConfig": {
            "number": {
                "thousandSeparated": false,
                "unitPosition": "after"
            }
        },
        "countRowColorsEditorConfig": [
            {
                "to": 20,
                "value": "#D41F1F"
            },
            {
                "from": 20,
                "to": 60,
                "value": "#D94E17"
            },
            {
                "from": 60,
                "to": 90,
                "value": "#CBA700"
            },
            {
                "from": 90,
                "to": 140,
                "value": "#669922"
            },
            {
                "from": 140,
                "value": "#118832"
            }
        ],
        "tagsRowBackgroundColorsEditorConfig": [
            {
                "match": "vandalism",
                "value": "#1F4D5B"
            },
            {
                "match": "severe weather, thunderstorm",
                "value": "#D81E5B"
            }
        ]
    },
    "description": "Dynamic matchValue for \\"Tags\\", rangeValue for \\"count\\""
}
\`\`\``}},viz_FiYpf6Mn:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Table Coloring",description:"Static Coloring - Transparent",options:{backgroundColor:"transparent",tableFormat:{rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",headerBackgroundColor:"> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",rowColors:"> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",headerColor:"> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"}}},viz_XtItghXA:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Table Coloring",description:"Static Coloring - Header and Row",options:{backgroundColor:"> themes.defaultBackgroundColor",tableFormat:{rowColors:"> table | pick(tableRowColor)",headerColor:"#45D4BA"}},context:{tableRowColor:["#A870EF"]}},viz_HTSf6UQ5:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "title": "Table Coloring",
    "description": "Static Coloring - Header and Row",
    "options": {
        "backgroundColor": "> themes.defaultBackgroundColor",
        "tableFormat": {
            "rowColors": "> table | pick(tableRowColor)",
            "headerColor": "#45D4BA"
        }
    },
    "context": {
        "tableRowColor": [
            "#A870EF"
        ]
    }
}
\`\`\``}},viz_FjFcT6lv:{type:"splunk.table",options:{columnFormat:{Tags:{data:'> table | seriesByName("Tags") | formatByType(TagsColumnFormatEditorConfig)',rowBackgroundColors:"> table | seriesByName('_count') | rangeValue(countRowColorsEditorConfig)"}},showInternalFields:!1},dataSources:{primary:"ds_hidden"},title:"Table Coloring",description:'Dynamic rangeValue for "Tags" based on hidden "_count" column',context:{countRowColorsEditorConfig:[{to:20,value:"#D41F1F"},{from:20,to:60,value:"#D94E17"},{from:60,to:90,value:"#CBA700"},{from:90,to:140,value:"#669922"},{from:140,value:"#118832"}]}},viz_gWpeB6oq:{type:"splunk.markdown",options:{markdown:`### SPL For Table Coloring
\`\`\`splunk-spl
| inputlookup outages_example.csv
| top Tags limit=15 
| rename count as _count 
| table Tags _count percent _tc
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "options": {
        "columnFormat": {
            "Tags": {
                "data": "> table | seriesByName(\\"Tags\\") | formatByType(TagsColumnFormatEditorConfig)",
                "rowBackgroundColors": "> table | seriesByName('_count') | rangeValue(countRowColorsEditorConfig)"
            }
        },
        "showInternalFields": false
    },
    "dataSources": {
        "primary": "ds_hidden"
    },
    "title": "Table Coloring",
    "description": "Dynamic rangeValue for \\"Tags\\" based on hidden \\"_count\\" column",
    "context": {
        "countRowColorsEditorConfig": [
            {
                "to": 20,
                "value": "#D41F1F"
            },
            {
                "from": 20,
                "to": 60,
                "value": "#D94E17"
            },
            {
                "from": 60,
                "to": 90,
                "value": "#CBA700"
            },
            {
                "from": 90,
                "to": 140,
                "value": "#669922"
            },
            {
                "from": 140,
                "value": "#118832"
            }
        ]
    },
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| top Tags limit=15`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_1"},ds_hidden:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| top Tags limit=15 
| rename count as _count 
| table Tags _count percent _tc`,queryParameters:{earliest:"0",latest:""}},name:"Search_Hidden"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Dynamically color table elements to contextualize and emphasize data",title:"Table Coloring",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_n67ApED4",type:"block",position:{x:618,y:1542,w:582,h:466}},{item:"viz_gWpeB6oq",type:"block",position:{x:618,y:2008,w:582,h:501}},{item:"viz_3NUrAfkt",type:"block",position:{x:0,y:0,w:1200,h:178}},{item:"viz_FiYpf6Mn",type:"block",position:{x:0,y:178,w:618,h:450}},{item:"viz_XtItghXA",type:"block",position:{x:0,y:628,w:618,h:457}},{item:"viz_gezCclRK",type:"block",position:{x:0,y:1085,w:618,h:457}},{item:"viz_Zy9SbUug",type:"block",position:{x:0,y:1542,w:618,h:466}},{item:"viz_Hb2gqYLi",type:"block",position:{x:618,y:178,w:582,h:450}},{item:"viz_HTSf6UQ5",type:"block",position:{x:618,y:628,w:582,h:457}},{item:"viz_RVNSVBHv",type:"block",position:{x:618,y:1085,w:582,h:457}},{item:"viz_FjFcT6lv",type:"block",position:{x:0,y:2008,w:618,h:501}}]}},globalInputs:[]}};var e=a(r());n(e.default.createElement(o,{definition:t}),{pageTitle:"Table Coloring",hideFooter:!0,layout:"fixed"});
