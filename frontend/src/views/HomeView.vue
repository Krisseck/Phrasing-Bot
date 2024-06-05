<template>
  <main class="container">
    <div class="columns">
      <div class="column is-two-thirds">
        <div class="tabs is-toggle is-medium">
          <ul>
            <li v-for="key in Object.keys(promptTypes)" v-bind:key="key" :value="key" :class="{ 'is-active': key === chosenType }">
              <a @click="chosenType = key">{{ promptTypes[key].name }}</a>
            </li>
          </ul>
        </div>
        <div class="field mb-5 mt-5" v-if="chosenType === 'GRAMMAR_PHRASING'">
          <label class="label">Style</label>
          <div class="control">
            <div class="select">
              <select v-model="chosenStyle">
                <option v-for="key in Object.keys(styles)" v-bind:key="key" :value="key">
                  {{ styles[key].name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Model</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="chosenModel">
                    <option v-for="model in llmStore.models" v-bind:key="model.id" :value="model.id">
                      {{ model.id }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <label class="label">Input</label>
        <div class="control">
          <textarea
            v-model="inputTextarea"
            class="textarea"
            rows="15"
            @change="updateTokenCount"
            tabindex="1"
          ></textarea>
        </div>
      </div>
      <div class="column">
        <label class="label">Output</label>
        <div class="control" :class="{ 'is-loading is-large': generationIsLoading }">
          <textarea
            v-model="outputTextarea"
            class="textarea"
            rows="15"
            :disabled="generationIsLoading"
            tabindex="3"
          ></textarea>
        </div>
      </div>
      <div class="column">
        <label class="label">Diff</label>
        <div id="diff-container" class="whitesp">
          <span
            v-for="(diffItem, index) in diffOutput"
            :key="index"
            :class="{ 'has-text-success': diffItem.added, 'has-text-danger': diffItem.removed }"
          >
            {{ diffItem.value }}
          </span>
        </div>
      </div>
    </div>
    <p class="content">Tokens used (estimate): {{ tokenCount }}</p>
    <p class="content mt-5">
      <button
        class="button is-primary is-medium"
        v-on:click="submitPrompt"
        :disabled="inputTextarea.length === 0 || generationIsLoading || !modelsLoaded"
        tabindex="2"
      >
        Submit
      </button>
    </p>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { get_encoding } from 'tiktoken'
import getDiffArray from '@/diff'
import type { DiffItem } from '@/diff'

import { useLlmStore } from '@/stores/llm'
const llmStore = useLlmStore()

import type { ExpandedModel } from '../../../common/types/llm'
import type { Generation } from '../../../common/types/generation'

import { promptTypes } from '../../../common/prompt-types'
import { styles } from '../../../common/styles'
import { getGeneration, startGeneration } from '@/backend'

const inputTextarea = ref(
  'Try pressing "Submit" and see how the LLM will fix the grammar and phrasing of your prompt.'
)
const outputTextarea = ref('')
const tokenCount = ref(0)
const generationIsLoading = ref(false)
const modelsLoaded = ref(false)
const diffOutput = ref([] as DiffItem[])
const chosenModel = ref('')
const chosenType = ref('GRAMMAR_PHRASING')
const chosenStyle = ref('NATURAL')
let generationId = 0

const submitPrompt = async () => {
  generationIsLoading.value = true
  outputTextarea.value = ''
  diffOutput.value = []
  generationId = await startGeneration(inputTextarea.value, chosenModel.value, chosenType.value, chosenStyle.value)
  // Wait a moment before polling for the first time
  await new Promise((r) => setTimeout(r, 1000))
  await pollResults()
}

const pollResults = async () => {
  while (generationIsLoading.value) {
    let generationData: Generation | undefined = await getGeneration(generationId)

    if (generationData) {
      outputTextarea.value = generationData.output
      if (generationData.done) {
        generationIsLoading.value = false
        diffOutput.value = getDiffArray(inputTextarea.value, outputTextarea.value)
      }
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 2000))
  }
}

const updateTokenCount = () => {
  const encoding = get_encoding('cl100k_base')
  tokenCount.value = encoding.encode(inputTextarea.value).length
}

const initializeModels = async () => {
  await llmStore.updateModels()

  for (let model of llmStore.models as ExpandedModel[]) {
    if (model.default) {
      chosenModel.value = model.id
    }
  }

  modelsLoaded.value = true
}

initializeModels()
</script>

<style lang="scss">
#diff-container {
  white-space: pre-line;
}
</style>
