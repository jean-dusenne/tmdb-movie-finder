<script setup lang="ts">
import type { SearchQueryParams } from '#shared/models/SearchQueryParams'
import type { SearchMovieResponse } from '#shared/models/SearchMovieResponse'
import type { AutocompleteFetchSuggestions } from 'element-plus'
import type { MixedSearchResult } from '#shared/models/MixedSearchResult'

const searchUi = ref<string>('')
const searchForApi = ref<string>('')

const { t, localeProperties } = useI18n()

const queryParams = computed<SearchQueryParams>(() => ({ query: searchForApi.value, include_adult: true, language: localeProperties.value.language, page: 1 }))

const { data, refresh } = await useFetch<SearchMovieResponse>('/api/multi', { query: queryParams, immediate: false, watch: false })

const emit = defineEmits(['movieSelected'])

const debouncedFetch = useDebounceFn(async (queryString: string, cb: (data: MixedSearchResult[]) => void) => {
  searchForApi.value = queryString
  await refresh()
  cb((data.value?.results ?? []) as MixedSearchResult[])
}, 300)

const querySearchAsync: AutocompleteFetchSuggestions = (queryString, cb) => {
  searchUi.value = queryString
  debouncedFetch(queryString, cb as (data: MixedSearchResult[]) => void)
}

const selectMovie = (item: Record<string, unknown>) => {
  emit('movieSelected', item)
}

const formatDate = (item: Record<string, unknown>) => {
  const dateString = (item.release_date ?? item.first_air_date) as string | undefined
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString(localeProperties.value.language, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
</script>

<template>
  <div class="movies-search">
    <el-autocomplete
      v-model="searchUi"
      :trigger-on-focus="false"
      :fetch-suggestions="querySearchAsync"
      :placeholder="t('search_for_a_movie')"
      @select="selectMovie"
    >
      <template #default="{ item }">
        <div class="suggestion-item">
          <span
            class="movie-name"
            :title="(item.title ?? item.name) as string"
          >{{ item.title ?? item.name }}</span>
          <div class="meta">
            <el-tag
              v-if="item.first_air_date"
              class="mr-2"
              type="primary"
            >
              {{ t('tv') }}
            </el-tag>
            <span class="release-date">({{ formatDate(item) }})</span>
          </div>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<style scoped>
.movies-search {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.movie-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.meta {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.release-date {
  font-size: 0.85rem;
  color: #909399;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .suggestion-item {
    gap: 0.5rem;
  }

  .release-date {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .suggestion-item {
    font-size: 0.9rem;
  }

  .release-date {
    font-size: 0.75rem;
  }
}
</style>
