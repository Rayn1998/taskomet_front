import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar: FC = () => {
    const navigate = useNavigate();
    return (
        <div className='sidebar'>
            <div className='sidebar-image' onClick={() => navigate('/projects')}></div>
        </div>
    );
};

export default Sidebar;
