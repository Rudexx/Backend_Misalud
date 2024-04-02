const express = require('express');
const router = express.Router();

// Sample data
let todos = [
    { id: 1, text: 'Learn Node.js', completed: false },
    { id: 2, text: 'Build an API', completed: false }
];

// Define routes for todos
router.get('/', (req, res) => {
    res.json(todos);
});

router.post('/', (req, res) => {
    // Implementation for creating a new todo
});

router.get('/:id', (req, res) => {
    // Implementation for getting a specific todo
});

router.put('/:id', (req, res) => {
    // Implementation for updating a todo
});

router.delete('/:id', (req, res) => {
    // Implementation for deleting a todo
});

module.exports = router;
