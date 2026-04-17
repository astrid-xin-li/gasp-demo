/**
 * Genie brand logo SVG letters
 * Two variants: black (for light backgrounds) and white (for dark backgrounds)
 * Letters: G, E-1 (green accent), N, I, E-2 (red accent)
 */

type LogoVariant = 'black' | 'white'

type GenieLetterProps = {
  variant?: LogoVariant
  height?: number
  className?: string
  style?: React.CSSProperties
}

const fill = (v: LogoVariant) => (v === 'black' ? 'black' : 'white')

export function GenieG({ variant = 'black', height = 69, style, ...rest }: GenieLetterProps) {
  const scale = height / 73
  return (
    <svg width={72 * scale} height={73 * scale} viewBox="0 0 72 73" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} {...rest}>
      <path d="M36.5009 32.1317H71.9095C71.9095 35.7727 71.7578 39.0799 71.4543 42.0534C71.1509 45.0269 70.5441 47.7879 69.6339 50.3366C68.3595 53.9169 66.63 57.1028 64.4454 59.8942C62.2609 62.625 59.6818 64.9309 56.7084 66.8121C53.7956 68.6326 50.5794 70.0283 47.0597 70.9992C43.5401 71.9702 39.8385 72.4556 35.9547 72.4556C30.6146 72.4556 25.7296 71.5757 21.2998 69.8159C16.9306 68.0561 13.1682 65.5984 10.0127 62.4429C6.85719 59.2267 4.39952 55.4037 2.63971 50.9738C0.879905 46.4832 0 41.5376 0 36.1368C0 30.7967 0.849563 25.9117 2.54869 21.4818C4.3085 16.9913 6.76617 13.1682 9.92169 10.0127C13.1379 6.85719 16.9913 4.39953 21.4818 2.63971C25.9724 0.879904 30.9787 0 36.5009 0C43.6615 0 49.9422 1.54742 55.343 4.64226C60.7438 7.73709 65.0219 12.5311 68.1775 19.0241L51.2469 26.033C49.6691 22.2707 47.6059 19.5703 45.0572 17.9319C42.5692 16.2934 39.7171 15.4742 36.5009 15.4742C33.8308 15.4742 31.4035 15.99 29.2189 17.0216C27.0343 17.9925 25.1531 19.4186 23.5754 21.2998C22.0583 23.1203 20.8446 25.3352 19.9344 27.9446C19.0848 30.5539 18.66 33.4667 18.66 36.6829C18.66 39.5957 19.0241 42.2961 19.7523 44.7841C20.5412 47.2721 21.6942 49.4264 23.2113 51.2469C24.7284 53.0674 26.6095 54.4934 28.8548 55.525C31.1001 56.496 33.7095 56.9814 36.6829 56.9814C38.4427 56.9814 40.1419 56.7994 41.7803 56.4353C43.4188 56.0105 44.8751 55.3733 46.1495 54.5238C47.4845 53.6135 48.5768 52.4605 49.4264 51.0648C50.2759 49.6691 50.8524 47.97 51.1558 45.9674H36.5009V32.1317Z" fill={fill(variant)} />
    </svg>
  )
}

export function GenieE1({ variant = 'black', height = 69, style, ...rest }: GenieLetterProps) {
  const scale = height / 69
  return (
    <svg width={58 * scale} height={69 * scale} viewBox="0 0 58 69" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} {...rest}>
      <path d="M38.5258 15.0714H17.6015V26.5111L17.6015 41.5824V53.3853H38.5258L38.5258 68.4566H0L0 6.10352e-05L38.5258 6.10352e-05V15.0714Z" fill={fill(variant)} />
      <path d="M38.3699 25.7164H57.9534V40.2983H38.3699V25.7164Z" fill="#1DDB8B" />
    </svg>
  )
}

export function GenieN({ variant = 'black', height = 69, style, ...rest }: GenieLetterProps) {
  const scale = height / 69
  return (
    <svg width={69 * scale} height={69 * scale} viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} {...rest}>
      <path d="M0 68.6326V0H17.8408L50.7917 41.9624V0H68.5415V68.6326H50.7917L17.8408 26.6702V68.6326H0Z" fill={fill(variant)} />
    </svg>
  )
}

export function GenieI({ variant = 'black', height = 69, style, ...rest }: GenieLetterProps) {
  const scale = height / 69
  return (
    <svg width={18 * scale} height={69 * scale} viewBox="0 0 18 69" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} {...rest}>
      <path d="M17.8408 0V68.6326H0V0H17.8408Z" fill={fill(variant)} />
    </svg>
  )
}

export function GenieE2({ variant = 'black', height = 69, style, ...rest }: GenieLetterProps) {
  const scale = height / 69
  return (
    <svg width={58 * scale} height={69 * scale} viewBox="0 0 58 69" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} {...rest}>
      <path d="M38.5258 15.0714H17.6016V26.5111L17.6016 41.5824V53.3853H38.5258L38.5258 68.4566H6.10352e-05L6.10352e-05 6.10352e-05L38.5258 6.10352e-05V15.0714Z" fill={fill(variant)} />
      <path d="M38.3699 25.7164H57.9533V40.2983H38.3699V25.7164Z" fill="#FF434D" />
    </svg>
  )
}

/** Full "GENIE" logo as a row of SVG letters */
type GenieLogoProps = {
  variant?: LogoVariant
  height?: number
  gap?: number
  style?: React.CSSProperties
  className?: string
}

export function GenieLogo({ variant = 'black', height = 69, gap = 6, style, className }: GenieLogoProps) {
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'flex-end', gap, ...style }}>
      <GenieG variant={variant} height={height} />
      <GenieE1 variant={variant} height={height} />
      <GenieN variant={variant} height={height} />
      <GenieI variant={variant} height={height} />
      <GenieE2 variant={variant} height={height} />
    </div>
  )
}

/** Just the "ENIE" part (for Breathe page where G is separate) */
export function GenieEnie({ variant = 'black', height = 69, gap = 6, style, className }: GenieLogoProps) {
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'flex-end', gap, ...style }}>
      <GenieE1 variant={variant} height={height} />
      <GenieN variant={variant} height={height} />
      <GenieI variant={variant} height={height} />
      <GenieE2 variant={variant} height={height} />
    </div>
  )
}
