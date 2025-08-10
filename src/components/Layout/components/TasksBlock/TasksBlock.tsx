import { FC } from 'react';
import { IChildrenComponent } from '@/types/IChildrenComponent';

const TasksBlock: FC<IChildrenComponent> = ({ children }) => {
    return (
        <div className='layout-tasksblock'>
            <div className='layout-tasksblock-menu'>
                <button>menu</button>
                <button>order</button>
                <button>filter</button>
                <button>view</button>
                <button>info</button>
            </div>
            <div className='layout-tasksblock-ordering'>
                <div>Порядок</div>
                <div>Имя</div>
                <div>Статус</div>
                <div>Исполнители</div>
                <div>Приоритет</div>
            </div>
            {children}
        </div>
    );
};

export default TasksBlock;
