// Function to blur images
const blurImages = () => {
	const imgs = document.getElementsByTagName("img");
	for (let img of imgs) {
	  img.style.filter = "blur(10px)";  // Apply a 10px blur to all images
	}
  };

  // Function to disable and hide video content completely
  const blockVideos = () => {
	const videos = document.getElementsByTagName("video");
	for (let video of videos) {
	  // Create a placeholder to cover the video
	  const placeholder = document.createElement("div");
	  placeholder.style.width = `${video.offsetWidth}px`;  // Match the video's width
	  placeholder.style.height = `${video.offsetHeight}px`;  // Match the video's height
	  placeholder.style.backgroundColor = "gray";  // Set a color or image for the placeholder
	  placeholder.style.pointerEvents = "none";  // Ensure the placeholder doesn't interact with the user
	  placeholder.style.position = "absolute";  // To ensure it covers the video exactly
	  placeholder.style.top = `${video.offsetTop}px`;
	  placeholder.style.left = `${video.offsetLeft}px`;

	  // Replace the video element with the placeholder
	  video.parentNode.replaceChild(placeholder, video);

	  // Disable the video controls if it's a video iframe or part of a web player
	  video.style.visibility = "hidden";  // Hide the video content immediately
	  video.style.height = "0px";  // Optional: Set height to 0px to remove any space taken by the video
	  video.style.width = "0px";  // Optional: Set width to 0px to remove any space taken by the video
	  video.style.pointerEvents = "none";  // Disable interaction with the video (can't click to play)
	}
  };

  // Initial execution
  blurImages();
  blockVideos();

  // Observe DOM for new images and videos (e.g., dynamically loaded content)
  const observer = new MutationObserver(() => {
	blurImages();
	blockVideos();
  });

  observer.observe(document.body, {
	childList: true,
	subtree: true
  });
