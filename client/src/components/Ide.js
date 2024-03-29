import React, { useEffect, useState } from 'react';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { Typography, Select, InputLabel, MenuItem, FormControl, useMediaQuery, Fab, Dialog, DialogTitle,DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import { useTheme } from '@material-ui/core/styles';

import axios from 'axios';
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/python/python'
import 'codemirror/mode/ruby/ruby'
import 'codemirror/mode/swift/swift'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/fold/indent-fold'
import 'codemirror/addon/selection/active-line'

import * as resources from './resources';
import './styles.css';
import ImportFileButton from './ImportFileButton';

function Ide({ value, onChange }) {

    const Theme = useTheme();
    const isTabletorMobile = useMediaQuery('(max-width:800px)');
    const isMobile = useMediaQuery('(max-width:500px)');
    const fullScreen = useMediaQuery(Theme.breakpoints.down('sm'));

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
    const [theme, setTheme] = useState("material");

    const handlechange = (e) => {
        localStorage.setItem('lang', e.target.value);
        setLanguage(lang_store[e.target.value]);
        setLng(lang_show[e.target.value])
    }

    useEffect(() => {
        const lng = Number(localStorage.getItem('lang'));
        handlechange({target: {value: lng}});
    }, [handlechange]);
    
    const handleCloseIn = () => {
        setOpenIn(false);
    };

    const handleTheme = (e) => {
        setTheme(themes[e.target.value]);
    }

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
            'x-rapidapi-key': `${resources.apiKey}`, 
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
                            setOutput(res.data?.stdout || res.data.build_stderr);
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

    const themes = [
        'default',
        '3024-day',
        '3024-night',
        'abcdef',
        'ambiance',
        'base16-dark',
        'base16-light',
        'bespin',
        'blackboard',
        'cobalt',
        'colorforth',
        'dracula',
        'duotone-dark',
        'duotone-light',
        'eclipse',
        'elegant',
        'erlang-dark',
        'hopscotch',
        'icecoder',
        'isotope',
        'lesser-dark',
        'liquibyte',
        'material',
        'mbo',
        'mdn-like',
        'midnight',
        'monokai',
        'neat',
        'neo',
        'night',
        'panda-syntax',
        'paraiso-dark',
        'paraiso-light',
        'pastel-on-dark',
        'railscasts',
        'rubyblue',
        'seti',
        'solarized dark',
        'solarized light',
        'the-matrix',
        'tomorrow-night-bright',
        'tomorrow-night-eighties',
        'ttcn',
        'twilight',
        'vibrant-ink',
        'xq-dark',
        'xq-light',
        'yeti',
        'zenburn'
    ];

    return (
        <div className="window">
          <div className={isMobile ? "header-small" : "header"}>
              {!isMobile && (
                <Typography variant={isTabletorMobile?'subtitle1':'h6'} className="heading">
                    <strong>Online Code Editor</strong>
                </Typography>
              )}
                <div className='action-cont' style={{ paddingRight: '2vh' }}>
                    <ImportFileButton onChange={onChange} handleChange={handlechange} />
                    <FormControl className="change-theme">
                        <InputLabel id="demo-simple-select-label">Theme</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="select-theme"
                            value={theme}
                            onChange={handleTheme}
                        >
                          {themes.map((t, id) => (
                              <MenuItem value={id}>{t}</MenuItem>
                          ))}
                        </Select>
                    </FormControl>
                    <FormControl className="change-language">
                        <InputLabel id="demo-simple-select-label">Language</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="select-language"
                            value={lng}
                            onChange={handlechange}
                        >
                          {lang_show.map((ls, id) => (
                              <MenuItem value={id}>{ls}</MenuItem>
                          ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <ControlledEditor 
                onBeforeChange={handleChange}
                value={value}
                className="ide"
                options={{
                    autofocus: true,
                    lineWrapping: true,
                    lint: true,
                    mode: `${lang[language]}`,
                    theme: theme==="default" ? "" : theme,
                    lineNumbers: true,
                    extraKeys: {
                        'Cmd-/' : 'toggleComment',
                        'Ctrl-/' : 'toggleComment'
                    },
                    closeOnUnfocus: false,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    matchTags: true,
                    autoCloseTags: true,
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                    styleActiveLine: true
                }}
            />
            <Fab color="primary" aria-label="add" onClick={inputToggle} style={{zIndex: 100}}>
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
                        label="Input"
                        placeholder="Type your input here"
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
