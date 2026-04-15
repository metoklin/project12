document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const allTasksList = document.getElementById('all-tasks-list');

    // 初始化讀取本地資料
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('myTasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        // 清空現有列表
        allTasksList.innerHTML = '';

        // 依據狀態排序：未執行 (todo) -> 執行中 (doing) -> 已執行 (done)
        const statusOrder = { 'todo': 1, 'doing': 2, 'done': 3 };
        const sortedTasks = [...tasks].sort((a, b) => {
            if (statusOrder[a.status] !== statusOrder[b.status]) {
                return statusOrder[a.status] - statusOrder[b.status];
            }
            return b.id - a.id; // 同狀態最新建立的排前面
        });

        sortedTasks.forEach(task => {
            const card = createTaskCard(task);
            allTasksList.appendChild(card);
        });
    };

    const getStatusLabelText = (status) => {
        if (status === 'todo') return '未執行';
        if (status === 'doing') return '執行中';
        if (status === 'done') return '已執行';
        return '';
    };

    const createTaskCard = (task) => {
        const div = document.createElement('div');
        div.className = 'task-card';
        div.innerHTML = `
            <span class="status-badge status-${task.status}" onclick="toggleTaskStatus(${task.id})" title="點擊切換狀態">
                ${getStatusLabelText(task.status)}
            </span>
            <div class="task-content ${task.status === 'done' ? 'task-done-text' : ''}" title="${task.content}">${task.content}</div>
            <button class="btn-delete" onclick="deleteTask(${task.id})" title="刪除">✕</button>
        `;
        return div;
    };

    window.toggleTaskStatus = (id) => {
        const statusCycle = { 'todo': 'doing', 'doing': 'done', 'done': 'todo' };
        tasks = tasks.map(task => 
            task.id === id ? { ...task, status: statusCycle[task.status] } : task
        );
        saveTasks();
        renderTasks();
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
