import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NetworkGraphComponent } from './shared/components/network-graph/network-graph.component';
import { GeoMapComponent } from './shared/components/geo-map/geo-map.component';
import { AnalyticsChartsComponent } from './shared/components/analytics-charts/analytics-charts.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NetworkGraphComponent,
    GeoMapComponent,
    AnalyticsChartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
