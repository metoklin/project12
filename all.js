document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const columns = {
        todo: document.getElementById('todo-list'),
        doing: document.getElementById('doing-list'),
        done: document.getElementById('done-list')
    };

    // 初始化讀取本地資料
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('myTasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        // 清空現有列表
        Object.values(columns).forEach(col => col.innerHTML = '');

        tasks.forEach(task => {
            const card = createTaskCard(task);
            columns[task.status].appendChild(card);
        });
    };

    const createTaskCard = (task) => {
        const div = document.createElement('div');
        div.className = 'task-card';
        div.innerHTML = `
            <div class="task-content">${task.content}</div>
            <div class="task-actions">
                ${renderActionButtons(task)}
                <button class="btn-delete" onclick="deleteTask(${task.id})">刪除</button>
            </div>
        `;
        return div;
    };

    const renderActionButtons = (task) => {
        if (task.status === 'todo') {
            return `<button class="btn-move" onclick="moveTask(${task.id}, 'doing')">開始執行 →</button>`;
        } else if (task.status === 'doing') {
            return `
                <button class="btn-move" onclick="moveTask(${task.id}, 'todo')">← 退回</button>
                <button class="btn-move" onclick="moveTask(${task.id}, 'done')">完成任務 →</button>
            `;
        } else if (task.status === 'done') {
            return `<button class="btn-move" onclick="moveTask(${task.id}, 'doing')">← 重新執行</button>`;
        }
        return '';
    };

    window.addTask = () => {
        const content = taskInput.value.trim();
        if (!content) return;

        const newTask = {
            id: Date.now(),
            content: content,
            status: 'todo'
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    };

    window.moveTask = (id, newStatus) => {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, status: newStatus } : task
        );
        saveTasks();
        renderTasks();
    };

    window.deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    addTaskBtn.addEventListener('click', window.addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.addTask();
    });

    renderTasks();
});
