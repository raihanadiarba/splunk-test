/*! splunk-dashboard-studio v1.28.5 | UNLICENSED */
import{a as e}from"../chunks/chunk-EF2LPH2T.js";import"../chunks/chunk-N4UQPXS4.js";import"../chunks/chunk-2T25FCZ6.js";import"../chunks/chunk-ATGKFNH7.js";import"../chunks/chunk-2JKAJQFP.js";import"../chunks/chunk-XHTYW3TC.js";import"../chunks/chunk-O7INVHIW.js";import"../chunks/chunk-DLBBDJF6.js";import"../chunks/chunk-HYW2UWI5.js";import"../chunks/chunk-6TC7FAB5.js";import"../chunks/chunk-GMJZTIQZ.js";import"../chunks/chunk-AAG3EKLF.js";import"../chunks/chunk-TGJ53OK3.js";import"../chunks/chunk-4L5RKU62.js";import"../chunks/chunk-NJ5BMYUW.js";import"../chunks/chunk-IOZKLKL3.js";import"../chunks/chunk-243HL53J.js";import"../chunks/chunk-CC76V3MT.js";import"../chunks/chunk-5HYJV7JI.js";import"../chunks/chunk-MVRPNTRB.js";import"../chunks/chunk-2WVRHQHO.js";import"../chunks/chunk-3L4L4Z2V.js";import"../chunks/chunk-XDFLUOTJ.js";import"../chunks/chunk-JHLKKHPY.js";import"../chunks/chunk-P2UEJLOF.js";import"../chunks/chunk-XC3VPJJP.js";import"../chunks/chunk-CDGSZEQ3.js";import"../chunks/chunk-RXGAPRCF.js";import"../chunks/chunk-JRJJ2J4W.js";import"../chunks/chunk-LZUJU4H4.js";import"../chunks/chunk-5I5EF6X3.js";import"../chunks/chunk-EMECN227.js";import"../chunks/chunk-DXRKKB2D.js";import"../chunks/chunk-JKE3YGCJ.js";import"../chunks/chunk-JRWCA5GX.js";import{a as t}from"../chunks/chunk-X7SC2WUA.js";import"../chunks/chunk-VTCEZISA.js";import"../chunks/chunk-OCET6F2C.js";import"../chunks/chunk-YKRL6L3F.js";import"../chunks/chunk-NVK425MY.js";import"../chunks/chunk-3F24R2A4.js";import"../chunks/chunk-KNKTAXQK.js";import"../chunks/chunk-BTFYE7V4.js";import"../chunks/chunk-KT3UIIGH.js";import"../chunks/chunk-2DF7PMOL.js";import"../chunks/chunk-O2JJX2RL.js";import"../chunks/chunk-6GUZBCIS.js";import"../chunks/chunk-7UAJTSFV.js";import{a as r}from"../chunks/chunk-REK4W3C7.js";import{h as n}from"../chunks/chunk-JHLB3KMN.js";var a={visualizations:{viz_RBdQ2qQ5:{type:"splunk.markdown",options:{markdown:`## Overview
Use the selected value from one input to filter and power a second form input.  This allows for the available options on the second input to be narrowed by the updated search. 

In the following example, the selected user in the 1st dropdown sets a token named \`$token1$\` that populates the available options in the other input. Both tokens from the input are then used in the search for the table visualization.

#### SPL Query for First Input
\`\`\`splunk-spl
| inputlookup outages_example.csv
| search "Geographic Areas"="New York*"
| stats count by "Geographic Areas"
\`\`\`

#### How to Power the Second Input from the Selected Value of the First Input

Here is the search that we want to use to power the second form input

\`\`\`splunk-spl
| inputlookup outages_example.csv
| search "Geographic Areas" IN ("$token1$")
| stats count by "Respondent"
\`\`\`


#### Full Source for the Second Form Input
\`\`\`json
{
    "type": "input.multiselect",
    "options": {
        "items": [
            {
                "label": "All",
                "value": "*"
            }
        ],
        "token": "token2",
        "defaultValue": "*"
    },
    "dataSources": {
        "primary": "ds_search2"
    },
    "title": "Select Sourcetype"
}
\`\`\`
`}},viz_J9wtUPaV:{type:"splunk.table",dataSources:{primary:"ds_XIkban1T"},options:{backgroundColor:"> themes.defaultBackgroundColor"},title:"Sourcetype Table",description:'Search Query: | inputlookup outages_example.csv| search "Geographic Areas" IN ("$dd1$") Respondent IN ("$dd2$")'}},dataSources:{ds_search1:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| search "Geographic Areas"="New York*"
| stats count by "Geographic Areas"`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_1"},ds_Pk5HZtCJ:{type:"ds.search",options:{query:`| inputlookup outages_example.csv
| search "Geographic Areas" IN ("$dd1$")
| stats count by "Respondent"`,queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_2"},ds_XIkban1T:{type:"ds.search",options:{query:'| inputlookup outages_example.csv| search "Geographic Areas" IN ("$dd1$") Respondent IN ("$dd2$")',queryParameters:{earliest:"-60m@m",latest:"now"}},name:"Search_4"}},defaults:{dataSources:{"ds.search":{options:{queryParameters:{latest:"$global_time.latest$",earliest:"$global_time.earliest$"}}}}},inputs:{input_ovnr6KpF:{type:"input.dropdown",options:{items:">frame(label, value) | prepend(formattedStatics) | objects()",token:"dd1",defaultValue:"*"},dataSources:{primary:"ds_search1"},title:"Select Geographic Area",context:{formattedConfig:{number:{prefix:""}},formattedStatics:">statics | formatByType(formattedConfig)",statics:[["All"],["*"]],label:'>primary | seriesByName("Geographic Areas") | renameSeries("label") | formatByType(formattedConfig)',value:'>primary | seriesByName("Geographic Areas") | renameSeries("value") | formatByType(formattedConfig)'}},input_9MxBqEwU:{type:"input.multiselect",options:{items:[{label:"All",value:"*"}],token:"dd2",defaultValue:"*"},dataSources:{primary:"ds_Pk5HZtCJ"},title:"Select Respondent"}},description:"Power a form input from other input values to narrow search results",title:"Cascading Inputs",layout:{tabs:{items:[{layoutId:"layout_1",label:"New tab"}]},layoutDefinitions:{layout_1:{type:"grid",structure:[{item:"viz_RBdQ2qQ5",type:"block",position:{x:0,y:0,w:666,h:853}},{item:"viz_J9wtUPaV",type:"block",position:{x:666,y:0,w:534,h:853}}]}},globalInputs:["input_ovnr6KpF","input_9MxBqEwU"]}};var o=n(r());t(o.default.createElement(e,{definition:a}),{pageTitle:"Cascading Inputs",hideFooter:!0,layout:"fixed"});
