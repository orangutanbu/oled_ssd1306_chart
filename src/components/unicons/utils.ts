import { isAddress } from 'ethers/lib/utils'
import { useAppTheme } from 'src/app/hooks'
import { svgPaths as containerPaths } from 'src/components/unicons/Container'
import { svgPaths as emblemPaths } from 'src/components/unicons/Emblem'
import {
  blurs,
  gradientEnds,
  gradientStarts,
  UniconAttributeData,
  UniconAttributes,
  UniconAttributesArray,
  UniconAttributesToIndices,
  UniconNumOptions,
} from 'src/components/unicons/types'

const NUM_CHARS_TO_USE_PER_ATTRIBUTE = 2

export const isEthAddress = (address: string): boolean => {
  return address.startsWith('0x') && isAddress(address.toLowerCase())
}

export const deriveUniconAttributeIndices = (
  address: string,
  randomSeed = 0
): UniconAttributesToIndices | undefined => {
  if (!isEthAddress(address)) return

  const hexAddr = address.slice(-40)
  const newIndices = {
    [UniconAttributes.GradientStart]: 0,
    [UniconAttributes.GradientEnd]: 0,
    [UniconAttributes.Container]: 0,
    [UniconAttributes.Shape]: 0,
  } as Un