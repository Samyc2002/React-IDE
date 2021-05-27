import React, { useState } from 'react';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { Typography, Select, InputLabel, MenuItem, FormControl, useMediaQuery, Fab, Dialog, DialogTitle,DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/python/python'
import 'codemirror/mode/ruby/ruby'
import 'codemirror/mode/swift/swift'
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
    const [open, setOpen] = React.useState(false);

    const handlechange = (e) => {
        setLanguage(lang_store[e.target.value]);
        setLng(lang_show[e.target.value])
    }
    
    const handleClose = () => {
        setOpen(false);
    };

    const store = String(value);

    var code = '';

    for(let i of store) {
        if(i==='\n') {
            code = code+'';
        }
        else {
            code = code+i;
        }
    }
    
    // API call code starts
    var config = {
        method: 'POST',
        url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
        data : JSON.stringify({ "code":value, "language":language, "input":"" })
    };

    const compileRun = () => {
        
        setOpen(true);

        setOutput("Wait for a couple of seconds please.");

        return axios(config)
            .then(function (response) {
                setOutput(response.data.output);
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
        cs: "text/x-c++src",
        java: "text/x-c++src",
        py: "text/x-python",
        rb: "text/x-ruby",
        kt: "text/x-c++src",
        swift: "text/x-swift"
    }

    const lang_show = [ "C", "C++19", "C#", "Java", "Python3", "Ruby", "Kotlin", "Swift" ]
    const lang_store = [ "c", "cpp", "cs", "java", "py", "rb", "kt", "swift" ]

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
            <Fab color="primary" aria-label="add" onClick={compileRun}>
                <PlayArrowRoundedIcon />
            </Fab>
            <Dialog
                fullScreen={fullScreen}
                fullWidth={!fullScreen}
                maxWidth='sm'
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Output</DialogTitle>
                <DialogContent>
                <DialogContentText>{`${output}`}</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                    <Typography variant="subtitle1" className="close">CLOSE</Typography>
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Ide;
