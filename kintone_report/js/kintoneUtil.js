/**
 * POSTメソッドでTODOアプリへレコードを追加するリクエストを送信 リクエスト成功時には
 * リスト更新のためにリロード
 */
export function sendPost(recordObj){
	console.log("util add record");
	console.log(recordObj);
	kintone.api(kintone.api.url('/k/v1/record', true), 'POST', {
		app: kintone.app.getId(),
		record: recordObj,
		"__REQUEST_TOKEN__": kintone.getRequestToken()
		}).then(() =>{
			location.reload();
		});
}

export function sendDelete() {
	kintone.api(kintone.api.url('/k/v1/records', true), 'DELETE', {
		app: kintone.app.getId(),
		ids: [index],
		"__REQUEST_TOKEN__": kintone.getRequestToken()
	}).then(() => {
		location.reload();
	});
}