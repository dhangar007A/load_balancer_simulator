# Slide 1: Title Slide
**Title:** Simulation and Visual Analysis of Load Balancing Algorithms in Cloud Computing
**Subtitle:** A MERN Stack Distributed System Architecture
**Presented by:** [Your Team Member Names]
**Course:** Cloud Computing Lab

---

# Slide 2: Introduction & Problem Statement
**Title:** The Challenge in Modern Cloud Environments

* **Single Server Limitations:** A single traditional server has finite CPU and RAM. It cannot handle massive traffic spikes (e.g., flash sales).
* **Resource Imbalance:** Routing traffic randomly leads to some servers crashing while others sit idle.
* **Single Point of Failure (SPOF):** If the only server handling traffic suffers a hardware crash, the entire application goes completely offline.

**Speaker Note:** "Modern applications need to scale horizontally across multiple servers, but this introduces a new problem: How do we efficiently route millions of users to different servers without overloading them?"

---

# Slide 3: Literature Review
**Title:** Academic Context & Research Focus

* **Core Research Topic:** "Comparative Analysis of Static Load Balancing and Fault Tolerance."
* **The Role of an API Gateway:** Research shows that placing a Reverse Proxy / Load Balancer in front of servers is the standard architecture to manage traffic.
* **Algorithm Focus:** Our project simulates and compares two foundational algorithms discussed in cloud computing literature: **Round Robin** (Sequential) and **Random** (Probabilistic).

**Speaker Note:** "Based on cloud computing literature, we wanted to build a practical simulation to visually test the Throughput and Response Time of these classic algorithms."

---

# Slide 4: Proposed Solution & Architecture
**Title:** Our MERN Stack Load Balancer Simulation

* **Backend Worker Nodes (The Cloud Cluster):** 3 identical Express.js servers running on different ports to simulate a distributed computing environment.
* **The Load Balancer (API Gateway):** A custom Node.js reverse proxy that intercepts all incoming traffic and routes it using specific algorithms.
* **The Visualizer (React Dashboard):** A frontend UI to fire asynchronous batches of requests and monitor the real-time load distribution.

**Speaker Note:** "Instead of using AWS, we built our own miniature cloud on our local machine using the MERN stack so we could see exactly how the algorithms work under the hood."

---

# Slide 5: The Algorithms in Action
**Title:** Algorithm Comparison: Round Robin vs. Random

* **Random Allocation:**
  * Uses a mathematical randomizer to select a node.
  * *Result:* Uneven distribution. Visually proves why random routing creates bottlenecks in real clouds.
* **Round Robin (Static Distribution):**
  * Maintains an active index and routes sequentially (1-2-3, 1-2-3).
  * *Result:* Mathematically guarantees perfect load distribution. Solves the resource imbalance problem.

**Speaker Note:** "During our demo, you will see that when we fire 30 requests using Round Robin, our dashboard proves a perfect 10-10-10 split across our 3 servers."

---

# Slide 6: High Availability & Fault Tolerance
**Title:** Solving the Single Point of Failure

* **Active Health Checking (Heartbeats):** Our Load Balancer sends a ping to the `/health` endpoint of every backend server every 2 seconds.
* **Dynamic Rerouting:** If a server stops responding, the Load Balancer instantly flags it as offline.
* **Zero Downtime:** Traffic is seamlessly rerouted to the remaining healthy nodes without dropping the user's connection.

**Speaker Note:** "To prove our system is fault-tolerant, our dashboard has a 'Simulate Crash' button. If we kill Server 1, you will see the Load Balancer instantly adapt and route all new traffic to Servers 2 and 3."

---

# Slide 7: Conclusion
**Title:** Summary of Project Outcomes

* Successfully built a custom API Gateway from scratch.
* Visually proved that the Round Robin algorithm provides superior resource utilization over Random allocation.
* Implemented Active Health Checking to guarantee High Availability and Fault Tolerance.
* **Result:** A highly resilient, distributed cloud architecture.

**Speaker Note:** "Thank you. We will now proceed to the live demonstration of the dashboard where we will stress-test the cluster and simulate a hardware crash."

---

# Slide 8: Q&A
**Title:** Questions?
*(Leave blank for the professor to ask questions!)*
