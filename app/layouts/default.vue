<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="app-header">
        TMDB movie finder
      </el-header>
      <el-main class="app-main">
        <slot />
      </el-main>
      <el-footer class="app-footer">
        {{ year }} - Resources:
        <a
          href="https://jellyfin.org"
          target="_blank"
          rel="noopener"
        >
          Jellyfin
        </a>
        — data from
        <a
          href="https://www.themoviedb.org/documentation/api"
          target="_blank"
          rel="noopener"
        >
          TMDB API
        </a>
      </el-footer>
    </el-container>
  </div>
</template>
