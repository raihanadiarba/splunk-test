/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as n}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as o}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var a={visualizations:{viz_C4mm5934:{type:"splunk.markdown",options:{markdown:`## Overview
Post-process data sources, known as chain searches, perform additional processing on results from a base data source. You can use multiple chain search to generate different results from the same base search. You can also populate form inputs with a chain search. This helps reduce repetition in searches and can improve overall performance. 

When adding a new search via the front-end visual editor, you are given an option to make it a chain search. You then select what the base search is, and then enter your chain search. 

In the following example, the base search shown below is used for the chart and table, with each having a different chain search. Chain searches can also chain from existing chain searches. The single value visualization below chains from "chain 1" to create another chain search

### Datasource Definition for Base Search
\`\`\`json
{
    "type": "ds.search",
    "options": {
        "query": "| inputlookup outages_example.csv\\n| top Tags limit=10",
        "queryParameters": {}
    },
    "name": "base"
}
\`\`\``}},viz_NGZfoTti:{type:"splunk.column",dataSources:{primary:"ds_chain1"},title:"Chain 1 Column Chart",description:"| where count >100"},viz_Jx4ViV7N:{type:"splunk.table",title:"Chain 2 Table",dataSources:{primary:"ds_chain2"},description:'| rename count as "Entries" percent as "% total"'},viz_5AxetBTA:{type:"splunk.markdown",options:{markdown:`### Chain 1 Source Definition
\`\`\`json
{
    "type": "ds.chain",
    "options": {
        "extend": "ds_base",
        "query": "| where count > 100"
    },
    "name": "chain_1"
}
\`\`\``}},viz_w3nfQVDC:{type:"splunk.markdown",options:{markdown:`### Chain 2 Source Definition

\`\`\`json
{
    "type": "ds.chain",
    "options": {
        "extend": "ds_base",
        "query": "| rename count as \\"Entries\\" percent as \\"% total\\""
    },
    "name": "chain_2"
}
\`\`\``}},viz_BQAHNdLu:{type:"splunk.singlevalue",dataSources:{primary:"ds_chain3"},title:"Chaining from Chain 1",description:"Max Count",options:{unit:"entries"}},viz_LTYilU5h:{type:"splunk.markdown",options:{markdown:`### Chain 3 Source Definition

\`\`\`json
{
    "type": "ds.chain",
    "options": {
        "extend": "ds_chain1",
        "query": "| stats max(count) as \\"Max Count\\""
    },
    "name": "chain_3"
}
\`\`\``}}},dataSources:{ds_base:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| top Tags limit=10`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"base"},ds_chain1:{type:"ds.chain",options:{extend:"ds_base",query:"| where count > 100"},name:"chain_1"},ds_chain2:{type:"ds.chain",options:{extend:"ds_base",query:'| rename count as "Entries" percent as "% total"'},name:"chain_2"},ds_chain3:{type:"ds.chain",options:{extend:"ds_chain1",query:'| stats max(count) as "Max Count"'},name:"chain_3"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Optimize your dashboard by using base and chain searches to remove repitition",title:"Base and Chain Searches",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_C4mm5934",type:"block",position:{x:0,y:0,w:1200,h:457}},{item:"viz_NGZfoTti",type:"block",position:{x:0,y:457,w:403,h:282}},{item:"viz_5AxetBTA",type:"block",position:{x:0,y:739,w:403,h:239}},{item:"viz_Jx4ViV7N",type:"block",position:{x:403,y:457,w:398,h:282}},{item:"viz_w3nfQVDC",type:"block",position:{x:403,y:739,w:398,h:239}},{item:"viz_BQAHNdLu",type:"block",position:{x:801,y:457,w:399,h:282}},{item:"viz_LTYilU5h",type:"block",position:{x:801,y:739,w:399,h:239}}]}},globalInputs:[]}};var t=i(o());n(t.default.createElement(e,{definition:a}),{pageTitle:"Base and Chain Search",hideFooter:!0,layout:"fixed"});
