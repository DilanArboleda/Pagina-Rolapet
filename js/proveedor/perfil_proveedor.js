document.addEventListener('DOMContentLoaded', function() {
            console.log('Provider Profile Page Loaded');
            
            // Edit Profile Information Handler
            const editProfileBtn = document.getElementById('editProfileBtn');
            let isEditing = false;
            
            editProfileBtn.addEventListener('click', function() {
                if (!isEditing) {
                    // Enter edit mode
                    enableEditMode();
                    editProfileBtn.innerHTML = '<span class="material-symbols-outlined">save</span>Guardar Cambios';
                    isEditing = true;
                } else {
                    // Save changes
                    saveChanges();
                    editProfileBtn.innerHTML = '<span class="material-symbols-outlined">edit</span>Editar Información';
                    isEditing = false;
                }
            });
            
            function enableEditMode() {
                const detailValues = document.querySelectorAll('.detail-value');
                detailValues.forEach(field => {
                    const fieldName = field.getAttribute('data-field');
                    if (fieldName && fieldName !== 'date') {
                        const currentValue = field.textContent.trim();
                        const isBio = field.classList.contains('bio');
                        
                        if (isBio) {
                            field.innerHTML = `<textarea style="width: 100%; min-height: 100px; padding: 12px; border: 2px solid #2196F3; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; color: #666666; resize: vertical;">${currentValue}</textarea>`;
                        } else {
                            field.innerHTML = `<input type="text" value="${currentValue}" style="width: 100%; padding: 12px 16px; border: 2px solid #2196F3; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; color: #666666;" />`;
                        }
                    }
                });
            }
            
            function saveChanges() {
                const detailValues = document.querySelectorAll('.detail-value');
                detailValues.forEach(field => {
                    const fieldName = field.getAttribute('data-field');
                    if (fieldName && fieldName !== 'date') {
                        const input = field.querySelector('input, textarea');
                        if (input) {
                            const newValue = input.value;
                            field.textContent = newValue;
                        }
                    }
                });
                
                // Show success message
                showNotification('Cambios guardados exitosamente', 'success');
            }
        });
        
        // Delete Product Function
        function deleteProduct(button) {
            if (confirm('¿Estás seguro de que deseas eliminar este producto/servicio?')) {
                const productCard = button.closest('.product-card');
                productCard.style.transition = 'all 0.3s ease';
                productCard.style.opacity = '0';
                productCard.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    productCard.remove();
                    showNotification('Producto/servicio eliminado exitosamente', 'success');
                }, 300);
            }
        }
        
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