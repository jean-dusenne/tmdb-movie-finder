<script setup lang="ts">
import type { SearchQueryParams } from '#shared/models/SearchQueryParams'
import type { SearchMovieResponse } from '#shared/models/SearchMovieResponse'
import type { AutocompleteFetchSuggestions } from 'element-plus'
import type { MixedSearchResult } from '#shared/models/MixedSearchResult'

const searchUi = ref<string>('')
const searchForApi = ref<string>('')

const queryParams = computed<SearchQueryParams>(() => ({ query: searchForApi.value, include_adult: true, language: 'fr', page: 1 }))

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
</script>

<template>
  <div class="movies-search">
    <el-autocomplete
      v-model="searchUi"
      :trigger-on-focus="false"
      :fetch-suggestions="querySearchAsync"
      placeholder="Search for a movie..."
      @select="selectMovie"
    >
      <template #default="{ item }">
        <div class="suggestion-item">
          <span>{{ item.title ?? item.name }}</span>
          <div>
            <el-tag
              v-if="item.first_air_date"
              class="mr-2"
              type="primary"
            >
              TV
            </el-tag>
            <span class="release-date">({{ item.release_date ? item.release_date?.slice(0, 4) : item.first_air_date?.slice(0, 4) }})</span>
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

.release-date {
  font-size: 0.85rem;
  color: #909399;
  white-space: nowrap;
}

@media (max-width: 768px) {

  .suggestion-item {
    flex-direction: column;
    align-items: flex-start;
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
