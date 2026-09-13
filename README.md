# GestionaPro — Frontend

Un panel en React + TypeScript para **GestionaPro**, un sistema de gestión para pequeños negocios con interfaces separadas por rol para administradores y usuarios regulares. Construido sobre la [API de GestionaPro](https://github.com/FavianRamos/GestionaPro).

🔗 **App en producción:** [https://gestionapro-frontend.vercel.app](https://gestionapro-frontend.vercel.app)

🔗 **Repositorio del backend:** [GestionaPro](https://github.com/FavianRamos/GestionaPro)

> ⚠️ El backend está alojado en un servicio gratuito y puede tardar entre 30 y 60 segundos en responder en la primera petición tras un período de inactividad.

---

## Descripción

El frontend de GestionaPro ofrece dos experiencias distintas según el rol del usuario autenticado:

- **Administrador** — panel completo con métricas en tiempo real, gráficos de ventas, y gestión completa de productos, categorías, usuarios y ventas.
- **Usuario** — un catálogo simplificado para explorar productos, realizar compras y ver su propio historial de compras.

El acceso a cada ruta está protegido del lado del cliente y validado del lado del servidor mediante JWT, de modo que cada rol solo ve las pantallas y datos para los que está autorizado.

## Funcionalidades

- **Autenticación** — inicio de sesión / registro conectado a la autenticación JWT del backend, con el rol decodificado directamente desde el token
- **Panel de administrador** — métricas en vivo (ingresos, ventas, productos, usuarios), gráfico de ventas mensuales, productos más vendidos, ventas por categoría, y alerta de stock bajo — todo respaldado con datos reales, sin widgets simulados
- **Gestión de productos, categorías y usuarios** — CRUD completo con formularios modales, validación en el cliente, y búsqueda de productos con debounce
- **Ventas** — historial de ventas paginado con filtros por usuario y rango de fechas, y desglose expandible de subtotal / IGV / total por venta
- **Catálogo y compra para usuarios** — explorar productos, elegir cantidades, y confirmar una compra, respetando los límites de stock
- **Historial de compras** — historial de compras propio del usuario, con un reporte listo para imprimir
- **Rutas protegidas por rol** — las rutas protegidas redirigen automáticamente según el rol del usuario autenticado

## Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Framework | React + TypeScript |
| Herramienta de build | Vite |
| Estilos | Tailwind CSS |
| Enrutamiento | React Router |
| Gráficos | ApexCharts |
| Despliegue | Vercel |

## Cómo ejecutarlo localmente

### Requisitos previos
- Node.js
- El [backend de GestionaPro](https://github.com/FavianRamos/GestionaPro) corriendo localmente o accesible de forma remota

### Configuración
```bash
git clone https://github.com/FavianRamos/gestionapro-frontend.git
cd gestionapro-frontend
npm install
```

### Variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

VITE_API_URL=http://localhost:8080


Para un build de producción apuntando a un backend desplegado, usa `.env.production`:

VITE_API_URL=https://tu-backend-desplegado.com


### Ejecutar
```bash
npm run dev
```

### Compilar para producción
```bash
npm run build
```
