/* eslint-disable react-native/no-inline-styles */
import React, { ComponentProps, useCallback, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutChangeEvent, NativeSyntheticEvent, TextLayoutEventData } from 'react-native'
import Markdown from