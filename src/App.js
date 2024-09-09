import React, { useState } from 'react';
import { Button, Drawer, TextField, Autocomplete, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { ArrowLeft } from '@mui/icons-material';

const schemaOptions = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' }
];

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState(schemaOptions);
  const [selectedSchemaOption, setSelectedSchemaOption] = useState(null);

  // Open / Close drawer
  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  // Adding new schema functionlity
  const handleAddNewSchema = (e) => {

    if (!selectedSchemaOption) {
      alert("Please select a schema before adding.");
      return;
    }
    
      const updatedSchemas = [...selectedSchemas, selectedSchemaOption];
      setSelectedSchemas(updatedSchemas);
      setAvailableSchemas(availableSchemas.filter(option => option.value !== selectedSchemaOption.value));
      setSelectedSchemaOption(null);
    
  };

  const handleRemoveSchema = (value) => {
    // Delete Schema
    const updatedSchemas = selectedSchemas.filter((schema) => schema.value !== value);
    setSelectedSchemas(updatedSchemas);
    const removedSchema = schemaOptions.find((schema) => schema.value === value);
    setAvailableSchemas([...availableSchemas, removedSchema]);
  };

  // Save segment and send data to the Webhook
  const saveSegment = () => {
    const payload = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({
        [schema.value]: schema.label
      }))
    };

    console.log('Payload:', payload);
    fetch('https://webhook.site/da5164f6-be4f-4643-974d-c10a8a07a909', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data:', data);
        setDrawerOpen(false);
        setSelectedSchemaOption(null);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Grid sx={{display:'flex', alignItems:'center', justifyContent:'center', height:'100vh'}}>

    {/* Button to open drawer from right */}
    <Button variant="contained" sx={{textTransform: 'none', fontFamily: 'Inter', background:'#469aab'}} startIcon={<AddIcon />}  color="primary" onClick={toggleDrawer(true)}>
        Save Segment
      </Button>

      {/* Drawer Component */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ style: { width: '30%' } }}
      >
        <Grid container justifyContent="space-between" sx={{ padding: 2, background:'#469aab' }}>
          <IconButton sx={{color:'white'}} onClick={toggleDrawer(false)}>
            < ArrowLeft />
          </IconButton>
          <Typography fontSize={'18px'} fontFamily={'Inter'} alignItems={'center'} justifyContent={'center'} color='white'  marginTop={'1%'}>Saving Segment</Typography>
          <IconButton sx={{color:'white'}} onClick={toggleDrawer(false)}>
            < CloseIcon />
          </IconButton>
        </Grid>

        <Grid container flexDirection={'column'} spacing={2} sx={{ padding: 4 }}>
          <Grid item xs={12}>
          <Typography fontFamily={'Inter'} fontSize={'18px'} alignItems={'center'} justifyContent={'center'} >Enter the name of the segment</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Name of the segment"
              fullWidth
              variant="outlined"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              size='small'
            />
          </Grid>

          <Grid item xs={12} mt={4}>
          <Typography fontFamily={'Inter'} fontSize={'18px'} alignItems={'center'} justifyContent={'center'} >To save your segment, you need to add the schemas to build the query</Typography>
          </Grid>

          {/* Selected Schemas */}
          <Grid item xs={12} mt={2}>
            <Grid style={{ border: '1px solid #469aab', padding: 10 }}>
              <Typography fontFamily={'Inter'} fontSize={'14px'} alignItems={'center'} justifyContent={'center'}>Selected Schemas</Typography>
              {selectedSchemas.length === 0 && <Typography fontFamily={'Inter'} fontSize={'14px'} alignItems={'center'} justifyContent={'center'}>No schemas added yet.</Typography>}
              {selectedSchemas.map((schema, index) => (
                <Grid container  spacing={2} alignItems="center">
                <Grid item mt={2} xs={10}>
                  <TextField
                    label={schema.label}
                    fullWidth
                    variant="outlined"
                    disabled
                    size='small'
                    sx={{minWidth:'350px'}}
                  />
                </Grid>
              
                
                <Grid item xs={2} mt={2} style={{ textAlign: 'center' }}>
                  <IconButton
                    onClick={() => handleRemoveSchema(schema.value)}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Select Schema */}
          <Grid item xs={12}>
            <Autocomplete
              options={availableSchemas}
              getOptionLabel={(option) => option.label}
              value={selectedSchemaOption}
              onChange={(event, value) => setSelectedSchemaOption(value)}  // Set selected schema
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add schema to segment"
                  variant="outlined"
                  fullWidth
                  size='small'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} >
            <Button 
              variant="outlined" 
              sx={{textTransform: 'none', 
                fontFamily: 'Inter'}} 
                startIcon={<AddIcon />}
              onClick={handleAddNewSchema}
            >
              Add Schema
            </Button>
          </Grid>

          {/* Save Segment */}
          <Grid item display={'flex'} justifyContent={'space-between'} mt={10} xs={12}>
            <Button
              variant="contained" 
              sx={{textTransform: 'none', 
                fontFamily: 'Inter', 
                background:'#469aab'}} 
                startIcon={<AddIcon />}
              onClick={saveSegment}
            >
              Save Segment
            </Button>
            <Button
              variant="outlined" 
              sx={{textTransform: 'none', 
                fontFamily: 'Inter',}} 
                startIcon={<CloseIcon />}
              onClick={toggleDrawer(false)}
            >
              Close Segment
            </Button>
          </Grid>
        </Grid>
      </Drawer>
    </Grid>
  );
};

export default App;
