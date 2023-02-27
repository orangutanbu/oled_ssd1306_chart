import * as haptics from 'expo-haptics'
import { invokeImpact } from 'src/utils/haptic'

const ImpactFeedbackStyle = haptics.ImpactFeedbackStyle
const mockedImpactAsync = jest.spyOn(haptics, 'impactAsync')

describe('impact', () => {
  it('triggers impactAsync', () => {
    const impactLight = invokeImpact[ImpactFeedbackStyle.Light]
    const impactMedium = invokeImpact[ImpactFeedbackStyle.Medium]
    const impactHeavy = invokeImpact[ImpactFeedbackStyle.Heavy]

    impactLight()
    impactMedium()
    impa