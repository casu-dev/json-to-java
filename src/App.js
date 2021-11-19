import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, IconButton, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef, useState } from "react";
import convertToJavaString from "./JsonToJava"

const panelStyle = {
  padding: 4,
}

const textFieldStyle = {
  marginTop: 2,
}

function generateDialogText(javaStr) {
  return (
    javaStr.split('\n').map(str =>
      <Typography variant="body1" sx={{ mb: str.startsWith("    @") ? 0 : 2 }}>
        {str}
      </Typography>
    )
  )
}

function App() {
  const inputRef = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inuptHasError, setInuptHasError] = useState(false);
  const [javaString, setJavaString] = useState("");
  const [configSnakeToCamel, setConfigSnakeToCamel] = useState(true);

  const handleGenerate = () => {
    try {
      const str = convertToJavaString(inputRef.current.value, { snakeToCamel: configSnakeToCamel });
      console.log("Result:\n" + str);
      setJavaString(str);
      setDialogOpen(true);
    }
    catch (e) {
      setInuptHasError(true);
      console.log("Conversion went wrong");
    }
  };

  const handleClearInput = () => {
    inputRef.current.value = "";
    setInuptHasError(false);
  }

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(javaString);
    setDialogOpen(false);
  };

  return (
    <Typography component="div" sx={panelStyle}>
      <Typography variant="h5" >
        Convert an example JSON Object into a Java Class
      </Typography>
      <TextField
        sx={textFieldStyle}
        inputRef={inputRef}
        id="outlined-textarea"
        label="JSON example"
        defaultValue='{"name": "John"}'
        minRows="4"
        error={inuptHasError}
        fullWidth
        multiline
      />

      <FormGroup>
        <FormControlLabel control={
          <Checkbox checked={configSnakeToCamel} onClick={() => setConfigSnakeToCamel(!configSnakeToCamel)
          } />} label="[snake_case] to [camelCase]" />
      </FormGroup>

      <Typography component="div" sx={{ p: 2 }}>
        <Button
          onClick={handleGenerate}
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}>
          Generate
        </Button>
        <IconButton onClick={handleClearInput}>
          <DeleteIcon color="error" />
        </IconButton>
      </Typography>

      <Dialog
        open={dialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Copy this Java representation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {generateDialogText(javaString)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCopy} variant="contained" autoFocus>
            Copy
          </Button>
        </DialogActions>
      </Dialog>
    </Typography>
  );
}

export default App;
