import { createApp, ref, computed, onMounted } from 'vue'

createApp({
    setup() {
        const products = ref([])
        const selectedCategory = ref('all')
        const categories = ref(['all', 'hoodies', 'shirts', 'accessories']) // compute dynamically?
        const filteredProducts = computed(() => {
            if (selectedCategory.value === 'all') return products.value
            return products.value.filter(p => p.category === selectedCategory.value)
        })
        const formatLabel = (val) => val.charAt(0).toUpperCase() + val.slice(1)
        onMounted(async () => {
            const res = await fetch('/products.json')
            products.value = await res.json()
        })
        return { products, selectedCategory, categories, filteredProducts, formatLabel }
    },
    template: `
    <div class="container">
        <div class="filter-bar">
            <!-- Pills on desktop -->
            <div class="filter-pills">
                <button v-for="cat in categories"
                    :key="cat"
                    @click="selectedCategory = cat"
                    :class="['pill', selectedCategory === cat ? 'active' : '']">
                {{ formatLabel(cat) }}
    `
})