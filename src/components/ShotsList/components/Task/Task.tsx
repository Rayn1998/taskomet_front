import { FC, useState, useEffect } from 'react';

import { useTaskPopupStore } from '@/zustand/taskPopupStore';

import DropDown from '@/components/ShotsList/components/DropDown/DropDown';
import Button from '@mui/material/Button';
import SimpleDialog from '@/components/ShotsList/components/SimpleDialog/SimpleDialog';

interface ITask {
    shotName?: string;
    name: string;
}

const Task: FC<ITask> = ({ shotName = '', name }) => {
    const [shotNameOn, setShotNameOn] = useState<boolean>(false);
    const statuses = ['готова к работе', 'в работе', 'дейлиз на проверку', 'approved', 'done'];
    const priority = ['минимальный', 'нормальный', 'высокий'];

    const handleDoubleClick = useTaskPopupStore((state) => state.setOpenClose);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>('Artist');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    };

    useEffect(() => {
        if (shotName.length > 0) setShotNameOn(true);
    }, []);
    return (
        <div className='task' onDoubleClick={handleDoubleClick}>
            {shotNameOn && <div className='task-shot_name'>{shotName}</div>}
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
