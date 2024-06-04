<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="container mb-6 mt-6">
      <div class="columns">
        <div class="column is-one-quarter">
          <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
        </div>
        <div class="column is-three-quarters">
          <h1 class="title is-2">Grammar & phrasing tool</h1>
        </div>
      </div>
    </div>
  </header>

  <RouterView />
</template>
