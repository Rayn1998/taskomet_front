import { FC, MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import TasksBlockItem from '@/components/Layout/components/TasksblockItem/TasksBlockItem';

import { api } from '@/utils/Api';
import { errorDataStore } from '@/zustand/errorDataStore';
import IProject from '@shared/types/Project';
// потом добавить React-Table чтобы менять размер столбцов вручную

const ProjectsList: FC = () => {
    const setErrorData = errorDataStore((state) => state.setData);
    const [projects, setProjects] = useState<Array<IProject>>([]);
    const [selected, setSelected] = useState<string>('');
    const navigate = useNavigate();

    const handleClick = (name: string) => {
        setSelected(name);
    };

    const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
        const project = e.currentTarget.getAttribute('data-name')?.toLowerCase();
        navigate(`/projects/${project}`);
    };

    useEffect(() => {
        (async () => {
            try {
                const projects = await api.getProjects();
                setProjects(projects);
            } catch (err: unknown) {
                console.log(err);
                // if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
                //     setErrorData({ ...err });
                //     console.log('here');
                //     navigate('/error-page');
                // } else {
                //     navigate('/not-found');
                // }
            }
        })();
    }, []);
    return (
        <Layout>
            <div className='tasksblock-list'>
                {projects.map((task, i) => {
                    return (
                        <TasksBlockItem
                            key={i}
                            number={i + 1}
                            name={task.name}
                            priority={task.priority}
                            handleClick={handleClick}
                            handleDoubleClick={handleDoubleClick}
                            selected={Boolean(task.name === selected)}
                        />
                    );
                })}
            </div>
        </Layout>
    );
};

export default ProjectsList;
