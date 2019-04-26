var todo = (function(){
	var todoList = [];
	var todoListHTML = '';
	var indexList = {};
	
	function draw(){
		todoListHTML = '';
		indexList = {};
		document.getElementById('todoList').innerHTML = '';
		for (var i=0; i < todoList.length; i++){
			var todoRow = document.createElement('ul');
			todoRow.setAttribute('class', 'todo-list__row');
			
			var todoSub = document.createElement('li');
			todoSub.setAttribute('class', 'todo-list--sub');
			var todoSubList = document.createElement('ul');
			var todoPinLi = document.createElement('li');
			var todoPin = document.createElement('i');
			todoPin.setAttribute('class', 'fas fa-map-pin todo-list__pin');
			todoPinLi.appendChild(todoPin);
			
			var todoItem = document.createElement('li');
			todoItem.setAttribute('class', 'todo-list__item');
			todoItem.textContent = todoList[i];
			
			todoSubList.appendChild(todoPinLi);
			todoSubList.appendChild(todoItem);
			
			todoSub.appendChild(todoSubList);
			
			todoRow.appendChild(todoSub);
			
			var delButtonLi = document.createElement('li');
			var delButton = document.createElement('button');
			delButton.setAttribute('class', 'button--del');
			delButton.textContent = 'del'
			//delButton.setAttribute('onclick', '"todo.delButtonClick(' + i + ')"');
			delButton.setAttribute('id', 'delButton-' + i);
			//document.getElementById('delButton-' + i).addEventListener('click', function(){ del() });
			delButtonLi.appendChild(delButton);
			
			todoRow.appendChild(delButtonLi);
			document.getElementById('todoList').innerHTML += todoRow.innerHTML;
			indexList[i] = i;
			console.log(indexList);
				
		}
		Object.entries(indexList).forEach(([key, value]) => { 
    		console.log({key, value});
			document.getElementById('delButton-' + value).onclick = (function(a) {
				return function(){ del(a);};
			})(value);	
		});
		
		//var x = document.getElementById('delButton-' + indexList[i]).getAttribute('id');
			
				
	}
	
	
	
	function add(item) {
		todoList.push(item);
	}
	
	function del(delIndex) {
		console.log('run');
		todoList = todoList.filter((element, index) => index !== delIndex);
		draw();
	}
	
	return {
		addButtonClick: function (){
			var item = document.getElementById('todoInput').value;
			todoList.push(item);
			draw();
		},
		
		delButtonClick: function(index) {
			console.log('run');
			todoList.filter(element => element !== index);
			draw();
		},
		
		init: function() {
			var addButton = document.getElementById('addButton');	
			addButton.addEventListener('click', todo.addButtonClick);
		}
	
	}
})();

todo.init();

