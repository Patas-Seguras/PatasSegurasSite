const checkbox = document.getElementById('anonymous');
const nameInput = document.getElementById('name');
const lNameInput = document.getElementById('lName');
const submitButton = document.getElementById('submitButton');
const steps = document.querySelectorAll('.form-step');
const localization = document.getElementById("localization");
const description = document.getElementById("description");
const whichComplaint = document.getElementById('whichComplaint');
const nextButton = document.querySelectorAll('.next-step');
const prevButton = document.querySelectorAll('.prev-step');

let currentStep = 0;

// Expressão regular para validar nomes (movida para um escopo acessível)
// Permite letras (incluindo acentuadas) e espaços
const reg = /^(?=.*[A-Za-zÀ-ÿ])[A-Za-zÀ-ÿ\s]+$/;

// Função para avançar para o próximo passo do formulário, adiciona o d-none que é uma caracteristica que esconde 
function nextStage() {
    steps[currentStep].classList.add('d-none');
    currentStep++;
    steps[currentStep].classList.remove('d-none');
}

// Função para voltar para o passo anterior do formulário, retira o d-none do passo anterior e adiciona ao atual
function prevStage() {
    steps[currentStep].classList.add('d-none');
    currentStep--;
    steps[currentStep].classList.remove('d-none');
}

// Ouve o clique dos botões de "Voltar" com foreach
prevButton.forEach(btn => {
    btn.addEventListener('click', () => {
        prevStage();
    });
});
// Ouve o clique dos botões de "Próximo", for each pra iterar sobre tofos os botoes, o for each percorre arrays, botoes e etc
nextButton.forEach(btn => {
    //event listener pra 'ouvir o click'
    btn.addEventListener('click', () => {
        try {
            // **Validação do nome e sobrenome**
            if (!checkbox.checked) {
                // Se a checkbox não estiver marcada, valida nome e sobrenome
                if (!reg.test(nameInput.value)) {
                    window.alert("Por favor, insira um nome e sobrenome válidos (sem números ou símbolos).");
                    nameInput.value = ''; // Limpa o campo de nome
                    //return serve como um break 
                    return;
                }
            }

            // **Validação do select (tipo de denúncia)**
            if (whichComplaint.value === "") {
                window.alert("Por favor, selecione uma opção de denúncia.");
                return;
            }
            
            // Se tudo estiver ok, avança para o próximo passo com a função mostrada acima
            nextStage();
        } catch (err) {
            console.error('Ocorreu um erro: ' + err.message);
        }
    });
});

// Ouve o clique do botão de "Enviar" (submit)
submitButton.addEventListener('click', (event) => {
    try {
        // **Validação da descrição**
        if (!reg.test(description.value)) {
            window.alert("Por favor, descreva o ocorrido de forma correta (sem números ou símbolos).");
            event.preventDefault(); // Impede o envio do formulário
            return;
        }

        // **Validação da localização**
        if (!reg.test(localization.value)) {
            window.alert("Por favor,indique a localização do ocorrido.");
            event.preventDefault();
            return;
        }

    } catch (err) {
        console.error('Ocorreu um erro: ' + err.message);
        event.preventDefault();
    }
});


// Ouve a mudança no estado do checkbox para anônimo
//co esse codigo consigo fazer com que se o checkbox estiver ativo ou checkado, a visibilidade dele muda
//e com a logica acima, o que estiver escondido não terá atributos requiridos no caso o nome e o labelname
checkbox.addEventListener("change", (event) => {
    if (checkbox.checked) {
        nameInput.style.visibility = 'hidden';
        lNameInput.style.visibility = 'hidden';
        nameInput.removeAttribute('required');
        lNameInput.removeAttribute('required');
    } else {
        nameInput.style.visibility = 'visible';
        lNameInput.style.visibility = 'visible';
        nameInput.setAttribute('required', '');
        lNameInput.setAttribute('required', '');
    }
});