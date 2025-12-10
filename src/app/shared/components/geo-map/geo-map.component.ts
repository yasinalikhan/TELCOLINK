import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-geo-map',
  template: `
    <div class="relative w-full h-full glass-panel overflow-hidden">
      <div #mapContainer class="w-full h-full"></div>
      <div class="absolute top-4 right-4 z-[1000]">
        <h3 class="text-cyber-secondary font-mono text-lg neon-text text-right">GEOSPATIAL TRACKING</h3>
        <p class="text-xs text-cyber-muted text-right">Active Towers</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; min-height: 300px; }
  `]
})
export class GeoMapComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  map!: L.Map;
  markerLayer: L.LayerGroup = L.layerGroup();
  allData: any[] = [];

  constructor(private dataService: DataService) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadData();
  }

  initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([40.7128, -74.0060], 11);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    this.markerLayer.addTo(this.map);
  }

  loadData(): void {
    this.dataService.getRawData().subscribe(data => {
      this.allData = data;
      this.renderMarkers(data);
    });
  }

  renderMarkers(data: any[]) {
    this.markerLayer.clearLayers();
    data.forEach(call => {
      L.circleMarker([call.tower_lat, call.tower_lng], {
        radius: 4,
        fillColor: '#00f2ff',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
      })
        .bindPopup(`
        <div class="text-black">
          <strong>Call ID:</strong> ${call.id}<br>
          <strong>Source:</strong> ${call.source}<br>
          <strong>Duration:</strong> ${call.duration}s
        </div>
      `)
        .addTo(this.markerLayer);
    });
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
