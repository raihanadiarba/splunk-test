/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var a={visualizations:{viz_pcZVNjLm:{type:"splunk.markdown",options:{markdown:`## Overview
Using defaults saves you time by applying a certain configuration or option in one place. One of the datasource options that you can set as default is the **refresh**.  

You can configure whether or not a datasource on your dashboard has a refresh set or not, as well as the type of refresh used. **Delay** starts the timer when the search is complete whereas **interval** starts the timer when the search is dispatched. By default, every visualization comes with the option to show when it was last updated to \`false\`. To see if your refresh is what you expected, turning this option to \`true\` can be a good way to confirm the dashboard is working the way you designed. 
\`\`\`json
"showLastUpdated": false
\`\`\`

As with all defaults, you can set them per datasource type, global, or locally within each datasource definition. The locally defined option takes the highest priority, and then the type specific default, and then the global. 

### Default Definition
\`\`\`json
"defaults": {
		"dataSources": {
			"global": {
				"options": {
					"refresh": "15s",
					"refreshType": "delay"
				}
			},
			"ds.search": {
				"options": {
					"refresh": "10s",
					"refreshType": "delay"
				}
			}
		}
	}
\`\`\``}},viz_HzpHxRa6:{type:"splunk.singlevalue",dataSources:{primary:"ds_XEyZrqjG"},title:"Refresh Set to 15 seconds - Last Updated On",description:"This visualization uses a ds.chain datasource, therefore the global default of 15s applies here",options:{sparklineDisplay:"after"},showProgressBar:!1,showLastUpdated:!0},viz_dZUpbQPE:{type:"splunk.singlevalue",dataSources:{primary:"ds_WmZ05OjQ"},title:"Refresh set to 10 seconds - Last Updated Off",description:"This visualization uses a ds.search datasource, therefore the configured default of 10s applies here",options:{sparklineDisplay:"after"},showProgressBar:!0}},dataSources:{ds_WmZ05OjQ:{type:"ds.search",options:{queryParameters:{earliest:"-4h@m",latest:"now"},query:"| makeresults count=15| streamstats count| eval _time=_time-(count*86400)| eval value=random()%100| fields _time value"},name:"Search_1"},ds_WRhFn3VE:{type:"ds.search",options:{queryParameters:{earliest:"-60m@m",latest:"now"},query:`| makeresults count=15
| streamstats count
| eval _time=_time-(count*86400)`},name:"Search_2"},ds_XEyZrqjG:{type:"ds.chain",options:{extend:"ds_WRhFn3VE",query:"| eval value=random()%100| fields _time value"},name:"Search_3"}},defaults:{dataSources:{global:{options:{refresh:"15s",refreshType:"delay"}},"ds.search":{options:{refresh:"10s",refreshType:"delay"}}}},inputs:{},description:"Data sources of different types can refresh at different intervals, or a global default can be set for all data sources",title:"Refresh Defaults and Show Last Updated",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_pcZVNjLm",type:"block",position:{x:0,y:0,w:600,h:726}},{item:"viz_dZUpbQPE",type:"block",position:{x:600,y:364,w:600,h:362}},{item:"viz_HzpHxRa6",type:"block",position:{x:600,y:0,w:600,h:364}}]}},globalInputs:[]}};var s=o(r());t(s.default.createElement(e,{definition:a}),{pageTitle:"Refresh Defaults",hideFooter:!0,layout:"fixed"});
