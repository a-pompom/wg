/**
 * POSTメソッドでアプリへレコードを追加するリクエストを送信 リクエスト成功時には
 * リスト更新のためにリロード
 */
export function sendPost(recordObj){
	//以下の形式でリクエストを送信
	// url: リクエスト先 bool値はゲストスペースか否かを表す
	// method: GET, POST, DELETE, PUTのいずれか
	// app: 送信対象のアプリID
	// record: 更新・取得対象のレコード JSON形式で記述
	// TOKEN: CSRF対策用のトークン
	kintone.api(kintone.api.url('/k/v1/record', true), 'POST', {
		app: kintone.app.getId(),
		record: recordObj,
		"__REQUEST_TOKEN__": kintone.getRequestToken()
		}).then(() =>{
			location.reload();
		});
}

/**
 * DELETEメソッドでアプリのレコードを削除するリクエストを送信 リクエスト成功時には
 * リスト更新のためにリロード
 */
export function sendDelete() {
	//以下の形式でリクエストを送信
	// url: リクエスト先 bool値はゲストスペースか否かを表す 
	// また削除は一括で行えるので、「records」となる
	// method: GET, POST, DELETE, PUTのいずれか
	// app: 送信対象のアプリID
	// ids: 削除対象のIDリスト
	// TOKEN: CSRF対策用のトークン
	kintone.api(kintone.api.url('/k/v1/records', true), 'DELETE', {
		app: kintone.app.getId(),
		ids: [index],
		"__REQUEST_TOKEN__": kintone.getRequestToken()
	}).then(() => {
		location.reload();
	});
}