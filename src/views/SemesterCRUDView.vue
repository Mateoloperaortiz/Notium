<script setup lang="ts">
import { ref } from 'vue'

import CreateSemester from '@/components/semesters/EditSemester.vue'
import SemestersOverview from '@/components/semesters/SemestersOverview.vue'
import type { Semester } from '@/models'

const creating = ref(false)
const editing = ref<Semester | null>(null)

function showCreateSemester(): void {
  editing.value = null
  creating.value = true
}

function showEditSemester(semester: Semester): void {
  editing.value = semester
  creating.value = false
}

function showOverview(): void {
  creating.value = false
  editing.value = null
}
</script>

<template>
  <CreateSemester
    v-if="creating || editing !== null"
    :semester="editing"
    @cancel="showOverview"
    @created="showOverview"
    @updated="showOverview"
  />
  <SemestersOverview v-else @create="showCreateSemester" @edit="showEditSemester" />
</template>
