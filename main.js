require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Example route: Fetch data from a Supabase table
app.get('/getServers', async (req, res) => {
    // Check for API key in headers
    if (req.headers['x-api-key'] !== process.env.GET_API_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid or missing API key' });
    }

    try {
        const { data, error } = await supabase
            .from('servers') // Replace with your table name
            .select('*');

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/addServer', async (req, res) => {
    // Check for API key in headers
    const { id, playerCount } = req.body;
    if (req.headers['x-api-key'] !== process.env.ADD_API_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid or missing API key' });
    }

    try {
        const { data: result, error } = await supabase.from("servers").insert({id: id, playerCount: playerCount});
    
        if (error) {
          console.error('Error inserting data:', error);
          return res.status(500).json({ error: error.message });
        }
    
        res.status(200).json({ message: 'Row added successfully!', result });
      } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
});
app.post('/removeServer', async (req, res) => {
    // Check for API key in headers
    const { id } = req.body;
    if (req.headers['x-api-key'] !== process.env.REMOVE_API_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid or missing API key' });
    }

    try {
        const { data: result, error } = await supabase.from("servers")
        .delete()
        .eq('id', id);
    
        if (error) {
          console.error('Error deleting data:', error);
          return res.status(500).json({ error: error.message });
        }
    
        res.status(200).json({ message: 'Row deleted successfully!', result });
      } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
