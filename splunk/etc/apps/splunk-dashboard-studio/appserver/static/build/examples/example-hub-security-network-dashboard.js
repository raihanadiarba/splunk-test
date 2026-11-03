/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as s}from"../chunks/chunk-JHLB3KMN.js";var i={dataSources:{ds_7N1LKEOc:{type:"ds.search",options:{queryParameters:{earliest:"0",latest:""},query:`| inputlookup security_example_data.csv 
| where network_type!="" 
| iplocation network_ip
| geostats latfield=lat longfield=lon count by network_type
| eval employee_office=employee_office*123
| eval contingent_office=contingent_office*123
| eval employee_remote=employee_remote*123
| eval contingent_remote=contingent_remote*123
| eval visitor_office=visitor_office*15`},name:"Network Access Map"},ds_pclCazqp:{type:"ds.search",options:{queryParameters:{earliest:"0",latest:""},query:`| inputlookup security_example_data.csv
| where network_type!=""
| eval _time=timestamp
| timechart span=1d count by network_type 
| eval employee_office=employee_office*123 
| eval contingent_office=contingent_office*123 
| eval employee_remote=employee_remote*123 
| eval contingent_remote=contingent_remote*123 
| eval visitor_office=visitor_office*15`},name:"Network Access Base"},ds_i7huyNlb:{type:"ds.chain",options:{extend:"ds_pclCazqp",query:"| fields _time employee_office"},name:"Office Employees"},ds_1rQ1XclX_ds_i7huyNlb:{type:"ds.chain",options:{extend:"ds_pclCazqp",query:"| fields _time contingent_office"},name:"Office Contingents"},ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb:{type:"ds.chain",options:{extend:"ds_pclCazqp",query:"| fields _time employee_remote"},name:"Remote Employees"},ds_OqW1Ndcz_ds_1rQ1XclX_ds_i7huyNlb:{type:"ds.chain",options:{extend:"ds_pclCazqp",query:"| fields _time contingent_remote"},name:"Remote Contingents"},ds_LRX88BGJ_ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb:{type:"ds.chain",options:{extend:"ds_pclCazqp",query:"| fields _time visitor_office"},name:"Office Visitors"},ds_2w9t0SN3:{type:"ds.search",options:{queryParameters:{earliest:"0",latest:""},query:`| inputlookup security_example_data.csv
| where network_type!=""
| stats count by network_type
| eval employee_office=employee_office*123
| eval contingent_office=contingent_office*123
| eval employee_remote=employee_remote*123
| eval contingent_remote=contingent_remote*123
| eval visitor_office=visitor_office*15
| eval network_type=case(network_type="employee_office", "Employees in Office", network_type="contingent_office", "Contingents in Office", network_type="employee_remote", "Employees Remote", network_type="contingent_remote", "Contingents Remote", network_type="visitor_office", "Visitors in Office")`},name:"Network Access Pie"},ds_sH7noQQ0:{type:"ds.search",options:{queryParameters:{earliest:"0",latest:""},query:`| inputlookup security_example_data.csv
| where network_type!=""
| eval _time=timestamp
| eval network_type=case(network_type="employee_office", "Security Incidents", network_type="contingent_office", "Security Incidents", network_type="employee_remote", "Employees Remote", network_type="contingent_remote", "Contingents Remote", network_type="visittor_office", "Security Incidents")
| timechart span=1d count by network_type
| eval "Employees Remote"='Employees Remote'*202
| eval "Contingents Remote"= 'Contingents Remote'*123
| eval "Security Incidents"='Security Incidents'*(1+random() %5)`},name:"Remote Workers and Security"}},visualizations:{viz_903rCKeL:{type:"splunk.markdown",options:{markdown:"# Employee Network Access",fontSize:"extraLarge"}},viz_tQ1F8zM2:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent"}},viz_LK04XQ2J:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_46mBQRrA:{type:"splunk.markdown",options:{markdown:"## Employee Access Locations"}},viz_ykwd2HVA:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('employee_office')"},dataSources:{primary:"ds_pclCazqp"}},viz_MN4xX0yb:{type:"splunk.markdown",options:{markdown:"### Employees in Office"}},viz_b2Ke0gaF:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#FF67DE"],areaOpacity:.4},dataSources:{primary:"ds_i7huyNlb"}},viz_yVfrCyeN:{type:"splunk.map",options:{center:[20.31395205192264,23.79723118997208],zoom:1.17202532234071,layers:[{bubbleSize:"> primary | frameBySeriesNames('employee_office','contingent_office','employee_remote','contingent_remote','visitor_office')",seriesColors:["#FF67DE","#A870EF","#009CEB","#00CDAF","#DD9900"]}]},dataSources:{primary:"ds_7N1LKEOc"}},viz_67U6o6rr:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"data:image/png;base64,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"}},viz_XRHlJZXU:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_pink.png"}},viz_P2th2sn6:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_gpvdEHlu:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_purple.png"}},viz_fPKqjcia:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('contingent_office')"},dataSources:{primary:"ds_pclCazqp"}},viz_JXHTXpiB:{type:"splunk.markdown",options:{markdown:"### Contingents in Office"}},viz_mgZUvKA9:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#7B56DB"],areaOpacity:.4},dataSources:{primary:"ds_1rQ1XclX_ds_i7huyNlb"}},viz_d3XCHvYQ:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_nfLQSpRI:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_blue.png"}},viz_vqmp9PLf:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('employee_remote')"},dataSources:{primary:"ds_pclCazqp"}},viz_II5AbqAK:{type:"splunk.markdown",options:{markdown:"### Employees Remote"}},viz_X4whFlJ3:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#009CEB"],areaOpacity:.4},dataSources:{primary:"ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb"}},viz_oAjRVQTc:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_3BGyhxm5:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_green.png"}},viz_EzxmLlpy:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('contingent_remote')"},dataSources:{primary:"ds_pclCazqp"}},viz_vJyO1d3l:{type:"splunk.markdown",options:{markdown:"### Contingents Remote"}},viz_XsF1y5kd:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#00CDAF"],areaOpacity:.4},dataSources:{primary:"ds_OqW1Ndcz_ds_1rQ1XclX_ds_i7huyNlb"}},viz_PFdPPbu6:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_xVOAM68e:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_yellow.png"}},viz_EUH9dxGK:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('visitor_office')"},dataSources:{primary:"ds_pclCazqp"}},viz_ntjcpu6R:{type:"splunk.markdown",options:{markdown:"### Visitors In Office"}},viz_h65HSLsT:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#DD9900"],areaOpacity:.4},dataSources:{primary:"ds_LRX88BGJ_ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb"}},viz_MyZbuF64:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent"}},viz_E4kFdqLy:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent"}},viz_3Caox5jb:{type:"splunk.pie",options:{labelDisplay:"valuesAndPercentage",backgroundColor:"transparent",seriesColorsByField:{"Employees in Office":"#FF67DE","Employees Remote":"#A870EF","Contingents in Office":"#009CEB","Contingents Remote":"#00CDAF","Visitors in Office":"#DD9900"}},dataSources:{primary:"ds_2w9t0SN3"}},viz_Ay3vwXS9:{type:"splunk.area",options:{nullValueDisplay:"zero",backgroundColor:"transparent",xAxisTitleVisibility:"hide",legendDisplay:"off",yAxisMax:5e3,stackMode:"stacked",areaOpacity:.4,seriesColorsByField:{employee_office:"#FF67DE",employee_remote:"#A870EF",contingent_office:"#009CEB",contingent_remote:"#00CDAF",vistitor_office:"#DD9900"}},dataSources:{primary:"ds_pclCazqp"}},viz_J2Q1dK6X:{type:"splunk.markdown",options:{markdown:"### Employee Access Locations"}},viz_RQVYAOf0:{type:"splunk.markdown",options:{markdown:"### Remote Workers and Security Incidents"}},viz_7WztTtss:{type:"splunk.area",options:{legendDisplay:"off",stackMode:"stacked",xAxisTitleVisibility:"hide",areaOpacity:.4,dataValuesDisplay:"minmax",overlayFields:['"Security Incidents"'],seriesColorsByField:{"Employees Remote":"#009CEB","Contingents Remote":"#00CDAF","Security Incidents":"#FF4242"},backgroundColor:"transparent",showOverlayY2Axis:!0,y2AxisTitleVisibility:"hide"},dataSources:{primary:"ds_sH7noQQ0"}},viz_qmwZ8egk:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"data:image/png;base64,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"}},viz_FQJeFD2h:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent",rx:20}},viz_GwRiulQV:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent",rx:20},eventHandlers:[]},viz_0BwYhXUi:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/devices.png"}},viz_FIAo9HwU:{type:"splunk.markdown",options:{markdown:"#### Device Security"}},viz_uSnnSdQQ:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/executive.png"}},viz_cVIczTsX:{type:"splunk.markdown",options:{markdown:"#### Executive View"}},viz_R0xhnrk2:{type:"splunk.rectangle",options:{fillColor:"transparent",strokeColor:"transparent",rx:20},eventHandlers:[{type:"drilldown.customUrl",options:{url:"/app/splunk-dashboard-studio/example-hub-security-summary-dashboard",newTab:!0}}]},viz_uy797vCN:{type:"splunk.rectangle",options:{fillColor:"transparent",strokeColor:"transparent",rx:20},eventHandlers:[{type:"drilldown.customUrl",options:{url:"/app/splunk-dashboard-studio/example-hub-security-devices-dashboard",newTab:!0}}]},viz_8QNvUQGm:{type:"splunk.markdown",options:{markdown:`## Full Source

\`\`\`json
{
  "dataSources": {
    "ds_7N1LKEOc": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "0",
          "latest": ""
        },
        "query": "| inputlookup security_example_data.csv \\n| where network_type!=\\"\\" \\n| iplocation network_ip\\n| geostats latfield=lat longfield=lon count by network_type\\n| eval employee_office=employee_office*123\\n| eval contingent_office=contingent_office*123\\n| eval employee_remote=employee_remote*123\\n| eval contingent_remote=contingent_remote*123\\n| eval visitor_office=visitor_office*15"
      },
      "name": "Network Access Map"
    },
    "ds_pclCazqp": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "0",
          "latest": ""
        },
        "query": "| inputlookup security_example_data.csv\\n| where network_type!=\\"\\"\\n| eval _time=timestamp\\n| timechart span=1d count by network_type \\n| eval employee_office=employee_office*123 \\n| eval contingent_office=contingent_office*123 \\n| eval employee_remote=employee_remote*123 \\n| eval contingent_remote=contingent_remote*123 \\n| eval visitor_office=visitor_office*15"
      },
      "name": "Network Access Base"
    },
    "ds_i7huyNlb": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_pclCazqp",
        "query": "| fields _time employee_office"
      },
      "name": "Office Employees"
    },
    "ds_1rQ1XclX_ds_i7huyNlb": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_pclCazqp",
        "query": "| fields _time contingent_office"
      },
      "name": "Office Contingents"
    },
    "ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_pclCazqp",
        "query": "| fields _time employee_remote"
      },
      "name": "Remote Employees"
    },
    "ds_OqW1Ndcz_ds_1rQ1XclX_ds_i7huyNlb": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_pclCazqp",
        "query": "| fields _time contingent_remote"
      },
      "name": "Remote Contingents"
    },
    "ds_LRX88BGJ_ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_pclCazqp",
        "query": "| fields _time visitor_office"
      },
      "name": "Office Visitors"
    },
    "ds_2w9t0SN3": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "0",
          "latest": ""
        },
        "query": "| inputlookup security_example_data.csv\\n| where network_type!=\\"\\"\\n| stats count by network_type\\n| eval employee_office=employee_office*123\\n| eval contingent_office=contingent_office*123\\n| eval employee_remote=employee_remote*123\\n| eval contingent_remote=contingent_remote*123\\n| eval visitor_office=visitor_office*15\\n| eval network_type=case(network_type=\\"employee_office\\", \\"Employees in Office\\", network_type=\\"contingent_office\\", \\"Contingents in Office\\", network_type=\\"employee_remote\\", \\"Employees Remote\\", network_type=\\"contingent_remote\\", \\"Contingents Remote\\", network_type=\\"visitor_office\\", \\"Visitors in Office\\")"
      },
      "name": "Network Access Pie"
    },
    "ds_sH7noQQ0": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "0",
          "latest": ""
        },
        "query": "| inputlookup security_example_data.csv\\n| where network_type!=\\"\\"\\n| eval _time=timestamp\\n| eval network_type=case(network_type=\\"employee_office\\", \\"Security Incidents\\", network_type=\\"contingent_office\\", \\"Security Incidents\\", network_type=\\"employee_remote\\", \\"Employees Remote\\", network_type=\\"contingent_remote\\", \\"Contingents Remote\\", network_type=\\"visittor_office\\", \\"Security Incidents\\")\\n| timechart span=1d count by network_type\\n| eval \\"Employees Remote\\"='Employees Remote'*202\\n| eval \\"Contingents Remote\\"= 'Contingents Remote'*123\\n| eval \\"Security Incidents\\"='Security Incidents'*(1+random() %5)"
      },
      "name": "Remote Workers and Security"
    }
  },
  "visualizations": {
    "viz_903rCKeL": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Employee Network Access",
        "fontSize": "extraLarge"
      }
    },
    "viz_tQ1F8zM2": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "#15161A",
        "strokeColor": "transparent"
      }
    },
    "viz_LK04XQ2J": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#15161A"
      }
    },
    "viz_46mBQRrA": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## Employee Access Locations"
      }
    },
    "viz_ykwd2HVA": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('employee_office')"
      },
      "dataSources": {
        "primary": "ds_pclCazqp"
      }
    },
    "viz_MN4xX0yb": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Employees in Office"
      }
    },
    "viz_b2Ke0gaF": {
      "type": "splunk.area",
      "options": {
        "legendDisplay": "off",
        "nullValueDisplay": "connect",
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "showYMajorGridLines": false,
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "xAxisMajorTickVisibility": "hide",
        "seriesColors": [
          "#FF67DE"
        ],
        "areaOpacity": 0.4
      },
      "dataSources": {
        "primary": "ds_i7huyNlb"
      }
    },
    "viz_yVfrCyeN": {
      "type": "splunk.map",
      "options": {
        "center": [
          20.31395205192264,
          23.79723118997208
        ],
        "zoom": 1.17202532234071,
        "layers": [
          {
            "bubbleSize": "> primary | frameBySeriesNames('employee_office','contingent_office','employee_remote','contingent_remote','visitor_office')",
            "seriesColors": [
              "#FF67DE",
              "#A870EF",
              "#009CEB",
              "#00CDAF",
              "#DD9900"
            ]
          }
        ]
      },
      "dataSources": {
        "primary": "ds_7N1LKEOc"
      }
    },
    "viz_67U6o6rr": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "data:image/png;base64,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"
      }
    },
    "viz_XRHlJZXU": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_pink.png"
      }
    },
    "viz_P2th2sn6": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#15161A"
      }
    },
    "viz_gpvdEHlu": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_purple.png"
      }
    },
    "viz_fPKqjcia": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('contingent_office')"
      },
      "dataSources": {
        "primary": "ds_pclCazqp"
      }
    },
    "viz_JXHTXpiB": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Contingents in Office"
      }
    },
    "viz_mgZUvKA9": {
      "type": "splunk.area",
      "options": {
        "legendDisplay": "off",
        "nullValueDisplay": "connect",
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "showYMajorGridLines": false,
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "xAxisMajorTickVisibility": "hide",
        "seriesColors": [
          "#7B56DB"
        ],
        "areaOpacity": 0.4
      },
      "dataSources": {
        "primary": "ds_1rQ1XclX_ds_i7huyNlb"
      }
    },
    "viz_d3XCHvYQ": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#15161A"
      }
    },
    "viz_nfLQSpRI": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_blue.png"
      }
    },
    "viz_vqmp9PLf": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('employee_remote')"
      },
      "dataSources": {
        "primary": "ds_pclCazqp"
      }
    },
    "viz_II5AbqAK": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Employees Remote"
      }
    },
    "viz_X4whFlJ3": {
      "type": "splunk.area",
      "options": {
        "legendDisplay": "off",
        "nullValueDisplay": "connect",
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "showYMajorGridLines": false,
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "xAxisMajorTickVisibility": "hide",
        "seriesColors": [
          "#009CEB"
        ],
        "areaOpacity": 0.4
      },
      "dataSources": {
        "primary": "ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb"
      }
    },
    "viz_oAjRVQTc": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#15161A"
      }
    },
    "viz_3BGyhxm5": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_green.png"
      }
    },
    "viz_EzxmLlpy": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('contingent_remote')"
      },
      "dataSources": {
        "primary": "ds_pclCazqp"
      }
    },
    "viz_vJyO1d3l": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Contingents Remote"
      }
    },
    "viz_XsF1y5kd": {
      "type": "splunk.area",
      "options": {
        "legendDisplay": "off",
        "nullValueDisplay": "connect",
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "showYMajorGridLines": false,
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "xAxisMajorTickVisibility": "hide",
        "seriesColors": [
          "#00CDAF"
        ],
        "areaOpacity": 0.4
      },
      "dataSources": {
        "primary": "ds_OqW1Ndcz_ds_1rQ1XclX_ds_i7huyNlb"
      }
    },
    "viz_PFdPPbu6": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#15161A"
      }
    },
    "viz_xVOAM68e": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_yellow.png"
      }
    },
    "viz_EUH9dxGK": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('visitor_office')"
      },
      "dataSources": {
        "primary": "ds_pclCazqp"
      }
    },
    "viz_ntjcpu6R": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Visitors In Office"
      }
    },
    "viz_h65HSLsT": {
      "type": "splunk.area",
      "options": {
        "legendDisplay": "off",
        "nullValueDisplay": "connect",
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "showYMajorGridLines": false,
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "xAxisMajorTickVisibility": "hide",
        "seriesColors": [
          "#DD9900"
        ],
        "areaOpacity": 0.4
      },
      "dataSources": {
        "primary": "ds_LRX88BGJ_ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb"
      }
    },
    "viz_MyZbuF64": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "#15161A",
        "strokeColor": "transparent"
      }
    },
    "viz_E4kFdqLy": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "#15161A",
        "strokeColor": "transparent"
      }
    },
    "viz_3Caox5jb": {
      "type": "splunk.pie",
      "options": {
        "labelDisplay": "valuesAndPercentage",
        "backgroundColor": "transparent",
        "seriesColorsByField": {
          "Employees in Office": "#FF67DE",
          "Employees Remote": "#A870EF",
          "Contingents in Office": "#009CEB",
          "Contingents Remote": "#00CDAF",
          "Visitors in Office": "#DD9900"
        }
      },
      "dataSources": {
        "primary": "ds_2w9t0SN3"
      }
    },
    "viz_Ay3vwXS9": {
      "type": "splunk.area",
      "options": {
        "nullValueDisplay": "zero",
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "yAxisMax": 5000,
        "stackMode": "stacked",
        "areaOpacity": 0.4,
        "seriesColorsByField": {
          "employee_office": "#FF67DE",
          "employee_remote": "#A870EF",
          "contingent_office": "#009CEB",
          "contingent_remote": "#00CDAF",
          "vistitor_office": "#DD9900"
        }
      },
      "dataSources": {
        "primary": "ds_pclCazqp"
      }
    },
    "viz_J2Q1dK6X": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Employee Access Locations"
      }
    },
    "viz_RQVYAOf0": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Remote Workers and Security Incidents"
      }
    },
    "viz_7WztTtss": {
      "type": "splunk.area",
      "options": {
        "legendDisplay": "off",
        "stackMode": "stacked",
        "xAxisTitleVisibility": "hide",
        "areaOpacity": 0.4,
        "dataValuesDisplay": "minmax",
        "overlayFields": [
          "\\"Security Incidents\\""
        ],
        "seriesColorsByField": {
          "Employees Remote": "#009CEB",
          "Contingents Remote": "#00CDAF",
          "Security Incidents": "#FF4242"
        },
        "backgroundColor": "transparent",
        "showOverlayY2Axis": true,
        "y2AxisTitleVisibility": "hide"
      },
      "dataSources": {
        "primary": "ds_sH7noQQ0"
      }
    },
    "viz_qmwZ8egk": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "data:image/png;base64,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"
      }
    },
    "viz_FQJeFD2h": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "#15161A",
        "strokeColor": "transparent",
        "rx": 20
      }
    },
    "viz_GwRiulQV": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "#15161A",
        "strokeColor": "transparent",
        "rx": 20
      },
      "eventHandlers": []
    },
    "viz_0BwYhXUi": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/devices.png"
      }
    },
    "viz_FIAo9HwU": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "#### Device Security"
      }
    },
    "viz_uSnnSdQQ": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/executive.png"
      }
    },
    "viz_cVIczTsX": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "#### Executive View"
      }
    },
    "viz_R0xhnrk2": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "transparent",
        "strokeColor": "transparent",
        "rx": 20
      },
      "eventHandlers": [
        {
          "type": "drilldown.customUrl",
          "options": {
            "url": "/app/splunk-dashboard-studio/example-hub-security-summary-dashboard",
            "newTab": true
          }
        }
      ]
    },
    "viz_uy797vCN": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "transparent",
        "strokeColor": "transparent",
        "rx": 20
      },
      "eventHandlers": [
        {
          "type": "drilldown.customUrl",
          "options": {
            "url": "/app/splunk-dashboard-studio/example-hub-security-devices-dashboard",
            "newTab": true
          }
        }
      ]
    }
  },
  "inputs": {},
  "title": "Security Network Access",
  "description": "",
  "defaults": {
    "dataSources": {
      "ds.search": {
        "options": {}
      }
    },
    "visualizations": {
      "splunk.singlevalue": {
        "options": {
          "majorFontSize": 36,
          "trendFontSize": 16
        }
      }
    }
  },
  "layout": {
    "tabs": {
      "items": [
        {
          "layoutId": "layout_1",
          "label": "New tab"
        }
      ]
    },
    "layoutDefinitions": {
      "layout_1": {
        "type": "absolute",
        "options": {
          "width": 1440,
          "height": 960,
          "backgroundImage": {
            "sizeType": "cover",
            "x": 0,
            "y": 0,
            "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/background.png"
          }
        },
        "structure": [
          {
            "item": "viz_LK04XQ2J",
            "type": "block",
            "position": {
              "x": 20,
              "y": 120,
              "w": 210,
              "h": 110
            }
          },
          {
            "item": "viz_XRHlJZXU",
            "type": "block",
            "position": {
              "x": 10,
              "y": 110,
              "w": 230,
              "h": 130
            }
          },
          {
            "item": "viz_tQ1F8zM2",
            "type": "block",
            "position": {
              "x": 250,
              "y": 120,
              "w": 1170,
              "h": 620
            }
          },
          {
            "item": "viz_903rCKeL",
            "type": "block",
            "position": {
              "x": 30,
              "y": 30,
              "w": 620,
              "h": 60
            }
          },
          {
            "item": "viz_46mBQRrA",
            "type": "block",
            "position": {
              "x": 270,
              "y": 140,
              "w": 300,
              "h": 40
            }
          },
          {
            "item": "viz_ykwd2HVA",
            "type": "block",
            "position": {
              "x": 40,
              "y": 150,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_MN4xX0yb",
            "type": "block",
            "position": {
              "x": 30,
              "y": 130,
              "w": 190,
              "h": 40
            }
          },
          {
            "item": "viz_b2Ke0gaF",
            "type": "block",
            "position": {
              "x": 10,
              "y": 190,
              "w": 240,
              "h": 50
            }
          },
          {
            "item": "viz_yVfrCyeN",
            "type": "block",
            "position": {
              "x": 270,
              "y": 180,
              "w": 1130,
              "h": 540
            }
          },
          {
            "item": "viz_67U6o6rr",
            "type": "block",
            "position": {
              "x": 790,
              "y": 140,
              "w": 610,
              "h": 40
            }
          },
          {
            "item": "viz_P2th2sn6",
            "type": "block",
            "position": {
              "x": 20,
              "y": 250,
              "w": 210,
              "h": 110
            }
          },
          {
            "item": "viz_gpvdEHlu",
            "type": "block",
            "position": {
              "x": 10,
              "y": 240,
              "w": 230,
              "h": 130
            }
          },
          {
            "item": "viz_fPKqjcia",
            "type": "block",
            "position": {
              "x": 40,
              "y": 280,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_JXHTXpiB",
            "type": "block",
            "position": {
              "x": 30,
              "y": 260,
              "w": 190,
              "h": 40
            }
          },
          {
            "item": "viz_mgZUvKA9",
            "type": "block",
            "position": {
              "x": 10,
              "y": 320,
              "w": 240,
              "h": 50
            }
          },
          {
            "item": "viz_d3XCHvYQ",
            "type": "block",
            "position": {
              "x": 20,
              "y": 380,
              "w": 210,
              "h": 110
            }
          },
          {
            "item": "viz_nfLQSpRI",
            "type": "block",
            "position": {
              "x": 10,
              "y": 370,
              "w": 230,
              "h": 130
            }
          },
          {
            "item": "viz_vqmp9PLf",
            "type": "block",
            "position": {
              "x": 40,
              "y": 420,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_II5AbqAK",
            "type": "block",
            "position": {
              "x": 30,
              "y": 390,
              "w": 190,
              "h": 40
            }
          },
          {
            "item": "viz_X4whFlJ3",
            "type": "block",
            "position": {
              "x": 10,
              "y": 450,
              "w": 240,
              "h": 50
            }
          },
          {
            "item": "viz_oAjRVQTc",
            "type": "block",
            "position": {
              "x": 20,
              "y": 500,
              "w": 210,
              "h": 110
            }
          },
          {
            "item": "viz_3BGyhxm5",
            "type": "block",
            "position": {
              "x": 10,
              "y": 490,
              "w": 230,
              "h": 130
            }
          },
          {
            "item": "viz_EzxmLlpy",
            "type": "block",
            "position": {
              "x": 40,
              "y": 540,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_vJyO1d3l",
            "type": "block",
            "position": {
              "x": 30,
              "y": 510,
              "w": 190,
              "h": 40
            }
          },
          {
            "item": "viz_XsF1y5kd",
            "type": "block",
            "position": {
              "x": 10,
              "y": 570,
              "w": 240,
              "h": 50
            }
          },
          {
            "item": "viz_PFdPPbu6",
            "type": "block",
            "position": {
              "x": 20,
              "y": 630,
              "w": 210,
              "h": 110
            }
          },
          {
            "item": "viz_xVOAM68e",
            "type": "block",
            "position": {
              "x": 10,
              "y": 620,
              "w": 230,
              "h": 130
            }
          },
          {
            "item": "viz_EUH9dxGK",
            "type": "block",
            "position": {
              "x": 40,
              "y": 670,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_ntjcpu6R",
            "type": "block",
            "position": {
              "x": 30,
              "y": 640,
              "w": 190,
              "h": 40
            }
          },
          {
            "item": "viz_h65HSLsT",
            "type": "block",
            "position": {
              "x": 10,
              "y": 700,
              "w": 240,
              "h": 50
            }
          },
          {
            "item": "viz_MyZbuF64",
            "type": "block",
            "position": {
              "x": 20,
              "y": 760,
              "w": 700,
              "h": 180
            }
          },
          {
            "item": "viz_E4kFdqLy",
            "type": "block",
            "position": {
              "x": 740,
              "y": 760,
              "w": 680,
              "h": 180
            }
          },
          {
            "item": "viz_3Caox5jb",
            "type": "block",
            "position": {
              "x": 730,
              "y": 800,
              "w": 430,
              "h": 130
            }
          },
          {
            "item": "viz_Ay3vwXS9",
            "type": "block",
            "position": {
              "x": 1140,
              "y": 800,
              "w": 270,
              "h": 130
            }
          },
          {
            "item": "viz_J2Q1dK6X",
            "type": "block",
            "position": {
              "x": 750,
              "y": 770,
              "w": 300,
              "h": 30
            }
          },
          {
            "item": "viz_RQVYAOf0",
            "type": "block",
            "position": {
              "x": 30,
              "y": 770,
              "w": 300,
              "h": 40
            }
          },
          {
            "item": "viz_7WztTtss",
            "type": "block",
            "position": {
              "x": 20,
              "y": 800,
              "w": 700,
              "h": 140
            }
          },
          {
            "item": "viz_qmwZ8egk",
            "type": "block",
            "position": {
              "x": 350,
              "y": 775,
              "w": 360,
              "h": 20
            }
          },
          {
            "item": "viz_FQJeFD2h",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 40,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_GwRiulQV",
            "type": "block",
            "position": {
              "x": 1050,
              "y": 40,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_0BwYhXUi",
            "type": "block",
            "position": {
              "x": 1250,
              "y": 40,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_FIAo9HwU",
            "type": "block",
            "position": {
              "x": 1290,
              "y": 50,
              "w": 110,
              "h": 30
            }
          },
          {
            "item": "viz_uSnnSdQQ",
            "type": "block",
            "position": {
              "x": 1060,
              "y": 40,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_cVIczTsX",
            "type": "block",
            "position": {
              "x": 1100,
              "y": 50,
              "w": 110,
              "h": 30
            }
          },
          {
            "item": "viz_R0xhnrk2",
            "type": "block",
            "position": {
              "x": 1050,
              "y": 40,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_uy797vCN",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 40,
              "w": 170,
              "h": 50
            }
          }
        ]
      }
    },
    "globalInputs": [],
    "options": {
      "showTitleAndDescription": false
    }
  }
}
\`\`\``}}},inputs:{},title:"",description:"",defaults:{dataSources:{"ds.search":{options:{}}},visualizations:{"splunk.singlevalue":{options:{majorFontSize:36,trendFontSize:16}}}},layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"absolute",options:{width:1440,height:1260,backgroundImage:{x:0,y:0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/background.png",w:1200,h:960}},structure:[{item:"viz_LK04XQ2J",type:"block",position:{x:20,y:120,w:210,h:110}},{item:"viz_XRHlJZXU",type:"block",position:{x:10,y:110,w:230,h:130}},{item:"viz_tQ1F8zM2",type:"block",position:{x:250,y:120,w:1170,h:620}},{item:"viz_903rCKeL",type:"block",position:{x:30,y:30,w:620,h:60}},{item:"viz_46mBQRrA",type:"block",position:{x:270,y:140,w:300,h:40}},{item:"viz_ykwd2HVA",type:"block",position:{x:40,y:150,w:170,h:50}},{item:"viz_MN4xX0yb",type:"block",position:{x:30,y:130,w:190,h:40}},{item:"viz_b2Ke0gaF",type:"block",position:{x:10,y:190,w:240,h:50}},{item:"viz_yVfrCyeN",type:"block",position:{x:270,y:180,w:1130,h:540}},{item:"viz_67U6o6rr",type:"block",position:{x:790,y:140,w:610,h:40}},{item:"viz_P2th2sn6",type:"block",position:{x:20,y:250,w:210,h:110}},{item:"viz_gpvdEHlu",type:"block",position:{x:10,y:240,w:230,h:130}},{item:"viz_fPKqjcia",type:"block",position:{x:40,y:280,w:170,h:50}},{item:"viz_JXHTXpiB",type:"block",position:{x:30,y:260,w:190,h:40}},{item:"viz_mgZUvKA9",type:"block",position:{x:10,y:320,w:240,h:50}},{item:"viz_d3XCHvYQ",type:"block",position:{x:20,y:380,w:210,h:110}},{item:"viz_nfLQSpRI",type:"block",position:{x:10,y:370,w:230,h:130}},{item:"viz_vqmp9PLf",type:"block",position:{x:40,y:420,w:170,h:50}},{item:"viz_II5AbqAK",type:"block",position:{x:30,y:390,w:190,h:40}},{item:"viz_X4whFlJ3",type:"block",position:{x:10,y:450,w:240,h:50}},{item:"viz_oAjRVQTc",type:"block",position:{x:20,y:500,w:210,h:110}},{item:"viz_3BGyhxm5",type:"block",position:{x:10,y:490,w:230,h:130}},{item:"viz_EzxmLlpy",type:"block",position:{x:40,y:540,w:170,h:50}},{item:"viz_vJyO1d3l",type:"block",position:{x:30,y:510,w:190,h:40}},{item:"viz_XsF1y5kd",type:"block",position:{x:10,y:570,w:240,h:50}},{item:"viz_PFdPPbu6",type:"block",position:{x:20,y:630,w:210,h:110}},{item:"viz_xVOAM68e",type:"block",position:{x:10,y:620,w:230,h:130}},{item:"viz_EUH9dxGK",type:"block",position:{x:40,y:670,w:170,h:50}},{item:"viz_ntjcpu6R",type:"block",position:{x:30,y:640,w:190,h:40}},{item:"viz_h65HSLsT",type:"block",position:{x:10,y:700,w:240,h:50}},{item:"viz_MyZbuF64",type:"block",position:{x:20,y:760,w:700,h:180}},{item:"viz_E4kFdqLy",type:"block",position:{x:740,y:760,w:680,h:180}},{item:"viz_3Caox5jb",type:"block",position:{x:730,y:800,w:430,h:130}},{item:"viz_Ay3vwXS9",type:"block",position:{x:1140,y:800,w:270,h:130}},{item:"viz_J2Q1dK6X",type:"block",position:{x:750,y:770,w:300,h:30}},{item:"viz_RQVYAOf0",type:"block",position:{x:30,y:770,w:300,h:40}},{item:"viz_7WztTtss",type:"block",position:{x:20,y:800,w:700,h:140}},{item:"viz_qmwZ8egk",type:"block",position:{x:350,y:775,w:360,h:20}},{item:"viz_FQJeFD2h",type:"block",position:{x:1240,y:40,w:170,h:50}},{item:"viz_GwRiulQV",type:"block",position:{x:1050,y:40,w:170,h:50}},{item:"viz_0BwYhXUi",type:"block",position:{x:1250,y:40,w:40,h:50}},{item:"viz_FIAo9HwU",type:"block",position:{x:1290,y:50,w:110,h:30}},{item:"viz_uSnnSdQQ",type:"block",position:{x:1060,y:40,w:40,h:50}},{item:"viz_cVIczTsX",type:"block",position:{x:1100,y:50,w:110,h:30}},{item:"viz_R0xhnrk2",type:"block",position:{x:1050,y:40,w:170,h:50}},{item:"viz_uy797vCN",type:"block",position:{x:1240,y:40,w:170,h:50}},{item:"viz_8QNvUQGm",type:"block",position:{x:20,y:980,w:1400,h:260}}]}},globalInputs:[],options:{showTitleAndDescription:!1}}};var o=s(r());var t="Employee Network Access";e(o.default.createElement(n,{definition:i,isCompleteDashboard:!0,dashboardTitle:t}),{pageTitle:t,hideFooter:!0,layout:"fixed"});
