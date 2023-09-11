export type TooltipValue = {
  value: number
  name: string
  color: string
}

export type TooltipData = {
  active: boolean
  label: string
  values: TooltipValue[]
}
