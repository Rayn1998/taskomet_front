import { FC } from 'react';
import TelegramAuth from '@/components/TelegramAuth/TelegramAuth';

const Signup: FC = () => {
    return (
        <div className='signup' style={{ width: '100%', height: '100%' }}>
            <div className='signup-form'>
                <TelegramAuth />
            </div>
        </div>
    );
};

export default Signup;
