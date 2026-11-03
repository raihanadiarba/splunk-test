/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_3X53kBj2:{type:"splunk.markdown",options:{markdown:`## Overview
When monitoring time-series data, certain events might contain crucial information that provides larger context to underlying mechanisms in your data. For these scenarios, such as monitoring alerts and failures, event annotations can be used. Event annotations allow you to see when a certain event of interest takes place in a larger stream of time-series data. The key to make event annotations work is to have the alerts and statuses of interest being on the same time span as the main data being plotted.

The below examples showcase event annotations for area and column charts. Note that for event annotations, two datasources are required, one for the chart itself, and one for the annotations. This example uses a makeresults query for both charts, with the difference between them being that for each chart's annotation data, the area uses different colors whereas the column uses the same color. 

### SPL Query for Charts
\`\`\`splunk-spl
| makeresults count=15
| streamstats count
| eval _time=_time-(count*86400)
| eval value=random()%100
| fields _time value
\`\`\`


`}},viz_jHj4nb3Y:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.area",
    "options": {
        "annotationX": "> annotations | seriesByIndex(0)",
        "annotationLabel": "> annotations | seriesByIndex(1)",
        "annotationColor": "> annotations | seriesByIndex(2)"
    },
    "dataSources": {
        "primary": "ds_chart",
        "annotations": "ds_markers"
    }
}
\`\`\`
### SPL Query for Annotations
\`\`\`splunk-spl
| makeresults count=3
| streamstats count
| eval _time=_time-(count*86400*3)
| eval score = random()%3 +1
| eval status = case(score=1,"server error detected", score=2, "unknown user access", score=3, "status cleared")
| eval color = case(score=1,"#f44271", score=2, "#f4a941", score=3, "#41f49a")
| table _time status color
\`\`\`
`}},viz_25GoP8BK:{type:"splunk.area",options:{annotationX:"> annotations | seriesByIndex(0)",annotationLabel:"> annotations | seriesByIndex(1)",annotationColor:"> annotations | seriesByIndex(2)"},dataSources:{primary:"ds_chart",annotations:"ds_markers"},title:"Area Chart with Annotations",description:"Color dynamically using match value"},viz_5jEsD8lR:{type:"splunk.column",dataSources:{primary:"ds_chart",annotations:"ds_markers_one_color"},title:"Column Chart with Annotations",description:"All Set to One Color",options:{annotationX:"> annotations | seriesByIndex(0)",annotationLabel:"> annotations | seriesByIndex(1)",annotationColor:"> annotations | seriesByIndex(2)"}},viz_wo3MmrZc:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.column",
    "dataSources": {
        "primary": "ds_chart",
        "annotations": "ds_markers_one_color"
    },
    "options": {
        "annotationX": "> annotations | seriesByIndex(0)",
        "annotationLabel": "> annotations | seriesByIndex(1)",
        "annotationColor": "> annotations | seriesByIndex(2)"
    }
}
\`\`\`
### SPL Query for Annotations
\`\`\`splunk-spl
| makeresults count=3
| streamstats count
| eval _time=_time-(count*86400*3)
| eval score = random()%3 +1
| eval status = case(score=1,"server error detected", score=2, "unknown user access", score=3, "status cleared")
| eval color = "#f44271"
| table _time status color
\`\`\`
`}}},dataSources:{ds_chart:{type:"ds.search",options:{query:`| makeresults count=15
| streamstats count
| eval _time=_time-(count*86400)
| eval value=random()%100
| fields _time value`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_1"},ds_markers:{type:"ds.search",options:{query:`| makeresults count=3
| streamstats count
| eval _time=_time-(count*86400*3)
| eval score = random()%3 +1
| eval status = case(score=1,"server error detected", score=2, "unknown user access", score=3, "status cleared")
| eval color = case(score=1,"#f44271", score=2, "#f4a941", score=3, "#41f49a")
| table _time status color`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_2"},ds_markers_one_color:{type:"ds.search",options:{query:`| makeresults count=3
| streamstats count
| eval _time=_time-(count*86400*3)
| eval score = random()%3 +1
| eval status = case(score=1,"server error detected", score=2, "unknown user access", score=3, "status cleared")
| eval color = "#f44271"
| table _time status color`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_3"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Mark important discrete events on time-series charts to provide context ",title:"Chart Annotations",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_3X53kBj2",type:"block",position:{x:0,y:0,w:1200,h:358}},{item:"viz_25GoP8BK",type:"block",position:{x:0,y:358,w:663,h:551}},{item:"viz_5jEsD8lR",type:"block",position:{x:0,y:909,w:663,h:509}},{item:"viz_jHj4nb3Y",type:"block",position:{x:663,y:358,w:537,h:551}},{item:"viz_wo3MmrZc",type:"block",position:{x:663,y:909,w:537,h:509}}]}},globalInputs:[]}};var a=o(s());t(a.default.createElement(e,{definition:n}),{pageTitle:"Chart Annotations",hideFooter:!0,layout:"fixed"});
