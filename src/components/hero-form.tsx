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

      const { data: youtubeData } = await fetchYoutubeData({
        userPrompt: values.topic,
      });

      const { data: gptData } = await fetchGptData({
        userPrompt: values.topic,
      });
      console.log({ databaseID, youtubeData, gptData });

      // Example of using the function
      addPage({
        notionUrl: databaseID,
        content: gptData,
        topic: values.topic,
        trancriptSummary:
          youtubeData?.summary ?? "oops we couldn't generate a summary for you",
        videoId: youtubeData?.videoId,
        notionKey: values.notionKey,
      }).then((data) => {
        console.log("Page addition result:", data);
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

async function fetchYoutubeData(args: any) {
  try {
    const response = await fetch("http://localhost:3001/api/youtube", {
      method: "POST", // Set the request method
      headers: {
        "Content-Type": "application/json", // Indicate JSON data format
      },
      body: JSON.stringify(args), // Send the arguments in the request body
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    // Parse the JSON response
    const data = await response.json();
    console.log(data);

    // Handle the response data as needed
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null }; // Return null data in case of an error
  }
}

async function fetchGptData(args: any) {
  try {
    const response = await fetch("http://localhost:3001/api/openai", {
      method: "POST", // Specify the POST method
      headers: {
        "Content-Type": "application/json", // Ensure the request body is JSON
      },
      body: JSON.stringify(args), // Convert the args object to a JSON string
    });

    // Check if the response status is OK
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    // Parse the response body as JSON
    const data = await response.json();
    console.log(data);

    // Return the received data
    return data;
  } catch (error) {
    console.error("Error fetching GPT data:", error);
    return { data: false }; // Return false data in case of an error
  }
}

async function addPage(args: any) {
  try {
    const response = await fetch("http://localhost:3001/api/addpage", {
      method: "POST", // Specify the POST method
      headers: {
        "Content-Type": "application/json", // Ensure the request body is JSON
      },
      body: JSON.stringify(args), // Convert the args object to a JSON string
    });

    // Check if the response status is OK
    if (!response.ok) {
      throw new Error("Failed to add page");
    }

    // Parse the response as JSON
    const data = await response.json();
    console.log(data);

    // Return the result, indicating success or failure
    return data;
  } catch (error) {
    console.error("Error adding page:", error);
    return { data: null }; // Return null in case of an error
  }
}
