/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var t={visualizations:{viz_2dtEyoSf:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"#15161A",value:"> primary | seriesByName('performance') | lastPoint()"},dataSources:{primary:"ds_lLMVXz2S"},title:"",showProgressBar:!1,showLastUpdated:!1,hideWhenNoData:!1},viz_3jMwoVYB:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"#15161A"},dataSources:{primary:"ds_lLMVXz2S"},title:"",showProgressBar:!1,showLastUpdated:!1,hideWhenNoData:!1},viz_j1y5TVIW:{type:"splunk.markergauge",options:{orientation:"horizontal",backgroundColor:"#15161A"},dataSources:{primary:"ds_slxMrH1H_ds_hoDXmuAz_ds_FW49rAx7"},title:"",showProgressBar:!1,showLastUpdated:!1,hideWhenNoData:!1},viz_fAqdgAnD:{type:"splunk.punchcard",title:"Activity",options:{backgroundColor:"#15161A"},dataSources:{primary:"ds_zh1XRYil"}},viz_uzUManc3:{type:"splunk.markdown",options:{markdown:"**Availability**",fontSize:"large"}},viz_f5Rn9XlO:{type:"splunk.markdown",options:{markdown:"**2xx**",fontSize:"extraLarge"}},viz_nZ1B5gBf:{type:"splunk.markdown",options:{markdown:"**Active users**",fontSize:"large"}},viz_jgkNVV8R:{type:"splunk.column",options:{backgroundColor:"#15161A",xAxisTitleVisibility:"hide",legendDisplay:"bottom"},dataSources:{primary:"ds_kBa7cUgt"},title:"Memory/CPU During Search Range"},viz_Gv4T8Edl:{type:"splunk.pie",options:{backgroundColor:"#15161A"},dataSources:{primary:"ds_hoDXmuAz_ds_FW49rAx7"},title:"Activity by region"},viz_l9d636Mo:{type:"splunk.area",options:{backgroundColor:"#15161A",xAxisTitleVisibility:"hide",y:"> primary | frameBySeriesNames('4xx')",xAxisMaxLabelParts:2,legendDisplay:"off",yAxisMax:2500,yAxisMajorTickSize:3,yAxisMajorTickInterval:2,yAxisTitleVisibility:"hide"},showProgressBar:!1,showLastUpdated:!1,hideWhenNoData:!1,dataSources:{primary:"ds_FW49rAx7"},title:"Error rate"},viz_OCRGyBxL:{type:"splunk.markdown",options:{markdown:"**Performance**",fontSize:"large"}},viz_PmVeYD7U:{type:"splunk.markdown",options:{markdown:"**3xx**",fontSize:"extraLarge"}},viz_16capbVb:{type:"splunk.markdown",options:{markdown:"**4xx**",fontSize:"extraLarge"}},viz_rnqm1UBP:{type:"splunk.markdown",options:{markdown:"**5xx**",fontSize:"extraLarge"}},viz_SKmPXp6z:{type:"splunk.markdown",options:{markdown:"**xxx**",fontSize:"extraLarge"}},viz_rYbmxXcF:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#7B56DB"}},viz_5bxGKtNU:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#009CEB"}},viz_Gi7xj4eJ:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#00CDAF"}},viz_oVjFwVZk:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#DD9900"}},viz_1v9R6py1:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#FF677B"}},viz_TU7KaFKb:{type:"splunk.singlevalue",options:{sparklineDisplay:"off",backgroundColor:"transparent"},dataSources:{primary:"ds_FW49rAx7"}},viz_z002TGAG:{type:"splunk.singlevalue",options:{sparklineDisplay:"off",backgroundColor:"transparent",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('3xx')"},dataSources:{primary:"ds_FW49rAx7"}},viz_hIQnOvtj:{type:"splunk.singlevalue",options:{sparklineDisplay:"off",backgroundColor:"transparent",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('4xx')"},dataSources:{primary:"ds_FW49rAx7"}},viz_a7Gk4PXz:{type:"splunk.singlevalue",options:{sparklineDisplay:"off",backgroundColor:"transparent",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('5xx')"},dataSources:{primary:"ds_FW49rAx7"}},viz_hCJj3IQB:{type:"splunk.singlevalue",options:{sparklineDisplay:"off",backgroundColor:"transparent",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('xxx')"},dataSources:{primary:"ds_FW49rAx7"}},viz_SEcxDErr:{type:"splunk.line",dataSources:{primary:"ds_FW49rAx7"},title:"",showProgressBar:!1,showLastUpdated:!1,hideWhenNoData:!1,options:{backgroundColor:"transparent",legendDisplay:"off",xAxisTitleVisibility:"hide"}},viz_BBVKToiA:{type:"splunk.markdown",options:{markdown:"# **Application Service Health Monitoring**"}},viz_39H9dHnj:{type:"splunk.markdown",options:{markdown:`## Full Source

\`\`\`json
{
  "visualizations": {
    "viz_2dtEyoSf": {
      "type": "splunk.markergauge",
      "options": {
        "orientation": "horizontal",
        "backgroundColor": "#15161A",
        "value": "> primary | seriesByName('performance') | lastPoint()"
      },
      "dataSources": {
        "primary": "ds_lLMVXz2S"
      },
      "title": "",
      "showProgressBar": false,
      "showLastUpdated": false,
      "hideWhenNoData": false
    },
    "viz_3jMwoVYB": {
      "type": "splunk.markergauge",
      "options": {
        "orientation": "horizontal",
        "backgroundColor": "#15161A"
      },
      "dataSources": {
        "primary": "ds_lLMVXz2S"
      },
      "title": "",
      "showProgressBar": false,
      "showLastUpdated": false,
      "hideWhenNoData": false
    },
    "viz_j1y5TVIW": {
      "type": "splunk.markergauge",
      "options": {
        "orientation": "horizontal",
        "backgroundColor": "#15161A"
      },
      "dataSources": {
        "primary": "ds_slxMrH1H_ds_hoDXmuAz_ds_FW49rAx7"
      },
      "title": "",
      "showProgressBar": false,
      "showLastUpdated": false,
      "hideWhenNoData": false
    },
    "viz_fAqdgAnD": {
      "type": "splunk.punchcard",
      "title": "Activity",
      "options": {
        "backgroundColor": "#15161A"
      },
      "dataSources": {
        "primary": "ds_zh1XRYil"
      }
    },
    "viz_uzUManc3": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Availability**",
        "fontSize": "large"
      }
    },
    "viz_f5Rn9XlO": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**2xx**",
        "fontSize": "extraLarge"
      }
    },
    "viz_nZ1B5gBf": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Active users**",
        "fontSize": "large"
      }
    },
    "viz_jgkNVV8R": {
      "type": "splunk.column",
      "options": {
        "backgroundColor": "#15161A",
        "xAxisTitleVisibility": "hide",
        "legendDisplay": "bottom"
      },
      "dataSources": {
        "primary": "ds_kBa7cUgt"
      },
      "title": "Memory/CPU During Search Range"
    },
    "viz_Gv4T8Edl": {
      "type": "splunk.pie",
      "options": {
        "backgroundColor": "#15161A"
      },
      "dataSources": {
        "primary": "ds_hoDXmuAz_ds_FW49rAx7"
      },
      "title": "Activity by region"
    },
    "viz_l9d636Mo": {
      "type": "splunk.area",
      "options": {
        "backgroundColor": "#15161A",
        "xAxisTitleVisibility": "hide",
        "y": "> primary | frameBySeriesNames('4xx')",
        "xAxisMaxLabelParts": 2,
        "legendDisplay": "off",
        "yAxisMax": 2500,
        "yAxisMajorTickSize": 3,
        "yAxisMajorTickInterval": 2,
        "yAxisTitleVisibility": "hide"
      },
      "showProgressBar": false,
      "showLastUpdated": false,
      "hideWhenNoData": false,
      "dataSources": {
        "primary": "ds_FW49rAx7"
      },
      "title": "Error rate"
    },
    "viz_OCRGyBxL": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**Performance**",
        "fontSize": "large"
      }
    },
    "viz_PmVeYD7U": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**3xx**",
        "fontSize": "extraLarge"
      }
    },
    "viz_16capbVb": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**4xx**",
        "fontSize": "extraLarge"
      }
    },
    "viz_rnqm1UBP": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**5xx**",
        "fontSize": "extraLarge"
      }
    },
    "viz_SKmPXp6z": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "**xxx**",
        "fontSize": "extraLarge"
      }
    },
    "viz_rYbmxXcF": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#7B56DB"
      }
    },
    "viz_5bxGKtNU": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#009CEB"
      }
    },
    "viz_Gi7xj4eJ": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#00CDAF"
      }
    },
    "viz_oVjFwVZk": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#DD9900"
      }
    },
    "viz_1v9R6py1": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#FF677B"
      }
    },
    "viz_TU7KaFKb": {
      "type": "splunk.singlevalue",
      "options": {
        "sparklineDisplay": "off",
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_FW49rAx7"
      }
    },
    "viz_z002TGAG": {
      "type": "splunk.singlevalue",
      "options": {
        "sparklineDisplay": "off",
        "backgroundColor": "transparent",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('3xx')"
      },
      "dataSources": {
        "primary": "ds_FW49rAx7"
      }
    },
    "viz_hIQnOvtj": {
      "type": "splunk.singlevalue",
      "options": {
        "sparklineDisplay": "off",
        "backgroundColor": "transparent",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('4xx')"
      },
      "dataSources": {
        "primary": "ds_FW49rAx7"
      }
    },
    "viz_a7Gk4PXz": {
      "type": "splunk.singlevalue",
      "options": {
        "sparklineDisplay": "off",
        "backgroundColor": "transparent",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('5xx')"
      },
      "dataSources": {
        "primary": "ds_FW49rAx7"
      }
    },
    "viz_hCJj3IQB": {
      "type": "splunk.singlevalue",
      "options": {
        "sparklineDisplay": "off",
        "backgroundColor": "transparent",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('xxx')"
      },
      "dataSources": {
        "primary": "ds_FW49rAx7"
      }
    },
    "viz_SEcxDErr": {
      "type": "splunk.line",
      "dataSources": {
        "primary": "ds_FW49rAx7"
      },
      "title": "",
      "showProgressBar": false,
      "showLastUpdated": false,
      "hideWhenNoData": false,
      "options": {
        "backgroundColor": "transparent",
        "legendDisplay": "off",
        "xAxisTitleVisibility": "hide"
      }
    },
    "viz_BBVKToiA": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# **Application Service Health Monitoring**"
      }
    }
  },
  "dataSources": {
    "ds_FW49rAx7": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=25 | streamstats count | eval _time=_time-count*3600 | eval 2xx=random()%1000*8.4, 3xx=random()%1000*1.2, 4xx=random()%1000*2.3, 5xx=random()%1000*0.7, xxx=random()%1000*0.2 | fields _time 2xx 3xx 4xx 5xx xxx",
        "queryParameters": {}
      },
      "name": "HTTP status"
    },
    "ds_hoDXmuAz_ds_FW49rAx7": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=6 \\n| streamstats count\\n| eval region=case(count=1, \\"North America\\", count=2, \\"South America\\", count=3, \\"Europe\\", count=4, \\"Africa\\", count=5, \\"Asia\\", count=6, \\"ANZ\\")\\n| eval activity=case(count=1,823, count=2,544,count=3, 797, count=4,329, count=5,1016, count=6, 369)\\n| fields region activity",
        "queryParameters": {}
      },
      "name": "Activity by region"
    },
    "ds_slxMrH1H_ds_hoDXmuAz_ds_FW49rAx7": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=15 \\n| streamstats count \\n| eval _time=_time-count*3600\\n| eval users=random()%100",
        "queryParameters": {}
      },
      "name": "Active users"
    },
    "ds_kBa7cUgt": {
      "type": "ds.search",
      "options": {
        "query": "|makeresults count=100 |streamstats count | eval _time=_time-count*60 | eval memory=random()%100, cpu=random()%100 \\n|  fields _time cpu memory",
        "queryParameters": {}
      },
      "name": "Mem and CPU utilization"
    },
    "ds_zh1XRYil": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup examples.csv | fields punch_hour punch_day punch_count | stats sum(punch_count) by punch_hour punch_day",
        "queryParameters": {}
      },
      "name": "Activity"
    },
    "ds_lLMVXz2S": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval performance=91, availability=98",
        "queryParameters": {}
      },
      "name": "Performance and Availability"
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
    "input_CDJ4CK9c": {
      "options": {
        "defaultValue": "-24h@h,now",
        "token": "global_time"
      },
      "title": "Global Time Range",
      "type": "input.timerange"
    }
  },
  "description": "",
  "title": "Application Service Health Monitoring",
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
          "display": "auto",
          "backgroundImage": {
            "sizeType": "contain",
            "x": 0,
            "y": 0,
            "src": "/static/app/splunk-dashboard-studio/images/examples-hub/application-health-monitoring/monitoring-background.png"
          }
        },
        "structure": [
          {
            "item": "viz_2dtEyoSf",
            "type": "block",
            "position": {
              "x": 980,
              "y": 60,
              "w": 440,
              "h": 160
            }
          },
          {
            "item": "viz_3jMwoVYB",
            "type": "block",
            "position": {
              "x": 980,
              "y": 230,
              "w": 440,
              "h": 160
            }
          },
          {
            "item": "viz_j1y5TVIW",
            "type": "block",
            "position": {
              "x": 980,
              "y": 400,
              "w": 440,
              "h": 160
            }
          },
          {
            "item": "viz_fAqdgAnD",
            "type": "block",
            "position": {
              "x": 740,
              "y": 580,
              "w": 680,
              "h": 360
            }
          },
          {
            "item": "viz_uzUManc3",
            "type": "block",
            "position": {
              "x": 990,
              "y": 240,
              "w": 140,
              "h": 40
            }
          },
          {
            "item": "viz_f5Rn9XlO",
            "type": "block",
            "position": {
              "x": 30,
              "y": 70,
              "w": 140,
              "h": 40
            }
          },
          {
            "item": "viz_nZ1B5gBf",
            "type": "block",
            "position": {
              "x": 990,
              "y": 410,
              "w": 140,
              "h": 40
            }
          },
          {
            "item": "viz_jgkNVV8R",
            "type": "block",
            "position": {
              "x": 20,
              "y": 580,
              "w": 420,
              "h": 360
            }
          },
          {
            "item": "viz_Gv4T8Edl",
            "type": "block",
            "position": {
              "x": 450,
              "y": 580,
              "w": 280,
              "h": 180
            }
          },
          {
            "item": "viz_l9d636Mo",
            "type": "block",
            "position": {
              "x": 450,
              "y": 770,
              "w": 280,
              "h": 170
            }
          },
          {
            "item": "viz_OCRGyBxL",
            "type": "block",
            "position": {
              "x": 990,
              "y": 70,
              "w": 140,
              "h": 40
            }
          },
          {
            "item": "viz_PmVeYD7U",
            "type": "block",
            "position": {
              "x": 220,
              "y": 70,
              "w": 140,
              "h": 40
            }
          },
          {
            "item": "viz_16capbVb",
            "type": "block",
            "position": {
              "x": 410,
              "y": 70,
              "w": 140,
              "h": 40
            }
          },
          {
            "item": "viz_rnqm1UBP",
            "type": "block",
            "position": {
              "x": 600,
              "y": 70,
              "w": 140,
              "h": 40
            }
          },
          {
            "item": "viz_SKmPXp6z",
            "type": "block",
            "position": {
              "x": 790,
              "y": 70,
              "w": 140,
              "h": 40
            }
          },
          {
            "item": "viz_rYbmxXcF",
            "type": "block",
            "position": {
              "x": 30,
              "y": 100,
              "w": 150,
              "h": 10
            }
          },
          {
            "item": "viz_5bxGKtNU",
            "type": "block",
            "position": {
              "x": 220,
              "y": 100,
              "w": 150,
              "h": 10
            }
          },
          {
            "item": "viz_Gi7xj4eJ",
            "type": "block",
            "position": {
              "x": 410,
              "y": 100,
              "w": 150,
              "h": 10
            }
          },
          {
            "item": "viz_oVjFwVZk",
            "type": "block",
            "position": {
              "x": 600,
              "y": 100,
              "w": 150,
              "h": 10
            }
          },
          {
            "item": "viz_1v9R6py1",
            "type": "block",
            "position": {
              "x": 790,
              "y": 100,
              "w": 150,
              "h": 10
            }
          },
          {
            "item": "viz_TU7KaFKb",
            "type": "block",
            "position": {
              "x": -40,
              "y": 120,
              "w": 300,
              "h": 50
            }
          },
          {
            "item": "viz_z002TGAG",
            "type": "block",
            "position": {
              "x": 130,
              "y": 120,
              "w": 300,
              "h": 50
            }
          },
          {
            "item": "viz_hIQnOvtj",
            "type": "block",
            "position": {
              "x": 320,
              "y": 120,
              "w": 300,
              "h": 50
            }
          },
          {
            "item": "viz_a7Gk4PXz",
            "type": "block",
            "position": {
              "x": 510,
              "y": 120,
              "w": 300,
              "h": 50
            }
          },
          {
            "item": "viz_hCJj3IQB",
            "type": "block",
            "position": {
              "x": 700,
              "y": 120,
              "w": 300,
              "h": 50
            }
          },
          {
            "item": "viz_SEcxDErr",
            "type": "block",
            "position": {
              "x": 20,
              "y": 170,
              "w": 950,
              "h": 390
            }
          },
          {
            "item": "viz_BBVKToiA",
            "type": "block",
            "position": {
              "x": 20,
              "y": 10,
              "w": 590,
              "h": 40
            }
          }
        ]
      }
    },
    "globalInputs": [
      "input_CDJ4CK9c"
    ],
    "options": {
      "showTitleAndDescription": false
    }
  }
}
\`\`\``}}},dataSources:{ds_FW49rAx7:{type:"ds.search",options:{query:"| makeresults count=25 | streamstats count | eval _time=_time-count*3600 | eval 2xx=random()%1000*8.4, 3xx=random()%1000*1.2, 4xx=random()%1000*2.3, 5xx=random()%1000*0.7, xxx=random()%1000*0.2 | fields _time 2xx 3xx 4xx 5xx xxx",queryParameters:{}},name:"HTTP status"},ds_hoDXmuAz_ds_FW49rAx7:{type:"ds.search",options:{query:`| makeresults count=6 
| streamstats count
| eval region=case(count=1, "North America", count=2, "South America", count=3, "Europe", count=4, "Africa", count=5, "Asia", count=6, "ANZ")
| eval activity=case(count=1,823, count=2,544,count=3, 797, count=4,329, count=5,1016, count=6, 369)
| fields region activity`,queryParameters:{}},name:"Activity by region"},ds_slxMrH1H_ds_hoDXmuAz_ds_FW49rAx7:{type:"ds.search",options:{query:`| makeresults count=15 
| streamstats count 
| eval _time=_time-count*3600
| eval users=random()%100`,queryParameters:{}},name:"Active users"},ds_kBa7cUgt:{type:"ds.search",options:{query:`|makeresults count=100 |streamstats count | eval _time=_time-count*60 | eval memory=random()%100, cpu=random()%100 
|  fields _time cpu memory`,queryParameters:{}},name:"Mem and CPU utilization"},ds_zh1XRYil:{type:"ds.search",options:{query:"| inputlookup examples.csv | fields punch_hour punch_day punch_count | stats sum(punch_count) by punch_hour punch_day",queryParameters:{}},name:"Activity"},ds_lLMVXz2S:{type:"ds.search",options:{query:`| makeresults 
| eval performance=91, availability=98`,queryParameters:{}},name:"Performance and Availability"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_CDJ4CK9c:{options:{defaultValue:"-24h@h,now",token:"global_time"},title:"Global Time Range",type:"input.timerange"}},description:"",title:"",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"absolute",options:{width:1440,height:1400,display:"auto",backgroundImage:{sizeType:"contain",x:0,y:0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/application-health-monitoring/monitoring-background.png"}},structure:[{item:"viz_2dtEyoSf",type:"block",position:{x:980,y:60,w:440,h:160}},{item:"viz_3jMwoVYB",type:"block",position:{x:980,y:230,w:440,h:160}},{item:"viz_j1y5TVIW",type:"block",position:{x:980,y:400,w:440,h:160}},{item:"viz_fAqdgAnD",type:"block",position:{x:740,y:580,w:680,h:360}},{item:"viz_uzUManc3",type:"block",position:{x:990,y:240,w:140,h:40}},{item:"viz_f5Rn9XlO",type:"block",position:{x:30,y:70,w:140,h:40}},{item:"viz_nZ1B5gBf",type:"block",position:{x:990,y:410,w:140,h:40}},{item:"viz_jgkNVV8R",type:"block",position:{x:20,y:580,w:420,h:360}},{item:"viz_Gv4T8Edl",type:"block",position:{x:450,y:580,w:280,h:180}},{item:"viz_l9d636Mo",type:"block",position:{x:450,y:770,w:280,h:170}},{item:"viz_OCRGyBxL",type:"block",position:{x:990,y:70,w:140,h:40}},{item:"viz_PmVeYD7U",type:"block",position:{x:220,y:70,w:140,h:40}},{item:"viz_16capbVb",type:"block",position:{x:410,y:70,w:140,h:40}},{item:"viz_rnqm1UBP",type:"block",position:{x:600,y:70,w:140,h:40}},{item:"viz_SKmPXp6z",type:"block",position:{x:790,y:70,w:140,h:40}},{item:"viz_rYbmxXcF",type:"block",position:{x:30,y:100,w:150,h:10}},{item:"viz_5bxGKtNU",type:"block",position:{x:220,y:100,w:150,h:10}},{item:"viz_Gi7xj4eJ",type:"block",position:{x:410,y:100,w:150,h:10}},{item:"viz_oVjFwVZk",type:"block",position:{x:600,y:100,w:150,h:10}},{item:"viz_1v9R6py1",type:"block",position:{x:790,y:100,w:150,h:10}},{item:"viz_TU7KaFKb",type:"block",position:{x:-40,y:120,w:300,h:50}},{item:"viz_z002TGAG",type:"block",position:{x:130,y:120,w:300,h:50}},{item:"viz_hIQnOvtj",type:"block",position:{x:320,y:120,w:300,h:50}},{item:"viz_a7Gk4PXz",type:"block",position:{x:510,y:120,w:300,h:50}},{item:"viz_hCJj3IQB",type:"block",position:{x:700,y:120,w:300,h:50}},{item:"viz_SEcxDErr",type:"block",position:{x:20,y:170,w:950,h:390}},{item:"viz_BBVKToiA",type:"block",position:{x:20,y:10,w:590,h:40}},{item:"viz_39H9dHnj",type:"block",position:{x:10,y:970,w:1405,h:400}}]}},globalInputs:["input_CDJ4CK9c"],options:{showTitleAndDescription:!1}}};var i=a(s());var o="Application Service Health Monitoring";e(i.default.createElement(n,{definition:t,isCompleteDashboard:!0,dashboardTitle:o}),{pageTitle:o,hideFooter:!0,layout:"fixed"});
