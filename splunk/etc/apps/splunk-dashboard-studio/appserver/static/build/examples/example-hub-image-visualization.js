/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as t}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as o}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var e={visualizations:{viz_AohBmiPR:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/images/splunk_logo.png"}},viz_0kNU0yRv:{type:"splunk.image",options:{src:"/static/app/splunk-dashboard-studio/images/examples-hub/images/splunk_logo.png"}},viz_jtcenYVx:{type:"splunk.markdown",options:{content:"",markdown:`## Overview

Images can be set in the dashboard or as part of the background. They are a great way to set some visual context, add company branding and also make your dashboard pop. `}},viz_uFN34V9Z:{type:"splunk.markdown",options:{content:"",markdown:`### Background Images

In this page, we showcase a background used in one of your example dashboards. A background like this can help set the aesthetic of your dashboard, and then coloring options for each of the visualizations on your dashboard can compliment it.

### Image as Background Source

\`\`\`json
"layout": {
		"type": "absolute",
		"options": {
			"height": 1400,
			"width": 1440,
			"backgroundColor": "transparent",
			"display": "auto-scale",
			"backgroundImage": {
				"sizeType": "contain",
				"x": 0,
				"y": 0,
				"src": "/static/app/splunk-dashboard-studio/images/examples-hub/ecommerce/background.png"
			}
		}
}
\`\`\``}},viz_h7074ePq:{type:"splunk.markdown",options:{content:"",markdown:`### Image Source - Preserved Aspect Ratio

\`\`\`json
{
    "type": "splunk.image",
    "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/images/splunk_logo.png"
    },
    "context": {}
}
\`\`\``}},viz_66Cmab3h:{type:"splunk.markdown",options:{content:"",markdown:`### Image Source - Aspect Ratio not Preserved

\`\`\`json
{
    "type": "splunk.image",
    "options": {
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/images/splunk_logo.png"
    },
    "context": {}
}
\`\`\``}}},dataSources:{},inputs:{},description:"Use Images to add visual context and personalize your dashboard ",title:"Images",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"absolute",options:{width:1440,backgroundColor:"transparent",display:"auto-scale",backgroundImage:{sizeType:"cover",x:0,y:0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/ecommerce/background.png"},height:800},structure:[{item:"viz_AohBmiPR",type:"block",position:{x:740,y:40,w:330,h:320}},{item:"viz_0kNU0yRv",type:"block",position:{x:720,y:440,w:350,h:200}},{item:"viz_jtcenYVx",type:"block",position:{x:40,y:10,w:570,h:110}},{item:"viz_uFN34V9Z",type:"block",position:{x:40,y:150,w:590,h:480}},{item:"viz_h7074ePq",type:"block",position:{x:1080,y:20,w:340,h:350}},{item:"viz_66Cmab3h",type:"block",position:{x:1080,y:400,w:340,h:350}}]}}}};var n=a(s());o(n.default.createElement(t,{definition:e}),{pageTitle:"Images",hideFooter:!0,layout:"fixed"});
