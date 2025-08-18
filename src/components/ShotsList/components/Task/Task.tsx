import { FC, useState, useEffect } from 'react';

import { useTaskPopupStore } from '@/zustand/taskPopupStore';

import DropDown from '@/components/ShotsList/components/DropDown/DropDown';
import Button from '@mui/material/Button';
import SimpleDialog from '@/components/ShotsList/components/SimpleDialog/SimpleDialog';

import { api } from '@/utils/Api';

import ITask from '@shared/types/Task';

// interface ITask {
//     shotName?: string;
//     name: string;
    
// }

const Task: FC<ITask> = ({ name, id }) => {
    const [shotNameOn, setShotNameOn] = useState<boolean>(false);
    const statuses = ['готова к работе', 'в работе', 'дейлиз на проверку', 'approved', 'done'];
    const priority = ['минимальный', 'нормальный', 'высокий'];

    const setTaskView = useTaskPopupStore((state) => state.setOpenClose);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>('Artist');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    };

    // const handleDoubleClick = () => {
    //     try {
    //         const taskData = await api.getTaskData(id);
    //     } catch (err) {}
    //     setTaskView();
    // }

    useEffect(() => {
        if (name.length > 0) setShotNameOn(true);
    }, []);
    return (
        <div className='task' onDoubleClick={setTaskView}>
            {shotNameOn && <div className='task-shot_name'>{name}</div>}
            <div className='task-name'>{name}</div>
            <DropDown label='task-status' items={statuses} />
            <div className='task-artist'>
                <Button variant='contained' onClick={handleOpen}>
                    {selectedValue}
                </Button>
                <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
            </div>
            <DropDown label='priority' items={priority} />
        </div>
    );
};

export default Task;
