import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as echarts from 'echarts';
import { DataService } from '../../../core/services/data.service';

@Component({
    selector: 'app-analytics-charts',
    template: `
    <div class="relative w-full h-full glass-panel p-4">
      <h3 class="text-cyber-accent font-mono text-sm mb-2 neon-text">SIGNAL FREQUENCY</h3>
      <div #chartContainer class="w-full h-[calc(100%-2rem)]"></div>
    </div>
  `,
    styles: [`
    :host { display: block; width: 100%; height: 100%; min-height: 200px; }
  `]
})
export class AnalyticsChartsComponent implements AfterViewInit {
    @ViewChild('chartContainer') chartContainer!: ElementRef;
    chart!: echarts.ECharts;

    constructor(private dataService: DataService) { }

    ngAfterViewInit(): void {
        this.initChart();
    }

    initChart() {
        this.chart = echarts.init(this.chartContainer.nativeElement, 'dark', {
            renderer: 'canvas',
            useDirtyRect: false
        });

        // Mock aggregation for the chart
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = days.map(() => Math.floor(Math.random() * 100));

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: days,
                    axisTick: { alignWithLabel: true },
                    axisLine: { lineStyle: { color: '#525252' } },
                    axisLabel: { color: '#e0e0e0' }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitLine: { lineStyle: { color: '#333' } },
                    axisLabel: { color: '#e0e0e0' }
                }
            ],
            series: [
                {
                    name: 'Calls',
                    type: 'bar',
                    barWidth: '60%',
                    data: data,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00f2ff' },
                            { offset: 1, color: '#7000ff' }
                        ])
                    }
                }
            ]
        };

        this.chart.setOption(option);

        window.addEventListener('resize', () => {
            this.chart.resize();
        });
    }
}
