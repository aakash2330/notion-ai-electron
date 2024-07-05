"use server";

import { openaiActionType } from "@/types/types";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gpt-3.5-turbo",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false,
) {
  // Use OpenAI to get a response
  const response = await openai.createChatCompletion({
    temperature: temperature,
    model: model,
    messages: [
      {
        role: "system",
        content: system_prompt,
      },
      { role: "user", content: user_prompt.toString() },
    ],
  });

  let res: string =
    response.data.choices[0].message?.content?.replace(/'/g, '"') ?? "";

  // ensure that we don't replace away apostrophes in text
  res = res.replace(/(\w)"(\w)/g, "$1'$2");
  return res;
}

//final function that can be called to get chat gpt response in the form of json

async function gptChatFunction(userPrompt: string) {
  let questions: any;
  const reqArray = `You are a helpful AI that is able to generate a handful learning material in the form of one single paragraph withought breaklines and points that are required to learn about the topic - ${userPrompt} `;
  questions = await strict_output(
    "You are a helpful AI that is able to generate a handful of userful information about the topic provided",
    reqArray,
    {
      content:
        "important content about the topic with min length of 20 and max length of 30 words",
    },
  );
  return questions;
}

//main action that can be triggered by client

// export const gptAction = action({
//     args:{userPrompt:v.string()},
//     handler: async(ctx, args) => {
//       console.log(args.userPrompt)
//         const response = await gptChatFunction(args.userPrompt);
//         return response || "sorry , an error occured";
//     },
//   });

export const gptAction = async (args: openaiActionType) => {
  console.log(args.userPrompt);
  const response = await gptChatFunction(args.userPrompt);
  return response || "sorry , an error occured";
};
