export interface PromptConfig {
  id?: number
  name: string
  role: string
  prompt: string
  prompt_language: string
  response_language: string
  max_tokens: number
  focus: string
  modify_files: boolean
  plan_first: boolean
  run_commands: boolean
  make_commit: boolean
  mention_ai: boolean
  created_at?: string
  updated_at?: string
}
