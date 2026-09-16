"""Modelo del diagrama de arquitectura de Notium.

Las cajas y relaciones salen de los imports reales de src/, no de memoria.
Layout: banda de arranque arriba y tres columnas (presentacion, negocio, datos)
para que el flujo se lea de izquierda a derecha sin aristas que crucen modulos.
"""

CANVAS = (2260, 1880)

PAL = {
    'text': '#263238',
    'muted': '#5c6875',
    'module_stroke': '#535b63',
    'file_stroke': '#8b939c',
    'group_fill': '#f5f5f5',
    'highlight': '#fff4da',
    'accent': '#dae8fc',
    'bg': '#ffffff',
}

MODULES = [
    ('cliente', 40, 170, 280, 'Cliente', [
        ('Navegador web\nMóvil · escritorio', 'file', 16),
        ('La SPA se ejecuta aquí.\nEl estado queda en localStorage\ndel propio navegador.', 'note', 24),
    ], None),

    # banda superior: arranque y enrutado
    ('arranque', 560, 400, 650, 'Arranque', [
        ('src/main.ts  →  src/App.vue', 'file', 0),
        ('src/PiniaConfig.ts', 'file', 0),
    ], 'Crea la app, siembra el estado e instala Pinia y el router'),

    ('router', 1360, 400, 800, 'src/router/', [
        ('index.ts\n13 rutas de la SPA', 'file', 12),
        ('accessControl.ts\nGuards: requiresAuth y roles', 'file', 12),
    ], 'createWebHistory(BASE_URL)'),

    # columna 1: presentacion
    ('views', 560, 700, 430, 'src/views/ (VM / V)', [
        ('HomeView · LoginView\nDashboardView · AnalyticsView\nNotFoundView', 'file', 24),
        ('semester/\nIndex · Show', 'file', 12),
        ('subject/\nIndex · Show', 'file', 12),
        ('grade/\nIndex · Show', 'file', 12),
        ('admin/\nAdminUsers · AdminReports', 'file', 12),
    ], 'Pantallas asociadas a las rutas'),

    ('components', 560, 1190, 430, 'src/components/ (V)', [
        ('semester/ · subject/ · grade/\nCard y Form por dominio', 'file', 12),
        ('admin/UserForm\ncommon/ChartPanel', 'file', 12),
        ('graphs/\n5 gráficas de Chart.js', 'file', 12),
    ], 'Reciben props y emiten eventos'),

    # columna 2: negocio
    ('services', 1140, 700, 430, 'src/services/ (M)', [
        ('AuthService.ts', 'file', 0),
        ('UserService.ts', 'file', 0),
        ('SemesterService.ts', 'file', 0),
        ('SubjectService.ts', 'file', 0),
        ('GradeService.ts', 'file', 0),
        ('AnalyticsService.ts\nPuro: no toca los stores', 'high', 12),
        ('PlatformReportService.ts\nPuro: no toca los stores', 'high', 12),
    ], 'Validación y lógica de negocio'),

    ('utils', 1140, 1250, 430, 'src/utils/', [
        ('DateFormatUtil.ts', 'file', 0),
        ('TableRenderUtil.ts', 'file', 0),
    ], 'Utilidades puras'),

    ('tests', 1140, 1490, 430, 'src/services/__tests__/', [
        ('SemesterService.test.ts', 'file', 0),
    ], 'Cubre SemesterService con Vitest'),

    # columna 3: datos
    ('stores', 1710, 700, 450, 'src/stores/ · Pinia', [
        ('AuthStore.ts\ncurrentUser · login · logout', 'file', 12),
        ('UserStore · SemesterStore\nSubjectStore · GradeStore', 'file', 12),
    ], 'Setup Stores: única fuente de datos'),

    ('persist', 1710, 970, 450, 'Persistencia', [
        ('localStorage · clave piniaState', 'high', 0),
    ], 'PiniaConfig observa los stores y serializa con flatted'),

    ('seed', 1710, 1180, 450, 'src/seeders/ · src/data/', [
        ('seedData.ts', 'file', 0),
        ('userseeder · semesterseeder\nsubjectseeder · gradeseeder', 'file', 12),
    ], 'Estado inicial la primera vez'),

    ('contracts', 1710, 1430, 450, 'src/interfaces/ · src/dtos/ (M)', [
        ('UserInterface (enum Role)\nSemester · Subject · GradeInterface', 'file', 12),
        ('UserDTOs · SemesterDTOs\nSubjectDTOs · GradeDTOs', 'file', 12),
        ('AnalyticsDTOs · PlatformReportDTOs', 'file', 0),
    ], 'Entidades y contratos de entrada'),
]

EDGES = [
    ('cliente', 'r', 'PROYECTO', 'l', 'HTTP: solicitud\ny respuesta', 'http'),
    ('arranque', 'r', 'router', 'l', 'use(router)', 'flow'),
    ('router', 'b:0.14', 'views', 't:0.5', 'resuelve', 'flow'),
    ('router', 'b:0.72', 'stores', 't:0.5', 'guards leen\nAuthStore', 'dep'),
    ('views', 'b:0.5', 'components', 't:0.5', 'props / emit', 'flow'),
    ('views', 'r:0.22', 'services', 'l:0.30', 'consulta\ny muta', 'flow'),
    ('components', 'r:0.5', 'services', 'l:0.95', 'formularios\ny gráficas', 'flow', 30),
    ('views', 'r:0.55', 'utils', 'l:0.5', 'formatea', 'dep', -40),
    ('services', 'r:0.24', 'stores', 'l:0.55', 'lee / escribe', 'flow'),
    ('services', 'r:0.86', 'contracts', 'l:0.28', 'tipa con', 'dep'),
    ('stores', 'b:0.5', 'persist', 't:0.5', '', 'flow'),
    ('seed', 't:0.5', 'persist', 'b:0.5', 'siembra', 'flow'),
]

SERVER = dict(x=500, y=230, w=1680, h=100,
              title='Servidor web',
              sub='Vite en desarrollo · GitHub Pages con nginx en producción. Entrega index.html y los assets estáticos.')

FRONTEND = dict(x=520, y=350, w=1680, h=1400,
                title='Frontend · Vue 3 + TypeScript',
                sub='SPA / CSR · se ejecuta en el navegador')

PROYECTO = dict(x=460, y=170, w=1760, h=1600, title='Proyecto Notium')

HEADER = dict(title='NOTIUM',
              subtitle='Arquitectura actual · semestres, materias, calificaciones, analítica y administración')

LEGEND = dict(x=40, y=470, w=280, title='Convenciones', items=[
    ('Capa / módulo', 'module'),
    ('Clase / archivo', 'file'),
    ('Estado persistido', 'high'),
    ('Comunicación', 'flow'),
    ('Usa / depende de', 'dep'),
])

STATUS = dict(x=40, y=890, w=280, title='Estado del proyecto', items=[
    ('CRUD completo', 'Semester, Subject y Grade, con validación en los servicios.'),
    ('Sesión', 'AuthService con guards por rol; área /admin restringida.'),
    ('Datos', 'Sin backend: seeders en localStorage, clave piniaState.'),
])

FOOTER = 'Fuente: código de Notium en main · M = modelo · VM = lógica de presentación · V = vista'
