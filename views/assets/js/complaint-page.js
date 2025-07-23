const checkbox = document.getElementById('anonymous');

const name = document.getElementById('name');

const lName = document.getElementById('lName')

const step = document.querySelectorAll('.form-step')

const next = document.querySelectorAll('.next-step')

const prev = document.querySelectorAll('.prev-step')

let currentStep = 0;

next.forEach(btn => {
    btn.addEventListener('click', () => {
        step[currentStep].classList.add('d-none');
        currentStep++;
        step[currentStep].classList.remove('d-none');
        
    })
});
prev.forEach(btn => {
    btn.addEventListener('click', () => {
        step[currentStep].classList.add('d-none');
        currentStep--;
        step[currentStep].classList.remove('d-none');
    })
    
});


checkbox.addEventListener ("change", () => {
    if (checkbox.checked) {
        name.style.visibility = 'hidden';
        lName.style.visibility = 'hidden';

        const mb = document.getElementsByClassName('mb-3');
        for (let all of mb) {
            all.style.marginTop = "-2%";
        }
    }else {
        name.style.visibility = 'visible';
        lName.style.visibility = 'visible';

        const mb = document.getElementsByClassName('');
        for (let all of mb) {
            all.style.marginTop = "";
        }
    }
    
});
