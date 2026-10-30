# Polaris: asistente comercial de RhinoSoft con Microsoft Foundry

**Proyecto Integrador AI-901 · Fase 2 · Opción B** (implementar con Foundry el proyecto de la Fase 1: RhinoSoft)
**Curso:** Fundamentos de IA con Tecnologías Microsoft (Infotec + Microsoft)
**Autora:** Nelly Minerva Compañ Barradas · **Modalidad:** individual · **Entrega:** viernes 6 de noviembre de 2026

| | |
|---|---|
| **Prototipo en línea** | https://polaris-rhinosoft-2799.azurewebsites.net |
| **Repositorio** | https://github.com/mine-c19/polaris-rhinosoft-asistente-comercial |
| **Cómo usarlo** | Abrir la liga, sin registro ni inicio de sesión. Escribir o dictar una pregunta (por ejemplo: «¿Qué servicios ofrece RhinoSoft y cuánto cuesta el diagnóstico?») |

> **Aviso:** RhinoSoft es una empresa **ficticia** del ejercicio académico. Los servicios, precios y condiciones de la base de conocimiento son supuestos de demostración, y las referencias a tecnología y leyes de México provienen de fuentes oficiales citadas en el documento `conocimiento/05-referencias-oficiales.md`.

---

## 1. El problema y la solución

### El problema
En la Fase 1, RhinoSoft partía de procesos en papel: prospectos sin seguimiento, atención por teléfono o correo sin historial y propuestas comerciales que tomaban horas. Ya digitalizada, RhinoSoft vende a otras PyMEs esa misma ruta (diagnóstico, digitalización documental, CRM, inventario, mesa de ayuda, agentes de IA y adopción de Copilot). Quien llega a conocer la oferta repite las mismas preguntas (qué incluye, cuánto cuesta, cuánto tarda, cómo se protegen sus datos) y cada respuesta o propuesta depende de que alguien del equipo comercial la redacte.

### La solución
**Polaris** es un asistente comercial web, hecho con un agente de Microsoft Foundry, que:

- **Responde sobre servicios, precios y condiciones** usando únicamente una base de conocimiento documentada, e **indica de qué documento viene cada respuesta**.
- **Redacta borradores de propuesta** a partir de una plantilla, siempre sujetos a revisión humana (la Dirección Comercial los aprueba).
- **Rechaza lo que no es de RhinoSoft** y **no recibe datos personales**.
- Se puede usar **escribiendo o hablando**, desde computadora o celular.

| Necesidad | Cómo la atiende Polaris |
|---|---|
| Responder rápido las preguntas repetidas | El agente consulta la base de conocimiento y contesta en segundos |
| Que todos reciban la misma información | Una sola lista de precios y condiciones para cualquier empresa |
| Confiar en la respuesta | Cada respuesta cita su fuente; si no hay dato, dice «No tengo ese dato» |
| Agilizar las propuestas | Genera un borrador con la plantilla; una persona lo revisa antes de enviarse |
| Proteger a quien pregunta | Un filtro local detiene correos, teléfonos, tarjetas, CURP y RFC antes de llegar al modelo |

No se presentan resultados medidos de ahorro de tiempo: no se midieron. Las metas del plan de transformación de la Fase 1 se tratan como metas, no como logros.

---

## 2. Arquitectura

```mermaid
flowchart LR
    U[Persona usuaria<br/>navegador o celular] -->|HTTPS| W[Azure App Service<br/>Node 24 + Express]
    W -->|identidad administrada<br/>rol Foundry User| F[Proyecto de Microsoft Foundry<br/>rhinosoft-agente-ia]
    F --> A[Agente asistente-rhinosoft<br/>modelo gpt-5-mini]
    A --> K[(Búsqueda en archivos<br/>6 documentos de conocimiento)]
    A -->|respuesta con Fuente| W
    W --> U
```

| Capa | Tecnología |
|---|---|
| Interfaz | HTML, CSS y JavaScript sin frameworks; Web Speech API del navegador (dictado y lectura en voz alta) |
| Servidor | Node.js 24 + Express 5. Valida el mensaje, aplica el filtro de datos personales y llama al agente |
| Agente | Microsoft Foundry · agente `asistente-rhinosoft` · modelo `gpt-5-mini` · herramienta «Búsqueda de archivos» sobre un almacén vectorial |
| Hospedaje | Azure App Service (Linux, plan B1, West US) |
| Seguridad | Sin claves en el código: `DefaultAzureCredential` con **identidad administrada** y rol **Foundry User** limitado al recurso de Foundry |

---

## 3. Cómo se construyó

El proyecto se construyó con **GitHub Copilot en VS Code** usando un «arnés» de agentes personalizados, siguiendo lo visto en clase (Clase 13): instrucciones generales, instrucciones por capa y tres agentes con roles distintos.

### 3.1 Modelo y proyecto en Foundry
Se creó el proyecto `rhinosoft-agente-ia` en la región West US y se implementó el modelo `gpt-5-mini`.

![Modelo gpt-5-mini implementado en Foundry](docs/img/01-modelo-gpt-5-mini-implementado.png)

### 3.2 Arnés de agentes en Copilot
En `.github/` se definieron `copilot-instructions.md`, instrucciones de backend y frontend y tres agentes: **Arquitecto** (solo planifica), **Constructor** (construye paso a paso con validación) y **Desplegador** (despliega en Azure con confirmación escrita antes de cada cambio).

![Agentes e instrucciones de Copilot](docs/img/02-agentes-e-instrucciones-de-copilot.png)

![Copilot lista los tres agentes](docs/img/03-copilot-lista-los-tres-agentes.png)

### 3.3 Plan del Arquitecto
El Arquitecto propuso un plan por pasos (agente, backend, interfaz, pruebas, validación y riesgos), que se ajustó antes de aprobarlo.

![Plan del Arquitecto ajustado](docs/img/04-plan-del-arquitecto-ajustado.png)

### 3.4 Agente y base de conocimiento
Se creó el agente `asistente-rhinosoft` y se cargaron seis documentos Markdown de la carpeta [`conocimiento/`](conocimiento/): perfil y catálogo, precios y condiciones, preguntas frecuentes, situación y plan de la Fase 1, referencias oficiales y plantilla de propuesta. Se agregó la herramienta de **búsqueda en archivos** y se redactaron instrucciones que obligan a responder solo con esa base, a citar la fuente y a decir «No tengo ese dato» cuando no está.

![Agente en Foundry](docs/img/05-agente-en-foundry.png)

![Base de conocimiento cargada](docs/img/06-base-de-conocimiento-cargada.png)

![Instrucciones del agente](docs/img/07-instrucciones-del-agente-v3.png)

![Prueba de servicios y precios con fuentes](docs/img/08-prueba-servicios-y-precios-con-fuentes.png)

### 3.5 Servidor y pruebas locales
El servidor (`server.js`) expone `/health` y `/api/chat`, valida el mensaje (1 a 2000 caracteres) y detiene localmente los datos personales antes de llamar a Foundry.

![Pruebas locales: salud, error 422 y filtro de datos personales](docs/img/09-pruebas-locales-health-422-y-filtro.png)

### 3.6 Interfaz de Polaris
Diseño propio en violeta, lila y turquesa, con aviso permanente de transparencia, preguntas sugeridas, etiquetas de fuente, botones de voz y secciones «¿Qué sabe Polaris?» e «IA responsable en Polaris».

![Diseño de Polaris](docs/img/10-diseno-de-polaris.png)

![Respuesta con etiquetas de fuentes](docs/img/11-respuesta-con-etiquetas-de-fuentes.png)

### 3.7 Despliegue en Azure
Con el agente Desplegador, y confirmando cada comando: se registró el proveedor `Microsoft.Web`, se creó el plan B1 y la web `polaris-rhinosoft-2799`, se configuraron las variables de conexión con Foundry, se activó la identidad administrada con el rol **Foundry User** y se subió el código (7 archivos, sin `.env` ni `node_modules`).

![Plan y web app creados](docs/img/12-plan-y-web-app-creados.png)

![Identidad, rol y código](docs/img/13-identidad-rol-y-codigo.png)

![Redespliegue de la versión final](docs/img/14-redespliegue.png)

![Salud del servicio en Azure](docs/img/15-health-en-azure.png)

---

## 4. Prototipo en producción

Polaris funcionando en Azure, accesible por liga y sin inicio de sesión:

![Polaris en Azure](docs/img/16-polaris-en-azure.png)

![Respuesta con fuentes en Azure](docs/img/17-respuesta-en-azure-con-fuentes.png)

---

## 5. Los seis principios de IA responsable en el prototipo

| Principio | Cómo se aplica en Polaris | Evidencia |
|---|---|---|
| **Equidad** | Todas las empresas reciben la misma lista de precios, descuentos y tiempos de respuesta, sin importar ciudad o tamaño. El agente mantiene ese trato. | Imagen 18 |
| **Confiabilidad y seguridad** | Responde solo con la base de conocimiento; si no tiene el dato lo dice. Rechaza temas ajenos a RhinoSoft e ignora instrucciones para cambiar sus reglas. La interfaz solo usa `textContent` (sin `innerHTML`) y el servidor envía cabeceras de seguridad. | Imágenes 08 y 19 |
| **Privacidad y seguridad** | El servidor bloquea correos, teléfonos, tarjetas (con validación Luhn), CURP y RFC **antes** de enviarlos a Foundry; no registra los mensajes; no hay claves en el código (identidad administrada); la interfaz pide no escribir datos personales. | Imágenes 09 y 19 |
| **Inclusión** | Funciona desde el celular (probado en 360 px y en un teléfono real), permite **dictar** la pregunta y **escuchar** la respuesta, usa colores legibles sobre fondos claros y respeta la preferencia de movimiento reducido del sistema. | Imágenes 20a, 20b, 20c y 21 |
| **Transparencia** | Aviso permanente de que es una IA de demostración con datos ficticios; cada respuesta indica **de qué documento viene**; los precios se marcan como referenciales; la sección «IA responsable en Polaris» lo explica. | Imágenes 17 y 22 |
| **Responsabilidad** | Las propuestas son **borradores sujetos a revisión humana**: la Dirección Comercial los aprueba antes de enviarse. La interfaz lo declara y el agente lo repite. | Imágenes 17 y 22 |

### Equidad
![Misma lista de precios para una empresa pequeña de Mérida](docs/img/18-equidad-empresa-pequena-merida.png)

### Confiabilidad, seguridad y privacidad
Rechazo de un tema ajeno (número de Avogadro) y bloqueo de un correo antes de llegar al modelo. El correo de la captura se ocultó con «[correo oculto]».

![Tema ajeno y datos personales](docs/img/19-tema-ajeno-y-datos-personales.png)

### Inclusión: celular y voz
![Celular: inicio](docs/img/20a-celular-inicio.jpeg)
![Celular: respuesta](docs/img/20b-celular-respuesta-servicios.jpeg)
![Celular: fuentes y entrada de mensaje](docs/img/20c-celular-fuentes-y-entrada.jpeg)

![Dictado por voz y lectura en voz alta](docs/img/21-dictado-por-voz-y-lectura.png)

### Transparencia y responsabilidad
![Sección «IA responsable en Polaris»](docs/img/22-seccion-ia-responsable-en-polaris.png)

---

## 6. Uso de IA en la elaboración

El brief permite apoyarse en IA. Para ser transparente sobre quién hizo qué:

| Tarea | Herramienta |
|---|---|
| Plan, código del servidor y de la interfaz, comandos de despliegue en Azure | **GitHub Copilot** en VS Code, con los agentes Arquitecto, Constructor y Desplegador |
| Agente, modelo, búsqueda en archivos y supervisión | **Microsoft Foundry** |
| Hospedaje | **Azure App Service** |
| Apoyo conversacional: guía y borradores de la base de conocimiento, de las instrucciones del agente y de este reporte | **Claude** (Anthropic). Yo ejecuté cada paso, tomé las decisiones y verifiqué los resultados |

Los datos de RhinoSoft de la base de conocimiento son ficticios; las referencias legales y tecnológicas se contrastaron con fuentes oficiales.

---

## 7. Limitaciones y siguientes pasos

- **Datos ficticios:** servicios, precios y condiciones son un supuesto de demostración; no hay resultados medidos.
- **Alcance:** la base de conocimiento tiene seis documentos; fuera de ellos Polaris dice que no tiene el dato.
- **Sin inicio de sesión ni base de datos:** es un prototipo; no guarda conversaciones ni solicitudes reales.
- **Propuestas:** son borradores; una persona debe revisarlas.
- **Vigencia:** la web corre con el crédito de la cuenta de estudiante de Azure y se dará de baja después de la revisión.
- **Siguientes pasos posibles:** red teaming del agente en Foundry, evaluación de calidad con casos de prueba, registro de solicitudes con datos simulados y enlace con el CRM.

---

## Estructura del repositorio

```
├── README.md                  Presentación del proyecto
├── REPORTE.md                 Este documento
├── server.js                  Servidor Express
├── public/                    Interfaz (HTML, CSS, JS)
├── conocimiento/              Base de conocimiento (6 documentos Markdown)
├── scripts/create-agent.js    Creación del agente en Foundry
├── .github/                   Instrucciones y agentes de Copilot
└── docs/img/                  Capturas de este reporte
```
