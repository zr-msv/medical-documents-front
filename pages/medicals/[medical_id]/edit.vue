<template>
    <div class="max-w-md mx-auto p-4 space-y-4">
        <div class="text-lg font-bold text-right border-b pb-2">اطلاعات مدارک پزشکی</div>

        <div class="space-y-2">
            <input
                v-model="form.title"
                type="text"
                placeholder="عنوان بیماری یا مدرک پزشکی"
                class="w-full p-3 border rounded-lg text-right"
            />
            <textarea
                v-model="form.description"
                placeholder="توضیحات خودتون رو اینجا بنویسید"
                class="w-full p-3 border rounded-lg text-right"
            />
            <input
                v-model="form.date"
                type="date"
                class="w-full p-3 border rounded-lg text-right"
            />
        </div>

        <div class="mt-4 space-y-2">
            <div class="font-semibold text-right">بارگذاری مدرک پزشکی</div>
            <div
                class="border border-dashed border-green-400 bg-green-50 p-4 rounded-lg text-center cursor-pointer"
                @click="pickFiles"
            >
                <span class="text-green-700 font-semibold">انتخاب فایل</span>
                <input type="file" multiple class="hidden" ref="fileInput" @change="handleFiles" />
            </div>

            <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between bg-green-100 p-2 rounded-md">
                <div class="text-right text-sm truncate w-4/5">{{ file.name }}</div>
                <div class="flex gap-2">
                    <button class="text-blue-600" @click="viewFile(file)">🔍</button>
                    <button class="text-red-600" @click="removeFile(index)">🗑️</button>
                </div>
            </div>
        </div>

        <button
            @click="submitForm"
            class="w-full bg-green-500 text-white py-2 rounded-lg font-bold"
        >
            ثبت
        </button>
    </div>
</template>

<script setup>
import { ref,onMounted  } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const documentId = route.params.medical_id



const form = ref({
    title: '',
    description: '',
    date: '',
})

const files = ref([])
const fileInput = ref(null)

const pickFiles = () => {
    fileInput.value.click()
}

const handleFiles = (e) => {
    files.value = [...files.value, ...Array.from(e.target.files)]
}

const removeFile = (index) => {
    files.value.splice(index, 1)
}

const viewFile = (file) => {
    const url = URL.createObjectURL(file)
    window.open(url, '_blank')
}

onMounted(async () => {
    const res = await fetch(`http://localhost/api/medical-documents/${documentId}`)
    const data = await res.json()

    form.value.title = data.title
    form.value.description = data.description
    form.value.date = data.date

})
    const submitForm = async () => {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('description', form.value.description)
    formData.append('date', form.value.date)
    files.value.forEach((file) => {
        formData.append('files[]', file)
    })
    formData.append('_method', 'PUT')

    try {
        const res = await fetch(`http://localhost:8000/api/medical-documents/${documentId}`, {
            method: 'POST',
            body: formData,
        })
        const data = await res.json()
        alert('با موفقیت ویرایش شد!')
    } catch (error) {
        console.error('خطا در ویرایش:', error)
        alert('ویرایش انجام نشد.')
    }
}
</script>

<style scoped>
</style>
