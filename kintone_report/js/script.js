import * as restUtil from './kintoneRestUtil.js';
import * as recordUtil from "./kintoneRecordUtil.js";
import * as appConst from "./appConst.js";
import * as vueInstanceManipulator from "./vueInstanceManipulator.js";
/**
 *日報の作成処理を行う
*/
(() => {
	"use strict";
	
	//画面表示時に呼ばれる処理
	kintone.events.on('app.record.index.show', event =>{
		
		// kintoneから取得するレコード一覧
		let records = event.records
		
		// 日報が空の場合はプロジェクトを取得しない
		if(records.length === 0) {
			vueInstanceManipulator.setVueInstance(records);
			return;
		}
		
		// プロジェクト一覧から現在ページの日報と対応したものをGETリクエストで取得
		let queryReportIdList = getReportIdFilterQuery(records);
		
		let paramBody = {
			"app": appConst.PROJECT_APP_ID,
			"__REQUEST_TOKEN__": kintone.getRequestToken(),
			"query": queryReportIdList 
		}
		
		// プロジェクト一覧を取得する処理
		// GETリクエストは非同期で発行されるので、プロジェクト一覧を取得してから描画を行うために
		// Promiseオブジェクトを利用 resolveへ結果セットのプロジェクト一覧を格納し、
		// 既存のkintoneのrecord一覧へプロジェクト要素を追加
		let getProjectPromise = new kintone.Promise((resolve, reject) => {
			restUtil.sendGetByQuery(paramBody, resolve);
		});
		
		// resolveでは以下形式でプロジェクトを保持
		/*
		resolve: {
			records: [
				{
					projectName: {value: "hogehoge"}
				},
				...
			]
		}
		*/
		getProjectPromise.then((resolve)=> {
			
			// kintoneの日報レコードへprojectListプロパティとしてレスポンスのJSONを設定
			// 日報とプロジェクトの対応関係は日報IDをキーに判定
			for (let report of records) {
				for (let project of resolve.records) {
					
					// 日報と紐づくプロジェクトをprojectListプロパティへ追加
					if(report.reportId.value === project.reportId.value) {
						if ("projectList" in report) {
							report['projectList'].push(project);
							continue;
						} 
						
						report['projectList'] = [];
						report['projectList'].push(project);
						
					}
				}
			}
			
			// 描画要素が完成した段階でVueの描画処理を呼び出す
			vueInstanceManipulator.setVueInstance(records);
		});
		
		
	}); //kintoneイベント処理ここまで
	
	/**
	 * 日報IDでプロジェクト一覧をフィルタするクエリを取得する
	 * @param   {[Object]} records kintoneの日報レコード一覧 日報IDで対応するプロジェクトを取得
	 * @returns {String} reportId in (1,2,3...)のような形でプロジェクトを絞り込むクエリ文字列
	 */
	function getReportIdFilterQuery(records) {
		let queryReportIdList = "reportId in (";
		
		// カンマ区切りで日報IDを連結した文字列を生成
		for (let report of records) {
			queryReportIdList += report.reportId.value;
			queryReportIdList += ",";
		}
		// 末尾のカンマを削除し、閉じ括弧とすることでreportId in(1,2,3,4)のような形のクエリ文字列とする
		queryReportIdList = queryReportIdList.slice(0, -1);
		queryReportIdList += ")";
		
		return queryReportIdList;
	}
	
})();
