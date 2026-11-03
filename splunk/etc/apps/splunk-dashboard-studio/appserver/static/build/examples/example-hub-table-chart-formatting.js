/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as t}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as i}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_3NUrAfkt:{type:"splunk.markdown",options:{markdown:`## Overview

Tables can help you compare and aggregate field values. Use a table to visualize patterns for one or more metrics across a dataset. Tables are also very useful for debugging a dashboard. If you feel a visualization isn't displaying data the way you expect, create a table with the same search to see exactly what data is being returned. 

The following examples cover specific formatting options for your tables, including sparklines.`}},viz_gezCclRK:{type:"splunk.table",dataSources:{primary:"ds_search1"},title:"Table Formatting",description:"Formatting applied to all numeric columns",options:{columnFormat:{"sum(bytes_in)":{data:'> table | seriesByName("sum(bytes_in)") | formatByType(sum_bytes_in_ColumnFormatEditorConfig)'},count:{data:'> table | seriesByName("count") | formatByType(countColumnFormatEditorConfig)'},"sum(bytes_out)":{data:'> table | seriesByName("sum(bytes_out)") | formatByType(sum_bytes_out_ColumnFormatEditorConfig)'}}},context:{NumberColumnFormatConfig:{number:{thousandSeparated:!1,unitPosition:"after",output:"byte",base:"binary",spaceSeparated:!0,precision:4}},sum_bytes_in_ColumnFormatEditorConfig:{number:{thousandSeparated:!0,unitPosition:"after",unit:"B"}},countColumnFormatEditorConfig:{number:{thousandSeparated:!1,unitPosition:"after",unit:"Results"}},sum_bytes_out_ColumnFormatEditorConfig:{number:{thousandSeparated:!1,unitPosition:"after",precision:2,unit:"Bytes"}}}},viz_Zy9SbUug:{type:"splunk.table",dataSources:{primary:"ds_search2"},title:"Table Formatting - Date/Time, Units",description:"Using MM-DD-YYYY [at] hh:mm A",options:{columnFormat:{myTime:{data:'> table | seriesByName("myTime") | formatByType(myTimeColumnFormatEditorConfig)'}}},context:{myTimeColumnFormatEditorConfig:{time:{format:"MM-DD-YYYY [at] hh:mm A"}}}},viz_RVNSVBHv:{type:"splunk.markdown",options:{markdown:`### SPL For Numeric Formatting
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| stats sum(bytes_in) sum(bytes_out) count by host
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "columnFormat": {
            "sum(bytes_in)": {
                "data": "> table | seriesByName(\\"sum(bytes_in)\\") | formatByType(sum_bytes_in_ColumnFormatEditorConfig)"
            },
            "count": {
                "data": "> table | seriesByName(\\"count\\") | formatByType(countColumnFormatEditorConfig)"
            },
            "sum(bytes_out)": {
                "data": "> table | seriesByName(\\"sum(bytes_out)\\") | formatByType(sum_bytes_out_ColumnFormatEditorConfig)"
            }
        }
    },
    "context": {
        "NumberColumnFormatConfig": {
            "number": {
                "thousandSeparated": false,
                "unitPosition": "after",
                "output": "byte",
                "base": "binary",
                "spaceSeparated": true,
                "precision": 4
            }
        },
        "sum_bytes_in_ColumnFormatEditorConfig": {
            "number": {
                "thousandSeparated": true,
                "unitPosition": "after",
                "unit": "B"
            }
        },
        "countColumnFormatEditorConfig": {
            "number": {
                "thousandSeparated": false,
                "unitPosition": "after",
                "unit": "Results"
            }
        },
        "sum_bytes_out_ColumnFormatEditorConfig": {
            "number": {
                "thousandSeparated": false,
                "unitPosition": "after",
                "precision": 2,
                "unit": "Bytes"
            }
        }
    }
}
\`\`\``}},viz_Hb2gqYLi:{type:"splunk.markdown",options:{markdown:`### SPL for Sparklines
\`\`\`splunk-spl
| inputlookup outages_example.csv 
| eval _time=strptime('Date Event Began',"%m/%d/%Y")
| search Respondent = B*
| sort - _time
| stats sparkline(count) by Respondent
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search3"
    },
    "title": "Table Formatting - Cell Types",
    "description": "Sparklines, multi-value arrays",
    "options": {},
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}},viz_n67ApED4:{type:"splunk.markdown",options:{markdown:`### SPL For Time Formatting
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%Y-%m-%dT%H:%M")
| fields bytes_in bytes_out host myTime
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_search2"
    },
    "options": {
        "columnFormat": {
            "myTime": {
                "data": "> table | seriesByName(\\"myTime\\") | formatByType(myTimeColumnFormatEditorConfig)"
            }
        }
    },
    "context": {
        "myTimeColumnFormatEditorConfig": {
            "time": {
                "format": "MM-DD-YYYY [at] hh:mm A"
            }
        }
    }
}
\`\`\``}},viz_FiYpf6Mn:{type:"splunk.table",dataSources:{primary:"ds_search3"},title:"Table Formatting - Cell Types",description:"Sparklines, multi-value arrays"}},dataSources:{ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%Y-%m-%dT%H:%M")
| fields bytes_in bytes_out host myTime`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_2"},ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats sum(bytes_in) sum(bytes_out) count by host`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"},ds_search3:{type:"ds.search",options:{query:`| inputlookup outages_example.csv 
| eval _time=strptime('Date Event Began',"%m/%d/%Y")
| search Respondent = B*
| sort - _time
| stats sparkline(count) by Respondent`,queryParameters:{earliest:"0",latest:""}},name:"Search_3"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Adjust column formatting and add sparklines to tables",title:"Table Formatting",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_3NUrAfkt",type:"block",position:{x:0,y:0,w:1200,h:179}},{item:"viz_gezCclRK",type:"block",position:{x:0,y:179,w:618,h:356}},{item:"viz_Zy9SbUug",type:"block",position:{x:0,y:535,w:618,h:397}},{item:"viz_FiYpf6Mn",type:"block",position:{x:0,y:932,w:618,h:468}},{item:"viz_RVNSVBHv",type:"block",position:{x:618,y:179,w:582,h:356}},{item:"viz_n67ApED4",type:"block",position:{x:618,y:535,w:582,h:397}},{item:"viz_Hb2gqYLi",type:"block",position:{x:618,y:932,w:582,h:468}}]}},globalInputs:[]}};var o=a(i());e(o.default.createElement(t,{definition:n}),{pageTitle:"Table Formatting",hideFooter:!0,layout:"fixed"});
