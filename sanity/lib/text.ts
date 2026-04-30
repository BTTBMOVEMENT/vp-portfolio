export function portableTextToPlainText(blocks: any[] = []) {
  return blocks
    .filter((block) => block?._type === 'block' && Array.isArray(block.children))
    .map((block) =>
      block.children
        .map((child: any) => (typeof child?.text === 'string' ? child.text : ''))
        .join('')
    )
    .join('\n\n')
}

export function estimateReadTime(blocks: any[] = []) {
  const text = portableTextToPlainText(blocks)
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min`
}