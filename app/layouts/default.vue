<script setup lang="ts">
const year = new Date().getFullYear()
const { t } = useI18n()
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="app-header">
        {{ t('application_title') }}
      </el-header>
      <el-main class="app-main">
        <slot />
      </el-main>
      <el-footer class="app-footer">
        {{ year }} - {{ t('resources') }}
        <NuxtLink
          href="https://jellyfin.org"
          target="_blank"
          rel="noopener"
        >
          Jellyfin
        </NuxtLink>
        -
        <NuxtLink
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener"
        >
          TMDB
        </NuxtLink>
      </el-footer>
    </el-container>
  </div>
</template>
