import { join } from "node:path";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import express from "express";

const requiredEnvironmentVariables = [
  "FOUNDRY_PROJECT_ENDPOINT",
  "FOUNDRY_AGENT_NAME",
];
const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (name) => !process.env[name]?.trim(),
);

if (missingEnvironmentVariables.length > 0) {
  console.error(
    `Faltan variables de entorno requeridas: ${missingEnvironmentVariables.join(", ")}.`,
  );
  process.exit(1);
}

const projectClient = new AIProjectClient(
  process.env.FOUNDRY_PROJECT_ENDPOINT,
  new DefaultAzureCredential(),
);
const openai = projectClient.getOpenAIClient();
const agentName = process.env.FOUNDRY_AGENT_NAME;
const app = express();

function passesLuhn(digits) {
  let sum = 0;
  const parity = digits.length % 2;

  for (let index = 0; index < digits.length; index += 1) {
    let digit = Number(digits[index]);

    if (index % 2 === parity) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
  }

  return sum % 10 === 0;
}

function containsPersonalData(message) {
  const emailPattern =
    /(?<![\p{L}\d._%+-])[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?![\p{L}\d.-])/iu;
  const curpPattern =
    /(?<![\p{L}\d])[A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|NE|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d(?![\p{L}\d])/iu;
  const rfcPattern =
    /(?<![\p{L}\d])[A-ZÑ]{4}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[A-Z0-9]{3}(?![\p{L}\d])/iu;

  if (emailPattern.test(message) || curpPattern.test(message) || rfcPattern.test(message)) {
    return true;
  }

  const numericCandidates =
    message.match(/(?<![\p{L}\d])\+?\d+(?:[ .-]\d+)*(?![\p{L}\d])/gu) ?? [];

  for (const candidate of numericCandidates) {
    const digits = candidate.replace(/\D/g, "");

    if (digits.length === 10 || (digits.length === 12 && digits.startsWith("52"))) {
      return true;
    }

    if (
      /^[\d -]+$/u.test(candidate) &&
      digits.length >= 13 &&
      digits.length <= 19 &&
      passesLuhn(digits)
    ) {
      return true;
    }
  }

  return false;
}

app.use((request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  next();
});
app.use(express.json({ limit: "10kb" }));
app.use(express.static(join(import.meta.dirname, "public")));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/chat", async (request, response) => {
  const body = request.body;

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return response.status(422).json({
      detail: "La solicitud debe incluir un mensaje de texto válido.",
    });
  }

  if (typeof body.message !== "string") {
    return response.status(422).json({
      detail: "El mensaje debe ser texto de 1 a 2000 caracteres.",
    });
  }

  const message = body.message.trim();

  if (message.length < 1 || message.length > 2000) {
    return response.status(422).json({
      detail: "El mensaje debe contener de 1 a 2000 caracteres.",
    });
  }

  let conversationId;
  if (body.conversation_id !== undefined) {
    if (
      typeof body.conversation_id !== "string" ||
      body.conversation_id.length > 200 ||
      body.conversation_id.trim().length === 0
    ) {
      return response.status(422).json({
        detail: "El identificador de conversación debe ser texto de hasta 200 caracteres.",
      });
    }

    conversationId = body.conversation_id.trim();
  }

  if (containsPersonalData(message)) {
    return response.status(422).json({
      detail:
        "Tu mensaje parece contener datos personales (correo, teléfono, tarjeta, CURP o RFC de persona física). Por tu privacidad no lo envié al asistente. Reescribe tu pregunta sin esos datos.",
    });
  }

  try {
    conversationId ??= (await openai.conversations.create()).id;

    const agentReference = {
      body: {
        agent_reference: {
          name: agentName,
          type: "agent_reference",
        },
      },
    };
    const result = await openai.responses.create(
      { conversation: conversationId, input: message },
      agentReference,
    );

    return response.json({
      reply: result.output_text,
      conversation_id: conversationId,
    });
  } catch {
    return response.status(502).json({
      detail: "No se pudo obtener respuesta del asistente. Intenta de nuevo.",
    });
  }
});

app.use((error, _request, response, next) => {
  if (error?.type === "entity.too.large") {
    return response.status(413).json({
      detail: "El cuerpo de la solicitud supera el límite de 10 KB.",
    });
  }

  if (error?.type === "entity.parse.failed") {
    return response.status(400).json({
      detail: "El cuerpo de la solicitud debe contener JSON válido.",
    });
  }

  return next(error);
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port);
