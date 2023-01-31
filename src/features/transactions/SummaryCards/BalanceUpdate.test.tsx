import { MockedResponse } from '@apollo/client/testing'
import React from 'react'
import { ChainId } from 'src/constants/chains'
import { SpotPricesDocument, SpotPricesQuery } from 'src/data/__generated__/types-and-hooks'
import { currencyIdToContractInput } from 'src/features/dataApi/utils'
import { NativeCurrency } from 'src/features/tokens/NativeCurrency'
import BalanceUpdate from 'src/features/transactions/SummaryCards/BalanceUpdate'
import { TransactionStatus, TransactionType } from 'src/featu