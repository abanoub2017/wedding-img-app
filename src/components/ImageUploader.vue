<template>
    <div class="flex flex-col items-center space-y-4">
        <input type="file" accept="image/*" @change="handleImageUpload" class="file-input hidden" ref="fileInput" />
        <div class="flex items-center justify-center w-full p-4 border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
            @click="openFileInput">
            <p class="text-gray-600 text-lg">Click to Upload Image</p>
        </div>
    </div>
</template>

<!-- <script setup lang="ts">
import { ref } from 'vue'
import WeedingManageServices from '@/services'

// Define the emit function to communicate with the parent component
const emit = defineEmits<{
    (event: 'image-upload', imgUrl: string): void
}>()
const props = defineProps<{
    uploaderName: string;
    weddingId?: string;
}>();

const fileInput = ref<HTMLInputElement | null>(null)

function openFileInput() {
    fileInput.value?.click()
}
function handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file && file.type.startsWith('image/')) {
        const weedingService = new WeedingManageServices();

        weedingService.uploadImage({
            file,
            uploaderName: props.uploaderName,
            weddingId: props.weddingId
        })
            .then((response) => {
                // The response should have url and id properties
                emit('image-upload', response.url)
            })
            .catch((error: any) => {
                console.error('Error uploading image:', error)
            })
    }
    else {
        console.error('Invalid file type. Please upload an image.')
    }

    // Reset the file input value to allow re-uploading the same file
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}


</script> -->
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
}>();

const fileInput = ref<HTMLInputElement | null>(null)
const MAX_FILE_SIZE = 1024 * 1024; // 1 MB in bytes

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

        // Check if file size is larger than MAX_FILE_SIZE
        if (file.size > MAX_FILE_SIZE) {
            console.log(`File size is ${file.size / (1024 * 1024)} MB. Resizing...`);
            fileToUpload = await resizeImage(file);
            console.log(`Resized to ${fileToUpload.size / (1024 * 1024)} MB`);
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
