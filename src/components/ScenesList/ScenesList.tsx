import { FC, MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';

const ScenesList: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        const scene = e.currentTarget.getAttribute('data-name');
        navigate(`${location.pathname}/${scene}`);
    };
    return (
        <Layout>
            <div className='tasksblock-list'>
                <div className='tasksblock-project' data-name='soc' onClick={handleClick}>
                    <p className='tasksblock-project-number'>1</p>
                    <p className='tasksblock-project-name'>SOC</p>
                    <p className='tasksblock-project-status'>Готово 10 из 12</p>
                    <p className='tasksblock-project-artists'>--</p>
                    <p className='tasksblock-project-priority'>нормальный</p>
                </div>
                <div className='tasksblock-project' data-name='bbq' onClick={handleClick}>
                    <p className='tasksblock-project-number'>2</p>
                    <p className='tasksblock-project-name'>BBQ</p>
                    <p className='tasksblock-project-status'>Готово 18 из 18</p>
                    <p className='tasksblock-project-artists'>--</p>
                    <p className='tasksblock-project-priority'>нормальный</p>
                </div>
            </div>
        </Layout>
    );
};

export default ScenesList;
