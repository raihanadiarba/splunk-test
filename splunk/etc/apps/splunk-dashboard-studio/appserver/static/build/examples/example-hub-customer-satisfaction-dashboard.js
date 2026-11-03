/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var a={visualizations:{viz_r18tV63A:{type:"splunk.punchcard",options:{colorMode:"categorical",bubbleSizeMethod:"radius"},dataSources:{primary:"ds_ProductType"},title:"Support Call Volume",description:"Previous Week",showProgressBar:!1,showLastUpdated:!1},viz_sqIDREXf:{type:"splunk.singlevalue",title:"Average NPS Score",dataSources:{primary:"ds_3dEl97bH"},options:{numberPrecision:1,trendColor:"> trendValue | rangeValue(trendColorEditorConfig)",sparklineDisplay:"off"},context:{trendColorEditorConfig:[{value:"#F98C83",to:0},{value:"#55C169",from:0}]}},viz_pTfbVr3a:{type:"splunk.pie",dataSources:{primary:"ds_VZVC9tJN"},title:"NPS Distribution",showProgressBar:!1,showLastUpdated:!1,options:{showDonutHole:!0,seriesColors:["#A8F5E7","#46D4BA","#A86FEF","#1F6272","#602DA1"]}},viz_zCBuizJ4:{type:"splunk.markergauge",options:{usePercentageValue:!0,gaugeRanges:[{from:85,value:"#A870EF",to:100},{from:50,value:"#2F8AA7",to:85},{from:0,value:"#99E6F7",to:50}]},dataSources:{primary:"ds_CzbFB4bn"},title:"Survey Response Rate",description:"Previous Week",showProgressBar:!1,showLastUpdated:!1},viz_iL6YG4ef:{type:"splunk.line",dataSources:{primary:"ds_PUJGKlX6",annotation:"annotation"},title:"Customer Retention Over Time",description:"Past 6 Months",options:{yAxisTitleText:"Retention Rate",annotationX:"> annotation|seriesByIndex(0)",annotationLabel:"> annotation|seriesByIndex(1)"}},viz_3uSBEc5c:{type:"splunk.column",options:{seriesColors:["#A8F5E7","#A86FEF","#46D4BA"],xAxisTitleText:"month",legendDisplay:"top"},dataSources:{primary:"ds_nzQHzwQK",annotation:"annotation"},title:"Product Return Volume",description:""},viz_AtHMlL2Q:{type:"splunk.singlevalueradial",options:{trendIndicatorPosition:"outside",unit:"%",radialBackgroundColor:"#A8F5E7",radialStrokeColor:"#A86FEF"},dataSources:{primary:"ds_Rr6BQfdp"},title:"Retention Rate"},viz_Cf3ig5AG:{type:"splunk.singlevalue",title:"Avg Review Score",dataSources:{primary:"ds_7wlWSXIo"},options:{numberPrecision:1,trendColor:"> trendValue | rangeValue(trendColorEditorConfig)",sparklineDisplay:"off"},context:{trendColorEditorConfig:[{value:"#F98C83",to:0},{value:"#55C169",from:0}]}},viz_ZaC7EepE:{type:"splunk.markdown",options:{markdown:`# Full Source

\`\`\`json
{
  "visualizations": {
    "viz_r18tV63A": {
      "type": "splunk.punchcard",
      "options": {
        "colorMode": "categorical",
        "bubbleSizeMethod": "radius"
      },
      "dataSources": {
        "primary": "ds_ProductType"
      },
      "title": "Support Call Volume",
      "description": "Previous Week",
      "showProgressBar": false,
      "showLastUpdated": false
    },
    "viz_sqIDREXf": {
      "type": "splunk.singlevalue",
      "title": "Average NPS Score",
      "dataSources": {
        "primary": "ds_3dEl97bH"
      },
      "options": {
        "numberPrecision": 1,
        "trendColor": "> trendValue | rangeValue(trendColorEditorConfig)",
        "sparklineDisplay": "off"
      },
      "context": {
        "trendColorEditorConfig": [
          {
            "value": "#F98C83",
            "to": 0
          },
          {
            "value": "#55C169",
            "from": 0
          }
        ]
      }
    },
    "viz_pTfbVr3a": {
      "type": "splunk.pie",
      "dataSources": {
        "primary": "ds_VZVC9tJN"
      },
      "title": "NPS Distribution",
      "showProgressBar": false,
      "showLastUpdated": false,
      "options": {
        "showDonutHole": true,
        "seriesColors": [
          "#A8F5E7",
          "#46D4BA",
          "#A86FEF",
          "#1F6272",
          "#602DA1"
        ]
      }
    },
    "viz_zCBuizJ4": {
      "type": "splunk.markergauge",
      "options": {
        "usePercentageValue": true,
        "gaugeRanges": [
          {
            "from": 85,
            "value": "#A870EF",
            "to": 100
          },
          {
            "from": 50,
            "value": "#2F8AA7",
            "to": 85
          },
          {
            "from": 0,
            "value": "#99E6F7",
            "to": 50
          }
        ]
      },
      "dataSources": {
        "primary": "ds_CzbFB4bn"
      },
      "title": "Survey Response Rate",
      "description": "Previous Week",
      "showProgressBar": false,
      "showLastUpdated": false
    },
    "viz_iL6YG4ef": {
      "type": "splunk.line",
      "dataSources": {
        "primary": "ds_PUJGKlX6",
        "annotation": "annotation"
      },
      "title": "Customer Retention Over Time",
      "description": "Past 6 Months",
      "options": {
        "yAxisTitleText": "Retention Rate",
        "annotationX": "> annotation|seriesByIndex(0)",
        "annotationLabel": "> annotation|seriesByIndex(1)"
      }
    },
    "viz_3uSBEc5c": {
      "type": "splunk.column",
      "options": {
        "seriesColors": [
          "#A8F5E7",
          "#A86FEF",
          "#46D4BA"
        ],
        "xAxisTitleText": "month",
        "legendDisplay": "top"
      },
      "dataSources": {
        "primary": "ds_nzQHzwQK",
        "annotation": "annotation"
      },
      "title": "Product Return Volume",
      "description": ""
    },
    "viz_AtHMlL2Q": {
      "type": "splunk.singlevalueradial",
      "options": {
        "trendIndicatorPosition": "outside",
        "unit": "%",
        "radialBackgroundColor": "#A8F5E7",
        "radialStrokeColor": "#A86FEF"
      },
      "dataSources": {
        "primary": "ds_Rr6BQfdp"
      },
      "title": "Retention Rate"
    },
    "viz_Cf3ig5AG": {
      "type": "splunk.singlevalue",
      "title": "Avg Review Score",
      "dataSources": {
        "primary": "ds_7wlWSXIo"
      },
      "options": {
        "numberPrecision": 1,
        "trendColor": "> trendValue | rangeValue(trendColorEditorConfig)",
        "sparklineDisplay": "off"
      },
      "context": {
        "trendColorEditorConfig": [
          {
            "value": "#F98C83",
            "to": 0
          },
          {
            "value": "#55C169",
            "from": 0
          }
        ]
      }
    }
  },
  "dataSources": {
    "ds_CzbFB4bn": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "query": "| makeresults \\n| eval value=\\"72\\" \\n| table value"
      },
      "name": "Survey Response Rate"
    },
    "ds_3dEl97bH": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "query": "| makeresults \\n| eval value=\\"7.7\\" \\n| append \\n    [| makeresults \\n    | eval value=\\"8.6\\"] \\n| table value"
      },
      "name": "Net Promoter Score"
    },
    "ds_ProductType": {
      "name": "ds_ProductType",
      "type": "ds.test",
      "options": {
        "requestParams": {
          "offset": 0,
          "count": 73
        },
        "meta": {
          "totalCount": 100
        },
        "data": {
          "fields": [
            {
              "name": "hour"
            },
            {
              "name": "day"
            },
            {
              "name": "count"
            },
            {
              "name": "region"
            }
          ],
          "columns": [
            [
              "9a",
              "10a",
              "11a",
              "12p",
              "1p",
              "2p",
              "3p",
              "4p",
              "9a",
              "10a",
              "11a",
              "12p",
              "1p",
              "2p",
              "3p",
              "4p",
              "9a",
              "10a",
              "11a",
              "12p",
              "1p",
              "2p",
              "3p",
              "4p",
              "9a",
              "10a",
              "11a",
              "12p",
              "1p",
              "2p",
              "3p",
              "4p",
              "9a",
              "10a",
              "11a",
              "12p",
              "1p",
              "2p",
              "3p",
              "4p"
            ],
            [
              "MON",
              "MON",
              "MON",
              "MON",
              "MON",
              "MON",
              "MON",
              "MON",
              "TUE",
              "TUE",
              "TUE",
              "TUE",
              "TUE",
              "TUE",
              "TUE",
              "TUE",
              "WED",
              "WED",
              "WED",
              "WED",
              "WED",
              "WED",
              "WED",
              "WED",
              "THU",
              "THU",
              "THU",
              "THU",
              "THU",
              "THU",
              "THU",
              "THU",
              "FRI",
              "FRI",
              "FRI",
              "FRI",
              "FRI",
              "FRI",
              "FRI",
              "FRI",
              "FRI"
            ],
            [
              908,
              860,
              991,
              931,
              867,
              1201,
              1151,
              877,
              858,
              866,
              1085,
              1063,
              948,
              1240,
              1234,
              840,
              969,
              1193,
              1100,
              802,
              1176,
              1069,
              988,
              843,
              1279,
              979,
              1216,
              1050,
              1241,
              916,
              984,
              975,
              1244,
              1105,
              854,
              1222,
              1029,
              1187,
              1247,
              1180
            ],
            [
              "California",
              "California",
              "Washington",
              "California",
              "Oregon",
              "California",
              "California",
              "California",
              "California",
              "California",
              "California",
              "Washington",
              "California",
              "California",
              "California",
              "Oregon",
              "California",
              "California",
              "Oregon",
              "Washington",
              "California",
              "California",
              "Washington",
              "California",
              "Oregon",
              "California",
              "Washington",
              "California",
              "Washington",
              "California",
              "California",
              "California",
              "California",
              "Washington",
              "California",
              "California",
              "Oregon",
              "Oregon",
              "Washington",
              "California"
            ]
          ]
        }
      }
    },
    "ds_PUJGKlX6": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=15\\n| streamstats count\\n| eval California=(random() % 25 + 55)\\n| eval Washington=(random() % 15 + 60)\\n| eval Oregon=(random() % 20 + 60)\\n| eval _time=_time-(count*2700000) \\n| fields _time, California, Washington, Oregon"
      },
      "name": "Search_1"
    },
    "ds_VZVC9tJN": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "query": "| makeresults \\n| eval value=\\"11\\" \\n| eval NPS=\\"10\\" \\n| append \\n    [| makeresults \\n| eval value=\\"15\\" \\n| eval NPS=\\"9\\" ]\\n| append \\n    [| makeresults \\n| eval value=\\"17\\" \\n| eval NPS=\\"8\\" ] \\n| append \\n    [| makeresults \\n| eval value=\\"54\\" \\n| eval NPS=\\"7\\" ] \\n| append \\n    [| makeresults \\n| eval value=\\"56\\" \\n| eval NPS=\\"<6\\" ] \\n| table NPS value"
      },
      "name": "Search_2"
    },
    "ds_nzQHzwQK": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "query": "| makeresults \\n| eval month=\\"Nov\\" \\n| eval retail=\\"5000\\" \\n| eval web = \\"3000\\"\\n| append \\n    [| makeresults \\n| eval month=\\"Dec\\" \\n| eval retail=\\"4700\\" \\n| eval web = \\"3200\\"]\\n| append \\n    [| makeresults \\n| eval month=\\"Jan\\" \\n| eval retail=\\"4700\\" \\n| eval web = \\"4100\\"]\\n| append \\n    [| makeresults \\n| eval month=\\"Feb\\" \\n| eval retail=\\"3700\\" \\n| eval web = \\"2800\\"]\\n| append \\n    [| makeresults \\n| eval month=\\"Mar\\" \\n| eval retail=\\"2200\\" \\n| eval web = \\"6000\\"]\\n| append \\n    [| makeresults \\n| eval month=\\"Apr\\" \\n| eval retail=\\"1900\\" \\n| eval web = \\"7000\\"]\\n| append \\n[| makeresults \\n| eval month=\\"May\\" \\n| eval retail=\\"3200\\" \\n| eval web = \\"6000\\"]\\n[| makeresults \\n| eval month=\\"June\\" \\n| eval retail=\\"3200\\" \\n| eval web = \\"6000\\"]\\n| table month retail web"
      },
      "name": "Search_3"
    },
    "annotation": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "query": "| makeresults \\n| eval annotation_label=\\"California Shelter In Place\\"\\n| eval annotation_color=\\"#f44271\\" \\n| eval time = \\"2020-03-27T18:11:50.000-07:00\\"\\n| table time annotation_label annotation_color"
      },
      "name": "Product Return Annotation"
    },
    "ds_Rr6BQfdp": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "query": "| makeresults \\n| eval value=\\"77\\" \\n| append \\n    [| makeresults \\n    | eval value=\\"82\\"] \\n| table value"
      },
      "name": "SVR Search"
    },
    "ds_7wlWSXIo": {
      "type": "ds.search",
      "options": {
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        },
        "query": "| makeresults \\n| eval value=\\"4.1\\" \\n| append \\n    [| makeresults \\n    | eval value=\\"4.3\\"] \\n| table value"
      },
      "name": "Review Score"
    }
  },
  "inputs": {},
  "description": "",
  "title": "Customer Satisfaction Dashboard",
  "defaults": {
    "visualizations": {
      "global": {
        "showLastUpdated": false
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
        "type": "grid",
        "structure": [
          {
            "item": "viz_r18tV63A",
            "type": "block",
            "position": {
              "x": 0,
              "y": 0,
              "w": 725,
              "h": 330
            }
          },
          {
            "item": "viz_pTfbVr3a",
            "type": "block",
            "position": {
              "x": 725,
              "y": 111,
              "w": 264,
              "h": 219
            }
          },
          {
            "item": "viz_sqIDREXf",
            "type": "block",
            "position": {
              "x": 725,
              "y": 0,
              "w": 264,
              "h": 111
            }
          },
          {
            "item": "viz_zCBuizJ4",
            "type": "block",
            "position": {
              "x": 989,
              "y": 0,
              "w": 211,
              "h": 330
            }
          },
          {
            "item": "viz_iL6YG4ef",
            "type": "block",
            "position": {
              "x": 655,
              "y": 330,
              "w": 545,
              "h": 343
            }
          },
          {
            "item": "viz_3uSBEc5c",
            "type": "block",
            "position": {
              "x": 204,
              "y": 330,
              "w": 451,
              "h": 343
            }
          },
          {
            "item": "viz_Cf3ig5AG",
            "type": "block",
            "position": {
              "x": 0,
              "y": 534,
              "w": 204,
              "h": 139
            }
          },
          {
            "item": "viz_AtHMlL2Q",
            "type": "block",
            "position": {
              "x": 0,
              "y": 330,
              "w": 204,
              "h": 204
            }
          }
        ]
      }
    },
    "options": {
      "showTitleAndDescription": true
    }
  }
}
\`\`\``,backgroundColor:"#000000"}}},dataSources:{ds_CzbFB4bn:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| makeresults 
| eval value="72" 
| table value`},name:"Survey Response Rate"},ds_3dEl97bH:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| makeresults 
| eval value="7.7" 
| append 
    [| makeresults 
    | eval value="8.6"] 
| table value`},name:"Net Promoter Score"},ds_ProductType:{name:"ds_ProductType",type:"ds.test",options:{requestParams:{offset:0,count:73},meta:{totalCount:100},data:{fields:[{name:"hour"},{name:"day"},{name:"count"},{name:"region"}],columns:[["9a","10a","11a","12p","1p","2p","3p","4p","9a","10a","11a","12p","1p","2p","3p","4p","9a","10a","11a","12p","1p","2p","3p","4p","9a","10a","11a","12p","1p","2p","3p","4p","9a","10a","11a","12p","1p","2p","3p","4p"],["MON","MON","MON","MON","MON","MON","MON","MON","TUE","TUE","TUE","TUE","TUE","TUE","TUE","TUE","WED","WED","WED","WED","WED","WED","WED","WED","THU","THU","THU","THU","THU","THU","THU","THU","FRI","FRI","FRI","FRI","FRI","FRI","FRI","FRI","FRI"],[908,860,991,931,867,1201,1151,877,858,866,1085,1063,948,1240,1234,840,969,1193,1100,802,1176,1069,988,843,1279,979,1216,1050,1241,916,984,975,1244,1105,854,1222,1029,1187,1247,1180],["California","California","Washington","California","Oregon","California","California","California","California","California","California","Washington","California","California","California","Oregon","California","California","Oregon","Washington","California","California","Washington","California","Oregon","California","Washington","California","Washington","California","California","California","California","Washington","California","California","Oregon","Oregon","Washington","California"]]}}},ds_PUJGKlX6:{type:"ds.search",options:{query:`| makeresults count=15
| streamstats count
| eval California=(random() % 25 + 55)
| eval Washington=(random() % 15 + 60)
| eval Oregon=(random() % 20 + 60)
| eval _time=_time-(count*2700000) 
| fields _time, California, Washington, Oregon`},name:"Search_1"},ds_VZVC9tJN:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| makeresults 
| eval value="11" 
| eval NPS="10" 
| append 
    [| makeresults 
| eval value="15" 
| eval NPS="9" ]
| append 
    [| makeresults 
| eval value="17" 
| eval NPS="8" ] 
| append 
    [| makeresults 
| eval value="54" 
| eval NPS="7" ] 
| append 
    [| makeresults 
| eval value="56" 
| eval NPS="<6" ] 
| table NPS value`},name:"Search_2"},ds_nzQHzwQK:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| makeresults 
| eval month="Nov" 
| eval retail="5000" 
| eval web = "3000"
| append 
    [| makeresults 
| eval month="Dec" 
| eval retail="4700" 
| eval web = "3200"]
| append 
    [| makeresults 
| eval month="Jan" 
| eval retail="4700" 
| eval web = "4100"]
| append 
    [| makeresults 
| eval month="Feb" 
| eval retail="3700" 
| eval web = "2800"]
| append 
    [| makeresults 
| eval month="Mar" 
| eval retail="2200" 
| eval web = "6000"]
| append 
    [| makeresults 
| eval month="Apr" 
| eval retail="1900" 
| eval web = "7000"]
| append 
[| makeresults 
| eval month="May" 
| eval retail="3200" 
| eval web = "6000"]
[| makeresults 
| eval month="June" 
| eval retail="3200" 
| eval web = "6000"]
| table month retail web`},name:"Search_3"},annotation:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| makeresults 
| eval annotation_label="California Shelter In Place"
| eval annotation_color="#f44271" 
| eval time = "2020-03-27T18:11:50.000-07:00"
| table time annotation_label annotation_color`},name:"Product Return Annotation"},ds_Rr6BQfdp:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| makeresults 
| eval value="77" 
| append 
    [| makeresults 
    | eval value="82"] 
| table value`},name:"SVR Search"},ds_7wlWSXIo:{type:"ds.search",options:{queryParameters:{earliest:"-24h@h",latest:"now"},query:`| makeresults 
| eval value="4.1" 
| append 
    [| makeresults 
    | eval value="4.3"] 
| table value`},name:"Review Score"}},inputs:{},description:"",title:"Customer Satisfaction Dashboard",defaults:{visualizations:{global:{showLastUpdated:!1}}},layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_r18tV63A",type:"block",position:{x:0,y:0,w:725,h:330}},{item:"viz_pTfbVr3a",type:"block",position:{x:725,y:111,w:264,h:219}},{item:"viz_sqIDREXf",type:"block",position:{x:725,y:0,w:264,h:111}},{item:"viz_zCBuizJ4",type:"block",position:{x:989,y:0,w:211,h:330}},{item:"viz_iL6YG4ef",type:"block",position:{x:655,y:330,w:545,h:343}},{item:"viz_3uSBEc5c",type:"block",position:{x:204,y:330,w:451,h:343}},{item:"viz_Cf3ig5AG",type:"block",position:{x:0,y:534,w:204,h:139}},{item:"viz_AtHMlL2Q",type:"block",position:{x:0,y:330,w:204,h:204}},{item:"viz_ZaC7EepE",type:"block",position:{x:0,y:673,w:1200,h:400}}]}},options:{showTitleAndDescription:!0}}};var o=i(r());var t="Customer Satisfaction";e(o.default.createElement(n,{definition:a,isCompleteDashboard:!0,dashboardTitle:t}),{pageTitle:t,hideFooter:!0,layout:"fixed"});
