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
  if (typstInitialized && $typst) return
  
  try {
    // Try to use local package first
    let typstModule
    try {
      typstModule = await import('@myriaddreamin/typst.ts/dist/esm/contrib/all-in-one-lite.mjs')
    } catch (importError) {
      // If local import fails, try snippet
      console.warn('Failed to load all-in-one bundle, trying snippet:', importError)
      typstModule = await import('@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs')
    }
    
    $typst = typstModule.$typst
    
    // Configure WASM module paths - use CDN for reliability
    if (typeof window !== 'undefined' && $typst) {
      try {
        $typst.setCompilerInitOptions({
          getModule: () =>
            'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler@0.6.1-rc5/pkg/typst_ts_web_compiler_bg.wasm',
        })
      } catch (e) {
        console.log('Compiler already initialized, skipping setCompilerInitOptions')
      }
      
      try {
        $typst.setRendererInitOptions({
          getModule: () =>
            'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer@0.6.1-rc5/pkg/typst_ts_renderer_bg.wasm',
        })
      } catch (e) {
        console.log('Renderer already initialized, skipping setRendererInitOptions')
      }
    }
    
    typstInitialized = true
  } catch (error) {
    console.error('Failed to initialize Typst:', error)
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
    initTypst()
      .then(() => {
        setIsInitializing(false)
        if (typstCode) {
          compileTypst(typstCode)
        }
      })
      .catch((err) => {
        setError(`Failed to initialize Typst: ${err.message}`)
        setIsInitializing(false)
      })
  }, [])

  // Update internal state when initialValue changes
  useEffect(() => {
    if (initialValue && initialValue !== typstCode) {
      setTypstCode(initialValue)
      if (typstInitialized) {
        compileTypst(initialValue)
      }
    }
  }, [initialValue])

  const compileTypst = useCallback(async (code: string) => {
    if (!code.trim() || !$typst) {
      setPreviewHtml('')
      return
    }

    setIsCompiling(true)
    setError(null)

    try {
      const svg = await $typst.svg({ mainContent: code })
      setPreviewHtml(svg)
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to compile Typst code'
      setError(errorMessage)
      setPreviewHtml('')
      console.error('Typst compilation error:', err)
    } finally {
      setIsCompiling(false)
    }
  }, [])

  // Debounced compilation on code change
  useEffect(() => {
    if (!typstInitialized) return

    if (compileTimeoutRef.current) {
      clearTimeout(compileTimeoutRef.current)
    }

    compileTimeoutRef.current = setTimeout(() => {
      compileTypst(typstCode)
    }, 500) // 500ms debounce

    return () => {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current)
      }
    }
  }, [typstCode, compileTypst])

  const handleDownloadPDF = async () => {
    if (!typstCode.trim()) {
      setError('Typst code is empty')
      return
    }

    if (!$typst) {
      setError('Typst is not initialized')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const pdfBytes = await $typst.pdf({ mainContent: typstCode })
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = downloadFileName.endsWith('.pdf') ? downloadFileName : `${downloadFileName}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to generate PDF'
      setError(errorMessage)
      console.error('PDF generation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

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