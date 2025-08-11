import { FC, useState, MouseEvent } from 'react';

interface ITasksBlockItem {
    number: number;
    name: string;
    priority: string;
    handleClick: (name: string) => void;
    handleDoubleClick: (e: MouseEvent<HTMLDivElement>) => void;
    selected: boolean;
}

const TasksBlockItem: FC<ITasksBlockItem> = ({number, name, priority, handleClick, handleDoubleClick, selected}) => {
    const [hover, setHover] = useState<boolean>(false);
    return (
        <div 
            className='tasksblock-item' 
            data-name={name} 
            onClick={() => handleClick(name)}
            onDoubleClick={(e) => handleDoubleClick(e)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                backgroundColor: selected || hover ? "rgb(45, 50, 60)" : "rgb(35, 37, 44)"
            }}
            
        >
            <p className='tasksblock-item-number'>{number}</p>
            <p className='tasksblock-item-name'>{name}</p>
            <p className='tasksblock-item-status'>Готово 10 из 12</p>
            <p className='tasksblock-item-artists'>--</p>
            <p className='tasksblock-item-priority'>{priority}</p>
        </div>
    );
}

export default TasksBlockItem;