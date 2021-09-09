import { useAppSelector } from 'src/app/hooks'
import { ModalsState, selectModalState } from 'src/features/modals/modalSlice'

/**
 * Delays evaluating `children` until modal is open
 * @param modalName name of the modal for which to track open state
 * @param W