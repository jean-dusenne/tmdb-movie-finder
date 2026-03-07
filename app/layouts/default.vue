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
        2026 - copy id and paste it in jellyfin to update movie metadata
      </el-footer>
    </el-container>
  </div>
</template>
