import {FC, useState} from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface IDropDown {
    label: string;
    items: Array<any>;
}

const DropDown: FC<IDropDown> = ({ label, items }) => {
    const [status, setStatus] = useState<string>('');

    

    const handleChange = (e: SelectChangeEvent) => {
        setStatus(e.target.value as string);
    };
    return (
        <Box className='drop-down' sx={{ minWidth: '10rem' }}>
            <FormControl fullWidth>
                <InputLabel className='drop-down-label'>
                    {label}
                </InputLabel>
                <Select
                    className='drop-down-select'
                    label={label}
                    onChange={handleChange}
                    value={status}
                >
                    {items.map((item, i) => {
                        return (
                            <MenuItem
                                key={i}
                                className='drop-down-item'
                                value={item}
                            >
                                {item}
                            </MenuItem>
                        );
                    })}
                    
                </Select>
            </FormControl>
        </Box>
    );
}

export default DropDown;