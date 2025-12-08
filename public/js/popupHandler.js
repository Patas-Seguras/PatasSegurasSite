const popupMessage = (message, type = 'success', duration = 2000) => {
    let popupContainer = document.getElementById('popupContainer');
    
    if (!popupContainer) {
        popupContainer = document.createElement('div');
        popupContainer.id = 'popupContainer';
        popupContainer.className = 'popup-container';
        document.body.appendChild(popupContainer);
    }

    popupContainer.innerHTML = '';

    //Aqui eu mapeei os estilos do bootstrap para facilitar quando eu for definir o type ele ja adicionar automaticamente
    const typeMap = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    };

    const alertClass = typeMap[type] || 'alert-info';

    const popup = document.createElement('div');
    popup.className = `alert ${alertClass} alert-dismissible fade show popup`;
    popup.innerHTML = `
        <span class="popup-message">${message}</span>
        <button type="button" class="btn-close" onclick="closePopup()" aria-label="Close"></button>
    `;

    popupContainer.appendChild(popup);

    if(duration && duration > 0) {
        setTimeout(closePopup, duration);
    }
};

const closePopup = () => {
    const popupContainer = document.getElementById('popupContainer');

    if(!popupContainer) {
        return;
    }

    const popup = popupContainer.querySelector('.alert');
    if(popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            popupContainer.innerHTML = '';
        }, 150);
    }
};
