# Interview Question Catalog

This catalog tracks application and interview prompts observed during real job
search workflows. Keep entries factual: if the exact question text is hidden by
the applicant tracking system, mark it as unknown instead of inventing copy.

## Source: Yrefy LLC - Senior Angular Developer

- Platform: Breezy HR
- URL: https://yrefy-llc.breezy.hr/p/844942967e05-senior-angular-developer/apply
- Date observed: 2026-05-10
- Evidence: user screenshot plus public application page text
- Autofill note: the page uses a mixed application workflow, not only simple
  contact fields.

| Prompt or field | Type | Intended answer source | Autofill readiness |
| --- | --- | --- | --- |
| Full Name | text | Account/profile contact identity | Candidate |
| Email Address | text/email | Account email | Candidate |
| Phone Number | text/tel | Profile phone | Candidate |
| Agreement to receive SMS messages | checkbox | Manual consent | Manual only |
| Desired Salary | select/text | Compensation preferences, not modeled yet | Needs profile data |
| Work History | repeated section | Profile work experiences | Needs structured mapping |
| Education | repeated section | Profile education, not modeled yet | Needs profile data |
| Experience Summary | long text | Profile summary and work history | Candidate for generated answer |
| Cover Letter | long text | Generated cover letter | Candidate for generated answer |
| Resume upload | file/upload action | User resume file | Manual only |
| References | repeated section | References, not modeled yet | Needs profile data |
| Reference relationship | radio/select | Reference metadata, not modeled yet | Needs profile data |
| Custom question text unavailable in fetched page | unknown | Unknown | Manual only |
| Custom multiple-choice question text unavailable in fetched page | multiple choice | Unknown | Manual only |
| Custom file question text unavailable in fetched page | file | Unknown | Manual only |
| Verification code | text | User/device verification | Manual only |

## Catalog Fields

- Source metadata: company, role, platform, URL, date observed, evidence.
- Prompt or field: exact user-facing question text when available.
- Type: text, long text, select, multiple choice, checkbox, radio, file,
  repeated section, verification, or unknown.
- Intended answer source: where SearchParty should get the answer.
- Autofill readiness: candidate, needs profile data, candidate for generated
  answer, or manual only.
