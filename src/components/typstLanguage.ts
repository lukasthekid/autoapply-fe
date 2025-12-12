import { StreamLanguage } from '@codemirror/language'

// Typst syntax highlighting for CodeMirror
export const typst = StreamLanguage.define({
  name: 'typst',
  startState: () => ({
    inString: false,
    inComment: false,
    inCodeBlock: false
  }),
  
  token: (stream, state) => {
    // Handle comments
    if (stream.match(/\/\/.*/)) {
      return 'comment'
    }
    
    if (stream.match(/\/\*/)) {
      state.inComment = true
      return 'comment'
    }
    
    if (state.inComment) {
      if (stream.match(/\*\//)) {
        state.inComment = false
        return 'comment'
      }
      stream.next()
      return 'comment'
    }
    
    // Handle strings
    if (stream.match(/"/)) {
      state.inString = !state.inString
      return 'string'
    }
    
    if (state.inString) {
      stream.next()
      return 'string'
    }
    
    // Handle headings (= Title, == Subtitle, etc.)
    if (stream.sol() && stream.match(/^=+\s/)) {
      stream.skipToEnd()
      return 'heading'
    }
    
    // Handle #set, #show, #let, #import, etc.
    if (stream.match(/#(set|show|let|import|include|if|else|for|while|return|break|continue)\b/)) {
      return 'keyword'
    }
    
    // Handle other # directives
    if (stream.match(/#[a-zA-Z_][a-zA-Z0-9_]*/)) {
      return 'function'
    }
    
    // Handle function calls
    if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*(?=\()/)) {
      return 'function'
    }
    
    // Handle numbers
    if (stream.match(/\d+(\.\d+)?(pt|em|cm|mm|in|%)?/)) {
      return 'number'
    }
    
    // Handle bullet lists and numbered lists
    if (stream.sol() && stream.match(/^[\-\+]\s/)) {
      return 'list'
    }
    
    // Handle bold (*text*)
    if (stream.match(/\*[^*]+\*/)) {
      return 'strong'
    }
    
    // Handle italic (_text_)
    if (stream.match(/_[^_]+_/)) {
      return 'emphasis'
    }
    
    // Handle inline code (`code`)
    if (stream.match(/`[^`]+`/)) {
      return 'monospace'
    }
    
    // Handle labels and references
    if (stream.match(/<[a-zA-Z_][a-zA-Z0-9_-]*>/)) {
      return 'label'
    }
    
    if (stream.match(/@[a-zA-Z_][a-zA-Z0-9_-]*/)) {
      return 'reference'
    }
    
    // Handle raw blocks
    if (stream.match(/```/)) {
      state.inCodeBlock = !state.inCodeBlock
      return 'meta'
    }
    
    if (state.inCodeBlock) {
      stream.next()
      return 'monospace'
    }
    
    // Handle variable assignment
    if (stream.match(/\$[a-zA-Z_][a-zA-Z0-9_]*/)) {
      return 'variable'
    }
    
    // Default: advance one character
    stream.next()
    return null
  },
  
  languageData: {
    commentTokens: { line: '//', block: { open: '/*', close: '*/' } },
    closeBrackets: { brackets: ['(', '[', '{', '"', '`'] }
  }
})

// Custom highlighting style for Typst
export const typstHighlightStyle = {
  '.cm-keyword': { color: '#d73a49', fontWeight: 'bold' },
  '.cm-function': { color: '#6f42c1', fontWeight: '600' },
  '.cm-heading': { color: '#005cc5', fontWeight: 'bold', fontSize: '1.1em' },
  '.cm-string': { color: '#22863a' },
  '.cm-comment': { color: '#6a737d', fontStyle: 'italic' },
  '.cm-number': { color: '#005cc5' },
  '.cm-strong': { fontWeight: 'bold', color: '#000' },
  '.cm-emphasis': { fontStyle: 'italic', color: '#000' },
  '.cm-monospace': { 
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    backgroundColor: 'rgba(27, 31, 35, 0.05)',
    padding: '2px 4px',
    borderRadius: '3px',
    color: '#e36209'
  },
  '.cm-variable': { color: '#e36209' },
  '.cm-label': { color: '#6f42c1' },
  '.cm-reference': { color: '#6f42c1' },
  '.cm-list': { color: '#d73a49', fontWeight: 'bold' },
  '.cm-meta': { color: '#6a737d' }
}