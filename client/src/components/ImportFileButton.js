import { Button } from '@material-ui/core'
import React from 'react'
import "./ImportFileButton.css"

export default function ImportFileButton({onChange}) {
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
            }
        };
    };

  return (
    <Button onChange={(e) => loadFile(e)} color="primary" variant="contained" component="label">
        Import file
        <input id="importfile" hidden accept=".c, .cpp, .hpp, .h, .java, .py, .rb, .kt, .swift" type="file" />
    </Button>
  )
}
