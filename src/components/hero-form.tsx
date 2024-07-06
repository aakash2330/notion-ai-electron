"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState } from "react";
import Link from "next/link";
import { formSchema, formType } from "@/types/types";
import { addPageToDatabase } from "@/actions/add-page.action";
import { gptAction } from "@/actions/openai.action";
import { getFinalSummary } from "@/actions/youtube.action";

export default function HeroForm() {
  // defining the form
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      notionKey: "",
      notionUrl: "",
    },
  });

  //  submit handler
  async function onSubmit(values: formType) {
    console.log("Form submitted");

    try {
      // if user already has database then add the page to it
      const databaseID = values.notionUrl.split(".so/")[1].split("?")[0];
      const youtubeData = await getFinalSummary({ userPrompt: values.topic });
      const gptData = await gptAction({ userPrompt: values.topic });
      console.log({ databaseID, youtubeData, gptData });
      addPageToDatabase({
        notionUrl: databaseID,
        content: gptData,
        topic: values.topic,
        trancriptSummary:
          youtubeData?.summary ?? "oops we couldn't generate a summary for you",
        videoId: youtubeData?.videoId,
        notionKey: values.notionKey,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        id="heroForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="Quantum Computing" {...field} />
              </FormControl>
              <FormDescription>What would you like to learn ?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notionKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input placeholder="XXXXXXXX" {...field} />
              </FormControl>
              <FormDescription>Your Notion Integration Key</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <>
          <FormField
            control={form.control}
            name="notionUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.notion.so/example-XXXX"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your Notion Database URL</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <br />
        </>
        <HoverCard>
          <HoverCardTrigger className="hover:underline cursor-pointer text-sm">
            Need help to integrate ?
          </HoverCardTrigger>
          <HoverCardContent className="flex text-xs">
            {"-->"}&nbsp;
            <p className="hover:underline cursor-pointer">
              <Link href="/help">Help Section</Link>
            </p>
          </HoverCardContent>
        </HoverCard>
        <br />
        <Button className="bg-[#c0fb50] w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
