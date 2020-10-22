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
  // A boolean indicating whether baseCurrencyAmount includes or excludes the feeAmount, extraFeeAmount and networkFeeAmount.
  areFeesIncluded: boolean
}

/**
 * Transaction objects represent cryptocurrency purchases by your end users.
 * @ref https://dashboard.moonpay.com/api_reference/client_side_api#transactions
 */
export type MoonpayTransactionsResponse = Array<
  MoonpayQuote & {
    // Unique identifier for the object.
    id: string
    // Time at which the object was created. Returned as an ISO 8601 string.
    createdAt: string
    // Time at which the object was last updated. Returned as an ISO 8601 string.
    updatedAt: string
    baseCurrency: MoonpayCurrency
    currency: MoonpayCurrency
    // The transaction's status.
    status: 'waitingPayment' | 'pending' | 'waitingAuthorization' | 'failed' | 'completed'
    // The transaction's failure reason. Set when transaction's status is failed.
    failureReason: string
    // The cryptocurrency wallet address the purchased funds will be sent to.
    walletAddress: string
    // The secondary cryptocurrency wallet address identifier for coins such as EOS, XRP and XMR.
    walletAddressTag: string
    // The cryptocurrency transaction identifier representing the transfer to the customer's wallet. Set when the withdrawal has been executed.
    cryptoTransactionId: string
    // The URL provided to you, when required, to which to redirect the customer as part of a redirect authentication flow.
    redirectUrl: string
    // The URL the customer is returned to after they authenticate or cancel their payment on the payment method’s app or site. If you are using our widget implementation, this is always our transaction tracker page, which provides the customer with real-time information about their transaction.
    returnUrl: string
    // The cryptocurrency transaction identifier representing the transfer from the customer's wallet to MoonPay's wallet. Set when the deposit has been executed and received.
    depositHash: string
    // An optional URL used in a widget implementation. It is passed to us by you in the query parameters, and we include it as a link on the transaction tracker page.
    widgetRedirectUrl: string
    // The exchange rate between the transaction's base currency and Euro at the time of the transaction.
    eurRate: number
    // The exchange rate between the transaction's base currency and US Dollar at the time of the transaction.
    usdRate: number
    // The exchange rate between the transaction's base currency and British Pound at the time of the transaction.
    gbpRate: number
    // For bank transfer transactions, the information about our bank account to which the customer should make the transfer.
    bankDepositInformation: object
    // For bank transfer transactions, the reference code the customer should cite when making the transfer.
    bankTransferReference: string
    // The identifier of the cryptocurrency the customer wants to purchase.
    currencyId: string
    // The identifier of the fiat currency the customer wants to use for the transaction.
    baseCurrencyId: string
    // The identifier of the customer the transaction is associated with.
    customerId: string
    // For token or card transactions, the identifier of the payment card used for this transaction.
    cardId: string
    // For bank transfer transactions, the identifier of the bank account used for this transaction.
    bankAccountId: string
    // An identifier associated with the customer, provided by you.
    externalCustomerId: string
    // The transaction's payment method. Possible values are