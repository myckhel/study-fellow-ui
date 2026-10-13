import type { ThemeConfig } from 'antd'

/** Read Tailwind's canonical CSS tokens after index.css has loaded. */
export function createObservatoryTheme(reducedMotion: boolean): ThemeConfig {
  const styles = getComputedStyle(document.documentElement)
  const token = (name: string) => styles.getPropertyValue(`--${name}`).trim()

  return {
    token: {
      colorPrimary: token('color-starlight'),
      colorPrimaryHover: token('color-starlight-hover'),
      colorPrimaryActive: token('color-starlight-active'),
      colorPrimaryBg: token('color-accent-soft'),
      colorPrimaryText: token('color-accent-ink'),
      colorInfo: token('color-focus'),
      colorSuccess: token('color-success'),
      colorWarning: token('color-warning'),
      colorError: token('color-danger'),
      colorText: token('color-ink'),
      colorTextSecondary: token('color-muted'),
      colorBgBase: token('color-surface'),
      colorBgContainer: token('color-surface'),
      colorBgLayout: token('color-ivory'),
      colorBorder: token('color-line'),
      colorBorderSecondary: token('color-line'),
      colorLink: token('color-focus'),
      colorLinkHover: token('color-midnight'),
      colorLinkActive: token('color-midnight'),
      fontFamily: token('font-sans'),
      fontSize: 16,
      lineHeight: 1.6,
      borderRadius: 12,
      borderRadiusLG: 24,
      controlHeight: 44,
      controlHeightLG: 48,
      controlOutline: token('color-focus'),
      controlOutlineWidth: 2,
      boxShadow: token('shadow-observatory'),
      motion: !reducedMotion,
    },
    components: {
      Button: {
        primaryColor: token('color-midnight'),
        primaryShadow: 'none',
        defaultShadow: 'none',
        borderRadius: 999,
        borderRadiusLG: 999,
        fontWeight: 600,
        defaultHoverColor: token('color-midnight'),
        defaultHoverBorderColor: token('color-focus'),
        defaultActiveColor: token('color-midnight'),
        defaultActiveBorderColor: token('color-focus'),
      },
      Typography: { titleMarginTop: 0, titleMarginBottom: 16 },
      Card: { borderRadiusLG: 24, boxShadowTertiary: token('shadow-observatory') },
      Input: {
        activeBorderColor: token('color-focus'),
        hoverBorderColor: token('color-focus'),
        activeShadow: `0 0 0 2px ${token('color-orbit-soft')}`,
        paddingBlock: 12,
        paddingInline: 16,
      },
      Tag: {
        defaultBg: token('color-orbit-soft'),
        defaultColor: token('color-focus'),
        borderRadiusSM: 999,
      },
      Progress: { defaultColor: token('color-focus'), remainingColor: token('color-line') },
    },
  }
}
