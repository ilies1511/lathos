// Flag to control whether to apply to all images/videos (set to true to apply to everything)
const applyToAllContent = false;  // Set this to true to apply to all content, false to apply only to specified URLs

// Function to replace images (if the flag is true, it will apply to all images)
const replaceImages = (imageUrlsToReplace, replacementImageUrl) => {
  const imgs = document.getElementsByTagName("img");
  for (let img of imgs) {
    // If applyToAllContent is true, replace all images
    if (applyToAllContent || imageUrlsToReplace.includes(img.src)) {
      img.src = replacementImageUrl;  // Replace the image source with the custom image URL
      img.style.filter = "none"; // In case there's any residual filter, remove it
    }
  }
};

// Function to disable videos (if the flag is true, it will apply to all videos)
const disableVideos = (videoUrlsToDisable) => {
  const videos = document.getElementsByTagName("video");
  for (let video of videos) {
    // If applyToAllContent is true, disable all videos
    if (applyToAllContent || videoUrlsToDisable.includes(video.src)) {
      // Mute and pause the video
      video.muted = true;
      video.pause();

      // Create a placeholder to replace the video
      const placeholder = document.createElement("div");
      placeholder.style.width = `${video.offsetWidth}px`;  // Match the video's width
      placeholder.style.height = `${video.offsetHeight}px`;  // Match the video's height
      placeholder.style.backgroundColor = "black";  // Placeholder color
      placeholder.style.pointerEvents = "none";  // Ensure no interaction
      placeholder.style.position = "absolute";  // To ensure it covers the video exactly
      placeholder.style.top = `${video.offsetTop}px`;
      placeholder.style.left = `${video.offsetLeft}px`;

      // Replace the video element with the placeholder
      video.parentNode.replaceChild(placeholder, video);

      // Remove video controls and prevent interactions
      video.removeAttribute("controls");
      video.style.pointerEvents = "none";  // Disable interaction with the video

      // Disable the thumbnail previews on the timeline
      const timelineThumbnails = document.querySelectorAll('.ytp-hover-progress');
      timelineThumbnails.forEach(thumbnail => {
        thumbnail.style.display = "none";  // Hide the thumbnail previews
      });
    }
  }
};

// Example of how your team can call this with their arrays
const imageUrlsToReplace = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg"
];

const videoUrlsToDisable = [
  "https://example.com/video1.mp4",
  "https://example.com/video2.mp4"
];

// The image URL that will replace the censored images
const replacementImageUrl = "https://png.pngtree.com/png-clipart/20230810/original/pngtree-red-grunge-censored-word-rubber-stamp-sign-picture-image_7848088.png";

// Initial execution (pass the arrays of URLs to replace or disable content)
replaceImages(imageUrlsToReplace, replacementImageUrl);
disableVideos(videoUrlsToDisable);

// Observe DOM for new images and videos (e.g., dynamically loaded content)
const observer = new MutationObserver(() => {
  replaceImages(imageUrlsToReplace, replacementImageUrl);
  disableVideos(videoUrlsToDisable);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
