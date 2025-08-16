import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectsList from '@/components/ProjectsList/ProjectsList';
import ScenesList from '@/components/ScenesList/ScenesList';
import ShotsList from '@/components/ShotsList/ShotsList';
import Signup from '@/components/Signup/Signup';
import Error from '@/components/Error/Error';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

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
                <Route element={<ProtectedRoute isAuth={isAuth} />}>
                    <Route path='/projects' element={<ProjectsList />} />
                    <Route path='/projects/:projectId' element={<ScenesList />} />
                    <Route path='/projects/:projectId/:sceneId' element={<ShotsList />} />
                    {/* <Route path='/projects/:projectId/:sceneId/:shotId' element={<TasksList />} /> */}
                </Route>

                <Route path='/signup' element={<Signup />} />
                <Route path='/error-page' element={<Error />} />
            </Routes>
            {/* <TaskPopup /> */}
        </div>
    );
};

export default App;
