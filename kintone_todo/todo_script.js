/**
 *TODOリストの作成・削除処理を行う
*/
(() => {
	"use strict";
	
	//画面表示時に行われるイベント 以下動作を実行　
	//・kintone上のレコードリストをVueインスタンスと紐づけるため変数で取得
	//・画面制御用のvueインスタンスを作成し、保存されたレコードの表示、追加・削除が可能となる
	kintone.events.on('app.record.index.show', (event) =>{
		//kintoneから取得するレコード一覧
		let records = event.records;
		
		//Vueインスタンス
		let appVue = new Vue({
			el: "#appTodo",	
			
			data() {
				return {
					//レコード→vueのdataプロパティとすることでforループで表示可能となる
					todoList: records
				}
			},
			
			methods: {
				/**
				 * 入力値をもとにkintoneレコードを生成し、POSTメソッドで送信することで
				 * レコードを追加する
				 */
				addTask(){
					//POSTメソッドでTODOアプリへレコードを追加するリクエストを送信 リクエスト成功時には
					//リスト更新のためにリロード
					kintone.api(kintone.api.url('/k/v1/record', true), 'POST', {
						app: kintone.app.getId(),
						record: {
						task: {value: this.input}
						},
						"__REQUEST_TOKEN__": kintone.getRequestToken()
      				}).then(() =>{
					 		location.reload();
				 		});
				},
				
				/**
				 * 削除ボタンがクリックされたタスクを削除する
				 * @param {Number} index 削除対象のインデックス kintoneのレコード番号を参照しているので、一意となる
				 */
				delTask(index){
					//DELETEメソッドで対象レコードを削除 削除は一括削除が可能なので、URLは「records」となる
					kintone.api(kintone.api.url('/k/v1/records', true), 'DELETE', {
						app: kintone.app.getId(),
						ids: [index],
						"__REQUEST_TOKEN__": kintone.getRequestToken()
      				}).then(function(){
					 		location.reload();
				 		});
				}
			}
			
		}); // Vueインスタンス作成ここまで
	}); //kintoneイベント処理ここまで
	
})();