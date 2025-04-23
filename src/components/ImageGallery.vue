<template>
    <div class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2">
        <TransitionGroup name="fade" tag="div" class="contents">
            <div v-for="(img, index) in images" :key="img"
                class="relative group w-full aspect-square rounded-lg overflow-hidden shadow-md bg-white">
                <template v-if="deletingImageIds.includes(img._id)">
                    <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                        <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </div>
                </template>
                <template v-else>
                    <!-- Image with hover zoom -->
                    <img :src="img?.url" alt="Uploaded"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

                    <!-- Floating 'X' button -->
                    <button @click="$emit('delete', index, img._id)"
                        class="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-300">
                        ✕
                    </button>
                </template>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    images: any,
    deletingImageIds: any
}>()

defineEmits(['delete'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
