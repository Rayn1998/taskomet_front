import { FC, useState } from 'react';
import Layout from '../Layout/Layout';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionActions from '@mui/material/AccordionActions';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ShotsList: FC = () => {
    const [status, setStatus] = useState<string>('');
    const handleChange = (e: SelectChangeEvent) => {
        setStatus(e.target.value as string);
    };
    return (
        <Layout>
            <div className='tasksblock-list'>
                <Accordion className='shot-accordion'>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon className='shot-accordion-expand-icon' />}
                        aria-controls='panel1-content'
                    >
                        <Typography component='span'>SOC_0010</Typography>
                    </AccordionSummary>
                    <AccordionDetails className='shot-accordion-details'>
                        <div className='shot-tasks-block'>
                            <div className='shot-task'>
                                <div className='shot-task-name'>compositing</div>
                                <Box className='shot-task-status' sx={{ minWidth: '15rem' }}>
                                    <FormControl fullWidth>
                                        <InputLabel className='shot-task-status-label'>
                                            status
                                        </InputLabel>
                                        <Select
                                            className='shot-task-status-select'
                                            label='Status'
                                            onChange={handleChange}
                                            value={status}
                                        >
                                            <MenuItem
                                                className='shot-task-status-item'
                                                value='готова к работе'
                                            >
                                                готова к работе
                                            </MenuItem>
                                            <MenuItem
                                                className='shot-task-status-item'
                                                value='в работе'
                                            >
                                                в работе
                                            </MenuItem>
                                            <MenuItem
                                                className='shot-task-status-item'
                                                value='дейлиз на проверку'
                                            >
                                                дейлиз на проверку
                                            </MenuItem>
                                            <MenuItem
                                                className='shot-task-status-item'
                                                value='approved'
                                            >
                                                approved
                                            </MenuItem>
                                            <MenuItem
                                                className='shot-task-status-item'
                                                value='done'
                                            >
                                                done
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </div>
                            <div className='shot-task'>
                                <div className='shot-task-name'>tracking</div>
                                <Box className='shot-task-status' sx={{ minWidth: '15rem' }}>
                                    <FormControl fullWidth>
                                        <InputLabel className='shot-task-status-label'>
                                            status
                                        </InputLabel>
                                        <Select
                                            className='shot-task-status-select'
                                            label='Status'
                                            onChange={handleChange}
                                            value={status}
                                        >
                                            <MenuItem
                                                className='shot-task-status-item'
                                                value='готова к работе'
                                            >
                                                готова к работе
                                            </MenuItem>
                                            <MenuItem
                                                className='shot-task-status-item'
                                                value='в работе'
                                            >
                                                в работе
                                            </MenuItem>
                                            <MenuItem
                                                className='shot-task-status-item'
                                                value='дейлиз на проверку'
                                            >
                                                дейлиз на проверку
                                            </MenuItem>
                                            <MenuItem
                                                className='shot-task-status-item'
                                                value='approved'
                                            >
                                                approved
                                            </MenuItem>
                                            <MenuItem
                                                className='shot-task-status-item'
                                                value='done'
                                            >
                                                done
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </div>
                        </div>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button>add new task</Button>
                    </AccordionActions>
                </Accordion>
            </div>
        </Layout>
    );
};

export default ShotsList;
