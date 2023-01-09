import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/app/rootReducer'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const selectExperimentsState = (state: RootState) => state.experiments

export const selectExperimentOverrides = createSelector(
  selectExperimentsState,
  (experimentState) => {
    return experimentState.experiments
  }
)

export const selectFeatureFlagOverrides = createSelector(
  selectExperimentsState,
  (experimentState) => {
    return experimentState.featureFlags
  }
)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export 