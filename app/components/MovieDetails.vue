<script setup lang="ts">
import { CopyDocument, SuccessFilled, Star } from '@element-plus/icons-vue'
import type { MixedSearchResult } from '#shared/models/MixedSearchResult'

const { item } = defineProps<{ item: MixedSearchResult }>()

const posterPath = computed(() => {
  return item.poster_path
    ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
    : ''
})

const { copy } = useClipboard()
const isCopied = ref(false)

const copyId = async () => {
  await copy(String(item.id))
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <div class="movie-details">
    <div class="movie-header">
      <el-image
        class="movie-poster"
        :src="posterPath"
        fit="cover"
      />
      <div class="movie-info">
        <h1 class="movie-title">
          {{ item.media_type === "tv" ? item.name : item.title }}
        </h1>
        <p class="movie-original-title">
          {{ item.original_title }}
        </p>
        <div class="movie-meta">
          <el-tag
            v-if="item.media_type === 'tv'"
            type="primary"
          >
            TV
          </el-tag>
          <el-tag>
            {{ item.original_language?.toUpperCase() }}
          </el-tag>
          <el-tag
            type="info"
            class="rating-tag"
          >
            <span class="rating-content"><el-icon><Star /></el-icon>
              {{ item.vote_average?.toFixed(1) }}</span>
          </el-tag>
          <el-tag
            v-if="item.adult"
            type="danger"
          >
            18+
          </el-tag>
        </div>
        <p class="movie-overview">
          {{ item.overview }}
        </p>

        <div class="id-copy-block">
          <div class="id-label">
            ID
          </div>
          <div class="id-content">
            <span class="id-value">
              {{ item.id }}
            </span>
            <el-popover
              :visible="isCopied"
              :content="`${item.title} ID (${item.id}) copied to clipboard!`"
              placement="top"
              :width="200"
            >
              <template #reference>
                <el-button
                  :icon="isCopied ? SuccessFilled : CopyDocument"
                  circle
                  @click="copyId"
                />
              </template>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.movie-header {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  align-items: start;
}

.movie-poster {
  width: 200px;
  height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.movie-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.movie-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  color: #303133;
}

.movie-original-title {
  margin: 0;
  font-size: 0.95rem;
  color: #909399;
  font-style: italic;
}

.movie-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.movie-meta :deep(.el-tag) {
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.rating-tag {
  white-space: nowrap !important;
}

.rating-content {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.movie-overview {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #606266;
  max-height: 120px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.id-copy-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background-color: #f5f7fa;
  margin-top: 1rem;
}

.id-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #909399;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: fit-content;
}

.id-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: space-between;
  flex: 1;
}

.id-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #303133;
}

@media (max-width: 768px) {
  .movie-header {
    grid-template-columns: 150px 1fr;
    gap: 1rem;
  }

  .movie-poster {
    width: 150px;
    height: 225px;
  }

  .movie-title {
    font-size: 1.5rem;
  }

  .movie-details {
    padding: 1rem;
    max-width: 100%;
  }
}
</style>
