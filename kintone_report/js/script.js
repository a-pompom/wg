import * as kintoneUtil from './kintoneUtil.js';

/**
 *日報の作成処理を行う
*/
(() => {
	"use strict";
	
	kintone.events.on('app.record.index.show', (event) =>{
		//kintoneから取得するレコード一覧
		let records = event.records
		console.log('record0 length is' + records[0].length);
		console.log('record0 is' + JSON.stringify(records[0]));
		//Vueインスタンス
		let appVue = new Vue({
			el: "#appReport",	
			
			data() {
				return {
					projectIndex: 0,
					reportList: records,
					projectCount: 1,
					report: {
						title: "",
						projectList: 
							[
								{
									id: 1,
									projectName: "",
									taskName: "",
									startDate: "",
									endDate: "",
									planManHour: "",
									achievementManHour: "",
									achievementList:[
										{achievement: "", status: ""}
										],
									progress: "",
									problecm: ""
								}
						],
						futureTask: "",
						comment: ""
					}
					
				};
			},
			
			methods: {
				
				addAchievementRow(){
					this.report.
						projectList[this.projectIndex].
							achievementList.push({achievement: "", status: ""});
				},
				
				addProject(){
					console.log('add proj caaled');
					let maxId = this.report.projectList.reduce((acc, cur)=>{
						return acc > cur.id ? acc : cur.id;
					});
					
					this.report.projectList.push(
						{
							id: maxId,
							projectName: "",
							taskName: "",
							startDate: "",
							endDate: "",
							planManHour: "",
							achievementManHour: "",
							achievementList:[
								{achievement: "", status: ""}
								],
							progress: "",
							problecm: ""
						}
					);
					
					this.projectIndex = this.report.projectList.length + 1;
				},
				
				editProject(projectIndex) {
					this.projectIndex = projectIndex;
				},
				
				copyProject(projectIndex) {
					console.log(projectIndex);
					let maxId = this.report.projectList.reduce((acc, cur)=>{
						return acc > cur.id ? acc : cur.id;
					});
					
					let copyProject = JSON.parse(JSON.stringify(this.report.projectList[projectIndex]));
					copyProject.id = maxId;
					this.report.projectList.push(
						copyProject
					);
					
					this.projectIndex = this.report.projectList.length + 1;
				},
				
				delProject(test, projectIndex) {
					this.report.projectList.splice(projectIndex, 1);
				},
				
				addReport(){
					kintoneUtil.sendPost({
						title: {value: this.report.title},
						projectName1: {value: this.report.projectList[0].projectName},
						futureTask: {value: this.report.futureTask},
						comment: {value: this.report.comment}
					});
				}
			}
			
		}); // Vueインスタンス作成ここまで
	}); //kintoneイベント処理ここまで
	
})();
