import React, { useCallback, useState } from "react"
import { ResponsiveContainer, ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { aptSensorData, aptSensorArray, colorsArray } from './aptSensorData';
import moment from "moment-timezone"
import styles from "./AptSensorChart.module.css"
import { TooltipData, TooltipValue } from './types';

const sensors = Object.keys(aptSensorData).map((name, index) => {
  let type = 'line'
  if (name === 'dbtemp') {
    type = 'area'
  } else if (name === 'rr') {
    type = null
  }
  return { name, type, color: colorsArray[index % colorsArray.length - 1] }
})

function DateTick(props) {
  const { x, y, stroke, payload } = props
  // console.log(payload)
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {moment.unix(payload.value).format('h a')}
      </text>
    </g>
  );
}

function DataDetail({ tooltipData }: { tooltipData: TooltipData }) {
  // console.log('AptSensorDataTip', payload)
  if (tooltipData?.active) {
    return (
      <div className={`${styles.tooltip} ${styles.dataDetail}`}>
        <div className={styles.header}>{moment.unix(parseInt(tooltipData.label)).format('hh:mm')}</div>
        <div className={styles.values}>
          {tooltipData.values.map((entry: TooltipValue) =>
            <div key={entry.name} className={styles.valueEntry} style={{ color: entry.color }}>
              <span className={styles.name}>{entry.name}</span> <span>{entry.value}</span>
            </div>)}
        </div>
      </div>
    );

  }
  return null
}

function ChartTooltip(props: any) {
  const { active, payload, label, callback } = props
  if (callback) {
    const tooltipData: TooltipData = {
      active,
      label,
      values: payload
    }
    callback(tooltipData)
  }
  const dbTemp = payload.find(entry => entry.name === 'dbtemp')
  if (active && dbTemp)
    return (
      <div className={styles.tooltip}>
        <div className={styles.header}>{moment.unix(label).format('hh:mm')}</div>
        <div className={styles.values}>
          <div className={styles.valueEntry} style={{ color: dbTemp.color }}>
            <span className={styles.name}>Avg Temp</span> <span>{dbTemp.value}</span>
          </div>
        </div>
      </div>
    );
}

const Chart = React.memo(function InnerChart(props: any) {
  const { tooltipCallback } = props
  console.log('Rendering chart')
  return (
    // <div style={{ width: '100%', height: 300 }}>
    <>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer>
          <ComposedChart data={aptSensorArray} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            {sensors.map(sensor => {
              switch (sensor.type) {
                case "line":
                  return <Line key={sensor.name} type="monotone" dataKey={sensor.name} stroke={sensor.color}
                    animationDuration={500} dot={false} connectNulls={false} />
                case "area":
                  return <Area key={sensor.name} type="monotone" dataKey={sensor.name} stroke={sensor.color}
                    fillOpacity={1} fill="url(#colorPv)" animationDuration={500} />
                default:
                  return null
              }
            })}
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="ts" tick={<DateTick />} />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} orientation="right" mirror={true} ticks={[70, 80, 90, 100]} />
            {/* <YAxis domain={['dataMin - 10', 'dataMax + 10']} orientation="right" mirror={true} padding={{ top: 0, bottom: 20 }} /> */}
            <Tooltip
              // allowEscapeViewBox={{ x: false, y: true }}
              isAnimationActive={true}
              animationDuration={100}
              content={<ChartTooltip callback={tooltipCallback} />} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
})

export default function AptSensorChart() {
  const [tipData, setTipData] = useState(null)
  const onTooltipChange = useCallback(function tooltipCallback(payload) {
    setTipData(payload)
    // console.log('current tooltip payload:', payload)
  }, [])

  return (
    <div>
      <Chart tooltipCallback={onTooltipChange} />
      <DataDetail tooltipData={tipData} />
    </div >
  );
} 