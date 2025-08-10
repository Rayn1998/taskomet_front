import { FC } from 'react';
import Layout from '../Layout/Layout';
import ProjectsList from '../ProjectsList/ProjectsList';

const Main: FC = () => {
    return (
        <div className='main'>
            <Layout>
                <ProjectsList />
            </Layout>
        </div>
    );
};

export default Main;
