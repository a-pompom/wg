//クロージャ定義
let todo = (function(){
	//変数定義
	//スコープチェインにより、関数の内側からも参照可能
	let todoList = [];
	//HTML要素の子要素に動的に生成したTODO要素を追加することで描画する
	let todoListElement = document.getElementById('todoList');
	
	/**
	 * 描画処理
	 * 各タスク及び削除ボタンをHTML要素で作成する
	 */
	function draw(){
		//初期化
		todoListElement.innerHTML = '';
		
		/*
		<ul>(行要素)
			<li>(タスク＋ピン)
				<ul>
					<li>(ピン) </li>
					<li>(タスク) </li>
				</ul>
			</li>
			<li>(削除ボタン) </li>
		</ul>
		上記HTML要素をtodoListの要素数だけ生成
		*/
		for (let i=0; i < todoList.length; i++){
			//行要素
			let todoRow = document.createElement('ul');
			todoRow.setAttribute('class', 'todo-list__row');
			
			//タスク＋ピン
			todoRow.appendChild(createTask(i));
			
			//削除ボタン
			todoRow.appendChild(createDelButton(i));		
			
			//既存のHTML要素へ追加することで描画される
			todoListElement.appendChild(todoRow);
		}
		
		//削除ボタンクリックイベントの登録
		//ループインデックスはループ終了時にtodoList.lengthとなってしまうので
		//不変の配列のインデックスをもとにイベントを登録する
		todoList.forEach((element, index) => {
			document.getElementById('delButton-' + index).onclick = ()=>{del(index)};
		});
	}
	
	/**
	 * タスクを描画するためのHTML要素を生成
	 * @param Number itemIndex 描画対象のインデックス
	 * @return Object todoItem タスクのHTML要素
	 */
	function createTask(itemIndex){
		//ピンとタスク(li)
		let todoItem = document.createElement('li');
		todoItem.setAttribute('class', 'todo-list--item');
			
		//ピンとタスク(ul)
		let todoItemUL = document.createElement('ul');
			
		//ピンを囲うli要素
		let todoPinLi = document.createElement('li');
		//ピンを描画するi要素
		let todoPin = document.createElement('i');
		todoPin.setAttribute('class', 'fas fa-map-pin todo-list__pin');
		todoPinLi.appendChild(todoPin);
			
		//タスク
		let task = document.createElement('li');
		task.setAttribute('class', 'todo-list__task');
		task.textContent = todoList[itemIndex];
			
		//ピンとタスクをulへセット
		todoItemUL.appendChild(todoPinLi);
		todoItemUL.appendChild(task);
		//ulをliの要素としてセット
		todoItem.appendChild(todoItemUL);
		
		return todoItem;
	}
	
	/**
	 * 各行ごとに削除ボタンを生成する
	 * @param   Number itemIndex 現在行のインデックス
	 * @returns Object 削除ボタンのHTML要素
	 */
	function createDelButton(itemIndex){
		//削除ボタンを保持するli要素
		let delButtonLi = document.createElement('li');
		//削除ボタン
		let delButton = document.createElement('button');
		delButton.setAttribute('class', 'button--del');
		delButton.textContent = 'Del';
		//クリックイベントを登録できるようIDを動的に生成　
		delButton.setAttribute('id', 'delButton-' + itemIndex);
		
		//li要素にボタンを追加
		delButtonLi.appendChild(delButton);
		
		return delButtonLi;
	}
	
	/**
	 * 削除ボタンクリック時に呼ばれる処理
	 * todoListからクリックされた要素のインデックスに該当するものを削除
	 * @param int delIndex...削除対象のインデックス
	 */
	function del(delIndex) {
		//各要素のインデックスを検索し、パラメータと等しいもののみ除外
		todoList = todoList.filter((element, index) => index !== delIndex);
		
		//削除したものを除いて再描画
		draw();
	}
	
	//戻り値として渡されるオブジェクト
	//変数名.関数名で実行可能となる
	return {
		/**
		 * 追加ボタンクリック時に呼ばれる処理
		 * フォームの入力値をもとにタスクを生成
		 */
		addButtonClick (){
			//フォームの入力値
			let item = document.getElementById('todoInput').value;
			//空の場合はエラーとする
			if (!item) {
				alert('入力してください');
				return;
			}
			
			todoList.push(item);
			//フォームを初期化し、再描画
			document.getElementById('todoInput').value = '';
			draw();
		},
		
		/**
		 * 初期化処理
		 * 追加ボタンにイベントを設定
		 */
		init () {
			let addButton = document.getElementById('addButton');	
			addButton.addEventListener('click', todo.addButtonClick);
		}
	}
})();

todo.init();