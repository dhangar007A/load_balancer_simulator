const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 5001;
const NODE_ID = `Node-${PORT}`;

// MongoDB Connection (optional fallback to memory for demo purposes)
let dbConnected = false;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/loadbalancer')
.then(() => {
    console.log(`[${NODE_ID}] Connected to MongoDB`);
    dbConnected = true;
}).catch(err => {
    console.warn(`[${NODE_ID}] MongoDB connection failed, using memory fallback. Error: ${err.message}`);
});

const logSchema = new mongoose.Schema({
    nodeId: String,
    timestamp: { type: Date, default: Date.now },
    processingTimeMs: Number
});
const RequestLog = mongoose.model('RequestLog', logSchema);

// In-memory fallback
const memoryLogs = [];

// Simulate some CPU intensive task or network delay
const simulateWork = () => {
    // Random delay between 50ms and 200ms
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 150) + 50));
};

let isCrashed = false;

app.get('/health', (req, res) => {
    if (isCrashed) {
        return res.status(500).json({ status: 'crashed', nodeId: NODE_ID });
    }
    res.status(200).json({ status: 'healthy', nodeId: NODE_ID });
});

app.post('/toggle-crash', (req, res) => {
    isCrashed = !isCrashed;
    console.log(`[${NODE_ID}] State changed. isCrashed: ${isCrashed}`);
    res.json({ success: true, isCrashed, nodeId: NODE_ID });
});

app.get('/process', async (req, res) => {
    if (isCrashed) {
        return res.status(500).json({ error: 'Node is currently offline/crashed.' });
    }
    const startTime = Date.now();
    
    await simulateWork();
    
    const processingTimeMs = Date.now() - startTime;
    
    // Log to DB
    if (dbConnected) {
        try {
            await new RequestLog({ nodeId: NODE_ID, processingTimeMs }).save();
        } catch (e) {
            console.error("DB Save Error:", e);
        }
    } else {
        memoryLogs.push({ nodeId: NODE_ID, processingTimeMs, timestamp: new Date() });
    }

    res.status(200).json({
        success: true,
        nodeId: NODE_ID,
        processingTimeMs,
        message: `Processed successfully by ${NODE_ID}`
    });
});

app.get('/stats', async (req, res) => {
    if (dbConnected) {
        try {
            const count = await RequestLog.countDocuments({ nodeId: NODE_ID });
            res.json({ nodeId: NODE_ID, totalProcessed: count });
        } catch (e) {
            res.status(500).json({ error: 'DB Error' });
        }
    } else {
        res.json({ nodeId: NODE_ID, totalProcessed: memoryLogs.length });
    }
});

app.listen(PORT, () => {
    console.log(`[Worker Node] Started ${NODE_ID} on port ${PORT}`);
});
