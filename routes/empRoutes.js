const express = require('express');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/emplyoee');
const router = express.Router();

// Get all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Create a new employee
router.post('/employees', 
    body('email').isEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newEmployee = new Employee({
                ...req.body,
                created_at: new Date(),
                updated_at: new Date(),
            });
            await newEmployee.save();
            res.status(201).json({ message: 'Employee created successfully', employee_id: newEmployee._id });
        } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
);

// Get employee by ID
router.get('/employees/:eid', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.eid);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update employee
router.put('/employees/:eid', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.eid,
            { ...req.body, updated_at: new Date() },
            { new: true }
        );
        if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Employee details updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete employee
router.delete('/employees', async (req, res) => {
    const { eid } = req.query;
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(eid);
        if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
