document.addEventListener('DOMContentLoaded', function() {
            // Type selector handling
            const typeOptions = document.querySelectorAll('.type-option');
            typeOptions.forEach(option => {
                option.addEventListener('click', function() {
                    typeOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });

            // Image upload handling
            const uploadArea = document.getElementById('uploadArea');
            const imageInput = document.getElementById('imageInput');
            const imagePreview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            const removeImage = document.getElementById('removeImage');

            uploadArea.addEventListener('click', () => imageInput.click());

            imageInput.addEventListener('change', function(e) {
                handleImageUpload(e.target.files[0]);
            });

            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    handleImageUpload(file);
                }
            });

            function handleImageUpload(file) {
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImg.src = e.target.result;
                        imagePreview.classList.add('active');
                        uploadArea.style.display = 'none';
                    };
                    reader.readAsDataURL(file);
                }
            }

            removeImage.addEventListener('click', function() {
                imagePreview.classList.remove('active');
                uploadArea.style.display = 'block';
                imageInput.value = '';
                previewImg.src = '';
            });

            // Form submission
            const form = document.getElementById('addProductForm');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    type: document.querySelector('input[name="offerType"]:checked').value,
                    name: document.getElementById('productName').value,
                    category: document.getElementById('category').value,
                    description: document.getElementById('description').value,
                    price: document.getElementById('price').value,
                    stock: document.getElementById('stock').value
                };

                console.log('Form Data:', formData);

                // Show success notification
                showNotification('¡Producto/Servicio agregado exitosamente!', 'success');

                // Redirect after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'mis_productos_proveedor.html';
                }, 1500);
            });
        });

        // Notification System
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: ${type === 'success' ? '#2196F3' : '#FF5252'};
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);