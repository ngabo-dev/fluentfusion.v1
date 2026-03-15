import React from 'react'

type Variant = 'n' | 'k' | 'w' | 'e' | 'i' | 'm'
interface Props { children: React.ReactNode; variant?: Variant }

export default function Badge({ children, variant = 'm' }: Props) {
  return <span className={`bdg b${variant}`}>{children}</span>
}
