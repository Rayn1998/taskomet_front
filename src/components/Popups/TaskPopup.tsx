import { FC } from 'react';
import { useTaskPopupStore } from '@/zustand/taskPopupStore';

const TaskPopup: FC = () => {
    const isOpen = useTaskPopupStore((state) => state.isOpen);
    const handleClose = useTaskPopupStore((state) => state.setClose);
    return (
        <div
            className='task-popup'
            onClick={handleClose}
            style={{
                display: isOpen ? 'block' : 'none',
            }}
        >
            <div className='task-popup-content'></div>
        </div>
    );
};
export default TaskPopup;
