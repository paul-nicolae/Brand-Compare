import './App.css';
import TextField from '@mui/material/TextField';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from "react";

function App() {

  const [tableData, setTableData] = useState(null);
  const [interval, setInterval] = useState([null, null]);

  const requestFunction = () => {

    if (!interval[0] || !interval[1]) {
      alert('Please enter a valid interval! A valid interval has a start date and an end date.');
      return ;
    }

    const sendedData = {
      'start': interval[0].getTime(),
      'end': interval[1].getTime()
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendedData)
    };
    fetch('http://localhost:5100/requests', requestOptions)
        .then(response => response.json())
        .then(data => {
          setTableData(data);
        });
  };

  return (
    <div style = {{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>

      <div style={{ width: '100%', height: '10%', backgroundColor: '#1565C0', color: 'white' }}>
          <h1 style={{ paddingLeft: '30px' }}>Social Insider Task</h1>
      </div>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDateRangePicker
            displayStaticWrapperAs = "desktop"
            maxDate={Date.now()}
            allowSameDateSelection={true}
            disableHighlightToday={true}
            value={interval}
            onChange={(newValue) => {
              setInterval(newValue);
            }}
            renderInput={(startProps, endProps) => (
            <>
                <TextField {...startProps} />
                <Box sx = {{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
            </>
            )}
        />
      </LocalizationProvider>

      <div style={{ paddingTop: '20px', paddingBottom: '20px', display: 'flex', flexDirection: 'row'}}>
        <div style = {{marginRight: '25px'}}>
          <Button variant="contained" onClick={() => requestFunction()}>Get Profiles Data</Button>
        </div>
        <div style = {{marginLeft: '25px'}}>
          <Button variant="contained" onClick={() => setInterval([null, null])}>Cancel Interval</Button>
        </div>
      </div>

      <div style = {{paddingTop: '20px', paddingBottom: '20px'}}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Brand Name</TableCell>
                <TableCell align="right">Total Profiles</TableCell>
                <TableCell align="right">Total Fans</TableCell>
                <TableCell align="right">Total Engagement</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData == null ? <></> : tableData.map((row) => (
                <TableRow
                  key={row.brandName}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.brandName}
                  </TableCell>
                  <TableCell align="right">{row.totalProfiles}</TableCell>
                  <TableCell align="right">{row.totalFans}</TableCell>
                  <TableCell align="right">{row.totalEngagement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  );
}

export default App;