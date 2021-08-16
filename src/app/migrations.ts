// Type information currently gets lost after a migration
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dayjs from 'dayjs'
import { ChainId } from 'src/constants/chains'
import { ChainsState } from 'src/features/chains/chainsSlice'
import { ensApi } from 'src/features/ens/api'
import { ModalName } from 'src/features/telemetry/constants'
import 