import { useState } from "react";

//A custom hook used to determine visual mode
export default function useVisualMode(initialMode) {
  //mode useState
  const [mode, setMode] = useState(initialMode);
  
  //history of mode useState
  const [history, setHistory] = useState([initialMode]);

  //switch to a new mode
  const transition = (newMode, replace = false) => {
    setMode(newMode);
    let updateArray = [];
    updateArray = [ ...history ];

    if (replace === true) {
      updateArray[updateArray.length - 1] = newMode;
    } else {
      updateArray.push(newMode);
    }
    setHistory(updateArray);
  };

  //go back to the previous mode
  const back = () => {
    if (history.length > 1) {
      let updateArray = [];
      updateArray = [ ...history ];
      updateArray.pop();

      setHistory(updateArray);
      setMode(updateArray[updateArray.length - 1]);
    }
  };

  return { mode, transition, back };
};
