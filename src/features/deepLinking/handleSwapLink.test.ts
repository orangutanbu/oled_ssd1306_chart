
import { URL } from 'react-native-url-polyfill'
import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import { ChainId } from 'src/constants/chains'
import { DAI, UNI } from 'src/constants/tokens'
import { AssetType } from 'src/entities/assets'
import { selectActiveChainIds } from 'src/features/chains/utils'
import { handleSwapLink, parseAndValidateSwapParams } from 'src/features/deepLinking/handleSwapLink'
import { openModal } from 'src/features/modals/modalSlice'
import { ModalName } from 'src/features/telemetry/constants'
import {
  CurrencyField,
  TransactionState,
} from 'src/features/transactions/transactionState/transactionState'
import { account } from 'src/test/fixtures'

const formSwapUrl = (
  userAddress?: Address,