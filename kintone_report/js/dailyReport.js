!function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t),kintone.events.on("app.record.index.show",e=>{let t=e.records;console.log("record0 length is"+t[0].length),console.log("record0 is"+JSON.stringify(t[0])),new Vue({el:"#appReport",data:()=>({projectIndex:0,reportList:t,projectCount:1,report:{title:"",projectList:[{id:1,projectName:"",taskName:"",startDate:"",endDate:"",planManHour:"",achievementManHour:"",achievementList:[{achievement:"",status:""}],progress:"",problecm:""}],futureTask:"",comment:""}}),methods:{addAchievementRow(){this.report.projectList[this.projectIndex].achievementList.push({achievement:"",status:""})},addProject(){console.log("add proj caaled");let e=this.report.projectList.reduce((e,t)=>e>t.id?e:t.id);this.report.projectList.push({id:e,projectName:"",taskName:"",startDate:"",endDate:"",planManHour:"",achievementManHour:"",achievementList:[{achievement:"",status:""}],progress:"",problecm:""}),this.projectIndex=this.report.projectList.length+1},editProject(e){this.projectIndex=e},copyProject(e){console.log(e);let t=this.report.projectList.reduce((e,t)=>e>t.id?e:t.id),r=JSON.parse(JSON.stringify(this.report.projectList[e]));r.id=t,this.report.projectList.push(r),this.projectIndex=this.report.projectList.length+1},delProject(e,t){this.report.projectList.splice(t,1)},addReport(){var e;e={title:{value:this.report.title},projectName1:{value:this.report.projectList[0].projectName},futureTask:{value:this.report.futureTask},comment:{value:this.report.comment}},console.log("util add record"),console.log(e),kintone.api(kintone.api.url("/k/v1/record",!0),"POST",{app:kintone.app.getId(),record:e,__REQUEST_TOKEN__:kintone.getRequestToken()}).then(()=>{location.reload()})}}})})}]);