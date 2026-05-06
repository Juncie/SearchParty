import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

// Text variants for h1-h6 headings and body text
const textVariants = cva('', {
  variants: {
    variant: {
      heading: 'text-4xl font-bold',
      body: 'text-base font-medium',
      label: 'text-sm font-medium',
      small: 'text-xs font-medium',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})
