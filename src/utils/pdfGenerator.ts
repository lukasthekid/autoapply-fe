import pdfMake from 'pdfmake/build/pdfmake'
import vfsFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions, Content, ContentText, ContentOrderedList, ContentUnorderedList } from 'pdfmake/interfaces'
import type { UserProfile } from '@/types/api'

// Initialize pdfMake fonts - handle different module structures
// @ts-ignore - pdfMake and vfs_fonts have inconsistent type definitions
if (vfsFonts.pdfMake && vfsFonts.pdfMake.vfs) {
  // @ts-ignore
  pdfMake.vfs = vfsFonts.pdfMake.vfs
  // @ts-ignore
} else if (vfsFonts.default?.pdfMake?.vfs) {
  // @ts-ignore
  pdfMake.vfs = vfsFonts.default.pdfMake.vfs
  // @ts-ignore
} else if (vfsFonts.vfs) {
  // @ts-ignore
  pdfMake.vfs = vfsFonts.vfs
} else {
  // @ts-ignore
  pdfMake.vfs = vfsFonts
}

interface PDFGeneratorOptions {
  content: string // HTML content from TipTap
  userProfile: UserProfile | null
  jobTitle?: string
  companyName?: string
}

/**
 * Parses HTML content from TipTap and converts it to pdfMake content format
 * Preserves formatting: bold, italic, underline, lists, alignment
 */
function parseHTMLToPdfMake(html: string): Content[] {
  if (!html) return []

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const body = doc.body

  const processNode = (node: Node): Content | Content[] | null => {
    // Text node
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      return text ? { text } : null
    }

    // Element node
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      const tagName = element.tagName.toLowerCase()

      // Get text alignment
      const alignment = element.style.textAlign as 'left' | 'center' | 'right' | 'justify' | undefined

      switch (tagName) {
        case 'p': {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .flat()
            .filter(Boolean) as Content[]

          if (children.length === 0) {
            return { text: '\n' }
          }

          const paragraph: ContentText = {
            text: children,
            margin: [0, 0, 0, 8] as [number, number, number, number],
          }

          if (alignment && alignment !== 'left') {
            paragraph.alignment = alignment
          }

          return paragraph
        }

        case 'strong':
        case 'b': {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .flat()
            .filter(Boolean) as Content[]

          return children.map(child => {
            if (typeof child === 'object' && 'text' in child) {
              return { ...child, bold: true }
            }
            return child
          })
        }

        case 'em':
        case 'i': {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .flat()
            .filter(Boolean) as Content[]

          return children.map(child => {
            if (typeof child === 'object' && 'text' in child) {
              return { ...child, italics: true }
            }
            return child
          })
        }

        case 'u': {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .flat()
            .filter(Boolean) as Content[]

          return children.map(child => {
            if (typeof child === 'object' && 'text' in child) {
              return { ...child, decoration: 'underline' }
            }
            return child
          })
        }

        case 'br':
          return { text: '\n' }

        case 'ul': {
          const items = Array.from(element.querySelectorAll('li')).map(li => {
            const children = Array.from(li.childNodes)
              .map(processNode)
              .flat()
              .filter(Boolean) as Content[]
            return children.length > 0 ? children : { text: '' }
          })

          const list: ContentUnorderedList = {
            ul: items,
            margin: [0, 0, 0, 8] as [number, number, number, number],
          }

          return list
        }

        case 'ol': {
          const items = Array.from(element.querySelectorAll('li')).map(li => {
            const children = Array.from(li.childNodes)
              .map(processNode)
              .flat()
              .filter(Boolean) as Content[]
            return children.length > 0 ? children : { text: '' }
          })

          const list: ContentOrderedList = {
            ol: items,
            margin: [0, 0, 0, 8] as [number, number, number, number],
          }

          return list
        }

        case 'h1':
        case 'h2':
        case 'h3': {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .flat()
            .filter(Boolean) as Content[]

          const fontSize = tagName === 'h1' ? 16 : tagName === 'h2' ? 14 : 12

          return {
            text: children,
            fontSize,
            bold: true,
            margin: [0, 8, 0, 4] as [number, number, number, number],
          }
        }

        default: {
          // Process children for unknown tags
          const children = Array.from(element.childNodes)
            .map(processNode)
            .flat()
            .filter(Boolean)

          return children as Content[]
        }
      }
    }

    return null
  }

  const result = Array.from(body.childNodes)
    .map(processNode)
    .flat()
    .filter(Boolean) as Content[]

  return result
}

/**
 * Generates an ATS-friendly PDF cover letter
 */
export function generateATSFriendlyPDF(options: PDFGeneratorOptions): void {
  const { content, userProfile, jobTitle, companyName } = options

  // Build user information
  const userName = userProfile
    ? [userProfile.first_name, userProfile.last_name].filter(Boolean).join(' ').toUpperCase()
    : ''

  const userLocation = userProfile
    ? [userProfile.city, userProfile.country_display || userProfile.country]
        .filter(Boolean)
        .join(', ')
    : ''

  const contactInfo = [
    userProfile?.phone_number,
    userProfile?.email,
    userLocation,
  ]
    .filter(Boolean)
    .join(' | ')

  const subtitle = jobTitle || 'Cover Letter'

  // Parse HTML content to pdfMake format
  const bodyContent = parseHTMLToPdfMake(content)

  // Define document structure
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [50, 50, 50, 50], // 50pt margins on all sides
    defaultStyle: {
      font: 'Roboto', // Roboto is the default font included with pdfMake - clean, professional, and ATS-friendly
      fontSize: 11,
      lineHeight: 1.5,
    },
    content: [
      // Header: User Name
      ...(userName
        ? [
            {
              text: userName,
              fontSize: 20,
              bold: true,
              margin: [0, 0, 0, 4] as [number, number, number, number],
            } as Content,
          ]
        : []),

      // Subtitle: Job Title
      {
        text: subtitle,
        fontSize: 12,
        color: '#666666',
        margin: [0, 0, 0, 4] as [number, number, number, number],
      },

      // Contact Information
      ...(contactInfo
        ? [
            {
              text: contactInfo,
              fontSize: 9,
              color: '#888888',
              margin: [0, 0, 0, 8] as [number, number, number, number],
            } as Content,
          ]
        : []),

      // Separator Line
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 495, // A4 width minus margins (595 - 50 - 50)
            y2: 0,
            lineWidth: 2,
            lineColor: '#000000',
          },
        ],
        margin: [0, 0, 0, 16] as [number, number, number, number],
      },

      // Cover Letter Heading
      {
        text: 'COVER LETTER',
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 16] as [number, number, number, number],
      },

      // Body Content
      ...bodyContent,
    ],
  }

  // Generate filename
  const fileName = companyName
    ? `${companyName.toLowerCase().replace(/\s+/g, '-')}-cover-letter.pdf`
    : 'cover-letter.pdf'

  // Create and download PDF
  pdfMake.createPdf(docDefinition).download(fileName)
}

