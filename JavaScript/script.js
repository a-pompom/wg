var todo = (function(){
	var todoList = [];
	var todoListHTML = '';
	
	function add(item) {
		todoList.push(item);
	}
	
	
	function draw(){
		todoListHTML = '';
		for (var i=0; i < todoList.length; i++){
			todoListHTML += '<li class="todo__item">' + todoList[i] + '<li>';
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

