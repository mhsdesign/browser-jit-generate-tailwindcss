import { createTailwindcss } from '../../../dist/module.esm'

test('getClassOrder', async () => {
  const tailwind = createTailwindcss({
    tailwindConfig: {
      corePlugins: { preflight: false },
    },
  })

  const cases = [
    {
      input: 'px-3 b-class p-1 py-3 bg-blue-500 a-class bg-red-500',
      output: 'b-class a-class bg-blue-500 bg-red-500 p-1 px-3 py-3',
    },
    {
      input: 'a-class px-3 p-1 b-class py-3 bg-red-500 bg-blue-500',
      output: 'a-class b-class bg-blue-500 bg-red-500 p-1 px-3 py-3',
    },
    {
      input: 'left-5 left-1',
      output: 'left-1 left-5',
    },
    {
      input: 'left-3 inset-x-10',
      output: 'inset-x-10 left-3',
    },
    {
      input: 'left-3 inset-x-2 bg-red-500 bg-blue-500',
      output: 'inset-x-2 left-3 bg-blue-500 bg-red-500',
    },
  ]

  for (const { input, output } of cases) {
    expect(tailwind.getClassOrder(input.split(' '))).toEqual(output.split(' '))
  }
})
