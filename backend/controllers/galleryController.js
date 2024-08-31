const db = require('../db'); 
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const addImage = async (req, res) => {
  const { name } = req.body;
  const data = req.file.buffer; 

  try {
    const result = await db.query(
      `INSERT INTO Galleries (name, data) VALUES ($1, $2) RETURNING *`,
      [name, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding image:', err);
    res.status(500).send('Internal Server Error');
  }
};

const getImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM Galleries WHERE id = $1 AND "isDelete" = FALSE`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Image not found');
    }

    const image = result.rows[0];

    res.set('Content-Type', 'image/jpeg');
    res.send(image.data);
  } catch (err) {
    console.error('Error fetching image:', err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  addImage,
  getImageById,
  upload, 
};
