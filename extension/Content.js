// Function to blur images based on the provided array of URLs
const blurImages = (imageUrlsToBlur) => {
	const imgs = document.getElementsByTagName("img");
	for (let img of imgs) {
	  // Check if the image's URL is in the array provided by the team
	  if (imageUrlsToBlur.includes(img.src)) {
		img.style.filter = "blur(10px)";  // Apply blur to the specific image
	  }
	}
  };

  // Function to disable videos based on the provided array of URLs
  const disableVideos = (videoUrlsToDisable) => {
	const videos = document.getElementsByTagName("video");
	for (let video of videos) {
	  // Check if the video's URL is in the array provided by the team
	  if (videoUrlsToDisable.includes(video.src)) {
		// Mute and pause the video
		video.muted = true;
		video.pause();

		// Create a placeholder to replace the video
		const placeholder = document.createElement("div");
		placeholder.style.width = `${video.offsetWidth}px`;  // Match the video's width
		placeholder.style.height = `${video.offsetHeight}px`;  // Match the video's height
		placeholder.style.backgroundColor = "gray";  // Placeholder color
		placeholder.style.pointerEvents = "none";  // Ensure no interaction
		placeholder.style.position = "absolute";  // To cover the video exactly
		placeholder.style.top = `${video.offsetTop}px`;
		placeholder.style.left = `${video.offsetLeft}px`;

		// Replace the video element with the placeholder
		video.parentNode.replaceChild(placeholder, video);

		// Remove video controls and prevent interactions
		video.removeAttribute("controls");
		video.style.pointerEvents = "none";  // Disable interaction with the video
	  }
	}
  };

  // Example of how the team can call this with their arrays
  const imageUrlsToBlur = [
	"https://example.com/image1.jpg",
	"https://example.com/image2.jpg"
  ];

  const videoUrlsToDisable = [
	"https://example.com/video1.mp4",
	"https://example.com/video2.mp4"
  ];

  // Initial execution (pass the arrays of URLs to blur or disable content)
  blurImages(imageUrlsToBlur);
  disableVideos(videoUrlsToDisable);

  // Observe DOM for new content (e.g., dynamically loaded images/videos)
  const observer = new MutationObserver(() => {
	blurImages(imageUrlsToBlur);
	disableVideos(videoUrlsToDisable);
  });

  observer.observe(document.body, {
	childList: true,
	subtree: true
  });
