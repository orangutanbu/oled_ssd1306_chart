import { utils, wordlists } from 'ethers'
import { TFunction } from 'i18next'
import { MNEMONIC_LENGTH_MAX, MNEMONIC_LENGTH_MIN } from 'src/constants/accounts'
import { normalizeTextInput } from 'src/utils/string'

export enum MnemonicValidationError {
  InvalidWord = 'InvalidWord',
  NotEnoughWords = 'NotEnoughWords',
  TooManyWords = 'TooManyWords',
  InvalidPhrase = 'InvalidPhrase',
}

export function translateMnemonicErrorMessage(
  error: MnemonicValidationError,
  invalidWord: string | undefined,
  t: TFunction
): string {
  switch (error) {
    case MnemonicValidationError.InvalidPhrase:
      return t('Invalid phrase')
    case MnemonicValidationErr