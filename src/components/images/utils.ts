import { logger } from 'src/utils/logger'

const VIEWBOX_REGEX = /viewBox=["']\d+ \d+ (\d+) (\d+)["']/
const FALLBACK_ASPECT_RATIO = 1
// TODO: [MOB-3868] return a nicer SVG asset with an error message
const INVALID_SVG = { content: 'Invalid SVG', aspectRatio: FALLBACK_A