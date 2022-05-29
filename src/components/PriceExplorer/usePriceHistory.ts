import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { SharedValue } from 'react-native-reanimated'
import { TLineChartData } from 'react-native-wagmi-charts'
import { PollingInterval } from 'src/constants/misc'
import { isError, isNonPollingRequestInFlight } from 'src/data/utils'
import {
  HistoryDuration,
  TimestampedAmount,
  useTokenPriceHistoryQuery,
} from 'src/data/__generated__/types-and-hooks'
import { GqlResult } from 'src/features/dataApi/types'
import { currencyIdToContractInput } from 'src/features/dataApi/utils'

/**
 * @returns Token price history for requested duration
 */
export function useTokenPriceHistory(
  currencyId: string,
  initialDuration: HistoryDuration = HistoryDuration.Day
): Omit<
  GqlResult<{
    priceHistory?: TLineChartData
    spot?: {
      value: SharedValue<number>
      relativeChange: SharedValue<number>
    }
  }>,
  'error'
> & {
  setDuration: Dispatch<SetStateAction<HistoryDuration>>
  error: boolean
} {
  const [duration, setDuration] = useState(initialDuration)

  const {
    data: priceData,
    refetch,
    networkStatus,
  } = useTokenPriceHistoryQuery({
    variables: {
      contract: currencyIdToContractInput(currencyId),
      duration,
    },
    notifyOnNetworkStatusChange: true,
    pollInterval: PollingInterval.Normal,
    fetchPolicy: 'cache-first',
  })

  const { price, pricePercentChange24h, priceHistory } =
    priceData?.tokenProjects?.[0]?.mar