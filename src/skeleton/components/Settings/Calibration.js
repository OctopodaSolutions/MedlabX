import { useState, useEffect } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Select, MenuItem, TextField, Tooltip, Divider } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector, useDispatch } from 'react-redux';
import { saveCalibrationValues } from '../../functions/API Calls/database_calls';
// import { CalibrationObj } from '../../functionalities/redux_stores/xtract_constants';
import { fetchCalibrationValues } from '../../functions/API Calls/database_calls';
import { setCalibrationValues } from '../../../redux_stores/actions'
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { ErrorMessage, SuccessMessage } from "../UI Components/AlertMessage";
// import { getLineString } from "../../functions/Program Functions/";
import React from 'react';

export default function MyPaper() {
    const calibrationValuesRedux = useSelector((state) => state.calibration.calibrationValues);
    const numberOfLines = useSelector((state) => (state.connection_settings.NUM_LINES*2)|| 1 ) ;
    // const [editMode, setEditMode] = useState(false);
    const [accordionStates, setAccordionStates] = useState([]);
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('numberOfLines', numberOfLines);
        fetchCalibrationValues().then((res)=>{SuccessMessage(res)}).catch((err)=>{ErrorMessage(err);});
        initializeAccordionStates();
    }, [numberOfLines]);

    useEffect(() => {
        setCalibrationValues(calibrationValuesRedux);
    }, [calibrationValuesRedux]);

// useEffect(()=>{
//     console.log('calibrationValuesRedux',calibrationValuesRedux)
// },[])

    const initializeAccordionStates = () => {
        const initialStates = Array.from({ length: numberOfLines }, (_, index) => {
            const lineId = `Line_${index + 1}`;
            const lineData = calibrationValuesRedux[lineId] || {};

            return {
                lineNumber: index + 1,
                selectedValue: lineData.deg ? `Polynomial-${lineData.deg}` : '',
                ValueA: lineData.a || '',
                ValueB: lineData.b || '',
                ValueC: lineData.c || '',
                ValueD: lineData.d || '',
                ValueE: lineData.e || '',
                ValueF: lineData.f || '',
                deg: lineData.deg || '',
                dv1: lineData.dv1 || '',
                dv2: lineData.dv2 || '',
                dv3: lineData.dv3 || '',
                dv4: lineData.dv4 || '',
                dv5: lineData.dv5 || '',
                dv6: lineData.dv6 || '',
                mm_3: lineData.mm_3 || '',
                speed_3: lineData.speed_3 || '',
                isEditMode: false,
                expanded: true,
            };
        });

        setAccordionStates(initialStates);
    };


    const handleDropdownChange = (event, index) => {
        const newAccordionStates = [...accordionStates];
        newAccordionStates[index].selectedValue = event.target.value;
        setAccordionStates(newAccordionStates);
    };

    const handleInputChange = (event, index, inputType) => {

        const newAccordionStates = [...accordionStates];
        newAccordionStates[index][inputType] = event.target.value;
        setAccordionStates(newAccordionStates);
    };



    const handleEditClick = (index) => {
        const newAccordionStates = [...accordionStates];
        newAccordionStates[index].isEditMode = true;
        setAccordionStates(newAccordionStates);
    };

    // const handleAccordionChange = (index) => {
    //     const newAccordionStates = [...accordionStates];
    //     newAccordionStates[index].expanded = !newAccordionStates[index].expanded;
    //     setAccordionStates(newAccordionStates);
    // };

    const handleSaveClick = (index) => {
        const newAccordionStates = [...accordionStates];
        newAccordionStates[index].isEditMode = false;
        setAccordionStates(newAccordionStates);
        const currentSelectedFormula = newAccordionStates[index].selectedValue;

        if (currentSelectedFormula) {
            try {
                const { ValueA, ValueB, ValueC, ValueD, ValueE, ValueF, lineNumber, dv1, dv2, dv3, dv4, dv5, dv6, mm_3, speed_3 } = newAccordionStates[index];

                if (lineNumber !== undefined) {
                    let tempObj = {
                        lineId: `Line_${lineNumber}`,
                        cal: {
                            a: String(ValueA) || '0',
                            b: String(ValueB) || '0',
                            c: String(ValueC) || '0',
                            d: String(ValueD) || '0',
                            e: String(ValueE) || '0',
                            f: String(ValueF) || '0',
                            dv1: String(dv1) || '0',
                            dv2: String(dv2) || '0',
                            dv3: String(dv3) || '0',
                            dv4: String(dv4) || '0',
                            dv5: String(dv5) || '0',
                            dv6: String(dv6) || '0',
                            mm_3:String(mm_3) || '0',
                            speed_3:String(speed_3) || '0'
                        },
                        
                        
                    };

                    switch (currentSelectedFormula) {
                        case 'Polynomial-1':
                            tempObj.cal.deg = 1;
                            break;
                        case 'Polynomial-2':
                            tempObj.cal.deg = 2;
                            break;
                        case 'Polynomial-3':
                            tempObj.cal.deg = 3;
                            break;
                        case 'Polynomial-4':
                            tempObj.cal.deg = 4;
                            break;
                        case 'Polynomial-5':
                            tempObj.cal.deg = 5;
                            break;
                        default:
                            break;
                    }

                    console.log('Saving Calibration:', tempObj);

                    saveCalibrationValues(tempObj.lineId, tempObj.cal)
                        .then((res) => {
                            console.log('Response from saveCalibrationValues:', res);
                            fetchCalibrationValues()
                                .then((calibrationDataArray) => {
                                    console.log('Calibration Data Array:', calibrationDataArray);
                                    if (Array.isArray(calibrationDataArray.data)) {
                                        const modifiedCalibrationData = calibrationDataArray.data.reduce((acc, calibrationData) => {
                                            const { line_id, ...rest } = calibrationData;
                                            acc[line_id] = rest;
                                            return acc;
                                        }, {});
                                        dispatch(setCalibrationValues(modifiedCalibrationData));
                                    } else {
                                        console.error('Unexpected format of calibrationDataArray:', calibrationDataArray);
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error fetching calibration values:', error);
                                });
                        })
                        .catch((err) => {
                            console.error('Error saving calibration values:', err);
                        });

                    console.log('Calibration values saved successfully!');
                } else {
                    console.error('Line number is undefined for the selected formula');
                }
            } catch (error) {
                console.error('Error saving calibration values:', error);
            }
        } else {
            console.error('No formula selected for line ', index + 1);
        }
    };


    useEffect(() => {
        console.log('calibrationValuesRedux', calibrationValuesRedux);
        setCalibrationValues(calibrationValuesRedux);
    }, [calibrationValuesRedux]);



    return (
        <Box style={{ width: "97vw", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
            {accordionStates.map((accordion, index) => {
                const lineId = `Line_${index + 1}`;

                return (
                    <Accordion elevation={3} key={lineId} style={{ width: "65vw", marginBottom: "20px", borderRadius: '8px', backgroundColor: 'var(--body_background2)', color: 'var(--body_color)' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index + 1}-content`}
                            id={`panel${index + 1}-header`}
                        >
                            <Typography>{(lineId)}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box display="flex" width="100%" alignItems="center" gap="0.7vw">
                                <Box  style={{ border: "1px solid", borderColor: "grey", padding: "8px", width: "90%", borderRadius: "5px", backgroundColor: 'var( --body_background1)', color: 'var(--body_color)',boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.1)',marginBottom:'1vh', marginLeft:'1vh',  }}>
                                    <Box style={{ height: "50%", borderBottom: "1px dashed", borderColor: "grey", display: "flex", alignItems: "center", padding: '15px 15px' }}>
                                        <Select
                                            label="Dropdown"
                                            style={{ width: "10vw" }}
                                            onChange={(event) => handleDropdownChange(event, index)}
                                            value={accordion.selectedValue}
                                            disabled={!accordion.isEditMode}
                                            className="custom-textfield"

                                        >
                                            <MenuItem value='' disabled>Select calibration degree</MenuItem>
                                            <MenuItem value='Polynomial-1' className="custom-textfield"  disabled={!accordion.isEditMode} selected={accordion.selectedValue === 'Polynomial-1'}>Polynomial-1</MenuItem>
                                            <MenuItem value='Polynomial-2' className="custom-textfield" disabled={!accordion.isEditMode} selected={accordion.selectedValue === 'Polynomial-2'}>Polynomial-2</MenuItem>
                                            <MenuItem value='Polynomial-3' className="custom-textfield" disabled={!accordion.isEditMode} selected={accordion.selectedValue === 'Polynomial-3'}>Polynomial-3</MenuItem>
                                            <MenuItem value='Polynomial-4' className="custom-textfield" disabled={!accordion.isEditMode} selected={accordion.selectedValue === 'Polynomial-4'}>Polynomial-4</MenuItem>
                                            <MenuItem value='Polynomial-5' className="custom-textfield" disabled={!accordion.isEditMode} selected={accordion.selectedValue === 'Polynomial-5'}>Polynomial-5</MenuItem>
                                        </Select>


                                        {accordion.selectedValue === 'Polynomial-1' && (
                                            <>
                                                <TextField label="a" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueA} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueA')} />
                                                <TextField label="b" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueB} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueB')} />
                                            </>
                                        )}


                                        {accordion.selectedValue === 'Polynomial-2' && (
                                            <>
                                                <TextField label="a" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueA} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueA')} />
                                                <TextField label="b" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueB} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueB')} />
                                                <TextField label="c" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueC} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueC')} />
                                            </>
                                        )}


                                        {accordion.selectedValue === 'Polynomial-3' && (
                                            <>
                                                <TextField label="a" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueA} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueA')} />
                                                <TextField label="b" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueB} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueB')} />
                                                <TextField label="c" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueC} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueC')} />
                                                <TextField label="d" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueD} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueD')} />
                                            </>

                                        )}


                                        {accordion.selectedValue === 'Polynomial-4' && (
                                            <>
                                                <TextField label="a" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueA} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueA')} />
                                                <TextField label="b" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueB} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueB')} />
                                                <TextField label="c" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueC} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueC')} />
                                                <TextField label="d" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueD} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueD')} />
                                                <TextField label="e" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueE} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueE')} />
                                            </>
                                        )}

                                        {accordion.selectedValue === 'Polynomial-5' && (
                                            <>
                                                <TextField label="a" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueA} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueA')} />
                                                <TextField label="b" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueB} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueB')} />
                                                <TextField label="c" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueC} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueC')} />
                                                <TextField label="d" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueD} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueD')} />
                                                <TextField label="e" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueE} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueE')} />
                                                <TextField label="f" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.ValueF} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'ValueF')} />
                                            </>

                                        )}
                                    </Box>

                                    <Box style={{ height: "50%", padding: '15px 15px' ,display:'flex', flexDirection:'row' }}>
                                        <TextField label="Dead Volume" variant="outlined" fullWidth style={{ width: "10vw", height:'3vh', color:'grey' }} disabled={true} />
                                        <TextField label="dv1" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.dv1} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'dv1')} />
                                        <TextField label="dv2" variant="outlined" className="custom-textfield"style={{ width: "4vw", marginLeft: "10px" }} value={accordion.dv2} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'dv2')} />
                                        <TextField label="dv3" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.dv3} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'dv3')} />
                                        <TextField label="dv4" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.dv4} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'dv4')} />
                                        <TextField label="dv5" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.dv5} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'dv5')} />
                                        <Divider orientation="horizontal"  style={{ marginLeft: '20px', marginRight: '10px', height: '4.5vh',width:'3px',backgroundColor: 'gray' }} />
                                        <div style={{ marginLeft: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Speed</div>
                                        </div>
                                        <TextField 
                                            label=' µl/s' 
                                            variant="outlined" 
                                            className="custom-textfield" 
                                            style={{ width: "4vw", marginLeft: '10px' }} 
                                            value={accordion.mlmin} 
                                            disabled={true} 
                                        />
                                    </Box>
                                    {/* <Box style={{ height: "50%", padding: '15px 15px' }}> */}
                                        {/* <TextField label="Refil Constants" variant="outlined" fullWidth style={{ width: "10vw", height:'3vh', color:'grey' }} disabled={true} />
                                        <TextField label="ml/min" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.mm_3} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'mm_3')} />
                                        <TextField label="speed" variant="outlined" className="custom-textfield"style={{ width: "4vw", marginLeft: "10px" }} value={accordion.speed_3} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'speed_3')} /> */}
                                        {/* <TextField label="dv3" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.dv3} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'dv3')} />
                                        <TextField label="dv4" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.dv4} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'dv4')} />
                                        <TextField label="dv5" variant="outlined" className="custom-textfield" style={{ width: "4vw", marginLeft: "10px" }} value={accordion.dv5} disabled={!accordion.isEditMode} onChange={(event) => handleInputChange(event, index, 'dv5')} /> */}
                                    {/* </Box> */}
                                </Box>
                                <Box  style={{ border: "1px solid", borderColor: "grey", padding: "8px", width: "10%", borderRadius: "5px", height: '13.7vh', backgroundColor: 'var( --body_background3)', color: 'var(--body_color)', boxShadow: '5px 5px 4px rgba(0, 0, 0, 0.1)',marginBottom:'1vh', marginRight:'0.5vw'}}>
                                    <Box style={{ height: "50%", borderBottom: "1px dashed", borderColor: "grey", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Tooltip title="Edit" arrow sx={{ fontSize: "3rem" }}>
                                        <IconButton
                                            onClick={() => handleEditClick(index)}
                                            style={{marginTop: "17px", padding: "8px",marginBottom: "15px",backgroundColor: "var(--body_background)",color: "var(--body_color)",}}>
                                            <EditIcon style={{ fontSize: "2rem" }} />
                                       </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box style={{ height: "50%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: '15px' }}>
                                        <Tooltip title='Save'>
                                            <IconButton
                                                onClick={() => handleSaveClick(index)}
                                                disabled={!accordion.isEditMode}
                                                style={{ marginTop: "10px", padding: "8px",fontSize: "2.35vh",}}>
                                                <SaveIcon style={{ fontSize: "2rem",color: accordion.isEditMode ? 'var(--body_color)' : 'var(--disabled_text_color)' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
}
