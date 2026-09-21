import type { Env } from "../env";
import { getMeliTokens, listQuestions, upsertQuestion } from "../db";
import { meliJson } from "./client";

export async function syncQuestionsFromMeli(env: Env, tenantId: string) {
  const tokens = await getMeliTokens(env.DB, tenantId);
  if (!tokens) return [];

  const data = await meliJson<{ questions?: Array<Record<string, unknown>> }>(
    env,
    tenantId,
    `/questions/search?seller_id=${tokens.user_id}&api_version=4&limit=50`
  );

  for (const question of data.questions ?? []) {
    await upsertQuestion(env.DB, tenantId, question);
  }
  return listQuestions(env.DB, tenantId);
}

export async function answerQuestion(
  env: Env,
  tenantId: string,
  questionId: number,
  text: string
) {
  await meliJson(env, tenantId, "/answers", {
    method: "POST",
    body: JSON.stringify({ question_id: questionId, text }),
  });

  const question = await meliJson<Record<string, unknown>>(
    env,
    tenantId,
    `/questions/${questionId}?api_version=4`
  );
  await upsertQuestion(env.DB, tenantId, question);
  return question;
}

export async function getCachedQuestions(env: Env, tenantId: string) {
  return listQuestions(env.DB, tenantId);
}
