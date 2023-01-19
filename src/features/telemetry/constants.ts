/**
 * Event names that can occur in this application
 *
 * Subject to change as new features are added and new events are defined and logged.
 */
export enum MobileEventName {
  // keep these alphabetized or else you will go to JAIL!

  // some of these values are Title Cased to match shared repo event format:
  // https://github.com/Uniswap/analytics-events/blob/main/src/primitives.ts
  DeepLinkOpened = 'Deep Link Opened',
  ExploreFilterSelected = 'Explore Filter Selected',
  ExploreSearchResultClicked = 'Explore Search Result Clicked',
  ExploreSearchCancel = 'Explore Search Cancel',
  ExploreTokenItemSelected = 'Explore Token Item Selected',
  FavoriteItem = 'Favorite Item',
  // General fiat onramp events like in-app buttons and modals
  FiatOnRampBannerPressed = 'Fiat OnRamp Banner Pressed',
  FiatOnRampQuickActionButtonPressed = 'Fiat OnRamp QuickAction Button Pressed',
  FiatOnRampWidgetOpened = 'Fiat OnRamp Widget Opened',
  OnboardingCompleted = 'Onboarding Completed',
  PerformanceReport = 'Performance Report',
  PerformanceGraphql = 'Performance GraphQL',
  SwapSubmitted = 'Swap Submitted to Provider',
  TokenDetailsOtherChainButtonPressed = 'Token Details Other Chain Button Pressed',
  WalletAdded = 'Wallet Added',
  WalletConnectSheetCompleted = 'Wallet Connect Sheet Completed',
}

/**
 * Known sections to provide telemetry context.
 * Can help disambiguate low-level elements that may share a name.
 * For example, a `back` button in a modal will have the same
 * `elementName`, but a different `section`.
 */
export const enum SectionName {
  CurrencyInputPanel = 'currency-input-panel',
  CurrencyOutputPanel = 'currency-output-panel',
  ExploreFavoriteTokensSection = 'explore-favorite-tokens-section',
  ExploreSearch = 'explore-search',
  ExploreTopTokensSection = 'explore-top-tokens-section',
  HomeActivityTab = 'home-activity-tab',
  HomeNFTsTab = 'home-nfts-tab',
  HomeTokensTab = 'home-tokens-tab',
  ImportAccountForm = 'import-account-form',
  ProfileActivityTab = 'profile-activity-tab',
  ProfileNftsTab = 'profile-nfts-tab',
  ProfileTokensTab = 'profile-tokens-tab',
  Sidebar = 'sidebar',
  SwapForm = 'swap-form',
  SwapPending = 'swap-pending',
  SwapReview = 'swap-review',
  TransferForm = 'transfer-form',
  TransferPending = 'transfer-pending',
  TransferReview = 'transfer-review',
  // alphabetize additional values.
}

/** Known modals for telemetry purposes. */
export const enum ModalName {
  AccountEdit = 'account-edit-modal',
  AccountSwitcher = 'account-switcher-modal',
  AddWallet = 'add-wallet-modal',
  BlockedAddress = 'blocked-address',
  Experiments = 'experiments',
  Explore = 'explore-modal',
  FaceIDWarning = 'face-id-warning',
  FiatOnRamp = 'fiat-on-ramp',
  ForceUpgradeModal = 'force-upgrade-modal',
  ICloudBackupInfo = 'icloud-backup-info-modal',
  NetworkSelector = 'network-selector-modal',
  NftCollection = 'nft-collection',
  RecoveryWarning = 'recovery-warning',
  RemoveWallet = 'remove-wallet-modal',
  RemoveSeedPhraseWarningModal = 'remove-seed-phrase-warning-modal',
  ReimportUninstall = 'reimport-uninstall-modal',
  ScreenshotWarning = 'screenshot-warning',
  Send = 'send-modal',
  SendWarning = 'send-warning-modal',
  Swap = 'swap-modal',
  SwapWarning = 'swap-warning-modal',
  GasEstimateWarning = 'gas-estimate-warning-modal',
  TokenWarningModal = 'token-warning-modal',
  TooltipContent = 'tooltip-content',
  TransactionActions = 'transaction-actions',
  ViewSeedPhraseWarning = 'view-seed-phrase-warning',
  WalletConnectScan = 'wallet-connect-scan-modal',
  WCSignRequest = 'wc-sign-request-modal',
  WCSwitchChainRequest = 'wc-switch-chain-request-modal',
  WCViewOnlyWarning = 'wc-view-only-warning-modal',
  // alphabetize additional values.
}

/**
 * Known element names for telemetry purposes.
 * Use to identify low-level components given a TraceContext
 */

export const enum ElementName {
  AccountCard = 'account-card',
  AddManualBackup = 'add-manual-backup',
  AddViewOnlyWallet = 'add-view-only-wallet',
  AddiCloudBackup = 'add-icloud-backup',
  Back = 'back',
  Buy = 'buy',
  Cancel = 'cancel',
  Confirm = 'confirm',
  Continue = 'continue',
  Copy = 'copy',
  CreateAccount = 'create-account',
  Disconnect = 'disconnect',
  Edit = 'edit',
  Enable = 'enable',
  EtherscanView = 'etherscan-view',
  Favorite = 'favorite',
  FiatOnRampWidgetButton = 'fiat-on-ramp-widget-button',
  GetHelp = 'get-help',
  GetStarted = 'get-started',
  ImportAccount = 'import',
  