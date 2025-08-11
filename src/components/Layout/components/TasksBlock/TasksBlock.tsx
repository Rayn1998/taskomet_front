import { FC } from 'react';
import { IChildrenComponent } from '@/types/IChildrenComponent';
import { useTaskViewStore } from '@/zustand/taskViewStore';
import { useTaskPopupStore } from '@/zustand/taskPopupStore';

import structureImage from "@/assets/images/structure.png";
import arrow from "@/assets/images/up-arrow.png";
import info from "@/assets/images/info.png";

const TasksBlock: FC<IChildrenComponent> = ({ children }) => {
    const taskOpen = useTaskPopupStore(state => state.isOpen);
    const infoOpenClose = useTaskPopupStore(state => state.setOpenClose);
    const closeTask = useTaskPopupStore(state => state.setClose);
    const handleClick = useTaskViewStore(state => state.setChange);
    return (
        <div className='layout-tasksblock'>
            <div 
                className='layout-tasksblock-left_block'
                style={{
                    width: taskOpen ? "50%" : "100%"
                }}
            >
                <div className='layout-tasksblock-menu'>
                    <div 
                        className='layout-structure-icon'
                        onClick={handleClick}
                        style={{
                            backgroundImage: `url(${structureImage})`
                        }}
                    ></div>
                    <button className='layout-tasksblock-button'>menu</button>
                    <button>order</button>
                    <button>filter</button>
                    <button>view</button>
                    <button 
                        className='layout-tasksblock-button'
                        onClick={infoOpenClose}
                    ><img className='layout-tasksblock-button__image' src={info} /></button>
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
            <div 
                className='layout-tasksblock-right_block'
                style={{
                    width: taskOpen ? "100%" : "0",
                    opacity: taskOpen ? 1 : 0,
                }}
            >
                <div 
                    className='layout-tasksblock-right_block-hide' 
                    style={{backgroundImage: `url(${arrow})`}}
                    onClick={closeTask}
                ></div>
                <div className='layout-info-block'></div>
            </div>
        </div>
    );
};

export default TasksBlock;
