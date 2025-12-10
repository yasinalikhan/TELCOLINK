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
    pathFinderMode = false;
    focusMode = false;
    selectedNodes: any[] = [];

    constructor(private dataService: DataService) { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        this.dataService.getGraphData().subscribe(data => {
            this.initCytoscape(data);
        });
    }

    initCytoscape(data: { nodes: any[], edges: any[] }) {
        if (!data.nodes.length) return;

        if (this.cy) {
            // Update existing graph
            this.cy.json({ elements: { nodes: data.nodes, edges: data.edges } });

            // Gentle layout refresh
            this.cy.layout({
                name: 'cose',
                animate: true,
                randomize: false,
                fit: false,
                componentSpacing: 100,
                nodeRepulsion: (node: any) => 400000,
                nestingFactor: 5,
                gravity: 80,
                numIter: 1000,
                initialTemp: 200,
                coolingFactor: 0.95,
                minTemp: 1.0
            } as any).run();

            return;
        }

        console.log('Initializing Cytoscape with data:', data);
        console.log('Container dimensions:', this.cyContainer.nativeElement.offsetWidth, this.cyContainer.nativeElement.offsetHeight);

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
                            'width': 40,
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
                    },
                    {
                        selector: 'edge[weight > 2]',
                        style: {
                            'width': 3,
                            'line-color': '#00f2ff',
                            'opacity': 0.8
                        }
                    },
                    {
                        selector: '.dimmed',
                        style: {
                            'opacity': 0.1,
                            'label': ''
                        }
                    },
                    {
                        selector: '.highlighted',
                        style: {
                            'opacity': 1,
                            'line-color': '#ff0055',
                            'target-arrow-color': '#ff0055',
                            'border-color': '#ff0055',
                            'border-width': 2
                        }
                    },
                    {
                        selector: '.path-source',
                        style: {
                            'border-color': '#00ff00',
                            'border-width': 4,
                            'background-color': '#00ff00'
                        }
                    },
                    {
                        selector: '.path-target',
                        style: {
                            'border-color': '#ff0000',
                            'border-width': 4,
                            'background-color': '#ff0000'
                        }
                    }
                ],
                layout: {
                    name: 'grid',
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

            // Path Finder Click Listener
            this.cy.on('tap', 'node', (event) => {
                const node = event.target;

                if (this.focusMode) {
                    this.cy.elements().addClass('dimmed').removeClass('highlighted');
                    node.removeClass('dimmed').addClass('highlighted');
                    node.neighborhood().removeClass('dimmed').addClass('highlighted');
                    this.cy.animate({
                        fit: { eles: node.closedNeighborhood(), padding: 50 },
                        duration: 500
                    });
                    return;
                }

                if (!this.pathFinderMode) return;

                // Prevent selecting same node twice
                if (this.selectedNodes.includes(node)) return;

                if (this.selectedNodes.length < 2) {
                    this.selectedNodes.push(node);
                    node.addClass(this.selectedNodes.length === 1 ? 'path-source' : 'path-target');
                }

                if (this.selectedNodes.length === 2) {
                    this.findShortestPath();
                }
            });

            console.log('Cytoscape initialized successfully');

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

    enablePathFinder(active: boolean) {
        this.pathFinderMode = active;
        this.selectedNodes = [];
        this.cy.elements().removeClass('highlighted dimmed path-source path-target path-edge');

        if (!active) {
            this.cy.fit();
        }
    }

    enableFocusMode(active: boolean) {
        this.focusMode = active;
        this.cy.elements().removeClass('highlighted dimmed');
        if (!active) {
            this.cy.fit();
        }
    }

    findShortestPath() {
        const source = this.selectedNodes[0];
        const target = this.selectedNodes[1];

        const aStar = this.cy.elements().aStar({
            root: source,
            goal: target,
            directed: false
        });

        if (aStar.found) {
            this.cy.elements().addClass('dimmed');
            aStar.path.removeClass('dimmed').addClass('highlighted');
            source.removeClass('dimmed').addClass('highlighted');
            target.removeClass('dimmed').addClass('highlighted');

            this.cy.animate({
                fit: { eles: aStar.path, padding: 50 },
                duration: 500
            });
        } else {
            alert('No path found between these nodes.');
            this.selectedNodes = [];
            this.cy.elements().removeClass('path-source path-target');
        }
    }



    detectCommunities() {
        if (!this.cy) return;

        // Simple clustering simulation:
        // 1. Reset styles
        this.cy.elements().removeClass('dimmed highlighted path-source path-target');
        this.cy.nodes().style({ 'background-color': '#00f2ff' }); // Reset to default

        // 2. Identify hubs (already marked as type='hub')
        const hubs = this.cy.nodes('[type="hub"]');

        // 3. Assign a random neon color to each hub and its neighbors
        const colors = ['#ff0055', '#00ff99', '#ffff00', '#ff9900', '#cc00ff', '#00ccff'];

        hubs.forEach((hub, index) => {
            const color = colors[index % colors.length];
            hub.style({ 'background-color': color });

            // Color neighbors same as hub
            hub.neighborhood().nodes().forEach(neighbor => {
                if (neighbor.data('type') !== 'hub') { // Don't override other hubs
                    neighbor.style({ 'background-color': color });
                }
            });

            // Color connecting edges
            hub.connectedEdges().style({ 'line-color': color, 'target-arrow-color': color });
        });

        // 4. Run layout to visually separate clusters
        this.cy.layout({
            name: 'cose',
            animate: true,
            componentSpacing: 150,
            nodeRepulsion: (node: any) => 800000,
            nestingFactor: 5,
            gravity: 50,
            numIter: 1000
        } as any).run();
    }

    filterNodes(query: string) {
        if (!this.cy) return;

        // Reset styles
        this.cy.elements().removeClass('dimmed highlighted');

        if (!query) {
            this.cy.fit();
            return;
        }

        const lowerQuery = query.toLowerCase();
        const targetNodes = this.cy.nodes().filter(node => {
            const label = node.data('label') ? node.data('label').toString().toLowerCase() : '';
            const id = node.data('id') ? node.data('id').toString().toLowerCase() : '';
            return label.includes(lowerQuery) || id.includes(lowerQuery);
        });

        if (targetNodes.length === 0) return;

        // Dim everything
        this.cy.elements().addClass('dimmed');

        // Highlight targets and neighbors
        targetNodes.addClass('highlighted');
        targetNodes.neighborhood().addClass('highlighted');
        targetNodes.connectedEdges().addClass('highlighted');

        // Zoom to targets
        this.cy.animate({
            fit: {
                eles: targetNodes,
                padding: 50
            },
            duration: 500
        });
    }
}
