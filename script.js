// Variables globales
let currentPlate = '';
const mockDatabase = {
    // Simula una base de datos con algunas placas ya registradas
    // Si la placa está aquí, se muestra la reserva existente
    // Si no, se muestra el formulario para hacer una nueva reserva
    'ABC123': {
        hasReservation: true,
        serviceType: 'Mantenimiento Preventivo',
        date: '28/04/2025',
        time: '11:30 AM',
        photoDate: '15/04/2025',
        technicianName: 'Carlos Méndez',
        lastUpdate: 'Hoy 10:25'
    },
    'XYZ789': {
        hasReservation: true,
        serviceType: 'Reparación Mecánica',
        date: '29/04/2025',
        time: '09:00 AM',
        photoDate: '20/04/2025',
        technicianName: 'Laura González',
        lastUpdate: 'Ayer 18:15'
    }
};

// Función para mostrar pantallas
function showScreen(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('div[id$="-screen"]').forEach(screen => {
        screen.classList.add('hidden');
    });

    // Mostrar la pantalla solicitada
    document.getElementById(screenId).classList.remove('hidden');

    // Scroll al inicio
    window.scrollTo(0, 0);
}

// Función para formatear la fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Función para formatear la hora
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);

    if (hour < 12) {
        return `${hour}:${minutes} AM`;
    } else if (hour === 12) {
        return `12:${minutes} PM`;
    } else {
        return `${hour - 12}:${minutes} PM`;
    }
}

// Inicialización cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // Mostrar pantalla inicial
    showScreen('search-screen');

    // Manejar el envío del formulario de búsqueda de placa
    document.getElementById('plate-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const plateInput = document.getElementById('plate-input');
        const plate = plateInput.value.trim().toUpperCase();

        // Validar la entrada (mínimo 1 carácter)
        if (plate.length < 1) {
            alert('Por favor, ingresa una placa válida');
            return;
        }

        // Guardar la placa actual
        currentPlate = plate;

        // Actualizar la placa en todas las pantallas donde aparece
        document.getElementById('vehicle-plate').textContent = plate;
        document.getElementById('form-vehicle-plate').textContent = plate;
        document.getElementById('confirm-vehicle-plate').textContent = plate;

        // Verificar si la placa ya tiene una reserva en nuestra "base de datos" simulada
        if (mockDatabase[plate] && mockDatabase[plate].hasReservation) {
            // Cargar los datos de la reserva existente
            const reservation = mockDatabase[plate];

            document.getElementById('service-type').textContent = reservation.serviceType;
            document.getElementById('scheduled-date').textContent = reservation.date;
            document.getElementById('scheduled-time').textContent = reservation.time;
            document.getElementById('photo-date').textContent = reservation.photoDate;
            document.getElementById('technician-name').textContent = reservation.technicianName;
            document.getElementById('last-update').textContent = reservation.lastUpdate;

            // Mostrar la pantalla de reserva existente
            showScreen('existing-reservation-screen');
        } else {
            // Mostrar la pantalla de formulario para nueva reserva
            showScreen('reservation-form-screen');
        }
    });

    // Manejar el botón de volver en la pantalla de reserva existente
    document.getElementById('back-button').addEventListener('click', function () {
        showScreen('search-screen');
    });

    // Manejar el botón de volver en la pantalla de formulario
    document.getElementById('back-to-search').addEventListener('click', function () {
        showScreen('search-screen');
    });

    // Manejar el envío del formulario de reserva
    document.getElementById('reservation-form').addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtener los valores del formulario
        const serviceType = document.getElementById('service-select');
        const reservationDate = document.getElementById('reservation-date');
        const reservationTime = document.getElementById('reservation-time');

        // Validar la entrada
        if (!serviceType.value || !reservationDate.value || !reservationTime.value) {
            alert('Por favor, completa todos los campos obligatorios');
            return;
        }

        // Actualizar la información de confirmación
        let serviceTypeText = '';
        switch (serviceType.value) {
            case 'maintenance':
                serviceTypeText = 'Mantenimiento Preventivo';
                break;
            case 'mechanical':
                serviceTypeText = 'Reparación Mecánica';
                break;
            case 'electrical':
                serviceTypeText = 'Sistema Eléctrico';
                break;
            default:
                serviceTypeText = 'Servicio Desconocido';
        }

        document.getElementById('confirm-service-type').textContent = serviceTypeText;
        document.getElementById('confirm-service-date').textContent = formatDate(reservationDate.value);
        document.getElementById('confirm-service-time').textContent = formatTime(reservationTime.value);

        // Guardar la nueva reserva en nuestra "base de datos" simulada
        mockDatabase[currentPlate] = {
            hasReservation: true,
            serviceType: serviceTypeText,
            date: formatDate(reservationDate.value),
            time: formatTime(reservationTime.value),
            photoDate: formatDate(new Date().toISOString().split('T')[0]),
            technicianName: 'Técnico Asignado',
            lastUpdate: 'Hace un momento'
        };

        // Mostrar la pantalla de confirmación
        showScreen('confirmation-screen');
    });

    // Manejar el botón de volver al inicio desde la confirmación
    document.getElementById('back-to-home').addEventListener('click', function () {
        showScreen('search-screen');
    });

    // Manejar el botón de ver la reserva desde la confirmación
    document.getElementById('view-reservation').addEventListener('click', function () {
        // Cargar los datos de la reserva existente (que acabamos de crear)
        const reservation = mockDatabase[currentPlate];

        document.getElementById('service-type').textContent = reservation.serviceType;
        document.getElementById('scheduled-date').textContent = reservation.date;
        document.getElementById('scheduled-time').textContent = reservation.time;
        document.getElementById('photo-date').textContent = reservation.photoDate;
        document.getElementById('technician-name').textContent = reservation.technicianName;
        document.getElementById('last-update').textContent = reservation.lastUpdate;

        // Mostrar la pantalla de reserva existente
        showScreen('existing-reservation-screen');
    });

    // Manejar el botón de ver reparación en vivo
    document.getElementById('live-view-button').addEventListener('click', function () {
        // En un caso real, aquí se conectaría con un sistema de cámaras en vivo
        alert('Conectando con el sistema de cámaras en vivo...\nEsta funcionalidad estaría conectada a un sistema real de transmisión.');
    });

    // Manejar el botón de añadir al calendario
    document.getElementById('add-calendar').addEventListener('click', function () {
        alert('Se ha añadido el evento a tu calendario.\nRecibirás notificaciones antes de tu cita programada.');
    });

    // Funcionalidad para seleccionar horarios disponibles en el formulario
    document.querySelectorAll('.grid-cols-2 > div, .grid-cols-3 > div, .grid-cols-4 > div').forEach(dateOption => {
        dateOption.addEventListener('click', function () {
            // Añadir clase date-option para aplicar estilos
            this.classList.add('date-option');

            // En un caso real, aquí se actualizarían los campos del formulario
            // con la fecha y hora seleccionadas
            const dateText = this.querySelector('p:first-child').textContent;
            const timeText = this.querySelector('p:last-child').textContent;

        });
    });

    // Mejorar la experiencia de usuario con efectos visuales
    // Añadir clase animate-float a elementos que queremos que floten
    document.querySelectorAll('.rounded-full').forEach(element => {
        element.classList.add('animate-float');
    });

    // Añadir clase service-card a las tarjetas de servicio
    document.querySelectorAll('.grid-cols-3 > div').forEach(card => {
        card.classList.add('service-card');
    });
});