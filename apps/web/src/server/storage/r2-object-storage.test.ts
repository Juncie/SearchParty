import { describe, expect, it } from 'vitest'

import { describeR2OperationFailure } from './r2-object-storage'

describe('describeR2OperationFailure', () => {
  it('summarizes invalid credentials', () => {
    const msg = describeR2OperationFailure('presignPut', {
      name: 'InvalidAccessKeyId',
      message: 'The AWS Access Key Id you provided does not exist in our records.',
      $metadata: { httpStatusCode: 403, requestId: 'abc' },
    })
    expect(msg).toContain('presignPut')
    expect(msg).toContain('credentials')
    expect(msg).toContain('Request ID: abc')
  })

  it('summarizes network-style failures', () => {
    const msg = describeR2OperationFailure('HeadObject', {
      name: 'Error',
      message: 'getaddrinfo ENOTFOUND fake.r2.cloudflarestorage.com',
    })
    expect(msg).toContain('network')
  })

  it('falls back to a concise SDK message', () => {
    const msg = describeR2OperationFailure('DeleteObject', {
      name: 'SlowDown',
      message: 'Please reduce your request rate.',
      $metadata: { httpStatusCode: 503 },
    })
    expect(msg).toContain('DeleteObject')
    expect(msg).toContain('SlowDown')
  })
})
