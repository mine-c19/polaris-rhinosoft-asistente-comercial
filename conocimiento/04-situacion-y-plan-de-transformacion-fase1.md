# RhinoSoft — Punto de partida y plan de transformación interna (Fase 1)

> **Cómo leer este documento:** describe la ruta que RhinoSoft siguió internamente para digitalizarse y adoptar IA. Es la base de la metodología que hoy ofrece a sus clientes. Los indicadores de la sección 7 son **metas del plan**, no resultados medidos.

> **Fuente:** Proyecto Final «Implementación de IA en RhinoSoft con Microsoft Copilot», Fase 1 del curso «Fundamentos de IA con Tecnologías Microsoft» (Infotec + CPFIA + Microsoft), elaborado por la autora del proyecto. Este documento resume ese trabajo.
> **Tipo de información:** el caso (RhinoSoft, sus procesos en papel y el plan) es **ficticio** y forma parte del ejercicio académico. Los datos del plan son los de la Fase 1; no se agregó nada nuevo.

## 1. Punto de partida de RhinoSoft (antes de su transformación)
RhinoSoft operaba sus procesos de forma manual y en papel en ventas, atención a clientes, control de inventario y nómina. No usaba herramientas digitales ni de IA. Tenía presupuesto limitado, un plazo de implementación de 6 meses y operaba en México.

Nivel de madurez digital de partida: **Nivel 1 (Inicial o Manual)**. El primer paso es construir una base digital sólida antes de introducir modelos de IA.

| Dimensión | Estado inicial | Nivel |
|---|---|---|
| Digitalización documental | Papel | Muy bajo |
| Gestión de clientes | Manual | Muy bajo |
| Analítica de datos | No disponible | Muy bajo |
| Automatización | No existe | Muy bajo |
| Inteligencia artificial | No existe | Muy bajo |
| Seguridad de información | Riesgo alto por manejo manual | Bajo |

## 2. Problemas detectados por área
| Área | Situación | Impacto | Oportunidad futura de IA |
|---|---|---|---|
| Ventas | Prospectos en papel, seguimiento manual, sin historial de clientes | Baja conversión, difícil pronosticar, dependencia de personas | Propuestas automáticas, análisis de prospectos, correos comerciales |
| Atención al cliente | Solicitudes por teléfono o correo, sin sistema de tickets | Respuestas lentas, clientes insatisfechos, difícil medir el servicio | Chatbot de preguntas frecuentes, clasificación de incidencias |
| Inventario | Registros manuales y conteos físicos | Inventario incorrecto, compras innecesarias, poca trazabilidad | Predicción de demanda, alertas de reposición |
| Nómina y RR. HH. | Control manual de incidencias, cálculos en hojas impresas, expedientes físicos | Errores, retrabajos, riesgos de cumplimiento | Extracción de documentos, asistente de consultas de personal |

## 3. Herramientas elegidas (Fase 2: sistemas mínimos, meses 2 a 4)
- **Gestión documental:** SharePoint Online + OneDrive.
- **CRM:** Dynamics 365 Sales.
- **Inventario:** Dynamics 365 Business Central.
- **Mesa de ayuda:** Microsoft Forms + Power Automate + SharePoint.
- **Automatización:** Power Automate (nuevo prospecto, alertas de inventario bajo, solicitudes de vacaciones, aprobaciones).

## 4. Inteligencia artificial (Fase 3, meses 4 a 6)
- Microsoft 365 Copilot: borradores comerciales, correos, resúmenes de reuniones.
- Copilot Studio: agente para consultas frecuentes (estado de ticket, políticas internas, información comercial).
- Microsoft Foundry: piloto controlado de clasificación documental, extracción de datos y búsqueda avanzada, con control de acceso, auditoría y supervisión humana.

## 5. Priorización
| Prioridad | Iniciativa |
|---|---|
| 1 | SharePoint + OneDrive |
| 2 | Dynamics 365 Sales |
| 3 | Business Central |
| 4 | Forms + Power Automate |
| 5 | Microsoft 365 Copilot |
| 6 | Copilot Studio |
| 7 | Microsoft Foundry |

## 6. Cronograma de 6 meses
| Mes | Objetivo | Resultado esperado |
|---|---|---|
| 1 | Diagnóstico y digitalización inicial | Procesos documentados y plataforma lista |
| 2 | Gestión documental y CRM | Ventas operando en Dynamics 365 Sales |
| 3 | Inventario y automatización | Inventario funcionando en Business Central |
| 4 | Mesa de ayuda digital | Atención al cliente digitalizada |
| 5 | Implementación de Copilot | IA operando en ventas y documentación |
| 6 | Copilot Studio y optimización | Agentes de IA funcionando y KPI estabilizados |

Durante el primer mes no se despliega IA: se crea la base digital, se limpian datos y se preparan Microsoft 365, SharePoint, Dynamics 365 y Power Platform.

## 7. Indicadores de éxito al cierre de los 6 meses
| Indicador | Situación inicial | Meta |
|---|---|---|
| Documentos digitalizados | 0 % | 95 – 100 % |
| Prospectos registrados en CRM | 0 % | 100 % |
| Tickets trazables | 0 % | 100 % |
| Inventario digitalizado | 0 % | 100 % |
| Flujos automatizados | 0 | 10 – 15 |
| Usuarios capacitados | 0 % | 100 % |
| Usuarios activos de Copilot | 0 % | más de 70 % |
| Tiempo de búsqueda documental | 15 – 30 min | menos de 1 min |
| Generación de propuestas comerciales | Horas | Minutos |

## 8. Riesgos principales y mitigación
| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Resistencia al cambio | Alta | Capacitación semanal |
| Mala calidad de datos | Alta | Depuración durante el mes 1 |
| Baja adopción del CRM | Media | Patrocinio de la Dirección |
| Sobrecarga operativa | Media | Implementación gradual |
| Uso incorrecto de IA | Media | Política de uso responsable |

## 9. Principio rector
Los beneficios más importantes al inicio no vienen de la IA avanzada, sino de eliminar el papel, reducir tareas manuales, centralizar la información y mejorar la trazabilidad. La IA se incorpora después, sobre información confiable y con supervisión humana.
