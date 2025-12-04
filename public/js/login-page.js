//uso o dom contentloaded pra esperar o DOM carregar completamente antes de executar tudo

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if(!loginForm){
        console.error('Formulário de login não foi encontrado');
        return;
    }
    
    if(typeof popupMessage !== 'function'){
        console.error('popupMessage não está definida');
        return;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            const response = await fetch('/login-page', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            const type = data.success ? 'success' : 'error';
            const message = data.msg || (data.success ? 'Login realizado com sucesso!' : 'Erro ao fazer login');

            // Chamar popup
            popupMessage(message, type, 2000);

            if (data.success) {
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 2000);
            }
            
        } catch (error) {
            console.error('Erro:', error);
            popupMessage('Erro ao conectar com o servidor', 'error', 2000);
        }
    });
});