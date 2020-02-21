'use strict';
let todoForm, taskName, taskDesc, showTask, tasks;

todoForm = document.forms.namedItem('todo-form');
taskName = document.querySelector('.task-name');
taskDesc = document.querySelector('.task-desc');
showTask = document.querySelector('.show-tasks');
tasks = [];

// constructor to make task
let Task = function(task, desc) {
    this.task = task;
    this.desc = desc;
    this.time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
    this.id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0;
}

// data manager to set or get data from localstorage
let dataManager = {

    fetchData : () => localStorage.getItem('task') ? tasks = JSON.parse(localStorage.getItem('task')) : tasks = [],

    setData : () => {
        if(taskName.value.length > 0 && taskName.value != ' ') {
            let task = new Task(taskName.value, taskDesc.value);

            tasks.push(task);

            localStorage.setItem('task', JSON.stringify(tasks));
        }
    }
}

// render tasks on DOM
let render = () => {

    if(tasks) {

        showTask.innerHTML = '';

        for(let item in tasks) {

            let taskHTML = `<div class="task-wrapper">
                                <h3 class="task">${tasks[item].task}</h3>
                                <p class="task-description">${tasks[item].desc}</p>
                                <button class="edit-task">Edit</button>
                                <button class="delete-task" data-id="${tasks[item].id}">Delete</button>
                            </div>`;

            showTask.insertAdjacentHTML('beforeend', taskHTML);
        }
    }
}


// delete item from task list
let deleteData = () => {

    showTask.addEventListener('click', e => {

        if(e.target.dataset.id){

            for(let i in tasks) {

                if(tasks[i].id === parseInt(e.target.dataset.id)) {

                    tasks.splice(i,1);

                    localStorage.setItem('task', JSON.stringify(tasks));

                    render();
                }
            }
        }

        editTask(e);
    })
}

// 
let editTask = ev => {
    if(ev.target.tagName === 'BUTTON') {
        let listOfEls = ev.target.parentNode.children;

        for(let i = 0; i < listOfEls.length; i++) {
            if(listOfEls[i].classList.value === 'task' || listOfEls[i].classList.value === 'task-description') {
                listOfEls[i].contentEditable = 'true';
                listOfEls[i].focus();
            }
        }

        document.addEventListener('keydown', e => {
            
            if(e.keyCode == 13) {
                if(e.ctrlKey) {
                    let taskContent, taskDiscContent;

                    for(let i = 0; i < listOfEls.length; i++) {

                        listOfEls[i].classList.value === 'task' ? taskContent = listOfEls[i].innerText : null;
                        
                        listOfEls[i].classList.value === 'task-description' ? taskDiscContent = listOfEls[i].innerText : null;
                        
                        if(listOfEls[i].dataset.id) {
                            tasks[listOfEls[i].dataset.id - 1].task = taskContent;
                            tasks[listOfEls[i].dataset.id - 1].desc = taskDiscContent;
                            localStorage.setItem('task', JSON.stringify(tasks));
                            
                            for(let i = 0; i < listOfEls.length; i++) {
                                listOfEls[i].contentEditable = 'false';
                            }
                        }
                    }

                }
            }
        })
    }
}


// on form submit create a new task and set into localstorage
if (todoForm) {

    todoForm.addEventListener('submit', e => {

        e.preventDefault();

        dataManager.setData();

        init();
    })
}

// create initial state function
let init = () => {

    taskName.value = '';

    taskDesc.value = '';

    taskName.focus();

    dataManager.fetchData();

    render();

    deleteData();
}

// set initial state
init();
