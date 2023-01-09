import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { selectFavoriteTokensSet, selectWatchedAddressSet } from 'src/features/favorites/selectors'
import {
  addFavoriteToken,
  addWatchedAddress,
  removeFavoriteToken,
  removeWatchedAddress,
} from 'src/features/favorites/slice'
import { sendAnalyticsEvent } from 'src/features/telemetry'
import { MobileEventName } from 'src/features/telemetry/constants'
import { useCurrencyInfo } from 'src/features/tokens/useCurrencyInfo'
import { useDisplayName } from 'src/features/wallet/hooks'
import { CurrencyId, currencyIdToAddress, currencyIdToChain } from 'src/utils/currencyId'

export function useToggleFavoriteCallback(id: CurrencyId): () => void {
  const dispatch = useAppDispatch()
  const isFavoriteToken = useAppSelector(selectFavoriteTokensSet).has(id)
  const token = useCurrencyInfo(id)

  return useCallback(() => {
    if (isFavoriteToken) {
      dispatch(removeFavoriteToken({ currencyId: id }))
    } else {
      sendAnalyticsEvent(MobileEventName.FavoriteItem, {
        address: currencyIdToAddress(id),
        chain: currencyIdToChain(id) as number,
        type: 'token',
        name: token?.currency.name,
      })
      dispatch(addFavoriteToken({ currencyId: id }))
    }
  }, [dispatch, id, i