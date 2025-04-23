<template>
    <div class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2">
        <TransitionGroup name="fade" tag="div" class="contents">
            <div v-for="(img, index) in images" :key="img"
                class="relative group w-full aspect-square rounded-lg overflow-hidden shadow-md bg-white">
                <!-- Image with hover zoom -->
                <img :src="img?.url" alt="Uploaded"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

                <!-- Floating 'X' button -->
                <button @click="$emit('delete', index, img._id)"
                    class="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-300">
                    ✕
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    images: any
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
