/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as o}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as i}from"../chunks/chunk-REK4W3C7.js";import{h as r}from"../chunks/chunk-JHLB3KMN.js";var t={visualizations:{viz_plMGxiGT:{type:"splunk.rectangle",options:{strokeColor:"transparent",rx:4,fillColor:"#1E2024"}},viz_HfLGNISy:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/buttercup/Buttercup1.png"}},viz_7ohYMJTC:{type:"splunk.markdown",options:{markdown:"## **Horse power**",fontSize:"large"}},viz_2U95Heag:{type:"splunk.markdown",options:{markdown:`**Games** **played**
`,fontSize:"large"}},viz_SOdx5PzH:{type:"splunk.markdown",options:{markdown:"**Attacks**",fontSize:"large"}},viz_5dBJe8NK:{type:"splunk.table",options:{backgroundColor:"transparent",tableFormat:{rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",headerBackgroundColor:"> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",rowColors:"> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",headerColor:"> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"}},dataSources:{primary:"ds_vcjpgts0"},showProgressBar:!1,showLastUpdated:!1,hideWhenNoData:!1},viz_iDjdxucw:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",majorFontSize:24,majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('Horse Power')"},dataSources:{primary:"ds_AJIGR931"}},viz_516AHZ2I:{type:"splunk.markdown",options:{markdown:`**Win** **ratio**
`,fontSize:"large"}},viz_n7rG67CK:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"transparent",value:"> primary | seriesByName('Horse Power') | lastPoint()"},dataSources:{primary:"ds_kDIqCTwc"}},viz_1rna4mc8:{type:"splunk.line",dataSources:{primary:"ds_kDIqCTwc"},title:"Win ratio over time",options:{backgroundColor:"#1E2024",y:"> primary | frameBySeriesNames('Britney Spurs','Harry Trotter','Horse Power','Long Face','Maple Stirrup')",xAxisTitleVisibility:"hide",legendDisplay:"bottom",xAxisMaxLabelParts:1}},viz_JYA6fQ7C:{type:"splunk.pie",dataSources:{primary:"ds_uSizcRzj"},title:"Most popular attacks",options:{backgroundColor:"#1E2024"}},viz_p41dTSTo:{type:"splunk.pie",dataSources:{primary:"ds_uSizcRzj"},title:"Most powerful attacks",options:{backgroundColor:"#1E2024",label:"> primary | seriesByName('attack')",value:"> primary | seriesByName('sum(attack_multiplier)')"}},viz_QdhPwWR5:{type:"splunk.rectangle",options:{strokeColor:"transparent",rx:4,fillColor:"#1E2024"}},viz_DwAzg1YF:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/buttercup/Buttercup2.png"}},viz_sJRVmn4g:{type:"splunk.markdown",options:{markdown:"## **Britney Spurs**",fontSize:"large"}},viz_DahbQdYC:{type:"splunk.markdown",options:{markdown:`**Games** **played**
`,fontSize:"large"}},viz_36Sb6gJO:{type:"splunk.markdown",options:{markdown:"**Attacks**",fontSize:"large"}},viz_bqCxMHnV:{type:"splunk.table",options:{backgroundColor:"transparent",tableFormat:{rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",headerBackgroundColor:"> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",rowColors:"> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",headerColor:"> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"}},dataSources:{primary:"ds_SDnKVAT8"},showProgressBar:!1,showLastUpdated:!1,hideWhenNoData:!1},viz_WiCNLh0I:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",majorFontSize:24},dataSources:{primary:"ds_AJIGR931"}},viz_4NPFUydG:{type:"splunk.markdown",options:{markdown:`**Win** **ratio**
`,fontSize:"large"}},viz_sIlHhuYK:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"transparent"},dataSources:{primary:"ds_kDIqCTwc"}},viz_JMuFFBVh:{type:"splunk.rectangle",options:{strokeColor:"transparent",rx:4,fillColor:"#1E2024"}},viz_3KOabWdm:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/buttercup/Buttercup3.png"}},viz_zZVQB1IS:{type:"splunk.markdown",options:{markdown:"## **Harry Trotter**",fontSize:"large"}},viz_EsOGWoBv:{type:"splunk.markdown",options:{markdown:`**Games** **played**
`,fontSize:"large"}},viz_CCPRGg86:{type:"splunk.markdown",options:{markdown:"**Attacks**",fontSize:"large"}},viz_IRa3szOu:{type:"splunk.table",options:{backgroundColor:"transparent",tableFormat:{rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",headerBackgroundColor:"> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",rowColors:"> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",headerColor:"> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"},columnFormat:{count:{width:119}}},dataSources:{primary:"ds_bU7zaSz2"},showProgressBar:!1,showLastUpdated:!1,hideWhenNoData:!1},viz_u19ujIYY:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",majorFontSize:24,majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('Harry Trotter')"},dataSources:{primary:"ds_AJIGR931"}},viz_tUPYRnLK:{type:"splunk.markdown",options:{markdown:`**Win** **ratio**
`,fontSize:"large"}},viz_9tbkN7Rk:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"transparent",value:"> primary | seriesByName('Harry Trotter') | lastPoint()"},dataSources:{primary:"ds_kDIqCTwc"}},viz_hm75CBIr:{type:"splunk.rectangle",options:{strokeColor:"transparent",rx:4,fillColor:"#1E2024"}},viz_b3Pca4t9:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/buttercup/Buttercup4.png"}},viz_XWDekFt7:{type:"splunk.markdown",options:{markdown:"## **Long Face**",fontSize:"large"}},viz_4zHu5DLM:{type:"splunk.markdown",options:{markdown:`**Games** **played**
`,fontSize:"large"}},viz_kmGYI0TJ:{type:"splunk.markdown",options:{markdown:"**Attacks**",fontSize:"large"}},viz_mbt6vbtD:{type:"splunk.table",options:{backgroundColor:"transparent",tableFormat:{rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",headerBackgroundColor:"> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",rowColors:"> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",headerColor:"> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"}},dataSources:{primary:"ds_Oa7HW3X1"},showProgressBar:!1,showLastUpdated:!1,hideWhenNoData:!1},viz_kw9g3dD1:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",majorFontSize:24,majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('Long Face')"},dataSources:{primary:"ds_AJIGR931"}},viz_2X7Q7rNk:{type:"splunk.markdown",options:{markdown:`**Win** **ratio**
`,fontSize:"large"}},viz_3tLvSynE:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"transparent",value:"> primary | seriesByName('Long Face') | lastPoint()"},dataSources:{primary:"ds_kDIqCTwc"}},viz_mYTWwy7Q:{type:"splunk.rectangle",options:{strokeColor:"transparent",rx:4,fillColor:"#1E2024"}},viz_N2GRF5FB:{type:"splunk.image",options:{preserveAspectRatio:!0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/buttercup/Buttercup5.png"}},viz_RBnjzwKQ:{type:"splunk.markdown",options:{markdown:"## **Maple Stirrup**",fontSize:"large"}},viz_3JvJdTHR:{type:"splunk.markdown",options:{markdown:`**Games** **played**
`,fontSize:"large"}},viz_T6uwXbHz:{type:"splunk.markdown",options:{markdown:"**Attacks**",fontSize:"large"}},viz_pCe9uvuQ:{type:"splunk.table",options:{backgroundColor:"transparent",tableFormat:{rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",headerBackgroundColor:"> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",rowColors:"> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",headerColor:"> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"}},dataSources:{primary:"ds_pLWyiO3r"},showProgressBar:!1,showLastUpdated:!1,hideWhenNoData:!1},viz_znlJaTRx:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",majorFontSize:24,majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('Maple Stirrup')"},dataSources:{primary:"ds_AJIGR931"}},viz_tuQJicgZ:{type:"splunk.markdown",options:{markdown:`**Win** **ratio**
`,fontSize:"large"}},viz_O5YGoiYs:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"transparent",value:"> primary | seriesByName('Maple Stirrup') | lastPoint()"},dataSources:{primary:"ds_kDIqCTwc"}},viz_lulVo93B:{type:"splunk.markdown",options:{markdown:"# **Buttercup Battle Top Players**"}},viz_10GUc8NF:{type:"splunk.markdown",options:{markdown:`## Full Source

\`\`\`json
{
  "visualizations": {
    "viz_plMGxiGT": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "rx": 4,
        "fillColor": "#1E2024"
      }
    },
    "viz_HfLGNISy": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/buttercup/Buttercup1.png"
      }
    },
    "viz_7ohYMJTC": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## **Horse power**",
        "fontSize": "large"
      }
    },
    "viz_2U95Heag": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Games** **played**\\n",
        "fontSize": "large"
      }
    },
    "viz_SOdx5PzH": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Attacks**",
        "fontSize": "large"
      }
    },
    "viz_5dBJe8NK": {
      "type": "splunk.table",
      "options": {
        "backgroundColor": "transparent",
        "tableFormat": {
          "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",
          "headerBackgroundColor": "> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",
          "rowColors": "> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",
          "headerColor": "> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"
        }
      },
      "dataSources": {
        "primary": "ds_vcjpgts0"
      },
      "showProgressBar": false,
      "showLastUpdated": false,
      "hideWhenNoData": false
    },
    "viz_iDjdxucw": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "majorFontSize": 24,
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('Horse Power')"
      },
      "dataSources": {
        "primary": "ds_AJIGR931"
      }
    },
    "viz_516AHZ2I": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Win** **ratio**\\n",
        "fontSize": "large"
      }
    },
    "viz_n7rG67CK": {
      "type": "splunk.markergauge",
      "options": {
        "orientation": "horizontal",
        "backgroundColor": "transparent",
        "value": "> primary | seriesByName('Horse Power') | lastPoint()"
      },
      "dataSources": {
        "primary": "ds_kDIqCTwc"
      }
    },
    "viz_1rna4mc8": {
      "type": "splunk.line",
      "dataSources": {
        "primary": "ds_kDIqCTwc"
      },
      "title": "Win ratio over time",
      "options": {
        "backgroundColor": "#1E2024",
        "y": "> primary | frameBySeriesNames('Britney Spurs','Harry Trotter','Horse Power','Long Face','Maple Stirrup')",
        "xAxisTitleVisibility": "hide",
        "legendDisplay": "bottom",
        "xAxisMaxLabelParts": 1
      }
    },
    "viz_JYA6fQ7C": {
      "type": "splunk.pie",
      "dataSources": {
        "primary": "ds_uSizcRzj"
      },
      "title": "Most popular attacks",
      "options": {
        "backgroundColor": "#1E2024"
      }
    },
    "viz_p41dTSTo": {
      "type": "splunk.pie",
      "dataSources": {
        "primary": "ds_uSizcRzj"
      },
      "title": "Most powerful attacks",
      "options": {
        "backgroundColor": "#1E2024",
        "label": "> primary | seriesByName('attack')",
        "value": "> primary | seriesByName('sum(attack_multiplier)')"
      }
    },
    "viz_QdhPwWR5": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "rx": 4,
        "fillColor": "#1E2024"
      }
    },
    "viz_DwAzg1YF": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/buttercup/Buttercup2.png"
      }
    },
    "viz_sJRVmn4g": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## **Britney Spurs**",
        "fontSize": "large"
      }
    },
    "viz_DahbQdYC": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Games** **played**\\n",
        "fontSize": "large"
      }
    },
    "viz_36Sb6gJO": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Attacks**",
        "fontSize": "large"
      }
    },
    "viz_bqCxMHnV": {
      "type": "splunk.table",
      "options": {
        "backgroundColor": "transparent",
        "tableFormat": {
          "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",
          "headerBackgroundColor": "> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",
          "rowColors": "> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",
          "headerColor": "> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"
        }
      },
      "dataSources": {
        "primary": "ds_SDnKVAT8"
      },
      "showProgressBar": false,
      "showLastUpdated": false,
      "hideWhenNoData": false
    },
    "viz_WiCNLh0I": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "majorFontSize": 24
      },
      "dataSources": {
        "primary": "ds_AJIGR931"
      }
    },
    "viz_4NPFUydG": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Win** **ratio**\\n",
        "fontSize": "large"
      }
    },
    "viz_sIlHhuYK": {
      "type": "splunk.markergauge",
      "options": {
        "orientation": "horizontal",
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_kDIqCTwc"
      }
    },
    "viz_JMuFFBVh": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "rx": 4,
        "fillColor": "#1E2024"
      }
    },
    "viz_3KOabWdm": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/buttercup/Buttercup3.png"
      }
    },
    "viz_zZVQB1IS": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## **Harry Trotter**",
        "fontSize": "large"
      }
    },
    "viz_EsOGWoBv": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Games** **played**\\n",
        "fontSize": "large"
      }
    },
    "viz_CCPRGg86": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Attacks**",
        "fontSize": "large"
      }
    },
    "viz_IRa3szOu": {
      "type": "splunk.table",
      "options": {
        "backgroundColor": "transparent",
        "tableFormat": {
          "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",
          "headerBackgroundColor": "> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",
          "rowColors": "> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",
          "headerColor": "> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"
        },
        "columnFormat": {
          "count": {
            "width": 119
          }
        }
      },
      "dataSources": {
        "primary": "ds_bU7zaSz2"
      },
      "showProgressBar": false,
      "showLastUpdated": false,
      "hideWhenNoData": false
    },
    "viz_u19ujIYY": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "majorFontSize": 24,
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('Harry Trotter')"
      },
      "dataSources": {
        "primary": "ds_AJIGR931"
      }
    },
    "viz_tUPYRnLK": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Win** **ratio**\\n",
        "fontSize": "large"
      }
    },
    "viz_9tbkN7Rk": {
      "type": "splunk.markergauge",
      "options": {
        "orientation": "horizontal",
        "backgroundColor": "transparent",
        "value": "> primary | seriesByName('Harry Trotter') | lastPoint()"
      },
      "dataSources": {
        "primary": "ds_kDIqCTwc"
      }
    },
    "viz_hm75CBIr": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "rx": 4,
        "fillColor": "#1E2024"
      }
    },
    "viz_b3Pca4t9": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/buttercup/Buttercup4.png"
      }
    },
    "viz_XWDekFt7": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## **Long Face**",
        "fontSize": "large"
      }
    },
    "viz_4zHu5DLM": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Games** **played**\\n",
        "fontSize": "large"
      }
    },
    "viz_kmGYI0TJ": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Attacks**",
        "fontSize": "large"
      }
    },
    "viz_mbt6vbtD": {
      "type": "splunk.table",
      "options": {
        "backgroundColor": "transparent",
        "tableFormat": {
          "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",
          "headerBackgroundColor": "> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",
          "rowColors": "> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",
          "headerColor": "> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"
        }
      },
      "dataSources": {
        "primary": "ds_Oa7HW3X1"
      },
      "showProgressBar": false,
      "showLastUpdated": false,
      "hideWhenNoData": false
    },
    "viz_kw9g3dD1": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "majorFontSize": 24,
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('Long Face')"
      },
      "dataSources": {
        "primary": "ds_AJIGR931"
      }
    },
    "viz_2X7Q7rNk": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Win** **ratio**\\n",
        "fontSize": "large"
      }
    },
    "viz_3tLvSynE": {
      "type": "splunk.markergauge",
      "options": {
        "orientation": "horizontal",
        "backgroundColor": "transparent",
        "value": "> primary | seriesByName('Long Face') | lastPoint()"
      },
      "dataSources": {
        "primary": "ds_kDIqCTwc"
      }
    },
    "viz_mYTWwy7Q": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "rx": 4,
        "fillColor": "#1E2024"
      }
    },
    "viz_N2GRF5FB": {
      "type": "splunk.image",
      "options": {
        "preserveAspectRatio": true,
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/buttercup/Buttercup5.png"
      }
    },
    "viz_RBnjzwKQ": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## **Maple Stirrup**",
        "fontSize": "large"
      }
    },
    "viz_3JvJdTHR": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Games** **played**\\n",
        "fontSize": "large"
      }
    },
    "viz_T6uwXbHz": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Attacks**",
        "fontSize": "large"
      }
    },
    "viz_pCe9uvuQ": {
      "type": "splunk.table",
      "options": {
        "backgroundColor": "transparent",
        "tableFormat": {
          "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableAltRowBackgroundColorsByBackgroundColor)",
          "headerBackgroundColor": "> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",
          "rowColors": "> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",
          "headerColor": "> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)"
        }
      },
      "dataSources": {
        "primary": "ds_pLWyiO3r"
      },
      "showProgressBar": false,
      "showLastUpdated": false,
      "hideWhenNoData": false
    },
    "viz_znlJaTRx": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "majorFontSize": 24,
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('Maple Stirrup')"
      },
      "dataSources": {
        "primary": "ds_AJIGR931"
      }
    },
    "viz_tuQJicgZ": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Win** **ratio**\\n",
        "fontSize": "large"
      }
    },
    "viz_O5YGoiYs": {
      "type": "splunk.markergauge",
      "options": {
        "orientation": "horizontal",
        "backgroundColor": "transparent",
        "value": "> primary | seriesByName('Maple Stirrup') | lastPoint()"
      },
      "dataSources": {
        "primary": "ds_kDIqCTwc"
      }
    },
    "viz_lulVo93B": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# **Buttercup Battle Top Players**"
      }
    }
  },
  "dataSources": {
    "ds_iLJVdkew_ds_c5F41RTk": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup examples.csv | fields attack attack_multiplier buttercup_name attack_count wins losses \\n| streamstats count | eval _time=now()-count*3600, total_games=wins+losses, win_ratio=wins/total_games*100 ",
        "queryParameters": {}
      },
      "name": "Buttercup games base search"
    },
    "ds_kDIqCTwc": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_iLJVdkew_ds_c5F41RTk",
        "query": "| timechart sum(win_ratio) by buttercup_name\\n| eval \\"Britney Spurs\\"=random()%100, \\"Harry Trotter\\"=random()%100 , \\"Horse Power\\"=random()%100, \\"Long Face\\"=random()%100, \\"Maple Stirrup\\"=random()%100, \\"Night Mare\\"=random()%100, \\"Post Stallione\\"=random()%100"
      },
      "name": "Win ratios"
    },
    "ds_AJIGR931": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_iLJVdkew_ds_c5F41RTk",
        "query": "| timechart sum(total_games) by buttercup_name\\n| eval \\"Britney Spurs\\"=random()%100, \\"Harry Trotter\\"=random()%100 , \\"Horse Power\\"=random()%100, \\"Long Face\\"=random()%100, \\"Maple Stirrup\\"=random()%100, \\"Night Mare\\"=random()%100, \\"Post Stallione\\"=random()%100"
      },
      "name": "Games played"
    },
    "ds_uSizcRzj": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_iLJVdkew_ds_c5F41RTk",
        "query": "| stats sum(attack_count) sum(attack_multiplier) by attack"
      },
      "name": "Attacks"
    },
    "ds_485TPqqo": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup examples.csv | fields attack attack_multiplier buttercup_name attack_count wins losses \\n| fields attack attack_count buttercup_name",
        "queryParameters": {}
      },
      "name": "Attacks base search"
    },
    "ds_vcjpgts0": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_485TPqqo",
        "query": "| search buttercup_name=\\"Horse Power\\"\\n| fields - buttercup_name\\n| rename attack as Attack, attack_count as Count"
      },
      "name": "Horse Power"
    },
    "ds_SDnKVAT8": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_485TPqqo",
        "query": "| search buttercup_name=\\"Britney Spurs\\"\\n| fields - buttercup_name\\n| rename attack as Attack, attack_count as Count"
      },
      "name": "Britney Spurs"
    },
    "ds_bU7zaSz2": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_485TPqqo",
        "query": "| search buttercup_name=\\"Harry Trotter\\"\\n| fields - buttercup_name\\n| rename attack as Attack, attack_count as Count"
      },
      "name": "Harry Trotter"
    },
    "ds_Oa7HW3X1": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_485TPqqo",
        "query": "| search buttercup_name=\\"Long Face\\"\\n| fields - buttercup_name\\n| rename attack as Attack, attack_count as Count"
      },
      "name": "Long Face"
    },
    "ds_pLWyiO3r": {
      "type": "ds.chain",
      "options": {
        "extend": "ds_485TPqqo",
        "query": "| search buttercup_name=\\"Maple Stirrup\\"\\n| fields - buttercup_name\\n| rename attack as Attack, attack_count as Count"
      },
      "name": "Maple Stirrup"
    }
  },
  "defaults": {
    "dataSources": {
      "ds.search": {
        "options": {
          "queryParameters": {
            "latest": "$$global_time.latest$$",
            "earliest": "$$global_time.earliest$$"
          }
        }
      }
    }
  },
  "inputs": {
    "input_2C9QRUtH": {
      "options": {
        "defaultValue": "-24h@h,now",
        "token": "global_time"
      },
      "title": "Global Time Range",
      "type": "input.timerange"
    }
  },
  "description": "",
  "title": "Buttercup Battle Top Players",
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
          "width": 1430,
          "height": 960,
          "display": "auto",
          "backgroundColor": "#111215"
        },
        "structure": [
          {
            "item": "viz_plMGxiGT",
            "type": "block",
            "position": {
              "x": 20,
              "y": 200,
              "w": 260,
              "h": 540
            }
          },
          {
            "item": "viz_HfLGNISy",
            "type": "block",
            "position": {
              "x": 90,
              "y": 10,
              "w": 120,
              "h": 300
            }
          },
          {
            "item": "viz_7ohYMJTC",
            "type": "block",
            "position": {
              "x": 30,
              "y": 260,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_2U95Heag",
            "type": "block",
            "position": {
              "x": 30,
              "y": 310,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_SOdx5PzH",
            "type": "block",
            "position": {
              "x": 30,
              "y": 550,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_5dBJe8NK",
            "type": "block",
            "position": {
              "x": 20,
              "y": 570,
              "w": 260,
              "h": 180
            }
          },
          {
            "item": "viz_iDjdxucw",
            "type": "block",
            "position": {
              "x": 40,
              "y": 340,
              "w": 220,
              "h": 60
            }
          },
          {
            "item": "viz_516AHZ2I",
            "type": "block",
            "position": {
              "x": 30,
              "y": 410,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_n7rG67CK",
            "type": "block",
            "position": {
              "x": 20,
              "y": 420,
              "w": 260,
              "h": 110
            }
          },
          {
            "item": "viz_1rna4mc8",
            "type": "block",
            "position": {
              "x": 20,
              "y": 760,
              "w": 680,
              "h": 180
            }
          },
          {
            "item": "viz_JYA6fQ7C",
            "type": "block",
            "position": {
              "x": 720,
              "y": 760,
              "w": 340,
              "h": 180
            }
          },
          {
            "item": "viz_p41dTSTo",
            "type": "block",
            "position": {
              "x": 1080,
              "y": 760,
              "w": 330,
              "h": 180
            }
          },
          {
            "item": "viz_QdhPwWR5",
            "type": "block",
            "position": {
              "x": 310,
              "y": 200,
              "w": 260,
              "h": 540
            }
          },
          {
            "item": "viz_DwAzg1YF",
            "type": "block",
            "position": {
              "x": 380,
              "y": 10,
              "w": 120,
              "h": 300
            }
          },
          {
            "item": "viz_sJRVmn4g",
            "type": "block",
            "position": {
              "x": 320,
              "y": 260,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_DahbQdYC",
            "type": "block",
            "position": {
              "x": 320,
              "y": 310,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_36Sb6gJO",
            "type": "block",
            "position": {
              "x": 320,
              "y": 550,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_bqCxMHnV",
            "type": "block",
            "position": {
              "x": 310,
              "y": 570,
              "w": 260,
              "h": 180
            }
          },
          {
            "item": "viz_WiCNLh0I",
            "type": "block",
            "position": {
              "x": 330,
              "y": 340,
              "w": 220,
              "h": 60
            }
          },
          {
            "item": "viz_4NPFUydG",
            "type": "block",
            "position": {
              "x": 320,
              "y": 410,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_sIlHhuYK",
            "type": "block",
            "position": {
              "x": 310,
              "y": 420,
              "w": 260,
              "h": 110
            }
          },
          {
            "item": "viz_JMuFFBVh",
            "type": "block",
            "position": {
              "x": 590,
              "y": 200,
              "w": 260,
              "h": 540
            }
          },
          {
            "item": "viz_3KOabWdm",
            "type": "block",
            "position": {
              "x": 660,
              "y": 10,
              "w": 120,
              "h": 300
            }
          },
          {
            "item": "viz_zZVQB1IS",
            "type": "block",
            "position": {
              "x": 600,
              "y": 260,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_EsOGWoBv",
            "type": "block",
            "position": {
              "x": 600,
              "y": 310,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_CCPRGg86",
            "type": "block",
            "position": {
              "x": 600,
              "y": 550,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_IRa3szOu",
            "type": "block",
            "position": {
              "x": 590,
              "y": 570,
              "w": 260,
              "h": 180
            }
          },
          {
            "item": "viz_u19ujIYY",
            "type": "block",
            "position": {
              "x": 610,
              "y": 340,
              "w": 220,
              "h": 60
            }
          },
          {
            "item": "viz_tUPYRnLK",
            "type": "block",
            "position": {
              "x": 600,
              "y": 410,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_9tbkN7Rk",
            "type": "block",
            "position": {
              "x": 590,
              "y": 420,
              "w": 260,
              "h": 110
            }
          },
          {
            "item": "viz_hm75CBIr",
            "type": "block",
            "position": {
              "x": 870,
              "y": 200,
              "w": 260,
              "h": 540
            }
          },
          {
            "item": "viz_b3Pca4t9",
            "type": "block",
            "position": {
              "x": 940,
              "y": 10,
              "w": 120,
              "h": 300
            }
          },
          {
            "item": "viz_XWDekFt7",
            "type": "block",
            "position": {
              "x": 880,
              "y": 260,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_4zHu5DLM",
            "type": "block",
            "position": {
              "x": 880,
              "y": 310,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_kmGYI0TJ",
            "type": "block",
            "position": {
              "x": 880,
              "y": 550,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_mbt6vbtD",
            "type": "block",
            "position": {
              "x": 870,
              "y": 570,
              "w": 260,
              "h": 180
            }
          },
          {
            "item": "viz_kw9g3dD1",
            "type": "block",
            "position": {
              "x": 890,
              "y": 340,
              "w": 220,
              "h": 60
            }
          },
          {
            "item": "viz_2X7Q7rNk",
            "type": "block",
            "position": {
              "x": 880,
              "y": 410,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_3tLvSynE",
            "type": "block",
            "position": {
              "x": 870,
              "y": 420,
              "w": 260,
              "h": 110
            }
          },
          {
            "item": "viz_mYTWwy7Q",
            "type": "block",
            "position": {
              "x": 1150,
              "y": 200,
              "w": 260,
              "h": 540
            }
          },
          {
            "item": "viz_N2GRF5FB",
            "type": "block",
            "position": {
              "x": 1220,
              "y": 10,
              "w": 120,
              "h": 300
            }
          },
          {
            "item": "viz_RBnjzwKQ",
            "type": "block",
            "position": {
              "x": 1160,
              "y": 260,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_3JvJdTHR",
            "type": "block",
            "position": {
              "x": 1160,
              "y": 310,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_T6uwXbHz",
            "type": "block",
            "position": {
              "x": 1160,
              "y": 550,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_pCe9uvuQ",
            "type": "block",
            "position": {
              "x": 1150,
              "y": 570,
              "w": 260,
              "h": 180
            }
          },
          {
            "item": "viz_znlJaTRx",
            "type": "block",
            "position": {
              "x": 1170,
              "y": 340,
              "w": 220,
              "h": 60
            }
          },
          {
            "item": "viz_tuQJicgZ",
            "type": "block",
            "position": {
              "x": 1160,
              "y": 410,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_O5YGoiYs",
            "type": "block",
            "position": {
              "x": 1150,
              "y": 420,
              "w": 260,
              "h": 110
            }
          },
          {
            "item": "viz_lulVo93B",
            "type": "block",
            "position": {
              "x": 20,
              "y": 10,
              "w": 470,
              "h": 40
            }
          }
        ]
      }
    },
    "globalInputs": [
      "input_2C9QRUtH"
    ],
    "options": {
      "showTitleAndDescription": false
    }
  }
}
\`\`\``}}},dataSources:{ds_iLJVdkew_ds_c5F41RTk:{type:"ds.search",options:{query:`| inputlookup examples.csv | fields attack attack_multiplier buttercup_name attack_count wins losses 
| streamstats count | eval _time=now()-count*3600, total_games=wins+losses, win_ratio=wins/total_games*100 `,queryParameters:{}},name:"Buttercup games base search"},ds_kDIqCTwc:{type:"ds.chain",options:{extend:"ds_iLJVdkew_ds_c5F41RTk",query:`| timechart sum(win_ratio) by buttercup_name
| eval "Britney Spurs"=random()%100, "Harry Trotter"=random()%100 , "Horse Power"=random()%100, "Long Face"=random()%100, "Maple Stirrup"=random()%100, "Night Mare"=random()%100, "Post Stallione"=random()%100`},name:"Win ratios"},ds_AJIGR931:{type:"ds.chain",options:{extend:"ds_iLJVdkew_ds_c5F41RTk",query:`| timechart sum(total_games) by buttercup_name
| eval "Britney Spurs"=random()%100, "Harry Trotter"=random()%100 , "Horse Power"=random()%100, "Long Face"=random()%100, "Maple Stirrup"=random()%100, "Night Mare"=random()%100, "Post Stallione"=random()%100`},name:"Games played"},ds_uSizcRzj:{type:"ds.chain",options:{extend:"ds_iLJVdkew_ds_c5F41RTk",query:"| stats sum(attack_count) sum(attack_multiplier) by attack"},name:"Attacks"},ds_485TPqqo:{type:"ds.search",options:{query:`| inputlookup examples.csv | fields attack attack_multiplier buttercup_name attack_count wins losses 
| fields attack attack_count buttercup_name`,queryParameters:{}},name:"Attacks base search"},ds_vcjpgts0:{type:"ds.chain",options:{extend:"ds_485TPqqo",query:`| search buttercup_name="Horse Power"
| fields - buttercup_name
| rename attack as Attack, attack_count as Count`},name:"Horse Power"},ds_SDnKVAT8:{type:"ds.chain",options:{extend:"ds_485TPqqo",query:`| search buttercup_name="Britney Spurs"
| fields - buttercup_name
| rename attack as Attack, attack_count as Count`},name:"Britney Spurs"},ds_bU7zaSz2:{type:"ds.chain",options:{extend:"ds_485TPqqo",query:`| search buttercup_name="Harry Trotter"
| fields - buttercup_name
| rename attack as Attack, attack_count as Count`},name:"Harry Trotter"},ds_Oa7HW3X1:{type:"ds.chain",options:{extend:"ds_485TPqqo",query:`| search buttercup_name="Long Face"
| fields - buttercup_name
| rename attack as Attack, attack_count as Count`},name:"Long Face"},ds_pLWyiO3r:{type:"ds.chain",options:{extend:"ds_485TPqqo",query:`| search buttercup_name="Maple Stirrup"
| fields - buttercup_name
| rename attack as Attack, attack_count as Count`},name:"Maple Stirrup"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_2C9QRUtH:{options:{defaultValue:"-24h@h,now",token:"global_time"},title:"Global Time Range",type:"input.timerange"}},description:"",title:"",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"absolute",options:{width:1430,height:1350,display:"auto",backgroundColor:"#111215"},structure:[{item:"viz_plMGxiGT",type:"block",position:{x:20,y:200,w:260,h:540}},{item:"viz_HfLGNISy",type:"block",position:{x:90,y:10,w:120,h:300}},{item:"viz_7ohYMJTC",type:"block",position:{x:30,y:260,w:210,h:50}},{item:"viz_2U95Heag",type:"block",position:{x:30,y:310,w:210,h:50}},{item:"viz_SOdx5PzH",type:"block",position:{x:30,y:550,w:210,h:50}},{item:"viz_5dBJe8NK",type:"block",position:{x:20,y:570,w:260,h:180}},{item:"viz_iDjdxucw",type:"block",position:{x:40,y:340,w:220,h:60}},{item:"viz_516AHZ2I",type:"block",position:{x:30,y:410,w:210,h:50}},{item:"viz_n7rG67CK",type:"block",position:{x:20,y:420,w:260,h:110}},{item:"viz_1rna4mc8",type:"block",position:{x:20,y:760,w:680,h:180}},{item:"viz_JYA6fQ7C",type:"block",position:{x:720,y:760,w:340,h:180}},{item:"viz_p41dTSTo",type:"block",position:{x:1080,y:760,w:330,h:180}},{item:"viz_QdhPwWR5",type:"block",position:{x:310,y:200,w:260,h:540}},{item:"viz_DwAzg1YF",type:"block",position:{x:380,y:10,w:120,h:300}},{item:"viz_sJRVmn4g",type:"block",position:{x:320,y:260,w:210,h:50}},{item:"viz_DahbQdYC",type:"block",position:{x:320,y:310,w:210,h:50}},{item:"viz_36Sb6gJO",type:"block",position:{x:320,y:550,w:210,h:50}},{item:"viz_bqCxMHnV",type:"block",position:{x:310,y:570,w:260,h:180}},{item:"viz_WiCNLh0I",type:"block",position:{x:330,y:340,w:220,h:60}},{item:"viz_4NPFUydG",type:"block",position:{x:320,y:410,w:210,h:50}},{item:"viz_sIlHhuYK",type:"block",position:{x:310,y:420,w:260,h:110}},{item:"viz_JMuFFBVh",type:"block",position:{x:590,y:200,w:260,h:540}},{item:"viz_3KOabWdm",type:"block",position:{x:660,y:10,w:120,h:300}},{item:"viz_zZVQB1IS",type:"block",position:{x:600,y:260,w:210,h:50}},{item:"viz_EsOGWoBv",type:"block",position:{x:600,y:310,w:210,h:50}},{item:"viz_CCPRGg86",type:"block",position:{x:600,y:550,w:210,h:50}},{item:"viz_IRa3szOu",type:"block",position:{x:590,y:570,w:260,h:180}},{item:"viz_u19ujIYY",type:"block",position:{x:610,y:340,w:220,h:60}},{item:"viz_tUPYRnLK",type:"block",position:{x:600,y:410,w:210,h:50}},{item:"viz_9tbkN7Rk",type:"block",position:{x:590,y:420,w:260,h:110}},{item:"viz_hm75CBIr",type:"block",position:{x:870,y:200,w:260,h:540}},{item:"viz_b3Pca4t9",type:"block",position:{x:940,y:10,w:120,h:300}},{item:"viz_XWDekFt7",type:"block",position:{x:880,y:260,w:210,h:50}},{item:"viz_4zHu5DLM",type:"block",position:{x:880,y:310,w:210,h:50}},{item:"viz_kmGYI0TJ",type:"block",position:{x:880,y:550,w:210,h:50}},{item:"viz_mbt6vbtD",type:"block",position:{x:870,y:570,w:260,h:180}},{item:"viz_kw9g3dD1",type:"block",position:{x:890,y:340,w:220,h:60}},{item:"viz_2X7Q7rNk",type:"block",position:{x:880,y:410,w:210,h:50}},{item:"viz_3tLvSynE",type:"block",position:{x:870,y:420,w:260,h:110}},{item:"viz_mYTWwy7Q",type:"block",position:{x:1150,y:200,w:260,h:540}},{item:"viz_N2GRF5FB",type:"block",position:{x:1220,y:10,w:120,h:300}},{item:"viz_RBnjzwKQ",type:"block",position:{x:1160,y:260,w:210,h:50}},{item:"viz_3JvJdTHR",type:"block",position:{x:1160,y:310,w:210,h:50}},{item:"viz_T6uwXbHz",type:"block",position:{x:1160,y:550,w:210,h:50}},{item:"viz_pCe9uvuQ",type:"block",position:{x:1150,y:570,w:260,h:180}},{item:"viz_znlJaTRx",type:"block",position:{x:1170,y:340,w:220,h:60}},{item:"viz_tuQJicgZ",type:"block",position:{x:1160,y:410,w:210,h:50}},{item:"viz_O5YGoiYs",type:"block",position:{x:1150,y:420,w:260,h:110}},{item:"viz_lulVo93B",type:"block",position:{x:20,y:10,w:470,h:40}},{item:"viz_10GUc8NF",type:"block",position:{x:15,y:950,w:1395,h:380}}]}},globalInputs:["input_2C9QRUtH"],options:{showTitleAndDescription:!1}}};var a=r(i());var e="Buttercup Battle Top Players";o(a.default.createElement(n,{definition:t,isCompleteDashboard:!0,dashboardTitle:e}),{pageTitle:e,hideFooter:!0,layout:"fixed"});
