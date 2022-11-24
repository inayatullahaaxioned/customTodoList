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
        if (isCustom == "custom") {
            isCustom = document.querySelector('.category').value;
            getCategory(dataStore, isCustom);

        }
        let todoObj = {
            todo: todoInput.value,
            type: isCustom,
            todoStatus: "pending"
        }
        dataStore.push(todoObj);
        todoStorage(dataStore);
        checkStorage();
    }
    customInputRemove();
    let lists = document.querySelectorAll('.todo-list');
    let value = categorySelect.value;
    filterTodos(lists,value)
});

// function for showing on selected in filter 
function filterTodos(lists , caterogySelected ){
    lists.forEach(function (list) {
        let doneTodo = list.getAttribute('data-set');
        if (caterogySelected == "All") {
            listAdd(list);
        } else if (caterogySelected == doneTodo) {
            listAdd(list);
        }
        else {
            listRemove(list);
        }
    })
}

//function for appending the todo in ul
function saveTodo(value, category, status) {
    const todoList = document.createElement('li');
    todoList.setAttribute('data-set', category)
    todoList.setAttribute('data-status', status)
    todoList.className = "todo-list";
    if (status == "done") {
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

// custom input remove function 
function customInputRemove() {
    let customInput = document.querySelector('.custom-input');
    if (customInput) {
        customInput.remove();
    };
}

//saving on local storage
function todoStorage(input) {
    localStorage.setItem('todo', JSON.stringify(input));
}

function checkStorage() {
    if (dataStore) {
        if (!isFirst) {
            getCategory(dataStore);
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
                if (dataStore[index].todoStatus == "pending") {
                    btn.parentElement.classList.add('completed');
                    btn.parentElement.setAttribute("data-status", "done");
                    dataStore[index].todoStatus = "done"
                } else {
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
if (categorySelect.value == "All") {
    todoInput.disabled = true;
};

categorySelect.addEventListener('change', function () {
    if (categorySelect.value == "custom") {
        let inputGroup = document.createElement('div'),
            input = document.createElement('input');
        input.placeholder = "Category";
        inputGroup.className = "input-group custom-input";
        input.className = "category";
        input.required = true;
        inputGroup.appendChild(input);
        form.insertBefore(inputGroup, submitBtn);
        todoInput.disabled = false;
        todoInput.required = true;
    }
    else if (categorySelect.value == "All") {
        todoInput.disabled = true;
        customInputRemove();
    }
    else {
        customInputRemove();
        todoInput.disabled = false;
    }
    let lists = document.querySelectorAll('.todo-list');
    let value = this.value;
    filterTodos(lists,value);
});


function getCategory(dataStore, isCustom = "") {
    let predefined = ["All", "Personal", "Work"];
    dataStore.forEach(function (obj) {
        let type = obj.type;
        if (!predefined.includes(type)) {
            predefined.push(type);
        };
    })
    console.log(predefined);
    categorySelect.innerHTML = "";
    predefined.forEach(function (value) {
        categorySelect.innerHTML += `<option value="${value}">${value}</option>`
    })
    if (isCustom) {
        categorySelect.innerHTML += `<option value="${isCustom}">${isCustom}</option>`

    }
    categorySelect.innerHTML += `<option value="custom">Custom</option>`

}

//filter right complete or incomplete
checkStatus();
function checkStatus() {
    const todoFilter = document.querySelector('.todo-status'),
        lists = document.querySelectorAll('.todo-list');
    todoFilter.addEventListener('change', function () {
        let categoryValue = categorySelect.value,
            value = this.value;
        lists.forEach(function (list) {
            let typeAttribute = list.getAttribute("data-set");
            let statusAttribute = list.getAttribute("data-status");
            if ((value == statusAttribute || value == "all") && (categoryValue == typeAttribute || categoryValue == "All")) {
                listAdd(list);
            } else {
                listRemove(list);
            }
        })
    });
};

//function for showing list on filter
function listAdd(elem) {
    elem.classList.remove('hide');
    elem.classList.add('show');
}

//function for hiding list on filter
function listRemove(elem) {
    elem.classList.add('hide');
    elem.classList.remove('show');
}