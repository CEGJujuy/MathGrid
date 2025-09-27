# MathGrid - Juego de Rompecabezas Matemáticos

Un juego interactivo de rompecabezas matemáticos donde los jugadores completan una cuadrícula numérica basada en ecuaciones simples de suma y resta.

## 🎮 Características del Juego

### Jugabilidad Principal
- Cuadrícula numérica interactiva con ecuaciones matemáticas (suma y resta)
- Haz clic en las celdas vacías para ingresar respuestas
- Validación en tiempo real con retroalimentación visual
- Tres niveles de dificultad (Fácil: 3x3, Medio: 4x4, Difícil: 5x5)

### Mecánicas del Juego
- **Cronómetro**: Rastrea el tiempo transcurrido en formato MM:SS
- **Puntuación**: Puntos basados en dificultad (10/20/30 por respuesta correcta)
- **Pistas**: Pistas limitadas por dificultad (3/2/1 para Fácil/Medio/Difícil)
- **Guardado automático**: Progreso guardado automáticamente en localStorage

### Diseño UI/UX
- Hermosa paleta de colores pastel (rosa, púrpura, azul, verde, amarillo, naranja)
- Diseño completamente responsivo para móvil y escritorio
- Animaciones suaves y efectos hover
- Interfaz limpia y moderna con espaciado adecuado
- Retroalimentación visual para respuestas correctas/incorrectas

### Persistencia de Datos
- Estado del juego guardado localmente durante el juego
- Seguimiento de estadísticas del juego (partidas jugadas, ganadas, puntuaciones, tiempos)
- Funcionalidad de guardar/cargar juego
- Capacidades de exportar/importar datos

## 🎯 Niveles de Dificultad

- **Fácil**: Cuadrícula 3x3, números 1-10, 3 pistas
- **Medio**: Cuadrícula 4x4, números 1-20, 2 pistas
- **Difícil**: Cuadrícula 5x5, números 1-50, 1 pista

## 🏆 Sistema de Puntuación

El juego cuenta con un sofisticado sistema de puntuación con bonos de tiempo y multiplicadores de dificultad:
- Puntos base por respuesta correcta según dificultad
- Bonos de tiempo por completar rápidamente
- Multiplicadores por nivel de dificultad

## 💾 Almacenamiento Local

- Guardado automático del progreso del juego
- Estadísticas persistentes del jugador
- Capacidad de exportar/importar datos del juego
- Sin pérdida de progreso entre sesiones

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, TypeScript
- **Build Tool**: Vite
- **Almacenamiento**: localStorage API
- **Diseño**: CSS Grid, Flexbox, Animaciones CSS

## 🚀 Instalación y Uso

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en `http://localhost:5173`

## 📱 Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móviles y tablets
- ✅ Diseño responsivo para todas las pantallas

## 🎨 Características de Diseño

- Paleta de colores pastel calmante
- Tipografía limpia y legible
- Animaciones suaves y transiciones
- Efectos hover interactivos
- Diseño centrado en la experiencia del usuario

## 📊 Estadísticas del Juego

El juego rastrea automáticamente:
- Número de partidas jugadas
- Partidas completadas exitosamente
- Puntuación más alta
- Mejor tiempo por dificultad
- Promedio de puntuación

## 👨‍💻 Desarrollador

**Profesional**: César Eduardo González - Analista en Sistemas  
**Email**: gonzalezeduardo_31@hotmail.com  
**Teléfono**: (+54) 3884 858-907

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu característica
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- Arquitectura modular con separación clara de responsabilidades
- Código TypeScript tipado para mejor mantenibilidad
- Sistema de almacenamiento robusto con validación de datos
- Interfaz de usuario accesible y responsiva