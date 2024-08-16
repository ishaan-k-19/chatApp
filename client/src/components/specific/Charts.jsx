import React from 'react'
import { Doughnut, Line } from 'react-chartjs-2'
import {ArcElement, CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip} from 'chart.js'
import { getLast7Days } from '@/lib/features'

ChartJS.register(
    CategoryScale,
    Tooltip,
    LinearScale,
    LineElement,
    PointElement,
    Filler,
    ArcElement,
    Legend
)


const labels = getLast7Days ();

const lineChartOptions = {
    responsive: true,
    plugins:{
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },

    scales: {
        x:{
            grid: {
                display: false,
            }
        },
        y:{
            beginAtZero: true,
            grid: {
                display: false,
            }
        },
    }
}

const doughnutChartOptions = {
    responsive: true,
    plugins:{
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    cutout: 80,
}

const LineChart = ({value =[]}) => {
    const data = {
        labels,
        datasets: [{
            label: 'Messages',
            data: value,
            backgroundColor: "rgba(75,12,192, 0.2)",
            fill : true,
            borderColor: "rgba(75,12,192,1)",
        }]
    }
  return (
    <Line data={data} options={lineChartOptions}/>
  )
}
const DoughnutChart = ({value=[], labels =[]}) => {
    const data ={
        labels,
        datasets: [{
            data: value,
            backgroundColor: ["rgba(75,12,192, 0.4)", "rgba(234,112,112, 0.7)" ],
            fill : true,
            borderColor: ["rgba(75,12,192)", "rgba(234,112,112)"],
            offset: 40,
        }]
    }
  return (
    <Doughnut className='z-10' data={data} options={doughnutChartOptions}/>
  )
}

export {LineChart, DoughnutChart}