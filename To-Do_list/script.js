document.addEventListener('DOMContentLoaded',() =>{
    const taskInput = document.getElementById ('task-input');
    const addTaskBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todoscontainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressContainer = document.getElementById('progressbar');
    const statsNumber = document.getElementById('numbers');

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todoscontainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };
     
    const updateProgress = (checkCompletion=true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = totalTasks > 0 ? `${progress}%` : '0%';
        }
        statsNumber.textContent = `${completedTasks} / ${totalTasks}`;
        
        if(checkCompletion && totalTasks > 0 && completedTasks === totalTasks){
            celebrateCompletion();
        }
    };
    
    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));

    };


    const loadTasksFromLocalStorage = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
        toggleEmptyState();
        updateProgress();
    };
    const addTask = (text, completed=false) => {
        const taskText = text || taskInput.value.trim();
        if(!taskText){
            return;
        }
        const li = document.createElement('li');
        li.innerHTML=`
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        if(completed){
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        };

        checkbox.addEventListener('change',() => {
            const isChecked = checkbox.checked;
                li.classList.toggle('completed',isChecked);
                editBtn.disabled = isChecked;
                editBtn.style.opacity = isChecked ? '0.5' : '1';
                editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
                updateProgress();
                saveTaskToLocalStorage();
        });


        editBtn.addEventListener('click',() => {
            if(!checkbox.checked){
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTaskToLocalStorage();
            };
        });
        li.querySelector('.delete-btn').addEventListener('click',() => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });
        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress();
        saveTaskToLocalStorage();
    };
    addTaskBtn.addEventListener('click',() => {
        addTask();
    });
    taskInput.addEventListener('keypress',(e)=> {
        if(e.key==='Enter'){
            e.preventDefault();
            addTask();
        } 
    });
    loadTasksFromLocalStorage();
});

const celebrateCompletion = () => {
    confetti({
        particleCount: 100,
        origin: {
            x: 0.5,
            y: 0.5,
        },
        angle: 90,
        count: 50,
        position: {
            x: 50,
            y: 50,
        },
        spread: 45,
        startVelocity: 45,
        decay: 0.9,
        gravity: 1,
        drift: 0,
        ticks: 200,
        colors: ["#f94144", "#f3722c", "#f9844a", "#f9c74f", "#90be6d", "#43aa8b", "#577590"],
        shapes: ["square", "circle"],
        scalar: 1,
        zIndex: 100,
        disableForReducedMotion: true,
    });
};