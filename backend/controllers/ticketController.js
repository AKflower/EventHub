// controllers/ticketController.js
const db = require('../db'); // Kết nối tới PostgreSQL

// Thêm một vé mới
const createTicket = async (req, res) => {
    const { typeid, eventid } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO tickets (typeid, eventid) 
             VALUES ($1, $2) RETURNING *`,
            [typeid, eventid]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// Lấy tất cả các vé
const getAllTickets = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tickets');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// Lấy vé theo ID
const getTicketById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM tickets WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Ticket Not Found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// Cập nhật thông tin vé
const updateTicket = async (req, res) => {
    const { id } = req.params;
    const { typeid, eventid } = req.body;

    try {
        const result = await db.query(
            `UPDATE tickets SET 
             typeid = $1, eventid = $2, modifiedtime = CURRENT_TIMESTAMP 
             WHERE id = $3 RETURNING *`,
            [typeid, eventid, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Ticket Not Found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// Xóa vé theo ID
const deleteTicket = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Ticket Not Found');
        }
        res.status(200).json({ message: 'Ticket Deleted', deletedTicket: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
};
