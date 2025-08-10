import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import Main from '../Main/Main';
import ProjectsList from '../ProjectsList/ProjectsList';
import ScenesList from '../ScenesList/ScenesList';
import ShotsList from '../ShotsList/ShotsList';
import TasksList from '../TasksList/TasksList';
import Signup from '../Signup/Signup';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import { useAuthStore } from '@/zustand/store';

function App() {
    const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
    useEffect(() => {
        hydrateAuth();
    }, []);
    const isAuth = Boolean(useAuthStore((state) => state.auth));

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
                    <Route path='/projects/:projectId/:sceneId/:shotId' element={<TasksList />} />
                </Route>

                <Route path='/signup' element={<Signup />} />
            </Routes>
        </div>
    );
}

export default App;
