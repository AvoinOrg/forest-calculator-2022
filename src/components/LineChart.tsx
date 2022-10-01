import * as React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Theme } from "../styles";

const getOptions = (data, colNames, xNames, unit): Highcharts.Options => {
  return {
    title: {
      text: "",
    },

    xAxis: {
      visible: true,
      categories: xNames,
      labels: {
        style: {
          color: Theme.color.white,
          opacity: 0.6,
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
      min: 0,
      gridLineColor: "rgba(221, 207, 162, 0.3)",
      lineColor: Theme.color.white,
      labels: {
        style: {
          color: Theme.color.white,
          opacity: 0.6,
        },
        formatter: function() {
          return "" + this.value + " " + unit;
        },
      },
    },

    legend: {
      // align: "right",
      // x: 0,
      verticalAlign: "bottom",
      // y: 0,
      backgroundColor: "none",
      borderColor: "none",
      borderWidth: 1,
      shadow: false,
      layout: "horizontal",
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
      },
    },

    chart: {
      type: "line",
      backgroundColor: "none",
      plotBorderWidth: 0,
      plotBorderColor: "black",
      borderWidth: 0,
    },
    credits: {
      enabled: false,
    },

    series: [
      // {
      //   type: "column",

      // },
      {
        type: "line",
        name: colNames[0],
        showInLegend: true,
        legendIndex: 0,
        borderWidth: 0,
        color: Theme.color.secondaryLight,
        data: data[3],
      },
      {
        type: "line",
        name: colNames[1],
        showInLegend: true,
        legendIndex: 1,
        borderWidth: 0,
        color: Theme.color.red,
        data: data[2],
      },
    ],
  };
};

const LineChart = (props: { data; colNames; xNames; unit }) => {
  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={getOptions(
          props.data,
          props.colNames,
          props.xNames,
          props.unit
        )}
      />
    </div>
  );
};

export default LineChart;
