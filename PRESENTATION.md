# Slide 1: Title Slide
**Title:** Simulation and Visual Analysis of Load Balancing Algorithms in Cloud Computing
**Subtitle:** A MERN Stack Distributed System with Fault Tolerance
**Presented by:** [Your Team Member Names]
**Course:** Cloud Computing Lab

---

# Slide 2: Introduction
**Title:** What is Load Balancing in Cloud Computing?

* In cloud computing, applications are deployed across multiple servers (called **nodes**) instead of a single machine.
* A **Load Balancer** sits between the users and the server cluster. It acts as a traffic cop, deciding which server should handle each incoming request.
* Without load balancing, one server can get overloaded while others sit idle — leading to crashes, slow response times, and poor user experience.
* Our project builds a **custom load balancer from scratch** using the MERN stack and visually demonstrates how different routing algorithms perform under high traffic.

---

# Slide 3: Research Papers Referenced
**Title:** Literature Review — Base Research Papers

**Paper 1:**
* **Title:** "A Survey on Load Balancing Techniques in Cloud Computing"
* **Authors:** Geetha Megharaj, Dr. Mohan K.G.
* **Journal:** IOSR Journal of Computer Engineering (IOSR-JCE), Vol. 18, Issue 2, 2016, pp. 55–61
* **Link:** https://www.iosrjournals.org/iosr-jce/papers/Vol18-issue2/Version-4/H1802045561.pdf

**Paper 2:**
* **Title:** "Load Balancing Techniques In Cloud Computing: Review Paper"
* **Authors:** Foram Patel, Dr. Mohit Bhadla
* **Journal:** International Journal of Creative Research Thoughts (IJCRT), Vol. 13, Issue 4, April 2025 (ISSN: 2320-2882)
* **Link:** https://ijcrt.org (Paper ID: IJCRT25A4512)

---

# Slide 4: Problems Identified in the Research Papers
**Title:** Key Problems Highlighted by the Literature

The above research papers identify **three critical challenges** in cloud computing environments:

**Problem 1: Resource Imbalance (Uneven Load Distribution)**
* The papers state that naive algorithms like **Random allocation** cause some servers to receive a disproportionately high number of requests while others remain idle.
* This creates **hotspots** — servers that are overloaded, leading to high response times and potential crashes.

**Problem 2: Single Point of Failure (SPOF)**
* If a backend server suffers a hardware or software failure, a traditional static load balancer **continues sending traffic to the dead server**.
* This results in **dropped connections**, error responses (HTTP 500), and a broken user experience.

**Problem 3: Lack of Health Awareness**
* Standard static algorithms (Round Robin, Random) have **no mechanism to detect** whether a server is alive or dead.
* The papers recommend implementing **active health monitoring** to dynamically adapt routing decisions based on real-time server status.

**Speaker Note:** "These three problems — resource imbalance, single point of failure, and lack of health awareness — are the exact problems our project is designed to solve."

---

# Slide 5: Our Solution — Project Architecture
**Title:** How Our Project Solves These Problems

We built a **3-tier MERN stack distributed system** that directly addresses each problem from the research papers:

| Research Problem | Our Solution | Implementation |
|---|---|---|
| Resource Imbalance | Round Robin Algorithm | Sequentially routes requests (1→2→3→1→2→3) guaranteeing a perfect even split |
| Single Point of Failure | Fault Tolerance with Dynamic Rerouting | Crashed nodes are removed from the routing pool; traffic flows to healthy nodes only |
| Lack of Health Awareness | Active Health Checks (Heartbeats) | Load Balancer pings `/health` on every server every 2 seconds to detect failures |

**Architecture:**
* **3 Express.js Worker Nodes** — Simulate the cloud cluster (ports 5001, 5002, 5003)
* **1 Node.js Load Balancer (API Gateway)** — Custom reverse proxy with algorithm selection (port 5000)
* **1 React Dashboard** — Real-time visualization of load distribution and server health (port 5173)

---

# Slide 6: Solving Problem 1 — Resource Imbalance
**Title:** Algorithm Comparison: Round Robin vs. Random

**Random Allocation (The Flawed Approach):**
* Picks a server using `Math.random()`. No tracking, no state.
* **Result:** Uneven distribution. One server may get 15 requests while another gets only 5 out of 30.
* **Paper's Finding:** Random allocation leads to "hotspots" and poor resource utilization.

**Round Robin (Our Primary Solution):**
* Maintains an index variable. Routes sequentially: Server 1 → Server 2 → Server 3 → repeat.
* Uses modulo arithmetic: `index = (index + 1) % totalServers`
* **Result:** Fires 30 requests → Exactly 10 go to each server. Mathematically guaranteed.
* **Paper's Finding:** Round Robin provides "simple yet effective load distribution for homogeneous environments."

**Speaker Note:** "In our live demo, we will fire 30 requests under both algorithms so you can visually compare the distribution on the dashboard."

---

# Slide 7: Solving Problem 2 & 3 — Fault Tolerance & Health Checks
**Title:** Active Health Monitoring & Self-Healing Architecture

**How it works:**
1. The Load Balancer runs a `setInterval()` function every **2 seconds**.
2. It sends an HTTP GET request to the `/health` endpoint of each backend server.
3. If a server responds with `200 OK` → it is marked as **healthy** (green dot on dashboard).
4. If a server responds with `500` or times out → it is marked as **offline** (red dot on dashboard).
5. The `selectTarget()` function now **filters out unhealthy nodes** before applying the Round Robin or Random algorithm.

**Live Demo Steps:**
* Fire 30 requests → All 3 nodes get 10 each (normal Round Robin).
* Click **"Simulate Crash"** on Node-5001 → It turns red.
* Fire 30 requests again → Node-5001 gets **0 requests**. Node-5002 and Node-5003 get **15 each**.
* Click **"Revive Server"** on Node-5001 → It turns green again and starts receiving traffic.

**Speaker Note:** "This proves that our system achieves High Availability. Even if a server dies, the user never experiences an error because the load balancer instantly adapts."

---

# Slide 8: Technology Stack
**Title:** Tools & Technologies Used

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js, Vite, Tailwind CSS | Real-time dashboard and visualization |
| Load Balancer | Node.js, Express.js, http-proxy-middleware | API Gateway with custom routing algorithms |
| Backend Workers | Node.js, Express.js | Simulated cloud server instances |
| Database | MongoDB (with in-memory fallback) | Request logging and analytics |

---

# Slide 9: Conclusion
**Title:** Summary of Outcomes

* **Problem 1 (Resource Imbalance):** Solved using the Round Robin algorithm — visually verified with a perfect even distribution across 3 nodes.
* **Problem 2 (Single Point of Failure):** Solved using dynamic fault tolerance — crashed servers receive zero traffic while healthy servers absorb the load.
* **Problem 3 (Lack of Health Awareness):** Solved using active heartbeat monitoring — the load balancer pings servers every 2 seconds and adapts routing in real-time.
* **Outcome:** A fully functional, self-healing distributed cloud simulation built from scratch using the MERN stack.

---

# Slide 10: References
**Title:** References

1. Geetha Megharaj, Dr. Mohan K.G., "A Survey on Load Balancing Techniques in Cloud Computing," IOSR Journal of Computer Engineering (IOSR-JCE), Vol. 18, Issue 2, Ver. IV, Mar–Apr. 2016, pp. 55–61. [PDF Link](https://www.iosrjournals.org/iosr-jce/papers/Vol18-issue2/Version-4/H1802045561.pdf)

2. Foram Patel, Dr. Mohit Bhadla, "Load Balancing Techniques In Cloud Computing: Review Paper," International Journal of Creative Research Thoughts (IJCRT), Vol. 13, Issue 4, April 2025, ISSN: 2320-2882. Paper ID: IJCRT25A4512. [IJCRT Website](https://ijcrt.org)

3. GitHub Repository: https://github.com/dhangar007A/load_balancer_simulator

---

# Slide 11: Q&A
**Title:** Thank You — Questions?

**Speaker Note:** "Thank you. We will now proceed to the live demonstration of the dashboard."
