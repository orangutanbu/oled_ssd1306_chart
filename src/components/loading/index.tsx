import React, { memo, useMemo } from 'react'
import { Box as BoxComponent, Flex } from 'src/components/layout'
import { BoxLoader, BoxLoaderProps } from 'src/components/loading/BoxLoader'
import { NftCardLoader } from 'src/components/loading/NftCardLoader'
import { Shimmer } from 'src/components/loading/Shimmer'
import { TokenLoader } from 'src/components/loading/TokenLoader'
import { TransactionLoader } from 'src/components/loading/TransactionLoader'
import { WalletLoader } from 'src/components/loading/WalletLoader'
import { WaveLoader } from 'src/components/loading/WaveLoader'

function Graph(): JSX.Element {
  return (
    <Shimmer>
      <WaveLoader />
    </Shimmer>
  )
}

function Wallets({ repeat = 1 }: { repeat?: number }): JSX.Element {
  return (
    <Shimmer>
      <Flex gap="spacing12">
        {new Array(repeat).fill(null).map((_, i, { length }) => (
          <React.Fragment key={i}>
            <WalletLoader opacity={(length - i) / length} />
          </React.Fragment>
        ))}
      </Flex>
    </Shimmer>
  )
}

function Token({ repeat = 1 }: { repeat?: number }): JSX.Element {
  return (
    <Shimmer>
      <Flex grow gap="spacing4">
        {new Array(repeat).fill(null).map((_, i, { length }) => (
          <React.Fragment key={i}>
  