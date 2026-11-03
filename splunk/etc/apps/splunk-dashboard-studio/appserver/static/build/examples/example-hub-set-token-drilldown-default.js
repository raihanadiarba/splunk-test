/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as t}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a}from"../chunks/chunk-REK4W3C7.js";import{h as s}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_LEuCUe5h:{type:"splunk.markdown",options:{markdown:`## Overview 

This example shows how to set static default values with drilldown tokens. This can be set in the UI or using the shown source code below which is part of the \`defaults\` stanza of the dashboard definition. Note that for most cases, the <nameSpace> would be \`default\`. This feature also only supports **static** strings as initial values.

Dashboards allow for various manipulations and interactions that result in the setting of a token. This can be done through the drilldown settings of a visualization or through a form input. Most tokens however, only receive values after an initial interaction has been made with the dashboard. The implication of this behaviour would mean that any visualization or object on the dashboard that requires that token in its search, would not show results when the dashboard is first loaded and that token did not get set. 

Form inputs have the option for default values for their tokens to address this problem. Notice in the [Dropdown Input Example](/app/splunk-dashboard-studio/example-hub-dropdown-input), the charts populate as expected and the inputs have "All" selected as the default. This example shows how to do the same with drilldown tokens. 
\`\`\`json
"defaults": {
	"tokens": {
		"<nameSpace>": {
			"<tokenName>": {
				"value":  "<staticValue>"
			}
		}
	}
}
\`\`\``}},viz_H4zD53XX:{type:"splunk.table",dataSources:{primary:"ds_BU6mpc5w"},eventHandlers:[{type:"drilldown.setToken",options:{tokens:[{token:"bytes_in",key:"row.host.value"},{token:"bytes_out",key:"row.host.value"}]}}],title:"Data Table"},viz_v5WItj06:{type:"splunk.markdown",options:{markdown:`## Table Set Token Source

\`\`\`json
{
    "type": "splunk.table",
    "dataSources": {
        "primary": "ds_BU6mpc5w"
    },
    "eventHandlers": [
        {
            "type": "drilldown.setToken",
            "options": {
                "tokens": [
                    {
                        "token": "bytes_in_token",
                        "key": "row.host.value"
                    },
                    {
                        "token": "bytes_out_token",
                        "key": "row.host.value"
                    }
                ]
            }
        }
    ],
    "options": {},
    "context": {},
}
\`\`\`

## Source for Setting Token on Default
\`\`\`json
"defaults": {
	"tokens": {
		"default": {
			"bytes_in_token": {
				"value": "host18"
			}
		}
	}
}
\`\`\``}},viz_zcUcO0ds:{type:"splunk.singlevalue",showProgressBar:!1,showLastUpdated:!1,dataSources:{primary:"ds_d7dofQOu"},title:"Bytes-In Chart, Defaults to host18 on page load"},viz_Tf8jnWbf:{type:"splunk.markdown",options:{markdown:`## SPL for Bytes-In Chart
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| search host=<$bytes_in_token$>
| eval myTime=strftime(timestamp,"%H:%M")
| chart sum(bytes_in) over myTime by host
\`\`\`
## SPL for Bytes-Out Chart
\`\`\`splunk-spl
| inputlookup firewall_example.csv
| search host=<$bytes_out$>
| eval myTime=strftime(timestamp,"%H:%M")
| chart sum(bytes_out) over myTime by host
\`\`\`
Note that you would put your token name where the angle brackets are. 

`}},viz_hfu16cJZ:{type:"splunk.singlevalue",title:"Bytes-Out Chart, no default on page load",dataSources:{primary:"ds_5x5kW4iW"},description:"Requires click event for visualization to render"}},dataSources:{ds_BU6mpc5w:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats sum(bytes_in) sum(bytes_out) by host`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_1"},ds_d7dofQOu:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host=$bytes_in$
| eval myTime=strftime(timestamp,"%H:%M")
| chart sum(bytes_in) over myTime by host`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_2"},ds_5x5kW4iW:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| inputlookup firewall_example.csv
| search host=$bytes_out$
| eval myTime=strftime(timestamp,"%H:%M")
| chart sum(bytes_out) over myTime by host`},name:"Search_3"}},defaults:{tokens:{default:{bytes_in:{value:"host18"}}}},inputs:{},description:"Populate token-dependent on page load by using static default values",title:"Set a Token Default",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_LEuCUe5h",type:"block",position:{x:0,y:0,w:1200,h:447}},{item:"viz_H4zD53XX",type:"block",position:{x:0,y:447,w:306,h:695}},{item:"viz_v5WItj06",type:"block",position:{x:306,y:447,w:285,h:695}},{item:"viz_hfu16cJZ",type:"block",position:{x:591,y:744,w:311,h:398}},{item:"viz_zcUcO0ds",type:"block",position:{x:591,y:447,w:311,h:297}},{item:"viz_Tf8jnWbf",type:"block",position:{x:902,y:447,w:298,h:695}}]}},globalInputs:[]}};var o=s(a());e(o.default.createElement(t,{definition:n}),{pageTitle:"Set a Token Default",hideFooter:!0,layout:"fixed"});
