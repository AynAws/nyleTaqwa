const { createApp, ref, computed, onMounted } = Vue

createApp({
  setup() {
    const products = ref([])
    const selectedCategory = ref('all')
    const categories = ref(['all', 'hoodies', 'shirts', 'accessories'])

    const dropdownOpen = ref(false)

    const toggleDropdown = () => {
        dropdownOpen.value = !dropdownOpen.value
    }

    const selectCategory = (cat) => {
        selectedCategory.value = cat
        dropdownOpen.value = false // close the dropdown
    }

    const filteredProducts = computed(() => {
        if (selectedCategory.value === 'all') return products.value
        return products.value.filter(p => p.category === selectedCategory.value)
    })

    const formatLabel = (val) => val.charAt(0).toUpperCase() + val.slice(1)

    onMounted(async () => {
        const res = await fetch('/products.json')
        products.value = await res.json()
    })

    const hoveredProductId = ref(null)

    const setHovered = (id) => {
      hoveredProductId.value = id
    }

    const clearHovered = () => {
      hoveredProductId.value = null
    }

    return {
        products,
        selectedCategory,
        categories,
        filteredProducts,
        formatLabel,
        dropdownOpen,
        toggleDropdown,
        selectCategory,
        hoveredProductId,
        setHovered,
        clearHovered
    }
},
    template: `
<div class="container">
  <div class="filter-bar">
    <!-- Left: Pills -->
    <div class="filter-pills">
      <button v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              :class="['pill', selectedCategory === cat ? 'active' : '']">
        {{ formatLabel(cat) }}
      </button>
    </div>

    <!-- Right: Dropdown + Products -->
    <div class="right-panel">
          <div class="filter-dropdown-container">
            <div class="dropdown-button" @click="toggleDropdown">
              {{ formatLabel(selectedCategory) }}
            </div>
            <div class="filter-dropdown" :class="{ show: dropdownOpen }">
              <div 
                v-for="cat in categories" 
                :key="cat" 
                class="dropdown-option"
                @click="selectCategory(cat)">
                {{ formatLabel(cat) }}
              </div>
            </div>
          </div>

      <section class="product-section">
        <div v-for="product in filteredProducts" :key="product.id" class="card">
          <h4>{{ product.name }}</h4>
          <img
            :src="hoveredProductId === product.id ? product.image2 : product.image"
            :alt="product.name"
            @mouseenter="setHovered(product.id)"
            @mouseleave="clearHovered"
          />
          <p>${"$"}{{ product.price }}.00 USD</p>
        </div>
      </section>
    </div>
  </div>
</div>
`
}).mount('#app')