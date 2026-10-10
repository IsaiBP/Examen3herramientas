// CALCULADORA DE EDAD
const ageDay = document.getElementById('age-day');
const ageMonth = document.getElementById('age-month');
const ageYear = document.getElementById('age-year');
const ageResult = document.getElementById('age-result');

document.getElementById('btn-age').addEventListener('click', calculateAge);

function calculateAge() {
    const day = Number(ageDay.value);
    const month = Number(ageMonth.value);
    const year = Number(ageYear.value);
    const today = new Date();

    ageResult.className = 'result';

    if (!ageDay.value || !ageMonth.value || !ageYear.value) {
        showResult(ageResult, 'Completa el día, mes y año de nacimiento.', false);
        return;
    }

    const birthDate = new Date(year, month - 1, day);
    const validDate = birthDate.getFullYear() === year &&
        birthDate.getMonth() === month - 1 &&
        birthDate.getDate() === day;

    if (!validDate || year < 1900 || birthDate > today) {
        showResult(ageResult, 'Ingresa una fecha de nacimiento válida.', false);
        return;
    }

    let years = today.getFullYear() - year;
    let months = today.getMonth() - (month - 1);
    let days = today.getDate() - day;

    if (days < 0) {
        months--;
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    showResult(ageResult, `Tienes ${years} años y ${months} meses.`, true);
}

// CONVERTIDOR DE TEMPERATURA
const tempValue = document.getElementById('temp-value');
const tempFrom = document.getElementById('temp-from');
const tempTo = document.getElementById('temp-to');
const btnConvert = document.getElementById('btn-convert');
const tempResult = document.getElementById('temp-result');

function checkTempFields() {
    btnConvert.disabled = tempValue.value.trim() === '' ||
        tempFrom.value === '' || tempTo.value === '';
}

tempValue.addEventListener('input', checkTempFields);
tempFrom.addEventListener('change', checkTempFields);
tempTo.addEventListener('change', checkTempFields);
btnConvert.addEventListener('click', convertTemperature);

function convertTemperature() {
    const value = Number(tempValue.value);
    const from = tempFrom.value;
    const to = tempTo.value;
    const names = { C: '°C', F: '°F', K: 'K' };

    if (!Number.isFinite(value)) {
        showResult(tempResult, 'Escribe una temperatura válida.', false);
        return;
    }
    if (from === 'K' && value < 0) {
        showResult(tempResult, 'La temperatura en Kelvin no puede ser menor que cero.', false);
        return;
    }

    // Primero convertimos la temperatura a Celsius.
    let celsius;
    if (from === 'C') celsius = value;
    else if (from === 'F') celsius = (value - 32) * 5 / 9;
    else celsius = value - 273.15;

    // Después convertimos de Celsius a la unidad solicitada.
    let result;
    if (to === 'C') result = celsius;
    else if (to === 'F') result = (celsius * 9 / 5) + 32;
    else result = celsius + 273.15;

    if (to === 'K' && result < 0) {
        showResult(tempResult, 'El resultado está por debajo del cero absoluto.', false);
        return;
    }

    showResult(tempResult, `${value} ${names[from]} = ${result.toFixed(2)} ${names[to]}`, true);
}

// LISTA DE TAREAS
let tasks = [];
const taskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');
const taskEmpty = document.getElementById('task-empty');

document.getElementById('btn-add-task').addEventListener('click', addTask);
taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') addTask();
});

function addTask() {
    const description = taskInput.value.trim();
    if (description === '') {
        taskInput.focus();
        return;
    }

    tasks.push({ description: description, completed: false });
    taskInput.value = '';
    renderTasks();
    taskInput.focus();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    taskEmpty.hidden = tasks.length > 0;

    // Mostrar primero las tareas pendientes.
    const sortedTasks = tasks
        .map((task, index) => ({ task, index }))
        .sort((a, b) => Number(a.task.completed) - Number(b.task.completed));

    sortedTasks.forEach(({ task, index }) => {
        const li = document.createElement('li');
        li.className = `task-item${task.completed ? ' completed' : ''}`;

        const label = document.createElement('label');
        label.className = 'task-label';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.description;

        label.append(checkbox, span);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Eliminar';
        deleteButton.setAttribute('aria-label', `Eliminar tarea: ${task.description}`);
        deleteButton.addEventListener('click', () => deleteTask(index));

        li.append(label, deleteButton);
        taskList.appendChild(li);
    });
}

function showResult(element, message, success) {
    element.textContent = message;
    element.className = success ? 'result success' : 'result error';
}
