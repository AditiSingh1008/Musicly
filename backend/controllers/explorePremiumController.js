// controllers/explorePremiumController.js

export const explorePremiumContent = (req, res) => {
  try {
    const user = req.user; // Assuming user is attached to req via auth middleware

    // Ensure the user exists and has a premium subscription
    if (!user || !user.isPremium) {
      return res.status(403).json({
        success: false,
        message: "Access to premium content is restricted. Please subscribe to a premium plan."
      });
    }

    // Sample premium content that can be customized or fetched from a database
    const premiumContent = {
      title: "🎵 Premium Music Library",
      message: "Enjoy your exclusive access to ad-free high-quality music.",
      resources: [
        { name: "Exclusive Playlist 1", url: "/premium/playlist-1" },
        { name: "Behind-the-Scenes Interviews", url: "/premium/interviews" },
        { name: "Downloadable Content", url: "/premium/downloads" },
      ]
    };

    // Respond with the premium content
    res.status(200).json({
      success: true,
      content: premiumContent
    });
  } catch (error) {
    console.error("Error fetching premium content:", error.message);
    
    // Return a more descriptive error for debugging in development mode
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,  // Send stack trace in dev mode
    });
  }
};
