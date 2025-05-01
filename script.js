const { createApp, ref, computed, onMounted } = Vue

createApp({
    setup() {
        const products = ref([])
        const selectedCategory = ref('all')
        const categories = ref(['all', 'hoodies', 'shirts', 'accessories']) // Optional: compute dynamically

        const filteredProducts = computed(() => {
            if (selectedCategory.value === 'all') return products.value
            return products.value.filter(p => p.category === selectedCategory.value)
        })

        const formatLabel = (val) => val.charAt(0).toUpperCase() + val.slice(1)

        onMounted(async () => {
            const res = await fetch('/products.json')
            products.value = await res.json()
        })

        return {
            products,
            selectedCategory,
            categories,
            filteredProducts,
            formatLabel
        }
    },
    template: `
    <div class="container">
        <div class="filter-bar">
            <div class="filter-pills">
                <button v-for="cat in categories"
                        :key="cat"
                        @click="selectedCategory = cat"
                        :class="['pill', selectedCategory === cat ? 'active' : '']">
                    {{ formatLabel(cat) }}
                </button>
            </div>
            <select class="filter-dropdown" v-model="selectedCategory">
                <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ formatLabel(cat) }}
                </option>
            </select>
        </div>
        <section class="product-section">
            <div v-for="product in filteredProducts" :key="product.id" class="card">
                <img :src="product.image" :alt="product.name" />
                <p>{{ product.name }}</p>
            </div>
        </section>
    </div>
    `
}).mount('#app')