/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as n}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as e}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as s}from"../chunks/chunk-REK4W3C7.js";import{h as a}from"../chunks/chunk-JHLB3KMN.js";var t={dataSources:{ds_9aLOivaD_ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j:{type:"ds.search",options:{query:`| makeresults 
| eval connection="db1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="db2" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db3" 
    | eval value=0] 
| append 
    [| makeresults 
    | eval connection="db4" 
    | eval value=0] 
| append 
    [| makeresults 
    | eval connection="db5" 
    | eval value=(random() % 100) ] 
| append 
    [| makeresults 
    | eval connection="db6" 
    | eval value="0" ] 
| streamstats window=1 current=f last(value) as prev_value 
| eval value=if(connection="db5",if(prev_value<50,100,0),if(connection="db6",if(value>50,100,0),value)) 
| table connection value`,refresh:"11s",queryParameters:{earliest:"-24h@h",latest:"now"}},name:"svg_databar5"},ds_xVHKdWls:{type:"ds.search",options:{query:`| makeresults 
| eval connection="aus1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="aus2" 
    | eval value=(random() % 20) ] 
| append 
    [| makeresults 
    | eval connection="aus3" 
    | eval value="10" ] 
| table connection value`,queryParameters:{earliest:"-15m",latest:"now"}},name:"svg_aus_hex"},ds_dT62rEjZ:{type:"ds.search",options:{query:`| stats count
| eval count=1.1`},name:"static_1.1"},ds_4PRjLIiF_ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of Copy of Copy of Copy of Copy of Copy of svg_node_hex"},ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of Copy of Copy of svg_node_hex"},ds_5LZFWQm5_ds_t3tyfKVl_ds_gJTl2haQ:{type:"ds.search",options:{query:`| makeresults 1 
| eval rand=(random() % 70) + 10`,refresh:"21s",queryParameters:{earliest:"-15m",latest:"now"}},name:"static_11"},ds_K3I9yf4j:{type:"ds.search",options:{query:`| makeresults 
| eval connection="db1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="db2" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db3" 
    | eval value=(random() % 100)] 
| append 
    [| makeresults 
    | eval connection="db4" 
    | eval value=0] 
| append 
    [| makeresults 
    | eval connection="db5" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db6" 
    | eval value="0" ] 
| streamstats window=1 current=f last(value) as prev_value 
| eval value=if(connection="db4",if(prev_value<50,100,0),if(connection="db3",if(value>50,100,0),value)) 
| table connection value`,refresh:"13s",queryParameters:{earliest:"-24h@h",latest:"now"}},name:"svg_databar1"},ds_ycdpkiAE_ds_YG5eoOOK_ds_Gr9vlHdv_ds_kSWvmiN8:{type:"ds.search",options:{query:`| makeresults 1 
| eval rand=(random() % 20) + 50`,refresh:"7s",queryParameters:{earliest:"-5m@m",latest:"now"}},name:"Copy of static_70"},ds_t3tyfKVl_ds_gJTl2haQ:{type:"ds.search",options:{query:`| makeresults 1 
| eval rand=(random() % 80) + 15`,refresh:"17s",queryParameters:{earliest:"-15m",latest:"now"}},name:"static_19"},ds_4mOwD3RM:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,refresh:"5s",queryParameters:{earliest:"-1m@m",latest:"now"}},name:"internal_timechart1"},ds_5igfRVhd:{type:"ds.search",options:{query:`| stats count
| eval count="P"`,queryParameters:{earliest:"-15m",latest:"now"}},name:"p1"},ds_dk1hBs1O_ds_sB9ko3Hp_ds_Gr9vlHdv_ds_kSWvmiN8:{type:"ds.search",options:{query:`| stats count
| eval count=100`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of static_100"},ds_05OuPp9z_ds_7DKwHTwB_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of Copy of svg_node_hex"},ds_1jrijlbw_ds_Gr9vlHdv_ds_kSWvmiN8:{type:"ds.search",options:{query:`| stats count
| eval count=98`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"static_98"},ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of Copy of svg_node_hex"},ds_LSE0lqTu_ds_8FuiQF3X:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of donut_static1"},ds_rGSz2MYl_ds_4mOwD3RM:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,refresh:"9s",queryParameters:{earliest:"-5m@m",latest:"now"}},name:"internal_timechart2"},ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of Copy of Copy of Copy of svg_node_hex"},ds_ZwpAzv1Z_ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host = host18
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,queryParameters:{earliest:"-15m",latest:"now"}},name:"internal_timechart6"},ds_neshfRKw_ds_vjB24jfv_ds_9aLOivaD_ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j:{type:"ds.search",options:{query:`| makeresults 
| eval connection="db1" 
| eval value=0
| append 
    [| makeresults 
    | eval connection="db2" 
    | eval value=(random() % 100)  ] 
| append 
    [| makeresults 
    | eval connection="db3" 
    | eval value=0] 
| append 
    [| makeresults 
    | eval connection="db4" 
    | eval value=0] 
| append 
    [| makeresults 
    | eval connection="db5" 
    | eval value=0] 
| append 
    [| makeresults 
    | eval connection="db6" 
    | eval value="0" ] 
| streamstats window=1 current=f last(value) as prev_value 
| eval value=if(connection="db2",if(prev_value<50,100,0),if(connection="db3",if(value>50,100,0),value)) 
| table connection value`,refresh:"23s",queryParameters:{earliest:"-15m",latest:"now"}},name:"svg_databar7"},ds_kwwC74KH_ds_dk1hBs1O_ds_sB9ko3Hp_ds_Gr9vlHdv_ds_kSWvmiN8:{type:"ds.search",options:{query:`| stats count
| eval count=100`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of Copy of static_100"},ds_23Y7IQ2F_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of svg_node_hex"},ds_yVqC7I0D:{type:"ds.search",options:{query:`| makeresults 
| eval connection="paris_r1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="paris_r2" 
    | eval value="5" ] 
| append 
    [| makeresults 
    | eval connection="paris_r3" 
    | eval value="10" ] 
| append 
    [| makeresults 
    | eval connection="paris_r4" 
    | eval value="15" ] 
| append 
    [| makeresults 
    | eval connection="paris_r5" 
    | eval value="20" ] 
| append 
    [| makeresults 
    | eval connection="paris_r6" 
    | eval value=(random() % 25) ] 
| append 
    [| makeresults 
    | eval connection="paris_r7" 
    | eval value="30" ] 
| append 
    [| makeresults 
    | eval connection="paris_r8" 
    | eval value="35" ] 
| append 
    [| makeresults 
    | eval connection="paris_r9" 
    | eval value="40" ] 
| append 
    [| makeresults 
    | eval connection="paris_r10" 
    | eval value=(random() % 50) ] 
| append 
    [| makeresults 
    | eval connection="paris_r11" 
    | eval value="45" ] 
| append 
    [| makeresults 
    | eval connection="paris_r12" 
    | eval value=(random() % 20)+80 ] 
| append 
    [| makeresults 
    | eval connection="paris_r13" 
    | eval value="55" ] 
| append 
    [| makeresults 
    | eval connection="paris_r14" 
    | eval value=(random() % 60) ] 
| append 
    [| makeresults 
    | eval connection="paris_r15" 
    | eval value="55" ] 
| append 
    [| makeresults 
    | eval connection="paris_r16" 
    | eval value=(random() % 80) ] 
| append 
    [| makeresults 
    | eval connection="paris_r17" 
    | eval value="75" ] 
| append 
    [| makeresults 
    | eval connection="paris_r18" 
    | eval value="78" ] 
    | append 
[| makeresults 
    | eval connection="paris_r19" 
    | eval value="81" ] 
[| makeresults 
    | eval connection="paris_r20" 
    | eval value="81" ] 
[| makeresults 
    | eval connection="paris_r21" 
    | eval value="81" ] 
[| makeresults 
    | eval connection="paris_r22" 
    | eval value="81" ] 
[| makeresults 
    | eval connection="paris_r23" 
    | eval value="81" ] 
| table connection value`,refresh:"14s",queryParameters:{earliest:"-24h@h",latest:"now"}},name:"svg_hex_asia"},ds_wTbPM0W2:{type:"ds.search",options:{query:`| makeresults 
| eval connection="eu1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="eu2" 
    | eval value=(random() % 25) ] 
| append 
    [| makeresults 
    | eval connection="eu3" 
    | eval value=(random() % 45) ] 
| append 
    [| makeresults 
    | eval connection="eu4" 
    | eval value=(random() % 85) ] 
| append 
    [| makeresults 
    | eval connection="eu5" 
    | eval value="20" ] 
| append 
    [| makeresults 
    | eval connection="eu6" 
    | eval value=(random() % 25) ] 
| append 
    [| makeresults 
    | eval connection="eu7" 
    | eval value="30" ] 
| append 
    [| makeresults 
    | eval connection="eu8" 
    | eval value=(random() % 85) ] 
| append 
    [| makeresults 
    | eval connection="eu9" 
    | eval value="40" ] 
| table connection value`,refresh:"37",queryParameters:{earliest:"-15m",latest:"now"}},name:"svg_eu_hex"},ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j:{type:"ds.search",options:{query:`| makeresults 
| eval connection="db1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="db2" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db3" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db4" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db5" 
    | eval value="100" ] 
| append 
    [| makeresults 
    | eval connection="db6" 
    | eval value="0" ] 
| table connection value`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"svg_databar4"},ds_gJTl2haQ:{type:"ds.search",options:{query:`| makeresults 1 
| eval rand=(random() % 100) + 30`,refresh:"15s",queryParameters:{earliest:"-15m",latest:"now"}},name:"static_30"},ds_8FuiQF3X:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| stats count by host`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"donut_static1"},ds_sB9ko3Hp_ds_Gr9vlHdv_ds_kSWvmiN8:{type:"ds.search",options:{query:`| stats count
| eval count=100`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"static_100"},ds_5M2VSpae_ds_5LZFWQm5_ds_t3tyfKVl_ds_gJTl2haQ:{type:"ds.search",options:{query:`| makeresults 1 
| eval rand=(random() % 50) + 5`,refresh:"31s",queryParameters:{earliest:"-15m",latest:"now"}},name:"static_36"},ds_MRiCbOnE_ds_zlqXm5hn:{type:"ds.search",options:{query:`| makeresults 1 
| eval core="used" 
| eval count=(random() % 100) + 30 
| append 
    [| makeresults 1 
    | eval core="unused" 
    | eval count=(random() % 100) + 30] 
| fields core count`,refresh:"31s",queryParameters:{earliest:"-15m",latest:"now"}},name:"pie1"},ds_7DKwHTwB_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of svg_node_hex"},ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j:{type:"ds.search",options:{query:`| makeresults 
| eval connection="db1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="db2" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db3" 
    | eval value=(random() % 100)] 
| append 
    [| makeresults 
    | eval connection="db4" 
    | eval value=0] 
| append 
    [| makeresults 
    | eval connection="db5" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db6" 
    | eval value="0" ] 
| streamstats window=1 current=f last(value) as prev_value 
| eval value=if(connection="db4",if(prev_value<50,100,0),if(connection="db3",if(value>50,100,0),value)) 
| table connection value`,refresh:"17s",queryParameters:{earliest:"-15m",latest:"now"}},name:"svg_databar3"},ds_vjB24jfv_ds_9aLOivaD_ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j:{type:"ds.search",options:{query:`| makeresults 
| eval connection="db1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="db2" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db3" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db4" 
    | eval value="100" ] 
| append 
    [| makeresults 
    | eval connection="db5" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db6" 
    | eval value="0" ] 
| table connection value`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"svg_databar6"},ds_p4lS4L3l_ds_4mOwD3RM:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host=host8
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,refresh:"5s",queryParameters:{earliest:"-15m",latest:"now"}},name:"active_system_users"},ds_zlqXm5hn:{type:"ds.search",options:{query:`| makeresults 1 
| eval core="used" 
| eval count=(random() % 100) + 30 
| append 
    [| makeresults 1 
    | eval core="unused" 
    | eval count=(random() % 100) + 30] 
| fields core count`,refresh:"23s",queryParameters:{earliest:"-15m",latest:"now"}},name:"pie2"},ds_WybbeCbD_ds_MRiCbOnE_ds_zlqXm5hn:{type:"ds.search",options:{query:`| makeresults 1 
| eval core="used" 
| eval count=(random() % 100) + 30 
| append 
    [| makeresults 1 
    | eval core="unused" 
    | eval count=(random() % 100) + 30] 
| fields core count`,refresh:"27s",queryParameters:{earliest:"-15m",latest:"now"}},name:"pie3"},ds_LdOni4XJ_ds_K3I9yf4j:{type:"ds.search",options:{query:`| makeresults 
| eval connection="db1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="db2" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db3" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db4" 
    | eval value="100" ] 
| append 
    [| makeresults 
    | eval connection="db5" 
    | eval value="0" ] 
| append 
    [| makeresults 
    | eval connection="db6" 
    | eval value="0" ] 
| table connection value`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"svg_databar2"},ds_TH5kj20P:{type:"ds.search",options:{query:`| makeresults 
| eval connection="a1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="a2" 
    | eval value="5" ] 
| append 
    [| makeresults 
    | eval connection="a3" 
    | eval value="10" ] 
| append 
    [| makeresults 
    | eval connection="a4" 
    | eval value=(random() % 20) ] 
| append 
    [| makeresults 
    | eval connection="a5" 
    | eval value="20" ] 
| append 
    [| makeresults 
    | eval connection="a6" 
    | eval value=(random() % 35) ] 
| append 
    [| makeresults 
    | eval connection="a7" 
    | eval value="30" ] 
| append 
    [| makeresults 
    | eval connection="a8" 
    | eval value=(random() % 20)+81] 
| append 
    [| makeresults 
    | eval connection="a9" 
    | eval value="40" ] 
| append 
    [| makeresults 
    | eval connection="a10" 
    | eval value=(random() % 45) ] 
| append 
    [| makeresults 
    | eval connection="a11" 
    | eval value=(random() % 50) ] 
| table connection value`,refresh:"19s",queryParameters:{earliest:"-24h@h",latest:"now"}},name:"svg_hex_na"},ds_Ymry5Re3_ds_5igfRVhd:{type:"ds.search",options:{query:`| stats count
| eval count="A"`,queryParameters:{earliest:"-15m",latest:"now"}},name:"a1"},ds_kSWvmiN8:{type:"ds.search",options:{query:`| stats count
| eval count=55`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"static_55"},ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,queryParameters:{earliest:"-45m@m",latest:"now"}},name:"internal_timechart3"},ds_YG5eoOOK_ds_Gr9vlHdv_ds_kSWvmiN8:{type:"ds.search",options:{query:`| makeresults 1 
| eval rand=(random() % 20) + 50`,refresh:"7s",queryParameters:{earliest:"-5m@m",latest:"now"}},name:"static_70"},ds_Gr9vlHdv_ds_kSWvmiN8:{type:"ds.search",options:{query:`| stats count
| eval count=55`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of static_55"},ds_n0IOFPlX:{type:"ds.search",options:{query:`| makeresults 
| eval connection="sa_1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="sa_2" 
    | eval value="5" ] 
| append 
    [| makeresults 
    | eval connection="sa_3" 
    | eval value="10" ] 
| append 
    [| makeresults 
    | eval connection="sa_4" 
    | eval value="15" ] 
| append 
    [| makeresults 
    | eval connection="sa_5" 
    | eval value="20" ] 
| append 
    [| makeresults 
    | eval connection="sa_6" 
    | eval value="25" ] 
| append 
    [| makeresults 
    | eval connection="sa_7" 
    | eval value="30" ] 
| append 
    [| makeresults 
    | eval connection="sa_8" 
    | eval value="35" ] 
| append 
    [| makeresults 
    | eval connection="sa_9" 
    | eval value="40" ] 
| append 
    [| makeresults 
    | eval connection="sa_10" 
    | eval value="43" ] 
| table connection value`,queryParameters:{earliest:"-24h@h",latest:"now"}},name:"svg_hex_sa"},ds_naxkbXCC_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value=(random() % 20) + 80
| table connection value`,refresh:"13s",queryParameters:{earliest:"-60m@m",latest:"now"}},name:"svg_node_hex_q3"},ds_LV8ElDGY_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of svg_node_hex"},ds_ly041xXI:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| head 1
| fields bytes_in`,queryParameters:{earliest:"-15m",latest:"now"}},name:"single_event"},ds_cZxRAbtR:{type:"ds.search",options:{query:`| makeresults 
| eval connection="a1" 
| eval value="0" 
| append 
    [| makeresults 
    | eval connection="a2" 
    | eval value=(random() % 20) ] 
| append 
    [| makeresults 
    | eval connection="a3" 
    | eval value="10" ] 
| append 
    [| makeresults 
    | eval connection="a4" 
    | eval value=(random() % 30) ] 
| append 
    [| makeresults 
    | eval connection="a5" 
    | eval value="20" ] 
| append 
    [| makeresults 
    | eval connection="a6" 
    | eval value=(random() % 45) ] 
| append 
    [| makeresults 
    | eval connection="a7" 
    | eval value="30" ] 
| table connection value`,queryParameters:{earliest:"-15m",latest:"now"}},name:"svg_hex_a"},ds_BER1tyDl:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| chart count as "Total" by host `,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"table1"},ds_12ld9SDe_ds_1jrijlbw_ds_Gr9vlHdv_ds_kSWvmiN8:{type:"ds.search",options:{query:`| stats count
| eval count=98`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of static_98"},ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"svg_node_hex"},ds_AVGHBbwj_ds_WybbeCbD_ds_MRiCbOnE_ds_zlqXm5hn:{type:"ds.search",options:{query:`| makeresults 1 
| eval core="used" 
| eval count=(random() % 100) + 30 
| append 
    [| makeresults 1 
    | eval core="unused" 
    | eval count=(random() % 100) + 30] 
| fields core count`,refresh:"19s",queryParameters:{earliest:"-15m",latest:"now"}},name:"pie4"},ds_ZuX7Gw1d_ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime by host`,refresh:"13s",queryParameters:{earliest:"-5m@m",latest:"now"}},name:"internal_timechart5"},ds_9J08owpb_ds_4mOwD3RM:{type:"ds.search",options:{query:`| inputlookup firewall_example.csv
| search host= host8
| eval myTime=strftime(timestamp,"%H:%M")
| chart count over myTime`,refresh:"4s",queryParameters:{earliest:"-15m@m",latest:"now"}},name:"internal_timechart4"},ds_GU2vAA0o_ds_4PRjLIiF_ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of Copy of Copy of Copy of Copy of Copy of Copy of svg_node_hex"},ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE:{type:"ds.search",options:{query:`| makeresults 
| eval connection="node" 
| eval value="55" 
| table connection value`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Copy of Copy of Copy of Copy of Copy of svg_node_hex"}},inputs:{},description:"",title:"",defaults:{visualizations:{global:{showLastUpdated:!1}}},visualizations:{viz_sIf95Tb5:{dataSources:{primary:"ds_cZxRAbtR"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="88.784" height="84.146" version="1.1" viewBox="0 0 88.784 84.146" xmlns="http://www.w3.org/2000/svg">
 <path id="a1" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".6"/>
 <path id="a2" d="m33.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".6"/>
 <path id="a3" d="m21.892 20 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".6"/>
 <path id="a4" d="m44.892 20 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
 <path id="a5" d="m67.892 20 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
 <path id="a6" d="m78.392 40 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
 <path id="a7" d="m67.934 60.146 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{from:97,value:"#ff0000"},{to:97,from:90,value:"#0066cc"},{to:90,from:80,value:"#0080ff"},{to:80,from:60,value:"#3399ff"},{to:60,from:40,value:" #66b3ff"},{to:40,from:20,value:"#99ccff"},{to:20,from:1,value:"#cce6ff"},{to:1,value:"#ffffff"}]}},viz_EV1Y5qww:{type:"splunk.ellipse",options:{strokeDashStyle:18,strokeColor:"#33bbff",strokeWidth:5,strokeOpacity:.5,fillColor:"transparent"}},viz_QKDdj8id:{type:"splunk.column",dataSources:{primary:"ds_t3tyfKVl_ds_gJTl2haQ"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,yAxisLabelVisibility:"hide",yAxisMin:"0",xAxisTitleVisibility:"hide",xAxisLabelVisibility:"hide",yAxisMax:"100",backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#0088cc"]}},viz_b23IgSkE:{type:"splunk.singlevalue",options:{unit:"",backgroundColor:"transparent"},dataSources:{primary:"ds_sB9ko3Hp_ds_Gr9vlHdv_ds_kSWvmiN8"}},viz_mcsq3kL2:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_NfXWgTYJ:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.1,fillColor:"#0088cc"}},viz_C0bdjoEh:{type:"splunk.image",options:{src:"splunk-enterprise-kvstore://5ed86eed8cd259128c00648e",preserveAspectRatio:!0}},viz_YTvabR1d:{type:"splunk.map",options:{backgroundColor:"transparent",layers:[{type:"choropleth",source:"geo://default/world",dataColors:"> areaValues | gradient(fillGradientContext)",choroplethEmptyAreaColor:"#33bbff",choroplethOpacity:1}],showScale:!1,showBaseLayer:!1,showZoomControls:!1,center:[47.80899767958027,7.746988590389492],zoom:.09101476206226103},context:{fillGradientContext:{colors:"> themes.defaultGradientMigrationConfig"}},showProgressBar:!1,showLastUpdated:!1},viz_t53L4VQd:{type:"splunk.markdown",options:{markdown:"### C2",fontColor:"#b3e6ff"}},viz_Vspwksmy:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_JEzI4LOy:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_GG3R2xOI:{type:"splunk.column",dataSources:{primary:"ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,xAxisTitleVisibility:"hide",backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#0088cc"]}},viz_OV5psMdg:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_qVNyrQks:{type:"splunk.markdown",options:{markdown:"### Active System Users",fontColor:"#33bbff"}},viz_G2fCsbYR:{type:"abslayout.line",options:{strokeColor:"#66ccff",strokeOpacity:.5}},viz_FeM9ednf:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_f7aJsz57:{type:"splunk.ellipse",options:{strokeDashStyle:36,strokeWidth:8,strokeOpacity:.5,strokeColor:"#33bbff",fillOpacity:.1,fillColor:"transparent"}},viz_y63gHBJQ:{type:"splunk.markdown",options:{markdown:"### Critical Data Pipeline Health",fontColor:"#33bbff"}},viz_uZZDJlvW:{type:"splunk.markdown",options:{markdown:"## 4",fontColor:"#708794",fontWeight:"bold"}},viz_ARoZ9X0D:{type:"splunk.ellipse",options:{strokeDashStyle:10,strokeColor:"#33bbff",fillOpacity:.05,strokeOpacity:.25,fillColor:"#708794"}},viz_HVLWvNFL:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.1,fillColor:"#0088cc"}},viz_BMVD7bC6:{type:"abslayout.line",options:{strokeDashStyle:2,toArrow:!0,strokeColor:"#66ccff",strokeWidth:2}},viz_qyuN6qhp:{dataSources:{primary:"ds_naxkbXCC_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"}},viz_ulJpSHdq:{type:"splunk.pie",dataSources:{primary:"ds_zlqXm5hn"},options:{labelDisplay:"off",backgroundColor:"transparent",seriesColors:["#00264d","#33bbff"]},context:{}},viz_1rAl4iVq:{type:"splunk.markdown",options:{markdown:"### 100",fontColor:"#708794"}},viz_21HfURZa:{type:"splunk.line",dataSources:{primary:"ds_ZuX7Gw1d_ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,xAxisTitleVisibility:"hide",backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#0088cc","#33bbff","#66ccff","#b3e6ff"],xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide"}},viz_lvYO5IPZ:{type:"splunk.ellipse",options:{strokeColor:"#b3e6ff",fillOpacity:.1,strokeOpacity:.7,fillColor:"transparent"}},viz_by8rcE0y:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.2}},viz_Btj2RVCw:{type:"splunk.singlevalueicon",options:{showValue:!1,iconOpacity:.15,iconColor:"#33bbff",icon:"splunk-enterprise-kvstore://5e14b52f8cd2594970000d81"}},viz_GbsuVoKg:{type:"abslayout.line",options:{strokeColor:"#0088cc"}},viz_EqgluBzX:{type:"splunk.ellipse",options:{strokeDashStyle:18,strokeColor:"#33bbff",strokeWidth:5,strokeOpacity:.5,fillColor:"transparent"}},viz_Tt6TgwHy:{type:"splunk.ellipse",options:{strokeDashStyle:18,strokeColor:"#33bbff",strokeWidth:5,strokeOpacity:.5,fillColor:"transparent"}},viz_a8S6Lvec:{type:"abslayout.line",options:{strokeDashStyle:35,strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.1}},viz_Ym49tZf8:{type:"abslayout.line",options:{strokeColor:"#0088cc"}},viz_wb4pGRUw:{type:"splunk.markdown",options:{markdown:"## 3",fontColor:"#708794",fontWeight:"bold"}},viz_15yZLk8g:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_QBOJQAqY:{type:"splunk.pie",dataSources:{primary:"ds_WybbeCbD_ds_MRiCbOnE_ds_zlqXm5hn"},options:{labelDisplay:"off",backgroundColor:"transparent",seriesColors:["#00264d","#33bbff"]},context:{}},viz_VnOxKmnP:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_TvjAKCqY:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.25}},viz_GRVOuukr:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_wsmZ7jdF:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_0nCUGDQl:{type:"splunk.singlevalue",options:{backgroundColor:"transparent",majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('count')"},dataSources:{primary:"ds_Ymry5Re3_ds_5igfRVhd"},context:{}},viz_uA2bjn0O:{type:"splunk.markdown",options:{markdown:"###  Q7",fontColor:"#ffffff"}},viz_7v2IYYLR:{type:"splunk.rectangle",options:{strokeColor:"#0088cc",fillOpacity:.15,strokeOpacity:.3,fillColor:"#0088cc"}},viz_PzLEUJlk:{type:"splunk.column",dataSources:{primary:"ds_5LZFWQm5_ds_t3tyfKVl_ds_gJTl2haQ"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,yAxisLabelVisibility:"hide",yAxisMin:"0",xAxisTitleVisibility:"hide",xAxisLabelVisibility:"hide",yAxisMax:"100",backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#0088cc"]}},viz_bcYB40so:{type:"splunk.ellipse",options:{strokeDashStyle:7,strokeColor:"#708794",fillOpacity:.1,strokeOpacity:.5,fillColor:"#0877a6"}},viz_yiCqSoO9:{type:"splunk.ellipse",options:{strokeDashStyle:36,strokeWidth:8,strokeOpacity:.5,strokeColor:"#33bbff",fillOpacity:.1,fillColor:"transparent"}},viz_TiWGtwBO:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_cTLpV26P:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_Olf8hwzh:{type:"splunk.ellipse",options:{strokeDashStyle:7,strokeColor:"#708794",fillOpacity:.1,strokeOpacity:.5,fillColor:"#0877a6"}},viz_mGZEEK45:{type:"splunk.markdown",options:{markdown:"###  Q11",fontColor:"#ffffff"}},viz_HIplJpkY:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_NZkAjyyO:{dataSources:{primary:"ds_TH5kj20P"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   inkscape:version="1.1-dev (48d18c81, 2020-07-08)"
   sodipodi:docname="ahex.svg"
   viewBox="0 0 88.783997 84.146248"
   version="1.1"
   height="84.146248"
   width="88.783997"
   id="svg4835">
  <defs
     id="defs22" />
  <sodipodi:namedview
     inkscape:current-layer="svg4835"
     inkscape:window-maximized="0"
     inkscape:window-y="23"
     inkscape:window-x="0"
     inkscape:cy="24.549001"
     inkscape:cx="23.650867"
     inkscape:zoom="1.6701291"
     showgrid="false"
     id="namedview20"
     inkscape:window-height="594"
     inkscape:window-width="885"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0"
     guidetolerance="10"
     gridtolerance="10"
     objecttolerance="10"
     borderopacity="1"
     bordercolor="#666666"
     pagecolor="#ffffff" />
  <path
     inkscape:label="a1"
     opacity="0.6"
     fill="#b3b3b3"
     d="M 10.392,0 20.784,6 V 18 L 10.392,24 0,18 V 6 Z"
     id="a1" />
  <path
     inkscape:label="a2"
     opacity="0.6"
     fill="#b3b3b3"
     d="M 33.392,0 43.784,6 V 18 L 33.392,24 23,18 V 6 Z"
     id="a2" />
  <path
     inkscape:label="a3"
     opacity="0.6"
     fill="#b3b3b3"
     d="m 21.892,20 10.392,6 V 38 L 21.892,44 11.5,38 V 26 Z"
     id="a3" />
  <path
     inkscape:label="a4"
     opacity="0.5"
     fill="#b3b3b3"
     d="m 44.892,20 10.392,6 V 38 L 44.892,44 34.5,38 V 26 Z"
     id="a4" />
  <path
     inkscape:label="a5"
     opacity="0.5"
     fill="#b3b3b3"
     d="m 67.892,20 10.392,6 V 38 L 67.892,44 57.5,38 V 26 Z"
     id="a5" />
  <path
     inkscape:label="a6"
     opacity="0.5"
     fill="#b3b3b3"
     d="m 78.392,40 10.392,6 V 58 L 78.392,64 68,58 V 46 Z"
     id="a6" />
  <path
     inkscape:label="a7"
     id="a7"
     d="m 67.934027,60.146249 10.391998,6 V 78.14625 l -10.391998,6 -10.392,-6 V 66.146249 Z"
     fill="#b3b3b3"
     opacity="0.5" />
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{from:97,value:"#ff0000"},{to:97,from:90,value:"#0066cc"},{to:90,from:80,value:"#0080ff"},{to:80,from:60,value:"#3399ff"},{to:60,from:40,value:" #66b3ff"},{to:40,from:20,value:"#99ccff"},{to:20,from:1,value:"#cce6ff"},{to:1,value:"#ffffff"}]}},viz_mCOgkGUL:{type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 203.556 203.556" style="enable-background:new 0 0 203.556 203.556;" xml:space="preserve">
<g>
	<path fill="#33bbff" fill-opacity="0.75" d="M201.359,137.3l-43.831-43.831l11.453-11.452c1.407-1.407,2.197-3.314,2.197-5.304c0-1.989-0.79-3.896-2.197-5.304
		l-36.835-36.834c-2.929-2.928-7.677-2.928-10.606,0l-11.452,11.452L66.253,2.196c-2.93-2.928-7.678-2.928-10.606,0L18.813,39.03
		c-2.929,2.93-2.929,7.678,0,10.607l43.831,43.831l-11.453,11.452c-1.407,1.407-2.197,3.314-2.197,5.304s0.79,3.896,2.197,5.304
		l36.837,36.836c1.464,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.303-2.196l11.453-11.453l43.83,43.83
		c1.465,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.303-2.196l36.835-36.834c1.407-1.407,2.197-3.314,2.197-5.304
		C203.556,140.614,202.766,138.707,201.359,137.3z M34.723,44.334L60.95,18.107l38.53,38.526L82.314,73.799l-9.063,9.063
		L34.723,44.334z M93.331,136.454l-26.23-26.229l11.448-11.447c0.002-0.002,0.003-0.003,0.005-0.005l12.443-12.443l35.845-35.844
		l26.229,26.228l-11.446,11.446c-0.003,0.003-0.005,0.005-0.007,0.007l-18.417,18.418L93.331,136.454z M159.221,168.831
		l-38.527-38.526l26.229-26.229l38.527,38.527L159.221,168.831z"/>
	<path fill="#33bbff" fill-opacity="0.75" d="M72.344,188.555c-15.317,0.001-29.717-5.964-40.548-16.795C20.965,160.929,15,146.528,15,131.211
		c0-4.143-3.358-7.5-7.5-7.5c-4.143,0-7.5,3.358-7.5,7.5c0,19.324,7.526,37.491,21.189,51.155
		c13.663,13.664,31.829,21.189,51.152,21.189c0.001,0,0.002,0,0.004,0c4.142,0,7.499-3.358,7.499-7.5
		C79.845,191.912,76.486,188.555,72.344,188.555z"/>
	<path fill="#33bbff" fill-opacity="0.75" d="M69.346,174.133c4.142,0,7.5-3.357,7.5-7.5c0-4.143-3.358-7.5-7.5-7.5c-6.658,0-12.916-2.593-17.624-7.3
		c-4.707-4.707-7.299-10.965-7.299-17.622c0-4.142-3.357-7.5-7.5-7.5h0c-4.142,0-7.5,3.358-7.5,7.5
		c-0.001,10.663,4.152,20.688,11.693,28.229C48.656,169.981,58.682,174.133,69.346,174.133z"/>
</g>
</svg>
`,backgroundColor:"transparent"}},viz_4yqBRUON:{type:"abslayout.line",options:{strokeDashStyle:35,strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.1}},viz_BM4xfo3I:{type:"splunk.rectangle",options:{strokeDashStyle:5,strokeColor:"#66ccff",strokeOpacity:.3,fillColor:"transparent"}},viz_CQQ7loyQ:{type:"splunk.markdown",options:{markdown:"## S2",fontColor:"#66ccff"}},viz_hNtqEHCb:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.25}},viz_AezuELDn:{type:"splunk.singlevalue",options:{unit:"",backgroundColor:"transparent"},dataSources:{primary:"ds_sB9ko3Hp_ds_Gr9vlHdv_ds_kSWvmiN8"}},viz_sqJOaVzX:{type:"abslayout.line",options:{strokeDashStyle:35,strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.1}},viz_LbpEvJgf:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_yCFtpE3o:{type:"abslayout.line",options:{strokeColor:"#66ccff",strokeOpacity:.5}},viz_fNTgm0Gc:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_z0Gyge4R:{dataSources:{primary:"ds_7DKwHTwB_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_5TaScyYS:{type:"splunk.ellipse",options:{strokeDashStyle:7,strokeColor:"#708794",fillOpacity:.1,strokeOpacity:.5,fillColor:"#0877a6"}},viz_AL3TzuFa:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_lT0gwkfq:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.1,fillColor:"#33bbff"}},viz_u6cNobrl:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.1,fillColor:"#66ccff"}},viz_UZOQVsy6:{type:"abslayout.line",options:{strokeDashStyle:2,toArrow:!0,strokeColor:"#66ccff",strokeWidth:2}},viz_dQROxn4T:{type:"splunk.ellipse",options:{strokeDashStyle:18,strokeColor:"#33bbff",strokeWidth:5,strokeOpacity:.5,fillColor:"transparent"}},viz_h2VV6El0:{dataSources:{primary:"ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="121.4" height="6.3294" version="1.1" viewBox="0 0 121.4 6.3294" xmlns="http://www.w3.org/2000/svg">
 <rect id="db1" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db2" x="20.566" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db3" x="41.132" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db4" x="61.698" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db5" x="82.265" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db6" x="102.83" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
</svg>
`,areaIds:"> primary | seriesByIndex('0')",areaValues:"> primary | seriesByName('value')",backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{value:"#00264D",to:50},{value:"#33BBFF",from:50}]}},viz_ibCByW9o:{type:"splunk.pie",dataSources:{primary:"ds_MRiCbOnE_ds_zlqXm5hn"},options:{labelDisplay:"off",backgroundColor:"transparent",seriesColors:["#00264d","#33bbff"]},context:{}},viz_NMDEFxaA:{type:"splunk.ellipse",options:{strokeColor:"#33bbff",strokeOpacity:.5,fillColor:"#000000"}},viz_2htvDkYe:{type:"abslayout.line",options:{strokeColor:"#0088cc"}},viz_1pRdFSJz:{dataSources:{primary:"ds_05OuPp9z_ds_7DKwHTwB_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_HuPqUNE5:{dataSources:{primary:"ds_xVHKdWls"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="66.784" height="34" version="1.1" viewBox="0 0 66.784 34" xmlns="http://www.w3.org/2000/svg">
 <path id="aus1" d="m10.392 10 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".6"/>
 <path id="aus2" d="m33.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
 <path id="aus3" d="m56.392 10 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{from:97,value:"#ff0000"},{to:97,from:90,value:"#0066cc"},{to:90,from:80,value:"#0080ff"},{to:80,from:60,value:"#3399ff"},{to:60,from:40,value:" #66b3ff"},{to:40,from:20,value:"#99ccff"},{to:20,from:1,value:"#cce6ff"},{to:1,value:"#ffffff"}]}},viz_Y57OEsIu:{type:"splunk.singlevalueicon",options:{showValue:!1,iconOpacity:.25,iconColor:"#33bbff",icon:"splunk-enterprise-kvstore://5f6246da8cd2591230006ae5"}},viz_BxyD9XpO:{type:"splunk.markdown",options:{markdown:"###  Q4",fontColor:"#ffffff"}},viz_HqqCstaj:{type:"splunk.rectangle",options:{strokeDashStyle:5,strokeColor:"#66ccff",strokeOpacity:.3,fillColor:"transparent"}},viz_fR6nkCGs:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.1,fillColor:"#33bbff"}},viz_j2SjJ3wt:{type:"splunk.markdown",options:{markdown:"## 1",fontColor:"#708794",fontWeight:"bold"}},viz_x1oOgW40:{type:"splunk.pie",dataSources:{primary:"ds_AVGHBbwj_ds_WybbeCbD_ds_MRiCbOnE_ds_zlqXm5hn"},options:{labelDisplay:"off",backgroundColor:"transparent",seriesColors:["#00264d","#33bbff"]},context:{}},viz_bvDwIrVQ:{type:"splunk.markdown",options:{markdown:"### C1",fontColor:"#b3e6ff"}},viz_CCaHR3rU:{type:"splunk.markdown",options:{markdown:"###  Q3",fontColor:"#ffffff"}},viz_ZWgwX9NU:{type:"splunk.markdown",options:{markdown:"## 2",fontColor:"#708794",fontWeight:"bold"}},viz_w5f8wnaG:{type:"splunk.markdown",options:{markdown:"### Consortium Node Health Map",fontColor:"#33bbff"}},viz_1YLFM2at:{type:"splunk.table",options:{backgroundColor:"transparent",tableFormat:{rowBackgroundColors:"> table | seriesByIndex(0) | pick(tableRowBackgroundColorsByBackgroundColor)",headerBackgroundColor:"> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",rowColors:"> rowBackgroundColors | pick(tableRowColor)",headerColor:"#b3e6ff"},columnFormat:{"Current Stage":{rowColors:"> table | seriesByName('Current Stage') | pick(Current_StageRowColorsEditorConfig)"}},count:7},context:{tableRowColor:["#00a4fd"],Current_StageRowColorsEditorConfig:["transparent"]},dataSources:{primary:"ds_BER1tyDl"}},viz_co1mv2Rb:{type:"splunk.singlevalueicon",options:{showValue:!1,iconOpacity:.75,iconColor:"#33bbff",icon:"splunk-enterprise-kvstore://5ea104598cd259125c007812"}},viz_bNiWfv4N:{type:"abslayout.line",options:{strokeColor:"#66ccff",strokeOpacity:.5}},viz_W6vTW82E:{type:"splunk.rectangle",options:{strokeDashStyle:5,rx:25,strokeOpacity:.25,strokeColor:"#b3e6ff",fillOpacity:.25,fillColor:"#0088cc"}},viz_R8SmZxgD:{type:"splunk.line",dataSources:{primary:"ds_ZwpAzv1Z_ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",xAxisTitleVisibility:"hide",backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#0088cc"],xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide",showYMajorGridLines:!1}},viz_tU6fPEQk:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_1xZxZ7o0:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_papnG4FP:{type:"splunk.markdown",options:{markdown:"###  Q1",fontColor:"#ffffff"}},viz_VLx3CgNc:{type:"splunk.ellipse",options:{strokeColor:"#b3e6ff",fillOpacity:.1,strokeOpacity:.7,fillColor:"transparent"}},viz_8v42rIbQ:{type:"splunk.markdown",options:{markdown:"### Core Anomalies",fontColor:"#33bbff"}},viz_GzFW5NHt:{type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
	<g>
		<g>
			<path fill="#33bbff" fill-opacity="0.75" d="M224.246,204.098c9.394,0,17.011-7.616,17.011-17.011V165.54c0-9.394-7.616-17.011-17.011-17.011
				s-17.011,7.616-17.011,17.011v21.547C207.235,196.482,214.852,204.098,224.246,204.098z"/>
			<path fill="#33bbff" fill-opacity="0.75" d="M287.753,204.098c9.395,0,17.011-7.616,17.011-17.011V165.54c0-9.394-7.616-17.011-17.011-17.011
				s-17.011,7.616-17.011,17.011v21.547C270.742,196.482,278.358,204.098,287.753,204.098z"/>
			<path fill="#33bbff" fill-opacity="0.75" d="M224.246,301.626c9.394,0,17.011-7.616,17.011-17.011v-21.547c0-9.394-7.616-17.011-17.011-17.011
				s-17.011,7.616-17.011,17.011v21.547C207.235,294.01,214.852,301.626,224.246,301.626z"/>
			<path fill="#33bbff" fill-opacity="0.75" d="M287.753,301.626c9.395,0,17.011-7.616,17.011-17.011v-21.547c0-9.394-7.616-17.011-17.011-17.011
				s-17.011,7.616-17.011,17.011v21.547C270.742,294.01,278.358,301.626,287.753,301.626z"/>
			<path fill="#33bbff" fill-opacity="0.75" d="M494.989,411.241h-39.122v-30.112c20.574-7.081,35.403-26.617,35.403-49.565c0-28.901-23.512-52.414-52.414-52.414
				s-52.414,23.512-52.414,52.414c0,22.947,14.829,42.484,35.403,49.565v30.112h-59.533V83.748c0-9.394-7.616-17.011-17.011-17.011
				H166.697c-9.394,0-17.011,7.616-17.011,17.011v327.493H91.856v-30.112c20.574-7.081,35.403-26.617,35.403-49.565
				c0-28.901-23.512-52.414-52.414-52.414c-28.901,0-52.415,23.512-52.415,52.414c0,22.947,14.83,42.484,35.404,49.565v30.112
				H17.011C7.616,411.241,0,418.858,0,428.252s7.616,17.011,17.011,17.011h149.687h178.604h149.688
				c9.394,0,17.011-7.616,17.011-17.011S504.385,411.241,494.989,411.241z M74.845,349.956c-10.142,0-18.393-8.25-18.393-18.392
				c0-10.142,8.25-18.392,18.393-18.392c10.141,0,18.392,8.25,18.392,18.392C93.237,341.706,84.986,349.956,74.845,349.956z
				 M272.553,411.241h-31.404v-31.405h31.404V411.241z M328.292,411.241h-0.001h-21.716v-48.416c0-9.394-7.616-17.011-17.011-17.011
				h-65.426c-9.394,0-17.011,7.616-17.011,17.011v48.416h-23.418V100.759h144.582V411.241z M438.856,349.956
				c-10.141,0-18.392-8.25-18.392-18.392c0-10.142,8.25-18.392,18.392-18.392c10.142,0,18.392,8.25,18.392,18.392
				C457.248,341.706,448.998,349.956,438.856,349.956z"/>
		</g>
	</g>
</g>
</svg>
`,backgroundColor:"transparent"}},viz_TpMYEkB5:{type:"splunk.area",dataSources:{primary:"ds_rGSz2MYl_ds_4mOwD3RM"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,xAxisTitleVisibility:"hide",areaOpacity:.3,backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#33bbff"]}},viz_9Iq3Ho2c:{type:"splunk.markdown",options:{markdown:"# 39",fontColor:"#66ccff"}},viz_e7ryxnmM:{type:"splunk.markdown",options:{markdown:"## S3",fontColor:"#66ccff"}},viz_kK2mKdcM:{type:"splunk.area",dataSources:{primary:"ds_p4lS4L3l_ds_4mOwD3RM"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,xAxisTitleVisibility:"hide",areaOpacity:.3,backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#33bbff"]}},viz_CjXoU5p4:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.1,fillColor:"#b3e6ff"}},viz_irWsuA6a:{type:"splunk.area",dataSources:{primary:"ds_9J08owpb_ds_4mOwD3RM"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,xAxisTitleVisibility:"hide",areaOpacity:.3,backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#33bbff"],xAxisLabelVisibility:"hide",yAxisLabelVisibility:"hide",xAxisMajorTickVisibility:"hide"}},viz_BVqVoowS:{type:"splunk.rectangle",options:{strokeDashStyle:5,strokeColor:"#66ccff",strokeOpacity:.3,fillColor:"transparent"}},viz_JAaGxkEk:{type:"splunk.singlevalueicon",options:{showValue:!1,iconOpacity:.75,iconColor:"#33bbff",icon:"splunk-enterprise-kvstore://5ea105218cd259125c007815"}},viz_nJHV8lQR:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.25}},viz_0vIVqVO0:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_BsHAnYvJ:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.25}},viz_id0oWoXr:{type:"splunk.markdown",options:{markdown:"### C3",fontColor:"#b3e6ff"}},viz_J2bFCAuJ:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.25}},viz_mboIcjjc:{type:"abslayout.line",options:{strokeDashStyle:35,strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.1}},viz_3ZQhbQAx:{type:"splunk.markdown",options:{markdown:"### C4",fontColor:"#b3e6ff"}},viz_vOQ8XzHU:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_7K3blbjR:{type:"abslayout.line",options:{strokeDashStyle:35,strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.1}},viz_VRABYHOO:{type:"splunk.ellipse",options:{strokeColor:"#b3e6ff",fillOpacity:.1,strokeOpacity:.7,fillColor:"transparent"}},viz_WvHN3ekQ:{type:"splunk.rectangle",options:{strokeDashStyle:5,rx:25,strokeOpacity:.25,strokeColor:"#b3e6ff",fillOpacity:.15,fillColor:"#b3e6ff"}},viz_9YL9FZe4:{dataSources:{primary:"ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_Xk0YL63C:{type:"splunk.markdown",options:{markdown:"# 12",fontColor:"#66ccff"}},viz_wZTy8R1t:{type:"abslayout.line",options:{strokeDashStyle:10,strokeColor:"#ffffff",strokeOpacity:.25}},viz_OteP5baI:{type:"splunk.area",dataSources:{primary:"ds_4mOwD3RM"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,xAxisTitleVisibility:"hide",areaOpacity:.3,backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#33bbff"]}},viz_UjvrShg1:{type:"splunk.rectangle",options:{strokeColor:"#0088cc",fillOpacity:.15,strokeOpacity:.3,fillColor:"#0088cc"}},viz_33KGroRU:{type:"splunk.markdown",options:{markdown:"### Active",fontColor:"#33bbff"}},viz_caT0WJ1L:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_R7zbrn9I:{dataSources:{primary:"ds_4PRjLIiF_ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_5Eoltxfg:{type:"splunk.column",dataSources:{primary:"ds_5M2VSpae_ds_5LZFWQm5_ds_t3tyfKVl_ds_gJTl2haQ"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,yAxisLabelVisibility:"hide",yAxisMin:"0",xAxisTitleVisibility:"hide",xAxisLabelVisibility:"hide",yAxisMax:"100",backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#0088cc"]}},viz_NC3Gi3in:{type:"splunk.ellipse",options:{strokeDashStyle:7,strokeColor:"#708794",fillOpacity:.1,strokeOpacity:.5,fillColor:"#0877a6"}},viz_2zxg601S:{type:"splunk.ellipse",options:{strokeColor:"#b3e6ff",fillOpacity:.1,strokeOpacity:.7,fillColor:"transparent"}},viz_c3tSRD8A:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_k3DjBpKg:{type:"abslayout.line",options:{strokeColor:"#66ccff",strokeOpacity:.5}},viz_xUgE6oZl:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_d6PX1UnE:{dataSources:{primary:"ds_K3I9yf4j"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="121.4" height="6.3294" version="1.1" viewBox="0 0 121.4 6.3294" xmlns="http://www.w3.org/2000/svg">
 <rect id="db1" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db2" x="20.566" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db3" x="41.132" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db4" x="61.698" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db5" x="82.265" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db6" x="102.83" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
</svg>
`,areaIds:"> primary | seriesByIndex('0')",areaValues:"> primary | seriesByName('value')",backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{value:"#00264D",to:50},{value:"#33BBFF",from:50}]}},viz_6cNXiDrO:{type:"splunk.markdown",options:{markdown:"###  Q2",fontColor:"#ffffff"}},viz_ZsTaXxab:{dataSources:{primary:"ds_9aLOivaD_ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="121.4" height="6.3294" version="1.1" viewBox="0 0 121.4 6.3294" xmlns="http://www.w3.org/2000/svg">
 <rect id="db1" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db2" x="20.566" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db3" x="41.132" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db4" x="61.698" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db5" x="82.265" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db6" x="102.83" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
</svg>
`,areaIds:"> primary | seriesByIndex('0')",areaValues:"> primary | seriesByName('value')",backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{value:"#00264D",to:50},{value:"#33BBFF",from:50}]}},viz_lJkuUB1K:{type:"abslayout.line",options:{strokeColor:"#66ccff",strokeOpacity:.5}},viz_ZjOQtffW:{type:"abslayout.line",options:{strokeColor:"#0088cc"}},viz_M2TTZpbN:{dataSources:{primary:"ds_GU2vAA0o_ds_4PRjLIiF_ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_y4w96fPz:{dataSources:{primary:"ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_lQ2GdCle:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.25}},viz_rl34s5WJ:{type:"splunk.singlevalue",options:{unit:"",backgroundColor:"transparent"},dataSources:{primary:"ds_YG5eoOOK_ds_Gr9vlHdv_ds_kSWvmiN8"}},viz_ltMLfSPj:{type:"splunk.markdown",options:{markdown:"###  Q12",fontColor:"#ffffff"}},viz_ugEYd0eY:{type:"splunk.markdown",options:{markdown:"###  Q9",fontColor:"#ffffff"}},viz_Cw6atIW8:{type:"splunk.markdown",options:{markdown:"### Physical Spaces & Factories",fontColor:"#33bbff"}},viz_SNnGiWci:{dataSources:{primary:"ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="121.4" height="6.3294" version="1.1" viewBox="0 0 121.4 6.3294" xmlns="http://www.w3.org/2000/svg">
 <rect id="db1" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db2" x="20.566" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db3" x="41.132" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db4" x="61.698" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db5" x="82.265" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db6" x="102.83" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
</svg>
`,areaIds:"> primary | seriesByIndex('0')",areaValues:"> primary | seriesByName('value')",backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{value:"#00264D",to:50},{value:"#33BBFF",from:50}]}},viz_Xo1U1RE3:{type:"splunk.markdown",options:{markdown:"### Development Productivity",fontColor:"#33bbff"}},viz_S5HnNUQH:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_cOtK7dOj:{type:"splunk.markdown",options:{markdown:"## S1",fontColor:"#66ccff"}},viz_OQpOAgBs:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.1,fillColor:"#66ccff"}},viz_LBJFmfYX:{type:"splunk.markdown",options:{markdown:"###  Q6",fontColor:"#ffffff"}},viz_l6eKbtND:{type:"splunk.markdown",options:{markdown:"###  Q10",fontColor:"#ffffff"}},viz_za7b3qj3:{dataSources:{primary:"ds_yVqC7I0D"},type:"splunk.choropleth.svg",options:{svg:'<?xml version="1.0" encoding="UTF-8"?> <svg id="svg4835" width="128" height="124" version="1.1" viewBox="0 0 128 124" xmlns="http://www.w3.org/2000/svg">  <path id="paris_r20" d="M35 0L45.3923 6V18L35 24L24.6077 18V6L35 0Z" fill="#5746F6"/>  <path id="paris_r21" d="M58 0L68.3923 6V18L58 24L47.6077 18V6L58 0Z" fill="#304BEC" opacity=".6"/>  <path id="paris_r22" d="M81 0L91.3923 6V18L81 24L70.6077 18V6L81 0Z" fill="#304BEC" opacity=".6"/>  <path id="paris_r15" d="m23.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#304BEC" opacity=".6"/>  <path id="paris_r16" d="m46.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#304BEC" opacity=".6"/>  <path id="paris_r17" d="m69.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#C625FF"/>  <path id="paris_r18" d="m92.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#5746F6"/>  <path id="paris_r10" d="M12 40L22.3923 46V58L12 64L1.6077 58V46L12 40Z" fill="#304BEC" opacity=".6"/>  <path id="paris_r11" d="M35 40L45.3923 46V58L35 64L24.6077 58V46L35 40Z" fill="#5746F6"/>  <path id="paris_r12" d="M58 40L68.3923 46V58L58 64L47.6077 58V46L58 40Z" fill="#7D40FF"/>  <path id="paris_r13" d="M81 40L91.3923 46V58L81 64L70.6077 58V46L81 40Z" fill="#5746F6"/>  <path id="paris_r14" d="M104 40L114.392 46V58L104 64L93.6077 58V46L104 40Z" fill="#304BEC" opacity=".6"/>  <path id="paris_r6" d="m23.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#5746F6"/>  <path id="paris_r7" d="m46.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#C625FF"/>  <path id="paris_r8" d="m69.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#C625FF"/>  <path id="paris_r9" d="m92.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#304BEC" opacity=".6"/>  <path id="paris_r19" d="m115.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#304BEC" opacity=".6"/>  <path id="paris_r2" d="M35 80L45.3923 86V98L35 104L24.6077 98V86L35 80Z" fill="#304BEC" opacity=".6"/>  <path id="paris_r1" d="m23.5 100 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#304BEC" opacity=".6"/>  <path id="paris_r3" d="M58 80L68.3923 86V98L58 104L47.6077 98V86L58 80Z" fill="#304BEC" opacity=".6"/>  <path id="paris_r5" d="M104 80L114.392 86V98L104 104L93.6077 98V86L104 80Z" fill="#304BEC" opacity=".6"/>  <path id="paris_r4" d="M81 80L91.3923 86V98L81 104L70.6077 98V86L81 80Z" fill="#5746F6"/> </svg> ',backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{from:97,value:"#ff0000"},{to:97,from:90,value:"#0066cc"},{to:90,from:80,value:"#0080ff"},{to:80,from:60,value:"#3399ff"},{to:60,from:40,value:" #66b3ff"},{to:40,from:20,value:"#99ccff"},{to:20,from:1,value:"#cce6ff"},{to:1,value:"#ffffff"}]}},viz_3ypj3McP:{dataSources:{primary:"ds_wTbPM0W2"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="66.784" height="64" version="1.1" viewBox="0 0 66.784 64" xmlns="http://www.w3.org/2000/svg">
 <path id="eu1" d="m21.892 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
 <path id="eu2" d="m44.892 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
 <path id="eu3" d="m10.392 20 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
 <path id="eu4" d="m33.392 20 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
 <path id="eu5" d="m56.392 20 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#ccc" opacity=".5"/>
 <path id="eu6" d="m21.892 40 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
 <path id="eu7" d="m44.892 40 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{from:97,value:"#ff0000"},{to:97,from:90,value:"#0066cc"},{to:90,from:80,value:"#0080ff"},{to:80,from:60,value:"#3399ff"},{to:60,from:40,value:" #66b3ff"},{to:40,from:20,value:"#99ccff"},{to:20,from:1,value:"#cce6ff"},{to:1,value:"#ffffff"}]}},viz_o0JfSwvC:{type:"splunk.singlevalue",options:{majorValue:"> sparklineValues | lastPoint()",trendValue:"> sparklineValues | delta(-2)",sparklineValues:"> primary | seriesByName('count')",backgroundColor:"transparent"},dataSources:{primary:"ds_5igfRVhd"},context:{}},viz_kxJR2u7Y:{type:"splunk.markdown",options:{markdown:"# 26",fontColor:"#66ccff"}},viz_RCMvidCo:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_AFXN6vBD:{dataSources:{primary:"ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_tpHIgEUx:{dataSources:{primary:"ds_n0IOFPlX"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="128" height="124" version="1.1" viewBox="0 0 128 124" xmlns="http://www.w3.org/2000/svg">
 <path id="sa_1" d="M35 0L45.3923 6V18L35 24L24.6077 18V6L35 0Z" fill="#b3b3b3" opacity=".5"/>
 <path id="sa_2" d="M58 0L68.3923 6V18L58 24L47.6077 18V6L58 0Z" fill="#b3b3b3" opacity=".5"/>
 <path id="sa_3" d="m46.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#b3b3b3" opacity=".5"/>
 <path id="sa_4" d="m69.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#b3b3b3" opacity=".5"/>
 <path id="sa_5" d="m92.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#b3b3b3" opacity=".5"/>
 <path id="sa_6" d="M58 40L68.3923 46V58L58 64L47.6077 58V46L58 40Z" fill="#b3b3b3" opacity=".5"/>
 <path id="sa_7" d="M81 40L91.3923 46V58L81 64L70.6077 58V46L81 40Z" fill="#b3b3b3" opacity=".5"/>
 <path id="sa_8" d="m46.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#b3b3b3" opacity=".5"/>
 <path id="sa_9" d="m69.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z" fill="#b3b3b3" opacity=".5"/>
 <path id="sa_10" d="M35 80L45.3923 86V98L35 104L24.6077 98V86L35 80Z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{from:97,value:"#ff0000"},{to:97,from:90,value:"#0066cc"},{to:90,from:80,value:"#0080ff"},{to:80,from:60,value:"#3399ff"},{to:60,from:40,value:" #66b3ff"},{to:40,from:20,value:"#99ccff"},{to:20,from:1,value:"#cce6ff"},{to:1,value:"#ffffff"}]}},viz_py2Bu08r:{type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 297 297" style="enable-background:new 0 0 297 297;" xml:space="preserve">
<g>
	<path fill="#33bbff" fill-opacity="0.75" d="M166.264,259C166.267,259,166.262,259,166.264,259c24.646,0,50.552-6.369,71.899-18.432
		c2.737-1.547,4.594-4.283,5.019-7.398c0.425-3.115-0.631-6.25-2.855-8.473l-66.434-66.443c9.732-13.521,8.528-32.537-3.625-44.694
		c-12.152-12.152-31.166-13.356-44.686-3.623L59.151,43.495c-2.223-2.224-5.358-3.279-8.474-2.854
		c-3.115,0.425-5.854,2.282-7.399,5.02c-28.422,50.313-23.286,112.725,11.358,157.69l-40.393,79.091
		c-1.559,3.118-1.392,6.822,0.441,9.788c1.833,2.966,5.071,4.771,8.558,4.771h132.963c5.556,0,10.06-4.504,10.06-10.06V259z
		 M156.04,127.786c4.256,4.256,5.307,10.52,3.157,15.77l-18.919-18.923C145.527,122.482,151.788,123.532,156.04,127.786z
		 M146.145,276.88H39.518l29.003-58.015c21.534,20.814,48.478,34.097,77.624,38.509V276.88z M167.859,238.887
		c-0.002,0-0.006,0-0.008,0c-32.827-0.002-63.688-12.786-86.896-35.997c-35.689-35.695-45.609-89.648-26.126-135.261
		l161.364,161.385C200.996,235.501,184.521,238.887,167.859,238.887z"/>
	<path fill="#33bbff" fill-opacity="0.75" d="M153.607,73.852c31.08,0,56.366,25.289,56.367,56.375c0,5.556,4.505,10.06,10.06,10.06c5.557,0,10.061-4.505,10.061-10.06
		c-0.001-42.18-34.313-76.495-76.487-76.495c-5.556,0-10.059,4.504-10.059,10.06C143.548,69.347,148.052,73.852,153.607,73.852z"/>
	<path fill="#33bbff" fill-opacity="0.75" d="M153.607,0c-5.556,0-10.059,4.504-10.059,10.06c0,5.556,4.503,10.061,10.059,10.061
		c60.704,0.001,110.091,49.394,110.091,110.106c0,5.555,4.504,10.06,10.06,10.06c5.556,0,10.061-4.505,10.061-10.06
		C283.818,58.42,225.405,0.001,153.607,0z"/>
</g>
</svg>
`,backgroundColor:"transparent"}},viz_XHnq1xdZ:{type:"splunk.ellipse",options:{strokeDashStyle:36,strokeWidth:8,strokeOpacity:.5,strokeColor:"#33bbff",fillOpacity:.1,fillColor:"transparent"}},viz_YlO8L7gw:{type:"splunk.markdown",options:{markdown:"### System Core Status",fontColor:"#33bbff"}},viz_cwEdxiZv:{type:"splunk.ellipse",options:{strokeDashStyle:36,strokeWidth:8,strokeOpacity:.5,strokeColor:"#33bbff",fillOpacity:.1,fillColor:"transparent"}},viz_8f3mMXaR:{type:"splunk.singlevalueicon",options:{showValue:!1,iconOpacity:.15,iconColor:"#33bbff",icon:"splunk-enterprise-kvstore://5e14b52f8cd2594970000d81"}},viz_kW06KOQU:{dataSources:{primary:"ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_FpwNj5Td:{type:"splunk.column",dataSources:{primary:"ds_gJTl2haQ"},options:{yAxisAbbreviation:"off",y2AxisAbbreviation:"off",showRoundedY2AxisLabels:!1,legendTruncation:"ellipsisMiddle",showY2MajorGridLines:!0,yAxisLabelVisibility:"hide",yAxisMin:"0",xAxisTitleVisibility:"hide",xAxisLabelVisibility:"hide",yAxisMax:"100",backgroundColor:"transparent",yAxisTitleVisibility:"hide",legendDisplay:"off",seriesColors:["#0088cc"]}},viz_52R5i9Cn:{dataSources:{primary:"ds_23Y7IQ2F_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_VLqYQ7rf:{type:"splunk.rectangle",options:{strokeColor:"#0088cc",fillOpacity:.15,strokeOpacity:.3,fillColor:"#0088cc"}},viz_XA3upIJc:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_MKvNZCl8:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillOpacity:.1,fillColor:"#b3e6ff"}},viz_RdHDIpRO:{type:"abslayout.line",options:{strokeDashStyle:2,toArrow:!0,strokeColor:"#66ccff",strokeWidth:2}},viz_rTwXNiJg:{dataSources:{primary:"ds_vjB24jfv_ds_9aLOivaD_ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="121.4" height="6.3294" version="1.1" viewBox="0 0 121.4 6.3294" xmlns="http://www.w3.org/2000/svg">
 <rect id="db1" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db2" x="20.566" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db3" x="41.132" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db4" x="61.698" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db5" x="82.265" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db6" x="102.83" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
</svg>
`,areaIds:"> primary | seriesByIndex('0')",areaValues:"> primary | seriesByName('value')",backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{value:"#00264D",to:50},{value:"#33BBFF",from:50}]}},viz_wLbsP1FT:{type:"abslayout.line",options:{strokeColor:"#33bbff",strokeWidth:2,strokeOpacity:.25}},viz_Aac4QR5L:{type:"abslayout.line",options:{strokeDashStyle:35,strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.1}},viz_V4m4cqBS:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_oThM5Kp1:{type:"abslayout.line",options:{strokeColor:"#708794"}},viz_FkJwGPxc:{type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="188.176" y="88.158" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="239.898" y="88.158" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="291.631" y="88.158" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="188.176" y="138.836" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="239.898" y="138.836" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="291.631" y="138.836" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="188.176" y="189.513" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="239.898" y="189.513" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="291.631" y="189.513" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="188.176" y="240.191" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="239.898" y="240.191" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<rect fill="#33bbff" fill-opacity="0.75" x="291.631" y="240.191" width="32.193" height="32.193"/>
	</g>
</g>
<g>
	<g>
		<path fill="#33bbff" fill-opacity="0.75"  d="M460.727,455.199V155.355h-77.322V25.454H128.596v129.902H51.273v299.844H0v31.347h51.273h77.322h31.347h54.784h82.547
			h54.784h31.347h77.322H512v-31.347H460.727z M128.596,455.199H82.62V186.702h45.975V455.199z M265.927,455.199h-19.853v-68.208
			h19.853V455.199z M352.057,455.199h-54.784v-99.555h-82.547v99.555h-54.784V331.073h192.115V455.199z M352.057,155.354v144.37
			H159.943V155.355V56.801h192.115V155.354z M429.38,455.199h-45.975V186.702h45.975V455.199z"/>
	</g>
</g>
</svg>
`,backgroundColor:"transparent"}},viz_07lPI206:{type:"splunk.singlevalue",options:{unit:"",backgroundColor:"transparent"},dataSources:{primary:"ds_1jrijlbw_ds_Gr9vlHdv_ds_kSWvmiN8"}},viz_8qsaDMI2:{type:"splunk.rectangle",options:{strokeColor:"transparent",fillColor:"transparent"}},viz_tMWQNGqW:{type:"splunk.markdown",options:{markdown:"### Uplink Speed",fontColor:"#33bbff"}},viz_rkTwmxqy:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeOpacity:.2}},viz_I2Asq2kq:{type:"splunk.markdown",options:{markdown:"### Downlink Speed",fontColor:"#33bbff"}},viz_bmip44hU:{type:"splunk.markdown",options:{markdown:"###  Q5",fontColor:"#ffffff"}},viz_QySuhsxj:{type:"splunk.singlevalueicon",options:{showValue:!1,iconOpacity:.5,iconColor:"#33bbff",icon:"splunk-enterprise-kvstore://5e163f308cd25947b8002e0d"}},viz_iSgxizfn:{type:"splunk.markdown",options:{markdown:"### Core Component (Cx) Load",fontColor:"#33bbff"}},viz_m5HUgtFy:{dataSources:{primary:"ds_LdOni4XJ_ds_K3I9yf4j"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="121.4" height="6.3294" version="1.1" viewBox="0 0 121.4 6.3294" xmlns="http://www.w3.org/2000/svg">
 <rect id="db1" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db2" x="20.566" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db3" x="41.132" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db4" x="61.698" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db5" x="82.265" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
 <rect id="db6" x="102.83" width="18.566" height="6.3294" fill="#b3b3b3" opacity=".75"/>
</svg>
`,areaIds:"> primary | seriesByIndex('0')",areaValues:"> primary | seriesByName('value')",backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},context:{areaColorsEditorConfig:[{value:"#00264D",to:50},{value:"#33BBFF",from:50}]}},viz_oYZmhRdA:{type:"splunk.markdown",options:{markdown:"### Critical",fontColor:"#33bbff"}},viz_FUzdcnlC:{type:"abslayout.line",options:{strokeColor:"#66ccff",strokeOpacity:.5}},viz_6IqAXd9r:{type:"abslayout.line",options:{strokeColor:"#708794"}},viz_0GVJCycZ:{type:"abslayout.line",options:{strokeColor:"#0088cc",strokeWidth:2,strokeOpacity:.25}},viz_5XC93DLs:{type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
	<g>
		<path fill="#33bbff" fill-opacity="0.75"  d="M409.6,307.2H256c-14.14,0-25.6,11.46-25.6,25.6v25.6c0,14.14,11.46,25.6,25.6,25.6h153.6c14.14,0,25.6-11.46,25.6-25.6
			v-25.6C435.2,318.66,423.74,307.2,409.6,307.2z M409.6,358.4H256v-25.6h153.6V358.4z"/>
	</g>
</g>
<g>
	<g>
		<path fill="#33bbff" fill-opacity="0.75" d="M409.6,204.8H256c-14.14,0-25.6,11.46-25.6,25.6V256c0,14.14,11.46,25.6,25.6,25.6h153.6c14.14,0,25.6-11.46,25.6-25.6
			v-25.6C435.2,216.26,423.74,204.8,409.6,204.8z M409.6,256H256v-25.6h153.6V256z"/>
	</g>
</g>
<g>
	<g>
		<path fill="#33bbff" fill-opacity="0.75" d="M140.8,51.2H89.6c-7.074,0-12.8,5.726-12.8,12.8v51.2c0,7.074,5.726,12.8,12.8,12.8h51.2c7.074,0,12.8-5.726,12.8-12.8V64
			C153.6,56.926,147.874,51.2,140.8,51.2z M128,102.4h-25.6V76.8H128V102.4z"/>
	</g>
</g>
<g>
	<g>
		<path fill="#33bbff" fill-opacity="0.75" d="M243.2,51.2H192c-7.074,0-12.8,5.726-12.8,12.8v51.2c0,7.074,5.726,12.8,12.8,12.8h51.2c7.074,0,12.8-5.726,12.8-12.8V64
			C256,56.926,250.274,51.2,243.2,51.2z M230.4,102.4h-25.6V76.8h25.6V102.4z"/>
	</g>
</g>
<g>
	<g>
		<path fill="#33bbff" fill-opacity="0.75" d="M140.8,153.6H89.6c-7.074,0-12.8,5.726-12.8,12.8v51.2c0,7.074,5.726,12.8,12.8,12.8h51.2c7.074,0,12.8-5.726,12.8-12.8
			v-51.2C153.6,159.326,147.874,153.6,140.8,153.6z M128,204.8h-25.6v-25.6H128V204.8z"/>
	</g>
</g>
<g>
	<g>
		<path fill="#33bbff" fill-opacity="0.75" d="M140.8,256H89.6c-7.074,0-12.8,5.726-12.8,12.8V320c0,7.074,5.726,12.8,12.8,12.8h51.2c7.074,0,12.8-5.726,12.8-12.8
			v-51.2C153.6,261.726,147.874,256,140.8,256z M128,307.2h-25.6v-25.6H128V307.2z"/>
	</g>
</g>
<g>
	<g>
		<path fill="#33bbff" fill-opacity="0.75" d="M140.8,358.4H89.6c-7.074,0-12.8,5.726-12.8,12.8v51.2c0,7.074,5.726,12.8,12.8,12.8h51.2c7.074,0,12.8-5.726,12.8-12.8
			v-51.2C153.6,364.126,147.874,358.4,140.8,358.4z M128,409.6h-25.6V384H128V409.6z"/>
	</g>
</g>
<g>
	<g>
		<path fill="#33bbff" fill-opacity="0.75" d="M499.2,486.4h-12.8V179.2c0-14.14-11.46-25.6-25.6-25.6h-256c-14.14,0-25.6,11.46-25.6,25.6v307.2h-128V25.6h230.4V128
			h25.6V25.6c0-14.14-11.46-25.6-25.6-25.6H51.2C37.06,0,25.6,11.46,25.6,25.6v460.8H12.8c-7.074,0-12.8,5.726-12.8,12.8
			c0,7.074,5.726,12.8,12.8,12.8h486.4c7.074,0,12.8-5.726,12.8-12.8C512,492.126,506.274,486.4,499.2,486.4z M307.2,486.4H256
			v-51.2h51.2V486.4z M409.6,486.4H384v-51.2h25.6V486.4z M460.8,486.4h-25.6v-51.2c0-14.14-11.46-25.6-25.6-25.6H384
			c-14.14,0-25.6,11.46-25.6,25.6v51.2h-25.6v-51.2c0-14.14-11.46-25.6-25.6-25.6H256c-14.14,0-25.6,11.46-25.6,25.6v51.2h-25.6
			V179.2h256V486.4z"/>
	</g>
</g>
</svg>
`,backgroundColor:"transparent"}},viz_Ix6tLqHj:{type:"splunk.markdown",options:{markdown:"###  Q8",fontColor:"#ffffff"}},viz_fbU6ZSsd:{dataSources:{primary:"ds_LV8ElDGY_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_qxiUvjfi:{type:"abslayout.line",options:{strokeColor:"#66ccff",strokeOpacity:.5}},viz_4FsKZQAR:{type:"abslayout.line",options:{strokeColor:"#66ccff",strokeOpacity:.5}},viz_vHvy38CF:{dataSources:{primary:"ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"},type:"splunk.choropleth.svg",options:{svg:`<?xml version="1.0" encoding="UTF-8"?>
<svg id="svg4835" width="20.784" height="24" version="1.1" viewBox="0 0 20.784 24" xmlns="http://www.w3.org/2000/svg">
 <path id="node" d="m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z" fill="#b3b3b3" opacity=".5"/>
</svg>
`,backgroundColor:"transparent",areaColors:"> areaValues | rangeValue(areaColorsEditorConfig)"},encoding:{featureId:"primary[0]",value:"primary[1]",fillColor:{field:"primary[1]",format:{ranges:[{from:50,value:"#33bbff"},{to:50,from:0,value:"#00264d"}],type:"rangevalue"}}},context:{areaColorsEditorConfig:[{value:"#00264d",to:50},{value:"#33bbff",from:50}]}},viz_FCFXfCqE:{type:"splunk.singlevalueicon",options:{showValue:!1,iconOpacity:.75,iconColor:"#33bbff",icon:"data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjQzIiB2aWV3Qm94PSIwIDAgNjAgNDMiIHdpZHRoPSI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im0xMi4xMTE0IDkuMzM5MzRjMS45NTUgMCAzLjUzOTgtMS41ODQ4MyAzLjUzOTgtMy41Mzk4MyAwLTEuOTU0OTktMS41ODQ4LTMuNTM5ODMtMy41Mzk4LTMuNTM5ODNzLTMuNTM5ODIgMS41ODQ4NC0zLjUzOTgyIDMuNTM5ODNjMCAxLjk1NSAxLjU4NDgyIDMuNTM5ODMgMy41Mzk4MiAzLjUzOTgzem0wIDIuMTM2NjZjMy4xMzUgMCA1LjY3NjUtMi41NDE0NiA1LjY3NjUtNS42NzY0OSAwLTMuMTM1MDItMi41NDE1LTUuNjc2NDYzLTUuNjc2NS01LjY3NjQ2My0zLjEzNTAyIDAtNS42NzY0NiAyLjU0MTQ0My01LjY3NjQ2IDUuNjc2NDYzIDAgMy4xMzUwMyAyLjU0MTQ0IDUuNjc2NDkgNS42NzY0NiA1LjY3NjQ5em0tNi4xODg4OCAyLjcyNTNjLjg0ODk1LS41MzA2IDEuODI5OTItLjgxMTkgMi44MzEwNC0uODExOWg3LjIzODQ0Yy42OTk5IDAgMS4zOS4xMzc1IDIuMDMxOS40MDE2LS4xNTE3LjczNy0uMjM0NyAxLjQ5OTEtLjI0MTggMi4yNzk0bC0uMDkxNS0uMDU3MmMtLjUwOTQtLjMxODQtMS4wOTgtLjQ4NzItMS42OTg2LS40ODcyaC03LjIzODQ0Yy0uNjAwNjcgMC0xLjE4OTI2LjE2ODgtMS42OTg2Mi40ODcybC0zLjQxMTk3IDIuMTMyNWMtLjkzNzA3LjU4NTYtMS41MDYzMyAxLjYxMjctMS41MDYzMyAyLjcxNzd2Mi43NjIxYzAgLjU5LjQ3ODMgMS4wNjgzIDEuMDY4MzEgMS4wNjgzaDE2LjE5ODk1Yy4zNTMyIDAgLjY5MzEtLjA1NzEgMS4wMTA5LS4xNjI2LS4wNzI2LjA0MjQtLjE0NDUuMDg1OS0uMjE1OS4xMzA1bC0zLjQ3IDIuMTY4OGgtMTMuNTIzOTVjLTEuNzcwMDUgMC0zLjIwNDk1LTEuNDM0OS0zLjIwNDk1LTMuMjA1di0yLjc2MjFjMC0xLjg0MTcuOTQ4NzcxLTMuNTUzNSAyLjUxMDU1LTQuNTI5NnptMjkuMzMyNTggNi44ODAzdi4wMDA2Yy45OTI2LTEuMTUxMSAxLjY0MTktMi42MDY3IDEuNzg4Ny00LjIwNzYtLjAwMDIuMDAwMi0uMDAwNC4wMDA0LS4wMDA2LjAwMDUuMDIxLS4yMjg4LjAzMTctLjQ2MDcuMDMxNy0uNjk1MSAwLTQuMTQ3OC0zLjM2MjUtNy41MTAyNi03LjUxMDMtNy41MTAyNnMtNy41MTAzIDMuMzYyNDYtNy41MTAzIDcuNTEwMjZjMCA0LjE0NzkgMy4zNjI1IDcuNTEwMyA3LjUxMDMgNy41MTAzIDIuMjc0NyAwIDQuMzEzMi0xLjAxMTIgNS42OTA1LTIuNjA4N3ptMjEuNTQwNSA1Ljc0ODloLTEzLjY5ODdsLTMuNDctMi4xNjg4Yy0uNDAyNi0uMjUxNi0uODIzNy0uNDY4Mi0xLjI1ODctLjY0ODQuMDM2LS4wNDA0LjA3MTctLjA4MS4xMDcxLS4xMjE5LjU2NTIuNDk5NCAxLjMwNzkuODAyNCAyLjEyMTMuODAyNGgxNi4xOTljLjU5IDAgMS4wNjgzLS40NzgzIDEuMDY4My0xLjA2ODN2LTIuNzYyMWMwLTEuMTA1LS41NjkyLTIuMTMyMS0xLjUwNjMtMi43MTc3bC0zLjQxMi0yLjEzMjVjLS41MDkzLS4zMTg0LTEuMDk3OS0uNDg3Mi0xLjY5ODYtLjQ4NzJoLTcuMjM4NGMtLjYwMDcgMC0xLjE4OTIuMTY4OC0xLjY5ODYuNDg3MmwtLjk2OTIuNjA1N2MuMDA1My0uMTQ1Ny4wMDgtLjI5Mi4wMDgtLjQzOSAwLS42NzU0LS4wNTY4LTEuMzM3NS0uMTY2LTEuOTgxOS44NDc4LS41Mjg0IDEuODI2OC0uODA4NiAyLjgyNTgtLjgwODZoNy4yMzg0YzEuMDAxMSAwIDEuOTgyMS4yODEzIDIuODMxLjgxMTlsMy40MTIgMi4xMzI1YzEuNTYxOC45NzYxIDIuNTEwNiAyLjY4NzkgMi41MTA2IDQuNTI5NnYyLjc2MjFjMCAxLjc3LTEuNDM0OSAzLjIwNS0zLjIwNSAzLjIwNXptLTkuNDI5MS0xNy40OTExNmMxLjk1NSAwIDMuNTM5OC0xLjU4NDgzIDMuNTM5OC0zLjUzOTgzIDAtMS45NTQ5OS0xLjU4NDgtMy41Mzk4My0zLjUzOTgtMy41Mzk4M3MtMy41Mzk5IDEuNTg0ODQtMy41Mzk5IDMuNTM5ODNjMCAxLjk1NSAxLjU4NDkgMy41Mzk4MyAzLjUzOTkgMy41Mzk4M3ptMCAyLjEzNjY2YzMuMTM1IDAgNS42NzY0LTIuNTQxNDYgNS42NzY0LTUuNjc2NDkgMC0zLjEzNTAyLTIuNTQxNC01LjY3NjQ2My01LjY3NjQtNS42NzY0NjMtMy4xMzUxIDAtNS42NzY1IDIuNTQxNDQzLTUuNjc2NSA1LjY3NjQ2MyAwIDMuMTM1MDMgMi41NDE0IDUuNjc2NDkgNS42NzY1IDUuNjc2NDl6bS0yNC4zNTA1IDE2LjQ2NDZjLjMxNzktLjE5ODcuNjg1Mi0uMzA0IDEuMDYtLjMwNGgxMS42NzI2Yy4zNzQ5IDAgLjc0MjIuMTA1MyAxLjA2LjMwNGw3LjEyMDEgNC40NWMuNTg0OC4zNjU1Ljk0MDEgMS4wMDY1Ljk0MDEgMS42OTZ2Ny41MDY0YzAgLjU1MjMtLjQ0NzggMS0xIDFoLTI3LjkxMjljLS41NTIzIDAtMS0uNDQ3Ny0xLTF2LTcuNTA2NGMwLS42ODk1LjM1NTItMS4zMzA1Ljk0LTEuNjk2eiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+"}},viz_DxAQFJOO:{type:"splunk.rectangle",options:{strokeColor:"#0088cc",fillOpacity:.15,strokeOpacity:.3,fillColor:"#0088cc"}},viz_YeVME2W4:{type:"splunk.markdown",options:{markdown:"### Development Status",fontColor:"#33bbff"}},viz_jqLoXWp4:{type:"splunk.markdown",options:{markdown:`# Full Source 

\`\`\`json
{
  "dataSources": {
    "ds_9aLOivaD_ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"db1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"db2\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db3\\" \\n    | eval value=0] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db4\\" \\n    | eval value=0] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db5\\" \\n    | eval value=(random() % 100) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db6\\" \\n    | eval value=\\"0\\" ] \\n| streamstats window=1 current=f last(value) as prev_value \\n| eval value=if(connection=\\"db5\\",if(prev_value<50,100,0),if(connection=\\"db6\\",if(value>50,100,0),value)) \\n| table connection value",
        "refresh": "11s",
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        }
      },
      "name": "svg_databar5"
    },
    "ds_xVHKdWls": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"aus1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"aus2\\" \\n    | eval value=(random() % 20) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"aus3\\" \\n    | eval value=\\"10\\" ] \\n| table connection value",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "svg_aus_hex"
    },
    "ds_dT62rEjZ": {
      "type": "ds.search",
      "options": {
        "query": "| stats count\\n| eval count=1.1"
      },
      "name": "static_1.1"
    },
    "ds_4PRjLIiF_ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of Copy of Copy of Copy of Copy of Copy of svg_node_hex"
    },
    "ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of Copy of Copy of svg_node_hex"
    },
    "ds_5LZFWQm5_ds_t3tyfKVl_ds_gJTl2haQ": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1 \\n| eval rand=(random() % 70) + 10",
        "refresh": "21s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "static_11"
    },
    "ds_K3I9yf4j": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"db1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"db2\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db3\\" \\n    | eval value=(random() % 100)] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db4\\" \\n    | eval value=0] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db5\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db6\\" \\n    | eval value=\\"0\\" ] \\n| streamstats window=1 current=f last(value) as prev_value \\n| eval value=if(connection=\\"db4\\",if(prev_value<50,100,0),if(connection=\\"db3\\",if(value>50,100,0),value)) \\n| table connection value",
        "refresh": "13s",
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        }
      },
      "name": "svg_databar1"
    },
    "ds_ycdpkiAE_ds_YG5eoOOK_ds_Gr9vlHdv_ds_kSWvmiN8": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1 \\n| eval rand=(random() % 20) + 50",
        "refresh": "7s",
        "queryParameters": {
          "earliest": "-5m@m",
          "latest": "now"
        }
      },
      "name": "Copy of static_70"
    },
    "ds_t3tyfKVl_ds_gJTl2haQ": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1 \\n| eval rand=(random() % 80) + 15",
        "refresh": "17s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "static_19"
    },
    "ds_4mOwD3RM": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| eval myTime=strftime(timestamp,\\"%H:%M\\")\\n| chart count over myTime",
        "refresh": "5s",
        "queryParameters": {
          "earliest": "-1m@m",
          "latest": "now"
        }
      },
      "name": "internal_timechart1"
    },
    "ds_5igfRVhd": {
      "type": "ds.search",
      "options": {
        "query": "| stats count\\n| eval count=\\"P\\"",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "p1"
    },
    "ds_dk1hBs1O_ds_sB9ko3Hp_ds_Gr9vlHdv_ds_kSWvmiN8": {
      "type": "ds.search",
      "options": {
        "query": "| stats count\\n| eval count=100",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of static_100"
    },
    "ds_05OuPp9z_ds_7DKwHTwB_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of Copy of svg_node_hex"
    },
    "ds_1jrijlbw_ds_Gr9vlHdv_ds_kSWvmiN8": {
      "type": "ds.search",
      "options": {
        "query": "| stats count\\n| eval count=98",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "static_98"
    },
    "ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of Copy of svg_node_hex"
    },
    "ds_LSE0lqTu_ds_8FuiQF3X": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| eval myTime=strftime(timestamp,\\"%H:%M\\")\\n| chart count over myTime by host",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of donut_static1"
    },
    "ds_rGSz2MYl_ds_4mOwD3RM": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| eval myTime=strftime(timestamp,\\"%H:%M\\")\\n| chart count over myTime",
        "refresh": "9s",
        "queryParameters": {
          "earliest": "-5m@m",
          "latest": "now"
        }
      },
      "name": "internal_timechart2"
    },
    "ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of Copy of Copy of Copy of svg_node_hex"
    },
    "ds_ZwpAzv1Z_ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| search host = host18\\n| eval myTime=strftime(timestamp,\\"%H:%M\\")\\n| chart count over myTime",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "internal_timechart6"
    },
    "ds_neshfRKw_ds_vjB24jfv_ds_9aLOivaD_ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"db1\\" \\n| eval value=0\\n| append \\n    [| makeresults \\n    | eval connection=\\"db2\\" \\n    | eval value=(random() % 100)  ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db3\\" \\n    | eval value=0] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db4\\" \\n    | eval value=0] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db5\\" \\n    | eval value=0] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db6\\" \\n    | eval value=\\"0\\" ] \\n| streamstats window=1 current=f last(value) as prev_value \\n| eval value=if(connection=\\"db2\\",if(prev_value<50,100,0),if(connection=\\"db3\\",if(value>50,100,0),value)) \\n| table connection value",
        "refresh": "23s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "svg_databar7"
    },
    "ds_kwwC74KH_ds_dk1hBs1O_ds_sB9ko3Hp_ds_Gr9vlHdv_ds_kSWvmiN8": {
      "type": "ds.search",
      "options": {
        "query": "| stats count\\n| eval count=100",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of Copy of static_100"
    },
    "ds_23Y7IQ2F_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of svg_node_hex"
    },
    "ds_yVqC7I0D": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"paris_r1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r2\\" \\n    | eval value=\\"5\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r3\\" \\n    | eval value=\\"10\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r4\\" \\n    | eval value=\\"15\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r5\\" \\n    | eval value=\\"20\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r6\\" \\n    | eval value=(random() % 25) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r7\\" \\n    | eval value=\\"30\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r8\\" \\n    | eval value=\\"35\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r9\\" \\n    | eval value=\\"40\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r10\\" \\n    | eval value=(random() % 50) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r11\\" \\n    | eval value=\\"45\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r12\\" \\n    | eval value=(random() % 20)+80 ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r13\\" \\n    | eval value=\\"55\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r14\\" \\n    | eval value=(random() % 60) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r15\\" \\n    | eval value=\\"55\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r16\\" \\n    | eval value=(random() % 80) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r17\\" \\n    | eval value=\\"75\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"paris_r18\\" \\n    | eval value=\\"78\\" ] \\n    | append \\n[| makeresults \\n    | eval connection=\\"paris_r19\\" \\n    | eval value=\\"81\\" ] \\n[| makeresults \\n    | eval connection=\\"paris_r20\\" \\n    | eval value=\\"81\\" ] \\n[| makeresults \\n    | eval connection=\\"paris_r21\\" \\n    | eval value=\\"81\\" ] \\n[| makeresults \\n    | eval connection=\\"paris_r22\\" \\n    | eval value=\\"81\\" ] \\n[| makeresults \\n    | eval connection=\\"paris_r23\\" \\n    | eval value=\\"81\\" ] \\n| table connection value",
        "refresh": "14s",
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        }
      },
      "name": "svg_hex_asia"
    },
    "ds_wTbPM0W2": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"eu1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"eu2\\" \\n    | eval value=(random() % 25) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"eu3\\" \\n    | eval value=(random() % 45) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"eu4\\" \\n    | eval value=(random() % 85) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"eu5\\" \\n    | eval value=\\"20\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"eu6\\" \\n    | eval value=(random() % 25) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"eu7\\" \\n    | eval value=\\"30\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"eu8\\" \\n    | eval value=(random() % 85) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"eu9\\" \\n    | eval value=\\"40\\" ] \\n| table connection value",
        "refresh": "37",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "svg_eu_hex"
    },
    "ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"db1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"db2\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db3\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db4\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db5\\" \\n    | eval value=\\"100\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db6\\" \\n    | eval value=\\"0\\" ] \\n| table connection value",
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        }
      },
      "name": "svg_databar4"
    },
    "ds_gJTl2haQ": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1 \\n| eval rand=(random() % 100) + 30",
        "refresh": "15s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "static_30"
    },
    "ds_8FuiQF3X": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| stats count by host",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "donut_static1"
    },
    "ds_sB9ko3Hp_ds_Gr9vlHdv_ds_kSWvmiN8": {
      "type": "ds.search",
      "options": {
        "query": "| stats count\\n| eval count=100",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "static_100"
    },
    "ds_5M2VSpae_ds_5LZFWQm5_ds_t3tyfKVl_ds_gJTl2haQ": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1 \\n| eval rand=(random() % 50) + 5",
        "refresh": "31s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "static_36"
    },
    "ds_MRiCbOnE_ds_zlqXm5hn": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1 \\n| eval core=\\"used\\" \\n| eval count=(random() % 100) + 30 \\n| append \\n    [| makeresults 1 \\n    | eval core=\\"unused\\" \\n    | eval count=(random() % 100) + 30] \\n| fields core count",
        "refresh": "31s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "pie1"
    },
    "ds_7DKwHTwB_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of svg_node_hex"
    },
    "ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"db1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"db2\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db3\\" \\n    | eval value=(random() % 100)] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db4\\" \\n    | eval value=0] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db5\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db6\\" \\n    | eval value=\\"0\\" ] \\n| streamstats window=1 current=f last(value) as prev_value \\n| eval value=if(connection=\\"db4\\",if(prev_value<50,100,0),if(connection=\\"db3\\",if(value>50,100,0),value)) \\n| table connection value",
        "refresh": "17s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "svg_databar3"
    },
    "ds_vjB24jfv_ds_9aLOivaD_ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"db1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"db2\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db3\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db4\\" \\n    | eval value=\\"100\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db5\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db6\\" \\n    | eval value=\\"0\\" ] \\n| table connection value",
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        }
      },
      "name": "svg_databar6"
    },
    "ds_p4lS4L3l_ds_4mOwD3RM": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| search host=host8\\n| eval myTime=strftime(timestamp,\\"%H:%M\\")\\n| chart count over myTime",
        "refresh": "5s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "active_system_users"
    },
    "ds_zlqXm5hn": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1 \\n| eval core=\\"used\\" \\n| eval count=(random() % 100) + 30 \\n| append \\n    [| makeresults 1 \\n    | eval core=\\"unused\\" \\n    | eval count=(random() % 100) + 30] \\n| fields core count",
        "refresh": "23s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "pie2"
    },
    "ds_WybbeCbD_ds_MRiCbOnE_ds_zlqXm5hn": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1 \\n| eval core=\\"used\\" \\n| eval count=(random() % 100) + 30 \\n| append \\n    [| makeresults 1 \\n    | eval core=\\"unused\\" \\n    | eval count=(random() % 100) + 30] \\n| fields core count",
        "refresh": "27s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "pie3"
    },
    "ds_LdOni4XJ_ds_K3I9yf4j": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"db1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"db2\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db3\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db4\\" \\n    | eval value=\\"100\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db5\\" \\n    | eval value=\\"0\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"db6\\" \\n    | eval value=\\"0\\" ] \\n| table connection value",
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        }
      },
      "name": "svg_databar2"
    },
    "ds_TH5kj20P": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"a1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"a2\\" \\n    | eval value=\\"5\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a3\\" \\n    | eval value=\\"10\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a4\\" \\n    | eval value=(random() % 20) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a5\\" \\n    | eval value=\\"20\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a6\\" \\n    | eval value=(random() % 35) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a7\\" \\n    | eval value=\\"30\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a8\\" \\n    | eval value=(random() % 20)+81] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a9\\" \\n    | eval value=\\"40\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a10\\" \\n    | eval value=(random() % 45) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a11\\" \\n    | eval value=(random() % 50) ] \\n| table connection value",
        "refresh": "19s",
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        }
      },
      "name": "svg_hex_na"
    },
    "ds_Ymry5Re3_ds_5igfRVhd": {
      "type": "ds.search",
      "options": {
        "query": "| stats count\\n| eval count=\\"A\\"",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "a1"
    },
    "ds_kSWvmiN8": {
      "type": "ds.search",
      "options": {
        "query": "| stats count\\n| eval count=55",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "static_55"
    },
    "ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| eval myTime=strftime(timestamp,\\"%H:%M\\")\\n| chart count over myTime",
        "queryParameters": {
          "earliest": "-45m@m",
          "latest": "now"
        }
      },
      "name": "internal_timechart3"
    },
    "ds_YG5eoOOK_ds_Gr9vlHdv_ds_kSWvmiN8": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1 \\n| eval rand=(random() % 20) + 50",
        "refresh": "7s",
        "queryParameters": {
          "earliest": "-5m@m",
          "latest": "now"
        }
      },
      "name": "static_70"
    },
    "ds_Gr9vlHdv_ds_kSWvmiN8": {
      "type": "ds.search",
      "options": {
        "query": "| stats count\\n| eval count=55",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of static_55"
    },
    "ds_n0IOFPlX": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"sa_1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"sa_2\\" \\n    | eval value=\\"5\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"sa_3\\" \\n    | eval value=\\"10\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"sa_4\\" \\n    | eval value=\\"15\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"sa_5\\" \\n    | eval value=\\"20\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"sa_6\\" \\n    | eval value=\\"25\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"sa_7\\" \\n    | eval value=\\"30\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"sa_8\\" \\n    | eval value=\\"35\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"sa_9\\" \\n    | eval value=\\"40\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"sa_10\\" \\n    | eval value=\\"43\\" ] \\n| table connection value",
        "queryParameters": {
          "earliest": "-24h@h",
          "latest": "now"
        }
      },
      "name": "svg_hex_sa"
    },
    "ds_naxkbXCC_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=(random() % 20) + 80\\n| table connection value",
        "refresh": "13s",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "svg_node_hex_q3"
    },
    "ds_LV8ElDGY_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of svg_node_hex"
    },
    "ds_ly041xXI": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| head 1\\n| fields bytes_in",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "single_event"
    },
    "ds_cZxRAbtR": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"a1\\" \\n| eval value=\\"0\\" \\n| append \\n    [| makeresults \\n    | eval connection=\\"a2\\" \\n    | eval value=(random() % 20) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a3\\" \\n    | eval value=\\"10\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a4\\" \\n    | eval value=(random() % 30) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a5\\" \\n    | eval value=\\"20\\" ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a6\\" \\n    | eval value=(random() % 45) ] \\n| append \\n    [| makeresults \\n    | eval connection=\\"a7\\" \\n    | eval value=\\"30\\" ] \\n| table connection value",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "svg_hex_a"
    },
    "ds_BER1tyDl": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| chart count as \\"Total\\" by host ",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "table1"
    },
    "ds_12ld9SDe_ds_1jrijlbw_ds_Gr9vlHdv_ds_kSWvmiN8": {
      "type": "ds.search",
      "options": {
        "query": "| stats count\\n| eval count=98",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of static_98"
    },
    "ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "svg_node_hex"
    },
    "ds_AVGHBbwj_ds_WybbeCbD_ds_MRiCbOnE_ds_zlqXm5hn": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults 1 \\n| eval core=\\"used\\" \\n| eval count=(random() % 100) + 30 \\n| append \\n    [| makeresults 1 \\n    | eval core=\\"unused\\" \\n    | eval count=(random() % 100) + 30] \\n| fields core count",
        "refresh": "19s",
        "queryParameters": {
          "earliest": "-15m",
          "latest": "now"
        }
      },
      "name": "pie4"
    },
    "ds_ZuX7Gw1d_ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| eval myTime=strftime(timestamp,\\"%H:%M\\")\\n| chart count over myTime by host",
        "refresh": "13s",
        "queryParameters": {
          "earliest": "-5m@m",
          "latest": "now"
        }
      },
      "name": "internal_timechart5"
    },
    "ds_9J08owpb_ds_4mOwD3RM": {
      "type": "ds.search",
      "options": {
        "query": "| inputlookup firewall_example.csv\\n| search host= host8\\n| eval myTime=strftime(timestamp,\\"%H:%M\\")\\n| chart count over myTime",
        "refresh": "4s",
        "queryParameters": {
          "earliest": "-15m@m",
          "latest": "now"
        }
      },
      "name": "internal_timechart4"
    },
    "ds_GU2vAA0o_ds_4PRjLIiF_ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of Copy of Copy of Copy of Copy of Copy of Copy of svg_node_hex"
    },
    "ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE": {
      "type": "ds.search",
      "options": {
        "query": "| makeresults \\n| eval connection=\\"node\\" \\n| eval value=\\"55\\" \\n| table connection value",
        "queryParameters": {
          "earliest": "-60m@m",
          "latest": "now"
        }
      },
      "name": "Copy of Copy of Copy of Copy of Copy of svg_node_hex"
    }
  },
  "inputs": {},
  "description": "",
  "title": "Data Command and Control",
  "defaults": {
    "visualizations": {
      "global": {
        "showLastUpdated": false
      }
    }
  },
  "visualizations": {
    "viz_sIf95Tb5": {
      "dataSources": {
        "primary": "ds_cZxRAbtR"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"88.784\\" height=\\"84.146\\" version=\\"1.1\\" viewBox=\\"0 0 88.784 84.146\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"a1\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".6\\"/>\\n <path id=\\"a2\\" d=\\"m33.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".6\\"/>\\n <path id=\\"a3\\" d=\\"m21.892 20 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".6\\"/>\\n <path id=\\"a4\\" d=\\"m44.892 20 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"a5\\" d=\\"m67.892 20 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"a6\\" d=\\"m78.392 40 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"a7\\" d=\\"m67.934 60.146 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "from": 97,
            "value": "#ff0000"
          },
          {
            "to": 97,
            "from": 90,
            "value": "#0066cc"
          },
          {
            "to": 90,
            "from": 80,
            "value": "#0080ff"
          },
          {
            "to": 80,
            "from": 60,
            "value": "#3399ff"
          },
          {
            "to": 60,
            "from": 40,
            "value": " #66b3ff"
          },
          {
            "to": 40,
            "from": 20,
            "value": "#99ccff"
          },
          {
            "to": 20,
            "from": 1,
            "value": "#cce6ff"
          },
          {
            "to": 1,
            "value": "#ffffff"
          }
        ]
      }
    },
    "viz_EV1Y5qww": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 18,
        "strokeColor": "#33bbff",
        "strokeWidth": 5,
        "strokeOpacity": 0.5,
        "fillColor": "transparent"
      }
    },
    "viz_QKDdj8id": {
      "type": "splunk.column",
      "dataSources": {
        "primary": "ds_t3tyfKVl_ds_gJTl2haQ"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "yAxisLabelVisibility": "hide",
        "yAxisMin": "0",
        "xAxisTitleVisibility": "hide",
        "xAxisLabelVisibility": "hide",
        "yAxisMax": "100",
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#0088cc"
        ]
      }
    },
    "viz_b23IgSkE": {
      "type": "splunk.singlevalue",
      "options": {
        "unit": "",
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_sB9ko3Hp_ds_Gr9vlHdv_ds_kSWvmiN8"
      }
    },
    "viz_mcsq3kL2": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_NfXWgTYJ": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.1,
        "fillColor": "#0088cc"
      }
    },
    "viz_C0bdjoEh": {
      "type": "splunk.image",
      "options": {
        "src": "splunk-enterprise-kvstore://5ed86eed8cd259128c00648e",
        "preserveAspectRatio": true
      }
    },
    "viz_YTvabR1d": {
      "type": "viz.geojson.world",
      "options": {
        "fillOpacity": "0.5",
        "projection": "mercator",
        "name": "WORLD",
        "source": "geo://default/world",
        "sourceBounds": {
          "lat": {
            "max": 85,
            "min": -60
          },
          "long": {
            "max": 180,
            "min": -180
          }
        },
        "fillColor": "#33bbff",
        "backgroundColor": "transparent",
        "logicalBounds": {
          "y": {
            "max": 600,
            "min": 0
          },
          "x": {
            "max": 800,
            "min": 0
          }
        }
      }
    },
    "viz_t53L4VQd": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### C2",
        "fontColor": "#b3e6ff"
      }
    },
    "viz_Vspwksmy": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_JEzI4LOy": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_GG3R2xOI": {
      "type": "splunk.column",
      "dataSources": {
        "primary": "ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "xAxisTitleVisibility": "hide",
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#0088cc"
        ]
      }
    },
    "viz_OV5psMdg": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_qVNyrQks": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Active System Users",
        "fontColor": "#33bbff"
      }
    },
    "viz_G2fCsbYR": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.5
      }
    },
    "viz_FeM9ednf": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_f7aJsz57": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 36,
        "strokeWidth": 8,
        "strokeOpacity": 0.5,
        "strokeColor": "#33bbff",
        "fillOpacity": 0.1,
        "fillColor": "transparent"
      }
    },
    "viz_y63gHBJQ": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Critical Data Pipeline Health",
        "fontColor": "#33bbff"
      }
    },
    "viz_uZZDJlvW": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## 4",
        "fontColor": "#708794",
        "fontWeight": "bold"
      }
    },
    "viz_ARoZ9X0D": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 10,
        "strokeColor": "#33bbff",
        "fillOpacity": 0.05,
        "strokeOpacity": 0.25,
        "fillColor": "#708794"
      }
    },
    "viz_HVLWvNFL": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.1,
        "fillColor": "#0088cc"
      }
    },
    "viz_BMVD7bC6": {
      "type": "abslayout.line",
      "options": {
        "strokeDashStyle": 2,
        "toArrow": true,
        "strokeColor": "#66ccff",
        "strokeWidth": 2
      }
    },
    "viz_qyuN6qhp": {
      "dataSources": {
        "primary": "ds_naxkbXCC_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      }
    },
    "viz_ulJpSHdq": {
      "type": "splunk.pie",
      "dataSources": {
        "primary": "ds_zlqXm5hn"
      },
      "options": {
        "labelDisplay": "off",
        "backgroundColor": "transparent",
        "seriesColors": [
          "#00264d",
          "#33bbff"
        ]
      },
      "context": {}
    },
    "viz_1rAl4iVq": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### 100",
        "fontColor": "#708794"
      }
    },
    "viz_21HfURZa": {
      "type": "splunk.line",
      "dataSources": {
        "primary": "ds_ZuX7Gw1d_ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "xAxisTitleVisibility": "hide",
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#0088cc",
          "#33bbff",
          "#66ccff",
          "#b3e6ff"
        ],
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "xAxisMajorTickVisibility": "hide"
      }
    },
    "viz_lvYO5IPZ": {
      "type": "splunk.ellipse",
      "options": {
        "strokeColor": "#b3e6ff",
        "fillOpacity": 0.1,
        "strokeOpacity": 0.7,
        "fillColor": "transparent"
      }
    },
    "viz_by8rcE0y": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.2
      }
    },
    "viz_Btj2RVCw": {
      "type": "splunk.singlevalueicon",
      "options": {
        "showValue": false,
        "iconOpacity": 0.15,
        "iconColor": "#33bbff",
        "icon": "splunk-enterprise-kvstore://5e14b52f8cd2594970000d81"
      }
    },
    "viz_GbsuVoKg": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc"
      }
    },
    "viz_EqgluBzX": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 18,
        "strokeColor": "#33bbff",
        "strokeWidth": 5,
        "strokeOpacity": 0.5,
        "fillColor": "transparent"
      }
    },
    "viz_Tt6TgwHy": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 18,
        "strokeColor": "#33bbff",
        "strokeWidth": 5,
        "strokeOpacity": 0.5,
        "fillColor": "transparent"
      }
    },
    "viz_a8S6Lvec": {
      "type": "abslayout.line",
      "options": {
        "strokeDashStyle": 35,
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.1
      }
    },
    "viz_Ym49tZf8": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc"
      }
    },
    "viz_wb4pGRUw": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## 3",
        "fontColor": "#708794",
        "fontWeight": "bold"
      }
    },
    "viz_15yZLk8g": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_QBOJQAqY": {
      "type": "splunk.pie",
      "dataSources": {
        "primary": "ds_WybbeCbD_ds_MRiCbOnE_ds_zlqXm5hn"
      },
      "options": {
        "labelDisplay": "off",
        "backgroundColor": "transparent",
        "seriesColors": [
          "#00264d",
          "#33bbff"
        ]
      },
      "context": {}
    },
    "viz_VnOxKmnP": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_TvjAKCqY": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.25
      }
    },
    "viz_GRVOuukr": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_wsmZ7jdF": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_0nCUGDQl": {
      "type": "splunk.singlevalue",
      "options": {
        "backgroundColor": "transparent",
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('count')"
      },
      "dataSources": {
        "primary": "ds_Ymry5Re3_ds_5igfRVhd"
      },
      "context": {}
    },
    "viz_uA2bjn0O": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q7",
        "fontColor": "#ffffff"
      }
    },
    "viz_7v2IYYLR": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "#0088cc",
        "fillOpacity": 0.15,
        "strokeOpacity": 0.3,
        "fillColor": "#0088cc"
      }
    },
    "viz_PzLEUJlk": {
      "type": "splunk.column",
      "dataSources": {
        "primary": "ds_5LZFWQm5_ds_t3tyfKVl_ds_gJTl2haQ"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "yAxisLabelVisibility": "hide",
        "yAxisMin": "0",
        "xAxisTitleVisibility": "hide",
        "xAxisLabelVisibility": "hide",
        "yAxisMax": "100",
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#0088cc"
        ]
      }
    },
    "viz_bcYB40so": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 7,
        "strokeColor": "#708794",
        "fillOpacity": 0.1,
        "strokeOpacity": 0.5,
        "fillColor": "#0877a6"
      }
    },
    "viz_yiCqSoO9": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 36,
        "strokeWidth": 8,
        "strokeOpacity": 0.5,
        "strokeColor": "#33bbff",
        "fillOpacity": 0.1,
        "fillColor": "transparent"
      }
    },
    "viz_TiWGtwBO": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_cTLpV26P": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_Olf8hwzh": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 7,
        "strokeColor": "#708794",
        "fillOpacity": 0.1,
        "strokeOpacity": 0.5,
        "fillColor": "#0877a6"
      }
    },
    "viz_mGZEEK45": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q11",
        "fontColor": "#ffffff"
      }
    },
    "viz_HIplJpkY": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_NZkAjyyO": {
      "dataSources": {
        "primary": "ds_TH5kj20P"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\" standalone=\\"no\\"?>\\n<svg\\n   xmlns:svg=\\"http://www.w3.org/2000/svg\\"\\n   xmlns=\\"http://www.w3.org/2000/svg\\"\\n   xmlns:sodipodi=\\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\\"\\n   xmlns:inkscape=\\"http://www.inkscape.org/namespaces/inkscape\\"\\n   inkscape:version=\\"1.1-dev (48d18c81, 2020-07-08)\\"\\n   sodipodi:docname=\\"ahex.svg\\"\\n   viewBox=\\"0 0 88.783997 84.146248\\"\\n   version=\\"1.1\\"\\n   height=\\"84.146248\\"\\n   width=\\"88.783997\\"\\n   id=\\"svg4835\\">\\n  <defs\\n     id=\\"defs22\\" />\\n  <sodipodi:namedview\\n     inkscape:current-layer=\\"svg4835\\"\\n     inkscape:window-maximized=\\"0\\"\\n     inkscape:window-y=\\"23\\"\\n     inkscape:window-x=\\"0\\"\\n     inkscape:cy=\\"24.549001\\"\\n     inkscape:cx=\\"23.650867\\"\\n     inkscape:zoom=\\"1.6701291\\"\\n     showgrid=\\"false\\"\\n     id=\\"namedview20\\"\\n     inkscape:window-height=\\"594\\"\\n     inkscape:window-width=\\"885\\"\\n     inkscape:pageshadow=\\"2\\"\\n     inkscape:pageopacity=\\"0\\"\\n     guidetolerance=\\"10\\"\\n     gridtolerance=\\"10\\"\\n     objecttolerance=\\"10\\"\\n     borderopacity=\\"1\\"\\n     bordercolor=\\"#666666\\"\\n     pagecolor=\\"#ffffff\\" />\\n  <path\\n     inkscape:label=\\"a1\\"\\n     opacity=\\"0.6\\"\\n     fill=\\"#b3b3b3\\"\\n     d=\\"M 10.392,0 20.784,6 V 18 L 10.392,24 0,18 V 6 Z\\"\\n     id=\\"a1\\" />\\n  <path\\n     inkscape:label=\\"a2\\"\\n     opacity=\\"0.6\\"\\n     fill=\\"#b3b3b3\\"\\n     d=\\"M 33.392,0 43.784,6 V 18 L 33.392,24 23,18 V 6 Z\\"\\n     id=\\"a2\\" />\\n  <path\\n     inkscape:label=\\"a3\\"\\n     opacity=\\"0.6\\"\\n     fill=\\"#b3b3b3\\"\\n     d=\\"m 21.892,20 10.392,6 V 38 L 21.892,44 11.5,38 V 26 Z\\"\\n     id=\\"a3\\" />\\n  <path\\n     inkscape:label=\\"a4\\"\\n     opacity=\\"0.5\\"\\n     fill=\\"#b3b3b3\\"\\n     d=\\"m 44.892,20 10.392,6 V 38 L 44.892,44 34.5,38 V 26 Z\\"\\n     id=\\"a4\\" />\\n  <path\\n     inkscape:label=\\"a5\\"\\n     opacity=\\"0.5\\"\\n     fill=\\"#b3b3b3\\"\\n     d=\\"m 67.892,20 10.392,6 V 38 L 67.892,44 57.5,38 V 26 Z\\"\\n     id=\\"a5\\" />\\n  <path\\n     inkscape:label=\\"a6\\"\\n     opacity=\\"0.5\\"\\n     fill=\\"#b3b3b3\\"\\n     d=\\"m 78.392,40 10.392,6 V 58 L 78.392,64 68,58 V 46 Z\\"\\n     id=\\"a6\\" />\\n  <path\\n     inkscape:label=\\"a7\\"\\n     id=\\"a7\\"\\n     d=\\"m 67.934027,60.146249 10.391998,6 V 78.14625 l -10.391998,6 -10.392,-6 V 66.146249 Z\\"\\n     fill=\\"#b3b3b3\\"\\n     opacity=\\"0.5\\" />\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "from": 97,
            "value": "#ff0000"
          },
          {
            "to": 97,
            "from": 90,
            "value": "#0066cc"
          },
          {
            "to": 90,
            "from": 80,
            "value": "#0080ff"
          },
          {
            "to": 80,
            "from": 60,
            "value": "#3399ff"
          },
          {
            "to": 60,
            "from": 40,
            "value": " #66b3ff"
          },
          {
            "to": 40,
            "from": 20,
            "value": "#99ccff"
          },
          {
            "to": 20,
            "from": 1,
            "value": "#cce6ff"
          },
          {
            "to": 1,
            "value": "#ffffff"
          }
        ]
      }
    },
    "viz_mCOgkGUL": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"iso-8859-1\\"?>\\n<!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\\n<!DOCTYPE svg PUBLIC \\"-//W3C//DTD SVG 1.1//EN\\" \\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\\">\\n<svg version=\\"1.1\\" id=\\"Capa_1\\" xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" x=\\"0px\\" y=\\"0px\\"\\n\\t viewBox=\\"0 0 203.556 203.556\\" style=\\"enable-background:new 0 0 203.556 203.556;\\" xml:space=\\"preserve\\">\\n<g>\\n\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M201.359,137.3l-43.831-43.831l11.453-11.452c1.407-1.407,2.197-3.314,2.197-5.304c0-1.989-0.79-3.896-2.197-5.304\\n\\t\\tl-36.835-36.834c-2.929-2.928-7.677-2.928-10.606,0l-11.452,11.452L66.253,2.196c-2.93-2.928-7.678-2.928-10.606,0L18.813,39.03\\n\\t\\tc-2.929,2.93-2.929,7.678,0,10.607l43.831,43.831l-11.453,11.452c-1.407,1.407-2.197,3.314-2.197,5.304s0.79,3.896,2.197,5.304\\n\\t\\tl36.837,36.836c1.464,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.303-2.196l11.453-11.453l43.83,43.83\\n\\t\\tc1.465,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.303-2.196l36.835-36.834c1.407-1.407,2.197-3.314,2.197-5.304\\n\\t\\tC203.556,140.614,202.766,138.707,201.359,137.3z M34.723,44.334L60.95,18.107l38.53,38.526L82.314,73.799l-9.063,9.063\\n\\t\\tL34.723,44.334z M93.331,136.454l-26.23-26.229l11.448-11.447c0.002-0.002,0.003-0.003,0.005-0.005l12.443-12.443l35.845-35.844\\n\\t\\tl26.229,26.228l-11.446,11.446c-0.003,0.003-0.005,0.005-0.007,0.007l-18.417,18.418L93.331,136.454z M159.221,168.831\\n\\t\\tl-38.527-38.526l26.229-26.229l38.527,38.527L159.221,168.831z\\"/>\\n\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M72.344,188.555c-15.317,0.001-29.717-5.964-40.548-16.795C20.965,160.929,15,146.528,15,131.211\\n\\t\\tc0-4.143-3.358-7.5-7.5-7.5c-4.143,0-7.5,3.358-7.5,7.5c0,19.324,7.526,37.491,21.189,51.155\\n\\t\\tc13.663,13.664,31.829,21.189,51.152,21.189c0.001,0,0.002,0,0.004,0c4.142,0,7.499-3.358,7.499-7.5\\n\\t\\tC79.845,191.912,76.486,188.555,72.344,188.555z\\"/>\\n\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M69.346,174.133c4.142,0,7.5-3.357,7.5-7.5c0-4.143-3.358-7.5-7.5-7.5c-6.658,0-12.916-2.593-17.624-7.3\\n\\t\\tc-4.707-4.707-7.299-10.965-7.299-17.622c0-4.142-3.357-7.5-7.5-7.5h0c-4.142,0-7.5,3.358-7.5,7.5\\n\\t\\tc-0.001,10.663,4.152,20.688,11.693,28.229C48.656,169.981,58.682,174.133,69.346,174.133z\\"/>\\n</g>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_4yqBRUON": {
      "type": "abslayout.line",
      "options": {
        "strokeDashStyle": 35,
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.1
      }
    },
    "viz_BM4xfo3I": {
      "type": "splunk.rectangle",
      "options": {
        "strokeDashStyle": 5,
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.3,
        "fillColor": "transparent"
      }
    },
    "viz_CQQ7loyQ": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## S2",
        "fontColor": "#66ccff"
      }
    },
    "viz_hNtqEHCb": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.25
      }
    },
    "viz_AezuELDn": {
      "type": "splunk.singlevalue",
      "options": {
        "unit": "",
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_sB9ko3Hp_ds_Gr9vlHdv_ds_kSWvmiN8"
      }
    },
    "viz_sqJOaVzX": {
      "type": "abslayout.line",
      "options": {
        "strokeDashStyle": 35,
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.1
      }
    },
    "viz_LbpEvJgf": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_yCFtpE3o": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.5
      }
    },
    "viz_fNTgm0Gc": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_z0Gyge4R": {
      "dataSources": {
        "primary": "ds_7DKwHTwB_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_5TaScyYS": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 7,
        "strokeColor": "#708794",
        "fillOpacity": 0.1,
        "strokeOpacity": 0.5,
        "fillColor": "#0877a6"
      }
    },
    "viz_AL3TzuFa": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_lT0gwkfq": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.1,
        "fillColor": "#33bbff"
      }
    },
    "viz_u6cNobrl": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.1,
        "fillColor": "#66ccff"
      }
    },
    "viz_UZOQVsy6": {
      "type": "abslayout.line",
      "options": {
        "strokeDashStyle": 2,
        "toArrow": true,
        "strokeColor": "#66ccff",
        "strokeWidth": 2
      }
    },
    "viz_dQROxn4T": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 18,
        "strokeColor": "#33bbff",
        "strokeWidth": 5,
        "strokeOpacity": 0.5,
        "fillColor": "transparent"
      }
    },
    "viz_h2VV6El0": {
      "dataSources": {
        "primary": "ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"121.4\\" height=\\"6.3294\\" version=\\"1.1\\" viewBox=\\"0 0 121.4 6.3294\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <rect id=\\"db1\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db2\\" x=\\"20.566\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db3\\" x=\\"41.132\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db4\\" x=\\"61.698\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db5\\" x=\\"82.265\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db6\\" x=\\"102.83\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n</svg>\\n",
        "areaIds": "> primary | seriesByIndex('0')",
        "areaValues": "> primary | seriesByName('value')",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264D",
            "to": 50
          },
          {
            "value": "#33BBFF",
            "from": 50
          }
        ]
      }
    },
    "viz_ibCByW9o": {
      "type": "splunk.pie",
      "dataSources": {
        "primary": "ds_MRiCbOnE_ds_zlqXm5hn"
      },
      "options": {
        "labelDisplay": "off",
        "backgroundColor": "transparent",
        "seriesColors": [
          "#00264d",
          "#33bbff"
        ]
      },
      "context": {}
    },
    "viz_NMDEFxaA": {
      "type": "splunk.ellipse",
      "options": {
        "strokeColor": "#33bbff",
        "strokeOpacity": 0.5,
        "fillColor": "#000000"
      }
    },
    "viz_2htvDkYe": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc"
      }
    },
    "viz_1pRdFSJz": {
      "dataSources": {
        "primary": "ds_05OuPp9z_ds_7DKwHTwB_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_HuPqUNE5": {
      "dataSources": {
        "primary": "ds_xVHKdWls"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"66.784\\" height=\\"34\\" version=\\"1.1\\" viewBox=\\"0 0 66.784 34\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"aus1\\" d=\\"m10.392 10 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".6\\"/>\\n <path id=\\"aus2\\" d=\\"m33.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"aus3\\" d=\\"m56.392 10 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "from": 97,
            "value": "#ff0000"
          },
          {
            "to": 97,
            "from": 90,
            "value": "#0066cc"
          },
          {
            "to": 90,
            "from": 80,
            "value": "#0080ff"
          },
          {
            "to": 80,
            "from": 60,
            "value": "#3399ff"
          },
          {
            "to": 60,
            "from": 40,
            "value": " #66b3ff"
          },
          {
            "to": 40,
            "from": 20,
            "value": "#99ccff"
          },
          {
            "to": 20,
            "from": 1,
            "value": "#cce6ff"
          },
          {
            "to": 1,
            "value": "#ffffff"
          }
        ]
      }
    },
    "viz_Y57OEsIu": {
      "type": "splunk.singlevalueicon",
      "options": {
        "showValue": false,
        "iconOpacity": 0.25,
        "iconColor": "#33bbff",
        "icon": "splunk-enterprise-kvstore://5f6246da8cd2591230006ae5"
      }
    },
    "viz_BxyD9XpO": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q4",
        "fontColor": "#ffffff"
      }
    },
    "viz_HqqCstaj": {
      "type": "splunk.rectangle",
      "options": {
        "strokeDashStyle": 5,
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.3,
        "fillColor": "transparent"
      }
    },
    "viz_fR6nkCGs": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.1,
        "fillColor": "#33bbff"
      }
    },
    "viz_j2SjJ3wt": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## 1",
        "fontColor": "#708794",
        "fontWeight": "bold"
      }
    },
    "viz_x1oOgW40": {
      "type": "splunk.pie",
      "dataSources": {
        "primary": "ds_AVGHBbwj_ds_WybbeCbD_ds_MRiCbOnE_ds_zlqXm5hn"
      },
      "options": {
        "labelDisplay": "off",
        "backgroundColor": "transparent",
        "seriesColors": [
          "#00264d",
          "#33bbff"
        ]
      },
      "context": {}
    },
    "viz_bvDwIrVQ": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### C1",
        "fontColor": "#b3e6ff"
      }
    },
    "viz_CCaHR3rU": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q3",
        "fontColor": "#ffffff"
      }
    },
    "viz_ZWgwX9NU": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## 2",
        "fontColor": "#708794",
        "fontWeight": "bold"
      }
    },
    "viz_w5f8wnaG": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Consortium Node Health Map",
        "fontColor": "#33bbff"
      }
    },
    "viz_1YLFM2at": {
      "type": "splunk.table",
      "options": {
        "backgroundColor": "transparent",
        "tableFormat": {
          "rowBackgroundColors": "> table | seriesByIndex(0) | pick(tableRowBackgroundColorsByBackgroundColor)",
          "headerBackgroundColor": "> backgroundColor | setColorChannel(tableHeaderBackgroundColorConfig)",
          "rowColors": "> rowBackgroundColors | pick(tableRowColor)",
          "headerColor": "#b3e6ff"
        },
        "columnFormat": {
          "Current Stage": {
            "rowColors": "> table | seriesByName('Current Stage') | pick(Current_StageRowColorsEditorConfig)"
          }
        },
        "count": 7
      },
      "context": {
        "tableRowColor": [
          "#00a4fd"
        ],
        "Current_StageRowColorsEditorConfig": [
          "transparent"
        ]
      },
      "dataSources": {
        "primary": "ds_BER1tyDl"
      }
    },
    "viz_co1mv2Rb": {
      "type": "splunk.singlevalueicon",
      "options": {
        "showValue": false,
        "iconOpacity": 0.75,
        "iconColor": "#33bbff",
        "icon": "splunk-enterprise-kvstore://5ea104598cd259125c007812"
      }
    },
    "viz_bNiWfv4N": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.5
      }
    },
    "viz_W6vTW82E": {
      "type": "splunk.rectangle",
      "options": {
        "strokeDashStyle": 5,
        "rx": 25,
        "strokeOpacity": 0.25,
        "strokeColor": "#b3e6ff",
        "fillOpacity": 0.25,
        "fillColor": "#0088cc"
      }
    },
    "viz_R8SmZxgD": {
      "type": "splunk.line",
      "dataSources": {
        "primary": "ds_ZwpAzv1Z_ds_6HWeTO3I_ds_rGSz2MYl_ds_4mOwD3RM"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "xAxisTitleVisibility": "hide",
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#0088cc"
        ],
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "xAxisMajorTickVisibility": "hide",
        "showYMajorGridLines": false
      }
    },
    "viz_tU6fPEQk": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_1xZxZ7o0": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_papnG4FP": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q1",
        "fontColor": "#ffffff"
      }
    },
    "viz_VLx3CgNc": {
      "type": "splunk.ellipse",
      "options": {
        "strokeColor": "#b3e6ff",
        "fillOpacity": 0.1,
        "strokeOpacity": 0.7,
        "fillColor": "transparent"
      }
    },
    "viz_8v42rIbQ": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Core Anomalies",
        "fontColor": "#33bbff"
      }
    },
    "viz_GzFW5NHt": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"iso-8859-1\\"?>\\n<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\\n<svg version=\\"1.1\\" id=\\"Layer_1\\" xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" x=\\"0px\\" y=\\"0px\\"\\n\\t viewBox=\\"0 0 512 512\\" style=\\"enable-background:new 0 0 512 512;\\" xml:space=\\"preserve\\">\\n<g>\\n\\t<g>\\n\\t\\t<g>\\n\\t\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M224.246,204.098c9.394,0,17.011-7.616,17.011-17.011V165.54c0-9.394-7.616-17.011-17.011-17.011\\n\\t\\t\\t\\ts-17.011,7.616-17.011,17.011v21.547C207.235,196.482,214.852,204.098,224.246,204.098z\\"/>\\n\\t\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M287.753,204.098c9.395,0,17.011-7.616,17.011-17.011V165.54c0-9.394-7.616-17.011-17.011-17.011\\n\\t\\t\\t\\ts-17.011,7.616-17.011,17.011v21.547C270.742,196.482,278.358,204.098,287.753,204.098z\\"/>\\n\\t\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M224.246,301.626c9.394,0,17.011-7.616,17.011-17.011v-21.547c0-9.394-7.616-17.011-17.011-17.011\\n\\t\\t\\t\\ts-17.011,7.616-17.011,17.011v21.547C207.235,294.01,214.852,301.626,224.246,301.626z\\"/>\\n\\t\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M287.753,301.626c9.395,0,17.011-7.616,17.011-17.011v-21.547c0-9.394-7.616-17.011-17.011-17.011\\n\\t\\t\\t\\ts-17.011,7.616-17.011,17.011v21.547C270.742,294.01,278.358,301.626,287.753,301.626z\\"/>\\n\\t\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M494.989,411.241h-39.122v-30.112c20.574-7.081,35.403-26.617,35.403-49.565c0-28.901-23.512-52.414-52.414-52.414\\n\\t\\t\\t\\ts-52.414,23.512-52.414,52.414c0,22.947,14.829,42.484,35.403,49.565v30.112h-59.533V83.748c0-9.394-7.616-17.011-17.011-17.011\\n\\t\\t\\t\\tH166.697c-9.394,0-17.011,7.616-17.011,17.011v327.493H91.856v-30.112c20.574-7.081,35.403-26.617,35.403-49.565\\n\\t\\t\\t\\tc0-28.901-23.512-52.414-52.414-52.414c-28.901,0-52.415,23.512-52.415,52.414c0,22.947,14.83,42.484,35.404,49.565v30.112\\n\\t\\t\\t\\tH17.011C7.616,411.241,0,418.858,0,428.252s7.616,17.011,17.011,17.011h149.687h178.604h149.688\\n\\t\\t\\t\\tc9.394,0,17.011-7.616,17.011-17.011S504.385,411.241,494.989,411.241z M74.845,349.956c-10.142,0-18.393-8.25-18.393-18.392\\n\\t\\t\\t\\tc0-10.142,8.25-18.392,18.393-18.392c10.141,0,18.392,8.25,18.392,18.392C93.237,341.706,84.986,349.956,74.845,349.956z\\n\\t\\t\\t\\t M272.553,411.241h-31.404v-31.405h31.404V411.241z M328.292,411.241h-0.001h-21.716v-48.416c0-9.394-7.616-17.011-17.011-17.011\\n\\t\\t\\t\\th-65.426c-9.394,0-17.011,7.616-17.011,17.011v48.416h-23.418V100.759h144.582V411.241z M438.856,349.956\\n\\t\\t\\t\\tc-10.141,0-18.392-8.25-18.392-18.392c0-10.142,8.25-18.392,18.392-18.392c10.142,0,18.392,8.25,18.392,18.392\\n\\t\\t\\t\\tC457.248,341.706,448.998,349.956,438.856,349.956z\\"/>\\n\\t\\t</g>\\n\\t</g>\\n</g>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_TpMYEkB5": {
      "type": "splunk.area",
      "dataSources": {
        "primary": "ds_rGSz2MYl_ds_4mOwD3RM"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "xAxisTitleVisibility": "hide",
        "areaOpacity": 0.3,
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#33bbff"
        ]
      }
    },
    "viz_9Iq3Ho2c": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# 39",
        "fontColor": "#66ccff"
      }
    },
    "viz_e7ryxnmM": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## S3",
        "fontColor": "#66ccff"
      }
    },
    "viz_kK2mKdcM": {
      "type": "splunk.area",
      "dataSources": {
        "primary": "ds_p4lS4L3l_ds_4mOwD3RM"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "xAxisTitleVisibility": "hide",
        "areaOpacity": 0.3,
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#33bbff"
        ]
      }
    },
    "viz_CjXoU5p4": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.1,
        "fillColor": "#b3e6ff"
      }
    },
    "viz_irWsuA6a": {
      "type": "splunk.area",
      "dataSources": {
        "primary": "ds_9J08owpb_ds_4mOwD3RM"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "xAxisTitleVisibility": "hide",
        "areaOpacity": 0.3,
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#33bbff"
        ],
        "xAxisLabelVisibility": "hide",
        "yAxisLabelVisibility": "hide",
        "xAxisMajorTickVisibility": "hide"
      }
    },
    "viz_BVqVoowS": {
      "type": "splunk.rectangle",
      "options": {
        "strokeDashStyle": 5,
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.3,
        "fillColor": "transparent"
      }
    },
    "viz_JAaGxkEk": {
      "type": "splunk.singlevalueicon",
      "options": {
        "showValue": false,
        "iconOpacity": 0.75,
        "iconColor": "#33bbff",
        "icon": "splunk-enterprise-kvstore://5ea105218cd259125c007815"
      }
    },
    "viz_nJHV8lQR": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.25
      }
    },
    "viz_0vIVqVO0": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_BsHAnYvJ": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.25
      }
    },
    "viz_id0oWoXr": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### C3",
        "fontColor": "#b3e6ff"
      }
    },
    "viz_J2bFCAuJ": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.25
      }
    },
    "viz_mboIcjjc": {
      "type": "abslayout.line",
      "options": {
        "strokeDashStyle": 35,
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.1
      }
    },
    "viz_3ZQhbQAx": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### C4",
        "fontColor": "#b3e6ff"
      }
    },
    "viz_vOQ8XzHU": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_7K3blbjR": {
      "type": "abslayout.line",
      "options": {
        "strokeDashStyle": 35,
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.1
      }
    },
    "viz_VRABYHOO": {
      "type": "splunk.ellipse",
      "options": {
        "strokeColor": "#b3e6ff",
        "fillOpacity": 0.1,
        "strokeOpacity": 0.7,
        "fillColor": "transparent"
      }
    },
    "viz_WvHN3ekQ": {
      "type": "splunk.rectangle",
      "options": {
        "strokeDashStyle": 5,
        "rx": 25,
        "strokeOpacity": 0.25,
        "strokeColor": "#b3e6ff",
        "fillOpacity": 0.15,
        "fillColor": "#b3e6ff"
      }
    },
    "viz_9YL9FZe4": {
      "dataSources": {
        "primary": "ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_Xk0YL63C": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# 12",
        "fontColor": "#66ccff"
      }
    },
    "viz_wZTy8R1t": {
      "type": "abslayout.line",
      "options": {
        "strokeDashStyle": 10,
        "strokeColor": "#ffffff",
        "strokeOpacity": 0.25
      }
    },
    "viz_OteP5baI": {
      "type": "splunk.area",
      "dataSources": {
        "primary": "ds_4mOwD3RM"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "xAxisTitleVisibility": "hide",
        "areaOpacity": 0.3,
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#33bbff"
        ]
      }
    },
    "viz_UjvrShg1": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "#0088cc",
        "fillOpacity": 0.15,
        "strokeOpacity": 0.3,
        "fillColor": "#0088cc"
      }
    },
    "viz_33KGroRU": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Active",
        "fontColor": "#33bbff"
      }
    },
    "viz_caT0WJ1L": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_R7zbrn9I": {
      "dataSources": {
        "primary": "ds_4PRjLIiF_ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_5Eoltxfg": {
      "type": "splunk.column",
      "dataSources": {
        "primary": "ds_5M2VSpae_ds_5LZFWQm5_ds_t3tyfKVl_ds_gJTl2haQ"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "yAxisLabelVisibility": "hide",
        "yAxisMin": "0",
        "xAxisTitleVisibility": "hide",
        "xAxisLabelVisibility": "hide",
        "yAxisMax": "100",
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#0088cc"
        ]
      }
    },
    "viz_NC3Gi3in": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 7,
        "strokeColor": "#708794",
        "fillOpacity": 0.1,
        "strokeOpacity": 0.5,
        "fillColor": "#0877a6"
      }
    },
    "viz_2zxg601S": {
      "type": "splunk.ellipse",
      "options": {
        "strokeColor": "#b3e6ff",
        "fillOpacity": 0.1,
        "strokeOpacity": 0.7,
        "fillColor": "transparent"
      }
    },
    "viz_c3tSRD8A": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_k3DjBpKg": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.5
      }
    },
    "viz_xUgE6oZl": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_d6PX1UnE": {
      "dataSources": {
        "primary": "ds_K3I9yf4j"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"121.4\\" height=\\"6.3294\\" version=\\"1.1\\" viewBox=\\"0 0 121.4 6.3294\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <rect id=\\"db1\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db2\\" x=\\"20.566\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db3\\" x=\\"41.132\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db4\\" x=\\"61.698\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db5\\" x=\\"82.265\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db6\\" x=\\"102.83\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n</svg>\\n",
        "areaIds": "> primary | seriesByIndex('0')",
        "areaValues": "> primary | seriesByName('value')",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264D",
            "to": 50
          },
          {
            "value": "#33BBFF",
            "from": 50
          }
        ]
      }
    },
    "viz_6cNXiDrO": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q2",
        "fontColor": "#ffffff"
      }
    },
    "viz_ZsTaXxab": {
      "dataSources": {
        "primary": "ds_9aLOivaD_ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"121.4\\" height=\\"6.3294\\" version=\\"1.1\\" viewBox=\\"0 0 121.4 6.3294\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <rect id=\\"db1\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db2\\" x=\\"20.566\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db3\\" x=\\"41.132\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db4\\" x=\\"61.698\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db5\\" x=\\"82.265\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db6\\" x=\\"102.83\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n</svg>\\n",
        "areaIds": "> primary | seriesByIndex('0')",
        "areaValues": "> primary | seriesByName('value')",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264D",
            "to": 50
          },
          {
            "value": "#33BBFF",
            "from": 50
          }
        ]
      }
    },
    "viz_lJkuUB1K": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.5
      }
    },
    "viz_ZjOQtffW": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc"
      }
    },
    "viz_M2TTZpbN": {
      "dataSources": {
        "primary": "ds_GU2vAA0o_ds_4PRjLIiF_ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_y4w96fPz": {
      "dataSources": {
        "primary": "ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_lQ2GdCle": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.25
      }
    },
    "viz_rl34s5WJ": {
      "type": "splunk.singlevalue",
      "options": {
        "unit": "",
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_YG5eoOOK_ds_Gr9vlHdv_ds_kSWvmiN8"
      }
    },
    "viz_ltMLfSPj": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q12",
        "fontColor": "#ffffff"
      }
    },
    "viz_ugEYd0eY": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q9",
        "fontColor": "#ffffff"
      }
    },
    "viz_Cw6atIW8": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Physical Spaces & Factories",
        "fontColor": "#33bbff"
      }
    },
    "viz_SNnGiWci": {
      "dataSources": {
        "primary": "ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"121.4\\" height=\\"6.3294\\" version=\\"1.1\\" viewBox=\\"0 0 121.4 6.3294\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <rect id=\\"db1\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db2\\" x=\\"20.566\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db3\\" x=\\"41.132\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db4\\" x=\\"61.698\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db5\\" x=\\"82.265\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db6\\" x=\\"102.83\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n</svg>\\n",
        "areaIds": "> primary | seriesByIndex('0')",
        "areaValues": "> primary | seriesByName('value')",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264D",
            "to": 50
          },
          {
            "value": "#33BBFF",
            "from": 50
          }
        ]
      }
    },
    "viz_Xo1U1RE3": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Development Productivity",
        "fontColor": "#33bbff"
      }
    },
    "viz_S5HnNUQH": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_cOtK7dOj": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "## S1",
        "fontColor": "#66ccff"
      }
    },
    "viz_OQpOAgBs": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.1,
        "fillColor": "#66ccff"
      }
    },
    "viz_LBJFmfYX": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q6",
        "fontColor": "#ffffff"
      }
    },
    "viz_l6eKbtND": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q10",
        "fontColor": "#ffffff"
      }
    },
    "viz_za7b3qj3": {
      "dataSources": {
        "primary": "ds_yVqC7I0D"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?> <svg id=\\"svg4835\\" width=\\"128\\" height=\\"124\\" version=\\"1.1\\" viewBox=\\"0 0 128 124\\" xmlns=\\"http://www.w3.org/2000/svg\\">  <path id=\\"paris_r20\\" d=\\"M35 0L45.3923 6V18L35 24L24.6077 18V6L35 0Z\\" fill=\\"#5746F6\\"/>  <path id=\\"paris_r21\\" d=\\"M58 0L68.3923 6V18L58 24L47.6077 18V6L58 0Z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r22\\" d=\\"M81 0L91.3923 6V18L81 24L70.6077 18V6L81 0Z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r15\\" d=\\"m23.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r16\\" d=\\"m46.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r17\\" d=\\"m69.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#C625FF\\"/>  <path id=\\"paris_r18\\" d=\\"m92.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#5746F6\\"/>  <path id=\\"paris_r10\\" d=\\"M12 40L22.3923 46V58L12 64L1.6077 58V46L12 40Z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r11\\" d=\\"M35 40L45.3923 46V58L35 64L24.6077 58V46L35 40Z\\" fill=\\"#5746F6\\"/>  <path id=\\"paris_r12\\" d=\\"M58 40L68.3923 46V58L58 64L47.6077 58V46L58 40Z\\" fill=\\"#7D40FF\\"/>  <path id=\\"paris_r13\\" d=\\"M81 40L91.3923 46V58L81 64L70.6077 58V46L81 40Z\\" fill=\\"#5746F6\\"/>  <path id=\\"paris_r14\\" d=\\"M104 40L114.392 46V58L104 64L93.6077 58V46L104 40Z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r6\\" d=\\"m23.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#5746F6\\"/>  <path id=\\"paris_r7\\" d=\\"m46.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#C625FF\\"/>  <path id=\\"paris_r8\\" d=\\"m69.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#C625FF\\"/>  <path id=\\"paris_r9\\" d=\\"m92.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r19\\" d=\\"m115.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r2\\" d=\\"M35 80L45.3923 86V98L35 104L24.6077 98V86L35 80Z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r1\\" d=\\"m23.5 100 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r3\\" d=\\"M58 80L68.3923 86V98L58 104L47.6077 98V86L58 80Z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r5\\" d=\\"M104 80L114.392 86V98L104 104L93.6077 98V86L104 80Z\\" fill=\\"#304BEC\\" opacity=\\".6\\"/>  <path id=\\"paris_r4\\" d=\\"M81 80L91.3923 86V98L81 104L70.6077 98V86L81 80Z\\" fill=\\"#5746F6\\"/> </svg> ",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "from": 97,
            "value": "#ff0000"
          },
          {
            "to": 97,
            "from": 90,
            "value": "#0066cc"
          },
          {
            "to": 90,
            "from": 80,
            "value": "#0080ff"
          },
          {
            "to": 80,
            "from": 60,
            "value": "#3399ff"
          },
          {
            "to": 60,
            "from": 40,
            "value": " #66b3ff"
          },
          {
            "to": 40,
            "from": 20,
            "value": "#99ccff"
          },
          {
            "to": 20,
            "from": 1,
            "value": "#cce6ff"
          },
          {
            "to": 1,
            "value": "#ffffff"
          }
        ]
      }
    },
    "viz_3ypj3McP": {
      "dataSources": {
        "primary": "ds_wTbPM0W2"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"66.784\\" height=\\"64\\" version=\\"1.1\\" viewBox=\\"0 0 66.784 64\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"eu1\\" d=\\"m21.892 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"eu2\\" d=\\"m44.892 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"eu3\\" d=\\"m10.392 20 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"eu4\\" d=\\"m33.392 20 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"eu5\\" d=\\"m56.392 20 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#ccc\\" opacity=\\".5\\"/>\\n <path id=\\"eu6\\" d=\\"m21.892 40 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"eu7\\" d=\\"m44.892 40 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "from": 97,
            "value": "#ff0000"
          },
          {
            "to": 97,
            "from": 90,
            "value": "#0066cc"
          },
          {
            "to": 90,
            "from": 80,
            "value": "#0080ff"
          },
          {
            "to": 80,
            "from": 60,
            "value": "#3399ff"
          },
          {
            "to": 60,
            "from": 40,
            "value": " #66b3ff"
          },
          {
            "to": 40,
            "from": 20,
            "value": "#99ccff"
          },
          {
            "to": 20,
            "from": 1,
            "value": "#cce6ff"
          },
          {
            "to": 1,
            "value": "#ffffff"
          }
        ]
      }
    },
    "viz_o0JfSwvC": {
      "type": "splunk.singlevalue",
      "options": {
        "majorValue": "> sparklineValues | lastPoint()",
        "trendValue": "> sparklineValues | delta(-2)",
        "sparklineValues": "> primary | seriesByName('count')",
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_5igfRVhd"
      },
      "context": {}
    },
    "viz_kxJR2u7Y": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "# 26",
        "fontColor": "#66ccff"
      }
    },
    "viz_RCMvidCo": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_AFXN6vBD": {
      "dataSources": {
        "primary": "ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_tpHIgEUx": {
      "dataSources": {
        "primary": "ds_n0IOFPlX"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"128\\" height=\\"124\\" version=\\"1.1\\" viewBox=\\"0 0 128 124\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"sa_1\\" d=\\"M35 0L45.3923 6V18L35 24L24.6077 18V6L35 0Z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"sa_2\\" d=\\"M58 0L68.3923 6V18L58 24L47.6077 18V6L58 0Z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"sa_3\\" d=\\"m46.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"sa_4\\" d=\\"m69.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"sa_5\\" d=\\"m92.5 20 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"sa_6\\" d=\\"M58 40L68.3923 46V58L58 64L47.6077 58V46L58 40Z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"sa_7\\" d=\\"M81 40L91.3923 46V58L81 64L70.6077 58V46L81 40Z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"sa_8\\" d=\\"m46.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"sa_9\\" d=\\"m69.5 60 10.392 6v12l-10.392 6-10.392-6v-12l10.392-6z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n <path id=\\"sa_10\\" d=\\"M35 80L45.3923 86V98L35 104L24.6077 98V86L35 80Z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "from": 97,
            "value": "#ff0000"
          },
          {
            "to": 97,
            "from": 90,
            "value": "#0066cc"
          },
          {
            "to": 90,
            "from": 80,
            "value": "#0080ff"
          },
          {
            "to": 80,
            "from": 60,
            "value": "#3399ff"
          },
          {
            "to": 60,
            "from": 40,
            "value": " #66b3ff"
          },
          {
            "to": 40,
            "from": 20,
            "value": "#99ccff"
          },
          {
            "to": 20,
            "from": 1,
            "value": "#cce6ff"
          },
          {
            "to": 1,
            "value": "#ffffff"
          }
        ]
      }
    },
    "viz_py2Bu08r": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"iso-8859-1\\"?>\\n<!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\\n<!DOCTYPE svg PUBLIC \\"-//W3C//DTD SVG 1.1//EN\\" \\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\\">\\n<svg version=\\"1.1\\" id=\\"Capa_1\\" xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" x=\\"0px\\" y=\\"0px\\"\\n\\t viewBox=\\"0 0 297 297\\" style=\\"enable-background:new 0 0 297 297;\\" xml:space=\\"preserve\\">\\n<g>\\n\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M166.264,259C166.267,259,166.262,259,166.264,259c24.646,0,50.552-6.369,71.899-18.432\\n\\t\\tc2.737-1.547,4.594-4.283,5.019-7.398c0.425-3.115-0.631-6.25-2.855-8.473l-66.434-66.443c9.732-13.521,8.528-32.537-3.625-44.694\\n\\t\\tc-12.152-12.152-31.166-13.356-44.686-3.623L59.151,43.495c-2.223-2.224-5.358-3.279-8.474-2.854\\n\\t\\tc-3.115,0.425-5.854,2.282-7.399,5.02c-28.422,50.313-23.286,112.725,11.358,157.69l-40.393,79.091\\n\\t\\tc-1.559,3.118-1.392,6.822,0.441,9.788c1.833,2.966,5.071,4.771,8.558,4.771h132.963c5.556,0,10.06-4.504,10.06-10.06V259z\\n\\t\\t M156.04,127.786c4.256,4.256,5.307,10.52,3.157,15.77l-18.919-18.923C145.527,122.482,151.788,123.532,156.04,127.786z\\n\\t\\t M146.145,276.88H39.518l29.003-58.015c21.534,20.814,48.478,34.097,77.624,38.509V276.88z M167.859,238.887\\n\\t\\tc-0.002,0-0.006,0-0.008,0c-32.827-0.002-63.688-12.786-86.896-35.997c-35.689-35.695-45.609-89.648-26.126-135.261\\n\\t\\tl161.364,161.385C200.996,235.501,184.521,238.887,167.859,238.887z\\"/>\\n\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M153.607,73.852c31.08,0,56.366,25.289,56.367,56.375c0,5.556,4.505,10.06,10.06,10.06c5.557,0,10.061-4.505,10.061-10.06\\n\\t\\tc-0.001-42.18-34.313-76.495-76.487-76.495c-5.556,0-10.059,4.504-10.059,10.06C143.548,69.347,148.052,73.852,153.607,73.852z\\"/>\\n\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M153.607,0c-5.556,0-10.059,4.504-10.059,10.06c0,5.556,4.503,10.061,10.059,10.061\\n\\t\\tc60.704,0.001,110.091,49.394,110.091,110.106c0,5.555,4.504,10.06,10.06,10.06c5.556,0,10.061-4.505,10.061-10.06\\n\\t\\tC283.818,58.42,225.405,0.001,153.607,0z\\"/>\\n</g>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_XHnq1xdZ": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 36,
        "strokeWidth": 8,
        "strokeOpacity": 0.5,
        "strokeColor": "#33bbff",
        "fillOpacity": 0.1,
        "fillColor": "transparent"
      }
    },
    "viz_YlO8L7gw": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### System Core Status",
        "fontColor": "#33bbff"
      }
    },
    "viz_cwEdxiZv": {
      "type": "splunk.ellipse",
      "options": {
        "strokeDashStyle": 36,
        "strokeWidth": 8,
        "strokeOpacity": 0.5,
        "strokeColor": "#33bbff",
        "fillOpacity": 0.1,
        "fillColor": "transparent"
      }
    },
    "viz_8f3mMXaR": {
      "type": "splunk.singlevalueicon",
      "options": {
        "showValue": false,
        "iconOpacity": 0.15,
        "iconColor": "#33bbff",
        "icon": "splunk-enterprise-kvstore://5e14b52f8cd2594970000d81"
      }
    },
    "viz_kW06KOQU": {
      "dataSources": {
        "primary": "ds_AIl6nHhg_ds_hXlCS66A_ds_G4RzAICA_ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_FpwNj5Td": {
      "type": "splunk.column",
      "dataSources": {
        "primary": "ds_gJTl2haQ"
      },
      "options": {
        "yAxisAbbreviation": "off",
        "y2AxisAbbreviation": "off",
        "showRoundedY2AxisLabels": false,
        "legendTruncation": "ellipsisMiddle",
        "showY2MajorGridLines": true,
        "yAxisLabelVisibility": "hide",
        "yAxisMin": "0",
        "xAxisTitleVisibility": "hide",
        "xAxisLabelVisibility": "hide",
        "yAxisMax": "100",
        "backgroundColor": "transparent",
        "yAxisTitleVisibility": "hide",
        "legendDisplay": "off",
        "seriesColors": [
          "#0088cc"
        ]
      }
    },
    "viz_52R5i9Cn": {
      "dataSources": {
        "primary": "ds_23Y7IQ2F_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_VLqYQ7rf": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "#0088cc",
        "fillOpacity": 0.15,
        "strokeOpacity": 0.3,
        "fillColor": "#0088cc"
      }
    },
    "viz_XA3upIJc": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_MKvNZCl8": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillOpacity": 0.1,
        "fillColor": "#b3e6ff"
      }
    },
    "viz_RdHDIpRO": {
      "type": "abslayout.line",
      "options": {
        "strokeDashStyle": 2,
        "toArrow": true,
        "strokeColor": "#66ccff",
        "strokeWidth": 2
      }
    },
    "viz_rTwXNiJg": {
      "dataSources": {
        "primary": "ds_vjB24jfv_ds_9aLOivaD_ds_7Wwo6EIX_ds_H8NOqzR9_ds_LdOni4XJ_ds_K3I9yf4j"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"121.4\\" height=\\"6.3294\\" version=\\"1.1\\" viewBox=\\"0 0 121.4 6.3294\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <rect id=\\"db1\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db2\\" x=\\"20.566\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db3\\" x=\\"41.132\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db4\\" x=\\"61.698\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db5\\" x=\\"82.265\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db6\\" x=\\"102.83\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n</svg>\\n",
        "areaIds": "> primary | seriesByIndex('0')",
        "areaValues": "> primary | seriesByName('value')",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264D",
            "to": 50
          },
          {
            "value": "#33BBFF",
            "from": 50
          }
        ]
      }
    },
    "viz_wLbsP1FT": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#33bbff",
        "strokeWidth": 2,
        "strokeOpacity": 0.25
      }
    },
    "viz_Aac4QR5L": {
      "type": "abslayout.line",
      "options": {
        "strokeDashStyle": 35,
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.1
      }
    },
    "viz_V4m4cqBS": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_oThM5Kp1": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#708794"
      }
    },
    "viz_FkJwGPxc": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"iso-8859-1\\"?>\\n<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\\n<svg version=\\"1.1\\" id=\\"Layer_1\\" xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" x=\\"0px\\" y=\\"0px\\"\\n\\t viewBox=\\"0 0 512 512\\" style=\\"enable-background:new 0 0 512 512;\\" xml:space=\\"preserve\\">\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"188.176\\" y=\\"88.158\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"239.898\\" y=\\"88.158\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"291.631\\" y=\\"88.158\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"188.176\\" y=\\"138.836\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"239.898\\" y=\\"138.836\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"291.631\\" y=\\"138.836\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"188.176\\" y=\\"189.513\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"239.898\\" y=\\"189.513\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"291.631\\" y=\\"189.513\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"188.176\\" y=\\"240.191\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"239.898\\" y=\\"240.191\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<rect fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" x=\\"291.631\\" y=\\"240.191\\" width=\\"32.193\\" height=\\"32.193\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\"  d=\\"M460.727,455.199V155.355h-77.322V25.454H128.596v129.902H51.273v299.844H0v31.347h51.273h77.322h31.347h54.784h82.547\\n\\t\\t\\th54.784h31.347h77.322H512v-31.347H460.727z M128.596,455.199H82.62V186.702h45.975V455.199z M265.927,455.199h-19.853v-68.208\\n\\t\\t\\th19.853V455.199z M352.057,455.199h-54.784v-99.555h-82.547v99.555h-54.784V331.073h192.115V455.199z M352.057,155.354v144.37\\n\\t\\t\\tH159.943V155.355V56.801h192.115V155.354z M429.38,455.199h-45.975V186.702h45.975V455.199z\\"/>\\n\\t</g>\\n</g>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_07lPI206": {
      "type": "splunk.singlevalue",
      "options": {
        "unit": "",
        "backgroundColor": "transparent"
      },
      "dataSources": {
        "primary": "ds_1jrijlbw_ds_Gr9vlHdv_ds_kSWvmiN8"
      }
    },
    "viz_8qsaDMI2": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "transparent",
        "fillColor": "transparent"
      }
    },
    "viz_tMWQNGqW": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Uplink Speed",
        "fontColor": "#33bbff"
      }
    },
    "viz_rkTwmxqy": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeOpacity": 0.2
      }
    },
    "viz_I2Asq2kq": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Downlink Speed",
        "fontColor": "#33bbff"
      }
    },
    "viz_bmip44hU": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q5",
        "fontColor": "#ffffff"
      }
    },
    "viz_QySuhsxj": {
      "type": "splunk.singlevalueicon",
      "options": {
        "showValue": false,
        "iconOpacity": 0.5,
        "iconColor": "#33bbff",
        "icon": "splunk-enterprise-kvstore://5e163f308cd25947b8002e0d"
      }
    },
    "viz_iSgxizfn": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Core Component (Cx) Load",
        "fontColor": "#33bbff"
      }
    },
    "viz_m5HUgtFy": {
      "dataSources": {
        "primary": "ds_LdOni4XJ_ds_K3I9yf4j"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"121.4\\" height=\\"6.3294\\" version=\\"1.1\\" viewBox=\\"0 0 121.4 6.3294\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <rect id=\\"db1\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db2\\" x=\\"20.566\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db3\\" x=\\"41.132\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db4\\" x=\\"61.698\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db5\\" x=\\"82.265\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n <rect id=\\"db6\\" x=\\"102.83\\" width=\\"18.566\\" height=\\"6.3294\\" fill=\\"#b3b3b3\\" opacity=\\".75\\"/>\\n</svg>\\n",
        "areaIds": "> primary | seriesByIndex('0')",
        "areaValues": "> primary | seriesByName('value')",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264D",
            "to": 50
          },
          {
            "value": "#33BBFF",
            "from": 50
          }
        ]
      }
    },
    "viz_oYZmhRdA": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Critical",
        "fontColor": "#33bbff"
      }
    },
    "viz_FUzdcnlC": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.5
      }
    },
    "viz_6IqAXd9r": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#708794"
      }
    },
    "viz_0GVJCycZ": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#0088cc",
        "strokeWidth": 2,
        "strokeOpacity": 0.25
      }
    },
    "viz_5XC93DLs": {
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"iso-8859-1\\"?>\\n<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\\n<svg version=\\"1.1\\" id=\\"Layer_1\\" xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" x=\\"0px\\" y=\\"0px\\"\\n\\t viewBox=\\"0 0 512 512\\" style=\\"enable-background:new 0 0 512 512;\\" xml:space=\\"preserve\\">\\n<g>\\n\\t<g>\\n\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\"  d=\\"M409.6,307.2H256c-14.14,0-25.6,11.46-25.6,25.6v25.6c0,14.14,11.46,25.6,25.6,25.6h153.6c14.14,0,25.6-11.46,25.6-25.6\\n\\t\\t\\tv-25.6C435.2,318.66,423.74,307.2,409.6,307.2z M409.6,358.4H256v-25.6h153.6V358.4z\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M409.6,204.8H256c-14.14,0-25.6,11.46-25.6,25.6V256c0,14.14,11.46,25.6,25.6,25.6h153.6c14.14,0,25.6-11.46,25.6-25.6\\n\\t\\t\\tv-25.6C435.2,216.26,423.74,204.8,409.6,204.8z M409.6,256H256v-25.6h153.6V256z\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M140.8,51.2H89.6c-7.074,0-12.8,5.726-12.8,12.8v51.2c0,7.074,5.726,12.8,12.8,12.8h51.2c7.074,0,12.8-5.726,12.8-12.8V64\\n\\t\\t\\tC153.6,56.926,147.874,51.2,140.8,51.2z M128,102.4h-25.6V76.8H128V102.4z\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M243.2,51.2H192c-7.074,0-12.8,5.726-12.8,12.8v51.2c0,7.074,5.726,12.8,12.8,12.8h51.2c7.074,0,12.8-5.726,12.8-12.8V64\\n\\t\\t\\tC256,56.926,250.274,51.2,243.2,51.2z M230.4,102.4h-25.6V76.8h25.6V102.4z\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M140.8,153.6H89.6c-7.074,0-12.8,5.726-12.8,12.8v51.2c0,7.074,5.726,12.8,12.8,12.8h51.2c7.074,0,12.8-5.726,12.8-12.8\\n\\t\\t\\tv-51.2C153.6,159.326,147.874,153.6,140.8,153.6z M128,204.8h-25.6v-25.6H128V204.8z\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M140.8,256H89.6c-7.074,0-12.8,5.726-12.8,12.8V320c0,7.074,5.726,12.8,12.8,12.8h51.2c7.074,0,12.8-5.726,12.8-12.8\\n\\t\\t\\tv-51.2C153.6,261.726,147.874,256,140.8,256z M128,307.2h-25.6v-25.6H128V307.2z\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M140.8,358.4H89.6c-7.074,0-12.8,5.726-12.8,12.8v51.2c0,7.074,5.726,12.8,12.8,12.8h51.2c7.074,0,12.8-5.726,12.8-12.8\\n\\t\\t\\tv-51.2C153.6,364.126,147.874,358.4,140.8,358.4z M128,409.6h-25.6V384H128V409.6z\\"/>\\n\\t</g>\\n</g>\\n<g>\\n\\t<g>\\n\\t\\t<path fill=\\"#33bbff\\" fill-opacity=\\"0.75\\" d=\\"M499.2,486.4h-12.8V179.2c0-14.14-11.46-25.6-25.6-25.6h-256c-14.14,0-25.6,11.46-25.6,25.6v307.2h-128V25.6h230.4V128\\n\\t\\t\\th25.6V25.6c0-14.14-11.46-25.6-25.6-25.6H51.2C37.06,0,25.6,11.46,25.6,25.6v460.8H12.8c-7.074,0-12.8,5.726-12.8,12.8\\n\\t\\t\\tc0,7.074,5.726,12.8,12.8,12.8h486.4c7.074,0,12.8-5.726,12.8-12.8C512,492.126,506.274,486.4,499.2,486.4z M307.2,486.4H256\\n\\t\\t\\tv-51.2h51.2V486.4z M409.6,486.4H384v-51.2h25.6V486.4z M460.8,486.4h-25.6v-51.2c0-14.14-11.46-25.6-25.6-25.6H384\\n\\t\\t\\tc-14.14,0-25.6,11.46-25.6,25.6v51.2h-25.6v-51.2c0-14.14-11.46-25.6-25.6-25.6H256c-14.14,0-25.6,11.46-25.6,25.6v51.2h-25.6\\n\\t\\t\\tV179.2h256V486.4z\\"/>\\n\\t</g>\\n</g>\\n</svg>\\n",
        "backgroundColor": "transparent"
      }
    },
    "viz_Ix6tLqHj": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "###  Q8",
        "fontColor": "#ffffff"
      }
    },
    "viz_fbU6ZSsd": {
      "dataSources": {
        "primary": "ds_LV8ElDGY_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_qxiUvjfi": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.5
      }
    },
    "viz_4FsKZQAR": {
      "type": "abslayout.line",
      "options": {
        "strokeColor": "#66ccff",
        "strokeOpacity": 0.5
      }
    },
    "viz_vHvy38CF": {
      "dataSources": {
        "primary": "ds_CLKpslO4_ds_LV8ElDGY_ds_7FWdqZwE"
      },
      "type": "splunk.choropleth.svg",
      "options": {
        "svg": "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<svg id=\\"svg4835\\" width=\\"20.784\\" height=\\"24\\" version=\\"1.1\\" viewBox=\\"0 0 20.784 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n <path id=\\"node\\" d=\\"m10.392 0 10.392 6v12l-10.392 6-10.392-6v-12z\\" fill=\\"#b3b3b3\\" opacity=\\".5\\"/>\\n</svg>\\n",
        "backgroundColor": "transparent",
        "areaColors": "> areaValues | rangeValue(areaColorsEditorConfig)"
      },
      "encoding": {
        "featureId": "primary[0]",
        "value": "primary[1]",
        "fillColor": {
          "field": "primary[1]",
          "format": {
            "ranges": [
              {
                "from": 50,
                "value": "#33bbff"
              },
              {
                "to": 50,
                "from": 0,
                "value": "#00264d"
              }
            ],
            "type": "rangevalue"
          }
        }
      },
      "context": {
        "areaColorsEditorConfig": [
          {
            "value": "#00264d",
            "to": 50
          },
          {
            "value": "#33bbff",
            "from": 50
          }
        ]
      }
    },
    "viz_FCFXfCqE": {
      "type": "splunk.singlevalueicon",
      "options": {
        "showValue": false,
        "iconOpacity": 0.75,
        "iconColor": "#33bbff",
        "icon": "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjQzIiB2aWV3Qm94PSIwIDAgNjAgNDMiIHdpZHRoPSI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Im0xMi4xMTE0IDkuMzM5MzRjMS45NTUgMCAzLjUzOTgtMS41ODQ4MyAzLjUzOTgtMy41Mzk4MyAwLTEuOTU0OTktMS41ODQ4LTMuNTM5ODMtMy41Mzk4LTMuNTM5ODNzLTMuNTM5ODIgMS41ODQ4NC0zLjUzOTgyIDMuNTM5ODNjMCAxLjk1NSAxLjU4NDgyIDMuNTM5ODMgMy41Mzk4MiAzLjUzOTgzem0wIDIuMTM2NjZjMy4xMzUgMCA1LjY3NjUtMi41NDE0NiA1LjY3NjUtNS42NzY0OSAwLTMuMTM1MDItMi41NDE1LTUuNjc2NDYzLTUuNjc2NS01LjY3NjQ2My0zLjEzNTAyIDAtNS42NzY0NiAyLjU0MTQ0My01LjY3NjQ2IDUuNjc2NDYzIDAgMy4xMzUwMyAyLjU0MTQ0IDUuNjc2NDkgNS42NzY0NiA1LjY3NjQ5em0tNi4xODg4OCAyLjcyNTNjLjg0ODk1LS41MzA2IDEuODI5OTItLjgxMTkgMi44MzEwNC0uODExOWg3LjIzODQ0Yy42OTk5IDAgMS4zOS4xMzc1IDIuMDMxOS40MDE2LS4xNTE3LjczNy0uMjM0NyAxLjQ5OTEtLjI0MTggMi4yNzk0bC0uMDkxNS0uMDU3MmMtLjUwOTQtLjMxODQtMS4wOTgtLjQ4NzItMS42OTg2LS40ODcyaC03LjIzODQ0Yy0uNjAwNjcgMC0xLjE4OTI2LjE2ODgtMS42OTg2Mi40ODcybC0zLjQxMTk3IDIuMTMyNWMtLjkzNzA3LjU4NTYtMS41MDYzMyAxLjYxMjctMS41MDYzMyAyLjcxNzd2Mi43NjIxYzAgLjU5LjQ3ODMgMS4wNjgzIDEuMDY4MzEgMS4wNjgzaDE2LjE5ODk1Yy4zNTMyIDAgLjY5MzEtLjA1NzEgMS4wMTA5LS4xNjI2LS4wNzI2LjA0MjQtLjE0NDUuMDg1OS0uMjE1OS4xMzA1bC0zLjQ3IDIuMTY4OGgtMTMuNTIzOTVjLTEuNzcwMDUgMC0zLjIwNDk1LTEuNDM0OS0zLjIwNDk1LTMuMjA1di0yLjc2MjFjMC0xLjg0MTcuOTQ4NzcxLTMuNTUzNSAyLjUxMDU1LTQuNTI5NnptMjkuMzMyNTggNi44ODAzdi4wMDA2Yy45OTI2LTEuMTUxMSAxLjY0MTktMi42MDY3IDEuNzg4Ny00LjIwNzYtLjAwMDIuMDAwMi0uMDAwNC4wMDA0LS4wMDA2LjAwMDUuMDIxLS4yMjg4LjAzMTctLjQ2MDcuMDMxNy0uNjk1MSAwLTQuMTQ3OC0zLjM2MjUtNy41MTAyNi03LjUxMDMtNy41MTAyNnMtNy41MTAzIDMuMzYyNDYtNy41MTAzIDcuNTEwMjZjMCA0LjE0NzkgMy4zNjI1IDcuNTEwMyA3LjUxMDMgNy41MTAzIDIuMjc0NyAwIDQuMzEzMi0xLjAxMTIgNS42OTA1LTIuNjA4N3ptMjEuNTQwNSA1Ljc0ODloLTEzLjY5ODdsLTMuNDctMi4xNjg4Yy0uNDAyNi0uMjUxNi0uODIzNy0uNDY4Mi0xLjI1ODctLjY0ODQuMDM2LS4wNDA0LjA3MTctLjA4MS4xMDcxLS4xMjE5LjU2NTIuNDk5NCAxLjMwNzkuODAyNCAyLjEyMTMuODAyNGgxNi4xOTljLjU5IDAgMS4wNjgzLS40NzgzIDEuMDY4My0xLjA2ODN2LTIuNzYyMWMwLTEuMTA1LS41NjkyLTIuMTMyMS0xLjUwNjMtMi43MTc3bC0zLjQxMi0yLjEzMjVjLS41MDkzLS4zMTg0LTEuMDk3OS0uNDg3Mi0xLjY5ODYtLjQ4NzJoLTcuMjM4NGMtLjYwMDcgMC0xLjE4OTIuMTY4OC0xLjY5ODYuNDg3MmwtLjk2OTIuNjA1N2MuMDA1My0uMTQ1Ny4wMDgtLjI5Mi4wMDgtLjQzOSAwLS42NzU0LS4wNTY4LTEuMzM3NS0uMTY2LTEuOTgxOS44NDc4LS41Mjg0IDEuODI2OC0uODA4NiAyLjgyNTgtLjgwODZoNy4yMzg0YzEuMDAxMSAwIDEuOTgyMS4yODEzIDIuODMxLjgxMTlsMy40MTIgMi4xMzI1YzEuNTYxOC45NzYxIDIuNTEwNiAyLjY4NzkgMi41MTA2IDQuNTI5NnYyLjc2MjFjMCAxLjc3LTEuNDM0OSAzLjIwNS0zLjIwNSAzLjIwNXptLTkuNDI5MS0xNy40OTExNmMxLjk1NSAwIDMuNTM5OC0xLjU4NDgzIDMuNTM5OC0zLjUzOTgzIDAtMS45NTQ5OS0xLjU4NDgtMy41Mzk4My0zLjUzOTgtMy41Mzk4M3MtMy41Mzk5IDEuNTg0ODQtMy41Mzk5IDMuNTM5ODNjMCAxLjk1NSAxLjU4NDkgMy41Mzk4MyAzLjUzOTkgMy41Mzk4M3ptMCAyLjEzNjY2YzMuMTM1IDAgNS42NzY0LTIuNTQxNDYgNS42NzY0LTUuNjc2NDkgMC0zLjEzNTAyLTIuNTQxNC01LjY3NjQ2My01LjY3NjQtNS42NzY0NjMtMy4xMzUxIDAtNS42NzY1IDIuNTQxNDQzLTUuNjc2NSA1LjY3NjQ2MyAwIDMuMTM1MDMgMi41NDE0IDUuNjc2NDkgNS42NzY1IDUuNjc2NDl6bS0yNC4zNTA1IDE2LjQ2NDZjLjMxNzktLjE5ODcuNjg1Mi0uMzA0IDEuMDYtLjMwNGgxMS42NzI2Yy4zNzQ5IDAgLjc0MjIuMTA1MyAxLjA2LjMwNGw3LjEyMDEgNC40NWMuNTg0OC4zNjU1Ljk0MDEgMS4wMDY1Ljk0MDEgMS42OTZ2Ny41MDY0YzAgLjU1MjMtLjQ0NzggMS0xIDFoLTI3LjkxMjljLS41NTIzIDAtMS0uNDQ3Ny0xLTF2LTcuNTA2NGMwLS42ODk1LjM1NTItMS4zMzA1Ljk0LTEuNjk2eiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+"
      }
    },
    "viz_DxAQFJOO": {
      "type": "splunk.rectangle",
      "options": {
        "strokeColor": "#0088cc",
        "fillOpacity": 0.15,
        "strokeOpacity": 0.3,
        "fillColor": "#0088cc"
      }
    },
    "viz_YeVME2W4": {
      "type": "splunk.markdown",
      "options": {
        "markdown": "### Development Status",
        "fontColor": "#33bbff"
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
          "width": 1920,
          "backgroundImage": {
            "y": 0,
            "x": 0,
            "sizeType": "contain",
            "src": "/static/app/splunk-dashboard-studio/images/examples-hub/data-command/datacommand.jpg"
          },
          "display": "auto-scale",
          "height": 1050
        },
        "structure": [
          {
            "item": "viz_lQ2GdCle",
            "type": "line",
            "position": {
              "to": {
                "y": 450,
                "x": 439
              },
              "from": {
                "y": 129,
                "x": 440
              }
            }
          },
          {
            "item": "viz_J2bFCAuJ",
            "type": "line",
            "position": {
              "to": {
                "y": 811,
                "x": 624
              },
              "from": {
                "y": 597,
                "x": 625
              }
            }
          },
          {
            "item": "viz_wLbsP1FT",
            "type": "line",
            "position": {
              "to": {
                "y": 1034,
                "x": 561
              },
              "from": {
                "y": 868,
                "x": 343
              }
            }
          },
          {
            "item": "viz_nJHV8lQR",
            "type": "line",
            "position": {
              "to": {
                "y": 567,
                "x": 57
              },
              "from": {
                "y": 568,
                "x": 583
              }
            }
          },
          {
            "item": "viz_BsHAnYvJ",
            "type": "line",
            "position": {
              "to": {
                "y": 708,
                "x": 1280
              },
              "from": {
                "y": 600,
                "x": 1281
              }
            }
          },
          {
            "item": "viz_hNtqEHCb",
            "type": "line",
            "position": {
              "to": {
                "y": 570,
                "x": 674
              },
              "from": {
                "y": 571,
                "x": 1231
              }
            }
          },
          {
            "item": "viz_0GVJCycZ",
            "type": "line",
            "position": {
              "to": {
                "y": 571,
                "x": 1326
              },
              "from": {
                "y": 572,
                "x": 1883
              }
            }
          },
          {
            "item": "viz_4yqBRUON",
            "type": "line",
            "position": {
              "to": {
                "y": 381,
                "x": 2
              },
              "from": {
                "y": 52,
                "x": 443
              }
            }
          },
          {
            "item": "viz_a8S6Lvec",
            "type": "line",
            "position": {
              "to": {
                "x": 1081,
                "y": 1155
              },
              "from": {
                "x": 27,
                "y": 82
              }
            }
          },
          {
            "item": "viz_Aac4QR5L",
            "type": "line",
            "position": {
              "to": {
                "x": 1917,
                "y": 857
              },
              "from": {
                "x": 1137,
                "y": 51
              }
            }
          },
          {
            "item": "viz_sqJOaVzX",
            "type": "line",
            "position": {
              "to": {
                "y": 1123,
                "x": 728
              },
              "from": {
                "y": 64,
                "x": 1867
              }
            }
          },
          {
            "item": "viz_UZOQVsy6",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_2zxg601S",
                "port": "w"
              },
              "from": {
                "item": "viz_VRABYHOO",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_BMVD7bC6",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_VLx3CgNc",
                "port": "w"
              },
              "from": {
                "item": "viz_2zxg601S",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_RdHDIpRO",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_lvYO5IPZ",
                "port": "w"
              },
              "from": {
                "item": "viz_VLx3CgNc",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_TvjAKCqY",
            "type": "line",
            "position": {
              "to": {
                "y": 123,
                "x": 951
              },
              "from": {
                "y": 456,
                "x": 950
              }
            }
          },
          {
            "item": "viz_tU6fPEQk",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_QBOJQAqY",
                "port": "e"
              },
              "from": {
                "item": "viz_QBOJQAqY",
                "port": "n"
              }
            }
          },
          {
            "item": "viz_V4m4cqBS",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ulJpSHdq",
                "port": "s"
              },
              "from": {
                "item": "viz_QBOJQAqY",
                "port": "n"
              }
            }
          },
          {
            "item": "viz_GRVOuukr",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ulJpSHdq",
                "port": "s"
              },
              "from": {
                "item": "viz_QBOJQAqY",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_XA3upIJc",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ulJpSHdq",
                "port": "s"
              },
              "from": {
                "item": "viz_x1oOgW40",
                "port": "w"
              }
            }
          },
          {
            "item": "viz_rkTwmxqy",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ibCByW9o",
                "port": "s"
              },
              "from": {
                "item": "viz_x1oOgW40",
                "port": "w"
              }
            }
          },
          {
            "item": "viz_wsmZ7jdF",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ibCByW9o",
                "port": "s"
              },
              "from": {
                "item": "viz_ulJpSHdq",
                "port": "s"
              }
            }
          },
          {
            "item": "viz_xUgE6oZl",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_QBOJQAqY",
                "port": "n"
              },
              "from": {
                "item": "viz_ibCByW9o",
                "port": "s"
              }
            }
          },
          {
            "item": "viz_RCMvidCo",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ulJpSHdq",
                "port": "w"
              },
              "from": {
                "item": "viz_QBOJQAqY",
                "port": "n"
              }
            }
          },
          {
            "item": "viz_15yZLk8g",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ulJpSHdq",
                "port": "w"
              },
              "from": {
                "item": "viz_ibCByW9o",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_mcsq3kL2",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ulJpSHdq",
                "port": "w"
              },
              "from": {
                "item": "viz_ibCByW9o",
                "port": "s"
              }
            }
          },
          {
            "item": "viz_FeM9ednf",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_QBOJQAqY",
                "port": "n"
              },
              "from": {
                "item": "viz_x1oOgW40",
                "port": "w"
              }
            }
          },
          {
            "item": "viz_OV5psMdg",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_x1oOgW40",
                "port": "w"
              },
              "from": {
                "item": "viz_x1oOgW40",
                "port": "n"
              }
            }
          },
          {
            "item": "viz_HIplJpkY",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_x1oOgW40",
                "port": "w"
              },
              "from": {
                "item": "viz_ulJpSHdq",
                "port": "w"
              }
            }
          },
          {
            "item": "viz_AL3TzuFa",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_x1oOgW40",
                "port": "w"
              },
              "from": {
                "item": "viz_ibCByW9o",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_cTLpV26P",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ulJpSHdq",
                "port": "s"
              },
              "from": {
                "item": "viz_ulJpSHdq",
                "port": "w"
              }
            }
          },
          {
            "item": "viz_S5HnNUQH",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_QBOJQAqY",
                "port": "e"
              },
              "from": {
                "item": "viz_ulJpSHdq",
                "port": "w"
              }
            }
          },
          {
            "item": "viz_c3tSRD8A",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_x1oOgW40",
                "port": "n"
              },
              "from": {
                "item": "viz_ulJpSHdq",
                "port": "w"
              }
            }
          },
          {
            "item": "viz_Vspwksmy",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_x1oOgW40",
                "port": "n"
              },
              "from": {
                "item": "viz_ibCByW9o",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_fNTgm0Gc",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ulJpSHdq",
                "port": "s"
              },
              "from": {
                "item": "viz_x1oOgW40",
                "port": "n"
              }
            }
          },
          {
            "item": "viz_1xZxZ7o0",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ulJpSHdq",
                "port": "s"
              },
              "from": {
                "item": "viz_ibCByW9o",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_VnOxKmnP",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_QBOJQAqY",
                "port": "e"
              },
              "from": {
                "item": "viz_x1oOgW40",
                "port": "n"
              }
            }
          },
          {
            "item": "viz_TiWGtwBO",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ibCByW9o",
                "port": "s"
              },
              "from": {
                "item": "viz_QBOJQAqY",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_caT0WJ1L",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ibCByW9o",
                "port": "s"
              },
              "from": {
                "item": "viz_x1oOgW40",
                "port": "n"
              }
            }
          },
          {
            "item": "viz_vOQ8XzHU",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_ibCByW9o",
                "port": "s"
              },
              "from": {
                "item": "viz_ibCByW9o",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_JEzI4LOy",
            "type": "line",
            "position": {
              "to": {
                "y": 460,
                "x": 805
              },
              "from": {
                "y": 460,
                "x": 875
              }
            }
          },
          {
            "item": "viz_0vIVqVO0",
            "type": "line",
            "position": {
              "to": {
                "y": 460,
                "x": 805
              },
              "from": {
                "y": 430,
                "x": 860
              }
            }
          },
          {
            "item": "viz_LbpEvJgf",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_x1oOgW40",
                "port": "w"
              },
              "from": {
                "item": "viz_QBOJQAqY",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_7K3blbjR",
            "type": "line",
            "position": {
              "to": {
                "x": 25,
                "y": 855
              },
              "from": {
                "x": 978,
                "y": 62
              }
            }
          },
          {
            "item": "viz_mboIcjjc",
            "type": "line",
            "position": {
              "to": {
                "y": 1158,
                "x": 1501
              },
              "from": {
                "y": 99,
                "x": 538
              }
            }
          },
          {
            "item": "viz_by8rcE0y",
            "type": "line",
            "position": {
              "to": {
                "y": 500,
                "x": 1611
              },
              "from": {
                "y": 131,
                "x": 1610
              }
            }
          },
          {
            "item": "viz_oThM5Kp1",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_WvHN3ekQ",
                "port": "w"
              },
              "from": {
                "item": "viz_W6vTW82E",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_6IqAXd9r",
            "type": "line",
            "position": {
              "to": {
                "item": "viz_0nCUGDQl",
                "port": "w"
              },
              "from": {
                "item": "viz_o0JfSwvC",
                "port": "e"
              }
            }
          },
          {
            "item": "viz_2htvDkYe",
            "type": "line",
            "position": {
              "to": {
                "y": 216,
                "x": 1198
              },
              "from": {
                "y": 207,
                "x": 1183
              }
            }
          },
          {
            "item": "viz_ZjOQtffW",
            "type": "line",
            "position": {
              "to": {
                "y": 210,
                "x": 1387
              },
              "from": {
                "y": 221,
                "x": 1372
              }
            }
          },
          {
            "item": "viz_Ym49tZf8",
            "type": "line",
            "position": {
              "to": {
                "y": 380,
                "x": 1199
              },
              "from": {
                "y": 385,
                "x": 1184
              }
            }
          },
          {
            "item": "viz_GbsuVoKg",
            "type": "line",
            "position": {
              "to": {
                "y": 380,
                "x": 1370
              },
              "from": {
                "y": 388,
                "x": 1384
              }
            }
          },
          {
            "item": "viz_FUzdcnlC",
            "type": "line",
            "position": {
              "to": {
                "x": 1139,
                "y": 123
              },
              "from": {
                "x": 1071,
                "y": 123
              }
            }
          },
          {
            "item": "viz_G2fCsbYR",
            "type": "line",
            "position": {
              "to": {
                "x": 1497,
                "y": 123
              },
              "from": {
                "x": 1429,
                "y": 123
              }
            }
          },
          {
            "item": "viz_4FsKZQAR",
            "type": "line",
            "position": {
              "to": {
                "x": 1142,
                "y": 428
              },
              "from": {
                "x": 1074,
                "y": 428
              }
            }
          },
          {
            "item": "viz_qxiUvjfi",
            "type": "line",
            "position": {
              "to": {
                "x": 1501,
                "y": 430
              },
              "from": {
                "x": 1433,
                "y": 430
              }
            }
          },
          {
            "item": "viz_yCFtpE3o",
            "type": "line",
            "position": {
              "to": {
                "x": 1033,
                "y": 219
              },
              "from": {
                "x": 1033,
                "y": 160
              }
            }
          },
          {
            "item": "viz_k3DjBpKg",
            "type": "line",
            "position": {
              "to": {
                "x": 1033,
                "y": 383
              },
              "from": {
                "x": 1033,
                "y": 324
              }
            }
          },
          {
            "item": "viz_lJkuUB1K",
            "type": "line",
            "position": {
              "to": {
                "x": 1537,
                "y": 219
              },
              "from": {
                "x": 1537,
                "y": 160
              }
            }
          },
          {
            "item": "viz_bNiWfv4N",
            "type": "line",
            "position": {
              "to": {
                "x": 1537,
                "y": 385
              },
              "from": {
                "x": 1537,
                "y": 326
              }
            }
          },
          {
            "item": "viz_wZTy8R1t",
            "type": "line",
            "position": {
              "to": {
                "x": 1527,
                "y": 480
              },
              "from": {
                "x": 1039,
                "y": 483
              }
            }
          },
          {
            "item": "viz_YTvabR1d",
            "type": "block",
            "position": {
              "y": 590,
              "x": 10,
              "w": 570,
              "h": 390
            }
          },
          {
            "item": "viz_8qsaDMI2",
            "type": "block",
            "position": {
              "y": 590,
              "x": 10,
              "w": 600,
              "h": 390
            }
          },
          {
            "item": "viz_mCOgkGUL",
            "type": "block",
            "position": {
              "y": 250,
              "x": 20,
              "w": 90,
              "h": 90
            }
          },
          {
            "item": "viz_Y57OEsIu",
            "type": "block",
            "position": {
              "y": 890,
              "x": 1390,
              "w": 430,
              "h": 410
            }
          },
          {
            "item": "viz_W6vTW82E",
            "type": "block",
            "position": {
              "y": 450,
              "x": 1650,
              "w": 90,
              "h": 80
            }
          },
          {
            "item": "viz_WvHN3ekQ",
            "type": "block",
            "position": {
              "y": 450,
              "x": 1770,
              "w": 90,
              "h": 80
            }
          },
          {
            "item": "viz_VLqYQ7rf",
            "type": "block",
            "position": {
              "y": 180,
              "x": 1770,
              "w": 30,
              "h": 200
            }
          },
          {
            "item": "viz_7v2IYYLR",
            "type": "block",
            "position": {
              "y": 180,
              "x": 1830,
              "w": 30,
              "h": 200
            }
          },
          {
            "item": "viz_DxAQFJOO",
            "type": "block",
            "position": {
              "y": 180,
              "x": 1710,
              "w": 30,
              "h": 200
            }
          },
          {
            "item": "viz_UjvrShg1",
            "type": "block",
            "position": {
              "y": 180,
              "x": 1650,
              "w": 30,
              "h": 200
            }
          },
          {
            "item": "viz_ARoZ9X0D",
            "type": "block",
            "position": {
              "y": 150,
              "x": 1150,
              "w": 270,
              "h": 260
            }
          },
          {
            "item": "viz_NMDEFxaA",
            "type": "block",
            "position": {
              "y": 190,
              "x": 1190,
              "w": 190,
              "h": 180
            }
          },
          {
            "item": "viz_irWsuA6a",
            "type": "block",
            "position": {
              "y": 920,
              "x": -30,
              "w": 1970,
              "h": 140
            }
          },
          {
            "item": "viz_C0bdjoEh",
            "type": "block",
            "position": {
              "y": 200,
              "x": 1200,
              "w": 170,
              "h": 160
            }
          },
          {
            "item": "viz_CjXoU5p4",
            "type": "block",
            "position": {
              "y": 520,
              "x": 1880,
              "w": 60,
              "h": 20
            }
          },
          {
            "item": "viz_NfXWgTYJ",
            "type": "block",
            "position": {
              "y": 610,
              "x": 1880,
              "w": 60,
              "h": 20
            }
          },
          {
            "item": "viz_u6cNobrl",
            "type": "block",
            "position": {
              "y": 570,
              "x": 1880,
              "w": 60,
              "h": 20
            }
          },
          {
            "item": "viz_lT0gwkfq",
            "type": "block",
            "position": {
              "y": 590,
              "x": 1880,
              "w": 60,
              "h": 20
            }
          },
          {
            "item": "viz_Btj2RVCw",
            "type": "block",
            "position": {
              "y": 560,
              "x": 580,
              "w": 100,
              "h": 50
            }
          },
          {
            "item": "viz_OteP5baI",
            "type": "block",
            "position": {
              "y": 400,
              "x": 110,
              "w": 320,
              "h": 135
            }
          },
          {
            "item": "viz_za7b3qj3",
            "type": "block",
            "position": {
              "y": 740,
              "x": 350,
              "w": 140,
              "h": 100
            }
          },
          {
            "item": "viz_XHnq1xdZ",
            "type": "block",
            "position": {
              "y": 820,
              "x": 1770,
              "w": 100,
              "h": 100
            }
          },
          {
            "item": "viz_lvYO5IPZ",
            "type": "block",
            "position": {
              "y": 820,
              "x": 1770,
              "w": 100,
              "h": 100
            }
          },
          {
            "item": "viz_5TaScyYS",
            "type": "block",
            "position": {
              "y": 830,
              "x": 1780,
              "w": 80,
              "h": 80
            }
          },
          {
            "item": "viz_TpMYEkB5",
            "type": "block",
            "position": {
              "y": 240,
              "x": 110,
              "w": 320,
              "h": 130
            }
          },
          {
            "item": "viz_b23IgSkE",
            "type": "block",
            "position": {
              "y": 840,
              "x": 1780,
              "w": 80,
              "h": 60
            }
          },
          {
            "item": "viz_f7aJsz57",
            "type": "block",
            "position": {
              "y": 820,
              "x": 1620,
              "w": 100,
              "h": 100
            }
          },
          {
            "item": "viz_VLx3CgNc",
            "type": "block",
            "position": {
              "y": 820,
              "x": 1620,
              "w": 100,
              "h": 100
            }
          },
          {
            "item": "viz_NC3Gi3in",
            "type": "block",
            "position": {
              "y": 830,
              "x": 1630,
              "w": 80,
              "h": 80
            }
          },
          {
            "item": "viz_AezuELDn",
            "type": "block",
            "position": {
              "y": 840,
              "x": 1630,
              "w": 80,
              "h": 60
            }
          },
          {
            "item": "viz_yiCqSoO9",
            "type": "block",
            "position": {
              "y": 820,
              "x": 1470,
              "w": 100,
              "h": 100
            }
          },
          {
            "item": "viz_2zxg601S",
            "type": "block",
            "position": {
              "y": 820,
              "x": 1470,
              "w": 100,
              "h": 100
            }
          },
          {
            "item": "viz_Olf8hwzh",
            "type": "block",
            "position": {
              "y": 830,
              "x": 1480,
              "w": 80,
              "h": 80
            }
          },
          {
            "item": "viz_rl34s5WJ",
            "type": "block",
            "position": {
              "y": 840,
              "x": 1480,
              "w": 80,
              "h": 60
            }
          },
          {
            "item": "viz_cwEdxiZv",
            "type": "block",
            "position": {
              "y": 820,
              "x": 1320,
              "w": 100,
              "h": 100
            }
          },
          {
            "item": "viz_VRABYHOO",
            "type": "block",
            "position": {
              "y": 820,
              "x": 1320,
              "w": 100,
              "h": 100
            }
          },
          {
            "item": "viz_bcYB40so",
            "type": "block",
            "position": {
              "y": 830,
              "x": 1320,
              "w": 80,
              "h": 80
            }
          },
          {
            "item": "viz_07lPI206",
            "type": "block",
            "position": {
              "y": 840,
              "x": 1330,
              "w": 80,
              "h": 60
            }
          },
          {
            "item": "viz_QySuhsxj",
            "type": "block",
            "position": {
              "y": 980,
              "x": 20,
              "w": 50,
              "h": 50
            }
          },
          {
            "item": "viz_y63gHBJQ",
            "type": "block",
            "position": {
              "y": 780,
              "x": 1500,
              "w": 220,
              "h": 50
            }
          },
          {
            "item": "viz_w5f8wnaG",
            "type": "block",
            "position": {
              "y": 580,
              "x": 200,
              "w": 230,
              "h": 60
            }
          },
          {
            "item": "viz_33KGroRU",
            "type": "block",
            "position": {
              "y": 250,
              "x": 1260,
              "w": 60,
              "h": 50
            }
          },
          {
            "item": "viz_kxJR2u7Y",
            "type": "block",
            "position": {
              "y": 870,
              "x": 750,
              "w": 120,
              "h": 110
            }
          },
          {
            "item": "viz_qVNyrQks",
            "type": "block",
            "position": {
              "y": 40,
              "x": 140,
              "w": 190,
              "h": 50
            }
          },
          {
            "item": "viz_Cw6atIW8",
            "type": "block",
            "position": {
              "y": 780,
              "x": 840,
              "w": 220,
              "h": 70
            }
          },
          {
            "item": "viz_Xk0YL63C",
            "type": "block",
            "position": {
              "y": 870,
              "x": 950,
              "w": 90,
              "h": 90
            }
          },
          {
            "item": "viz_GG3R2xOI",
            "type": "block",
            "position": {
              "y": 410,
              "x": 460,
              "w": 450,
              "h": 165
            }
          },
          {
            "item": "viz_cOtK7dOj",
            "type": "block",
            "position": {
              "y": 880,
              "x": 1430,
              "w": 50,
              "h": 60
            }
          },
          {
            "item": "viz_CQQ7loyQ",
            "type": "block",
            "position": {
              "y": 880,
              "x": 1580,
              "w": 50,
              "h": 60
            }
          },
          {
            "item": "viz_e7ryxnmM",
            "type": "block",
            "position": {
              "y": 880,
              "x": 1730,
              "w": 50,
              "h": 60
            }
          },
          {
            "item": "viz_1YLFM2at",
            "type": "block",
            "position": {
              "y": 80,
              "x": 450,
              "w": 340,
              "h": 320
            }
          },
          {
            "item": "viz_YlO8L7gw",
            "type": "block",
            "position": {
              "y": 40,
              "x": 1210,
              "w": 150,
              "h": 60
            }
          },
          {
            "item": "viz_8f3mMXaR",
            "type": "block",
            "position": {
              "y": 560,
              "x": 1230,
              "w": 100,
              "h": 50
            }
          },
          {
            "item": "viz_tpHIgEUx",
            "type": "block",
            "position": {
              "y": 850,
              "x": 160,
              "w": 90,
              "h": 90
            }
          },
          {
            "item": "viz_NZkAjyyO",
            "type": "block",
            "position": {
              "y": 740,
              "x": 100,
              "w": 70,
              "h": 90
            }
          },
          {
            "item": "viz_d6PX1UnE",
            "type": "block",
            "position": {
              "y": 120,
              "x": 800,
              "w": 130,
              "h": 35
            }
          },
          {
            "item": "viz_m5HUgtFy",
            "type": "block",
            "position": {
              "y": 150,
              "x": 800,
              "w": 130,
              "h": 35
            }
          },
          {
            "item": "viz_SNnGiWci",
            "type": "block",
            "position": {
              "y": 190,
              "x": 800,
              "w": 130,
              "h": 35
            }
          },
          {
            "item": "viz_h2VV6El0",
            "type": "block",
            "position": {
              "y": 220,
              "x": 800,
              "w": 130,
              "h": 35
            }
          },
          {
            "item": "viz_ZsTaXxab",
            "type": "block",
            "position": {
              "y": 250,
              "x": 800,
              "w": 130,
              "h": 35
            }
          },
          {
            "item": "viz_rTwXNiJg",
            "type": "block",
            "position": {
              "y": 280,
              "x": 800,
              "w": 130,
              "h": 35
            }
          },
          {
            "item": "viz_ulJpSHdq",
            "type": "block",
            "position": {
              "y": 160,
              "x": 1290,
              "w": 110,
              "h": 120
            }
          },
          {
            "item": "viz_I2Asq2kq",
            "type": "block",
            "position": {
              "y": 210,
              "x": 150,
              "w": 140,
              "h": 50
            }
          },
          {
            "item": "viz_tMWQNGqW",
            "type": "block",
            "position": {
              "y": 370,
              "x": 160,
              "w": 140,
              "h": 50
            }
          },
          {
            "item": "viz_kK2mKdcM",
            "type": "block",
            "position": {
              "y": 80,
              "x": 110,
              "w": 330,
              "h": 140
            }
          },
          {
            "item": "viz_YeVME2W4",
            "type": "block",
            "position": {
              "y": 40,
              "x": 620,
              "w": 190,
              "h": 50
            }
          },
          {
            "item": "viz_AFXN6vBD",
            "type": "block",
            "position": {
              "y": 140,
              "x": 1100,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_52R5i9Cn",
            "type": "block",
            "position": {
              "y": 310,
              "x": 1060,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_Xo1U1RE3",
            "type": "block",
            "position": {
              "y": 380,
              "x": 600,
              "w": 230,
              "h": 50
            }
          },
          {
            "item": "viz_x1oOgW40",
            "type": "block",
            "position": {
              "y": 290,
              "x": 1290,
              "w": 110,
              "h": 120
            }
          },
          {
            "item": "viz_QBOJQAqY",
            "type": "block",
            "position": {
              "y": 290,
              "x": 1170,
              "w": 110,
              "h": 120
            }
          },
          {
            "item": "viz_ibCByW9o",
            "type": "block",
            "position": {
              "y": 160,
              "x": 1170,
              "w": 110,
              "h": 120
            }
          },
          {
            "item": "viz_bvDwIrVQ",
            "type": "block",
            "position": {
              "y": 210,
              "x": 1160,
              "w": 40,
              "h": 60
            }
          },
          {
            "item": "viz_t53L4VQd",
            "type": "block",
            "position": {
              "y": 210,
              "x": 1380,
              "w": 50,
              "h": 80
            }
          },
          {
            "item": "viz_3ZQhbQAx",
            "type": "block",
            "position": {
              "y": 310,
              "x": 1380,
              "w": 50,
              "h": 60
            }
          },
          {
            "item": "viz_id0oWoXr",
            "type": "block",
            "position": {
              "y": 300,
              "x": 1170,
              "w": 60,
              "h": 70
            }
          },
          {
            "item": "viz_z0Gyge4R",
            "type": "block",
            "position": {
              "y": 100,
              "x": 1140,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_qyuN6qhp",
            "type": "block",
            "position": {
              "y": 180,
              "x": 1060,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_1pRdFSJz",
            "type": "block",
            "position": {
              "y": 100,
              "x": 1320,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_fbU6ZSsd",
            "type": "block",
            "position": {
              "y": 140,
              "x": 1360,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_vHvy38CF",
            "type": "block",
            "position": {
              "y": 180,
              "x": 1400,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_y4w96fPz",
            "type": "block",
            "position": {
              "y": 310,
              "x": 1400,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_9YL9FZe4",
            "type": "block",
            "position": {
              "y": 350,
              "x": 1360,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_kW06KOQU",
            "type": "block",
            "position": {
              "y": 390,
              "x": 1320,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_R7zbrn9I",
            "type": "block",
            "position": {
              "y": 390,
              "x": 1140,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_M2TTZpbN",
            "type": "block",
            "position": {
              "y": 350,
              "x": 1100,
              "w": 110,
              "h": 80
            }
          },
          {
            "item": "viz_papnG4FP",
            "type": "block",
            "position": {
              "y": 120,
              "x": 1180,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_6cNXiDrO",
            "type": "block",
            "position": {
              "y": 160,
              "x": 1140,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_CCaHR3rU",
            "type": "block",
            "position": {
              "y": 200,
              "x": 1100,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_BVqVoowS",
            "type": "block",
            "position": {
              "y": 90,
              "x": 150,
              "w": 290,
              "h": 70
            }
          },
          {
            "item": "viz_BM4xfo3I",
            "type": "block",
            "position": {
              "y": 260,
              "x": 150,
              "w": 280,
              "h": 60
            }
          },
          {
            "item": "viz_HqqCstaj",
            "type": "block",
            "position": {
              "y": 420,
              "x": 150,
              "w": 280,
              "h": 60
            }
          },
          {
            "item": "viz_FpwNj5Td",
            "type": "block",
            "position": {
              "y": 180,
              "x": 1640,
              "w": 50,
              "h": 220
            }
          },
          {
            "item": "viz_j2SjJ3wt",
            "type": "block",
            "position": {
              "y": 360,
              "x": 1655,
              "w": 40,
              "h": 60
            }
          },
          {
            "item": "viz_ZWgwX9NU",
            "type": "block",
            "position": {
              "y": 360,
              "x": 1715,
              "w": 40,
              "h": 60
            }
          },
          {
            "item": "viz_wb4pGRUw",
            "type": "block",
            "position": {
              "y": 360,
              "x": 1775,
              "w": 40,
              "h": 60
            }
          },
          {
            "item": "viz_uZZDJlvW",
            "type": "block",
            "position": {
              "y": 360,
              "x": 1835,
              "w": 40,
              "h": 60
            }
          },
          {
            "item": "viz_21HfURZa",
            "type": "block",
            "position": {
              "y": 80,
              "x": 1660,
              "w": 180,
              "h": 80
            }
          },
          {
            "item": "viz_iSgxizfn",
            "type": "block",
            "position": {
              "y": 40,
              "x": 1650,
              "w": 210,
              "h": 60
            }
          },
          {
            "item": "viz_QKDdj8id",
            "type": "block",
            "position": {
              "y": 170,
              "x": 1700,
              "w": 50,
              "h": 230
            }
          },
          {
            "item": "viz_PzLEUJlk",
            "type": "block",
            "position": {
              "y": 180,
              "x": 1760,
              "w": 50,
              "h": 220
            }
          },
          {
            "item": "viz_5Eoltxfg",
            "type": "block",
            "position": {
              "y": 170,
              "x": 1820,
              "w": 50,
              "h": 230
            }
          },
          {
            "item": "viz_1rAl4iVq",
            "type": "block",
            "position": {
              "y": 80,
              "x": 1620,
              "w": 40,
              "h": 60
            }
          },
          {
            "item": "viz_BxyD9XpO",
            "type": "block",
            "position": {
              "y": 120,
              "x": 1360,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_bmip44hU",
            "type": "block",
            "position": {
              "y": 160,
              "x": 1400,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_LBJFmfYX",
            "type": "block",
            "position": {
              "y": 200,
              "x": 1440,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_uA2bjn0O",
            "type": "block",
            "position": {
              "y": 330,
              "x": 1100,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_Ix6tLqHj",
            "type": "block",
            "position": {
              "y": 370,
              "x": 1140,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_ugEYd0eY",
            "type": "block",
            "position": {
              "y": 410,
              "x": 1180,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_l6eKbtND",
            "type": "block",
            "position": {
              "y": 330,
              "x": 1440,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_mGZEEK45",
            "type": "block",
            "position": {
              "y": 370,
              "x": 1400,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_ltMLfSPj",
            "type": "block",
            "position": {
              "y": 410,
              "x": 1360,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_o0JfSwvC",
            "type": "block",
            "position": {
              "y": 460,
              "x": 1660,
              "w": 70,
              "h": 80
            }
          },
          {
            "item": "viz_0nCUGDQl",
            "type": "block",
            "position": {
              "y": 460,
              "x": 1780,
              "w": 70,
              "h": 80
            }
          },
          {
            "item": "viz_sIf95Tb5",
            "type": "block",
            "position": {
              "y": 820,
              "x": 260,
              "w": 80,
              "h": 80
            }
          },
          {
            "item": "viz_HuPqUNE5",
            "type": "block",
            "position": {
              "y": 890,
              "x": 460,
              "w": 44,
              "h": 40
            }
          },
          {
            "item": "viz_co1mv2Rb",
            "type": "block",
            "position": {
              "y": 830,
              "x": 860,
              "w": 80,
              "h": 80
            }
          },
          {
            "item": "viz_MKvNZCl8",
            "type": "block",
            "position": {
              "y": 510,
              "x": -20,
              "w": 60,
              "h": 20
            }
          },
          {
            "item": "viz_HVLWvNFL",
            "type": "block",
            "position": {
              "y": 570,
              "x": -20,
              "w": 60,
              "h": 20
            }
          },
          {
            "item": "viz_OQpOAgBs",
            "type": "block",
            "position": {
              "y": 530,
              "x": -20,
              "w": 60,
              "h": 20
            }
          },
          {
            "item": "viz_fR6nkCGs",
            "type": "block",
            "position": {
              "y": 550,
              "x": -20,
              "w": 60,
              "h": 20
            }
          },
          {
            "item": "viz_3ypj3McP",
            "type": "block",
            "position": {
              "y": 750,
              "x": 280,
              "w": 40,
              "h": 50
            }
          },
          {
            "item": "viz_JAaGxkEk",
            "type": "block",
            "position": {
              "y": 830,
              "x": 1070,
              "w": 90,
              "h": 80
            }
          },
          {
            "item": "viz_9Iq3Ho2c",
            "type": "block",
            "position": {
              "y": 870,
              "x": 1170,
              "w": 90,
              "h": 90
            }
          },
          {
            "item": "viz_EV1Y5qww",
            "type": "block",
            "position": {
              "y": 100,
              "x": 1010,
              "w": 50,
              "h": 50
            }
          },
          {
            "item": "viz_Tt6TgwHy",
            "type": "block",
            "position": {
              "y": 400,
              "x": 1010,
              "w": 50,
              "h": 50
            }
          },
          {
            "item": "viz_dQROxn4T",
            "type": "block",
            "position": {
              "y": 100,
              "x": 1510,
              "w": 50,
              "h": 50
            }
          },
          {
            "item": "viz_EqgluBzX",
            "type": "block",
            "position": {
              "y": 400,
              "x": 1510,
              "w": 50,
              "h": 50
            }
          },
          {
            "item": "viz_R8SmZxgD",
            "type": "block",
            "position": {
              "y": 460,
              "x": 1010,
              "w": 570,
              "h": 120
            }
          },
          {
            "item": "viz_oYZmhRdA",
            "type": "block",
            "position": {
              "y": 460,
              "x": 970,
              "w": 150,
              "h": 60
            }
          },
          {
            "item": "viz_8v42rIbQ",
            "type": "block",
            "position": {
              "y": 460,
              "x": 1240,
              "w": 150,
              "h": 60
            }
          },
          {
            "item": "viz_FCFXfCqE",
            "type": "block",
            "position": {
              "y": 80,
              "x": 20,
              "w": 90,
              "h": 70
            }
          },
          {
            "item": "viz_py2Bu08r",
            "type": "block",
            "position": {
              "y": 420,
              "x": 20,
              "w": 90,
              "h": 90
            }
          },
          {
            "item": "viz_5XC93DLs",
            "type": "block",
            "position": {
              "y": 830,
              "x": 650,
              "w": 90,
              "h": 90
            }
          },
          {
            "item": "viz_FkJwGPxc",
            "type": "block",
            "position": {
              "y": 830,
              "x": 840,
              "w": 90,
              "h": 90
            }
          },
          {
            "item": "viz_GzFW5NHt",
            "type": "block",
            "position": {
              "y": 830,
              "x": 1060,
              "w": 90,
              "h": 90
            }
          }
        ]
      }
    }
  }
}
\`\`\``,backgroundColor:"#000000"}}},layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"absolute",options:{width:1920,backgroundImage:{y:0,x:0,sizeType:"contain",src:"/static/app/splunk-dashboard-studio/images/examples-hub/data-command/datacommand.jpg"},display:"auto-scale",height:1500},structure:[{item:"viz_lQ2GdCle",type:"line",position:{to:{y:450,x:439},from:{y:129,x:440}}},{item:"viz_J2bFCAuJ",type:"line",position:{to:{y:811,x:624},from:{y:597,x:625}}},{item:"viz_wLbsP1FT",type:"line",position:{to:{y:1034,x:561},from:{y:868,x:343}}},{item:"viz_nJHV8lQR",type:"line",position:{to:{y:567,x:57},from:{y:568,x:583}}},{item:"viz_BsHAnYvJ",type:"line",position:{to:{y:708,x:1280},from:{y:600,x:1281}}},{item:"viz_hNtqEHCb",type:"line",position:{to:{y:570,x:674},from:{y:571,x:1231}}},{item:"viz_0GVJCycZ",type:"line",position:{to:{y:571,x:1326},from:{y:572,x:1883}}},{item:"viz_4yqBRUON",type:"line",position:{to:{y:381,x:2},from:{y:52,x:443}}},{item:"viz_a8S6Lvec",type:"line",position:{to:{x:1081,y:1155},from:{x:27,y:82}}},{item:"viz_Aac4QR5L",type:"line",position:{to:{x:1917,y:857},from:{x:1137,y:51}}},{item:"viz_sqJOaVzX",type:"line",position:{to:{y:1123,x:728},from:{y:64,x:1867}}},{item:"viz_UZOQVsy6",type:"line",position:{to:{item:"viz_2zxg601S",port:"w"},from:{item:"viz_VRABYHOO",port:"e"}}},{item:"viz_BMVD7bC6",type:"line",position:{to:{item:"viz_VLx3CgNc",port:"w"},from:{item:"viz_2zxg601S",port:"e"}}},{item:"viz_RdHDIpRO",type:"line",position:{to:{item:"viz_lvYO5IPZ",port:"w"},from:{item:"viz_VLx3CgNc",port:"e"}}},{item:"viz_TvjAKCqY",type:"line",position:{to:{y:123,x:951},from:{y:456,x:950}}},{item:"viz_tU6fPEQk",type:"line",position:{to:{item:"viz_QBOJQAqY",port:"e"},from:{item:"viz_QBOJQAqY",port:"n"}}},{item:"viz_V4m4cqBS",type:"line",position:{to:{item:"viz_ulJpSHdq",port:"s"},from:{item:"viz_QBOJQAqY",port:"n"}}},{item:"viz_GRVOuukr",type:"line",position:{to:{item:"viz_ulJpSHdq",port:"s"},from:{item:"viz_QBOJQAqY",port:"e"}}},{item:"viz_XA3upIJc",type:"line",position:{to:{item:"viz_ulJpSHdq",port:"s"},from:{item:"viz_x1oOgW40",port:"w"}}},{item:"viz_rkTwmxqy",type:"line",position:{to:{item:"viz_ibCByW9o",port:"s"},from:{item:"viz_x1oOgW40",port:"w"}}},{item:"viz_wsmZ7jdF",type:"line",position:{to:{item:"viz_ibCByW9o",port:"s"},from:{item:"viz_ulJpSHdq",port:"s"}}},{item:"viz_xUgE6oZl",type:"line",position:{to:{item:"viz_QBOJQAqY",port:"n"},from:{item:"viz_ibCByW9o",port:"s"}}},{item:"viz_RCMvidCo",type:"line",position:{to:{item:"viz_ulJpSHdq",port:"w"},from:{item:"viz_QBOJQAqY",port:"n"}}},{item:"viz_15yZLk8g",type:"line",position:{to:{item:"viz_ulJpSHdq",port:"w"},from:{item:"viz_ibCByW9o",port:"e"}}},{item:"viz_mcsq3kL2",type:"line",position:{to:{item:"viz_ulJpSHdq",port:"w"},from:{item:"viz_ibCByW9o",port:"s"}}},{item:"viz_FeM9ednf",type:"line",position:{to:{item:"viz_QBOJQAqY",port:"n"},from:{item:"viz_x1oOgW40",port:"w"}}},{item:"viz_OV5psMdg",type:"line",position:{to:{item:"viz_x1oOgW40",port:"w"},from:{item:"viz_x1oOgW40",port:"n"}}},{item:"viz_HIplJpkY",type:"line",position:{to:{item:"viz_x1oOgW40",port:"w"},from:{item:"viz_ulJpSHdq",port:"w"}}},{item:"viz_AL3TzuFa",type:"line",position:{to:{item:"viz_x1oOgW40",port:"w"},from:{item:"viz_ibCByW9o",port:"e"}}},{item:"viz_cTLpV26P",type:"line",position:{to:{item:"viz_ulJpSHdq",port:"s"},from:{item:"viz_ulJpSHdq",port:"w"}}},{item:"viz_S5HnNUQH",type:"line",position:{to:{item:"viz_QBOJQAqY",port:"e"},from:{item:"viz_ulJpSHdq",port:"w"}}},{item:"viz_c3tSRD8A",type:"line",position:{to:{item:"viz_x1oOgW40",port:"n"},from:{item:"viz_ulJpSHdq",port:"w"}}},{item:"viz_Vspwksmy",type:"line",position:{to:{item:"viz_x1oOgW40",port:"n"},from:{item:"viz_ibCByW9o",port:"e"}}},{item:"viz_fNTgm0Gc",type:"line",position:{to:{item:"viz_ulJpSHdq",port:"s"},from:{item:"viz_x1oOgW40",port:"n"}}},{item:"viz_1xZxZ7o0",type:"line",position:{to:{item:"viz_ulJpSHdq",port:"s"},from:{item:"viz_ibCByW9o",port:"e"}}},{item:"viz_VnOxKmnP",type:"line",position:{to:{item:"viz_QBOJQAqY",port:"e"},from:{item:"viz_x1oOgW40",port:"n"}}},{item:"viz_TiWGtwBO",type:"line",position:{to:{item:"viz_ibCByW9o",port:"s"},from:{item:"viz_QBOJQAqY",port:"e"}}},{item:"viz_caT0WJ1L",type:"line",position:{to:{item:"viz_ibCByW9o",port:"s"},from:{item:"viz_x1oOgW40",port:"n"}}},{item:"viz_vOQ8XzHU",type:"line",position:{to:{item:"viz_ibCByW9o",port:"s"},from:{item:"viz_ibCByW9o",port:"e"}}},{item:"viz_JEzI4LOy",type:"line",position:{to:{y:460,x:805},from:{y:460,x:875}}},{item:"viz_0vIVqVO0",type:"line",position:{to:{y:460,x:805},from:{y:430,x:860}}},{item:"viz_LbpEvJgf",type:"line",position:{to:{item:"viz_x1oOgW40",port:"w"},from:{item:"viz_QBOJQAqY",port:"e"}}},{item:"viz_7K3blbjR",type:"line",position:{to:{x:25,y:855},from:{x:978,y:62}}},{item:"viz_mboIcjjc",type:"line",position:{to:{y:1158,x:1501},from:{y:99,x:538}}},{item:"viz_by8rcE0y",type:"line",position:{to:{y:500,x:1611},from:{y:131,x:1610}}},{item:"viz_oThM5Kp1",type:"line",position:{to:{item:"viz_WvHN3ekQ",port:"w"},from:{item:"viz_W6vTW82E",port:"e"}}},{item:"viz_6IqAXd9r",type:"line",position:{to:{item:"viz_0nCUGDQl",port:"w"},from:{item:"viz_o0JfSwvC",port:"e"}}},{item:"viz_2htvDkYe",type:"line",position:{to:{y:216,x:1198},from:{y:207,x:1183}}},{item:"viz_ZjOQtffW",type:"line",position:{to:{y:210,x:1387},from:{y:221,x:1372}}},{item:"viz_Ym49tZf8",type:"line",position:{to:{y:380,x:1199},from:{y:385,x:1184}}},{item:"viz_GbsuVoKg",type:"line",position:{to:{y:380,x:1370},from:{y:388,x:1384}}},{item:"viz_FUzdcnlC",type:"line",position:{to:{x:1139,y:123},from:{x:1071,y:123}}},{item:"viz_G2fCsbYR",type:"line",position:{to:{x:1497,y:123},from:{x:1429,y:123}}},{item:"viz_4FsKZQAR",type:"line",position:{to:{x:1142,y:428},from:{x:1074,y:428}}},{item:"viz_qxiUvjfi",type:"line",position:{to:{x:1501,y:430},from:{x:1433,y:430}}},{item:"viz_yCFtpE3o",type:"line",position:{to:{x:1033,y:219},from:{x:1033,y:160}}},{item:"viz_k3DjBpKg",type:"line",position:{to:{x:1033,y:383},from:{x:1033,y:324}}},{item:"viz_lJkuUB1K",type:"line",position:{to:{x:1537,y:219},from:{x:1537,y:160}}},{item:"viz_bNiWfv4N",type:"line",position:{to:{x:1537,y:385},from:{x:1537,y:326}}},{item:"viz_wZTy8R1t",type:"line",position:{to:{x:1527,y:480},from:{x:1039,y:483}}},{item:"viz_YTvabR1d",type:"block",position:{y:590,x:10,w:560,h:380}},{item:"viz_8qsaDMI2",type:"block",position:{y:590,x:10,w:600,h:390}},{item:"viz_mCOgkGUL",type:"block",position:{y:250,x:20,w:90,h:90}},{item:"viz_Y57OEsIu",type:"block",position:{y:890,x:1390,w:430,h:410}},{item:"viz_W6vTW82E",type:"block",position:{y:450,x:1650,w:90,h:80}},{item:"viz_WvHN3ekQ",type:"block",position:{y:450,x:1770,w:90,h:80}},{item:"viz_VLqYQ7rf",type:"block",position:{y:180,x:1770,w:30,h:200}},{item:"viz_7v2IYYLR",type:"block",position:{y:180,x:1830,w:30,h:200}},{item:"viz_DxAQFJOO",type:"block",position:{y:180,x:1710,w:30,h:200}},{item:"viz_UjvrShg1",type:"block",position:{y:180,x:1650,w:30,h:200}},{item:"viz_ARoZ9X0D",type:"block",position:{y:150,x:1150,w:270,h:260}},{item:"viz_NMDEFxaA",type:"block",position:{y:190,x:1190,w:190,h:180}},{item:"viz_irWsuA6a",type:"block",position:{y:920,x:-30,w:1970,h:140}},{item:"viz_C0bdjoEh",type:"block",position:{y:200,x:1200,w:170,h:160}},{item:"viz_CjXoU5p4",type:"block",position:{y:520,x:1880,w:60,h:20}},{item:"viz_NfXWgTYJ",type:"block",position:{y:610,x:1880,w:60,h:20}},{item:"viz_u6cNobrl",type:"block",position:{y:570,x:1880,w:60,h:20}},{item:"viz_lT0gwkfq",type:"block",position:{y:590,x:1880,w:60,h:20}},{item:"viz_Btj2RVCw",type:"block",position:{y:560,x:580,w:100,h:50}},{item:"viz_OteP5baI",type:"block",position:{y:400,x:110,w:320,h:135}},{item:"viz_za7b3qj3",type:"block",position:{y:740,x:350,w:140,h:100}},{item:"viz_XHnq1xdZ",type:"block",position:{y:820,x:1770,w:100,h:100}},{item:"viz_lvYO5IPZ",type:"block",position:{y:820,x:1770,w:100,h:100}},{item:"viz_5TaScyYS",type:"block",position:{y:830,x:1780,w:80,h:80}},{item:"viz_TpMYEkB5",type:"block",position:{y:240,x:110,w:320,h:130}},{item:"viz_b23IgSkE",type:"block",position:{y:840,x:1780,w:80,h:60}},{item:"viz_f7aJsz57",type:"block",position:{y:820,x:1620,w:100,h:100}},{item:"viz_VLx3CgNc",type:"block",position:{y:820,x:1620,w:100,h:100}},{item:"viz_NC3Gi3in",type:"block",position:{y:830,x:1630,w:80,h:80}},{item:"viz_AezuELDn",type:"block",position:{y:840,x:1630,w:80,h:60}},{item:"viz_yiCqSoO9",type:"block",position:{y:820,x:1470,w:100,h:100}},{item:"viz_2zxg601S",type:"block",position:{y:820,x:1470,w:100,h:100}},{item:"viz_Olf8hwzh",type:"block",position:{y:830,x:1480,w:80,h:80}},{item:"viz_rl34s5WJ",type:"block",position:{y:840,x:1480,w:80,h:60}},{item:"viz_cwEdxiZv",type:"block",position:{y:820,x:1320,w:100,h:100}},{item:"viz_VRABYHOO",type:"block",position:{y:820,x:1320,w:100,h:100}},{item:"viz_bcYB40so",type:"block",position:{y:830,x:1320,w:80,h:80}},{item:"viz_07lPI206",type:"block",position:{y:840,x:1330,w:80,h:60}},{item:"viz_QySuhsxj",type:"block",position:{y:980,x:20,w:50,h:50}},{item:"viz_y63gHBJQ",type:"block",position:{y:780,x:1500,w:220,h:50}},{item:"viz_w5f8wnaG",type:"block",position:{y:580,x:200,w:230,h:60}},{item:"viz_33KGroRU",type:"block",position:{y:250,x:1260,w:60,h:50}},{item:"viz_kxJR2u7Y",type:"block",position:{y:870,x:750,w:120,h:110}},{item:"viz_qVNyrQks",type:"block",position:{y:40,x:140,w:190,h:50}},{item:"viz_Cw6atIW8",type:"block",position:{y:780,x:840,w:220,h:70}},{item:"viz_Xk0YL63C",type:"block",position:{y:870,x:950,w:90,h:90}},{item:"viz_GG3R2xOI",type:"block",position:{y:410,x:460,w:450,h:165}},{item:"viz_cOtK7dOj",type:"block",position:{y:880,x:1430,w:50,h:60}},{item:"viz_CQQ7loyQ",type:"block",position:{y:880,x:1580,w:50,h:60}},{item:"viz_e7ryxnmM",type:"block",position:{y:880,x:1730,w:50,h:60}},{item:"viz_1YLFM2at",type:"block",position:{y:80,x:450,w:340,h:320}},{item:"viz_YlO8L7gw",type:"block",position:{y:40,x:1210,w:150,h:60}},{item:"viz_8f3mMXaR",type:"block",position:{y:560,x:1230,w:100,h:50}},{item:"viz_tpHIgEUx",type:"block",position:{y:850,x:160,w:90,h:90}},{item:"viz_NZkAjyyO",type:"block",position:{y:740,x:100,w:70,h:90}},{item:"viz_d6PX1UnE",type:"block",position:{y:120,x:800,w:130,h:35}},{item:"viz_m5HUgtFy",type:"block",position:{y:150,x:800,w:130,h:35}},{item:"viz_SNnGiWci",type:"block",position:{y:190,x:800,w:130,h:35}},{item:"viz_h2VV6El0",type:"block",position:{y:220,x:800,w:130,h:35}},{item:"viz_ZsTaXxab",type:"block",position:{y:250,x:800,w:130,h:35}},{item:"viz_rTwXNiJg",type:"block",position:{y:280,x:800,w:130,h:35}},{item:"viz_ulJpSHdq",type:"block",position:{y:160,x:1290,w:110,h:120}},{item:"viz_I2Asq2kq",type:"block",position:{y:210,x:150,w:140,h:50}},{item:"viz_tMWQNGqW",type:"block",position:{y:370,x:160,w:140,h:50}},{item:"viz_kK2mKdcM",type:"block",position:{y:80,x:110,w:330,h:140}},{item:"viz_YeVME2W4",type:"block",position:{y:40,x:620,w:190,h:50}},{item:"viz_AFXN6vBD",type:"block",position:{y:140,x:1100,w:110,h:80}},{item:"viz_52R5i9Cn",type:"block",position:{y:310,x:1060,w:110,h:80}},{item:"viz_Xo1U1RE3",type:"block",position:{y:380,x:600,w:230,h:50}},{item:"viz_x1oOgW40",type:"block",position:{y:290,x:1290,w:110,h:120}},{item:"viz_QBOJQAqY",type:"block",position:{y:290,x:1170,w:110,h:120}},{item:"viz_ibCByW9o",type:"block",position:{y:160,x:1170,w:110,h:120}},{item:"viz_bvDwIrVQ",type:"block",position:{y:210,x:1160,w:40,h:60}},{item:"viz_t53L4VQd",type:"block",position:{y:210,x:1380,w:50,h:80}},{item:"viz_3ZQhbQAx",type:"block",position:{y:310,x:1380,w:50,h:60}},{item:"viz_id0oWoXr",type:"block",position:{y:300,x:1170,w:60,h:70}},{item:"viz_z0Gyge4R",type:"block",position:{y:100,x:1140,w:110,h:80}},{item:"viz_qyuN6qhp",type:"block",position:{y:180,x:1060,w:110,h:80}},{item:"viz_1pRdFSJz",type:"block",position:{y:100,x:1320,w:110,h:80}},{item:"viz_fbU6ZSsd",type:"block",position:{y:140,x:1360,w:110,h:80}},{item:"viz_vHvy38CF",type:"block",position:{y:180,x:1400,w:110,h:80}},{item:"viz_y4w96fPz",type:"block",position:{y:310,x:1400,w:110,h:80}},{item:"viz_9YL9FZe4",type:"block",position:{y:350,x:1360,w:110,h:80}},{item:"viz_kW06KOQU",type:"block",position:{y:390,x:1320,w:110,h:80}},{item:"viz_R7zbrn9I",type:"block",position:{y:390,x:1140,w:110,h:80}},{item:"viz_M2TTZpbN",type:"block",position:{y:350,x:1100,w:110,h:80}},{item:"viz_papnG4FP",type:"block",position:{y:120,x:1180,w:40,h:50}},{item:"viz_6cNXiDrO",type:"block",position:{y:160,x:1140,w:40,h:50}},{item:"viz_CCaHR3rU",type:"block",position:{y:200,x:1100,w:40,h:50}},{item:"viz_BVqVoowS",type:"block",position:{y:90,x:150,w:290,h:70}},{item:"viz_BM4xfo3I",type:"block",position:{y:260,x:150,w:280,h:60}},{item:"viz_HqqCstaj",type:"block",position:{y:420,x:150,w:280,h:60}},{item:"viz_FpwNj5Td",type:"block",position:{y:180,x:1640,w:50,h:220}},{item:"viz_j2SjJ3wt",type:"block",position:{y:360,x:1655,w:40,h:60}},{item:"viz_ZWgwX9NU",type:"block",position:{y:360,x:1715,w:40,h:60}},{item:"viz_wb4pGRUw",type:"block",position:{y:360,x:1775,w:40,h:60}},{item:"viz_uZZDJlvW",type:"block",position:{y:360,x:1835,w:40,h:60}},{item:"viz_21HfURZa",type:"block",position:{y:80,x:1660,w:180,h:80}},{item:"viz_iSgxizfn",type:"block",position:{y:40,x:1650,w:210,h:60}},{item:"viz_QKDdj8id",type:"block",position:{y:170,x:1700,w:50,h:230}},{item:"viz_PzLEUJlk",type:"block",position:{y:180,x:1760,w:50,h:220}},{item:"viz_5Eoltxfg",type:"block",position:{y:170,x:1820,w:50,h:230}},{item:"viz_1rAl4iVq",type:"block",position:{y:80,x:1620,w:40,h:60}},{item:"viz_BxyD9XpO",type:"block",position:{y:120,x:1360,w:40,h:50}},{item:"viz_bmip44hU",type:"block",position:{y:160,x:1400,w:40,h:50}},{item:"viz_LBJFmfYX",type:"block",position:{y:200,x:1440,w:40,h:50}},{item:"viz_uA2bjn0O",type:"block",position:{y:330,x:1100,w:40,h:50}},{item:"viz_Ix6tLqHj",type:"block",position:{y:370,x:1140,w:40,h:50}},{item:"viz_ugEYd0eY",type:"block",position:{y:410,x:1180,w:40,h:50}},{item:"viz_l6eKbtND",type:"block",position:{y:330,x:1440,w:40,h:50}},{item:"viz_mGZEEK45",type:"block",position:{y:370,x:1400,w:40,h:50}},{item:"viz_ltMLfSPj",type:"block",position:{y:410,x:1360,w:40,h:50}},{item:"viz_o0JfSwvC",type:"block",position:{y:460,x:1660,w:70,h:80}},{item:"viz_0nCUGDQl",type:"block",position:{y:460,x:1780,w:70,h:80}},{item:"viz_sIf95Tb5",type:"block",position:{y:820,x:260,w:80,h:80}},{item:"viz_HuPqUNE5",type:"block",position:{y:890,x:460,w:44,h:40}},{item:"viz_co1mv2Rb",type:"block",position:{y:830,x:860,w:80,h:80}},{item:"viz_MKvNZCl8",type:"block",position:{y:510,x:-20,w:60,h:20}},{item:"viz_HVLWvNFL",type:"block",position:{y:570,x:-20,w:60,h:20}},{item:"viz_OQpOAgBs",type:"block",position:{y:530,x:-20,w:60,h:20}},{item:"viz_fR6nkCGs",type:"block",position:{y:550,x:-20,w:60,h:20}},{item:"viz_3ypj3McP",type:"block",position:{y:750,x:280,w:40,h:50}},{item:"viz_JAaGxkEk",type:"block",position:{y:830,x:1070,w:90,h:80}},{item:"viz_9Iq3Ho2c",type:"block",position:{y:870,x:1170,w:90,h:90}},{item:"viz_EV1Y5qww",type:"block",position:{y:100,x:1010,w:50,h:50}},{item:"viz_Tt6TgwHy",type:"block",position:{y:400,x:1010,w:50,h:50}},{item:"viz_dQROxn4T",type:"block",position:{y:100,x:1510,w:50,h:50}},{item:"viz_EqgluBzX",type:"block",position:{y:400,x:1510,w:50,h:50}},{item:"viz_R8SmZxgD",type:"block",position:{y:460,x:1010,w:570,h:120}},{item:"viz_oYZmhRdA",type:"block",position:{y:460,x:970,w:150,h:60}},{item:"viz_8v42rIbQ",type:"block",position:{y:460,x:1240,w:150,h:60}},{item:"viz_FCFXfCqE",type:"block",position:{y:80,x:20,w:90,h:70}},{item:"viz_py2Bu08r",type:"block",position:{y:420,x:20,w:90,h:90}},{item:"viz_5XC93DLs",type:"block",position:{y:830,x:650,w:90,h:90}},{item:"viz_FkJwGPxc",type:"block",position:{y:830,x:840,w:90,h:90}},{item:"viz_GzFW5NHt",type:"block",position:{y:830,x:1060,w:90,h:90}},{item:"viz_jqLoXWp4",type:"block",position:{x:10,y:1070,w:1890,h:410}}]}}}};var i=a(s());var o="Data Command and Control";e(i.default.createElement(n,{definition:t,isCompleteDashboard:!0,dashboardTitle:o}),{pageTitle:o,hideFooter:!0,layout:"fixed"});
