// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '161980',
//   database: 'banner_db'
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log('MySQL Connected...');
// });

// app.get('/api/banner', (req, res) => {
//   const query = 'SELECT * FROM banner WHERE id = 1';
//   db.query(query, (err, result) => {
//     if (err) throw err;
//     res.json(result[0]);
//   });
// });

// // For updating existing banner settings
// // app.put('/api/banner', (req, res) => {
// //     console.log('Received PUT request:', req.body);
// //   const { description, timer, link, visible } = req.body;
// //   const query = 'UPDATE banner SET description = ?, timer = ?, link = ?, visible = ? WHERE id = 1';
// //   db.query(query, [description, timer, link, visible], (err, result) => {
// //     if (err) throw err;
// //     // Fetch updated banner to return
// //     db.query('SELECT * FROM banner WHERE id = 1', (err, result) => {
// //       if (err) throw err;
// //       res.json(result[0]);
// //     });
// //   });
// // });
// // app.put('/api/banner', (req, res) => {
// //     const { description, timer, link, visible } = req.body;
// //     const query = 'UPDATE banner SET description = ?, timer = ?, link = ?, visible = ? WHERE id = 1';
// //     db.query(query, [description, timer, link, visible], (err, result) => {
// //       if (err) throw err;
// //       res.send('Banner updated successfully');
// //     });
// //   });

// // app.put('/api/banner', (req, res) => {
// //     const { description, timer, link, visible } = req.body;
// //     const query = 'UPDATE banner SET description = ?, timer = ?, link = ?, visible = ? WHERE id = 1';
// //     db.query(query, [description, timer, link, visible], (err, result) => {
// //       if (err) {
// //         console.error('Error updating banner data:', err);
// //         res.status(500).send('Internal Server Error');
// //       } else {
// //         res.send('Banner updated successfully');
// //       }
// //     });
// //   });

// app.put('/api/banner', (req, res) => {
//     const { id, description, timer, link, visible } = req.body;
  
//     // Verify ID and other required fields are provided
//     if (!id || description === undefined || timer === undefined || link === undefined || visible === undefined) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
  
//     // Update banner data in the database
//     const query = 'UPDATE banner SET description = ?, timer = ?, link = ?, visible = ? WHERE id = ?';
//     db.query(query, [description, timer, link, visible, id], (err, result) => {
//       if (err) {
//         console.error('Error updating banner data:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }
//       res.status(200).json({ message: 'Banner updated successfully' });
//     });
//   });
  
  
  

// // For creating a new banner (if needed)
// // app.post('/api/banner', (req, res) => {
// //     const { description, timer, link, visible } = req.body;
// //     db.query('INSERT INTO banner (description, timer, link, visible) VALUES (?, ?, ?, ?)', [description, timer, link, visible], (err, results) => {
// //         if (err) throw err;
// //         res.json({ message: 'Banner created successfully', id: results.insertId });
// //     });
// // });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '161980',
  database: 'banner_db'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('MySQL Connected...');
});

// Get the current banner settings
app.get('/api/banner', (req, res) => {
  const query = 'SELECT * FROM banner WHERE id = 1';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching banner data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.json(result[0]);
  });
});

// Update banner settings
app.put('/api/banner', (req, res) => {
  const { id, description, timer, link, visible } = req.body;

  if (!id || description === undefined || timer === undefined || link === undefined || visible === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'UPDATE banner SET description = ?, timer = ?, link = ?, visible = ? WHERE id = ?';
  db.query(query, [description, timer, link, visible, id], (err, result) => {
    if (err) {
      console.error('Error updating banner data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'Banner updated successfully' });
  });
});

// Create a new banner (for testing purposes)
app.post('/api/banner', (req, res) => {
  const { description, timer, link, visible } = req.body;
  if (description === undefined || timer === undefined || link === undefined || visible === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const query = 'INSERT INTO banner (description, timer, link, visible) VALUES (?, ?, ?, ?)';
  db.query(query, [description, timer, link, visible], (err, results) => {
    if (err) {
      console.error('Error creating banner:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'Banner created successfully', id: results.insertId });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

