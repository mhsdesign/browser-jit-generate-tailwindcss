import postcss from 'postcss';
import processTailwindFeatures from 'tailwindcss/src/processTailwindFeatures.js';
// @ts-ignore
import { createContext } from 'tailwindcss/src/lib/setupContextUtils.js'
import resolveConfig from 'tailwindcss/src/public/resolve-config.js';

export function bigSign(bigIntValue: bigint) {
  return Number(bigIntValue > 0n) - Number(bigIntValue < 0n)
}

function defaultSort(arrayOfTuples: [string, bigint | null][]) {
  return arrayOfTuples
    .sort(([, a], [, z]) => {
      if (a === z) return 0
      if (a === null) return -1
      if (z === null) return 1
      return bigSign(a - z)
    })
    .map(([className]) => className)
}

export const createTailwindcss: typeof import('..').createTailwindcss = (
  { tailwindConfig } = {},
) => {

  let currentTailwindConfig = tailwindConfig;

  return {
    setTailwindConfig(newTailwindConfig) {
      currentTailwindConfig = newTailwindConfig;
    },

    async generateStylesFromContent(css, content) {
      const tailwindcssPlugin = createTailwindcssPlugin({ tailwindConfig: currentTailwindConfig, content });
      const processor = postcss([tailwindcssPlugin]);
      const result = await processor.process(css, { from: undefined });
      return result.css;
    },

    getClassOrder: (classList: string[]) => {
      const context = createContext(resolveConfig(tailwindConfig ?? {}))
      return defaultSort(context.getClassOrder(classList))
    },
  }
}

export const createTailwindcssPlugin: typeof import('..').createTailwindcssPlugin = ({ tailwindConfig, content: contentCollection }) => {
  const config = resolveConfig(tailwindConfig ?? {});
  const tailwindcssPlugin = processTailwindFeatures(
    (processOptions) => () => processOptions.createContext(
      config,
      contentCollection.map((content) => (typeof content === 'string' ? { content } : content))
    ),
  );
  return tailwindcssPlugin;
}

export const jitBrowserTailwindcss: typeof import('..').default = (tailwindMainCss, jitContent, userTailwindConfig = {}) => {
  const tailwindcss = createTailwindcss({tailwindConfig: userTailwindConfig})
  return tailwindcss.generateStylesFromContent(tailwindMainCss, [jitContent])
}

export default jitBrowserTailwindcss;

