var map = L.map('complaint-map').setView([-5.788623, -35.237237], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors & CARTO'
}).addTo(map);

var pata = L.icon({
    iconUrl: "img/patas-seguras-icone-mapa.png",
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [60, 40],
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

function successCallback(position){
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    
    map.setView([userLat, userLng], 15);

    L.marker([userLat, userLng], {
        icon: L.icon({
            iconUrl:'img/pontinho-do-mapa.png',
            iconSize: [30, 30],
            iconAnchor: [13, 11],
            popupAnchor: [0, -13]

        })
    }).addTo(map)
}

function errorCallback(error){
    console.log("Erro no recebimento da geolocalização:", error.message)
}

if ("geolocation" in navigator) { //eu to pegando o navigator que o objeto do navegador do usuario e em seguinda escolhendo //
// a opção de geolocalização com o metodo de getCurrent position. O metodo segue com 2 instancias de sucesso que é caso o usuario permita e uma opcional de erro caso aja aglgum erro
//Dessa forma eu consigo pegar a localização do usuario e usar os valores e por em variaveis para poder manipular e conseguir fazer o mapa inicializar encima do usuario
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
        enableHighAccuracy: true, //Esse valor booleano permite que minhas função receba com melhor presição a localização do usuario por isso, é possivel que demore mais que o normal para carrgar
        timeout: 10000,
        maximumAge: 0 
    });
} else {
    console.log("Erro: a geolocalização não é suportada por esse navegador");
}

var marker;
var currentLat, currentLng;
async function showAddress(lat, lng){
    try {
        const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
                headers:{
                    'Accept-Language': 'PT-BR, pt; q=0,9'
                }
            }
        );

        const data = await response.json();

        if(data.address){
            const road = data.address.road || '';
            const suburb = data.address.suburb || data.address.neighbourhood || '';
            const city = data.address.city || data.address.town || data.address.village || '';
        
            let fullAddress = '';
            if (road) fullAddress += road;
            if(suburb) fullAddress += (fullAddress ? ', ' : '')+ suburb;
            if (city) fullAddress += (fullAddress ? ' - ': '')+ city

            return fullAddress || 'Endereço não encontrado.';
        }
    } catch (error) {
        console.error('ERRO: falha na busca do endereço:', error);
        return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
    }
};

async function showComplaintForm(lat, lng) {
    const existingContainer = document.getElementById('complaint-form-container');
    if (existingContainer) existingContainer.remove();

    currentLat = lat;
    currentLng = lng;

    const address = await showAddress(lat, lng);

    const formContainer = document.createElement('div');
    formContainer.id = 'complaint-form-container';
    formContainer.className = 'complaint-form-sidebar';

    formContainer.innerHTML = `
        <form id="complaintForm" method="POST" class="form" action="/complaints" enctype="multipart/form-data">

            <div class="complaint-form-header">
                <h3>Denunciar Maus Tratos</h3>
                <button id="close-form" type="button" class="close-btn">✕</button>
            </div>

            <div class="complaint-form-content">
                <p class="location d-none" id="location"> Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</p>
                <p class="location" id="location"> ${address}</p>
                
                <input type="hidden" name="latitude" id="latitude" value='${lat}'>
                <input type="hidden" name="longitude" id="longitude" value='${lng}'>
                
                <div id="errorMessage" class="alert alert-danger d-none" role="alert"></div>

                <div class="mb-3">
                <label for="name" id="lName" class="form-label fw-bolder text-black">Seu nome</label>
                    <input type="text" class="text-black form-control border-primary" id="name" name="name">
                    <label for="number" id="lNumber" class="form-label fw-bolder text-black">Seu número:</label>
                    <input type="tel" class="text-black form-control border-primary" id="number" name="number">
                </div>

                <h3>Qual o animal:</h3>
                <div class="animal-options">
                    <button type="button" class="animal-btn" data-type="cachorro">🐶 Cachorro</button>
                    <button type="button" class="animal-btn" data-type="gato">🐱 Gato</button>
                    <button type="button" class="animal-btn" data-type="cavalo">🐴 Cavalo</button>
                    <button type="button" class="animal-btn" data-type="silvestre">🦊 Silvestre</button>
                    <button type="button" class="animal-btn" data-type="outro">🐾 Outro</button>
                </div>

                <input type="hidden" name="animal" id="animal">

                <h3>Tipo da Denúncia:</h3>
                <div class="complaint-options">
                    <button type="button" class="complaint-btn" data-type="negligencia">🍖 Negligência</button>
                    <button type="button" class="complaint-btn" data-type="agressao">👊 Agressão</button>
                    <button type="button" class="complaint-btn" data-type="abandono">🚪 Abandono</button>
                    <button type="button" class="complaint-btn" data-type="prisao">🔗 Aprisionamento</button>
                    <button type="button" class="complaint-btn" data-type="exploracao">⚙️ Exploração</button>
                    <button type="button" class="complaint-btn" data-type="outro">❓ Outro</button>
                </div>

                <input type="hidden" name="complaintType" id="complaintType">

                <div class="mb-3">
                    <label for="photo" class="form-label fw-bolder text-black">Campo para fotos do ocorrido:</label>
                    <input type="file" class="form-control border-primary" name="photos" accept="image/png, image/jpeg" multiple>
                </div>
                <div class="mb-3">
                    <label for="descripiton" class="form-label fw-bolder text-black">Descreva os detalhes da denúncia:</label>
                    <textarea id="description" class="form-control border-primary" name="description" maxlength="500"></textarea>
                </div>
                <div class="complaint-actions mt-5">
                    <button type="submit" class="submit-complaint btn-submit"> Enviar Denúncia</button>
                    <button type="button" id="cancel-complaint" class="btn-cancel"> Cancelar</button>
                </div>
            </div>

        </form>
    `;

    document.body.appendChild(formContainer);

    document.querySelectorAll('.animal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.animal-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('animal').value = btn.dataset.type;
            hideErrorMessage();
        });
    });

    document.querySelectorAll('.complaint-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.complaint-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('complaintType').value = btn.dataset.type;
            hideErrorMessage();
        });
    });

    document.getElementById('close-form').addEventListener('click', closeComplaintForm);
    document.getElementById('cancel-complaint').addEventListener('click', closeComplaintForm);
    document.getElementById('complaintForm').addEventListener('submit', submitComplaint);

}
//essa função funciona junto a div la do html errormessage
//ela vai estar oculta e no momento em que o usuario errar alguma coisa ela adicionará a classe is invalid, onde mostrará a mensagem
function showErrorMessage(msg) {
    const div = document.getElementById('errorMessage');
    div.textContent = msg;
    div.classList.remove('d-none');
}

function hideErrorMessage() {
    const div = document.getElementById('errorMessage');
    div.classList.add('d-none');
}

function closeComplaintForm() {
    const container = document.getElementById('complaint-form-container');
    if (container) container.remove();
}

function submitComplaint(event) {
    event.preventDefault(); // Cria um evento que faz a validação do formulario e nao envia ele automaticamente assim que é submitado

    const animal = document.getElementById('animal').value;
    const type = document.getElementById('complaintType').value;
    const numberInput = document.getElementById('number');
    const nameInput = document.getElementById('name');
// Expressão regular para validar nomes (movida para um escopo acessível)
// Permite letras (incluindo acentuadas) e espaços
    const reg = /^[a-zA-ZÀ-ú\s]+$/;

    if (!reg.test(nameInput.value)) {
        showErrorMessage("⚠️ Por favor, insira um nome válido (sem números ou símbolos).");
        return;
    }
    if (!numberInput.value.trim()) {
        showErrorMessage("⚠️ Para evitar spam e trotes, precisamos validar que você é humano, para isso nos envie seu número.");
        return;
    }
    

    if (!animal) {
        showErrorMessage("⚠️ Selecione o animal do caso.");
        return;
    }

    if (!type) {
        showErrorMessage("⚠️ Selecione o tipo do ocorrido.");
        return;
    }

    hideErrorMessage();
    event.target.submit()
    
    closeComplaintForm();
}

map.on('click', function (c) {
    if (marker) map.removeLayer(marker);

    marker = L.marker([c.latlng.lat, c.latlng.lng], { icon: pata }).addTo(map);

    showComplaintForm(c.latlng.lat, c.latlng.lng);
});
