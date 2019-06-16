/*
Vue インスタンスを操作する関数群
Vueでは以下処理を担う
・入力された日報内容の保持 送信
・カスタムビュー上で日報一覧の描画
*/

import * as restUtil from './kintoneRestUtil.js';
import * as recordUtil from "./kintoneRecordUtil.js";
import * as appConst from "./appConst.js";

export function setVueInstance(records) {
		
	let appVue = new Vue({
		el: "#appReport",	

		data() {
			return {
				projectIndex: 0, // 参照中のプロジェクトのインデックス
				reportList: records, // kintoneのレコード

				report: {
					title: "",
					projectList: //プロジェクトの情報をJSONのリストで管理 
						[
							getEmptyProject()
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
						achievementList.push({achievement: "", achievementStatus: ""});
			},

			/**
			 * プロジェクトを追加する
			 */
			addProject(){
				//追加要素のIDを現在要素の最大値+1とする
				let maxId = this.report.projectList.reduce((acc, cur)=>{
					return acc > cur.id ? acc : cur.id;
				});
				
				let emptyProject = getEmptyProject();
				emptyProject.id = maxId + 1;
				
				//追加するプロジェクトへ参照を切り替え
				this.projectIndex = 0;
				
				//空のプロジェクトオブジェクトを生成
				this.report.projectList.unshift(emptyProject);
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
				let paramList = [];
				let refItemList = [];

				// 日報
				let reportObj = recordUtil.convertKintoneRecordObject( {
					title: this.report.title,
					futureTask: this.report.futureTask,
					comment: this.report.comment
				});
				paramList.push({
					"app": kintone.app.getId(),
					"record": reportObj,
					"__REQUEST_TOKEN__": kintone.getRequestToken()
				});

				for (let proj of this.report.projectList) {
					delete proj.id;
				}
				
				// プロジェクト一覧
				let projectObjList = recordUtil.convertKintoneRecordsObject(this.report.projectList, appConst.PROJECT_TABLE_ITEM);
				paramList.push({
					"app": appConst.PROJECT_APP_ID,
					"__REQUEST_TOKEN__": kintone.getRequestToken(),
					"records": projectObjList
				});

				refItemList.push("reportId");
				
				// Promiseを利用した非同期処理
				// 非同期で日報レコードをPOST後、Vueインスタンスに紐づいたレコードを更新することで
				// 送信結果を反映
				let sendReportPromise = new kintone.Promise((resolve, reject) => {
					restUtil.sendMultiplePost(paramList, refItemList, resolve);
				});
				
				sendReportPromise.then((resolve)=>{
					// 日報とプロジェクトのkintoneオブジェクトを紐づけ
					reportObj['projectList'] = projectObjList;

					this.reportList.unshift(reportObj);
					
					this.initReport();
				});
				
			},
			
			/**
			 * 入力欄の日報を初期化する
			 */
			initReport() {
				this.report = {
					title: "",
					projectList: 
						[
							getEmptyProject()
					],
					futureTask: "",
					comment: ""
				};
			}
		}

	}); // Vueインスタンス作成ここまで
	
}

/**
 * 空のプロジェクトを生成する
 * @returns {object} プロパティ名が設定された空のプロジェクト
 */
function getEmptyProject() {
	return {
			id: 1,
			projectName: "",
			taskName: "",
			startDate: "",
			endDate: "",
			planManHour: "",
			achievementManHour: "",
			achievementList:[
				{achievement: "", achievementStatus: ""}
				],
			progress: "",
			problem: "",
			reportId: ""
			};
}