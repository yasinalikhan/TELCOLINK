import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CallRecord {
    id: string;
    source: string;
    target: string;
    duration: number; // seconds
    timestamp: Date;
    tower_lat: number;
    tower_lng: number;
}

export interface GraphNode {
    id: string;
    label: string;
    type: 'person' | 'hub';
    callVolume: number;
}

export interface GraphEdge {
    source: string;
    target: string;
    weight: number;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private mockData: CallRecord[] = [];
    private nodes: GraphNode[] = [];
    private edges: GraphEdge[] = [];

    constructor() {
        this.generateMockData();
    }

    private generateMockData() {
        const numPeople = 50;
        const numCalls = 500;
        const people: string[] = [];

        // Generate People (Phone Numbers)
        for (let i = 0; i < numPeople; i++) {
            people.push(`555-${Math.floor(1000 + Math.random() * 9000)}`);
        }

        // Identify Hubs (Influencers)
        const hubs = [people[0], people[5], people[10]];

        // Generate Calls
        for (let i = 0; i < numCalls; i++) {
            let source = people[Math.floor(Math.random() * people.length)];
            let target = people[Math.floor(Math.random() * people.length)];

            // Biasing towards hubs to create realistic networks
            if (Math.random() > 0.7) {
                source = hubs[Math.floor(Math.random() * hubs.length)];
            }
            if (Math.random() > 0.7) {
                target = hubs[Math.floor(Math.random() * hubs.length)];
            }

            if (source === target) continue;

            // Random Location (approx lat/long for a city, e.g., New York area)
            const baseLat = 40.7128;
            const baseLng = -74.0060;
            const lat = baseLat + (Math.random() - 0.5) * 0.1;
            const lng = baseLng + (Math.random() - 0.5) * 0.1;

            this.mockData.push({
                id: `call-${i}`,
                source,
                target,
                duration: Math.floor(Math.random() * 600), // up to 10 mins
                timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // last 7 days
                tower_lat: lat,
                tower_lng: lng
            });
        }

        // Process for Graph
        const nodeMap = new Map<string, GraphNode>();
        const edgeMap = new Map<string, number>();

        this.mockData.forEach(call => {
            // Nodes
            if (!nodeMap.has(call.source)) {
                nodeMap.set(call.source, { id: call.source, label: call.source, type: hubs.includes(call.source) ? 'hub' : 'person', callVolume: 0 });
            }
            if (!nodeMap.has(call.target)) {
                nodeMap.set(call.target, { id: call.target, label: call.target, type: hubs.includes(call.target) ? 'hub' : 'person', callVolume: 0 });
            }
            nodeMap.get(call.source)!.callVolume++;
            nodeMap.get(call.target)!.callVolume++;

            // Edges
            const edgeKey = [call.source, call.target].sort().join('|');
            edgeMap.set(edgeKey, (edgeMap.get(edgeKey) || 0) + 1);
        });

        this.nodes = Array.from(nodeMap.values());
        this.edges = Array.from(edgeMap.entries()).map(([key, weight]) => {
            const [source, target] = key.split('|');
            return { source, target, weight };
        });
    }

    getGraphData(): Observable<{ nodes: any[], edges: any[] }> {
        const cyNodes = this.nodes.map(n => ({
            data: { id: n.id, label: n.label, type: n.type, weight: n.callVolume }
        }));
        const cyEdges = this.edges.map(e => ({
            data: { source: e.source, target: e.target, weight: e.weight }
        }));
        return of({ nodes: cyNodes, edges: cyEdges });
    }

    getRawData(): Observable<CallRecord[]> {
        return of(this.mockData);
    }
}
