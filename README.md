# MERN Load Balancer Simulator 🚀

Welcome to the Cloud Computing Load Balancer Simulator! This project visually demonstrates how distributed cloud architectures handle high volumes of traffic using load balancing algorithms.

## 🏗️ What is this project?

In a real-world cloud environment (like AWS, Google Cloud, or Azure), a single server cannot handle millions of requests. Instead, a **Load Balancer** acts as a traffic cop, distributing incoming user requests across multiple **Backend Servers** (Nodes) so no single server gets overwhelmed.

This project simulates that exact environment locally using the MERN stack:

1. **Backend Nodes (`worker-node/`)**: These are your "cloud servers". We run three identical instances of them on ports `5001`, `5002`, and `5003`. When they receive a request, they simulate "processing time" (a random delay) to act like they are doing real work.
2. **The Load Balancer (`load-balancer/`)**: This is the API Gateway running on port `5000`. It receives all traffic and decides which Backend Node should handle it based on specific algorithms (like *Round Robin* or *Random*).
3. **The React Dashboard (`frontend/`)**: This is the visualizer. It allows you to simulate "attacks" or high traffic (e.g., sending 100 concurrent requests) and watch in real-time as the Load Balancer routes the traffic to the different nodes.

## 🚀 How to Run the Project

You can run this project in two ways: the **Automated Way** (easiest) or the **Manual Way** (best for seeing detailed logs).

### Option 1: The Automated Way (Recommended)
I have created a PowerShell script that spins up all 5 necessary servers in the background for you.

1. Open PowerShell or Command Prompt.
2. Navigate to the project folder:
   ```bash
   cd "C:\Users\abhis\OneDrive\Desktop\cc lab project"
   ```
3. Run the startup script:
   ```powershell
   .\start.ps1
   ```
4. Open your web browser and go to **http://localhost:5173**.

### Option 2: The Manual Way
If you want to see the live console logs of each server (which is great for lab demonstrations to show what's happening under the hood), you can open **5 separate terminal windows** inside the project folder:

**Terminal 1 (Worker Node 1):**
```bash
cd worker-node
$env:PORT=5001; npm start
```

**Terminal 2 (Worker Node 2):**
```bash
cd worker-node
$env:PORT=5002; npm start
```

**Terminal 3 (Worker Node 3):**
```bash
cd worker-node
$env:PORT=5003; npm start
```

**Terminal 4 (The Load Balancer):**
```bash
cd load-balancer
npm start
```

**Terminal 5 (The React Dashboard):**
```bash
cd frontend
npm run dev
```

## 🎮 How to Demo It

Once the React Dashboard is open at `http://localhost:5173`:

1. **Test Round Robin:** 
   - In the top right corner, ensure the algorithm is set to **"Round Robin"**.
   - Set the Batch Size slider to `30`.
   - Click **"Fire Requests"**. 
   - *Result:* You will see the requests distributed perfectly evenly (10 to Node 5001, 10 to Node 5002, 10 to Node 5003).

2. **Test Random:**
   - Change the algorithm in the top right to **"Random"**.
   - Fire another 30 requests.
   - *Result:* You will see the requests distributed unevenly, as the Load Balancer is now just picking a server entirely at random.

3. **Live Logs:**
   - Look at the "Live Request Logs" window at the bottom of the dashboard. It will show you exactly which node handled which request and how many milliseconds it took to process!
