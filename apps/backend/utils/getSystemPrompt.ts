import { prismaClient } from "../../../packages/db";


/**
 * Aggregates all content from the sources of a specific bot into a single string
 * @param botId The ID of the bot to aggregate content for
 * @returns A promise resolving to a string containing all the aggregated content
 */
export async function getSystemPrompt(botId: string): Promise<string> {
  // Initialize Prisma client
  
  try {
    // Find the bot to ensure it exists
    const bot = await prismaClient.bot.findUnique({
      where: { id: botId },
      include: {
        sources: true
      }
    });

    if (!bot) {
      console.log("BOT NO FOUND");
      // throw new Error(`Bot with ID '${botId}' not found`);
      return ;
    }

    // Extract content from all sources
    const allContent = bot.sources.map(source => {
      return `Source (${source.type}): ${source.content}`;
    });

    // Join all content with separators
    const aggregatedContent = allContent.join('\n\n----- Next Source -----\n\n');

   const customSystemPrompt = 
      `You are a helpful and intelligent assistant trained on users' data, including their documents, conversations, preferences, and history. ` +
      `Based on this knowledge, respond to the following query as accurately and contextually as possible. ` +
      `If the information is not available in the data, admit it clearly. Always prioritize personalized and concise replies.\n\n`;

    return `${customSystemPrompt}${aggregatedContent}`;
  } catch (error) {
    console.error(`Error aggregating content for bot ${botId}:`, error);
    throw error;
  } finally {
    // Disconnect from the database
    console.log("DONE");
  }
}