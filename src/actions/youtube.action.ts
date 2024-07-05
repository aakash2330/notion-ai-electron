"use server";

import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import { strict_output } from "./openai.action";

const SearchYoutubeAction = async (searchQuery: string) => {
  searchQuery = encodeURIComponent(searchQuery);
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${`${process.env.YT_V3_KEY}`}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5&relevanceLanguage=en`,
  );
  if (!data) {
    console.log("youtube fail");
    return null;
  }
  if (data.items[0] == undefined) {
    console.log("youtube fail");
    return null;
  }
  console.log(data.items[0].id.videoId);
  return data.items[0].id.videoId;
};

const getTranscriptFromVideoId = async (videoId: string) => {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
      //@ts-ignore
      country: "EN",
    });
    let transcript = "";
    for (let t of transcript_arr) {
      transcript += t.text + " ";
    }
    return transcript.replaceAll("\n", "");
  } catch (error) {
    return "";
  }
};

export const summariseTranscript = async (transcript: string) => {
  let maxLength = 500;
  transcript = transcript.split(" ").slice(0, maxLength).join(" ");
  const summary = await strict_output(
    "You are an AI capable of extracting out useful information from a youtube transcript , only focusing on the main topic and the useful points only",
    `summarise the important points out of the transcript provided in minimum 200 words and less than 300 words and do not talk of the sponsors or that the summary is of a transcript or anything unrelated to the main topic also make sure that the content you generate is in the form of one single paragraph withought breaklines and points that are required to learn about the topic,
       also do not introduce what the summary is about. tranform this trancript in such a way that it doesnt seem like it is extracted out of youtube , but rather
       wikipedia. 
        \n` + transcript,
    { summary: "summary of the transcript" },
  );

  return summary;
};

export async function getFinalSummary(args: { userPrompt: string }) {
  try {
    const videoId = await SearchYoutubeAction(args.userPrompt);
    const trancript = await getTranscriptFromVideoId(videoId);
    const summary = await summariseTranscript(trancript);
    return { summary, videoId };
  } catch (error) {
    console.log(error);
  }
}
