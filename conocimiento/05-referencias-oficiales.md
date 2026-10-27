# Referencias oficiales verificadas

> **Tipo de información: REAL, con fuente.** Cada dato de este documento se tomó de la fuente indicada y se consultó el **27 de octubre de 2026**. Donde la fuente no confirma algo, se indica. Las descripciones son resúmenes propios; para el texto exacto, consultar el enlace. Estos datos pueden cambiar con el tiempo.

## 1. Microsoft Foundry Agent Service
Fuente: Microsoft Learn — [What is Microsoft Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/overview) (página leída completa).
- Es una plataforma administrada para crear, desplegar y escalar agentes de IA.
- Un **prompt agent** se define solo con configuración: instrucciones, modelo y herramientas. Foundry lo ejecuta sin código de aplicación ni infraestructura que administrar.
- Las herramientas integradas incluyen búsqueda web, **file search**, intérprete de código y memoria; también se pueden agregar herramientas propias (funciones, OpenAPI y servidores MCP).
- Incluye versionado de agentes, identidad de Microsoft Entra, control de acceso por roles (RBAC) y filtros de contenido para ayudar a mitigar riesgos como la inyección de instrucciones.

## 2. File search en Foundry (búsqueda en documentos propios)
Fuente: Microsoft Learn — [File search tool for Microsoft Foundry agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/file-search).
- Los archivos se suben y se agregan a un **vector store**; al hacerlo se analizan, se dividen en fragmentos y se indexan para búsqueda por palabras clave y semántica.
- Cada vector store admite hasta 10,000 archivos y se puede asociar un vector store por agente.
- El agente responde con base en el contenido indexado. Los ejemplos de los SDK muestran anotaciones de cita de archivo en la respuesta (por ejemplo, `FileCitationMessageAnnotation` en el ejemplo de C#).

## 3. Microsoft Copilot Studio
Fuente: Microsoft Learn — [Copilot Studio overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio) (página leída completa).
- Es un estudio gráfico de bajo código para crear y administrar agentes de IA y flujos de trabajo.
- Un agente sigue las instrucciones que se le dan, usa las fuentes de conocimiento conectadas y herramientas para actuar.
- Puede atender a empleados y clientes en varios idiomas y publicarse en Microsoft Teams, Microsoft Copilot, sitios web y aplicaciones móviles, entre otros canales.

## 4. Power Automate
Fuente: Microsoft Learn — [Explore the Power Automate home page](https://learn.microsoft.com/en-us/power-automate/getting-started) (página leída completa).
- Ayuda a optimizar procesos de negocio y automatizar tareas repetitivas.
- Permite crear flujos automatizados entre aplicaciones y servicios, por ejemplo para sincronizar archivos, recibir notificaciones y recopilar datos.

## 5. Dynamics 365 Sales
Fuente: Microsoft Learn — [Welcome to Dynamics 365 Sales](https://learn.microsoft.com/en-us/dynamics365/sales/overview). Verificación: resumen de resultados de búsqueda de Microsoft Learn; la página no se leyó completa.
- Es la aplicación de CRM de Microsoft para equipos de ventas. Funciona sobre Microsoft Dataverse.
- Permite dar seguimiento a cuentas y contactos y llevar una oportunidad desde el prospecto hasta el pedido.
- Se integra con Outlook, Teams y SharePoint. Existen distintos niveles de licenciamiento (Enterprise, Premium y Professional, entre otras ofertas).

## 6. Dynamics 365 Business Central
Fuente: Microsoft Learn — [Business Central documentation](https://learn.microsoft.com/en-us/dynamics365/business-central/). Verificación: resumen de resultados de búsqueda de Microsoft Learn; la página no se leyó completa.
- Es una aplicación de gestión empresarial (ERP) para pequeñas y medianas organizaciones que conecta ventas, servicio, finanzas y operaciones.
- Cubre, entre otras áreas, inventario, órdenes de compra y procesamiento de pedidos.

## 7. Principios de IA responsable de Microsoft
Fuente: [Microsoft Responsible AI](https://www.microsoft.com/en-us/ai/responsible-ai) (página leída; solo enumera los nombres de los principios, sin definiciones).
1. Equidad
2. Confiabilidad y seguridad
3. Privacidad y seguridad
4. Transparencia
5. Responsabilidad (rendición de cuentas)
6. Inclusión

## 8. Marco de gestión de riesgos de IA del NIST (AI RMF)
Fuente: NIST — [AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework).
- Marco para gestionar riesgos de la IA para personas, organizaciones y sociedad. Su uso es **voluntario**.
- Se publicó el 26 de enero de 2023. En julio de 2024 se publicó un perfil para IA generativa.
- La página menciona los elementos Govern, Map, Measure y Manage, pero no los describe.

## 9. Principios de IA de la OCDE
Fuente: [OECD.AI — AI Principles](https://oecd.ai/en/ai-principles).
- Se adoptaron en mayo de 2019 y se actualizaron en mayo de 2024.
- Principios basados en valores: crecimiento inclusivo, desarrollo sostenible y bienestar; derechos humanos y valores democráticos (incluidas equidad y privacidad); transparencia y explicabilidad; solidez, seguridad y protección; y rendición de cuentas.
- Son orientativos, no una ley.

## 10. Protección de datos personales en México (particulares)
Fuentes: resultados de búsqueda que citan el Diario Oficial de la Federación — [EY México](https://www.ey.com/es_mx/technical/tax/boletines-fiscales/nueva-ley-federal-proteccion-datos-personal-posesion-particulares), [Garrigues](https://www.garrigues.com/es_ES/noticia/mexico-nueva-ley-federal-proteccion-datos-personales-posesion-particulares-introduce) y el portal de la [Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/ref/lfpdppp.htm). Verificación: resumen de búsqueda; no se leyó el texto completo de la ley.
- El 20 de marzo de 2025 se publicó en el DOF una **nueva Ley Federal de Protección de Datos Personales en Posesión de los Particulares**, que entró en vigor el 21 de marzo de 2025 y sustituye a la de 2010.
- Las funciones que tenía el INAI respecto de los particulares pasaron a la **Secretaría Anticorrupción y Buen Gobierno**.
- Es de cumplimiento **obligatorio** para los particulares que tratan datos personales.
- Una fuente indica una reforma posterior publicada el 14 de noviembre de 2025. No se verificó su contenido.
- Este documento no es asesoría legal: ante dudas, consultar el texto oficial o a un especialista.
