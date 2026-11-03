/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as o}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var s={visualizations:{viz_3X53kBj2:{type:"splunk.markdown",options:{markdown:`## Overview
There are multiple ways to color charts in Splunk Dashboards by using hex codes. In other example pages, specific options are shown for visualizations, such as dynamic coloring. 

In this page, we will cover general coloring options that are applicable across many of the "chart" type visualizations, including bar, column, area, line, scatter, bubble and pie. 

The main way to color these charts is by the \`seriesColors\`, \`seriesColorsbyField\` and \`backgroundColor\` options. The following examples showcase each of these capabilities. 

### SPL For Series Colors Examples
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| search host IN (host2 host18 host19 host248)
| eval myTime=strftime(timestamp,"%Y-%m-%dT%H:%M")
| chart count over myTime by host
\`\`\`
### Series Colors Source Definition
\`\`\`json
//Add the following in the visualization options property 
"seriesColors": [ "#F0B000", "#45D4BA", "#FB865C", "#0065FF"]
\`\`\`
`}},viz_BhAB9tQB:{type:"splunk.area",dataSources:{primary:"ds_search1"},options:{seriesColors:["#F0B000","#45D4BA","#FB865C","#0065FF"],stackMode:"stacked"},title:"Area Series Colors"},viz_sA5Fb0SE:{type:"splunk.line",dataSources:{primary:"ds_search1"},title:"Line Series Colors",showProgressBar:!1,showLastUpdated:!1,options:{seriesColors:["#F0B000","#45D4BA","#FB865C","#0065FF"]}},viz_CZOpmqY8:{type:"splunk.column",dataSources:{primary:"ds_search1"},options:{stackMode:"stacked",seriesColors:["#F0B000","#45D4BA","#FB865C","#0065FF"]},title:"Column Series Colors"},viz_3fRxw1wg:{type:"splunk.markdown",options:{markdown:`### SPL For Series Colors by Field
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| search host IN (host8, host18, host248, host254)
| eval myTime=strftime(timestamp,"%H:%M")
| chart sum(bytes_in) sum(bytes_out) over myTime by host
\`\`\`
### Series Colors by Field Source Definition
\`\`\`json
//Add the following in the visualization options property 
        "seriesColorsByField": {
            "sum(bytes_in)": "#FE3A3A",
            "sum(bytes_out)": "#088F44"
        }
\`\`\``}},viz_45TtKSOc:{type:"splunk.area",title:"Area Field Colors",dataSources:{primary:"ds_search2"},options:{seriesColorsByField:{"sum(bytes_in)":"#FE3A3A","sum(bytes_out)":"#088F44"}}},viz_qJYcNXJG:{type:"splunk.pie",dataSources:{primary:"ds_search3"},options:{backgroundColor:"transparent"}},viz_m83OrRWB:{type:"splunk.markdown",options:{markdown:'### SPL For Background Color\n```splunk-spl\n| inputlookup firewall_example.csv\n| chart count by host\n```\n### Series Colors Source Definition\n```json\n//Add the following in the visualization options property \n"backgroundColor": "transparent"\n```'}}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host IN (host2 host18 host19 host248)
| eval myTime=strftime(timestamp,"%Y-%m-%dT%H:%M")
| chart count over myTime by host`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_1"},ds_search2:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host IN (host8, host18, host248, host254)
| eval myTime=strftime(timestamp,"%H:%M")
| chart sum(bytes_in) sum(bytes_out) over myTime `,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_2"},ds_search3:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| chart count by host`,queryParameters:{earliest:"-4h@m",latest:"now"}},name:"Search_3"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Customize chart colors to reflect your preferred aesthetic",title:"Chart Coloring",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_3X53kBj2",type:"block",position:{x:0,y:0,w:1200,h:436}},{item:"viz_BhAB9tQB",type:"block",position:{x:0,y:436,w:411,h:400}},{item:"viz_3fRxw1wg",type:"block",position:{x:0,y:836,w:598,h:341}},{item:"viz_m83OrRWB",type:"block",position:{x:0,y:1177,w:598,h:315}},{item:"viz_sA5Fb0SE",type:"block",position:{x:411,y:436,w:402,h:400}},{item:"viz_45TtKSOc",type:"block",position:{x:598,y:836,w:602,h:341}},{item:"viz_qJYcNXJG",type:"block",position:{x:598,y:1177,w:602,h:315}},{item:"viz_CZOpmqY8",type:"block",position:{x:813,y:436,w:387,h:400}}]}},globalInputs:[]}};var t=i(r());o(t.default.createElement(e,{definition:s}),{pageTitle:"Chart Coloring",hideFooter:!0,layout:"fixed"});
