import { FC, MouseEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import TasksBlockItem from '../Layout/components/TasksblockItem/TasksBlockItem';

const ScenesList: FC = () => {
    // const tasks = [
    //     {name: "SOC", priority: "нормальный"},
    //     {name: "BBQ", priority: "нормальный"},
    // ];
    const [selected, setSelected] = useState<string>('');

    const handleClick = (name: string) => {
        setSelected(name);
    };
    const navigate = useNavigate();
    const location = useLocation();
    const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
        const scene = e.currentTarget.getAttribute('data-name')?.toLowerCase();
        navigate(`${location.pathname}/${scene}`);
    };
    return (
        <Layout>
            <div className='tasksblock-list'>
                {/* {tasks.map((task, i) => {
                    return <TasksBlockItem
                        key={i}
                        number={i+1}
                        name={task.name}
                        priority={task.priority}
                        handleClick={handleClick}
                        handleDoubleClick={handleDoubleClick}
                        selected={Boolean(task.name === selected)}
                    />
                })} */}
            </div>
        </Layout>
    );
};

export default ScenesList;
