import { useState } from "react";

/* eslint-disable react/prop-types */
function TaskItem({ task, onRemove }) {
    return (
        <li>
            {task.name}
            <button onClick={() => onRemove(task)}>&times;</button>
        </li>
    );
}

function Content() {
    const [count, setCount] = useState(99);
    return <h1 onClick={() => setCount(count + 1)}>Count is {count}</h1>;
}

function KeyProp() {
    const [random, setRandom] = useState(Math.random());
    const [tasks, setTasks] = useState([
        {
            id: 1,
            name: "Task 1",
        },
        {
            id: 2,
            name: "Task 2",
        },
        {
            id: 3,
            name: "Task 3",
        },
    ]);

    const handleRemove = (task) => {
        const removeId = task.id;
        setTasks(tasks.filter((task) => task.id !== removeId));
    };

    return (
        <div>
            <h1 onClick={() => setRandom(Math.random())}>Random: {random}</h1>
            <Content key={random} />
            <ul>
                {tasks.map((task) => (
                    <TaskItem
                        key={Math.random()}
                        task={task}
                        onRemove={handleRemove}
                    />
                ))}
            </ul>
        </div>
    );
}

export default KeyProp;
