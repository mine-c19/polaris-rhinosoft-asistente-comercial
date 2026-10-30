# Instrucciones del proyecto: Asistente Comercial RhinoSoft

## Qué es este proyecto
Página web de una sola vista con un chatbot. El frontend (HTML/CSS/JS sin frameworks) llama a un
backend Node.js con Express, y el backend conversa con un agente de Microsoft Foundry. Se
despliega en Azure App Service (Linux, Node 24 LTS).

Es un proyecto académico del curso AI-901. RhinoSoft es una empresa ficticia: una PyME mexicana que ya digitalizó internamente sus procesos (ventas, atención a clientes, inventario y nómina) y hoy vende esas soluciones, acompañadas con IA, a otras PyMEs. El asistente se llama Polaris: responde sobre los servicios, precios y condiciones de RhinoSoft usando solo su base de conocimiento (carpeta conocimiento/), cita la fuente y ayuda a redactar borradores de propuesta comercial.

## Alcance estricto (muy importante)
El asistente SOLO responde sobre RhinoSoft: sus servicios, precios y condiciones, atención a clientes, su proceso de transformación digital y borradores de propuestas comerciales. Si preguntan algo ajeno (clima, cultura general, matemáticas, cualquier otro tema), debe decir que no puede ayudar con eso porque está limitado a temas de RhinoSoft, sin intentar responder la pregunta ajena, y ofrecer lo que sí puede hacer.
Responde solo con lo que encuentra en la base de conocimiento (herramienta de búsqueda en archivos del agente). Si el dato no está, dice "No tengo ese dato en mi base de conocimiento".
Esta regla vive en las instrucciones del agente de Foundry (definidas en scripts/create-agent.js y publicadas en Foundry), no solo aquí.

## Entorno de desarrollo
- Windows 11 con PowerShell 7. Todos los comandos de terminal deben ser de PowerShell
  (variables $VAR, continuación de línea con backtick). Nunca comandos de bash.
- Node.js 24 LTS y npm. Nada de TypeScript ni bundlers.

## Stack y versiones
- Express 5, ES Modules ("type": "module"), async/await.
- SDK de Foundry: @azure/ai-projects 2.x (API "Foundry projects (new)").
  No uses @azure/ai-agents ni la API 1.x.
- Autenticación: DefaultAzureCredential de @azure/identity.
- Variables de entorno en local con `node --env-file-if-exists=.env` (sin dotenv).

## Variables de entorno (nombres únicos, no inventes otros)
- FOUNDRY_PROJECT_ENDPOINT
- FOUNDRY_AGENT_NAME
- FOUNDRY_MODEL_DEPLOYMENT
- FOUNDRY_VECTOR_STORE_ID (solo la usa scripts/create-agent.js para vincular la búsqueda en archivos)

## Arquitectura (no la cambies sin preguntar)
- server.js: sirve public/ en "/", expone POST /api/chat y GET /health, y escucha en
  process.env.PORT (App Service lo define).
- El navegador NUNCA habla directo con Foundry. Solo el backend.
- Conversación multi-turno: openai.conversations.create() y
  openai.responses.create({ conversation, input }, agentRef), donde
  agentRef = { body: { agent_reference: { name, type: "agent_reference" } } }.
  IMPORTANTE: la propiedad correcta es "agent_reference", no "agent" (la API responde 400
  "agent property is deprecated").
- Contrato de /api/chat (fijo, frontend y backend deben coincidir):
  - Petición: { "message": string, "conversation_id": string opcional }
  - Respuesta 200: { "reply": string, "conversation_id": string }
  - Errores: { "detail": string } con 422 (entrada inválida) o 502 (falla de Foundry).

## IA responsable
- Aviso de transparencia visible siempre: las respuestas las genera una IA y es una demostración
  académica, no asesoría profesional ni una empresa real.
- Nunca inventar precios, servicios ni datos de la empresa; si falta información, decirlo y
  preguntar, o marcar "pendiente de confirmar".
- Las propuestas comerciales se presentan como borrador sujeto a revisión humana.
- No se envían datos personales ni sensibles al modelo.
- Cada respuesta que use la base de conocimiento termina con una línea "Fuente: ..." con los documentos reales de conocimiento/ de los que viene. Nunca inventes fuentes.

## Inclusión y dispositivos
- Debe funcionar en escritorio y en celular (se prueba a 360 px de ancho).
- Voz: usar la Web Speech API del navegador para dictar la pregunta y escuchar la respuesta,
  sin servicios adicionales. Si el navegador no la soporta, ocultar los botones de voz y que el
  chat por texto siga funcionando.

## Seguridad
- Nunca escribas llaves, tokens ni endpoints reales en el código. Todo sale de variables de entorno.
- En Azure se usa identidad administrada (managed identity), no API keys.
- Valida la entrada (1 a 2000 caracteres) y responde 422 si no cumple.
- Si Foundry falla, responde 502 con un mensaje genérico; no filtres trazas.

## Estilo de código
- Comentarios en español neutro; nombres de variables en inglés.
- Cambios mínimos y enfocados: no reescribas archivos completos si basta editar.

## Cómo validar
- Local: npm run dev y abrir http://localhost:3000
- Salud: Invoke-RestMethod http://localhost:3000/health debe devolver status: ok
- Antes de desplegar, confirma que package.json incluye todo lo que se importa y que el script
  start es node server.js.
