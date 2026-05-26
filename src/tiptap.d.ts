declare module '@tiptap/react' {
  import type { Editor, EditorOptions, AnyExtension, Extensions } from '@tiptap/core'
  import type { EditorState } from '@tiptap/pm/state'

  export { Editor, EditorOptions, AnyExtension, Extensions }

  export interface UseEditorOptions extends Partial<EditorOptions> {
    onUpdate?: (props: { editor: Editor; transaction: any }) => void
    onSelectionUpdate?: (props: { editor: Editor }) => void
    onTransaction?: (props: { editor: Editor; transaction: any }) => void
    onFocus?: (props: { editor: Editor; event: FocusEvent }) => void
    onBlur?: (props: { editor: Editor; event: FocusEvent }) => void
    onDestroy?: (props: { editor: Editor }) => void
    onCreate?: (props: { editor: Editor }) => void
    editable?: boolean
    content?: string | Record<string, any>
    extensions?: Extensions
    editorProps?: Record<string, any>
    parseOptions?: Record<string, any>
    enableInputRules?: boolean
    enablePasteRules?: boolean
    injectCSS?: boolean
  }

  export function useEditor(options?: UseEditorOptions): Editor | null

  export interface EditorContentProps {
    editor: Editor | null
    className?: string
    style?: React.CSSProperties
  }

  export const EditorContent: React.FC<EditorContentProps>

  export interface BubbleMenuProps {
    editor: Editor | null
    children: React.ReactNode
    className?: string
    tippyOptions?: Record<string, any>
    shouldShow?: ((props: { editor: Editor; view: any; state: EditorState; oldState?: EditorState; from: number; to: number }) => boolean) | null
    pluginKey?: any
    updateDelay?: number
    appendTo?: (() => HTMLElement) | HTMLElement
  }

  export const BubbleMenu: React.FC<BubbleMenuProps>

  export interface FloatingMenuProps {
    editor: Editor
    children: React.ReactNode
    className?: string
    tippyOptions?: Record<string, any>
    shouldShow?: (props: { editor: Editor; view: any; state: EditorState; oldState?: EditorState }) => boolean
  }

  export const FloatingMenu: React.FC<FloatingMenuProps>

  export interface ReactNodeViewRendererOptions {
    as?: string
    className?: string
    contentAs?: string
    contentClassName?: string
  }

  export function ReactNodeViewRenderer(
    component: React.ComponentType<any>,
    options?: ReactNodeViewRendererOptions
  ): any

  export interface ReactRendererOptions {
    editor?: Editor
    props?: Record<string, any>
    as?: string
    className?: string
  }

  export class ReactRenderer {
    constructor(component: React.ComponentType<any>, options: ReactRendererOptions)
    updateProps(props: Record<string, any>): void
    destroy(): void
    element: HTMLElement
  }
}

declare module '@tiptap/starter-kit' {
  import type { Extensions } from '@tiptap/core'
  export interface StarterKitOptions {
    heading?: { levels?: number[] } | false
    bulletList?: any
    orderedList?: any
    listItem?: any
    bold?: any
    italic?: any
    strike?: any
    code?: any
    paragraph?: any
    document?: any
    text?: any
    blockquote?: any
    codeBlock?: any
    horizontalRule?: any
    hardBreak?: any
    history?: any
    dropcursor?: any
    gapcursor?: any
  }
  const StarterKit: import('@tiptap/core').Extension<StarterKitOptions>
  export default StarterKit
}

declare module '@tiptap/extension-link' {
  import type { Extension } from '@tiptap/core'
  export interface LinkOptions {
    openOnClick?: boolean
    linkOnPaste?: boolean
    autolink?: boolean
    protocols?: string[]
    HTMLAttributes?: Record<string, any>
    validate?: (url: string) => boolean
  }
  const Link: Extension<LinkOptions>
  export default Link
}

declare module '@tiptap/extension-text-align' {
  import type { Extension } from '@tiptap/core'
  export interface TextAlignOptions {
    types?: string[]
    alignments?: string[]
    defaultAlignment?: string
  }
  const TextAlign: Extension<TextAlignOptions>
  export default TextAlign
}

declare module '@tiptap/extension-underline' {
  import type { Extension } from '@tiptap/core'
  const Underline: Extension
  export default Underline
}

declare module '@tiptap/extension-placeholder' {
  import type { Extension } from '@tiptap/core'
  export interface PlaceholderOptions {
    placeholder?: string | ((props: { editor: any; node: any; pos: number }) => string)
    emptyEditorClass?: string
    emptyNodeClass?: string
    showOnlyWhenEditable?: boolean
    showOnlyCurrent?: boolean
    includeChildren?: boolean
  }
  const Placeholder: Extension<PlaceholderOptions>
  export default Placeholder
}

declare module '@tiptap/core' {
  export class Editor {
    chain(): any
    isActive(name: string | Record<string, any>, attrs?: Record<string, any>): boolean
    getAttributes(name: string): Record<string, any>
    getHTML(): string
    commands: any
    state: any
    view: any
    options: any
    storage: any
    isDestroyed: boolean
    isEditable: boolean
    contentComponent: any
    isEditorContentInitialized: boolean
    setOptions(options: Record<string, any>): void
    on(event: string, fn: (...args: any[]) => void): void
    off(event: string, fn: (...args: any[]) => void): void
    destroy(): void
    createNodeViews(): void
    registerPlugin(plugin: any): void
    unregisterPlugin(key: any): void
  }

  export class Extension {
    configure(options?: any): any
  }

  export type AnyExtension = Extension
  export type Extensions = AnyExtension[]
  export type EditorOptions = Record<string, any>
}

declare module '@tiptap/pm/state' {
  export class PluginKey {
    constructor(name: string)
  }
  export type EditorState = any
}

declare module '@tiptap/react/menus' {
  import type { Editor } from '@tiptap/core'
  import type { EditorState } from '@tiptap/pm/state'
  import type React from 'react'

  export interface BubbleMenuProps {
    editor: Editor | null
    children: React.ReactNode
    className?: string
    tippyOptions?: Record<string, any>
    shouldShow?: ((props: { editor: Editor; view: any; state: EditorState; oldState?: EditorState; from: number; to: number }) => boolean) | null
    pluginKey?: any
    updateDelay?: number
    appendTo?: (() => HTMLElement) | HTMLElement
  }

  export const BubbleMenu: React.FC<BubbleMenuProps>

  export interface FloatingMenuProps {
    editor: Editor
    children: React.ReactNode
    className?: string
    tippyOptions?: Record<string, any>
    shouldShow?: (props: { editor: Editor; view: any; state: EditorState; oldState?: EditorState }) => boolean
  }

  export const FloatingMenu: React.FC<FloatingMenuProps>
}
