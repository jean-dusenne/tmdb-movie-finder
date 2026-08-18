<script setup lang="ts">
const year = new Date().getFullYear()
const { t } = useI18n()
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="app-header">
        <span class="app-title">{{ t('application_title') }}</span>
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

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.app-title {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff6e9;
  text-shadow:
    0 0 2px #f9a23c,
    0 0 6px rgba(249, 162, 60, 0.6),
    0 0 12px rgba(249, 162, 60, 0.35);
}

@media (max-width: 480px) {
  .app-title {
    font-size: 1.15rem;
  }
}
</style>
