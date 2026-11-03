/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as i}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a}from"../chunks/chunk-REK4W3C7.js";import{h as s}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_NkdSFCWV:{type:"splunk.markdown",options:{markdown:`### Overview
Charts such as bar, column, area, line and more have certain display properties that can be adjusted to precisely represent your data correctly. These include axes, legend, and labelling options. 

Each of the following examples showcase numerous options in one chart.
`}},viz_FeaFm49k:{type:"splunk.column",options:{xAxisLabelRotation:-45,dataValuesDisplay:"all",xAxisTitleText:"Splunk User",yAxisTitleText:"Total Events Logged"},dataSources:{primary:"ds_search1"},title:"Column Chart",description:"X and Y Axis Titles, Show Data Values, X Axis Label Rotation"},viz_nXvOMvFp:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| stats count by host
\`\`\`

### Options Definition 
\`\`\`json
{
    "type": "splunk.column",
    "options": {
        "xAxisLabelRotation": -45,
        "dataValuesDisplay": "all",
        "xAxisTitleText": "Splunk User",
        "yAxisTitleText": "Total Events Logged"
    },
    "dataSources": {
        "primary": "ds_search1"
    },
    "context": {}
}
\`\`\``}},viz_M3neZGtb:{type:"splunk.line",options:{yAxisTitleVisibility:"hide",legendDisplay:"off",showXMajorGridLines:!0,xAxisMaxLabelParts:1,xAxisTitleVisibility:"hide",dataValuesDisplay:"minmax"},dataSources:{primary:"ds_search2"},title:"Line Chart",description:"Hidden Axis Titles, Minmax Values, Gridlines, Label Parts, Hidden Legend"},viz_KWWPes23:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime
\`\`\`

### Options Definition 
\`\`\`json
{
    "type": "splunk.line",
    "options": {
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "showXMajorGridLines": true,
        "xAxisMaxLabelParts": 1,
        "xAxisTitleVisibility": "hide",
        "dataValuesDisplay": "minmax"
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "context": {}
}
\`\`\``}},viz_QcC5ni3l:{type:"splunk.line",dataSources:{primary:"ds_search3"},options:{legendDisplay:"top",legendTruncation:"ellipsisMiddle"},title:"Line Chart",description:"Legend Placement Top, Truncation ellipsisMiddle"},viz_aXAdzXaF:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host
| rename host8 as "superduperlonghostnamenumber1", host18 as "superduperlonghostnamenumber2"
\`\`\`

### Options Definition 
\`\`\`json
{
    "type": "splunk.line",
    "dataSources": {
        "primary": "ds_search3"
    },
    "options": {
        "legendDisplay": "top",
        "legendTruncation": "ellipsisMiddle"
    },
    "title": "Line Chart",
    "description": "Legend Placement Top, Truncation ellipsisMiddle",
    "context": {}
}
\`\`\``}},viz_XbhX17IC:{type:"splunk.area",dataSources:{primary:"ds_search4"},options:{yAxisAbbreviation:"off",dataValuesDisplay:"minmax"},title:"Area Chart",description:"Y Axis Abbreviations Off, Min Max"},viz_y3gQv0hh:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host
\`\`\`

### Options Definition 
\`\`\`json
{
    "type": "splunk.area",
    "dataSources": {
        "primary": "ds_search4"
    },
    "options": {
        "yAxisAbbreviation": "off",
        "dataValuesDisplay": "minmax"
    },
    "context": {}
}
\`\`\``}},viz_rRvvHNCf:{type:"splunk.bar",dataSources:{primary:"ds_search1"},options:{xAxisTitleText:"User",yAxisTitleText:"Count",xAxisLineVisibility:"show",xAxisMajorTickSize:10,showYMajorGridLines:!1},title:"Bar Chart",description:"X Axis Tick Size, Major Gridlines off, Line Visibility"},viz_YV1UGVpM:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| stats count by host
\`\`\`

### Options Definition 
\`\`\`json
{
    "type": "splunk.bar",
    "dataSources": {
        "primary": "ds_search1"
    },
    "options": {
        "xAxisTitleText": "User",
        "yAxisTitleText": "Count",
        "xAxisLineVisibility": "show",
        "xAxisMajorTickSize": 10,
        "showYMajorGridLines": false
    },
    "title": "Bar Chart",
    "description": "X Axis Tick Size, Major Gridlines off, Line Visibility",
    "context": {}
}
\`\`\``}},viz_TwvMncp0:{type:"splunk.line",options:{xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",legendDisplay:"off",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide"},dataSources:{primary:"ds_search4"},title:"Hide Everything",description:"No Labels, Tick Marks, Legends, Axis Titles, or Gridlines"},viz_hQxRVAff:{type:"splunk.markdown",options:{markdown:`### SPL
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host
\`\`\`

### Options Definition 
\`\`\`json
{
    "type": "splunk.line",
    "options": {
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "showYMajorGridLines": false,
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "xAxisMajorTickVisibility": "hide"
    },
    "dataSources": {
        "primary": "ds_search3"
    },
    "context": {}
}
\`\`\``}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats count by host`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_2"},ds_search3:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host| rename host8 as "superduperlonghostnamenumber1", host18 as "superduperlonghostnamenumber2"`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_3"},ds_search4:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_4"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Adjust how chart properties such as axes and legends frame your data",title:"Display Axes, Labels and Legends",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_NkdSFCWV",type:"block",position:{x:0,y:0,w:1200,h:115}},{item:"viz_FeaFm49k",type:"block",position:{x:0,y:115,w:600,h:438}},{item:"viz_M3neZGtb",type:"block",position:{x:0,y:553,w:600,h:479}},{item:"viz_QcC5ni3l",type:"block",position:{x:0,y:1032,w:600,h:475}},{item:"viz_XbhX17IC",type:"block",position:{x:0,y:1507,w:600,h:420}},{item:"viz_rRvvHNCf",type:"block",position:{x:0,y:1927,w:600,h:497}},{item:"viz_TwvMncp0",type:"block",position:{x:0,y:2424,w:600,h:491}},{item:"viz_nXvOMvFp",type:"block",position:{x:600,y:115,w:600,h:438}},{item:"viz_KWWPes23",type:"block",position:{x:600,y:553,w:600,h:479}},{item:"viz_aXAdzXaF",type:"block",position:{x:600,y:1032,w:600,h:475}},{item:"viz_y3gQv0hh",type:"block",position:{x:600,y:1507,w:600,h:420}},{item:"viz_YV1UGVpM",type:"block",position:{x:600,y:1927,w:600,h:497}},{item:"viz_hQxRVAff",type:"block",position:{x:600,y:2424,w:600,h:491}}]}},globalInputs:[]}};var t=s(a());e(t.default.createElement(i,{definition:n}),{pageTitle:"Display Axes, Labels, Legends",hideFooter:!0,layout:"fixed"});
