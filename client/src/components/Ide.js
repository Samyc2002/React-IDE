import React, { useState } from 'react';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { Typography, Select, InputLabel, MenuItem, FormControl, useMediaQuery, Fab, Dialog, DialogTitle,DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import { useTheme } from '@material-ui/core/styles';

import axios from 'axios';
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/python/python'
import 'codemirror/mode/ruby/ruby'
import 'codemirror/mode/swift/swift'

import * as resources from './resources';
import './styles.css';

function Ide({ value, onChange }) {

    const theme = useTheme();
    const isTabletorMobile = useMediaQuery('(max-width:800px)');
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    const handleChange = (editor, data, value) => {
        onChange(value);
    }
    
    const [language, setLanguage] = useState("");
    const [lng, setLng] = useState("");
    const [output, setOutput] = useState("Wait for a couple of seconds please.");
    const [time, setTime] = useState(0);
    const [memory, setMemory] = useState(0);
    const [openIn, setOpenIn] = React.useState(false);
    const [openOut, setOpenOut] = React.useState(false);
    const [input, setInput] = useState("");

    const handlechange = (e) => {
        setLanguage(lang_store[e.target.value]);
        setLng(lang_show[e.target.value])
    }
    
    const handleCloseIn = () => {
        setOpenIn(false);
    };

    const handleCloseOut = () => {
        setOpenOut(false);
    };

    const inputToggle = () => {
        setOpenIn(true);
    }

    const Input = (e) => {
        setInput(e.target.value);
    }

    // API call code starts
    var compile = {
        method: 'POST',
        url: `${resources.url}/create`,
        headers: { 
            'x-rapidapi-key': 'ea36c32c45mshf235e5b46ea12b6p157005jsn655911988c03', 
            'x-rapidapi-host': 'paiza-io.p.rapidapi.com', 
            'Content-Type': 'application/json'
        },
        data : JSON.stringify({
                source_code: value,
                language: language,
                input: input
            })
    };

    const compileRun = () => {
        
        setOpenIn(false);
        
        setOpenOut(true);

        setOutput("Wait for a couple of seconds please.");

        axios(compile)
            .then(function (response) {
                console.log(response);
                setTimeout(() => {
                    axios.get(`${resources.url}/get_details`, {
                        params: {
                            id: response.data?.id
                        },
                        headers: {
                            'x-rapidapi-key': 'ea36c32c45mshf235e5b46ea12b6p157005jsn655911988c03',
                            'x-rapidapi-host': 'paiza-io.p.rapidapi.com'
                        }
                    })
                        .then((res) => {
                            setOutput(res.data?.stdout || res.data.error);
                            setTime(res.data.time);
                            setMemory(res.data.memory);
                            console.log(`Time taken: ${time}`);
                            console.log(`Memory used: ${memory}`);
                            console.log(res);
                        })
                        .catch((err) => console.log(err));
                }, 10000);
            })
            .catch(function (error) {
                setOutput("Error Executing the Code");
                console.log(error);
            });
    }
    // API call code ends

    const lang = {
        c: "text/x-c++src",
        cpp: "text/x-c++src",
        csharp: "text/x-c++src",
        java: "text/x-c++src",
        python3: "text/x-python",
        ruby: "text/x-ruby",
        kotlin: "text/x-c++src",
        swift: "text/x-swift"
    }

    const lang_show = [ "C", "C++19", "C#", "Java", "Python3", "Ruby", "Kotlin", "Swift" ]
    const lang_store = [ "c", "cpp", "csharp", "java", "python3", "ruby", "kotlin", "swift" ]

    return (
        <div className="window">
            <div className="header">
                <Typography variant={isTabletorMobile?'subtitle1':'h6'} className="heading">
                    <strong>Online Code Editor</strong>
                </Typography>
                <div style={{ paddingRight: '2vh' }}>
                    <FormControl className="change-language">
                        <InputLabel id="demo-simple-select-label">Language</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="select-language"
                            value={lng}
                            onChange={handlechange}
                        >
                        <MenuItem value={0}>{lang_show[0]}</MenuItem>
                        <MenuItem value={1}>{lang_show[1]}</MenuItem>
                        <MenuItem value={2}>{lang_show[2]}</MenuItem>
                        <MenuItem value={3}>{lang_show[3]}</MenuItem>
                        <MenuItem value={4}>{lang_show[4]}</MenuItem>
                        <MenuItem value={5}>{lang_show[5]}</MenuItem>
                        <MenuItem value={6}>{lang_show[6]}</MenuItem>
                        <MenuItem value={7}>{lang_show[7]}</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <ControlledEditor 
                onBeforeChange={handleChange}
                value={value}
                className="ide"
                options={{
                    lineWrapping: true,
                    lint: true,
                    mode: `${lang[language]}`,
                    theme: 'material',
                    lineNumbers: true                        
                }}
            />
            <Fab color="primary" aria-label="add" onClick={inputToggle}>
                <PlayArrowRoundedIcon />
            </Fab>
            <Dialog
                fullScreen={fullScreen}
                fullWidth={!fullScreen}
                maxWidth='xs'
                open={openIn}
                onClose={handleCloseIn}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Input</DialogTitle>
                <DialogContent className="input-field">
                    <TextField
                        id="filled-textarea"
                        label="Multiline Placeholder"
                        placeholder="Placeholder"
                        multiline
                        variant="filled"
                        onChange={Input}
                    />
                    <br/>
                    <DialogContentText><b>NOTE:</b> <i>Give the input exactly as needed with appropriate newlines and spaces.</i></DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={compileRun} color="primary">
                    <Typography variant="subtitle1" className="close">RUN</Typography>
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullScreen={fullScreen}
                fullWidth={!fullScreen}
                maxWidth='sm'
                open={openOut}
                onClose={handleCloseOut}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Output</DialogTitle>
                <DialogContent>
                    <DialogContentText><pre className="output-formatting">{`${output}`}</pre></DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={handleCloseOut} color="primary">
                    <Typography variant="subtitle1" className="close">CLOSE</Typography>
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Ide;
