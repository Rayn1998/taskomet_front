import { FC, useRef, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';

// потом добавить React-Table чтобы менять размер столбцов вручную

const ProjectsList: FC = () => {
    const navigate = useNavigate();
    const ref = useRef<HTMLDivElement>(null);

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        const project = e.currentTarget.getAttribute('data-name');
        navigate(`/projects/${project}`);
    };
    return (
        <Layout>
            <div className='tasksblock-list'>
                <div className='tasksblock-project' data-name='eterna' onClick={handleClick}>
                    <p className='tasksblock-project-number'>1</p>
                    <p className='tasksblock-project-name'>Eterna</p>
                    <p className='tasksblock-project-status'>Готово 33 из 33</p>
                    <p className='tasksblock-project-artists'>--</p>
                    <p className='tasksblock-project-priority'>нормальный</p>
                </div>
                <div className='tasksblock-project' data-name='hol' onClick={handleClick}>
                    <p className='tasksblock-project-number'>2</p>
                    <p className='tasksblock-project-name'>HOL</p>
                    <p className='tasksblock-project-status'>Готово 7 из 269</p>
                    <p className='tasksblock-project-artists'>--</p>
                    <p className='tasksblock-project-priority'>нормальный</p>
                </div>
            </div>
        </Layout>
    );
};

export default ProjectsList;
