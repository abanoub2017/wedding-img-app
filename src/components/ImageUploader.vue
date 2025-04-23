<template>
    <div class="flex flex-col items-center space-y-4">
        <input type="file" accept="image/*" @change="handleImageUpload" class="file-input hidden" ref="fileInput" />
        <div class="flex items-center justify-center w-full p-4 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
            @click="openFileInput" :class="{ 'opacity-50 cursor-wait': isLoading }">
            <div v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="text-gray-600 text-lg">Uploading...</p>
            </div>
            <p v-else class="text-gray-600 text-lg">Click to Upload Image</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WeedingManageServices from '@/services'

// Define the emit function to communicate with the parent component
const emit = defineEmits<{
    (event: 'image-upload', imgUrl: string): void
}>()
const props = defineProps<{
    uploaderName: string;
    weddingId?: string;
    // isLoading?: boolean;
}>();

const fileInput = ref<HTMLInputElement | null>(null)
const MAX_FILE_SIZE = 1024 * 1024; // 1 MB in bytes
const isLoading = ref(false)

function openFileInput() {
    fileInput.value?.click()
}

// Function to resize an image
function resizeImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate the new dimensions while maintaining aspect ratio
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round(height * (MAX_WIDTH / width));
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round(width * (MAX_HEIGHT / height));
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Convert to blob
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to Blob conversion failed'));
                        return;
                    }
                    // Create a new File object
                    const resizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    resolve(resizedFile);
                }, file.type, 0.8); // 0.8 quality to reduce file size
            };
        };
        reader.onerror = (error) => reject(error);
    });
}

async function handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file || !file.type.startsWith('image/')) {
        console.error('Invalid file type. Please upload an image.')
        return;
    }

    try {
        let fileToUpload = file;
        isLoading.value = true;
        // Check if file size is larger than MAX_FILE_SIZE
        if (file.size > MAX_FILE_SIZE) {
            fileToUpload = await resizeImage(file);
        }

        const weedingService = new WeedingManageServices();

        const response = await weedingService.uploadImage({
            file: fileToUpload,
            uploaderName: props.uploaderName.toLowerCase(),
            weddingId: props.weddingId
        });

        // The response should have url and id properties
        emit('image-upload', response.url)
    } catch (error) {
        console.error('Error uploading image:', error)
    } finally {
        isLoading.value = false
    }

    // Reset the file input value to allow re-uploading the same file
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}
</script>
<style scoped>
.file-input {
    display: none;
}
</style>
