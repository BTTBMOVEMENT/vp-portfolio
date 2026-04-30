import {PortableText} from '@portabletext/react'

type PortableTextContentProps = {
  value: any
  compact?: boolean
}

export default function PortableTextContent({
  value,
  compact = false,
}: PortableTextContentProps) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null
  }

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <PortableText
        value={value}
        components={{
          block: {
            normal: ({children}) => (
              <p className="text-sm leading-8 text-zinc-300 sm:text-base">{children}</p>
            ),
            h2: ({children}) => (
              <h2 className="text-3xl font-semibold leading-tight text-zinc-100 sm:text-4xl">
                {children}
              </h2>
            ),
            h3: ({children}) => (
              <h3 className="text-2xl font-semibold leading-tight text-zinc-100">
                {children}
              </h3>
            ),
            blockquote: ({children}) => (
              <blockquote className="border-l border-white/20 pl-5 text-xl leading-8 text-zinc-200">
                {children}
              </blockquote>
            ),
          },
          types: {
            image: ({value}) =>
              value?.asset?.url ? (
                <img
                  src={value.asset.url}
                  alt=""
                  className="h-auto w-full rounded-[1.5rem] border border-white/10"
                />
              ) : null,
          },
        }}
      />
    </div>
  )
}