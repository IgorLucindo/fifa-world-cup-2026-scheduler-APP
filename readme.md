# 🏆 FIFA World Cup 2026 Scheduler

[![Open App](https://img.shields.io/badge/OPEN_APP-World_Cup_Scheduler-2ea44f?style=for-the-badge)](https://igorlucindo.github.io/fifa-world-cup-2026-scheduler-APP/)

A web application that optimizes and visualizes the **FIFA World Cup 2026** match schedule. It compares the official schedule against a **Mixed Integer Programming (MIP)** model designed to minimize team travel distance and maximize efficiency.

The application features an interactive interface that allows users to drag and drop matches to build their own custom schedule while validating logical constraints.

## ✨ Features

* Visualizes the full tournament grid across **16 host cities** and **3 regions**.
* Compares the **Official Schedule** vs. an **Optimized MIP Schedule**.
* Calculates real-time **travel distance** (km/mi) and efficiency metrics.
* Interactive **Drag & Drop** interface for custom scheduling.
* Validates constraints such as **stadium turnaround** and **team rest days**.

## 💾 Dataset

The schedules used for the official fixture list and the mathematically optimized version are located in the **`dataset/` folder** of this project.

## 📝 How it works

* Uses a **Mixed Integer Programming (MIP)** model to solve for the minimum total travel distance for all teams.
* Calculates distances dynamically using the **Haversine formula** based on city coordinates.
* Enforces real-world constraints, requiring **2 days of rest for stadiums** and **3 days of rest for teams** between matches.

## ⚽ Interactive App

To make the optimization results accessible to non-technical audiences, we provide a web-based app of our model. This interactive tool allows users to visualize the match schedule and compare the official constraints against our optimized travel-minimization model.

[![Open App](https://img.shields.io/badge/OPEN_APP-World_Cup_Scheduler-2ea44f?style=for-the-badge)](https://igorlucindo.github.io/fifa-world-cup-2026-scheduler-APP/)

Users can interact with the schedule directly to validate logical constraints and explore the efficiency of different scheduling strategies.