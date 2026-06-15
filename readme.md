# 🏆 FIFA World Cup 2026 Scheduler

[![Open App](https://img.shields.io/badge/OPEN_APP-World_Cup_Scheduler-2ea44f?style=for-the-badge)](https://igorlucindo.github.io/fifa-world-cup-2026-scheduler-APP/)

A web application that optimizes and visualizes the **FIFA World Cup 2026** match schedule. This interactive tool was built to accompany our research on applying operations research to mitigate team travel fatigue during the tournament.

**📄 Associated Publication**
> **[Sport scheduling to minimize travels at the FIFA World Cup 2026](https://doi.org/10.1007/s11590-026-02320-x)**     
> Rogelio Gutierrez, Igor Cardoso, and Hamidreza Validi  

## ✨ Features

* **Compare Schedules:** Evaluate the Official FIFA schedule side-by-side against our Optimized Mixed Integer Programming (MIP) schedule.
* **Visualize the Grid:** Explore the full tournament layout across all 16 host cities and 3 geographic regions.
* **Calculate Logistics:** Track real-time travel distance (km/mi) and efficiency metrics as the schedule changes.
* **Build Your Own:** Use the interactive drag-and-drop interface to create custom group-stage match placements.
* **Validate Constraints:** Automatically check scheduling logic, including stadium turnaround times and mandatory team rest days.

## 💾 Dataset

The schedules used for the official fixture list and the mathematically optimized version are located in the **`dataset/` folder** of this project.

## 📝 How it works

* Uses a **Mixed Integer Programming (MIP)** model to solve for the minimum total travel distance for all teams.
* Calculates distances dynamically using the **Haversine formula** based on city coordinates.
* Enforces real-world constraints, requiring **2 days of rest for stadiums** and **3 days of rest for teams** between matches.

## 🚀 Interactive App

To make the optimization results accessible to non-technical audiences, we provide a web-based app of our model. This interactive tool allows users to visualize the match schedule and compare the official constraints against our optimized travel-minimization model.

[![Open App](https://img.shields.io/badge/OPEN_APP-World_Cup_Scheduler-2ea44f?style=for-the-badge)](https://igorlucindo.github.io/fifa-world-cup-2026-scheduler-APP/)

Users can interact with the schedule directly to validate logical constraints and explore the efficiency of different scheduling strategies.