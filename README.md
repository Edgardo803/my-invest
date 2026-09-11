# My Invest - Plataforma de Inversión Inmobiliaria

Plataforma digital integral para inversores y agentes inmobiliarios.

## Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS + Zustand + Axios + Lucide
- **Backend**: FastAPI (Python) + SQLAlchemy + JWT
- **Base de datos**: SQLite (desarrollo) → PostgreSQL (producción)
- **Auth**: JWT

## Cómo arrancar

### 1. Backend

```bash
cd backend
export PYTHONPATH=.
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Documentación: http://localhost:8000/docs

**Admin:**
- Email: `admin@myinvest.com`
- Password: `Admin123!`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abrir: http://localhost:3000

## Funcionalidades implementadas

### Backend ✅
- Registro e login (Inversor / Agente)
- Roles + Admin (superusuario)
- Códigos de referido
- CRUD de proyectos + estados y fases
- Actualizaciones de fase (Compra → Reforma → Venta)
- Inversión simulada
- Resumen financiero del inversor
- OpenAPI docs

### Frontend ✅
- Landing page profesional
- Login y Registro
- Dashboard del **Inversor** (resumen financiero, proyectos, inversiones)
- Dashboard del **Agente** (lista de proyectos, estadísticas)
- Formulario de **Nuevo Proyecto** (completo con datos financieros y ROI)
- Layout con sidebar y protección de rutas por rol
- Diseño responsive y moderno

## Próximos pasos recomendados

1. Vista detallada del dossier de proyecto (para inversores)
2. Calculadora de rentabilidades (agentes)
3. Panel de Admin (aprobar/rechazar proyectos, gestionar usuarios)
4. Subida de imágenes y documentos
5. Blog y notificaciones
6. Migración a PostgreSQL + Docker Compose

## Notas

- Pagos **simulados**
- Todo el progreso se guarda en esta conversación. Puedes volver cuando quieras.
