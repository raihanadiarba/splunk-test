/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as t}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as n}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var o={visualizations:{viz_jvApjKMh:{type:"splunk.markdown",options:{markdown:`## Overview

You can add a submit button so the dashboard does not refresh until the user has selected all input choices. This can avoid unnecessary search executions when multiple inputs are being changed.

To have the dashboard load using the default input values, add the option \`submitOnDashboardLoad\`, which will automatically run searches on the first dashboard load. After the initial load, the user must select the submit button to refresh the dashboard's searches and visualizations.

This example has \`submitOnDashboardLoad\` enabled.




`}},viz_oFXFrMCf:{type:"splunk.markdown",options:{markdown:"## Selected Input values\n\nSelected Host :   `$host$`\n\nSelected Error Code:   `$code$`\n\nSelected Key Words:   `$key_word$`"}},viz_mrbejEbu:{type:"splunk.markdown",options:{markdown:`\`\`\`json
"layout": {
		"type": "grid",
		"options": {
			"width": 1440,
			"height": 960,
			"submitButton": true,
			"submitOnDashboardLoad": true
		},
		"structure": [
...
\`\`\``}}},dataSources:{},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_YFw60F7i:{options:{items:[{label:"All",value:"*"},{label:"401",value:"401"},{label:"402",value:"402"},{label:"403",value:"403"}],defaultValue:["401"],token:"code"},title:"Select Error Code",type:"input.multiselect"},input_QUyDwraR:{options:{items:[{label:"All",value:"*"},{label:"Host 1",value:"Host_1"},{label:"Host 2",value:"Host 2"},{label:"Host 3",value:"Host 3"}],defaultValue:"*",token:"host"},title:"Select Host",type:"input.dropdown"},input_CV7lPA1r:{options:{defaultValue:"login",token:"key_word"},title:"Key Words",type:"input.text"}},description:"Submit all input selections at once",title:"Submit Button",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",options:{width:1440,height:960},structure:[{item:"viz_jvApjKMh",type:"block",position:{x:0,y:0,w:1200,h:140}},{item:"viz_oFXFrMCf",type:"block",position:{x:0,y:140,w:741,h:225}},{item:"viz_mrbejEbu",type:"block",position:{x:741,y:140,w:699,h:225}}]}},globalInputs:["input_QUyDwraR","input_YFw60F7i","input_CV7lPA1r"],options:{submitButton:!0,submitOnDashboardLoad:!0}}};var i=a(n());e(i.default.createElement(t,{definition:o}),{pageTitle:"Submit Button",hideFooter:!0,layout:"fixed"});
