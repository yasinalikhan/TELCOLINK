import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat'; // Import heatmap plugin
import { DataService, CallRecord } from '../../../core/services/data.service';

@Component({
  selector: 'app-geo-map',
  template: `
    <div class="relative w-full h-full rounded-lg overflow-hidden border border-cyber-primary shadow-glow-blue group">
      <div #mapContainer class="w-full h-full bg-black"></div>
      
      <!-- Overlay Info -->
      <div class="absolute bottom-4 left-4 bg-black/80 border border-cyber-primary p-2 rounded text-xs font-mono text-cyber-primary z-[1000]">
        <div>ACTIVE TOWERS: {{ activeTowers }}</div>
        <div>SIGNAL STRENGTH: 98%</div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 300px; height: 100%; }
  `]
})
export class GeoMapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map!: L.Map;
  private markersLayer: L.LayerGroup = L.layerGroup();
  private heatmapLayer: any; // Leaflet.heat layer
  private allData: CallRecord[] = [];

  activeTowers = 0;
  isHeatmapActive = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getRawData().subscribe(data => {
      this.allData = data;
      this.activeTowers = data.length;
      if (this.map) {
        this.updateVisualization();
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [40.7128, -74.0060],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
    this.updateVisualization();
  }

  private updateVisualization() {
    if (this.isHeatmapActive) {
      this.renderHeatmap();
    } else {
      this.renderMarkers(this.allData);
    }
  }

  renderMarkers(data: CallRecord[]) {
    this.markersLayer.clearLayers();
    if (this.heatmapLayer) {
      this.map.removeLayer(this.heatmapLayer);
    }

    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #00f2ff; width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px #00f2ff;"></div>`,
      iconSize: [8, 8],
      iconAnchor: [4, 4]
    });

    data.forEach(call => {
      const marker = L.marker([call.tower_lat, call.tower_lng], { icon });
      marker.bindPopup(`
        <div style="color: black; font-family: monospace;">
          <strong>CALL ID:</strong> ${call.id}<br>
          <strong>DURATION:</strong> ${call.duration}s
        </div>
      `);
      this.markersLayer.addLayer(marker);
    });
  }

  renderHeatmap() {
    this.markersLayer.clearLayers();
    if (this.heatmapLayer) {
      this.map.removeLayer(this.heatmapLayer);
    }

    const heatPoints = this.allData.map(c => [c.tower_lat, c.tower_lng, 0.5]); // 0.5 intensity

    // @ts-ignore - leaflet.heat types might be tricky
    this.heatmapLayer = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    }).addTo(this.map);
  }

  toggleHeatmap(active: boolean) {
    this.isHeatmapActive = active;
    this.updateVisualization();
  }

  filterMarkers(query: string) {
    if (!query) {
      this.renderMarkers(this.allData);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filteredData = this.allData.filter(call =>
      call.source.toLowerCase().includes(lowerQuery) ||
      call.target.toLowerCase().includes(lowerQuery) ||
      call.id.toLowerCase().includes(lowerQuery)
    );

    this.renderMarkers(filteredData);
  }
}
