import { FC } from 'react';

import { errorDataStore } from '@/zustand/errorDataStore';

const Error: FC = () => {
    const errorData = errorDataStore((state) => state.data);
    return <div className='error-page'>{`${errorData}`}</div>;
};

export default Error;
