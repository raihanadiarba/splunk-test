"use strict";(self.webpackChunk_splunk_admin_user_xp=self.webpackChunk_splunk_admin_user_xp||[]).push([[3893],{283:(e,t,a)=>{a.d(t,{P8:()=>m,RV:()=>p,gc:()=>u,Cv:()=>d,hw:()=>f});var r=a(96540),n=a(30376),i=a(20259);const o={STRING:(0,i._)("string"),INTEGER:(0,i._)("integer"),DATE:(0,i._)("date"),TIMESTAMP:(0,i._)("timestamp")},l=[{label:(0,i._)("(GMT) Greenwich Mean Time"),id:"GMT",offset:0},{label:(0,i._)("(GMT-11:00) Midway Island, Samoa"),id:"Pacific/Midway",offset:-39600},{label:(0,i._)("(GMT-10:00) Hawaii-Aleutian"),id:"America/Adak",offset:-36e3},{label:(0,i._)("(GMT-10:00) Hawaii"),id:"Pacific/Honolulu",offset:-36e3},{label:(0,i._)("(GMT-09:30) Marquesas Islands"),id:"Pacific/Marquesas",offset:-34200},{label:(0,i._)("(GMT-09:00) Gambier Islands"),id:"Pacific/Gambier",offset:-32400},{label:(0,i._)("(GMT-09:00) Alaska"),id:"America/Anchorage",offset:-32400},{label:(0,i._)("(GMT-08:00) Tijuana, Baja California"),id:"America/Ensenada",offset:-28800},{label:(0,i._)("(GMT-08:00) Pitcairn Islands"),id:"Pacific/Pitcairn",offset:-28800},{label:(0,i._)("(GMT-08:00) Pacific Time (US & Canada)"),id:"America/Los_Angeles",offset:-28800},{label:(0,i._)("(GMT-07:00) Mountain Time (US & Canada)"),id:"America/Denver",offset:-25200},{label:(0,i._)("(GMT-07:00) Chihuahua, La Paz, Mazatlan"),id:"America/Chihuahua",offset:-25200},{label:(0,i._)("(GMT-07:00) Arizona"),id:"America/Dawson_Creek",offset:-25200},{label:(0,i._)("(GMT-06:00) Saskatchewan, Central America"),id:"America/Belize",offset:-21600},{label:(0,i._)("(GMT-06:00) Guadalajara, Mexico City, Monterrey"),id:"America/Mexico_City",offset:-21600},{label:(0,i._)("(GMT-06:00) Easter Island"),id:"Chile/EasterIsland",offset:-21600},{label:(0,i._)("(GMT-06:00) Central Time (US & Canada)"),id:"America/Chicago",offset:-21600},{label:(0,i._)("(GMT-05:00) Eastern Time (US & Canada)"),id:"America/New_York",offset:-18e3},{label:(0,i._)("(GMT-05:00) Cuba"),id:"America/Havana",offset:-18e3},{label:(0,i._)("(GMT-05:00) Bogota, Lima, Quito, Rio Branco"),id:"America/Bogota",offset:-18e3},{label:(0,i._)("(GMT-04:00) Caracas"),id:"America/Caracas",offset:-14400},{label:(0,i._)("(GMT-04:00) Santiago"),id:"America/Santiago",offset:-14400},{label:(0,i._)("(GMT-04:00) La Paz"),id:"America/La_Paz",offset:-14400},{label:(0,i._)("(GMT-04:00) Brazil"),id:"America/Campo_Grande",offset:-14400},{label:(0,i._)("(GMT-04:00) Atlantic Time (Goose Bay)"),id:"America/Goose_Bay",offset:-14400},{label:(0,i._)("(GMT-04:00) Atlantic Time (Canada)"),id:"America/Glace_Bay",offset:-14400},{label:(0,i._)("(GMT-03:30) Newfoundland"),id:"America/St_Johns",offset:-12600},{label:(0,i._)("(GMT-03:00) Faukland Islands"),id:"Atlantic/Stanley",offset:-10800},{label:(0,i._)("(GMT-03:00) UTC-3"),id:"America/Araguaina",offset:-10800},{label:(0,i._)("(GMT-03:00) Montevideo"),id:"America/Montevideo",offset:-10800},{label:(0,i._)("(GMT-03:00) Miquelon, St. Pierre"),id:"America/Miquelon",offset:-10800},{label:(0,i._)("(GMT-03:00) Greenland"),id:"America/Godthab",offset:-10800},{label:(0,i._)("(GMT-03:00) Buenos Aires"),id:"America/Argentina/Buenos_Aires",offset:-10800},{label:(0,i._)("(GMT-03:00) Brasilia"),id:"America/Sao_Paulo",offset:-10800},{label:(0,i._)("(GMT-02:00) Mid-Atlantic"),id:"America/Noronha",offset:-7200},{label:(0,i._)("(GMT-01:00) Cape Verde Is."),id:"Atlantic/Cape_Verde",offset:-3600},{label:(0,i._)("(GMT-01:00) Azores"),id:"Atlantic/Azores",offset:-3600},{label:(0,i._)("(GMT) Greenwich Mean Time : Belfast"),id:"Europe/Belfast",offset:0},{label:(0,i._)("(GMT) Greenwich Mean Time : Dublin"),id:"Europe/Dublin",offset:0},{label:(0,i._)("(GMT) Greenwich Mean Time : Lisbon"),id:"Europe/Lisbon",offset:0},{label:(0,i._)("(GMT) Greenwich Mean Time : London"),id:"Europe/London",offset:0},{label:(0,i._)("(GMT) Monrovia, Reykjavik"),id:"Africa/Abidjan",offset:0},{label:(0,i._)("(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna"),id:"Europe/Amsterdam",offset:3600},{label:(0,i._)("(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague"),id:"Europe/Belgrade",offset:3600},{label:(0,i._)("(GMT+01:00) Brussels, Copenhagen, Madrid, Paris"),id:"Europe/Brussels",offset:3600},{label:(0,i._)("(GMT+01:00) West Central Africa"),id:"Africa/Algiers",offset:3600},{label:(0,i._)("(GMT+02:00) Windhoek"),id:"Africa/Windhoek",offset:7200},{label:(0,i._)("(GMT+02:00) Beirut"),id:"Asia/Beirut",offset:7200},{label:(0,i._)("(GMT+02:00) Cairo"),id:"Africa/Cairo",offset:7200},{label:(0,i._)("(GMT+02:00) Gaza"),id:"Asia/Gaza",offset:7200},{label:(0,i._)("(GMT+02:00) Harare, Pretoria"),id:"Africa/Blantyre",offset:7200},{label:(0,i._)("(GMT+02:00) Jerusalem"),id:"Asia/Jerusalem",offset:7200},{label:(0,i._)("(GMT+02:00) Syria"),id:"Asia/Damascus",offset:7200},{label:(0,i._)("(GMT+03:00) Minsk"),id:"Europe/Minsk",offset:10800},{label:(0,i._)("(GMT+03:00) Istanbul"),id:"Europe/Istanbul",offset:10800},{label:(0,i._)("(GMT+03:00) Moscow, St. Petersburg, Volgograd"),id:"Europe/Moscow",offset:10800},{label:(0,i._)("(GMT+03:00) Nairobi"),id:"Africa/Addis_Ababa",offset:10800},{label:(0,i._)("(GMT+03:30) Tehran"),id:"Asia/Tehran",offset:12600},{label:(0,i._)("(GMT+04:00) Abu Dhabi, Muscat"),id:"Asia/Dubai",offset:14400},{label:(0,i._)("(GMT+04:00) Yerevan"),id:"Asia/Yerevan",offset:14400},{label:(0,i._)("(GMT+04:30) Kabul"),id:"Asia/Kabul",offset:16200},{label:(0,i._)("(GMT+05:00) Tashkent"),id:"Asia/Tashkent",offset:18e3},{label:(0,i._)("(GMT+05:00) Ekaterinburg"),id:"Asia/Yekaterinburg",offset:18e3},{label:(0,i._)("(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi"),id:"Asia/Kolkata",offset:19800},{label:(0,i._)("(GMT+05:45) Kathmandu"),id:"Asia/Katmandu",offset:20700},{label:(0,i._)("(GMT+06:00) Astana, Dhaka"),id:"Asia/Dhaka",offset:21600},{label:(0,i._)("(GMT+06:30) Yangon (Rangoon)"),id:"Asia/Rangoon",offset:23400},{label:(0,i._)("(GMT+07:00) Novosibirsk"),id:"Asia/Novosibirsk",offset:25200},{label:(0,i._)("(GMT+07:00) Bangkok, Hanoi, Jakarta"),id:"Asia/Bangkok",offset:25200},{label:(0,i._)("(GMT+07:00) Krasnoyarsk"),id:"Asia/Krasnoyarsk",offset:25200},{label:(0,i._)("(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi"),id:"Asia/Hong_Kong",offset:28800},{label:(0,i._)("(GMT+08:00) Irkutsk, Ulaan Bataar"),id:"Asia/Irkutsk",offset:28800},{label:(0,i._)("(GMT+08:00) Taipei"),id:"Asia/Taipei",offset:28800},{label:(0,i._)("(GMT+08:00) Perth"),id:"Australia/Perth",offset:28800},{label:(0,i._)("(GMT+08:45) Eucla"),id:"Australia/Eucla",offset:31500},{label:(0,i._)("(GMT+09:00) Osaka, Sapporo, Tokyo"),id:"Asia/Tokyo",offset:32400},{label:(0,i._)("(GMT+09:00) Seoul"),id:"Asia/Seoul",offset:32400},{label:(0,i._)("(GMT+09:00) Yakutsk"),id:"Asia/Yakutsk",offset:32400},{label:(0,i._)("(GMT+09:30) Adelaide"),id:"Australia/Adelaide",offset:34200},{label:(0,i._)("(GMT+09:30) Darwin"),id:"Australia/Darwin",offset:34200},{label:(0,i._)("(GMT+10:00) Brisbane"),id:"Australia/Brisbane",offset:36e3},{label:(0,i._)("(GMT+10:00) Hobart"),id:"Australia/Hobart",offset:36e3},{label:(0,i._)("(GMT+10:00) Melbourne"),id:"Australia/Melbourne",offset:36e3},{label:(0,i._)("(GMT+10:00) Sydney"),id:"Australia/Sydney",offset:36e3},{label:(0,i._)("(GMT+10:00) Vladivostok"),id:"Asia/Vladivostok",offset:36e3},{label:(0,i._)("(GMT+10:30) Lord Howe Island"),id:"Australia/Lord_Howe",offset:37800},{label:(0,i._)("(GMT+11:00) Solomon Is., New Caledonia"),id:"Pacific/Guadalcanal",offset:39600},{label:(0,i._)("(GMT+11:00) Magadan"),id:"Asia/Magadan",offset:39600},{label:(0,i._)("(GMT+11:00) Norfolk Island"),id:"Pacific/Norfolk",offset:39600},{label:(0,i._)("(GMT+12:00) Anadyr, Kamchatka"),id:"Asia/Anadyr",offset:43200},{label:(0,i._)("(GMT+12:00) Auckland, Wellington"),id:"Pacific/Auckland",offset:43200},{label:(0,i._)("(GMT+12:00) Fiji, Kamchatka, Marshall Is."),id:"Pacific/Fiji",offset:43200},{label:(0,i._)("(GMT+12:45) Chatham Islands"),id:"Pacific/Chatham",offset:45900},{label:(0,i._)("(GMT+13:00) Nuku Alofa"),id:"Pacific/Tongatapu",offset:46800},{label:(0,i._)("(GMT+14:00) Kiritimati"),id:"Pacific/Kiritimati",offset:50400}],s=(new Map(l.map((e=>[e.id,e]))),(e,t)=>e[t]?e[t].split(","):[]),c=(e,t=!1)=>{const a=s(e,"federated.partition.time.fields"),r=s(e,"federated.partition.time.formats"),n=s(e,"federated.partition.time.types");return!a.length&&t?[]:a.map(((e,t)=>({timeField:e,timeFormat:r[t]||"",dataType:n[t]||o.STRING})))},d=e=>{const t=c(e,!0);return{name:e.name,timeField:e["federated.timefield"],timeFormat:e["federated.timeformat"],unixTimeField:e["federated.unixtimefield"],partitionTimezone:e["federated.partition.time.tz"]||"UTC",partitionFilters:t}},u=e=>{const t=c(e,!0);return{timeField:e["federated.timefield"]||"",timeFormat:e["federated.timeformat"]||"",unixTimeField:e["federated.unixtimefield"]||"",dataset:e["federated.dataset"],partitionTimezone:e["federated.partition.time.tz"]||"UTC",partitionFilters:t}},f=(e,t)=>{if(!e.dataset)throw new Error("Dataset is required to save the index");const a=e.partitionFilters.map((e=>e.timeField)).join(","),r=e.partitionFilters.map((e=>e.timeFormat)).join(","),n=e.partitionFilters.map((e=>e.dataType)).join(","),i={name:e.name,"federated.provider":t,"federated.timefield":e.timeField,"federated.timeformat":e.timeFormat,"federated.unixtimefield":e.unixTimeField,"federated.dataset":e.dataset};return e.partitionFilters.length>0&&(i["federated.partition.time.fields"]=a,i["federated.partition.time.formats"]=r,i["federated.partition.time.types"]=n,i["federated.partition.time.tz"]=e.partitionTimezone),i},p=e=>[{key:"Time field",value:e.timeField},{key:"Time format",value:e.timeFormat},{key:"Unix time field",value:e.unixTimeField}],m=e=>[{key:"Partition time zone",value:e.partitionTimezone},{key:"Time filters",value:r.createElement(r.Fragment,null,e.partitionFilters.map((e=>r.createElement("div",{key:e.timeField},(0,n.nv)((0,i._)("%s, %s, %s"),e.timeField,e.timeFormat,e.dataType)))))}]},7783:(e,t,a)=>{a.d(t,{l:()=>r});let r=function(e){return e.Create="create",e.Edit="edit",e}({})},8209:(e,t,a)=>{a.d(t,{b:()=>i,y:()=>n});var r=a(96540);const n=(0,r.createContext)(void 0),i=()=>{const e=(0,r.useContext)(n);if(!e)throw new Error("useCreatorContext must be used within a CreateContextProvider");return e}},12624:(e,t,a)=>{a.d(t,{y:()=>c});var r=a(83527),n=a(39854),i=a(91091);function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){s(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const c=l(l({},(0,n.c)({baseUrl:r.CX,isNamespaced:!1})),{},{getProviderIndexes:({urlOpts:e,signal:t,queryParams:a,providerName:n})=>{const o=l(l({},a||{}),{},{"federated.provider":n}),s=(0,i.u2)(r.CX,e,o,!1);return(0,i.AT)(s.url,{method:"GET",queryParams:s.queryParams,signal:t})}})},16791:(e,t,a)=>{a.d(t,{b:()=>c});var r=a(39854),n=a(91091),i=a(83527);function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){s(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const c=l(l({},(0,r.c)({baseUrl:i.$j})),{},{updateAcsPolicy({urlOpts:e,queryParams:t,signal:a}){const r=`${i.$j}/updateACSPolicy`,o=(0,n.u2)(r,e,t);return(0,n.AT)(o.url,{method:"POST",queryParams:o.queryParams,signal:a})},getStackRegion:({urlOpts:e,queryParams:t,signal:a})=>{const r=`${i.$j}/getRegion`,o=(0,n.u2)(r,e,t);return(0,n.AT)(o.url,{method:"GET",queryParams:o.queryParams,signal:a})},generatePolicy:({data:e,urlOpts:t,signal:a})=>{const r=`${i.$j}/generatePolicy`,o=(0,n.u2)(r,t,l({},e));return(0,n.AT)(o.url,{method:"GET",queryParams:o.queryParams,signal:a})}})},18458:(e,t,a)=>{a.d(t,{p:()=>n});const r=Object.freeze([{value:"us-east-1",name:"US East (N. Virginia)"},{value:"us-east-2",name:"US East (Ohio)"},{value:"us-west-1",name:"US West (N. California)"},{value:"us-west-2",name:"US West (Oregon)"},{value:"ca-central-1",name:"Canada (Central)"},{value:"eu-central-1",name:"EU (Frankfurt)"},{value:"eu-west-1",name:"EU (Ireland)"},{value:"eu-west-2",name:"EU (London)"},{value:"eu-west-3",name:"EU (Paris)"},{value:"eu-north-1",name:"EU (Stockholm)"},{value:"ap-northeast-1",name:"Asia Pacific (Tokyo)"},{value:"ap-northeast-2",name:"Asia Pacific (Seoul)"},{value:"ap-south-1",name:"Asia Pacific (Mumbai)"},{value:"ap-southeast-1",name:"Asia Pacific (Singapore)"},{value:"ap-southeast-2",name:"Asia Pacific (Sydney)"},{value:"sa-east-1",name:"South America (Sao Paulo)"},{value:"us-gov-west-1",name:"US Gov West"},{value:"us-gov-east-1",name:"US Gov East"}]),n=new Map(r.reduce(((e,{name:t,value:a})=>(e.push([a,t]),e)),[]))},19838:(e,t,a)=>{a.d(t,{y:()=>x});var r=a(96540),n=a(99263),i=a(78967),o=a(37801),l=a.n(o),s=a(25338),c=a.n(s),d=a(39643),u=a.n(d),f=a(57914),p=a.n(f),m=a(70181),b=a.n(m),v=a(24379),g=a.n(v),E=a(28291),y=a.n(E),_=a(93410),h=a(57337),T=a(7783),O=a(23347),P=a(77422),A=a(91311);const S=n.default.div`
    width: 400px;
    margin-bottom: ${i.variables.spacingXLarge};
`,w=n.default.div`
    display: flex;
    gap: ${i.variables.spacingLarge};
    justify-content: flex-start;
    align-items: center;
`,C=(0,n.default)(y())`
    color: ${i.variables.accentColorPositive};
`,D=n.default.div`
    margin: ${i.variables.spacingLarge} 0;
`,x=({apiToken:e,apiTokenError:t,setApiToken:a,salConfiguration:n,onTestConnection:i,viewMode:o=T.l.Create,isLoading:s,isConnectionTestCalled:d,isConnectionBtnHidden:f=!1})=>r.createElement(r.Fragment,null,r.createElement(P.h,{level:2,mb:4},h.Px.AUTH_HEADING),r.createElement(S,null,r.createElement(l(),{labelPosition:"top",required:o===T.l.Create,error:t??void 0,label:h.Px.API_TOKEN_LABEL,help:h.Px.API_TOKEN_HELP},r.createElement(c(),{"data-testid":"api-token-input",canClear:!0,error:!!t,value:e,passwordVisibilityToggle:!0,disabled:s,onChange:(e,{value:t})=>a(t)}))),!f&&r.createElement(w,null,r.createElement("div",null,r.createElement(b(),{label:h.Px.VALIDATE_TOKEN_BUTTON,onClick:i,disabled:s})),s&&r.createElement(g(),{"data-testid":"test-connection-wait-spinner"}),n&&!s&&d&&r.createElement(r.Fragment,null,r.createElement(C,null),r.createElement("div",null,h.Px.CONNECTION_SUCCESS))),n&&r.createElement(A.b,{mt:8,mb:4},r.createElement(u(),{level:2},h.Px.CONFIG_HEADING),r.createElement(_.s,{items:(0,O.k)(n)}),r.createElement(D,null),d&&r.createElement(p(),{appearance:"fill",type:"info"},r.createElement(p().Title,null,r.createElement("strong",null,h.Px.ACCESS_ENABLED)))))},21036:(e,t,a)=>{a.d(t,{Z:()=>l});var r=a(96540),n=a(80262),i=a(24379),o=a.n(i);const l=({isBusy:e,children:t,className:a})=>r.createElement(n.i,{"data-testid":"busy-box",className:a},t,e&&r.createElement(n.d,{"data-testid":"busybox-overlay",role:"progressbar","aria-busy":e},r.createElement(o(),{size:"large"})))},23347:(e,t,a)=>{a.d(t,{Q:()=>o,k:()=>i});var r=a(57337),n=a(18458);const i=e=>{const{tenantName:t,regionTitle:a}=e;return[{key:r.Sn.TENANT_NAME_KEY,value:t},{key:r.Sn.REGION_KEY,value:a}]},o=e=>({tenantName:e.sal_tenant_name,regionKey:e.aws_region,regionTitle:n.p.get(e.aws_region)||e.aws_region})},29373:(e,t,a)=>{a.d(t,{$:()=>i});var r=a(69211),n=a(75602);const i=()=>window.location.replace((0,r.createURL)(`manager/${n.app}/federated_search`))},31748:(e,t,a)=>{var r=a(96540),n=a(20259),i=a(65792),o=a(78967),l=a(64065),s=a.n(l),c=a(99263);const d=c.default.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    place-content: stretch flex-start;
    align-items: stretch;
    font-size: ${o.variables.fontSize};
    color: ${o.variables.contentColorActive};
`,u=c.default.header`
    padding-left: 20px;
    display: flex;
    flex: 0 0 90px;
    gap: 10px;
    align-items: center;
    border-bottom: 1px solid ${o.variables.neutral200};
    background-color: ${o.variables.backgroundColorPage};
`,f=c.default.div`
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${o.variables.contentColorMuted};
    cursor: pointer;

    svg {
        width: 24px;
        height: 24px;
    }
`,p=c.default.h2`
    font-weight: 500;
    font-size: 24px;
    color: ${o.variables.contentColorActive};
`,m=c.default.div`
    display: flex;
    flex: 1;
`,b=c.default.aside`
    box-sizing: border-box;
    width: 230px;
    padding-left: ${o.variables.spacingSmall};
    flex: 0 0 230px;
    background-color: ${o.variables.backgroundColorNavigation};
`,v=c.default.main`
    flex: 0 1 100%;
    background-color: ${o.variables.backgroundColorPage};
`,g=({heading:e,leftPanel:t,content:a,onBack:n})=>r.createElement(d,null,r.createElement(u,null,r.createElement(f,{role:"button",onClick:n},r.createElement(s(),null)),r.createElement(p,null,e)),r.createElement(m,null,r.createElement(b,null,t),r.createElement(v,null,a)));var E=a(81929),y=a(38775),_=a.n(y);const h=({isActive:e})=>e?o.variables.contentColorActive:o.variables.contentColorDefault,T=c.default.div`
    display: flex;
    align-items: center;
    color: ${o.variables.contentColorDefault};
`,O=c.default.div`
    color: ${h};
`,P=c.default.div`
    width: 40px;
    height: 40px;
    margin-right: 5px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${e=>e.isDone&&!e.isActive?o.variables.accentColorPositive:e.isActive?o.variables.contentColorInverted:o.variables.contentColorDefault};

    svg {
        width: 24px;
        height: 24px;
    }

    &::after {
        content: '';
        box-sizing: border-box;
        width: 20px;
        height: 20px;
        position: absolute;
        display: ${({isDone:e,isActive:t})=>e&&!t?"none":"block"};
        border-width: 1px;
        border-style: solid;
        border-color: ${h};
        border-radius: 50%;
        background-color: ${({isActive:e})=>e?o.variables.contentColorActive:"transparent"};
    }
`,A=c.default.div`
    position: relative;
    z-index: 1;
    font-weight: 500;
    font-size: ${o.variables.fontSizeSmall};
`,S=c.default.div`
    margin-top: 10px;
`,w=c.default.div`
    height: 20px;
    margin-bottom: 20px;
    padding-left: 46px;
    position: relative;
    font-size: ${o.variables.fontSizeSmall};

    &::before {
        content: '';
        box-sizing: border-box;
        width: 9px;
        height: 9px;
        position: absolute;
        top: 3px;
        left: 16px;
        border: 1px solid ${o.variables.contentColorActive};
        border-radius: 50%;
        background-color: ${o.variables.contentColorActive};
    }

    &::after {
        content: '';
        position: absolute;
        top: -30px;
        bottom: 10px;
        left: 20px;
        border-left: 1px solid ${o.variables.contentColorActive};
    }
`,C=({step:e,isActive:t,activeSubStepId:a})=>{const n=e.status===E.x.Done;return r.createElement("div",null,r.createElement(T,{isActive:t},r.createElement(P,{"data-testid":t?"icon-active":"icon-default",isActive:t,isDone:n},r.createElement(A,null,n&&!t?r.createElement(_(),{"data-testid":"icon-done",variant:"outlined"}):e.id)),r.createElement(O,{isActive:t},e.title)),!(!t||!e.subSteps?.length)&&r.createElement(S,{"data-testid":"substeps-wrapper"},e.subSteps.map((e=>{const t=a===e.id;return r.createElement(w,{key:e.id,"data-testid":t?"active-substep":"default-substep",isActive:t},r.createElement(O,{isActive:t},e.title))}))))};var D=a(39643),x=a.n(D);const I=c.default.div`
    padding: ${o.variables.spacingLarge} ${o.variables.spacingMedium} ${o.variables.spacingSmall};
`,j=c.default.section`
    margin-bottom: 20px;
`,k=(0,c.default)(x())`
    margin-bottom: 15px;
    color: ${o.variables.contentColorMuted};
`,N=c.default.div`
    margin-left: -8px;
`,G=({config:e,activeStepId:t,activeSubStepId:a})=>{const n=e=>r.createElement(N,null,e.map((e=>r.createElement(C,{key:e.id,isActive:e.id===t,activeSubStepId:a,step:e}))));return r.createElement(I,null,e?.groups?.length?e.groups.map((({title:t,stepIds:a})=>r.createElement(j,{key:t},r.createElement(k,{level:2,variant:"title5"},t),n(e.steps.filter((({id:e})=>a.includes(e))))))):n(e.steps))};var M=a(13700),L=a.n(M),R=a(8209);function $(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function F(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?$(Object(a),!0).forEach((function(t){z(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):$(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function z(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const H=(e,t)=>(t.forEach(((a,r)=>{const n=F(F({},a),{},{prev:t[r-1]||null,next:t[r+1]||null});e.set(a.id,n)})),e);function B(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function U(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?B(Object(a),!0).forEach((function(t){K(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):B(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function K(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const q=e=>{const[t,a]=(0,r.useState)(e.steps[0].id),[n,i]=(0,r.useState)(e.steps[0]?.subSteps?.[0]?.id),[o,l]=(0,r.useState)(e),s=(0,r.useMemo)((()=>(e=>{const t=new Map;return H(t,e.steps),e.steps.forEach((({subSteps:e})=>e&&H(t,e))),t})(e)),[e]),c=!(!s.get(t)?.prev&&!s.get(Number(n))?.prev),d=s.get(t),u=!d.subSteps||!s.get(Number(n))?.next,f=!!s.get(t)?.next||!u,p=(0,r.useCallback)((()=>{if(!c)return;const e=s.get(Number(n))?.prev;if(e)return void i(e.id);const r=s.get(t)?.prev;r?.subSteps&&i(r.subSteps.at(-1)?.id),a(r.id)}),[t,n,c,s]),m=(0,r.useCallback)((()=>{if(!f)return;const e=s.get(Number(n))?.next;void 0!==n&&e?i(e.id):a(Number(s.get(t)?.next?.id))}),[t,n,f,s]),b=(0,r.useCallback)(((e,t)=>{l((a=>U(U({},a),{},{steps:a.steps.map((a=>U(U({},a),{},{status:e===a.id?t:a.status})))})))}),[]);return(0,r.useEffect)((()=>{const e=d?.subSteps?.find((e=>e?.id===n)),t=d?.subSteps?.[0];i(e?.id||t?.id||void 0)}),[d,t,n,s]),{activeStepId:t,activeSubStepId:n,backwardEnabled:c,forwardEnabled:f,moveBack:p,moveForward:m,updateStepStatus:b,stepsConfig:o}};let Y=function(e){return e.SPLUNK="splunk",e.AWS_S3="aws_s3",e.AWS_LAKE="aws_lake",e}({}),X=function(e){return e.CISCO_SAL="cisco_sal",e}({});const V=Object.freeze({type:Y.AWS_S3,subtype:X.CISCO_SAL,providerName:"",apiToken:"",config:null});const W={status:a(73224).$.Initial},Z=Object.freeze({providerBasics:W,defineProvider:W,setUpFederatedIndex:W}),Q={steps:[{id:1,title:(0,n._)("Provider basics"),status:E.x.Idle},{id:2,title:(0,n._)("Define provider"),status:E.x.Idle},{id:3,title:(0,n._)("Set up federated index"),status:E.x.Idle},{id:4,title:(0,n._)("Review"),status:E.x.Idle}],groups:[{title:(0,n._)("Connect"),stepIds:[1,2]},{title:(0,n._)("Configure"),stepIds:[3,4]}]};function J(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function ee(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?J(Object(a),!0).forEach((function(t){te(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):J(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function te(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const ae=({children:e})=>{const[t,a]=(0,r.useState)({providers:[],existingFederatedIndexes:[]}),[n,i]=(0,r.useState)(V),[o,l]=(0,r.useState)(),[s,c]=(0,r.useState)(Z),d=q(Q),u=(0,r.useCallback)(((e,t)=>{c((a=>ee(ee({},a),{},{[e]:t})))}),[]);return r.createElement(R.y.Provider,{value:{stepsState:d,stackInfo:t,providerData:n,indexData:o,workflow:s,updateWorkflow:u,setStackInfo:a,updateProviderData:i,updateIndexData:l}},e)},re=e=>{const t=e.stepsConfig.steps.find((({id:t})=>e.activeStepId===t));return`wizard-content-${(t?.title||e.activeStepId.toString()).replace(/\s+/g,"-").toLowerCase()}`},ne={1:r.lazy((()=>Promise.all([a.e(8096),a.e(1924)]).then(a.bind(a,1924)))),2:r.lazy((()=>a.e(7145).then(a.bind(a,87145)))),3:r.lazy((()=>Promise.all([a.e(8096),a.e(4822)]).then(a.bind(a,24822)))),4:r.lazy((()=>Promise.all([a.e(8096),a.e(2439)]).then(a.bind(a,92439))))},ie=c.default.div`
    padding: 20px 40px;
`,oe=({})=>{const{stepsState:e}=(0,R.b)(),t=ne[e.activeStepId];return r.createElement(ie,{"data-testid":re(e)},r.createElement(r.Suspense,{fallback:r.createElement("div",null)},r.createElement(t,null)))};var le=a(29373);const se=()=>{const{stepsState:e}=(0,R.b)();return r.createElement(g,{heading:(0,n._)("Add a new Cisco Security Analytics and Logging provider"),onBack:le.$,leftPanel:r.createElement(G,{config:e.stepsConfig,activeStepId:e.activeStepId}),content:r.createElement(oe,null)})},ce=()=>r.createElement(ae,null,r.createElement(L(),{position:"top-center"}),r.createElement(se,null));var de=a(47767),ue=a(57914),fe=a.n(ue),pe=a(57337),me=a(93410),be=a(23347),ve=a(70181),ge=a.n(ve),Ee=a(15091),ye=a.n(Ee),_e=a(56143),he=a.n(_e),Te=a(24379),Oe=a.n(Te),Pe=a(40426),Ae=a.n(Pe),Se=a(32783),we=a.n(Se);const Ce=c.default.div`
    min-width: 750px;
    max-width: 1000px;
    padding: 40px 170px ${140}px 120px;
    color: ${o.variables.contentColorActive};
`,De=c.default.footer`
    height: ${100}px;
    padding: 0 100px;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid ${o.variables.neutral200};
    background-color: ${o.variables.backgroundColorDialog};
`,xe=c.default.div`
    margin-bottom: ${o.variables.spacingLarge};
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`,Ie=c.default.div`
    flex: 1;
`,je=(0,c.default)(x())`
    max-width: 100%;
    margin-top: 0;
    overflow-wrap: break-word;
`,ke=(0,c.default)(ge())`
    position: absolute;
    top: 7px;
    right: -150px;
    flex: 0 1 auto;
`,Ne=c.default.div`
    width: 40px;
    height: 40px;
    position: absolute;
    top: 4px;
    left: -60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${o.variables.contentColorActive};
    cursor: pointer;

    svg {
        width: 26px;
        height: 26px;
    }
`,Ge=c.default.div`
    width: 100%;
    height: calc(100vh - 200px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
`,Me=({heading:e,description:t,isLoading:a,children:i,mode:o,canEdit:l=!0,actionsDisabled:s,saveDisabled:c,onBack:d,onEdit:u,onCancel:f,onSave:p})=>r.createElement(Ce,{"data-testid":"provider-editor-wrapper"},r.createElement(xe,null,"view"===o&&r.createElement(Ne,{"data-testid":"provider-editor-back-button",onClick:d},r.createElement(we(),null)),r.createElement(Ie,null,r.createElement(je,{variant:"title1",level:1},e),r.createElement(he(),null,t)),"view"===o&&l&&r.createElement(ke,{"data-testid":"provider-editor-edit-button",icon:r.createElement(Ae(),null),onClick:u,label:(0,n._)("Edit provider")})),a?r.createElement(Ge,null,r.createElement(Oe(),{size:"large"})):r.createElement("div",null,i),"edit"===o&&r.createElement(De,null,r.createElement(ye(),null,r.createElement(ge(),{"data-testid":"provider-editor-cancel-button",disabled:s,label:(0,n._)("Cancel"),onClick:f}),r.createElement(ge(),{"data-testid":"provider-editor-save-button",disabled:s||c,appearance:"primary",label:(0,n._)("Save"),onClick:p}))));var Le=a(36724),Re=a(29466),$e=a(16791),Fe=a(54993),ze=a(12624),He=a(37106),Be=a(283);const Ue=e=>{const t=(0,Re.k)((()=>$e.b.getItem({name:e||""})),Fe.XH),a=(0,Re.k)((()=>ze.y.getProviderIndexes({providerName:e||""})),Fe.XH);return(0,r.useEffect)((()=>{e&&(t.loadData(),a.loadData())}),[e]),{providerData:t.convertedData?(0,He.i)(t.convertedData):null,indexData:a.convertedData?(0,Be.Cv)(a.convertedData):null,isLoading:t.isLoading||a.isLoading,isError:t.isError||a.isError,isSuccess:t.isSuccess&&a.isSuccess}};var Ke=a(91311);const qe=()=>{const{providerName:e}=(0,de.g)(),{providerData:t,indexData:a,isLoading:n,isError:i,isSuccess:o}=Ue(e),l=(0,de.Zp)();return r.createElement(r.Fragment,null,r.createElement(L(),{position:"top-center"}),r.createElement(Me,{mode:"view",heading:e||"",description:pe.Sv,actionsDisabled:!1,onBack:le.$,onEdit:()=>l(`/${e}/edit`),onSave:()=>"",onCancel:()=>"",isLoading:n,saveDisabled:!1},i&&r.createElement(fe(),{appearance:"fill",type:"error"},r.createElement(fe().Title,null,r.createElement("strong",null,pe.wx)),r.createElement("div",null,pe.Dl)),o&&t&&r.createElement(r.Fragment,null,r.createElement(x(),{level:2},pe.nb.AUTHENTICATION_HEADING),r.createElement(me.s,{items:[{key:pe.nb.API_TOKEN_KEY,value:"********"}]}),t.config&&r.createElement(Ke.b,{my:7},r.createElement(x(),{level:3},pe.nb.CONFIGURATIONS_HEADING),r.createElement(me.s,{items:(0,be.k)(t.config)})),r.createElement(x(),{level:2},pe.nb.FEDERATED_INDEX_HEADING),!a&&r.createElement("strong",null,pe.gW),a&&r.createElement(r.Fragment,null,r.createElement(me.s,{items:[{key:pe.nb.FEDERATED_INDEX_NAME_KEY,value:a.name},{key:pe.wD.LOG_TYPE_KEY,value:pe.wD.LOG_TYPE_CISCO_FIREWALL}]}),r.createElement(Ke.b,{mt:6},r.createElement(Le.z,{indexData:a}))))))},Ye=(0,r.createContext)(void 0),Xe=()=>{const e=(0,r.useContext)(Ye);if(!e)throw new Error("useEditorContext must be used within a EditorContextProvider");return e},Ve=({children:e})=>{const[t,a]=(0,r.useState)({providers:[],existingFederatedIndexes:[]}),[n,i]=(0,r.useState)(),[o,l]=(0,r.useState)(),[s,c]=(0,r.useState)(),[d,u]=(0,r.useState)(!1);return r.createElement(Ye.Provider,{value:{stackInfo:t,providerData:n,indexData:o,indexNameError:s,isCreatingNewIndex:d,setStackInfo:a,updateProviderData:i,updateIndexData:l,updateIsCreatingNewIndex:u,updateIndexNameError:c}},e)};var We=a(56124),Ze=a(8231),Qe=a(96892);function Je(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function et(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const tt=()=>{const{providerName:e}=(0,de.g)(),{providerData:t,indexData:a,isLoading:n,isError:i,isSuccess:o}=Ue(e),l=(0,We._)(),{providerData:s,updateProviderData:c,indexData:d,updateIndexData:u,updateIndexNameError:f,isCreatingNewIndex:p}=Xe(),m=(0,de.Zp)();return(0,r.useEffect)((()=>{o&&(t&&c(t),a&&u(a))}),[o]),r.createElement(r.Fragment,null,r.createElement(Me,{mode:"edit",heading:e||"",description:pe.Sv,actionsDisabled:!1,saveDisabled:!s?.apiToken&&!p,onBack:le.$,onEdit:()=>"",onSave:async()=>{try{if(s?.apiToken&&await $e.b.updateItem({body:{name:s.providerName,type:"aws_s3",subtype:"cisco_sal",sal_token:s.apiToken}}),d&&p&&s){const e=(0,Qe.Q)(d.name);if(e)return void f(e);const t=function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?Je(Object(a),!0).forEach((function(t){et(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):Je(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({},(0,Be.hw)(d,s.providerName));await ze.y.createItem({body:t})}(0,le.$)()}catch(e){const t=e;return void l({type:Ze.TOAST_TYPES.ERROR,message:t.toString(),autoDismiss:!1})}},onCancel:()=>m(`/${e}`),isLoading:n},i&&r.createElement(fe(),{appearance:"fill",type:"error"},r.createElement(fe().Title,null,r.createElement("strong",null,pe.wx)),r.createElement("div",null,pe.Dl)),o&&r.createElement(de.sv,null)))},at=()=>r.createElement(Ve,null,r.createElement(L(),{position:"top-center"}),r.createElement(tt,null)),rt=/\/federated_search\/cisco_sal_provider\/?(.*)/;let nt=function(e){return e.PROVIDER_DETAILS="provider_details",e.FEDERATED_INDEX="federated_index",e}({});var it=a(84608),ot=a.n(it),lt=a(57748),st=a(19838),ct=a(7783),dt=a(92336),ut=a(63459),ft=a.n(ut);const pt=c.default.div`
    height: 345px;
    padding: ${o.variables.spacingLarge};
    display: flex;
    flex-direction: column;
    gap: ${o.variables.spacingXLarge};
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border: ${o.variables.border} solid ${o.variables.neutral200};
    border-radius: ${o.variables.borderRadius};
    font-weight: ${o.variables.fontWeightBold};
    font-style: normal;
    font-size: ${o.variables.fontSizeLarge};
    font-family: ${o.variables.fontFamily};
    line-height: ${o.variables.lineHeight};
    text-align: center;
    background: ${o.variables.backgroundColorSection};
    color: ${o.variables.contentColorDefault};
`,mt=({onClick:e})=>r.createElement(pt,{"data-testid":"no-indexes-placeholder"},r.createElement("div",null,(0,n._)("No index created for this provider")),r.createElement("div",null,r.createElement(ge(),{"data-testid":"add-index-placeholder-button",appearance:"secondary",icon:r.createElement(ft(),null),label:(0,n._)("Add index"),onClick:e})));var bt=a(21036);function vt(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function gt(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?vt(Object(a),!0).forEach((function(t){Et(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):vt(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function Et(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const yt=c.default.div`
    width: 815px;
    padding: ${o.variables.spacingLarge} 0;
`,_t=({activePanelId:e})=>{const t=(0,de.Zp)(),{providerName:a}=(0,de.g)(),{providerData:i,updateProviderData:o,indexData:l,indexNameError:s,isCreatingNewIndex:c,updateIndexData:d,updateIsCreatingNewIndex:u}=Xe(),[f,p]=(0,r.useState)(""),[m,b]=(0,r.useState)(null),[v,g]=(0,r.useState)(!1),[E,y]=(0,r.useState)(!1),[_,h]=(0,r.useState)(!1),T=(0,r.useCallback)((async()=>{g(!0),b(null);const e=!!f.length?{salToken:f}:{providerName:i?.providerName};try{const t=(0,Fe.XH)(await(0,dt.B)(e));if(!t)return void b(pe.O3.CHECK_CONNECTION_ERROR);i&&o(gt(gt({},i),{},{config:(0,be.Q)(t),apiToken:f})),y(!0)}catch(e){b(e.toString()||pe.O3.CHECK_CONNECTION_ERROR),i&&o(gt(gt({},i),{},{config:null}))}finally{g(!1)}}),[f,i,o]);return r.createElement(ot(),{"data-testid":"federation-tab-layout",activePanelId:e,onChange:(e,{activePanelId:r})=>{r&&a&&t(`/${a}/edit/${r}`)}},r.createElement(ot().Panel,{label:(0,n._)("Provider details"),panelId:nt.PROVIDER_DETAILS},r.createElement(r.Fragment,null,i&&r.createElement(st.y,{apiToken:f,setApiToken:p,apiTokenError:m,salConfiguration:i?.config||null,onTestConnection:T,isLoading:v,viewMode:ct.l.Edit,isConnectionTestCalled:E}))),r.createElement(ot().Panel,{label:(0,n._)("Federated index"),panelId:nt.FEDERATED_INDEX},l&&!c&&r.createElement(lt.T,{viewMode:ct.l.Edit,indexName:l.name,indexData:l}),!l&&!c&&r.createElement(bt.Z,{isBusy:_},r.createElement(yt,null,r.createElement(mt,{onClick:async()=>{h(!0);try{const e=(0,Fe.XH)(await(0,dt.H)({providerName:i?.providerName||"",salDataset:"ftd-events"}));if(!e)return;const t=gt(gt({},(0,Be.gc)(e)),{},{name:""});d(t),u(!0)}catch(e){b(e.toString())}finally{h(!1)}}}))),l&&c&&r.createElement(lt.T,{viewMode:ct.l.Create,indexName:l.name,nameError:s,indexData:l,setIndexName:e=>d(gt(gt({},l),{},{name:e}))})))},ht=()=>{const e=location.pathname.replace(rt,"/federated_search/cisco_sal_provider");return r.createElement(r.Fragment,null,r.createElement(i.Kd,{basename:e},r.createElement(i.BV,null,r.createElement(i.qh,{path:"/",element:r.createElement(ce,null)}),r.createElement(i.qh,{path:"/:providerName",element:r.createElement(qe,null)}),r.createElement(i.qh,{path:"/:providerName/edit",element:r.createElement(at,null)},r.createElement(i.qh,{index:!0,element:r.createElement(i.C5,{to:nt.PROVIDER_DETAILS,replace:!0})}),r.createElement(i.qh,{path:"*",element:r.createElement(i.C5,{to:nt.PROVIDER_DETAILS,replace:!0})}),r.createElement(i.qh,{path:nt.PROVIDER_DETAILS,element:r.createElement(_t,{activePanelId:nt.PROVIDER_DETAILS})}),r.createElement(i.qh,{path:nt.FEDERATED_INDEX,element:r.createElement(_t,{activePanelId:nt.FEDERATED_INDEX})})),r.createElement(i.qh,{path:"*",element:r.createElement(i.C5,{to:"/"})}))))},Tt=c.createGlobalStyle`
    html, body {
        height: 100%;
        padding: 0 !important;
    }
    
    div[role=main] {
        height: calc(100% - 35px); // SPLUNKBAR_HEIGHT=34px is hardcoded in @splunk/react-page
        
        & > div {
            height: 100%;
        }
    }
`;var Ot=a(78598),Pt=a(86819),At=a.n(Pt);const St=c.createGlobalStyle`
    body {
        margin: 0;
        background-color: ${o.variables.backgroundColorPage};
        font-family: ${o.variables.fontFamily};
        font-size: ${o.variables.fontSize};
        color: ${o.variables.contentColorDefault};
        min-width: ${"960px"};
    }

    // Input overrides because of conflicting styles between our bootstrap css files and SUI
    // can be removed once we remove bootstrap-{theme}.css (ie whenever we handle layout-api being rendered by backbone) 
    input[type=color], input[type=date], input[type=datetime-local], input[type=datetime], input[type=email], input[type=month], input[type=number], input[type=password], input[type=search], input[type=tel], input[type=text], input[type=time], input[type=url], input[type=week], textarea {
        height: auto;
        margin-bottom: 0;
        padding: 0;
        &:focus {
            box-shadow: none;
        }
    }
`;function wt(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function Ct(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const Dt=e=>{const t=document.createElement("span");t.textContent=e,document.body.appendChild(t)},xt=(e,t,a)=>function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?wt(Object(a),!0).forEach((function(t){Ct(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):wt(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({theme:t,pageTitle:e,hideFooter:!0,hideAppBar:!0,layout:"scrolling",navLayout:"auto"},a?{themeFamily:a}:{});(({family:e="enterprise",density:t="comfortable",pageTitle:a,Component:n})=>{(0,Ot.Fo)().then((i=>{At()(r.createElement(o.SplunkThemeProvider,{family:e,colorScheme:i,density:t},r.createElement(St,null),r.createElement(n,null)),xt(a,i,e))})).catch(Dt)})({family:"prisma",pageTitle:(0,n._)("Federation - New Cisco SAL provider | Splunk Cloud"),Component:()=>r.createElement(r.Fragment,null,r.createElement(Tt,null),r.createElement(ht,null))})},33101:(e,t,a)=>{a.d(t,{EI:()=>i,Gz:()=>o,Ze:()=>n});var r=a(20259);const n=(0,r._)("Provider name is required"),i=(0,r._)("Provider name already exists"),o=(0,r._)("Federated provider name may contain only letters, numbers, underscores, or hyphens. They must begin with a letter or number.")},36724:(e,t,a)=>{a.d(t,{z:()=>d});var r=a(96540),n=a(39643),i=a.n(n),o=a(93410),l=a(283),s=a(57337),c=a(91311);const d=({indexData:e})=>r.createElement("div",null,r.createElement(c.b,{mb:6},r.createElement(i(),{level:4,variant:"title4"},s.Df.SETTINGS_HEADING),r.createElement(o.s,{items:(0,l.RV)(e)})),r.createElement(i(),{level:4,variant:"title4"},s.Df.PARTITION_HEADING),r.createElement(o.s,{items:(0,l.P8)(e)}))},37106:(e,t,a)=>{a.d(t,{i:()=>n});var r=a(18458);const n=e=>({providerName:e.name,type:e.type,subtype:e.subtype,config:{tenantName:e.sal_tenant_name,regionKey:e.aws_region,regionTitle:r.p.get(e.aws_region)}})},45023:(e,t,a)=>{a.d(t,{lW:()=>r});const r=async e=>{if(e)try{return navigator.clipboard.writeText(e)}catch(e){return Promise.reject(e)}return Promise.reject(new Error("No text to copy"))}},54993:(e,t,a)=>{a.d(t,{XH:()=>c});a(86663),a(30376),a(20259),a(76348),a(74460),a(93681);function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function n(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e){return e.entry||[]}function l(e){return o(e)[0]||null}function s(e){return n(n({},e.content),{},{name:e.name})}function c(e){const t=l(e);return t?s(t):null}},57337:(e,t,a)=>{a.d(t,{AW:()=>v,C1:()=>n,Df:()=>d,Dl:()=>m,N6:()=>s,O3:()=>i,Px:()=>o,Sn:()=>l,Sv:()=>f,gW:()=>b,nb:()=>u,sE:()=>g,wD:()=>c,wx:()=>p});var r=a(20259);const n=Object.freeze({HEADING:(0,r._)("Provider basics"),NAME_INPUT:{LABEL:(0,r._)("Provider name"),HELP:(0,r._)("The name can include only alphanumeric characters, underscores, and hyphens. For example: provider_name_example."),ERROR:(0,r._)("Provider name must be unique and contain only alphanumeric characters, dashes, and underscores.")},SETUP:{HEADING:(0,r._)("For a successful setup:"),PREREQUISITE_1:{HEADING:(0,r._)("1. Turn on token authentication."),DESCRIPTION:(0,r._)("Token authentication is required for the automatic setup of cross-account permissions between your Splunk Cloud Platform deployment and the Cisco Security Analytics and Logging log storage account."),LINK_TEXT:(0,r._)("Token authentication documentation")},PREREQUISITE_2:{HEADING:(0,r._)("2. Get the access token from the Cisco admin"),DESCRIPTION:(0,r._)("Ask your Cisco admin to provide the  Secure Analytics and Logging Federated Search Access Token required for the configuration of this provider.")}}}),i=Object.freeze({HEADING:(0,r._)("Define provider"),DESCRIPTION:(0,r._)("Federated Search for Cisco Security Analytics and Logging gives you fast, secure search access to Firewall Threat Defense (FTD) logs stored in Cisco's cloud, without moving data."),CHECK_CONNECTION_ERROR:(0,r._)("Failed to connect. Please check your API token and try again."),ERROR_GETTING_PROVIDER_DATA:(0,r._)("Error getting provider data from response")}),o=Object.freeze({AUTH_HEADING:(0,r._)("Authenticate your Security Analytics and Logging tenant"),API_TOKEN_LABEL:(0,r._)("Cisco Security Analytics and Logging access token"),API_TOKEN_HELP:(0,r._)("Obtain this access token from the Cisco Security Analytics and Logging administrator. The Cisco Security Analytics and Logging access token is valid for 7 days from its generation by Cisco Security Cloud Control. You must create the provider and federated index before the access token expires."),VALIDATE_TOKEN_BUTTON:(0,r._)("Validate token"),CONFIG_HEADING:(0,r._)("Security Analytics and Logging configurations"),ACCESS_ENABLED:(0,r._)("Access to Cisco Security Analytics and Logging data enabled"),CONNECTION_SUCCESS:(0,r._)("Validated! Configurations retrieved")}),l=Object.freeze({TENANT_NAME_KEY:(0,r._)("Tenant name"),REGION_KEY:(0,r._)("Region")}),s=Object.freeze({MESSAGE_TITLE:(0,r._)("Your Cisco Security Analytics and Logging provider is successfully created"),MESSAGE_DESCRIPTION:(0,r._)("Now, before your Cisco Security Analytics and Logging access token expires, define a federated index to complete setup and enable search of Cisco Security Analytics and Logging data."),HEADING:(0,r._)("Set up federated index"),DESCRIPTION:(0,r._)("Provide the name for a federated index. By default, Splunk software maps the federated index to a dataset fully managed by Cisco Security Analytics and Logging."),DOCS_LINK_TEXT:(0,r._)("Federated indexes documentation"),LOAD_DATASET_ERROR:(0,r._)("Failed to load dataset")}),c=Object.freeze({INPUT_HEADING:(0,r._)("Federated index name"),INPUT_DESCRIPTION:(0,r._)("The name can include only alphanumeric characters, underscores, and hyphens.. For example: provider_dataset_index."),HEADING:(0,r._)("Index details"),LOG_TYPE_KEY:(0,r._)("Log type"),LOG_TYPE_CISCO_FIREWALL:(0,r._)("Cisco Firewall")}),d=Object.freeze({SETTINGS_HEADING:(0,r._)("Time settings"),PARTITION_HEADING:(0,r._)("Time partition settings")}),u=Object.freeze({HEADING:(0,r._)("Review"),PROVIDER_BASICS_HEADING:(0,r._)("Provider basics"),PROVIDER_TYPE:(0,r._)("Cisco Security Analytics and Logging"),PROVIDER_TYPE_KEY:(0,r._)("Provider type"),PROVIDER_NAME_KEY:(0,r._)("Provider name"),AUTHENTICATION_HEADING:(0,r._)("Authentication"),API_TOKEN_KEY:(0,r._)("Cisco Secure Analytics and Logging access token"),CONFIGURATIONS_HEADING:(0,r._)("Configurations"),FEDERATED_INDEX_HEADING:(0,r._)("Federated index"),FEDERATED_INDEX_NAME_KEY:(0,r._)("Federated index name"),FAILED_TO_SAVE_INDEX:(0,r._)("Failed to save index")}),f=(0,r._)("Cisco Security and Analytics Logging"),p=(0,r._)("Error loading provider overview"),m=(0,r._)("Provider not found"),b=(0,r._)("No indexes created for this provider"),v=Object.freeze({HEADING:(0,r._)("Cisco Security Analytics and Logging provider and index are created"),SUBHEADING:(0,r._)("You can now run a federated search."),DESCRIPTION:(0,r._)("Security Cloud Control can verify that it is connected successfully to Splunk Federated Search. To monitor federated search license usage, go to the Federated Search License dashboard in the Cloud Monitoring Console."),START_SEARCHING_LABEL:(0,r._)("Start searching"),DASHBOARD_LABEL:(0,r._)("Go to Federated Search License dashboard")}),g=Object.freeze({SAVE:(0,r._)("Save"),CANCEL:(0,r._)("Cancel"),NEXT:(0,r._)("Next"),CREATE_PROVIDER:(0,r._)("Create provider and apply policies")});Object.freeze({PROVIDER_DETAILS:(0,r._)("Provider details"),FEDERATED_INDEX:(0,r._)("Federated index")})},57748:(e,t,a)=>{a.d(t,{T:()=>E});var r=a(96540),n=a(78967),i=a(36724),o=a(57337),l=a(37801),s=a.n(l),c=a(39643),d=a.n(c),u=a(25338),f=a.n(u),p=a(99263),m=a(7783),b=a(93410),v=a(91311);const g=p.default.div`
    width: 400px;
    margin-bottom: ${n.variables.spacingXLarge};
`,E=({viewMode:e,indexName:t,indexData:a,setIndexName:n,nameError:l})=>r.createElement("div",null,e===m.l.Create&&n&&r.createElement(r.Fragment,null,r.createElement(g,null,r.createElement(s(),{labelPosition:"top",required:!0,error:l,label:o.wD.INPUT_HEADING,help:o.wD.INPUT_DESCRIPTION},r.createElement(f(),{"data-testid":"federated-index-name-input",canClear:!0,error:!!l,value:t,onChange:(e,{value:t})=>n(t)}))),r.createElement(d(),{level:2,variant:"title2"},o.wD.HEADING)),e===m.l.Edit&&r.createElement(b.s,{items:[{key:o.wD.INPUT_HEADING,value:t}]}),r.createElement(v.b,{mb:6},r.createElement(b.s,{items:[{key:o.wD.LOG_TYPE_KEY,value:o.wD.LOG_TYPE_CISCO_FIREWALL}]})),r.createElement(i.z,{indexData:a}))},64203:(e,t,a)=>{a.d(t,{o:()=>n});var r=a(78967);const n={1:r.variables.spacingQuarter,2:r.variables.spacingHalf,3:r.variables.spacingXSmall,4:r.variables.spacingSmall,5:r.variables.spacingMedium,6:r.variables.spacingLarge,7:r.variables.spacingXLarge,8:r.variables.spacingXXLarge,9:r.variables.spacingXXXLarge}},73224:(e,t,a)=>{a.d(t,{$:()=>r});let r=function(e){return e[e.Initial=0]="Initial",e[e.Success=1]="Success",e[e.Failed=2]="Failed",e}({})},74460:(e,t,a)=>{a.d(t,{T:()=>r});const r=[10,25,50,100];r[0]},76348:(e,t,a)=>{a.d(t,{W:()=>r});let r=function(e){return e.ASC="asc",e.DESC="desc",e}({})},77422:(e,t,a)=>{a.d(t,{h:()=>s});var r=a(96540),n=a(39643),i=a.n(n),o=a(64203);const l=(0,a(99263).default)(i())`
    margin-top: ${({mt:e})=>e?o.o[e]:void 0};
    margin-bottom: ${({mb:e})=>e?o.o[e]:void 0};
`,s=({level:e,mt:t,mb:a,children:n})=>r.createElement(l,{level:e,mt:t,mb:a},n)},78931:(e,t,a)=>{a.d(t,{J:()=>n,gB:()=>i,pn:()=>o});var r=a(20259);let n=function(e){return e.ERROR="error",e.INFO="info",e.SUCCESS="success",e.WARNING="warning",e}({});const i={type:n.ERROR,message:(0,r._)("Your network connection may have been lost or Splunk may be down.")},o={type:n.ERROR,message:(0,r._)("Something went wrong, please try again.")}},80262:(e,t,a)=>{a.d(t,{d:()=>l,i:()=>o});var r=a(99263),n=a(78967),i=a(76806);const o=r.default.div`
    position: relative;
    display: inline-block;
    padding: 0;
`,l=r.default.div`
    position: absolute;
    padding: ${n.variables.spacingLarge};
    inset: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    animation: pulse 2s infinite;

    @keyframes pulse {
        0% {
            background-color: ${(0,i.colorWithAlpha)(n.variables.backgroundColorPage,.2)};
        }
        50% {
            background-color: ${(0,i.colorWithAlpha)(n.variables.backgroundColorPage,.7)};
        }
        100% {
            background-color: ${(0,i.colorWithAlpha)(n.variables.backgroundColorPage,.2)};
        }
    }
`},81929:(e,t,a)=>{a.d(t,{x:()=>r});let r=function(e){return e[e.Idle=0]="Idle",e[e.Done=1]="Done",e}({})},83527:(e,t,a)=>{a.d(t,{$j:()=>r,CX:()=>n});const r="data/federated/provider",n="data/federated/index"},91311:(e,t,a)=>{a.d(t,{b:()=>o});var r=a(96540),n=a(64203);const i=a(99263).default.div`
    margin-top: ${({mt:e,my:t})=>e?n.o[e]:t?n.o[t]:void 0};
    margin-bottom: ${({mb:e,my:t})=>e?n.o[e]:t?n.o[t]:void 0};
`,o=({mt:e,mb:t,my:a,children:n})=>r.createElement(i,{mt:e,mb:t,my:a},n)},92336:(e,t,a)=>{a.d(t,{B:()=>s,H:()=>c});var r=a(83527),n=a(91091);function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const s=({urlOpts:e,queryParams:t,signal:a,salToken:i,providerName:l})=>{const s=l?`${r.$j}/${l}/checkConnection`:`${r.$j}/checkConnection`,c=(0,n.u2)(s,e,o({},t));return(0,n.AT)(c.url,{method:"POST",queryParams:c.queryParams,signal:a,body:{type:"aws_s3",subtype:"cisco_sal",sal_token:i}})},c=({urlOpts:e,queryParams:t,signal:a,salDataset:i,providerName:l})=>{const s=`${r.$j}/${l}/getSalDatasets`,c=(0,n.u2)(s,e,o(o({},t),{},{sal_dataset:i}));return(0,n.AT)(c.url,{method:"GET",queryParams:c.queryParams,signal:a})}},93410:(e,t,a)=>{a.d(t,{s:()=>_});var r=a(96540),n=a(20259),i=a(28546),o=a.n(i),l=a(22427),s=a.n(l),c=a(45023),d=a(78967),u=a(99263);function f(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function p(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?f(Object(a),!0).forEach((function(t){m(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):f(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function m(e,t,a){return(t=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const b=u.default.div`
    margin-top: ${d.variables.spacingLarge};
    display: grid;
    grid-template-columns: ${({fullWidth:e})=>"180px "+(e?"1fr":"300px")};
    grid-gap: ${d.variables.spacingLarge};
    row-gap: ${d.variables.spacingSmall};
    font-size: ${d.variables.fontSize};
`,v=u.default.span`
    color: ${d.variables.contentColorDefault};
`,g=u.default.span`
    color: ${d.variables.contentColorActive};
    cursor: ${({clickable:e})=>e?"pointer":"default"};

    &:hover {
        opacity: ${({clickable:e})=>e?.7:1};
    }
`,E=(0,u.default)(s())`
    width: 18px;
    height: 18px;
    margin-left: 30px;
    fill: ${d.variables.contentColorDefault};
`,y=(e,t)=>e?t?(0,n._)("Copied"):(0,n._)("Copy"):null,_=({items:e,fullWidth:t})=>{const[a,n]=(0,r.useState)({});return r.createElement(b,{"data-testid":"data-fields-list",fullWidth:t},e.map((({key:e,value:t,allowCopy:i})=>{const l=i&&"string"==typeof t;return r.createElement(r.Fragment,{key:e},r.createElement(v,{"data-testid":"data-fields-list-key"},e),r.createElement(o(),{closeDelay:1e3,defaultPlacement:"right",content:y(!!l,a?.[e]),onRequestOpen:()=>{a?.[e]&&n((t=>p(p({},t),{},{[e]:!1})))}},r.createElement(g,{"data-testid":"data-fields-list-value",clickable:l,onClick:()=>{l&&((0,c.lW)(t),n((t=>p(p({},t),{},{[e]:!0}))))}},t,l&&r.createElement(E,null))))})))}},93681:(e,t,a)=>{var r=a(74460),n=a(76348);r.T[0],n.W.ASC},96892:(e,t,a)=>{a.d(t,{Q:()=>i});var r=a(33101);const n=new RegExp(/^[a-zA-Z\d][a-zA-Z\d\-_]*$/),i=e=>{const t=e.trim();return t?n.test(t)?null:r.Gz:r.Ze}}}]);
//# sourceMappingURL=page_federated_search_cisco_sal_provider.7a736b108c8322212ee1.js.map