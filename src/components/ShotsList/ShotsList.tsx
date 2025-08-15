import { FC } from 'react';
import Layout from '@/components/Layout/Layout';
import Shot from '@/components/ShotsList/components/Shot/Shot';
import Task from '@/components/ShotsList/components/Task/Task';

import { useTaskViewStore } from '@/zustand/taskViewStore';

const ShotsList: FC = () => {
    const view = useTaskViewStore((state) => state.change);
    const shots = [
        'SOC_0010',
        'SOC_0011',
        'SOC_0015',
        'SOC_0021',
        'SOC_0030',
        'SOC_0150',
        'SOC_0350',
        'SOC_0331',
    ];

    return (
        <Layout>
            <div className='tasksblock-list'>
                {view
                    ? shots.map((shot, i) => {
                          return <Shot name={shot} key={i} />;
                      })
                    : shots.map((shot, i) => {
                          return <Task key={i} name='compositing' shotName={shot} />;
                      })}
            </div>
        </Layout>
    );
};

export default ShotsList;
