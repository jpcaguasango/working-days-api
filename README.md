# 📅 API de Cálculo de Fechas Hábiles – Colombia

Esta API REST calcula una fecha y hora hábil en **Colombia**, sumando días y/o horas hábiles
a partir de una fecha inicial.  
Tiene en cuenta:

- 🗓 **Festivos nacionales** (fuente oficial de https://content.capta.co/Recruitment/WorkingDays.json).
- 🕗 **Horario laboral**: lunes a viernes, 8:00 a.m.–12:00 p.m. y 1:00 p.m.–5:00 p.m.
- 🌎 **Zona horaria**: todos los cálculos se hacen en `America/Bogota` y se devuelven en **UTC**.

## Instalación

```bash
# Clona el repositorio
git clone https://github.com/jpcaguasango/working-days-api.git
cd working-days-api

# Instala las dependencias
yarn install

# Ejecución en desarrollo
yarn dev

# Build
yarn build

# Ejecutar build
yarn start
```
La API quedará disponible en http://localhost:3000

---

## Endpoints

### `GET /working-date`

**Parámetros de query**

| Parámetro | Tipo    | Requerido | Descripción                                                                                                    |
|-----------|---------|----------|----------------------------------------------------------------------------------------------------------------|
| `days`    | number | No       | Días hábiles a sumar.                                                                                          |
| `hours`   | number | No       | Horas hábiles a sumar.                                                                                         |
| `date`    | string | No       | Fecha/hora inicial en formato **UTC ISO 8601 con sufijo `Z`**. Si no se envía, se usa la hora actual de Bogotá. |

> **Reglas**:
> - Si se envían ambos (`days` y `hours`), primero se suman los días y luego las horas.
> - Si no se envía ninguno, la API responde con error `400`.

---

## Respuesta Exitosa

```json
{
  "date": "2025-08-01T14:00:00Z"
}
```

## Respuesta Invalida

```json
{
  "error": "InvalidParameters",
  "message": "Detalle del error"
}
```

## Escenarios

|  # | Escenario (descripción)                                                                                                | URL de ejemplo                                                                    |
| --:| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
|  1 | Petición un viernes a las 5:00 p.m. (COL) con `hours=1` → resultado esperado: lunes 9:00 a.m. (COL)                    | `http://localhost:3000/working-date?date=2025-07-04T22:00:00Z&hours=1`            |
|  2 | Petición un sábado a las 2:00 p.m. (COL) con `hours=1` → resultado esperado: lunes 9:00 a.m. (COL)                     | `http://localhost:3000/working-date?date=2025-07-05T19:00:00Z&hours=1`            |
|  3 | `days=1` y `hours=3` desde un martes a las 3:00 p.m. (COL) → resultado esperado: jueves 10:00 a.m. (COL)               | `http://localhost:3000/working-date?date=2025-07-01T20:00:00Z&days=1&hours=3`     |
|  4 | `days=1` desde un domingo a las 6:00 p.m. (COL) → resultado esperado: lunes 5:00 p.m. (COL)                            | `http://localhost:3000/working-date?date=2025-07-06T23:00:00Z&days=1`             |
|  5 | `hours=8` desde un día laboral a las 8:00 a.m. (COL) → resultado esperado: mismo día 5:00 p.m. (COL)                   | `http://localhost:3000/working-date?date=2025-07-01T13:00:00Z&hours=8`            |
|  6 | `days=1` desde un día laboral a las 8:00 a.m. (COL) → resultado esperado: siguiente día laboral 8:00 a.m. (COL)        | `http://localhost:3000/working-date?date=2025-07-01T13:00:00Z&days=1`             |
|  7 | `days=1` desde un día laboral a las 12:30 p.m. (COL) → resultado esperado: siguiente día laboral 12:00 p.m. (COL)      | `http://localhost:3000/working-date?date=2025-07-01T17:30:00Z&days=1`             |
|  8 | `hours=3` desde un día laboral a las 11:30 a.m. (COL) → resultado esperado: mismo día 3:30 p.m. (COL)                  | `http://localhost:3000/working-date?date=2025-07-02T04:30:00Z&hours=3`            |
|  9 | `date=2025-04-10T15:00:00.000Z&days=5&hours=4` (17 y 18 abril festivos) → resultado esperado: 2025-04-21T20:00:00.000Z | `http://localhost:3000/working-date?date=2025-04-10T15:00:00.000Z&days=5&hours=4` |

## 🧩 Stack Tecnológico

Este proyecto está construido con las siguientes tecnologías y herramientas:

- **Node.js**: Entorno de ejecución para JavaScript/TypeScript en el servidor.
- **Express**: Framework minimalista para crear la API REST.
- **TypeScript**: Tipado estático y robusto para mayor mantenibilidad y seguridad en el código.
- **date-fns** y **date-fns-tz**: Manejo preciso de fechas, horas y zonas horarias (America/Bogota → UTC).
- **ESLint**: Linter para mantener un código consistente y libre de errores.
- **Prettier**: Formateador de código para mantener un estilo uniforme.
- **Yarn**: Gestor de dependencias rápido y confiable.


