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
    { id: 'Node-5001', url: 'http://127.0.0.1:5001', isHealthy: true },
    { id: 'Node-5002', url: 'http://127.0.0.1:5002', isHealthy: true },
    { id: 'Node-5003', url: 'http://127.0.0.1:5003', isHealthy: true }
];

// Active Health Checker (Heartbeat)
setInterval(async () => {
    for (let backend of BACKENDS) {
        try {
            const res = await fetch(`${backend.url}/health`);
            const data = await res.json();
            if (res.ok && data.status === 'healthy') {
                if (!backend.isHealthy) console.log(`[Load Balancer] ${backend.id} is back online!`);
                backend.isHealthy = true;
            } else {
                if (backend.isHealthy) console.warn(`[Load Balancer] ${backend.id} failed health check (Status: ${res.status}). Marking offline.`);
                backend.isHealthy = false;
            }
        } catch (error) {
            if (backend.isHealthy) console.warn(`[Load Balancer] ${backend.id} is unreachable. Marking offline.`);
            backend.isHealthy = false;
        }
    }
}, 2000);

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
    const healthyBackends = BACKENDS.filter(b => b.isHealthy);
    
    if (healthyBackends.length === 0) {
        throw new Error("No healthy backends available!");
    }

    if (currentAlgorithm === 'RoundRobin') {
        // Ensure index doesn't go out of bounds if a server dropped
        if (roundRobinIndex >= healthyBackends.length) roundRobinIndex = 0;
        
        const target = healthyBackends[roundRobinIndex].url;
        roundRobinIndex = (roundRobinIndex + 1) % healthyBackends.length;
        return target;
    } else if (currentAlgorithm === 'Random') {
        const randomIndex = Math.floor(Math.random() * healthyBackends.length);
        return healthyBackends[randomIndex].url;
    }
    return healthyBackends[0].url; // Default fallback
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
