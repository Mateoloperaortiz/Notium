<script setup lang="ts">
import { ref } from 'vue'

import EditGrades from '@/components/grades/EditGrades.vue'
import GradesOverview from '@/components/grades/GradesOverview.vue'
import type { Grade } from '@/models'

const creating = ref(false)
const editing = ref<Grade | null>(null)

function showCreateGrade(): void {
  editing.value = null
  creating.value = true
}

function showEditGrade(grade: Grade): void {
  editing.value = grade
  creating.value = false
}

function showOverview(): void {
  creating.value = false
  editing.value = null
}
</script>

<template>
  <EditGrades
    v-if="creating || editing !== null"
    :grade="editing"
    @cancel="showOverview"
    @created="showOverview"
    @updated="showOverview"
  />
  <GradesOverview v-else @create="showCreateGrade" @edit="showEditGrade" />
</template>
