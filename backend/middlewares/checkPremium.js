// middleware/checkPremium.js
const checkPremium = (req, res, next) => {
  const user = req.user; // Should be populated by auth middleware

  if (!user || !user.isPremium) {
    return res.status(403).json({
      message: "You must have a premium account to access this feature.",
    });
  }

  next(); // User is premium, proceed to next middleware or controller
};

export default checkPremium;
