import type { UserProfile } from '@/types/api'

interface CoverLetterPreviewProps {
  content: string
  userProfile: UserProfile | null
  companyName?: string
  jobTitle?: string
}

const CoverLetterPreview = ({
  content,
  userProfile,
  companyName,
  jobTitle,
}: CoverLetterPreviewProps) => {
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Build user address
  const userAddress = userProfile
    ? [
        userProfile.street,
        userProfile.city,
        userProfile.postcode,
        userProfile.country_display || userProfile.country,
      ]
        .filter(Boolean)
        .join(', ')
    : ''

  const userName = userProfile
    ? [userProfile.first_name, userProfile.last_name].filter(Boolean).join(' ')
    : ''

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4 md:p-8">
      {/* Paper-like container */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        {/* A4-like content area */}
        <div className="px-8 py-10 md:px-16 md:py-12">
          {/* Header - User Contact Information */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            {userName && (
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {userName}
              </h1>
            )}
            <div className="space-y-1 text-sm text-gray-600">
              {userProfile?.email && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 7L2 7" />
                  </svg>
                  <span>{userProfile.email}</span>
                </div>
              )}
              {userProfile?.phone_number && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{userProfile.phone_number}</span>
                </div>
              )}
              {userAddress && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{userAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="mb-8 text-sm text-gray-600">
            {currentDate}
          </div>

          {/* Recipient Information */}
          {(companyName || jobTitle) && (
            <div className="mb-8 space-y-1 text-gray-700">
              {companyName && (
                <div className="font-semibold">{companyName}</div>
              )}
              {jobTitle && (
                <div className="text-sm text-gray-600">
                  Re: {jobTitle}
                </div>
              )}
            </div>
          )}

          {/* Cover Letter Body */}
          <div 
            className="prose prose-sm md:prose-base max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400 italic">Your cover letter content will appear here...</p>' }}
          />

          {/* Signature Area */}
          <div className="mt-12 space-y-4">
            <div className="text-gray-700">
              Sincerely,
            </div>
            <div className="h-12" /> {/* Space for signature */}
            {userName && (
              <div className="font-semibold text-gray-900">
                {userName}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoverLetterPreview

