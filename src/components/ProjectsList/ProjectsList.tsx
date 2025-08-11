import { FC, MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import TasksBlockItem from '@/components/Layout/components/TasksblockItem/TasksBlockItem';

// потом добавить React-Table чтобы менять размер столбцов вручную

const ProjectsList: FC = () => {
    const projects = [
        {name: "Eterna", priority: "нормальный"},
        {name: "HOL", priority: "нормальный"},
    ]

    const [selected, setSelected] = useState<string>('');
    const navigate = useNavigate();

    const handleClick = (name: string) => {
        setSelected(name);
    }

    const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
        const project = e.currentTarget.getAttribute('data-name')?.toLowerCase();
        navigate(`/projects/${project}`);
    };
    return (
        <Layout>
            <div className='tasksblock-list'>
                {projects.map((task, i) => {
                    return <TasksBlockItem 
                        key={i} 
                        number={i+1} 
                        name={task.name} 
                        priority={task.priority} 
                        handleClick={handleClick}
                        handleDoubleClick={handleDoubleClick}
                        selected={Boolean(task.name === selected)}
                    />
                })}
            </div>
        </Layout>
    );
};

export default ProjectsList;
