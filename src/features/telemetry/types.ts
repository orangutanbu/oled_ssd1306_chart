import { RenderPassReport } from '@shopify/react-native-performance'
import { MoonpayEventName, SharedEventName, SwapEventName } from '@uniswap/analytics-events'
import { TraceProps } from 'src/components/telemetry/Trace'
import { TraceEventProps } from 'src/components/telemetry/TraceEvent'
import { ImportType } from 'src/features/onboarding/utils'
import { MobileEventName } from 'src/features/telemetry/constants'
import { EthMethod, WCEventType, WCRequestOutcome } from 'src/features/walletConnect/types'

type BaseEventProperty = Partial<TraceEventProps & TraceProps> | undefined

export type SwapTradeBaseProperties = {
  allowed_slippage_basis_points?: number
  token_in_symbol?: string
  token_out_symbol?: string
  token_in_address: string
  token_out_address: string
  price_impact_basis_points?: string
  estimated_network_fee_usd?: number
  chain_id: number
  token_in_amount: string
  token_out_amount: string
} & BaseEventProperty

// Events related to Moonpay internal transactions
// NOTE: we do not currently have access to the full life cycle of these txs
// because we do not yet use Moonpay's webhook
export type MoonpayTransactionEventProperties = BaseEventProperty &
  // allow any object of strings for now
  Record<string, string>

export type EventProperties = {
  [MobileEventName.DeepLinkOpened]: {
    url: string
    screen: 'swap' | 'transaction'
    is_cold_start: boolean
  }
  [MobileEventName.ExploreFilterSelected]: {
    filter_type: string
  }
  [MobileEventName