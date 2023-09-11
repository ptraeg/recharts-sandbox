
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import styles from "./SampleChartTooltip.module.css"
import moment from "moment-timezone"
import { TooltipData, TooltipValue } from './types';

type TooltipPayload = {
  value: number
  name: string
  color: string
}

type TooltipProps = {
  active: boolean
  payload: TooltipPayload[]
  label: string
}

export default function SampleChartTooltip(props: any) {
  const { active, payload, label, callback } = props
  if (callback) {
    const tooltipData: TooltipData = {
      active,
      label,
      values: payload
    }
    callback(tooltipData)
  }
  // console.log(payload)
  if (active && payload?.length)
    return (
      <div className={styles.tooltip}>
        <div className={styles.header}>{moment.unix(label).format('hh:mm')}</div>
        <div className={styles.values}>
          {payload.map((entry: TooltipPayload) =>
            <div className={styles.valueEntry} style={{ color: entry.color }}>
              <span className={styles.name}>{entry.name}</span> <span>{entry.value}</span>
            </div>)}
        </div>
      </div>
    );
} 