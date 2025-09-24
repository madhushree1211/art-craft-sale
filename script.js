class ArtCraftApp {
    constructor() {
        this.products = [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProducts();
    }

    bindEvents() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });
        document.getElementById('searchBtn').addEventListener('click', () => {
            const query = document.getElementById('searchInput').value;
            this.searchProducts(query);
        });

        // Modal events
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.openModal();
        });
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submission
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('productModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    async loadProducts() {
        this.showLoading(true);
        try {
            const response = await fetch('/api/products');
            this.products = await response.json();
            this.renderProducts(this.products);
        } catch (error) {
            this.showToast('Error loading products', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async searchProducts(query) {
        this.showLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            this.showToast('Error searching products', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    renderProducts(products) {
        const grid = document.getElementById('productsGrid');
        
        if (products.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: white;">
                    <h2>🔍 No products found</h2>
                    <p>Try adjusting your search or add some products!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = products.map((product, index) => `
            <div class="product-card" style="animation-delay: ${index * 0.1}s">
                <img src="${product.image}" alt="${product.name}" class="product-image" 
                     onerror="this.src='https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop'">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <span class="product-category">${product.category}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-edit" onclick="app.editProduct(${product.id})">✏️ Edit</button>
                        <button class="btn btn-danger" onclick="app.deleteProduct(${product.id})">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openModal(product = null) {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('submitBtn');
        
        if (product) {
            title.textContent = 'Edit Product';
            submitBtn.textContent = 'Update Product';
            this.currentEditId = product.id;
            this.fillForm(product);
        } else {
            title.textContent = 'Add New Product';
            submitBtn.textContent = 'Add Product';
            this.currentEditId = null;
            this.clearForm();
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.clearForm();
        this.currentEditId = null;
    }

    fillForm(product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.image;
    }

    clearForm() {
        document.getElementById('productForm').reset();
    }

    async handleFormSubmit() {
        const formData = {
            name: document.getElementById('productName').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            price: parseFloat(document.getElementById('productPrice').value),
            category: document.getElementById('productCategory').value,
            image: document.getElementById('productImage').value.trim()
        };

        if (!formData.name || !formData.description || !formData.price || !formData.category) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        this.showLoading(true);
        
        try {
            let response;
            if (this.currentEditId) {
                response = await fetch(`/api/products/${this.currentEditId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                response = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }

            if (response.ok) {
                this.showToast(
                    this.currentEditId ? 'Product updated successfully!' : 'Product added successfully!',
                    'success'
                );
                this.closeModal();
                this.loadProducts();
            } else {
                throw new Error('Failed to save product');
            }
        } catch (error) {
            this.showToast('Error saving product', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.openModal(product);
        }
    }

    async deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        this.showLoading(true);
        
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showToast('Product deleted successfully!', 'success');
                this.loadProducts();
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            this.showToast('Error deleting product', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        spinner.style.display = show ? 'flex' : 'none';
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app
const app = new ArtCraftApp();
