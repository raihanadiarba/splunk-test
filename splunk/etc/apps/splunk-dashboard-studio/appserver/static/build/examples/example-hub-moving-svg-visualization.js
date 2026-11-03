/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as o}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as i}from"../chunks/chunk-REK4W3C7.js";import{h as l}from"../chunks/chunk-JHLB3KMN.js";var s={visualizations:{viz_4GWJrZWN:{type:"splunk.markdown",options:{markdown:`## Overview
Choropleth SVGs gives the ability for coloring custom Scalable Vector Graphic (SVG) images.

Using SVG's are the best way to completely personalize your dashboard. Many tools are available to create an SVG specific to your needs. Once an SVG is created, you can add it from the visual editor by uploading the file.

SVGs can be designed to move. If you have an SVG of this nature, it can work as expected in dashboards, and you can use tokens to control that movement. The following examples showcase that capability. Use the input to interact with the SVG's on the page. `}},viz_eeGdYP1B:{type:"splunk.choropleth.svg",options:{svg:'<svg id="ek0wgexyv1jh1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><style><![CDATA[#ek0wgexyv1jh3_ts {animation: ek0wgexyv1jh3_ts__ts 2800ms linear infinite normal forwards}@keyframes ek0wgexyv1jh3_ts__ts { 0% {transform: translate(100px,100px) scale(0.970850,0.982520)} 25% {transform: translate(100px,100px) scale(0.625604,0.633124)} 50% {transform: translate(100px,100px) scale(0.970000,0.980000)} 75% {transform: translate(100px,100px) scale(0.625604,0.633124)} 100% {transform: translate(100px,100px) scale(0.970000,0.980000)} }]]></style><g id="ek0wgexyv1jh2"><g id="ek0wgexyv1jh3_ts" transform="translate(100,100) scale(0.970850,0.982520)"><circle id="ball" r="80.917412" transform="translate(-0,-0)" fill="none" stroke="rgb(0,0,0)" stroke-width="3"/></g></g></svg>',areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},dataSources:{primary:"ds_ball"},context:{areaColorsEditorConfig:[{value:"#5C33FF",to:1},{value:"#207865",from:1,to:2},{value:"#AD3F20",from:2}]},title:"Moving Ball",description:"Dynamic Coloring with Input"},viz_57ZjrWTg:{type:"splunk.markdown",options:{markdown:`### SPL Definition
\`\`\`splunk-spl
|  makeresults 
|  eval id="ball"
|  eval total= $input$
\`\`\`

### Source Definition
\`\`\`json
{
    "type": "splunk.choropleth.svg",
    "options": {
        "svg": "<svg id=\\"ek0wgexyv1jh1\\" xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" viewBox=\\"0 0 200 200\\" shape-rendering=\\"geometricPrecision\\" text-rendering=\\"geometricPrecision\\"><style><![CDATA[#ek0wgexyv1jh3_ts {animation: ek0wgexyv1jh3_ts__ts 2800ms linear infinite normal forwards}@keyframes ek0wgexyv1jh3_ts__ts { 0% {transform: translate(100px,100px) scale(0.970850,0.982520)} 25% {transform: translate(100px,100px) scale(0.625604,0.633124)} 50% {transform: translate(100px,100px) scale(0.970000,0.980000)} 75% {transform: translate(100px,100px) scale(0.625604,0.633124)} 100% {transform: translate(100px,100px) scale(0.970000,0.980000)} }]]></style><g id=\\"ek0wgexyv1jh2\\"><g id=\\"ek0wgexyv1jh3_ts\\" transform=\\"translate(100,100) scale(0.970850,0.982520)\\"><circle id=\\"ball\\" r=\\"80.917412\\" transform=\\"translate(-0,-0)\\" fill=\\"none\\" stroke=\\"rgb(0,0,0)\\" stroke-width=\\"3\\"/></g></g></svg>",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
    },
    "dataSources": {
        "primary": "ds_ball"
    },
    "context": {
        "areaColorsEditorConfig": [
            {
                "value": "#5C33FF",
                "to": 1
            },
            {
                "value": "#207865",
                "from": 1,
                "to": 2
            },
            {
                "value": "#AD3F20",
                "from": 2
            }
        ]
    }
}
\`\`\``}},viz_PcOsgBKJ:{type:"splunk.choropleth.svg",options:{svg:'<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="280px" height="280px" viewBox="340 140 280 280" enable-background="new 340 140 280 280"  xml:space="preserve"><path id="medium" fill="none" x="0px" y="0px" d="M620,305.666v-51.333l-31.5-5.25c-2.333-8.75-5.833-16.917-9.917-23.917L597.25,199.5l-36.167-36.75l-26.25,18.083 c-7.583-4.083-15.75-7.583-23.916-9.917L505.667,140h-51.334l-5.25,31.5c-8.75,2.333-16.333,5.833-23.916,9.916L399.5,163.333 L362.75,199.5l18.667,25.666c-4.083,7.584-7.583,15.75-9.917,24.5l-31.5,4.667v51.333l31.5,5.25 c2.333,8.75,5.833,16.334,9.917,23.917l-18.667,26.25l36.167,36.167l26.25-18.667c7.583,4.083,15.75,7.583,24.5,9.917l5.25,30.916 h51.333l5.25-31.5c8.167-2.333,16.333-5.833,23.917-9.916l26.25,18.666l36.166-36.166l-18.666-26.25 c4.083-7.584,7.583-15.167,9.916-23.917L620,305.666z M480,333.666c-29.75,0-53.667-23.916-53.667-53.666s24.5-53.667,53.667-53.667 S533.667,250.25,533.667,280S509.75,333.666,480,333.666z"> <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="360 480 280" to="0 480 280" dur="5s" additive="sum" repeatCount="indefinite" /></path><path id="fast" fill="none"  x="0px" y="0px" d="M620,305.666v-51.333l-31.5-5.25c-2.333-8.75-5.833-16.917-9.917-23.917L597.25,199.5l-36.167-36.75l-26.25,18.083 c-7.583-4.083-15.75-7.583-23.916-9.917L505.667,140h-51.334l-5.25,31.5c-8.75,2.333-16.333,5.833-23.916,9.916L399.5,163.333 L362.75,199.5l18.667,25.666c-4.083,7.584-7.583,15.75-9.917,24.5l-31.5,4.667v51.333l31.5,5.25 c2.333,8.75,5.833,16.334,9.917,23.917l-18.667,26.25l36.167,36.167l26.25-18.667c7.583,4.083,15.75,7.583,24.5,9.917l5.25,30.916 h51.333l5.25-31.5c8.167-2.333,16.333-5.833,23.917-9.916l26.25,18.666l36.166-36.166l-18.666-26.25 c4.083-7.584,7.583-15.167,9.916-23.917L620,305.666z M480,333.666c-29.75,0-53.667-23.916-53.667-53.666s24.5-53.667,53.667-53.667 S533.667,250.25,533.667,280S509.75,333.666,480,333.666z"> <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="360 480 280" to="0 480 280" dur="1s" additive="sum" repeatCount="indefinite" /></path><path id="slow" fill="none"  x="0px" y="0px" d="M620,305.666v-51.333l-31.5-5.25c-2.333-8.75-5.833-16.917-9.917-23.917L597.25,199.5l-36.167-36.75l-26.25,18.083 c-7.583-4.083-15.75-7.583-23.916-9.917L505.667,140h-51.334l-5.25,31.5c-8.75,2.333-16.333,5.833-23.916,9.916L399.5,163.333 L362.75,199.5l18.667,25.666c-4.083,7.584-7.583,15.75-9.917,24.5l-31.5,4.667v51.333l31.5,5.25 c2.333,8.75,5.833,16.334,9.917,23.917l-18.667,26.25l36.167,36.167l26.25-18.667c7.583,4.083,15.75,7.583,24.5,9.917l5.25,30.916 h51.333l5.25-31.5c8.167-2.333,16.333-5.833,23.917-9.916l26.25,18.666l36.166-36.166l-18.666-26.25 c4.083-7.584,7.583-15.167,9.916-23.917L620,305.666z M480,333.666c-29.75,0-53.667-23.916-53.667-53.666s24.5-53.667,53.667-53.667 S533.667,250.25,533.667,280S509.75,333.666,480,333.666z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="360 480 280" to="0 480 280" dur="10s" additive="sum" repeatCount="indefinite" /></path></svg>',areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},dataSources:{primary:"ds_gear"},context:{areaColorsEditorConfig:[{value:"#FE3A3A",to:1},{value:"#FFD442",from:1,to:2},{value:"#088F44",from:2}]},title:"Moving Gear",description:"Coloring and Speed with Input"},viz_9JVo3RpT:{type:"splunk.table",options:{},dataSources:{primary:"ds_ball"}},viz_xp8Qf6Fv:{type:"splunk.table",options:{},dataSources:{primary:"ds_gear"}},viz_ZGebUvUv:{type:"splunk.markdown",options:{markdown:`### SPL Definition
\`\`\`splunk-spl
|  makeresults 
|  eval value=$input$
|  eval id=case(value==0, "slow", value==1,"medium", value==2, "fast")
|  table id value
\`\`\`

### Source Definition
\`\`\`json
{
    "type": "splunk.choropleth.svg",
    "options": {
        "svg": "<svg version=\\"1.1\\" id=\\"Layer_1\\" xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" x=\\"0px\\" y=\\"0px\\" width=\\"280px\\" height=\\"280px\\" viewBox=\\"340 140 280 280\\" enable-background=\\"new 340 140 280 280\\"  xml:space=\\"preserve\\"><path id=\\"medium\\" fill=\\"none\\" x=\\"0px\\" y=\\"0px\\" d=\\"M620,305.666v-51.333l-31.5-5.25c-2.333-8.75-5.833-16.917-9.917-23.917L597.25,199.5l-36.167-36.75l-26.25,18.083 c-7.583-4.083-15.75-7.583-23.916-9.917L505.667,140h-51.334l-5.25,31.5c-8.75,2.333-16.333,5.833-23.916,9.916L399.5,163.333 L362.75,199.5l18.667,25.666c-4.083,7.584-7.583,15.75-9.917,24.5l-31.5,4.667v51.333l31.5,5.25 c2.333,8.75,5.833,16.334,9.917,23.917l-18.667,26.25l36.167,36.167l26.25-18.667c7.583,4.083,15.75,7.583,24.5,9.917l5.25,30.916 h51.333l5.25-31.5c8.167-2.333,16.333-5.833,23.917-9.916l26.25,18.666l36.166-36.166l-18.666-26.25 c4.083-7.584,7.583-15.167,9.916-23.917L620,305.666z M480,333.666c-29.75,0-53.667-23.916-53.667-53.666s24.5-53.667,53.667-53.667 S533.667,250.25,533.667,280S509.75,333.666,480,333.666z\\"> <animateTransform attributeType=\\"xml\\" attributeName=\\"transform\\" type=\\"rotate\\" from=\\"360 480 280\\" to=\\"0 480 280\\" dur=\\"5s\\" additive=\\"sum\\" repeatCount=\\"indefinite\\" /></path><path id=\\"fast\\" fill=\\"none\\"  x=\\"0px\\" y=\\"0px\\" d=\\"M620,305.666v-51.333l-31.5-5.25c-2.333-8.75-5.833-16.917-9.917-23.917L597.25,199.5l-36.167-36.75l-26.25,18.083 c-7.583-4.083-15.75-7.583-23.916-9.917L505.667,140h-51.334l-5.25,31.5c-8.75,2.333-16.333,5.833-23.916,9.916L399.5,163.333 L362.75,199.5l18.667,25.666c-4.083,7.584-7.583,15.75-9.917,24.5l-31.5,4.667v51.333l31.5,5.25 c2.333,8.75,5.833,16.334,9.917,23.917l-18.667,26.25l36.167,36.167l26.25-18.667c7.583,4.083,15.75,7.583,24.5,9.917l5.25,30.916 h51.333l5.25-31.5c8.167-2.333,16.333-5.833,23.917-9.916l26.25,18.666l36.166-36.166l-18.666-26.25 c4.083-7.584,7.583-15.167,9.916-23.917L620,305.666z M480,333.666c-29.75,0-53.667-23.916-53.667-53.666s24.5-53.667,53.667-53.667 S533.667,250.25,533.667,280S509.75,333.666,480,333.666z\\"> <animateTransform attributeType=\\"xml\\" attributeName=\\"transform\\" type=\\"rotate\\" from=\\"360 480 280\\" to=\\"0 480 280\\" dur=\\"1s\\" additive=\\"sum\\" repeatCount=\\"indefinite\\" /></path><path id=\\"slow\\" fill=\\"none\\"  x=\\"0px\\" y=\\"0px\\" d=\\"M620,305.666v-51.333l-31.5-5.25c-2.333-8.75-5.833-16.917-9.917-23.917L597.25,199.5l-36.167-36.75l-26.25,18.083 c-7.583-4.083-15.75-7.583-23.916-9.917L505.667,140h-51.334l-5.25,31.5c-8.75,2.333-16.333,5.833-23.916,9.916L399.5,163.333 L362.75,199.5l18.667,25.666c-4.083,7.584-7.583,15.75-9.917,24.5l-31.5,4.667v51.333l31.5,5.25 c2.333,8.75,5.833,16.334,9.917,23.917l-18.667,26.25l36.167,36.167l26.25-18.667c7.583,4.083,15.75,7.583,24.5,9.917l5.25,30.916 h51.333l5.25-31.5c8.167-2.333,16.333-5.833,23.917-9.916l26.25,18.666l36.166-36.166l-18.666-26.25 c4.083-7.584,7.583-15.167,9.916-23.917L620,305.666z M480,333.666c-29.75,0-53.667-23.916-53.667-53.666s24.5-53.667,53.667-53.667 S533.667,250.25,533.667,280S509.75,333.666,480,333.666z\\"><animateTransform attributeType=\\"xml\\" attributeName=\\"transform\\" type=\\"rotate\\" from=\\"360 480 280\\" to=\\"0 480 280\\" dur=\\"10s\\" additive=\\"sum\\" repeatCount=\\"indefinite\\" /></path></svg>",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
    },
    "dataSources": {
        "primary": "ds_gear"
    },
    "context": {
        "areaColorsEditorConfig": [
            {
                "value": "#FE3A3A",
                "to": 1
            },
            {
                "value": "#FFD442",
                "from": 1,
                "to": 2
            },
            {
                "value": "#088F44",
                "from": 2
            }
        ]
    }
}
\`\`\``}},viz_uZp8XAQc:{type:"splunk.choropleth.svg",dataSources:{primary:"ds_z99ekkjf"},options:{svg:'<svg id="svg52" width="256" height="512" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_00"><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_01"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="1%" stop-opacity="1" stop-color="#c00" /><stop offset="1%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_02"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="2%" stop-opacity="1" stop-color="#c00" /><stop offset="2%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_03"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="3%" stop-opacity="1" stop-color="#c00" /><stop offset="3%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_04"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="4%" stop-opacity="1" stop-color="#c00" /><stop offset="4%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_05"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="5%" stop-opacity="1" stop-color="#c00" /><stop offset="5%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_06"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="6%" stop-opacity="1" stop-color="#c00" /><stop offset="6%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_07"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="7%" stop-opacity="1" stop-color="#c00" /><stop offset="7%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_08"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="8%" stop-opacity="1" stop-color="#c00" /><stop offset="8%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_09"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="9%" stop-opacity="1" stop-color="#c00" /><stop offset="9%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_1"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="10%" stop-opacity="1" stop-color="#c00" /><stop offset="10%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_11"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="11%" stop-opacity="1" stop-color="#c00" /><stop offset="11%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_12"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="12%" stop-opacity="1" stop-color="#c00" /><stop offset="12%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_13"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="13%" stop-opacity="1" stop-color="#c00" /><stop offset="13%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_14"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="14%" stop-opacity="1" stop-color="#c00" /><stop offset="14%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_15"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="15%" stop-opacity="1" stop-color="#c00" /><stop offset="15%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_16"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="16%" stop-opacity="1" stop-color="#c00" /><stop offset="16%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_17"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="17%" stop-opacity="1" stop-color="#c00" /><stop offset="17%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_18"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="18%" stop-opacity="1" stop-color="#c00" /><stop offset="18%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_19"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="19%" stop-opacity="1" stop-color="#c00" /><stop offset="19%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_2"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="20%" stop-opacity="1" stop-color="#c00" /><stop offset="20%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_21"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="21%" stop-opacity="1" stop-color="#c00" /><stop offset="21%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_22"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="22%" stop-opacity="1" stop-color="#c00" /><stop offset="22%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_23"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="23%" stop-opacity="1" stop-color="#c00" /><stop offset="23%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_24"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="24%" stop-opacity="1" stop-color="#c00" /><stop offset="24%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_25"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="25%" stop-opacity="1" stop-color="#c00" /><stop offset="25%" stop-opacity="0" stop-color="#c00" /><stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient> <linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_26"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="26%" stop-opacity="1" stop-color="#c00" /><stop offset="26%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient> <linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_27"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="27%" stop-opacity="1" stop-color="#c00" /><stop offset="27%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient> <linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_28"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="28%" stop-opacity="1" stop-color="#c00" /><stop offset="28%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient> <linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_29"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="29%" stop-opacity="1" stop-color="#c00" /><stop offset="29%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_3"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="30%" stop-opacity="1" stop-color="#c00" /><stop offset="30%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_31"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="31%" stop-opacity="1" stop-color="#c00" /><stop offset="31%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_32"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="32%" stop-opacity="1" stop-color="#c00" /><stop offset="32%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_33"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="33%" stop-opacity="1" stop-color="#c00" /><stop offset="33%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_34"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="34%" stop-opacity="1" stop-color="#c00" /><stop offset="34%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_35"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="35%" stop-opacity="1" stop-color="#c00" /><stop offset="35%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_36"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="36%" stop-opacity="1" stop-color="#c00" /><stop offset="36%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_37"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="37%" stop-opacity="1" stop-color="#c00" /><stop offset="37%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_38"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="38%" stop-opacity="1" stop-color="#c00" /><stop offset="38%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_39"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="39%" stop-opacity="1" stop-color="#c00" /><stop offset="39%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_4"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="40%" stop-opacity="1" stop-color="#c00" /><stop offset="40%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_41"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="41%" stop-opacity="1" stop-color="#c00" /><stop offset="41%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_42"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="42%" stop-opacity="1" stop-color="#c00" /><stop offset="42%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_43"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="43%" stop-opacity="1" stop-color="#c00" /><stop offset="43%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_44"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="44%" stop-opacity="1" stop-color="#c00" /><stop offset="44%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_45"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="45%" stop-opacity="1" stop-color="#c00" /><stop offset="45%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_46"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="46%" stop-opacity="1" stop-color="#c00" /><stop offset="46%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_47"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="47%" stop-opacity="1" stop-color="#c00" /><stop offset="47%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_48"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="48%" stop-opacity="1" stop-color="#c00" /><stop offset="48%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_49"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="49%" stop-opacity="1" stop-color="#c00" /><stop offset="49%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_5"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="50%" stop-opacity="1" stop-color="#c00" /><stop offset="50%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_51"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="51%" stop-opacity="1" stop-color="#c00" /><stop offset="51%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_52"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="52%" stop-opacity="1" stop-color="#c00" /><stop offset="52%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_53"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="53%" stop-opacity="1" stop-color="#c00" /><stop offset="53%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_54"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="54%" stop-opacity="1" stop-color="#c00" /><stop offset="54%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_55"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="55%" stop-opacity="1" stop-color="#c00" /><stop offset="55%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_56"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="56%" stop-opacity="1" stop-color="#c00" /><stop offset="56%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_57"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="57%" stop-opacity="1" stop-color="#c00" /><stop offset="57%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_58"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="58%" stop-opacity="1" stop-color="#c00" /><stop offset="58%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_59"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="59%" stop-opacity="1" stop-color="#c00" /><stop offset="59%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_6"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="60%" stop-opacity="1" stop-color="#c00" /><stop offset="60%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_61"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="61%" stop-opacity="1" stop-color="#c00" /><stop offset="61%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_62"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="62%" stop-opacity="1" stop-color="#c00" /><stop offset="62%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_63"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="63%" stop-opacity="1" stop-color="#c00" /><stop offset="63%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_64"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="64%" stop-opacity="1" stop-color="#c00" /><stop offset="64%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_65"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="65%" stop-opacity="1" stop-color="#c00" /><stop offset="65%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_66"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="66%" stop-opacity="1" stop-color="#c00" /><stop offset="66%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_67"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="67%" stop-opacity="1" stop-color="#c00" /><stop offset="67%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_68"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="68%" stop-opacity="1" stop-color="#c00" /><stop offset="68%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_69"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="69%" stop-opacity="1" stop-color="#c00" /><stop offset="69%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_7"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="70%" stop-opacity="1" stop-color="#c00" /><stop offset="70%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_71"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="71%" stop-opacity="1" stop-color="#c00" /><stop offset="71%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_72"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="72%" stop-opacity="1" stop-color="#c00" /><stop offset="72%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_73"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="73%" stop-opacity="1" stop-color="#c00" /><stop offset="73%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_74"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="74%" stop-opacity="1" stop-color="#c00" /><stop offset="74%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_75"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="75%" stop-opacity="1" stop-color="#c00" /><stop offset="75%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_76"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="76%" stop-opacity="1" stop-color="#c00" /><stop offset="76%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_77"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="77%" stop-opacity="1" stop-color="#c00" /><stop offset="77%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_78"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="78%" stop-opacity="1" stop-color="#c00" /><stop offset="78%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_79"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="79%" stop-opacity="1" stop-color="#c00" /><stop offset="79%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_8"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="80%" stop-opacity="1" stop-color="#c00" /><stop offset="80%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_81"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="81%" stop-opacity="1" stop-color="#c00" /><stop offset="81%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_82"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="82%" stop-opacity="1" stop-color="#c00" /><stop offset="82%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_83"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="83%" stop-opacity="1" stop-color="#c00" /><stop offset="83%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_84"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="84%" stop-opacity="1" stop-color="#c00" /><stop offset="84%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_85"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="85%" stop-opacity="1" stop-color="#c00" /><stop offset="85%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_86"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="86%" stop-opacity="1" stop-color="#c00" /><stop offset="86%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_87"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="87%" stop-opacity="1" stop-color="#c00" /><stop offset="87%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_88"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="88%" stop-opacity="1" stop-color="#c00" /><stop offset="88%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_89"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="89%" stop-opacity="1" stop-color="#c00" /><stop offset="89%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_9"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="90%" stop-opacity="1" stop-color="#c00" /><stop offset="90%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_91"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="91%" stop-opacity="1" stop-color="#c00" /><stop offset="91%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_92"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="92%" stop-opacity="1" stop-color="#c00" /><stop offset="92%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_93"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="93%" stop-opacity="1" stop-color="#c00" /><stop offset="93%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_94"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="94%" stop-opacity="1" stop-color="#c00" /><stop offset="94%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_95"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="95%" stop-opacity="1" stop-color="#c00" /><stop offset="95%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_96"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="96%" stop-opacity="1" stop-color="#c00" /><stop offset="96%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_97"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="97%" stop-opacity="1" stop-color="#c00" /><stop offset="97%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_98"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="98%" stop-opacity="1" stop-color="#c00" /><stop offset="98%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_99"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="99%" stop-opacity="1" stop-color="#c00" /><stop offset="99%" stop-opacity="0" stop-color="#c00" /> <stop offset="100%" stop-opacity="0" stop-color="#c00" /></linearGradient><linearGradient x1="0" x2="0" y1="1" y2="0" id="fill_10"><stop offset="0%" stop-opacity="1" stop-color="#c00" /><stop offset="100%" stop-opacity="1" stop-color="#c00" /></linearGradient></defs><g id="g50" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><g id="svg_116" fill="#c00"><rect id="svg_114" x="29.5" y="436.75" width="31.75" height="6.25"/><path id="path2924" d="m81 474a35.5 35.5 0 1 1-71 0 35.5 35.5 0 1 1 71 0z"/></g><path id="rectangle_fill" d="m45.5 11c-9.8335 0-17.75 7.9165-17.75 17.75v413c-10.61 6.1405-17.75 17.618-17.75 30.75 0 19.596 15.904 35.5 35.5 35.5s35.5-15.904 35.5-35.5c0-13.133-7.1396-24.61-17.75-30.75v-413c0-9.8335-7.9165-17.75-17.75-17.75z" fill="none" stroke="#fff"/></g></svg>',areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{from:100,value:"url(#fill_10)"},{from:99,to:100,value:"url(#fill_99)"},{from:98,to:99,value:"url(#fill_98)"},{from:97,to:98,value:"url(#fill_97)"},{from:96,to:97,value:"url(#fill_96)"},{from:95,to:96,value:"url(#fill_95)"},{from:94,to:95,value:"url(#fill_94)"},{from:93,to:94,value:"url(#fill_93)"},{from:92,to:93,value:"url(#fill_92)"},{from:91,to:92,value:"url(#fill_91)"},{from:90,to:91,value:"url(#fill_9)"},{from:89,to:90,value:"url(#fill_89)"},{from:88,to:89,value:"url(#fill_88)"},{from:87,to:88,value:"url(#fill_87)"},{from:86,to:87,value:"url(#fill_86)"},{from:85,to:86,value:"url(#fill_85)"},{from:84,to:85,value:"url(#fill_84)"},{from:83,to:84,value:"url(#fill_83)"},{from:82,to:83,value:"url(#fill_82)"},{from:81,to:82,value:"url(#fill_81)"},{from:80,to:81,value:"url(#fill_8)"},{from:79,to:80,value:"url(#fill_79)"},{from:78,to:79,value:"url(#fill_78)"},{from:77,to:78,value:"url(#fill_77)"},{from:76,to:77,value:"url(#fill_76)"},{from:75,to:76,value:"url(#fill_75)"},{from:74,to:75,value:"url(#fill_74)"},{from:73,to:74,value:"url(#fill_73)"},{from:72,to:73,value:"url(#fill_72)"},{from:71,to:72,value:"url(#fill_71)"},{from:70,to:71,value:"url(#fill_7)"},{from:69,to:70,value:"url(#fill_69)"},{from:68,to:69,value:"url(#fill_68)"},{from:67,to:68,value:"url(#fill_67)"},{from:66,to:67,value:"url(#fill_66)"},{from:65,to:66,value:"url(#fill_65)"},{from:64,to:65,value:"url(#fill_64)"},{from:63,to:64,value:"url(#fill_63)"},{from:62,to:63,value:"url(#fill_62)"},{from:61,to:62,value:"url(#fill_61)"},{from:60,to:61,value:"url(#fill_6)"},{from:59,to:60,value:"url(#fill_59)"},{from:58,to:59,value:"url(#fill_58)"},{from:57,to:58,value:"url(#fill_57)"},{from:56,to:57,value:"url(#fill_56)"},{from:55,to:56,value:"url(#fill_55)"},{from:54,to:55,value:"url(#fill_54)"},{from:53,to:54,value:"url(#fill_53)"},{from:52,to:53,value:"url(#fill_52)"},{from:51,to:52,value:"url(#fill_51)"},{from:50,to:51,value:"url(#fill_5)"},{from:49,to:50,value:"url(#fill_49)"},{from:48,to:49,value:"url(#fill_48)"},{from:47,to:48,value:"url(#fill_47)"},{from:46,to:47,value:"url(#fill_46)"},{from:45,to:46,value:"url(#fill_45)"},{from:44,to:45,value:"url(#fill_44)"},{from:43,to:44,value:"url(#fill_43)"},{from:42,to:43,value:"url(#fill_42)"},{from:41,to:42,value:"url(#fill_41)"},{from:40,to:41,value:"url(#fill_4)"},{from:39,to:40,value:"url(#fill_39)"},{from:38,to:39,value:"url(#fill_38)"},{from:37,to:38,value:"url(#fill_37)"},{from:36,to:37,value:"url(#fill_36)"},{from:35,to:36,value:"url(#fill_35)"},{from:34,to:35,value:"url(#fill_34)"},{from:33,to:34,value:"url(#fill_33)"},{from:32,to:33,value:"url(#fill_32)"},{from:31,to:32,value:"url(#fill_31)"},{from:30,to:31,value:"url(#fill_3)"},{from:29,to:30,value:"url(#fill_29)"},{from:28,to:29,value:"url(#fill_28)"},{from:27,to:28,value:"url(#fill_27)"},{from:26,to:27,value:"url(#fill_26)"},{from:25,to:26,value:"url(#fill_25)"},{from:24,to:25,value:"url(#fill_24)"},{from:23,to:24,value:"url(#fill_23)"},{from:22,to:23,value:"url(#fill_23)"},{from:21,to:22,value:"url(#fill_21)"},{from:20,to:21,value:"url(#fill_2)"},{to:20,from:19,value:"url(#fill_19)"},{to:19,from:18,value:"url(#fill_18)"},{to:18,from:17,value:"url(#fill_17)"},{to:17,from:16,value:"url(#fill_16)"},{to:16,from:15,value:"url(#fill_15)"},{to:15,from:14,value:"url(#fill_14)"},{to:14,from:13,value:"url(#fill_13)"},{to:13,from:12,value:"url(#fill_12)"},{to:12,from:11,value:"url(#fill_11)"},{to:11,from:10,value:"url(#fill_1)"},{to:10,from:9,value:"url(#fill_09)"},{to:9,from:8,value:"url(#fill_08)"},{to:8,from:7,value:"url(#fill_07)"},{to:7,from:6,value:"url(#fill_06)"},{to:6,from:5,value:"url(#fill_05)"},{to:5,from:4,value:"url(#fill_04)"},{to:4,from:3,value:"url(#fill_03)"},{to:3,from:2,value:"url(#fill_02)"},{to:2,from:1,value:"url(#fill_01)"},{to:1,from:0,value:"#FFF"}]}},viz_CKVfO0z7:{type:"splunk.markdown",options:{markdown:`### SPL Definition
\`\`\`splunk-spl
|  makeresults 
|  eval id="rectangle_fill"
|  eval total= $input2$
\`\`\`
### Source Definition
\`\`\`json
{
    "type": "splunk.choropleth.svg",
    "dataSources": {
        "primary": "ds_z99ekkjf"
    },
    "options": {
        "svg": "<svg id=\\"svg52\\" width=\\"256\\" height=\\"512\\" version=\\"1.1\\" xmlns=\\"http://www.w3.org/2000/svg\\"><defs><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_00\\"><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_01\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"1%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"1%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_02\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"2%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"2%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_03\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"3%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"3%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_04\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"4%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"4%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_05\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"5%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"5%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_06\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"6%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"6%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_07\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"7%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"7%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_08\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"8%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"8%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_09\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"9%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"9%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_1\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"10%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"10%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_11\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"11%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"11%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_12\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"12%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"12%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_13\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"13%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"13%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_14\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"14%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"14%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_15\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"15%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"15%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_16\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"16%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"16%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_17\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"17%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"17%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_18\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"18%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"18%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_19\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"19%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"19%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_2\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"20%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"20%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_21\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"21%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"21%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_22\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"22%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"22%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_23\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"23%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"23%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_24\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"24%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"24%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_25\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"25%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"25%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient> <linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_26\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"26%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"26%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient> <linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_27\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"27%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"27%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient> <linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_28\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"28%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"28%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient> <linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_29\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"29%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"29%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_3\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"30%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"30%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_31\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"31%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"31%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_32\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"32%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"32%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_33\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"33%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"33%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_34\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"34%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"34%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_35\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"35%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"35%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_36\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"36%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"36%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_37\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"37%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"37%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_38\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"38%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"38%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_39\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"39%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"39%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_4\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"40%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"40%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_41\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"41%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"41%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_42\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"42%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"42%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_43\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"43%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"43%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_44\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"44%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"44%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_45\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"45%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"45%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_46\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"46%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"46%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_47\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"47%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"47%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_48\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"48%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"48%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_49\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"49%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"49%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_5\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"50%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"50%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_51\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"51%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"51%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_52\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"52%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"52%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_53\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"53%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"53%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_54\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"54%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"54%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_55\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"55%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"55%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_56\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"56%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"56%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_57\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"57%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"57%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_58\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"58%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"58%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_59\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"59%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"59%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_6\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"60%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"60%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_61\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"61%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"61%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_62\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"62%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"62%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_63\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"63%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"63%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_64\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"64%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"64%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_65\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"65%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"65%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_66\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"66%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"66%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_67\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"67%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"67%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_68\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"68%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"68%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_69\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"69%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"69%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_7\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"70%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"70%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_71\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"71%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"71%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_72\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"72%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"72%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_73\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"73%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"73%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_74\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"74%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"74%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_75\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"75%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"75%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_76\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"76%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"76%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_77\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"77%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"77%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_78\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"78%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"78%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_79\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"79%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"79%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_8\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"80%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"80%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_81\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"81%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"81%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_82\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"82%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"82%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_83\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"83%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"83%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_84\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"84%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"84%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_85\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"85%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"85%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_86\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"86%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"86%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_87\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"87%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"87%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_88\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"88%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"88%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_89\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"89%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"89%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_9\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"90%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"90%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_91\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"91%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"91%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_92\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"92%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"92%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_93\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"93%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"93%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_94\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"94%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"94%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_95\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"95%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"95%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_96\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"96%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"96%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_97\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"97%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"97%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_98\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"98%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"98%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_99\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"99%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"99%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /> <stop offset=\\"100%\\" stop-opacity=\\"0\\" stop-color=\\"#c00\\" /></linearGradient><linearGradient x1=\\"0\\" x2=\\"0\\" y1=\\"1\\" y2=\\"0\\" id=\\"fill_10\\"><stop offset=\\"0%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /><stop offset=\\"100%\\" stop-opacity=\\"1\\" stop-color=\\"#c00\\" /></linearGradient></defs><g id=\\"g50\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-width=\\"4\\"><g id=\\"svg_116\\" fill=\\"#c00\\"><rect id=\\"svg_114\\" x=\\"29.5\\" y=\\"436.75\\" width=\\"31.75\\" height=\\"6.25\\"/><path id=\\"path2924\\" d=\\"m81 474a35.5 35.5 0 1 1-71 0 35.5 35.5 0 1 1 71 0z\\"/></g><path id=\\"rectangle_fill\\" d=\\"m45.5 11c-9.8335 0-17.75 7.9165-17.75 17.75v413c-10.61 6.1405-17.75 17.618-17.75 30.75 0 19.596 15.904 35.5 35.5 35.5s35.5-15.904 35.5-35.5c0-13.133-7.1396-24.61-17.75-30.75v-413c0-9.8335-7.9165-17.75-17.75-17.75z\\" fill=\\"none\\" stroke=\\"#fff\\"/></g></svg>",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
    },
    "context": {
        "areaColorsEditorConfig": [
            {
                "from": 100,
                "value": "url(#fill_10)"
            },
            {
                "from": 99,
                "to": 100,
                "value": "url(#fill_99)"
            },
            {
                "from": 98,
                "to": 99,
                "value": "url(#fill_98)"
            },
            {
                "from": 97,
                "to": 98,
                "value": "url(#fill_97)"
            },
            {
                "from": 96,
                "to": 97,
                "value": "url(#fill_96)"
            },
            {
                "from": 95,
                "to": 96,
                "value": "url(#fill_95)"
            },
            {
                "from": 94,
                "to": 95,
                "value": "url(#fill_94)"
            },
            {
                "from": 93,
                "to": 94,
                "value": "url(#fill_93)"
            },
            {
                "from": 92,
                "to": 93,
                "value": "url(#fill_92)"
            },
            {
                "from": 91,
                "to": 92,
                "value": "url(#fill_91)"
            },
            {
                "from": 90,
                "to": 91,
                "value": "url(#fill_9)"
            },
            {
                "from": 89,
                "to": 90,
                "value": "url(#fill_89)"
            },
            {
                "from": 88,
                "to": 89,
                "value": "url(#fill_88)"
            },
            {
                "from": 87,
                "to": 88,
                "value": "url(#fill_87)"
            },
            {
                "from": 86,
                "to": 87,
                "value": "url(#fill_86)"
            },
            {
                "from": 85,
                "to": 86,
                "value": "url(#fill_85)"
            },
            {
                "from": 84,
                "to": 85,
                "value": "url(#fill_84)"
            },
            {
                "from": 83,
                "to": 84,
                "value": "url(#fill_83)"
            },
            {
                "from": 82,
                "to": 83,
                "value": "url(#fill_82)"
            },
            {
                "from": 81,
                "to": 82,
                "value": "url(#fill_81)"
            },
            {
                "from": 80,
                "to": 81,
                "value": "url(#fill_8)"
            },
            {
                "from": 79,
                "to": 80,
                "value": "url(#fill_79)"
            },
            {
                "from": 78,
                "to": 79,
                "value": "url(#fill_78)"
            },
            {
                "from": 77,
                "to": 78,
                "value": "url(#fill_77)"
            },
            {
                "from": 76,
                "to": 77,
                "value": "url(#fill_76)"
            },
            {
                "from": 75,
                "to": 76,
                "value": "url(#fill_75)"
            },
            {
                "from": 74,
                "to": 75,
                "value": "url(#fill_74)"
            },
            {
                "from": 73,
                "to": 74,
                "value": "url(#fill_73)"
            },
            {
                "from": 72,
                "to": 73,
                "value": "url(#fill_72)"
            },
            {
                "from": 71,
                "to": 72,
                "value": "url(#fill_71)"
            },
            {
                "from": 70,
                "to": 71,
                "value": "url(#fill_7)"
            },
            {
                "from": 69,
                "to": 70,
                "value": "url(#fill_69)"
            },
            {
                "from": 68,
                "to": 69,
                "value": "url(#fill_68)"
            },
            {
                "from": 67,
                "to": 68,
                "value": "url(#fill_67)"
            },
            {
                "from": 66,
                "to": 67,
                "value": "url(#fill_66)"
            },
            {
                "from": 65,
                "to": 66,
                "value": "url(#fill_65)"
            },
            {
                "from": 64,
                "to": 65,
                "value": "url(#fill_64)"
            },
            {
                "from": 63,
                "to": 64,
                "value": "url(#fill_63)"
            },
            {
                "from": 62,
                "to": 63,
                "value": "url(#fill_62)"
            },
            {
                "from": 61,
                "to": 62,
                "value": "url(#fill_61)"
            },
            {
                "from": 60,
                "to": 61,
                "value": "url(#fill_6)"
            },
            {
                "from": 59,
                "to": 60,
                "value": "url(#fill_59)"
            },
            {
                "from": 58,
                "to": 59,
                "value": "url(#fill_58)"
            },
            {
                "from": 57,
                "to": 58,
                "value": "url(#fill_57)"
            },
            {
                "from": 56,
                "to": 57,
                "value": "url(#fill_56)"
            },
            {
                "from": 55,
                "to": 56,
                "value": "url(#fill_55)"
            },
            {
                "from": 54,
                "to": 55,
                "value": "url(#fill_54)"
            },
            {
                "from": 53,
                "to": 54,
                "value": "url(#fill_53)"
            },
            {
                "from": 52,
                "to": 53,
                "value": "url(#fill_52)"
            },
            {
                "from": 51,
                "to": 52,
                "value": "url(#fill_51)"
            },
            {
                "from": 50,
                "to": 51,
                "value": "url(#fill_5)"
            },
            {
                "from": 49,
                "to": 50,
                "value": "url(#fill_49)"
            },
            {
                "from": 48,
                "to": 49,
                "value": "url(#fill_48)"
            },
            {
                "from": 47,
                "to": 48,
                "value": "url(#fill_47)"
            },
            {
                "from": 46,
                "to": 47,
                "value": "url(#fill_46)"
            },
            {
                "from": 45,
                "to": 46,
                "value": "url(#fill_45)"
            },
            {
                "from": 44,
                "to": 45,
                "value": "url(#fill_44)"
            },
            {
                "from": 43,
                "to": 44,
                "value": "url(#fill_43)"
            },
            {
                "from": 42,
                "to": 43,
                "value": "url(#fill_42)"
            },
            {
                "from": 41,
                "to": 42,
                "value": "url(#fill_41)"
            },
            {
                "from": 40,
                "to": 41,
                "value": "url(#fill_4)"
            },
            {
                "from": 39,
                "to": 40,
                "value": "url(#fill_39)"
            },
            {
                "from": 38,
                "to": 39,
                "value": "url(#fill_38)"
            },
            {
                "from": 37,
                "to": 38,
                "value": "url(#fill_37)"
            },
            {
                "from": 36,
                "to": 37,
                "value": "url(#fill_36)"
            },
            {
                "from": 35,
                "to": 36,
                "value": "url(#fill_35)"
            },
            {
                "from": 34,
                "to": 35,
                "value": "url(#fill_34)"
            },
            {
                "from": 33,
                "to": 34,
                "value": "url(#fill_33)"
            },
            {
                "from": 32,
                "to": 33,
                "value": "url(#fill_32)"
            },
            {
                "from": 31,
                "to": 32,
                "value": "url(#fill_31)"
            },
            {
                "from": 30,
                "to": 31,
                "value": "url(#fill_3)"
            },
            {
                "from": 29,
                "to": 30,
                "value": "url(#fill_29)"
            },
            {
                "from": 28,
                "to": 29,
                "value": "url(#fill_28)"
            },
            {
                "from": 27,
                "to": 28,
                "value": "url(#fill_27)"
            },
            {
                "from": 26,
                "to": 27,
                "value": "url(#fill_26)"
            },
            {
                "from": 25,
                "to": 26,
                "value": "url(#fill_25)"
            },
            {
                "from": 24,
                "to": 25,
                "value": "url(#fill_24)"
            },
            {
                "from": 23,
                "to": 24,
                "value": "url(#fill_23)"
            },
            {
                "from": 22,
                "to": 23,
                "value": "url(#fill_23)"
            },
            {
                "from": 21,
                "to": 22,
                "value": "url(#fill_21)"
            },
            {
                "from": 20,
                "to": 21,
                "value": "url(#fill_2)"
            },
            {
                "to": 20,
                "from": 19,
                "value": "url(#fill_19)"
            },
            {
                "to": 19,
                "from": 18,
                "value": "url(#fill_18)"
            },
            {
                "to": 18,
                "from": 17,
                "value": "url(#fill_17)"
            },
            {
                "to": 17,
                "from": 16,
                "value": "url(#fill_16)"
            },
            {
                "to": 16,
                "from": 15,
                "value": "url(#fill_15)"
            },
            {
                "to": 15,
                "from": 14,
                "value": "url(#fill_14)"
            },
            {
                "to": 14,
                "from": 13,
                "value": "url(#fill_13)"
            },
            {
                "to": 13,
                "from": 12,
                "value": "url(#fill_12)"
            },
            {
                "to": 12,
                "from": 11,
                "value": "url(#fill_11)"
            },
            {
                "to": 11,
                "from": 10,
                "value": "url(#fill_1)"
            },
            {
                "to": 10,
                "from": 9,
                "value": "url(#fill_09)"
            },
            {
                "to": 9,
                "from": 8,
                "value": "url(#fill_08)"
            },
            {
                "to": 8,
                "from": 7,
                "value": "url(#fill_07)"
            },
            {
                "to": 7,
                "from": 6,
                "value": "url(#fill_06)"
            },
            {
                "to": 6,
                "from": 5,
                "value": "url(#fill_05)"
            },
            {
                "to": 5,
                "from": 4,
                "value": "url(#fill_04)"
            },
            {
                "to": 4,
                "from": 3,
                "value": "url(#fill_03)"
            },
            {
                "to": 3,
                "from": 2,
                "value": "url(#fill_02)"
            },
            {
                "to": 2,
                "from": 1,
                "value": "url(#fill_01)"
            },
            {
                "to": 1,
                "from": 0,
                "value": "#FFF"
            }
        ]
    }
}
\`\`\``}}},dataSources:{ds_gear:{type:"ds.search",options:{query:`|  makeresults 
|  eval value=$token$
|  eval id=case(value==0, "slow", value==1,"medium", value==2, "fast")
|  table id value`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Gear "},ds_ball:{type:"ds.search",options:{query:`|  makeresults 
|  eval id="ball"
|  eval total= $token$`,queryParameters:{earliest:"-15m",latest:"now"}},name:"ball"},ds_z99ekkjf:{type:"ds.search",options:{query:`|  makeresults 
|  eval id="rectangle_fill"
|  eval total= $token2$`,queryParameters:{earliest:"-15m",latest:"now"}},name:"meter"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_jlqugp4m:{options:{defaultValue:1,token:"token",min:0,max:2,step:1},title:"Gear Speed and Ball Color",type:"input.number"},input_gOGHopaM:{options:{defaultValue:10,token:"token2",step:10,min:0,max:100},title:"Meter Fill",type:"input.number"}},description:"Some SVG images can move depending on how they are made. These also work as expected in dashboards, and tokens can be used to control their movement",title:"Moving Choropleth SVGs",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_4GWJrZWN",type:"block",position:{x:0,y:0,w:1200,h:201}},{item:"viz_eeGdYP1B",type:"block",position:{x:0,y:201,w:600,h:480}},{item:"viz_9JVo3RpT",type:"block",position:{x:0,y:681,w:600,h:113}},{item:"viz_57ZjrWTg",type:"block",position:{x:0,y:794,w:600,h:311}},{item:"viz_uZp8XAQc",type:"block",position:{x:0,y:1105,w:167,h:572}},{item:"viz_CKVfO0z7",type:"block",position:{x:167,y:1105,w:1033,h:572}},{item:"viz_PcOsgBKJ",type:"block",position:{x:600,y:201,w:600,h:480}},{item:"viz_xp8Qf6Fv",type:"block",position:{x:600,y:681,w:600,h:113}},{item:"viz_ZGebUvUv",type:"block",position:{x:600,y:794,w:600,h:311}}]}},globalInputs:["input_jlqugp4m","input_gOGHopaM"]}};var p=l(i());t(p.default.createElement(o,{definition:s}),{pageTitle:"Moving SVGs",hideFooter:!0,layout:"fixed"});
