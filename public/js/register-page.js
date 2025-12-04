document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if(!registerForm){
        console.error('Formulário de registro não foi encontrado');
        return;
    }
    
    // Verificar se popupMessage está disponível
    if(typeof popupMessage !== 'function'){
        console.error('popupMessage não está definida');
        return;
    }

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const passwordAgain = document.getElementById('passwordAgain').value.trim();

            // Validações básicas
            if (!email || !password || !passwordAgain) {
                popupMessage('Por favor, preencha todos os campos', 'warning', 2000);
                return;
            }

            if (password !== passwordAgain) {
                popupMessage('As senhas não coincidem', 'error', 2000);
                return;
            }

            if (password.length < 6) {
                popupMessage('A senha deve ter no mínimo 6 caracteres', 'warning', 2000);
                return;
            }
            //to enviando os dados para o servidor
            const response = await fetch('/register-page', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    passwordAgain: passwordAgain
                })
            });


            const data = await response.json();
            //aqui to definindo o tipo de popup com esse if e else simplificado
            const type = data.success ? 'success' : 'error';
            const message = data.msg || (data.success ? 'Registro realizado com sucesso!' : 'Erro ao fazer registro');
            
            //Chamando o popup pra mostrar a resposta do servidor
            popupMessage(message, type, 2000);

            if (data.success) {
                setTimeout(() => {
                    registerForm.reset();
                    window.location.href = '/login-page';
                }, 2000);
            }
            
        } catch (error) {
            console.error(' Erro na requisição:', error);
            popupMessage('Erro ao conectar com o servidor', 'error', 2000);
        }
    });
});
