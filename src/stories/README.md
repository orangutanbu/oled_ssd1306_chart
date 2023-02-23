# Storybook

[Storybook](https://storybook.js.org/) helps build UI components in isolation. Testing and component documentation are built into the development workflow, leading to better tested and better documented component libraries.

## Useful resources

- [Official Getting Started](https://storybook.js.org/docs/react/get-started/introduction) by Storybook
- Our [Chromatic app](https://www.chromatic.com/builds?appId=61d89aa649fc7d003ae21c76)
- Our published [Storybook app](https://61d89aa649fc7d003ae21c76-gyrkwmtvsx.chromatic.com/)

## What components should have stories?

Literally any component can have a story, either for visual testing or documentation. I (judo) recommend we treat Storybook as a component library for now—that is, low-level presentational components that have high reusability and minimal dependencies (think spacing components, buttons, pills, etc.)

### Heuristic

If you expect your component to be imported by more than 3 other components, consider writing a story to document it (and get visual testing for free!)

### Recommendation

- Presentational components with short dependency list