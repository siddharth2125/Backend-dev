const express = require('express');
const mongoose = require('mongoose');

const server = express();
server.use(express.json());


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/shopDB');
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Connection failed:", error.message);
        process.exit(1);
    }
};

connectDB();


const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    cost: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);




server.post('/api/items', async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});


server.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json({ count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch data" });
    }
});


server.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: "Invalid ID format" });
    }
});


server.patch('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


server.delete('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ success: true, message: "Item removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
});


const PORT = 4000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});