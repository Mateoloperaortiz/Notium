<script setup lang="ts">
import { ref } from 'vue'

import EditSubject from '@/components/subjects/EditSubject.vue'
import SubjectsOverview from '@/components/subjects/SubjectsOverview.vue'
import type { Subject } from '@/models'

const creating = ref(false)
const editing = ref<Subject | null>(null)

function showCreateSubject(): void {
  editing.value = null
  creating.value = true
}

function showEditSubject(subject: Subject): void {
  editing.value = subject
  creating.value = false
}

function showOverview(): void {
  creating.value = false
  editing.value = null
}
</script>

<template>
  <EditSubject
    v-if="creating || editing !== null"
    :subject="editing"
    @cancel="showOverview"
    @created="showOverview"
    @updated="showOverview"
  />
  <SubjectsOverview v-else @create="showCreateSubject" @edit="showEditSubject" />
</template>
