/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as t}from"../chunks/chunk-JHLB3KMN.js";var o={inputs:{},dataSources:{ds_FZspy2J5:{type:"ds.search",options:{query:`| makeresults
| eval speed=124
| eval status=case(speed>0, "On", 1=1, "Off")
| eval fan="fan"
| table speed, status, fan`},name:"HVAC 1"},ds_2k2tu89X_ds_dWi9oVi2:{type:"ds.search",options:{query:`| makeresults count=6500
| eval temp=(random() %100)
| eval c=1
| eval diff=(random() % 110000)
| eval _time=now()-diff
| timechart count(c) as val by temp span=1h
| eval val=val/max(val)
`},name:"Room Temp"},ds_tmBqJ9ha_ds_33Mhcgkk:{type:"ds.search",options:{query:`| makeresults
| eval Host="mysql-02"
| eval Rack=2
| eval Priority="High"
| eval Row="A"
| append 
    [makeresults
| eval Host="storage_websever-02"
| eval Rack=2
| eval Priority="Medium"
| eval Row="A"]
| append 
    [makeresults
| eval Host="storage_exchange-03"
| eval Rack=2
| eval Priority="High"
| eval Row="C"]
| append 
    [makeresults
| eval Host="db-01"
| eval Rack=2
| eval Priority="Critical"
| eval Row="A"]
| append 
    [makeresults
| eval Host="websphere-01"
| eval Rack=2
| eval Priority="Medium"
| eval Row="A"]
| append 
    [makeresults
| eval Host="websphere-01"
| eval Rack=2
| eval Priority="Medium"
| eval Row="A"]
| append 
    [makeresults
| eval Host="storage_websever-01"
| eval Rack=2
| eval Priority="Low"
| eval Row="B"]
| append 
    [makeresults
| eval Host="storage_exchange-05"
| eval Rack=3
| eval Priority="Low"
| eval Row="C"]
| append 
    [makeresults
| eval Host="db-01"
| eval Rack=1
| eval Priority="Medium"
| eval Row="B"]
| append 
    [makeresults
| eval Host="websphere-01"
| eval Rack=2
| eval Priority="High"
| eval Row="B"]
| append 
    [makeresults
| eval Host="websphere-01"
| eval Rack=2
| eval Priority="Medium"
| eval Row="B"]
| search Row=*
| table Host Priority Rack Row`},name:"Anomalies 2"},ds_RQZPY5cd:{type:"ds.search",options:{query:`| makeresults count=5000
| eval diff=(random() % 100000)
| eval server="1"
| eval row="A"
| eval _time=now()-diff
| append 
    [ makeresults count=6000
| eval diff=(random() % 100000)
| eval server="2"
| eval row="A"
| eval _time=now()-diff]
| append 
    [ makeresults count=4000
| eval diff=(random() % 100000)
| eval server="3"
| eval row="A"
| eval _time=now()-diff]
| append 
    [ makeresults count=7000
| eval diff=(random() % 100000)
| eval server="4"
| eval row="A"
| eval _time=now()-diff]
| append 
    [ makeresults count=5000
| eval diff=(random() % 100000)
| eval server="5"
| eval row="A"
| eval _time=now()-diff]
| append
	[ makeresults count=6000
| eval diff=(random() % 100000)
| eval server="1"
| eval row="B"
| eval _time=now()-diff]
| append 
    [ makeresults count=7000
| eval diff=(random() % 100000)
| eval server="2"
| eval row="B"
| eval _time=now()-diff]
| append 
    [ makeresults count=5000
| eval diff=(random() % 100000)
| eval server="3"
| eval row="B"
| eval _time=now()-diff]
| append 
    [ makeresults count=4000
| eval diff=(random() % 100000)
| eval server="4"
| eval row="B"
| eval _time=now()-diff]
| append 
    [ makeresults count=5000
| eval diff=(random() % 100000)
| eval server="5"
| eval row="B"
| eval _time=now()-diff]
| append
	[ makeresults count=4000
| eval diff=(random() % 100000)
| eval server="1"
| eval row="C"
| eval _time=now()-diff]
| append 
    [ makeresults count=5000
| eval diff=(random() % 100000)
| eval server="2"
| eval row="C"
| eval _time=now()-diff]
| append 
    [ makeresults count=6000
| eval diff=(random() % 100000)
| eval server="3"
| eval row="C"
| eval _time=now()-diff]
| append 
    [ makeresults count=9000
| eval diff=(random() % 100000)
| eval server="4"
| eval row="C"
| eval _time=now()-diff]
| append 
    [ makeresults count=7000
| eval diff=(random() % 100000)
| eval server="5"
| eval row="C"
| eval _time=now()-diff]
| search row=*
| timechart span=30min count by server`},name:"Power Use"},ds_33Mhcgkk:{type:"ds.search",options:{query:`| makeresults
| eval System="Power"
| eval Rack=2
| eval Devices="PDU-02"
| eval Value=3400
| append 
    [makeresults
| eval System="Power"
| eval Rack=2
| eval Devices="PDU-07"
| eval Value=2375]
| append 
    [makeresults
| eval System="Power"
| eval Rack=2
| eval Devices="PDU-12"
| eval Value=2245]
| table System Rack Devices Value`},name:"Anomalies 1"},ds_abKnpfzZ:{type:"ds.search",options:{query:`| makeresults count=7000
| eval temp=(random() %1000)
| eval c=1
| eval diff=(random() % 110000)
| eval _time=now()-diff
| timechart count(c) as water by temp span=1h
| eval water=water/max(water)

`},name:"Water"},ds_dWi9oVi2:{type:"ds.search",options:{query:`| makeresults count=250000
| eval diff=(random() % 110000)
| eval _time=now()-diff
| timechart count as power by temp span=1h
| eval power=power/max(power)
`},name:"Power Util"},ds_6zvrUOR6:{type:"ds.search",options:{query:`| makeresults
| eval speed=0
| eval status=case(speed>0, "On", 1=1, "Off")
| eval fan="fan"
| table speed, status, fan`},name:"HVAC 2"},ds_qwJWyIWq_ds_8qwizlRA_ds_FZspy2J5:{type:"ds.chain",options:{query:"| table status",extend:"ds_6zvrUOR6"},name:"HVAC 2 - Status"},ds_8qwizlRA_ds_FZspy2J5:{type:"ds.chain",options:{query:"| table status",extend:"ds_FZspy2J5"},name:"HVAC 1 - Status"},ds_Y6m3TC9v:{type:"ds.search",options:{query:`| makeresults
| eval 1A=42, 2A=46, 3A=43, 4A=39, 5A=47, 1B=37, 2B=52,3B=57,4B=64,5B=58,1C=49,2C=55,3C=72,4C=88,5C=77`},name:"Server room heatmap"}},defaults:{visualizations:{global:{showLastUpdated:!1}},dataSources:{global:{options:{queryParameters:{earliest:"-24h@h",latest:"now"}}}}},visualizations:{viz_dzqdh0kW:{type:"splunk.markdown",options:{markdown:"### Fan Speed",fontColor:"#8D8D8F"}},viz_DO7xE34x:{type:"splunk.choropleth.svg",dataSources:{primary:"ds_6zvrUOR6"},context:{areaColorsEditorConfig:[{match:"On",value:"url(#paint0_radial)"},{match:"Off",value:"none)"}]},options:{svg:`<svg width="82" height="97" viewBox="0 0 82 97" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="fan" fill-rule="evenodd" clip-rule="evenodd" d="M82 19V78C82 88.4934 63.6437 97 41 97C18.3563 97 0 88.4934 0 78V19C0 8.50659 18.3563 0 41 0C63.6437 0 82 8.50659 82 19Z" fill="url(#paint0_radial)"/>
<defs>
<radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41 97) rotate(-90) scale(60.5 59)">
<stop stop-color="#61CAFA"/>
<stop offset="1" stop-color="#61CAFA" stop-opacity="0"/>
</radialGradient>
</defs>
</svg>
`,areaColors:"> areaValues | matchValue(areaColorsEditorConfig)",backgroundColor:"transparent",areaValues:"> primary | seriesByName('status')",areaIds:"> primary | seriesByName('fan')"}},viz_PjJj3PhI:{type:"splunk.ellipse",dataSources:{primary:"ds_qwJWyIWq_ds_8qwizlRA_ds_FZspy2J5"},options:{fillColor:"> fillDataValue | matchValue(fillColorEditorConfig)"},context:{fillColorEditorConfig:[{match:"Off",value:"#505158"},{value:"#62C9FA",match:"On"}],fillDataValue:"> primary | seriesByName('status') | lastPoint()"},showProgressBar:!1,showLastUpdated:!1},viz_ygXLEB4m:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('1B')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_2FLiZNYw:{type:"splunk.markdown",options:{markdown:"### Fan Speed",fontColor:"#8D8D8F"}},viz_jYxw2kyV:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('2A')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_61AXTZf1:{type:"splunk.markdown",options:{markdown:"## Power Usage"}},viz_hsMjalhP:{type:"splunk.singlevalue",options:{showSparklineAreaGraph:!0,majorFontSize:54,trendColor:"> trendValue | rangeValue(trendColorEditorConfig)",sparklineAreaColor:"> sparklineStrokeColor",backgroundColor:"transparent",trendFontSize:24,trendDisplay:"percent",sparklineStrokeColor:"> trendColor"},context:{trendColorEditorConfig:[{to:0,value:"#5cb3f2"},{from:0,value:"#FE3A3A"}]},dataSources:{primary:"ds_dWi9oVi2"}},viz_Kc5E88jq:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.8,fillColor:"#1A1C20"}},viz_vH43hiRI:{type:"splunk.markdown",options:{markdown:"#### Low 50\xB0-70\xB0",fontColor:"#AEAFB1"}},viz_JNO4wXtf:{type:"splunk.image",options:{src:"/static/app/splunk-dashboard-studio/images/examples-hub/datacenter/Servers.png",preserveAspectRatio:!0}},viz_QuoUsKIq:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('3A')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_xhfBJMdl:{type:"splunk.line",options:{backgroundColor:"transparent",xAxisTitleVisibility:"hide",yAxisMin:50,seriesColorsByField:{"1":"#A870EF","2":"#A9F5E7","3":"#F29BAC","4":"#26AA92","5":"#FDAF93"}},dataSources:{primary:"ds_RQZPY5cd"}},viz_ZcqbKrAu:{type:"splunk.choropleth.svg",options:{svg:`<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path d="M13.9093 13.9091C14.3729 13.9091 14.682 13.6 14.682 13.1364V11.5909H16.2275C16.6911 11.5909 17.0002 11.2818 17.0002 10.8182C17.0002 10.3546 16.6911 10.0455 16.2275 10.0455H14.682V8.50002C14.682 8.03639 14.3729 7.72729 13.9093 7.72729C13.4456 7.72729 13.1365 8.03639 13.1365 8.50002V10.0455H11.5911C11.1275 10.0455 10.8184 10.3546 10.8184 10.8182C10.8184 11.2818 11.1275 11.5909 11.5911 11.5909H13.1365V13.1364C13.1365 13.6 13.4456 13.9091 13.9093 13.9091Z" fill="#ACACAD"/>
<path d="M14.6819 32.4545H7.72736C7.26373 32.4545 6.95463 32.1454 6.95463 31.6817V5.409C6.95463 4.94537 7.26373 4.63628 7.72736 4.63628H13.9092C14.3728 4.63628 14.6819 4.32718 14.6819 3.86355C14.6819 3.39991 14.3728 3.09082 13.9092 3.09082H7.72736C6.41373 3.09082 5.40918 4.09537 5.40918 5.409V31.6817C5.40918 32.9954 6.41373 33.9999 7.72736 33.9999H14.6819C15.1455 33.9999 15.4546 33.6908 15.4546 33.2272C15.4546 32.7636 15.1455 32.4545 14.6819 32.4545Z" fill="#ACACAD"/>
<path d="M22.8725 23.3362C22.5635 23.1044 22.0225 23.1817 21.7907 23.4908L19.4725 26.5817C19.318 26.8135 19.2407 27.1226 19.3953 27.3544C19.5498 27.5862 19.7816 27.818 20.0907 27.818H21.6362L20.2453 29.6726C20.0135 29.9817 20.0907 30.5226 20.3998 30.7544C20.5544 30.8317 20.7089 30.9089 20.8635 30.9089C21.0953 30.9089 21.3271 30.8317 21.4816 30.5998L23.7998 27.5089C23.9544 27.2771 24.0316 26.968 23.8771 26.7362C23.7225 26.4271 23.4907 26.2726 23.1816 26.2726H21.6362L23.0271 24.418C23.2589 24.1089 23.1816 23.568 22.8725 23.3362Z" fill="#ACACAD"/>
<path d="M22.409 20.1682V5.40909C22.409 4.09545 21.4045 3.09091 20.0909 3.09091H17.7727V0.772727C17.7727 0.309091 17.4636 0 17 0H10.8181C10.3545 0 10.0454 0.309091 10.0454 0.772727C10.0454 1.23636 10.3545 1.54545 10.8181 1.54545H16.2272V3.86364C16.2272 4.32727 16.5363 4.63636 17 4.63636H20.0909C20.5545 4.63636 20.8636 4.94545 20.8636 5.40909V20.8636C20.8636 21.3273 21.1727 21.6364 21.6363 21.6364C24.65 21.6364 27.0454 24.0318 27.0454 27.0455C27.0454 30.0591 24.65 32.4545 21.6363 32.4545C18.6227 32.4545 16.2272 30.0591 16.2272 27.0455C16.2272 25.1136 17.309 23.2591 19.009 22.3318C19.3954 22.1 19.55 21.6364 19.3181 21.25C19.0863 20.8636 18.6227 20.7091 18.2363 20.9409C16.459 21.9455 15.3 23.5682 14.8363 25.5H11.5909C11.1272 25.5 10.8181 25.8091 10.8181 26.2727C10.8181 26.7364 11.1272 27.0455 11.5909 27.0455H14.6818C14.6818 30.9091 17.7727 34 21.6363 34C25.5 34 28.5909 30.9091 28.5909 27.0455C28.5909 23.4909 25.8863 20.5545 22.409 20.1682Z" fill="#ACACAD"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="34" height="34" fill="white"/>
</clipPath>
</defs>
</svg>
`,backgroundColor:"transparent"}},viz_Mq69Fdyn:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.5,fillColor:"#1A1C20"}},viz_5183dBun:{type:"splunk.markdown",options:{markdown:"## Room Temperature"}},viz_NV0gv5cl:{type:"splunk.choropleth.svg",options:{svg:`<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path d="M3.09082 21.6364C3.09082 22.6409 3.709 23.4909 4.63627 23.8V27.0455C4.63627 27.5091 4.94537 27.8182 5.409 27.8182C5.87264 27.8182 6.18173 27.5091 6.18173 27.0455V23.9545H12.3635C12.8272 23.9545 13.1363 23.6455 13.1363 23.1818C13.1363 22.7182 12.8272 22.4091 12.3635 22.4091H5.409C4.94537 22.4091 4.63627 22.1 4.63627 21.6364C4.63627 21.1727 4.94537 20.8636 5.409 20.8636H10.0454C10.509 20.8636 10.8181 20.5545 10.8181 20.0909C10.8181 19.6273 10.509 19.3182 10.0454 19.3182H6.18173V14.6818H9.27264C9.73628 14.6818 10.0454 14.3727 10.0454 13.9091C10.0454 13.4455 9.73628 13.1364 9.27264 13.1364H5.409C4.94537 13.1364 4.63627 12.8273 4.63627 12.3636C4.63627 11.9 4.94537 11.5909 5.409 11.5909H12.3635C12.8272 11.5909 13.1363 11.2818 13.1363 10.8182C13.1363 10.3545 12.8272 10.0455 12.3635 10.0455H6.18173V3.86364C6.18173 3.4 5.87264 3.09091 5.409 3.09091C4.94537 3.09091 4.63627 2.78182 4.63627 2.31818C4.63627 1.85455 4.94537 1.54545 5.409 1.54545H28.5908C29.0545 1.54545 29.3635 1.85455 29.3635 2.31818C29.3635 2.78182 29.0545 3.09091 28.5908 3.09091H8.49991C8.03627 3.09091 7.72718 3.4 7.72718 3.86364C7.72718 4.32727 8.03627 4.63636 8.49991 4.63636H28.5908C29.9045 4.63636 30.909 3.63182 30.909 2.31818C30.909 1.00455 29.9045 0 28.5908 0H5.409C4.09537 0 3.09082 1.00455 3.09082 2.31818C3.09082 3.32273 3.709 4.17273 4.63627 4.48182V10.2C3.709 10.5091 3.09082 11.3591 3.09082 12.3636C3.09082 13.3682 3.709 14.2182 4.63627 14.5273V19.4727C3.709 19.7818 3.09082 20.6318 3.09082 21.6364Z" fill="#ACACAD"/>
<path d="M16.3817 11.9001C16.0726 12.3638 13.1362 16.3819 13.1362 18.7001C13.1362 20.7865 14.8362 22.4092 16.9999 22.4092C19.1635 22.4092 20.8635 20.7092 20.8635 18.7001C20.8635 16.3819 17.9271 12.3638 17.618 11.9001C17.309 11.5138 16.6908 11.5138 16.3817 11.9001ZM19.318 18.7001C19.318 19.9365 18.3135 20.8638 16.9999 20.8638C15.6862 20.8638 14.6817 19.8592 14.6817 18.7001C14.6817 17.6183 15.918 15.3774 16.9999 13.7547C18.0817 15.3001 19.318 17.541 19.318 18.7001Z" fill="#ACACAD"/>
<path d="M30.909 12.3637C30.909 11.3592 30.2908 10.5092 29.3635 10.2001V6.95461C29.3635 6.49098 29.0545 6.18188 28.5908 6.18188C28.1272 6.18188 27.8181 6.49098 27.8181 6.95461V10.0455H21.6363C21.1726 10.0455 20.8635 10.3546 20.8635 10.8182C20.8635 11.2819 21.1726 11.591 21.6363 11.591H28.5908C29.0545 11.591 29.3635 11.9001 29.3635 12.3637C29.3635 12.8273 29.0545 13.1364 28.5908 13.1364H25.4999C25.0363 13.1364 24.7272 13.4455 24.7272 13.9092C24.7272 14.3728 25.0363 14.6819 25.4999 14.6819H27.8181V19.3182H25.4999C25.0363 19.3182 24.7272 19.6273 24.7272 20.091C24.7272 20.5546 25.0363 20.8637 25.4999 20.8637H28.5908C29.0545 20.8637 29.3635 21.1728 29.3635 21.6364C29.3635 22.1001 29.0545 22.4092 28.5908 22.4092H23.1817C22.7181 22.4092 22.409 22.7182 22.409 23.1819C22.409 23.6455 22.7181 23.9546 23.1817 23.9546H27.8181V30.1364C27.8181 30.6001 28.1272 30.9092 28.5908 30.9092C29.0545 30.9092 29.3635 31.2182 29.3635 31.6819C29.3635 32.1455 29.0545 32.4546 28.5908 32.4546H5.409C4.94537 32.4546 4.63627 32.1455 4.63627 31.6819C4.63627 31.2182 4.94537 30.9092 5.409 30.9092H25.4999C25.9635 30.9092 26.2726 30.6001 26.2726 30.1364C26.2726 29.6728 25.9635 29.3637 25.4999 29.3637H5.409C4.09537 29.3637 3.09082 30.3682 3.09082 31.6819C3.09082 32.9955 4.09537 34.0001 5.409 34.0001H28.5908C29.9045 34.0001 30.909 32.9955 30.909 31.6819C30.909 30.6773 30.2908 29.8273 29.3635 29.5182V23.8001C30.2908 23.491 30.909 22.641 30.909 21.6364C30.909 20.6319 30.2908 19.7819 29.3635 19.4728V14.5273C30.2908 14.2182 30.909 13.3682 30.909 12.3637Z" fill="#ACACAD"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="34" height="34" fill="white"/>
</clipPath>
</defs>
</svg>
`,backgroundColor:"transparent"}},viz_QvsFMX54:{type:"splunk.markdown",options:{markdown:"## Water Capacity"}},viz_Owlm3nQj:{type:"splunk.choropleth.svg",dataSources:{primary:"ds_FZspy2J5"},context:{areaColorsEditorConfig:[{match:"On",value:"url(#paint0_radial)"},{match:"Off",value:"none)"}]},options:{svg:`<svg width="82" height="97" viewBox="0 0 82 97" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="fan" fill-rule="evenodd" clip-rule="evenodd" d="M82 19V78C82 88.4934 63.6437 97 41 97C18.3563 97 0 88.4934 0 78V19C0 8.50659 18.3563 0 41 0C63.6437 0 82 8.50659 82 19Z" fill="url(#paint0_radial)"/>
<defs>
<radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41 97) rotate(-90) scale(60.5 59)">
<stop stop-color="#61CAFA"/>
<stop offset="1" stop-color="#61CAFA" stop-opacity="0"/>
</radialGradient>
</defs>
</svg>
`,areaColors:"> areaValues | matchValue(areaColorsEditorConfig)",backgroundColor:"transparent",areaIds:"> primary | seriesByName('fan')",areaValues:"> primary | seriesByName('status')"}},viz_uMsD9U29:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.5,fillColor:"#1A1C20"}},viz_sh2FGEJo:{type:"splunk.table",options:{tableFormat:{rowColors:"> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",headerColor:"> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)",headerBackgroundColor:"#5cb3f2",rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableRowBackgroundColorsByBackgroundColor)"},backgroundColor:"transparent"},dataSources:{primary:"ds_33Mhcgkk"}},viz_RodDAMCa:{type:"splunk.markdown",options:{markdown:"## HVAC - 2"}},viz_jrwJjbh3:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('3B')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_NFgVlgyR:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#5cb3f2"}},viz_LiC3o5UB:{type:"splunk.markdown",options:{markdown:"# **Datacenter Sensors**"}},viz_g5GyUgld:{type:"splunk.table",options:{count:6,tableFormat:{rowColors:"> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",headerColor:"> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)",headerBackgroundColor:"#5cb3f2",rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableRowBackgroundColorsByBackgroundColor)"},backgroundColor:"transparent"},dataSources:{primary:"ds_tmBqJ9ha_ds_33Mhcgkk"}},viz_Apx34i44:{type:"splunk.singlevalue",options:{showSparklineAreaGraph:!0,majorFontSize:54,trendColor:"> trendValue | rangeValue(trendColorEditorConfig)",sparklineAreaColor:"> sparklineStrokeColor",backgroundColor:"transparent",trendFontSize:24,trendDisplay:"percent",sparklineStrokeColor:"> trendColor"},context:{trendColorEditorConfig:[{to:0,value:"#FE3A3A"},{from:0,value:"#5cb3f2"}]},dataSources:{primary:"ds_abKnpfzZ"}},viz_pHvn1tuj:{type:"splunk.markdown",options:{markdown:"####  Safe 0\xB0-50\xB0",fontColor:"#AEAFB1"}},viz_UqheLYEr:{type:"splunk.ellipse",options:{strokeColor:"transparent",fillColor:"#43454B"},context:{},showProgressBar:!1,showLastUpdated:!1},viz_c1tm37dG:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('5B')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_8X4cRgh0:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.8,fillColor:"#1A1C20"}},viz_RZ1m5Ubz:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('4A')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_pgULSQZ3:{dataSources:{primary:"ds_FZspy2J5"},type:"splunk.singlevalue",options:{majorFontSize:14,backgroundColor:"transparent",sparklineDisplay:"off",trendDisplay:"off",majorColor:"> majorValue | rangeValue(majorColorEditorConfig)"},context:{majorColorEditorConfig:[{from:1,value:"#62C9FA"},{value:"#818285",to:1}]}},viz_gnLaI5Bb:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('3C')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_YIsgPKsx:{type:"splunk.choropleth.svg",options:{svg:`<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path d="M26.9681 11.9773C26.8135 11.7455 26.5817 11.5909 26.2726 11.5909H20.5544L25.4226 1.08182C25.4999 0.85 25.4999 0.540909 25.3454 0.309091C25.1908 0.0772727 24.959 0 24.7272 0H16.2272C15.7635 0 15.4544 0.309091 15.4544 0.772727C15.4544 1.23636 15.7635 1.54545 16.2272 1.54545H23.4908L18.6226 12.0545C18.5454 12.2864 18.5454 12.5955 18.6999 12.8273C18.8544 13.0591 19.0863 13.1364 19.3181 13.1364H24.8044L13.909 29.4409L16.2272 18.7C16.3044 18.4682 16.2272 18.2364 16.0726 18.0818C15.9181 17.85 15.6863 17.7727 15.4544 17.7727H8.73171L13.909 1.00455C14.0635 0.618182 13.8317 0.154545 13.3681 0.0772727C12.9817 -0.0772727 12.5181 0.154545 12.4408 0.618182L7.03171 18.3909C6.95444 18.5455 6.95444 18.7773 7.10899 19.0091C7.26353 19.1636 7.49535 19.3182 7.72717 19.3182H14.5272L11.5908 33.0727C11.5135 33.4591 11.6681 33.7682 12.0544 33.9227C12.1317 34 12.2863 34 12.3635 34C12.5954 34 12.8272 33.8455 12.9817 33.6909L26.8908 12.8273C27.0454 12.5182 27.1226 12.2864 26.9681 11.9773Z" fill="#ACACAD"/>
<path d="M13.2138 7.49544L10.8956 14.45C10.741 14.8364 10.9728 15.3 11.3592 15.4545C11.4365 15.4545 11.5138 15.5318 11.591 15.5318C11.9001 15.5318 12.2092 15.3 12.2865 14.9909L14.6047 8.03635C14.7592 7.64999 14.5274 7.18635 14.141 7.03181C13.7547 6.87726 13.291 7.10908 13.2138 7.49544Z" fill="#ACACAD"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="34" height="34" fill="white"/>
</clipPath>
</defs>
</svg>
`,backgroundColor:"transparent"}},viz_xZCOfgz8:{type:"splunk.markdown",options:{markdown:"## Anomalies Detected"}},viz_XhOQlSx9:{type:"splunk.singlevalue",dataSources:{primary:"ds_8qwizlRA_ds_FZspy2J5"},options:{majorFontSize:14,backgroundColor:"transparent",sparklineDisplay:"off",trendDisplay:"off",majorColor:"> majorValue | matchValue(majorColorEditorConfig)",sparklineValues:"> primary | seriesByName('status')"},context:{majorColorEditorConfig:[{match:"Off",value:"#505158"},{value:"#62C9FA",match:"On"}]}},viz_DGzy6QpW:{type:"splunk.choropleth.svg",dataSources:{primary:"ds_6zvrUOR6"},options:{svg:`<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect id="fan" width="25" height="25" fill="url(#pattern1)"/>
<pattern id="pattern0" width="25" height="25">
<path d="M22.1693 19.2562C23.6316 17.1974 24.4171 14.7346 24.4171 12.2093C24.4171 9.684 23.6316 7.22124 22.1693 5.16236L23.8153 3.51639C24.2016 3.13009 24.4186 2.60616 24.4186 2.05985C24.4186 1.51355 24.2016 0.989615 23.8153 0.603317C23.429 0.21702 22.9051 0 22.3588 0C21.8124 0 21.2885 0.21702 20.9022 0.603317L19.2562 2.24929C17.1974 0.787041 14.7346 0.00147748 12.2093 0.00147748C9.684 0.00147748 7.22124 0.787041 5.16236 2.24929L3.51639 0.603317C3.13009 0.21702 2.60616 -5.75628e-09 2.05985 0C1.51355 5.75628e-09 0.989615 0.21702 0.603317 0.603317C0.21702 0.989615 5.75628e-09 1.51355 0 2.05985C-5.75628e-09 2.60616 0.21702 3.13009 0.603317 3.51639L2.24929 5.16236C0.787041 7.22124 0.00147748 9.684 0.00147748 12.2093C0.00147748 14.7346 0.787041 17.1974 2.24929 19.2562L0.603317 20.9022C0.21702 21.2885 0 21.8124 0 22.3588C0 22.9051 0.21702 23.429 0.603317 23.8153C0.989615 24.2016 1.51355 24.4186 2.05985 24.4186C2.60616 24.4186 3.13009 24.2016 3.51639 23.8153L5.16236 22.1693C7.22124 23.6316 9.684 24.4171 12.2093 24.4171C14.7346 24.4171 17.1974 23.6316 19.2562 22.1693L20.9022 23.8153C21.2885 24.2016 21.8124 24.4186 22.3588 24.4186C22.9051 24.4186 23.429 24.2016 23.8153 23.8153C24.2016 23.429 24.4186 22.9051 24.4186 22.3588C24.4186 21.8124 24.2016 21.2885 23.8153 20.9022L22.1693 19.2562ZM21.5 1.20109C21.7301 0.97786 22.0381 0.853018 22.3588 0.853018C22.6794 0.853018 22.9874 0.97786 23.2175 1.20109C23.3305 1.31372 23.4202 1.44756 23.4814 1.59493C23.5426 1.74229 23.5741 1.90029 23.5741 2.05985C23.5741 2.21942 23.5426 2.37742 23.4814 2.52478C23.4202 2.67215 23.3305 2.80599 23.2175 2.91862L21.66 4.4804C21.6305 4.44251 21.5968 4.41304 21.5673 4.37937C21.1054 3.82341 20.5939 3.31053 20.0392 2.84706L19.9382 2.75865L21.5 1.20109ZM1.20109 1.20109C1.31344 1.08755 1.44718 0.997427 1.59459 0.935916C1.74199 0.874406 1.90013 0.842735 2.05985 0.842735C2.21958 0.842735 2.37772 0.874406 2.52512 0.935916C2.67253 0.997427 2.80627 1.08755 2.91862 1.20109L4.4804 2.75865L4.37937 2.84706C3.82564 3.31158 3.31427 3.82437 2.85127 4.37937C2.8218 4.41304 2.78812 4.44251 2.75865 4.4804L1.20109 2.91862C1.08806 2.80599 0.998381 2.67215 0.93719 2.52478C0.875999 2.37742 0.8445 2.21942 0.8445 2.05985C0.8445 1.90029 0.875999 1.74229 0.93719 1.59493C0.998381 1.44756 1.08806 1.31372 1.20109 1.20109ZM2.91862 23.2175C2.68798 23.4398 2.38015 23.5639 2.05985 23.5639C1.73956 23.5639 1.43173 23.4398 1.20109 23.2175C1.08806 23.1049 0.998381 22.9711 0.93719 22.8237C0.875999 22.6763 0.8445 22.5183 0.8445 22.3588C0.8445 22.1992 0.875999 22.0412 0.93719 21.8938C0.998381 21.7465 1.08806 21.6126 1.20109 21.5L2.75865 19.9382C2.78812 19.9761 2.8218 20.0056 2.85127 20.0392C3.31321 20.5952 3.82468 21.1081 4.37937 21.5716C4.41304 21.5968 4.44251 21.6305 4.4804 21.66L2.91862 23.2175ZM5.36442 21.2853C4.52115 20.6483 3.77029 19.8975 3.13331 19.0542C1.64577 17.0822 0.841107 14.6794 0.841107 12.2093C0.841107 9.73922 1.64577 7.33636 3.13331 5.36442C3.29328 5.15394 3.45746 4.94346 3.63005 4.74982C4.15073 4.15246 4.73196 3.61073 5.36442 3.13331C7.33599 1.64677 9.73802 0.842695 12.2072 0.842695C14.6764 0.842695 17.0784 1.64677 19.05 3.13331C19.8933 3.77029 20.6441 4.52115 21.2811 5.36442C22.7686 7.33636 23.5733 9.73922 23.5733 12.2093C23.5733 14.6794 22.7686 17.0822 21.2811 19.0542C20.6441 19.8975 19.8933 20.6483 19.05 21.2853C17.0784 22.7718 14.6764 23.5759 12.2072 23.5759C9.73802 23.5759 7.33599 22.7718 5.36442 21.2853ZM23.2175 23.2175C22.9869 23.4398 22.6791 23.5639 22.3588 23.5639C22.0385 23.5639 21.7306 23.4398 21.5 23.2175L19.9382 21.66L20.0392 21.5716C20.593 21.107 21.1043 20.5942 21.5673 20.0392C21.5968 20.0056 21.6305 19.9761 21.66 19.9382L23.2175 21.5C23.3305 21.6126 23.4202 21.7465 23.4814 21.8938C23.5426 22.0412 23.5741 22.1992 23.5741 22.3588C23.5741 22.5183 23.5426 22.6763 23.4814 22.8237C23.4202 22.9711 23.3305 23.1049 23.2175 23.2175Z" fill="#ACACAD"/>
<path d="M19.4541 15.8675C19.5807 15.8892 19.7088 15.9004 19.8372 15.9012C20.3566 15.9044 20.8589 15.7155 21.2474 15.3708C21.7195 14.9677 22.0951 14.4638 22.3465 13.8963C22.5978 13.3287 22.7186 12.7119 22.6998 12.0914C22.6611 11.0286 22.2216 10.0198 21.4696 9.26776C20.7175 8.51572 19.7087 8.07621 18.6459 8.03756C17.8103 8.01402 16.987 8.24228 16.2828 8.69271C15.5786 9.14313 15.0262 9.7949 14.6972 10.5633C14.3906 10.1091 13.9675 9.74556 13.4722 9.51094V9.44779C13.3467 8.91345 13.3969 8.35288 13.6153 7.84932C13.8337 7.34576 14.2087 6.92607 14.6846 6.65259C14.9937 6.47652 15.2601 6.23425 15.4646 5.94314C15.6691 5.65202 15.8067 5.31927 15.8675 4.96873C15.9255 4.65171 15.9109 4.32568 15.8249 4.01509C15.7388 3.70451 15.5836 3.41744 15.3708 3.17542C14.9677 2.70332 14.4638 2.32773 13.8963 2.07637C13.3287 1.825 12.7119 1.70428 12.0914 1.7231C11.0286 1.76175 10.0198 2.20126 9.26776 2.95329C8.51572 3.70533 8.07621 4.71415 8.03756 5.77698C8.01402 6.61255 8.24228 7.43589 8.69271 8.14006C9.14313 8.84422 9.7949 9.39667 10.5633 9.72563C10.1096 10.0311 9.74618 10.4527 9.51094 10.9464H9.44779C8.91345 11.0726 8.35262 11.0228 7.8489 10.8043C7.34519 10.5858 6.92557 10.2104 6.65259 9.73405C6.47652 9.4249 6.23425 9.15853 5.94314 8.95402C5.65202 8.74951 5.31927 8.61193 4.96873 8.55114C4.65171 8.49286 4.3256 8.50728 4.01497 8.59333C3.70433 8.67937 3.41728 8.83479 3.17542 9.04788C2.70332 9.45092 2.32773 9.95481 2.07637 10.5224C1.825 11.09 1.70428 11.7067 1.7231 12.3272C1.76175 13.39 2.20126 14.3988 2.95329 15.1509C3.70533 15.9029 4.71415 16.3424 5.77698 16.3811H5.89485C6.71061 16.3817 7.50856 16.1426 8.18961 15.6936C8.87065 15.2445 9.40477 14.6053 9.72563 13.8553C10.0311 14.309 10.4527 14.6725 10.9464 14.9077V14.9708C11.0719 15.5052 11.0218 16.0658 10.8034 16.5693C10.585 17.0729 10.21 17.4926 9.73405 17.7661C9.4249 17.9421 9.15853 18.1844 8.95402 18.4755C8.74951 18.7666 8.61193 19.0994 8.55114 19.4499C8.49317 19.7669 8.50775 20.093 8.59378 20.4035C8.67981 20.7141 8.83506 21.0012 9.04788 21.2432C9.4376 21.7008 9.92225 22.0682 10.4682 22.3197C11.0141 22.5712 11.6082 22.7009 12.2093 22.6998H12.3272C13.39 22.6611 14.3988 22.2216 15.1509 21.4696C15.9029 20.7175 16.3424 19.7087 16.3811 18.6459C16.3982 18.088 16.3026 17.5325 16.1001 17.0124C15.8976 16.4924 15.5922 16.0185 15.2024 15.6191C14.8216 15.2271 14.3684 14.9126 13.8679 14.693C14.3178 14.3868 14.677 13.9651 14.9077 13.4722H14.9708C15.5052 13.3467 16.0658 13.3969 16.5693 13.6153C17.0729 13.8337 17.4926 14.2087 17.7661 14.6846C17.9426 14.9942 18.1855 15.2609 18.4774 15.4654C18.7692 15.67 19.1028 15.8073 19.4541 15.8675ZM9.82245 8.21437C9.51102 7.8956 9.26702 7.51734 9.10501 7.10219C8.943 6.68703 8.8663 6.24349 8.87949 5.79803C8.9117 4.95048 9.26254 4.14628 9.86189 3.54615C10.4612 2.94601 11.265 2.59413 12.1125 2.56082H12.2093C12.689 2.55941 13.1633 2.66219 13.5994 2.86207C14.0355 3.06195 14.423 3.35415 14.7351 3.71847C14.8648 3.86883 14.9593 4.04625 15.0118 4.23778C15.0642 4.42932 15.0732 4.63014 15.0382 4.82561C14.9968 5.05407 14.9061 5.27076 14.7723 5.46053C14.6385 5.6503 14.4649 5.80858 14.2636 5.92432C13.7504 6.22604 13.325 6.65672 13.0296 7.17363C12.7342 7.69055 12.5791 8.27572 12.5798 8.87107C12.5736 8.98184 12.5736 9.09287 12.5798 9.20363C12.4564 9.20992 12.3327 9.20992 12.2093 9.20363C11.7653 9.20848 11.3249 9.12332 10.9146 8.9533C10.5044 8.78328 10.1329 8.53191 9.82245 8.21437ZM8.21437 14.5962C7.89496 14.9079 7.51599 15.1521 7.10011 15.3141C6.68422 15.4761 6.23995 15.5527 5.79382 15.5391C4.94701 15.5059 4.14386 15.1546 3.54461 14.5554C2.94535 13.9561 2.59406 13.153 2.56082 12.3061C2.54568 11.8103 2.6418 11.3173 2.84213 10.8635C3.04246 10.4097 3.3419 10.0065 3.71847 9.68353C3.9592 9.47481 4.26704 9.35975 4.58566 9.35939C4.66607 9.36013 4.74629 9.36717 4.82561 9.38044C5.05407 9.42182 5.27076 9.51257 5.46053 9.64636C5.6503 9.78014 5.80858 9.95373 5.92432 10.155C6.2498 10.7215 6.73212 11.1819 7.31318 11.4806C7.89425 11.7794 8.54929 11.9038 9.19942 11.8389C9.19942 11.9652 9.19942 12.0872 9.19942 12.2093C9.20361 12.6529 9.11857 13.0928 8.94934 13.5028C8.78012 13.9129 8.53017 14.2847 8.21437 14.5962ZM14.5962 16.2043C14.9076 16.523 15.1516 16.9013 15.3136 17.3165C15.4756 17.7316 15.5523 18.1752 15.5391 18.6206C15.5212 19.293 15.3 19.9442 14.9048 20.4884C14.5095 21.0327 13.9587 21.4444 13.3249 21.6695C12.691 21.8946 12.0039 21.9225 11.3539 21.7495C10.7039 21.5764 10.1216 21.2106 9.68353 20.7002C9.55382 20.5498 9.4593 20.3724 9.40686 20.1809C9.35443 19.9893 9.3454 19.7885 9.38044 19.593C9.42202 19.3641 9.51331 19.1471 9.64787 18.9572C9.78242 18.7674 9.95698 18.6094 10.1592 18.4943C10.6722 18.1923 11.0974 17.7615 11.3927 17.2447C11.688 16.7278 11.8433 16.1428 11.8431 15.5476C11.8493 15.4368 11.8493 15.3258 11.8431 15.215C11.9651 15.2087 12.0873 15.2087 12.2093 15.215H12.243C12.6817 15.2128 13.1163 15.2993 13.5206 15.4693C13.925 15.6393 14.2909 15.8893 14.5962 16.2043ZM12.2093 14.3562C11.7847 14.3562 11.3696 14.2303 11.0166 13.9944C10.6635 13.7585 10.3883 13.4232 10.2258 13.0309C10.0633 12.6386 10.0208 12.2069 10.1037 11.7905C10.1865 11.374 10.391 10.9915 10.6912 10.6912C10.9915 10.391 11.374 10.1865 11.7905 10.1037C12.2069 10.0208 12.6386 10.0633 13.0309 10.2258C13.4232 10.3883 13.7585 10.6635 13.9944 11.0166C14.2303 11.3696 14.3562 11.7847 14.3562 12.2093C14.3551 12.7784 14.1286 13.3238 13.7262 13.7262C13.3238 14.1286 12.7784 14.3551 12.2093 14.3562ZM15.5518 12.5629C15.441 12.5567 15.33 12.5567 15.2192 12.5629C15.2192 12.4366 15.2192 12.3146 15.2192 12.1925C15.219 11.7469 15.3083 11.3059 15.4816 10.8954C15.655 10.485 15.9089 10.1135 16.2285 9.80303C16.548 9.49253 16.9266 9.24931 17.3418 9.08778C17.7571 8.92625 18.2005 8.8497 18.6459 8.86265C19.4927 8.8959 20.2958 9.24719 20.8951 9.84644C21.4943 10.4457 21.8456 11.2488 21.8789 12.0957C21.894 12.596 21.7958 13.0933 21.5917 13.5503C21.3876 14.0074 21.0828 14.4124 20.7002 14.7351C20.55 14.8651 20.3726 14.9598 20.181 15.0122C19.9894 15.0647 19.7885 15.0735 19.593 15.0382C19.3646 14.9968 19.1479 14.9061 18.9581 14.7723C18.7683 14.6385 18.6101 14.4649 18.4943 14.2636C18.1951 13.7479 17.766 13.3195 17.2497 13.0211C16.7335 12.7227 16.1481 12.5648 15.5518 12.5629Z" fill="#ACACAD"/>
<path d="M12.2094 10.6516C11.9014 10.6516 11.6002 10.743 11.3441 10.9141C11.0879 11.0853 10.8883 11.3285 10.7704 11.6131C10.6525 11.8977 10.6217 12.2109 10.6818 12.513C10.7419 12.8152 10.8902 13.0927 11.1081 13.3105C11.3259 13.5284 11.6034 13.6767 11.9056 13.7368C12.2077 13.7969 12.5209 13.7661 12.8055 13.6482C13.0901 13.5303 13.3333 13.3307 13.5045 13.0745C13.6756 12.8184 13.767 12.5172 13.767 12.2092C13.767 11.7961 13.6029 11.3999 13.3108 11.1078C13.0187 10.8157 12.6225 10.6516 12.2094 10.6516ZM12.2094 12.9248C12.0679 12.9248 11.9295 12.8828 11.8118 12.8042C11.6942 12.7256 11.6024 12.6138 11.5483 12.483C11.4941 12.3523 11.4799 12.2084 11.5075 12.0696C11.5351 11.9307 11.6033 11.8032 11.7034 11.7031C11.8035 11.6031 11.931 11.5349 12.0698 11.5073C12.2086 11.4797 12.3525 11.4939 12.4833 11.548C12.6141 11.6022 12.7258 11.6939 12.8045 11.8116C12.8831 11.9293 12.9251 12.0676 12.9251 12.2092C12.9251 12.399 12.8497 12.581 12.7155 12.7152C12.5812 12.8494 12.3992 12.9248 12.2094 12.9248Z" fill="#ACACAD"/>
</pattern>
<pattern id="pattern1" width="25" height="25">
<path d="M22.1693 19.2562C23.6316 17.1974 24.4171 14.7346 24.4171 12.2093C24.4171 9.684 23.6316 7.22124 22.1693 5.16236L23.8153 3.51639C24.2016 3.13009 24.4186 2.60616 24.4186 2.05985C24.4186 1.51355 24.2016 0.989615 23.8153 0.603317C23.429 0.21702 22.9051 0 22.3588 0C21.8124 0 21.2885 0.21702 20.9022 0.603317L19.2562 2.24929C17.1974 0.787041 14.7346 0.00147748 12.2093 0.00147748C9.684 0.00147748 7.22124 0.787041 5.16236 2.24929L3.51639 0.603317C3.13009 0.21702 2.60616 -5.75628e-09 2.05985 0C1.51355 5.75628e-09 0.989615 0.21702 0.603317 0.603317C0.21702 0.989615 5.75628e-09 1.51355 0 2.05985C-5.75628e-09 2.60616 0.21702 3.13009 0.603317 3.51639L2.24929 5.16236C0.787041 7.22124 0.00147748 9.684 0.00147748 12.2093C0.00147748 14.7346 0.787041 17.1974 2.24929 19.2562L0.603317 20.9022C0.21702 21.2885 0 21.8124 0 22.3588C0 22.9051 0.21702 23.429 0.603317 23.8153C0.989615 24.2016 1.51355 24.4186 2.05985 24.4186C2.60616 24.4186 3.13009 24.2016 3.51639 23.8153L5.16236 22.1693C7.22124 23.6316 9.684 24.4171 12.2093 24.4171C14.7346 24.4171 17.1974 23.6316 19.2562 22.1693L20.9022 23.8153C21.2885 24.2016 21.8124 24.4186 22.3588 24.4186C22.9051 24.4186 23.429 24.2016 23.8153 23.8153C24.2016 23.429 24.4186 22.9051 24.4186 22.3588C24.4186 21.8124 24.2016 21.2885 23.8153 20.9022L22.1693 19.2562ZM21.5 1.20109C21.7301 0.97786 22.0381 0.853018 22.3588 0.853018C22.6794 0.853018 22.9874 0.97786 23.2175 1.20109C23.3305 1.31372 23.4202 1.44756 23.4814 1.59493C23.5426 1.74229 23.5741 1.90029 23.5741 2.05985C23.5741 2.21942 23.5426 2.37742 23.4814 2.52478C23.4202 2.67215 23.3305 2.80599 23.2175 2.91862L21.66 4.4804C21.6305 4.44251 21.5968 4.41304 21.5673 4.37937C21.1054 3.82341 20.5939 3.31053 20.0392 2.84706L19.9382 2.75865L21.5 1.20109ZM1.20109 1.20109C1.31344 1.08755 1.44718 0.997427 1.59459 0.935916C1.74199 0.874406 1.90013 0.842735 2.05985 0.842735C2.21958 0.842735 2.37772 0.874406 2.52512 0.935916C2.67253 0.997427 2.80627 1.08755 2.91862 1.20109L4.4804 2.75865L4.37937 2.84706C3.82564 3.31158 3.31427 3.82437 2.85127 4.37937C2.8218 4.41304 2.78812 4.44251 2.75865 4.4804L1.20109 2.91862C1.08806 2.80599 0.998381 2.67215 0.93719 2.52478C0.875999 2.37742 0.8445 2.21942 0.8445 2.05985C0.8445 1.90029 0.875999 1.74229 0.93719 1.59493C0.998381 1.44756 1.08806 1.31372 1.20109 1.20109ZM2.91862 23.2175C2.68798 23.4398 2.38015 23.5639 2.05985 23.5639C1.73956 23.5639 1.43173 23.4398 1.20109 23.2175C1.08806 23.1049 0.998381 22.9711 0.93719 22.8237C0.875999 22.6763 0.8445 22.5183 0.8445 22.3588C0.8445 22.1992 0.875999 22.0412 0.93719 21.8938C0.998381 21.7465 1.08806 21.6126 1.20109 21.5L2.75865 19.9382C2.78812 19.9761 2.8218 20.0056 2.85127 20.0392C3.31321 20.5952 3.82468 21.1081 4.37937 21.5716C4.41304 21.5968 4.44251 21.6305 4.4804 21.66L2.91862 23.2175ZM5.36442 21.2853C4.52115 20.6483 3.77029 19.8975 3.13331 19.0542C1.64577 17.0822 0.841107 14.6794 0.841107 12.2093C0.841107 9.73922 1.64577 7.33636 3.13331 5.36442C3.29328 5.15394 3.45746 4.94346 3.63005 4.74982C4.15073 4.15246 4.73196 3.61073 5.36442 3.13331C7.33599 1.64677 9.73802 0.842695 12.2072 0.842695C14.6764 0.842695 17.0784 1.64677 19.05 3.13331C19.8933 3.77029 20.6441 4.52115 21.2811 5.36442C22.7686 7.33636 23.5733 9.73922 23.5733 12.2093C23.5733 14.6794 22.7686 17.0822 21.2811 19.0542C20.6441 19.8975 19.8933 20.6483 19.05 21.2853C17.0784 22.7718 14.6764 23.5759 12.2072 23.5759C9.73802 23.5759 7.33599 22.7718 5.36442 21.2853ZM23.2175 23.2175C22.9869 23.4398 22.6791 23.5639 22.3588 23.5639C22.0385 23.5639 21.7306 23.4398 21.5 23.2175L19.9382 21.66L20.0392 21.5716C20.593 21.107 21.1043 20.5942 21.5673 20.0392C21.5968 20.0056 21.6305 19.9761 21.66 19.9382L23.2175 21.5C23.3305 21.6126 23.4202 21.7465 23.4814 21.8938C23.5426 22.0412 23.5741 22.1992 23.5741 22.3588C23.5741 22.5183 23.5426 22.6763 23.4814 22.8237C23.4202 22.9711 23.3305 23.1049 23.2175 23.2175Z" fill="#61CAFA"/>
<path d="M19.4541 15.8675C19.5807 15.8892 19.7088 15.9004 19.8372 15.9012C20.3566 15.9044 20.8589 15.7155 21.2474 15.3708C21.7195 14.9677 22.0951 14.4638 22.3465 13.8963C22.5978 13.3287 22.7186 12.7119 22.6998 12.0914C22.6611 11.0286 22.2216 10.0198 21.4696 9.26776C20.7175 8.51572 19.7087 8.07621 18.6459 8.03756C17.8103 8.01402 16.987 8.24228 16.2828 8.69271C15.5786 9.14313 15.0262 9.7949 14.6972 10.5633C14.3906 10.1091 13.9675 9.74556 13.4722 9.51094V9.44779C13.3467 8.91345 13.3969 8.35288 13.6153 7.84932C13.8337 7.34576 14.2087 6.92607 14.6846 6.65259C14.9937 6.47652 15.2601 6.23425 15.4646 5.94314C15.6691 5.65202 15.8067 5.31927 15.8675 4.96873C15.9255 4.65171 15.9109 4.32568 15.8249 4.01509C15.7388 3.70451 15.5836 3.41744 15.3708 3.17542C14.9677 2.70332 14.4638 2.32773 13.8963 2.07637C13.3287 1.825 12.7119 1.70428 12.0914 1.7231C11.0286 1.76175 10.0198 2.20126 9.26776 2.95329C8.51572 3.70533 8.07621 4.71415 8.03756 5.77698C8.01402 6.61255 8.24228 7.43589 8.69271 8.14006C9.14313 8.84422 9.7949 9.39667 10.5633 9.72563C10.1096 10.0311 9.74618 10.4527 9.51094 10.9464H9.44779C8.91345 11.0726 8.35262 11.0228 7.8489 10.8043C7.34519 10.5858 6.92557 10.2104 6.65259 9.73405C6.47652 9.4249 6.23425 9.15853 5.94314 8.95402C5.65202 8.74951 5.31927 8.61193 4.96873 8.55114C4.65171 8.49286 4.3256 8.50728 4.01497 8.59333C3.70433 8.67937 3.41728 8.83479 3.17542 9.04788C2.70332 9.45092 2.32773 9.95481 2.07637 10.5224C1.825 11.09 1.70428 11.7067 1.7231 12.3272C1.76175 13.39 2.20126 14.3988 2.95329 15.1509C3.70533 15.9029 4.71415 16.3424 5.77698 16.3811H5.89485C6.71061 16.3817 7.50856 16.1426 8.18961 15.6936C8.87065 15.2445 9.40477 14.6053 9.72563 13.8553C10.0311 14.309 10.4527 14.6725 10.9464 14.9077V14.9708C11.0719 15.5052 11.0218 16.0658 10.8034 16.5693C10.585 17.0729 10.21 17.4926 9.73405 17.7661C9.4249 17.9421 9.15853 18.1844 8.95402 18.4755C8.74951 18.7666 8.61193 19.0994 8.55114 19.4499C8.49317 19.7669 8.50775 20.093 8.59378 20.4035C8.67981 20.7141 8.83506 21.0012 9.04788 21.2432C9.4376 21.7008 9.92225 22.0682 10.4682 22.3197C11.0141 22.5712 11.6082 22.7009 12.2093 22.6998H12.3272C13.39 22.6611 14.3988 22.2216 15.1509 21.4696C15.9029 20.7175 16.3424 19.7087 16.3811 18.6459C16.3982 18.088 16.3026 17.5325 16.1001 17.0124C15.8976 16.4924 15.5922 16.0185 15.2024 15.6191C14.8216 15.2271 14.3684 14.9126 13.8679 14.693C14.3178 14.3868 14.677 13.9651 14.9077 13.4722H14.9708C15.5052 13.3467 16.0658 13.3969 16.5693 13.6153C17.0729 13.8337 17.4926 14.2087 17.7661 14.6846C17.9426 14.9942 18.1855 15.2609 18.4774 15.4654C18.7692 15.67 19.1028 15.8073 19.4541 15.8675ZM9.82245 8.21437C9.51102 7.8956 9.26702 7.51734 9.10501 7.10219C8.943 6.68703 8.8663 6.24349 8.87949 5.79803C8.9117 4.95048 9.26254 4.14628 9.86189 3.54615C10.4612 2.94601 11.265 2.59413 12.1125 2.56082H12.2093C12.689 2.55941 13.1633 2.66219 13.5994 2.86207C14.0355 3.06195 14.423 3.35415 14.7351 3.71847C14.8648 3.86883 14.9593 4.04625 15.0118 4.23778C15.0642 4.42932 15.0732 4.63014 15.0382 4.82561C14.9968 5.05407 14.9061 5.27076 14.7723 5.46053C14.6385 5.6503 14.4649 5.80858 14.2636 5.92432C13.7504 6.22604 13.325 6.65672 13.0296 7.17363C12.7342 7.69055 12.5791 8.27572 12.5798 8.87107C12.5736 8.98184 12.5736 9.09287 12.5798 9.20363C12.4564 9.20992 12.3327 9.20992 12.2093 9.20363C11.7653 9.20848 11.3249 9.12332 10.9146 8.9533C10.5044 8.78328 10.1329 8.53191 9.82245 8.21437ZM8.21437 14.5962C7.89496 14.9079 7.51599 15.1521 7.10011 15.3141C6.68422 15.4761 6.23995 15.5527 5.79382 15.5391C4.94701 15.5059 4.14386 15.1546 3.54461 14.5554C2.94535 13.9561 2.59406 13.153 2.56082 12.3061C2.54568 11.8103 2.6418 11.3173 2.84213 10.8635C3.04246 10.4097 3.3419 10.0065 3.71847 9.68353C3.9592 9.47481 4.26704 9.35975 4.58566 9.35939C4.66607 9.36013 4.74629 9.36717 4.82561 9.38044C5.05407 9.42182 5.27076 9.51257 5.46053 9.64636C5.6503 9.78014 5.80858 9.95373 5.92432 10.155C6.2498 10.7215 6.73212 11.1819 7.31318 11.4806C7.89425 11.7794 8.54929 11.9038 9.19942 11.8389C9.19942 11.9652 9.19942 12.0872 9.19942 12.2093C9.20361 12.6529 9.11857 13.0928 8.94934 13.5028C8.78012 13.9129 8.53017 14.2847 8.21437 14.5962ZM14.5962 16.2043C14.9076 16.523 15.1516 16.9013 15.3136 17.3165C15.4756 17.7316 15.5523 18.1752 15.5391 18.6206C15.5212 19.293 15.3 19.9442 14.9048 20.4884C14.5095 21.0327 13.9587 21.4444 13.3249 21.6695C12.691 21.8946 12.0039 21.9225 11.3539 21.7495C10.7039 21.5764 10.1216 21.2106 9.68353 20.7002C9.55382 20.5498 9.4593 20.3724 9.40686 20.1809C9.35443 19.9893 9.3454 19.7885 9.38044 19.593C9.42202 19.3641 9.51331 19.1471 9.64787 18.9572C9.78242 18.7674 9.95698 18.6094 10.1592 18.4943C10.6722 18.1923 11.0974 17.7615 11.3927 17.2447C11.688 16.7278 11.8433 16.1428 11.8431 15.5476C11.8493 15.4368 11.8493 15.3258 11.8431 15.215C11.9651 15.2087 12.0873 15.2087 12.2093 15.215H12.243C12.6817 15.2128 13.1163 15.2993 13.5206 15.4693C13.925 15.6393 14.2909 15.8893 14.5962 16.2043ZM12.2093 14.3562C11.7847 14.3562 11.3696 14.2303 11.0166 13.9944C10.6635 13.7585 10.3883 13.4232 10.2258 13.0309C10.0633 12.6386 10.0208 12.2069 10.1037 11.7905C10.1865 11.374 10.391 10.9915 10.6912 10.6912C10.9915 10.391 11.374 10.1865 11.7905 10.1037C12.2069 10.0208 12.6386 10.0633 13.0309 10.2258C13.4232 10.3883 13.7585 10.6635 13.9944 11.0166C14.2303 11.3696 14.3562 11.7847 14.3562 12.2093C14.3551 12.7784 14.1286 13.3238 13.7262 13.7262C13.3238 14.1286 12.7784 14.3551 12.2093 14.3562ZM15.5518 12.5629C15.441 12.5567 15.33 12.5567 15.2192 12.5629C15.2192 12.4366 15.2192 12.3146 15.2192 12.1925C15.219 11.7469 15.3083 11.3059 15.4816 10.8954C15.655 10.485 15.9089 10.1135 16.2285 9.80303C16.548 9.49253 16.9266 9.24931 17.3418 9.08778C17.7571 8.92625 18.2005 8.8497 18.6459 8.86265C19.4927 8.8959 20.2958 9.24719 20.8951 9.84644C21.4943 10.4457 21.8456 11.2488 21.8789 12.0957C21.894 12.596 21.7958 13.0933 21.5917 13.5503C21.3876 14.0074 21.0828 14.4124 20.7002 14.7351C20.55 14.8651 20.3726 14.9598 20.181 15.0122C19.9894 15.0647 19.7885 15.0735 19.593 15.0382C19.3646 14.9968 19.1479 14.9061 18.9581 14.7723C18.7683 14.6385 18.6101 14.4649 18.4943 14.2636C18.1951 13.7479 17.766 13.3195 17.2497 13.0211C16.7335 12.7227 16.1481 12.5648 15.5518 12.5629Z" fill="#61CAFA"/>
<path d="M12.2094 10.6516C11.9014 10.6516 11.6002 10.743 11.3441 10.9141C11.0879 11.0853 10.8883 11.3285 10.7704 11.6131C10.6525 11.8977 10.6217 12.2109 10.6818 12.513C10.7419 12.8152 10.8902 13.0927 11.1081 13.3105C11.3259 13.5284 11.6034 13.6767 11.9056 13.7368C12.2077 13.7969 12.5209 13.7661 12.8055 13.6482C13.0901 13.5303 13.3333 13.3307 13.5045 13.0745C13.6756 12.8184 13.767 12.5172 13.767 12.2092C13.767 11.7961 13.6029 11.3999 13.3108 11.1078C13.0187 10.8157 12.6225 10.6516 12.2094 10.6516ZM12.2094 12.9248C12.0679 12.9248 11.9295 12.8828 11.8118 12.8042C11.6942 12.7256 11.6024 12.6138 11.5483 12.483C11.4941 12.3523 11.4799 12.2084 11.5075 12.0696C11.5351 11.9307 11.6033 11.8032 11.7034 11.7031C11.8035 11.6031 11.931 11.5349 12.0698 11.5073C12.2086 11.4797 12.3525 11.4939 12.4833 11.548C12.6141 11.6022 12.7258 11.6939 12.8045 11.8116C12.8831 11.9293 12.9251 12.0676 12.9251 12.2092C12.9251 12.399 12.8497 12.581 12.7155 12.7152C12.5812 12.8494 12.3992 12.9248 12.2094 12.9248Z" fill="#61CAFA"/>
</pattern>
</svg>
`,areaColors:"> areaValues | matchValue(areaColorsEditorConfig)",backgroundColor:"transparent",areaIds:"> primary | seriesByName('fan')",areaValues:"> primary | seriesByName('status')"},context:{areaColorsEditorConfig:[{match:"On",value:"url(#pattern1)"},{match:"Off",value:"url(#pattern0)"}]}},viz_FAnx3cef:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('2B')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_cPcTNTWj:{type:"splunk.choropleth.svg",dataSources:{primary:"ds_FZspy2J5"},options:{svg:`<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect id="fan" width="25" height="25" fill="url(#pattern0)"/>
<pattern id="pattern0" width="25" height="25">
<path d="M22.1693 19.2562C23.6316 17.1974 24.4171 14.7346 24.4171 12.2093C24.4171 9.684 23.6316 7.22124 22.1693 5.16236L23.8153 3.51639C24.2016 3.13009 24.4186 2.60616 24.4186 2.05985C24.4186 1.51355 24.2016 0.989615 23.8153 0.603317C23.429 0.21702 22.9051 0 22.3588 0C21.8124 0 21.2885 0.21702 20.9022 0.603317L19.2562 2.24929C17.1974 0.787041 14.7346 0.00147748 12.2093 0.00147748C9.684 0.00147748 7.22124 0.787041 5.16236 2.24929L3.51639 0.603317C3.13009 0.21702 2.60616 -5.75628e-09 2.05985 0C1.51355 5.75628e-09 0.989615 0.21702 0.603317 0.603317C0.21702 0.989615 5.75628e-09 1.51355 0 2.05985C-5.75628e-09 2.60616 0.21702 3.13009 0.603317 3.51639L2.24929 5.16236C0.787041 7.22124 0.00147748 9.684 0.00147748 12.2093C0.00147748 14.7346 0.787041 17.1974 2.24929 19.2562L0.603317 20.9022C0.21702 21.2885 0 21.8124 0 22.3588C0 22.9051 0.21702 23.429 0.603317 23.8153C0.989615 24.2016 1.51355 24.4186 2.05985 24.4186C2.60616 24.4186 3.13009 24.2016 3.51639 23.8153L5.16236 22.1693C7.22124 23.6316 9.684 24.4171 12.2093 24.4171C14.7346 24.4171 17.1974 23.6316 19.2562 22.1693L20.9022 23.8153C21.2885 24.2016 21.8124 24.4186 22.3588 24.4186C22.9051 24.4186 23.429 24.2016 23.8153 23.8153C24.2016 23.429 24.4186 22.9051 24.4186 22.3588C24.4186 21.8124 24.2016 21.2885 23.8153 20.9022L22.1693 19.2562ZM21.5 1.20109C21.7301 0.97786 22.0381 0.853018 22.3588 0.853018C22.6794 0.853018 22.9874 0.97786 23.2175 1.20109C23.3305 1.31372 23.4202 1.44756 23.4814 1.59493C23.5426 1.74229 23.5741 1.90029 23.5741 2.05985C23.5741 2.21942 23.5426 2.37742 23.4814 2.52478C23.4202 2.67215 23.3305 2.80599 23.2175 2.91862L21.66 4.4804C21.6305 4.44251 21.5968 4.41304 21.5673 4.37937C21.1054 3.82341 20.5939 3.31053 20.0392 2.84706L19.9382 2.75865L21.5 1.20109ZM1.20109 1.20109C1.31344 1.08755 1.44718 0.997427 1.59459 0.935916C1.74199 0.874406 1.90013 0.842735 2.05985 0.842735C2.21958 0.842735 2.37772 0.874406 2.52512 0.935916C2.67253 0.997427 2.80627 1.08755 2.91862 1.20109L4.4804 2.75865L4.37937 2.84706C3.82564 3.31158 3.31427 3.82437 2.85127 4.37937C2.8218 4.41304 2.78812 4.44251 2.75865 4.4804L1.20109 2.91862C1.08806 2.80599 0.998381 2.67215 0.93719 2.52478C0.875999 2.37742 0.8445 2.21942 0.8445 2.05985C0.8445 1.90029 0.875999 1.74229 0.93719 1.59493C0.998381 1.44756 1.08806 1.31372 1.20109 1.20109ZM2.91862 23.2175C2.68798 23.4398 2.38015 23.5639 2.05985 23.5639C1.73956 23.5639 1.43173 23.4398 1.20109 23.2175C1.08806 23.1049 0.998381 22.9711 0.93719 22.8237C0.875999 22.6763 0.8445 22.5183 0.8445 22.3588C0.8445 22.1992 0.875999 22.0412 0.93719 21.8938C0.998381 21.7465 1.08806 21.6126 1.20109 21.5L2.75865 19.9382C2.78812 19.9761 2.8218 20.0056 2.85127 20.0392C3.31321 20.5952 3.82468 21.1081 4.37937 21.5716C4.41304 21.5968 4.44251 21.6305 4.4804 21.66L2.91862 23.2175ZM5.36442 21.2853C4.52115 20.6483 3.77029 19.8975 3.13331 19.0542C1.64577 17.0822 0.841107 14.6794 0.841107 12.2093C0.841107 9.73922 1.64577 7.33636 3.13331 5.36442C3.29328 5.15394 3.45746 4.94346 3.63005 4.74982C4.15073 4.15246 4.73196 3.61073 5.36442 3.13331C7.33599 1.64677 9.73802 0.842695 12.2072 0.842695C14.6764 0.842695 17.0784 1.64677 19.05 3.13331C19.8933 3.77029 20.6441 4.52115 21.2811 5.36442C22.7686 7.33636 23.5733 9.73922 23.5733 12.2093C23.5733 14.6794 22.7686 17.0822 21.2811 19.0542C20.6441 19.8975 19.8933 20.6483 19.05 21.2853C17.0784 22.7718 14.6764 23.5759 12.2072 23.5759C9.73802 23.5759 7.33599 22.7718 5.36442 21.2853ZM23.2175 23.2175C22.9869 23.4398 22.6791 23.5639 22.3588 23.5639C22.0385 23.5639 21.7306 23.4398 21.5 23.2175L19.9382 21.66L20.0392 21.5716C20.593 21.107 21.1043 20.5942 21.5673 20.0392C21.5968 20.0056 21.6305 19.9761 21.66 19.9382L23.2175 21.5C23.3305 21.6126 23.4202 21.7465 23.4814 21.8938C23.5426 22.0412 23.5741 22.1992 23.5741 22.3588C23.5741 22.5183 23.5426 22.6763 23.4814 22.8237C23.4202 22.9711 23.3305 23.1049 23.2175 23.2175Z" fill="#ACACAD"/>
<path d="M19.4541 15.8675C19.5807 15.8892 19.7088 15.9004 19.8372 15.9012C20.3566 15.9044 20.8589 15.7155 21.2474 15.3708C21.7195 14.9677 22.0951 14.4638 22.3465 13.8963C22.5978 13.3287 22.7186 12.7119 22.6998 12.0914C22.6611 11.0286 22.2216 10.0198 21.4696 9.26776C20.7175 8.51572 19.7087 8.07621 18.6459 8.03756C17.8103 8.01402 16.987 8.24228 16.2828 8.69271C15.5786 9.14313 15.0262 9.7949 14.6972 10.5633C14.3906 10.1091 13.9675 9.74556 13.4722 9.51094V9.44779C13.3467 8.91345 13.3969 8.35288 13.6153 7.84932C13.8337 7.34576 14.2087 6.92607 14.6846 6.65259C14.9937 6.47652 15.2601 6.23425 15.4646 5.94314C15.6691 5.65202 15.8067 5.31927 15.8675 4.96873C15.9255 4.65171 15.9109 4.32568 15.8249 4.01509C15.7388 3.70451 15.5836 3.41744 15.3708 3.17542C14.9677 2.70332 14.4638 2.32773 13.8963 2.07637C13.3287 1.825 12.7119 1.70428 12.0914 1.7231C11.0286 1.76175 10.0198 2.20126 9.26776 2.95329C8.51572 3.70533 8.07621 4.71415 8.03756 5.77698C8.01402 6.61255 8.24228 7.43589 8.69271 8.14006C9.14313 8.84422 9.7949 9.39667 10.5633 9.72563C10.1096 10.0311 9.74618 10.4527 9.51094 10.9464H9.44779C8.91345 11.0726 8.35262 11.0228 7.8489 10.8043C7.34519 10.5858 6.92557 10.2104 6.65259 9.73405C6.47652 9.4249 6.23425 9.15853 5.94314 8.95402C5.65202 8.74951 5.31927 8.61193 4.96873 8.55114C4.65171 8.49286 4.3256 8.50728 4.01497 8.59333C3.70433 8.67937 3.41728 8.83479 3.17542 9.04788C2.70332 9.45092 2.32773 9.95481 2.07637 10.5224C1.825 11.09 1.70428 11.7067 1.7231 12.3272C1.76175 13.39 2.20126 14.3988 2.95329 15.1509C3.70533 15.9029 4.71415 16.3424 5.77698 16.3811H5.89485C6.71061 16.3817 7.50856 16.1426 8.18961 15.6936C8.87065 15.2445 9.40477 14.6053 9.72563 13.8553C10.0311 14.309 10.4527 14.6725 10.9464 14.9077V14.9708C11.0719 15.5052 11.0218 16.0658 10.8034 16.5693C10.585 17.0729 10.21 17.4926 9.73405 17.7661C9.4249 17.9421 9.15853 18.1844 8.95402 18.4755C8.74951 18.7666 8.61193 19.0994 8.55114 19.4499C8.49317 19.7669 8.50775 20.093 8.59378 20.4035C8.67981 20.7141 8.83506 21.0012 9.04788 21.2432C9.4376 21.7008 9.92225 22.0682 10.4682 22.3197C11.0141 22.5712 11.6082 22.7009 12.2093 22.6998H12.3272C13.39 22.6611 14.3988 22.2216 15.1509 21.4696C15.9029 20.7175 16.3424 19.7087 16.3811 18.6459C16.3982 18.088 16.3026 17.5325 16.1001 17.0124C15.8976 16.4924 15.5922 16.0185 15.2024 15.6191C14.8216 15.2271 14.3684 14.9126 13.8679 14.693C14.3178 14.3868 14.677 13.9651 14.9077 13.4722H14.9708C15.5052 13.3467 16.0658 13.3969 16.5693 13.6153C17.0729 13.8337 17.4926 14.2087 17.7661 14.6846C17.9426 14.9942 18.1855 15.2609 18.4774 15.4654C18.7692 15.67 19.1028 15.8073 19.4541 15.8675ZM9.82245 8.21437C9.51102 7.8956 9.26702 7.51734 9.10501 7.10219C8.943 6.68703 8.8663 6.24349 8.87949 5.79803C8.9117 4.95048 9.26254 4.14628 9.86189 3.54615C10.4612 2.94601 11.265 2.59413 12.1125 2.56082H12.2093C12.689 2.55941 13.1633 2.66219 13.5994 2.86207C14.0355 3.06195 14.423 3.35415 14.7351 3.71847C14.8648 3.86883 14.9593 4.04625 15.0118 4.23778C15.0642 4.42932 15.0732 4.63014 15.0382 4.82561C14.9968 5.05407 14.9061 5.27076 14.7723 5.46053C14.6385 5.6503 14.4649 5.80858 14.2636 5.92432C13.7504 6.22604 13.325 6.65672 13.0296 7.17363C12.7342 7.69055 12.5791 8.27572 12.5798 8.87107C12.5736 8.98184 12.5736 9.09287 12.5798 9.20363C12.4564 9.20992 12.3327 9.20992 12.2093 9.20363C11.7653 9.20848 11.3249 9.12332 10.9146 8.9533C10.5044 8.78328 10.1329 8.53191 9.82245 8.21437ZM8.21437 14.5962C7.89496 14.9079 7.51599 15.1521 7.10011 15.3141C6.68422 15.4761 6.23995 15.5527 5.79382 15.5391C4.94701 15.5059 4.14386 15.1546 3.54461 14.5554C2.94535 13.9561 2.59406 13.153 2.56082 12.3061C2.54568 11.8103 2.6418 11.3173 2.84213 10.8635C3.04246 10.4097 3.3419 10.0065 3.71847 9.68353C3.9592 9.47481 4.26704 9.35975 4.58566 9.35939C4.66607 9.36013 4.74629 9.36717 4.82561 9.38044C5.05407 9.42182 5.27076 9.51257 5.46053 9.64636C5.6503 9.78014 5.80858 9.95373 5.92432 10.155C6.2498 10.7215 6.73212 11.1819 7.31318 11.4806C7.89425 11.7794 8.54929 11.9038 9.19942 11.8389C9.19942 11.9652 9.19942 12.0872 9.19942 12.2093C9.20361 12.6529 9.11857 13.0928 8.94934 13.5028C8.78012 13.9129 8.53017 14.2847 8.21437 14.5962ZM14.5962 16.2043C14.9076 16.523 15.1516 16.9013 15.3136 17.3165C15.4756 17.7316 15.5523 18.1752 15.5391 18.6206C15.5212 19.293 15.3 19.9442 14.9048 20.4884C14.5095 21.0327 13.9587 21.4444 13.3249 21.6695C12.691 21.8946 12.0039 21.9225 11.3539 21.7495C10.7039 21.5764 10.1216 21.2106 9.68353 20.7002C9.55382 20.5498 9.4593 20.3724 9.40686 20.1809C9.35443 19.9893 9.3454 19.7885 9.38044 19.593C9.42202 19.3641 9.51331 19.1471 9.64787 18.9572C9.78242 18.7674 9.95698 18.6094 10.1592 18.4943C10.6722 18.1923 11.0974 17.7615 11.3927 17.2447C11.688 16.7278 11.8433 16.1428 11.8431 15.5476C11.8493 15.4368 11.8493 15.3258 11.8431 15.215C11.9651 15.2087 12.0873 15.2087 12.2093 15.215H12.243C12.6817 15.2128 13.1163 15.2993 13.5206 15.4693C13.925 15.6393 14.2909 15.8893 14.5962 16.2043ZM12.2093 14.3562C11.7847 14.3562 11.3696 14.2303 11.0166 13.9944C10.6635 13.7585 10.3883 13.4232 10.2258 13.0309C10.0633 12.6386 10.0208 12.2069 10.1037 11.7905C10.1865 11.374 10.391 10.9915 10.6912 10.6912C10.9915 10.391 11.374 10.1865 11.7905 10.1037C12.2069 10.0208 12.6386 10.0633 13.0309 10.2258C13.4232 10.3883 13.7585 10.6635 13.9944 11.0166C14.2303 11.3696 14.3562 11.7847 14.3562 12.2093C14.3551 12.7784 14.1286 13.3238 13.7262 13.7262C13.3238 14.1286 12.7784 14.3551 12.2093 14.3562ZM15.5518 12.5629C15.441 12.5567 15.33 12.5567 15.2192 12.5629C15.2192 12.4366 15.2192 12.3146 15.2192 12.1925C15.219 11.7469 15.3083 11.3059 15.4816 10.8954C15.655 10.485 15.9089 10.1135 16.2285 9.80303C16.548 9.49253 16.9266 9.24931 17.3418 9.08778C17.7571 8.92625 18.2005 8.8497 18.6459 8.86265C19.4927 8.8959 20.2958 9.24719 20.8951 9.84644C21.4943 10.4457 21.8456 11.2488 21.8789 12.0957C21.894 12.596 21.7958 13.0933 21.5917 13.5503C21.3876 14.0074 21.0828 14.4124 20.7002 14.7351C20.55 14.8651 20.3726 14.9598 20.181 15.0122C19.9894 15.0647 19.7885 15.0735 19.593 15.0382C19.3646 14.9968 19.1479 14.9061 18.9581 14.7723C18.7683 14.6385 18.6101 14.4649 18.4943 14.2636C18.1951 13.7479 17.766 13.3195 17.2497 13.0211C16.7335 12.7227 16.1481 12.5648 15.5518 12.5629Z" fill="#ACACAD"/>
<path d="M12.2094 10.6516C11.9014 10.6516 11.6002 10.743 11.3441 10.9141C11.0879 11.0853 10.8883 11.3285 10.7704 11.6131C10.6525 11.8977 10.6217 12.2109 10.6818 12.513C10.7419 12.8152 10.8902 13.0927 11.1081 13.3105C11.3259 13.5284 11.6034 13.6767 11.9056 13.7368C12.2077 13.7969 12.5209 13.7661 12.8055 13.6482C13.0901 13.5303 13.3333 13.3307 13.5045 13.0745C13.6756 12.8184 13.767 12.5172 13.767 12.2092C13.767 11.7961 13.6029 11.3999 13.3108 11.1078C13.0187 10.8157 12.6225 10.6516 12.2094 10.6516ZM12.2094 12.9248C12.0679 12.9248 11.9295 12.8828 11.8118 12.8042C11.6942 12.7256 11.6024 12.6138 11.5483 12.483C11.4941 12.3523 11.4799 12.2084 11.5075 12.0696C11.5351 11.9307 11.6033 11.8032 11.7034 11.7031C11.8035 11.6031 11.931 11.5349 12.0698 11.5073C12.2086 11.4797 12.3525 11.4939 12.4833 11.548C12.6141 11.6022 12.7258 11.6939 12.8045 11.8116C12.8831 11.9293 12.9251 12.0676 12.9251 12.2092C12.9251 12.399 12.8497 12.581 12.7155 12.7152C12.5812 12.8494 12.3992 12.9248 12.2094 12.9248Z" fill="#ACACAD"/>
</pattern>
<pattern id="pattern1" width="25" height="25">
<path d="M22.1693 19.2562C23.6316 17.1974 24.4171 14.7346 24.4171 12.2093C24.4171 9.684 23.6316 7.22124 22.1693 5.16236L23.8153 3.51639C24.2016 3.13009 24.4186 2.60616 24.4186 2.05985C24.4186 1.51355 24.2016 0.989615 23.8153 0.603317C23.429 0.21702 22.9051 0 22.3588 0C21.8124 0 21.2885 0.21702 20.9022 0.603317L19.2562 2.24929C17.1974 0.787041 14.7346 0.00147748 12.2093 0.00147748C9.684 0.00147748 7.22124 0.787041 5.16236 2.24929L3.51639 0.603317C3.13009 0.21702 2.60616 -5.75628e-09 2.05985 0C1.51355 5.75628e-09 0.989615 0.21702 0.603317 0.603317C0.21702 0.989615 5.75628e-09 1.51355 0 2.05985C-5.75628e-09 2.60616 0.21702 3.13009 0.603317 3.51639L2.24929 5.16236C0.787041 7.22124 0.00147748 9.684 0.00147748 12.2093C0.00147748 14.7346 0.787041 17.1974 2.24929 19.2562L0.603317 20.9022C0.21702 21.2885 0 21.8124 0 22.3588C0 22.9051 0.21702 23.429 0.603317 23.8153C0.989615 24.2016 1.51355 24.4186 2.05985 24.4186C2.60616 24.4186 3.13009 24.2016 3.51639 23.8153L5.16236 22.1693C7.22124 23.6316 9.684 24.4171 12.2093 24.4171C14.7346 24.4171 17.1974 23.6316 19.2562 22.1693L20.9022 23.8153C21.2885 24.2016 21.8124 24.4186 22.3588 24.4186C22.9051 24.4186 23.429 24.2016 23.8153 23.8153C24.2016 23.429 24.4186 22.9051 24.4186 22.3588C24.4186 21.8124 24.2016 21.2885 23.8153 20.9022L22.1693 19.2562ZM21.5 1.20109C21.7301 0.97786 22.0381 0.853018 22.3588 0.853018C22.6794 0.853018 22.9874 0.97786 23.2175 1.20109C23.3305 1.31372 23.4202 1.44756 23.4814 1.59493C23.5426 1.74229 23.5741 1.90029 23.5741 2.05985C23.5741 2.21942 23.5426 2.37742 23.4814 2.52478C23.4202 2.67215 23.3305 2.80599 23.2175 2.91862L21.66 4.4804C21.6305 4.44251 21.5968 4.41304 21.5673 4.37937C21.1054 3.82341 20.5939 3.31053 20.0392 2.84706L19.9382 2.75865L21.5 1.20109ZM1.20109 1.20109C1.31344 1.08755 1.44718 0.997427 1.59459 0.935916C1.74199 0.874406 1.90013 0.842735 2.05985 0.842735C2.21958 0.842735 2.37772 0.874406 2.52512 0.935916C2.67253 0.997427 2.80627 1.08755 2.91862 1.20109L4.4804 2.75865L4.37937 2.84706C3.82564 3.31158 3.31427 3.82437 2.85127 4.37937C2.8218 4.41304 2.78812 4.44251 2.75865 4.4804L1.20109 2.91862C1.08806 2.80599 0.998381 2.67215 0.93719 2.52478C0.875999 2.37742 0.8445 2.21942 0.8445 2.05985C0.8445 1.90029 0.875999 1.74229 0.93719 1.59493C0.998381 1.44756 1.08806 1.31372 1.20109 1.20109ZM2.91862 23.2175C2.68798 23.4398 2.38015 23.5639 2.05985 23.5639C1.73956 23.5639 1.43173 23.4398 1.20109 23.2175C1.08806 23.1049 0.998381 22.9711 0.93719 22.8237C0.875999 22.6763 0.8445 22.5183 0.8445 22.3588C0.8445 22.1992 0.875999 22.0412 0.93719 21.8938C0.998381 21.7465 1.08806 21.6126 1.20109 21.5L2.75865 19.9382C2.78812 19.9761 2.8218 20.0056 2.85127 20.0392C3.31321 20.5952 3.82468 21.1081 4.37937 21.5716C4.41304 21.5968 4.44251 21.6305 4.4804 21.66L2.91862 23.2175ZM5.36442 21.2853C4.52115 20.6483 3.77029 19.8975 3.13331 19.0542C1.64577 17.0822 0.841107 14.6794 0.841107 12.2093C0.841107 9.73922 1.64577 7.33636 3.13331 5.36442C3.29328 5.15394 3.45746 4.94346 3.63005 4.74982C4.15073 4.15246 4.73196 3.61073 5.36442 3.13331C7.33599 1.64677 9.73802 0.842695 12.2072 0.842695C14.6764 0.842695 17.0784 1.64677 19.05 3.13331C19.8933 3.77029 20.6441 4.52115 21.2811 5.36442C22.7686 7.33636 23.5733 9.73922 23.5733 12.2093C23.5733 14.6794 22.7686 17.0822 21.2811 19.0542C20.6441 19.8975 19.8933 20.6483 19.05 21.2853C17.0784 22.7718 14.6764 23.5759 12.2072 23.5759C9.73802 23.5759 7.33599 22.7718 5.36442 21.2853ZM23.2175 23.2175C22.9869 23.4398 22.6791 23.5639 22.3588 23.5639C22.0385 23.5639 21.7306 23.4398 21.5 23.2175L19.9382 21.66L20.0392 21.5716C20.593 21.107 21.1043 20.5942 21.5673 20.0392C21.5968 20.0056 21.6305 19.9761 21.66 19.9382L23.2175 21.5C23.3305 21.6126 23.4202 21.7465 23.4814 21.8938C23.5426 22.0412 23.5741 22.1992 23.5741 22.3588C23.5741 22.5183 23.5426 22.6763 23.4814 22.8237C23.4202 22.9711 23.3305 23.1049 23.2175 23.2175Z" fill="#61CAFA"/>
<path d="M19.4541 15.8675C19.5807 15.8892 19.7088 15.9004 19.8372 15.9012C20.3566 15.9044 20.8589 15.7155 21.2474 15.3708C21.7195 14.9677 22.0951 14.4638 22.3465 13.8963C22.5978 13.3287 22.7186 12.7119 22.6998 12.0914C22.6611 11.0286 22.2216 10.0198 21.4696 9.26776C20.7175 8.51572 19.7087 8.07621 18.6459 8.03756C17.8103 8.01402 16.987 8.24228 16.2828 8.69271C15.5786 9.14313 15.0262 9.7949 14.6972 10.5633C14.3906 10.1091 13.9675 9.74556 13.4722 9.51094V9.44779C13.3467 8.91345 13.3969 8.35288 13.6153 7.84932C13.8337 7.34576 14.2087 6.92607 14.6846 6.65259C14.9937 6.47652 15.2601 6.23425 15.4646 5.94314C15.6691 5.65202 15.8067 5.31927 15.8675 4.96873C15.9255 4.65171 15.9109 4.32568 15.8249 4.01509C15.7388 3.70451 15.5836 3.41744 15.3708 3.17542C14.9677 2.70332 14.4638 2.32773 13.8963 2.07637C13.3287 1.825 12.7119 1.70428 12.0914 1.7231C11.0286 1.76175 10.0198 2.20126 9.26776 2.95329C8.51572 3.70533 8.07621 4.71415 8.03756 5.77698C8.01402 6.61255 8.24228 7.43589 8.69271 8.14006C9.14313 8.84422 9.7949 9.39667 10.5633 9.72563C10.1096 10.0311 9.74618 10.4527 9.51094 10.9464H9.44779C8.91345 11.0726 8.35262 11.0228 7.8489 10.8043C7.34519 10.5858 6.92557 10.2104 6.65259 9.73405C6.47652 9.4249 6.23425 9.15853 5.94314 8.95402C5.65202 8.74951 5.31927 8.61193 4.96873 8.55114C4.65171 8.49286 4.3256 8.50728 4.01497 8.59333C3.70433 8.67937 3.41728 8.83479 3.17542 9.04788C2.70332 9.45092 2.32773 9.95481 2.07637 10.5224C1.825 11.09 1.70428 11.7067 1.7231 12.3272C1.76175 13.39 2.20126 14.3988 2.95329 15.1509C3.70533 15.9029 4.71415 16.3424 5.77698 16.3811H5.89485C6.71061 16.3817 7.50856 16.1426 8.18961 15.6936C8.87065 15.2445 9.40477 14.6053 9.72563 13.8553C10.0311 14.309 10.4527 14.6725 10.9464 14.9077V14.9708C11.0719 15.5052 11.0218 16.0658 10.8034 16.5693C10.585 17.0729 10.21 17.4926 9.73405 17.7661C9.4249 17.9421 9.15853 18.1844 8.95402 18.4755C8.74951 18.7666 8.61193 19.0994 8.55114 19.4499C8.49317 19.7669 8.50775 20.093 8.59378 20.4035C8.67981 20.7141 8.83506 21.0012 9.04788 21.2432C9.4376 21.7008 9.92225 22.0682 10.4682 22.3197C11.0141 22.5712 11.6082 22.7009 12.2093 22.6998H12.3272C13.39 22.6611 14.3988 22.2216 15.1509 21.4696C15.9029 20.7175 16.3424 19.7087 16.3811 18.6459C16.3982 18.088 16.3026 17.5325 16.1001 17.0124C15.8976 16.4924 15.5922 16.0185 15.2024 15.6191C14.8216 15.2271 14.3684 14.9126 13.8679 14.693C14.3178 14.3868 14.677 13.9651 14.9077 13.4722H14.9708C15.5052 13.3467 16.0658 13.3969 16.5693 13.6153C17.0729 13.8337 17.4926 14.2087 17.7661 14.6846C17.9426 14.9942 18.1855 15.2609 18.4774 15.4654C18.7692 15.67 19.1028 15.8073 19.4541 15.8675ZM9.82245 8.21437C9.51102 7.8956 9.26702 7.51734 9.10501 7.10219C8.943 6.68703 8.8663 6.24349 8.87949 5.79803C8.9117 4.95048 9.26254 4.14628 9.86189 3.54615C10.4612 2.94601 11.265 2.59413 12.1125 2.56082H12.2093C12.689 2.55941 13.1633 2.66219 13.5994 2.86207C14.0355 3.06195 14.423 3.35415 14.7351 3.71847C14.8648 3.86883 14.9593 4.04625 15.0118 4.23778C15.0642 4.42932 15.0732 4.63014 15.0382 4.82561C14.9968 5.05407 14.9061 5.27076 14.7723 5.46053C14.6385 5.6503 14.4649 5.80858 14.2636 5.92432C13.7504 6.22604 13.325 6.65672 13.0296 7.17363C12.7342 7.69055 12.5791 8.27572 12.5798 8.87107C12.5736 8.98184 12.5736 9.09287 12.5798 9.20363C12.4564 9.20992 12.3327 9.20992 12.2093 9.20363C11.7653 9.20848 11.3249 9.12332 10.9146 8.9533C10.5044 8.78328 10.1329 8.53191 9.82245 8.21437ZM8.21437 14.5962C7.89496 14.9079 7.51599 15.1521 7.10011 15.3141C6.68422 15.4761 6.23995 15.5527 5.79382 15.5391C4.94701 15.5059 4.14386 15.1546 3.54461 14.5554C2.94535 13.9561 2.59406 13.153 2.56082 12.3061C2.54568 11.8103 2.6418 11.3173 2.84213 10.8635C3.04246 10.4097 3.3419 10.0065 3.71847 9.68353C3.9592 9.47481 4.26704 9.35975 4.58566 9.35939C4.66607 9.36013 4.74629 9.36717 4.82561 9.38044C5.05407 9.42182 5.27076 9.51257 5.46053 9.64636C5.6503 9.78014 5.80858 9.95373 5.92432 10.155C6.2498 10.7215 6.73212 11.1819 7.31318 11.4806C7.89425 11.7794 8.54929 11.9038 9.19942 11.8389C9.19942 11.9652 9.19942 12.0872 9.19942 12.2093C9.20361 12.6529 9.11857 13.0928 8.94934 13.5028C8.78012 13.9129 8.53017 14.2847 8.21437 14.5962ZM14.5962 16.2043C14.9076 16.523 15.1516 16.9013 15.3136 17.3165C15.4756 17.7316 15.5523 18.1752 15.5391 18.6206C15.5212 19.293 15.3 19.9442 14.9048 20.4884C14.5095 21.0327 13.9587 21.4444 13.3249 21.6695C12.691 21.8946 12.0039 21.9225 11.3539 21.7495C10.7039 21.5764 10.1216 21.2106 9.68353 20.7002C9.55382 20.5498 9.4593 20.3724 9.40686 20.1809C9.35443 19.9893 9.3454 19.7885 9.38044 19.593C9.42202 19.3641 9.51331 19.1471 9.64787 18.9572C9.78242 18.7674 9.95698 18.6094 10.1592 18.4943C10.6722 18.1923 11.0974 17.7615 11.3927 17.2447C11.688 16.7278 11.8433 16.1428 11.8431 15.5476C11.8493 15.4368 11.8493 15.3258 11.8431 15.215C11.9651 15.2087 12.0873 15.2087 12.2093 15.215H12.243C12.6817 15.2128 13.1163 15.2993 13.5206 15.4693C13.925 15.6393 14.2909 15.8893 14.5962 16.2043ZM12.2093 14.3562C11.7847 14.3562 11.3696 14.2303 11.0166 13.9944C10.6635 13.7585 10.3883 13.4232 10.2258 13.0309C10.0633 12.6386 10.0208 12.2069 10.1037 11.7905C10.1865 11.374 10.391 10.9915 10.6912 10.6912C10.9915 10.391 11.374 10.1865 11.7905 10.1037C12.2069 10.0208 12.6386 10.0633 13.0309 10.2258C13.4232 10.3883 13.7585 10.6635 13.9944 11.0166C14.2303 11.3696 14.3562 11.7847 14.3562 12.2093C14.3551 12.7784 14.1286 13.3238 13.7262 13.7262C13.3238 14.1286 12.7784 14.3551 12.2093 14.3562ZM15.5518 12.5629C15.441 12.5567 15.33 12.5567 15.2192 12.5629C15.2192 12.4366 15.2192 12.3146 15.2192 12.1925C15.219 11.7469 15.3083 11.3059 15.4816 10.8954C15.655 10.485 15.9089 10.1135 16.2285 9.80303C16.548 9.49253 16.9266 9.24931 17.3418 9.08778C17.7571 8.92625 18.2005 8.8497 18.6459 8.86265C19.4927 8.8959 20.2958 9.24719 20.8951 9.84644C21.4943 10.4457 21.8456 11.2488 21.8789 12.0957C21.894 12.596 21.7958 13.0933 21.5917 13.5503C21.3876 14.0074 21.0828 14.4124 20.7002 14.7351C20.55 14.8651 20.3726 14.9598 20.181 15.0122C19.9894 15.0647 19.7885 15.0735 19.593 15.0382C19.3646 14.9968 19.1479 14.9061 18.9581 14.7723C18.7683 14.6385 18.6101 14.4649 18.4943 14.2636C18.1951 13.7479 17.766 13.3195 17.2497 13.0211C16.7335 12.7227 16.1481 12.5648 15.5518 12.5629Z" fill="#61CAFA"/>
<path d="M12.2094 10.6516C11.9014 10.6516 11.6002 10.743 11.3441 10.9141C11.0879 11.0853 10.8883 11.3285 10.7704 11.6131C10.6525 11.8977 10.6217 12.2109 10.6818 12.513C10.7419 12.8152 10.8902 13.0927 11.1081 13.3105C11.3259 13.5284 11.6034 13.6767 11.9056 13.7368C12.2077 13.7969 12.5209 13.7661 12.8055 13.6482C13.0901 13.5303 13.3333 13.3307 13.5045 13.0745C13.6756 12.8184 13.767 12.5172 13.767 12.2092C13.767 11.7961 13.6029 11.3999 13.3108 11.1078C13.0187 10.8157 12.6225 10.6516 12.2094 10.6516ZM12.2094 12.9248C12.0679 12.9248 11.9295 12.8828 11.8118 12.8042C11.6942 12.7256 11.6024 12.6138 11.5483 12.483C11.4941 12.3523 11.4799 12.2084 11.5075 12.0696C11.5351 11.9307 11.6033 11.8032 11.7034 11.7031C11.8035 11.6031 11.931 11.5349 12.0698 11.5073C12.2086 11.4797 12.3525 11.4939 12.4833 11.548C12.6141 11.6022 12.7258 11.6939 12.8045 11.8116C12.8831 11.9293 12.9251 12.0676 12.9251 12.2092C12.9251 12.399 12.8497 12.581 12.7155 12.7152C12.5812 12.8494 12.3992 12.9248 12.2094 12.9248Z" fill="#61CAFA"/>
</pattern>
</svg>
`,areaColors:"> areaValues | matchValue(areaColorsEditorConfig)",backgroundColor:"transparent",areaIds:"> primary | seriesByName('fan')",areaValues:"> primary | seriesByName('status')"},context:{areaColorsEditorConfig:[{match:"On",value:"url(#pattern1)"},{match:"Off",value:"url(#pattern0)"}]}},viz_GiFGQJhv:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('5A')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_aIJuVzaA:{type:"splunk.markdown",options:{markdown:"# Server Room Heatmap"}},viz_chzeT9xQ:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#CBA700"}},viz_74Cet7PR:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('4C')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_s16ezMEZ:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('4B')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_WkLDDaHu:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.8,fillColor:"#191B20"}},viz_IbedREF0:{type:"splunk.ellipse",dataSources:{primary:"ds_8qwizlRA_ds_FZspy2J5"},options:{fillColor:"> fillDataValue | matchValue(fillColorEditorConfig)"},context:{fillColorEditorConfig:[{match:"Off",value:"#505158"},{value:"#62C9FA",match:"On"}],fillDataValue:"> primary | seriesByName('status') | lastPoint()"},showProgressBar:!1,showLastUpdated:!1},viz_gyep5iwo:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_93JnfLyu:{type:"splunk.singlevalue",dataSources:{primary:"ds_qwJWyIWq_ds_8qwizlRA_ds_FZspy2J5"},options:{majorFontSize:14,backgroundColor:"transparent",sparklineDisplay:"off",trendDisplay:"off",majorColor:"> majorValue | matchValue(majorColorEditorConfig)",sparklineValues:"> primary | seriesByName('status')"},context:{majorColorEditorConfig:[{match:"Off",value:"#505158"},{value:"#62C9FA",match:"On"}]}},viz_LKZmA5D3:{type:"splunk.choropleth.svg",options:{svg:`<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="9.8" y="1.8" width="21.4" height="8.4" rx="1.2" stroke="#ACACAD" stroke-width="1.6"/>
<path d="M7 6H4C2.89543 6 2 6.89543 2 8V26C2 27.1046 2.89543 28 4 28H7" stroke="#ACACAD" stroke-width="1.6"/>
<rect x="12.75" y="4.75" width="2.5" height="2.5" rx="1.25" stroke="#ACACAD" stroke-width="1.5"/>
<rect x="9.8" y="12.8" width="21.4" height="8.4" rx="1.2" stroke="#ACACAD" stroke-width="1.6"/>
<rect x="12.75" y="15.75" width="2.5" height="2.5" rx="1.25" stroke="#ACACAD" stroke-width="1.5"/>
<rect x="9.8" y="23.8" width="21.4" height="8.4" rx="1.2" stroke="#ACACAD" stroke-width="1.6"/>
<rect x="12.75" y="26.75" width="2.5" height="2.5" rx="1.25" stroke="#ACACAD" stroke-width="1.5"/>
</svg>
`,backgroundColor:"transparent"}},viz_2NKT4F15:{dataSources:{primary:"ds_6zvrUOR6"},type:"splunk.singlevalue",options:{majorFontSize:14,backgroundColor:"transparent",sparklineDisplay:"off",trendDisplay:"off",majorColor:"> majorValue | rangeValue(majorColorEditorConfig)"},context:{majorColorEditorConfig:[{from:1,value:"#62C9FA"},{value:"#818285",to:1}]}},viz_ZEylgIfT:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('2C')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_2mkSnngg:{type:"splunk.choropleth.svg",options:{svg:`<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="34" height="34" fill="none" fill-opacity="0.02"/>
<path d="M13.8841 33.0684C18.5192 33.9678 22.5317 30.4396 22.5317 25.9428C22.5317 23.5907 21.3556 21.4461 19.5569 20.1316V4.28921C19.5569 1.93706 17.689 0 15.2677 0C12.9155 0 10.9785 1.93706 10.9785 4.28921V20.1316C8.83387 21.7228 7.58861 24.4208 8.21124 27.4648C8.76469 30.232 11.0477 32.515 13.8841 33.0684ZM11.8778 21.4461L12.5005 20.9618V4.35839C12.5005 2.83641 13.7457 1.66034 15.1985 1.66034C16.7205 1.66034 17.9657 2.9056 17.9657 4.35839V20.9618L18.5884 21.4461C20.0412 22.4838 20.8713 24.2133 20.8713 26.012C20.8713 27.534 20.2487 28.9868 19.211 30.0245C18.1041 31.0622 16.7205 31.6848 15.1985 31.6848C12.3621 31.6848 10.1483 29.6786 9.66404 27.1881C9.31813 24.9051 10.1483 22.6913 11.8778 21.4461Z" fill="#ACACAD"/>
<path d="M15.2676 30.0245C16.3745 30.0245 17.4122 29.6094 18.1732 28.8484C18.9342 28.0874 19.3493 27.0497 19.3493 25.9428C19.3493 23.1756 16.9971 22.2763 16.3745 21.7228V10.0312H14.0915V21.7228C13.6072 22.2763 10.5633 23.3832 11.2551 26.773C11.601 28.5717 13.1922 30.0245 15.2676 30.0245Z" fill="#ACACAD"/>
<path d="M25.2988 4.70435H21.3555V6.29551H25.2988C25.7139 6.29551 26.0598 5.9496 26.0598 5.53452C26.1289 5.05025 25.783 4.70435 25.2988 4.70435Z" fill="#ACACAD"/>
<path d="M24.5379 9.68531C24.5379 9.27022 24.192 8.92432 23.777 8.92432H21.4248V10.5155H23.777C24.192 10.4463 24.5379 10.1004 24.5379 9.68531Z" fill="#ACACAD"/>
<path d="M26.1291 13.8362C26.1291 13.4211 25.7832 13.0752 25.3681 13.0752H21.4248V14.6664H25.3681C25.7832 14.6664 26.1291 14.2513 26.1291 13.8362Z" fill="#ACACAD"/>
</svg>
`,backgroundColor:"transparent"}},viz_xZrpAdXl:{type:"splunk.choropleth.svg",options:{svg:`<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path d="M19.025 16.6908C18.8705 16.3817 18.6387 16.2272 18.3296 16.2272H16.7841L18.175 14.3726C18.4069 14.0635 18.3296 13.5226 18.0205 13.2908C17.7114 13.059 17.1705 13.1362 16.9387 13.4453L14.6205 16.5362C14.466 16.7681 14.3887 17.0772 14.5432 17.309C14.6978 17.5408 14.9296 17.7726 15.2387 17.7726H16.7841L15.3932 19.6272C15.1614 19.9362 15.2387 20.4772 15.5478 20.709C15.7023 20.7862 15.8569 20.8635 16.0114 20.8635C16.2432 20.8635 16.475 20.7862 16.6296 20.5544L18.9478 17.4635C19.1023 17.2317 19.1796 16.9226 19.025 16.6908Z" fill="#ACACAD"/>
<path d="M8.12974 9.42726C8.59338 9.8909 9.13429 10.1227 9.75247 10.1227C10.2161 10.1227 10.757 9.96817 11.1434 9.65908C11.9934 9.0409 12.9206 8.49999 13.9252 8.1909C14.3116 8.03635 14.5434 7.64999 14.3888 7.18635C14.2343 6.72271 13.8479 6.56817 13.3843 6.72271C12.2252 7.10908 11.1434 7.64999 10.1388 8.42271C9.82974 8.65453 9.44338 8.65453 9.13429 8.42271L5.88883 4.94544C5.57974 4.63635 5.1161 4.63635 4.80701 4.94544C4.49792 5.25453 4.49792 5.71817 4.80701 6.02726L8.12974 9.42726Z" fill="#ACACAD"/>
<path d="M7.9752 19.859C7.82065 19.4726 7.43429 19.2408 6.97065 19.3953C6.58429 19.5499 6.35247 19.9362 6.50701 20.3999C6.89338 21.559 7.43429 22.6408 8.20701 23.6453C8.43883 23.9544 8.43883 24.3408 8.20701 24.6499L4.80701 28.0499C4.49792 28.359 4.49792 28.8226 4.80701 29.1317C4.96156 29.2862 5.19338 29.3635 5.34792 29.3635C5.50247 29.3635 5.73429 29.2862 5.88883 29.1317L9.28883 25.7317C10.0616 24.959 10.1388 23.6453 9.44338 22.7181C8.74792 21.7908 8.28429 20.8635 7.9752 19.859Z" fill="#ACACAD"/>
<path d="M7.58873 15.7636C7.74327 14.6818 8.05236 13.6772 8.516 12.7499C8.74782 12.3636 8.59327 11.8999 8.20691 11.7454C7.82054 11.5136 7.35691 11.6681 7.20236 12.0545C6.66145 13.1363 6.27509 14.2954 6.12054 15.5318C6.04327 15.9181 5.73418 16.2272 5.34782 16.2272H0.556907C0.0932706 16.2272 -0.21582 16.5363 -0.21582 16.9999C-0.21582 17.4636 0.0932706 17.7727 0.556907 17.7727H5.34782C6.50691 17.7727 7.43418 16.9227 7.58873 15.7636Z" fill="#ACACAD"/>
<path d="M15.4708 26.1954C14.389 26.0408 13.3845 25.7317 12.4572 25.2681C12.0709 25.0363 11.6072 25.1908 11.4527 25.5772C11.2209 25.9636 11.3754 26.4272 11.7618 26.5817C12.8436 27.1226 14.0027 27.509 15.239 27.6636C15.6254 27.7408 15.9345 28.0499 15.9345 28.359V33.2272C15.9345 33.6908 16.2436 33.9999 16.7072 33.9999C17.1708 33.9999 17.4799 33.6908 17.4799 33.2272V28.4363C17.4799 27.2772 16.6299 26.3499 15.4708 26.1954Z" fill="#ACACAD"/>
<path d="M25.3617 24.5727C24.589 23.7999 23.2753 23.7227 22.3481 24.4181C21.4981 25.0363 20.5708 25.5772 19.5662 25.8863C19.1799 26.0409 18.9481 26.4272 19.1026 26.8909C19.2572 27.2772 19.6435 27.509 20.1072 27.3545C21.2662 26.9681 22.3481 26.4272 23.3526 25.6545C23.6617 25.4227 24.0481 25.4227 24.3572 25.6545L27.7572 29.0545C27.9117 29.209 28.1435 29.2863 28.2981 29.2863C28.4526 29.2863 28.6844 29.209 28.839 29.0545C29.1481 28.7454 29.1481 28.2818 28.839 27.9727L25.3617 24.5727Z" fill="#ACACAD"/>
<path d="M25.5162 14.1409C25.5935 14.45 25.9026 14.6818 26.2889 14.6818C26.3662 14.6818 26.4435 14.6818 26.5207 14.6818C26.9071 14.5273 27.1389 14.1409 26.9844 13.6773C26.598 12.5182 26.0571 11.4364 25.2844 10.4318C25.0526 10.1227 25.0526 9.73635 25.2844 9.42726L28.6844 6.02726C28.9935 5.71817 28.9935 5.25453 28.6844 4.94544C28.3753 4.63635 27.9116 4.63635 27.6026 4.94544L24.2026 8.34544C23.4298 9.11817 23.3526 10.4318 24.048 11.3591C24.7435 12.2091 25.2071 13.1364 25.5162 14.1409Z" fill="#ACACAD"/>
<path d="M33.0114 16.2273H28.2205C27.0614 16.2273 26.1341 17.0773 25.9796 18.2364C25.825 19.3182 25.5159 20.3227 25.0523 21.25C24.8205 21.6364 24.975 22.1 25.3614 22.2546C25.4386 22.3318 25.5932 22.3318 25.7477 22.3318C26.0568 22.3318 26.2886 22.1773 26.4432 21.9455C26.9841 20.8637 27.3705 19.7046 27.525 18.4682C27.6023 18.0818 27.9114 17.7727 28.2205 17.7727H33.0114C33.475 17.7727 33.7841 17.4637 33.7841 17C33.7841 16.5364 33.475 16.2273 33.0114 16.2273Z" fill="#ACACAD"/>
<path d="M18.0203 7.80455C19.1021 7.95909 20.1067 8.26818 21.034 8.73182C21.1112 8.80909 21.2658 8.80909 21.4203 8.80909C21.7294 8.80909 21.9612 8.65455 22.1158 8.42273C22.3476 8.03636 22.193 7.57273 21.8067 7.41818C20.7249 6.87727 19.5658 6.49091 18.3294 6.33636C17.8658 6.25909 17.5567 5.95 17.5567 5.56364V0.772727C17.5567 0.309091 17.2476 0 16.784 0C16.3203 0 16.0112 0.309091 16.0112 0.772727V5.56364C16.0112 6.72273 16.8612 7.65 18.0203 7.80455Z" fill="#ACACAD"/>
<path d="M24.5117 17C24.5117 12.75 21.0344 9.27271 16.7844 9.27271C12.5344 9.27271 9.05713 12.75 9.05713 17C9.05713 21.25 12.5344 24.7273 16.7844 24.7273C21.0344 24.7273 24.5117 21.25 24.5117 17ZM10.6026 17C10.6026 13.6 13.3844 10.8182 16.7844 10.8182C20.1844 10.8182 22.9662 13.6 22.9662 17C22.9662 20.4 20.1844 23.1818 16.7844 23.1818C13.3844 23.1818 10.6026 20.4 10.6026 17Z" fill="#ACACAD"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="34" height="34" fill="white"/>
</clipPath>
</defs>
</svg>
`,backgroundColor:"transparent"}},viz_fOGtq3GD:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"#D41F1F"}},viz_bJsqtysd:{type:"splunk.markdown",options:{markdown:"## HVAC - 1"}},viz_MR8FqxZd:{type:"splunk.markdown",options:{markdown:"## Power Utilization"}},viz_dZmorf41:{type:"splunk.ellipse",options:{strokeColor:"transparent",fillColor:"#43454B"},context:{},showProgressBar:!1,showLastUpdated:!1},viz_tqvtX4Am:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.8,fillColor:"#1A1C20"}},viz_zEdhBzCP:{type:"splunk.singlevalue",options:{showSparklineAreaGraph:!0,majorFontSize:54,trendColor:"> trendValue | rangeValue(trendColorEditorConfig)",unit:"\xB0",sparklineAreaColor:"> sparklineStrokeColor",backgroundColor:"transparent",trendFontSize:24,sparklineStrokeColor:"> trendColor"},context:{trendColorEditorConfig:[{to:0,value:"#5cb3f2"},{from:0,value:"#FE3A3A"}]},dataSources:{primary:"ds_2k2tu89X_ds_dWi9oVi2"}},viz_sL8Q2jmx:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('1C')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_RArozFdZ:{type:"splunk.singlevalue",options:{majorColor:"#ffffff",majorFontSize:18,unit:"\xB0",backgroundColor:"> majorValue | rangeValue(backgroundColorEditorConfig)",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('5C')"},context:{backgroundColorEditorConfig:[{to:50,value:"#5cb3f2"},{to:70,from:50,value:"#CBA700"},{from:70,value:"#D41F1F"}]},dataSources:{primary:"ds_Y6m3TC9v"}},viz_Zqanb6Zh:{type:"splunk.markdown",options:{markdown:"#### High 70\xB0-100\xB0",fontColor:"#AEAFB1"}},viz_FG2v05LZ:{type:"splunk.markdown",options:{markdown:`# Full Source

\`\`\`json
{
  "inputs": {},
  "dataSources": {
    "ds_FZspy2J5": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval speed=124\\n| eval status=case(speed>0, \\"On\\", 1=1, \\"Off\\")\\n| eval fan=\\"fan\\"\\n| table speed, status, fan"
      },
      "name": "HVAC 1"
    },
    "ds_2k2tu89X_ds_dWi9oVi2": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=6500\\n| eval temp=(random() %100)\\n| eval c=1\\n| eval diff=(random() % 110000)\\n| eval _time=now()-diff\\n| timechart count(c) as val by temp span=1h\\n| eval val=val/max(val)\\n"
      },
      "name": "Room Temp"
    },
    "ds_tmBqJ9ha_ds_33Mhcgkk": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval Host=\\"mysql-02\\"\\n| eval Rack=2\\n| eval Priority=\\"High\\"\\n| eval Row=\\"A\\"\\n| append \\n    [makeresults\\n| eval Host=\\"storage_websever-02\\"\\n| eval Rack=2\\n| eval Priority=\\"Medium\\"\\n| eval Row=\\"A\\"]\\n| append \\n    [makeresults\\n| eval Host=\\"storage_exchange-03\\"\\n| eval Rack=2\\n| eval Priority=\\"High\\"\\n| eval Row=\\"C\\"]\\n| append \\n    [makeresults\\n| eval Host=\\"db-01\\"\\n| eval Rack=2\\n| eval Priority=\\"Critical\\"\\n| eval Row=\\"A\\"]\\n| append \\n    [makeresults\\n| eval Host=\\"websphere-01\\"\\n| eval Rack=2\\n| eval Priority=\\"Medium\\"\\n| eval Row=\\"A\\"]\\n| append \\n    [makeresults\\n| eval Host=\\"websphere-01\\"\\n| eval Rack=2\\n| eval Priority=\\"Medium\\"\\n| eval Row=\\"A\\"]\\n| append \\n    [makeresults\\n| eval Host=\\"storage_websever-01\\"\\n| eval Rack=2\\n| eval Priority=\\"Low\\"\\n| eval Row=\\"B\\"]\\n| append \\n    [makeresults\\n| eval Host=\\"storage_exchange-05\\"\\n| eval Rack=3\\n| eval Priority=\\"Low\\"\\n| eval Row=\\"C\\"]\\n| append \\n    [makeresults\\n| eval Host=\\"db-01\\"\\n| eval Rack=1\\n| eval Priority=\\"Medium\\"\\n| eval Row=\\"B\\"]\\n| append \\n    [makeresults\\n| eval Host=\\"websphere-01\\"\\n| eval Rack=2\\n| eval Priority=\\"High\\"\\n| eval Row=\\"B\\"]\\n| append \\n    [makeresults\\n| eval Host=\\"websphere-01\\"\\n| eval Rack=2\\n| eval Priority=\\"Medium\\"\\n| eval Row=\\"B\\"]\\n| search Row=*\\n| table Host Priority Rack Row"
      },
      "name": "Anomalies 2"
    },
    "ds_RQZPY5cd": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=5000\\n| eval diff=(random() % 100000)\\n| eval server=\\"1\\"\\n| eval row=\\"A\\"\\n| eval _time=now()-diff\\n| append \\n    [ makeresults count=6000\\n| eval diff=(random() % 100000)\\n| eval server=\\"2\\"\\n| eval row=\\"A\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=4000\\n| eval diff=(random() % 100000)\\n| eval server=\\"3\\"\\n| eval row=\\"A\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=7000\\n| eval diff=(random() % 100000)\\n| eval server=\\"4\\"\\n| eval row=\\"A\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=5000\\n| eval diff=(random() % 100000)\\n| eval server=\\"5\\"\\n| eval row=\\"A\\"\\n| eval _time=now()-diff]\\n| append\\n\\t[ makeresults count=6000\\n| eval diff=(random() % 100000)\\n| eval server=\\"1\\"\\n| eval row=\\"B\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=7000\\n| eval diff=(random() % 100000)\\n| eval server=\\"2\\"\\n| eval row=\\"B\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=5000\\n| eval diff=(random() % 100000)\\n| eval server=\\"3\\"\\n| eval row=\\"B\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=4000\\n| eval diff=(random() % 100000)\\n| eval server=\\"4\\"\\n| eval row=\\"B\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=5000\\n| eval diff=(random() % 100000)\\n| eval server=\\"5\\"\\n| eval row=\\"B\\"\\n| eval _time=now()-diff]\\n| append\\n\\t[ makeresults count=4000\\n| eval diff=(random() % 100000)\\n| eval server=\\"1\\"\\n| eval row=\\"C\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=5000\\n| eval diff=(random() % 100000)\\n| eval server=\\"2\\"\\n| eval row=\\"C\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=6000\\n| eval diff=(random() % 100000)\\n| eval server=\\"3\\"\\n| eval row=\\"C\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=9000\\n| eval diff=(random() % 100000)\\n| eval server=\\"4\\"\\n| eval row=\\"C\\"\\n| eval _time=now()-diff]\\n| append \\n    [ makeresults count=7000\\n| eval diff=(random() % 100000)\\n| eval server=\\"5\\"\\n| eval row=\\"C\\"\\n| eval _time=now()-diff]\\n| search row=*\\n| timechart span=30min count by server"
      },
      "name": "Power Use"
    },
    "ds_33Mhcgkk": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval System=\\"Power\\"\\n| eval Rack=2\\n| eval Devices=\\"PDU-02\\"\\n| eval Value=3400\\n| append \\n    [makeresults\\n| eval System=\\"Power\\"\\n| eval Rack=2\\n| eval Devices=\\"PDU-07\\"\\n| eval Value=2375]\\n| append \\n    [makeresults\\n| eval System=\\"Power\\"\\n| eval Rack=2\\n| eval Devices=\\"PDU-12\\"\\n| eval Value=2245]\\n| table System Rack Devices Value"
      },
      "name": "Anomalies 1"
    },
    "ds_abKnpfzZ": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=7000\\n| eval temp=(random() %1000)\\n| eval c=1\\n| eval diff=(random() % 110000)\\n| eval _time=now()-diff\\n| timechart count(c) as water by temp span=1h\\n| eval water=water/max(water)\\n\\n"
      },
      "name": "Water"
    },
    "ds_dWi9oVi2": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults count=250000\\n| eval diff=(random() % 110000)\\n| eval _time=now()-diff\\n| timechart count as power by temp span=1h\\n| eval power=power/max(power)\\n"
      },
      "name": "Power Util"
    },
    "ds_6zvrUOR6": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval speed=0\\n| eval status=case(speed>0, \\"On\\", 1=1, \\"Off\\")\\n| eval fan=\\"fan\\"\\n| table speed, status, fan"
      },
      "name": "HVAC 2"
    },
    "ds_qwJWyIWq_ds_8qwizlRA_ds_FZspy2J5": {
      "type": "ds.chain",
      "options": {
        "query": "| table status",
        "extend": "ds_6zvrUOR6"
      },
      "name": "HVAC 2 - Status"
    },
    "ds_8qwizlRA_ds_FZspy2J5": {
      "type": "ds.chain",
      "options": {
        "query": "| table status",
        "extend": "ds_FZspy2J5"
      },
      "name": "HVAC 1 - Status"
    },
    "ds_Y6m3TC9v": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults\\n| eval 1A=42, 2A=46, 3A=43, 4A=39, 5A=47, 1B=37, 2B=52,3B=57,4B=64,5B=58,1C=49,2C=55,3C=72,4C=88,5C=77"
      },
      "name": "Server room heatmap"
    }
  },
  "title": "Datacenter Sensors",
  "defaults": {
    "visualizations": {
      "global": {
        "showLastUpdated": false
      }
    },
    "dataSources": {
      "global": {
        "options": {
          "queryParameters": {
            "earliest": "-24h@h",
            "latest": "now"
          }
        }
      }
    }
  },
  "visualizations": {
    "viz_dzqdh0kW": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Fan Speed",
        "fontColor": "#8D8D8F"
      }
    },
    "viz_DO7xE34x": {
      "type": "splunk.choropleth.svg",
      "dataSources": {
        "primary": "ds_6zvrUOR6"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "match": "On",
            "value": "url(#paint0_radial)"
          },
          {
            "match": "Off",
            "value": "none)"
          }
        ]
      },
      "options": {
        "svg": "<svg width=\\"82\\" height=\\"97\\" viewBox=\\"0 0 82 97\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<path id=\\"fan\\" fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M82 19V78C82 88.4934 63.6437 97 41 97C18.3563 97 0 88.4934 0 78V19C0 8.50659 18.3563 0 41 0C63.6437 0 82 8.50659 82 19Z\\" fill=\\"url(#paint0_radial)\\"/>\\n<defs>\\n<radialGradient id=\\"paint0_radial\\" cx=\\"0\\" cy=\\"0\\" r=\\"1\\" gradientUnits=\\"userSpaceOnUse\\" gradientTransform=\\"translate(41 97) rotate(-90) scale(60.5 59)\\">\\n<stop stop-color=\\"#61CAFA\\"/>\\n<stop offset=\\"1\\" stop-color=\\"#61CAFA\\" stop-opacity=\\"0\\"/>\\n</radialGradient>\\n</defs>\\n</svg>\\n",
        "areaColors": "> areaValues | matchValue(areaColorsEditorConfig)",
        "backgroundColor": "transparent",
        "areaValues": "> primary | seriesByName('status')",
        "areaIds": "> primary | seriesByName('fan')"
      }
    },
    "viz_PjJj3PhI": {
      "type": "splunk.ellipse",
      "dataSources": {
        "primary": "ds_qwJWyIWq_ds_8qwizlRA_ds_FZspy2J5"
      },
      "options": {
        "fillColor": "> fillDataValue | matchValue(fillColorEditorConfig)"
      },
      "context": {
        "fillColorEditorConfig": [
          {
            "match": "Off",
            "value": "#505158"
          },
          {
            "value": "#62C9FA",
            "match": "On"
          }
        ],
        "fillDataValue": "> primary | seriesByName('status') | lastPoint()"
      },
      "showProgressBar": false,
      "showLastUpdated": false
    },
    "viz_ygXLEB4m": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('1B')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_2FLiZNYw": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Fan Speed",
        "fontColor": "#8D8D8F"
      }
    },
    "viz_jYxw2kyV": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('2A')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_61AXTZf1": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## Power Usage"
      }
    },
    "viz_hsMjalhP": {
      "type": "splunk.singlevalue",
      "options": {
        "showSparklineAreaGraph": true,
        "majorFontSize": 54,
        "trendColor": "> trendValue | rangeValue(trendColorEditorConfig)",
        "sparklineAreaColor": "> sparklineStrokeColor",
        "backgroundColor": "transparent",
        "trendFontSize": 24,
        "trendDisplay": "percent",
        "sparklineStrokeColor": "> trendColor"
      },
      "context": {
        "trendColorEditorConfig": [
          {
            "to": 0,
            "value": "#5cb3f2"
          },
          {
            "from": 0,
            "value": "#FE3A3A"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_dWi9oVi2"
      }
    },
    "viz_Kc5E88jq": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.8,
        "fillColor": "#1A1C20"
      }
    },
    "viz_vH43hiRI": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "#### Low 50\xB0-70\xB0",
        "fontColor": "#AEAFB1"
      }
    },
    "viz_JNO4wXtf": {
      "type": "splunk.image",
      "options": {
        "src": "/static/app/splunk-dashboard-studio/images/examples-hub/datacenter/Servers.png",
        "preserveAspectRatio": true
      }
    },
    "viz_QuoUsKIq": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('3A')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_xhfBJMdl": {
      "type": "splunk.line",
      "options": {
        "backgroundColor": "transparent",
        "xAxisTitleVisibility": "hide",
        "yAxisMin": 50,
        "seriesColorsByField": {
          "1": "#A870EF",
          "2": "#A9F5E7",
          "3": "#F29BAC",
          "4": "#26AA92",
          "5": "#FDAF93"
        }
      },
      "dataSources": {
        "primary": "ds_RQZPY5cd"
      }
    },
    "viz_ZcqbKrAu": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<svg width=\\"34\\" height=\\"34\\" viewBox=\\"0 0 34 34\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<g clip-path=\\"url(#clip0)\\">\\n<path d=\\"M13.9093 13.9091C14.3729 13.9091 14.682 13.6 14.682 13.1364V11.5909H16.2275C16.6911 11.5909 17.0002 11.2818 17.0002 10.8182C17.0002 10.3546 16.6911 10.0455 16.2275 10.0455H14.682V8.50002C14.682 8.03639 14.3729 7.72729 13.9093 7.72729C13.4456 7.72729 13.1365 8.03639 13.1365 8.50002V10.0455H11.5911C11.1275 10.0455 10.8184 10.3546 10.8184 10.8182C10.8184 11.2818 11.1275 11.5909 11.5911 11.5909H13.1365V13.1364C13.1365 13.6 13.4456 13.9091 13.9093 13.9091Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M14.6819 32.4545H7.72736C7.26373 32.4545 6.95463 32.1454 6.95463 31.6817V5.409C6.95463 4.94537 7.26373 4.63628 7.72736 4.63628H13.9092C14.3728 4.63628 14.6819 4.32718 14.6819 3.86355C14.6819 3.39991 14.3728 3.09082 13.9092 3.09082H7.72736C6.41373 3.09082 5.40918 4.09537 5.40918 5.409V31.6817C5.40918 32.9954 6.41373 33.9999 7.72736 33.9999H14.6819C15.1455 33.9999 15.4546 33.6908 15.4546 33.2272C15.4546 32.7636 15.1455 32.4545 14.6819 32.4545Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M22.8725 23.3362C22.5635 23.1044 22.0225 23.1817 21.7907 23.4908L19.4725 26.5817C19.318 26.8135 19.2407 27.1226 19.3953 27.3544C19.5498 27.5862 19.7816 27.818 20.0907 27.818H21.6362L20.2453 29.6726C20.0135 29.9817 20.0907 30.5226 20.3998 30.7544C20.5544 30.8317 20.7089 30.9089 20.8635 30.9089C21.0953 30.9089 21.3271 30.8317 21.4816 30.5998L23.7998 27.5089C23.9544 27.2771 24.0316 26.968 23.8771 26.7362C23.7225 26.4271 23.4907 26.2726 23.1816 26.2726H21.6362L23.0271 24.418C23.2589 24.1089 23.1816 23.568 22.8725 23.3362Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M22.409 20.1682V5.40909C22.409 4.09545 21.4045 3.09091 20.0909 3.09091H17.7727V0.772727C17.7727 0.309091 17.4636 0 17 0H10.8181C10.3545 0 10.0454 0.309091 10.0454 0.772727C10.0454 1.23636 10.3545 1.54545 10.8181 1.54545H16.2272V3.86364C16.2272 4.32727 16.5363 4.63636 17 4.63636H20.0909C20.5545 4.63636 20.8636 4.94545 20.8636 5.40909V20.8636C20.8636 21.3273 21.1727 21.6364 21.6363 21.6364C24.65 21.6364 27.0454 24.0318 27.0454 27.0455C27.0454 30.0591 24.65 32.4545 21.6363 32.4545C18.6227 32.4545 16.2272 30.0591 16.2272 27.0455C16.2272 25.1136 17.309 23.2591 19.009 22.3318C19.3954 22.1 19.55 21.6364 19.3181 21.25C19.0863 20.8636 18.6227 20.7091 18.2363 20.9409C16.459 21.9455 15.3 23.5682 14.8363 25.5H11.5909C11.1272 25.5 10.8181 25.8091 10.8181 26.2727C10.8181 26.7364 11.1272 27.0455 11.5909 27.0455H14.6818C14.6818 30.9091 17.7727 34 21.6363 34C25.5 34 28.5909 30.9091 28.5909 27.0455C28.5909 23.4909 25.8863 20.5545 22.409 20.1682Z\\" fill=\\"#ACACAD\\"/>\\n</g>\\n<defs>\\n<clipPath id=\\"clip0\\">\\n<rect width=\\"34\\" height=\\"34\\" fill=\\"white\\"/>\\n</clipPath>\\n</defs>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_Mq69Fdyn": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.5,
        "fillColor": "#1A1C20"
      }
    },
    "viz_5183dBun": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## Room Temperature"
      }
    },
    "viz_NV0gv5cl": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<svg width=\\"34\\" height=\\"34\\" viewBox=\\"0 0 34 34\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<g clip-path=\\"url(#clip0)\\">\\n<path d=\\"M3.09082 21.6364C3.09082 22.6409 3.709 23.4909 4.63627 23.8V27.0455C4.63627 27.5091 4.94537 27.8182 5.409 27.8182C5.87264 27.8182 6.18173 27.5091 6.18173 27.0455V23.9545H12.3635C12.8272 23.9545 13.1363 23.6455 13.1363 23.1818C13.1363 22.7182 12.8272 22.4091 12.3635 22.4091H5.409C4.94537 22.4091 4.63627 22.1 4.63627 21.6364C4.63627 21.1727 4.94537 20.8636 5.409 20.8636H10.0454C10.509 20.8636 10.8181 20.5545 10.8181 20.0909C10.8181 19.6273 10.509 19.3182 10.0454 19.3182H6.18173V14.6818H9.27264C9.73628 14.6818 10.0454 14.3727 10.0454 13.9091C10.0454 13.4455 9.73628 13.1364 9.27264 13.1364H5.409C4.94537 13.1364 4.63627 12.8273 4.63627 12.3636C4.63627 11.9 4.94537 11.5909 5.409 11.5909H12.3635C12.8272 11.5909 13.1363 11.2818 13.1363 10.8182C13.1363 10.3545 12.8272 10.0455 12.3635 10.0455H6.18173V3.86364C6.18173 3.4 5.87264 3.09091 5.409 3.09091C4.94537 3.09091 4.63627 2.78182 4.63627 2.31818C4.63627 1.85455 4.94537 1.54545 5.409 1.54545H28.5908C29.0545 1.54545 29.3635 1.85455 29.3635 2.31818C29.3635 2.78182 29.0545 3.09091 28.5908 3.09091H8.49991C8.03627 3.09091 7.72718 3.4 7.72718 3.86364C7.72718 4.32727 8.03627 4.63636 8.49991 4.63636H28.5908C29.9045 4.63636 30.909 3.63182 30.909 2.31818C30.909 1.00455 29.9045 0 28.5908 0H5.409C4.09537 0 3.09082 1.00455 3.09082 2.31818C3.09082 3.32273 3.709 4.17273 4.63627 4.48182V10.2C3.709 10.5091 3.09082 11.3591 3.09082 12.3636C3.09082 13.3682 3.709 14.2182 4.63627 14.5273V19.4727C3.709 19.7818 3.09082 20.6318 3.09082 21.6364Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M16.3817 11.9001C16.0726 12.3638 13.1362 16.3819 13.1362 18.7001C13.1362 20.7865 14.8362 22.4092 16.9999 22.4092C19.1635 22.4092 20.8635 20.7092 20.8635 18.7001C20.8635 16.3819 17.9271 12.3638 17.618 11.9001C17.309 11.5138 16.6908 11.5138 16.3817 11.9001ZM19.318 18.7001C19.318 19.9365 18.3135 20.8638 16.9999 20.8638C15.6862 20.8638 14.6817 19.8592 14.6817 18.7001C14.6817 17.6183 15.918 15.3774 16.9999 13.7547C18.0817 15.3001 19.318 17.541 19.318 18.7001Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M30.909 12.3637C30.909 11.3592 30.2908 10.5092 29.3635 10.2001V6.95461C29.3635 6.49098 29.0545 6.18188 28.5908 6.18188C28.1272 6.18188 27.8181 6.49098 27.8181 6.95461V10.0455H21.6363C21.1726 10.0455 20.8635 10.3546 20.8635 10.8182C20.8635 11.2819 21.1726 11.591 21.6363 11.591H28.5908C29.0545 11.591 29.3635 11.9001 29.3635 12.3637C29.3635 12.8273 29.0545 13.1364 28.5908 13.1364H25.4999C25.0363 13.1364 24.7272 13.4455 24.7272 13.9092C24.7272 14.3728 25.0363 14.6819 25.4999 14.6819H27.8181V19.3182H25.4999C25.0363 19.3182 24.7272 19.6273 24.7272 20.091C24.7272 20.5546 25.0363 20.8637 25.4999 20.8637H28.5908C29.0545 20.8637 29.3635 21.1728 29.3635 21.6364C29.3635 22.1001 29.0545 22.4092 28.5908 22.4092H23.1817C22.7181 22.4092 22.409 22.7182 22.409 23.1819C22.409 23.6455 22.7181 23.9546 23.1817 23.9546H27.8181V30.1364C27.8181 30.6001 28.1272 30.9092 28.5908 30.9092C29.0545 30.9092 29.3635 31.2182 29.3635 31.6819C29.3635 32.1455 29.0545 32.4546 28.5908 32.4546H5.409C4.94537 32.4546 4.63627 32.1455 4.63627 31.6819C4.63627 31.2182 4.94537 30.9092 5.409 30.9092H25.4999C25.9635 30.9092 26.2726 30.6001 26.2726 30.1364C26.2726 29.6728 25.9635 29.3637 25.4999 29.3637H5.409C4.09537 29.3637 3.09082 30.3682 3.09082 31.6819C3.09082 32.9955 4.09537 34.0001 5.409 34.0001H28.5908C29.9045 34.0001 30.909 32.9955 30.909 31.6819C30.909 30.6773 30.2908 29.8273 29.3635 29.5182V23.8001C30.2908 23.491 30.909 22.641 30.909 21.6364C30.909 20.6319 30.2908 19.7819 29.3635 19.4728V14.5273C30.2908 14.2182 30.909 13.3682 30.909 12.3637Z\\" fill=\\"#ACACAD\\"/>\\n</g>\\n<defs>\\n<clipPath id=\\"clip0\\">\\n<rect width=\\"34\\" height=\\"34\\" fill=\\"white\\"/>\\n</clipPath>\\n</defs>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_QvsFMX54": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## Water Capacity"
      }
    },
    "viz_Owlm3nQj": {
      "type": "splunk.choropleth.svg",
      "dataSources": {
        "primary": "ds_FZspy2J5"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "match": "On",
            "value": "url(#paint0_radial)"
          },
          {
            "match": "Off",
            "value": "none)"
          }
        ]
      },
      "options": {
        "svg": "<svg width=\\"82\\" height=\\"97\\" viewBox=\\"0 0 82 97\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<path id=\\"fan\\" fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M82 19V78C82 88.4934 63.6437 97 41 97C18.3563 97 0 88.4934 0 78V19C0 8.50659 18.3563 0 41 0C63.6437 0 82 8.50659 82 19Z\\" fill=\\"url(#paint0_radial)\\"/>\\n<defs>\\n<radialGradient id=\\"paint0_radial\\" cx=\\"0\\" cy=\\"0\\" r=\\"1\\" gradientUnits=\\"userSpaceOnUse\\" gradientTransform=\\"translate(41 97) rotate(-90) scale(60.5 59)\\">\\n<stop stop-color=\\"#61CAFA\\"/>\\n<stop offset=\\"1\\" stop-color=\\"#61CAFA\\" stop-opacity=\\"0\\"/>\\n</radialGradient>\\n</defs>\\n</svg>\\n",
        "areaColors": "> areaValues | matchValue(areaColorsEditorConfig)",
        "backgroundColor": "transparent",
        "areaIds": "> primary | seriesByName('fan')",
        "areaValues": "> primary | seriesByName('status')"
      }
    },
    "viz_uMsD9U29": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.5,
        "fillColor": "#1A1C20"
      }
    },
    "viz_sh2FGEJo": {
      "type": "splunk.table",
      "options": {
        "tableFormat": {
          "rowColors": "> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",
          "headerColor": "> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)",
          "headerBackgroundColor": "#5cb3f2",
          "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableRowBackgroundColorsByBackgroundColor)"
        },
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_33Mhcgkk"
      }
    },
    "viz_RodDAMCa": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## HVAC - 2"
      }
    },
    "viz_jrwJjbh3": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('3B')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_NFgVlgyR": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#5cb3f2"
      }
    },
    "viz_LiC3o5UB": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# **Datacenter Sensors**"
      }
    },
    "viz_g5GyUgld": {
      "type": "splunk.table",
      "options": {
        "count": 6,
        "tableFormat": {
          "rowColors": "> rowBackgroundColors | maxContrast(tableRowColorMaxContrast)",
          "headerColor": "> headerBackgroundColor | maxContrast(tableRowColorMaxContrast)",
          "headerBackgroundColor": "#5cb3f2",
          "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableRowBackgroundColorsByBackgroundColor)"
        },
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_tmBqJ9ha_ds_33Mhcgkk"
      }
    },
    "viz_Apx34i44": {
      "type": "splunk.singlevalue",
      "options": {
        "showSparklineAreaGraph": true,
        "majorFontSize": 54,
        "trendColor": "> trendValue | rangeValue(trendColorEditorConfig)",
        "sparklineAreaColor": "> sparklineStrokeColor",
        "backgroundColor": "transparent",
        "trendFontSize": 24,
        "trendDisplay": "percent",
        "sparklineStrokeColor": "> trendColor"
      },
      "context": {
        "trendColorEditorConfig": [
          {
            "to": 0,
            "value": "#FE3A3A"
          },
          {
            "from": 0,
            "value": "#5cb3f2"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_abKnpfzZ"
      }
    },
    "viz_pHvn1tuj": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "####  Safe 0\xB0-50\xB0",
        "fontColor": "#AEAFB1"
      }
    },
    "viz_UqheLYEr": {
      "type": "splunk.ellipse",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#43454B"
      },
      "context": {},
      "showProgressBar": false,
      "showLastUpdated": false
    },
    "viz_c1tm37dG": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('5B')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_8X4cRgh0": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.8,
        "fillColor": "#1A1C20"
      }
    },
    "viz_RZ1m5Ubz": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('4A')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_pgULSQZ3": {
      "dataSources": {
        "primary": "ds_FZspy2J5"
      },
      "type": "splunk.singlevalue",
      "options": {
        "majorFontSize": 14,
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "trendDisplay": "off",
        "majorColor": "> majorValue | rangeValue(majorColorEditorConfig)"
      },
      "context": {
        "majorColorEditorConfig": [
          {
            "from": 1,
            "value": "#62C9FA"
          },
          {
            "value": "#818285",
            "to": 1
          }
        ]
      }
    },
    "viz_gnLaI5Bb": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('3C')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_YIsgPKsx": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<svg width=\\"34\\" height=\\"34\\" viewBox=\\"0 0 34 34\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<g clip-path=\\"url(#clip0)\\">\\n<path d=\\"M26.9681 11.9773C26.8135 11.7455 26.5817 11.5909 26.2726 11.5909H20.5544L25.4226 1.08182C25.4999 0.85 25.4999 0.540909 25.3454 0.309091C25.1908 0.0772727 24.959 0 24.7272 0H16.2272C15.7635 0 15.4544 0.309091 15.4544 0.772727C15.4544 1.23636 15.7635 1.54545 16.2272 1.54545H23.4908L18.6226 12.0545C18.5454 12.2864 18.5454 12.5955 18.6999 12.8273C18.8544 13.0591 19.0863 13.1364 19.3181 13.1364H24.8044L13.909 29.4409L16.2272 18.7C16.3044 18.4682 16.2272 18.2364 16.0726 18.0818C15.9181 17.85 15.6863 17.7727 15.4544 17.7727H8.73171L13.909 1.00455C14.0635 0.618182 13.8317 0.154545 13.3681 0.0772727C12.9817 -0.0772727 12.5181 0.154545 12.4408 0.618182L7.03171 18.3909C6.95444 18.5455 6.95444 18.7773 7.10899 19.0091C7.26353 19.1636 7.49535 19.3182 7.72717 19.3182H14.5272L11.5908 33.0727C11.5135 33.4591 11.6681 33.7682 12.0544 33.9227C12.1317 34 12.2863 34 12.3635 34C12.5954 34 12.8272 33.8455 12.9817 33.6909L26.8908 12.8273C27.0454 12.5182 27.1226 12.2864 26.9681 11.9773Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M13.2138 7.49544L10.8956 14.45C10.741 14.8364 10.9728 15.3 11.3592 15.4545C11.4365 15.4545 11.5138 15.5318 11.591 15.5318C11.9001 15.5318 12.2092 15.3 12.2865 14.9909L14.6047 8.03635C14.7592 7.64999 14.5274 7.18635 14.141 7.03181C13.7547 6.87726 13.291 7.10908 13.2138 7.49544Z\\" fill=\\"#ACACAD\\"/>\\n</g>\\n<defs>\\n<clipPath id=\\"clip0\\">\\n<rect width=\\"34\\" height=\\"34\\" fill=\\"white\\"/>\\n</clipPath>\\n</defs>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_xZCOfgz8": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## Anomalies Detected"
      }
    },
    "viz_XhOQlSx9": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "ds_8qwizlRA_ds_FZspy2J5"
      },
      "options": {
        "majorFontSize": 14,
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "trendDisplay": "off",
        "majorColor": "> majorValue | matchValue(majorColorEditorConfig)",
        "sparklineValues": "> primary | seriesByName('status')"
      },
      "context": {
        "majorColorEditorConfig": [
          {
            "match": "Off",
            "value": "#505158"
          },
          {
            "value": "#62C9FA",
            "match": "On"
          }
        ]
      }
    },
    "viz_DGzy6QpW": {
      "type": "splunk.choropleth.svg",
      "dataSources": {
        "primary": "ds_6zvrUOR6"
      },
      "options": {
        "svg": "<svg width=\\"25\\" height=\\"25\\" viewBox=\\"0 0 25 25\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<rect id=\\"fan\\" width=\\"25\\" height=\\"25\\" fill=\\"url(#pattern1)\\"/>\\n<pattern id=\\"pattern0\\" width=\\"25\\" height=\\"25\\">\\n<path d=\\"M22.1693 19.2562C23.6316 17.1974 24.4171 14.7346 24.4171 12.2093C24.4171 9.684 23.6316 7.22124 22.1693 5.16236L23.8153 3.51639C24.2016 3.13009 24.4186 2.60616 24.4186 2.05985C24.4186 1.51355 24.2016 0.989615 23.8153 0.603317C23.429 0.21702 22.9051 0 22.3588 0C21.8124 0 21.2885 0.21702 20.9022 0.603317L19.2562 2.24929C17.1974 0.787041 14.7346 0.00147748 12.2093 0.00147748C9.684 0.00147748 7.22124 0.787041 5.16236 2.24929L3.51639 0.603317C3.13009 0.21702 2.60616 -5.75628e-09 2.05985 0C1.51355 5.75628e-09 0.989615 0.21702 0.603317 0.603317C0.21702 0.989615 5.75628e-09 1.51355 0 2.05985C-5.75628e-09 2.60616 0.21702 3.13009 0.603317 3.51639L2.24929 5.16236C0.787041 7.22124 0.00147748 9.684 0.00147748 12.2093C0.00147748 14.7346 0.787041 17.1974 2.24929 19.2562L0.603317 20.9022C0.21702 21.2885 0 21.8124 0 22.3588C0 22.9051 0.21702 23.429 0.603317 23.8153C0.989615 24.2016 1.51355 24.4186 2.05985 24.4186C2.60616 24.4186 3.13009 24.2016 3.51639 23.8153L5.16236 22.1693C7.22124 23.6316 9.684 24.4171 12.2093 24.4171C14.7346 24.4171 17.1974 23.6316 19.2562 22.1693L20.9022 23.8153C21.2885 24.2016 21.8124 24.4186 22.3588 24.4186C22.9051 24.4186 23.429 24.2016 23.8153 23.8153C24.2016 23.429 24.4186 22.9051 24.4186 22.3588C24.4186 21.8124 24.2016 21.2885 23.8153 20.9022L22.1693 19.2562ZM21.5 1.20109C21.7301 0.97786 22.0381 0.853018 22.3588 0.853018C22.6794 0.853018 22.9874 0.97786 23.2175 1.20109C23.3305 1.31372 23.4202 1.44756 23.4814 1.59493C23.5426 1.74229 23.5741 1.90029 23.5741 2.05985C23.5741 2.21942 23.5426 2.37742 23.4814 2.52478C23.4202 2.67215 23.3305 2.80599 23.2175 2.91862L21.66 4.4804C21.6305 4.44251 21.5968 4.41304 21.5673 4.37937C21.1054 3.82341 20.5939 3.31053 20.0392 2.84706L19.9382 2.75865L21.5 1.20109ZM1.20109 1.20109C1.31344 1.08755 1.44718 0.997427 1.59459 0.935916C1.74199 0.874406 1.90013 0.842735 2.05985 0.842735C2.21958 0.842735 2.37772 0.874406 2.52512 0.935916C2.67253 0.997427 2.80627 1.08755 2.91862 1.20109L4.4804 2.75865L4.37937 2.84706C3.82564 3.31158 3.31427 3.82437 2.85127 4.37937C2.8218 4.41304 2.78812 4.44251 2.75865 4.4804L1.20109 2.91862C1.08806 2.80599 0.998381 2.67215 0.93719 2.52478C0.875999 2.37742 0.8445 2.21942 0.8445 2.05985C0.8445 1.90029 0.875999 1.74229 0.93719 1.59493C0.998381 1.44756 1.08806 1.31372 1.20109 1.20109ZM2.91862 23.2175C2.68798 23.4398 2.38015 23.5639 2.05985 23.5639C1.73956 23.5639 1.43173 23.4398 1.20109 23.2175C1.08806 23.1049 0.998381 22.9711 0.93719 22.8237C0.875999 22.6763 0.8445 22.5183 0.8445 22.3588C0.8445 22.1992 0.875999 22.0412 0.93719 21.8938C0.998381 21.7465 1.08806 21.6126 1.20109 21.5L2.75865 19.9382C2.78812 19.9761 2.8218 20.0056 2.85127 20.0392C3.31321 20.5952 3.82468 21.1081 4.37937 21.5716C4.41304 21.5968 4.44251 21.6305 4.4804 21.66L2.91862 23.2175ZM5.36442 21.2853C4.52115 20.6483 3.77029 19.8975 3.13331 19.0542C1.64577 17.0822 0.841107 14.6794 0.841107 12.2093C0.841107 9.73922 1.64577 7.33636 3.13331 5.36442C3.29328 5.15394 3.45746 4.94346 3.63005 4.74982C4.15073 4.15246 4.73196 3.61073 5.36442 3.13331C7.33599 1.64677 9.73802 0.842695 12.2072 0.842695C14.6764 0.842695 17.0784 1.64677 19.05 3.13331C19.8933 3.77029 20.6441 4.52115 21.2811 5.36442C22.7686 7.33636 23.5733 9.73922 23.5733 12.2093C23.5733 14.6794 22.7686 17.0822 21.2811 19.0542C20.6441 19.8975 19.8933 20.6483 19.05 21.2853C17.0784 22.7718 14.6764 23.5759 12.2072 23.5759C9.73802 23.5759 7.33599 22.7718 5.36442 21.2853ZM23.2175 23.2175C22.9869 23.4398 22.6791 23.5639 22.3588 23.5639C22.0385 23.5639 21.7306 23.4398 21.5 23.2175L19.9382 21.66L20.0392 21.5716C20.593 21.107 21.1043 20.5942 21.5673 20.0392C21.5968 20.0056 21.6305 19.9761 21.66 19.9382L23.2175 21.5C23.3305 21.6126 23.4202 21.7465 23.4814 21.8938C23.5426 22.0412 23.5741 22.1992 23.5741 22.3588C23.5741 22.5183 23.5426 22.6763 23.4814 22.8237C23.4202 22.9711 23.3305 23.1049 23.2175 23.2175Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M19.4541 15.8675C19.5807 15.8892 19.7088 15.9004 19.8372 15.9012C20.3566 15.9044 20.8589 15.7155 21.2474 15.3708C21.7195 14.9677 22.0951 14.4638 22.3465 13.8963C22.5978 13.3287 22.7186 12.7119 22.6998 12.0914C22.6611 11.0286 22.2216 10.0198 21.4696 9.26776C20.7175 8.51572 19.7087 8.07621 18.6459 8.03756C17.8103 8.01402 16.987 8.24228 16.2828 8.69271C15.5786 9.14313 15.0262 9.7949 14.6972 10.5633C14.3906 10.1091 13.9675 9.74556 13.4722 9.51094V9.44779C13.3467 8.91345 13.3969 8.35288 13.6153 7.84932C13.8337 7.34576 14.2087 6.92607 14.6846 6.65259C14.9937 6.47652 15.2601 6.23425 15.4646 5.94314C15.6691 5.65202 15.8067 5.31927 15.8675 4.96873C15.9255 4.65171 15.9109 4.32568 15.8249 4.01509C15.7388 3.70451 15.5836 3.41744 15.3708 3.17542C14.9677 2.70332 14.4638 2.32773 13.8963 2.07637C13.3287 1.825 12.7119 1.70428 12.0914 1.7231C11.0286 1.76175 10.0198 2.20126 9.26776 2.95329C8.51572 3.70533 8.07621 4.71415 8.03756 5.77698C8.01402 6.61255 8.24228 7.43589 8.69271 8.14006C9.14313 8.84422 9.7949 9.39667 10.5633 9.72563C10.1096 10.0311 9.74618 10.4527 9.51094 10.9464H9.44779C8.91345 11.0726 8.35262 11.0228 7.8489 10.8043C7.34519 10.5858 6.92557 10.2104 6.65259 9.73405C6.47652 9.4249 6.23425 9.15853 5.94314 8.95402C5.65202 8.74951 5.31927 8.61193 4.96873 8.55114C4.65171 8.49286 4.3256 8.50728 4.01497 8.59333C3.70433 8.67937 3.41728 8.83479 3.17542 9.04788C2.70332 9.45092 2.32773 9.95481 2.07637 10.5224C1.825 11.09 1.70428 11.7067 1.7231 12.3272C1.76175 13.39 2.20126 14.3988 2.95329 15.1509C3.70533 15.9029 4.71415 16.3424 5.77698 16.3811H5.89485C6.71061 16.3817 7.50856 16.1426 8.18961 15.6936C8.87065 15.2445 9.40477 14.6053 9.72563 13.8553C10.0311 14.309 10.4527 14.6725 10.9464 14.9077V14.9708C11.0719 15.5052 11.0218 16.0658 10.8034 16.5693C10.585 17.0729 10.21 17.4926 9.73405 17.7661C9.4249 17.9421 9.15853 18.1844 8.95402 18.4755C8.74951 18.7666 8.61193 19.0994 8.55114 19.4499C8.49317 19.7669 8.50775 20.093 8.59378 20.4035C8.67981 20.7141 8.83506 21.0012 9.04788 21.2432C9.4376 21.7008 9.92225 22.0682 10.4682 22.3197C11.0141 22.5712 11.6082 22.7009 12.2093 22.6998H12.3272C13.39 22.6611 14.3988 22.2216 15.1509 21.4696C15.9029 20.7175 16.3424 19.7087 16.3811 18.6459C16.3982 18.088 16.3026 17.5325 16.1001 17.0124C15.8976 16.4924 15.5922 16.0185 15.2024 15.6191C14.8216 15.2271 14.3684 14.9126 13.8679 14.693C14.3178 14.3868 14.677 13.9651 14.9077 13.4722H14.9708C15.5052 13.3467 16.0658 13.3969 16.5693 13.6153C17.0729 13.8337 17.4926 14.2087 17.7661 14.6846C17.9426 14.9942 18.1855 15.2609 18.4774 15.4654C18.7692 15.67 19.1028 15.8073 19.4541 15.8675ZM9.82245 8.21437C9.51102 7.8956 9.26702 7.51734 9.10501 7.10219C8.943 6.68703 8.8663 6.24349 8.87949 5.79803C8.9117 4.95048 9.26254 4.14628 9.86189 3.54615C10.4612 2.94601 11.265 2.59413 12.1125 2.56082H12.2093C12.689 2.55941 13.1633 2.66219 13.5994 2.86207C14.0355 3.06195 14.423 3.35415 14.7351 3.71847C14.8648 3.86883 14.9593 4.04625 15.0118 4.23778C15.0642 4.42932 15.0732 4.63014 15.0382 4.82561C14.9968 5.05407 14.9061 5.27076 14.7723 5.46053C14.6385 5.6503 14.4649 5.80858 14.2636 5.92432C13.7504 6.22604 13.325 6.65672 13.0296 7.17363C12.7342 7.69055 12.5791 8.27572 12.5798 8.87107C12.5736 8.98184 12.5736 9.09287 12.5798 9.20363C12.4564 9.20992 12.3327 9.20992 12.2093 9.20363C11.7653 9.20848 11.3249 9.12332 10.9146 8.9533C10.5044 8.78328 10.1329 8.53191 9.82245 8.21437ZM8.21437 14.5962C7.89496 14.9079 7.51599 15.1521 7.10011 15.3141C6.68422 15.4761 6.23995 15.5527 5.79382 15.5391C4.94701 15.5059 4.14386 15.1546 3.54461 14.5554C2.94535 13.9561 2.59406 13.153 2.56082 12.3061C2.54568 11.8103 2.6418 11.3173 2.84213 10.8635C3.04246 10.4097 3.3419 10.0065 3.71847 9.68353C3.9592 9.47481 4.26704 9.35975 4.58566 9.35939C4.66607 9.36013 4.74629 9.36717 4.82561 9.38044C5.05407 9.42182 5.27076 9.51257 5.46053 9.64636C5.6503 9.78014 5.80858 9.95373 5.92432 10.155C6.2498 10.7215 6.73212 11.1819 7.31318 11.4806C7.89425 11.7794 8.54929 11.9038 9.19942 11.8389C9.19942 11.9652 9.19942 12.0872 9.19942 12.2093C9.20361 12.6529 9.11857 13.0928 8.94934 13.5028C8.78012 13.9129 8.53017 14.2847 8.21437 14.5962ZM14.5962 16.2043C14.9076 16.523 15.1516 16.9013 15.3136 17.3165C15.4756 17.7316 15.5523 18.1752 15.5391 18.6206C15.5212 19.293 15.3 19.9442 14.9048 20.4884C14.5095 21.0327 13.9587 21.4444 13.3249 21.6695C12.691 21.8946 12.0039 21.9225 11.3539 21.7495C10.7039 21.5764 10.1216 21.2106 9.68353 20.7002C9.55382 20.5498 9.4593 20.3724 9.40686 20.1809C9.35443 19.9893 9.3454 19.7885 9.38044 19.593C9.42202 19.3641 9.51331 19.1471 9.64787 18.9572C9.78242 18.7674 9.95698 18.6094 10.1592 18.4943C10.6722 18.1923 11.0974 17.7615 11.3927 17.2447C11.688 16.7278 11.8433 16.1428 11.8431 15.5476C11.8493 15.4368 11.8493 15.3258 11.8431 15.215C11.9651 15.2087 12.0873 15.2087 12.2093 15.215H12.243C12.6817 15.2128 13.1163 15.2993 13.5206 15.4693C13.925 15.6393 14.2909 15.8893 14.5962 16.2043ZM12.2093 14.3562C11.7847 14.3562 11.3696 14.2303 11.0166 13.9944C10.6635 13.7585 10.3883 13.4232 10.2258 13.0309C10.0633 12.6386 10.0208 12.2069 10.1037 11.7905C10.1865 11.374 10.391 10.9915 10.6912 10.6912C10.9915 10.391 11.374 10.1865 11.7905 10.1037C12.2069 10.0208 12.6386 10.0633 13.0309 10.2258C13.4232 10.3883 13.7585 10.6635 13.9944 11.0166C14.2303 11.3696 14.3562 11.7847 14.3562 12.2093C14.3551 12.7784 14.1286 13.3238 13.7262 13.7262C13.3238 14.1286 12.7784 14.3551 12.2093 14.3562ZM15.5518 12.5629C15.441 12.5567 15.33 12.5567 15.2192 12.5629C15.2192 12.4366 15.2192 12.3146 15.2192 12.1925C15.219 11.7469 15.3083 11.3059 15.4816 10.8954C15.655 10.485 15.9089 10.1135 16.2285 9.80303C16.548 9.49253 16.9266 9.24931 17.3418 9.08778C17.7571 8.92625 18.2005 8.8497 18.6459 8.86265C19.4927 8.8959 20.2958 9.24719 20.8951 9.84644C21.4943 10.4457 21.8456 11.2488 21.8789 12.0957C21.894 12.596 21.7958 13.0933 21.5917 13.5503C21.3876 14.0074 21.0828 14.4124 20.7002 14.7351C20.55 14.8651 20.3726 14.9598 20.181 15.0122C19.9894 15.0647 19.7885 15.0735 19.593 15.0382C19.3646 14.9968 19.1479 14.9061 18.9581 14.7723C18.7683 14.6385 18.6101 14.4649 18.4943 14.2636C18.1951 13.7479 17.766 13.3195 17.2497 13.0211C16.7335 12.7227 16.1481 12.5648 15.5518 12.5629Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M12.2094 10.6516C11.9014 10.6516 11.6002 10.743 11.3441 10.9141C11.0879 11.0853 10.8883 11.3285 10.7704 11.6131C10.6525 11.8977 10.6217 12.2109 10.6818 12.513C10.7419 12.8152 10.8902 13.0927 11.1081 13.3105C11.3259 13.5284 11.6034 13.6767 11.9056 13.7368C12.2077 13.7969 12.5209 13.7661 12.8055 13.6482C13.0901 13.5303 13.3333 13.3307 13.5045 13.0745C13.6756 12.8184 13.767 12.5172 13.767 12.2092C13.767 11.7961 13.6029 11.3999 13.3108 11.1078C13.0187 10.8157 12.6225 10.6516 12.2094 10.6516ZM12.2094 12.9248C12.0679 12.9248 11.9295 12.8828 11.8118 12.8042C11.6942 12.7256 11.6024 12.6138 11.5483 12.483C11.4941 12.3523 11.4799 12.2084 11.5075 12.0696C11.5351 11.9307 11.6033 11.8032 11.7034 11.7031C11.8035 11.6031 11.931 11.5349 12.0698 11.5073C12.2086 11.4797 12.3525 11.4939 12.4833 11.548C12.6141 11.6022 12.7258 11.6939 12.8045 11.8116C12.8831 11.9293 12.9251 12.0676 12.9251 12.2092C12.9251 12.399 12.8497 12.581 12.7155 12.7152C12.5812 12.8494 12.3992 12.9248 12.2094 12.9248Z\\" fill=\\"#ACACAD\\"/>\\n</pattern>\\n<pattern id=\\"pattern1\\" width=\\"25\\" height=\\"25\\">\\n<path d=\\"M22.1693 19.2562C23.6316 17.1974 24.4171 14.7346 24.4171 12.2093C24.4171 9.684 23.6316 7.22124 22.1693 5.16236L23.8153 3.51639C24.2016 3.13009 24.4186 2.60616 24.4186 2.05985C24.4186 1.51355 24.2016 0.989615 23.8153 0.603317C23.429 0.21702 22.9051 0 22.3588 0C21.8124 0 21.2885 0.21702 20.9022 0.603317L19.2562 2.24929C17.1974 0.787041 14.7346 0.00147748 12.2093 0.00147748C9.684 0.00147748 7.22124 0.787041 5.16236 2.24929L3.51639 0.603317C3.13009 0.21702 2.60616 -5.75628e-09 2.05985 0C1.51355 5.75628e-09 0.989615 0.21702 0.603317 0.603317C0.21702 0.989615 5.75628e-09 1.51355 0 2.05985C-5.75628e-09 2.60616 0.21702 3.13009 0.603317 3.51639L2.24929 5.16236C0.787041 7.22124 0.00147748 9.684 0.00147748 12.2093C0.00147748 14.7346 0.787041 17.1974 2.24929 19.2562L0.603317 20.9022C0.21702 21.2885 0 21.8124 0 22.3588C0 22.9051 0.21702 23.429 0.603317 23.8153C0.989615 24.2016 1.51355 24.4186 2.05985 24.4186C2.60616 24.4186 3.13009 24.2016 3.51639 23.8153L5.16236 22.1693C7.22124 23.6316 9.684 24.4171 12.2093 24.4171C14.7346 24.4171 17.1974 23.6316 19.2562 22.1693L20.9022 23.8153C21.2885 24.2016 21.8124 24.4186 22.3588 24.4186C22.9051 24.4186 23.429 24.2016 23.8153 23.8153C24.2016 23.429 24.4186 22.9051 24.4186 22.3588C24.4186 21.8124 24.2016 21.2885 23.8153 20.9022L22.1693 19.2562ZM21.5 1.20109C21.7301 0.97786 22.0381 0.853018 22.3588 0.853018C22.6794 0.853018 22.9874 0.97786 23.2175 1.20109C23.3305 1.31372 23.4202 1.44756 23.4814 1.59493C23.5426 1.74229 23.5741 1.90029 23.5741 2.05985C23.5741 2.21942 23.5426 2.37742 23.4814 2.52478C23.4202 2.67215 23.3305 2.80599 23.2175 2.91862L21.66 4.4804C21.6305 4.44251 21.5968 4.41304 21.5673 4.37937C21.1054 3.82341 20.5939 3.31053 20.0392 2.84706L19.9382 2.75865L21.5 1.20109ZM1.20109 1.20109C1.31344 1.08755 1.44718 0.997427 1.59459 0.935916C1.74199 0.874406 1.90013 0.842735 2.05985 0.842735C2.21958 0.842735 2.37772 0.874406 2.52512 0.935916C2.67253 0.997427 2.80627 1.08755 2.91862 1.20109L4.4804 2.75865L4.37937 2.84706C3.82564 3.31158 3.31427 3.82437 2.85127 4.37937C2.8218 4.41304 2.78812 4.44251 2.75865 4.4804L1.20109 2.91862C1.08806 2.80599 0.998381 2.67215 0.93719 2.52478C0.875999 2.37742 0.8445 2.21942 0.8445 2.05985C0.8445 1.90029 0.875999 1.74229 0.93719 1.59493C0.998381 1.44756 1.08806 1.31372 1.20109 1.20109ZM2.91862 23.2175C2.68798 23.4398 2.38015 23.5639 2.05985 23.5639C1.73956 23.5639 1.43173 23.4398 1.20109 23.2175C1.08806 23.1049 0.998381 22.9711 0.93719 22.8237C0.875999 22.6763 0.8445 22.5183 0.8445 22.3588C0.8445 22.1992 0.875999 22.0412 0.93719 21.8938C0.998381 21.7465 1.08806 21.6126 1.20109 21.5L2.75865 19.9382C2.78812 19.9761 2.8218 20.0056 2.85127 20.0392C3.31321 20.5952 3.82468 21.1081 4.37937 21.5716C4.41304 21.5968 4.44251 21.6305 4.4804 21.66L2.91862 23.2175ZM5.36442 21.2853C4.52115 20.6483 3.77029 19.8975 3.13331 19.0542C1.64577 17.0822 0.841107 14.6794 0.841107 12.2093C0.841107 9.73922 1.64577 7.33636 3.13331 5.36442C3.29328 5.15394 3.45746 4.94346 3.63005 4.74982C4.15073 4.15246 4.73196 3.61073 5.36442 3.13331C7.33599 1.64677 9.73802 0.842695 12.2072 0.842695C14.6764 0.842695 17.0784 1.64677 19.05 3.13331C19.8933 3.77029 20.6441 4.52115 21.2811 5.36442C22.7686 7.33636 23.5733 9.73922 23.5733 12.2093C23.5733 14.6794 22.7686 17.0822 21.2811 19.0542C20.6441 19.8975 19.8933 20.6483 19.05 21.2853C17.0784 22.7718 14.6764 23.5759 12.2072 23.5759C9.73802 23.5759 7.33599 22.7718 5.36442 21.2853ZM23.2175 23.2175C22.9869 23.4398 22.6791 23.5639 22.3588 23.5639C22.0385 23.5639 21.7306 23.4398 21.5 23.2175L19.9382 21.66L20.0392 21.5716C20.593 21.107 21.1043 20.5942 21.5673 20.0392C21.5968 20.0056 21.6305 19.9761 21.66 19.9382L23.2175 21.5C23.3305 21.6126 23.4202 21.7465 23.4814 21.8938C23.5426 22.0412 23.5741 22.1992 23.5741 22.3588C23.5741 22.5183 23.5426 22.6763 23.4814 22.8237C23.4202 22.9711 23.3305 23.1049 23.2175 23.2175Z\\" fill=\\"#61CAFA\\"/>\\n<path d=\\"M19.4541 15.8675C19.5807 15.8892 19.7088 15.9004 19.8372 15.9012C20.3566 15.9044 20.8589 15.7155 21.2474 15.3708C21.7195 14.9677 22.0951 14.4638 22.3465 13.8963C22.5978 13.3287 22.7186 12.7119 22.6998 12.0914C22.6611 11.0286 22.2216 10.0198 21.4696 9.26776C20.7175 8.51572 19.7087 8.07621 18.6459 8.03756C17.8103 8.01402 16.987 8.24228 16.2828 8.69271C15.5786 9.14313 15.0262 9.7949 14.6972 10.5633C14.3906 10.1091 13.9675 9.74556 13.4722 9.51094V9.44779C13.3467 8.91345 13.3969 8.35288 13.6153 7.84932C13.8337 7.34576 14.2087 6.92607 14.6846 6.65259C14.9937 6.47652 15.2601 6.23425 15.4646 5.94314C15.6691 5.65202 15.8067 5.31927 15.8675 4.96873C15.9255 4.65171 15.9109 4.32568 15.8249 4.01509C15.7388 3.70451 15.5836 3.41744 15.3708 3.17542C14.9677 2.70332 14.4638 2.32773 13.8963 2.07637C13.3287 1.825 12.7119 1.70428 12.0914 1.7231C11.0286 1.76175 10.0198 2.20126 9.26776 2.95329C8.51572 3.70533 8.07621 4.71415 8.03756 5.77698C8.01402 6.61255 8.24228 7.43589 8.69271 8.14006C9.14313 8.84422 9.7949 9.39667 10.5633 9.72563C10.1096 10.0311 9.74618 10.4527 9.51094 10.9464H9.44779C8.91345 11.0726 8.35262 11.0228 7.8489 10.8043C7.34519 10.5858 6.92557 10.2104 6.65259 9.73405C6.47652 9.4249 6.23425 9.15853 5.94314 8.95402C5.65202 8.74951 5.31927 8.61193 4.96873 8.55114C4.65171 8.49286 4.3256 8.50728 4.01497 8.59333C3.70433 8.67937 3.41728 8.83479 3.17542 9.04788C2.70332 9.45092 2.32773 9.95481 2.07637 10.5224C1.825 11.09 1.70428 11.7067 1.7231 12.3272C1.76175 13.39 2.20126 14.3988 2.95329 15.1509C3.70533 15.9029 4.71415 16.3424 5.77698 16.3811H5.89485C6.71061 16.3817 7.50856 16.1426 8.18961 15.6936C8.87065 15.2445 9.40477 14.6053 9.72563 13.8553C10.0311 14.309 10.4527 14.6725 10.9464 14.9077V14.9708C11.0719 15.5052 11.0218 16.0658 10.8034 16.5693C10.585 17.0729 10.21 17.4926 9.73405 17.7661C9.4249 17.9421 9.15853 18.1844 8.95402 18.4755C8.74951 18.7666 8.61193 19.0994 8.55114 19.4499C8.49317 19.7669 8.50775 20.093 8.59378 20.4035C8.67981 20.7141 8.83506 21.0012 9.04788 21.2432C9.4376 21.7008 9.92225 22.0682 10.4682 22.3197C11.0141 22.5712 11.6082 22.7009 12.2093 22.6998H12.3272C13.39 22.6611 14.3988 22.2216 15.1509 21.4696C15.9029 20.7175 16.3424 19.7087 16.3811 18.6459C16.3982 18.088 16.3026 17.5325 16.1001 17.0124C15.8976 16.4924 15.5922 16.0185 15.2024 15.6191C14.8216 15.2271 14.3684 14.9126 13.8679 14.693C14.3178 14.3868 14.677 13.9651 14.9077 13.4722H14.9708C15.5052 13.3467 16.0658 13.3969 16.5693 13.6153C17.0729 13.8337 17.4926 14.2087 17.7661 14.6846C17.9426 14.9942 18.1855 15.2609 18.4774 15.4654C18.7692 15.67 19.1028 15.8073 19.4541 15.8675ZM9.82245 8.21437C9.51102 7.8956 9.26702 7.51734 9.10501 7.10219C8.943 6.68703 8.8663 6.24349 8.87949 5.79803C8.9117 4.95048 9.26254 4.14628 9.86189 3.54615C10.4612 2.94601 11.265 2.59413 12.1125 2.56082H12.2093C12.689 2.55941 13.1633 2.66219 13.5994 2.86207C14.0355 3.06195 14.423 3.35415 14.7351 3.71847C14.8648 3.86883 14.9593 4.04625 15.0118 4.23778C15.0642 4.42932 15.0732 4.63014 15.0382 4.82561C14.9968 5.05407 14.9061 5.27076 14.7723 5.46053C14.6385 5.6503 14.4649 5.80858 14.2636 5.92432C13.7504 6.22604 13.325 6.65672 13.0296 7.17363C12.7342 7.69055 12.5791 8.27572 12.5798 8.87107C12.5736 8.98184 12.5736 9.09287 12.5798 9.20363C12.4564 9.20992 12.3327 9.20992 12.2093 9.20363C11.7653 9.20848 11.3249 9.12332 10.9146 8.9533C10.5044 8.78328 10.1329 8.53191 9.82245 8.21437ZM8.21437 14.5962C7.89496 14.9079 7.51599 15.1521 7.10011 15.3141C6.68422 15.4761 6.23995 15.5527 5.79382 15.5391C4.94701 15.5059 4.14386 15.1546 3.54461 14.5554C2.94535 13.9561 2.59406 13.153 2.56082 12.3061C2.54568 11.8103 2.6418 11.3173 2.84213 10.8635C3.04246 10.4097 3.3419 10.0065 3.71847 9.68353C3.9592 9.47481 4.26704 9.35975 4.58566 9.35939C4.66607 9.36013 4.74629 9.36717 4.82561 9.38044C5.05407 9.42182 5.27076 9.51257 5.46053 9.64636C5.6503 9.78014 5.80858 9.95373 5.92432 10.155C6.2498 10.7215 6.73212 11.1819 7.31318 11.4806C7.89425 11.7794 8.54929 11.9038 9.19942 11.8389C9.19942 11.9652 9.19942 12.0872 9.19942 12.2093C9.20361 12.6529 9.11857 13.0928 8.94934 13.5028C8.78012 13.9129 8.53017 14.2847 8.21437 14.5962ZM14.5962 16.2043C14.9076 16.523 15.1516 16.9013 15.3136 17.3165C15.4756 17.7316 15.5523 18.1752 15.5391 18.6206C15.5212 19.293 15.3 19.9442 14.9048 20.4884C14.5095 21.0327 13.9587 21.4444 13.3249 21.6695C12.691 21.8946 12.0039 21.9225 11.3539 21.7495C10.7039 21.5764 10.1216 21.2106 9.68353 20.7002C9.55382 20.5498 9.4593 20.3724 9.40686 20.1809C9.35443 19.9893 9.3454 19.7885 9.38044 19.593C9.42202 19.3641 9.51331 19.1471 9.64787 18.9572C9.78242 18.7674 9.95698 18.6094 10.1592 18.4943C10.6722 18.1923 11.0974 17.7615 11.3927 17.2447C11.688 16.7278 11.8433 16.1428 11.8431 15.5476C11.8493 15.4368 11.8493 15.3258 11.8431 15.215C11.9651 15.2087 12.0873 15.2087 12.2093 15.215H12.243C12.6817 15.2128 13.1163 15.2993 13.5206 15.4693C13.925 15.6393 14.2909 15.8893 14.5962 16.2043ZM12.2093 14.3562C11.7847 14.3562 11.3696 14.2303 11.0166 13.9944C10.6635 13.7585 10.3883 13.4232 10.2258 13.0309C10.0633 12.6386 10.0208 12.2069 10.1037 11.7905C10.1865 11.374 10.391 10.9915 10.6912 10.6912C10.9915 10.391 11.374 10.1865 11.7905 10.1037C12.2069 10.0208 12.6386 10.0633 13.0309 10.2258C13.4232 10.3883 13.7585 10.6635 13.9944 11.0166C14.2303 11.3696 14.3562 11.7847 14.3562 12.2093C14.3551 12.7784 14.1286 13.3238 13.7262 13.7262C13.3238 14.1286 12.7784 14.3551 12.2093 14.3562ZM15.5518 12.5629C15.441 12.5567 15.33 12.5567 15.2192 12.5629C15.2192 12.4366 15.2192 12.3146 15.2192 12.1925C15.219 11.7469 15.3083 11.3059 15.4816 10.8954C15.655 10.485 15.9089 10.1135 16.2285 9.80303C16.548 9.49253 16.9266 9.24931 17.3418 9.08778C17.7571 8.92625 18.2005 8.8497 18.6459 8.86265C19.4927 8.8959 20.2958 9.24719 20.8951 9.84644C21.4943 10.4457 21.8456 11.2488 21.8789 12.0957C21.894 12.596 21.7958 13.0933 21.5917 13.5503C21.3876 14.0074 21.0828 14.4124 20.7002 14.7351C20.55 14.8651 20.3726 14.9598 20.181 15.0122C19.9894 15.0647 19.7885 15.0735 19.593 15.0382C19.3646 14.9968 19.1479 14.9061 18.9581 14.7723C18.7683 14.6385 18.6101 14.4649 18.4943 14.2636C18.1951 13.7479 17.766 13.3195 17.2497 13.0211C16.7335 12.7227 16.1481 12.5648 15.5518 12.5629Z\\" fill=\\"#61CAFA\\"/>\\n<path d=\\"M12.2094 10.6516C11.9014 10.6516 11.6002 10.743 11.3441 10.9141C11.0879 11.0853 10.8883 11.3285 10.7704 11.6131C10.6525 11.8977 10.6217 12.2109 10.6818 12.513C10.7419 12.8152 10.8902 13.0927 11.1081 13.3105C11.3259 13.5284 11.6034 13.6767 11.9056 13.7368C12.2077 13.7969 12.5209 13.7661 12.8055 13.6482C13.0901 13.5303 13.3333 13.3307 13.5045 13.0745C13.6756 12.8184 13.767 12.5172 13.767 12.2092C13.767 11.7961 13.6029 11.3999 13.3108 11.1078C13.0187 10.8157 12.6225 10.6516 12.2094 10.6516ZM12.2094 12.9248C12.0679 12.9248 11.9295 12.8828 11.8118 12.8042C11.6942 12.7256 11.6024 12.6138 11.5483 12.483C11.4941 12.3523 11.4799 12.2084 11.5075 12.0696C11.5351 11.9307 11.6033 11.8032 11.7034 11.7031C11.8035 11.6031 11.931 11.5349 12.0698 11.5073C12.2086 11.4797 12.3525 11.4939 12.4833 11.548C12.6141 11.6022 12.7258 11.6939 12.8045 11.8116C12.8831 11.9293 12.9251 12.0676 12.9251 12.2092C12.9251 12.399 12.8497 12.581 12.7155 12.7152C12.5812 12.8494 12.3992 12.9248 12.2094 12.9248Z\\" fill=\\"#61CAFA\\"/>\\n</pattern>\\n</svg>\\n",
        "areaColors": "> areaValues | matchValue(areaColorsEditorConfig)",
        "backgroundColor": "transparent",
        "areaIds": "> primary | seriesByName('fan')",
        "areaValues": "> primary | seriesByName('status')"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "match": "On",
            "value": "url(#pattern1)"
          },
          {
            "match": "Off",
            "value": "url(#pattern0)"
          }
        ]
      }
    },
    "viz_FAnx3cef": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('2B')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_cPcTNTWj": {
      "type": "splunk.choropleth.svg",
      "dataSources": {
        "primary": "ds_FZspy2J5"
      },
      "options": {
        "svg": "<svg width=\\"25\\" height=\\"25\\" viewBox=\\"0 0 25 25\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<rect id=\\"fan\\" width=\\"25\\" height=\\"25\\" fill=\\"url(#pattern0)\\"/>\\n<pattern id=\\"pattern0\\" width=\\"25\\" height=\\"25\\">\\n<path d=\\"M22.1693 19.2562C23.6316 17.1974 24.4171 14.7346 24.4171 12.2093C24.4171 9.684 23.6316 7.22124 22.1693 5.16236L23.8153 3.51639C24.2016 3.13009 24.4186 2.60616 24.4186 2.05985C24.4186 1.51355 24.2016 0.989615 23.8153 0.603317C23.429 0.21702 22.9051 0 22.3588 0C21.8124 0 21.2885 0.21702 20.9022 0.603317L19.2562 2.24929C17.1974 0.787041 14.7346 0.00147748 12.2093 0.00147748C9.684 0.00147748 7.22124 0.787041 5.16236 2.24929L3.51639 0.603317C3.13009 0.21702 2.60616 -5.75628e-09 2.05985 0C1.51355 5.75628e-09 0.989615 0.21702 0.603317 0.603317C0.21702 0.989615 5.75628e-09 1.51355 0 2.05985C-5.75628e-09 2.60616 0.21702 3.13009 0.603317 3.51639L2.24929 5.16236C0.787041 7.22124 0.00147748 9.684 0.00147748 12.2093C0.00147748 14.7346 0.787041 17.1974 2.24929 19.2562L0.603317 20.9022C0.21702 21.2885 0 21.8124 0 22.3588C0 22.9051 0.21702 23.429 0.603317 23.8153C0.989615 24.2016 1.51355 24.4186 2.05985 24.4186C2.60616 24.4186 3.13009 24.2016 3.51639 23.8153L5.16236 22.1693C7.22124 23.6316 9.684 24.4171 12.2093 24.4171C14.7346 24.4171 17.1974 23.6316 19.2562 22.1693L20.9022 23.8153C21.2885 24.2016 21.8124 24.4186 22.3588 24.4186C22.9051 24.4186 23.429 24.2016 23.8153 23.8153C24.2016 23.429 24.4186 22.9051 24.4186 22.3588C24.4186 21.8124 24.2016 21.2885 23.8153 20.9022L22.1693 19.2562ZM21.5 1.20109C21.7301 0.97786 22.0381 0.853018 22.3588 0.853018C22.6794 0.853018 22.9874 0.97786 23.2175 1.20109C23.3305 1.31372 23.4202 1.44756 23.4814 1.59493C23.5426 1.74229 23.5741 1.90029 23.5741 2.05985C23.5741 2.21942 23.5426 2.37742 23.4814 2.52478C23.4202 2.67215 23.3305 2.80599 23.2175 2.91862L21.66 4.4804C21.6305 4.44251 21.5968 4.41304 21.5673 4.37937C21.1054 3.82341 20.5939 3.31053 20.0392 2.84706L19.9382 2.75865L21.5 1.20109ZM1.20109 1.20109C1.31344 1.08755 1.44718 0.997427 1.59459 0.935916C1.74199 0.874406 1.90013 0.842735 2.05985 0.842735C2.21958 0.842735 2.37772 0.874406 2.52512 0.935916C2.67253 0.997427 2.80627 1.08755 2.91862 1.20109L4.4804 2.75865L4.37937 2.84706C3.82564 3.31158 3.31427 3.82437 2.85127 4.37937C2.8218 4.41304 2.78812 4.44251 2.75865 4.4804L1.20109 2.91862C1.08806 2.80599 0.998381 2.67215 0.93719 2.52478C0.875999 2.37742 0.8445 2.21942 0.8445 2.05985C0.8445 1.90029 0.875999 1.74229 0.93719 1.59493C0.998381 1.44756 1.08806 1.31372 1.20109 1.20109ZM2.91862 23.2175C2.68798 23.4398 2.38015 23.5639 2.05985 23.5639C1.73956 23.5639 1.43173 23.4398 1.20109 23.2175C1.08806 23.1049 0.998381 22.9711 0.93719 22.8237C0.875999 22.6763 0.8445 22.5183 0.8445 22.3588C0.8445 22.1992 0.875999 22.0412 0.93719 21.8938C0.998381 21.7465 1.08806 21.6126 1.20109 21.5L2.75865 19.9382C2.78812 19.9761 2.8218 20.0056 2.85127 20.0392C3.31321 20.5952 3.82468 21.1081 4.37937 21.5716C4.41304 21.5968 4.44251 21.6305 4.4804 21.66L2.91862 23.2175ZM5.36442 21.2853C4.52115 20.6483 3.77029 19.8975 3.13331 19.0542C1.64577 17.0822 0.841107 14.6794 0.841107 12.2093C0.841107 9.73922 1.64577 7.33636 3.13331 5.36442C3.29328 5.15394 3.45746 4.94346 3.63005 4.74982C4.15073 4.15246 4.73196 3.61073 5.36442 3.13331C7.33599 1.64677 9.73802 0.842695 12.2072 0.842695C14.6764 0.842695 17.0784 1.64677 19.05 3.13331C19.8933 3.77029 20.6441 4.52115 21.2811 5.36442C22.7686 7.33636 23.5733 9.73922 23.5733 12.2093C23.5733 14.6794 22.7686 17.0822 21.2811 19.0542C20.6441 19.8975 19.8933 20.6483 19.05 21.2853C17.0784 22.7718 14.6764 23.5759 12.2072 23.5759C9.73802 23.5759 7.33599 22.7718 5.36442 21.2853ZM23.2175 23.2175C22.9869 23.4398 22.6791 23.5639 22.3588 23.5639C22.0385 23.5639 21.7306 23.4398 21.5 23.2175L19.9382 21.66L20.0392 21.5716C20.593 21.107 21.1043 20.5942 21.5673 20.0392C21.5968 20.0056 21.6305 19.9761 21.66 19.9382L23.2175 21.5C23.3305 21.6126 23.4202 21.7465 23.4814 21.8938C23.5426 22.0412 23.5741 22.1992 23.5741 22.3588C23.5741 22.5183 23.5426 22.6763 23.4814 22.8237C23.4202 22.9711 23.3305 23.1049 23.2175 23.2175Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M19.4541 15.8675C19.5807 15.8892 19.7088 15.9004 19.8372 15.9012C20.3566 15.9044 20.8589 15.7155 21.2474 15.3708C21.7195 14.9677 22.0951 14.4638 22.3465 13.8963C22.5978 13.3287 22.7186 12.7119 22.6998 12.0914C22.6611 11.0286 22.2216 10.0198 21.4696 9.26776C20.7175 8.51572 19.7087 8.07621 18.6459 8.03756C17.8103 8.01402 16.987 8.24228 16.2828 8.69271C15.5786 9.14313 15.0262 9.7949 14.6972 10.5633C14.3906 10.1091 13.9675 9.74556 13.4722 9.51094V9.44779C13.3467 8.91345 13.3969 8.35288 13.6153 7.84932C13.8337 7.34576 14.2087 6.92607 14.6846 6.65259C14.9937 6.47652 15.2601 6.23425 15.4646 5.94314C15.6691 5.65202 15.8067 5.31927 15.8675 4.96873C15.9255 4.65171 15.9109 4.32568 15.8249 4.01509C15.7388 3.70451 15.5836 3.41744 15.3708 3.17542C14.9677 2.70332 14.4638 2.32773 13.8963 2.07637C13.3287 1.825 12.7119 1.70428 12.0914 1.7231C11.0286 1.76175 10.0198 2.20126 9.26776 2.95329C8.51572 3.70533 8.07621 4.71415 8.03756 5.77698C8.01402 6.61255 8.24228 7.43589 8.69271 8.14006C9.14313 8.84422 9.7949 9.39667 10.5633 9.72563C10.1096 10.0311 9.74618 10.4527 9.51094 10.9464H9.44779C8.91345 11.0726 8.35262 11.0228 7.8489 10.8043C7.34519 10.5858 6.92557 10.2104 6.65259 9.73405C6.47652 9.4249 6.23425 9.15853 5.94314 8.95402C5.65202 8.74951 5.31927 8.61193 4.96873 8.55114C4.65171 8.49286 4.3256 8.50728 4.01497 8.59333C3.70433 8.67937 3.41728 8.83479 3.17542 9.04788C2.70332 9.45092 2.32773 9.95481 2.07637 10.5224C1.825 11.09 1.70428 11.7067 1.7231 12.3272C1.76175 13.39 2.20126 14.3988 2.95329 15.1509C3.70533 15.9029 4.71415 16.3424 5.77698 16.3811H5.89485C6.71061 16.3817 7.50856 16.1426 8.18961 15.6936C8.87065 15.2445 9.40477 14.6053 9.72563 13.8553C10.0311 14.309 10.4527 14.6725 10.9464 14.9077V14.9708C11.0719 15.5052 11.0218 16.0658 10.8034 16.5693C10.585 17.0729 10.21 17.4926 9.73405 17.7661C9.4249 17.9421 9.15853 18.1844 8.95402 18.4755C8.74951 18.7666 8.61193 19.0994 8.55114 19.4499C8.49317 19.7669 8.50775 20.093 8.59378 20.4035C8.67981 20.7141 8.83506 21.0012 9.04788 21.2432C9.4376 21.7008 9.92225 22.0682 10.4682 22.3197C11.0141 22.5712 11.6082 22.7009 12.2093 22.6998H12.3272C13.39 22.6611 14.3988 22.2216 15.1509 21.4696C15.9029 20.7175 16.3424 19.7087 16.3811 18.6459C16.3982 18.088 16.3026 17.5325 16.1001 17.0124C15.8976 16.4924 15.5922 16.0185 15.2024 15.6191C14.8216 15.2271 14.3684 14.9126 13.8679 14.693C14.3178 14.3868 14.677 13.9651 14.9077 13.4722H14.9708C15.5052 13.3467 16.0658 13.3969 16.5693 13.6153C17.0729 13.8337 17.4926 14.2087 17.7661 14.6846C17.9426 14.9942 18.1855 15.2609 18.4774 15.4654C18.7692 15.67 19.1028 15.8073 19.4541 15.8675ZM9.82245 8.21437C9.51102 7.8956 9.26702 7.51734 9.10501 7.10219C8.943 6.68703 8.8663 6.24349 8.87949 5.79803C8.9117 4.95048 9.26254 4.14628 9.86189 3.54615C10.4612 2.94601 11.265 2.59413 12.1125 2.56082H12.2093C12.689 2.55941 13.1633 2.66219 13.5994 2.86207C14.0355 3.06195 14.423 3.35415 14.7351 3.71847C14.8648 3.86883 14.9593 4.04625 15.0118 4.23778C15.0642 4.42932 15.0732 4.63014 15.0382 4.82561C14.9968 5.05407 14.9061 5.27076 14.7723 5.46053C14.6385 5.6503 14.4649 5.80858 14.2636 5.92432C13.7504 6.22604 13.325 6.65672 13.0296 7.17363C12.7342 7.69055 12.5791 8.27572 12.5798 8.87107C12.5736 8.98184 12.5736 9.09287 12.5798 9.20363C12.4564 9.20992 12.3327 9.20992 12.2093 9.20363C11.7653 9.20848 11.3249 9.12332 10.9146 8.9533C10.5044 8.78328 10.1329 8.53191 9.82245 8.21437ZM8.21437 14.5962C7.89496 14.9079 7.51599 15.1521 7.10011 15.3141C6.68422 15.4761 6.23995 15.5527 5.79382 15.5391C4.94701 15.5059 4.14386 15.1546 3.54461 14.5554C2.94535 13.9561 2.59406 13.153 2.56082 12.3061C2.54568 11.8103 2.6418 11.3173 2.84213 10.8635C3.04246 10.4097 3.3419 10.0065 3.71847 9.68353C3.9592 9.47481 4.26704 9.35975 4.58566 9.35939C4.66607 9.36013 4.74629 9.36717 4.82561 9.38044C5.05407 9.42182 5.27076 9.51257 5.46053 9.64636C5.6503 9.78014 5.80858 9.95373 5.92432 10.155C6.2498 10.7215 6.73212 11.1819 7.31318 11.4806C7.89425 11.7794 8.54929 11.9038 9.19942 11.8389C9.19942 11.9652 9.19942 12.0872 9.19942 12.2093C9.20361 12.6529 9.11857 13.0928 8.94934 13.5028C8.78012 13.9129 8.53017 14.2847 8.21437 14.5962ZM14.5962 16.2043C14.9076 16.523 15.1516 16.9013 15.3136 17.3165C15.4756 17.7316 15.5523 18.1752 15.5391 18.6206C15.5212 19.293 15.3 19.9442 14.9048 20.4884C14.5095 21.0327 13.9587 21.4444 13.3249 21.6695C12.691 21.8946 12.0039 21.9225 11.3539 21.7495C10.7039 21.5764 10.1216 21.2106 9.68353 20.7002C9.55382 20.5498 9.4593 20.3724 9.40686 20.1809C9.35443 19.9893 9.3454 19.7885 9.38044 19.593C9.42202 19.3641 9.51331 19.1471 9.64787 18.9572C9.78242 18.7674 9.95698 18.6094 10.1592 18.4943C10.6722 18.1923 11.0974 17.7615 11.3927 17.2447C11.688 16.7278 11.8433 16.1428 11.8431 15.5476C11.8493 15.4368 11.8493 15.3258 11.8431 15.215C11.9651 15.2087 12.0873 15.2087 12.2093 15.215H12.243C12.6817 15.2128 13.1163 15.2993 13.5206 15.4693C13.925 15.6393 14.2909 15.8893 14.5962 16.2043ZM12.2093 14.3562C11.7847 14.3562 11.3696 14.2303 11.0166 13.9944C10.6635 13.7585 10.3883 13.4232 10.2258 13.0309C10.0633 12.6386 10.0208 12.2069 10.1037 11.7905C10.1865 11.374 10.391 10.9915 10.6912 10.6912C10.9915 10.391 11.374 10.1865 11.7905 10.1037C12.2069 10.0208 12.6386 10.0633 13.0309 10.2258C13.4232 10.3883 13.7585 10.6635 13.9944 11.0166C14.2303 11.3696 14.3562 11.7847 14.3562 12.2093C14.3551 12.7784 14.1286 13.3238 13.7262 13.7262C13.3238 14.1286 12.7784 14.3551 12.2093 14.3562ZM15.5518 12.5629C15.441 12.5567 15.33 12.5567 15.2192 12.5629C15.2192 12.4366 15.2192 12.3146 15.2192 12.1925C15.219 11.7469 15.3083 11.3059 15.4816 10.8954C15.655 10.485 15.9089 10.1135 16.2285 9.80303C16.548 9.49253 16.9266 9.24931 17.3418 9.08778C17.7571 8.92625 18.2005 8.8497 18.6459 8.86265C19.4927 8.8959 20.2958 9.24719 20.8951 9.84644C21.4943 10.4457 21.8456 11.2488 21.8789 12.0957C21.894 12.596 21.7958 13.0933 21.5917 13.5503C21.3876 14.0074 21.0828 14.4124 20.7002 14.7351C20.55 14.8651 20.3726 14.9598 20.181 15.0122C19.9894 15.0647 19.7885 15.0735 19.593 15.0382C19.3646 14.9968 19.1479 14.9061 18.9581 14.7723C18.7683 14.6385 18.6101 14.4649 18.4943 14.2636C18.1951 13.7479 17.766 13.3195 17.2497 13.0211C16.7335 12.7227 16.1481 12.5648 15.5518 12.5629Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M12.2094 10.6516C11.9014 10.6516 11.6002 10.743 11.3441 10.9141C11.0879 11.0853 10.8883 11.3285 10.7704 11.6131C10.6525 11.8977 10.6217 12.2109 10.6818 12.513C10.7419 12.8152 10.8902 13.0927 11.1081 13.3105C11.3259 13.5284 11.6034 13.6767 11.9056 13.7368C12.2077 13.7969 12.5209 13.7661 12.8055 13.6482C13.0901 13.5303 13.3333 13.3307 13.5045 13.0745C13.6756 12.8184 13.767 12.5172 13.767 12.2092C13.767 11.7961 13.6029 11.3999 13.3108 11.1078C13.0187 10.8157 12.6225 10.6516 12.2094 10.6516ZM12.2094 12.9248C12.0679 12.9248 11.9295 12.8828 11.8118 12.8042C11.6942 12.7256 11.6024 12.6138 11.5483 12.483C11.4941 12.3523 11.4799 12.2084 11.5075 12.0696C11.5351 11.9307 11.6033 11.8032 11.7034 11.7031C11.8035 11.6031 11.931 11.5349 12.0698 11.5073C12.2086 11.4797 12.3525 11.4939 12.4833 11.548C12.6141 11.6022 12.7258 11.6939 12.8045 11.8116C12.8831 11.9293 12.9251 12.0676 12.9251 12.2092C12.9251 12.399 12.8497 12.581 12.7155 12.7152C12.5812 12.8494 12.3992 12.9248 12.2094 12.9248Z\\" fill=\\"#ACACAD\\"/>\\n</pattern>\\n<pattern id=\\"pattern1\\" width=\\"25\\" height=\\"25\\">\\n<path d=\\"M22.1693 19.2562C23.6316 17.1974 24.4171 14.7346 24.4171 12.2093C24.4171 9.684 23.6316 7.22124 22.1693 5.16236L23.8153 3.51639C24.2016 3.13009 24.4186 2.60616 24.4186 2.05985C24.4186 1.51355 24.2016 0.989615 23.8153 0.603317C23.429 0.21702 22.9051 0 22.3588 0C21.8124 0 21.2885 0.21702 20.9022 0.603317L19.2562 2.24929C17.1974 0.787041 14.7346 0.00147748 12.2093 0.00147748C9.684 0.00147748 7.22124 0.787041 5.16236 2.24929L3.51639 0.603317C3.13009 0.21702 2.60616 -5.75628e-09 2.05985 0C1.51355 5.75628e-09 0.989615 0.21702 0.603317 0.603317C0.21702 0.989615 5.75628e-09 1.51355 0 2.05985C-5.75628e-09 2.60616 0.21702 3.13009 0.603317 3.51639L2.24929 5.16236C0.787041 7.22124 0.00147748 9.684 0.00147748 12.2093C0.00147748 14.7346 0.787041 17.1974 2.24929 19.2562L0.603317 20.9022C0.21702 21.2885 0 21.8124 0 22.3588C0 22.9051 0.21702 23.429 0.603317 23.8153C0.989615 24.2016 1.51355 24.4186 2.05985 24.4186C2.60616 24.4186 3.13009 24.2016 3.51639 23.8153L5.16236 22.1693C7.22124 23.6316 9.684 24.4171 12.2093 24.4171C14.7346 24.4171 17.1974 23.6316 19.2562 22.1693L20.9022 23.8153C21.2885 24.2016 21.8124 24.4186 22.3588 24.4186C22.9051 24.4186 23.429 24.2016 23.8153 23.8153C24.2016 23.429 24.4186 22.9051 24.4186 22.3588C24.4186 21.8124 24.2016 21.2885 23.8153 20.9022L22.1693 19.2562ZM21.5 1.20109C21.7301 0.97786 22.0381 0.853018 22.3588 0.853018C22.6794 0.853018 22.9874 0.97786 23.2175 1.20109C23.3305 1.31372 23.4202 1.44756 23.4814 1.59493C23.5426 1.74229 23.5741 1.90029 23.5741 2.05985C23.5741 2.21942 23.5426 2.37742 23.4814 2.52478C23.4202 2.67215 23.3305 2.80599 23.2175 2.91862L21.66 4.4804C21.6305 4.44251 21.5968 4.41304 21.5673 4.37937C21.1054 3.82341 20.5939 3.31053 20.0392 2.84706L19.9382 2.75865L21.5 1.20109ZM1.20109 1.20109C1.31344 1.08755 1.44718 0.997427 1.59459 0.935916C1.74199 0.874406 1.90013 0.842735 2.05985 0.842735C2.21958 0.842735 2.37772 0.874406 2.52512 0.935916C2.67253 0.997427 2.80627 1.08755 2.91862 1.20109L4.4804 2.75865L4.37937 2.84706C3.82564 3.31158 3.31427 3.82437 2.85127 4.37937C2.8218 4.41304 2.78812 4.44251 2.75865 4.4804L1.20109 2.91862C1.08806 2.80599 0.998381 2.67215 0.93719 2.52478C0.875999 2.37742 0.8445 2.21942 0.8445 2.05985C0.8445 1.90029 0.875999 1.74229 0.93719 1.59493C0.998381 1.44756 1.08806 1.31372 1.20109 1.20109ZM2.91862 23.2175C2.68798 23.4398 2.38015 23.5639 2.05985 23.5639C1.73956 23.5639 1.43173 23.4398 1.20109 23.2175C1.08806 23.1049 0.998381 22.9711 0.93719 22.8237C0.875999 22.6763 0.8445 22.5183 0.8445 22.3588C0.8445 22.1992 0.875999 22.0412 0.93719 21.8938C0.998381 21.7465 1.08806 21.6126 1.20109 21.5L2.75865 19.9382C2.78812 19.9761 2.8218 20.0056 2.85127 20.0392C3.31321 20.5952 3.82468 21.1081 4.37937 21.5716C4.41304 21.5968 4.44251 21.6305 4.4804 21.66L2.91862 23.2175ZM5.36442 21.2853C4.52115 20.6483 3.77029 19.8975 3.13331 19.0542C1.64577 17.0822 0.841107 14.6794 0.841107 12.2093C0.841107 9.73922 1.64577 7.33636 3.13331 5.36442C3.29328 5.15394 3.45746 4.94346 3.63005 4.74982C4.15073 4.15246 4.73196 3.61073 5.36442 3.13331C7.33599 1.64677 9.73802 0.842695 12.2072 0.842695C14.6764 0.842695 17.0784 1.64677 19.05 3.13331C19.8933 3.77029 20.6441 4.52115 21.2811 5.36442C22.7686 7.33636 23.5733 9.73922 23.5733 12.2093C23.5733 14.6794 22.7686 17.0822 21.2811 19.0542C20.6441 19.8975 19.8933 20.6483 19.05 21.2853C17.0784 22.7718 14.6764 23.5759 12.2072 23.5759C9.73802 23.5759 7.33599 22.7718 5.36442 21.2853ZM23.2175 23.2175C22.9869 23.4398 22.6791 23.5639 22.3588 23.5639C22.0385 23.5639 21.7306 23.4398 21.5 23.2175L19.9382 21.66L20.0392 21.5716C20.593 21.107 21.1043 20.5942 21.5673 20.0392C21.5968 20.0056 21.6305 19.9761 21.66 19.9382L23.2175 21.5C23.3305 21.6126 23.4202 21.7465 23.4814 21.8938C23.5426 22.0412 23.5741 22.1992 23.5741 22.3588C23.5741 22.5183 23.5426 22.6763 23.4814 22.8237C23.4202 22.9711 23.3305 23.1049 23.2175 23.2175Z\\" fill=\\"#61CAFA\\"/>\\n<path d=\\"M19.4541 15.8675C19.5807 15.8892 19.7088 15.9004 19.8372 15.9012C20.3566 15.9044 20.8589 15.7155 21.2474 15.3708C21.7195 14.9677 22.0951 14.4638 22.3465 13.8963C22.5978 13.3287 22.7186 12.7119 22.6998 12.0914C22.6611 11.0286 22.2216 10.0198 21.4696 9.26776C20.7175 8.51572 19.7087 8.07621 18.6459 8.03756C17.8103 8.01402 16.987 8.24228 16.2828 8.69271C15.5786 9.14313 15.0262 9.7949 14.6972 10.5633C14.3906 10.1091 13.9675 9.74556 13.4722 9.51094V9.44779C13.3467 8.91345 13.3969 8.35288 13.6153 7.84932C13.8337 7.34576 14.2087 6.92607 14.6846 6.65259C14.9937 6.47652 15.2601 6.23425 15.4646 5.94314C15.6691 5.65202 15.8067 5.31927 15.8675 4.96873C15.9255 4.65171 15.9109 4.32568 15.8249 4.01509C15.7388 3.70451 15.5836 3.41744 15.3708 3.17542C14.9677 2.70332 14.4638 2.32773 13.8963 2.07637C13.3287 1.825 12.7119 1.70428 12.0914 1.7231C11.0286 1.76175 10.0198 2.20126 9.26776 2.95329C8.51572 3.70533 8.07621 4.71415 8.03756 5.77698C8.01402 6.61255 8.24228 7.43589 8.69271 8.14006C9.14313 8.84422 9.7949 9.39667 10.5633 9.72563C10.1096 10.0311 9.74618 10.4527 9.51094 10.9464H9.44779C8.91345 11.0726 8.35262 11.0228 7.8489 10.8043C7.34519 10.5858 6.92557 10.2104 6.65259 9.73405C6.47652 9.4249 6.23425 9.15853 5.94314 8.95402C5.65202 8.74951 5.31927 8.61193 4.96873 8.55114C4.65171 8.49286 4.3256 8.50728 4.01497 8.59333C3.70433 8.67937 3.41728 8.83479 3.17542 9.04788C2.70332 9.45092 2.32773 9.95481 2.07637 10.5224C1.825 11.09 1.70428 11.7067 1.7231 12.3272C1.76175 13.39 2.20126 14.3988 2.95329 15.1509C3.70533 15.9029 4.71415 16.3424 5.77698 16.3811H5.89485C6.71061 16.3817 7.50856 16.1426 8.18961 15.6936C8.87065 15.2445 9.40477 14.6053 9.72563 13.8553C10.0311 14.309 10.4527 14.6725 10.9464 14.9077V14.9708C11.0719 15.5052 11.0218 16.0658 10.8034 16.5693C10.585 17.0729 10.21 17.4926 9.73405 17.7661C9.4249 17.9421 9.15853 18.1844 8.95402 18.4755C8.74951 18.7666 8.61193 19.0994 8.55114 19.4499C8.49317 19.7669 8.50775 20.093 8.59378 20.4035C8.67981 20.7141 8.83506 21.0012 9.04788 21.2432C9.4376 21.7008 9.92225 22.0682 10.4682 22.3197C11.0141 22.5712 11.6082 22.7009 12.2093 22.6998H12.3272C13.39 22.6611 14.3988 22.2216 15.1509 21.4696C15.9029 20.7175 16.3424 19.7087 16.3811 18.6459C16.3982 18.088 16.3026 17.5325 16.1001 17.0124C15.8976 16.4924 15.5922 16.0185 15.2024 15.6191C14.8216 15.2271 14.3684 14.9126 13.8679 14.693C14.3178 14.3868 14.677 13.9651 14.9077 13.4722H14.9708C15.5052 13.3467 16.0658 13.3969 16.5693 13.6153C17.0729 13.8337 17.4926 14.2087 17.7661 14.6846C17.9426 14.9942 18.1855 15.2609 18.4774 15.4654C18.7692 15.67 19.1028 15.8073 19.4541 15.8675ZM9.82245 8.21437C9.51102 7.8956 9.26702 7.51734 9.10501 7.10219C8.943 6.68703 8.8663 6.24349 8.87949 5.79803C8.9117 4.95048 9.26254 4.14628 9.86189 3.54615C10.4612 2.94601 11.265 2.59413 12.1125 2.56082H12.2093C12.689 2.55941 13.1633 2.66219 13.5994 2.86207C14.0355 3.06195 14.423 3.35415 14.7351 3.71847C14.8648 3.86883 14.9593 4.04625 15.0118 4.23778C15.0642 4.42932 15.0732 4.63014 15.0382 4.82561C14.9968 5.05407 14.9061 5.27076 14.7723 5.46053C14.6385 5.6503 14.4649 5.80858 14.2636 5.92432C13.7504 6.22604 13.325 6.65672 13.0296 7.17363C12.7342 7.69055 12.5791 8.27572 12.5798 8.87107C12.5736 8.98184 12.5736 9.09287 12.5798 9.20363C12.4564 9.20992 12.3327 9.20992 12.2093 9.20363C11.7653 9.20848 11.3249 9.12332 10.9146 8.9533C10.5044 8.78328 10.1329 8.53191 9.82245 8.21437ZM8.21437 14.5962C7.89496 14.9079 7.51599 15.1521 7.10011 15.3141C6.68422 15.4761 6.23995 15.5527 5.79382 15.5391C4.94701 15.5059 4.14386 15.1546 3.54461 14.5554C2.94535 13.9561 2.59406 13.153 2.56082 12.3061C2.54568 11.8103 2.6418 11.3173 2.84213 10.8635C3.04246 10.4097 3.3419 10.0065 3.71847 9.68353C3.9592 9.47481 4.26704 9.35975 4.58566 9.35939C4.66607 9.36013 4.74629 9.36717 4.82561 9.38044C5.05407 9.42182 5.27076 9.51257 5.46053 9.64636C5.6503 9.78014 5.80858 9.95373 5.92432 10.155C6.2498 10.7215 6.73212 11.1819 7.31318 11.4806C7.89425 11.7794 8.54929 11.9038 9.19942 11.8389C9.19942 11.9652 9.19942 12.0872 9.19942 12.2093C9.20361 12.6529 9.11857 13.0928 8.94934 13.5028C8.78012 13.9129 8.53017 14.2847 8.21437 14.5962ZM14.5962 16.2043C14.9076 16.523 15.1516 16.9013 15.3136 17.3165C15.4756 17.7316 15.5523 18.1752 15.5391 18.6206C15.5212 19.293 15.3 19.9442 14.9048 20.4884C14.5095 21.0327 13.9587 21.4444 13.3249 21.6695C12.691 21.8946 12.0039 21.9225 11.3539 21.7495C10.7039 21.5764 10.1216 21.2106 9.68353 20.7002C9.55382 20.5498 9.4593 20.3724 9.40686 20.1809C9.35443 19.9893 9.3454 19.7885 9.38044 19.593C9.42202 19.3641 9.51331 19.1471 9.64787 18.9572C9.78242 18.7674 9.95698 18.6094 10.1592 18.4943C10.6722 18.1923 11.0974 17.7615 11.3927 17.2447C11.688 16.7278 11.8433 16.1428 11.8431 15.5476C11.8493 15.4368 11.8493 15.3258 11.8431 15.215C11.9651 15.2087 12.0873 15.2087 12.2093 15.215H12.243C12.6817 15.2128 13.1163 15.2993 13.5206 15.4693C13.925 15.6393 14.2909 15.8893 14.5962 16.2043ZM12.2093 14.3562C11.7847 14.3562 11.3696 14.2303 11.0166 13.9944C10.6635 13.7585 10.3883 13.4232 10.2258 13.0309C10.0633 12.6386 10.0208 12.2069 10.1037 11.7905C10.1865 11.374 10.391 10.9915 10.6912 10.6912C10.9915 10.391 11.374 10.1865 11.7905 10.1037C12.2069 10.0208 12.6386 10.0633 13.0309 10.2258C13.4232 10.3883 13.7585 10.6635 13.9944 11.0166C14.2303 11.3696 14.3562 11.7847 14.3562 12.2093C14.3551 12.7784 14.1286 13.3238 13.7262 13.7262C13.3238 14.1286 12.7784 14.3551 12.2093 14.3562ZM15.5518 12.5629C15.441 12.5567 15.33 12.5567 15.2192 12.5629C15.2192 12.4366 15.2192 12.3146 15.2192 12.1925C15.219 11.7469 15.3083 11.3059 15.4816 10.8954C15.655 10.485 15.9089 10.1135 16.2285 9.80303C16.548 9.49253 16.9266 9.24931 17.3418 9.08778C17.7571 8.92625 18.2005 8.8497 18.6459 8.86265C19.4927 8.8959 20.2958 9.24719 20.8951 9.84644C21.4943 10.4457 21.8456 11.2488 21.8789 12.0957C21.894 12.596 21.7958 13.0933 21.5917 13.5503C21.3876 14.0074 21.0828 14.4124 20.7002 14.7351C20.55 14.8651 20.3726 14.9598 20.181 15.0122C19.9894 15.0647 19.7885 15.0735 19.593 15.0382C19.3646 14.9968 19.1479 14.9061 18.9581 14.7723C18.7683 14.6385 18.6101 14.4649 18.4943 14.2636C18.1951 13.7479 17.766 13.3195 17.2497 13.0211C16.7335 12.7227 16.1481 12.5648 15.5518 12.5629Z\\" fill=\\"#61CAFA\\"/>\\n<path d=\\"M12.2094 10.6516C11.9014 10.6516 11.6002 10.743 11.3441 10.9141C11.0879 11.0853 10.8883 11.3285 10.7704 11.6131C10.6525 11.8977 10.6217 12.2109 10.6818 12.513C10.7419 12.8152 10.8902 13.0927 11.1081 13.3105C11.3259 13.5284 11.6034 13.6767 11.9056 13.7368C12.2077 13.7969 12.5209 13.7661 12.8055 13.6482C13.0901 13.5303 13.3333 13.3307 13.5045 13.0745C13.6756 12.8184 13.767 12.5172 13.767 12.2092C13.767 11.7961 13.6029 11.3999 13.3108 11.1078C13.0187 10.8157 12.6225 10.6516 12.2094 10.6516ZM12.2094 12.9248C12.0679 12.9248 11.9295 12.8828 11.8118 12.8042C11.6942 12.7256 11.6024 12.6138 11.5483 12.483C11.4941 12.3523 11.4799 12.2084 11.5075 12.0696C11.5351 11.9307 11.6033 11.8032 11.7034 11.7031C11.8035 11.6031 11.931 11.5349 12.0698 11.5073C12.2086 11.4797 12.3525 11.4939 12.4833 11.548C12.6141 11.6022 12.7258 11.6939 12.8045 11.8116C12.8831 11.9293 12.9251 12.0676 12.9251 12.2092C12.9251 12.399 12.8497 12.581 12.7155 12.7152C12.5812 12.8494 12.3992 12.9248 12.2094 12.9248Z\\" fill=\\"#61CAFA\\"/>\\n</pattern>\\n</svg>\\n",
        "areaColors": "> areaValues | matchValue(areaColorsEditorConfig)",
        "backgroundColor": "transparent",
        "areaIds": "> primary | seriesByName('fan')",
        "areaValues": "> primary | seriesByName('status')"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "match": "On",
            "value": "url(#pattern1)"
          },
          {
            "match": "Off",
            "value": "url(#pattern0)"
          }
        ]
      }
    },
    "viz_GiFGQJhv": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('5A')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_aIJuVzaA": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# Server Room Heatmap"
      }
    },
    "viz_chzeT9xQ": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#CBA700"
      }
    },
    "viz_74Cet7PR": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('4C')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_s16ezMEZ": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('4B')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_WkLDDaHu": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.8,
        "fillColor": "#191B20"
      }
    },
    "viz_IbedREF0": {
      "type": "splunk.ellipse",
      "dataSources": {
        "primary": "ds_8qwizlRA_ds_FZspy2J5"
      },
      "options": {
        "fillColor": "> fillDataValue | matchValue(fillColorEditorConfig)"
      },
      "context": {
        "fillColorEditorConfig": [
          {
            "match": "Off",
            "value": "#505158"
          },
          {
            "value": "#62C9FA",
            "match": "On"
          }
        ],
        "fillDataValue": "> primary | seriesByName('status') | lastPoint()"
      },
      "showProgressBar": false,
      "showLastUpdated": false
    },
    "viz_gyep5iwo": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_93JnfLyu": {
      "type": "splunk.singlevalue",
      "dataSources": {
        "primary": "ds_qwJWyIWq_ds_8qwizlRA_ds_FZspy2J5"
      },
      "options": {
        "majorFontSize": 14,
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "trendDisplay": "off",
        "majorColor": "> majorValue | matchValue(majorColorEditorConfig)",
        "sparklineValues": "> primary | seriesByName('status')"
      },
      "context": {
        "majorColorEditorConfig": [
          {
            "match": "Off",
            "value": "#505158"
          },
          {
            "value": "#62C9FA",
            "match": "On"
          }
        ]
      }
    },
    "viz_LKZmA5D3": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<svg width=\\"34\\" height=\\"34\\" viewBox=\\"0 0 34 34\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<rect x=\\"9.8\\" y=\\"1.8\\" width=\\"21.4\\" height=\\"8.4\\" rx=\\"1.2\\" stroke=\\"#ACACAD\\" stroke-width=\\"1.6\\"/>\\n<path d=\\"M7 6H4C2.89543 6 2 6.89543 2 8V26C2 27.1046 2.89543 28 4 28H7\\" stroke=\\"#ACACAD\\" stroke-width=\\"1.6\\"/>\\n<rect x=\\"12.75\\" y=\\"4.75\\" width=\\"2.5\\" height=\\"2.5\\" rx=\\"1.25\\" stroke=\\"#ACACAD\\" stroke-width=\\"1.5\\"/>\\n<rect x=\\"9.8\\" y=\\"12.8\\" width=\\"21.4\\" height=\\"8.4\\" rx=\\"1.2\\" stroke=\\"#ACACAD\\" stroke-width=\\"1.6\\"/>\\n<rect x=\\"12.75\\" y=\\"15.75\\" width=\\"2.5\\" height=\\"2.5\\" rx=\\"1.25\\" stroke=\\"#ACACAD\\" stroke-width=\\"1.5\\"/>\\n<rect x=\\"9.8\\" y=\\"23.8\\" width=\\"21.4\\" height=\\"8.4\\" rx=\\"1.2\\" stroke=\\"#ACACAD\\" stroke-width=\\"1.6\\"/>\\n<rect x=\\"12.75\\" y=\\"26.75\\" width=\\"2.5\\" height=\\"2.5\\" rx=\\"1.25\\" stroke=\\"#ACACAD\\" stroke-width=\\"1.5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_2NKT4F15": {
      "dataSources": {
        "primary": "ds_6zvrUOR6"
      },
      "type": "splunk.singlevalue",
      "options": {
        "majorFontSize": 14,
        "backgroundColor": "transparent",
        "sparklineDisplay": "off",
        "trendDisplay": "off",
        "majorColor": "> majorValue | rangeValue(majorColorEditorConfig)"
      },
      "context": {
        "majorColorEditorConfig": [
          {
            "from": 1,
            "value": "#62C9FA"
          },
          {
            "value": "#818285",
            "to": 1
          }
        ]
      }
    },
    "viz_ZEylgIfT": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('2C')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_2mkSnngg": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<svg width=\\"34\\" height=\\"34\\" viewBox=\\"0 0 34 34\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<rect width=\\"34\\" height=\\"34\\" fill=\\"none\\" fill-opacity=\\"0.02\\"/>\\n<path d=\\"M13.8841 33.0684C18.5192 33.9678 22.5317 30.4396 22.5317 25.9428C22.5317 23.5907 21.3556 21.4461 19.5569 20.1316V4.28921C19.5569 1.93706 17.689 0 15.2677 0C12.9155 0 10.9785 1.93706 10.9785 4.28921V20.1316C8.83387 21.7228 7.58861 24.4208 8.21124 27.4648C8.76469 30.232 11.0477 32.515 13.8841 33.0684ZM11.8778 21.4461L12.5005 20.9618V4.35839C12.5005 2.83641 13.7457 1.66034 15.1985 1.66034C16.7205 1.66034 17.9657 2.9056 17.9657 4.35839V20.9618L18.5884 21.4461C20.0412 22.4838 20.8713 24.2133 20.8713 26.012C20.8713 27.534 20.2487 28.9868 19.211 30.0245C18.1041 31.0622 16.7205 31.6848 15.1985 31.6848C12.3621 31.6848 10.1483 29.6786 9.66404 27.1881C9.31813 24.9051 10.1483 22.6913 11.8778 21.4461Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M15.2676 30.0245C16.3745 30.0245 17.4122 29.6094 18.1732 28.8484C18.9342 28.0874 19.3493 27.0497 19.3493 25.9428C19.3493 23.1756 16.9971 22.2763 16.3745 21.7228V10.0312H14.0915V21.7228C13.6072 22.2763 10.5633 23.3832 11.2551 26.773C11.601 28.5717 13.1922 30.0245 15.2676 30.0245Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M25.2988 4.70435H21.3555V6.29551H25.2988C25.7139 6.29551 26.0598 5.9496 26.0598 5.53452C26.1289 5.05025 25.783 4.70435 25.2988 4.70435Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M24.5379 9.68531C24.5379 9.27022 24.192 8.92432 23.777 8.92432H21.4248V10.5155H23.777C24.192 10.4463 24.5379 10.1004 24.5379 9.68531Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M26.1291 13.8362C26.1291 13.4211 25.7832 13.0752 25.3681 13.0752H21.4248V14.6664H25.3681C25.7832 14.6664 26.1291 14.2513 26.1291 13.8362Z\\" fill=\\"#ACACAD\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_xZrpAdXl": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<svg width=\\"34\\" height=\\"34\\" viewBox=\\"0 0 34 34\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<g clip-path=\\"url(#clip0)\\">\\n<path d=\\"M19.025 16.6908C18.8705 16.3817 18.6387 16.2272 18.3296 16.2272H16.7841L18.175 14.3726C18.4069 14.0635 18.3296 13.5226 18.0205 13.2908C17.7114 13.059 17.1705 13.1362 16.9387 13.4453L14.6205 16.5362C14.466 16.7681 14.3887 17.0772 14.5432 17.309C14.6978 17.5408 14.9296 17.7726 15.2387 17.7726H16.7841L15.3932 19.6272C15.1614 19.9362 15.2387 20.4772 15.5478 20.709C15.7023 20.7862 15.8569 20.8635 16.0114 20.8635C16.2432 20.8635 16.475 20.7862 16.6296 20.5544L18.9478 17.4635C19.1023 17.2317 19.1796 16.9226 19.025 16.6908Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M8.12974 9.42726C8.59338 9.8909 9.13429 10.1227 9.75247 10.1227C10.2161 10.1227 10.757 9.96817 11.1434 9.65908C11.9934 9.0409 12.9206 8.49999 13.9252 8.1909C14.3116 8.03635 14.5434 7.64999 14.3888 7.18635C14.2343 6.72271 13.8479 6.56817 13.3843 6.72271C12.2252 7.10908 11.1434 7.64999 10.1388 8.42271C9.82974 8.65453 9.44338 8.65453 9.13429 8.42271L5.88883 4.94544C5.57974 4.63635 5.1161 4.63635 4.80701 4.94544C4.49792 5.25453 4.49792 5.71817 4.80701 6.02726L8.12974 9.42726Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M7.9752 19.859C7.82065 19.4726 7.43429 19.2408 6.97065 19.3953C6.58429 19.5499 6.35247 19.9362 6.50701 20.3999C6.89338 21.559 7.43429 22.6408 8.20701 23.6453C8.43883 23.9544 8.43883 24.3408 8.20701 24.6499L4.80701 28.0499C4.49792 28.359 4.49792 28.8226 4.80701 29.1317C4.96156 29.2862 5.19338 29.3635 5.34792 29.3635C5.50247 29.3635 5.73429 29.2862 5.88883 29.1317L9.28883 25.7317C10.0616 24.959 10.1388 23.6453 9.44338 22.7181C8.74792 21.7908 8.28429 20.8635 7.9752 19.859Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M7.58873 15.7636C7.74327 14.6818 8.05236 13.6772 8.516 12.7499C8.74782 12.3636 8.59327 11.8999 8.20691 11.7454C7.82054 11.5136 7.35691 11.6681 7.20236 12.0545C6.66145 13.1363 6.27509 14.2954 6.12054 15.5318C6.04327 15.9181 5.73418 16.2272 5.34782 16.2272H0.556907C0.0932706 16.2272 -0.21582 16.5363 -0.21582 16.9999C-0.21582 17.4636 0.0932706 17.7727 0.556907 17.7727H5.34782C6.50691 17.7727 7.43418 16.9227 7.58873 15.7636Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M15.4708 26.1954C14.389 26.0408 13.3845 25.7317 12.4572 25.2681C12.0709 25.0363 11.6072 25.1908 11.4527 25.5772C11.2209 25.9636 11.3754 26.4272 11.7618 26.5817C12.8436 27.1226 14.0027 27.509 15.239 27.6636C15.6254 27.7408 15.9345 28.0499 15.9345 28.359V33.2272C15.9345 33.6908 16.2436 33.9999 16.7072 33.9999C17.1708 33.9999 17.4799 33.6908 17.4799 33.2272V28.4363C17.4799 27.2772 16.6299 26.3499 15.4708 26.1954Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M25.3617 24.5727C24.589 23.7999 23.2753 23.7227 22.3481 24.4181C21.4981 25.0363 20.5708 25.5772 19.5662 25.8863C19.1799 26.0409 18.9481 26.4272 19.1026 26.8909C19.2572 27.2772 19.6435 27.509 20.1072 27.3545C21.2662 26.9681 22.3481 26.4272 23.3526 25.6545C23.6617 25.4227 24.0481 25.4227 24.3572 25.6545L27.7572 29.0545C27.9117 29.209 28.1435 29.2863 28.2981 29.2863C28.4526 29.2863 28.6844 29.209 28.839 29.0545C29.1481 28.7454 29.1481 28.2818 28.839 27.9727L25.3617 24.5727Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M25.5162 14.1409C25.5935 14.45 25.9026 14.6818 26.2889 14.6818C26.3662 14.6818 26.4435 14.6818 26.5207 14.6818C26.9071 14.5273 27.1389 14.1409 26.9844 13.6773C26.598 12.5182 26.0571 11.4364 25.2844 10.4318C25.0526 10.1227 25.0526 9.73635 25.2844 9.42726L28.6844 6.02726C28.9935 5.71817 28.9935 5.25453 28.6844 4.94544C28.3753 4.63635 27.9116 4.63635 27.6026 4.94544L24.2026 8.34544C23.4298 9.11817 23.3526 10.4318 24.048 11.3591C24.7435 12.2091 25.2071 13.1364 25.5162 14.1409Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M33.0114 16.2273H28.2205C27.0614 16.2273 26.1341 17.0773 25.9796 18.2364C25.825 19.3182 25.5159 20.3227 25.0523 21.25C24.8205 21.6364 24.975 22.1 25.3614 22.2546C25.4386 22.3318 25.5932 22.3318 25.7477 22.3318C26.0568 22.3318 26.2886 22.1773 26.4432 21.9455C26.9841 20.8637 27.3705 19.7046 27.525 18.4682C27.6023 18.0818 27.9114 17.7727 28.2205 17.7727H33.0114C33.475 17.7727 33.7841 17.4637 33.7841 17C33.7841 16.5364 33.475 16.2273 33.0114 16.2273Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M18.0203 7.80455C19.1021 7.95909 20.1067 8.26818 21.034 8.73182C21.1112 8.80909 21.2658 8.80909 21.4203 8.80909C21.7294 8.80909 21.9612 8.65455 22.1158 8.42273C22.3476 8.03636 22.193 7.57273 21.8067 7.41818C20.7249 6.87727 19.5658 6.49091 18.3294 6.33636C17.8658 6.25909 17.5567 5.95 17.5567 5.56364V0.772727C17.5567 0.309091 17.2476 0 16.784 0C16.3203 0 16.0112 0.309091 16.0112 0.772727V5.56364C16.0112 6.72273 16.8612 7.65 18.0203 7.80455Z\\" fill=\\"#ACACAD\\"/>\\n<path d=\\"M24.5117 17C24.5117 12.75 21.0344 9.27271 16.7844 9.27271C12.5344 9.27271 9.05713 12.75 9.05713 17C9.05713 21.25 12.5344 24.7273 16.7844 24.7273C21.0344 24.7273 24.5117 21.25 24.5117 17ZM10.6026 17C10.6026 13.6 13.3844 10.8182 16.7844 10.8182C20.1844 10.8182 22.9662 13.6 22.9662 17C22.9662 20.4 20.1844 23.1818 16.7844 23.1818C13.3844 23.1818 10.6026 20.4 10.6026 17Z\\" fill=\\"#ACACAD\\"/>\\n</g>\\n<defs>\\n<clipPath id=\\"clip0\\">\\n<rect width=\\"34\\" height=\\"34\\" fill=\\"white\\"/>\\n</clipPath>\\n</defs>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_fOGtq3GD": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#D41F1F"
      }
    },
    "viz_bJsqtysd": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## HVAC - 1"
      }
    },
    "viz_MR8FqxZd": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## Power Utilization"
      }
    },
    "viz_dZmorf41": {
      "type": "splunk.ellipse",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "#43454B"
      },
      "context": {},
      "showProgressBar": false,
      "showLastUpdated": false
    },
    "viz_tqvtX4Am": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.8,
        "fillColor": "#1A1C20"
      }
    },
    "viz_zEdhBzCP": {
      "type": "splunk.singlevalue",
      "options": {
        "showSparklineAreaGraph": true,
        "majorFontSize": 54,
        "trendColor": "> trendValue | rangeValue(trendColorEditorConfig)",
        "unit": "\xB0",
        "sparklineAreaColor": "> sparklineStrokeColor",
        "backgroundColor": "transparent",
        "trendFontSize": 24,
        "sparklineStrokeColor": "> trendColor"
      },
      "context": {
        "trendColorEditorConfig": [
          {
            "to": 0,
            "value": "#5cb3f2"
          },
          {
            "from": 0,
            "value": "#FE3A3A"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_2k2tu89X_ds_dWi9oVi2"
      }
    },
    "viz_sL8Q2jmx": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('1C')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_RArozFdZ": {
      "type": "splunk.singlevalue",
      "options": {
        "majorColor": "#ffffff",
        "majorFontSize": 18,
        "unit": "\xB0",
        "backgroundColor": "> majorValue | rangeValue(backgroundColorEditorConfig)",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('5C')"
      },
      "context": {
        "backgroundColorEditorConfig": [
          {
            "to": 50,
            "value": "#5cb3f2"
          },
          {
            "to": 70,
            "from": 50,
            "value": "#CBA700"
          },
          {
            "from": 70,
            "value": "#D41F1F"
          }
        ]
      },
      "dataSources": {
        "primary": "ds_Y6m3TC9v"
      }
    },
    "viz_Zqanb6Zh": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "#### High 70\xB0-100\xB0",
        "fontColor": "#AEAFB1"
      }
    }
  },
  "description": "",
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
          "backgroundImage": {
            "y": 0,
            "x": 0,
            "sizeType": "cover",
            "src": "/static/app/splunk-dashboard-studio/images/examples-hub/datacenter/Background_v2.png"
          },
          "display": "auto-scale",
          "backgroundColor": "#191B20",
          "height": 1000
        },
        "structure": [
          {
            "item": "viz_Mq69Fdyn",
            "type": "block",
            "position": {
              "y": 350,
              "x": 70,
              "w": 140,
              "h": 130
            }
          },
          {
            "item": "viz_dzqdh0kW",
            "type": "block",
            "position": {
              "y": 415,
              "x": 110,
              "w": 140,
              "h": 50
            }
          },
          {
            "item": "viz_JNO4wXtf",
            "type": "block",
            "position": {
              "y": 320,
              "x": 30,
              "w": 910,
              "h": 570
            }
          },
          {
            "item": "viz_DO7xE34x",
            "type": "block",
            "position": {
              "y": 620,
              "x": 700,
              "w": 130,
              "h": 90
            }
          },
          {
            "item": "viz_LiC3o5UB",
            "type": "block",
            "position": {
              "y": 20,
              "x": 20,
              "w": 320,
              "h": 80
            }
          },
          {
            "item": "viz_Kc5E88jq",
            "type": "block",
            "position": {
              "y": 90,
              "x": 1000,
              "w": 420,
              "h": 800
            }
          },
          {
            "item": "viz_WkLDDaHu",
            "type": "block",
            "position": {
              "y": 90,
              "x": 30,
              "w": 304,
              "h": 180
            }
          },
          {
            "item": "viz_8X4cRgh0",
            "type": "block",
            "position": {
              "y": 90,
              "x": 670,
              "w": 304,
              "h": 180
            }
          },
          {
            "item": "viz_tqvtX4Am",
            "type": "block",
            "position": {
              "y": 90,
              "x": 350,
              "w": 304,
              "h": 180
            }
          },
          {
            "item": "viz_xhfBJMdl",
            "type": "block",
            "position": {
              "y": 140,
              "x": 1010,
              "w": 390,
              "h": 230
            }
          },
          {
            "item": "viz_hsMjalhP",
            "type": "block",
            "position": {
              "y": 140,
              "x": 50,
              "w": 260,
              "h": 110
            }
          },
          {
            "item": "viz_MR8FqxZd",
            "type": "block",
            "position": {
              "y": 100,
              "x": 80,
              "w": 210,
              "h": 60
            }
          },
          {
            "item": "viz_QvsFMX54",
            "type": "block",
            "position": {
              "y": 100,
              "x": 400,
              "w": 200,
              "h": 60
            }
          },
          {
            "item": "viz_ZcqbKrAu",
            "type": "block",
            "position": {
              "y": 100,
              "x": 40,
              "w": 40,
              "h": 30
            }
          },
          {
            "item": "viz_NV0gv5cl",
            "type": "block",
            "position": {
              "y": 100,
              "x": 360,
              "w": 40,
              "h": 30
            }
          },
          {
            "item": "viz_5183dBun",
            "type": "block",
            "position": {
              "y": 100,
              "x": 720,
              "w": 200,
              "h": 60
            }
          },
          {
            "item": "viz_2mkSnngg",
            "type": "block",
            "position": {
              "y": 100,
              "x": 680,
              "w": 40,
              "h": 30
            }
          },
          {
            "item": "viz_61AXTZf1",
            "type": "block",
            "position": {
              "y": 110,
              "x": 1060,
              "w": 220,
              "h": 60
            }
          },
          {
            "item": "viz_LKZmA5D3",
            "type": "block",
            "position": {
              "y": 300,
              "x": 60,
              "w": 40,
              "h": 30
            }
          },
          {
            "item": "viz_YIsgPKsx",
            "type": "block",
            "position": {
              "y": 110,
              "x": 1020,
              "w": 40,
              "h": 30
            }
          },
          {
            "item": "viz_xZCOfgz8",
            "type": "block",
            "position": {
              "y": 380,
              "x": 1060,
              "w": 300,
              "h": 60
            }
          },
          {
            "item": "viz_xZrpAdXl",
            "type": "block",
            "position": {
              "y": 380,
              "x": 1020,
              "w": 40,
              "h": 30
            }
          },
          {
            "item": "viz_aIJuVzaA",
            "type": "block",
            "position": {
              "y": 300,
              "x": 100,
              "w": 280,
              "h": 70
            }
          },
          {
            "item": "viz_sh2FGEJo",
            "type": "block",
            "position": {
              "y": 430,
              "x": 1010,
              "w": 400,
              "h": 150
            }
          },
          {
            "item": "viz_Apx34i44",
            "type": "block",
            "position": {
              "y": 140,
              "x": 370,
              "w": 260,
              "h": 110
            }
          },
          {
            "item": "viz_zEdhBzCP",
            "type": "block",
            "position": {
              "y": 140,
              "x": 690,
              "w": 260,
              "h": 110
            }
          },
          {
            "item": "viz_g5GyUgld",
            "type": "block",
            "position": {
              "y": 590,
              "x": 1010,
              "w": 400,
              "h": 340
            }
          },
          {
            "item": "viz_bJsqtysd",
            "type": "block",
            "position": {
              "y": 360,
              "x": 80,
              "w": 140,
              "h": 70
            }
          },
          {
            "item": "viz_UqheLYEr",
            "type": "block",
            "position": {
              "y": 390,
              "x": 80,
              "w": 20,
              "h": 20
            }
          },
          {
            "item": "viz_IbedREF0",
            "type": "block",
            "position": {
              "y": 390,
              "x": 80,
              "w": 16,
              "h": 16
            }
          },
          {
            "item": "viz_XhOQlSx9",
            "type": "block",
            "position": {
              "y": 380,
              "x": 100,
              "w": 40,
              "h": 40
            }
          },
          {
            "item": "viz_uMsD9U29",
            "type": "block",
            "position": {
              "y": 700,
              "x": 790,
              "w": 140,
              "h": 130
            }
          },
          {
            "item": "viz_RodDAMCa",
            "type": "block",
            "position": {
              "y": 690,
              "x": 800,
              "w": 140,
              "h": 70
            }
          },
          {
            "item": "viz_dZmorf41",
            "type": "block",
            "position": {
              "y": 740,
              "x": 800,
              "w": 20,
              "h": 20
            }
          },
          {
            "item": "viz_PjJj3PhI",
            "type": "block",
            "position": {
              "y": 740,
              "x": 800,
              "w": 16,
              "h": 16
            }
          },
          {
            "item": "viz_93JnfLyu",
            "type": "block",
            "position": {
              "y": 730,
              "x": 820,
              "w": 40,
              "h": 40
            }
          },
          {
            "item": "viz_cPcTNTWj",
            "type": "block",
            "position": {
              "y": 430,
              "x": 80,
              "w": 30,
              "h": 30
            }
          },
          {
            "item": "viz_pgULSQZ3",
            "type": "block",
            "position": {
              "y": 430,
              "x": 110,
              "w": 40,
              "h": 40
            }
          },
          {
            "item": "viz_2NKT4F15",
            "type": "block",
            "position": {
              "y": 790,
              "x": 830,
              "w": 40,
              "h": 30
            }
          },
          {
            "item": "viz_2FLiZNYw",
            "type": "block",
            "position": {
              "y": 770,
              "x": 830,
              "w": 130,
              "h": 60
            }
          },
          {
            "item": "viz_DGzy6QpW",
            "type": "block",
            "position": {
              "y": 780,
              "x": 800,
              "w": 30,
              "h": 30
            }
          },
          {
            "item": "viz_Owlm3nQj",
            "type": "block",
            "position": {
              "y": 340,
              "x": 190,
              "w": 130,
              "h": 90
            }
          },
          {
            "item": "viz_NFgVlgyR",
            "type": "block",
            "position": {
              "y": 340,
              "x": 840,
              "w": 20,
              "h": 10
            }
          },
          {
            "item": "viz_pHvn1tuj",
            "type": "block",
            "position": {
              "y": 333,
              "x": 870,
              "w": 100,
              "h": 70
            }
          },
          {
            "item": "viz_vH43hiRI",
            "type": "block",
            "position": {
              "y": 363,
              "x": 870,
              "w": 120,
              "h": 70
            }
          },
          {
            "item": "viz_chzeT9xQ",
            "type": "block",
            "position": {
              "y": 370,
              "x": 840,
              "w": 20,
              "h": 10
            }
          },
          {
            "item": "viz_Zqanb6Zh",
            "type": "block",
            "position": {
              "y": 393,
              "x": 870,
              "w": 120,
              "h": 70
            }
          },
          {
            "item": "viz_fOGtq3GD",
            "type": "block",
            "position": {
              "y": 400,
              "x": 840,
              "w": 20,
              "h": 10
            }
          },
          {
            "item": "viz_gyep5iwo",
            "type": "block",
            "position": {
              "y": 570,
              "x": 140,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_jYxw2kyV",
            "type": "block",
            "position": {
              "y": 610,
              "x": 215,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_QuoUsKIq",
            "type": "block",
            "position": {
              "y": 650,
              "x": 290,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_RZ1m5Ubz",
            "type": "block",
            "position": {
              "y": 690,
              "x": 365,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_GiFGQJhv",
            "type": "block",
            "position": {
              "y": 730,
              "x": 440,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_ygXLEB4m",
            "type": "block",
            "position": {
              "y": 500,
              "x": 305,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_FAnx3cef",
            "type": "block",
            "position": {
              "y": 540,
              "x": 380,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_jrwJjbh3",
            "type": "block",
            "position": {
              "y": 580,
              "x": 455,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_s16ezMEZ",
            "type": "block",
            "position": {
              "y": 620,
              "x": 530,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_c1tm37dG",
            "type": "block",
            "position": {
              "y": 660,
              "x": 605,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_sL8Q2jmx",
            "type": "block",
            "position": {
              "y": 430,
              "x": 470,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_ZEylgIfT",
            "type": "block",
            "position": {
              "y": 470,
              "x": 545,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_gnLaI5Bb",
            "type": "block",
            "position": {
              "y": 510,
              "x": 620,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_74Cet7PR",
            "type": "block",
            "position": {
              "y": 550,
              "x": 690,
              "w": 50,
              "h": 40
            }
          },
          {
            "item": "viz_RArozFdZ",
            "type": "block",
            "position": {
              "y": 590,
              "x": 770,
              "w": 50,
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
\`\`\``}}},description:"",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"absolute",options:{width:1440,backgroundImage:{y:0,x:0,sizeType:"cover",src:"/static/app/splunk-dashboard-studio/images/examples-hub/datacenter/Background_v2.png"},display:"auto-scale",backgroundColor:"#191B20",height:1300},structure:[{item:"viz_Mq69Fdyn",type:"block",position:{y:350,x:70,w:140,h:130}},{item:"viz_dzqdh0kW",type:"block",position:{y:415,x:110,w:140,h:50}},{item:"viz_JNO4wXtf",type:"block",position:{y:320,x:30,w:910,h:570}},{item:"viz_DO7xE34x",type:"block",position:{y:620,x:700,w:130,h:90}},{item:"viz_LiC3o5UB",type:"block",position:{y:20,x:20,w:320,h:80}},{item:"viz_Kc5E88jq",type:"block",position:{y:90,x:1e3,w:420,h:800}},{item:"viz_WkLDDaHu",type:"block",position:{y:90,x:30,w:304,h:180}},{item:"viz_8X4cRgh0",type:"block",position:{y:90,x:670,w:304,h:180}},{item:"viz_tqvtX4Am",type:"block",position:{y:90,x:350,w:304,h:180}},{item:"viz_xhfBJMdl",type:"block",position:{y:140,x:1010,w:390,h:230}},{item:"viz_hsMjalhP",type:"block",position:{y:140,x:50,w:260,h:110}},{item:"viz_MR8FqxZd",type:"block",position:{y:100,x:80,w:210,h:60}},{item:"viz_QvsFMX54",type:"block",position:{y:100,x:400,w:200,h:60}},{item:"viz_ZcqbKrAu",type:"block",position:{y:100,x:40,w:40,h:30}},{item:"viz_NV0gv5cl",type:"block",position:{y:100,x:360,w:40,h:30}},{item:"viz_5183dBun",type:"block",position:{y:100,x:720,w:200,h:60}},{item:"viz_2mkSnngg",type:"block",position:{y:100,x:680,w:40,h:30}},{item:"viz_61AXTZf1",type:"block",position:{y:110,x:1060,w:220,h:60}},{item:"viz_LKZmA5D3",type:"block",position:{y:300,x:60,w:40,h:30}},{item:"viz_YIsgPKsx",type:"block",position:{y:110,x:1020,w:40,h:30}},{item:"viz_xZCOfgz8",type:"block",position:{y:380,x:1060,w:300,h:60}},{item:"viz_xZrpAdXl",type:"block",position:{y:380,x:1020,w:40,h:30}},{item:"viz_aIJuVzaA",type:"block",position:{y:300,x:100,w:280,h:70}},{item:"viz_sh2FGEJo",type:"block",position:{y:430,x:1010,w:400,h:150}},{item:"viz_Apx34i44",type:"block",position:{y:140,x:370,w:260,h:110}},{item:"viz_zEdhBzCP",type:"block",position:{y:140,x:690,w:260,h:110}},{item:"viz_g5GyUgld",type:"block",position:{y:590,x:1010,w:400,h:340}},{item:"viz_bJsqtysd",type:"block",position:{y:360,x:80,w:140,h:70}},{item:"viz_UqheLYEr",type:"block",position:{y:390,x:80,w:20,h:20}},{item:"viz_IbedREF0",type:"block",position:{y:390,x:80,w:16,h:16}},{item:"viz_XhOQlSx9",type:"block",position:{y:380,x:100,w:40,h:40}},{item:"viz_uMsD9U29",type:"block",position:{y:700,x:790,w:140,h:130}},{item:"viz_RodDAMCa",type:"block",position:{y:690,x:800,w:140,h:70}},{item:"viz_dZmorf41",type:"block",position:{y:740,x:800,w:20,h:20}},{item:"viz_PjJj3PhI",type:"block",position:{y:740,x:800,w:16,h:16}},{item:"viz_93JnfLyu",type:"block",position:{y:730,x:820,w:40,h:40}},{item:"viz_cPcTNTWj",type:"block",position:{y:430,x:80,w:30,h:30}},{item:"viz_pgULSQZ3",type:"block",position:{y:430,x:110,w:40,h:40}},{item:"viz_2NKT4F15",type:"block",position:{y:790,x:830,w:40,h:30}},{item:"viz_2FLiZNYw",type:"block",position:{y:770,x:830,w:130,h:60}},{item:"viz_DGzy6QpW",type:"block",position:{y:780,x:800,w:30,h:30}},{item:"viz_Owlm3nQj",type:"block",position:{y:340,x:190,w:130,h:90}},{item:"viz_NFgVlgyR",type:"block",position:{y:340,x:840,w:20,h:10}},{item:"viz_pHvn1tuj",type:"block",position:{y:333,x:870,w:100,h:70}},{item:"viz_vH43hiRI",type:"block",position:{y:363,x:870,w:120,h:70}},{item:"viz_chzeT9xQ",type:"block",position:{y:370,x:840,w:20,h:10}},{item:"viz_Zqanb6Zh",type:"block",position:{y:393,x:870,w:120,h:70}},{item:"viz_fOGtq3GD",type:"block",position:{y:400,x:840,w:20,h:10}},{item:"viz_gyep5iwo",type:"block",position:{y:570,x:140,w:50,h:40}},{item:"viz_jYxw2kyV",type:"block",position:{y:610,x:215,w:50,h:40}},{item:"viz_QuoUsKIq",type:"block",position:{y:650,x:290,w:50,h:40}},{item:"viz_RZ1m5Ubz",type:"block",position:{y:690,x:365,w:50,h:40}},{item:"viz_GiFGQJhv",type:"block",position:{y:730,x:440,w:50,h:40}},{item:"viz_ygXLEB4m",type:"block",position:{y:500,x:305,w:50,h:40}},{item:"viz_FAnx3cef",type:"block",position:{y:540,x:380,w:50,h:40}},{item:"viz_jrwJjbh3",type:"block",position:{y:580,x:455,w:50,h:40}},{item:"viz_s16ezMEZ",type:"block",position:{y:620,x:530,w:50,h:40}},{item:"viz_c1tm37dG",type:"block",position:{y:660,x:605,w:50,h:40}},{item:"viz_sL8Q2jmx",type:"block",position:{y:430,x:470,w:50,h:40}},{item:"viz_ZEylgIfT",type:"block",position:{y:470,x:545,w:50,h:40}},{item:"viz_gnLaI5Bb",type:"block",position:{y:510,x:620,w:50,h:40}},{item:"viz_74Cet7PR",type:"block",position:{y:550,x:690,w:50,h:40}},{item:"viz_RArozFdZ",type:"block",position:{y:590,x:770,w:50,h:40}},{item:"viz_FG2v05LZ",type:"block",position:{x:10,y:930,w:1410,h:360}}]}},globalInputs:[],options:{showTitleAndDescription:!1}}};var a=t(r());var C="Datacenter Sensors";e(a.default.createElement(n,{definition:o,isCompleteDashboard:!0,dashboardTitle:C}),{pageTitle:C,hideFooter:!0,layout:"fixed"});
