/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a}from"../chunks/chunk-REK4W3C7.js";import{h as s}from"../chunks/chunk-JHLB3KMN.js";var i={dataSources:{ds_7N1LKEOc:{type:"ds.search",options:{queryParameters:{earliest:"0",latest:""},query:`| inputlookup security_example_data.csv 
| where network_type!="visitor_office" AND (device_type="$device_type$") 
| iplocation network_ip 
| geostats latfield=lat longfield=lon count by network_type 
| eval employee_office=employee_office*123 
| eval contingent_office=contingent_office*123 
| eval employee_remote=employee_remote*123 
| eval contingent_remote=contingent_remote*123 
| eval visitor_office=visitor_office*15`},name:"Network Access Map"},ds_pclCazqp:{type:"ds.search",options:{queryParameters:{earliest:"0",latest:""},query:`| inputlookup security_example_data.csv 
| where network_type!="visitor_office" 
    AND (device_type="$device_type$") 
| eval _time=timestamp 
| timechart span=1d count by network_type 
| eval employee_office=employee_office*123 
| eval contingent_office=contingent_office*123 
| eval employee_remote=employee_remote*123 
| eval contingent_remote=contingent_remote*123`},name:"Network Access Base"},ds_i7huyNlb:{type:"ds.chain",options:{extend:"ds_pclCazqp",query:"| fields _time employee_office"},name:"Office Employees"},ds_1rQ1XclX_ds_i7huyNlb:{type:"ds.chain",options:{extend:"ds_pclCazqp",query:"| fields _time contingent_office"},name:"Office Contingents"},ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb:{type:"ds.chain",options:{extend:"ds_pclCazqp",query:"| fields _time employee_remote"},name:"Remote Employees"},ds_OqW1Ndcz_ds_1rQ1XclX_ds_i7huyNlb:{type:"ds.chain",options:{extend:"ds_pclCazqp",query:"| fields _time contingent_remote"},name:"Remote Contingents"},ds_LRX88BGJ_ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb:{type:"ds.chain",options:{extend:"ds_pclCazqp",query:"| fields _time vistitor_office"},name:"Office Visitors"},ds_2w9t0SN3:{type:"ds.search",options:{queryParameters:{earliest:"0",latest:""},query:`| inputlookup security_example_data.csv 
| where network_type!="visitor_office" AND (device_type="$device_type$")
| eval _time=timestamp 
| stats count by network_type
| eval employee_office=employee_office*123
| eval contingent_office=contingent_office*123
| eval employee_remote=employee_remote*123
| eval contingent_remote=contingent_remote*123
| eval network_type=case(network_type="employee_office", "Employees in Office", network_type="contingent_office", "Contingents in Office", network_type="employee_remote", "Employees Remote", network_type="contingent_remote", "Contingents Remote", network_type="visitor_office", "Visitors in Office")`},name:"Network Access Pie"},ds_Pg1O176s:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| makeresults count=54
| eval status="Compliant"
| append 
    [| makeresults count=20
    | eval status="Exceptions"]
| append
    [| makeresults count=16
    | eval status="Non compliant"]
| stats count by status`,enableSmartSources:!0},name:"Device Compliance"},ds_r6c4RRe5:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| makeresults count=72
| stats count`},name:"Security Training Completion"},ds_SqvYQXh8:{type:"ds.chain",options:{extend:"ds_a1lrFMNO",query:"| stats sum"},name:"Device Sums"},ds_v4MzWNIZ:{type:"ds.chain",options:{extend:"ds_Pg1O176s",query:"| transpose header_field=status",enableSmartSources:!0},name:"Percentages"},ds_a1lrFMNO:{type:"ds.search",options:{queryParameters:{earliest:"0",latest:""},query:`| inputlookup security_example_data.csv 
| where network_type!="visitor_office" 
| eval _time=timestamp 
| timechart span=1d count by device_type 
| eval computer=computer*12
| eval mobile=mobile*12
| eval total=sum(computer)+sum(mobile) `},name:"Devices Base"},ds_lWDt9bMh:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},enableSmartSources:!0,query:`| makeresults
| eval device_label=case($device_type|s$="computer", "Desktop", $device_type|s$="mobile", "Mobile", 1=1, "All")
| table device_label`},name:"Devices Token Label"}},visualizations:{viz_903rCKeL:{type:"splunk.markdown",options:{markdown:"# Employee Device Security",fontSize:"extraLarge"}},viz_tQ1F8zM2:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent"}},viz_LK04XQ2J:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_ykwd2HVA:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('employee_office')"},dataSources:{primary:"ds_pclCazqp"}},viz_MN4xX0yb:{type:"splunk.markdown",options:{markdown:"### Employee Office Devices"}},viz_b2Ke0gaF:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#FF67DE"],areaOpacity:.4},dataSources:{primary:"ds_i7huyNlb"}},viz_yVfrCyeN:{type:"splunk.map",options:{center:[24.04616563953327,19.090286311136538],zoom:1,layers:[{seriesColors:["#FF67DE","#A870EF","#009CEB","#00CDAF"],bubbleSize:"> primary | frameBySeriesNames('employee_office','contingent_office','employee_remote','contingent_remote')"}]},dataSources:{primary:"ds_7N1LKEOc"}},viz_XRHlJZXU:{type:"splunk.image",options:{src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_pink.png"}},viz_P2th2sn6:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_gpvdEHlu:{type:"splunk.image",options:{src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_purple.png"}},viz_fPKqjcia:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('contingent_office')"},dataSources:{primary:"ds_pclCazqp"}},viz_JXHTXpiB:{type:"splunk.markdown",options:{markdown:"### Contingent Office Devices"}},viz_mgZUvKA9:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#7B56DB"],areaOpacity:.4},dataSources:{primary:"ds_1rQ1XclX_ds_i7huyNlb"}},viz_d3XCHvYQ:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_nfLQSpRI:{type:"splunk.image",options:{src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_blue.png"}},viz_vqmp9PLf:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('employee_remote')"},dataSources:{primary:"ds_pclCazqp"}},viz_II5AbqAK:{type:"splunk.markdown",options:{markdown:"### Employee Remote Devices"}},viz_X4whFlJ3:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#009CEB"],areaOpacity:.4},dataSources:{primary:"ds_S75vOIkG_ds_1rQ1XclX_ds_i7huyNlb"}},viz_oAjRVQTc:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#15161A"}},viz_3BGyhxm5:{type:"splunk.image",options:{src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/gradient_green.png"}},viz_EzxmLlpy:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('contingent_remote')"},dataSources:{primary:"ds_pclCazqp"}},viz_vJyO1d3l:{type:"splunk.markdown",options:{markdown:"### Contingent Remote Devices"}},viz_XsF1y5kd:{type:"splunk.area",options:{legendDisplay:"off",nullValueDisplay:"connect",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",showYMajorGridLines:!1,xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",seriesColors:["#00CDAF"],areaOpacity:.4},dataSources:{primary:"ds_OqW1Ndcz_ds_1rQ1XclX_ds_i7huyNlb"}},viz_MyZbuF64:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent"}},viz_E4kFdqLy:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent"}},viz_3Caox5jb:{type:"splunk.pie",options:{labelDisplay:"valuesAndPercentage",backgroundColor:"transparent",seriesColorsByField:{"Employees in Office":"#FF67DE","Contingents in Office":"#A870EF","Employees Remote":"#009CEB","Contingents Remote":"#00CDAF","Visitors in Office":"#DD9900"}},dataSources:{primary:"ds_2w9t0SN3"}},viz_J2Q1dK6X:{type:"splunk.markdown",options:{markdown:"### Device Connections"}},viz_RQVYAOf0:{type:"splunk.markdown",options:{markdown:"### Device Breakdown"}},viz_FQJeFD2h:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent",rx:20}},viz_GwRiulQV:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent",rx:20}},viz_0BwYhXUi:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/network.png"}},viz_FIAo9HwU:{type:"splunk.markdown",options:{markdown:"#### Network Access"}},viz_uSnnSdQQ:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/executive.png"}},viz_cVIczTsX:{type:"splunk.markdown",options:{markdown:"#### Executive View"}},viz_hDhAGyZO:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent"}},viz_eVZqMGXp:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent"}},viz_1WOBs7XS:{type:"splunk.rectangle",options:{fillColor:"#15161A",strokeColor:"transparent"}},viz_mVQ0l7QJ:{type:"splunk.pie",options:{showDonutHole:!0,labelDisplay:"off",backgroundColor:"transparent",seriesColorsByField:{Compliant:"#85F415",Exceptions:"#F49106","Non compliant":"#FF4242"}},dataSources:{primary:"ds_Pg1O176s"}},viz_7oQbhUil:{type:"splunk.markdown",options:{markdown:"### Device Compliance"}},viz_x2Pj2Q5Q:{type:"splunk.fillergauge",options:{orientation:"horizontal",backgroundColor:"transparent"},dataSources:{primary:"ds_r6c4RRe5"},showProgressBar:!1,showLastUpdated:!1},viz_jZvxgMTX:{type:"splunk.markdown",options:{markdown:"### Security Training Completion"}},viz_nighFxKS:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/devices.png"}},viz_Q8GGnYDE:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('sum(total)')"},dataSources:{primary:"ds_SqvYQXh8"},showProgressBar:!1,showLastUpdated:!1,eventHandlers:[{type:"drilldown.setToken",options:{tokens:[{token:"device_type",value:'mobile" OR device_type="computer'}]}}]},viz_7NTJmera:{type:"splunk.markdown",options:{markdown:"Total Devices",fontColor:"#B5B5B5"}},viz_wsjKuTjw:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"data:image/png;base64,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"}},viz_Jw4VQedJ:{type:"splunk.markdown",options:{markdown:"$Percentages:result.Compliant$ %",fontColor:"#B5B5B5"}},viz_ztfGP9CJ:{type:"splunk.markdown",options:{markdown:"$Percentages:result.Exceptions$ %",fontColor:"#B5B5B5"}},viz_x2VCukpa:{type:"splunk.markdown",options:{markdown:"$Percentages:result.Non compliant$ %",fontColor:"#B5B5B5"}},viz_dafLSdNq:{type:"splunk.rectangle",options:{fillColor:"transparent",strokeColor:"transparent",rx:20},eventHandlers:[{type:"drilldown.customUrl",options:{url:"/app/splunk-dashboard-studio/example-hub-security-network-dashboard",newTab:!0}}]},viz_6pVblUuP:{type:"splunk.rectangle",options:{fillColor:"transparent",strokeColor:"transparent",rx:20},eventHandlers:[{type:"drilldown.customUrl",options:{url:"/app/splunk-dashboard-studio/example-hub-security-summary-dashboard",newTab:!0}}]},viz_8bLuDcI5:{type:"splunk.markdown",options:{markdown:"Select a device type to filter on the rest of the dashboard, or select the total count above to reset to all devices",fontColor:"#B5B5B5",fontSize:"small"}},viz_bLw12Iow:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/laptop.png"}},viz_WeWzlq9m:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/mobile.png"}},viz_Zl7vLviO:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",underLabel:"Desktop",trendDisplay:"off",sparklineDisplay:"off",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('sum(computer)')"},eventHandlers:[{type:"drilldown.setToken",options:{tokens:[{token:"device_type",value:"computer"}]}}],dataSources:{primary:"ds_SqvYQXh8"}},viz_iUKyyFVQ:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",underLabel:"Mobile",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('sum(mobile)')",trendDisplay:"off",sparklineDisplay:"off"},eventHandlers:[{type:"drilldown.setToken",options:{tokens:[{token:"device_type",value:"mobile"}]}}],dataSources:{primary:"ds_SqvYQXh8"}},viz_3NNz4UdC:{type:"splunk.markdown",options:{markdown:`
Currently showing: $Devices Token Label:result.device_label$ devices`,fontColor:"#B5B5B5",fontSize:"large"}},viz_7Al913YU:{type:"splunk.markdown",options:{backgroundColor:"#000000",markdown:`## Full Source

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
        "query": "| inputlookup security_example_data.csv \\n| where network_type!=\\"visitor_office\\" AND (device_type=\\"$device_type$\\") \\n| iplocation network_ip \\n| geostats latfield=lat longfield=lon count by network_type \\n| eval employee_office=employee_office*123 \\n| eval contingent_office=contingent_office*123 \\n| eval employee_remote=employee_remote*123 \\n| eval contingent_remote=contingent_remote*123 \\n| eval visitor_office=visitor_office*15"
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
        "query": "| inputlookup security_example_data.csv \\n| where network_type!=\\"visitor_office\\" \\n    AND (device_type=\\"$device_type$\\") \\n| eval _time=timestamp \\n| timechart span=1d count by network_type \\n| eval employee_office=employee_office*123 \\n| eval contingent_office=contingent_office*123 \\n| eval employee_remote=employee_remote*123 \\n| eval contingent_remote=contingent_remote*123"
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
        "query": "| fields _time vistitor_office"
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
        "query": "| inputlookup security_example_data.csv \\n| where network_type!=\\"visitor_office\\" AND (device_type=\\"$device_type$\\")\\n| eval _time=timestamp \\n| stats count by network_type\\n| eval employee_office=employee_office*123\\n| eval contingent_office=contingent_office*123\\n| eval employee_remote=employee_remote*123\\n| eval contingent_remote=contingent_remote*123\\n| eval network_type=case(network_type=\\"employee_office\\", \\"Employees in Office\\", network_type=\\"contingent_office\\", \\"Contingents in Office\\", network_type=\\"employee_remote\\", \\"Employees Remote\\", network_type=\\"contingent_remote\\", \\"Contingents Remote\\", network_type=\\"visitor_office\\", \\"Visitors in Office\\")"
      },
      "name": "Network Access Pie"
    },
    "ds_Pg1O176s": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "query": "| makeresults count=54\\n| eval status=\\"Compliant\\"\\n| append \\n    [| makeresults count=20\\n    | eval status=\\"Exceptions\\"]\\n| append\\n    [| makeresults count=16\\n    | eval status=\\"Non compliant\\"]\\n| stats count by status",
        "enableSmartSources": true
      },
      "name": "Device Compliance"
    },
    "ds_r6c4RRe5": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "query": "| makeresults count=72\\n| stats count"
      },
      "name": "Security Training Completion"
    },
    "ds_SqvYQXh8": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_a1lrFMNO",
        "query": "| stats sum"
      },
      "name": "Device Sums"
    },
    "ds_v4MzWNIZ": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_Pg1O176s",
        "query": "| transpose header_field=status",
        "enableSmartSources": true
      },
      "name": "Percentages"
    },
    "ds_a1lrFMNO": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "0",
          "latest": ""
        },
        "query": "| inputlookup security_example_data.csv \\n| where network_type!=\\"visitor_office\\" \\n| eval _time=timestamp \\n| timechart span=1d count by device_type \\n| eval computer=computer*12\\n| eval mobile=mobile*12\\n| eval total=sum(computer)+sum(mobile) "
      },
      "name": "Devices Base"
    },
    "ds_lWDt9bMh": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "enableSmartSources": true,
        "query": "| makeresults\\n| eval device_label=case($device_type|s$=\\"computer\\", \\"Desktop\\", $device_type|s$=\\"mobile\\", \\"Mobile\\", 1=1, \\"All\\")\\n| table device_label"
      },
      "name": "Devices Token Label"
    }
  },
  "visualizations": {
    "viz_903rCKeL": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Employee Device Security",
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
        "markdown": "### Employee Office Devices"
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
          24.04616563953327,
          19.090286311136538
        ],
        "zoom": 1,
        "layers": [
          {
            "seriesColors": [
              "#FF67DE",
              "#A870EF",
              "#009CEB",
              "#00CDAF"
            ],
            "bubbleSize": "> primary | frameBySeriesNames('employee_office','contingent_office','employee_remote','contingent_remote')"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_7N1LKEOc"
      }
    },
    "viz_XRHlJZXU": {
      "type": "splunk.image",
      "options": {
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
        "markdown": "### Contingent Office Devices"
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
        "markdown": "### Employee Remote Devices"
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
        "markdown": "### Contingent Remote Devices"
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
          "Contingents in Office": "#A870EF",
          "Employees Remote": "#009CEB",
          "Contingents Remote": "#00CDAF",
          "Visitors in Office": "#DD9900"
        }
      },
      "dataSources": {
        "primary": "ds_2w9t0SN3"
      }
    },
    "viz_J2Q1dK6X": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Device Connections"
      }
    },
    "viz_RQVYAOf0": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Device Breakdown"
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
      }
    },
    "viz_0BwYhXUi": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/network.png"
      }
    },
    "viz_FIAo9HwU": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "#### Network Access"
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
    "viz_hDhAGyZO": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "#15161A",
        "strokeColor": "transparent"
      }
    },
    "viz_eVZqMGXp": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "#15161A",
        "strokeColor": "transparent"
      }
    },
    "viz_1WOBs7XS": {
      "type": "splunk.rectangle",
      "options": {
        "fillColor": "#15161A",
        "strokeColor": "transparent"
      }
    },
    "viz_mVQ0l7QJ": {
      "type": "splunk.pie",
      "options": {
        "showDonutHole": true,
        "labelDisplay": "off",
        "backgroundColor": "transparent",
        "seriesColorsByField": {
          "Compliant": "#85F415",
          "Exceptions": "#F49106",
          "Non compliant": "#FF4242"
        }
      },
      "dataSources": {
        "primary": "ds_Pg1O176s"
      }
    },
    "viz_7oQbhUil": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Device Compliance"
      }
    },
    "viz_x2Pj2Q5Q": {
      "type": "splunk.fillergauge",
      "options": {
        "orientation": "horizontal",
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_r6c4RRe5"
      },
      "showProgressBar": false,
      "showLastUpdated": false
    },
    "viz_jZvxgMTX": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Security Training Completion"
      }
    },
    "viz_nighFxKS": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/devices.png"
      }
    },
    "viz_Q8GGnYDE": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('sum(total)')"
      },
      "dataSources": {
        "primary": "ds_SqvYQXh8"
      },
      "showProgressBar": false,
      "showLastUpdated": false,
      "eventHandlers": [
        {
          "type": "drilldown.setToken",
          "options": {
            "tokens": [
              {
                "token": "device_type",
                "value": "mobile\\" OR device_type=\\"computer"
              }
            ]
          }
        }
      ]
    },
    "viz_7NTJmera": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "Total Devices",
        "fontColor": "#B5B5B5"
      }
    },
    "viz_wsjKuTjw": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "data:image/png;base64,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"
      }
    },
    "viz_Jw4VQedJ": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "$Percentages:result.Compliant$ %",
        "fontColor": "#B5B5B5"
      }
    },
    "viz_ztfGP9CJ": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "$Percentages:result.Exceptions$ %",
        "fontColor": "#B5B5B5"
      }
    },
    "viz_x2VCukpa": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "$Percentages:result.Non compliant$ %",
        "fontColor": "#B5B5B5"
      }
    },
    "viz_dafLSdNq": {
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
    "viz_6pVblUuP": {
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
    "viz_8bLuDcI5": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "Select a device type to filter on the rest of the dashboard, or select the total count above to reset to all devices",
        "fontColor": "#B5B5B5",
        "fontSize": "small"
      }
    },
    "viz_bLw12Iow": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/laptop.png"
      }
    },
    "viz_WeWzlq9m": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/security/mobile.png"
      }
    },
    "viz_Zl7vLviO": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "underLabel": "Desktop",
        "trendDisplay": "off",
        "sparklineDisplay": "off",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('sum(computer)')"
      },
      "eventHandlers": [
        {
          "type": "drilldown.setToken",
          "options": {
            "tokens": [
              {
                "token": "device_type",
                "value": "computer"
              }
            ]
          }
        }
      ],
      "dataSources": {
        "primary": "ds_SqvYQXh8"
      }
    },
    "viz_iUKyyFVQ": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "underLabel": "Mobile",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('sum(mobile)')",
        "trendDisplay": "off",
        "sparklineDisplay": "off"
      },
      "eventHandlers": [
        {
          "type": "drilldown.setToken",
          "options": {
            "tokens": [
              {
                "token": "device_type",
                "value": "mobile"
              }
            ]
          }
        }
      ],
      "dataSources": {
        "primary": "ds_SqvYQXh8"
      }
    },
    "viz_3NNz4UdC": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "\\nCurrently showing: $Devices Token Label:result.device_label$ devices",
        "fontColor": "#B5B5B5",
        "fontSize": "large"
      }
    }
  },
  "inputs": {},
  "title": "Employee Device Security",
  "description": "",
  "defaults": {
    "dataSources": {
      "ds.search": {
        "options": {}
      }
    },
    "tokens": {
      "default": {
        "device_type": {
          "value": "mobile\\" OR device_type=\\"computer"
        }
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
          "height": 950,
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
              "x": 320,
              "y": 120,
              "w": 260,
              "h": 120
            }
          },
          {
            "item": "viz_XRHlJZXU",
            "type": "block",
            "position": {
              "x": 320,
              "y": 120,
              "w": 260,
              "h": 120
            }
          },
          {
            "item": "viz_tQ1F8zM2",
            "type": "block",
            "position": {
              "x": 320,
              "y": 260,
              "w": 1100,
              "h": 480
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
            "item": "viz_ykwd2HVA",
            "type": "block",
            "position": {
              "x": 320,
              "y": 160,
              "w": 200,
              "h": 60
            }
          },
          {
            "item": "viz_MN4xX0yb",
            "type": "block",
            "position": {
              "x": 330,
              "y": 130,
              "w": 210,
              "h": 40
            }
          },
          {
            "item": "viz_b2Ke0gaF",
            "type": "block",
            "position": {
              "x": 310,
              "y": 200,
              "w": 290,
              "h": 50
            }
          },
          {
            "item": "viz_yVfrCyeN",
            "type": "block",
            "position": {
              "x": 340,
              "y": 280,
              "w": 1060,
              "h": 440
            }
          },
          {
            "item": "viz_P2th2sn6",
            "type": "block",
            "position": {
              "x": 600,
              "y": 120,
              "w": 260,
              "h": 120
            }
          },
          {
            "item": "viz_gpvdEHlu",
            "type": "block",
            "position": {
              "x": 600,
              "y": 120,
              "w": 260,
              "h": 120
            }
          },
          {
            "item": "viz_fPKqjcia",
            "type": "block",
            "position": {
              "x": 600,
              "y": 160,
              "w": 200,
              "h": 60
            }
          },
          {
            "item": "viz_JXHTXpiB",
            "type": "block",
            "position": {
              "x": 610,
              "y": 130,
              "w": 200,
              "h": 40
            }
          },
          {
            "item": "viz_mgZUvKA9",
            "type": "block",
            "position": {
              "x": 590,
              "y": 200,
              "w": 290,
              "h": 50
            }
          },
          {
            "item": "viz_d3XCHvYQ",
            "type": "block",
            "position": {
              "x": 880,
              "y": 120,
              "w": 260,
              "h": 120
            }
          },
          {
            "item": "viz_nfLQSpRI",
            "type": "block",
            "position": {
              "x": 880,
              "y": 120,
              "w": 260,
              "h": 120
            }
          },
          {
            "item": "viz_vqmp9PLf",
            "type": "block",
            "position": {
              "x": 880,
              "y": 160,
              "w": 200,
              "h": 60
            }
          },
          {
            "item": "viz_II5AbqAK",
            "type": "block",
            "position": {
              "x": 890,
              "y": 130,
              "w": 210,
              "h": 40
            }
          },
          {
            "item": "viz_X4whFlJ3",
            "type": "block",
            "position": {
              "x": 870,
              "y": 200,
              "w": 290,
              "h": 50
            }
          },
          {
            "item": "viz_oAjRVQTc",
            "type": "block",
            "position": {
              "x": 1160,
              "y": 120,
              "w": 260,
              "h": 120
            }
          },
          {
            "item": "viz_3BGyhxm5",
            "type": "block",
            "position": {
              "x": 1160,
              "y": 120,
              "w": 260,
              "h": 120
            }
          },
          {
            "item": "viz_EzxmLlpy",
            "type": "block",
            "position": {
              "x": 1160,
              "y": 160,
              "w": 200,
              "h": 60
            }
          },
          {
            "item": "viz_vJyO1d3l",
            "type": "block",
            "position": {
              "x": 1170,
              "y": 130,
              "w": 210,
              "h": 40
            }
          },
          {
            "item": "viz_XsF1y5kd",
            "type": "block",
            "position": {
              "x": 1150,
              "y": 200,
              "w": 290,
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
              "x": 740,
              "y": 770,
              "w": 670,
              "h": 160
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
              "w": 160,
              "h": 40
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
              "w": 120,
              "h": 30
            }
          },
          {
            "item": "viz_uSnnSdQQ",
            "type": "block",
            "position": {
              "x": 1060,
              "y": 50,
              "w": 40,
              "h": 30
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
            "item": "viz_hDhAGyZO",
            "type": "block",
            "position": {
              "x": 20,
              "y": 120,
              "w": 280,
              "h": 260
            }
          },
          {
            "item": "viz_eVZqMGXp",
            "type": "block",
            "position": {
              "x": 20,
              "y": 400,
              "w": 280,
              "h": 140
            }
          },
          {
            "item": "viz_1WOBs7XS",
            "type": "block",
            "position": {
              "x": 20,
              "y": 560,
              "w": 280,
              "h": 180
            }
          },
          {
            "item": "viz_mVQ0l7QJ",
            "type": "block",
            "position": {
              "x": 30,
              "y": 140,
              "w": 260,
              "h": 160
            }
          },
          {
            "item": "viz_7oQbhUil",
            "type": "block",
            "position": {
              "x": 30,
              "y": 130,
              "w": 170,
              "h": 30
            }
          },
          {
            "item": "viz_x2Pj2Q5Q",
            "type": "block",
            "position": {
              "x": 10,
              "y": 430,
              "w": 300,
              "h": 100
            }
          },
          {
            "item": "viz_jZvxgMTX",
            "type": "block",
            "position": {
              "x": 30,
              "y": 410,
              "w": 220,
              "h": 40
            }
          },
          {
            "item": "viz_nighFxKS",
            "type": "block",
            "position": {
              "x": 20,
              "y": 570,
              "w": 140,
              "h": 160
            }
          },
          {
            "item": "viz_Q8GGnYDE",
            "type": "block",
            "position": {
              "x": 140,
              "y": 610,
              "w": 150,
              "h": 80
            }
          },
          {
            "item": "viz_7NTJmera",
            "type": "block",
            "position": {
              "x": 170,
              "y": 670,
              "w": 100,
              "h": 40
            }
          },
          {
            "item": "viz_wsjKuTjw",
            "type": "block",
            "position": {
              "x": 40,
              "y": 290,
              "w": 120,
              "h": 70
            }
          },
          {
            "item": "viz_Jw4VQedJ",
            "type": "block",
            "position": {
              "x": 210,
              "y": 285,
              "w": 80,
              "h": 25
            }
          },
          {
            "item": "viz_ztfGP9CJ",
            "type": "block",
            "position": {
              "x": 210,
              "y": 312,
              "w": 80,
              "h": 25
            }
          },
          {
            "item": "viz_x2VCukpa",
            "type": "block",
            "position": {
              "x": 210,
              "y": 338,
              "w": 80,
              "h": 25
            }
          },
          {
            "item": "viz_dafLSdNq",
            "type": "block",
            "position": {
              "x": 1240,
              "y": 40,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_6pVblUuP",
            "type": "block",
            "position": {
              "x": 1050,
              "y": 40,
              "w": 170,
              "h": 50
            }
          },
          {
            "item": "viz_8bLuDcI5",
            "type": "block",
            "position": {
              "x": 40,
              "y": 790,
              "w": 660,
              "h": 40
            }
          },
          {
            "item": "viz_bLw12Iow",
            "type": "block",
            "position": {
              "x": 50,
              "y": 820,
              "w": 110,
              "h": 110
            }
          },
          {
            "item": "viz_WeWzlq9m",
            "type": "block",
            "position": {
              "x": 400,
              "y": 820,
              "w": 110,
              "h": 110
            }
          },
          {
            "item": "viz_Zl7vLviO",
            "type": "block",
            "position": {
              "x": 190,
              "y": 830,
              "w": 150,
              "h": 90
            }
          },
          {
            "item": "viz_iUKyyFVQ",
            "type": "block",
            "position": {
              "x": 540,
              "y": 830,
              "w": 150,
              "h": 90
            }
          },
          {
            "item": "viz_3NNz4UdC",
            "type": "block",
            "position": {
              "x": 40,
              "y": 80,
              "w": 300,
              "h": 40
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
\`\`\``}}},inputs:{},title:"",description:"",defaults:{dataSources:{"ds.search":{options:{}}},tokens:{default:{device_type:{value:'mobile" OR device_type="computer'}}},visualizations:{"splunk.singlevalue":{options:{majorFontSize:36,trendFontSize:16}}}},layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"absolute",options:{width:1440,height:1400,backgroundImage:{x:0,y:0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/security/background.png",w:1200,h:950}},structure:[{item:"viz_LK04XQ2J",type:"block",position:{x:320,y:120,w:260,h:120}},{item:"viz_XRHlJZXU",type:"block",position:{x:320,y:120,w:260,h:120}},{item:"viz_tQ1F8zM2",type:"block",position:{x:320,y:260,w:1100,h:480}},{item:"viz_903rCKeL",type:"block",position:{x:30,y:30,w:620,h:60}},{item:"viz_ykwd2HVA",type:"block",position:{x:320,y:160,w:200,h:60}},{item:"viz_MN4xX0yb",type:"block",position:{x:330,y:130,w:210,h:40}},{item:"viz_b2Ke0gaF",type:"block",position:{x:310,y:200,w:290,h:50}},{item:"viz_yVfrCyeN",type:"block",position:{x:340,y:280,w:1060,h:440}},{item:"viz_P2th2sn6",type:"block",position:{x:600,y:120,w:260,h:120}},{item:"viz_gpvdEHlu",type:"block",position:{x:600,y:120,w:260,h:120}},{item:"viz_fPKqjcia",type:"block",position:{x:600,y:160,w:200,h:60}},{item:"viz_JXHTXpiB",type:"block",position:{x:610,y:130,w:200,h:40}},{item:"viz_mgZUvKA9",type:"block",position:{x:590,y:200,w:290,h:50}},{item:"viz_d3XCHvYQ",type:"block",position:{x:880,y:120,w:260,h:120}},{item:"viz_nfLQSpRI",type:"block",position:{x:880,y:120,w:260,h:120}},{item:"viz_vqmp9PLf",type:"block",position:{x:880,y:160,w:200,h:60}},{item:"viz_II5AbqAK",type:"block",position:{x:890,y:130,w:210,h:40}},{item:"viz_X4whFlJ3",type:"block",position:{x:870,y:200,w:290,h:50}},{item:"viz_oAjRVQTc",type:"block",position:{x:1160,y:120,w:260,h:120}},{item:"viz_3BGyhxm5",type:"block",position:{x:1160,y:120,w:260,h:120}},{item:"viz_EzxmLlpy",type:"block",position:{x:1160,y:160,w:200,h:60}},{item:"viz_vJyO1d3l",type:"block",position:{x:1170,y:130,w:210,h:40}},{item:"viz_XsF1y5kd",type:"block",position:{x:1150,y:200,w:290,h:50}},{item:"viz_MyZbuF64",type:"block",position:{x:20,y:760,w:700,h:180}},{item:"viz_E4kFdqLy",type:"block",position:{x:740,y:760,w:680,h:180}},{item:"viz_3Caox5jb",type:"block",position:{x:740,y:770,w:670,h:160}},{item:"viz_J2Q1dK6X",type:"block",position:{x:750,y:770,w:300,h:30}},{item:"viz_RQVYAOf0",type:"block",position:{x:30,y:770,w:160,h:40}},{item:"viz_FQJeFD2h",type:"block",position:{x:1240,y:40,w:170,h:50}},{item:"viz_GwRiulQV",type:"block",position:{x:1050,y:40,w:170,h:50}},{item:"viz_0BwYhXUi",type:"block",position:{x:1250,y:40,w:40,h:50}},{item:"viz_FIAo9HwU",type:"block",position:{x:1290,y:50,w:120,h:30}},{item:"viz_uSnnSdQQ",type:"block",position:{x:1060,y:50,w:40,h:30}},{item:"viz_cVIczTsX",type:"block",position:{x:1100,y:50,w:110,h:30}},{item:"viz_hDhAGyZO",type:"block",position:{x:20,y:120,w:280,h:260}},{item:"viz_eVZqMGXp",type:"block",position:{x:20,y:400,w:280,h:140}},{item:"viz_1WOBs7XS",type:"block",position:{x:20,y:560,w:280,h:180}},{item:"viz_mVQ0l7QJ",type:"block",position:{x:30,y:140,w:260,h:160}},{item:"viz_7oQbhUil",type:"block",position:{x:30,y:130,w:170,h:30}},{item:"viz_x2Pj2Q5Q",type:"block",position:{x:10,y:430,w:300,h:100}},{item:"viz_jZvxgMTX",type:"block",position:{x:30,y:410,w:220,h:40}},{item:"viz_nighFxKS",type:"block",position:{x:20,y:570,w:140,h:160}},{item:"viz_Q8GGnYDE",type:"block",position:{x:140,y:610,w:150,h:80}},{item:"viz_7NTJmera",type:"block",position:{x:170,y:670,w:100,h:40}},{item:"viz_wsjKuTjw",type:"block",position:{x:40,y:290,w:120,h:70}},{item:"viz_Jw4VQedJ",type:"block",position:{x:210,y:285,w:80,h:25}},{item:"viz_ztfGP9CJ",type:"block",position:{x:210,y:312,w:80,h:25}},{item:"viz_x2VCukpa",type:"block",position:{x:210,y:338,w:80,h:25}},{item:"viz_dafLSdNq",type:"block",position:{x:1240,y:40,w:170,h:50}},{item:"viz_6pVblUuP",type:"block",position:{x:1050,y:40,w:170,h:50}},{item:"viz_8bLuDcI5",type:"block",position:{x:40,y:790,w:660,h:40}},{item:"viz_bLw12Iow",type:"block",position:{x:50,y:820,w:110,h:110}},{item:"viz_WeWzlq9m",type:"block",position:{x:400,y:820,w:110,h:110}},{item:"viz_Zl7vLviO",type:"block",position:{x:190,y:830,w:150,h:90}},{item:"viz_iUKyyFVQ",type:"block",position:{x:540,y:830,w:150,h:90}},{item:"viz_3NNz4UdC",type:"block",position:{x:40,y:80,w:300,h:40}},{item:"viz_7Al913YU",type:"block",position:{x:30,y:980,w:1380,h:390}}]}},globalInputs:[],options:{showTitleAndDescription:!1}}};var t=s(a());var o="Employee Device Security";e(t.default.createElement(n,{definition:i,isCompleteDashboard:!0,dashboardTitle:o}),{pageTitle:o,hideFooter:!0,layout:"fixed"});
