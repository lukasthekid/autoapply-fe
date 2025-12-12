import { useState, useEffect, useRef, useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import { typst } from './typstLanguage'
import './TystEditor.css'

// Dynamically import typst.ts to handle WASM loading
let $typst: any = null
let typstInitialized = false

const initTypst = async () => {
  console.log('[Typst Init] Starting initialization...')
  console.log('[Typst Init] Current state - typstInitialized:', typstInitialized, '$typst exists:', !!$typst)
  
  if (typstInitialized && $typst) {
    console.log('[Typst Init] Already initialized, skipping')
    return
  }
  
  try {
    console.log('[Typst Init] Attempting to import @myriaddreamin/typst.ts...')
    
    // Use direct import without trying different modules
    const typstModule = await import('@myriaddreamin/typst.ts/dist/esm/contrib/all-in-one-lite.mjs')
    console.log('[Typst Init] Module imported successfully')
    console.log('[Typst Init] Module keys:', Object.keys(typstModule))
    
    if (!typstModule || !typstModule.$typst) {
      console.error('[Typst Init] Module structure:', typstModule)
      throw new Error('Typst module did not export $typst correctly')
    }
    
    $typst = typstModule.$typst
    console.log('[Typst Init] $typst assigned, type:', typeof $typst)
    console.log('[Typst Init] $typst methods:', Object.keys($typst))
    
    // Configure WASM module paths
    if (typeof window !== 'undefined' && $typst) {
      console.log('[Typst Init] Configuring WASM paths...')
      
      // Compiler initialization
      if (!$typst._compilerInitialized) {
        try {
          console.log('[Typst Init] Setting compiler options...')
          await $typst.setCompilerInitOptions({
            getModule: () =>
              'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler@0.6.1-rc5/pkg/typst_ts_web_compiler_bg.wasm',
          })
          $typst._compilerInitialized = true
          console.log('[Typst Init] ✅ Compiler initialized')
        } catch (e) {
          console.log('[Typst Init] ⚠️ Compiler init skipped:', e instanceof Error ? e.message : String(e))
        }
      } else {
        console.log('[Typst Init] Compiler already initialized')
      }
      
      // Renderer initialization
      if (!$typst._rendererInitialized) {
        try {
          console.log('[Typst Init] Setting renderer options...')
          await $typst.setRendererInitOptions({
            getModule: () =>
              'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer@0.6.1-rc5/pkg/typst_ts_renderer_bg.wasm',
          })
          $typst._rendererInitialized = true
          console.log('[Typst Init] ✅ Renderer initialized')
        } catch (e) {
          console.log('[Typst Init] ⚠️ Renderer init skipped:', e instanceof Error ? e.message : String(e))
        }
      } else {
        console.log('[Typst Init] Renderer already initialized')
      }
    }
    
    typstInitialized = true
    console.log('[Typst Init] ✅ Initialization complete!')
  } catch (error) {
    console.error('[Typst Init] ❌ Failed to initialize Typst')
    console.error('[Typst Init] Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('[Typst Init] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[Typst Init] Error stack:', error instanceof Error ? error.stack : 'N/A')
    console.error('[Typst Init] Full error object:', error)
    throw error
  }
}

// Custom syntax highlighting theme for Typst
const typstTheme = HighlightStyle.define([
  { tag: t.keyword, color: '#d73a49', fontWeight: 'bold' },
  { tag: t.function(t.variableName), color: '#6f42c1', fontWeight: '600' },
  { tag: t.heading, color: '#005cc5', fontWeight: 'bold' },
  { tag: t.string, color: '#22863a' },
  { tag: t.comment, color: '#6a737d', fontStyle: 'italic' },
  { tag: t.number, color: '#005cc5' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.monospace, 
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    backgroundColor: 'rgba(27, 31, 35, 0.05)',
    color: '#e36209'
  },
  { tag: t.variableName, color: '#e36209' },
  { tag: t.labelName, color: '#6f42c1' },
  { tag: t.meta, color: '#6a737d' }
])

interface TystEditorProps {
  initialValue?: string
  placeholder?: string
  downloadFileName?: string
}

const TystEditor = ({ 
  initialValue = '', 
  placeholder = "#set page(margin: 2cm)\n#set text(size: 11pt)\n\n= Your Resume\n\nYour content here...", 
  downloadFileName = 'resume.pdf'
}: TystEditorProps) => {
  const [typstCode, setTypstCode] = useState(initialValue)
  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isCompiling, setIsCompiling] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const compileTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initialize Typst on mount
  useEffect(() => {
    console.log('[TystEditor] Component mounted, starting initialization')
    initTypst()
      .then(() => {
        console.log('[TystEditor] Initialization successful')
        setIsInitializing(false)
        if (typstCode) {
          console.log('[TystEditor] Compiling initial code')
          compileTypst(typstCode)
        }
      })
      .catch((err) => {
        console.error('[TystEditor] Initialization failed:', err)
        setError(`Failed to initialize Typst: ${err.message}`)
        setIsInitializing(false)
      })
  }, [])

  // Update internal state when initialValue changes
  useEffect(() => {
    if (initialValue && initialValue !== typstCode) {
      console.log('[TystEditor] Initial value changed, updating code')
      setTypstCode(initialValue)
      if (typstInitialized) {
        compileTypst(initialValue)
      }
    }
  }, [initialValue])

  const compileTypst = useCallback(async (code: string) => {
    console.log('[Typst Compile] Starting compilation')
    console.log('[Typst Compile] Code length:', code.length)
    console.log('[Typst Compile] $typst exists:', !!$typst)
    console.log('[Typst Compile] $typst.svg exists:', !!$typst?.svg)
    
    if (!code.trim() || !$typst) {
      console.log('[Typst Compile] Skipping - empty code or $typst not available')
      setPreviewHtml('')
      return
    }

    setIsCompiling(true)
    setError(null)

    try {
      console.log('[Typst Compile] Calling $typst.svg...')
      const startTime = performance.now()
      const svg = await $typst.svg({ mainContent: code })
      const endTime = performance.now()
      
      console.log('[Typst Compile] ✅ Compilation successful')
      console.log('[Typst Compile] Time taken:', (endTime - startTime).toFixed(2), 'ms')
      console.log('[Typst Compile] SVG length:', svg?.length || 0)
      
      setPreviewHtml(svg)
    } catch (err: any) {
      console.error('[Typst Compile] ❌ Compilation failed')
      console.error('[Typst Compile] Error type:', err?.constructor?.name)
      console.error('[Typst Compile] Error message:', err?.message)
      console.error('[Typst Compile] Error stack:', err?.stack)
      console.error('[Typst Compile] Full error object:', err)
      
      const errorMessage = err?.message || 'Failed to compile Typst code'
      setError(errorMessage)
      setPreviewHtml('')
    } finally {
      setIsCompiling(false)
    }
  }, [])

  // Debounced compilation on code change
  useEffect(() => {
    if (!typstInitialized) {
      console.log('[TystEditor] Skipping compilation - Typst not initialized yet')
      return
    }

    if (compileTimeoutRef.current) {
      clearTimeout(compileTimeoutRef.current)
    }

    console.log('[TystEditor] Scheduling compilation (500ms debounce)')
    compileTimeoutRef.current = setTimeout(() => {
      compileTypst(typstCode)
    }, 500)

    return () => {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current)
      }
    }
  }, [typstCode, compileTypst])

  const handleDownloadPDF = async () => {
    console.log('[PDF Download] Starting PDF generation')
    
    if (!typstCode.trim()) {
      console.error('[PDF Download] Code is empty')
      setError('Typst code is empty')
      return
    }

    if (!$typst) {
      console.error('[PDF Download] $typst not initialized')
      setError('Typst is not initialized')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('[PDF Download] Calling $typst.pdf...')
      const startTime = performance.now()
      const pdfBytes = await $typst.pdf({ mainContent: typstCode })
      const endTime = performance.now()
      
      console.log('[PDF Download] PDF generated successfully')
      console.log('[PDF Download] Time taken:', (endTime - startTime).toFixed(2), 'ms')
      console.log('[PDF Download] PDF size:', pdfBytes?.length || 0, 'bytes')
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = downloadFileName.endsWith('.pdf') ? downloadFileName : `${downloadFileName}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('[PDF Download] ✅ PDF downloaded successfully')
    } catch (err: any) {
      console.error('[PDF Download] ❌ PDF generation failed')
      console.error('[PDF Download] Error type:', err?.constructor?.name)
      console.error('[PDF Download] Error message:', err?.message)
      console.error('[PDF Download] Error stack:', err?.stack)
      console.error('[PDF Download] Full error object:', err)
      
      const errorMessage = err?.message || 'Failed to generate PDF'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Log environment info on mount
  useEffect(() => {
    console.log('[TystEditor] Environment Info:')
    console.log('- User Agent:', navigator.userAgent)
    console.log('- Platform:', navigator.platform)
    console.log('- Language:', navigator.language)
    console.log('- Online:', navigator.onLine)
    console.log('- Host:', window.location.host)
    console.log('- Protocol:', window.location.protocol)
  }, [])

  return (
    <div className="tyst-editor">
      <div className="panel-header">
        <div className="header-titles">
          <div className="title-row">
            <h2>
              <span>📄</span>
              Resume Editor
            </h2>
            <a
              className="typst-chip"
              href="https://typst.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              What is Typst?
            </a>
          </div>
          <p className="subtitle">
            Powered by Typst — a modern, approachable typesetting language.
          </p>
        </div>
        <div className="header-actions">
          <button
            className="download-button"
            onClick={handleDownloadPDF}
            disabled={isLoading || !typstInitialized}
          >
            <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {isLoading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="error-message">⚠️ {error}</div>
      )}

      {isInitializing && (
        <div className="loading-message">🔄 Initializing Typst...</div>
      )}

      <div className="editor-container">
        <div className="editor-panel">
          <div className="panel-label">Editor</div>
          <CodeMirror
            value={typstCode}
            height="100%"
            extensions={[
              typst,
              syntaxHighlighting(typstTheme),
              EditorView.lineWrapping
            ]}
            onChange={(value) => {
              setTypstCode(value)
              setError(null)
            }}
            placeholder={placeholder}
            theme="light"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              history: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              defaultKeymap: true,
              searchKeymap: true,
              historyKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
            className="codemirror-wrapper"
          />
        </div>
        
        <div className="preview-panel">
          <div className="panel-label">
            Preview
            {isCompiling && <span className="compiling-indicator">🔄 Compiling...</span>}
          </div>
          <div 
            ref={previewRef}
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
          {!previewHtml && !isCompiling && typstCode.trim() && (
            <div className="preview-placeholder">Type Typst code to see preview...</div>
          )}
          {!previewHtml && !isCompiling && !typstCode.trim() && (
            <div className="preview-placeholder">Start typing to see the preview...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TystEditor