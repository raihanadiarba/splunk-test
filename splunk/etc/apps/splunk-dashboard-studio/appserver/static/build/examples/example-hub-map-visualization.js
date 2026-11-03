/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as o}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var n={visualizations:{viz_NO70IXtY:{type:"splunk.map",options:{center:[37.7749,-171.6382500000002],zoom:0,scaleUnit:"imperial",layers:[{type:"marker",latitude:'> primary | seriesByName("lat")',longitude:'> primary | seriesByName("lon")',resultLimit:1e3}]},dataSources:{primary:"ds_search_table"},title:"Marker Layer with Base Configurations",description:"Center, zoom, imperial scale unit, result limit"},viz_HiUiyhHB:{type:"splunk.markdown",options:{markdown:`### Source Definition 
\`\`\`json
{
    "type": "splunk.map",
    "options": {
        "center": [37.7749,-122.4195],
        "zoom": 0,
        "scaleUnit": "imperial",
        "layers": [
            {
                "type": "marker",
                "latitude": "> primary | seriesByName(\\"lat\\")",
                "longitude": "> primary | seriesByName(\\"lon\\")",
                "resultLimit": 1000
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search_table"
    }
}
\`\`\``}},viz_jWqObBES:{type:"splunk.markdown",options:{markdown:`## Overview
Splunk Dashboards provides out of the box functionality to visualize geospatial data on a map area of your choice. These examples can allow you to adjust your data and configurations to make sure it matches the visualization you're looking for. 

### SPL for Marker Layers
\`\`\`splunk-spl
| inputlookup geomaps_data.csv
| iplocation device_ip
| table bytes device_ip lat lon
\`\`\``}},viz_9xL20GgN:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.map",
    "options": {
        "center": [37.7749,-122.4195],
        "zoom": 0,
        "layers": [
            {
                "type": "bubble",
                "latitude": "> primary | seriesByName(\\"lat\\")",
                "longitude": "> primary | seriesByName(\\"lon\\")",
                "bubbleSize": "> primary | frameWithoutSeriesNames(\\"geobin\\", \\"latitude\\", \\"longitude\\") | frameBySeriesTypes(\\"number\\")"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search_geostats_by"
    }
}
\`\`\``}},viz_yVAZGHP2:{type:"splunk.map",options:{center:[12.897491671831347,-122.41949999999997],zoom:0,layers:[{type:"bubble",latitude:"> primary | seriesByName('latitude')",longitude:"> primary | seriesByName('longitude')",bubbleSize:'> primary | frameWithoutSeriesNames("geobin", "latitude", "longitude") | frameBySeriesTypes("number")'}]},dataSources:{primary:"ds_search_geostats_by"},title:"Bubble Layer with Multiple Series"},viz_fPceEFFv:{type:"splunk.map",options:{center:[28.30438293026387,-122.41949999999997],zoom:0,layers:[{type:"marker",latitude:'> primary | seriesByName("lat")',longitude:'> primary | seriesByName("lon")',dataColors:'> primary | seriesByName("bytes") | rangeValue(colorRangeConfig)'}]},dataSources:{primary:"ds_search_table"},title:"Marker Layer with Dynamic Coloring",context:{colorRangeConfig:[{from:3e3,value:"#d41f1f"},{from:2e3,to:3e3,value:"#d97a0d"},{from:100,to:2e3,value:"#9d9f0d"},{to:1e3,value:"#118832"}]}},viz_kI660Tcg:{type:"splunk.map",options:{center:[31.35363912124076,-122.41949999999997],zoom:0,layers:[{type:"bubble",latitude:'> primary | seriesByName("latitude")',longitude:'> primary | seriesByName("longitude")',bubbleSize:"> primary | seriesByName('count')"}]},dataSources:{primary:"ds_search_geostats"},title:"Bubble Layer with Single Series",showProgressBar:!1,showLastUpdated:!1},viz_bHoqIDQp:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.map",
    "options": {
        "center": [37.7749,-122.4195],
        "zoom": 0,
        "layers": [
            {
                "type": "marker",
                "latitude": "> primary | seriesByName(\\"lat\\")",
                "longitude": "> primary | seriesByName(\\"lon\\")",
                "dataColors": "> primary | seriesByName(\\"bytes\\") | rangeValue(colorRangeConfig)"
            }
        ]
    },
    "context": {
        "colorRangeConfig": [
            {
                "from": 3000,
                "value": "#d41f1f"
            },
            {
                "from": 2000,
                "to": 3000,
                "value": "#d97a0d"
            },
            {
                "from": 100,
                "to": 2000,
                "value": "#9d9f0d"
            },
            {
                "to": 1000,
                "value": "#118832"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search_table"
    }
}
\`\`\``}},viz_KxrwVvi1:{type:"splunk.markdown",options:{markdown:`### Source Definition
\`\`\`json
{
    "type": "splunk.map",
    "options": {
        "center": [37.7749,-122.4195],
        "zoom": 0,
        "layers": [
            {
                "type": "bubble",
                "latitude": "> primary | seriesByName(\\"latitude\\")",
                "longitude": "> primary | seriesByName(\\"longitude\\")",
                "bubbleSize": "> primary | frameWithoutSeriesNames(\\"geobin\\", \\"latitude\\", \\"longitude\\") | frameBySeriesTypes(\\"number\\")"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search_geostats"
    }
}
\`\`\``}},viz_NIzTFa8m:{type:"splunk.markdown",options:{markdown:"### SPL for Bubble Layers with Geostats (single-series)\n```splunk-spl\n| inputlookup geomaps_data.csv\n| iplocation device_ip\n| geostats latfield=lat longfield=lon count\n```"}},viz_kYBM8BgO:{type:"splunk.markdown",options:{markdown:"### SPL for Bubble Layers with Geostats (multi-series)\n```splunk-spl\n| inputlookup geomaps_data.csv\n| iplocation device_ip\n| geostats latfield=lat longfield=lon count by method\n```"}},viz_HqNuMadG:{type:"splunk.map",options:{center:[2842170943040401e-29,-122.41949999999997],zoom:.022367792570463528,layers:[{type:"choropleth",areaIds:"> primary | seriesByName('country')",areaValues:"> primary | seriesByName('count')"}]},dataSources:{primary:"ds_search_geom"},title:"Choropleth Layer"},viz_OcKFTY8Z:{type:"splunk.markdown",options:{markdown:`### SPL for Choropleth Layers with Geom
\`\`\`splunk-spl
| inputlookup geomaps_data.csv
| iplocation device_ip
| lookup geo_countries latitude AS lat longitude AS lon OUTPUT featureId AS country
| stats count by country
| geom geo_countries featureIdField=country

\`\`\``},showProgressBar:!1,showLastUpdated:!1},viz_TGGfIlS8:{type:"splunk.markdown",options:{markdown:`### Source Defintion
\`\`\`json
{
    "type": "splunk.map",
    "options": {
        "center": [37.7749,-122.4195],
        "zoom": 0,
        "layers": [
            {
                "type": "choropleth",
                "areaIds": "> primary | seriesByName('country')",
                "areaValues": "> primary | seriesByName('count')"
            }
        ]
    },
    "dataSources": {
        "primary": "ds_search_geom"
    }
}
\`\`\``},showProgressBar:!1,showLastUpdated:!1},viz_Ymt3ZWaa:{type:"splunk.map",options:{center:[42.8093628214485,-7.0098652590829715],zoom:0,layers:[{type:"choropleth",source:"geo://default/world",choroplethStrokeColor:"#000000",choroplethOpacity:1}],showBaseLayer:!1,backgroundColor:"#000000"},dataSources:{primary:"ds_search_lookup_countries"},title:"World Choropleth Layer with hidden base layer",description:"Background color: black"},viz_jTgDCo7q:{type:"splunk.markdown",options:{markdown:`### SPL for Choropleth Layers with World Source

\`\`\`splunk-spl
|  inputlookup geo_attr_countries
|  eval numb=len(country)
|  eval numby=numb*3
|  fields country, numb
\`\`\``}},viz_0sCPm5Qi:{type:"splunk.markdown",options:{markdown:`### Source Defintion
\`\`\`json
{
    "type": "splunk.map",
    "options": {
        "center": [
            46.56,
            10.35
        ],
        "zoom": 0.45,
        "layers": [
            {
                "type": "choropleth",
                "source": "geo://default/world",
                "choroplethStrokeColor": "#000000",
                "choroplethOpacity": 1
            }
        ],
        "showBaseLayer": false,
        "backgroundColor": "#000000"
    },
    "dataSources": {
        "primary": "ds_search_lookup_countries"
    },
    "title": "World Choropleth Layer with hidden base layer",
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``}},viz_emxH8Rwz:{type:"splunk.map",options:{center:[37.76029219846083,-96.48145996055393],zoom:2.405974906342065,layers:[{type:"choropleth",source:"geo://default/us",choroplethStrokeColor:"#000000",choroplethOpacity:1}],showBaseLayer:!1,backgroundColor:"transparent",showScale:!1,showZoomControls:!1},dataSources:{primary:"ds_search_lookup_states"},title:"US Choropleth Layer with hidden base layer",description:"Background color: transparent, Hidden zoom controls"},viz_6ULmRsyY:{type:"splunk.markdown",options:{markdown:`### SPL for Choropleth Layers with US Source

\`\`\`splunk-spl
|  inputlookup geo_us_states
|  eval numb=len(featureId)
|  eval numb2=numb*2
|  rename featureId as state
|  fields - _featureIdField
|  fields state, numb
\`\`\``}},viz_myQsYzhp:{type:"splunk.markdown",options:{markdown:`### Source Defintion
\`\`\`json
{
    "type": "splunk.map",
    "options": {
        "center": [
            39.83000000000001,
            -98.57999999999998
        ],
        "zoom": 3,
        "layers": [
            {
                "type": "choropleth",
                "source": "geo://default/us",
                "choroplethStrokeColor": "#000000",
                "choroplethOpacity": 1
            }
        ],
        "showBaseLayer": false,
        "backgroundColor": "transparent",
        "showScale": false,
        "showZoomControls": false
    },
    "dataSources": {
        "primary": "ds_search_lookup_states"
    },
    "title": "US Choropleth Layer with transparent background",
    "description": "Hidden zoom controls",
    "context": {},
    "showProgressBar": false,
    "showLastUpdated": false
}
\`\`\``},showProgressBar:!1,showLastUpdated:!1},viz_6wxVTscM:{type:"splunk.map",options:{layers:[{type:"choropleth",dataColors:"> areaValues | gradient(dataColorsGradientConfig)"}],backgroundColor:"transparent"},context:{dataColorsGradientConfig:{colors:["#ffffff","#db5800"]}},showProgressBar:!0,title:"Choropleth Layer with gradient colors",dataSources:{primary:"ds_search_lookup_geo_countries"}},viz_5TFWP28i:{type:"splunk.markdown",options:{markdown:`### SPL for Choropleth Layers with World Source

\`\`\`splunk-spl
| inputlookup geo_attr_countries
| eval n=random() % 100
| geom geo_countries featureIdField=country 
| fields country, n, geom
\`\`\``}},viz_GxITJB3l:{type:"splunk.markdown",options:{markdown:`### Source Defintion
\`\`\`json
{
    "type": "splunk.map",
    "options": {
        "layers": [
            {
                "type": "choropleth",
                "dataColors": "> areaValues | gradient(dataColorsGradientConfig)"
            }
        ]
    },
    "context": {
        "dataColorsGradientConfig": {
            "colors": [
                "#ffffff",
                "#db5800"
            ]
        }
    },
    "dataSources": {
        "primary": "ds_search_lookup_geo_countries"
    },
    "title": "Choropleth Layer with gradient colors",
    "showProgressBar": true,
    "containerOptions": {},
    "showLastUpdated": false
}
\`\`\``}}},dataSources:{ds_search_geostats_by:{type:"ds.search",options:{query:`| inputlookup geomaps_data.csv
| iplocation device_ip
| geostats latfield=lat longfield=lon count by method`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_Geostats_By"},ds_search_table:{type:"ds.search",options:{query:`| inputlookup geomaps_data.csv
| iplocation device_ip
| table bytes device_ip lat lon`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_Table"},ds_search_geostats:{type:"ds.search",options:{query:`| inputlookup geomaps_data.csv
| iplocation device_ip
| geostats latfield=lat longfield=lon count`,queryParameters:{earliest:"-15m",latest:"now"}},name:"Search_Geostats"},ds_search_geom:{type:"ds.search",options:{query:`| inputlookup geomaps_data.csv
| iplocation device_ip
| lookup geo_countries latitude AS lat longitude AS lon OUTPUT featureId AS country
| stats count by country
| geom geo_countries featureIdField=country
`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_Geom"},ds_search_lookup_countries:{type:"ds.search",options:{query:`|  inputlookup geo_attr_countries
|  eval numb=len(country)
|  eval numby=numb*3
|  fields country, numb`,queryParameters:{earliest:"0",latest:""}},name:"Search_GeoJSON_Countries"},ds_search_lookup_states:{type:"ds.search",options:{query:`|  inputlookup geo_us_states
|  eval numb=len(featureId)
|  eval numb2=numb*2
|  rename featureId as state
|  fields - _featureIdField
|  fields state, numb`,queryParameters:{earliest:"0",latest:""}},name:"Search_GeoJSON_States"},ds_search_lookup_geo_countries:{type:"ds.search",options:{query:`| inputlookup geo_attr_countries | eval n=random() % 100 | geom geo_countries featureIdField=country 
| fields country, n, geom`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"Search_Geo_JSON_Country"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{},description:"Visualize geospatial data on an interactive map area",title:"Interactive Maps",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",options:{display:"auto-scale"},structure:[{item:"viz_jWqObBES",type:"block",position:{x:0,y:0,w:1200,h:210}},{item:"viz_NO70IXtY",type:"block",position:{x:0,y:210,w:464,h:399}},{item:"viz_fPceEFFv",type:"block",position:{x:0,y:609,w:464,h:468}},{item:"viz_kI660Tcg",type:"block",position:{x:0,y:1077,w:464,h:458}},{item:"viz_yVAZGHP2",type:"block",position:{x:0,y:1535,w:464,h:515}},{item:"viz_HqNuMadG",type:"block",position:{x:0,y:2050,w:464,h:528}},{item:"viz_Ymt3ZWaa",type:"block",position:{x:0,y:2578,w:464,h:400}},{item:"viz_emxH8Rwz",type:"block",position:{x:0,y:2978,w:464,h:400}},{item:"viz_6wxVTscM",type:"block",position:{x:0,y:3378,w:464,h:400}},{item:"viz_HiUiyhHB",type:"block",position:{x:464,y:210,w:736,h:399}},{item:"viz_bHoqIDQp",type:"block",position:{x:464,y:609,w:736,h:468}},{item:"viz_KxrwVvi1",type:"block",position:{x:464,y:1202,w:736,h:333}},{item:"viz_NIzTFa8m",type:"block",position:{x:464,y:1077,w:736,h:125}},{item:"viz_9xL20GgN",type:"block",position:{x:464,y:1660,w:736,h:390}},{item:"viz_kYBM8BgO",type:"block",position:{x:464,y:1535,w:736,h:125}},{item:"viz_TGGfIlS8",type:"block",position:{x:464,y:2233,w:736,h:345}},{item:"viz_OcKFTY8Z",type:"block",position:{x:464,y:2050,w:736,h:183}},{item:"viz_0sCPm5Qi",type:"block",position:{x:464,y:2778,w:736,h:200}},{item:"viz_jTgDCo7q",type:"block",position:{x:464,y:2578,w:736,h:200}},{item:"viz_myQsYzhp",type:"block",position:{x:464,y:3178,w:736,h:200}},{item:"viz_6ULmRsyY",type:"block",position:{x:464,y:2978,w:736,h:200}},{item:"viz_5TFWP28i",type:"block",position:{x:464,y:3378,w:736,h:200}},{item:"viz_GxITJB3l",type:"block",position:{x:464,y:3578,w:736,h:200}}]}},globalInputs:[]}};var t=a(r());o(t.default.createElement(e,{definition:n}),{pageTitle:"Interactive Maps",hideFooter:!0,layout:"fixed"});
