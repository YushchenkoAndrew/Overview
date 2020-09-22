/* eslint-disable quotes */
console.log("Testing......\tJS assets");

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ["Language", "File size"],
    ["JavaScript", 11],
    ["Java", 7],
    ["Python", 2],
    ["CSS", 2],
    ["HTML", 2],
  ]);

  var options = {
    title: "Most Used languages",
    titleTextStyle: {
      fontSize: 24,
    },
    legend: {
      textStyle: {
        fontSize: 20,
      },
    },

    tooltip: {
      ignoreBounds: true,
      // trigger: "none",
      text: "percentage",
      textStyle: {
        fontSize: 20,
      },
    },

    pieSliceText: "none",
    pieHole: 0.8,
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("donutchart")
  );
  chart.draw(data, options);
}
