# Literature Review: Load Balancing in Cloud Computing

When presenting your project in the lab, this document serves as your **Literature Review and Problem Statement**. It explains exactly *why* this project was built and the specific academic problems it solves.

---

## 1. The Problem Statement
As internet traffic grows exponentially, modern web applications face three critical challenges when deployed on a single, traditional server:

1. **Single Point of Failure (SPOF):** If a single server goes down due to a hardware failure or software crash, the entire application becomes completely inaccessible to users.
2. **Poor Scalability:** A single machine has finite CPU and RAM. When traffic spikes (e.g., a flash sale or viral event), the server becomes a bottleneck, causing requests to queue up, resulting in massive latency or timeouts.
3. **Resource Underutilization:** If a company buys a massive supercomputer to handle peak traffic, 90% of that computing power is wasted during off-peak hours.

**The Solution:** Distributed Cloud Architectures. Instead of one giant server, cloud computing utilizes clusters of smaller, horizontal servers (Nodes). However, this creates a new problem: *How do you efficiently route incoming traffic across multiple nodes so that no single node gets overwhelmed?*

---

## 2. Literature Review on Load Balancing

Academic research into distributed systems has produced various **Load Balancing Algorithms** to solve the routing problem. A Load Balancer acts as an API Gateway (or reverse proxy), sitting between the users and the server cluster to distribute incoming network traffic. 

Our project implements and visualizes two foundational algorithms commonly discussed in literature:

### A. Random Allocation Algorithm
*   **Concept:** The load balancer uses a randomized mathematical function to pick a server for each incoming request.
*   **Literature View:** Research indicates that while Random allocation is incredibly fast to compute (O(1) time complexity) and requires no state tracking, it is highly inefficient for real-world use. Over time, probability dictates that it will inevitably send a "burst" of requests to a single server while leaving others idle.
*   **How our project proves this:** When setting our dashboard to "Random" and firing 100 requests, the visualization immediately exposes this flaw, showing uneven load distribution across the 3 nodes.

### B. Round Robin Algorithm (Static Distribution)
*   **Concept:** The load balancer maintains an index of all available servers and distributes requests strictly sequentially (Server 1, then Server 2, then Server 3, then back to Server 1).
*   **Literature View:** According to foundational cloud computing surveys (e.g., *"A Survey on Load Balancing Techniques in Cloud Computing"*), Round Robin is the most critical baseline algorithm. It mathematically guarantees that traffic is split perfectly evenly across all nodes. 
*   **How our project proves this:** By selecting "Round Robin" on our dashboard, the user can visually verify that 30 requests are perfectly divided into 10-10-10 segments, eliminating the bottleneck problem of the Random algorithm.

---

## 3. Conclusion & Project Justification

This project was developed to provide a **practical, visual simulation** of the theories discussed in cloud computing literature. 

By building a custom Node.js API Gateway and deploying multiple Express.js worker nodes, this project successfully demonstrates how a Round Robin load balancer solves the Single Point of Failure and Scalability problems by ensuring high availability and perfectly even load distribution across a distributed MERN architecture.
