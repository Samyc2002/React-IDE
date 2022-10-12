import { Button } from '@material-ui/core'
import React from 'react'
import "./ImportFileButton.css"

export default function ImportFileButton({onChange, handleChange}) {
    const mapLang = {
        "c": 0,
        "cpp": 1,
        "cs": 2,
        "java": 3,
        "py": 4,
        "rb": 5,
        "kt": 6,
        "swift": 7,
    };

    const loadFile = async (e) => {
        const files = e.target.files;
        if (files.length < 1) return;
        const file = files[0];

        // Reseting file input
        document.getElementById("importfile").value = null;

        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = async (e) => {
            const data = e.target.result;
            if (e.loaded) {
                onChange(data);
                handleChange({target: {value: mapLang[file.name.split('.')[file.name.split('.').length-1]]}})
            }
        };
    };

  return (
      <Button onChange={(e) => loadFile(e)} color="secondary" variant="text" component="label" style={{color: "#4caf50"}}>
        Import file
        <input id="importfile" hidden accept=".c, .cpp, .cs, .java, .py, .rb, .kt, .swift" type="file" />
    </Button>
  )
}
