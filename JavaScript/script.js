var todo = (function(){
	var todoList = [];
	var todoListHTML = '';
	
	function add(item) {
		todoList.push(item);
	}
	
	function draw(){
		todoListHTML = '';
		for (var i=0; i < todoList.length; i++){
			todoListHTML += '<ul class="todo-list__row" id="todoRow">';
			
			todoListHTML += '<li class="todo-list__index">' + i + '</li>';
			todoListHTML += '<ul class="todo-list--sub">';
			todoListHTML += '<li><i class="fas fa-map-pin todo-list__pin"></i></li>';
			todoListHTML += '<li class="todo-list__item">' + todoList[i] + '</li>';
			todoListHTML += '</ul>';
			todoListHTML += '<li><button type="button" class="button--del">Del</button></li>';
			
			todoListHTML += '</ul>';
		}
		document.getElementById('todoList').innerHTML = todoListHTML;
	}
	
	return {
		addButtonClick: function (){
			var item = document.getElementById('todoInput').value;
			todoList.push(item);
			draw();
		},
		
		delButtonClick: function (){
			
		},
		
		init: function() {
			var addButton = document.getElementById('addButton');	
			addButton.addEventListener('click', todo.addButtonClick);
		}
	
	}
})();

todo.init();

