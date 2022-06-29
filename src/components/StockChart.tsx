import * as React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Theme } from "../styles";

const getOptions = (data, colNames, unit): Highcharts.Options => {
  return {
    title: {
      text: "",
    },

    xAxis: {
      categories: colNames,
      labels: {
        style: {
          color: Theme.color.white,
          opacity: 0.9,
          fontSize: "0.9rem",
        },
      },
      lineColor: "rgba(221, 207, 162, 0.1)",
    },

    yAxis: {
      title: {
        text: "",
        style: {
          color: Theme.color.white,
          opacity: 0.6,
        },
      },
      gridLineColor: "rgba(221, 207, 162, 0.4)",
      lineColor: Theme.color.white,
      labels: {
        style: {
          color: Theme.color.white,
          opacity: 0.8,
        },
        formatter: function() {
          return "" + this.value + " " + unit;
        },
      },
    },

    legend: {
      align: "right",
      x: 0,
      verticalAlign: "top",
      y: 0,
      backgroundColor: "none",
      borderColor: "none",
      borderWidth: 1,
      shadow: false,
      layout: "vertical",
      itemStyle: {
        color: Theme.color.white,
      },
    },

    tooltip: {
      enabled: false,
    },

    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
        },
        colorByPoint: true,
        colors: [Theme.color.secondary, Theme.color.red],
      },
    },

    chart: {
      backgroundColor: "none",
      plotBorderWidth: 0,
      plotBorderColor: "black",
      borderWidth: 0,
    },
    credits: {
      enabled: false,
    },

    series: [
      {
        type: "column",
        showInLegend: false,
        legendIndex: 0,
        data: [data[3], data[2]],
        borderWidth: 0,
        color: Theme.color.secondary,
      },
    ],
  };
};

const StockChart = (props: { data; colNames; unit }) => {
  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={getOptions(props.data, props.colNames, props.unit)}
      />
    </div>
  );
};

export default StockChart;
