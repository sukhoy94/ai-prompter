import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase, getAllConfigs, createConfig } from '@/lib/db'
import type { PromptConfig } from '@/lib/types'

initializeDatabase()

export async function GET() {
  try {
    const configs = getAllConfigs()
    return NextResponse.json(configs)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch configurations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PromptConfig

    const config = createConfig({
      name: body.name,
      role: body.role,
      prompt: body.prompt,
      prompt_language: body.prompt_language,
      response_language: body.response_language,
      max_tokens: body.max_tokens,
      focus: body.focus,
      modify_files: body.modify_files,
      plan_first: body.plan_first,
      run_commands: body.run_commands,
      make_commit: body.make_commit,
      mention_ai: body.mention_ai,
    })

    return NextResponse.json(
      { id: config.id },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create configuration' },
      { status: 500 }
    )
  }
}
