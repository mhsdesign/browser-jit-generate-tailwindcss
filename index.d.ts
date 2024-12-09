import { AcceptedPlugin } from 'postcss';
import { Config } from 'tailwindcss';

/**
 * The entry point to retrieve 'tailwindcss'
 *
 * @param options {@link TailwindcssOptions}
 * @example
 * const tailwindConfig: TailwindConfig = {
 *   theme: {
 *     extend: {
 *       colors: {
 *         marcherry: 'red',
 *       },
 *     },
 *   },
 * };
 * const tailwindCss = tailwindcssFactory({ tailwindConfig });
 */
export function createTailwindcss(
  options?: TailwindcssOptions,
): Tailwindcss;

export interface TailwindcssOptions {
  /**
   * The tailwind configuration to use.
   */
  tailwindConfig?: TailwindConfig;
}

export interface Tailwindcss {
  /**
   * Update the current Tailwind configuration.
   *
   * @param tailwindConfig The new Tailwind configuration.
   */
  setTailwindConfig: (tailwindConfig: TailwindConfig) => void;

  /**
   * Generate styles using Tailwindcss.
   *
   * This generates CSS using the Tailwind JIT compiler. It uses the Tailwind configuration that has
   * previously been passed to {@link createTailwindcss}.
   *
   * @param css The CSS to process. Only one CSS file can be processed at a time.
   * @param content All content that contains CSS classes to extract.
   * @returns The CSS generated by the Tailwind JIT compiler. It has been optimized for the given
   * content.
   * @example
   * tailwindcss.generateStylesFromContent(
   *   css,
   *   [myHtmlCode]
   * )
   */
  generateStylesFromContent: (css: string, content: (Content | string)[]) => Promise<string>

  /**
   * Get the class order for the provided list of classes
   *
   * @param classList The list of classes to get the order for.
   * @returns The ordered list of classes.
   * @example
   * tailwindcss.getClassOrder(['left-3', 'inset-x-2', bg-red-500', 'bg-blue-500'])
   */
  getClassOrder: (classList: string[]) => string[]
}

/**
 * Lower level API to create a PostCSS Tailwindcss Plugin
 * @internal might change in the future
 * @example
 * const processor = postcss([createTailwindcssPlugin({ tailwindConfig, content })]);
 * const { css } = await processor.process(css, { from: undefined });
 */
export function createTailwindcssPlugin(
  options: TailwindCssPluginOptions
): AcceptedPlugin;

export interface TailwindCssPluginOptions {
  /**
   * The tailwind configuration to use.
   */
  tailwindConfig?: TailwindConfig;
  /**
   * All content that contains CSS classes to extract.
   */
   content: (Content | string)[];
}

/**
 * Contains the content of CSS classes to extract.
 * With optional "extension" key, which might be relevant
 * to properly extract css classed based on the content language.
 */
export interface Content {
  content: string;
  extension?: string;
}

/**
 * Client side api to generate css via tailwind jit in the browser
 *
 * @deprecated with 0.2.0
 */
declare function jitBrowserTailwindcss(tailwindMainCss: string, jitContent: string, userTailwindConfig?: TailwindConfig): Promise<string>;

export { jitBrowserTailwindcss };

export default jitBrowserTailwindcss;

// This way we Omit `content`, somehow, Omit<> doesnt work.
export interface TailwindConfig {
  important?: Config['important'];
  prefix?: Config['prefix'];
  separator?: Config['separator'];
  safelist?: Config['safelist'];
  presets?: Config['presets'];
  future?: Config['future'];
  experimental?: Config['experimental'];
  darkMode?: Config['darkMode'];
  theme?: Config['theme'];
  corePlugins?: Config['corePlugins'];
  plugins?: Config['plugins'];
}
