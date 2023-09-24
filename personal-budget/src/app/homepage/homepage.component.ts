import { AfterViewInit, Component } from '@angular/core';
import { DataService } from '../data.service';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit{

    constructor(private dataService: DataService) { }

    ngAfterViewInit() {
      this.dataService.getData();
      this.createChart();
      this.created3js();
    }

    createChart() {
      var ctx = document.getElementById('myChart') as HTMLCanvasElement;
      var myPieChart = new Chart(ctx, {
          type: 'pie',
          data: this.dataService.dataSource
      });
    }

    private width = 360;
    private height = 360;
    private margin = 60;
    private svg: any;

    created3js() {
      var radius = Math.min(this.width, this.height) / 2 - this.margin;
      this.svg = d3.select("#d3js")
        .append("svg")
          .attr("width", this.width)
          .attr("height", this.height)
        .append("g")
          .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

      var chartData:any = [];

      for (var i = 0; i < this.dataService.dataSource.labels.length; i++) {
        chartData.push({name: this.dataService.dataSource.labels[i], value: this.dataService.dataSource.datasets[0].data[i], color: this.dataService.dataSource.datasets[0].backgroundColor[i]});
      }

      var color = d3.scaleOrdinal()
        .domain(chartData)
        .range(this.dataService.dataSource.datasets[0].backgroundColor);

      var pie = d3.pie()
        .value(function(d:any) {return d.value; })

      var data_ready = pie(chartData)

      var arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8)

      var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

      this.svg
        .selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
          .innerRadius(60)
          .outerRadius(radius)
        )
        .attr('fill', function(d:any){ return(color(d.data.value)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

      this.svg
        .selectAll('allPolylines')
        .data(data_ready)
        .enter()
        .append('polyline')
          .attr("stroke", "black")
          .style("fill", "none")
          .attr("stroke-width", 1)
          .attr('points', function(d:any) {
            var posA = arc.centroid(d)
            var posB = outerArc.centroid(d)
            var posC = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            posC[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return [posA, posB, posC]
          })

      this.svg
        .selectAll('allLabels')
        .data(data_ready)
        .enter()
        .append('text')
          .text(function(d:any) { return d.data.name })
          .attr('transform', function(d:any) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
          })
          .style('text-anchor', function(d:any) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
          })
    }

}
