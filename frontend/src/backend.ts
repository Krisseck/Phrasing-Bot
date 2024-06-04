import axios from 'axios'
import type { Generation } from '../../common/types/generation'
import type { ExpandedModel } from '../../common/types/llm'

export async function getGeneration(generationId: number): Promise<Generation | undefined> {
  let response = await axios.get('/api/get-generation/' + generationId.toString())

  if (response.data) {
    return response.data as Generation
  }

  return undefined
}

export async function startGeneration(prompt, model, type): Promise<number> {
  let response = await axios.post('/api/start-generation', {
    prompt,
    model,
    type
  })

  if (response.data?.generationId) {
    return response.data.generationId
  }

  return 0
}

export async function getModels(): Promise<ExpandedModel[] | undefined> {
  let response = await axios.get('/api/models')

  if (response.data) {
    return response.data as ExpandedModel[]
  }

  return undefined
}
