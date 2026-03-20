// Estado global do agendamento
let selectedPlan = null;
let selectedDayValue = null;

// Smooth scroll para âncoras internas
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

function selectPlan(plan) {
    selectPlanOption(plan);
    document.getElementById('agendar').scrollIntoView({ behavior: 'smooth' });
}

function selectPlanOption(plan) {
    selectedPlan = plan;

    document.querySelectorAll('.plan-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`[data-plan="${plan}"]`).classList.add('selected');

    const addressField = document.getElementById('addressField');
    const dateField = document.getElementById('dateField');
    const dayField = document.getElementById('dayField');
    const infoBox = document.getElementById('infoBox');
    const addressInput = document.getElementById('address');
    const dateInput = document.getElementById('bathDate');

    addressField.style.display = 'none';
    dayField.style.display = 'none';
    infoBox.style.display = 'none';
    addressInput.required = false;
    dateInput.required = false;

    if (plan === 'simple') {
        dateField.style.display = 'block';
        dateInput.required = true;
    } else if (plan === 'pickup') {
        dateField.style.display = 'block';
        addressField.style.display = 'block';
        infoBox.style.display = 'flex';
        addressInput.required = true;
        dateInput.required = true;
    } else if (plan === 'monthly') {
        dayField.style.display = 'block';
        addressField.style.display = 'block';
        infoBox.style.display = 'flex';
        addressInput.required = true;
    }
}

function selectDay(element) {
    selectedDayValue = element.dataset.day;
    document.getElementById('selectedDay').value = selectedDayValue;

    document.querySelectorAll('.day-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!selectedPlan) {
            alert('Por favor, selecione um plano.');
            return;
        }

        if (selectedPlan === 'monthly' && !selectedDayValue) {
            alert('Por favor, selecione um dia da semana.');
            return;
        }

        const petName = document.getElementById('petName').value;
        const ownerName = document.getElementById('ownerName').value;
        const date = document.getElementById('bathDate').value;

        const planNames = {
            simple: 'Banho Simples',
            pickup: 'Banho com Busca',
            monthly: 'Plano Mensal'
        };

        document.getElementById('confirmPlan').textContent = planNames[selectedPlan];
        document.getElementById('confirmPet').textContent = petName;
        document.getElementById('confirmOwner').textContent = ownerName;

        const dateRow = document.getElementById('confirmDateRow');
        const dayRow = document.getElementById('confirmDayRow');

        if (selectedPlan === 'monthly') {
            dateRow.style.display = 'none';
            dayRow.style.display = 'flex';
            document.getElementById('confirmDay').textContent = selectedDayValue + '-feira';
        } else {
            dateRow.style.display = 'flex';
            dayRow.style.display = 'none';
            document.getElementById('confirmDate').textContent = new Date(date).toLocaleDateString('pt-BR');
        }

        document.getElementById('confirmationModal').classList.add('active');

        this.reset();
        document.querySelectorAll('.plan-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('.day-option').forEach(opt => opt.classList.remove('selected'));
        selectedPlan = null;
        selectedDayValue = null;

        document.getElementById('addressField').style.display = 'none';
        document.getElementById('dayField').style.display = 'none';
        document.getElementById('infoBox').style.display = 'none';
    });
}

function closeModal() {
    document.getElementById('confirmationModal').classList.remove('active');
}

const confirmationModal = document.getElementById('confirmationModal');
if (confirmationModal) {
    confirmationModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const open = navLinks.style.display === 'flex';

    if (open) {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(255, 255, 255, 0.95)';
        navLinks.style.backdropFilter = 'blur(20px)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
        navLinks.style.gap = '1rem';
    }
}

const bathDate = document.getElementById('bathDate');
if (bathDate) {
    bathDate.min = new Date().toISOString().split('T')[0];
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// animação progressiva de cards e itens
document.querySelectorAll('.service-card, .instagram-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});