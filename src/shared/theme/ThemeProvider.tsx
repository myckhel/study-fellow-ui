import type { ReactNode } from 'react'
import { App as AntdApp, ConfigProvider } from 'antd'
import { MotionConfig, useReducedMotion } from 'motion/react'
import { createObservatoryTheme } from './observatory'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  return (
    <ConfigProvider theme={createObservatoryTheme(Boolean(reducedMotion))}>
      <AntdApp>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </AntdApp>
    </ConfigProvider>
  )
}
