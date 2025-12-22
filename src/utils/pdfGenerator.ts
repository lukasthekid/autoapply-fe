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
  layout?: 'classic' | 'modern' | 'sidebar'
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
      const text = node.textContent
      if (!text) return null
      
      // Normalize whitespace: replace multiple spaces/tabs/newlines with single space,
      // but preserve single spaces to maintain spacing around formatted text
      const normalized = text.replace(/[\s]+/g, ' ')
      
      // Only return null if the normalized text is empty or just whitespace
      return normalized ? { text: normalized } : null
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
  const { content, userProfile, jobTitle, companyName, layout = 'classic' } = options

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

  // Parse HTML content to pdfMake format
  const bodyContent = parseHTMLToPdfMake(content)

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const fullAddress = userProfile
    ? [
        userProfile.street,
        userProfile.city,
        userProfile.postcode,
        userProfile.country_display || userProfile.country
      ].filter(Boolean).join(', ')
    : ''

  let docContent: Content[] = []
  let pageMargins: [number, number, number, number] = [50, 50, 50, 50]

  if (layout === 'sidebar') {
    // Classic Sidebar Layout: Light sidebar on left, content on right
    pageMargins = [0, 0, 0, 0] // No default margins, controlled by table

    const sidebarContent: Content[] = []
    
    // Name
    if (userName) {
      sidebarContent.push({
        text: userName,
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 12] as [number, number, number, number],
      })
      // Divider line
      sidebarContent.push({
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 60, y2: 0, lineWidth: 2, lineColor: '#2563eb' }], // blue-600
        margin: [0, 0, 0, 16] as [number, number, number, number],
      })
    }

    // Date and Location
    sidebarContent.push({
      text: [
        { text: 'Date: ', bold: true },
        { text: currentDate }
      ],
      fontSize: 10,
      margin: [0, 0, 0, 4] as [number, number, number, number],
    })

    if (userLocation) {
      sidebarContent.push({
        text: [
          { text: 'Location: ', bold: true },
          { text: userLocation }
        ],
        fontSize: 10,
        margin: [0, 0, 0, 16] as [number, number, number, number],
      })
    }

    // Contact Information Section
    sidebarContent.push({
      text: 'CONTACT INFORMATION',
      fontSize: 9,
      bold: true,
      color: '#6b7280', // gray-500
      margin: [0, 0, 0, 8] as [number, number, number, number],
    })

    if (userProfile?.email) {
      sidebarContent.push({
        text: [
          { text: 'Email\n', fontSize: 9, bold: true, color: '#6b7280' },
          { text: userProfile.email, fontSize: 9 }
        ],
        margin: [0, 0, 0, 8] as [number, number, number, number],
      })
    }

    if (userProfile?.phone_number) {
      sidebarContent.push({
        text: [
          { text: 'Phone\n', fontSize: 9, bold: true, color: '#6b7280' },
          { text: userProfile.phone_number, fontSize: 9 }
        ],
        margin: [0, 0, 0, 8] as [number, number, number, number],
      })
    }

    if (fullAddress) {
      sidebarContent.push({
        text: [
          { text: 'Address\n', fontSize: 9, bold: true, color: '#6b7280' },
          { text: fullAddress, fontSize: 9 }
        ],
        margin: [0, 0, 0, 8] as [number, number, number, number],
      })
    }

    const rightContent: Content[] = [
      // Job Title Header
      {
        text: subtitle,
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 8] as [number, number, number, number],
      },
      // Divider
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 300, y2: 0, lineWidth: 1, lineColor: '#9ca3af' }], // gray-400
        margin: [0, 0, 0, 16] as [number, number, number, number],
      },
      // Body Content
      ...bodyContent,
    ]

    docContent = [
      {
        table: {
          widths: ['33%', '67%'],
          heights: [842], // Approximate A4 height in points
          body: [
            [
              // Left Sidebar
              {
                fillColor: '#f9fafb', // gray-50
                color: '#374151', // gray-700
                border: [false, false, true, false], // Right border only
                borderColor: ['transparent', 'transparent', '#d1d5db', 'transparent'], // gray-300 for right border
                margin: [30, 40, 20, 40],
                stack: sidebarContent,
              },
              // Right Content
              {
                fillColor: 'white',
                border: [false, false, false, false],
                margin: [30, 40, 30, 40],
                stack: rightContent,
              },
            ],
          ],
        },
        layout: 'noBorders',
      },
    ]
  } else if (layout === 'modern') {
    // Modern Layout: Sidebar on left, Content on right
    // Using a table to simulate columns with background color
    pageMargins = [0, 0, 0, 0] // No default margins, controlled by table

    const contactDetails = [
      userProfile?.email ? { text: userProfile.email, margin: [0, 0, 0, 4] as [number, number, number, number] } : null,
      userProfile?.phone_number ? { text: userProfile.phone_number, margin: [0, 0, 0, 4] as [number, number, number, number] } : null,
      userLocation ? { text: userLocation, margin: [0, 0, 0, 4] as [number, number, number, number] } : null,
    ].filter(Boolean) as Content[]

    docContent = [
      {
        table: {
          widths: ['35%', '65%'],
          heights: [842], // Approximate A4 height in points (297mm approx 842pt)
          body: [
            [
              // Left Sidebar
              {
                fillColor: '#1e293b', // slate-800
                color: 'white',
                border: [false, false, false, false],
                margin: [30, 40, 20, 40],
                stack: [
                  // Name
                  {
                    text: userName,
                    fontSize: 22,
                    bold: true,
                    margin: [0, 0, 0, 20] as [number, number, number, number],
                  },
                  // Divider
                  {
                    canvas: [{ type: 'rect', x: 0, y: 0, w: 40, h: 4, color: '#60a5fa' }], // blue-400
                    margin: [0, 0, 0, 20] as [number, number, number, number],
                  },
                  // Contact Info
                  ...contactDetails,
                ],
              },
              // Right Content
              {
                fillColor: 'white',
                border: [false, false, false, false],
                margin: [30, 40, 30, 40],
                stack: [
                  // Job Title Header
                  {
                    text: subtitle.toUpperCase(),
                    fontSize: 14,
                    color: '#334155', // slate-700
                    bold: true,
                    margin: [0, 0, 0, 10] as [number, number, number, number],
                  },
                  {
                    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 300, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }],
                    margin: [0, 0, 0, 20] as [number, number, number, number],
                  },
                  // Body
                  ...bodyContent,
                ],
              },
            ],
          ],
        },
        layout: 'noBorders',
      },
    ]
  } else {
    // Classic Layout
    const contactInfo = [
      userProfile?.phone_number,
      userProfile?.email,
      userLocation,
    ]
      .filter(Boolean)
      .join(' | ')

    docContent = [
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
    ]
  }

  // Define document structure
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: pageMargins,
    defaultStyle: {
      font: 'Roboto', // Roboto is the default font included with pdfMake - clean, professional, and ATS-friendly
      fontSize: 11,
      lineHeight: 1.5,
    },
    content: docContent,
  }

  // Generate filename
  const fileName = companyName
    ? `${companyName.toLowerCase().replace(/\s+/g, '-')}-cover-letter.pdf`
    : 'cover-letter.pdf'

  // Create and download PDF
  pdfMake.createPdf(docDefinition).download(fileName)
}

