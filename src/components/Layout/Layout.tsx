import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Statusline from './components/Statusline/Statusline';
import TasksBlock from './components/TasksBlock/TasksBlock';
import { IChildrenComponent } from '@/types/IChildrenComponent';

const Layout: FC<IChildrenComponent> = ({ children }) => {
    // const navigate = useNavigate();
    // useEffect(() => {
    //     const auth = localStorage.getItem('user');
    //     if (auth === null) {
    //         navigate('/signup');
    //     }
    // }, []);
    return (
        <div className='layout'>
            <Sidebar />
            <div className='layout-main-block'>
                <Header />
                <Statusline />
                <TasksBlock>{children}</TasksBlock>
            </div>
        </div>
    );
};

export default Layout;
