import {
  ACTIVE_CHAINS,
  ALCHEMY_API_KEY,
  AMPLITUDE_API_URL,
  AMPLITUDE_EXPERIMENTS_DEPLOYMENT_KEY,
  DEBUG,
  DEMO_SEED_PHRASE,
  INFURA_PROJECT_ID,
  MOONPAY_API_KEY,
  MOONPAY_API_URL,
  MOONPAY_WIDGET_API_URL,
  ONESIGNAL_APP_ID,
  SENTRY_DSN,
  STATSIG_API_KEY,
  STATSIG_PROXY_URL,
  UNISWAP_API_BASE_URL,
  UNISWAP_API_KEY,
  UNISWAP_APP_URL,
  VERSION,
  WALLETCONNECT_PROJECT_ID,
} from 'react-native-dotenv'
import { ChainIdTo } from 'src/constants/chains'
import { ChainState } from 'src/features/chains/types'
import { chainListToStateMap } from 'src/features/chains/utils'
import { parseActiveChains } from 'src/utils/chainId'

export interface Config {
  activeChains: ChainIdTo<ChainState>
  alchemyApiKey: string
  amplitudeExperimentsDeploymentKey: string
  amplitudeApiUrl: string
  debug: boolean
  demoSeedPhrase: string
  moonpayApiKey: string
  moonpayApiUrl: string
  moonpayWidgetApiUrl: string
  uniswapApiBaseUrl: string
  unis