export type ResumeEntryDto = {
  resumeEntryId: number
  resumeId: number
  resumeEntryType: string
  resumeEntryTitle: string
  resumeEntryOrganizationOrInstitution: string
  resumeEntryLocationCity: string
  resumeEntryLocationState: string
  resumeEntryDateStarted: Date
  resumeEntryDateEnded: Date | null
  resumeEntryDescription: string
}
