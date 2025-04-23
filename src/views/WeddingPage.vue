<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ImageUploader from '../components/ImageUploader.vue'
import ImageGallery from '../components/ImageGallery.vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useToast } from 'vue-toastification'
import confetti from 'canvas-confetti'
import WeedingManageServices from '@/services'

const toast = useToast()
const weddingId = "wedding123"
const showModal = ref(false)
const guestName = ref('')
const images = ref<any[]>([])
const weedingService = new WeedingManageServices()




function startSharing() {
    if (!guestName.value.trim()) return

    // Save guest name to localStorage
    localStorage.setItem('wedding-guest-name', guestName.value)

    showModal.value = false
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    getImages()
}

// Get the images from api
async function getImages() {
    images.value = [] // Clear existing images
    // Call the API to get images
    try {
        const weddingImages = await weedingService.getAllImages(guestName.value, guestName.value)
        images.value = weddingImages
    } catch (error) {
        console.error("Error loading images:", error)
        toast.error("Failed to load images")
    }
}

// Update addImage to receive the full image data instead of just the URL
function addImage(imgUrl: string) {
    // Add image to local state for immediate UI update
    images.value.push({
        url: imgUrl,
        uploaderName: guestName.value,
        weddingId: weddingId
    })

    // No need to store in localStorage anymore as we're using the API
    toast.success('Image uploaded successfully!')
    getImages()
}
// Update removeImage to call the API
async function removeImage(index: number, id: string) {
    try {
        // Call API to delete the image
        await weedingService.deleteImage(id)

        // Remove from local state
        images.value.splice(index, 1)
        toast.info('Image removed')
        getImages()

    } catch (error) {
        console.error("Error deleting image:", error)
        toast.error("Failed to delete image")
    }
}

// Load images on component mount
onMounted(async () => {
    // Check if we have a saved guest name
    const savedName = localStorage.getItem('wedding-guest-name')
    if (savedName) {
        guestName.value = savedName
        showModal.value = false // Skip the modal if we already have the name
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
        await getImages()
    } else {
        showModal.value = true // Show the modal if no name is saved
    }
})
</script>

<template>
    <div class="min-h-screen bg-pink-50 p-4 relative">
        <div class="absolute inset-0 bg-image opacity-15 z-0"></div>
        <!-- Animated Modal -->
        <TransitionRoot appear :show="showModal" as="template">
            <Dialog as="div" class="relative z-50" @close="startSharing">
                <!-- Backdrop -->
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0"
                    enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
                </TransitionChild>

                <!-- Centered modal -->
                <div class="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                            <h3 class="text-xl font-bold mb-2 text-pink-600">Welcome to Fam & Monica's Wedding 🎉</h3>
                            <p class="text-gray-500 mb-4">Share your beautiful memories with them 💞</p>
                            <input v-model="guestName" type="text" placeholder="Enter your name"
                                @keyup.enter="startSharing"
                                class="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-300" />
                            <button @click="startSharing"
                                class="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition duration-300">
                                Start Sharing
                            </button>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>


        <!-- Main Content -->
        <div v-if="!showModal">
            <h1 class="text-2xl font-bold text-center mb-2">
                Hello {{ guestName }} 👋 – Let's Share Some Memories 📸
                <br>
                With Fam and Monica
            </h1>
            <!-- <ImageUploader @image-upload="addImage" /> -->
            <ImageUploader :uploaderName="guestName" weddingId="wedding123" @image-upload="addImage" />
            <ImageGallery :images="images" @delete="removeImage" />
        </div>
    </div>
</template>

<style scoped>
.bg-image {
    background-image: url('../assets/fam_bg.jpeg');
    /* Replace with your image path */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* Tailwind doesn't have opacity-15 by default, so we define it */
.opacity-15 {
    opacity: 0.15;
}
</style>
