import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    template: `
    <div class="h-screen w-screen bg-cyber-bg p-4 grid grid-cols-12 grid-rows-12 gap-4">
      
      <!-- Header / Top Bar -->
      <div class="col-span-12 row-span-1 flex items-center justify-between px-4 glass-panel">
        <div class="flex items-center space-x-4">
          <div class="w-3 h-3 rounded-full bg-cyber-primary animate-pulse"></div>
          <h1 class="text-2xl font-bold tracking-widest text-white neon-text">TELCO<span class="text-cyber-primary">LINK</span> // INTELLIGENCE</h1>
        </div>
        <div class="flex space-x-4 text-xs font-mono text-cyber-primary">
          <span>SYS.STATUS: ONLINE</span>
          <span>LATENCY: 12ms</span>
          <span>ENCRYPTION: AES-256</span>
        </div>
      </div>

      <!-- Main Graph Area (Center) -->
      <div class="col-span-12 md:col-span-8 row-span-7 md:row-span-8 relative group">
        <app-network-graph></app-network-graph>
        <!-- Decorative corners -->
        <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-primary"></div>
        <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-primary"></div>
        <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-primary"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-primary"></div>
      </div>

      <!-- Right Panel (Map & Details) -->
      <div class="col-span-12 md:col-span-4 row-span-7 md:row-span-8 flex flex-col gap-4">
        <div class="flex-1">
          <app-geo-map></app-geo-map>
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
    constructor() { }
    ngOnInit(): void { }
}
