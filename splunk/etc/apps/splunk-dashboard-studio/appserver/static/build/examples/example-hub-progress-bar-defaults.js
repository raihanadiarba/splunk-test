/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as t}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var e={visualizations:{viz_pcZVNjLm:{type:"splunk.markdown",options:{markdown:`## Overview
Using defaults saves you time by applying a certain configuration or option in one place. One visualization option that is useful when set as a default is the **progress bar**. Normally, Dashboard Studio visualizations always come with the \`"showProgressBar": false\` option already shown (Example's Hub visualizations have these removed from the displayed source). 

The progress bar allows some visibility into the status of your search. Which can be useful for large searches and can indicate whether or not your dashboard has the latest information or is still retrieving it from Splunk. 

All available visualization defaults can be set globally, per visualization type, and locally within each visualization definition. The local configuration takes highest priority, then type option, then the global option. 

To the right is a GIF of a visualization that has the progress bar enabled. 

### Default Definition
\`\`\`json
"defaults": {
		"visualizations": {
			"global": {
				"showProgressBar": false
			},
			"splunk.area": {
				"showProgressBar": true
			}
		}
	}
\`\`\``}},viz_0QN67Fwe:{type:"splunk.image",showProgressBar:!1,showLastUpdated:!1,options:{src:"/static/app/splunk-dashboard-studio/images/examples-hub/progress_bar.gif"}}},dataSources:{},defaults:{visualizations:{global:{showProgressBar:!1},"splunk.area":{showProgressBar:!0}}},inputs:{},description:"Progress bars can be revealed per visualization instance, for every visualization of a certain type, or at a default global level",title:"Progress Bar Defaults",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_pcZVNjLm",type:"block",position:{x:0,y:0,w:634,h:726}},{item:"viz_0QN67Fwe",type:"block",position:{x:634,y:0,w:566,h:726}}]}},globalInputs:[]}};var i=o(s());a(i.default.createElement(t,{definition:e}),{pageTitle:"Progress Bar Defaults",hideFooter:!0,layout:"fixed"});
