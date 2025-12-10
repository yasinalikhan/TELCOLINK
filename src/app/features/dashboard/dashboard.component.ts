import { Component, OnInit, ViewChild } from '@angular/core';
import { NetworkGraphComponent } from '../../shared/components/network-graph/network-graph.component';
import { GeoMapComponent } from '../../shared/components/geo-map/geo-map.component';
import { PdfExporterService } from '../../shared/services/pdf-exporter.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div id="dashboard-container" class="h-screen w-screen bg-cyber-bg p-4 grid grid-cols-12 grid-rows-12 gap-4">
      
      <!-- Header / Top Bar -->
      <div class="col-span-12 row-span-1 flex items-center justify-between px-4 glass-panel z-50">
        <div class="flex items-center space-x-4">
          <div class="w-3 h-3 rounded-full bg-cyber-primary animate-pulse"></div>
          <h1 class="text-2xl font-bold tracking-widest text-white neon-text">TELCO<span class="text-cyber-primary">LINK</span> // INTELLIGENCE</h1>
        </div>
        
        <!-- Search Bar -->
        <div class="flex-1 max-w-md mx-4">
          <div class="relative">
            <input type="text" 
                   placeholder="SEARCH TARGET [ID / PHONE]..." 
                   class="w-full bg-cyber-bg border border-cyber-border rounded px-4 py-1 text-cyber-primary focus:outline-none focus:border-cyber-primary focus:shadow-glow-blue font-mono text-sm"
                   (keyup)="onSearch($any($event.target).value)">
            <div class="absolute right-2 top-1 text-cyber-muted text-xs">⏎</div>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Path Finder Toggle -->
          <button (click)="togglePathFinder()" 
                  [class.bg-cyber-accent]="isPathFinderActive"
                  [class.text-black]="isPathFinderActive"
                  [class.text-cyber-accent]="!isPathFinderActive"
                  class="border border-cyber-accent px-3 py-1 rounded text-xs font-mono hover:bg-cyber-accent hover:text-black transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>{{ isPathFinderActive ? 'SELECT 2 NODES' : 'PATH FINDER' }}</span>
          </button>

          <!-- Community Detection -->
          <button (click)="detectCommunities()" 
                  class="border border-purple-500 text-purple-400 px-3 py-1 rounded text-xs font-mono hover:bg-purple-500 hover:text-white transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>CLUSTERS</span>
          </button>

          <!-- Focus Mode Toggle -->
          <button (click)="toggleFocusMode()" 
                  [class.bg-cyber-primary]="isFocusModeActive"
                  [class.text-black]="isFocusModeActive"
                  [class.text-cyber-primary]="!isFocusModeActive"
                  class="border border-cyber-primary px-3 py-1 rounded text-xs font-mono hover:bg-cyber-primary hover:text-black transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{{ isFocusModeActive ? 'FOCUS ACTIVE' : 'FOCUS MODE' }}</span>
          </button>

          <!-- Heatmap Toggle -->
          <button (click)="toggleHeatmap()" 
                  [class.bg-red-500]="isHeatmapActive"
                  [class.text-black]="isHeatmapActive"
                  [class.text-red-500]="!isHeatmapActive"
                  class="border border-red-500 px-3 py-1 rounded text-xs font-mono hover:bg-red-500 hover:text-black transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{{ isHeatmapActive ? 'HEATMAP ON' : 'HEATMAP' }}</span>
          </button>

          <!-- Time Travel Toggle -->
          <button (click)="toggleTimeTravel()" 
                  [class.bg-yellow-500]="showTimeTravel"
                  [class.text-black]="showTimeTravel"
                  [class.text-yellow-500]="!showTimeTravel"
                  class="border border-yellow-500 px-3 py-1 rounded text-xs font-mono hover:bg-yellow-500 hover:text-black transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ showTimeTravel ? 'PLAYBACK ON' : 'PLAYBACK' }}</span>
          </button>

          <!-- Simulation Toggle -->
          <button (click)="toggleSimulation()" 
                  [class.bg-cyber-primary]="isSimulating"
                  [class.text-black]="isSimulating"
                  [class.text-cyber-primary]="!isSimulating"
                  class="border border-cyber-primary px-3 py-1 rounded text-xs font-mono hover:bg-cyber-primary hover:text-black transition-colors flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" [class.bg-black]="isSimulating" [class.bg-cyber-primary]="!isSimulating" [class.animate-ping]="isSimulating"></span>
            <span>{{ isSimulating ? 'SIMULATION ACTIVE' : 'START SIMULATION' }}</span>
          </button>

          <!-- Export Button -->
          <button (click)="exportReport()" 
                  class="bg-cyber-surface border border-cyber-primary text-cyber-primary px-3 py-1 rounded text-xs font-mono hover:bg-cyber-primary hover:text-black transition-colors flex items-center gap-2">
            <span>DOWNLOAD REPORT</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          <div class="flex space-x-4 text-xs font-mono text-cyber-primary border-l border-cyber-border pl-4">
            <span>SYS.STATUS: ONLINE</span>
            <span>LATENCY: 12ms</span>
            <span>ENCRYPTION: AES-256</span>
          </div>
        </div>
      </div>

      <!-- Main Graph Area (Center) -->
      <div class="col-span-12 md:col-span-8 row-span-7 md:row-span-8 relative group flex flex-col">
        <!-- Time Travel Slider -->
        <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-1/2 glass-panel p-2 flex items-center space-x-4" *ngIf="showTimeTravel">
            <span class="text-xs text-cyber-primary font-mono whitespace-nowrap">TIME TRAVEL</span>
            <input type="range" min="0" max="100" [value]="timeProgress" (input)="onTimeTravelChange($any($event.target).value)" class="w-full accent-cyber-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer">
            <span class="text-xs text-cyber-accent font-mono whitespace-nowrap">{{ currentTimeLabel }}</span>
        </div>

        <div class="flex-1 relative">
            <app-network-graph #networkGraph></app-network-graph>
            <!-- Decorative corners -->
            <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-primary"></div>
            <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-primary"></div>
            <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-primary"></div>
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-primary"></div>
        </div>
      </div>

      <!-- Right Panel (Map & Details) -->
      <div class="col-span-12 md:col-span-4 row-span-7 md:row-span-8 flex flex-col gap-4">
        <div class="flex-1">
          <app-geo-map #geoMap></app-geo-map>
        </div>
        <div class="h-1/3 glass-panel p-4 overflow-y-auto font-mono text-xs">
          <h3 class="text-cyber-accent mb-2 border-b border-cyber-border pb-1">LIVE FEED</h3>
          <ul class="space-y-2 text-cyber-text opacity-80">
            <li class="flex justify-between"><span>> 555-1029 connected to 555-3920</span> <span class="text-cyber-muted">Now</span></li>
            <li class="flex justify-between"><span>> New node detected: 555-4491</span> <span class="text-cyber-muted">2s ago</span></li>
            <li class="flex justify-between"><span>> High traffic alert: Sector 7</span> <span class="text-cyber-muted">5s ago</span></li>
            <li class="flex justify-between"><span>> Encrypted signal intercepted</span> <span class="text-cyber-muted">12s ago</span></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Panel (Analytics) -->
      <div class="col-span-12 row-span-4 md:row-span-3">
        <app-analytics-charts></app-analytics-charts>
      </div>

    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  @ViewChild('networkGraph') networkGraph!: NetworkGraphComponent;
  @ViewChild('geoMap') geoMap!: GeoMapComponent;

  isSimulating = false;
  isPathFinderActive = false;
  isFocusModeActive = false;
  isHeatmapActive = false;

  constructor(private pdfService: PdfExporterService, private dataService: DataService) { }
  ngOnInit(): void { }

  onSearch(query: string) {
    this.networkGraph.filterNodes(query);
    this.geoMap.filterMarkers(query);
  }

  exportReport() {
    this.pdfService.exportToPdf('dashboard-container', 'TelcoLink_Report');
  }

  toggleSimulation() {
    this.isSimulating = !this.isSimulating;
    this.dataService.toggleSimulation(this.isSimulating);
  }

  togglePathFinder() {
    this.isPathFinderActive = !this.isPathFinderActive;
    if (this.isPathFinderActive) {
      this.isFocusModeActive = false;
      this.networkGraph.enableFocusMode(false);
    }
    this.networkGraph.enablePathFinder(this.isPathFinderActive);
  }

  detectCommunities() {
    this.networkGraph.detectCommunities();
  }

  toggleFocusMode() {
    this.isFocusModeActive = !this.isFocusModeActive;
    if (this.isFocusModeActive) {
      this.isPathFinderActive = false;
      this.networkGraph.enablePathFinder(false);
    }
    this.networkGraph.enableFocusMode(this.isFocusModeActive);
  }

  toggleHeatmap() {
    this.isHeatmapActive = !this.isHeatmapActive;
    this.geoMap.toggleHeatmap(this.isHeatmapActive);
  }

  // Time Travel Logic
  showTimeTravel = false;
  timeProgress = 100;
  currentTimeLabel = 'NOW';
  private allData: any[] = [];

  toggleTimeTravel() {
    this.showTimeTravel = !this.showTimeTravel;
    if (this.showTimeTravel) {
      // Fetch full data to filter locally
      this.dataService.getRawData().subscribe(data => {
        this.allData = data;
        this.onTimeTravelChange(100);
      });
    } else {
      // Reset to full view
      this.dataService.getRawData().subscribe(data => {
        this.networkGraph.initCytoscape(this.processGraphData(data));
        this.geoMap.renderMarkers(data);
      });
    }
  }

  onTimeTravelChange(value: number) {
    this.timeProgress = value;

    if (!this.allData.length) return;

    // Sort data by timestamp
    const sortedData = [...this.allData].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Calculate cutoff index
    const cutoffIndex = Math.floor((value / 100) * sortedData.length);
    const filteredData = sortedData.slice(0, cutoffIndex);

    // Update Label
    if (filteredData.length > 0) {
      const lastCall = filteredData[filteredData.length - 1];
      this.currentTimeLabel = new Date(lastCall.timestamp).toLocaleString();
    } else {
      this.currentTimeLabel = 'START';
    }

    // Update Components
    this.networkGraph.initCytoscape(this.processGraphData(filteredData));
    this.geoMap.renderMarkers(filteredData);
  }

  // Helper to convert raw calls to graph format (duplicated from DataService for client-side filtering)
  private processGraphData(calls: any[]) {
    const nodeMap = new Map<string, any>();
    const edgeMap = new Map<string, number>();

    calls.forEach(call => {
      if (!nodeMap.has(call.source)) nodeMap.set(call.source, { id: call.source, label: call.source, type: 'person', callVolume: 0 });
      if (!nodeMap.has(call.target)) nodeMap.set(call.target, { id: call.target, label: call.target, type: 'person', callVolume: 0 });

      nodeMap.get(call.source).callVolume++;
      nodeMap.get(call.target).callVolume++;

      const edgeKey = [call.source, call.target].sort().join('|');
      edgeMap.set(edgeKey, (edgeMap.get(edgeKey) || 0) + 1);
    });

    const nodes = Array.from(nodeMap.values()).map(n => ({
      data: { id: n.id, label: n.label, type: n.callVolume > 20 ? 'hub' : 'person', weight: n.callVolume }
    }));

    const edges = Array.from(edgeMap.entries()).map(([key, weight]) => {
      const [source, target] = key.split('|');
      return { data: { source, target, weight } };
    });

    return { nodes, edges };
  }
}
