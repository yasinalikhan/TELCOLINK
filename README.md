# TelcoLink - Advanced Link Analysis Dashboard

**TelcoLink** is a premium, "Cyberpunk Intelligence" themed Link Analysis Dashboard designed for Telecom data visualization and analytics. It provides analysts with powerful tools to investigate call records, detect communities, and track geospatial movements.

## 🚀 Features

### 🔍 Advanced Analytics
- **Global Search**: Instantly find any phone number or Call ID. The graph zooms in, and the map filters to show only relevant locations.
- **Shortest Path Finder**: Select any two nodes to instantly find the connection path between them using the A* Algorithm.
- **Community Detection**: Auto-detect and color-code network communities (Hubs & Neighbors) to identify key influencers.
- **Drill-Down Focus Mode**: Isolate a specific node and its direct connections, hiding the noise for focused investigation.

### 🗺️ Geospatial Intelligence
- **Interactive Map**: Dark-themed Leaflet map showing tower locations.
- **Heatmap Layer**: Visualize call density and active tower hotspots.
- **Real-Time Updates**: Markers update dynamically as new calls are simulated.

### ⏱️ Time-Travel & Simulation
- **Real-Time Simulation**: Watch new calls come in live with dynamic graph updates.
- **Time-Travel Playback**: Replay call history using a timeline slider to investigate events as they unfolded.

### 📊 Reporting
- **Export Reports**: One-click PDF download of the current dashboard state for intelligence reports.
- **Volume Trends**: Interactive bar charts showing call volume over time.

## 🎨 Visuals & Design
- **Theme**: Cyberpunk Intelligence.
- **Palette**: Deep black/grey backgrounds (`#050505`) with Neon Cyan (`#00f2ff`) and Purple (`#7000ff`) accents.
- **UI**: Glassmorphism panels with blur effects for a modern, high-tech feel.

## 🛠️ Tech Stack
- **Framework**: Angular 14
- **Styling**: Tailwind CSS (Custom Configuration)
- **Graph Visualization**: Cytoscape.js
- **Maps**: Leaflet & Leaflet.heat
- **Charts**: Apache ECharts
- **PDF Export**: html2canvas & jspdf

## 🏃‍♂️ How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm start
   ```

3. **Open Application**:
   Navigate to `http://localhost:4200` in your browser.

## 🔮 Future Roadmap
- **Real Data Integration**: Replace the mock data generator with a real REST API or WebSocket feed.
- **Advanced Filters**: Add date range pickers and specific number search.
- **3D Visualization**: Explore 3D graph rendering for larger datasets.
