document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todoName");
    const todoDate = document.getElementById("todoDueDate");
    // const todoSubmitButton = document.getElementById("savaTodo");
    const todoSubmitButton = document.querySelector("button[type=submit]");
    const completedList = document.getElementById("completed-list");
    const pendingList = document.getElementById("pending-list");
    const checkForComplete = document.getElementById("checkForComplete");
    let currentID = 0;
    let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

    function getNextId() {
        let maxId = 0;
        for (let i = 0; i < todoList.length; i++) {
            if (todoList[i].id > maxId) {
                maxId = todoList[i].id;
            }
        }
        // maxId++;
        // return maxId;

        return maxId + 1;

        // return ++maxId;
    }

    const saveTodoList = () => {
        localStorage.setItem('todoList', JSON.stringify(todoList));
    };

    function addTodo(text, dueDate, completedOrNot) {
        let newTodo = { id: getNextId(), title: text, todoDueDate: dueDate, completed: completedOrNot };
        todoList.push(newTodo);
    }

    const handleEditTodo = (text, dueDate, completedOrNot) => {
        todoList = todoList.map(todo => {
            if (todo.id === currentID) {
                todo.title = text;
                todo.todoDueDate = dueDate;
                todo.completed = completedOrNot;
            }
            return todo;
        });
        todoSubmitButton.innerText = "Add Task";
        currentID = 0;
    };

    function deleteTodo(id) {
        todoList = todoList.filter(todo => todo.id !== id);
        renderTodoList();
        saveTodoList();
    }

    function editTodo(id) {
        let selectedTodo = todoList.find(todo => todo.id === id);
        if (selectedTodo) {
            currentID = selectedTodo.id;
            todoInput.value = selectedTodo.title;
            todoDate.value = selectedTodo.todoDueDate;
            checkForComplete.checked = selectedTodo.completed;
            todoSubmitButton.innerText = "Edit Todo";
        }
    };

    function completeTodo(id) {
        const todoExists = todoList.find(todo => todo.id === id);
        if (todoExists) {
            todoExists.completed = !todoExists.completed;
            renderTodoList();
            saveTodoList();
        }
    }

    function renderTodoList() {
        completedList.innerHTML = "";
        pendingList.innerHTML = "";
        todoList.forEach((todo) => {
            const li = document.createElement('li');
            li.className = "list-group-item todo-item";
            li.innerHTML = `
                <div>
                    <span class="${todo.completed ? "completed" : ""}">${todo.id}. ${todo.title} - ${todo.todoDueDate}</span>
                    <div>
                        <button class="btn btn-success btn-sm me-2" onclick="completeTodo(${todo.id})">
                            ${todo.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button ${todo.completed ? 'disabled' : ''} class="btn btn-warning btn-sm me-2" onclick="editTodo(${todo.id})">
                            Edit
                        </button>
                        <button class="btn btn-danger btn-sm me-2" onclick="deleteTodo(${todo.id})">
                            Delete
                        </button>
                    </div>
                </div>
            `;
            if (todo.completed) {
                completedList.appendChild(li);
            } else {
                pendingList.appendChild(li);
            }
        });
    }

    todoForm.addEventListener("submit", function handleToDoSubmit(event) {
        event.preventDefault();
        const todoText = todoInput.value;
        const todoDueDate = todoDate.value;
        const completedOrNot = checkForComplete.checked;
        console.log(completedOrNot);
        if (todoText && todoDueDate) {
            if (currentID !== 0) {
                handleEditTodo(todoText, todoDueDate, completedOrNot);
            } else {
                addTodo(todoText, todoDueDate, completedOrNot);
            }
            renderTodoList();
            saveTodoList();
        }
        todoForm.reset();
    });

    window.deleteTodo = deleteTodo;
    window.completeTodo = completeTodo;
    window.editTodo = editTodo;

    renderTodoList();
});