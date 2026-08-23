<script setup lang="ts">
const { statusCode } = defineProps<{
  statusCode: number | undefined
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const isNotFound = computed(() => statusCode === 404)
</script>

<template>
  <el-result
    class="media-details-error"
    :icon="isNotFound ? 'warning' : 'error'"
    :title="isNotFound ? t('media_not_found') : t('an_error_occured')"
    :sub-title="isNotFound ? t('media_not_found_subtitle') : t('media_error_subtitle')"
  >
    <template #extra>
      <NuxtLink :to="localePath('/')">
        <el-button plain>
          {{ t('back') }}
        </el-button>
      </NuxtLink>
    </template>
  </el-result>
</template>

<style scoped>
.media-details-error {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
