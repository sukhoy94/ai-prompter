import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase, getConfigById, updateConfig, deleteConfig } from '@/lib/db'
import type { PromptConfig } from '@/lib/types'

initializeDatabase()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const config = getConfigById(parseInt(id))

    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  try {
    const body = (await request.json()) as PromptConfig
    const id = parseInt(idStr)

    const updated = updateConfig(id, {
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

    if (!updated) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  try {
    const id = parseInt(idStr)
    const deleted = deleteConfig(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete configuration' },
      { status: 500 }
    )
  }
}
