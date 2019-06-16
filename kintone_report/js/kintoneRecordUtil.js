/**
 * JavaScriptのオブジェクトをkintone用のJSON形式へ変換する
 * @param   {[String]} fieldList kintoneのフィールドコードのリスト
 * @param   {Object} targetObj kintone用のJSONへ変換するオブジェクト キーはフィールドコードと対応
 * @param   {[[String]]} tableCol=[] テーブル形式のフィールドの項目リスト
 * @returns {Object} kintoneのレコード形式のJSONオブジェクト
 */
export function convertKintoneRecordObject(targetObj, tableCol=[]) {
	
	// 結果セット格納用オブジェクト
	let kintoneRecord = {};
	// フィールドのテーブル要素を管理するためのインデックス
	let tableIndex = 0;
	
	// JSのオブジェクトから以下のような形式のJSONを生成
	// JSのオブジェクトのキーはフィールドコードと対応しているものとする
	// フィールドコード: {value: フィールドコード値}
	for (let key of Object.keys(targetObj)) {
		// ネストしたオブジェクトに直接代入はできないので、入れ物を先に作成
		kintoneRecord[key] = {}
		
		// 参照中のオブジェクトのプロパティがリストの場合、フィールドがテーブル形式となっているので
		// テーブル用のJSONを別途生成する
		if (Array.isArray(targetObj[key])){
			kintoneRecord = convertKintoneTableField(
								kintoneRecord, key, targetObj, tableCol, tableIndex);
			// テーブルのインデックスを更新 フィールドへのマッピングはこの段階で完了したのでcontinue
			tableIndex ++;
			continue;		
		}
		
		// kintone用のJSONを元オブジェクトからキー毎に生成
		kintoneRecord[key]['value'] = targetObj[key];
	}
	
	return kintoneRecord;
}
/**
 * JavaScriptのオブジェクトをkintone用のJSON形式の複数レコードへ変換する
 * @param   {[String]} fieldList kintoneのフィールドコードのリスト
 * @param   {Object} targetObjList kintone用のJSONへ変換するオブジェクトのリスト キーはフィールドコードと対応
 * @param   {[[String]]} tableCol=[] テーブル形式のフィールドの項目リスト
 * @returns {Object} kintoneのレコード形式のJSONオブジェクトのリスト
 */
export function convertKintoneRecordsObject(targetObjList, tableCol=[]) {
	
	// kintoneの複数レコード要素
	let kintoneRecords = [];
	
	// kintoneのレコード要素 kintoneRecordsは当該要素のリストとなる
	let kintoneRecord = {};
	
	// オブジェクトのリスト→kintoneのレコードリストへ変換
	for (let targetObj of targetObjList) {
		
		// 中身のJSオブジェクトをkintoneのレコードへ変換する処理は既存メソッドで実現可能
		kintoneRecord = convertKintoneRecordObject(targetObj, tableCol);
		
		kintoneRecords.push(JSON.parse(JSON.stringify(kintoneRecord)));	
	}
	
	return kintoneRecords;
}

/**
 * JSのリスト形式のオブジェクトからkintoneのテーブル用JSONオブジェクトを生成する
 * @param   {Object} kintoneRecord 結果セット格納用オブジェクト
 * @param   {String} key           テーブルのフィールドコード
 * @param   {Object} targetObj     テーブル形式で値を保持するオブジェクト
 * @param   {[[String]]} tableCol  テーブルのフィールドコードを格納したリスト
 * @param   {Number} tableIndex    変換対象のテーブルのインデックス
 * @returns {Object} kintoneRecordへテーブル要素を追加した結果セット
 */
export function convertKintoneTableField(kintoneRecord, key, targetObj, tableCol, tableIndex) {
	/* (変換ルール)
	元オブジェクト:
		fieldList:[
			{
				col1: "value",
				col2: "value",
				...
			}
		]
	→ テーブルのフィールドコード : {
		value: [
			{
				value: {
					フィールドコード名: {value: フィールド値}
				}
			},
			...
		]
	}
	*/
	// テーブルの各行要素を格納するリストを生成　
	kintoneRecord[key] = {
		value: []
	};
	
	// テーブルフィールドはJSのリスト形式で保持されているので、リストループ
	for (let tableItem of targetObj[key]) {
		// テーブルの各カラム
		let item = {value: {}};
		
		// テーブルの各カラム値へのマッピング　
		for(let tableCell of tableCol[tableIndex]){
			item['value'][tableCell] = {value: tableItem[tableCell]};
		}
		
		// テーブルの各行要素を格納するリストへ行要素を追加
		kintoneRecord[key]['value'].push(item);
	}
	
	return kintoneRecord;
}