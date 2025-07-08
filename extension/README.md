Content Censoring Tool

This tool replaces specific images and disables videos based on their URLs. You can apply this to all content or only to specified URLs.

How to Use

1. Set Up the Arrays

Define the images and videos to be replaced/disabled:

const imageUrlsToReplace = ["image1.jpg", "image2.jpg"];
const videoUrlsToDisable = ["video1.mp4", "video2.mp4"];
const replacementImageUrl = "https://example.com/placeholder.jpg"; // Image to replace

2. Control Behavior

Set applyToAllContent = true to apply to all images/videos, or false to apply only to the specified URLs.
const applyToAllContent = true;  // Apply to all content if true

3. Functions

Replace images with the specified replacementImageUrl.
Disable videos (mute, pause, replace with a placeholder).


replaceImages(imageUrlsToReplace, replacementImageUrl);
disableVideos(videoUrlsToDisable);

4. Dynamic Content

The tool uses a MutationObserver to automatically censor dynamically loaded content.

Example Usage

const imageUrlsToReplace = ["image1.jpg", "image2.jpg"];
const videoUrlsToDisable = ["video1.mp4", "video2.mp4"];
const replacementImageUrl = "https://example.com/placeholder.jpg";
const applyToAllContent = true;

replaceImages(imageUrlsToReplace, replacementImageUrl);
disableVideos(videoUrlsToDisable);
This tool works by matching the URLs of images and videos. Set applyToAllContent to true for a global effect or use the arrays to specify content.
