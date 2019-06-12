import * as kintoneUtil from './kintoneUtil.js';

/**
 *日報の作成処理を行う
*/
(() => {
	"use strict";
	
	//画面表示時に呼ばれる処理
	kintone.events.on('app.record.index.show', (event) =>{
		const PROJECT_APP_ID = 9;
		//kintoneから取得するレコード一覧
		let records = event.records
		console.log(records);
		//Vueインスタンス
		let appVue = new Vue({
			el: "#appReport",	
			
			data() {
				return {
					projectIndex: 0, // 参照中のプロジェクトのインデックス
					reportList: records, // kintoneのレコード
					projectCount: 1,
					report: {
						title: "",
						projectList: //プロジェクトの情報をJSONのリストで管理 
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
				/**
				 * 実績リストへ行追加を行う
				 */
				addAchievementRow(){
					//現在参照中のプロジェクトへ空の実績オブジェクトを挿入
					this.report.
						projectList[this.projectIndex].
							achievementList.push({achievement: "", status: ""});
				},
				
				/**
				 * プロジェクトを追加する
				 */
				addProject(){
					//追加要素のIDを現在要素の最大値+1とする
					let maxId = this.report.projectList.reduce((acc, cur)=>{
						return acc > cur.id ? acc : cur.id;
					});
					
					//空のプロジェクトオブジェクトを生成
					this.report.projectList.push(
						{
							id: maxId + 1,
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
					
					//追加したプロジェクトを参照
					this.projectIndex = this.report.projectList.length + 1;
				},
				
				/**
				 * プロジェクトを編集する Indexを切り替えることで参照中のプロジェクトを変更する
				 * @param {Number} projectIndex 参照対象のプロジェクトのインデックス
				 */
				editProject(projectIndex) {
					this.projectIndex = projectIndex;
				},
				
				/**
				 * プロジェクトを複製する 同じプロジェクトで別作業をやることは頻繁に起こり得るので
				 * 複製メソッドを実装した
				 * @param   {Number} projectIndex 参照中のプロジェクトのインデックス
				 */
				copyProject(projectIndex) {
					// 複製したプロジェクトに振るIDを設定
					let maxId = this.report.projectList.reduce((acc, cur)=>{
						return acc > cur.id ? acc : cur.id;
					});
					
					// 複製対象のプロジェクトをディープコピーしてIDを採番することで複製
					let copyProject = JSON.parse(JSON.stringify(this.report.projectList[projectIndex]));
					copyProject.id = maxId + 1;
					this.report.projectList.push(
						copyProject
					);
					
					//複製結果を参照対象とする
					this.projectIndex = this.report.projectList.length + 1;
				},
				
				/**
				 * プロジェクトを削除する
				 * @param {Number} projectIndex 削除対象のプロジェクトのインデックス
				 */
				delProject(projectIndex) {
					this.report.projectList.splice(projectIndex, 1);
				},
				
				/**
				 * レコード一覧へ日報を追加する
				 */
				addReport(){
					
					let reportId = kintoneUtil.sendPost(kintone.app.getId(), {
						title: {value: this.report.title},
						futureTask: {value: this.report.futureTask},
						comment: {value: this.report.comment}
					});
					console.log('post returnvalue is ' + reportId);
					kintoneUtil.sendPost(PROJECT_APP_ID, {
						projectName: {value: this.report.projectList[0].projectName},
						taskName: {value: this.report.projectList[0].taskName},
						startDate: {value: this.report.projectList[0].startDate},
						endDate: {value: this.report.projectList[0].endDate},
						progress: {value: this.report.projectList[0].progress},
						problem: {value: this.report.projectList[0].problem},
						reportId: {value: reportId}
					});
					
					location.reload();
				}
			}
			
		}); // Vueインスタンス作成ここまで
	}); //kintoneイベント処理ここまで
	
})();
