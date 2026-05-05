const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());
app.use(morgan('dev'));
// Note: Don't use express.json() globally if using proxy middleware for all routes as it can consume the body.
// We will only use it for our specific LB API routes.

const PORT = process.env.PORT || 5000;

// The backend worker servers
const BACKENDS = [
    { id: 'Node-5001', url: 'http://127.0.0.1:5001' },
    { id: 'Node-5002', url: 'http://127.0.0.1:5002' },
    { id: 'Node-5003', url: 'http://127.0.0.1:5003' }
];

let currentAlgorithm = 'RoundRobin'; // 'RoundRobin' or 'Random'
let roundRobinIndex = 0;

// API to get current LB status and change algorithm
app.get('/lb/status', (req, res) => {
    res.json({
        algorithm: currentAlgorithm,
        backends: BACKENDS
    });
});

app.post('/lb/algorithm', express.json(), (req, res) => {
    const { algorithm } = req.body;
    if (algorithm === 'RoundRobin' || algorithm === 'Random') {
        currentAlgorithm = algorithm;
        res.json({ success: true, algorithm: currentAlgorithm });
    } else {
        res.status(400).json({ error: 'Invalid algorithm' });
    }
});

// Custom logic to select the target based on algorithm
const selectTarget = () => {
    if (currentAlgorithm === 'RoundRobin') {
        const target = BACKENDS[roundRobinIndex].url;
        roundRobinIndex = (roundRobinIndex + 1) % BACKENDS.length;
        return target;
    } else if (currentAlgorithm === 'Random') {
        const randomIndex = Math.floor(Math.random() * BACKENDS.length);
        return BACKENDS[randomIndex].url;
    }
    return BACKENDS[0].url; // Default fallback
};

// Proxy middleware
app.use('/api', createProxyMiddleware({
    target: BACKENDS[0].url, // this gets overwritten by router function
    changeOrigin: true,
    router: (req) => {
        // dynamically select the target URL for each request
        const target = selectTarget();
        console.log(`[Load Balancer] Routing request to: ${target} using ${currentAlgorithm}`);
        return target;
    },
    pathRewrite: {
        '^/api': '', // remove /api prefix before forwarding
    }
}));

app.listen(PORT, () => {
    console.log(`[Load Balancer] Gateway running on port ${PORT}`);
    console.log(`[Load Balancer] Algorithm: ${currentAlgorithm}`);
});
