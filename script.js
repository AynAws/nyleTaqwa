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
      loadCart()
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

    const cart = ref([])

    const loadCart = () => {
      const saved = localStorage.getItem('cart')
      cart.value = saved ? JSON.parse(saved) : []
    }

    const saveCart = () => {
      localStorage.setItem('cart', JSON.stringify(cart.value))
    }

    const addToCart = (product) => {
      const existing = cart.value.find(item => item.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        cart.value.push({ ...product, quantity: 1 })
      }
      saveCart()
    }

    const removeFromCart = (productId) => {
      cart.value = cart.value.filter(item => item.id !== productId)
      saveCart()
    }

    const updateQuantity = (productId, qty) => {
      const item = cart.value.find(i => i.id === productId)
      if (item) {
        item.quantity = qty
        if (item.quantity <= 0) removeFromCart(productId)
        saveCart()
      }
    }

    const totalPrice = computed(() =>
      cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    )

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
        clearHovered,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice
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