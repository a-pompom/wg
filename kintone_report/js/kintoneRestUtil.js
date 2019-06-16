/*
KintoneのREST APIを操作するためのユーティリティ関数群

以下の形式でリクエストを送信
	url: リクエスト先 bool値はゲストスペースか否かを表す
	method: GET, POST, DELETE, PUTのいずれか
	app: 送信対象のアプリID
	record: 更新・取得対象のレコード JSON形式で記述 複数存在する場合はプロパティ名が「records」となる
	TOKEN: CSRF対策用のトークン
*/

/**
 * GETリクエストを送信してqueryの条件に合致するレコードをリスト形式で取得する
 * 当該処理は非同期で行われるため、promiseオブジェクトのresolve関数へ
 * 結果セットを渡す形とすることで結果セットを受け取ってから処理を行うフローとする
 */
export function sendGetByQuery(paramBody, resolve){
	// url, method, query(レコードの絞り込み条件)をリクエストに付与　
	kintone.api(
		kintone.api.url("query" in paramBody ? '/k/v1/records' : '/k/v1/record', true), 
		'GET', 
		paramBody).then((response) =>{
			// callback関数を省略すると.thenでコールバック処理を記述することができる
			// resolveへレスポンスを渡すことでpromiseによってresolveの処理が終わるまで
			// 同期処理を待機させることができる
			resolve(response);
		});
}


/**
 * POSTメソッドでアプリへレコードを追加するリクエストを送信 
 */
export function sendPost(paramBody, resolve){
	
	// POSTメソッドでレコードを追加し、追加したレコードのIDを格納したレスポンスをresolveへ渡す
	kintone.api(
		kintone.api.url("records" in paramBody ? '/k/v1/records' : '/k/v1/record', true), 
		'POST', 
		paramBody, 
		(response)=>{
			resolve(response);
	});
	
}

/**
 * リストが空になるまで再帰的にPOSTリクエストを行う
 * @param {Array} paramList   kintoneAPIで送信するリクエストパラメータを格納したオブジェクトのリスト
 *                            空になるまでPOSTを繰り返す
 * @param {Array} refItemList reponseに格納されたIDを参照するためのプロパティ名リスト
 */
export function sendMultiplePost(paramList, refItemList, resolve) {
	
	kintone.api(
		kintone.api.url("records" in paramList[0] ? '/k/v1/records' : '/k/v1/record', true), 
		'POST', 
		paramList[0]).then((response)=>{
		
			//先頭要素はPOSTが終わったのでリストから除外
			paramList.shift();
		
			//リストが空であればこれ以上のPOSTリクエストは不要なので処理終了
			if(paramList.length === 0) {
				resolve(response);
				return;
			}

			//参照元と一対一か一対多の関係にあるかによって処理を分岐
			//一対多の場合はリストの各要素へ親レコードへの参照を設定
			if ("records" in paramList[0]) {
				
				for(let record of paramList[0]["records"]) {
					record[refItemList[0]]['value'] = response.id;
				}
				
				sendMultiplePost(paramList, refItemList, resolve);
				
				//以降の処理は呼び出す必要がないのでreturn
				return;
			}

			//一対一の場合はrecordプロパティを直接参照してreponse結果のIDで上書き
			paramList[0]['record'][refItemList[0]]['value'] = response.id;
			
			//参照要素はここで不要となるので除外
			refItemList.shift();

			sendMultiplePost(paramList, refItemList, resolve);
		
	});
	
}

/**
 * DELETEメソッドでアプリのレコードを削除するリクエストを送信
 */
export function sendDelete(index, resolve) {
	
	// 削除されたID群を格納したレスポンスをresolveへ渡す
	kintone.api(kintone.api.url('/k/v1/records', true), 'DELETE', {
		app: kintone.app.getId(),
		ids: [index],
		"__REQUEST_TOKEN__": kintone.getRequestToken()
	}).then((response) => {
		resolve(response);
	});
}