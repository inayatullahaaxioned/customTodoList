/* Author: 
Inayatullah
*/
const form = document.querySelector('.form'),
    displayTodo = document.querySelector('.display-todo'),
    categorySelect = document.querySelector('.select');
    data = JSON.parse(localStorage.getItem('todo'));
let dataStore = data ? data : []
const todoInput = document.querySelector('.todo-input');
let isFirst = false;

//event listener on submit form
form.addEventListener('submit', function () {

    if (todoInput.value) {
        let isCustom = categorySelect.value;
        if(isCustom == "custom"){
            isCustom = document.querySelector('.category').value;
            getCategory(dataStore);
            categorySelect.innerHTML += `<option value="${isCustom}">${isCustom}</option>
            <option value="custom">Custom</option>`
            // categorySelect.innerHTML += `<option value="custom">Custom</option>`
        }
        let todoObj = {
            todo: todoInput.value,
            type : isCustom,
            todoStatus : "pending"
        }
        dataStore.push(todoObj);
        todoStorage(dataStore);
        checkStorage();
    }
    customInputRemove();
});

function saveTodo(value, category , status) {
    const todoList = document.createElement('li');
    todoList.setAttribute('data-set', category)
    todoList.setAttribute('data-status', status)
    todoList.className = "todo-list";
    if(status == "done"){
        todoList.classList.add('completed');
    }
    todoList.innerHTML = `<div class="todo-info">${value}</div>
        <div class="category">${category}</div>
        <button class="control mark-done-btn">Mark as Done</button>
        <button class="control delete-btn">Delete</button>`
    displayTodo.appendChild(todoList);

    form.reset();
    checkStatus();
}

function customInputRemove(){
    let customInput = document.querySelector('.custom-input');
    if(customInput){
        customInput.remove();
    };
}

//saving on local storage
function todoStorage(input) {
    localStorage.setItem('todo', JSON.stringify(input));
}

function checkStorage() {
    if (dataStore) {
        if(!isFirst){
            getCategory(dataStore);
            categorySelect.innerHTML += `<option value="custom">Custom</option>`;        
        }
        isFirst = true;
        displayTodo.innerHTML = "";
        dataStore.forEach(function (prevData) {
            saveTodo(prevData.todo, prevData.type, prevData.todoStatus);
        });

        //delete todo function
        const deleteBtn = document.querySelectorAll('.delete-btn');
        deleteBtn.forEach(function (buttons, index) {
            buttons.addEventListener('click', function () {
                dataStore.splice(index, 1);
                todoStorage(dataStore);
                checkStorage();
            })
        });

        //mark as completed
        const completedBtn = document.querySelectorAll('.mark-done-btn');
        completedBtn.forEach(function (btn, index) {
            btn.addEventListener('click', function () {
                if(dataStore[index].todoStatus == "pending"){
                    btn.parentElement.classList.add('completed');
                    btn.parentElement.setAttribute("data-status", "done");
                    dataStore[index].todoStatus = "done"
                }else{
                    btn.parentElement.classList.remove('completed');
                    btn.parentElement.setAttribute("data-status", "pending");
                    dataStore[index].todoStatus = "pending"
                }
                todoStorage(dataStore);
            })
        })
    }
}
//display stored todo list from localstorage
checkStorage();

//if custom is selected
let submitBtn = document.querySelector('.submit-btn');
categorySelect.addEventListener('change' , function (){
    if(categorySelect.value == "custom"){
        let inputGroup = document.createElement('div'),
            input = document.createElement('input');
        inputGroup.className = "input-group custom-input";
        input.className = "category";
        inputGroup.appendChild(input);
        form.insertBefore(inputGroup,submitBtn);
    }else{
        customInputRemove();
    }

let lists = document.querySelectorAll('.todo-list');
    let value = this.value;
    lists.forEach(function (list) {
        let doneTodo = list.getAttribute('data-set');
        if (value == doneTodo || value == "custom") {
            listAdd(list);
        } else {
            listRemove(list);
        }
    })
});


function getCategory(dataStore){
    let predefined = ["Personal", "Work"];
    categorySelect.innerHTML = "";
    dataStore.forEach(function(obj){
        let match = false;
        predefined.forEach(function(value){
            console.log(value == obj.type);
            if(value == obj.type){
                match = true;
            }
        });
        if(!match){
            predefined.push(obj.type);
        }
    })
    predefined.forEach(function(value){
        categorySelect.innerHTML += `<option value="${value}">${value}</option>`
    })
    // categorySelect.innerHTML += `<option value="custom">Custom</option>`
}

//filter right complete or incomplete
checkStatus();
function checkStatus(){
    const todoFilter = document.querySelector('.todo-status'),
        lists = document.querySelectorAll('.todo-list');
    todoFilter.addEventListener('change', function(){
        let categoryValue = categorySelect.value,
            value = this.value;
            lists.forEach(function(list){
                if( (value == list.getAttribute("data-status") || value == "all" ) && categoryValue == list.getAttribute('data-set')){
                    listAdd(list);
                }else{
                    listRemove(list);
                }
            } )
    });
};

function listAdd(elem){
    elem.classList.remove('hide');
    elem.classList.add('show');
}

function listRemove(elem){
    elem.classList.add('hide');
    elem.classList.remove('show');
}