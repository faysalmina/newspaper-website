import { useRef, useEffect } from 'react'

const exec = (command, value = null) =>
  document.execCommand(command, false, value)

export default function RichTextEditor ({ value, onChange }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || ''
    }
  }, [value])

  const handleInput = () => onChange(ref.current.innerHTML)

  const Btn = ({ cmd, val, label }) => (
    <button
      type='button'
      onMouseDown={e => e.preventDefault()}
      onClick={() => {
        exec(cmd, val)
        handleInput()
      }}
      className='rounded px-2 py-1 text-sm hover:bg-gray-200'
    >
      {label}
    </button>
  )

  return (
    <div className='rounded border border-gray-300'>
      <div className='flex flex-wrap gap-1 border-b bg-gray-50 p-2'>
        <Btn cmd='bold' label={<b>B</b>} />
        <Btn cmd='italic' label={<i>I</i>} />
        <Btn cmd='underline' label={<u>U</u>} />
        <Btn cmd='insertUnorderedList' label='• List' />
        <Btn cmd='insertOrderedList' label='1. List' />
        <Btn cmd='formatBlock' val='H2' label='H2' />
        <Btn cmd='formatBlock' val='P' label='¶' />
        <button
          type='button'
          onMouseDown={e => e.preventDefault()}
          onClick={() => {
            const url = window.prompt('লিংক দিন:')
            if (url) exec('createLink', url)
            handleInput()
          }}
          className='rounded px-2 py-1 text-sm hover:bg-gray-200'
        >
          🔗 Link
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        className='min-h-[250px] p-3 focus:outline-none'
      />
    </div>
  )
}
