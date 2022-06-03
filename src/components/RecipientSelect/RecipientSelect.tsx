import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard } from 'react-native'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import { useAppTheme } from 'src/app/hooks'
import ScanQRIcon from 'src/assets/icons/scan.svg'
import { TouchableArea } from 'src/components/buttons/TouchableArea'
import { AnimatedFlex, Flex } from 'src/components/layout'
import { filterRecipientByNameAndAddress } from 'src/components/RecipientSelect/filter'
import { useRecipients } from 'src/components/RecipientSelect/hooks'
import { RecipientList, RecipientLoadingRow } from 'src/components/RecipientSelect/RecipientList'
import { RecipientScanModal } from 'src/components/RecipientSelect/RecipientScanModal'
import { filterSections } from 'src/components/RecipientSelect/utils'
import { Text } from 'src/components/Text'
import { SearchBar } from 'src/components/TokenSelector/SearchBar'
import { ElementName } from 'src/features/telemetry/constants'

interface RecipientSelectProps {
  onSelectRecipient: (newRecipientAddress: string) => void
  onToggleShowRecipientSelector: () => void
  recipient?: string
}

function QRScannerIconButton({ onPress }: { onPress: () => void }): JSX.Element {
  const theme = useAppTheme()

  return (
    <TouchableArea hapticFeedback name={ElementName.SelectRecipient} onPress={onPress}>
      <ScanQRIcon
        color={theme.colors.textSecondary}
        height={theme.iconSizes.icon20}
        width={theme.iconSizes.icon20}
      />
    </TouchableArea>
  )
}

export function _RecipientSelect({
  onSelectRecipient,
  onToggleShowRecipientSelector,
  recipient,
}: RecipientSelectProps): JSX.Element {
  const { t } = useTranslation()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const { sections, searchableRecipientOptions, pattern, onChangePattern, loading } =
    useRecipients()

  const filteredSections = useMemo(() => {
    const filteredAddresses = filterRecipientByNameAndAddress(
      pattern,
      searchableRecipientOptions
    ).map((item) => item.data.address)
    return filterSections(sections, filteredAddresses)
  }, [pattern, searchableRecipientOptions, sections])

  const onPressQRScanner = useCallback(() => {
    Keyboard.dismiss()
    setShowQRScan