<template>
    <div class="max-w-2xl mx-auto p-4 space-y-4">
        <h1 class="text-2xl font-bold text-right border-b pb-2">لیست مدارک پزشکی</h1>

        <div v-if="loading" class="text-center text-gray-500">در حال بارگذاری...</div>

        <div v-else-if="documents.length === 0" class="text-center text-gray-500">مدرکی یافت نشد.</div>

        <div v-else class="space-y-2">
            <div
                    v-for="doc in documents"
                    :key="doc.id"
                    class="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    @click="goToEdit(doc.id)"
            >
                <div class="text-right">
                    <div class="font-semibold text-lg">{{ doc.title }}</div>
                    <div class="text-sm text-gray-600">{{ doc.date }}</div>
                </div>
                <div class="text-gray-400">✏️</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const documents = ref([])
const loading = ref(true)
const router = useRouter()

onMounted(async () => {
  try {
    const res = await fetch('http://localhost/api/medical-documents')
    const data = await res.json()
    documents.value = data.data
  } catch (err) {
    console.error('خطا در گرفتن اطلاعات:', err)
  } finally {
    loading.value = false
  }
})

const goToEdit = (id) => {
  router.push(`/medicals/${id}/edit/`)
}
</script>
