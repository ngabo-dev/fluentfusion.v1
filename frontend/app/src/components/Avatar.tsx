import React from 'react'

interface Props { initials: string; size?: 's' | 'm' | 'l'; style?: React.CSSProperties }

export default function Avatar({ initials, size = 's', style }: Props) {
  const cls = size === 'l' ? 'av avl' : size === 'm' ? 'av avm' : 'av avs'
  return <div className={cls} style={style}>{initials}</div>
}
