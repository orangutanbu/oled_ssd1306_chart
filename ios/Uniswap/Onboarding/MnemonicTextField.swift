//
//  MnemonicTextField.swift
//  Uniswap
//
//  Created by Thomas Thachil on 8/8/22.
//

import SwiftUI

enum InputFocusState {
  case notFocused
  case focusedNoInput
  case focusedWrongInput
  case notFocusedWrongInput
}

struct MnemonicTextField: View {
  
  @Environment(\.colorScheme) var colorScheme

  let smallFont = UIFont(name: "Inter-Regular", size: 14)
  let mediumFont = UIFont(name: "Inter-Regular", size: 16)
  
  var index: Int
  var initialText = ""
  var shouldShowSmallText: Bool
  var onFieldTapped: ((Int) -> Void)?
  var focusState: InputFocusState = InputFocusState.notFocused
  
  
  init(index: Int,
       initialText: String,
       shouldShowSmallText: Bool,
       focusState: InputFocusState,
       onFieldTapped: @escaping (Int) -> Void
  ) {
    self.index = index
    self.initialText = initialText
    self.shouldShowSmallText = shouldShowSmallText
    self.focusState = focusState
    self.onFieldTapped = onFieldTapped
  }
  
  func getLabelBackground(focusState: InputFocusState) -> some View {
    switch (focusState) {
    case .focusedNoInput:
      return AnyView(RoundedRectangle(cornerRadius: 100)
        .strokeBorder(Colors.accentActive, lineWidth: 2)
        .background(Colors.background3)
        .cornerRadius(100)
      )
      
    case .focusedWrongInput:
      return AnyView(RoundedRectangle(cornerRadius: 100)
        .strokeBorder(Colors.accentCritical, lineWidth: 2)
        .background(Colors.background3)
        .cornerRadius(100)
      )
      
    case .notFocusedWrongInput:
      return AnyView(RoundedRectangle(cornerRadius: 100)
        .strokeBorder(Colors.accentCritical, lineWidth: 2)
        .background(Colors.background1)
        .cornerRadius(100)
      )
      
    case .notFocused:
      return AnyView(
        RoundedRectangle(cornerRadius: 100, style: .continuous)
          .fill(Colors.backgr