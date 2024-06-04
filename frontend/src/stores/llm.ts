import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ExpandedModel } from '../../../common/types/llm'
import { getModels } from '@/backend'

export const useLlmStore = defineStore('llm', () => {
  const models = ref([] as ExpandedModel[])

  function setModels(userModels: ExpandedModel[]) {
    models.value = userModels
  }

  async function updateModels() {
    let models = await getModels()

    if (models) setModels(models)
  }

  return { models, updateModels }
})
