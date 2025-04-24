
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const cheerio = require('cheerio');
const { getTranscript } = require('youtube-transcript');
const { Client: NotionClient } = require('@notionhq/client');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const {scrape} = require('website-scraper');

const { YoutubeTranscript } = require('youtube-transcript');
// Initialize Notion client
const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    console.log(data.text);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
}

function extractTextFromTxt(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function extractTextFromRawText(text) {
  console.log(text);
  return text.trim();
}

async function extractTextFromDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


async function extractTextFromURL(url) {
    try {
        const options = {
            urls: ['http://nodejs.org/'],
            directory: '/path/to/save/'
          };
          
          // with async/await
          const result = await scrape(options);
          
          // with promise
          scrape(options).then((result) => {
            console.log(result);
          });
        //   console.log(result);
      // Temporary directory for scraped content
    //   const outputDir = path.join(__dirname, 'scraped_content');
      
    //   // Scrape the website
    //   console.log(`Navigating to: ${url}`);
    //   scrape({
    //     urls: [url],
    //     directory: outputDir,
    //     sources: [{ selector: 'html' }],
    //     request: {
    //       headers: {
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    //       }
    //     }
    //   });
      
    //   // Wait briefly to ensure file writing is complete
    //   await delay(1000);
      
    //   // Read the downloaded HTML file
    //   const htmlPath = path.join(outputDir, 'index.html');
    //   const html = await fs.readFile(htmlPath, 'utf-8');
      
    //   // Parse HTML with Cheerio
    //   const $ = cheerio.load(html);
      
    //   // Check for input elements
    //   let inputText = '';
    //   const inputs = $('input[type="text"], input[type="email"], input[type="search"], input[type="tel"], input[type="url"], input:not([type]), textarea');
    //   if (inputs.length > 0) {
    //     inputText = inputs
    //       .map((i, input) => {
    //         const $input = $(input);
    //         return `${$input.val() || ''} ${$input.attr('placeholder') || ''} ${$input.attr('name') || ''}`;
    //       })
    //       .get()
    //       .filter(text => text.trim() !== '')
    //       .join(' | ');
    //   }
      
    //   // If no inputs found, extract all visible text
    //   let resultText = inputText;
    //   if (!inputText) {
    //     resultText = $('body')
    //       .find('*:not(script):not(style)')
    //       .contents()
    //       .filter(function() {
    //         return this.type === 'text' && $(this).parent().css('display') !== 'none';
    //       })
    //       .map(function() {
    //         return $(this).text().trim();
    //       })
    //       .get()
    //       .filter(text => text !== '')
    //       .join(' ');
    //   }
      
    //   // Clean up scraped files
    //   await fs.rm(outputDir, { recursive: true, force: true });
      
    //   // Log result (truncate for console)
    //   console.log(`Extracted text: ${resultText}`);
      
    //   return resultText || '';
    } catch (error) {
      console.error('Error extracting text:', error.message);
      return `Error: ${error.message}`;
    }
  }
  async function extractTextFromYouTube(videoUrl) {
    try {
      console.log("VIDEOURL", videoUrl);
  
      let videoId = null;
  
      // Handle normal YouTube links
      if (videoUrl.includes("youtube.com")) {
        const url = new URL(videoUrl);
        videoId = url.searchParams.get("v");
      }
  
      // Handle youtu.be short links
      if (videoUrl.includes("youtu.be")) {
        const url = new URL(videoUrl);
        videoId = url.pathname.split("/")[1]; // gets 'FTdMJIxGEWA' from /FTdMJIxGEWA
      }
  
      if (!videoId) {
        console.log("VideoID not found");
        throw new Error("Invalid YouTube URL: No video ID found");
      }
  
      console.log(`Fetching transcript for video ID: ${videoId}`);
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      const text = transcript.map(t => t.text).join(" ");
  
      console.log(`Extracted text: ${text.slice(0, 300)}...`); // Trimmed log for readability
      return text;
    } catch (error) {
      console.error("Error extracting transcript:", error.message);
      return `Error: ${error.message}`;
    }
  }
  

async function extractTextFromNotionPage(pageId) {
  const blocks = await notion.blocks.children.list({ block_id: pageId });
  return blocks.results.map(block => {
    const type = block.type;
    return block[type]?.text?.[0]?.plain_text || '';
  }).join(' ');
}

module.exports = {
  extractTextFromPDF,
  extractTextFromTxt,
  extractTextFromRawText,
  extractTextFromDocx,
  extractTextFromURL,
  extractTextFromYouTube,
  extractTextFromNotionPage,
};
