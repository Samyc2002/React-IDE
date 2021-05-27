import './App.css';
import Ide from './components/Ide';
import useLocalStorage from './Hooks/useLocalStore';
import { Paper } from '@material-ui/core';

function App() {

  const [code, setCode] = useLocalStorage('code', '');

  return (
    <div className="App">
      <Paper elevation={24}>
        <Ide
          value={code}
          onChange={setCode}
        />
        
      </Paper>
    </div>
  );
}

export default App;
