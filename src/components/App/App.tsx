import { FC } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProjectsList from '../ProjectsList/ProjectsList';
import ScenesList from '../ScenesList/ScenesList';
import ShotsList from '../ShotsList/ShotsList';
import Signup from '../Signup/Signup';
import TaskPopup from '../Popups/TaskPopup';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import { useAuthStore } from '@/zustand/authStore';

const App: FC = () => {
    // FOR TESTING
    // const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
    // useEffect(() => {
    //     hydrateAuth();
    // }, []);
    // const isAuth = Boolean(useAuthStore((state) => state.auth));

    // FOR DEVELOPING
    const isAuth = true;
    return (
        <div className='app'>
            <Routes>
                <Route path='/' element={<Navigate to='/projects' replace />} />
                {/* <Route
                    path='/projects'
                    element={<ProtectedRoute path='/projects' element={ProjectsList} />}
                /> */}
                <Route element={<ProtectedRoute isAuth={isAuth} />}>
                    <Route path='/projects' element={<ProjectsList />} />
                    <Route path='/projects/:projectId' element={<ScenesList />} />
                    <Route path='/projects/:projectId/:sceneId' element={<ShotsList />} />
                    {/* <Route path='/projects/:projectId/:sceneId/:shotId' element={<TasksList />} /> */}
                </Route>

                <Route path='/signup' element={<Signup />} />
            </Routes>
            {/* <TaskPopup /> */}
        </div>
    );
};

export default App;
