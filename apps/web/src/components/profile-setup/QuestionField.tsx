/**
 * Maps each catalog question variant to structured inputs aligned with onboarding tokens.
 */

import * as React from 'react'
import { formatPhoneNumberMask } from '../../../../../packages/utils/src/phone-mask'
import { coerceStringArray } from './payload-from-answers'
import type { ProfileQuestion } from '@searchparty/data/profile-questions'

import { Checkbox } from '#/components/ui/checkbox'
import { Input } from '#/components/ui/input'
import { RadioGroupCard } from '#/components/ui/radio-group'
import { Textarea } from '#/components/ui/textarea'
import { cn } from '#/lib/utils.ts'

export interface QuestionFieldProps {
  question: ProfileQuestion
  value: unknown
  /** Normalizes onboarding values into JSON-safe payloads. */
  onChange: (next: unknown) => void
  invalid?: boolean
  /** Error surfaced after attempting to advance. */
  errorText?: string
}

function ToggleChip({
  active,
  className,
  ...props
}: React.ComponentProps<'button'> & { active: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-full px-3 py-1 font-sans transition-colors duration-200 text-xs/relaxed outline-none cursor-pointer ring-1',
        active
          ? 'border border-primary/55 bg-accent text-accent-foreground ring-primary/35'
          : 'border-(--chip-line) bg-(--chip-bg) text-card-foreground ring-foreground/5 hover:border-(--lagoon-deep)/45',
        className,
      )}
      {...props}
    />
  )
}

export function QuestionField({
  question,
  value,
  onChange,
  invalid,
  errorText,
}: QuestionFieldProps) {
  const fieldSetId = `field-${question.field}`
  const errorId = `${fieldSetId}-error`

  return (
    <fieldset id={fieldSetId} className="grid gap-2 border-0 p-0 m-0 min-w-0">
      <legend className="m-0 w-full min-w-0 border-0 p-0 pb-2 font-sans font-normal text-card-foreground text-sm">
        <span>{question.question}</span>
        {question.required ? (
          <span className="text-muted-foreground text-xs">
            &nbsp;· Required
          </span>
        ) : null}
      </legend>
      {question.helper ? (
        <p className="-mt-1 normal-case tracking-normal leading-relaxed text-muted-foreground text-[0.7rem]/relaxed">
          {question.helper}
        </p>
      ) : null}

      {renderControl({
        question,
        value,
        onChange,
        invalid,
      })}

      {invalid && errorText ? (
        <p
          role="alert"
          id={errorId}
          className="font-sans text-xs/none font-normal normal-case tracking-normal leading-relaxed text-destructive"
        >
          {errorText}
        </p>
      ) : null}
    </fieldset>
  )
}

function TagsAnswerFields({
  question,
  value,
  onChange,
  invalid,
  describedBy,
}: Omit<QuestionFieldProps, 'errorText'> & { describedBy?: string }) {
  const tags = coerceStringArray(value)
  const [draft, setDraft] = React.useState('')

  const commitDraft = React.useCallback(() => {
    const nextChip = draft.trim()
    if (!nextChip) return
    if (!tags.includes(nextChip)) {
      onChange([...tags, nextChip])
    }
    setDraft('')
  }, [draft, onChange, tags])

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2 rounded-[12px] border border-border px-3 py-2">
        {tags.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-full border border-(--chip-line) bg-(--chip-bg) px-2 py-0.5 text-xs"
          >
            {chip}
            <button
              type="button"
              className="-mr-1 flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground outline-none cursor-pointer"
              aria-label={`Remove ${chip}`}
              onClick={() => {
                onChange(tags.filter((existing) => existing !== chip))
              }}
            >
              ×
            </button>
          </span>
        ))}
        <Input
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className="min-w-[140px] flex-1 border-0 bg-transparent px-0 shadow-none hover:bg-transparent focus-visible:ring-0"
          placeholder={question.placeholder}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              commitDraft()
            }
          }}
          onBlur={() => {
            commitDraft()
          }}
        />
      </div>
      <p className="text-muted-foreground text-[0.65rem]/normal normal-case tracking-normal">
        Tip: press comma or Enter to add each phrase.
      </p>
    </div>
  )
}

function renderControl({
  question,
  value,
  onChange,
  invalid,
}: Omit<QuestionFieldProps, 'errorText'>): React.ReactElement {
  const describedBy = invalid ? `${`field-${question.field}`}-error` : undefined
  switch (question.type) {
    case 'tel':
      return (
        <Input
          id={`field-${question.field}`}
          type="tel"
          placeholder={question.placeholder}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          value={value as string}
          onChange={(event) => {
            onChange(formatPhoneNumberMask(event.target.value))
          }}
        />
      )
    case 'text':
    case 'url':
      return (
        <Input
          id={`field-${question.field}`}
          type={question.type}
          placeholder={question.placeholder}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          value={value as string}
          onChange={(event) => {
            onChange(event.target.value)
          }}
        />
      )
    case 'textarea':
      return (
        <Textarea
          id={`field-${question.field}`}
          placeholder={question.placeholder}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          value={value as string}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          rows={4}
        />
      )
    case 'select': {
      // Native <option> popups render with OS-level styling that does NOT
      // inherit the parent's color/background, so we must repeat them here
      // to stay readable in dark mode.
      const optionClass = 'bg-background text-foreground'
      return (
        <select
          id={`field-${question.field}`}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn(
            'h-9 w-full cursor-pointer rounded-[10px] border border-input bg-input/10 px-3 text-xs/relaxed text-foreground hover:bg-input/20 focus-visible:bg-background/50 outline-none ring-offset-background focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-ring/40 dark:bg-input/20',
          )}
          value={value as string}
          onChange={(event) => {
            onChange(event.target.value)
          }}
        >
          {question.required ? (
            <>
              <option value="" disabled className={optionClass}>
                Choose…
              </option>
              {question.options?.map((option) => (
                <option key={option} value={option} className={optionClass}>
                  {option}
                </option>
              ))}
            </>
          ) : (
            <>
              <option value="" className={optionClass}>
                Prefer not to say
              </option>
              {question.options?.map((option) => (
                <option key={option} value={option} className={optionClass}>
                  {option}
                </option>
              ))}
            </>
          )}
        </select>
      )
    }
    case 'multiselect': {
      const selected = Array.isArray(value)
        ? (value as unknown[]).filter(
            (item): item is string => typeof item === 'string',
          )
        : ([] as string[])
      const options = question.options ?? []
      const toggleOption = (option: string) => {
        if (selected.includes(option)) {
          onChange(selected.filter((item) => item !== option))
        } else {
          onChange([...selected, option])
        }
      }
      return (
        <div role="group" className="@container/multi flex flex-wrap gap-2">
          {options.map((option) => (
            <ToggleChip
              key={option}
              active={selected.includes(option)}
              onClick={() => {
                toggleOption(option)
              }}
            >
              {option}
            </ToggleChip>
          ))}
        </div>
      )
    }
    case 'radio': {
      return (
        <RadioGroupCard
          name={`question.${question.field}`}
          groupLabel={question.question}
          value={value as string}
          onChange={(next) => {
            onChange(next)
          }}
          options={question.options ?? []}
        />
      )
    }
    case 'checkbox': {
      const boolValue =
        typeof value === 'boolean' ? value : value === true || value === 'true'
      return (
        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            aria-invalid={invalid}
            aria-describedby={describedBy}
            checked={Boolean(boolValue)}
            onCheckedChange={(checked) => {
              onChange(checked === true)
            }}
          />
          <span className="text-xs/relaxed text-foreground">Yes</span>
        </label>
      )
    }
    case 'tags':
      return (
        <TagsAnswerFields
          question={question}
          value={value}
          onChange={onChange}
          invalid={invalid}
          describedBy={describedBy}
        />
      )
    case 'file': {
      const meta =
        typeof value === 'object' && value !== null && 'fileName' in value
          ? (value as { fileName?: string })
          : undefined
      return (
        <div className="grid gap-2">
          <label
            className={cn(
              'inline-flex cursor-pointer flex-col rounded-[10px] border border-dashed border-border px-3 py-6 text-xs outline-none ring-offset-background transition-colors hover:border-primary/50 hover:bg-muted/40 hover:text-foreground focus-within:ring-1 focus-within:ring-ring/40 text-muted-foreground',
              invalid &&
                'border-destructive/65 bg-destructive/15 text-destructive',
            )}
          >
            <input
              aria-invalid={invalid}
              aria-describedby={describedBy}
              type="file"
              accept={(question.acceptedFileTypes ?? []).join(',')}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.item(0)
                if (!file) {
                  onChange(null)
                  return
                }

                onChange({
                  fileName: file.name,
                  fileSize: file.size,
                  mimeType: file.type,
                })
              }}
            />
            <span className="text-muted-foreground text-xs/relaxed">
              Browse —{' '}
              {(meta?.fileName?.length ?? 0) > 0
                ? `Selected · ${meta?.fileName}`
                : '.pdf · .doc · .docx'}
            </span>
          </label>
        </div>
      )
    }
    default:
      return (
        <p className="text-destructive text-xs normal-case tracking-normal leading-relaxed font-sans font-normal">
          Unsupported onboarding control.
        </p>
      )
  }
}
