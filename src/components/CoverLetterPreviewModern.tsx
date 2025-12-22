import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEffect } from 'react'
import type { UserProfile } from '@/types/api'

interface CoverLetterPreviewProps {
  content: string
  userProfile: UserProfile | null
  companyName?: string
  jobTitle?: string
  onChange: (html: string) => void
}

const CoverLetterPreviewModern = ({
  content,
  userProfile,
  jobTitle,
  onChange,
}: CoverLetterPreviewProps) => {

  // Build user information
  const userName = userProfile
    ? [userProfile.first_name, userProfile.last_name].filter(Boolean).join(' ').toUpperCase()
    : ''

  const userLocation = userProfile
    ? [userProfile.city, userProfile.country_display || userProfile.country]
        .filter(Boolean)
        .join(', ')
    : ''

  const subtitle = jobTitle || 'Cover Letter'

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Click here to start writing your cover letter...',
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base max-w-none focus:outline-none text-gray-800 leading-relaxed min-h-[200px] text-sm md:text-base',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4 md:p-8">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 mb-6 bg-white rounded-lg shadow-md border border-gray-200 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center gap-1 p-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            }`}
            title="Bold"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            }`}
            title="Italic"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="4" x2="10" y2="4" />
              <line x1="14" y1="20" x2="5" y2="20" />
              <line x1="15" y1="4" x2="9" y2="20" />
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('underline') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            }`}
            title="Underline"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
              <line x1="4" y1="21" x2="20" y2="21" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            }`}
            title="Bullet List"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            }`}
            title="Numbered List"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="10" y1="6" x2="21" y2="6" />
              <line x1="10" y1="12" x2="21" y2="12" />
              <line x1="10" y1="18" x2="21" y2="18" />
              <path d="M4 6h1v4" />
              <path d="M4 10h2" />
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            }`}
            title="Align Left"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="17" y1="10" x2="3" y2="10" />
              <line x1="21" y1="6" x2="3" y2="6" />
              <line x1="21" y1="14" x2="3" y2="14" />
              <line x1="17" y1="18" x2="3" y2="18" />
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            }`}
            title="Align Center"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="10" x2="6" y2="10" />
              <line x1="21" y1="6" x2="3" y2="6" />
              <line x1="21" y1="14" x2="3" y2="14" />
              <line x1="18" y1="18" x2="6" y2="18" />
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            }`}
            title="Align Right"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="21" y1="10" x2="7" y2="10" />
              <line x1="21" y1="6" x2="3" y2="6" />
              <line x1="21" y1="14" x2="3" y2="14" />
              <line x1="21" y1="18" x2="7" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* A4 Paper Container */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl hover:shadow-3xl transition-shadow min-h-[297mm]">
        {/* Modern Sidebar Layout */}
        <div className="flex flex-row h-full min-h-[297mm]">
          
          {/* Left Sidebar - Darker Background */}
          <div className="w-1/3 bg-slate-800 text-white p-8 pt-12 flex flex-col gap-8">
            {/* Name */}
            {userName && (
              <div className="mb-4">
                <h1 className="text-2xl font-bold tracking-wider leading-tight text-white mb-2">
                  {userName.split(' ').map((n, i) => (
                    <span key={i} className="block">{n}</span>
                  ))}
                </h1>
                <div className="w-12 h-1 bg-blue-400 mt-4 mb-2"></div>
              </div>
            )}

            {/* Contact Info */}
            <div className="flex flex-col gap-4 text-sm text-gray-300">
              {userProfile?.email && (
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 p-2 rounded-full">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span className="break-all">{userProfile.email}</span>
                </div>
              )}

              {userProfile?.phone_number && (
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 p-2 rounded-full">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span>{userProfile.phone_number}</span>
                </div>
              )}

              {userLocation && (
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 p-2 rounded-full">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <span>{userLocation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Content */}
          <div className="w-2/3 p-12 bg-white text-gray-800">
             {/* Header */}
             <div className="mb-10 border-b pb-4 border-gray-100">
                <h2 className="text-xl font-semibold text-slate-800 tracking-wide uppercase">
                  {subtitle}
                </h2>
             </div>

            {/* Editable Cover Letter Body - Tiptap Editor */}
            <div className="flex-1 cursor-text">
              <EditorContent editor={editor} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CoverLetterPreviewModern

