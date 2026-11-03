/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as i}from"../chunks/chunk-JHLB3KMN.js";var e={dataSources:{totalOnsite:{type:"ds.search",options:{query:`| makeresults count=15 annotate=true
| eval count=random() % 16000
| fields _time, count`,queryParameters:{earliest:"-25m",latest:"now"}},name:"Onsite Today"},currentlyOnsite:{type:"ds.search",options:{query:`| makeresults count=15 annotate=true
| eval count=random() % 6000
| fields _time, count`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Currently Onsite"},numberContacts:{type:"ds.search",options:{query:`| makeresults count=15 annotate=true
| eval count=random() % 100
| fields _time, count`,queryParameters:{earliest:"-1m",latest:"now"}},name:"Number Contacts"},currentPopSeattle:{type:"ds.search",options:{query:`| makeresults
| eval count=38`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Current Pop - Seattle"},currentPopLosAngeles:{type:"ds.search",options:{query:`
| makeresults
| eval count=1`,queryParameters:{earliest:"0",latest:"now"}},name:"Current Pop - Los Angeles"},totalLosAngeles:{type:"ds.search",options:{query:`
| makeresults
| eval count=4916`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Total - Los Angeles"},totalSeattle:{type:"ds.search",options:{query:`| makeresults
| eval count=6131`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Total - Seattle"},per100Seattle:{type:"ds.search",options:{query:`| makeresults
| eval count=4

`,queryParameters:{earliest:"-10m",latest:"now"}},name:"People per 100 - Seattle"},transmitsSeattle:{type:"ds.search",options:{query:`| makeresults
| eval count=63`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Transmits - Seattle"},per100LosAngeles:{type:"ds.search",options:{query:`| makeresults
| eval count=0`,queryParameters:{earliest:"-10m",latest:"now"}},name:"People per 100 - Los Angeles"},per100Atlanta:{type:"ds.search",options:{query:`| makeresults
| eval count=6`,queryParameters:{earliest:"-10m",latest:"now"}},name:"People per 100 - Atlanta"},per100NewYork:{type:"ds.search",options:{query:`| makeresults
| eval count =0`,queryParameters:{earliest:"-10m",latest:"now"}},name:"People per 100 - New York"},currentPopNewYork:{type:"ds.search",options:{query:`| makeresults
| eval count=2`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Current Pop - New York"},totalNewYork:{type:"ds.search",options:{query:`| makeresults
| eval count=4860`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Total - New York"},transmitsNY:{type:"ds.search",options:{query:`
| makeresults
| eval count=1`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Transmits - New York"},totalAtlanta:{type:"ds.search",options:{query:`| makeresults
| eval count=6503`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Total - Atlanta"},transmitsAtlanta:{type:"ds.search",options:{query:`
| makeresults
| eval count =100`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Transmits - Atlanta"},transmitsLA:{type:"ds.search",options:{query:`
| makeresults
| eval count=1`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Transmits - LosAngeles"},currentPopAtlanta:{type:"ds.search",options:{query:`| makeresults
| eval count=54`,queryParameters:{earliest:"-10m",latest:"now"}},name:"Current Pop - Atlanta"},ds_271D8oMM:{type:"ds.search",options:{query:`| makeresults 1
|  eval timeepoch=now()
|  eval time=strftime(timeepoch,"%Y-%m-%d %H:%M:%S")
|  fields _time time timeepoch`,refresh:"3s",queryParameters:{earliest:"-1m",latest:"now"}},name:"current_time"},ds_j6NXKC6a:{type:"ds.search",options:{query:`| makeresults 
|  eval campus="Seattle"
|  eval Remote=62
| eval "In Office"=38
|  table campus  Remote "In Office"`},name:"emp_location_seattle"},ds_azdCQD2P_ds_j6NXKC6a:{type:"ds.search",options:{query:`| makeresults 
|  eval campus="New York"
|  eval Remote=98
| eval "In Office"=2
|  table campus  Remote "In Office"`},name:"emp_location_newyork"},ds_tkdTAbqj_ds_azdCQD2P_ds_j6NXKC6a:{type:"ds.search",options:{query:`| makeresults 
|  eval campus="Atlanta"
|  eval Remote=46
| eval "In Office"=54
|  table campus  Remote "In Office"`},name:"emp_location_atlanta"},ds_nIR9wn3B_ds_tkdTAbqj_ds_azdCQD2P_ds_j6NXKC6a:{type:"ds.search",options:{query:`| makeresults 
|  eval campus="Los Angeles"
|  eval Remote=99
| eval "In Office"=1
|  table campus  Remote "In Office"`},name:"emp_location_losangeles"}},inputs:{},description:"",title:"",defaults:{visualizations:{global:{showProgressBar:!1,showLastUpdated:!1}}},visualizations:{viz_8457Gg8Q:{type:"splunk.markdown",options:{markdown:"# Buttercup Industries",fontColor:"#BBBBBB",fontWeight:"light"}},viz_l6RPIaQn:{type:"splunk.markdown",options:{markdown:"# Return to Work Readiness",fontColor:"#f6f7df"}},viz_pQjZxChv:{type:"splunk.markdown",options:{markdown:"# Employees currently onsite",fontColor:"#BBBBBB",fontWeight:"light"}},viz_K0i9Vyr1:{type:"splunk.markdown",options:{markdown:"# Employees currently remote",fontColor:"#BBBBBB",fontWeight:"light"}},viz_VSqzmqdK:{type:"splunk.markdown",options:{markdown:"# Occupancy Concerns",fontColor:"#BBBBBB",fontWeight:"light"}},viz_OGPOzbKZ:{type:"splunk.singlevalue",dataSources:{primary:"totalOnsite"},options:{backgroundColor:"transparent",majorColor:"#62b3b2",trendDisplay:"off",sparklineAreaGraph:"true",sparklineStrokeColor:"#62b3b2",sparklineAreaColor:"#62b3b2",showSparklineAreaGraph:!0}},viz_gSBS3HC1:{type:"splunk.singlevalue",dataSources:{primary:"currentlyOnsite"},options:{sparklinePosition:"after",sparklineStrokeColor:"#62b3b2",backgroundColor:"transparent",majorColor:"#62b3b2",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('count')",trendDisplay:"off",showSparklineAreaGraph:!0,sparklineAreaColor:"#62b3b2"}},viz_IVQdyRmq:{type:"splunk.singlevalue",dataSources:{primary:"numberContacts"},options:{backgroundColor:"transparent",majorColor:"#dc4e41",trendDisplay:"off",sparklineAreaGraph:"true",sparklineStrokeColor:"#dc4e41",sparklineAreaColor:"#dc4e41",showSparklineAreaGraph:!0}},viz_gCeKbMqV:{type:"splunk.markdown",options:{markdown:`### Current   On-site
`,fontColor:"#BBBBBB"}},viz_axus5Obq:{type:"splunk.markdown",options:{markdown:"### People   / 100 sq m",fontColor:"#BBBBBB"}},viz_V7lPZ44X:{type:"splunk.markdown",options:{markdown:"### Total   Employees",fontColor:"#BBBBBB"}},viz_R6YoTZdx:{type:"splunk.markdown",options:{markdown:"### Max   Occupancy",fontColor:"#BBBBBB"}},viz_2qW5ebjJ:{type:"splunk.singlevalue",dataSources:{primary:"currentPopSeattle"},options:{backgroundColor:"transparent",majorColor:"#62b3b2",unit:"%"}},viz_5G8dkEsq:{type:"splunk.markdown",options:{markdown:"# Seattle",fontColor:"#f7d454"}},viz_RfqPTlCz:{type:"splunk.markdown",options:{markdown:"# Atlanta",fontColor:"#ef8259"}},viz_rMQV1Mm0:{type:"splunk.markdown",options:{markdown:"# New York",fontColor:"#f6f7df"}},viz_op8rtYa5:{type:"splunk.markdown",options:{markdown:"# Los Angeles",fontColor:"#f6f7df"}},viz_KHH6hMig:{type:"splunk.singlevalue",dataSources:{primary:"currentPopLosAngeles"},options:{backgroundColor:"transparent",majorColor:"#62b3b2",unit:"%"}},viz_hqSITqoH:{type:"splunk.singlevalue",dataSources:{primary:"totalLosAngeles"},options:{backgroundColor:"transparent",majorColor:"#708794"}},viz_u3nQs1gf:{type:"splunk.markdown",options:{markdown:`### Current   On-site
`,fontColor:"#BBBBBB"}},viz_2DOxXffs:{type:"splunk.markdown",options:{markdown:"### Total   Employees",fontColor:"#BBBBBB"}},viz_cmZFPvXD:{type:"splunk.singlevalue",dataSources:{primary:"totalSeattle"},options:{backgroundColor:"transparent",majorColor:"#708794"}},viz_wbEWVZtL:{type:"splunk.singlevalue",dataSources:{primary:"per100Seattle"},options:{backgroundColor:"transparent",majorColor:"#f8be34"}},viz_TlvdpIbP:{type:"splunk.singlevalue",dataSources:{primary:"transmitsSeattle"},options:{backgroundColor:"transparent",majorColor:"#f1813f"}},viz_NoktwYHT:{type:"splunk.markdown",options:{markdown:"### People   / 100 sq m",fontColor:"#BBBBBB"}},viz_XcMjMxGv:{type:"splunk.markdown",options:{markdown:"### Max   Occupancy",fontColor:"#BBBBBB"}},viz_3zg4mMmq:{type:"splunk.singlevalue",dataSources:{primary:"per100LosAngeles"},options:{backgroundColor:"transparent",majorColor:"#62b3b2"}},viz_iQjx0UM6:{type:"splunk.singlevalue",dataSources:{primary:"per100Atlanta"},options:{backgroundColor:"transparent",majorColor:"#f1813f"}},viz_pqmpy9Oh:{type:"splunk.markdown",options:{markdown:"### People   / 100 sq m",fontColor:"#BBBBBB"}},viz_Cby5ow0c:{type:"splunk.singlevalue",dataSources:{primary:"per100NewYork"},options:{backgroundColor:"transparent",majorColor:"#62b3b2"}},viz_BpgObZoE:{type:"splunk.markdown",options:{markdown:"### People   / 100 sq m",fontColor:"#BBBBBB"}},viz_WxFkPnaL:{type:"splunk.markdown",options:{markdown:`### Current   On-site
`,fontColor:"#BBBBBB"}},viz_wS8wf5sY:{type:"splunk.singlevalue",dataSources:{primary:"currentPopNewYork"},options:{backgroundColor:"transparent",majorColor:"#62b3b2",unit:"%"}},viz_mRxi3dQ6:{type:"splunk.singlevalue",dataSources:{primary:"totalNewYork"},options:{backgroundColor:"transparent",majorColor:"#708794"}},viz_DS7UZv9o:{type:"splunk.singlevalue",dataSources:{primary:"transmitsNY"},options:{backgroundColor:"transparent",majorColor:"#62b3b2"}},viz_WJ1Gcy7O:{type:"splunk.singlevalue",dataSources:{primary:"totalAtlanta"},options:{backgroundColor:"transparent",majorColor:"#708794"}},viz_LeUH4b61:{type:"splunk.markdown",options:{markdown:"### Total   Employees",fontColor:"#BBBBBB"}},viz_Zp6dX9zh:{type:"splunk.markdown",options:{markdown:"### Max   Occupancy",fontColor:"#BBBBBB"}},viz_LfOuVqqe:{type:"splunk.markdown",options:{markdown:`### Current   On-site
`,fontColor:"#BBBBBB"}},viz_VQfR6sqb:{type:"splunk.markdown",options:{markdown:"### Total   Employees",fontColor:"#BBBBBB"}},viz_tOi71tga:{type:"splunk.markdown",options:{markdown:"### Max   Occupancy",fontColor:"#BBBBBB"}},viz_lMxNN1ES:{type:"splunk.singlevalue",dataSources:{primary:"transmitsAtlanta"},options:{backgroundColor:"transparent",majorColor:"#f1813f"}},viz_FdtM53WL:{type:"splunk.singlevalue",dataSources:{primary:"transmitsLA"},options:{backgroundColor:"transparent",majorColor:"#62b3b2"}},viz_Uk1UH9xR:{type:"splunk.singlevalue",dataSources:{primary:"currentPopAtlanta"},options:{backgroundColor:"transparent",majorColor:"#62b3b2",unit:"%"}},viz_z78oqJcC:{type:"splunk.singlevalue",dataSources:{primary:"ds_271D8oMM"},encoding:{majorColor:{field:"primary.timeepoch",format:{type:"rangevalue",ranges:[{from:2500,value:"#f6f7df"},{from:1800,value:"#f6f7df",to:2500},{value:"#f6f7df",to:1800}]}}},options:{majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('time')",backgroundColor:"transparent"}},viz_N4xYcrqX:{type:"splunk.bar",dataSources:{primary:"ds_j6NXKC6a"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisOff",showY2MajorGridLines:!0,legendDisplay:"off",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",showXMajorGridLines:!1,showYMajorGridLines:!1,stackMode:"stacked100",seriesColorsByField:{"In Office":"#88D7E6",Remote:"#3D4F57"}}},viz_mvOhR0GK:{type:"splunk.bar",dataSources:{primary:"ds_azdCQD2P_ds_j6NXKC6a"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisOff",showY2MajorGridLines:!0,legendDisplay:"off",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",showXMajorGridLines:!1,showYMajorGridLines:!1,stackMode:"stacked100",seriesColorsByField:{"In Office":"#88D7E6",Remote:"#3D4F57"}}},viz_u9FBYBAn:{type:"splunk.bar",dataSources:{primary:"ds_tkdTAbqj_ds_azdCQD2P_ds_j6NXKC6a"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisOff",showY2MajorGridLines:!0,legendDisplay:"off",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",showXMajorGridLines:!1,showYMajorGridLines:!1,stackMode:"stacked100",seriesColorsByField:{"In Office":"#88D7E6",Remote:"#3D4F57"}}},viz_PsgLW7kI:{type:"splunk.bar",dataSources:{primary:"ds_nIR9wn3B_ds_tkdTAbqj_ds_azdCQD2P_ds_j6NXKC6a"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisOff",showY2MajorGridLines:!0,legendDisplay:"off",backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisTitleVisibility:"hide",xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",showXMajorGridLines:!1,showYMajorGridLines:!1,stackMode:"stacked100",seriesColorsByField:{"In Office":"#88D7E6",Remote:"#3D4F57"}}},viz_g5OFXFKr:{type:"splunk.choropleth.svg",options:{backgroundColor:"transparent",svg:'<svg width="82" height="88" viewBox="0 0 82 88" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.75"><path d="M18.0876 80.5253V30.6198L45.198 40.0453V80.5253" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.61963 80.5253V38.7836L18.0028 30.6198" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M45.198 80.5253V1.59033L72.4462 12.9667V80.5253" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.8149 31.6588V9.75419L45.1981 1.59033" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.75" d="M50.5735 9.41492H52.2169" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 14.2815H62.692" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 19.1479H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 24.0144H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 28.881H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 33.7476H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 38.6139H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 43.4911H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 48.3577H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 53.2241H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 58.0906H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 62.9572H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M50.5735 67.8236H67.919" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M23.3042 38.6139H24.9582" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M23.3042 43.4911H40.6603" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M23.3042 48.3577H40.6603" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M23.3042 53.2241H40.6603" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M23.3042 58.0906H40.6603" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M23.3042 62.9572H40.6603" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M23.3042 67.8236H40.6603" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/></g></svg>'}},viz_etvEPJgt:{type:"splunk.choropleth.svg",options:{backgroundColor:"transparent",svg:'<svg width="84" height="88" viewBox="0 0 84 88" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.75"><path d="M28.6477 80.3663V1.59036L6.18115 14.2708V80.3663" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M28.6479 80.3663V1.59036L51.1038 12.0974V18.4694" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M6.18115 73.6019L28.6477 72.6477L36.9493 72.934" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M6.18115 66.933L28.6477 64.7595L36.9493 65.4275" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M6.18115 60.2747L28.6477 56.8607L36.9493 57.9104" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M6.18115 53.6164L28.6477 48.9725L36.9493 50.3932" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M6.18115 46.9581L28.6477 41.0737L36.9493 42.8761" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M6.18115 40.2998L28.6477 33.1749L36.9493 35.359" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M6.18115 33.6414L28.6477 25.2761L36.9493 27.8419" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M6.18115 26.9831L28.6477 17.3773L43.4486 22.6255" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M6.18115 20.3248L28.6477 9.48916L51.1036 18.4694" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M59.6279 80.3663V19.3176L42.2188 29.146V80.3663" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M59.6279 80.3663V19.3176L77.0371 27.4602V80.3663" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M42.2188 75.1181L59.6279 74.3865L77.0371 74.9908" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M42.2188 69.9547L59.6279 68.2689L77.0371 69.6684" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M42.2188 64.8019L59.6279 62.1513L77.0371 64.346" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M42.2188 59.6386L59.6279 56.0337L77.0371 59.0236" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M42.2188 54.4752L59.6279 49.9162L77.0371 53.6906" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M42.2188 49.3118L59.6279 43.7986L77.0371 48.3682" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M42.2188 44.159L59.6279 37.6704L77.0371 43.0458" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M42.2188 38.9957L59.6279 31.5528L77.0371 37.7234" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.4" d="M42.2188 33.8323L59.6279 25.4352L77.0371 32.3904" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></g></svg>'}},viz_YBpJCWDY:{type:"splunk.choropleth.svg",options:{backgroundColor:"transparent",svg:'<svg width="85" height="88" viewBox="0 0 85 88" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.75"><path d="M66.4665 80.2284V16.0202H27.4602V46.0357" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.4602 76.348V80.2284" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M44.3923 80.2284V69.1595H49.5345V80.2284" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.6333 63.4236C4.6333 67.3783 7.84583 70.5908 11.8005 70.5908C13.7514 70.5908 15.9355 69.8063 17.229 68.5446C18.3846 70.7287 20.2719 72.2236 22.9119 72.2236C26.7287 72.2236 29.814 69.1383 29.814 65.3214C29.814 62.3846 27.9798 59.8824 25.3928 58.8858C26.4001 57.9104 27.0362 56.5533 27.0362 55.0371C27.0362 52.0896 24.64 49.6935 21.6926 49.6935C21.5653 49.6935 21.4381 49.7041 21.3109 49.7147C21.8622 49.0149 22.2015 48.1349 22.2015 47.1701C22.2015 44.9012 20.3673 43.067 18.0984 43.067C15.8294 43.067 13.9952 44.9012 13.9952 47.1701C13.9952 47.679 14.0907 48.1561 14.2603 48.6014C13.7196 48.3788 13.1258 48.2516 12.5003 48.2516C9.97692 48.2516 7.93065 50.2978 7.93065 52.8212C7.93065 54.348 8.68342 55.6945 9.83908 56.532C6.8386 57.3908 4.6333 60.1475 4.6333 63.4236Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.2183 65.0564L22.5725 62.1831" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.229 80.2284V51.3581" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.4863 53.9451L17.229 56.2776L21.3533 53.9451" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.2183 65.0564L11.4612 62.5224" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M54.9948 16.0202V8.99084H38.9321V16.0202" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M46.958 8.99084V1.59036" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M39.176 35.0728H34.0232V41.2752H39.176V35.0728Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M49.5451 35.0728H44.3923V41.2752H49.5451V35.0728Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M59.9035 35.0728H54.7507V41.2752H59.9035V35.0728Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M39.176 46.3219H34.0232V52.5243H39.176V46.3219Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M49.5451 46.3219H44.3923V52.5243H49.5451V46.3219Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M59.9035 46.3219H54.7507V52.5243H59.9035V46.3219Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M39.176 57.5605H34.0232V63.7629H39.176V57.5605Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M49.5451 57.5605H44.3923V63.7629H49.5451V57.5605Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M59.9035 57.5605H54.7507V63.7629H59.9035V57.5605Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M39.176 23.8342H34.0232V30.0366H39.176V23.8342Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M49.5451 23.8342H44.3923V30.0366H49.5451V23.8342Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.6" d="M59.9035 23.8342H54.7507V30.0366H59.9035V23.8342Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></g></svg>'}},viz_pcK6SwTx:{type:"splunk.choropleth.svg",options:{backgroundColor:"transparent",svg:'<svg width="83" height="88" viewBox="0 0 83 88" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.75"><path d="M37.2676 80.4511V1.59033H64.855V80.4511" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.7676 42.9503V9.86021L37.2673 1.59033" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.7676 80.133V75.3619" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.75" d="M42.6958 8.45007H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 13.3802H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 18.3103H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 23.2299H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 28.16H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 33.0901H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 38.0203H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 42.9503H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 47.8805H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 52.8105H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 57.7407H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 62.6709H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path opacity="0.75" d="M42.6958 67.5903H60.2746" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.3 3"/><path d="M26.485 55.8746C27.6831 55.0159 28.4571 53.6163 28.4571 52.026C28.4571 49.4072 26.3366 47.2867 23.7178 47.2867C23.0711 47.2867 22.4561 47.4139 21.8942 47.6578C22.0638 47.1913 22.1699 46.693 22.1699 46.1734C22.1699 43.8303 20.2614 41.9219 17.9183 41.9219C15.5752 41.9219 13.6667 43.8303 13.6667 46.1734C13.6667 47.1701 14.0166 48.0819 14.5891 48.8028C14.4619 48.7922 14.3241 48.7816 14.1968 48.7816C11.1327 48.7816 8.65178 51.2626 8.65178 54.3161C8.65178 55.8852 9.30913 57.2954 10.3482 58.3026C7.66576 59.3416 5.75732 61.9286 5.75732 64.9821C5.75732 68.9368 8.95925 72.1387 12.914 72.1387C15.66 72.1387 17.6108 70.5908 18.8089 68.3219C20.1448 69.6366 22.4137 70.4424 24.4388 70.4424C28.5419 70.4424 31.8711 67.1132 31.8711 63.0101C31.8711 59.6173 29.5915 56.7652 26.485 55.8746Z" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.8195 64.7064L13.2744 61.7272" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.8193 80.4511V50.5099" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.6894 53.1923L18.8195 55.599L14.5361 53.1923" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.8193 64.7065L24.7991 62.0771" stroke="#B1EFFA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></g></svg>'}},viz_kbI3c7CG:{type:"splunk.markdown",options:{markdown:`# Full Source

\`\`\`json
{
  "dataSources": {
    "totalOnsite": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=15 annotate=true\\n| eval count=random() % 16000\\n| fields _time, count",
        "queryParameters": {
          "earliest": "-25m",
          "latest": "now"
        }
      },
      "name": "Onsite Today"
    },
    "currentlyOnsite": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=15 annotate=true\\n| eval count=random() % 6000\\n| fields _time, count",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Currently Onsite"
    },
    "numberContacts": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=15 annotate=true\\n| eval count=random() % 100\\n| fields _time, count",
        "queryParameters": {
          "earliest": "-1m",
          "latest": "now"
        }
      },
      "name": "Number Contacts"
    },
    "currentPopSeattle": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count=38",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Current Pop - Seattle"
    },
    "currentPopLosAngeles": {
      "type": "ds.search",
      "options": {
        "query": "\\n| makeresults\\n| eval count=1",
        "queryParameters": {
          "earliest": "0",
          "latest": "now"
        }
      },
      "name": "Current Pop - Los Angeles"
    },
    "totalLosAngeles": {
      "type": "ds.search",
      "options": {
        "query": "\\n| makeresults\\n| eval count=4916",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Total - Los Angeles"
    },
    "totalSeattle": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count=6131",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Total - Seattle"
    },
    "per100Seattle": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count=4\\n\\n",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "People per 100 - Seattle"
    },
    "transmitsSeattle": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count=63",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Transmits - Seattle"
    },
    "per100LosAngeles": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count=0",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "People per 100 - Los Angeles"
    },
    "per100Atlanta": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count=6",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "People per 100 - Atlanta"
    },
    "per100NewYork": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count =0",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "People per 100 - New York"
    },
    "currentPopNewYork": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count=2",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Current Pop - New York"
    },
    "totalNewYork": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count=4860",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Total - New York"
    },
    "transmitsNY": {
      "type": "ds.search",
      "options": {
        "query": "\\n| makeresults\\n| eval count=1",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Transmits - New York"
    },
    "totalAtlanta": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count=6503",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Total - Atlanta"
    },
    "transmitsAtlanta": {
      "type": "ds.search",
      "options": {
        "query": "\\n| makeresults\\n| eval count =100",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Transmits - Atlanta"
    },
    "transmitsLA": {
      "type": "ds.search",
      "options": {
        "query": "\\n| makeresults\\n| eval count=1",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Transmits - LosAngeles"
    },
    "currentPopAtlanta": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval count=54",
        "queryParameters": {
          "earliest": "-10m",
          "latest": "now"
        }
      },
      "name": "Current Pop - Atlanta"
    },
    "ds_271D8oMM": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1\\n|  eval timeepoch=now()\\n|  eval time=strftime(timeepoch,\\"%Y-%m-%d %H:%M:%S\\")\\n|  fields _time time timeepoch",
        "refresh": "3s",
        "queryParameters": {
          "earliest": "-1m",
          "latest": "now"
        }
      },
      "name": "current_time"
    },
    "ds_j6NXKC6a": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n|  eval campus=\\"Seattle\\"\\n|  eval Remote=62\\n| eval \\"In Office\\"=38\\n|  table campus  Remote \\"In Office\\""
      },
      "name": "emp_location_seattle"
    },
    "ds_azdCQD2P_ds_j6NXKC6a": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n|  eval campus=\\"New York\\"\\n|  eval Remote=98\\n| eval \\"In Office\\"=2\\n|  table campus  Remote \\"In Office\\""
      },
      "name": "emp_location_newyork"
    },
    "ds_tkdTAbqj_ds_azdCQD2P_ds_j6NXKC6a": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n|  eval campus=\\"Atlanta\\"\\n|  eval Remote=46\\n| eval \\"In Office\\"=54\\n|  table campus  Remote \\"In Office\\""
      },
      "name": "emp_location_atlanta"
    },
    "ds_nIR9wn3B_ds_tkdTAbqj_ds_azdCQD2P_ds_j6NXKC6a": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n|  eval campus=\\"Los Angeles\\"\\n|  eval Remote=99\\n| eval \\"In Office\\"=1\\n|  table campus  Remote \\"In Office\\""
      },
      "name": "emp_location_losangeles"
    }
  },
  "inputs": {},
  "description": "",
  "title": "Workplace Readiness",
  "defaults": {
    "visualizations": {
      "global": {
        "showProgressBar": false,
        "showLastUpdated": false
      }
    }
  },
  "visualizations": {
    "viz_8457Gg8Q": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Buttercup Industries",
        "fontColor": "#BBBBBB",
        "fontWeight": "light"
      }
    },
    "viz_l6RPIaQn": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Return to Work Readiness",
        "fontColor": "#f6f7df"
      }
    },
    "viz_pQjZxChv": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Employees currently onsite",
        "fontColor": "#BBBBBB",
        "fontWeight": "light"
      }
    },
    "viz_K0i9Vyr1": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Employees currently remote",
        "fontColor": "#BBBBBB",
        "fontWeight": "light"
      }
    },
    "viz_VSqzmqdK": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Occupancy Concerns",
        "fontColor": "#BBBBBB",
        "fontWeight": "light"
      }
    },
    "viz_OGPOzbKZ": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "totalOnsite"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#62b3b2",
        "trendDisplay": "off",
        "sparklineAreaGraph": "true",
        "sparklineStrokeColor": "#62b3b2",
        "sparklineAreaColor": "#62b3b2",
        "showSparklineAreaGraph": true
      }
    },
    "viz_gSBS3HC1": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "currentlyOnsite"
      },
      "options": {
        "sparklinePosition": "after",
        "sparklineStrokeColor": "#62b3b2",
        "backgroundColor": "transparent",
        "majorColor": "#62b3b2",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('count')",
        "trendDisplay": "off",
        "showSparklineAreaGraph": true,
        "sparklineAreaColor": "#62b3b2"
      }
    },
    "viz_IVQdyRmq": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "numberContacts"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#dc4e41",
        "trendDisplay": "off",
        "sparklineAreaGraph": "true",
        "sparklineStrokeColor": "#dc4e41",
        "sparklineAreaColor": "#dc4e41",
        "showSparklineAreaGraph": true
      }
    },
    "viz_gCeKbMqV": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Current   On-site\\n",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_axus5Obq": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### People   / 100 sq m",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_V7lPZ44X": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Total   Employees",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_R6YoTZdx": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Max   Occupancy",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_2qW5ebjJ": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "currentPopSeattle"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#62b3b2",
        "unit": "%"
      }
    },
    "viz_5G8dkEsq": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Seattle",
        "fontColor": "#f7d454"
      }
    },
    "viz_RfqPTlCz": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Atlanta",
        "fontColor": "#ef8259"
      }
    },
    "viz_rMQV1Mm0": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# New York",
        "fontColor": "#f6f7df"
      }
    },
    "viz_op8rtYa5": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Los Angeles",
        "fontColor": "#f6f7df"
      }
    },
    "viz_KHH6hMig": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "currentPopLosAngeles"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#62b3b2",
        "unit": "%"
      }
    },
    "viz_hqSITqoH": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "totalLosAngeles"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#708794"
      }
    },
    "viz_u3nQs1gf": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Current   On-site\\n",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_2DOxXffs": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Total   Employees",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_cmZFPvXD": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "totalSeattle"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#708794"
      }
    },
    "viz_wbEWVZtL": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "per100Seattle"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#f8be34"
      }
    },
    "viz_TlvdpIbP": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "transmitsSeattle"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#f1813f"
      }
    },
    "viz_NoktwYHT": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### People   / 100 sq m",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_XcMjMxGv": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Max   Occupancy",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_3zg4mMmq": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "per100LosAngeles"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#62b3b2"
      }
    },
    "viz_iQjx0UM6": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "per100Atlanta"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#f1813f"
      }
    },
    "viz_pqmpy9Oh": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### People   / 100 sq m",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_Cby5ow0c": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "per100NewYork"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#62b3b2"
      }
    },
    "viz_BpgObZoE": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### People   / 100 sq m",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_WxFkPnaL": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Current   On-site\\n",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_wS8wf5sY": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "currentPopNewYork"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#62b3b2",
        "unit": "%"
      }
    },
    "viz_mRxi3dQ6": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "totalNewYork"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#708794"
      }
    },
    "viz_DS7UZv9o": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "transmitsNY"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#62b3b2"
      }
    },
    "viz_WJ1Gcy7O": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "totalAtlanta"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#708794"
      }
    },
    "viz_LeUH4b61": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Total   Employees",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_Zp6dX9zh": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Max   Occupancy",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_LfOuVqqe": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Current   On-site\\n",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_VQfR6sqb": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Total   Employees",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_tOi71tga": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Max   Occupancy",
        "fontColor": "#BBBBBB"
      }
    },
    "viz_lMxNN1ES": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "transmitsAtlanta"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#f1813f"
      }
    },
    "viz_FdtM53WL": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "transmitsLA"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#62b3b2"
      }
    },
    "viz_Uk1UH9xR": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "currentPopAtlanta"
      },
      "options": {
        "backgroundColor": "transparent",
        "majorColor": "#62b3b2",
        "unit": "%"
      }
    },
    "viz_z78oqJcC": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "ds_271D8oMM"
      },
      "encoding": {
        "majorColor": {
          "field": "primary.timeepoch",
          "format": {
            "type": "rangevalue",
            "ranges": [
              {
                "from": 2500,
                "value": "#f6f7df"
              },
              {
                "from": 1800,
                "value": "#f6f7df",
                "to": 2500
              },
              {
                "value": "#f6f7df",
                "to": 1800
              }
            ]
          }
        }
      },
      "options": {
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('time')",
        "backgroundColor": "transparent"
      }
    },
    "viz_N4xYcrqX": {
      "type": "splunk.bar",
      "dataSources": {
        "primary": "ds_j6NXKC6a"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisOff",
        "showY2MajorGridLines": true,
        "legendDisplay": "off",
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "showXMajorGridLines": false,
        "showYMajorGridLines": false,
        "stackMode": "stacked100",
        "seriesColorsByField": {
          "In Office": "#88D7E6",
          "Remote": "#3D4F57"
        }
      }
    },
    "viz_mvOhR0GK": {
      "type": "splunk.bar",
      "dataSources": {
        "primary": "ds_azdCQD2P_ds_j6NXKC6a"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisOff",
        "showY2MajorGridLines": true,
        "legendDisplay": "off",
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "showXMajorGridLines": false,
        "showYMajorGridLines": false,
        "stackMode": "stacked100",
        "seriesColorsByField": {
          "In Office": "#88D7E6",
          "Remote": "#3D4F57"
        }
      }
    },
    "viz_u9FBYBAn": {
      "type": "splunk.bar",
      "dataSources": {
        "primary": "ds_tkdTAbqj_ds_azdCQD2P_ds_j6NXKC6a"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisOff",
        "showY2MajorGridLines": true,
        "legendDisplay": "off",
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "showXMajorGridLines": false,
        "showYMajorGridLines": false,
        "stackMode": "stacked100",
        "seriesColorsByField": {
          "In Office": "#88D7E6",
          "Remote": "#3D4F57"
        }
      }
    },
    "viz_PsgLW7kI": {
      "type": "splunk.bar",
      "dataSources": {
        "primary": "ds_nIR9wn3B_ds_tkdTAbqj_ds_azdCQD2P_ds_j6NXKC6a"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisOff",
        "showY2MajorGridLines": true,
        "legendDisplay": "off",
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "yAxisTitleVisibility": "hide",
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "showXMajorGridLines": false,
        "showYMajorGridLines": false,
        "stackMode": "stacked100",
        "seriesColorsByField": {
          "In Office": "#88D7E6",
          "Remote": "#3D4F57"
        }
      }
    },
    "viz_g5OFXFKr": {
      "type": "splunk.choropleth.svg",
      "options": {
        "backgroundColor": "transparent",
        "svg": "<svg width=\\"82\\" height=\\"88\\" viewBox=\\"0 0 82 88\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\"><g opacity=\\"0.75\\"><path d=\\"M18.0876 80.5253V30.6198L45.198 40.0453V80.5253\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M8.61963 80.5253V38.7836L18.0028 30.6198\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M45.198 80.5253V1.59033L72.4462 12.9667V80.5253\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M35.8149 31.6588V9.75419L45.1981 1.59033\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 9.41492H52.2169\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 14.2815H62.692\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 19.1479H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 24.0144H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 28.881H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 33.7476H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 38.6139H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 43.4911H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 48.3577H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 53.2241H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 58.0906H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 62.9572H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M50.5735 67.8236H67.919\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M23.3042 38.6139H24.9582\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M23.3042 43.4911H40.6603\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M23.3042 48.3577H40.6603\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M23.3042 53.2241H40.6603\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M23.3042 58.0906H40.6603\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M23.3042 62.9572H40.6603\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M23.3042 67.8236H40.6603\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/></g></svg>"
      }
    },
    "viz_etvEPJgt": {
      "type": "splunk.choropleth.svg",
      "options": {
        "backgroundColor": "transparent",
        "svg": "<svg width=\\"84\\" height=\\"88\\" viewBox=\\"0 0 84 88\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\"><g opacity=\\"0.75\\"><path d=\\"M28.6477 80.3663V1.59036L6.18115 14.2708V80.3663\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M28.6479 80.3663V1.59036L51.1038 12.0974V18.4694\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M6.18115 73.6019L28.6477 72.6477L36.9493 72.934\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M6.18115 66.933L28.6477 64.7595L36.9493 65.4275\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M6.18115 60.2747L28.6477 56.8607L36.9493 57.9104\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M6.18115 53.6164L28.6477 48.9725L36.9493 50.3932\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M6.18115 46.9581L28.6477 41.0737L36.9493 42.8761\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M6.18115 40.2998L28.6477 33.1749L36.9493 35.359\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M6.18115 33.6414L28.6477 25.2761L36.9493 27.8419\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M6.18115 26.9831L28.6477 17.3773L43.4486 22.6255\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M6.18115 20.3248L28.6477 9.48916L51.1036 18.4694\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M59.6279 80.3663V19.3176L42.2188 29.146V80.3663\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M59.6279 80.3663V19.3176L77.0371 27.4602V80.3663\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M42.2188 75.1181L59.6279 74.3865L77.0371 74.9908\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M42.2188 69.9547L59.6279 68.2689L77.0371 69.6684\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M42.2188 64.8019L59.6279 62.1513L77.0371 64.346\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M42.2188 59.6386L59.6279 56.0337L77.0371 59.0236\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M42.2188 54.4752L59.6279 49.9162L77.0371 53.6906\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M42.2188 49.3118L59.6279 43.7986L77.0371 48.3682\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M42.2188 44.159L59.6279 37.6704L77.0371 43.0458\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M42.2188 38.9957L59.6279 31.5528L77.0371 37.7234\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.4\\" d=\\"M42.2188 33.8323L59.6279 25.4352L77.0371 32.3904\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/></g></svg>"
      }
    },
    "viz_YBpJCWDY": {
      "type": "splunk.choropleth.svg",
      "options": {
        "backgroundColor": "transparent",
        "svg": "<svg width=\\"85\\" height=\\"88\\" viewBox=\\"0 0 85 88\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\"><g opacity=\\"0.75\\"><path d=\\"M66.4665 80.2284V16.0202H27.4602V46.0357\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M27.4602 76.348V80.2284\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M44.3923 80.2284V69.1595H49.5345V80.2284\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M4.6333 63.4236C4.6333 67.3783 7.84583 70.5908 11.8005 70.5908C13.7514 70.5908 15.9355 69.8063 17.229 68.5446C18.3846 70.7287 20.2719 72.2236 22.9119 72.2236C26.7287 72.2236 29.814 69.1383 29.814 65.3214C29.814 62.3846 27.9798 59.8824 25.3928 58.8858C26.4001 57.9104 27.0362 56.5533 27.0362 55.0371C27.0362 52.0896 24.64 49.6935 21.6926 49.6935C21.5653 49.6935 21.4381 49.7041 21.3109 49.7147C21.8622 49.0149 22.2015 48.1349 22.2015 47.1701C22.2015 44.9012 20.3673 43.067 18.0984 43.067C15.8294 43.067 13.9952 44.9012 13.9952 47.1701C13.9952 47.679 14.0907 48.1561 14.2603 48.6014C13.7196 48.3788 13.1258 48.2516 12.5003 48.2516C9.97692 48.2516 7.93065 50.2978 7.93065 52.8212C7.93065 54.348 8.68342 55.6945 9.83908 56.532C6.8386 57.3908 4.6333 60.1475 4.6333 63.4236Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M17.2183 65.0564L22.5725 62.1831\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M17.229 80.2284V51.3581\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M13.4863 53.9451L17.229 56.2776L21.3533 53.9451\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M17.2183 65.0564L11.4612 62.5224\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M54.9948 16.0202V8.99084H38.9321V16.0202\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M46.958 8.99084V1.59036\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M39.176 35.0728H34.0232V41.2752H39.176V35.0728Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M49.5451 35.0728H44.3923V41.2752H49.5451V35.0728Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M59.9035 35.0728H54.7507V41.2752H59.9035V35.0728Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M39.176 46.3219H34.0232V52.5243H39.176V46.3219Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M49.5451 46.3219H44.3923V52.5243H49.5451V46.3219Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M59.9035 46.3219H54.7507V52.5243H59.9035V46.3219Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M39.176 57.5605H34.0232V63.7629H39.176V57.5605Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M49.5451 57.5605H44.3923V63.7629H49.5451V57.5605Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M59.9035 57.5605H54.7507V63.7629H59.9035V57.5605Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M39.176 23.8342H34.0232V30.0366H39.176V23.8342Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M49.5451 23.8342H44.3923V30.0366H49.5451V23.8342Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.6\\" d=\\"M59.9035 23.8342H54.7507V30.0366H59.9035V23.8342Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/></g></svg>"
      }
    },
    "viz_pcK6SwTx": {
      "type": "splunk.choropleth.svg",
      "options": {
        "backgroundColor": "transparent",
        "svg": "<svg width=\\"83\\" height=\\"88\\" viewBox=\\"0 0 83 88\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\"><g opacity=\\"0.75\\"><path d=\\"M37.2676 80.4511V1.59033H64.855V80.4511\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M27.7676 42.9503V9.86021L37.2673 1.59033\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M27.7676 80.133V75.3619\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 8.45007H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 13.3802H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 18.3103H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 23.2299H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 28.16H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 33.0901H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 38.0203H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 42.9503H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 47.8805H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 52.8105H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 57.7407H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 62.6709H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path opacity=\\"0.75\\" d=\\"M42.6958 67.5903H60.2746\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" stroke-dasharray=\\"0.3 3\\"/><path d=\\"M26.485 55.8746C27.6831 55.0159 28.4571 53.6163 28.4571 52.026C28.4571 49.4072 26.3366 47.2867 23.7178 47.2867C23.0711 47.2867 22.4561 47.4139 21.8942 47.6578C22.0638 47.1913 22.1699 46.693 22.1699 46.1734C22.1699 43.8303 20.2614 41.9219 17.9183 41.9219C15.5752 41.9219 13.6667 43.8303 13.6667 46.1734C13.6667 47.1701 14.0166 48.0819 14.5891 48.8028C14.4619 48.7922 14.3241 48.7816 14.1968 48.7816C11.1327 48.7816 8.65178 51.2626 8.65178 54.3161C8.65178 55.8852 9.30913 57.2954 10.3482 58.3026C7.66576 59.3416 5.75732 61.9286 5.75732 64.9821C5.75732 68.9368 8.95925 72.1387 12.914 72.1387C15.66 72.1387 17.6108 70.5908 18.8089 68.3219C20.1448 69.6366 22.4137 70.4424 24.4388 70.4424C28.5419 70.4424 31.8711 67.1132 31.8711 63.0101C31.8711 59.6173 29.5915 56.7652 26.485 55.8746Z\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M18.8195 64.7064L13.2744 61.7272\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M18.8193 80.4511V50.5099\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M22.6894 53.1923L18.8195 55.599L14.5361 53.1923\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M18.8193 64.7065L24.7991 62.0771\\" stroke=\\"#B1EFFA\\" stroke-width=\\"2\\" stroke-miterlimit=\\"10\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/></g></svg>"
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
          "width": 1500,
          "backgroundImage": {
            "sizeType": "contain",
            "x": 0,
            "y": 0,
            "src": "/static/app/splunk-dashboard-studio/images/examples-hub/workplace/workforce_background.png"
          },
          "display": "auto-scale",
          "height": 850
        },
        "structure": [
          {
            "item": "viz_5G8dkEsq",
            "type": "block",
            "position": {
              "x": 620,
              "y": 100,
              "w": 160,
              "h": 70
            }
          },
          {
            "item": "viz_op8rtYa5",
            "type": "block",
            "position": {
              "x": 620,
              "y": 480,
              "w": 230,
              "h": 70
            }
          },
          {
            "item": "viz_RfqPTlCz",
            "type": "block",
            "position": {
              "x": 1100,
              "y": 480,
              "w": 180,
              "h": 80
            }
          },
          {
            "item": "viz_8457Gg8Q",
            "type": "block",
            "position": {
              "x": 50,
              "y": 70,
              "w": 320,
              "h": 80
            }
          },
          {
            "item": "viz_l6RPIaQn",
            "type": "block",
            "position": {
              "x": 50,
              "y": 120,
              "w": 440,
              "h": 80
            }
          },
          {
            "item": "viz_pQjZxChv",
            "type": "block",
            "position": {
              "x": 50,
              "y": 220,
              "w": 400,
              "h": 75
            }
          },
          {
            "item": "viz_K0i9Vyr1",
            "type": "block",
            "position": {
              "x": 50,
              "y": 390,
              "w": 400,
              "h": 75
            }
          },
          {
            "item": "viz_VSqzmqdK",
            "type": "block",
            "position": {
              "x": 50,
              "y": 550,
              "w": 400,
              "h": 75
            }
          },
          {
            "item": "viz_gSBS3HC1",
            "type": "block",
            "position": {
              "x": 60,
              "y": 260,
              "w": 270,
              "h": 100
            }
          },
          {
            "item": "viz_rMQV1Mm0",
            "type": "block",
            "position": {
              "x": 1110,
              "y": 100,
              "w": 200,
              "h": 70
            }
          },
          {
            "item": "viz_z78oqJcC",
            "type": "block",
            "position": {
              "x": 30,
              "y": 790,
              "w": 210,
              "h": 50
            }
          },
          {
            "item": "viz_OGPOzbKZ",
            "type": "block",
            "position": {
              "x": 60,
              "y": 420,
              "w": 270,
              "h": 110
            }
          },
          {
            "item": "viz_IVQdyRmq",
            "type": "block",
            "position": {
              "x": 60,
              "y": 590,
              "w": 270,
              "h": 100
            }
          },
          {
            "item": "viz_axus5Obq",
            "type": "block",
            "position": {
              "x": 630,
              "y": 170,
              "w": 100,
              "h": 75
            }
          },
          {
            "item": "viz_gCeKbMqV",
            "type": "block",
            "position": {
              "x": 620,
              "y": 280,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_NoktwYHT",
            "type": "block",
            "position": {
              "x": 620,
              "y": 550,
              "w": 100,
              "h": 75
            }
          },
          {
            "item": "viz_tOi71tga",
            "type": "block",
            "position": {
              "x": 1225,
              "y": 170,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_BpgObZoE",
            "type": "block",
            "position": {
              "x": 1095,
              "y": 170,
              "w": 100,
              "h": 75
            }
          },
          {
            "item": "viz_WxFkPnaL",
            "type": "block",
            "position": {
              "x": 1100,
              "y": 280,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_VQfR6sqb",
            "type": "block",
            "position": {
              "x": 1225,
              "y": 280,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_pqmpy9Oh",
            "type": "block",
            "position": {
              "x": 1100,
              "y": 550,
              "w": 100,
              "h": 75
            }
          },
          {
            "item": "viz_R6YoTZdx",
            "type": "block",
            "position": {
              "x": 750,
              "y": 170,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_V7lPZ44X",
            "type": "block",
            "position": {
              "x": 750,
              "y": 280,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_XcMjMxGv",
            "type": "block",
            "position": {
              "x": 750,
              "y": 560,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_Zp6dX9zh",
            "type": "block",
            "position": {
              "x": 1230,
              "y": 560,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_u3nQs1gf",
            "type": "block",
            "position": {
              "x": 625,
              "y": 660,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_2DOxXffs",
            "type": "block",
            "position": {
              "x": 750,
              "y": 660,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_LfOuVqqe",
            "type": "block",
            "position": {
              "x": 1100,
              "y": 660,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_LeUH4b61",
            "type": "block",
            "position": {
              "x": 1220,
              "y": 660,
              "w": 150,
              "h": 75
            }
          },
          {
            "item": "viz_TlvdpIbP",
            "type": "block",
            "position": {
              "x": 750,
              "y": 200,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_cmZFPvXD",
            "type": "block",
            "position": {
              "x": 750,
              "y": 310,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_wbEWVZtL",
            "type": "block",
            "position": {
              "x": 620,
              "y": 200,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_2qW5ebjJ",
            "type": "block",
            "position": {
              "x": 620,
              "y": 310,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_3zg4mMmq",
            "type": "block",
            "position": {
              "x": 620,
              "y": 590,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_iQjx0UM6",
            "type": "block",
            "position": {
              "x": 1095,
              "y": 590,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_wS8wf5sY",
            "type": "block",
            "position": {
              "x": 1095,
              "y": 310,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_mRxi3dQ6",
            "type": "block",
            "position": {
              "x": 1225,
              "y": 310,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_Cby5ow0c",
            "type": "block",
            "position": {
              "x": 1095,
              "y": 200,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_DS7UZv9o",
            "type": "block",
            "position": {
              "x": 1225,
              "y": 200,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_FdtM53WL",
            "type": "block",
            "position": {
              "x": 750,
              "y": 590,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_lMxNN1ES",
            "type": "block",
            "position": {
              "x": 1225,
              "y": 590,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_KHH6hMig",
            "type": "block",
            "position": {
              "x": 620,
              "y": 690,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_hqSITqoH",
            "type": "block",
            "position": {
              "x": 750,
              "y": 690,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_Uk1UH9xR",
            "type": "block",
            "position": {
              "x": 1090,
              "y": 690,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_WJ1Gcy7O",
            "type": "block",
            "position": {
              "x": 1220,
              "y": 690,
              "w": 130,
              "h": 40
            }
          },
          {
            "item": "viz_N4xYcrqX",
            "type": "block",
            "position": {
              "x": 610,
              "y": 360,
              "w": 280,
              "h": 40
            }
          },
          {
            "item": "viz_u9FBYBAn",
            "type": "block",
            "position": {
              "x": 1085,
              "y": 745,
              "w": 285,
              "h": 40
            }
          },
          {
            "item": "viz_PsgLW7kI",
            "type": "block",
            "position": {
              "x": 610,
              "y": 745,
              "w": 280,
              "h": 40
            }
          },
          {
            "item": "viz_mvOhR0GK",
            "type": "block",
            "position": {
              "x": 1080,
              "y": 360,
              "w": 285,
              "h": 40
            }
          },
          {
            "item": "viz_etvEPJgt",
            "type": "block",
            "position": {
              "x": 1020,
              "y": 75,
              "w": 70,
              "h": 80
            }
          },
          {
            "item": "viz_YBpJCWDY",
            "type": "block",
            "position": {
              "x": 550,
              "y": 75,
              "w": 70,
              "h": 80
            }
          },
          {
            "item": "viz_g5OFXFKr",
            "type": "block",
            "position": {
              "x": 550,
              "y": 470,
              "w": 60,
              "h": 70
            }
          },
          {
            "item": "viz_pcK6SwTx",
            "type": "block",
            "position": {
              "x": 1020,
              "y": 460,
              "w": 70,
              "h": 80
            }
          }
        ]
      }
    }
  }
}
\`\`\``,backgroundColor:"#000000"}}},layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"absolute",options:{width:1500,height:1300,backgroundImage:{sizeType:"contain",x:0,y:0,src:"/static/app/splunk-dashboard-studio/images/examples-hub/workplace/workforce_background.png"},display:"auto-scale"},structure:[{item:"viz_5G8dkEsq",type:"block",position:{x:620,y:100,w:160,h:70}},{item:"viz_op8rtYa5",type:"block",position:{x:620,y:480,w:230,h:70}},{item:"viz_RfqPTlCz",type:"block",position:{x:1100,y:480,w:180,h:80}},{item:"viz_8457Gg8Q",type:"block",position:{x:50,y:70,w:320,h:80}},{item:"viz_l6RPIaQn",type:"block",position:{x:50,y:120,w:440,h:80}},{item:"viz_pQjZxChv",type:"block",position:{x:50,y:220,w:400,h:75}},{item:"viz_K0i9Vyr1",type:"block",position:{x:50,y:390,w:400,h:75}},{item:"viz_VSqzmqdK",type:"block",position:{x:50,y:550,w:400,h:75}},{item:"viz_gSBS3HC1",type:"block",position:{x:60,y:260,w:270,h:100}},{item:"viz_rMQV1Mm0",type:"block",position:{x:1110,y:100,w:200,h:70}},{item:"viz_z78oqJcC",type:"block",position:{x:30,y:790,w:210,h:50}},{item:"viz_OGPOzbKZ",type:"block",position:{x:60,y:420,w:270,h:110}},{item:"viz_IVQdyRmq",type:"block",position:{x:60,y:590,w:270,h:100}},{item:"viz_axus5Obq",type:"block",position:{x:630,y:170,w:100,h:75}},{item:"viz_gCeKbMqV",type:"block",position:{x:620,y:280,w:150,h:75}},{item:"viz_NoktwYHT",type:"block",position:{x:620,y:550,w:100,h:75}},{item:"viz_tOi71tga",type:"block",position:{x:1225,y:170,w:150,h:75}},{item:"viz_BpgObZoE",type:"block",position:{x:1095,y:170,w:100,h:75}},{item:"viz_WxFkPnaL",type:"block",position:{x:1100,y:280,w:150,h:75}},{item:"viz_VQfR6sqb",type:"block",position:{x:1225,y:280,w:150,h:75}},{item:"viz_pqmpy9Oh",type:"block",position:{x:1100,y:550,w:100,h:75}},{item:"viz_R6YoTZdx",type:"block",position:{x:750,y:170,w:150,h:75}},{item:"viz_V7lPZ44X",type:"block",position:{x:750,y:280,w:150,h:75}},{item:"viz_XcMjMxGv",type:"block",position:{x:750,y:560,w:150,h:75}},{item:"viz_Zp6dX9zh",type:"block",position:{x:1230,y:560,w:150,h:75}},{item:"viz_u3nQs1gf",type:"block",position:{x:625,y:660,w:150,h:75}},{item:"viz_2DOxXffs",type:"block",position:{x:750,y:660,w:150,h:75}},{item:"viz_LfOuVqqe",type:"block",position:{x:1100,y:660,w:150,h:75}},{item:"viz_LeUH4b61",type:"block",position:{x:1220,y:660,w:150,h:75}},{item:"viz_TlvdpIbP",type:"block",position:{x:750,y:200,w:130,h:40}},{item:"viz_cmZFPvXD",type:"block",position:{x:750,y:310,w:130,h:40}},{item:"viz_wbEWVZtL",type:"block",position:{x:620,y:200,w:130,h:40}},{item:"viz_2qW5ebjJ",type:"block",position:{x:620,y:310,w:130,h:40}},{item:"viz_3zg4mMmq",type:"block",position:{x:620,y:590,w:130,h:40}},{item:"viz_iQjx0UM6",type:"block",position:{x:1095,y:590,w:130,h:40}},{item:"viz_wS8wf5sY",type:"block",position:{x:1095,y:310,w:130,h:40}},{item:"viz_mRxi3dQ6",type:"block",position:{x:1225,y:310,w:130,h:40}},{item:"viz_Cby5ow0c",type:"block",position:{x:1095,y:200,w:130,h:40}},{item:"viz_DS7UZv9o",type:"block",position:{x:1225,y:200,w:130,h:40}},{item:"viz_FdtM53WL",type:"block",position:{x:750,y:590,w:130,h:40}},{item:"viz_lMxNN1ES",type:"block",position:{x:1225,y:590,w:130,h:40}},{item:"viz_KHH6hMig",type:"block",position:{x:620,y:690,w:130,h:40}},{item:"viz_hqSITqoH",type:"block",position:{x:750,y:690,w:130,h:40}},{item:"viz_Uk1UH9xR",type:"block",position:{x:1090,y:690,w:130,h:40}},{item:"viz_WJ1Gcy7O",type:"block",position:{x:1220,y:690,w:130,h:40}},{item:"viz_N4xYcrqX",type:"block",position:{x:610,y:360,w:280,h:40}},{item:"viz_u9FBYBAn",type:"block",position:{x:1085,y:745,w:285,h:40}},{item:"viz_PsgLW7kI",type:"block",position:{x:610,y:745,w:280,h:40}},{item:"viz_mvOhR0GK",type:"block",position:{x:1080,y:360,w:285,h:40}},{item:"viz_etvEPJgt",type:"block",position:{x:1020,y:75,w:70,h:80}},{item:"viz_YBpJCWDY",type:"block",position:{x:550,y:75,w:70,h:80}},{item:"viz_g5OFXFKr",type:"block",position:{x:550,y:470,w:60,h:70}},{item:"viz_pcK6SwTx",type:"block",position:{x:1020,y:460,w:70,h:80}},{item:"viz_kbI3c7CG",type:"block",position:{x:10,y:840,w:1470,h:440}}]}}}};var r=i(s());var o="Workforce Readiness";t(r.default.createElement(n,{definition:e,isCompleteDashboard:!0,dashboardTitle:o}),{pageTitle:o,hideFooter:!0,layout:"fixed"});
