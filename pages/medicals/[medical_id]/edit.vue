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
                v-model="form.record_date"
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

            <div
                v-for="(file, index) in files"
                :key="index"
                class="flex items-center justify-between bg-green-100 p-2 rounded-md"
            >
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const documentId = route.params.medical_id

const form = ref({
    title: '',
    description: '',
    record_date : '',
})

const files = ref([])
const fileInput = ref(null)

const pickFiles = () => {
    fileInput.value.click()
}

const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        file,
        isNew: true
    }))
    files.value.push(...selectedFiles)
}

const removeFile = async (index) => {
    const file = files.value[index]

    if (!file.isNew && file.id) {
        try {
            await fetch(`http://localhost:8000/api/medical-files/${file.id}`, {
                method: 'DELETE',
            })
        } catch (error) {
            alert('خطا در حذف فایل از سرور')
            return
        }
    }

    files.value.splice(index, 1)
}

const viewFile = (file) => {
    if (file.isNew) {
        const url = URL.createObjectURL(file.file)
        window.open(url, '_blank')
    } else {
        window.open(file.url, '_blank')
    }
}

onMounted(async () => {
    const res = await fetch(`http://localhost:8000/api/medical-documents/${documentId}`)
    const json = await res.json()
    const data = json.data

    form.value.title = data.title
    form.value.description = data.description
    form.value.record_date  = data.record_date

    if (data.files) {
        files.value = data.files.map(file => ({
            id: file.id,
            name: file.original_name,
            url: file.file_path,
            isNew: false
        }))
    }
})

const submitForm = async () => {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('description', form.value.description)
    formData.append('record_date', form.value.record_date?.trim() || '')

    for (const file of files.value) {
        if (file.isNew && file.file instanceof File) {
            formData.append('files[]', file.file)
        }
    }

    try {
        const res = await fetch(`http://localhost:8000/api/medical-documents/${documentId}`, {
            method: 'POST',
            headers: {
                'X-HTTP-Method-Override': 'PUT',
            },
            body: formData,
        })

        if (!res.ok) {
            const errorData = await res.json()
            console.error('Server Validation Errors:', errorData)
            alert(`خطا در ارسال: ${JSON.stringify(errorData, null, 2)}`)
        } else {
            const data = await res.json()
            alert('با موفقیت ویرایش شد!')
        }
    } catch (error) {
        console.error('خطا در ویرایش:', error)
        alert('ارتباط با سرور برقرار نشد.')
    }
}
</script>

<style scoped>
</style>
