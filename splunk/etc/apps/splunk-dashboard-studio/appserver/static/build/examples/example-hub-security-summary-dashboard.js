/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as i}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a}from"../chunks/chunk-REK4W3C7.js";import{h as o}from"../chunks/chunk-JHLB3KMN.js";var e={dataSources:{ds_search_1:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv 
| search host=host8 OR host=host18
| eval host=case(host="host8", "spend", host="host18", "score", 1=1, host)
| eval myTime=strftime(timestamp,"%H:%M") 
| chart count over myTime by host
| eval score=score*2
| eval spend=spend*1500
| fields myTime spend score
| rename score as "Security Score", spend as "Security Spend"`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Security Score vs Spend"},ds_VzNQIMMM:{type:"ds.search",options:{query:`| inputlookup security_example_data.csv
| iplocation threat_src_ip prefix=src_
| iplocation threat_dest_ip prefix=dest_
| eval lat=if(threat_type="target", dest_lat, src_lat)
| eval lon=if(threat_type="target", dest_lon, src_lon)
| geostats latfield=lat longfield=lon count by threat_type`,queryParameters:{earliest:"0",latest:""}},name:"Threat Map"},ds_446ij0Ag:{type:"ds.search",options:{query:`| inputlookup security_example_data.csv
| iplocation threat_src_ip prefix=src_
| iplocation threat_dest_ip prefix=dest_
| eval destination_country=dest_Country
| eval source_country=src_Country+"\u200E "
| stats count by source_country, destination_country
| where destination_country IN ("United States", "Japan", "Switzerland", "Germany") OR count > 10`,queryParameters:{earliest:"0",latest:""}},name:"Threat Flow"},ds_xsRIm6SV:{type:"ds.search",options:{query:`| makeresults count=72
| stats count`},name:"Training Completion"},ds_aNJrIUWu_ds_xsRIm6SV:{type:"ds.search",options:{query:`| makeresults count=72
| eval _time=now()
| append 
    [| makeresults count=68
    | eval _time=now()-50]
| stats count by _time
`},name:"Security Score"},ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV:{type:"ds.search",options:{query:`| inputlookup security_example_data.csv
| where threat_status!=""
| eval _time=timestamp
| timechart count by threat_status
| eval detected=detected*(1+ random() %12)
| eval mitigated=detected*(1+ random() %21)
| eval total=detected+mitigated`,queryParameters:{earliest:"2022-08-14T07:00:00.000Z",latest:"2022-09-03T07:00:00.000Z"}},name:"Threats Status"},ds_xUKNRSkD:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| makeresults
| eval random_val= random() % 10
| eval level=case(random_val>8, "Severe", random_val>6, "High", random_val>4, "Elevated", random_val>2, "Guarded", 1=1, "Low")
| table level `,enableSmartSources:!0},name:"Threat Level"},ds_rxRXlH3G:{type:"ds.chain",options:{enableSmartSources:!0,extend:"ds_xUKNRSkD",query:`| eval icon="icon_severe.png"
| eval icon=if(level="High", "icon_high.png", icon)
| eval icon=if(level="Elevated", "icon_elevated.png", icon)
| eval icon=if(level="Guarded", "icon_guarded.png", icon)
| eval icon=if(level="Low", "icon_low.png", icon)
| eval icon="/static/app/splunk-dashboard-studio/images/examples-hub/security/"+icon
| fields icon`},name:"Threat Level Icon"},ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV:{type:"ds.search",options:{query:`| makeresults count=72
| eval _time=now()
| append 
    [| makeresults count=68
    | eval _time=now()-50]
| stats count by _time
`},name:"Non Compliant Devices"},ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV:{type:"ds.search",options:{query:`| makeresults count=72
| eval _time=now()
| append 
    [| makeresults count=68
    | eval _time=now()-50]
| stats count by _time
`},name:"Training Completion Risk"},ds_QW1SdJ16_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV:{type:"ds.search",options:{query:`| makeresults count=72
| eval _time=now()
| append 
    [| makeresults count=68
    | eval _time=now()-50]
| stats count by _time
`},name:"Incidents"},ds_e87D3wms_ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV:{type:"ds.search",options:{query:`| makeresults count=72
| eval _time=now()
| append 
    [| makeresults count=68
    | eval _time=now()-50]
| stats count by _time
`},name:"Exceptions Granted"},ds_Ys7KyEPQ:{type:"ds.chain",options:{extend:"ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV",query:"| table _time total"},name:"Total Threats"},ds_1rOS3FYc:{type:"ds.chain",options:{extend:"ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV",query:"| table _time mitigated"},name:"Threats Mitigated"}},visualizations:{viz_chart_1:{type:"splunk.area",dataSources:{primary:"ds_search_1"},options:{yAxisAbbreviation:"auto",y2AxisAbbreviation:"auto",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,xAxisLabelRotation:0,xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",y2AxisTitleVisibility:"hide",yAxisScale:"linear",showOverlayY2Axis:!0,y2AxisScale:"linear",nullValueDisplay:"gaps",overlayFields:['"Security Score"'],dataValuesDisplay:"off",showSplitSeries:!1,showIndependentYRanges:!1,legendMode:"standard",legendDisplay:"top",backgroundColor:"transparent",xAxisTitleText:"no",y2AxisMax:100},showProgressBar:!1,showLastUpdated:!1},viz_kQtw1oXu:{type:"splunk.map",options:{center:[20.040183884278633,-10.439508885322311],zoom:1,layers:[{seriesColors:["#A870EF","#00CDAF"],bubbleSize:"> primary | frameBySeriesNames('origin','target')",type:"bubble"}]},dataSources:{primary:"ds_VzNQIMMM"}},viz_I4FfkIu4:{type:"splunk.sankey",dataSources:{primary:"ds_446ij0Ag"},options:{backgroundColor:"transparent"}},viz_903rCKeL:{type:"splunk.markdown",options:{markdown:"# Executive Summary",fontSize:"extraLarge"}},viz_Nz4UoCeA:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_tQ1F8zM2:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent"}},viz_LK04XQ2J:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_w45P1CxU:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_1v0TnAi7:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_46mBQRrA:{type:"splunk.markdown",options:{markdown:`## Threat Origin and Destination
`}},viz_Dl2kyX5E:{type:"splunk.markdown",options:{markdown:"Bubble size represents the number of threats originating from or destined for a particular location",fontColor:"#909090"}},viz_c9alVnL1:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAygAAAB0CAYAAABuUBbgAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAACiLSURBVHgB7d0LXFRl3gfw56CUoDK6KGhpBSpoWIKuNy762S5qmrrt5rWyi9ll67USTc1VQ99X29Iyb128VN42bd93E11TywovaF4C01IwYTcrRUEcCjQh5j0/6IxnDmdmzsAMc4Tf9/OhmHHmMOecZ/7n/J+rJAwLb9yokbWnJDW4RX4QYbOVh0uS1FgQERERERGp2Gy2YkkKyCsvL8+VJNvRS5cs+4TIKzbyXsn9S5qENWpUPkT+M7czISEiIiIiouooL7ft+OWXBn8X4uezrl7nIkFBi8lPoyRJDBFEREREREReYLOVp8otKn931qLiJEGpaDWZIycnYYKIiIiIiMiLbDaRd+lSwDS91pQGVV/eKKJRI5HC5ISIiIiIiHxBzjWaNGxo69WwYYMjZWVlF9T/pklQ0HLC5ISIiIiIiHxLzjkay//tWlZ27RdCXLZ391IlKBhz8ss8JidERERERFQbfmtJ6VlW9rtPhSguxXP2BKVRI9uD8gu6CiIiIiIiolpSmaRcuqasrOxLPA6ofLpJGGfrIiIiIiIif5CkgMHISfB7RYJy7bW/jhJERERERET+IVWuvViZoDQOCJBuF0RERERERH4iSdJtGBcf0KhRo56CiIiIiIjIr2xNGjWy9gqw2aRbBBERERERkZ/JrSid0cUrUhAREREREflZebm4KYDrnhARERERkRkEBASEywmK1FgQERERERH5na1xgCAiIiIiIjIJJihERERERGQaTFCIiIiIiMg0mKAQEREREZFpMEEhIiIiIiLTYIJCRERERESmwQSFiIiIiIhMgwkKERERERGZBhMUIiIiIiIyDSYoRERERERkGkxQiIiIiIjINJigEBERERGRaTBBISIiIiIi02CCQkREREREpsEEhYiIiIiITIMJChERERERmQYTFCIiIiIiMg0mKEREREREZBpMUIiIiIiIyDSYoBARERERkWk0FCZwXfPooMdvWxgXbokMuTYwOFDUUPbpfWfe2/XC0R8Lsy4KIiJyqjyiTdDl6X+JE23DQ2xBjWocf6XMY2eumf/u0YDc7xl/iYioWqSgoOBU4UdITmbc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yDSYoBARERERkWkwQSEiIiIiItNggkJERERERKbBBIWIiIiIiEyDCQoREREREZkGExQiIiIiIjINJihERERERGQaTFCIiIiIiMg0mKAQEREREZFpMEEhIiIiIiLTYIJCRERERESmwQSFiIiIiIhMgwkKERERERGZBhMUIiIiIiIyDSYoRERERERkGgE2m61YEBERERER+Z1ULCco4qwgIiIiIiLys/Ly8ryAgACRI4iIiIiIiPxMzk1y0cXriCAiIiIiIvIzmy3gaMClS5e+4DgUIiIiIiLyM9ulS02+wCxecnIi7RBERERERER+Y5NzkrziimmGGzYMSBVERERERET+YWvQoMH7+KUB/nP58uXihg0DG0uSiBZERERERES1yGYTqSUlxbvxu32hxkuXSv4u/8MZQUREREREVEvkHCTPYmn6vvK4gerfShs1uvaL8nJbT7klpYkgIiIiIiLyISQnDRsGTCssLLygPKdOUH7r6tXgqBBSHJMUIiIiIiLyFSQnQpTPKSkp+UH9fAPtC8vKyi781pLSg0kKERERERF5m9Jyok1OoIHeG9CSUlZW+mnDhoHXyElKlPyUJIiIiIiIiGrGhgHxFkvTeepuXWpuE48mTZqE/frrr6Pkl94mmKgQEREREZFnbFgYPiBA2hEQELDp559/PuvqxYYTjvDw8MZWa3FPSfr1lvJycZPcshIuSVJjQUREREREpIKEBN245IQk12b79YjFYtmfl5dXbOS9/w8GrznxgzC1DgAAAABJRU5ErkJggg=="}},viz_yrnTfz48:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"transparent",gaugeRanges:[{from:90,value:"#CEF06C",to:100},{from:50,value:"#F7933F",to:90},{from:0,value:"#E85B79",to:50}]},dataSources:{primary:"ds_aNJrIUWu_ds_xsRIm6SV"},showProgressBar:!1,showLastUpdated:!1},viz_YCmcql2l:{type:"splunk.singlevalue",options:{sparklineDisplay:"off",majorColor:"> majorValue | rangeValue(majorColorEditorConfig)",trendColor:"> majorValue | rangeValue(majorColorEditorConfig)",backgroundColor:"transparent"},dataSources:{primary:"ds_aNJrIUWu_ds_xsRIm6SV"},context:{majorColorEditorConfig:[{value:"#e85b79",to:20},{value:"#f7933f",from:20,to:75},{value:"#cef06c",from:75}],trendColorEditorConfig:[{to:0,value:"#9E2520"},{from:0,value:"#1C6B2D"}]}},viz_cfBBlpoa:{type:"splunk.markdown",options:{markdown:"### **Security Score**",fontSize:"large"}},viz_BCtQcwyb:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"data:image/png;base64,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"}},viz_ykwd2HVA:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('total')",trendFontSize:18},dataSources:{primary:"ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"}},viz_ADTg16xR:{type:"splunk.markdown",options:{markdown:"### **Threats Mitigated**"}},viz_MN4xX0yb:{type:"splunk.markdown",options:{markdown:"### **Total Threats**"}},viz_PcUCkRBJ:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('mitigated')",trendFontSize:18},dataSources:{primary:"ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"}},viz_m6UCaPY7:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#FFFFFF"],areaOpacity:.3},dataSources:{primary:"ds_1rOS3FYc"}},viz_b2Ke0gaF:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#FFFFFF"],areaOpacity:.3},dataSources:{primary:"ds_Ys7KyEPQ"}},viz_dgMCxvya:{type:"splunk.image",options:{src:"$Threat Level Icon:result.icon$",preserveAspectRatio:!0}},viz_uyLaWAAJ:{type:"splunk.markdown",options:{markdown:"$Threat Level:result.level$ risk of cyber attacks",fontColor:"#909090"}},viz_GgdlEpAT:{type:"splunk.markdown",options:{markdown:"### **Threat Level**",fontSize:"large"}},viz_9p4gm09n:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off"},dataSources:{primary:"ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"}},viz_vZeQnLn1:{type:"splunk.markdown",options:{markdown:`Non Compliant Devices
`,fontColor:"#909090"}},viz_2Y5G6xub:{type:"splunk.markdown",options:{markdown:"Training Completion",fontColor:"#909090"}},viz_AdSFZteD:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off"},dataSources:{primary:"ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"}},viz_xSTbfudg:{type:"splunk.markdown",options:{markdown:"Exceptions Granted",fontColor:"#909090"}},viz_awXhrL80:{type:"splunk.markdown",options:{markdown:"Incidents",fontColor:"#909090"}},viz_E7LcwW9y:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off"},dataSources:{primary:"ds_QW1SdJ16_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"}},viz_nMS3AY4H:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off"},dataSources:{primary:"ds_e87D3wms_ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"}},viz_yyAmIyVi:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_JD9106hz:{type:"splunk.markdown",options:{markdown:"### **Risk Factors**",fontSize:"large"}},viz_iI2Jpb8D:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent",rx:20}},viz_VCuSPgmE:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent",rx:20}},viz_nO6v2d6Z:{type:"splunk.markdown",options:{markdown:"#### **Network Access**"}},viz_xszFpyWd:{type:"splunk.markdown",options:{markdown:"#### **Device Security**"}},viz_Jk1Bdfpl:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#FFFFFF"],areaOpacity:.3},dataSources:{primary:"ds_QW1SdJ16_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"}},viz_qZjsuKFx:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#FFFFFF"],areaOpacity:.3},dataSources:{primary:"ds_e87D3wms_ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"}},viz_isJRWTT6:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#FFFFFF"],areaOpacity:.3},dataSources:{primary:"ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"}},viz_bOqs1dil:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#FFFFFF"],areaOpacity:.3},dataSources:{primary:"ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"}},viz_W1mC5aML:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/network.png"}},viz_GB7JXPXw:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/devices.png"}},viz_3ThzvfzI:{type:"splunk.rectangle",options:{fillColor:"transparent",strokeColor:"transparent",rx:20},eventHandlers:[{type:"drilldown.customUrl",options:{url:"/app/splunk-dashboard-studio/example-hub-security-network-dashboard",newTab:!0}}]},viz_nwfBePjZ:{type:"splunk.rectangle",options:{fillColor:"transparent",strokeColor:"transparent",rx:20},eventHandlers:[{type:"drilldown.customUrl",options:{url:"/app/splunk-dashboard-studio/example-hub-security-devices-dashboard",newTab:!0}}]},viz_ubcXOAAd:{type:"splunk.markdown",options:{markdown:"# $Threat Level:result.level$",fontSize:"large"}},viz_VRM8IYRS:{type:"splunk.markdown",options:{markdown:`## Full Source

\`\`\`json
{
  "dataSources": {
    "ds_search_1": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv \\n| search host=host8 OR host=host18\\n| eval host=case(host=\\"host8\\", \\"spend\\", host=\\"host18\\", \\"score\\", 1=1, host)\\n| eval myTime=strftime(timestamp,\\"%H:%M\\") \\n| chart count over myTime by host\\n| eval score=score*2\\n| eval spend=spend*1500\\n| fields myTime spend score\\n| rename score as \\"Security Score\\", spend as \\"Security Spend\\"",
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        }
      },
      "name": "Security Score vs Spend"
    },
    "ds_VzNQIMMM": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup security_example_data.csv\\n| iplocation threat_src_ip prefix=src_\\n| iplocation threat_dest_ip prefix=dest_\\n| eval lat=if(threat_type=\\"target\\", dest_lat, src_lat)\\n| eval lon=if(threat_type=\\"target\\", dest_lon, src_lon)\\n| geostats latfield=lat longfield=lon count by threat_type",
        "queryParameters": {
          "earliest": "0",
          "latest": ""
        }
      },
      "name": "Threat Map"
    },
    "ds_446ij0Ag": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup security_example_data.csv\\n| iplocation threat_src_ip prefix=src_\\n| iplocation threat_dest_ip prefix=dest_\\n| eval destination_country=dest_Country\\n| eval source_country=src_Country+\\"\u200E \\"\\n| stats count by source_country, destination_country\\n| where destination_country IN (\\"United States\\", \\"Japan\\", \\"Switzerland\\", \\"Germany\\") OR count > 10",
        "queryParameters": {
          "earliest": "0",
          "latest": ""
        }
      },
      "name": "Threat Flow"
    },
    "ds_xsRIm6SV": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=72\\n| stats count"
      },
      "name": "Training Completion"
    },
    "ds_aNJrIUWu_ds_xsRIm6SV": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=72\\n| eval _time=now()\\n| append \\n    [| makeresults count=68\\n    | eval _time=now()-50]\\n| stats count by _time\\n"
      },
      "name": "Security Score"
    },
    "ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup security_example_data.csv\\n| where threat_status!=\\"\\"\\n| eval _time=timestamp\\n| timechart count by threat_status\\n| eval detected=detected*(1+ random() %12)\\n| eval mitigated=detected*(1+ random() %21)\\n| eval total=detected+mitigated",
        "queryParameters": {
          "earliest": "2022-08-14T07:00:00.000Z",
          "latest": "2022-09-03T07:00:00.000Z"
        }
      },
      "name": "Threats Status"
    },
    "ds_xUKNRSkD": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "query": "| makeresults\\n| eval random_val= random() % 10\\n| eval level=case(random_val>8, \\"Severe\\", random_val>6, \\"High\\", random_val>4, \\"Elevated\\", random_val>2, \\"Guarded\\", 1=1, \\"Low\\")\\n| table level ",
        "enableSmartSources": true
      },
      "name": "Threat Level"
    },
    "ds_rxRXlH3G": {
      "type": "ds.chain",
      "options": {
        "enableSmartSources": true,
        "extend": "ds_xUKNRSkD",
        "query": "| eval icon=\\"icon_severe.png\\"\\n| eval icon=if(level=\\"High\\", \\"icon_high.png\\", icon)\\n| eval icon=if(level=\\"Elevated\\", \\"icon_elevated.png\\", icon)\\n| eval icon=if(level=\\"Guarded\\", \\"icon_guarded.png\\", icon)\\n| eval icon=if(level=\\"Low\\", \\"icon_low.png\\", icon)\\n| eval icon=\\"/static/app/splunk-dashboard-studio/images/examples-hub/security/\\"+icon\\n| fields icon"
      },
      "name": "Threat Level Icon"
    },
    "ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=72\\n| eval _time=now()\\n| append \\n    [| makeresults count=68\\n    | eval _time=now()-50]\\n| stats count by _time\\n"
      },
      "name": "Non Compliant Devices"
    },
    "ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=72\\n| eval _time=now()\\n| append \\n    [| makeresults count=68\\n    | eval _time=now()-50]\\n| stats count by _time\\n"
      },
      "name": "Training Completion Risk"
    },
    "ds_QW1SdJ16_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=72\\n| eval _time=now()\\n| append \\n    [| makeresults count=68\\n    | eval _time=now()-50]\\n| stats count by _time\\n"
      },
      "name": "Incidents"
    },
    "ds_e87D3wms_ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=72\\n| eval _time=now()\\n| append \\n    [| makeresults count=68\\n    | eval _time=now()-50]\\n| stats count by _time\\n"
      },
      "name": "Exceptions Granted"
    },
    "ds_Ys7KyEPQ": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV",
        "query": "| table _time total"
      },
      "name": "Total Threats"
    },
    "ds_1rOS3FYc": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV",
        "query": "| table _time mitigated"
      },
      "name": "Threats Mitigated"
    }
  },
  "visualizations": {
    "viz_chart_1": {
      "type": "splunk.area",
      "dataSources": {
        "primary": "ds_search_1"
      },
      "options": {
        "yAxisAbbreviation": "auto",
        "y2AxisAbbreviation": "auto",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "xAxisLabelRotation": 0,
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "y2AxisTitleVisibility": "hide",
        "yAxisScale": "linear",
        "showOverlayY2Axis": true,
        "y2AxisScale": "linear",
        "nullValueDisplay": "gaps",
        "overlayFields": [
          "\\"Security Score\\""
        ],
        "dataValuesDisplay": "off",
        "showSplitSeries": false,
        "showIndependentYRanges": false,
        "legendMode": "standard",
        "legendDisplay": "top",
        "backgroundColor": "transparent",
        "xAxisTitleText": "no",
        "y2AxisMax": 100
      },
      "showProgressBar": false,
      "showLastUpdated": false
    },
    "viz_kQtw1oXu": {
      "type": "splunk.map",
      "options": {
        "center": [
          20.040183884278633,
          -10.439508885322311
        ],
        "zoom": 1,
        "layers": [
          {
            "seriesColors": [
              "#A870EF",
              "#00CDAF"
            ],
            "bubbleSize": "> primary | frameBySeriesNames('origin','target')",
            "type": "bubble"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_VzNQIMMM"
      }
    },
    "viz_I4FfkIu4": {
      "type": "splunk.sankey",
      "dataSources": {
        "primary": "ds_446ij0Ag"
      },
      "options": {
        "backgroundColor": "transparent"
      }
    },
    "viz_903rCKeL": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Executive Summary",
        "fontSize": "extraLarge"
      }
    },
    "viz_Nz4UoCeA": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#15161A"
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
    "viz_w45P1CxU": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#15161A"
      }
    },
    "viz_1v0TnAi7": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#15161A"
      }
    },
    "viz_46mBQRrA": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## Threat Origin and Destination\\n"
      }
    },
    "viz_Dl2kyX5E": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "Bubble size represents the number of threats originating from or destined for a particular location",
        "fontColor": "#909090"
      }
    },
    "viz_c9alVnL1": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAygAAAB0CAYAAABuUBbgAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAACiLSURBVHgB7d0LXFRl3gfw56CUoDK6KGhpBSpoWIKuNy762S5qmrrt5rWyi9ll67USTc1VQ99X29Iyb128VN42bd93E11TywovaF4C01IwYTcrRUEcCjQh5j0/6IxnDmdmzsAMc4Tf9/OhmHHmMOecZ/7n/J+rJAwLb9yokbWnJDW4RX4QYbOVh0uS1FgQERERERGp2Gy2YkkKyCsvL8+VJNvRS5cs+4TIKzbyXsn9S5qENWpUPkT+M7czISEiIiIiouooL7ft+OWXBn8X4uezrl7nIkFBi8lPoyRJDBFEREREREReYLOVp8otKn931qLiJEGpaDWZIycnYYKIiIiIiMiLbDaRd+lSwDS91pQGVV/eKKJRI5HC5ISIiIiIiHxBzjWaNGxo69WwYYMjZWVlF9T/pklQ0HLC5ISIiIiIiHxLzjkay//tWlZ27RdCXLZ391IlKBhz8ss8JidERERERFQbfmtJ6VlW9rtPhSguxXP2BKVRI9uD8gu6CiIiIiIiolpSmaRcuqasrOxLPA6ofLpJGGfrIiIiIiIif5CkgMHISfB7RYJy7bW/jhJERERERET+IVWuvViZoDQOCJBuF0RERERERH4iSdJtGBcf0KhRo56CiIiIiIjIr2xNGjWy9gqw2aRbBBERERERkZ/JrSid0cUrUhAREREREflZebm4KYDrnhARERERkRkEBASEywmK1FgQERERERH5na1xgCAiIiIiIjIJJihERERERGQaTFCIiIiIiMg0mKAQEREREZFpMEEhIiIiIiLTYIJCRERERESmwQSFiIiIiIhMgwkKERERERGZBhMUIiIiIiIyDSYoRERERERkGkxQiIiIiIjINJigEBERERGRaTBBISIiIiIi02CCQkREREREpsEEhYiIiIiITIMJChERERERmQYTFCIiIiIiMg0mKEREREREZBpMUIiIiIiIyDSYoBARERERkWk0FCZwXfPooMdvWxgXbokMuTYwOFDUUPbpfWfe2/XC0R8Lsy4KIiJyqjyiTdDl6X+JE23DQ2xBjWocf6XMY2eumf/u0YDc7xl/iYioWqSgoOBU4UdITmbc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yDSYoBARERERkWkwQSEiIiIiItNggkJERERERKbBBIWIiIiIiEyDCQoREREREZkGExQiIiIiIjINJihERERERGQaTFCIiIiIiMg0mKAQEREREZFpMEEhIiIiIiLTYIJCRERERESmwQSFiIiIiIhMgwkKERERERGZBhMUIiIiIiIyDSYoRERERERkGgE2m61YEBERERER+Z1ULCco4qwgIiIiIiLys/Ly8ryAgACRI4iIiIiIiPxMzk1y0cXriCAiIiIiIvIzmy3gaMClS5e+4DgUIiIiIiLyM9ulS02+wCxecnIi7RBERERERER+Y5NzkrziimmGGzYMSBVERERERET+YWvQoMH7+KUB/nP58uXihg0DG0uSiBZERERERES1yGYTqSUlxbvxu32hxkuXSv4u/8MZQUREREREVEvkHCTPYmn6vvK4gerfShs1uvaL8nJbT7klpYkgIiIiIiLyISQnDRsGTCssLLygPKdOUH7r6tXgqBBSHJMUIiIiIiLyFSQnQpTPKSkp+UH9fAPtC8vKyi781pLSg0kKERERERF5m9Jyok1OoIHeG9CSUlZW+mnDhoHXyElKlPyUJIiIiIiIiGrGhgHxFkvTeepuXWpuE48mTZqE/frrr6Pkl94mmKgQEREREZFnbFgYPiBA2hEQELDp559/PuvqxYYTjvDw8MZWa3FPSfr1lvJycZPcshIuSVJjQUREREREpIKEBN245IQk12b79YjFYtmfl5dXbOS9/w8GrznxgzC1DgAAAABJRU5ErkJggg=="
      }
    },
    "viz_yrnTfz48": {
      "type": "splunk.markergauge",
      "options": {
        "orientation": "horizontal",
        "backgroundColor": "transparent",
        "gaugeRanges": [
          {
            "from": 90,
            "value": "#CEF06C",
            "to": 100
          },
          {
            "from": 50,
            "value": "#F7933F",
            "to": 90
          },
          {
            "from": 0,
            "value": "#E85B79",
            "to": 50
          }
        ]
      },
      "dataSources": {
        "primary": "ds_aNJrIUWu_ds_xsRIm6SV"
      },
      "showProgressBar": false,
      "showLastUpdated": false
    },
    "viz_YCmcql2l": {
      "type": "splunk.singlevalue",
      "options": {
        "sparklineDisplay": "off",
        "majorColor": "> majorValue | rangeValue(majorColorEditorConfig)",
        "trendColor": "> majorValue | rangeValue(majorColorEditorConfig)",
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_aNJrIUWu_ds_xsRIm6SV"
      },
      "context": {
        "majorColorEditorConfig": [
          {
            "value": "#e85b79",
            "to": 20
          },
          {
            "value": "#f7933f",
            "from": 20,
            "to": 75
          },
          {
            "value": "#cef06c",
            "from": 75
          }
        ],
        "trendColorEditorConfig": [
          {
            "to": 0,
            "value": "#9E2520"
          },
          {
            "from": 0,
            "value": "#1C6B2D"
          }
        ]
      }
    },
    "viz_cfBBlpoa": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### **Security Score**",
        "fontSize": "large"
      }
    },
    "viz_BCtQcwyb": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "data:image/png;base64,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"
      }
    },
    "viz_ykwd2HVA": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('total')",
        "trendFontSize": 18
      },
      "dataSources": {
        "primary": "ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"
      }
    },
    "viz_ADTg16xR": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### **Threats Mitigated**"
      }
    },
    "viz_MN4xX0yb": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### **Total Threats**"
      }
    },
    "viz_PcUCkRBJ": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('mitigated')",
        "trendFontSize": 18
      },
      "dataSources": {
        "primary": "ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"
      }
    },
    "viz_m6UCaPY7": {
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
          "#FFFFFF"
        ],
        "areaOpacity": 0.3
      },
      "dataSources": {
        "primary": "ds_1rOS3FYc"
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
          "#FFFFFF"
        ],
        "areaOpacity": 0.3
      },
      "dataSources": {
        "primary": "ds_Ys7KyEPQ"
      }
    },
    "viz_dgMCxvya": {
      "type": "splunk.image",
      "options": {
        "src": "$Threat Level Icon:result.icon$",
        "preserveAspectRatio": true
      }
    },
    "viz_uyLaWAAJ": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "$Threat Level:result.level$ risk of cyber attacks",
        "fontColor": "#909090"
      }
    },
    "viz_GgdlEpAT": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### **Threat Level**",
        "fontSize": "large"
      }
    },
    "viz_9p4gm09n": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off"
      },
      "dataSources": {
        "primary": "ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"
      }
    },
    "viz_vZeQnLn1": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "Non Compliant Devices\\n",
        "fontColor": "#909090"
      }
    },
    "viz_2Y5G6xub": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "Training Completion",
        "fontColor": "#909090"
      }
    },
    "viz_AdSFZteD": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off"
      },
      "dataSources": {
        "primary": "ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"
      }
    },
    "viz_xSTbfudg": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "Exceptions Granted",
        "fontColor": "#909090"
      }
    },
    "viz_awXhrL80": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "Incidents",
        "fontColor": "#909090"
      }
    },
    "viz_E7LcwW9y": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off"
      },
      "dataSources": {
        "primary": "ds_QW1SdJ16_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"
      }
    },
    "viz_nMS3AY4H": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "sparklineDisplay": "off"
      },
      "dataSources": {
        "primary": "ds_e87D3wms_ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"
      }
    },
    "viz_yyAmIyVi": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#15161A"
      }
    },
    "viz_JD9106hz": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### **Risk Factors**",
        "fontSize": "large"
      }
    },
    "viz_iI2Jpb8D": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "#15161A",
        "strokeColor": "transparent",
        "rx": 20
      }
    },
    "viz_VCuSPgmE": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "#15161A",
        "strokeColor": "transparent",
        "rx": 20
      }
    },
    "viz_nO6v2d6Z": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "#### **Network Access**"
      }
    },
    "viz_xszFpyWd": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "#### **Device Security**"
      }
    },
    "viz_Jk1Bdfpl": {
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
          "#FFFFFF"
        ],
        "areaOpacity": 0.3
      },
      "dataSources": {
        "primary": "ds_QW1SdJ16_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"
      }
    },
    "viz_qZjsuKFx": {
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
          "#FFFFFF"
        ],
        "areaOpacity": 0.3
      },
      "dataSources": {
        "primary": "ds_e87D3wms_ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"
      }
    },
    "viz_isJRWTT6": {
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
          "#FFFFFF"
        ],
        "areaOpacity": 0.3
      },
      "dataSources": {
        "primary": "ds_LTHebRF9_ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"
      }
    },
    "viz_bOqs1dil": {
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
          "#FFFFFF"
        ],
        "areaOpacity": 0.3
      },
      "dataSources": {
        "primary": "ds_7GyjbxRJ_ds_zXAB6yt5_ds_aNJrIUWu_ds_xsRIm6SV"
      }
    },
    "viz_W1mC5aML": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/network.png"
      }
    },
    "viz_GB7JXPXw": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/devices.png"
      }
    },
    "viz_3ThzvfzI": {
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
            "url": "/app/splunk-dashboard-studio/example-hub-security-network-dashboard",
            "newTab": true
          }
        }
      ]
    },
    "viz_nwfBePjZ": {
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
    },
    "viz_ubcXOAAd": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# $Threat Level:result.level$",
        "fontSize": "large"
      }
    }
  },
  "inputs": {},
  "title": "Security Executive Summary",
  "description": "",
  "defaults": {
    "dataSources": {
      "ds.search": {
        "options": {}
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
            "item": "viz_yyAmIyVi",
            "type": "block",
            "position": {
              "x": 1050,
              "y": 620,
              "w": 360,
              "h": 300
            }
          },
          {
            "item": "viz_tQ1F8zM2",
            "type": "block",
            "position": {
              "x": 30,
              "y": 260,
              "w": 990,
              "h": 670
            }
          },
          {
            "item": "viz_kQtw1oXu",
            "type": "block",
            "position": {
              "x": 40,
              "y": 560,
              "w": 970,
              "h": 360
            }
          },
          {
            "item": "viz_903rCKeL",
            "type": "block",
            "position": {
              "x": 30,
              "y": 30,
              "w": 460,
              "h": 50
            }
          },
          {
            "item": "viz_Nz4UoCeA",
            "type": "block",
            "position": {
              "x": 710,
              "y": 100,
              "w": 310,
              "h": 130
            }
          },
          {
            "item": "viz_I4FfkIu4",
            "type": "block",
            "position": {
              "x": 30,
              "y": 340,
              "w": 990,
              "h": 210
            }
          },
          {
            "item": "viz_LK04XQ2J",
            "type": "block",
            "position": {
              "x": 370,
              "y": 100,
              "w": 310,
              "h": 130
            }
          },
          {
            "item": "viz_w45P1CxU",
            "type": "block",
            "position": {
              "x": 30,
              "y": 100,
              "w": 310,
              "h": 130
            }
          },
          {
            "item": "viz_1v0TnAi7",
            "type": "block",
            "position": {
              "x": 1050,
              "y": 100,
              "w": 360,
              "h": 490
            }
          },
          {
            "item": "viz_46mBQRrA",
            "type": "block",
            "position": {
              "x": 50,
              "y": 280,
              "w": 300,
              "h": 40
            }
          },
          {
            "item": "viz_Dl2kyX5E",
            "type": "block",
            "position": {
              "x": 50,
              "y": 310,
              "w": 700,
              "h": 40
            }
          },
          {
            "item": "viz_c9alVnL1",
            "type": "block",
            "position": {
              "x": 110,
              "y": 575,
              "w": 220,
              "h": 40
            }
          },
          {
            "item": "viz_yrnTfz48",
            "type": "block",
            "position": {
              "x": 1030,
              "y": 240,
              "w": 400,
              "h": 100
            }
          },
          {
            "item": "viz_YCmcql2l",
            "type": "block",
            "position": {
              "x": 1070,
              "y": 130,
              "w": 170,
              "h": 100
            }
          },
          {
            "item": "viz_cfBBlpoa",
            "type": "block",
            "position": {
              "x": 1060,
              "y": 110,
              "w": 300,
              "h": 40
            }
          },
          {
            "item": "viz_BCtQcwyb",
            "type": "block",
            "position": {
              "x": 1290,
              "y": 140,
              "w": 80,
              "h": 70
            }
          },
          {
            "item": "viz_ykwd2HVA",
            "type": "block",
            "position": {
              "x": 390,
              "y": 140,
              "w": 220,
              "h": 60
            }
          },
          {
            "item": "viz_ADTg16xR",
            "type": "block",
            "position": {
              "x": 720,
              "y": 110,
              "w": 300,
              "h": 30
            }
          },
          {
            "item": "viz_MN4xX0yb",
            "type": "block",
            "position": {
              "x": 380,
              "y": 110,
              "w": 300,
              "h": 30
            }
          },
          {
            "item": "viz_PcUCkRBJ",
            "type": "block",
            "position": {
              "x": 730,
              "y": 140,
              "w": 220,
              "h": 60
            }
          },
          {
            "item": "viz_m6UCaPY7",
            "type": "block",
            "position": {
              "x": 700,
              "y": 170,
              "w": 330,
              "h": 70
            }
          },
          {
            "item": "viz_b2Ke0gaF",
            "type": "block",
            "position": {
              "x": 360,
              "y": 170,
              "w": 330,
              "h": 70
            }
          },
          {
            "item": "viz_dgMCxvya",
            "type": "block",
            "position": {
              "x": 50,
              "y": 140,
              "w": 70,
              "h": 70
            }
          },
          {
            "item": "viz_uyLaWAAJ",
            "type": "block",
            "position": {
              "x": 140,
              "y": 190,
              "w": 200,
              "h": 40
            }
          },
          {
            "item": "viz_GgdlEpAT",
            "type": "block",
            "position": {
              "x": 40,
              "y": 110,
              "w": 300,
              "h": 40
            }
          },
          {
            "item": "viz_9p4gm09n",
            "type": "block",
            "position": {
              "x": 1070,
              "y": 790,
              "w": 130,
              "h": 80
            }
          },
          {
            "item": "viz_vZeQnLn1",
            "type": "block",
            "position": {
              "x": 1070,
              "y": 850,
              "w": 160,
              "h": 40
            }
          },
          {
            "item": "viz_2Y5G6xub",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 850,
              "w": 140,
              "h": 40
            }
          },
          {
            "item": "viz_AdSFZteD",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 790,
              "w": 130,
              "h": 80
            }
          },
          {
            "item": "viz_xSTbfudg",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 730,
              "w": 140,
              "h": 40
            }
          },
          {
            "item": "viz_awXhrL80",
            "type": "block",
            "position": {
              "x": 1080,
              "y": 730,
              "w": 120,
              "h": 40
            }
          },
          {
            "item": "viz_E7LcwW9y",
            "type": "block",
            "position": {
              "x": 1070,
              "y": 670,
              "w": 130,
              "h": 80
            }
          },
          {
            "item": "viz_nMS3AY4H",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 670,
              "w": 130,
              "h": 80
            }
          },
          {
            "item": "viz_chart_1",
            "type": "block",
            "position": {
              "x": 1060,
              "y": 370,
              "w": 340,
              "h": 210
            }
          },
          {
            "item": "viz_JD9106hz",
            "type": "block",
            "position": {
              "x": 1070,
              "y": 640,
              "w": 300,
              "h": 40
            }
          },
          {
            "item": "viz_iI2Jpb8D",
            "type": "block",
            "position": {
              "x": 1050,
              "y": 30,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_VCuSPgmE",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 30,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_nO6v2d6Z",
            "type": "block",
            "position": {
              "x": 1100,
              "y": 40,
              "w": 120,
              "h": 30
            }
          },
          {
            "item": "viz_xszFpyWd",
            "type": "block",
            "position": {
              "x": 1290,
              "y": 40,
              "w": 120,
              "h": 30
            }
          },
          {
            "item": "viz_Jk1Bdfpl",
            "type": "block",
            "position": {
              "x": 1070,
              "y": 750,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_qZjsuKFx",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 750,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_isJRWTT6",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 870,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_bOqs1dil",
            "type": "block",
            "position": {
              "x": 1070,
              "y": 870,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_W1mC5aML",
            "type": "block",
            "position": {
              "x": 1060,
              "y": 30,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_GB7JXPXw",
            "type": "block",
            "position": {
              "x": 1250,
              "y": 30,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_3ThzvfzI",
            "type": "block",
            "position": {
              "x": 1050,
              "y": 30,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_nwfBePjZ",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 30,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_ubcXOAAd",
            "type": "block",
            "position": {
              "x": 140,
              "y": 150,
              "w": 200,
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
\`\`\``}}},inputs:{},title:"",description:"",defaults:{dataSources:{"ds.search":{options:{}}}},layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"absolute",options:{width:1440,height:1260,backgroundImage:{x:0,y:0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/background.png",w:1200,h:960}},structure:[{item:"viz_yyAmIyVi",type:"block",position:{x:1050,y:620,w:360,h:300}},{item:"viz_tQ1F8zM2",type:"block",position:{x:30,y:260,w:990,h:670}},{item:"viz_kQtw1oXu",type:"block",position:{x:40,y:560,w:970,h:360}},{item:"viz_903rCKeL",type:"block",position:{x:30,y:30,w:460,h:50}},{item:"viz_Nz4UoCeA",type:"block",position:{x:710,y:100,w:310,h:130}},{item:"viz_I4FfkIu4",type:"block",position:{x:30,y:340,w:990,h:210}},{item:"viz_LK04XQ2J",type:"block",position:{x:370,y:100,w:310,h:130}},{item:"viz_w45P1CxU",type:"block",position:{x:30,y:100,w:310,h:130}},{item:"viz_1v0TnAi7",type:"block",position:{x:1050,y:100,w:360,h:490}},{item:"viz_46mBQRrA",type:"block",position:{x:50,y:280,w:300,h:40}},{item:"viz_Dl2kyX5E",type:"block",position:{x:50,y:310,w:700,h:40}},{item:"viz_c9alVnL1",type:"block",position:{x:110,y:575,w:220,h:40}},{item:"viz_yrnTfz48",type:"block",position:{x:1030,y:240,w:400,h:100}},{item:"viz_YCmcql2l",type:"block",position:{x:1070,y:130,w:170,h:100}},{item:"viz_cfBBlpoa",type:"block",position:{x:1060,y:110,w:300,h:40}},{item:"viz_BCtQcwyb",type:"block",position:{x:1290,y:140,w:80,h:70}},{item:"viz_ykwd2HVA",type:"block",position:{x:390,y:140,w:220,h:60}},{item:"viz_ADTg16xR",type:"block",position:{x:720,y:110,w:300,h:30}},{item:"viz_MN4xX0yb",type:"block",position:{x:380,y:110,w:300,h:30}},{item:"viz_PcUCkRBJ",type:"block",position:{x:730,y:140,w:220,h:60}},{item:"viz_m6UCaPY7",type:"block",position:{x:700,y:170,w:330,h:70}},{item:"viz_b2Ke0gaF",type:"block",position:{x:360,y:170,w:330,h:70}},{item:"viz_dgMCxvya",type:"block",position:{x:50,y:140,w:70,h:70}},{item:"viz_uyLaWAAJ",type:"block",position:{x:140,y:190,w:200,h:40}},{item:"viz_GgdlEpAT",type:"block",position:{x:40,y:110,w:300,h:40}},{item:"viz_9p4gm09n",type:"block",position:{x:1070,y:790,w:130,h:80}},{item:"viz_vZeQnLn1",type:"block",position:{x:1070,y:850,w:160,h:40}},{item:"viz_2Y5G6xub",type:"block",position:{x:1240,y:850,w:140,h:40}},{item:"viz_AdSFZteD",type:"block",position:{x:1240,y:790,w:130,h:80}},{item:"viz_xSTbfudg",type:"block",position:{x:1240,y:730,w:140,h:40}},{item:"viz_awXhrL80",type:"block",position:{x:1080,y:730,w:120,h:40}},{item:"viz_E7LcwW9y",type:"block",position:{x:1070,y:670,w:130,h:80}},{item:"viz_nMS3AY4H",type:"block",position:{x:1240,y:670,w:130,h:80}},{item:"viz_chart_1",type:"block",position:{x:1060,y:370,w:340,h:210}},{item:"viz_JD9106hz",type:"block",position:{x:1070,y:640,w:300,h:40}},{item:"viz_iI2Jpb8D",type:"block",position:{x:1050,y:30,w:170,h:50}},{item:"viz_VCuSPgmE",type:"block",position:{x:1240,y:30,w:170,h:50}},{item:"viz_nO6v2d6Z",type:"block",position:{x:1100,y:40,w:120,h:30}},{item:"viz_xszFpyWd",type:"block",position:{x:1290,y:40,w:120,h:30}},{item:"viz_Jk1Bdfpl",type:"block",position:{x:1070,y:750,w:130,h:40}},{item:"viz_qZjsuKFx",type:"block",position:{x:1240,y:750,w:130,h:40}},{item:"viz_isJRWTT6",type:"block",position:{x:1240,y:870,w:130,h:40}},{item:"viz_bOqs1dil",type:"block",position:{x:1070,y:870,w:130,h:40}},{item:"viz_W1mC5aML",type:"block",position:{x:1060,y:30,w:40,h:50}},{item:"viz_GB7JXPXw",type:"block",position:{x:1250,y:30,w:40,h:50}},{item:"viz_3ThzvfzI",type:"block",position:{x:1050,y:30,w:170,h:50}},{item:"viz_nwfBePjZ",type:"block",position:{x:1240,y:30,w:170,h:50}},{item:"viz_ubcXOAAd",type:"block",position:{x:140,y:150,w:200,h:50}},{item:"viz_VRM8IYRS",type:"block",position:{x:20,y:980,w:1400,h:260}}]}},globalInputs:[],options:{showTitleAndDescription:!1}}};var s=o(a());var t="Executive Summary";i(s.default.createElement(n,{definition:e,isCompleteDashboard:!0,dashboardTitle:t}),{pageTitle:t,hideFooter:!0,layout:"fixed"});
