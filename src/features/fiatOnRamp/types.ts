export type FiatOnRampWidgetUrlQueryParameters = {
  colorCode: string
  externalTransactionId: string
}

export type FiatOnRampWidgetUrlQueryResponse = { url: string }

/** @ref https://dashboard.moonpay.com/api_reference/client_side_api#ip_addresses */
export type MoonpayIPAddressesResponse = {
  alpha3?: string
  isAllowed?: boolean
  isBuyAllowed?: boolean
  isSellAllowed?: boolean
}

/** @ref https://dashboard.moonpay.com/api_reference/client_side_api#currencies */
export type MoonpayCurrency = {
  id: string
  type: 'crypto' | 'fiat'
  name?: string
  code: string
  metadata?: {
    contractAddress: string
    chainId: string
  }
}

/** @ref https://dashboard.moonpay.com/api_reference/client_side_api#transactions */
type MoonpayQuote = {
  // A positive integer representing how much the customer wants to spend. The minimum amount is 20.
  baseCurrencyAmount: number
  // A positive integer representing the amount of cryptocurrency the customer will receive. Set when the purchase of cryptocurrency has been executed.
  quoteCurrencyAmount: number
  quoteCurrencyPrice: number
  // A positive integer representing the fee for the transaction. It is added to baseCurrencyAmount, extraFeeAmount and networkFeeAmount when the customer's card is charged.
  feeAmount: number
  // A positive integer representing your extra fee for the transaction. It is added to baseCurrencyAmount and feeAmount when the customer's card is charged.
  extraFeeAmount: number
  // A positive integer representing the network fee for the transaction. It is added to baseCurrencyAmount, feeAmount and extraFeeAmount when the customer's card is charged.
  networkFeeAmount: number
  // A boolean indicating whether baseCurrencyAmount includes or 