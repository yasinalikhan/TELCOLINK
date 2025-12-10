import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import cytoscape from 'cytoscape';
import { DataService } from '../../../core/services/data.service';

@Component({
    selector: 'app-network-graph',
    template: `
    <div class="relative w-full h-full glass-panel overflow-hidden">
      <div #cyContainer class="w-full h-full"></div>
      
      <!-- Header -->
      <div class="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 class="text-cyber-primary font-mono text-lg neon-text">NETWORK INTELLIGENCE</h3>
        <p class="text-xs text-cyber-muted">Live Connection Feed</p>
      </div>

      <!-- Tooltip -->
      <div *ngIf="tooltip.visible" 
           class="absolute z-50 bg-cyber-surface border border-cyber-primary p-2 rounded shadow-glow-blue pointer-events-none text-xs font-mono"
           [style.top.px]="tooltip.y"
           [style.left.px]="tooltip.x">
        <div class="text-cyber-primary font-bold">{{ tooltip.title }}</div>
        <div class="text-cyber-text">{{ tooltip.content }}</div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 400px;
    }
  `]
})
export class NetworkGraphComponent implements OnInit, AfterViewInit {
    @ViewChild('cyContainer') cyContainer!: ElementRef;
    cy!: cytoscape.Core;

    tooltip = { visible: false, x: 0, y: 0, title: '', content: '' };

    constructor(private dataService: DataService) { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        this.dataService.getGraphData().subscribe(data => {
            this.initCytoscape(data);
        });
    }

    initCytoscape(data: { nodes: any[], edges: any[] }) {
        console.log('Initializing Cytoscape with data:', data);
        console.log('Container dimensions:', this.cyContainer.nativeElement.offsetWidth, this.cyContainer.nativeElement.offsetHeight);

        if (!data.nodes.length) {
            console.warn('No nodes to render!');
            return;
        }

        try {
            this.cy = cytoscape({
                container: this.cyContainer.nativeElement,
                elements: {
                    nodes: data.nodes,
                    edges: data.edges
                },
                style: [
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#00f2ff',
                            'label': 'data(label)',
                            'color': '#fff',
                            'font-size': '10px',
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'width': 40, // Fixed size for debugging
                            'height': 40,
                            'text-outline-width': 2,
                            'text-outline-color': '#000',
                            'overlay-color': '#00f2ff',
                            'overlay-padding': 5,
                            'overlay-opacity': 0
                        }
                    },
                    {
                        selector: 'node[type="hub"]',
                        style: {
                            'background-color': '#7000ff',
                            'shape': 'diamond',
                            'width': 60,
                            'height': 60
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 1,
                            'line-color': '#333',
                            'target-arrow-color': '#333',
                            'target-arrow-shape': 'triangle',
                            'curve-style': 'bezier',
                            'opacity': 0.5
                        }
                    }
                ],
                layout: {
                    name: 'grid', // Simple layout first
                    animate: true
                }
            });

            // Event Listeners for Tooltip
            this.cy.on('mouseover', 'node', (event) => {
                const node = event.target;
                const position = node.renderedPosition();

                this.tooltip = {
                    visible: true,
                    x: position.x + 20,
                    y: position.y + 20,
                    title: node.data('label'),
                    content: `Type: ${node.data('type')} | Vol: ${node.data('weight')}`
                };
            });

            this.cy.on('mouseout', 'node', () => {
                this.tooltip.visible = false;
            });

            this.cy.on('mousemove', (event) => {
                if (this.tooltip.visible) {
                    // Optional: make tooltip follow mouse if desired, 
                    // but fixed to node position is often more stable.
                }
            });

            console.log('Cytoscape initialized successfully');

            // Force layout refresh
            setTimeout(() => {
                const layout = this.cy.layout({
                    name: 'cose',
                    animate: true,
                    randomize: false,
                    componentSpacing: 100,
                    nodeRepulsion: (node: any) => 400000,
                    nodeOverlap: 10,
                    idealEdgeLength: (edge: any) => 100,
                    edgeElasticity: (edge: any) => 100,
                    nestingFactor: 5,
                    gravity: 80,
                    numIter: 1000,
                    initialTemp: 200,
                    coolingFactor: 0.95,
                    minTemp: 1.0
                } as any);
                layout.run();
                this.cy.resize();
                this.cy.fit();
                console.log('Cytoscape layout refreshed');
            }, 500);

        } catch (error) {
            console.error('Error initializing Cytoscape:', error);
        }
    }
}
